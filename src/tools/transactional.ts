import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CampaignMonitorClient } from "../client.js";

const consentToTrackSchema = z
  .enum(["Yes", "No", "Unchanged"])
  .describe("Consent to track: 'Yes', 'No', or 'Unchanged'");

export function registerTransactionalTools(
  server: McpServer,
  client: CampaignMonitorClient,
  defaultClientId: string
): void {
  server.tool(
    "send_classic_email",
    "Send a one-off transactional email via Campaign Monitor",
    {
      to: z.array(z.string().email()).describe("Array of recipient email addresses"),
      from: z.string().describe("Sender email address (or 'Name <email>' format)"),
      subject: z.string().describe("Email subject line"),
      consent_to_track: consentToTrackSchema,
      cc: z.array(z.string().email()).optional().describe("CC recipients"),
      bcc: z.array(z.string().email()).optional().describe("BCC recipients"),
      reply_to: z.string().optional().describe("Reply-to email address"),
      html: z.string().optional().describe("HTML body of the email"),
      text: z.string().optional().describe("Plain-text body of the email"),
    },
    async ({ to, from, subject, consent_to_track, cc, bcc, reply_to, html, text }) => {
      try {
        const result = await client.sendClassicEmail({
          To: to,
          From: from,
          Subject: subject,
          ConsentToTrack: consent_to_track,
          CC: cc,
          BCC: bcc,
          ReplyTo: reply_to,
          HTML: html,
          Text: text,
        });
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
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
    "send_smart_email",
    "Send a transactional email using a Campaign Monitor smart email template",
    {
      smart_email_id: z.string().describe("The smart email template ID"),
      to: z.array(z.string().email()).describe("Array of recipient email addresses"),
      consent_to_track: consentToTrackSchema,
      cc: z.array(z.string().email()).optional().describe("CC recipients"),
      bcc: z.array(z.string().email()).optional().describe("BCC recipients"),
      data: z
        .record(z.unknown())
        .optional()
        .describe("Template variable data as a key-value object"),
    },
    async ({ smart_email_id, to, consent_to_track, cc, bcc, data }) => {
      try {
        const result = await client.sendSmartEmail({
          smartEmailId: smart_email_id,
          To: to,
          ConsentToTrack: consent_to_track,
          CC: cc,
          BCC: bcc,
          Data: data,
        });
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
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
    "list_smart_emails",
    "List all available smart email templates for the client",
    {
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
    },
    async ({ client_id }) => {
      try {
        const result = await client.listSmartEmails(
          client_id ?? defaultClientId
        );
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
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
    "get_transactional_stats",
    "Get transactional email statistics",
    {
      from: z
        .string()
        .optional()
        .describe("Start date for stats (ISO 8601)"),
      to: z
        .string()
        .optional()
        .describe("End date for stats (ISO 8601)"),
      timezone: z
        .string()
        .optional()
        .describe("Timezone for the date range (e.g. 'UTC', 'Australia/Sydney')"),
      group: z
        .string()
        .optional()
        .describe("Grouping for the stats (e.g. 'hour', 'day', 'month')"),
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
    },
    async ({ from, to, timezone, group, client_id }) => {
      try {
        const result = await client.getTransactionalStats({
          clientID: client_id ?? defaultClientId,
          from,
          to,
          timezone,
          group,
        });
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
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
    "get_transactional_timeline",
    "Get a timeline of transactional messages",
    {
      status: z
        .string()
        .optional()
        .describe("Filter by status (e.g. 'delivered', 'bounced', 'opened')"),
      count: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of messages to return"),
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
    },
    async ({ status, count, client_id }) => {
      try {
        const result = await client.getTransactionalTimeline({
          clientID: client_id ?? defaultClientId,
          status,
          count,
        });
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
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
    "get_smart_email_details",
    "Get full configuration and details for a smart email template",
    {
      smart_email_id: z.string().describe("The smart email ID"),
    },
    async ({ smart_email_id }) => {
      try {
        const result = await client.getSmartEmailDetails(smart_email_id);
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
    "get_classic_email_groups",
    "List all classic email groups for a client",
    {
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
    },
    async ({ client_id }) => {
      try {
        const resolvedClientId = client_id ?? defaultClientId;
        const result = await client.getClassicEmailGroups(
          resolvedClientId || undefined
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
    "get_transactional_message_details",
    "Get details for a single transactional message",
    {
      message_id: z.string().describe("The transactional message ID"),
    },
    async ({ message_id }) => {
      try {
        const result = await client.getTransactionalMessageDetails(message_id);
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
    "resend_transactional_message",
    "Resend a previously sent transactional message",
    {
      message_id: z.string().describe("The transactional message ID to resend"),
    },
    async ({ message_id }) => {
      try {
        const result = await client.resendTransactionalMessage(message_id);
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
}
