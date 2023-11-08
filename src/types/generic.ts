export enum ReturnStatus {
	OK = 'OK',
	NOT_OK = 'NOT_OK',
	UNAUTHORIZED = 'UNAUTHORIZED',
	BAD_REQUEST = 'BAD_REQUEST',
	INVALID_TOKEN = 'INVALID_TOKEN',
}

export type ReturnFunction<T> = (
	success: boolean,
	message: string,
	returnStatus: ReturnStatus,
	data: T
) => {};
