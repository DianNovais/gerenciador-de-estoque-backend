import winston from "winston";

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.json()
    ),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({filename: "logs/info.log", level: "info"}),
        new winston.transports.File({filename: "logs/error.log", level: "error"}),
        new winston.transports.File({filename: "logs/debug.log", level: "debug"}),
        new winston.transports.File({filename: "logs/combined.log"})
    ]

})