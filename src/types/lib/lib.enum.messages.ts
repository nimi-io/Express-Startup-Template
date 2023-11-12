export default {
  CURRENT_DATE: new Date().toISOString(),
  OK: "OK",

  CREATED: "CREATED",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  EMAIL_SENT: "EMAIL_HAS_BEEN_SENT",
  OTP_GENERATED: "GENERATED OTP",
  NOT_OK: "NOT_OK",
  UNAUTHORIZED: "UNAUTHORIZED",
  BAD_REQUEST: "BAD_REQUEST",
  INVALID_TOKEN: "INVALID_TOKEN",
  EXPIRED_TOKEN: "EXPIRED_TOKEN",
  ERROR_STATUS: "Error",
  SUCCESS_STATUS: "Success",
  WARNING_STATUS: "Warning",
  INFO_STATUS: "Info",
  DEFAULT_STATUS: "Default",
  LOADING_STATUS: "Loading",
  DISABLED_STATUS: "Disabled",
  ACTIVE_STATUS: "Active",
  SOMETHING_WENT_WRONG: "Something went wrong",
  TRUE: true,
  FALSE: false,
  LOGIN: (user: string): string => {
    return `${user} logged is successfully`;
  },
  REGISTER: (user: string): string => {
    return `${user} registered is successfully`;
  },
};
