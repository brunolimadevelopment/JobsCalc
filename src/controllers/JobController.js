const Job      = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile  = require('../model/Profile')

module.exports = {

    create(req, res) {
        return res.render("job")
    },

    async save(req, res) {

        await Job.create({
            name: req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
            created_at: Date.now() // atribuindo data de hoje
        })
        
        return res.redirect('/')
    },

    async show(req, res) {
        
        const jobId = req.params.id // ID do job parametro na url
        const jobs  = await Job.get()
        const job   = jobs.find(job => Number(job.id) === Number(jobId)) // pra cada um job {} objeto faz uma verificação pelo ID do job
        
        if(!job) {
            return res.send('Job not found!')
        }
        
        const profile = await Profile.get()
        job.budget    = JobUtils.calculateBudget(job, profile["value-hour"])

        return res.render("job-edit", { job })
    },

    async update(req, res) {

        const jobId = req.params.id

        const updatedJob = {
            name: req.body.name, // atualiza o valor de name
            "total-hours": req.body["total-hours"], // atualiza o valor de total hours
            "daily-hours": req.body["daily-hours"], // atualiza o valor de daily-hours
        }

        await Job.update(updatedJob, jobId)

        res.redirect('/job/' + jobId)
    },

    async delete(req, res) {

        const jobId = req.params.id // ID do job a ser excluido        
        
        await Job.delete(jobId)

        return res.redirect('/')

    }
}