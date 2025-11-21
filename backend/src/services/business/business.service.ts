import {
  createBusiness,
  updateBusinessOwner,
  getBusinessById,
  getAllBusinesses
} from '../../models/business.model';
import { createUser } from '../../models/user.model';
import { hash, genSalt } from "bcryptjs";
import * as jwt from "../../utils/jwt";
import { BadRequestError } from '../../errors/BadRequestError';
import { logger } from '../../utils/logger';

export const signupBusiness = async (businessData: {
  name: string;
  admin_name: string;
  admin_email: string;
  password: string;
}) => {
  try {
    logger.info('Starting business signup process');

    const { pool } = await import('../../config/DB');
    const existingUser = await pool.query('SELECT 1 FROM users WHERE email = $1', [businessData.admin_email]);
    if (existingUser.rows.length > 0) {
      throw new BadRequestError('Admin email already registered');
    }

    const business = await createBusiness({
      name: businessData.name
    });

    logger.info(`Business created with ID: ${business.id}`);

    const salt = await genSalt(10);
    const hashedPassword = await hash(businessData.password, salt);

    const adminUser = await createUser(
      businessData.admin_name,
      businessData.admin_email,
      hashedPassword,
      business.id,
      1,
      'active'
    );

    logger.info(`Admin user created with ID: ${adminUser.id}`);

    await updateBusinessOwner(business.id.toString(), adminUser.id.toString());

    const payload = {
      userId: adminUser.id.toString(),
      email: adminUser.email,
      business_id: business.id,
      role_id: adminUser.role_id
    };

    const accessToken = jwt.generateAccessToken(payload);
    const refreshToken = jwt.generateRefreshToken(payload);

    logger.info('Business signup completed successfully');

    return {
      success: true,
      message: 'Business and admin user created successfully',
      data: {
        business: {
          id: business.id,
          name: business.name,
          email: business.email
        },
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role_id: adminUser.role_id,
          business_id: adminUser.business_id
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    };

  } catch (error) {
    logger.error('Error in business signup:', error);
    throw error;
  }
};

export const getBusinessesList = async () => {
  try {
    const businesses = await getAllBusinesses();
    return businesses;
  } catch (error) {
    logger.error('Error getting businesses list:', error);
    throw error;
  }
};

export const getBusinessDetails = async (businessId: string) => {
  try {
    const business = await getBusinessById(businessId);
    return business;
  } catch (error) {
    logger.error(`Error getting business details for ID ${businessId}:`, error);
    throw error;
  }
};
