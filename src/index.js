const { send, json } = require('micro')
const { router, get, post } = require('microrouter')
const versionMiddleware = require('version-middleware')()
const la = require('lazy-ass')
const is = require('check-more-types')
const { decode } = require('urlencode')
const R = require('ramda')

const hello = async (req, res) =>
  send(res, 200, await Promise.resolve(`Hello ${req.params.who}`))

const db = {}
const formKey = (client, project, runId) => `${client} - ${project} - ${runId}`

const saveTests = async (req, res) => {
  const { client, project, runId } = R.evolve({
    client: decode,
    project: decode,
    runId: decode
  })(req.params)

  console.log(
    'saving tests for client "%s" project "%s" run "%s"',
    client,
    project,
    runId
  )
  const body = await json(req)
  la(is.object(body), 'expected body of tests to save', body)

  const key = formKey(client, project, runId)
  db[key] = body
  send(res, 200)
}

const loadTests = async (req, res) => {
  const { client, project, runId } = R.evolve({
    client: decode,
    project: decode,
    runId: decode
  })(req.params)

  console.log(
    'loading tests for client "%s" project "%s" run "%s"',
    client,
    project,
    runId
  )
  const key = formKey(client, project, runId)
  if (!key) {
    return send(res, 404)
  }
  send(res, 200, db[key])
}

const version = (req, res) => versionMiddleware(send.bind(null, res, 200))

const logIt = req => console.log(req.method, req.url)

const logAndContinue = fn => (req, res) => {
  logIt(req)
  return fn(req, res)
}

module.exports = logAndContinue(
  router(
    get('/hello/:who', hello),
    get('/version', version),
    // saving / loading test results
    post('/tests/:client/:project/:runId', saveTests),
    get('/tests/:client/:project/:runId', loadTests)
  )
)
