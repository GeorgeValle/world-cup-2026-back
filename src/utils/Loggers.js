import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Escribe todos los logs de nivel 'error' (y menores) en error.log
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Escribe todos los logs en combined.log
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Si no estamos en producción, también mostramos los logs por consola con colores
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;