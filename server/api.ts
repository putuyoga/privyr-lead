import express from 'express'
import useJsonParser from './middleware/jsonParser'
import apiRoutes from './routes'

const app = express()
useJsonParser(app)
app.use('/api/v1', apiRoutes)

module.exports = app
