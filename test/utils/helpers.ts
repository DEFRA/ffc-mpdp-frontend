export const getOptions = (page: string, method: string = 'GET', params: any = {}) => {
	return {
		method,
		url: `/${page}?${new URLSearchParams(params).toString()}`
	}
}
