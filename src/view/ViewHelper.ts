
module ViewHelper {

    export function formatTimestamp(timestamp: number): string {
        var t = (new Date()).getTime() - timestamp;
        if ((t = t / 60 / 1000) < 60) {
            return (t < 1 ? '1分以内' : Math.floor(t) + '分前');
        } else if ((t = t / 60) < 24) {
            return Math.floor(t) + '時間前';
        } else if ((t = t / 24) < 14) {
            return Math.floor(t) + '日前';
        } else if ((t = t / 7) < 5) {
            return Math.floor(t) + '週間前';
        } else {
            var dt = new Date(timestamp);
            return [
                zeroPad(dt.getMonth() + 1, 2), '/',
                zeroPad(dt.getDay(), 2), ' ',
                zeroPad(dt.getHours(), 2), ':',
                zeroPad(dt.getMinutes(), 2)
            ].join('');
        }
    }

    export function zeroPad(n: number, width: number): string {
        var s = n.toString();
        if (width > s.length) {
            return (new Array(width - s.length + 1)).join('0') + s;
        } else {
            return s;
        }
    }

}
