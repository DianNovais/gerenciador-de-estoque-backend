import winston from "winston";

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/debug.log', level: 'debug' }),
    ],
});

// Caso deseje também exibir os logs no console durante o desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

export { logger };
