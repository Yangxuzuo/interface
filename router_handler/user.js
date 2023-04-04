//导入db
const db = require('../db/index')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')
//导入token密钥
const config = require('../config')

// 新增用户
exports.regUser = (req, res) => {

    //接受表单数据
    const userinfo = req.body
    console.log(userinfo);
    // console.log(userinfo)
    //判断数据是否合法
    if (!userinfo.username || !userinfo.password) {
        //return res.send({ status: 1, message: '用户名或密码不能为空！' })
        return res.cc('用户名或密码不能为空！')
    }
    //定义sql语句查询
    const sqlStr = `select * from user where username = ?`

    db.query(sqlStr, userinfo.username, function (err, results) {
        if (err) {
            //return res.send({ statue: 1, message: err.message })
            return res.cc(err)
        }
        if (results.length > 0) {
            //return res.send({ status: 1, message: '用户名被占用，请换其他的！' })
            return res.cc('用户名被占用！')
        }
    })
    console.log('select over');
    //加密获取的数据密码
    // userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // console.log(userinfo.password)

    //插入
    const sql = `insert into user set ?`

    db.query(sql, { username: userinfo.username, 
                    password: userinfo.password,
                    acType: userinfo.acType, 
                    acName: userinfo.acName,
                    telephone: userinfo.telephone, 
                    type: userinfo.type,
                    userId: userinfo.userId,
                    founder: userinfo.founder,
                    founderTime: userinfo.founderTime }, function (err, results) {
        if (err) {
            //return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        if (results.affectedRows !== 1) {
            //return res.send({ status: 1, message: '插入失败!' })
            return res.cc('插入失败！')
        }

        //res.send({ status: 0, message: '插入成功！' })
        res.send({
            status: 0,
            code: 200,
            msg: '插入成功！'
        })

    })

},

// 修改密码
exports.changePassword = (req, res) => {
    console.log(req);
    const userInfo = req.body
    db.query(`update user set password='${userInfo.newPassword}' where userId='${userInfo.id}'`, function(err,result){
        if(err){
            console.log('修改失败')
            return res.cc(err)
        }
        res.send({
            status: 0,
            code: 200,
            message: '修改成功',
        })
    }) 
}

// 登录
exports.logIn = (req, res) => {
    const userinfo = req.body
    console.log(req);
    console.log(userinfo);
    const sql = `select * from user where username=?`
    db.query(sql, userinfo.username, function (err, results) {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('登录失败！,用户未注册')
        //判断密码是否一致      
        // const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        console.log(results[0].password)
        //console.log(compareResult)
        console.log(userinfo.password)
        if (userinfo.password !== results[0].password) {
            return res.cc('登陆失败！密码错误')
        }

        //通过 ES6 的高级语法，快速剔除 密码 和 头像 的值
        const user = { ...results[0], password: '', user_pic: '' }

        //console.log(user)
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h',
        })
        const token = 'Bearer';

        res.send({
            status: 0,
            code: 200,
            message: '登录成功！',
            id: results[0].userId,
            token: token,
        })
    })
},

// 获取首页数据
exports.getManagementData = (req, res) => {
    const sql = `select * from homemanage`
    db.query(sql, function(err, results) {
        if(err) return res.cc(err)
        // console.log(results);
        res.send({
            status: 1,
            code: 200,
            data: results,
        })
    })
}

// 获取所有账号数据
exports.userList = (req, res) => {
    // console.log(req);
    const { phoneOrName } = req.query
    // console.log(phoneOrName);
    // console.log(phoneOrName === '');
    if( phoneOrName != '')
    {
        const sql = `select * from user where username='${phoneOrName}' or telephone='${phoneOrName}'`
        db.query(sql,function(err, results) {
            if(err) return res.cc(err)
            // 剔除账号密码
            results.map(val => delete val.password)
            res.send({
                status: 1,
                code: 200,
                data: results,
            })
        })
    }
    if( phoneOrName == ''){
        const sql = `select * from user`
        db.query(sql,function(err, results) {
            if(err) return res.cc(err)
            // 剔除账号密码
            // console.log('res',results);
            results.map(val => delete val.password)
            res.send({
                status: 1,
                code: 200,
                data: results,
            })
        })
    }
}