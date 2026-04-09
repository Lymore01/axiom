import type Axeom from "@axeom/core";
import { createPinoLogger, type Logger } from "@axeom/logger";

export const loggerPlugin = <
  T extends Record<string, any>,
  D extends Record<string, any>,
>(
  customLogger?: Logger,
) => {
  return (app: Axeom<T, D>) => {
    const logger = customLogger || createPinoLogger();
    return app.decorate({ logger });
  };
};
