export interface AppInterface<Config extends Record<string, unknown>> {
  init(config: Config): void;
}
