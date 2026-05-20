import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CampaignMonitorClient } from "../client.js";

export function registerCampaignTools(
  server: McpServer,
  client: CampaignMonitorClient,
  defaultClientId: string
): void {
  server.tool(
    "list_campaigns",
    "List all sent campaigns for the Campaign Monitor client",
    {
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
    },
    async ({ client_id }) => {
      try {
        const result = await client.listCampaigns(
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
    "list_draft_campaigns",
    "List all draft campaigns for the Campaign Monitor client",
    {
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
    },
    async ({ client_id }) => {
      try {
        const result = await client.listDraftCampaigns(
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
    "list_scheduled_campaigns",
    "List all scheduled campaigns for the Campaign Monitor client",
    {
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
    },
    async ({ client_id }) => {
      try {
        const result = await client.listScheduledCampaigns(
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
    "get_campaign_summary",
    "Get statistics summary for a campaign",
    {
      campaign_id: z.string().describe("The campaign ID"),
    },
    async ({ campaign_id }) => {
      try {
        const result = await client.getCampaignSummary(campaign_id);
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
    "get_campaign_recipients",
    "Get a paginated list of recipients for a campaign",
    {
      campaign_id: z.string().describe("The campaign ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ campaign_id, page, page_size }) => {
      try {
        const result = await client.getCampaignRecipients(
          campaign_id,
          page,
          page_size
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
    "get_campaign_opens",
    "Get a paginated list of subscribers who opened a campaign",
    {
      campaign_id: z.string().describe("The campaign ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ campaign_id, page, page_size }) => {
      try {
        const result = await client.getCampaignOpens(
          campaign_id,
          page,
          page_size
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
    "get_campaign_clicks",
    "Get a paginated list of subscribers who clicked links in a campaign",
    {
      campaign_id: z.string().describe("The campaign ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ campaign_id, page, page_size }) => {
      try {
        const result = await client.getCampaignClicks(
          campaign_id,
          page,
          page_size
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
    "get_campaign_bounces",
    "Get a paginated list of subscribers who bounced for a campaign",
    {
      campaign_id: z.string().describe("The campaign ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ campaign_id, page, page_size }) => {
      try {
        const result = await client.getCampaignBounces(
          campaign_id,
          page,
          page_size
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
    "get_campaign_unsubscribes",
    "Get a paginated list of subscribers who unsubscribed via a campaign",
    {
      campaign_id: z.string().describe("The campaign ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ campaign_id, page, page_size }) => {
      try {
        const result = await client.getCampaignUnsubscribes(
          campaign_id,
          page,
          page_size
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
    "create_campaign",
    "Create a new draft campaign in Campaign Monitor",
    {
      name: z.string().describe("Internal name for the campaign"),
      subject: z.string().describe("Email subject line"),
      from_name: z.string().describe("Sender display name"),
      from_email: z.string().email().describe("Sender email address"),
      reply_to: z.string().email().describe("Reply-to email address"),
      html_url: z
        .string()
        .url()
        .optional()
        .describe("URL to the HTML content of the campaign"),
      text_url: z
        .string()
        .url()
        .optional()
        .describe("URL to the plain-text content of the campaign"),
      list_ids: z
        .array(z.string())
        .optional()
        .describe("Array of subscriber list IDs to send to"),
      segment_ids: z
        .array(z.string())
        .optional()
        .describe("Array of segment IDs to send to"),
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
    },
    async ({
      name,
      subject,
      from_name,
      from_email,
      reply_to,
      html_url,
      text_url,
      list_ids,
      segment_ids,
      client_id,
    }) => {
      try {
        const result = await client.createCampaign(
          client_id ?? defaultClientId,
          {
            Name: name,
            Subject: subject,
            FromName: from_name,
            FromEmail: from_email,
            ReplyTo: reply_to,
            HtmlUrl: html_url,
            TextUrl: text_url,
            ListIDs: list_ids,
            SegmentIDs: segment_ids,
          }
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
    "send_campaign",
    "Send or schedule a campaign for delivery",
    {
      campaign_id: z.string().describe("The campaign ID to send"),
      confirmation_email: z
        .string()
        .email()
        .describe("Email address to receive a confirmation when the campaign is sent"),
      send_date: z
        .string()
        .optional()
        .describe(
          "When to send: 'Immediately' or an ISO 8601 datetime string. Defaults to 'Immediately'."
        ),
    },
    async ({ campaign_id, confirmation_email, send_date }) => {
      try {
        const result = await client.sendCampaign(campaign_id, {
          ConfirmationEmail: confirmation_email,
          SendDate: send_date ?? "Immediately",
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
    "delete_campaign",
    "Delete a draft campaign",
    {
      campaign_id: z.string().describe("The campaign ID to delete"),
    },
    async ({ campaign_id }) => {
      try {
        await client.deleteCampaign(campaign_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { success: true, message: `Campaign ${campaign_id} deleted.` },
                null,
                2
              ),
            },
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
    "send_campaign_preview",
    "Send a preview of a campaign to one or more email addresses",
    {
      campaign_id: z.string().describe("The campaign ID"),
      preview_recipients: z
        .string()
        .describe(
          "Comma-separated list of email addresses to send the preview to"
        ),
      personalize: z
        .string()
        .optional()
        .describe(
          "Personalization option: 'Random', 'Fallback', or a subscriber email address"
        ),
    },
    async ({ campaign_id, preview_recipients, personalize }) => {
      try {
        const recipients = preview_recipients
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        const result = await client.sendCampaignPreview(campaign_id, {
          PreviewRecipients: recipients,
          Personalize: personalize,
        });
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
    "create_campaign_from_template",
    "Create a new campaign from a Campaign Monitor template",
    {
      name: z.string().describe("Internal name for the campaign"),
      subject: z.string().describe("Email subject line"),
      from_name: z.string().describe("Sender display name"),
      from_email: z.string().email().describe("Sender email address"),
      reply_to: z.string().email().describe("Reply-to email address"),
      template_id: z.string().describe("The template ID to use"),
      list_ids: z
        .string()
        .describe("Comma-separated list of subscriber list IDs to send to"),
      segment_ids: z
        .string()
        .optional()
        .describe("Comma-separated list of segment IDs to send to"),
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
    },
    async ({
      name,
      subject,
      from_name,
      from_email,
      reply_to,
      template_id,
      list_ids,
      segment_ids,
      client_id,
    }) => {
      try {
        const listIdArray = list_ids
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const segmentIdArray = segment_ids
          ? segment_ids
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined;
        const result = await client.createCampaignFromTemplate(
          client_id ?? defaultClientId,
          {
            Name: name,
            Subject: subject,
            FromName: from_name,
            FromEmail: from_email,
            ReplyTo: reply_to,
            ListIDs: listIdArray,
            SegmentIDs: segmentIdArray,
            Template: { TemplateID: template_id },
          }
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
    "get_campaign_spam",
    "Get spam complaints for a campaign",
    {
      campaign_id: z.string().describe("The campaign ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ campaign_id, page, page_size }) => {
      try {
        const result = await client.getCampaignSpamComplaints(
          campaign_id,
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
    "get_campaign_email_client_usage",
    "Get email client usage stats for a campaign",
    {
      campaign_id: z.string().describe("The campaign ID"),
    },
    async ({ campaign_id }) => {
      try {
        const result = await client.getCampaignEmailClientUsage(campaign_id);
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
    "get_campaign_lists_and_segments",
    "Get which lists and segments a campaign was sent to",
    {
      campaign_id: z.string().describe("The campaign ID"),
    },
    async ({ campaign_id }) => {
      try {
        const result = await client.getCampaignListsAndSegments(campaign_id);
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
    "unschedule_campaign",
    "Unschedule a scheduled campaign and return it to draft status",
    {
      campaign_id: z.string().describe("The campaign ID to unschedule"),
    },
    async ({ campaign_id }) => {
      try {
        await client.unscheduleCampaign(campaign_id);
        return { content: [{ type: "text", text: JSON.stringify({ success: true, message: `Campaign ${campaign_id} unscheduled.` }, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    }
  );
}
