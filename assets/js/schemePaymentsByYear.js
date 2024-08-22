module.exports = {
	init() {
		this.setupAggregateSummaryShowHideButton();
    this.setupAggregateShowAllButton();
	},

	setupAggregateSummaryShowHideButton() {
		const showHideButton = document.getElementById('paymentsByYearSummaryToggle');
		if (!showHideButton) {
			return;
		}
	
		const summaryDetails = document.getElementById('summaryDetails');
		const dateRange = document.getElementById('dateRange');
	
		// hide the details by default
		this.toggleDisplay(summaryDetails);
		this.toggleDisplay(dateRange);
	
		showHideButton?.addEventListener('click', () => {
			this.toggleDisplay(summaryDetails);
			this.toggleDisplay(dateRange);
			this.toggleDetails(showHideButton);
		});
	},

	toggleDisplay(element) {
		element.style.display = element.style.display === 'none' ? 'block' : 'none';
	},

	toggleDetails(element) {
		element.innerText = element.innerText === 'Show Details' ? 'Hide Details' : 'Show Details';
	},

	setupAggregateShowAllButton() {
		const showAllButton = document.querySelector('#showAllYearPaymentsButton');
		if (!showAllButton) {
			return;
		}
	
		const activitiesElements = document.querySelectorAll('.yearlyActivity');
		
		showAllButton?.addEventListener('click', () => {
			const showAll = showAllButton.innerText === 'Show all';
			activitiesElements.forEach(element => {
				element.open = showAll;
			});
	
			showAllButton.innerText = showAll ? 'Hide all' : 'Show all';
		});
	}
}
