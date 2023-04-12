//导入db
const db = require('../db/index')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

// 获取所有供应商数据
exports.supplierList = (req, res) => {
    console.log(req);
    const { phoneOrName } = req.query
    console.log(phoneOrName);
    // console.log(phoneOrName === '');
    if( phoneOrName != '')
    {
        const sql = `select * from supplier where supplierName='${phoneOrName}' or telephone='${phoneOrName}'`
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
    if( phoneOrName == ''){
        const sql = `select * from supplier`
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

// 删除供应商
exports.deleteSupplier = (req, res) => {
    console.log(req);
    const { supplierId } = req.body;
    console.log(supplierId);
    const sql = `delete from supplier where supplierId=?`
    db.query(sql , supplierId, function(err, result){
        if(err) return res.cc(err);
        res.send({
            code: 200,
            status: 0,
            msg: '删除成功'
        })
    })
}

// 获取用户详情
exports.getSupplierDetail = (req, res) => {
    // console.log(req);
    const { userId } = req.query;
    const sql = `select * from supplier where supplierId=?`;
    db.query(sql, userId, function(err, result){
        if(err) return res.cc(err);
        res.send({
            code: 200,
            status: 0,
            data: result
        })
    })
}

// 禁用或启用用户
exports.banOrPinckSupplier = (req, res) => {
    // console.log(req);
    let { type, supplierId } = req.body;
    console.log(type);
    // 三元表达式来限制?
    let actype = ( type == 0)? 1 : 0;
    // console.log(type);
    db.query(`update supplier set type=${actype} where supplierId='${supplierId}'`, function(err,result){
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

// 编辑用户
exports.editSupplier = (req,res) => {
     //接受表单数据
     const supplierInfo = req.body
     console.log(supplierInfo);
     // console.log(userinfo)
     //判断数据是否合法
     if (!supplierInfo.supplierName) {
         //return res.send({ status: 1, message: '用户名或密码不能为空！' })
         return res.cc('用户名不能为空！')
     }
     //定义sql语句查询
     const sqlStr = `select * from supplier where supplierName = ?`
 
     db.query(sqlStr, supplierInfo.supplierName, function (err, results) {
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
     const sql = `update supplier set ? where supplierId=supplierInfo.supplierId`
     db.query(sql, { supplierName: supplierInfo.supplierName, 
                    type: supplierInfo.type,
                    telephone: supplierInfo.telephone,
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
}

// 新增用户
exports.addSupplier = (req, res) => {

    //接受表单数据
    const supplierInfo = req.body
    console.log(supplierInfo);
    // console.log(userinfo)
    //判断数据是否合法
    if (!supplierInfo.supplierName) {
        //return res.send({ status: 1, message: '用户名或密码不能为空！' })
        return res.cc('用户名或密码不能为空！')
    }
    //定义sql语句查询
    const sqlStr = `select * from supplier where supplierName = ?`

    db.query(sqlStr, supplierInfo.supplierName, function (err, results) {
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
    const sql = `insert into supplier set ?`

    db.query(sql, { supplierName: supplierInfo.supplierName,  
                    telephone: supplierInfo.telephone, 
                    type: supplierInfo.type,
                    supplierId: supplierInfo.supplierId,
                    founder: supplierInfo.founder,
                    founderTime: supplierInfo.founderTime }, function (err, results) {
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
