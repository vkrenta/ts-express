import { Logger } from 'ts-logger';

const logger = new Logger()
  .Console()
  .setFormat(
    ({ label, timestamp, level }) =>
      `[${timestamp.toJSON()}][${level.toUpperCase()}]${
        !!label ? `[${label}]` : ''
      }`
  );

export default logger;
