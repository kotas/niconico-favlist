/// <reference path="./service/ConfigService.ts" />
/// <reference path="./service/MylistService.ts" />
/// <reference path="./service/SubscriptionService.ts" />
/// <reference path="./controller/IFavlistApp.ts" />

interface IFavlistDI {
    getConfigService(): IConfigService;
    getMylistService(): IMylistService;
    getSubscriptionService(): ISubscriptionService;
    getFavlistApp(): IFavlistApp;
}
