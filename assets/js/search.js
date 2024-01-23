const getSearchSuggestions = async (searchString) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `/suggestions?searchString=${searchString}`, true)
		xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
						resolve(xhr.response? JSON.parse(xhr.response): null);
				} else {
						reject({
								status: xhr.status,
								statusText: xhr.statusText
						});
				}
		};
		xhr.onerror = function () {
				reject({
						status: xhr.status,
						statusText: xhr.statusText
				});
		};
		xhr.send(JSON.stringify({
			searchString
		}))
	})
}

const getOption = (value, text, onClick, onMouseOver = null, classList = '') => {
	let option = document.createElement('div');
	option.value = value;
	option.textContent = text;
	option.onmousedown = onClick;
	option.onmouseover = onMouseOver
	option.classList += ` ${classList}`;
	
	return option;
}

const setupSearch = () => {
	const searchInput = document.getElementById('searchInput') || document.getElementById('resultsSearchInput')
	const domSuggestions = document.getElementById('suggestions')
	if(!searchInput || !domSuggestions) {
		return;
	}

	let focusIndex = -1;  
	const minCharLength = 3;
	const loadingText = 'Loading...'
	const noResultsText = 'No results found'
	
	const loadingOption = (() => getOption(loadingText, loadingText, 
			() => { searchInput.focus() },
			null,
			'mpdp-text-color-dark-grey')
	)()

	const noResultsOption = (() => getOption(noResultsText, noResultsText, 
		() => { searchInput.focus() },
		null,
		'mpdp-text-color-dark-grey')
	)()

	const viewAllOption = (count) => {
		const text = `View all (${count} ${count == 1? 'result': 'results'})`
		return getOption(
			text, 
			text, 
			() => document.getElementById('searchButton')?.click(),
			null,
			'mpdp-text-align-center mpdp-align-items-center option-container mpdp-break-word')
	}
	
	const hideSuggestions = () => {
		domSuggestions.style.display = 'none';
		focusIndex = -1;
		unsetActive();
	}

	const showSuggestions = () => domSuggestions.style.display = 'block'
	const loadSuggestions = async () => {
		domSuggestions.innerHTML = loadingOption.outerHTML;
		showSuggestions();

		try {
			const suggestions = await getSearchSuggestions(searchInput.value)
			if(suggestions?.count) {
				domSuggestions.innerHTML = '';
				suggestions.rows.forEach(row => {
					const val = `${row.payee_name} (${row.town}, ${row.county_council}, ${row.part_postcode})`
					domSuggestions.append(getOption(val, val,
						() => window.location.href = `${window.location.origin}/details?payeeName=${row.payee_name}&partPostcode=${row.part_postcode}&searchString=${searchInput.value}`,
						(event) => {
							event.stopPropagation()
							if(focusIndex != -1) {
								focusIndex = -1;
								unsetActive();
							}
						},
						'option-container mpdp-break-word'
					))
				})

				domSuggestions.append(viewAllOption(suggestions.count));
				return;
			}
		} catch(e) {
			console.error(e)
		}
		domSuggestions.innerHTML = noResultsOption.outerHTML;
	}
	
	searchInput.onblur = () => {
		window.setTimeout(() => {
			hideSuggestions();
		}, 250);
	}

	searchInput.oninput = () => {
		if(searchInput.value.length < minCharLength) { 
			hideSuggestions();
			return;
		}

		loadSuggestions();
	}

	const setActive = () => {
		if (!domSuggestions.children?.length) return false;
		unsetActive();
		
		focusIndex = (focusIndex >= domSuggestions.children.length)? 0 : (focusIndex < 0 ?  (domSuggestions.children.length - 1) : focusIndex)		
		if([loadingText, noResultsText].includes(domSuggestions.children[focusIndex].value)) { 
			return;
		}

		domSuggestions.children[focusIndex].classList.add("active");
	}
	
	const unsetActive = () => {
		for (var i = 0; i < domSuggestions.children.length; i++) {
			domSuggestions.children[i].classList.remove("active");
		}
	}

	searchInput.onkeydown = (e) => {
		if (e.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}

		switch(e.key) {
			case "Down": // IE/Edge specific value
			case "ArrowDown":
				focusIndex++;
				setActive();
				break;
			case "Up": // IE/Edge specific value
			case "ArrowUp":
				focusIndex--
				setActive();
				break;
			case "Enter":
				if (focusIndex == -1 || !domSuggestions.children.length) {
					document.getElementById('searchButton')?.click();
					return;
				}
	
				if([loadingText, noResultsText].includes(domSuggestions.children[focusIndex].value)) { 
					return;
				}
				
				domSuggestions.children[focusIndex].dispatchEvent(new MouseEvent('mousedown'));
								
				break;
			case "Esc": // IE/Edge specific value
			case "Escape":
				hideSuggestions()
				break;
			default:
				return; // Quit when this doesn't handle the key event.	
		}

		e.preventDefault();
	}
}

(() => {
  setupSearch();
})()