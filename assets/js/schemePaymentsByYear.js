const setupAggregateSummaryShowHideButton = () => {
	const showHideButton = document.getElementById('paymentsByYearSummaryToggle');
	if (!showHideButton) {
		return;
	}

	const summaryDetails = document.getElementById('summaryDetails');
	const dateRange = document.getElementById('dateRange');

	// hide the details by default
	toggleDisplay(summaryDetails);
	toggleDisplay(dateRange);

	showHideButton?.addEventListener('click', () => {
		toggleDisplay(summaryDetails);
		toggleDisplay(dateRange);
		
		toggleDetails(showHideButton);
	});
};

const toggleDisplay = (element) => {
	element.style.display = element.style.display === 'none' ? 'block' : 'none';
}

const toggleDetails = (element) => {
	element.innerText = element.innerText === 'Show Details' ? 'Hide Details' : 'Show Details';
}

const setupAgrregateShowAllButton = () => {
	const showAllButton = document.querySelector('#showAllYearPaymentsButton');
	if (!showAllButton) {
		return;
	}

	const activitiesElements = document.querySelectorAll('.yearlyActivity');
	
	showAllButton?.addEventListener('click', () => {
		const showAll = showAllButton.innerText === 'Show all';
		activitiesElements.forEach((element) => {
			element.open = showAll;
		});

		showAllButton.innerText = showAll ? 'Hide all' : 'Show all';
	});
};

(() => {
	setupAggregateSummaryShowHideButton();
    setupAgrregateShowAllButton();
})()