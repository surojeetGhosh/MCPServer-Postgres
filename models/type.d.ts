import { Pool } from "pg";
import { boolean } from "zod";

export type Database = {
    pool: Pool;
    WRITE_ENABLE: boolean;
    executeQuery: (query: string) => Promise<string>;
    verifyConnection: () => Promise<boolean>;
    close: () => Promise<void>;
    isReadOnlyQuery: (query: string) => boolean;
}