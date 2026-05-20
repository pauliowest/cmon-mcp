import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CampaignMonitorClient } from "./client.js";
import { registerCampaignTools } from "./tools/campaigns.js";
import { registerListTools } from "./tools/lists.js";
import { registerSubscriberTools } from "./tools/subscribers.js";
import { registerTransactionalTools } from "./tools/transactional.js";
import { registerClientTools } from "./tools/clients.js";
import { registerAccountTools } from "./tools/account.js";
import { registerJourneyTools } from "./tools/journeys.js";
import { registerSegmentTools } from "./tools/segments.js";
import { registerTemplateTools } from "./tools/templates.js";

const apiKey = process.env.CM_API_KEY;
if (!apiKey) {
  console.error(
    "Error: CM_API_KEY environment variable is required.\n" +
      "Set it to your Campaign Monitor API key before starting this server.\n" +
      "Example: CM_API_KEY=your_api_key node dist/index.js"
  );
  process.exit(1);
}

const cmClient = new CampaignMonitorClient(apiKey);

// ─── Resolve default client ID ────────────────────────────────────────────────
// If CM_CLIENT_ID is set, use it directly.
// Otherwise fetch the account's client list at startup:
//   - Single client  → use it automatically (zero config needed)
//   - Multi-client   → use the first client as default and embed the full
//                      list in server instructions so Claude never needs to
//                      call get_clients before acting
// ─────────────────────────────────────────────────────────────────────────────

type CMClient = { ClientID: string; Name: string };

let resolvedClientId = process.env.CM_CLIENT_ID ?? "";
let clients: CMClient[] = [];
let clientsInstructions = "";

try {
  clients = (await cmClient.getClients()) as CMClient[];

  if (clients.length === 1 && !resolvedClientId) {
    // Single-client account — set it as the default silently
    resolvedClientId = clients[0].ClientID;
    clientsInstructions = `The Campaign Monitor account has one client: ${clients[0].Name} (ClientID: ${clients[0].ClientID}). Use this ClientID for all operations unless the user explicitly provides a different one.`;
  } else if (clients.length > 1) {
    // Multi-client agency account — pick a default and list all for context
    if (!resolvedClientId) {
      resolvedClientId = clients[0].ClientID;
    }
    const activeClient = clients.find((c) => c.ClientID === resolvedClientId) ?? clients[0];
    const clientLines = clients
      .map((c) =>
        c.ClientID === resolvedClientId
          ? `  - ${c.Name} (ClientID: ${c.ClientID}) ← default`
          : `  - ${c.Name} (ClientID: ${c.ClientID})`
      )
      .join("\n");
    clientsInstructions = `This is a multi-client Campaign Monitor account. Available clients:
${clientLines}

Default client: ${activeClient.Name} (ClientID: ${resolvedClientId})
When the user refers to a client by name, match it to the ClientID above and use that — never ask the user to provide a ClientID manually.`;
  }
} catch {
  clientsInstructions =
    "Client list could not be fetched at startup. Use the get_clients tool if you need to look up client IDs.";
}

// Build a compact hint string for embedding in tool parameter descriptions
const clientHint = clients.length > 0
  ? " — available clients: " + clients.map((c: CMClient) => `${c.Name} (${c.ClientID})`).join(" | ")
  : "";

// ─── Server instructions ──────────────────────────────────────────────────────

const instructions = `You are connected to the Campaign Monitor MCP server with 113 tools covering campaigns, subscribers, lists, segments, journeys, templates, transactional email, clients, and account management.

${clientsInstructions}

Operational notes:
- Never call get_clients mid-conversation to look up a ClientID — the client list is provided above.
- Paginated tools accept optional page and page_size parameters.
- Dates use ISO 8601 format (e.g. 2024-01-15T00:00:00).
- send_date for campaigns accepts "Immediately" or an ISO 8601 datetime.`;

// ─── MCP server ───────────────────────────────────────────────────────────────

const server = new McpServer(
  { name: "campaign-monitor", version: "0.1.0" },
  { instructions }
);

registerCampaignTools(server, cmClient, resolvedClientId, clientHint);
registerListTools(server, cmClient, resolvedClientId, clientHint);
registerSubscriberTools(server, cmClient);
registerTransactionalTools(server, cmClient, resolvedClientId, clientHint);
registerClientTools(server, cmClient, resolvedClientId, clientHint);
registerAccountTools(server, cmClient, resolvedClientId, clientHint);
registerJourneyTools(server, cmClient, resolvedClientId, clientHint);
registerSegmentTools(server, cmClient);
registerTemplateTools(server, cmClient, resolvedClientId, clientHint);

const transport = new StdioServerTransport();
await server.connect(transport);
