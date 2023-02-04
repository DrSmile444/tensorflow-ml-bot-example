export interface BotConfig {
  BOT_TOKEN: string;
}

export interface GoogleEnvironmentConfig {
  GOOGLE_SHEET_API_KEYS: string;
}

export type EnvironmentConfig = BotConfig & GoogleEnvironmentConfig;
