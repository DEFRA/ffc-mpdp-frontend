const setupShowAllButton = () => {
	const showAllButton = document.querySelector('#showAllButton');
	if (!showAllButton) {
		return;
	}

	const detailsElements = document.querySelectorAll('.schemeDetails');
	const activitiesElements = document.querySelectorAll('.schemeActivity');
	
	showAllButton?.addEventListener('click', () => {
		const showAll = showAllButton.innerText === 'Show all';
		detailsElements.forEach((element) => {
			element.style.display = showAll? 'block' : 'none';
		});

		activitiesElements.forEach((element) => {
			element.open = showAll ? true : false;
		});

		showAllButton.innerText = showAll ? 'Hide all' : 'Show all';
	});
};

const toggleDisplay = (element) => {
	element.style.display = element.style.display === 'none' ? 'block' : 'none';
}

const toggleDetails = (element) => {
	element.innerText = element.innerText === 'Show Details' ? 'Hide Details' : 'Show Details';
}

const setupSummaryShowHideButton = () => {
	const showHideButton = document.getElementById('summaryToggle');
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

const setupSchemeShowHideButtons = () => {
	const schemesLength = document.getElementById('mpdpSummaryBreakdown')?.getAttribute('data-schemesLength')
	if(!schemesLength) {
		return;
	}

	for(let i = 1; i <= schemesLength; i++) {
		const showHideButton = document.getElementById(`schemeToggle${i}`);
		if (!showHideButton) {
			return;
		}

		const schemeDetails = document.getElementById(`schemeDetails${i}`);
		const schemeMoreInfo = document.getElementById(`schemeMoreInfo${i}`);
		
		// hide the details by default
		toggleDisplay(schemeDetails);
		toggleDisplay(schemeMoreInfo);

		showHideButton?.addEventListener('click', () => {
			toggleDisplay(schemeDetails);
			toggleDisplay(schemeMoreInfo);
			
			toggleDetails(showHideButton);
		});
	}
};

(() => {
	setupSchemeShowHideButtons();
  setupSummaryShowHideButton();
	setupShowAllButton();
})()
