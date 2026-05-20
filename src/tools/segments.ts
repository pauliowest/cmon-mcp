import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CampaignMonitorClient } from "../client.js";

export function registerSegmentTools(
  server: McpServer,
  client: CampaignMonitorClient
): void {
  server.tool(
    "create_segment",
    "Create a new segment for a subscriber list",
    {
      list_id: z.string().describe("The list ID to create the segment for"),
      title: z.string().describe("The segment title"),
      rule_groups: z
        .string()
        .optional()
        .describe("Rule groups as a JSON string (array of rule group objects)"),
    },
    async ({ list_id, title, rule_groups }) => {
      try {
        let parsedRuleGroups: object[] | undefined;
        if (rule_groups) {
          try {
            parsedRuleGroups = JSON.parse(rule_groups) as object[];
          } catch {
            return {
              content: [
                {
                  type: "text",
                  text: "Error: rule_groups must be a valid JSON string",
                },
              ],
              isError: true,
            };
          }
        }
        const result = await client.createSegment(list_id, {
          Title: title,
          RuleGroups: parsedRuleGroups,
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
    "update_segment",
    "Update an existing segment's title and/or rules",
    {
      segment_id: z.string().describe("The segment ID"),
      title: z.string().describe("New segment title"),
      rule_groups: z
        .string()
        .optional()
        .describe("Rule groups as a JSON string (array of rule group objects)"),
    },
    async ({ segment_id, title, rule_groups }) => {
      try {
        let parsedRuleGroups: object[] | undefined;
        if (rule_groups) {
          try {
            parsedRuleGroups = JSON.parse(rule_groups) as object[];
          } catch {
            return {
              content: [
                {
                  type: "text",
                  text: "Error: rule_groups must be a valid JSON string",
                },
              ],
              isError: true,
            };
          }
        }
        const result = await client.updateSegment(segment_id, {
          Title: title,
          RuleGroups: parsedRuleGroups,
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
    "get_segment_details",
    "Get details for a segment including its rules",
    {
      segment_id: z.string().describe("The segment ID"),
    },
    async ({ segment_id }) => {
      try {
        const result = await client.getSegmentDetails(segment_id);
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
    "delete_segment",
    "Delete a segment",
    {
      segment_id: z.string().describe("The segment ID to delete"),
    },
    async ({ segment_id }) => {
      try {
        await client.deleteSegment(segment_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Segment ${segment_id} deleted.`,
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
    "add_segment_rule_group",
    "Add a rule group to an existing segment",
    {
      segment_id: z.string().describe("The segment ID"),
      rule_group: z
        .string()
        .describe("Rule group as a JSON string (a single rule group object)"),
    },
    async ({ segment_id, rule_group }) => {
      try {
        let parsed: object;
        try {
          parsed = JSON.parse(rule_group) as object;
        } catch {
          return {
            content: [
              {
                type: "text",
                text: "Error: rule_group must be a valid JSON string",
              },
            ],
            isError: true,
          };
        }
        const result = await client.addSegmentRuleGroup(segment_id, parsed);
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
    "clear_segment_rules",
    "Remove all rules from a segment",
    {
      segment_id: z.string().describe("The segment ID"),
    },
    async ({ segment_id }) => {
      try {
        await client.clearSegmentRules(segment_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `All rules cleared from segment ${segment_id}.`,
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
    "get_segment_subscribers",
    "Get active subscribers matching a segment's rules",
    {
      segment_id: z.string().describe("The segment ID"),
      page: z.number().int().positive().optional().describe("Page number"),
      page_size: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of results per page"),
    },
    async ({ segment_id, page, page_size }) => {
      try {
        const result = await client.getSegmentSubscribers(
          segment_id,
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
}
