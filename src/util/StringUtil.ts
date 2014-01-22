module util {

    export function unescapeHTML(s: string): string {
        return (s || '').
            replace(/&lt;/g, '<').
            replace(/&gt;/g, '>').
            replace(/&quot;/g, '"').
            replace(/&#039;/g, "'").
            replace(/&amp;/g, '&');
    }

}