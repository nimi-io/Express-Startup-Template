export default {
  LOG_USER_LOGGED_IN: (name: string, device: string): string => {
    return `${name} has logged in successfully using ${device}`;
  },
};
