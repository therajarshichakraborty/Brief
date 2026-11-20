import { env } from "@news-aggrigator/env";
import { pino } from "pino";

export const logger = pino({
  level: env.LOG_LEVEL,
  ...(env.NODE_ENV === "development" && {
    transport: { target: "pino-pretty", options: { colorize: true, ignore: "pid,hostname" } },
  }),
});
