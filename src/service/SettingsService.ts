/// <reference path="./ConfigService.ts" />
/// <reference path="./MylistService.ts" />
/// <reference path="../model/ConfigSerializer.ts" />
/// <reference path="../model/MylistCollectionSerializer.ts" />
/// <reference path="../util/Event.ts" />
/// <reference path="../util/OPML.ts" />

interface ISettingsService {
    onUpdate: util.IEvent<void>;
    onUpdateMylist: util.IEvent<{ mylist: Mylist }>;
    onImport: util.IEvent<void>;
    getConfig(): IConfig;
    getMylistCollection(): MylistCollection;
    updateSettings(settings: ISettings): void;
    exportString(): string;
    importString(settings: string): void;
    exportOPML(): string;
}

interface ISettings {
    configSettings: IConfigSetting;
    mylistSettings: IMylistSetting[];
}

interface IConfigSetting {
    checkInterval: number;
    maxNewVideos: number;
    hideCheckedList: boolean;
    orderDescendant: boolean;
}

interface IMylistSetting {
    mylistId: MylistId;
    title: string;
}

class SettingsService implements ISettingsService {

    onUpdate = new util.Event<void>();
    onUpdateMylist = new util.Event<{ mylist: Mylist }>();
    onImport = new util.Event<void>();

    private config: IConfig;
    private mylists: MylistCollection;

    constructor(
        private configSerivce: IConfigService,
        private mylistService: IMylistService
    ) {
        this.setEventHandlersForConfigService();
        this.setEventHandlersForMylistService();

        this.config = this.configSerivce.getConfig();
        this.mylists = this.mylistService.getMylistCollection();
    }

    private setEventHandlersForConfigService() {
        this.configSerivce.onUpdate.addListener(() => {
            this.config = this.configSerivce.getConfig();
            this.onUpdate.trigger(null);
        });
    }

    private setEventHandlersForMylistService() {
        this.mylistService.onUpdate.addListener(() => {
            this.mylists = this.mylistService.getMylistCollection();
            this.onUpdate.trigger(null);
        });
        this.mylistService.onUpdateMylist.addListener((args) => {
            this.mylists = this.mylistService.getMylistCollection();
            this.onUpdateMylist.trigger(args);
        });
    }

    getConfig(): IConfig {
        return this.config;
    }

    getMylistCollection(): MylistCollection {
        return this.mylists;
    }

    updateSettings(settings: ISettings): void {
        this.setConfigSettings(settings.configSettings);
        this.setMylistSettings(settings.mylistSettings);
    }

    private setConfigSettings(settings: IConfigSetting): void {
        var config = new Config(
            settings.checkInterval,
            settings.maxNewVideos,
            settings.hideCheckedList,
            settings.orderDescendant
        );
        this.configSerivce.setConfig(config);
    }

    private setMylistSettings(settings: IMylistSetting[]): void {
        var newMylists: Mylist[] = [];
        settings.forEach((mylistSetting: IMylistSetting) => {
            var mylist: Mylist = this.mylists.get(mylistSetting.mylistId);
            if (mylist) {
                mylist.setOverrideTitle(mylistSetting.title);
                newMylists.push(mylist);
            }
        });
        this.mylistService.setMylists(newMylists);
    }

    exportString(): string {
        var configSerializer = new ConfigSerializer();
        var configSerialized = configSerializer.serialize(this.config);

        var mylistSerializer = new MylistCollectionSerializer();
        var mylistSerialized = mylistSerializer.serialize(this.mylists);

        return configSerialized + '|' + mylistSerialized;
    }

    importString(settings: string): void {
        var data = settings && settings.split('|');
        if (!data || data.length !== 2) {
            throw new Error('不正な形式です');
        }

        try {
            var configSerializer = new ConfigSerializer();
            this.config = configSerializer.unserialize(data[0]);

            var mylistSerializer = new MylistCollectionSerializer();
            this.mylists = mylistSerializer.unserialize(data[1]);
        } catch (e) {
            throw new Error('インポートできません: ' + (e.message || e));
        }

        this.onUpdate.trigger(null);
        this.onImport.trigger(null);
    }

    exportOPML(): string {
        var opml = new util.OPMLDocument('NicoNicoFavlist Subscriptions');
        var outline = new util.OPMLOutline('NicoNicoFavlist');
        this.mylists.getMylists().forEach((mylist: Mylist) => {
            outline.addOutline(new util.OPMLFeed(mylist.getOriginalTitle(), mylist.getURL(), mylist.getFeedURL()));
        });
        opml.addOutline(outline);
        return opml.toString();
    }

}
