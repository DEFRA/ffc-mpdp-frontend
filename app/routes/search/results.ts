import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

import config from '../../config'
import { getPaymentData } from '../../backend/api'

import { getReadableAmount, getAllSchemesNames } from '../../utils/helper'

const getFilters = (query: any) => {
  const schemesLength = !query.schemes? 0 : (typeof query.schemes === 'string'? 1: query.schemes?.length)
  
  return {
    schemes: getAllSchemesNames().map(x => ({ 
      text: x, 
      value: x,
      checked: query.schemes?.includes(x),
      attributes: {
        onchange: "this.form.submit()"
      }
    })),
    selected: schemesLength
  }
}

const getPaginationAttributes = (totalResults: number, requestedPage: number, searchString: string, schemes: []) => {
  const encodedSearchString = encodeURIComponent(searchString)
  const totalPages = Math.ceil(totalResults / config.search.limit)

  let prevHref = `/results?searchString=${encodedSearchString}&page=${requestedPage - 1}`
  let nextHref = `/results?searchString=${encodedSearchString}&page=${requestedPage + 1}`
  if(schemes.length) {
    const schemesPart = `&schemes=${schemes.join('&schemes=')}` 
    prevHref += schemesPart
    nextHref += schemesPart 
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

const performSearch = async (searchString: string, requestedPage: number, filterBy: any, sortBy:string) => {
  const offset = (requestedPage - 1) * config.search.limit
  const { results, total } = await getPaymentData(searchString, offset, filterBy, sortBy)

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
  const sortBy = decodeURIComponent(query.sortBy)
  const schemes = typeof query.schemes === 'string' ? [query.schemes]: query.schemes
  const { matches, total } = await performSearch(searchString, requestedPage, { schemes }, sortBy)
  
  return {
    ...defaultReturn,
    searchString,
    ...getPaginationAttributes(total, requestedPage, searchString, schemes),
    results: matches,
    total,
    currentPage: requestedPage,
    headingTitle: `${total ? 'Results for' : 'We found no results for'} ‘${searchString}’`,
    sortBy
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
          sortBy: Joi.string().trim().optional().default('score')
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
