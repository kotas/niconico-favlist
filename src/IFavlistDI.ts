/// <reference path="./service/ConfigService.ts" />
/// <reference path="./service/MylistService.ts" />
/// <reference path="./service/SettingsService.ts" />
/// <reference path="./service/SubscriptionService.ts" />

declare var DI: IFavlistDI;

interface IFavlistDI {
    getConfigService(): IConfigService;
    getMylistService(): IMylistService;
    getSettingsService(): ISettingsService;
    getSubscriptionService(): ISubscriptionService;
}
