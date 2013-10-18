/// <reference path="./config.ts" />
/// <reference path="../../../../vendor/monapt/monapt.ts" />

interface ConfigRepository {

    get(): monapt.Future<Config>;

    store(config: Config): void;

}
