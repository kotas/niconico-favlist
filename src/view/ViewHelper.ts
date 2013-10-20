
module ViewHelper {

    export function formatTimestamp(timestamp: number): string {
        var d = new Date(timestamp);

        var ymd = [
            d.getFullYear().toString().substr(0, 2),
            zeroPad(d.getMonth() + 1, 2),
            zeroPad(d.getDay(), 2)
        ].join('/');
        var hms = [
            zeroPad(d.getHours(), 2),
            zeroPad(d.getMinutes(), 2)
        ].join(':');

        return ymd + ' ' + hms;
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
