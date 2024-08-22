module.exports = {
	init() {
		this.focusIndex = -1;
		this.loadingText = 'Loading...'
		this.noResultsText = 'No results found'
		this.responseCodes = {
			success: 200,
			multipleChoices: 300
		}

		this.setupSearch();

		if(!this.searchInput || !this.domSuggestions) {
			return;
		}

		this.loadingOption();
		this.noResultsOption();
		this.addSearchInputListeners();
	},

	setupSearch() {
		this.searchInput = document.getElementById('searchInput') || document.getElementById('resultsSearchInput')
		this.domSuggestions = document.getElementById('suggestions')
	},

	async getSearchSuggestions(searchString) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', `/suggestions?searchString=${searchString}`, true)
			xhr.setRequestHeader('Content-Type', 'application/json')
			xhr.onload = () => {
				if (xhr.status >= this.responseCodes.success && xhr.status < this.responseCodes.multipleChoices) {
					resolve(xhr.response? JSON.parse(xhr.response): null);
				} else {
					reject(new Error({
						status: xhr.status,
						statusText: xhr.statusText
					}));
				}
			};
			xhr.onerror = function () {
				reject(new Error({
					status: xhr.status,
					statusText: xhr.statusText
				}));
			};
			xhr.send(JSON.stringify({
				searchString: searchString
			}))
		})
	}, 

	getOption(value, text, onClick, onMouseOver = null, classList = '') {
		const option = document.createElement('div');
		option.value = value;
		option.textContent = text;
		option.onmousedown = onClick;
		option.onmouseover = onMouseOver
		option.classList += ` ${classList}`;
		
		return option;
	},

	loadingOption() {
		this.getOption(this.loadingText, this.loadingText, 
			() => { this.searchInput.focus() },
			null,
			'mpdp-text-color-dark-grey')
	},

	noResultsOption() {
		this.getOption(this.noResultsText, this.noResultsText, 
			() => { this.searchInput.focus() },
			null,
			'mpdp-text-color-dark-grey')
	},

	viewAllOption(count) {
		const text = `View all (${count} ${count === 1? 'result': 'results'})`
		return this.getOption(
			text, 
			text, 
			() => document.getElementById('searchButton')?.click(),
			null,
			'mpdp-text-align-center mpdp-align-items-center option-container mpdp-break-word')
	},

	hideSuggestions() {
		this.domSuggestions.style.display = 'none';
		this.focusIndex = -1;
		this.unsetActive();
	},

	showSuggestions() {
		this.domSuggestions.style.display = 'block'
	},

	async loadSuggestions() {
		this.domSuggestions.innerHTML = this.loadingOption.outerHTML;
		this.showSuggestions();

		try {
			const searchString = encodeURIComponent(this.searchInput.value)
			const suggestions = await this.getSearchSuggestions(searchString)

			if(suggestions?.count) {
				this.domSuggestions.innerHTML = '';
				suggestions.rows.forEach(row => {
					const val = `${row.payee_name} (${row.town}, ${row.county_council}, ${row.part_postcode})`
					this.domSuggestions.append(this.getOption(val, val,
						() => window.location.href = `${window.location.origin}/details?payeeName=${encodeURIComponent(row.payee_name)}&partPostcode=${row.part_postcode}&searchString=${searchString}`,
						(event) => {
							event.stopPropagation()
							if(this.focusIndex !== -1) {
								this.focusIndex = -1;
								this.unsetActive();
							}
						},
						'option-container mpdp-break-word'
					))
				})

				this.domSuggestions.append(this.viewAllOption(suggestions.count));
				return;
			}
		} catch(e) {
			console.error(e);
		}
		this.domSuggestions.innerHTML = this.noResultsOption.outerHTML;
	},

	setActive() {
		if (!this.domSuggestions.children?.length) {
			return;
		}

		this.unsetActive();

		if (this.focusIndex < 0) {
			this.focusIndex = this.domSuggestions.children.length - 1;
		} 
		
		if (this.focusIndex >= this.domSuggestions.children.length) {
			this.focusIndex = 0;
		}

		if([this.loadingText, this.noResultsText].includes(this.domSuggestions.children[this.focusIndex].value)) { 
			return;
		}

		this.domSuggestions.children[this.focusIndex].classList.add("active");
	},

	unsetActive() {
		for (const child of this.domSuggestions.children) {
			child.classList.remove("active");
		}
	},

	addSearchInputListeners() {
		const minCharLength = 3;
		const timeout = 250;

		this.searchInput.onblur = () => {
			window.setTimeout(() => {
				this.hideSuggestions();
			}, timeout);
		}
		
		this.searchInput.oninput = () => {
			if(this.searchInput.value.length < minCharLength) { 
				this.hideSuggestions();
				return;
			}

			this.loadSuggestions();
		}

		this.searchInput.onkeydown = e => {
			if (e.defaultPrevented) {
				return; // Do nothing if the event was already processed
			}

			if (['Down', 'ArrowDown'].includes(e.key)) {
				this.focusIndex++;
				this.setActive();
			} else if (['Up', 'ArrowUp'].includes(e.key)) {
				this.focusIndex--;
				this.setActive();
			} else if (['Esc', 'Escape'].includes(e.key)) {
				this.hideSuggestions();
			} else if (e.key === 'Enter') {
				if (this.focusIndex === -1 || !this.domSuggestions.children.length) {
					document.getElementById('searchButton')?.click();
					return;
				}

				if([this.loadingText, this.noResultsText].includes(this.domSuggestions.children[this.focusIndex].value)) { 
					return;
				}
				
				this.domSuggestions.children[this.focusIndex].dispatchEvent(new MouseEvent('mousedown'));
			} else {
				return;
			}
		
			e.preventDefault();
		}
	}
}