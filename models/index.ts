import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse';

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
export const transports: { [sessionId: string]: SSEServerTransport } = {};