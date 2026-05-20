import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CampaignMonitorClient } from "../client.js";

export function registerClientTools(
  server: McpServer,
  client: CampaignMonitorClient,
  defaultClientId = "",
  clientHint: string = ""
): void {
  server.tool(
    "get_clients",
    "List all clients accessible with the current API key",
    {},
    async () => {
      try {
        const result = await client.getClients();
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
    "get_client_details",
    "Get detailed information about a specific Campaign Monitor client",
    {
      client_id: z.string().describe(`Client ID${clientHint}`),
    },
    async ({ client_id }) => {
      try {
        const result = await client.getClientDetails(client_id);
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
    "create_client",
    "Create a new Campaign Monitor client",
    {
      company_name: z.string().describe("Company name for the new client"),
      country: z.string().describe("Country name (use get_countries for valid values)"),
      timezone: z
        .string()
        .describe("Timezone name (use get_timezones for valid values)"),
    },
    async ({ company_name, country, timezone }) => {
      try {
        const result = await client.createClient({
          CompanyName: company_name,
          Country: country,
          TimeZone: timezone,
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
    "delete_client",
    "Delete a Campaign Monitor client",
    {
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ client_id }) => {
      try {
        await client.deleteClient(client_id ?? defaultClientId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Client ${client_id ?? defaultClientId} deleted.`,
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
    "get_lists_for_email",
    "Get all lists a particular email address is subscribed to for a client",
    {
      email: z.string().email().describe("The subscriber's email address"),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ email, client_id }) => {
      try {
        const result = await client.getListsForEmail(
          client_id ?? defaultClientId,
          email
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
    "get_suppression_list",
    "Get the suppression list for a client",
    {
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ client_id, page, page_size }) => {
      try {
        const result = await client.getSuppressionList(
          client_id ?? defaultClientId,
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
    "add_to_suppression_list",
    "Add email addresses to a client's suppression list",
    {
      emails: z
        .string()
        .describe("Comma-separated list of email addresses to suppress"),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ emails, client_id }) => {
      try {
        const emailArray = emails
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        const result = await client.addToSuppressionList(
          client_id ?? defaultClientId,
          emailArray
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
    "remove_from_suppression_list",
    "Remove an email address from a client's suppression list",
    {
      email: z.string().email().describe("Email address to unsuppress"),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ email, client_id }) => {
      try {
        const result = await client.removeFromSuppressionList(
          client_id ?? defaultClientId,
          email
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
    "get_client_people",
    "List all people with access to a client",
    {
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ client_id }) => {
      try {
        const result = await client.getClientPeople(
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
    "add_client_person",
    "Add a person to a client with a specified access level",
    {
      email: z.string().email().describe("Person's email address"),
      name: z.string().describe("Person's display name"),
      access_level: z
        .number()
        .int()
        .describe("Access level (e.g. 1023 for full access)"),
      password: z.string().describe("Login password for this person"),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ email, name, access_level, password, client_id }) => {
      try {
        const result = await client.addClientPerson(
          client_id ?? defaultClientId,
          {
            EmailAddress: email,
            Name: name,
            AccessLevel: access_level,
            Password: password,
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
    "update_client_person",
    "Update a person's details or access level for a client",
    {
      current_email: z.string().email().describe("Person's current email address"),
      new_email: z.string().email().describe("Person's new email address"),
      name: z.string().describe("Person's display name"),
      access_level: z
        .number()
        .int()
        .describe("Access level (e.g. 1023 for full access)"),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ current_email, new_email, name, access_level, client_id }) => {
      try {
        const result = await client.updateClientPerson(
          client_id ?? defaultClientId,
          current_email,
          {
            EmailAddress: new_email,
            Name: name,
            AccessLevel: access_level,
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
    "delete_client_person",
    "Remove a person's access to a client",
    {
      email: z.string().email().describe("Person's email address"),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ email, client_id }) => {
      try {
        await client.deleteClientPerson(client_id ?? defaultClientId, email);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Person ${email} removed from client.`,
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
    "get_client_primary_contact",
    "Get the primary contact for a client",
    {
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ client_id }) => {
      try {
        const result = await client.getClientPrimaryContact(
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
    "set_client_primary_contact",
    "Set the primary contact for a client",
    {
      email: z.string().email().describe("Email of the new primary contact"),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ email, client_id }) => {
      try {
        const result = await client.setClientPrimaryContact(
          client_id ?? defaultClientId,
          email
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
    "get_client_tags",
    "Get all campaign tags for a client",
    {
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ client_id }) => {
      try {
        const result = await client.getClientTags(
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
    "get_sending_domains",
    "Get all sending domains for a client",
    {
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ client_id }) => {
      try {
        const result = await client.getSendingDomains(
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
    "add_sending_domain",
    "Add a sending domain for a client",
    {
      domain: z.string().describe("The domain name to add (e.g. 'example.com')"),
      selector: z
        .string()
        .optional()
        .describe("The DKIM selector (e.g. 'cm')"),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ domain, selector, client_id }) => {
      try {
        const result = await client.addSendingDomain(
          client_id ?? defaultClientId,
          domain,
          selector
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
    "delete_sending_domain",
    "Delete a sending domain from a client",
    {
      domain: z
        .string()
        .describe("The domain name to delete (e.g. 'example.com')"),
      selector: z
        .string()
        .describe("The DKIM selector (e.g. 'cm')"),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ domain, selector, client_id }) => {
      try {
        await client.deleteSendingDomain(
          client_id ?? defaultClientId,
          domain,
          selector
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { success: true, message: `Domain ${domain} deleted.` },
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
    "transfer_credits",
    "Transfer credits to or from a client",
    {
      credits: z
        .number()
        .int()
        .describe(
          "Number of credits to transfer (positive to add, negative to remove)"
        ),
      can_use_my_credits: z
        .boolean()
        .describe(
          "Whether the client can use account-level credits when theirs run out"
        ),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ credits, can_use_my_credits, client_id }) => {
      try {
        const result = await client.transferCredits(
          client_id ?? defaultClientId,
          {
            Credits: credits,
            CanUseMyCreditsWhenTheyRunOut: can_use_my_credits,
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
    "update_client_basics",
    "Update a client's basic details including company name, country, and timezone",
    {
      client_id: z.string().optional().describe(`Client ID${clientHint}`),
      company_name: z.string().describe("Company name"),
      country: z.string().describe("Country name (use get_countries for valid values)"),
      timezone: z.string().describe("Timezone (use get_timezones for valid values)"),
    },
    async ({ client_id, company_name, country, timezone }) => {
      try {
        const clientId = client_id || defaultClientId;
        if (!clientId) throw new Error("client_id is required");
        const result = await client.updateClientBasics(clientId, { CompanyName: company_name, Country: country, TimeZone: timezone });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    }
  );

  server.tool(
    "set_client_payg_billing",
    "Configure pay-as-you-go billing for a client",
    {
      client_id: z.string().optional().describe(`Client ID${clientHint}`),
      currency: z.string().describe("Currency code e.g. USD, AUD"),
      can_purchase_credits: z.boolean().describe("Whether the client can purchase credits"),
      client_pays: z.boolean().describe("Whether the client pays directly"),
      markup_percentage: z.number().describe("Markup percentage (0-100)"),
    },
    async ({ client_id, currency, can_purchase_credits, client_pays, markup_percentage }) => {
      try {
        const clientId = client_id || defaultClientId;
        if (!clientId) throw new Error("client_id is required");
        const result = await client.setClientPaygBilling(clientId, { Currency: currency, CanPurchaseCredits: can_purchase_credits, ClientPays: client_pays, MarkupPercentage: markup_percentage });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    }
  );

  server.tool(
    "set_client_monthly_billing",
    "Configure monthly billing for a client",
    {
      client_id: z.string().optional().describe(`Client ID${clientHint}`),
      currency: z.string().describe("Currency code e.g. USD, AUD"),
      client_pays: z.boolean().describe("Whether the client pays directly"),
      markup_percentage: z.number().describe("Markup percentage (0-100)"),
      monthly_scheme: z.string().optional().describe("Monthly scheme name"),
    },
    async ({ client_id, currency, client_pays, markup_percentage, monthly_scheme }) => {
      try {
        const clientId = client_id || defaultClientId;
        if (!clientId) throw new Error("client_id is required");
        const result = await client.setClientMonthlyBilling(clientId, { Currency: currency, ClientPays: client_pays, MarkupPercentage: markup_percentage, MonthlyScheme: monthly_scheme });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    }
  );

  server.tool(
    "copy_sending_domain",
    "Copy a verified sending domain to another client",
    {
      client_id: z.string().optional().describe(`Client ID${clientHint}`),
      domain: z.string().describe("The domain to copy"),
      selector: z.string().describe("The DKIM selector (e.g. 'cm')"),
      destination_client_id: z.string().describe(`Client ID${clientHint}`),
    },
    async ({ client_id, domain, selector, destination_client_id }) => {
      try {
        const clientId = client_id || defaultClientId;
        if (!clientId) throw new Error("client_id is required");
        const result = await client.copySendingDomain(clientId, domain, selector, destination_client_id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    }
  );

  server.tool(
    "authenticate_sending_domain",
    "Verify DNS records and authenticate a sending domain for a client",
    {
      client_id: z.string().optional().describe(`Client ID${clientHint}`),
      domain: z.string().describe("The domain to authenticate"),
      selector: z.string().describe("The DKIM selector (e.g. 'cm')"),
    },
    async ({ client_id, domain, selector }) => {
      try {
        const clientId = client_id || defaultClientId;
        if (!clientId) throw new Error("client_id is required");
        const result = await client.authenticateSendingDomain(clientId, domain, selector);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    }
  );
}
