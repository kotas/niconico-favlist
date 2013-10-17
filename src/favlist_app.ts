
declare var APP_NAME: string;
declare var APP_VERSION: string;

module FavlistApp {

    export function getUserAgent(): string {
        return APP_NAME + '/' + APP_VERSION;
    }

}
