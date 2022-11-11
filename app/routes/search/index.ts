import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

import config from '../../config'
import { search } from '../../backend/api'

const getPaginationAttributes = (totalResults: number, requestedPage: number, path: string, searchString: string) => {
  const encodedSearchString = encodeURIComponent(searchString)
  const totalPages = Math.ceil(totalResults / config.search.limit)
  const previous = requestedPage <= 1 ? null : {
    href: `${path}?searchString=${encodedSearchString}&page=${requestedPage - 1}`,
    labelText: `${requestedPage - 1} of ${totalPages} `,
    attributes: {
      id: 'prevOption'
    }
  }
  
  const next = totalPages <= 1 || totalPages === requestedPage ? null : {
    href: `${path}?searchString=${encodedSearchString}&page=${requestedPage + 1}`,
    labelText: `${requestedPage + 1} of ${totalPages} `,
    attributes: {
      id: 'nextOption'
    }
  }

  return { previous, next }
}

const performSearch = (searchQuery: string, requestedPage: number) => {
  // Get results from api and provice limit and offset as parameters
  // expect results <= limit from offset, and totalResults
  // {results: [], total: 20}

  const offset = (requestedPage - 1) * config.search.limit
  const { results, total } = search(searchQuery, offset)

  return {
    matches: results,
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

  const searchQuery = decodeURIComponent(payload.searchString)
  const requestedPage = payload.page
  
  const { matches, total } = performSearch(searchQuery, requestedPage)

  return {
    searchQuery,
    ...getPaginationAttributes(total, requestedPage, '/search', searchQuery),
    results: matches,
    total
  }
}

module.exports = [
  {
    path: '/search',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          searchString: Joi.string(),
          page: Joi.number().default(1)
        }),
        failAction: async (request: Request, h: ResponseToolkit, error: any) => {
          return h.view('search/index', { ...(request.payload as Object), errorList: [{ text: error.details[0].message }] }).code(400).takeover()
        }
      },
      handler: (request: Request, h: ResponseToolkit): ResponseObject => {
        if(!request.query.searchString) {
          return h.view('search/index')
        }
        
        return h.view('search/results', createModel(request.query))
      }
    }
  },
  {
    path: '/search',
    method: 'POST',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          searchString: Joi.string().strict().trim().min(1).required(),
          page: Joi.number().default(1),
          pageId: Joi.string().default('')
        }),
        failAction: async (request: Request, h: ResponseToolkit, error: any) => {
          if(!(request.payload as any).searchString.trim()) {
            return h.view(
              `search/${(request.payload as any).pageId || 'index'}`,
              createModel(request.payload, error)
            ).code(400).takeover()
          }

          return h.view('search/index', { ...(request.payload as Object), errorList: [{ text: error.details[0].message }] }).code(400).takeover()
        }
      },
      handler: (request: Request, h: ResponseToolkit): ResponseObject => {
        return h.view('search/results', createModel(request.payload))
      }
    }
  }
]
