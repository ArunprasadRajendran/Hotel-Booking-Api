/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPool } from 'mysql2';
// Load Environment settings
import dotenv from 'dotenv';
import { logger } from '../logger';

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: 'server/environment/production.env' });
    logger.info('Server starting up for production configuration.');
} else {
    dotenv.config({ path: 'server/environment/development.env' });
    logger.info('Server starting up for development configuration.');
}

export const connection: any = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    idleTimeout: 86400000, // 1 day in milliseconds
    charset: 'utf8mb4',
});

connection.getConnection((err: Error, connection: any) => {
    if (err) {
        console.error('Error getting connection from pool:', err);
        return;
    }
    console.log('Connected to database successfully!');
    // Release the connection back to the pool when finished
    connection.release();
});
