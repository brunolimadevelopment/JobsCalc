// sendFile() - ao requisitar uma rota o server envia/exibe o arquivo no front
// render() - renderiza o arquivo
// OBS: com o template enginer ejs: também não precisa definir a extensão do arquivo.

const express = require('express');
const routes  = express.Router();


const views = __dirname + "/views/";

const Profile = {
    data:  {
        name: "Bruno",
        avatar: "https://github.com/brunolimadevelopment.png",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75
    },

    controllers: {
        index(req, res) {
            return res.render(views + "profile", { profile: Profile.data })
        },

        update(req, res) {
            // req.body para pegar os dados
            const data = req.body

            // definir quantas semanas tem num ano: 52
            const weeksPerYear = 52

            // remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mes
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

            // total de horas trabalhadas na semana
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"];

            // horas trabalhadas no mês
            const monthlyTotalHours = weekTotalHours * weeksPerMonth

            // qual será o valor da minha hora?
            const valueHour = data["monthly-budget"] / monthlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            res.redirect('/profile')
        }
    }
}

const Job = {

    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 1,
            created_at: Date.now()
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now()
        }
    ],

    controllers: {

        index(req, res) {

            const updateJobs = Job.data.map((job) => {
        
                const remaining = Job.services.remainingDays(job);
                const status    = remaining <= 0 ? 'done' : 'progress'
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                }
            })
        
            return res.render(views + "index", { jobs: updateJobs })
        
        },

        create(req, res) {
            return res.render(views + "job")
        },

        save(req, res) {
            
            const lastId = Job.data[Job.data.length - 1]?.id || 0;

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now() // atribuindo data de hoje
            })

            return res.redirect('/')
        },

        show(req, res) {
            
            const jobId = req.params.id // ID do job parametro na url
            const job   = Job.data.find(job => Number(job.id) === Number(jobId)) // pra cada um job {} objeto faz uma verificação pelo ID do job
            
            if(!job) {
                return res.send('Job not found!')
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

            return res.render(views + "job-edit", { job })
        },

        update(req, res) {

            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId)) // pra cada objeto job {}

            if(!job) {
                return res.send('Job not found!')
            }

            const updatedJob = {
                ...job, // desestruturando o objeto job
                name: req.body.name, // atualiza o valor de name
                "total-hours": req.body["total-hours"], // atualiza o valor de total hours
                "daily-hours": req.body["daily-hours"], // atualiza o valor de daily-hours
            }

            Job.data = Job.data.map(job => {
                
                if(Number(job.id) === Number(jobId)) {
                    job = updatedJob
                }

                return job
            })

            res.redirect('/job/' + jobId)
        },

        delete(req, res) {

            const jobId = req.params.id // ID do job a ser excluido
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId)) // filtra os IDs dos jobs, se for diferente do ID clicado remove do objeto
            return res.redirect('/')

        }
    },

    services: {
       
        remainingDays(job) {
            // Ajustes no job - Calculo de tempo restante
            // toFixed() - arredonda o valor quebrado
            const remainingDays    = (job['total-hours'] / job['daily-hours']).toFixed()        
            
            const createdDate  = new Date(job.created_at)
            const dueDay       = createdDate.getDate() + Number(remainingDays) // Data futura
            const dueDateInMs  = createdDate.setDate(dueDay) // data de vencimento
            
            const timeDiffInMs = dueDateInMs - Date.now();  
        
            // transformar milli em dias
            // 1000 = milisegundos
            // 1000 * 60 = segundos
            // 1000 * 60 * 60 = minutos
            // 1000 * 60 * 60 * 24 = horas
            const dayInMs = 1000 * 60 * 60 * 24  // dia em milisegundos
            const dayDiff = Math.floor(timeDiffInMs / dayInMs) // arredonda pra baixo
        
            // restam x dias
            return dayDiff
        },

        calculateBudget: (job, valueHour) => valueHour * job["total-hours"]

    }

}




 

// request, response
routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)




module.exports = routes; // exporta routes para utilizar no server.js