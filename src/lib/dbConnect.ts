import pg from 'pg';
import { Sequelize } from 'sequelize';

type ConnectionObject = {
  isConnected?: boolean;
};

const connection: ConnectionObject = {};

const sequelize = new Sequelize('movies', 'postgres', 'enter', {
  dialect: 'postgres',
  logging: false,
  dialectModule: pg,
});

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    // Attempt to authenticate to the database
    await sequelize.authenticate();

    connection.isConnected = true;
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

export { sequelize, dbConnect };
