const mysql = require('mysql');

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: ' 609609 ',
    database: 'puchasesys',
})

//暴露db
module.exports = db;