const express = require('express')
const router = express.Router()

router.post('/register',async (req,res,next)=>{
    
console.log(req.body);

})


router.post('/login', async (req, res, next) => {
    res.send('login')

})


router.post('/refresh-token', async (req, res, next) => {
    res.send('refresh token route ')

})


router.delete('/logout', async (req, res, next) => {
    res.send('logout ')

})

module.exports = router;