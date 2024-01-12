const setupShowAllButton = () => {
	const showAllButton = document.querySelector('#showAllButton');
	if (!showAllButton) {
		return;
	}

	const detailsElements = document.querySelectorAll('.schemeDetails');
	const activitiesElements = document.querySelectorAll('.schemeActivity');
	
	showAllButton?.addEventListener('click', () => {
		const show = showAllButton.innerText === 'Show all';
		detailsElements.forEach((element) => {
			element.style.display = show? 'block' : 'none';
		});

		activitiesElements.forEach((element) => {
			element.open = show;
		});

		const allShowHideButtons = getAllSchemeShowHideButtons()
		allShowHideButtons.forEach((showHideButton, i) => {
			const schemeMoreInfo = document.getElementById(`schemeMoreInfo${i+1}`);
			toggleDisplay(schemeMoreInfo, show);
			toggleDetails(showHideButton, show);
		})

		showAllButton.innerText = show ? 'Hide all' : 'Show all';
	});
};

const toggleDisplay = (element, show) => {
	element.style.display = show? 'block' : 'none';
}

const toggleDetails = (element, show) => {
	element.innerText = show? 'Hide Details' : 'Show Details';
}

const setupSummaryShowHideButton = () => {
	const showHideButton = document.getElementById('summaryToggle');
	if (!showHideButton) {
		return;
	}

	const summaryDetails = document.getElementById('summaryDetails');
	const dateRange = document.getElementById('dateRange');

	// hide the details by default
	toggleDisplay(summaryDetails, false);
	toggleDisplay(dateRange, false);

	showHideButton?.addEventListener('click', () => {
		const show = document.getElementById('summaryToggle').innerText === 'Show Details';
		toggleDisplay(summaryDetails, show);
		toggleDisplay(dateRange, show);
		
		toggleDetails(showHideButton, show);
	});
};

const setupSchemeShowHideButtons = () => {

	const allShowHideButtons = getAllSchemeShowHideButtons()
	if(!allShowHideButtons.length) {
		return;
	}

	allShowHideButtons.forEach((showHideButton, i) => {
		if (!showHideButton) {
			return;
		}

		const schemeDetails = document.getElementById(`schemeDetails${i+1}`);
		const schemeMoreInfo = document.getElementById(`schemeMoreInfo${i+1}`);
		
		// hide the details by default
		toggleDisplay(schemeDetails, false);
		toggleDisplay(schemeMoreInfo, false);

		showHideButton?.addEventListener('click', () => {
			const show = showHideButton.innerText === 'Show Details'
			toggleDisplay(schemeDetails, show);
			toggleDisplay(schemeMoreInfo, show);
			
			toggleDetails(showHideButton, show);
		});
	})

	// const schemesLength = document.getElementById('mpdpSummaryBreakdown')?.getAttribute('data-schemesLength')
	// if(!schemesLength) {
	// 	return;
	// }

	// for(let i = 1; i <= schemesLength; i++) {
	// 	const showHideButton = document.getElementById(`schemeToggle${i}`);
	// 	if (!showHideButton) {
	// 		return;
	// 	}

	// 	const schemeDetails = document.getElementById(`schemeDetails${i}`);
	// 	const schemeMoreInfo = document.getElementById(`schemeMoreInfo${i}`);
		
	// 	// hide the details by default
	// 	toggleDisplay(schemeDetails);
	// 	toggleDisplay(schemeMoreInfo);

	// 	showHideButton?.addEventListener('click', () => {
	// 		toggleDisplay(schemeDetails);
	// 		toggleDisplay(schemeMoreInfo);
			
	// 		toggleDetails(showHideButton);
	// 	});
	// }
};

const getAllSchemeShowHideButtons = () => {
	const allButtons = [];
	const schemesLength = document.getElementById('mpdpSummaryBreakdown')?.getAttribute('data-schemesLength')
	for(let i = 1; i <= schemesLength; i++) {
		allButtons.push(document.getElementById(`schemeToggle${i}`));
	}

	return allButtons;
}

(() => {
	setupSchemeShowHideButtons();
  	setupSummaryShowHideButton();
	setupShowAllButton();
})()
