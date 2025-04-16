import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { PostgreSqlDatabase } from './Database';

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports: { [sessionId: string]: SSEServerTransport } = {};
export const Database = {
    PostgreSqlDatabase,
    transports
};