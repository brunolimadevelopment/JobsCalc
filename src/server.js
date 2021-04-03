// use() - serve para adicionar configurações ao servidor

const express = require("express"); // server
const server  = express();
const routes  = require("./routes"); // src/routes.js

server.set('view engine', 'ejs'); // setando no servidor uma config pra usar uma template engine.


// habilitar arquivos statics
server.use(express.static("public")); // servidor usa essa config da pasta public para criar todas as rotas de css,js e imgs

// habilita o req.body para utilizar parametros nas urls com GET e POST
server.use(express.urlencoded({ extended: true }))

// routes
server.use(routes);

server.listen(3000, () => console.log('rodando'));