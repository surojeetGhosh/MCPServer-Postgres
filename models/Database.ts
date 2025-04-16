import { Database } from "./type";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();


export const PostgreSqlDatabase: Database = {
    pool: new Pool({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "database",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "password",
    }),
    WRITE_ENABLE: process.env.WRITE_ENABLE === "true",
    executeQuery: async (query: string) => {
        const isValid: boolean = await PostgreSqlDatabase.verifyConnection();
        if (!isValid) {
            return "Database connection failed";
        }
        if (!PostgreSqlDatabase.WRITE_ENABLE && !PostgreSqlDatabase.isReadOnlyQuery(query)) {
            return "Write operations are not allowed";
        }
        if (!query) {
            return "Query is empty";
        }
        try {
            const client = await PostgreSqlDatabase.pool.connect();
            const result = await client.query(query);
            client.release();
            if (result.rows.length > 0) {
                return JSON.stringify(result.rows, null, 2);
            }
            return "Query executed successfully, no rows returned";
        } catch (error) {
            console.error("Error executing query", error);
            return "Error executing query " + error;
        }
    },
    verifyConnection: async () => {
        try {
            const client = await PostgreSqlDatabase.pool.connect();
            await client.query("SELECT 1");
            client.release();
            return true;
        } catch (error) {
            console.error("Connection error", error);
            return false;
        }
    },
    close: async () => {
        await PostgreSqlDatabase.pool.end();
    },
    isReadOnlyQuery: (query: string) => {
        const readOnlyCommands = ["SELECT", "SHOW", "EXPLAIN", "DESCRIBE"];
        const command = query.trim().split(" ")[0].toUpperCase();
        return readOnlyCommands.includes(command);
    }
    
}