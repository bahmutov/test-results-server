'use strict'


/* eslint-env mocha */
const testResultsServer = require('.')

describe('test-results-server', () => {
  it('write this test', () => {
    console.assert(testResultsServer, 'should export something')
  })
})
