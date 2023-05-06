//导入db
const db = require('../db/index')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

// 获取所有计划单数据
exports.goodsList = (req, res) => {
    console.log(req);
    const { goodsIdOrName } = req.query
    // console.log(phoneOrName === '');
    if( goodsIdOrName != '')
    {
        const sql = `select * from goods where goodsId='${goodsIdOrName}' or goodsName='${goodsIdOrName}'`
        db.query(sql,function(err, results) {
            if(err) return res.cc(err)
            // 剔除账号密码
            //results.map(val => delete val.password)
            res.send({
                status: 0,
                code: 200,
                data: results,
            })
        })
    }
    if( goodsIdOrName == ''){
        const sql = `select * from goods`
        db.query(sql,function(err, results) {
            if(err) return res.cc(err)
            // 剔除账号密码
            console.log('res',results);
            //results.map(val => delete val.password)
            res.send({
                status: 0,
                code: 200,
                data: results,
            })
        })
    }
}

// 取消计划单
exports.deleteGoods = (req, res) => {
    console.log(req);
    const { goodsId } = req.body;
    console.log(goodsId);
    const sql = `delete from goods where goodsId=?`
    db.query(sql , goodsId, function(err, result){
        if(err) return res.cc(err);
        res.send({
            code: 200,
            status: 0,
            msg: '删除成功'
        })
    })
}

// 获取计划单详情
exports.getGoodsDetail = (req, res) => {
    console.log(req);
    const { goodsId } = req.query;
    const sql = `select * from goods where goodsId=?`;
    db.query(sql, goodsId, function(err, result){
        if(err) return res.cc(err);
        res.send({
            code: 200,
            status: 0,
            data: result
        })
    })
}

// 提交计划单
exports.validateGoods = (req, res) => {
    // console.log(req);
    let { type, goodsId } = req.body;
    console.log(type);
    // 三元表达式来限制?
    let actype = ( type == 0)? 1 : 0;
    // console.log(type);
    db.query(`update goods set type=${actype} where goodsId='${goodsId}'`, function(err,result){
        if(err){
            console.log('修改失败')
            return res.cc(err)
        }
        res.send({
            status: 0,
            code: 200,
            msg: '修改成功',
        })
    }) 
}

// 编辑计划单
exports.editGoods = (req,res) => {
     //接受表单数据
     const goodsInfo = req.body
     console.log(goodsInfo);
     // console.log(userinfo)
     //判断数据是否合法
     if (!goodsInfo.goodsName) {
         //return res.send({ status: 1, message: '用户名或密码不能为空！' })
         return res.cc('用户名不能为空！')
     }
     //定义sql语句查询
     const sqlStr = `select * from goods where goodsName = ?`
 
     db.query(sqlStr, goodsInfo.goodsName, function (err, results) {
         if (err) {
             //return res.send({ statue: 1, message: err.message })
             return res.cc(err)
         }
         if (results.length > 0) {
             //return res.send({ status: 1, message: '用户名被占用，请换其他的！' })
             return res.cc('用户名被占用！')
         }
     })
    // console.log('select over');
     //加密获取的数据密码
     // userinfo.password = bcrypt.hashSync(userinfo.password, 10)
     // console.log(userinfo.password)
     const sql = `update goods set ? where goodsId=${goodsInfo.goodsId}`
     db.query(sql, { goodsName: goodsInfo.goodsName, 
                    type: goodsInfo.type,
                    telephone: goodsInfo.telephone,
                   }, function (err, results) {
            if (err) {
            //return res.send({ status: 1, message: err.message })
                return res.cc(err)
                }
                if (results.affectedRows !== 1) {
                    //return res.send({ status: 1, message: '插入失败!' })
                    return res.cc('修改失败！')
                }

                //res.send({ status: 0, message: '插入成功！' })
                res.send({
                    status: 0,
                    code: 200,
                    msg: '修改成功！'
                })

            })
     return ;
}

// 新增计划单
exports.addGoods = (req, res) => {

    //接受表单数据
    const goodsInfo = req.body
    console.log(goodsInfo);
    // console.log(userinfo)
    //判断数据是否合法
    if (!goodsInfo.goodsName) {
        //return res.send({ status: 1, message: '用户名或密码不能为空！' })
        return res.cc('用户名或密码不能为空！')
    }
    //定义sql语句查询
    const sqlStr = `select * from goods where goodsName = ?`

    db.query(sqlStr, goodsInfo.goodsName, function (err, results) {
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
    const sql = `insert into goods set ?`

    db.query(sql, { goodsName: goodsInfo.goodsName,  
                    telephone: goodsInfo.telephone, 
                    type: goodsInfo.type,
                    goodsId: goodsInfo.goodsId,
                    founder: goodsInfo.founder,
                    founderTime: goodsInfo.founderTime }, function (err, results) {
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

}