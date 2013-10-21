module util {

    export class CustomError implements Error {
        constructor(
            public name: string,
            public message: string
        ) {
            Error.call(this);

            // for V8 engine
            if (typeof (<any>Error).captureStackTrace === 'function') {
                (<any>Error).captureStackTrace(this, (<any>this).constructor || CustomError);
            }
        }
    }
    (<any>CustomError).prototype = new Error();
    (<any>CustomError).prototype.constructor = CustomError;

}
