/// <reference path="./IFavlistDI.ts" />
/// <reference path="./util/DI.ts" />

var DI: IFavlistDI = util.DI;

DI.register('Storage', (): util.IStorage => {
    return util.chooseStorage();
});

DI.register('UrlFetcher', (): util.IUrlFetcher => {
    return util.chooseUrlFetcher();
});


DI.register('Config', (): IConfig => {
    return DI.resolve('ConfigStorage').get();
});

DI.register('ConfigStorage', (): IConfigStorage => {
    return new ConfigStorage(DI.resolve('Storage'));
});

DI.register('MylistCollectionStorage', (): IMylistCollectionStorage => {
    return new MylistCollectionStorage(DI.resolve('Storage'));
});

DI.register('MylistCollectionUpdater', (): IMylistCollectionUpdater => {
    return new MylistCollectionUpdater(DI.resolve('UpdateInterval'), DI.resolve('MylistFeedFactory'));
});

DI.register('MylistFeedFactory', (): IMylistFeedFactory => {
    return new MylistFeedFactory(DI.resolve('UrlFetcher'), DI.resolve('Config').getUserAgent());
});

DI.register('UpdateInterval', (): IUpdateInterval => {
    return new UpdateInterval(DI.resolve('Storage'), DI.resolve('Config'));
});


DI.register('FavlistApp', (): IFavlistApp => {
    return new FavlistApp();
});

DI.register('FavlistController', (): IFavlistController => {
    return new FavlistController(
        DI.resolve('Config'),
        DI.resolve('ConfigStorage'),
        DI.resolve('MylistCollectionStorage'),
        DI.resolve('MylistCollectionUpdater')
    );
});

DI.register('SubscribeController', (): ISubscribeController => {
    return new SubscribeController(
        DI.resolve('MylistCollectionStorage'),
        DI.resolve('UpdateInterval')
    );
});
