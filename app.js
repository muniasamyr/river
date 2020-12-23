const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const DBUtil = require('./dbUtill');
connectDb = async () => {
    try {
      var connection = new DBUtil();
      db = await connection.initiateConnection();
      app.locals.db = db;
    } catch (ex) {
      console.error('Failed to make database connections!')
      console.error(ex)
    }
  }
  connectDb();
app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token, userId,doctorId,adminId,hospitalAdminId, pharmacyId, hospitalSuperAdminId,labId,labUserId,travelManagementId,travelUserId,hospitalUserId');
  res.setHeader('Access-Control-Allow-Credentials', false);
  next();

});

app.use('/api/admin', require('./service/admin/admin.router'));

let ip='192.168.1.103'
app.listen(3000,ip)