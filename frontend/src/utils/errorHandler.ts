export interface ApiErrorResponse {
  success: false;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface UserFriendlyError {
  message: string;
  isDatabaseError: boolean;
  originalError?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  'invalid credentials': 'Invalid email or password',
  'invalid email or password': 'Invalid email or password',
  'user not found': 'Invalid email or password',
  'unauthorized': 'Unauthorized. Please log in again',
  'authentication failed': 'Authentication failed',
  'invalid token': 'Your session has expired. Please log in again',
  'token expired': 'Your session has expired. Please log in again',
  'validation error': 'The provided data is invalid',
  'invalid email': 'The email address is invalid',
  'email already exists': 'This email is already registered',
  'email in use': 'This email is already registered',
  'password too weak': 'The password is not secure enough',
  'business not found': 'Business not found',
  'user already exists': 'User already exists',
  'duplicate entry': 'This record already exists',
  'unique constraint': 'This record already exists in the system',
  'foreign key': 'Cannot complete this operation due to dependencies',
  'database error': 'Error connecting to the server. Please try again',
  'connection refused': 'Could not connect to the server. Check your connection',
  'connection timeout': 'Connection took too long. Please try again',
};

const STATUS_CODE_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Verify the entered data',
  401: 'Unauthorized. Please log in again',
  403: 'You do not have permission to perform this action',
  404: 'The requested resource was not found',
  409: 'Conflict: This record already exists',
  422: 'The provided data is invalid',
  429: 'Too many requests. Wait a moment and try again',
  500: 'Server error. Please try again later',
  502: 'Connection error. Please try again',
  503: 'Server is unavailable. Please try later',
  504: 'Connection timeout. Please try again',
};

const isDatabaseError = (error: string): boolean => {
  const dbPatterns = [
    'sql',
    'database',
    'constraint',
    'foreign key',
    'unique key',
    'duplicate entry',
    'syntax error',
    'table not found',
    'column not found',
    'integrity',
    'connection',
    'timeout',
    'refused',
  ];

  return dbPatterns.some((pattern) =>
    error.toLowerCase().includes(pattern)
  );
};

const getErrorMessage = (error: any): string => {
  let errorMessage = '';

  if (typeof error === 'object') {
    errorMessage =
      error.message ||
      error.error ||
      error.detail ||
      JSON.stringify(error);
  } else {
    errorMessage = String(error);
  }

  if (errorMessage.startsWith('{') && errorMessage.endsWith('}')) {
    try {
      const parsed = JSON.parse(errorMessage);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        const errors: string[] = [];
        for (const [field, messages] of Object.entries(parsed)) {
          if (Array.isArray(messages)) {
            const errorTexts = messages.map((msg: any) => {
              const msgStr = String(msg).toLowerCase();
              if (msgStr.includes('required')) return `${field} is required`;
              if (msgStr.includes('must be')) return `${field} is invalid`;
              return String(msg);
            });
            errors.push(`${field}: ${errorTexts.join(', ')}`);
          }
        }
        if (errors.length > 0) {
          return errors.join('; ');
        }
      }
    } catch {
    }
  }

  const lowerError = errorMessage.toLowerCase();

  for (const [key, friendlyMessage] of Object.entries(ERROR_MESSAGES)) {
    if (lowerError.includes(key)) {
      return friendlyMessage;
    }
  }

  if (isDatabaseError(errorMessage)) {
    return 'Error processing your request. Please try again';
  }

  if (errorMessage.length < 5) {
    return 'An error occurred. Please try again';
  }

  if (
    errorMessage.includes('at ') ||
    errorMessage.includes('Error:') ||
    errorMessage.includes('QueryError')
  ) {
    return 'Error processing your request. Please try again';
  }

  return errorMessage;
};

export const handleApiError = (error: any): UserFriendlyError => {
  const originalError = error?.error || error?.message || String(error);
  const statusCode = error?.statusCode || error?.response?.status;

  if (statusCode && STATUS_CODE_MESSAGES[statusCode]) {
    return {
      message: STATUS_CODE_MESSAGES[statusCode],
      isDatabaseError: isDatabaseError(originalError),
      originalError,
    };
  }

  if (error?.message && !isDatabaseError(error.message)) {
    return {
      message: error.message,
      isDatabaseError: false,
      originalError,
    };
  }

  const friendlyMessage = getErrorMessage(originalError);
  const hasDbError = isDatabaseError(originalError);

  return {
    message: friendlyMessage,
    isDatabaseError: hasDbError,
    originalError,
  };
};

export const shouldShowError = (error: any): boolean => {
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('cancelled')) {
    return false;
  }

  return true;
};

export const extractErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (!error) {
    return 'An unknown error occurred';
  }

  return error.message || error.error || JSON.stringify(error);
};
