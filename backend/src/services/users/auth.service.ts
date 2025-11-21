import { compare, hash, genSalt } from "bcryptjs";
import * as jwt from "../../utils/jwt";
import * as rtModel from "../../models/refreshToken.model";
import { pool } from "../../config/DB";
import { BadRequestError } from "../../errors/BadRequestError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

export async function signupBusinessService({
  businessName,
  adminName,
  adminEmail,
  password,
}: {
  businessName: string;
  adminName: string;
  adminEmail: string;
  password: string;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: existingUser } = await client.query(
      "SELECT 1 FROM users WHERE email = $1",
      [adminEmail]
    );

    if (existingUser.length > 0) {
      throw new BadRequestError("Email already in use");
    }

    const businessResult = await client.query(
      "INSERT INTO businesses (name, created_at) VALUES ($1, NOW()) RETURNING id",
      [businessName]
    );

    const businessId = businessResult.rows[0].id;

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, business_id, status, role_id, created_at)
       VALUES ($1, $2, $3, $4, 'active', $5, NOW())
       RETURNING id, email, name, business_id, role_id`,
      [adminName, adminEmail, hashedPassword, businessId, 1]
    );

    const createdUser = userResult.rows[0];

    await client.query(
      "UPDATE businesses SET owner_id = $1 WHERE id = $2",
      [createdUser.id, businessId]
    );

    await client.query("COMMIT");

    const payload = {
      userId: createdUser.id.toString(),
      email: createdUser.email,
      business_id: createdUser.business_id,
      role_id: createdUser.role_id,
    };

    const accessToken = jwt.generateAccessToken(payload);
    const refreshToken = jwt.generateRefreshToken(payload);

    await rtModel.saveRefreshToken(createdUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        business_id: createdUser.business_id,
        role_id: createdUser.role_id,
      },
      business: {
        id: businessId,
        name: businessName,
      },
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function loginService(email: string, password: string) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND status = 'active'",
    [email]
  );

  const user = rows[0];
  if (!user) throw new UnauthorizedError("Invalid credentials");

  const match = await compare(password, user.password_hash);
  if (!match) throw new UnauthorizedError("Invalid credentials");

  const payload = {
    userId: user.id.toString(),
    email: user.email,
    business_id: user.business_id || 1,
    role_id: user.role_id || 3,
  };

  const accessToken = jwt.generateAccessToken(payload);
  const refreshToken = jwt.generateRefreshToken(payload);

  await rtModel.saveRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      business_id: user.business_id,
      role_id: user.role_id,
    },
  };
}

export async function refreshTokenService(token: string) {
  try {
    const payload = jwt.verifyRefreshToken(token);
    console.log('[REFRESH] JWT signature valid for user:', payload.userId);

    const found = await rtModel.findRefreshToken(token);
    console.log('[REFRESH] Token found in DB:', found.rows.length > 0);

    if (found.rows.length === 0) {
      console.warn('[REFRESH] Token not found in database');
      throw new UnauthorizedError("Token has been revoked or logged out");
    }

    const newAccessToken = jwt.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      business_id: payload.business_id,
      role_id: payload.role_id,
    });

    console.log('[REFRESH] New access token generated for user:', payload.userId);
    return { accessToken: newAccessToken };
  } catch (err) {
    console.error('[REFRESH] Error:', err instanceof Error ? err.message : String(err));
    throw err;
  }
}

export async function logoutService(token: string) {
  await rtModel.deleteRefreshToken(token);
}

export async function completeUserRegistration(
  invite_token: string,
  name: string,
  password: string
) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE invite_token = $1 AND status = 'pending'",
    [invite_token]
  );

  if (rows.length === 0) {
    throw new UnauthorizedError("Token de invitación inválido o ya utilizado");
  }

  const user = rows[0];

  const salt = await genSalt(10);
  const hashed = await hash(password, salt);

  const updateQuery = `
    UPDATE users
    SET name = $1, password_hash = $2, status = 'active', activated_at = NOW(), invite_token = NULL
    WHERE invite_token = $3
    RETURNING id, email, name, business_id, role_id, status
  `;

  const { rows: updatedUser } = await pool.query(updateQuery, [
    name,
    hashed,
    invite_token,
  ]);

  const completedUser = updatedUser[0];

  const payload = {
    userId: completedUser.id.toString(),
    email: completedUser.email,
    business_id: completedUser.business_id,
    role_id: completedUser.role_id,
  };

  const accessToken = jwt.generateAccessToken(payload);
  const refreshToken = jwt.generateRefreshToken(payload);

  await rtModel.saveRefreshToken(completedUser.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: completedUser.id,
      name: completedUser.name,
      email: completedUser.email,
      business_id: completedUser.business_id,
      role_id: completedUser.role_id,
    },
  };
}

export async function registerService(
  email: string,
  password: string,
  name: string
) {
  throw new BadRequestError(
    "This endpoint is deprecated. Use /api/auth/signup-business instead"
  );
}
