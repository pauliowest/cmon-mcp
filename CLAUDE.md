# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An MCP (Model Context Protocol) server that wraps the Campaign Monitor REST API (v3.3), allowing Claude to manage email campaigns, subscriber lists, and transactional email via natural language.

## Commands

```bash
npm run build      # tsc → dist/
npm run dev        # tsc --watch
npm start          # node dist/index.js  (requires CM_API_KEY env var)
npm run inspector  # launch MCP inspector UI for manual tool testing
```

The server must be started with:
```bash
CM_API_KEY=<your_key> CM_CLIENT_ID=<your_client_id> node dist/index.js
```

`CM_API_KEY` is required and will cause an immediate exit if missing. `CM_CLIENT_ID` is optional — tools that need a client ID accept it as an explicit parameter and fall back to this env var.

## Architecture

```
src/
  index.ts          # Entry point: reads env, wires up McpServer + StdioServerTransport
  client.ts         # CampaignMonitorClient — all HTTP calls, Basic Auth (apiKey:x)
  tools/
    campaigns.ts    # 12 campaign tools (CRUD + stats: opens, clicks, bounces, etc.)
    lists.ts        # 9 list tools (CRUD + subscriber queries + stats)
    subscribers.ts  # 6 subscriber tools (add, get, update, unsubscribe, delete, bulk import)
    transactional.ts# 5 transactional tools (classic email, smart email, timeline, stats)
    clients.ts      # 2 client tools (list all, get details)
```

**Data flow:** Claude → MCP stdio → `index.ts` → tool handler (zod-validated) → `CampaignMonitorClient.request()` → Campaign Monitor API → JSON result back as MCP text content.

### client.ts

`CampaignMonitorClient` handles all HTTP. Every API method calls the private `request<T>(method, path, body?, queryParams?)` helper which:
- Builds the full URL with optional query string
- Sets `Authorization: Basic <base64(apiKey:x)>` on every request
- Throws a descriptive error on non-2xx (parses Campaign Monitor's `{ Code, Message }` error shape)
- Returns `undefined as T` on 204 No Content

### Tool registration pattern

Each `tools/*.ts` file exports a single `register*Tools(server, client, defaultClientId?)` function. Inside, each tool is registered via `server.tool(name, description, zodSchema, handler)`. Handlers always catch errors and return `{ content: [{ type: "text", text: "Error: ..." }], isError: true }` on failure, or `{ content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }` on success.

### Campaign Monitor API conventions

- Base URL: `https://api.createsend.com/api/v3.3`
- Paths follow pattern: `/campaigns/{id}/summary.json`, `/lists/{id}/active.json`, etc.
- Paginated endpoints accept `page` (1-based) and `pageSize` query params
- `ConsentToTrack` is required on subscriber/transactional calls: `"Yes"`, `"No"`, or `"Unchanged"`
- Dates for filtering active/bounced/unsubscribed queries are ISO 8601 strings

## Module system

Project uses `"type": "module"` (ESM). All internal imports must use the `.js` extension (e.g., `import { ... } from "./client.js"`). TypeScript is configured with `"module": "NodeNext"` to enforce this.
