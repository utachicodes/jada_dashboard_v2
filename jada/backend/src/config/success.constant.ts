export const SUCCESS = {
  SUCCESS: {
    STATUS_CODE: 200,
    TYPE: "SUCCESS",
    MESSAGE: "Success",
  },
  SUCCESS_CREATE: {
    STATUS_CODE: 201,
    TYPE: "SUCCESS_CREATE",
    MESSAGE: "Resource created successfully.",
  },
  SUCCESS_ACCEPTED: {
    STATUS_CODE: 202,
    TYPE: "SUCCESS_ACCEPTED",
    MESSAGE: "Request accepted for processing.",
  },
  SUCCESS_NO_CONTENT: {
    STATUS_CODE: 204,
    TYPE: "SUCCESS_NO_CONTENT",
    MESSAGE: "Request successful, no content to return.",
  },
  SUCCESS_LOGOUT: {
    STATUS_CODE: 200,
    TYPE: "SUCCESS_LOGOUT",
    MESSAGE: "User logged out successfully.",
  },
} as const;
