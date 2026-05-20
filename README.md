# Campaign Monitor MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that wraps the full [Campaign Monitor REST API v3.3](https://www.campaignmonitor.com/api/), giving Claude the ability to manage email campaigns, subscriber lists, journeys, segments, transactional email, and more via natural language.

## Features

**103 tools covering the complete Campaign Monitor API:**

- 📧 **Campaigns** — create, send, schedule, preview, and pull stats (opens, clicks, bounces, spam)
- 👥 **Subscribers** — add, update, import in bulk, unsubscribe, delete, view history
- 📋 **Lists** — full CRUD, custom fields, webhooks, subscriber state queries
- 🔀 **Segments** — create and manage rule-based segments, query matching subscribers
- 🤖 **Journeys** — list automations, view per-email stats, publish trigger events
- 📄 **Templates** — create, update, copy templates across clients
- ⚡ **Transactional** — send classic and smart emails, view message timeline and stats
- 🏢 **Clients** — manage clients, people, suppression lists, sending domains, billing
- ⚙️ **Account** — admins, billing details, primary contact, timezones

## Requirements

- Node.js 18+
- A [Campaign Monitor API key](https://help.campaignmonitor.com/api-keys)

## Installation

### Claude Desktop (manual)

1. Clone this repo and install dependencies:

```bash
git clone https://github.com/pauliowest/cmon-mcp.git
cd cmon-mcp
npm install
npm run build
```

2. Add to your `claude_desktop_config.json` (found at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "Campaign Monitor": {
      "command": "node",
      "args": ["/path/to/cmon-mcp/dist/index.js"],
      "env": {
        "CM_API_KEY": "your_api_key_here",
        "CM_CLIENT_ID": "your_client_id_here"
      }
    }
  }
}
```

3. Restart Claude Desktop.

### Finding your Client ID

If you're unsure of your Client ID, leave `CM_CLIENT_ID` blank and ask Claude to run `get_clients` — it will return all available clients and their IDs.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `CM_API_KEY` | ✅ | Your Campaign Monitor API key |
| `CM_CLIENT_ID` | Optional | Default client ID — tools fall back to this when no client is specified explicitly |

## Development

```bash
npm run build      # compile TypeScript → dist/
npm run dev        # watch mode
npm run inspector  # open MCP Inspector UI for manual tool testing
```

## Architecture

```
src/
  index.ts              # Entry point — wires up MCP server + stdio transport
  client.ts             # CampaignMonitorClient — all HTTP + Basic Auth
  tools/
    account.ts          # 11 tools — billing, admins, timezones
    campaigns.ts        # 17 tools — CRUD, send, stats
    clients.ts          # 19 tools — client management, people, domains
    journeys.ts         # 8 tools  — automations + stats
    lists.ts            # 20 tools — CRUD, custom fields, webhooks
    segments.ts         # 7 tools  — rule-based segments
    subscribers.ts      # 7 tools  — add, import, manage
    templates.ts        # 5 tools  — template management
    transactional.ts    # 9 tools  — classic + smart email
```

## License

MIT
