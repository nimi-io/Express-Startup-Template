export const ResultFunction = <T>(
	success: boolean,
	message: string,
	code: number,
	returnStatus: string,
	data: T
) => {
	return {
		success,
		message,
		code,
		returnStatus,
		data,
	};
};
