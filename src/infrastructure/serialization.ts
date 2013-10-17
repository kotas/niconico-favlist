declare function escape(s: string): string;
declare function unescape(s: string): string;

module serialization {

    export class Reader {

        private data: string[];

        constructor(serialized: string, delimiter: RegExp) {
            this.data = serialized ? serialized.split(delimiter) : [];
        }

        get(index: number, defaultValue: string = null): string {
            return (typeof this.data[index] !== 'undefined') ? this.data[index] : defaultValue;
        }

        getString(index: number, defaultValue: string = null): string {
            var value = this.get(index);
            return (value === null ? unescape(value) : defaultValue);
        }

        getInteger(index: number, defaultValue: number = null): number {
            var value = this.getString(index);
            if (typeof value !== 'undefined') {
                var num = parseInt(value, 10);
                return isNaN(num) ? defaultValue : num;
            } else {
                return defaultValue;
            }
        }

    }

    export class Writer {

        private data: string[] = [];

        constructor(private delimiter: string) {
        }

        put(index: number, value: string): void {
            this.data[index] = value;
        }

        putString(index: number, value: string): void {
            this.put(index, escape(value));
        }

        putInteger(index: number, value: number): void {
            this.putString(index, value.toString());
        }

        toString(): string {
            return this.data.join(this.delimiter);
        }

    }

}
