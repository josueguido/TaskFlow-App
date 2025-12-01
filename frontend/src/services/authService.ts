import axios from '../lib/axios';
import { handleApiError, shouldShowError } from '../utils/errorHandler';
import type {
  BusinessSignupRequest,
  BusinessSignupResponse,
  LoginRequest,
  LoginResponse,
  UserInviteRequest,
  UserInviteResponse,
  UserSignupRequest,
  UserSignupResponse,
  RefreshTokenResponse,
  ApiResponse
} from '../types/api';


abstract class BaseApiService {
  protected async handleApiCall<T>(
    apiCall: () => Promise<any>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiCall();
      return response.data;
    } catch (error: any) {
      if (!shouldShowError(error)) {
        throw new Error('Solicitud cancelada');
      }

      const serverError = error.response?.data;
      const statusCode = error.response?.status;
      const originalMessage = error.response?.data?.message || 
                             error.response?.data?.error || 
                             error.message;



      const { message: friendlyMessage } = handleApiError({
        message: originalMessage,
        statusCode,
        error: serverError?.error
      });

      const err = new Error(friendlyMessage);
      Object.assign(err, {
        statusCode,
        originalError: originalMessage
      });
      throw err;
    }
  }
}

export class BusinessAuthService extends BaseApiService {

  async signupBusiness(data: BusinessSignupRequest): Promise<ApiResponse<BusinessSignupResponse>> {
    return this.handleApiCall(async () => {
      return await axios.post('/auth/signup-business', {
        name: data.name,
        admin_name: data.admin_name,
        admin_email: data.admin_email,
        password: data.password
      });
    });
  }
}

export class UserAuthService extends BaseApiService {

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.handleApiCall(async () => {
      return await axios.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
    });
  }

  async signupUser(data: UserSignupRequest): Promise<ApiResponse<UserSignupResponse>> {
    return this.handleApiCall(async () => {
      return await axios.post('/auth/signup-user', {
        invite_token: data.invite_token,
        name: data.name,
        password: data.password
      });
    });
  }


  async refreshToken(refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> {
    return this.handleApiCall(async () => {
      return await axios.post('/auth/refresh', {
        refreshToken: refreshToken
      });
    });
  }
}

export class UserManagementService extends BaseApiService {
  async inviteUser(data: UserInviteRequest): Promise<ApiResponse<UserInviteResponse>> {
    return this.handleApiCall(async () => {
      return await axios.post('/users/invite', {
        email: data.email,
        role_id: data.role_id || 2 
      });
    });
  }
}

export class AuthServiceFactory {
  private static businessAuthService: BusinessAuthService;
  private static userAuthService: UserAuthService;
  private static userManagementService: UserManagementService;

  static getBusinessAuthService(): BusinessAuthService {
    if (!this.businessAuthService) {
      this.businessAuthService = new BusinessAuthService();
    }
    return this.businessAuthService;
  }

  static getUserAuthService(): UserAuthService {
    if (!this.userAuthService) {
      this.userAuthService = new UserAuthService();
    }
    return this.userAuthService;
  }

  static getUserManagementService(): UserManagementService {
    if (!this.userManagementService) {
      this.userManagementService = new UserManagementService();
    }
    return this.userManagementService;
  }
}

export const businessAuthService = AuthServiceFactory.getBusinessAuthService();
export const userAuthService = AuthServiceFactory.getUserAuthService();
export const userManagementService = AuthServiceFactory.getUserManagementService();