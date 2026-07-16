import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  console.log("Connecting to database...");
  
  // Parse the connection string
  // mysql://user:pass@host:port/db?ssl={...}
  const url = new URL(dbUrl);
  const config = {
    host: url.hostname,
    port: parseInt(url.port || '3306'),
    user: url.username,
    password: url.password,
    database: url.pathname.substring(1),
    ssl: url.searchParams.get('ssl') ? JSON.parse(url.searchParams.get('ssl')) : undefined
  };

  const connection = await mysql.createConnection(config);
  
  try {
    console.log("Adding column subscriptionStatus to users table...");
    try {
      await connection.query("ALTER TABLE users ADD COLUMN subscriptionStatus ENUM('free', 'premium') DEFAULT 'free' NOT NULL");
      console.log("Column subscriptionStatus added successfully.");
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log("Column subscriptionStatus already exists.");
      } else {
        throw err;
      }
    }

    console.log("Adding column subscriptionExpiresAt to users table...");
    try {
      await connection.query("ALTER TABLE users ADD COLUMN subscriptionExpiresAt TIMESTAMP NULL DEFAULT NULL");
      console.log("Column subscriptionExpiresAt added successfully.");
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log("Column subscriptionExpiresAt already exists.");
      } else {
        throw err;
      }
    }

    console.log("Database schema updated successfully!");
  } catch (error) {
    console.error("Error updating database schema:", error);
  } finally {
    await connection.end();
  }
}

run().catch(console.error);
