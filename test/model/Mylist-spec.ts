/// <reference path="../spec_helper.ts" />

describe('Mylist', () => {

    var mylistId = new MylistId(MylistIdType.Mylist, '123456');
    var originalTitle = 'original title';
    var overrideTitle = 'override title';
    var video1 = new Video('sm1', 'video title 1', 'http://example.com/sm1', 'http://example.com/t/sm1', '', Date.now());
    var video2 = new Video('sm2', 'video title 2', 'http://example.com/sm2', 'http://example.com/t/sm2', '', Date.now() - 60);

    var mylist: Mylist;

    beforeEach(() => {
        mylist = new Mylist(
            mylistId,
            originalTitle,
            overrideTitle,
            [video1, video2],
            ['sm3', 'sm4']
        );
    });

    describe('#getTitle', () => {
        it('returns overrideTitle if set', () => {
            expect(mylist.getTitle()).to.equal(overrideTitle);
        });
        it('returns originalTitle if overrideTitle is not set', () => {
            mylist.setOverrideTitle('');
            expect(mylist.getTitle()).to.equal(originalTitle);
        });
    });

    describe('#getNewVideos', () => {
        it('returns the number of new videos', () => {
            expect(mylist.getNewCount()).to.equal(2);
        });
    });

    describe('#markVideoAsWatched', () => {
        it('removes a video from new videos', () => {
            mylist.markVideoAsWatched(video1);
            expect(mylist.getNewVideos()).to.eql([video2]);
        });

        it('marks the video ID as watched', () => {
            mylist.markVideoAsWatched(video1);
            expect(mylist.getWatchedVideoIds()).to.contain(video1.getVideoId());
        });

        it('does nothing if a video is not in new videos', () => {
            var video3 = new Video('sm10', 't', 'h', 'h', '', Date.now());
            mylist.markVideoAsWatched(video3);
            expect(mylist.getNewVideos()).to.eql([video1, video2]);
        });
    });

    describe('#markAllVideosAsWatched', () => {
        it('removes all videos from new videos', () => {
            mylist.markAllVideosAsWatched();
            expect(mylist.getNewVideos()).to.be.empty;
        });

        it('marks all video IDs as watched', () => {
            mylist.markAllVideosAsWatched();
            expect(mylist.getWatchedVideoIds()).to.contain(video1.getVideoId());
            expect(mylist.getWatchedVideoIds()).to.contain(video2.getVideoId());
        });
    });

    describe('#updateVideos', () => {

        var newVideo = new Video('sm100', 'new video 1', 'http://example.com/sm100', 'http://example.com/t/sm100', 'new memo 1', Date.now() - 10);
        var watchedVideo = new Video('sm3', 'watched', 'http://example.com/sm3', 'http://example.com/t/sm3', '', Date.now());

        beforeEach(() => {
            mylist.updateVideos([video1, newVideo, watchedVideo]);
        });

        it('adds new video', () => {
            expect(mylist.getNewVideos()).to.contain(newVideo);
        });

        it('skips watched video', () => {
            expect(mylist.getNewVideos()).to.not.contain(watchedVideo);
        });

        it('keeps a known video in given videos', () => {
            expect(mylist.getNewVideos()).to.contain(video1);
        });

        it('removes a video not in given videos', () => {
            expect(mylist.getNewVideos()).to.not.contain(video2);
        });

        it('keeps a video ID in given videos as watched', () => {
            expect(mylist.getWatchedVideoIds()).to.contain(watchedVideo.getVideoId());
        })

        it('removes a video ID not in given videos', () => {
            expect(mylist.getWatchedVideoIds()).to.not.contain('sm4');
        });

    });

});
