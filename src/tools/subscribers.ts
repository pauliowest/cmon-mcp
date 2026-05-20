import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CampaignMonitorClient } from "../client.js";

const consentToTrackSchema = z
  .enum(["Yes", "No", "Unchanged"])
  .describe("Consent to track: 'Yes', 'No', or 'Unchanged'");

const customFieldSchema = z.object({
  Key: z.string().describe("Custom field key"),
  Value: z.string().describe("Custom field value"),
});

export function registerSubscriberTools(
  server: McpServer,
  client: CampaignMonitorClient
): void {
  server.tool(
    "add_subscriber",
    "Add a subscriber to a list",
    {
      list_id: z.string().describe("The list ID"),
      email_address: z.string().email().describe("Subscriber email address"),
      consent_to_track: consentToTrackSchema,
      name: z.string().optional().describe("Subscriber display name"),
      resubscribe: z
        .boolean()
        .optional()
        .describe(
          "If true, resubscribe the contact if they were previously unsubscribed"
        ),
      custom_fields: z
        .array(customFieldSchema)
        .optional()
        .describe("Custom field values"),
    },
    async ({
      list_id,
      email_address,
      consent_to_track,
      name,
      resubscribe,
      custom_fields,
    }) => {
      try {
        const result = await client.addSubscriber(list_id, {
          EmailAddress: email_address,
          Name: name,
          CustomFields: custom_fields,
          Resubscribe: resubscribe,
          ConsentToTrack: consent_to_track,
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
    "get_subscriber",
    "Get details for a subscriber in a list",
    {
      list_id: z.string().describe("The list ID"),
      email: z.string().email().describe("Subscriber email address"),
    },
    async ({ list_id, email }) => {
      try {
        const result = await client.getSubscriberDetails(list_id, email);
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
    "update_subscriber",
    "Update a subscriber's details in a list",
    {
      list_id: z.string().describe("The list ID"),
      email: z.string().email().describe("Current subscriber email address"),
      new_email: z
        .string()
        .email()
        .optional()
        .describe("New email address for the subscriber"),
      name: z.string().optional().describe("New display name"),
      custom_fields: z
        .array(customFieldSchema)
        .optional()
        .describe("Custom field values to update"),
      consent_to_track: consentToTrackSchema.optional(),
    },
    async ({
      list_id,
      email,
      new_email,
      name,
      custom_fields,
      consent_to_track,
    }) => {
      try {
        const result = await client.updateSubscriber(list_id, email, {
          EmailAddress: new_email,
          Name: name,
          CustomFields: custom_fields,
          ConsentToTrack: consent_to_track,
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
    "unsubscribe_subscriber",
    "Unsubscribe a subscriber from a list",
    {
      list_id: z.string().describe("The list ID"),
      email: z.string().email().describe("Subscriber email address"),
    },
    async ({ list_id, email }) => {
      try {
        await client.unsubscribeSubscriber(list_id, email);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `${email} has been unsubscribed from list ${list_id}.`,
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
    "delete_subscriber",
    "Permanently delete a subscriber from a list",
    {
      list_id: z.string().describe("The list ID"),
      email: z.string().email().describe("Subscriber email address"),
    },
    async ({ list_id, email }) => {
      try {
        await client.deleteSubscriber(list_id, email);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `${email} has been permanently deleted from list ${list_id}.`,
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
    "get_subscriber_history",
    "Get the campaign history for a subscriber in a list",
    {
      list_id: z.string().describe("The list ID"),
      email: z.string().email().describe("Subscriber email address"),
    },
    async ({ list_id, email }) => {
      try {
        const result = await client.getSubscriberHistory(list_id, email);
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
    "import_subscribers",
    "Bulk import subscribers into a list",
    {
      list_id: z.string().describe("The list ID"),
      subscribers: z
        .array(
          z.object({
            EmailAddress: z.string().email(),
            Name: z.string().optional(),
            CustomFields: z
              .array(customFieldSchema)
              .optional(),
            ConsentToTrack: z.enum(["Yes", "No", "Unchanged"]),
          })
        )
        .describe("Array of subscriber objects to import"),
      resubscribe: z
        .boolean()
        .optional()
        .describe(
          "If true, resubscribe previously unsubscribed contacts"
        ),
      queue_subscription_based_auto_responders: z
        .boolean()
        .optional()
        .describe("Queue subscription-based auto-responders for imported subscribers"),
    },
    async ({
      list_id,
      subscribers,
      resubscribe,
      queue_subscription_based_auto_responders,
    }) => {
      try {
        const result = await client.importSubscribers(
          list_id,
          subscribers,
          resubscribe,
          queue_subscription_based_auto_responders
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
}
