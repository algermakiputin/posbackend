import log4js from 'log4js';

log4js.configure({
  appenders: { everything: { type: 'file', filename: 'logs.log' } },
  categories: { default: { appenders: ['everything'], level: 'ALL' } }
});

const logger = log4js.getLogger();
logger.level = 'off';
export default logger;