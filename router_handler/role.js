//导入db
const db = require('../db/index')

exports.roleList = (req,res) =>{
    console.log(req);
    const sql = `select * from userrole`
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