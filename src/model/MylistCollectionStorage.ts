/// <reference path="../util/Storage.ts" />
/// <reference path="./MylistCollection.ts" />
/// <reference path="./Video.ts" />

declare function escape(s: string): string;
declare function unescape(s: string): string;

interface IMylistCollectionStorage {
    get(): MylistCollection;
    store(mylistCollection: MylistCollection): void;
}

class MylistCollectionStorage implements IMylistCollectionStorage {

    constructor(private storage: util.IStorage) {}

    get(): MylistCollection {
        var mylists: Mylist[] = this.unserializeMylists(this.storage.get('favlist'));
        return new MylistCollection(mylists);
    }

    store(mylistCollection: MylistCollection): void {
        this.storage.set('favlist', this.serializeMylists(mylistCollection.getMylists()));
    }

    private unserializeMylists(serialized: string): Mylist[] {
        return serialized ? serialized.split('#').map(s => this.unserializeMylist(s)) : [];
    }

    private serializeMylists(mylists: Mylist[]): string {
        return mylists.map(mylist => this.serializeMylist(mylist)).join('#');
    }

    private unserializeMylist(serialized: string): Mylist {
        var data = serialized.split(';');

        var mylistId: MylistId        = MylistId.fromIdString(unescape(data[1]));
        var title: string             = unescape(data[2]);
        var checkedVideoIds: string[] = data[3] ? data[3].split(':') : [];
        var newVideos: Video[]        = data[4] ? data[4].split(':').map(s => this.unserializeVideo(s)) : [];
        var displayTitle: string      = unescape(data[5]);

        return new Mylist(mylistId, title, displayTitle, newVideos, checkedVideoIds);
    }

    private serializeMylist(mylist: Mylist): string {
        return [
            '0', /* for backward compatibility */
            escape(mylist.getMylistId().toString()),
            escape(mylist.getTitle() || ''),
            mylist.getWatchedVideoIds().join(':'),
            mylist.getNewVideos().map(video => this.serializeVideo(video)).join(':'),
            escape(mylist.getDisplayTitle() || ''),
            '' /* for backward compatibility */
        ].join(';');
    }

    private unserializeVideo(serialized: string): Video {
        var data = serialized.split('&');

        var videoId: string   = unescape(data[0] || '');
        var title: string     = unescape(data[1] || '');
        var url: string       = unescape(data[2] || '');
        var thumbnail: string = unescape(data[3] || '');
        var memo: string      = unescape(data[4] || '');
        var timestamp: number = parseInt(unescape(data[5])) || 0;

        return new Video(videoId, title, url, thumbnail, memo, timestamp);
    }

    private serializeVideo(video: Video): string {
        return [
            escape(video.getVideoId() || ''),
            escape(video.getTitle() || ''),
            escape(video.getURL() || ''),
            escape(video.getThumbnail() || ''),
            escape(video.getMemo() || ''),
            escape(video.getTimestamp().toString())
        ].join('&');
    }

}
