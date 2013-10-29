module util {

    export class OPMLOutline {

        private outlines: OPMLOutline[];

        constructor(
            public title: string,
            public attrs?: Object
        ) {}

        getOutlines(): OPMLOutline[] {
            return this.outlines;
        }

        addOutline(outline: OPMLOutline) {
            if (!this.outlines) this.outlines = [];
            this.outlines.push(outline);
        }

        toElement() {
            var el = document.createElement('outline');
            el.setAttribute('title', this.title);
            el.setAttribute('text', this.title);
            if (this.attrs) {
                for (var k in this.attrs) {
                    if (this.attrs.hasOwnProperty(k)) {
                        el.setAttribute(k, this.attrs[k]);
                    }
                }
            }
            if (this.outlines) {
                for (var i = 0, l = this.outlines.length; i < l; i++) {
                    el.appendChild(this.outlines[i].toElement());
                }
            }
            return el;
        }

    }

    export class OPMLFeed extends OPMLOutline {

        constructor(
            title: string,
            public htmlUrl: string,
            public xmlUrl: string
        ) {
            super(title, {
                type: 'rss',
                htmlUrl: htmlUrl,
                xmlUrl: xmlUrl
            });
        }

    }

    export class OPMLDocument {

        private outlines: OPMLOutline[];

        constructor(
            public title: string
        ) {}

        addOutline(outline: OPMLOutline) {
            if (!this.outlines) this.outlines = [];
            this.outlines.push(outline);
        }

        toString(): string {
            var opml = document.createElement('opml');
            opml.setAttribute('version', '1.0');

            var head = document.createElement('head');
            opml.appendChild(head);

            var title = document.createElement('title');
            title.appendChild(document.createTextNode(this.title));
            head.appendChild(title);

            var dateCreated = document.createElement('dateCreated');
            dateCreated.appendChild(document.createTextNode((new Date).toUTCString()));
            head.appendChild(dateCreated);

            var body = document.createElement('body');
            opml.appendChild(body);
            if (this.outlines) {
                this.outlines.forEach((outline) => {
                    body.appendChild(outline.toElement());
                });
            }

            var tmp = document.createElement('div');
            tmp.appendChild(opml);
            var xml = tmp.innerHTML;

            // quick fix
            xml = xml.replace(/ xmlurl=/g, ' xmlUrl=').replace(/ htmlurl=/g, ' htmlUrl=');

            return '<?xml version="1.0" encoding="utf-8"?>\n' + xml;
        }

    }

}
