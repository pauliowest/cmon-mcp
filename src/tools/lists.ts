import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CampaignMonitorClient } from "../client.js";

export function registerListTools(
  server: McpServer,
  client: CampaignMonitorClient,
  defaultClientId: string,
  clientHint: string = ""
): void {
  server.tool(
    "get_lists",
    "List all subscriber lists for the Campaign Monitor client",
    {
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({ client_id }) => {
      try {
        const result = await client.getLists(client_id ?? defaultClientId);
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
    "create_list",
    "Create a new subscriber list",
    {
      title: z.string().describe("The name of the new list"),
      unsubscribe_setting: z
        .enum(["AllClientLists", "OnlyThisList"])
        .describe(
          "Whether unsubscribes apply to all client lists or only this list"
        ),
      confirmed_opt_in: z
        .boolean()
        .describe("Whether this list uses confirmed (double) opt-in"),
      unsubscribe_page: z
        .string()
        .url()
        .optional()
        .describe("URL for the unsubscribe confirmation page"),
      confirmation_success_page: z
        .string()
        .url()
        .optional()
        .describe("URL for the confirmation success page"),
      client_id: z
        .string()
        .optional()
        .describe(`Client ID${clientHint}`),
    },
    async ({
      title,
      unsubscribe_setting,
      confirmed_opt_in,
      unsubscribe_page,
      confirmation_success_page,
      client_id,
    }) => {
      try {
        const result = await client.createList(
          client_id ?? defaultClientId,
          {
            Title: title,
            UnsubscribeSetting: unsubscribe_setting,
            ConfirmedOptIn: confirmed_opt_in,
            UnsubscribePage: unsubscribe_page,
            ConfirmationSuccessPage: confirmation_success_page,
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
    "get_list_details",
    "Get details of a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
    },
    async ({ list_id }) => {
      try {
        const result = await client.getListDetails(list_id);
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
    "update_list",
    "Update settings for a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
      title: z.string().describe("New name for the list"),
      unsubscribe_setting: z
        .enum(["AllClientLists", "OnlyThisList"])
        .describe(
          "Whether unsubscribes apply to all client lists or only this list"
        ),
      confirmed_opt_in: z
        .boolean()
        .describe("Whether this list uses confirmed (double) opt-in"),
      unsubscribe_page: z
        .string()
        .url()
        .optional()
        .describe("URL for the unsubscribe confirmation page"),
      confirmation_success_page: z
        .string()
        .url()
        .optional()
        .describe("URL for the confirmation success page"),
    },
    async ({
      list_id,
      title,
      unsubscribe_setting,
      confirmed_opt_in,
      unsubscribe_page,
      confirmation_success_page,
    }) => {
      try {
        const result = await client.updateList(list_id, {
          Title: title,
          UnsubscribeSetting: unsubscribe_setting,
          ConfirmedOptIn: confirmed_opt_in,
          UnsubscribePage: unsubscribe_page,
          ConfirmationSuccessPage: confirmation_success_page,
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
    "delete_list",
    "Delete a subscriber list",
    {
      list_id: z.string().describe("The list ID to delete"),
    },
    async ({ list_id }) => {
      try {
        await client.deleteList(list_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { success: true, message: `List ${list_id} deleted.` },
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
    "get_active_subscribers",
    "Get a paginated list of active subscribers for a list",
    {
      list_id: z.string().describe("The list ID"),
      date: z
        .string()
        .optional()
        .describe("Return subscribers added after this date (ISO 8601)"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ list_id, date, page, page_size }) => {
      try {
        const result = await client.getActiveSubscribers(
          list_id,
          date,
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
    "get_unsubscribed_subscribers",
    "Get a paginated list of unsubscribed subscribers for a list",
    {
      list_id: z.string().describe("The list ID"),
      date: z
        .string()
        .optional()
        .describe("Return subscribers who unsubscribed after this date (ISO 8601)"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ list_id, date, page, page_size }) => {
      try {
        const result = await client.getUnsubscribedSubscribers(
          list_id,
          date,
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
    "get_list_stats",
    "Get statistics for a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
    },
    async ({ list_id }) => {
      try {
        const result = await client.getListStats(list_id);
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
    "get_segments",
    "Get all segments for a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
    },
    async ({ list_id }) => {
      try {
        const result = await client.getSegments(list_id);
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
    "get_unconfirmed_subscribers",
    "Get a paginated list of unconfirmed subscribers for a list",
    {
      list_id: z.string().describe("The list ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ list_id, page, page_size }) => {
      try {
        const result = await client.getUnconfirmedSubscribers(
          list_id,
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
    "get_deleted_subscribers",
    "Get a paginated list of deleted subscribers for a list",
    {
      list_id: z.string().describe("The list ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ list_id, page, page_size }) => {
      try {
        const result = await client.getDeletedSubscribers(
          list_id,
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
    "get_custom_fields",
    "Get all custom fields for a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
    },
    async ({ list_id }) => {
      try {
        const result = await client.getCustomFields(list_id);
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
    "create_custom_field",
    "Create a new custom field for a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
      field_name: z.string().describe("Name of the custom field"),
      data_type: z
        .string()
        .describe(
          "Data type: 'Text', 'Number', 'MultiSelectOne', 'MultiSelectMany', 'Date', or 'Country'"
        ),
      options: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of option values (required for MultiSelectOne and MultiSelectMany types)"
        ),
      visible_in_preference_center: z
        .boolean()
        .optional()
        .describe("Whether the field is visible in the subscriber preference center"),
    },
    async ({ list_id, field_name, data_type, options, visible_in_preference_center }) => {
      try {
        const optionsArray = options
          ? options.split(",").map((o) => o.trim()).filter(Boolean)
          : undefined;
        const result = await client.createCustomField(list_id, {
          FieldName: field_name,
          DataType: data_type,
          Options: optionsArray,
          VisibleInPreferenceCenter: visible_in_preference_center,
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
    "update_custom_field",
    "Update an existing custom field on a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
      field_key: z
        .string()
        .describe("The custom field key (e.g. '[fieldname]')"),
      field_name: z.string().describe("New name for the custom field"),
      visible_in_preference_center: z
        .boolean()
        .describe("Whether to show this field in the preference center"),
    },
    async ({ list_id, field_key, field_name, visible_in_preference_center }) => {
      try {
        const result = await client.updateCustomField(list_id, field_key, {
          FieldName: field_name,
          VisibleInPreferenceCenter: visible_in_preference_center,
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
    "delete_custom_field",
    "Delete a custom field from a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
      field_key: z
        .string()
        .describe("The custom field key (e.g. '[fieldname]')"),
    },
    async ({ list_id, field_key }) => {
      try {
        await client.deleteCustomField(list_id, field_key);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Custom field ${field_key} deleted from list ${list_id}.`,
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
    "create_webhook",
    "Create a webhook for a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
      url: z.string().url().describe("The URL to call when the webhook fires"),
      events: z
        .string()
        .describe(
          "Comma-separated list of events: 'Subscribe', 'Deactivate', 'Update'"
        ),
      payload_format: z
        .string()
        .describe("Payload format: 'json' or 'xml'"),
    },
    async ({ list_id, url, events, payload_format }) => {
      try {
        const eventArray = events
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        const result = await client.createWebhook(list_id, {
          Events: eventArray,
          Url: url,
          PayloadFormat: payload_format,
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
    "test_webhook",
    "Send a test payload to a webhook",
    {
      list_id: z.string().describe("The list ID"),
      webhook_id: z.string().describe("The webhook ID"),
    },
    async ({ list_id, webhook_id }) => {
      try {
        const result = await client.testWebhook(list_id, webhook_id);
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
    "delete_webhook",
    "Delete a webhook from a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
      webhook_id: z.string().describe("The webhook ID to delete"),
    },
    async ({ list_id, webhook_id }) => {
      try {
        await client.deleteWebhook(list_id, webhook_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Webhook ${webhook_id} deleted from list ${list_id}.`,
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
    "activate_webhook",
    "Activate a webhook for a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
      webhook_id: z.string().describe("The webhook ID to activate"),
    },
    async ({ list_id, webhook_id }) => {
      try {
        const result = await client.activateWebhook(list_id, webhook_id);
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
    "deactivate_webhook",
    "Deactivate a webhook for a subscriber list",
    {
      list_id: z.string().describe("The list ID"),
      webhook_id: z.string().describe("The webhook ID to deactivate"),
    },
    async ({ list_id, webhook_id }) => {
      try {
        const result = await client.deactivateWebhook(list_id, webhook_id);
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
    "update_custom_field_options",
    "Update the options available for a multi-select or select custom field",
    {
      list_id: z.string().describe("The list ID"),
      field_key: z.string().describe("The custom field key (e.g. [myfield])"),
      options: z.string().describe("Comma-separated list of option values"),
      keep_existing: z.boolean().optional().describe("Whether to keep existing options (default true)"),
    },
    async ({ list_id, field_key, options, keep_existing }) => {
      try {
        const optionsArray = options.split(",").map((o) => o.trim());
        const result = await client.updateCustomFieldOptions(list_id, field_key, optionsArray, keep_existing ?? true);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    }
  );
}
