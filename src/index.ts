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

const defaultClientId = process.env.CM_CLIENT_ID ?? "";
if (!defaultClientId) {
  console.warn(
    "Warning: CM_CLIENT_ID environment variable is not set. " +
      "Some tools that require a client ID will need it passed explicitly."
  );
}

const client = new CampaignMonitorClient(apiKey);

const server = new McpServer({
  name: "campaign-monitor",
  version: "0.1.0",
});

registerCampaignTools(server, client, defaultClientId);
registerListTools(server, client, defaultClientId);
registerSubscriberTools(server, client);
registerTransactionalTools(server, client, defaultClientId);
registerClientTools(server, client, defaultClientId);
registerAccountTools(server, client);
registerJourneyTools(server, client, defaultClientId);
registerSegmentTools(server, client);
registerTemplateTools(server, client, defaultClientId);

const transport = new StdioServerTransport();
await server.connect(transport);
