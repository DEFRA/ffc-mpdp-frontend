import { removeTrailingSlash } from "../../utils/helper";

export const cookieModel = (cookiesPolicy: any = {}, updated: boolean, referer: string = '') => ({
	analytics: {
		classes: 'govuk-radios--inline',
		idPrefix: 'analytics',
		name: 'analytics',
		fieldset: {
			legend: {
				text: 'Change your cookie settings',
				isPageHeading: true,
				classes: "govuk-fieldset__legend--s"
			}
		},
		hint: {
			text: "Do you want to accept analytics cookies?"
		},
		items: [
			{
				value: true,
				text: 'Yes',
				checked: cookiesPolicy.analytics
			},
			{
				value: false,
				text: 'No',
				checked: !cookiesPolicy.analytics
			}
		]
	},
	updated,
	referer: removeTrailingSlash(referer)
})
	