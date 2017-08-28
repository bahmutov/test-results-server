const test = require('ava')
const got = require('got')
const is = require('check-more-types')
const la = require('lazy-ass')
const {concat} = require('urlconcat')

const isVersionInfo = is.schema({
  version: is.unemptyString,
  git: is.unemptyString,
  started: is.unemptyString
})

const server = process.env.NOW_URL
  ? process.env.NOW_URL
  : 'http://localhost:3000'
la(is.url(server), 'missing server to test')

const toFullUrl = point => concat(server, point)

const client = 'test-client-key'
const project = 'test-project'

console.log('testing server at', server)

test('server /version', async t => {
  const info = await got(toFullUrl('/version'), { json: true })
  t.true(isVersionInfo(info.body))
})

test('server /hello/:who', async t => {
  const info = await got(toFullUrl('/hello/foobar'))
  t.snapshot(info.body)
})

test.only('save tests', async t => {
  const results = {
    tests: [
      {
        title: 'D',
        fullTitle: 'outer inner D'
      }
    ],
    version: '0.0.0-development'
  }
  const url = `/tests/${client}/${project}/${t.title}`
  await got.post(toFullUrl(url), {json: true, body: results})
  // get tests back
  const back = (await got.get(toFullUrl(url), {json: true})).body
  t.deepEqual(back, results)
})
