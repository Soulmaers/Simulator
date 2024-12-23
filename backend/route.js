const express = require('express')
const router = express.Router()
const CompilingStruktura = require('./servises/CompilingStruktura')

module.exports = router

router.post('/api/getData', async (req, res) => {
    const value = req.body.value

    //  console.log('тут')
    const instance = new CompilingStruktura(value)
    const data = await instance.init()
    res.json(data)
})