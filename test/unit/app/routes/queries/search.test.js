const { resultsQuery } = require('../../../../../app/routes/queries/search/results')

describe('search results schema', () => {
  test('throws error if searchString is missing', () => {
    const { error } = resultsQuery.validate({})
    expect(error).not.toBeNull()
  })

  test('throws error if searchString is empty', () => {
    const { error } = resultsQuery.validate({ searchString: '' })
    expect(error).not.toBeNull()
  })

  test('does not throw error if searchString is present', () => {
    const { error } = resultsQuery.validate({ searchString: 'test' })
    expect(error).toBeUndefined()
  })

  test('defaults page to 1 if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.page).toBe(1)
  })

  test('throws error if page is not a number', () => {
    const { error } = resultsQuery.validate({ searchString: 'test', page: 'test' })
    expect(error).not.toBeNull()
  })

  test('defaults pageId to empty string if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.pageId).toBe('')
  })

  test('defaults schemes to empty array if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.schemes).toEqual([])
  })

  test('defaults amounts to empty array if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.amounts).toEqual([])
  })

  test('defaults years to empty array if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.years).toEqual([])
  })

  test('defaults counties to empty array if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.counties).toEqual([])
  })

  test('defaults sortBy to score if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.sortBy).toBe('score')
  })

  test('defaults referer to empty string if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.referer).toBe('')
  })

  test('does not throw error if referer is empty', () => {
    const { error } = resultsQuery.validate({ searchString: 'test', referer: '' })
    expect(error).toBeUndefined()
  })
})
