const db = require('../db/index')

// 获取所有供应商数据
exports.purchaserList = (req, res) => {
    console.log(req);
    const { phoneOrName } = req.query
    console.log(phoneOrName);
    // console.log(phoneOrName === '');
    if( phoneOrName != '')
    {
        const sql = `select * from purchaser where purchaserName='${phoneOrName}' or telephone='${phoneOrName}'`
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
        const sql = `select * from purchaser`
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
// 获取所有供应商数据(无条件)
exports.getPurchaser = (req, res) => {
        const sql = `select * from purchaser`
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

// 删除供应商
exports.deletePurchaser = (req, res) => {
    console.log(req);
    const { purchaserId } = req.body;
    console.log(purchaserId);
    const sql = `delete from purchaser where purchaserId=?`
    db.query(sql , purchaserId, function(err, result){
        if(err) return res.cc(err);
        res.send({
            code: 200,
            status: 0,
            msg: '删除成功'
        })
    })
}

// 获取供应商详情
exports.getPurchaserDetail = (req, res) => {
    console.log(req);
    const { purchaserId } = req.query;
    const sql = `select * from purchaser where purchaserId=?`;
    db.query(sql, purchaserId, function(err, result){
        if(err) return res.cc(err);
        res.send({
            code: 200,
            status: 0,
            data: result
        })
    })
}

// 禁用或启用用户
exports.banOrPinckPurchaser = (req, res) => {
    // console.log(req);
    let { type, purchaserId } = req.body;
    console.log(type);
    // 三元表达式来限制?
    let actype = ( type == 0)? 1 : 0;
    // console.log(type);
    db.query(`update purchaser set type=${actype} where purchaserId='${purchaserId}'`, function(err,result){
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
exports.editPurchaser = (req,res) => {
     //接受表单数据
     const purchaserInfo = req.body
     console.log(purchaserInfo);
     // console.log(userinfo)
     //判断数据是否合法
     if (!purchaserInfo.purchaserName) {
         //return res.send({ status: 1, message: '用户名或密码不能为空！' })
         return res.cc('用户名不能为空！')
     }
     //定义sql语句查询
     const sqlStr = `select * from purchaser where purchaserName = ?`
 
     db.query(sqlStr, purchaserInfo.purchaserName, function (err, results) {
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
     const sql = `update purchaser set ? where purchaserId=${purchaserInfo.purchaserId}`
     db.query(sql, { purchaserName: purchaserInfo.purchaserName, 
                    type: purchaserInfo.type,
                    telephone: purchaserInfo.telephone,
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

// 新增用户
exports.addPurchaser = (req, res) => {

    //接受表单数据
    const purchaserInfo = req.body
    console.log(purchaserInfo);
    // console.log(userinfo)
    //判断数据是否合法
    if (!purchaserInfo.purchaserName) {
        //return res.send({ status: 1, message: '用户名或密码不能为空！' })
        return res.cc('用户名或密码不能为空！')
    }
    //定义sql语句查询
    const sqlStr = `select * from purchaser where purchaserName = ?`

    db.query(sqlStr, purchaserInfo.purchaserName, function (err, results) {
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
    const sql = `insert into purchaser set ?`

    db.query(sql, { purchaserName: purchaserInfo.purchaserName,  
                    telephone: purchaserInfo.telephone, 
                    type: purchaserInfo.type,
                    purchaserId: purchaserInfo.purchaserId,
                    founder: purchaserInfo.founder,
                    founderTime: purchaserInfo.founderTime }, function (err, results) {
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