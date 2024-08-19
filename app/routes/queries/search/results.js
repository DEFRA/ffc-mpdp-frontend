const Joi = require('joi')

const resultsQueryObj = {
  searchString: Joi.string().trim().min(1).required(),
  page: Joi.number().default(1),
  pageId: Joi.string().default(''),
  schemes: Joi.alternatives().try(Joi.string(), Joi.array()).default([]),
  amounts: Joi.alternatives().try(Joi.string(), Joi.array()).default([]),
  years: Joi.alternatives().try(Joi.string(), Joi.array()).default([]),
  counties: Joi.alternatives().try(Joi.string(), Joi.array()).default([]),
  sortBy: Joi.string().trim().optional().default('score'),
  referer: Joi.string().trim().optional().default('')
}

module.exports = {
  resultsQuery: Joi.object(resultsQueryObj)
}
