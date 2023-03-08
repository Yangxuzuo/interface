const express = require('express')

//配置cors跨域
const cors = require('cors')
//创建express服务器
const app = express()
const bodyParser = require('body-parser')

//导入验证数据
const joi = require('joi')

//导入token解析
const expressJWT = require('express-jwt')
const config = require('./config')



//封装res.cc函数
app.use(function (req, res, next) {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
//必须放在res.cc中间件的后面否则res.cc还没有挂载就报错会出现问题
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
//导入注册用户路由模块
const userRouter = require('./router/user')

app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007');
})

app.use(cors())

//配置解析表单中间件
app.use(express.urlencoded({ extended: true }))

//处理body参数
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', userRouter)

//错误中间件
app.use(function (err, req, res, next) {
    //数据验证失败提示错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    res.cc(err)

})


