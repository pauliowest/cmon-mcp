import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CampaignMonitorClient } from "../client.js";

export function registerTemplateTools(
  server: McpServer,
  client: CampaignMonitorClient,
  defaultClientId: string
): void {
  server.tool(
    "get_template",
    "Get details for an email template",
    {
      template_id: z.string().describe("The template ID"),
    },
    async ({ template_id }) => {
      try {
        const result = await client.getTemplateDetails(template_id);
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
    "create_template",
    "Create a new email template for a client",
    {
      name: z.string().describe("Template name"),
      client_id: z
        .string()
        .optional()
        .describe("Client ID (defaults to CM_CLIENT_ID env var)"),
      html_page_url: z
        .string()
        .url()
        .optional()
        .describe("URL to the HTML page for the template"),
      zip_file_url: z
        .string()
        .url()
        .optional()
        .describe("URL to a zip file containing template assets"),
    },
    async ({ name, client_id, html_page_url, zip_file_url }) => {
      try {
        const result = await client.createTemplate(
          client_id ?? defaultClientId,
          {
            Name: name,
            HtmlPageURL: html_page_url,
            ZipFileURL: zip_file_url,
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
    "update_template",
    "Update an existing email template",
    {
      template_id: z.string().describe("The template ID"),
      name: z.string().describe("New template name"),
      html_page_url: z
        .string()
        .url()
        .optional()
        .describe("URL to the HTML page for the template"),
      zip_file_url: z
        .string()
        .url()
        .optional()
        .describe("URL to a zip file containing template assets"),
    },
    async ({ template_id, name, html_page_url, zip_file_url }) => {
      try {
        const result = await client.updateTemplate(template_id, {
          Name: name,
          HtmlPageURL: html_page_url,
          ZipFileURL: zip_file_url,
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
    "delete_template",
    "Delete an email template",
    {
      template_id: z.string().describe("The template ID to delete"),
    },
    async ({ template_id }) => {
      try {
        await client.deleteTemplate(template_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Template ${template_id} deleted.`,
                },
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
    "copy_template",
    "Copy a template to another client",
    {
      template_id: z.string().describe("The template ID to copy"),
      client_id: z
        .string()
        .optional()
        .describe(
          "Destination client ID to copy the template to (defaults to CM_CLIENT_ID env var)"
        ),
    },
    async ({ template_id, client_id }) => {
      try {
        const result = await client.copyTemplate(
          template_id,
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
}
