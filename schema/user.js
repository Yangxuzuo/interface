const joi = require('joi')

// string()值必须是字符串
// alphanum()值只能是包含a-z、A-Z、0-9的字符串
// min(length)
//max(length)最大长度
//required()必填值
//pattern(正则表达式)值必须符合正则表达式的规则


//用户名的验证规则
// const username = joi.string().alphanum().min(1).max(10).required()

// //密码验证规则
// const password = joi.string().required()
const username = joi.string()
const userId = joi.string()
const acName = joi.string()
const acType = joi.string()
const telephone = joi.string()
const type = joi.string()
const password = joi.string()
const founder = joi.string()
const founderTime = joi.string()
//.pattern(/^[\S]{6,12}$/)
//
//注册和登录表单的验证规则对象
exports.reg_login_schema = {
    //表示对req.body中的数据进行验证
    // body: {
    //     username,
    //     password,
    // },
    body: {
        username,
        password,
        userId,
        acName,
        acType,
        telephone,
        type,
        founder,
        founderTime
    }
}