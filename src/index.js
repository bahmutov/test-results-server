const { send } = require('micro')
const { router, get, post } = require('microrouter')
const versionMiddleware = require('version-middleware')()

const hello = async (req, res) =>
  send(res, 200, await Promise.resolve(`Hello ${req.params.who}`))

const saveTests = async (req, res) => {
  const { client, project, runId } = req.params
  console.log(
    'saving tests for client "%s" project "%s" run "%s"',
    client,
    project,
    runId
  )
  send(res, 200)
}

const version = (req, res) => versionMiddleware(send.bind(null, res, 200))

module.exports = router(
  get('/hello/:who', hello),
  post('/tests/:client/:project/:runId', saveTests),
  get('/version', version)
)
