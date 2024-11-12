import { createClient } from "@clickhouse/client";
import { env } from "../../env";

export type ClickhouseClientType = ReturnType<typeof createClient>;

export const clickhouseClient = createClient({
  url: env.CLICKHOUSE_URL,
  username: env.CLICKHOUSE_USER,
  password: env.CLICKHOUSE_PASSWORD,
  database: "default",
  clickhouse_settings: {
    async_insert: 1,
    wait_for_async_insert: 1, // if disabled, we won't get errors from clickhouse
  },
});

/**
 * Accepts a JavaScript date and returns the DateTime in format YYYY-MM-DD HH:MM:SS
 */

export const convertDateToClickhouseDateTime = (date: Date): string => {
  // 2024-11-06T20:37:00.000Z -> 2024-11-06 21:37:00
  return date.toISOString().slice(0, 19).replace("T", " ");
};