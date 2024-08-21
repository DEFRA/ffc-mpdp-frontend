let searchInput;
let domSuggestions;
let focusIndex = -1;

const loadingText = 'Loading...'
const noResultsText = 'No results found'

const responseCodes = {
	success: 200,
	multipleChoices: 300
}

const setupSearch = () => {
	searchInput = document.getElementById('searchInput') || document.getElementById('resultsSearchInput')
	domSuggestions = document.getElementById('suggestions')
	if(!searchInput || !domSuggestions) {
		return;
	}
}

const getSearchSuggestions = async (searchString) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `/suggestions?searchString=${searchString}`, true)
		xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.onload = () => {
				if (xhr.status >= responseCodes.success && xhr.status < responseCodes.multipleChoices) {
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
			searchString: searchString
		}))
	})
}

const getOption = (value, text, onClick, onMouseOver = null, classList = '') => {
	const option = document.createElement('div');
	option.value = value;
	option.textContent = text;
	option.onmousedown = onClick;
	option.onmouseover = onMouseOver
	option.classList += ` ${classList}`;
	
	return option;
}

const loadingOption = () => getOption(loadingText, loadingText, 
	() => { searchInput.focus() },
	null,
	'mpdp-text-color-dark-grey')

const noResultsOption = () => getOption(noResultsText, noResultsText, 
	() => { searchInput.focus() },
	null,
	'mpdp-text-color-dark-grey')

const viewAllOption = (count) => {
	const text = `View all (${count} ${count === 1? 'result': 'results'})`
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
		const searchString = encodeURIComponent(searchInput.value)
		const suggestions = await getSearchSuggestions(searchString)
		if(suggestions?.count) {
			domSuggestions.innerHTML = '';
			suggestions.rows.forEach(row => {
				const val = `${row.payee_name} (${row.town}, ${row.county_council}, ${row.part_postcode})`
				domSuggestions.append(getOption(val, val,
					() => window.location.href = `${window.location.origin}/details?payeeName=${encodeURIComponent(row.payee_name)}&partPostcode=${row.part_postcode}&searchString=${searchString}`,
					(event) => {
						event.stopPropagation()
						if(focusIndex !== -1) {
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

const setActive = () => {
	if (!domSuggestions.children?.length) {
		return;
	}

	unsetActive();

	if (focusIndex < 0) {
		focusIndex = domSuggestions.children.length - 1;
	} 
	
	if (focusIndex >= domSuggestions.children.length) {
		focusIndex = 0;
	}

	if([loadingText, noResultsText].includes(domSuggestions.children[focusIndex].value)) { 
		return;
	}

	domSuggestions.children[focusIndex].classList.add("active");
}

const unsetActive = () => {
	for (const child of domSuggestions.children) {
		child.classList.remove("active");
	}
}

const addSearchInputListeners = () => {
	const minCharLength = 3;
	const timeout = 250;

	searchInput.onblur = () => {
		window.setTimeout(() => {
			hideSuggestions();
		}, timeout);
	}
	
	searchInput.oninput = () => {
		if(searchInput.value.length < minCharLength) { 
			hideSuggestions();
			return;
		}

		loadSuggestions();
	}

	searchInput.onkeydown = (e) => {
		if (e.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}

		if (['Down', 'DownArrow'].includes(e.key)) {
			focusIndex++;
			setActive();
		} else if (['Up', 'UpArrow'].includes(e.key)) {
			focusIndex--;
			setActive();
		} else if (['Esc', 'Escape'].includes(e.key)) {
			hideSuggestions();
		} else if (e.key === 'Enter') {
			if (focusIndex === -1 || !domSuggestions.children.length) {
				document.getElementById('searchButton')?.click();
				return;
			}

			if([loadingText, noResultsText].includes(domSuggestions.children[focusIndex].value)) { 
				return;
			}
			
			domSuggestions.children[focusIndex].dispatchEvent(new MouseEvent('mousedown'));
		} else {
			return;
		}
	
		e.preventDefault();
	}
}

(() => {
	setupSearch()
	loadingOption();
	noResultsOption();
	addSearchInputListeners();
})()