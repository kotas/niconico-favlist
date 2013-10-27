/// <reference path="../IFavlistDI.ts" />
/// <reference path="../util/Storage.ts" />
/// <reference path="../util/UrlFetcher.ts" />
/// <reference path="../model/ConfigStorage.ts" />
/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/MylistFeedFactory.ts" />
/// <reference path="../model/UpdateInterval.ts" />
/// <reference path="../userscript/UserScriptSubscriptionService.ts" />

module userscript {

    export class DI implements IFavlistDI {

        private storage: util.IStorage;
        private urlFetcher: util.IUrlFetcher;

        private configStorage: IConfigStorage;
        private mylistCollectionStorage: IMylistCollectionStorage;
        private mylistFeedFactory: IMylistFeedFactory;
        private updateInterval: IUpdateInterval;

        private configService: IConfigService;
        private mylistService: IMylistService;
        private subscriptionService: ISubscriptionService;

        private getStorage(): util.IStorage {
            return this.storage || (this.storage = util.chooseStorage());
        }

        private getUrlFetcher(): util.IUrlFetcher {
            return this.urlFetcher || (this.urlFetcher = util.chooseUrlFetcher());
        }

        private getConfigStorage(): IConfigStorage {
            return this.configStorage || (
                this.configStorage = new ConfigStorage(this.getStorage())
            );
        }

        private getMylistCollectionStorage(): IMylistCollectionStorage {
            return this.mylistCollectionStorage || (
                this.mylistCollectionStorage = new MylistCollectionStorage(this.getStorage())
            );
        }

        private getMylistFeedFactory(): IMylistFeedFactory {
            return this.mylistFeedFactory || (
                this.mylistFeedFactory = new MylistFeedFactory(this.getUrlFetcher())
            );
        }

        private getUpdateInterval(): IUpdateInterval {
            return this.updateInterval || (
                this.updateInterval = new UpdateInterval(this.getStorage(), this.getConfigService())
            );
        }

        getConfigService(): IConfigService {
            return this.configService || (
                this.configService = new ConfigService(this.getConfigStorage())
            );
        }

        getMylistService(): IMylistService {
            return this.mylistService || (
                this.mylistService = new MylistService(
                    this.getMylistCollectionStorage(),
                    this.getUpdateInterval(),
                    this.getMylistFeedFactory()
                )
            );
        }

        getSubscriptionService(): ISubscriptionService {
            return this.subscriptionService || (
                this.subscriptionService = new UserScriptSubscriptionService(
                    this.getMylistCollectionStorage(),
                    this.getUpdateInterval()
                )
            );
        }

    }

}
