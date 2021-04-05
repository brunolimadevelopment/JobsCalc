module.exports = {
       
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