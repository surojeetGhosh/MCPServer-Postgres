import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Request, Response } from "express";
import { transports } from "../models/index.js";
import { z } from "zod";

const server = new McpServer({
    name: "postgres-server",
    version: "1.0.0"
});

server.tool("add",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }]
    })
);

// Add a dynamic greeting resource
server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, { name }) => ({
        contents: [{
            uri: uri.href,
            text: `Hello, ${name}!`
        }]
    })
);

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
    console.log("sessionId", sessionId, "Someone just called me")
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