// sendFile() - ao requisitar uma rota o server envia/exibe o arquivo no front
// render() - renderiza o arquivo
// OBS: com o template enginer ejs: também não precisa definir a extensão do arquivo.

const express = require('express')
const routes  = express.Router()
const ProfileController = require('./controllers/ProfileController')
const JobController     = require('./controllers/JobController')

// request, response
routes.get('/', JobController.index)
routes.get('/job', JobController.create)
routes.post('/job', JobController.save)
routes.get('/job/:id', JobController.show)
routes.post('/job/:id', JobController.update)
routes.post('/job/delete/:id', JobController.delete)

routes.get('/profile', ProfileController.index)
routes.post('/profile', ProfileController.update)

module.exports = routes; // exporta routes para utilizar no server.js