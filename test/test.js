const test = require('ava')
const got = require('got')
const URL = require('url').URL
const is = require('check-more-types')
const la = require('lazy-ass')

const isVersionInfo = is.schema({
  version: is.unemptyString,
  git: is.unemptyString,
  started: is.unemptyString
})

const server = process.env.NOW_URL
  ? process.env.NOW_URL
  : 'http://localhost:3000'
la(is.url(server), 'missing server to test')

const toFullUrl = point => new URL(point, server)

console.log('testing server at', server)

test('server /version', async t => {
  const info = await got(toFullUrl('/version'), { json: true })
  t.true(isVersionInfo(info.body))
})

test('server /hello/:who', async t => {
  const info = await got(toFullUrl('/hello/foobar'))
  t.snapshot(info.body)
})
