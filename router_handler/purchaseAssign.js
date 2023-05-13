//导入db
const db = require('../db/index')

// 获取所有计划单数据
exports.purchasePlanList = (req, res) => {
    console.log(req);
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
        const sql = `select * from purchasePlan where type!='1'`
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