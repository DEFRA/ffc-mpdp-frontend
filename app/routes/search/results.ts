import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

import config from '../../config'
import { search } from '../../backend/api'

import { getReadableAmount } from '../../utils/helper'

const getPaginationAttributes = (totalResults: number, requestedPage: number, searchString: string) => {
  const encodedSearchString = encodeURIComponent(searchString)
  const totalPages = Math.ceil(totalResults / config.search.limit)
  const previous = requestedPage <= 1 ? null : {
    href: `/results?searchString=${encodedSearchString}&page=${requestedPage - 1}`,
    labelText: `${requestedPage - 1} of ${totalPages} `,
    attributes: {
      id: 'prevOption'
    }
  }
  
  const next = totalPages <= 1 || totalPages === requestedPage ? null : {
    href: `/results?searchString=${encodedSearchString}&page=${requestedPage + 1}`,
    labelText: `${requestedPage + 1} of ${totalPages} `,
    attributes: {
      id: 'nextOption'
    }
  }

  return { previous, next }
}

const performSearch = (searchString: string, requestedPage: number) => {
  // Get results from api and provice limit and offset as parameters
  // expect results <= limit from offset, and totalResults
  // {results: [], total: 20}

  const offset = (requestedPage - 1) * config.search.limit
  const { results, total } = search(searchString, offset)

  const matches = results.map(x => ({...x, amount: getReadableAmount(parseFloat(x.amount))}))
  return {
    matches,
    total: total
  }
}

const createModel = (payload: any, error?: any) => {
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
  
  const { matches, total } = performSearch(searchString, requestedPage)
  
  return {
    searchString,
    ...getPaginationAttributes(total, requestedPage, searchString),
    results: matches,
    total,
    currentPage: requestedPage
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
          searchString: Joi.string().strict().trim().min(1).required(),
          page: Joi.number().default(1),
          pageId: Joi.string().default('')
        }),
        failAction: async (request: Request, h: ResponseToolkit, error: any) => {
          if(!(request.query as any).searchString.trim()) {
            return h.view(
              `search/${(request.query as any).pageId || 'index'}`,
              createModel(request.query, error)
            ).code(400).takeover()
          }

          return h.view('search/index', { ...(request.query as Object), errorList: [{ text: error.details[0].message }] }).code(400).takeover()
        }
      },
      handler: (request: Request, h: ResponseToolkit): ResponseObject => {
        return h.view('search/results', createModel(request.query))
      }
    }
  }
]
