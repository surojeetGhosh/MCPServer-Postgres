import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Request, Response } from "express";
import { transports } from "../models/index.js";

const server = new McpServer({
    name: "postgres-server",
    version: "1.0.0"
});

const getTools = async (req: Request, res: Response) => {
    const transport = new SSEServerTransport("/messages", res)
    transports[transport.sessionId] = transport
    res.on("close", () => {
        delete transports[transport.sessionId]
        transport.close()
    })
    await server.connect(transport);
}

const postMessage = async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
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