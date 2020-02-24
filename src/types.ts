interface Config {
  database: DatabaseConfig;
  bot: BotConfig;
}

interface DatabaseConfig {
  url: string;
  db: string;
  collections: any;
}

interface BotConfig {
  token: string;
  name: string;
}
