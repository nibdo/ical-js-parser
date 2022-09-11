const CET_LONG_FORMAT = 'Central European Standard Time';
const CET_ICS_FORMAT = 'CET';

/**
 * Parse different formats of timezone to recognizable output
 * @param timezone
 */
export const timezoneParser = (timezone: string): string => {
  if (!timezone) {
    return '';
  }

  switch (timezone) {
    case CET_LONG_FORMAT:
      return CET_ICS_FORMAT;
    default:
      return timezone;
  }
};
