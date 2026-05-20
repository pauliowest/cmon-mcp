import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CampaignMonitorClient } from "../client.js";

export function registerJourneyTools(
  server: McpServer,
  client: CampaignMonitorClient,
  defaultClientId: string
): void {
  server.tool(
    "get_journeys",
    "List all journeys for the Campaign Monitor client",
    {
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
    },
    async ({ client_id }) => {
      try {
        const result = await client.getJourneys(
          client_id ?? defaultClientId
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "get_journey_summary",
    "Get full stats summary for a journey",
    {
      journey_id: z.string().describe("The journey ID"),
    },
    async ({ journey_id }) => {
      try {
        const result = await client.getJourneySummary(journey_id);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "get_journey_email_recipients",
    "Get a paginated list of recipients for a journey email",
    {
      email_id: z.string().describe("The journey email ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ email_id, page, page_size }) => {
      try {
        const result = await client.getJourneyEmailRecipients(
          email_id,
          page,
          page_size
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "get_journey_email_opens",
    "Get a paginated list of opens for a journey email",
    {
      email_id: z.string().describe("The journey email ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ email_id, page, page_size }) => {
      try {
        const result = await client.getJourneyEmailOpens(
          email_id,
          page,
          page_size
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "get_journey_email_clicks",
    "Get a paginated list of clicks for a journey email",
    {
      email_id: z.string().describe("The journey email ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ email_id, page, page_size }) => {
      try {
        const result = await client.getJourneyEmailClicks(
          email_id,
          page,
          page_size
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "get_journey_email_bounces",
    "Get a paginated list of bounces for a journey email",
    {
      email_id: z.string().describe("The journey email ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ email_id, page, page_size }) => {
      try {
        const result = await client.getJourneyEmailBounces(
          email_id,
          page,
          page_size
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "get_journey_email_unsubscribes",
    "Get a paginated list of unsubscribes for a journey email",
    {
      email_id: z.string().describe("The journey email ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ email_id, page, page_size }) => {
      try {
        const result = await client.getJourneyEmailUnsubscribes(
          email_id,
          page,
          page_size
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "publish_journey_event",
    "Publish an event to trigger a subscriber activity journey",
    {
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
      event_data: z
        .string()
        .describe("Event data as a JSON string (e.g. subscriber email and event fields)"),
    },
    async ({ client_id, event_data }) => {
      try {
        let parsed: object;
        try {
          parsed = JSON.parse(event_data) as object;
        } catch {
          return {
            content: [
              {
                type: "text",
                text: "Error: event_data must be a valid JSON string",
              },
            ],
            isError: true,
          };
        }
        const result = await client.publishEvent(
          client_id ?? defaultClientId,
          parsed
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "copy_journey",
    "Copy a journey to a specified client",
    {
      journey_id: z.string().describe("The journey ID to copy"),
      client_id: z.string().describe("The destination client ID"),
    },
    async ({ journey_id, client_id }) => {
      try {
        const result = await client.copyJourney(journey_id, client_id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    }
  );
}
