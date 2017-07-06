/**
 * 用户信息
 */
var mongoose = require('./db.js');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: { type: String, index: true },    //姓名
    userage: { type: Number,min: 18, max:120},  //年龄18-120
    usersex:{type:String},						//性别
    usertel:{type:Number},						//电话
    userul:{type:String},						//地址
    usernum:{type:Number}						//省份证号
});
module.exports = mongoose.model('Student', UserSchema);//导出