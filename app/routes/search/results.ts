import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

import config from '../../config'
import { getPaymentData } from '../../backend/api'
import { amounts } from '../../data/filters/amounts'

import { getReadableAmount, getAllSchemesNames } from '../../utils/helper'

const getFilters = (query: any) => {
  const schemesLength = !query.schemes? 0 : (typeof query.schemes === 'string'? 1: query.schemes?.length)
  const amountsLength = !query.amounts? 0 : (typeof query.amounts === 'string'? 1: query.amounts?.length)
  const attributes = {
    onchange: "this.form.submit()"
  }

  return {
    schemes: getAllSchemesNames().map(x => ({ 
      text: x, 
      value: x,
      checked: query.schemes?.includes(x),
      attributes
    })),
    amounts: amounts.map(({text, value}) => ({
      text,
      value,
      checked: (typeof query.amounts === 'string')? query.amounts === value : query.amounts?.includes(value),
      attributes
    })),
    selected: {
      schemesLength,
      amountsLength
    }
  }
}

const getPaginationAttributes = (totalResults: number, requestedPage: number, searchString: string, filterBy: any) => {
  const encodedSearchString = encodeURIComponent(searchString)
  const totalPages = Math.ceil(totalResults / config.search.limit)

  let prevHref = `/results?searchString=${encodedSearchString}&page=${requestedPage - 1}`
  let nextHref = `/results?searchString=${encodedSearchString}&page=${requestedPage + 1}`
  for(let key in filterBy) {
    if(filterBy[key].length) {
      const urlParam = `&${key}=`
      const urlPart = `${urlParam}${filterBy[key].join(urlParam)}`
      prevHref += urlPart
      nextHref += urlPart 
    }
  }
  
  const previous = requestedPage <= 1 ? null : {
    href: prevHref,
    labelText: `${requestedPage - 1} of ${totalPages} `,
    attributes: {
      id: 'prevOption',
      "aria-label": "Go to previous page of results: " + `${requestedPage - 1} of ${totalPages} `
    }
  }
  
  const next = totalPages <= 1 || totalPages === requestedPage ? null : {
    href: nextHref,
    labelText: `${requestedPage + 1} of ${totalPages} `,
    attributes: {
      id: 'nextOption',
      "aria-label": "Go to next page of results: " + `${requestedPage + 1} of ${totalPages} `
    }
  }

  return { previous, next }
}

const performSearch = async (searchString: string, requestedPage: number, filterBy: any) => {
  const offset = (requestedPage - 1) * config.search.limit
  const { results, total } = await getPaymentData(searchString, offset, filterBy)

  const matches = results.map((x: any) => ({...x, amount: getReadableAmount(parseFloat(x.total_amount))}))
  return {
    matches,
    total: total
  }
}

const createModel = async (query: any, error?: any) => {
  const defaultReturn = {
    hiddenInputs: [{ id: 'pageId', name: 'pageId', value: 'results' }],
    filters: getFilters(query)
  }
  
  if(error) {
    return {
      ...defaultReturn,
      errorList: [{
        text: "Enter a search term",
        href: "#resultsSearchInput"
      }],
      total: 0 
    }
  }

  const searchString = decodeURIComponent(query.searchString)
  const requestedPage = query.page
  
  const filterBy = {
    schemes: typeof query.schemes === 'string' ? [query.schemes]: query.schemes,
    amounts: typeof query.amounts === 'string' ? [query.amounts]: query.amounts
  }

  const { matches, total } = await performSearch(searchString, requestedPage, filterBy)
  
  return {
    ...defaultReturn,
    searchString,
    ...getPaginationAttributes(total, requestedPage, searchString, filterBy),
    results: matches,
    total,
    currentPage: requestedPage,
    headingTitle: `${total ? 'Results for' : 'We found no results for'} ‘${searchString}’`
  }
}

module.exports = [
  {
    path: '/results',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          searchString: Joi.string().trim().min(1).required(),
          page: Joi.number().default(1),
          pageId: Joi.string().default(''),
          schemes: Joi.alternatives().try(Joi.string(), Joi.array()).default([]),
          amounts: Joi.alternatives().try(Joi.string(), Joi.array()).default([])
        }),
        failAction: async (request: Request, h: ResponseToolkit, error: any) => {
          if(!(request.query as any).searchString.trim()) {
            return h.view(
              `search/${(request.query as any).pageId || 'index'}`,
              await createModel(request.query, error)
            ).code(400).takeover()
          }
        
          return h.view('search/index', { ...(request.query as Object), errorList: [{ text: error.details[0].message }]}).code(400).takeover()
        }
      },
      handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        return h.view('search/results', await createModel(request.query))
      }
    }
  }
]
