//用户路由模块

const express = require('express');

//创建路由对象
const router = express.Router();

const UserHandler = require('../router_handler/user')
const SupplierHandler = require('../router_handler/supplier')

//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

//导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')

//注册新用户
// 3. 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 3.1 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 3.2 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
router.post('/reguser', expressJoi(reg_login_schema), UserHandler.regUser)
//登录
router.post('/login', expressJoi(reg_login_schema), UserHandler.logIn)
//首页信息获取
router.get('/getManagementData', UserHandler.getManagementData)
// 修改用户密码
router.post('/changePassword',UserHandler.changePassword)
// 获取所有账号信息
router.get('/userList', UserHandler.userList)
// 删除用户
router.delete('/deleteUser', UserHandler.deleteUser)
// 获取用户详情
router.get('/getUserDetail', UserHandler.getUserDetail)
// 重置用户密码
router.post('/resetPassword', UserHandler.resetPassword)
// 编辑用户
router.post('/editUser', UserHandler.editUser)
// 禁用或启用用户
router.post('/banOrPinckUser', UserHandler.banOrPinckUser)

// 获取供应商列表
router.get('/supplier/supplierList', SupplierHandler.supplierList);
//删除供应商
router.delete('/supplier/deleteSupplier', SupplierHandler.deleteSupplier)
//禁用或启用供应商
router.post('/supplier/banOrPinckSupplier', SupplierHandler.banOrPinckSupplier)
//编辑供应商
router.post('/supplier/editSupplier', SupplierHandler.editSupplier)
//获取供应商详情
router.get('/supplier/getSupplierDetail', SupplierHandler.getSupplierDetail)
// 新增供应商
router.post('/supplier/addSupplier', SupplierHandler.addSupplier)

module.exports = router;