export const ERROR = {
  AUTH: {
    UNAUTHORIZED: {
      STATUS_CODE: 401,
      TYPE: "AUTHORIZATION_REQUIRED",
      MESSAGE: "Authorization token is missing or invalid.",
    },
    TOKEN_EXPIRED: {
      STATUS_CODE: 403,
      TYPE: "TOKEN_EXPIRED",
      MESSAGE: "The token is valid but has expired.",
    },
  },
  VALIDATION: {
    REQUIRED_FIELD: {
      STATUS_CODE: 400,
      TYPE: "FIELD_REQUIRED",
      MESSAGE: "This field is required.",
    },
    INVALID_FIELD: {
      STATUS_CODE: 400,
      TYPE: "FIELD_INVALID",
      MESSAGE: "The provided field value is invalid.",
    },
    DUPLICATE_FIELD: {
      STATUS_CODE: 409,
      TYPE: "FIELD_DUPLICATE",
      MESSAGE: "This field value already exists.",
    },
  },
  SESSION: {
    EXPIRED: {
      STATUS_CODE: 403,
      TYPE: "SESSION_EXPIRED",
      MESSAGE: "Your session has expired.",
    },
    FAILED_TO_LOAD: {
      STATUS_CODE: 500,
      TYPE: "SESSION_LOADING_FAILED",
      MESSAGE: "Failed to load the session.",
    },
  },
  CONSTANTS: {
    FAILED_TO_LOAD: {
      STATUS_CODE: 500,
      TYPE: "CONSTANTS_LOADING_FAILED",
      MESSAGE: "Failed to load configuration constants.",
    },
  },
  DEFAULT: {
    STATUS_CODE: 500,
    TYPE: "SERVER_ERROR",
    MESSAGE: "Something went wrong. Please try again.",
  },
  USER: {
    INVALID_USER: {
      STATUS_CODE: 404,
      TYPE: "INVALID_USER_DATA",
      MESSAGE: "Invalid email or password.",
    },
    EMAIL_REQUIRED: {
      STATUS_CODE: 422,
      TYPE: "EMAIL_REQUIRED",
      MESSAGE: "Email is required.",
    },
    PASSWORD_REQUIRED: {
      STATUS_CODE: 422,
      TYPE: "PASSWORD_REQUIRED",
      MESSAGE: "Password is required.",
    },
  },
} as const;
