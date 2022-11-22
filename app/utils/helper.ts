export const getReadableAmount = (amount: number | undefined) => {
	if(typeof amount !== 'number') {
		return '0'
	}

	return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
  