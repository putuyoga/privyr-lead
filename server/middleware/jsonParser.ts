import { Express } from 'express'
import bodyParser from 'body-parser'
import { errorJson } from '../service/response'

function useJsonParser(app: Express) {
  app.use((req, res, next) => {
    // JSON parsing validation
    bodyParser.json()(req, res, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        const message = errorJson('Invalid JSON payload')
        return res.status(400).json(message)
      }

      next()
    })
  })
}

export default useJsonParser
