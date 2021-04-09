const sqlite3 = require('sqlite3')
const { open } = require('sqlite') // { open } to usando só uma função do pacote sqlite

module.exports = () => open({
    filename: './database.sqlite', // nome do arquivo onde será gravado as info.
    driver: sqlite3.Database, // é o processador de dados do banco, ele que manda os dados pro filename.
  })

