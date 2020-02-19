interface Config {
  database: DatabaseConfig;
  bot: BotConfig;
}

interface DatabaseConfig {
  url: string;
  db: string;
  collection: string;
}

interface BotConfig {
  token: string;
  name: string;
}
