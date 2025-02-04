import { createActionsPlugin } from "@ubiquity-os/plugin-sdk";
import { LogLevel } from "@ubiquity-os/ubiquity-os-logger";
import { runPlugin } from "./plugin";
import { Env, envSchema } from "./types/env";
import { PluginSettings, pluginSettingsSchema } from "./types/plugin-input";
import { SupportedEvents } from "./types";
import { createAdapters } from "./adapters";

createActionsPlugin<PluginSettings, Env, null, SupportedEvents>(
  (context) => {
    return runPlugin({
      ...context,
      adapters: {} as ReturnType<typeof createAdapters>,
    });
  },
  {
    logLevel: (process.env.LOG_LEVEL as LogLevel) ?? "info",
    settingsSchema: pluginSettingsSchema,
    envSchema: envSchema,
    ...(process.env.KERNEL_PUBLIC_KEY && { kernelPublicKey: process.env.KERNEL_PUBLIC_KEY }),
    postCommentOnError: true,
  }
).catch((error) => {
  console.error(error);
  process.exit(1);
});
