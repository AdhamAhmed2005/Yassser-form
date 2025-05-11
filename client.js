import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new pg.Client({
    connectionString: `postgresql://neondb_owner:${process.env.PASSWORD}@${process.env.HOST}/neondb?sslmode=require`,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect()
    .then(() => console.log("Connected to the database"))
    .catch(err => console.error("Database connection error:", err.stack));

export default client;