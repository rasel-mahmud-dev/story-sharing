const winston = require("winston");

let now  = new Date();
const logger = winston.createLogger({
  
  format: winston.format.combine(
    winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
    winston.format.colorize(),
    winston.format.align(),
    winston.format.printf(info => {
      return `${info.level}: ${[info.timestamp]}: ${info.message} : \n ${info.meta}`
    }),
  ),
  
  transports: [
    new winston.transports.Console({
      level: 'info',
    }),
    new winston.transports.Console({
      level: 'warn',
    }),
    
    // only for production for
    
    // new winston.transports.File({
    //   level: 'error',
    //   filename: `logs/error-${now.toDateString()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}.log`,
    // }),
    // new winston.transports.File({
    //   level: 'warn',
    //   filename: `logs/warn-${now.toDateString()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}.log`,
    // })
  ]
})

module.exports = logger
