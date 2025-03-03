/**
 * @description
 * Custom log levels configuration for Winston logger.
 * The log levels define the severity and order of logging.
 * Lower numbers indicate higher severity.
 * @example
 * In case you select the `debug` log level, all logs with a level equal to or lower than `debug` will be logged.
 * For instance:
 * - `debug` will log the most detailed information.
 * - `info` will be logged as well since it is a lower severity than `debug`.
 * - `warn` and `error` will also be logged, as they have higher severity levels.
 *
 */
export const customLevels = {
  /**
   * @description
   * Log levels and their corresponding severity numbers.
   * Lower number means higher priority.
   *
   * @property {number} error - Highest priority level (0).
   * @property {number} warn - Warning level (1).
   * @property {number} info - General information level (2).
   * @property {number} debug - Debug level, used for development and troubleshooting (3).
   */
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },

  /**
   * @description
   * Colors for each log level, used for terminal output to make logs visually distinct.
   *
   * @property {string} error - Color for 'error' level logs (red).
   * @property {string} warn - Color for 'warn' level logs (yellow).
   * @property {string} info - Color for 'info' level logs (green).
   * @property {string} debug - Color for 'debug' level logs (blue).
   */
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
  },
};
