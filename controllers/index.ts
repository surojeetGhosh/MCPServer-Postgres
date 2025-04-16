import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Request, Response } from "express";
import { Database } from "../models";
import { z } from "zod";

const server = new McpServer({
    name: "postgres-server",
    version: "1.0.0"
});

server.tool("queryCustom",
    { query: z.string() },
    async ({ query }) => ({
        content: [{ type: "text", text: await Database.PostgreSqlDatabase.executeQuery(query) }],
    })
);

const getTools = async (req: Request, res: Response) => {
    const transport = new SSEServerTransport("/messages", res)
    Database.transports[transport.sessionId] = transport
    res.on("close", () => {
        delete Database.transports[transport.sessionId]
        transport.close()
    })
    await server.connect(transport);
}

const postMessage = async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = Database.transports[sessionId];
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('No transport found for sessionId');
    }
}

export const Utility = {
    getTools,
    postMessage
}