//导入db
const db = require('../db/index')

exports.getGoodsList = (req,res) => {
    console.log(req);
    const { mode } = req.query;
    console.log(mode);
    const sql = `select * from goods  join warehouse on goods.wareHouseId=warehouse.wareHouseID where warehouse.type='${mode}'`;
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