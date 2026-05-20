import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CampaignMonitorClient } from "../client.js";

export function registerAccountTools(
  server: McpServer,
  client: CampaignMonitorClient
): void {
  server.tool(
    "get_billing_details",
    "Get account billing info and credits",
    {},
    async () => {
      try {
        const result = await client.getBillingDetails();
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
    "get_countries",
    "List all valid countries for Campaign Monitor",
    {},
    async () => {
      try {
        const result = await client.getCountries();
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
    "get_timezones",
    "List all valid timezones for Campaign Monitor",
    {},
    async () => {
      try {
        const result = await client.getTimezones();
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
    "get_system_date",
    "Get the current date/time in the account timezone",
    {},
    async () => {
      try {
        const result = await client.getSystemDate();
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
    "get_admins",
    "List all administrators for the account",
    {},
    async () => {
      try {
        const result = await client.getAdmins();
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
    "get_admin",
    "Get details for a specific administrator by email",
    {
      email: z.string().email().describe("The administrator's email address"),
    },
    async ({ email }) => {
      try {
        const result = await client.getAdmin(email);
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
    "add_admin",
    "Add a new administrator to the account",
    {
      email: z.string().email().describe("Administrator email address"),
      name: z.string().describe("Administrator display name"),
    },
    async ({ email, name }) => {
      try {
        const result = await client.addAdmin({
          EmailAddress: email,
          Name: name,
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
    "update_admin",
    "Update an existing administrator's details",
    {
      current_email: z
        .string()
        .email()
        .describe("The administrator's current email address"),
      new_email: z
        .string()
        .email()
        .describe("The administrator's new email address"),
      name: z.string().describe("The administrator's new display name"),
    },
    async ({ current_email, new_email, name }) => {
      try {
        const result = await client.updateAdmin(current_email, {
          EmailAddress: new_email,
          Name: name,
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
    "delete_admin",
    "Remove an administrator from the account",
    {
      email: z.string().email().describe("The administrator's email address"),
    },
    async ({ email }) => {
      try {
        await client.deleteAdmin(email);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { success: true, message: `Admin ${email} has been removed.` },
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
    "get_primary_contact",
    "Get the primary contact email for the account",
    {},
    async () => {
      try {
        const result = await client.getPrimaryContact();
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
    "set_primary_contact",
    "Set the primary contact for the account",
    {
      email: z
        .string()
        .email()
        .describe("Email address of the new primary contact"),
    },
    async ({ email }) => {
      try {
        const result = await client.setPrimaryContact(email);
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
