type ErrorObjectType = {
    STATUS_CODE : number,
    TYPE : string,
    MESSAGE : string
}

export const createErrorObject = (errorObj : ErrorObjectType): Error & { statusCode: number; type: string } => {
    return Object.assign(
            new Error(errorObj.MESSAGE), {
                statusCode : errorObj.STATUS_CODE,
                type : errorObj.TYPE,
            }
    )}