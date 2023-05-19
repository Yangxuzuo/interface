//导入db
const db = require('../db/index')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

// 获取所有计划单数据
exports.purchasePlanList = (req, res) => {
    //console.log(req);
    const { purchasePlanId } = req.query
    console.log(purchasePlanId);
    // console.log(phoneOrName === '');
    if( purchasePlanId != '')
    {
        const sql = `select * from purchasePlan where purchasePlanId='${purchasePlanId}'`
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
    if( purchasePlanId == ''){
        const sql = `select * from purchasePlan where type='1'`
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
exports.deletePurchasePlan = (req, res) => {
    console.log(req);
    const { purchasePlanId } = req.body;
    console.log(purchasePlanId);
    const sql = `delete from purchasePlan where purchasePlanId=?`
    db.query(sql , purchasePlanId, function(err, result){
        if(err) return res.cc(err);
        res.send({
            code: 200,
            status: 0,
            msg: '删除成功'
        })
    })
}

// 获取计划单详情
exports.getPurchasePlanDetail = (req, res) => {
    console.log(req);
    const { purchasePlanId } = req.query;
    const sql = `select * from purchasePlan where purchasePlanId=?`;
    db.query(sql, purchasePlanId, function(err, result){
        if(err) return res.cc(err);
        res.send({
            code: 200,
            status: 0,
            data: result
        })
    })
}

// 提交计划单
exports.validatePurchasePlan = (req, res) => {
    // console.log(req);
    let { type, purchasePlanId } = req.body;
    console.log(type);
    // 三元表达式来限制?
    let actype = ( type == 0)? 1 : 0;
    // console.log(type);
    db.query(`update purchasePlan set type=${actype} where purchasePlanId='${purchasePlanId}'`, function(err,result){
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
exports.editPurchasePlan = (req,res) => {
     //接受表单数据
     const purchasePlanInfo = req.body
     console.log(purchasePlanInfo);
     // console.log(userinfo)
     //判断数据是否合法
     if (!purchasePlanInfo.purchasePlanName) {
         //return res.send({ status: 1, message: '用户名或密码不能为空！' })
         return res.cc('用户名不能为空！')
     }
     //定义sql语句查询
     const sqlStr = `select * from purchasePlan where purchasePlanName = ?`
 
     db.query(sqlStr, purchasePlanInfo.purchasePlanName, function (err, results) {
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
     const sql = `update purchasePlan set ? where purchasePlanId=${purchasePlanInfo.purchasePlanId}`
     db.query(sql, { purchasePlanName: purchasePlanInfo.purchasePlanName, 
                    type: purchasePlanInfo.type,
                    telephone: purchasePlanInfo.telephone,
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
exports.addPurchasePlan = (req, res) => {

    //接受表单数据
    const purchasePlanInfo = req.body
    console.log(purchasePlanInfo);
    // console.log(userinfo)
    //判断数据是否合法
    if (!purchasePlanInfo.purchasePlanName) {
        //return res.send({ status: 1, message: '用户名或密码不能为空！' })
        return res.cc('用户名或密码不能为空！')
    }
    //定义sql语句查询
    const sqlStr = `select * from purchasePlan where purchasePlanName = ?`

    db.query(sqlStr, purchasePlanInfo.purchasePlanName, function (err, results) {
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
    const sql = `insert into purchasePlan set ?`

    db.query(sql, { purchasePlanName: purchasePlanInfo.purchasePlanName,  
                    telephone: purchasePlanInfo.telephone, 
                    type: purchasePlanInfo.type,
                    purchasePlanId: purchasePlanInfo.purchasePlanId,
                    founder: purchasePlanInfo.founder,
                    founderTime: purchasePlanInfo.founderTime }, function (err, results) {
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

exports.submitPurcaseTask=(req,res) => {
    const {purchaseWay,supplier,purchaser,purchasePlanId} = req.body;
    console.log(purchaseWay,supplier,purchaser,purchasePlanId);
    const id = purchasePlanId;
    const sql = `update purchaseplan set ? where purchasePlanId='${id}'`
    db.query(sql,{purchaseWay:purchaseWay,
                  purchaser:purchaser,
                  supplier:supplier}, function(err, results){
                    if (err) {
                            return res.cc(err)
                            }
                            if (results.affectedRows !== 1) {
                                return res.cc('修改失败！')
                            }
                            res.send({
                                status: 0,
                                code: 200,
                                msg: '修改成功！'
                            })
    })
}