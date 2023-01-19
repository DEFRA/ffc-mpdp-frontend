import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

import config from '../../config'
import { getPaymentData } from '../../backend/api'

import { getReadableAmount } from '../../utils/helper'

const getPaginationAttributes = (totalResults: number, requestedPage: number, searchString: string) => {
  const encodedSearchString = encodeURIComponent(searchString)
  const totalPages = Math.ceil(totalResults / config.search.limit)
  const previous = requestedPage <= 1 ? null : {
    href: `/results?searchString=${encodedSearchString}&page=${requestedPage - 1}`,
    labelText: `${requestedPage - 1} of ${totalPages} `,
    attributes: {
      id: 'prevOption',
      "aria-label": "Go to previous page of results: " + `${requestedPage - 1} of ${totalPages} `
    }
  }
  
  const next = totalPages <= 1 || totalPages === requestedPage ? null : {
    href: `/results?searchString=${encodedSearchString}&page=${requestedPage + 1}`,
    labelText: `${requestedPage + 1} of ${totalPages} `,
    attributes: {
      id: 'nextOption',
      "aria-label": "Go to next page of results: " + `${requestedPage + 1} of ${totalPages} `
    }
  }

  const attributes = {
    "aria-label": 'Pagination Navigation'
  }

  return { previous, next, attributes }
}

const performSearch = async (searchString: string, requestedPage: number) => {
  // Get results from api and provice limit and offset as parameters
  // expect results <= limit from offset, and totalResults
  // {results: [], total: 20}

  const offset = (requestedPage - 1) * config.search.limit
  const { results, total } = await getPaymentData(searchString, offset)

  const matches = results.map((x: any) => ({...x, amount: getReadableAmount(parseFloat(x.total_amount))}))
  return {
    matches,
    total: total
  }
}

const createModel = async (payload: any, error?: any) => {
  if(error) {
    return {
      errorList: [{
        text: "Enter a search term",
        href: "#searchInput"
      }],
      total: 0 
    }
  }

  const searchString = decodeURIComponent(payload.searchString)
  const requestedPage = payload.page
  const { matches, total } = await performSearch(searchString, requestedPage)
  
  return {
    searchString,
    ...getPaginationAttributes(total, requestedPage, searchString),
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
          pageId: Joi.string().default('')
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
