const Database = require('./config') // invoca a arrow function do arquivo config.js

const initDB = { 

    async init() {

        // async - manda o js esperar onde tiver o await na hora da execução / await - espera
        // O js não sabe quando o Database termina de ser executado 
        // para ir para as proxímas funções. 
        // o await faz ele esperar a execução de algo para ir para a proxima instrução.
        const db = await Database() // abre a conexão, faz a inicialização do banco.

        await db.exec(`CREATE TABLE profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, 
            avatar TEXT, 
            monthly_budget INT, 
            days_per_week INT,
            hours_per_day INT,
            vacation_per_year INT,
            value_hour INT    
        )`)

        await db.exec(`CREATE TABLE jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            daily_hours INT,
            total_hours INT,
            created_at DATETIME  
        )`)

        await db.run(`INSERT INTO profile (
            name, 
            avatar, 
            monthly_budget, 
            days_per_week, 
            hours_per_day, 
            vacation_per_year,
            value_hour
        ) VALUES (
            "Bruno",
            "https://github.com/brunolimadevelopment.png",
            3000,
            5,
            5,
            4,
            70
        );`)

        await db.run(`INSERT INTO jobs (
            name,
            daily_hours,
            total_hours,
            created_at
        ) VALUES (
            "Pizzaria Guloso",
            2,
            1,
            1617514376018
        );`)

        await db.run(`INSERT INTO jobs (
            name,
            daily_hours,
            total_hours,
            created_at
        ) VALUES (
            "OneTwo Projects",
            3,
            47,
            1617514376018
        );`)

        await db.close() // fecha a conexão
    }
}

initDB.init()