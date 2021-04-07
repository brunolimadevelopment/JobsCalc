const Job      = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile  = require('../model/Profile')

module.exports = {

    create(req, res) {
        return res.render("job")
    },

    save(req, res) {
        const jobs   = Job.get()
        const lastId = jobs[jobs.length - 1]?.id || 0;

        Job.create({
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
        const jobs  = Job.get()
        const job   = jobs.find(job => Number(job.id) === Number(jobId)) // pra cada um job {} objeto faz uma verificação pelo ID do job
        
        if(!job) {
            return res.send('Job not found!')
        }
        
        const profile = Profile.get()
        job.budget    = JobUtils.calculateBudget(job, profile["value-hour"])

        return res.render("job-edit", { job })
    },

    update(req, res) {

        const jobId = req.params.id
        const jobs  = Job.get()
        const job   = jobs.find(job => Number(job.id) === Number(jobId)) // pra cada objeto job {}

        if(!job) {
            return res.send('Job not found!')
        }

        const updatedJob = {
            ...job, // spred - desestruturando o objeto job
            name: req.body.name, // atualiza o valor de name
            "total-hours": req.body["total-hours"], // atualiza o valor de total hours
            "daily-hours": req.body["daily-hours"], // atualiza o valor de daily-hours
        }

        const newJobs = jobs.map(job => {
            
            if(Number(job.id) === Number(jobId)) {
                job = updatedJob
            }

            return job
        })

        Job.update(newJobs)

        res.redirect('/job/' + jobId)
    },

    delete(req, res) {

        const jobId = req.params.id // ID do job a ser excluido        
        
        Job.delete(jobId)

        return res.redirect('/')

    }
}