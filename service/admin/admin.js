var DBUtil = require('../../dbUtill');
const Joi = require('joi');
const {
  ISODate
} = require('../common');
const mail = require('../mailUtil')
const bcrypt = require('bcrypt');
const { collectionInsertMany, collectionInsert, collectionAggregate,collectionUpdate, collectionFindOne } = require('../DbUtilFunction')


/*Insert Events details*/
const signUpValidation = Joi.object().keys({
  name: Joi.string().required(),
  type: Joi.string().valid('ADMIN', 'USER').required(),
  email: Joi.string().required(),
  mobile_no: Joi.string().required(),
  age: Joi.string().required(),
  gender: Joi.string().valid('MALE', 'FEMALE').required(),
  password: Joi.string().required()

});

module.exports.signUp = async function signUp(req) {
  try {
    var connection = new DBUtil();
    var reqData = req.body;
    var response;

    const validate = signUpValidation.validate(reqData);
   
    if (validate.error) {
      return {
        success:false,
        message: validate.error.details[0].message,
        error: ' Occured'
      }
    }
    reqData.active = false
    let conditionByEmailOrMobile = {
      $or: []
    }
    if (reqData.email) {
      conditionByEmailOrMobile.$or.push({
        "email": new RegExp('^' + reqData.email + '$', 'i')
      })
    }
    if (reqData.mobile_no) {
      conditionByEmailOrMobile.$or.push({
        mobile_no: reqData.mobile_no
      })
    }

    const findAuthQuery = {
      "query": {
        $and: [{
          type: reqData.type
        },
          conditionByEmailOrMobile
        ]
      },
      "fields": {
        _id: 1,
        user_name: 1,
        email: 1,
        mobile_no: 1
      }
    };
    let findAuthStatus = await connection.find('user_admin', findAuthQuery);

    if (findAuthStatus.name !== undefined) {
      response = {
        error: findAuthStatus.name,
        message: 'Error has Occurred',
        stackTrace: JSON.stringify(findAuthStatus)
      };
      return response;
    }
    if (findAuthStatus.length !== 0) { // throw Error Msgs

      if (reqData.email && findAuthStatus[0].email) {
        if (reqData.email.toLowerCase() === findAuthStatus[0].email.toLowerCase()) {
          return {
            message: ` "Email" has already exists in "${reqData.type}" `,
            success: false
          }
        }
      }
      if (reqData.mobile_no && findAuthStatus[0].mobile_no) {
        if (reqData.mobile_no === findAuthStatus[0].mobile_no) {
          return {
            message: ` "Mobile Number" has already exists in "${reqData.type}" `,
            success: false
          }
        }
      }
    }
    if (findAuthStatus.length !== 0) { // throw  Error Msgs
      return {
        message: ` "${reqData.type}" has already exists `,
        success: false
      }
    }
    const password = bcrypt.hashSync(reqData.password, 10);
    reqData.password = password
    let result = await collectionInsert('user_admin', reqData, 'signup')
    return result

  } catch (ex) {
    return {
      error: ex.message,
      message: 'Error Occured'
    };

  }
};
const signInValidation = Joi.object().keys({
  type: Joi.string().valid('ADMIN', 'USER').required(),
  user_entry: Joi.string().required(),
  password: Joi.string().required()

});
module.exports.signIN = async function signIN(req) {
  try {
    var connection = new DBUtil();
    var reqData = req.body;
    var response;

    // const validateRes = signInValidation.validate(reqData);
    // if (validateRes.error !== null) {
    //   return {
    //     message: JSON.stringify(validateRes.value.error),
    //     error: JSON.stringify(validateRes.value.error) + ' Occured'
    //   }
    //   }
    const selectQueryForAuth = {
      "query": {
        $and: [{
          type: reqData.type,
        },
        {
          email: reqData.user_entry
        }
        ]
      },
      "fields": {
        _id: 1,
        email: 1,
        active: 1,
        password: 1

      }
    };
    let result = await collectionFindOne('user_admin', selectQueryForAuth, 'sign in')

    if (result.success) {

      if (result.data.active === false) {

        return {
          success: false,
          error: "Invalid Login Credentials",
          message : 'your account not yet to activate or de activate please contact rmuniasamy392@gmail.com'
        }
      }
    
      const isPasswordValid = bcrypt.compareSync(reqData.password, result.data.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: "Invalid Login Credentials",
          message: "Invalid Login Credentials11",
        }
      }
    }

    return result

  } catch (ex) {
    return {
      error: ex.message,
      message: 'Error Occured'
    };

  }
};


module.exports.getUser = async function getUser(req) {
  try {
    var connection = new DBUtil();
    var response;

    var selectQuery = {
      "query": {
        type: "USER"
      },
      "fields": {
        "_id" : 1,
        "email" : 1,
        "age": 1,
        "name":1,
        "gender" : 1,
        "password" : 1,
        "type" :1,
        "mobile_no" :1 ,
        "active" :1

      }
    };
    var status = await connection.find('user_admin', selectQuery)
    if (status.name !== undefined) {
      response = {
        error: status.name,
        message: 'Error Occured',
        stackTrace: JSON.stringify(status)
      };
      return response;
    }
    if (status.length === 0) {
      return {
        success: false,
        message: 'user was  Found',
      }
    }
    return {
      success: true,
      message: 'user Details Fetch Successfully',
      data: status
    }
  } catch (ex) {
    let response = {
      error: ex.message,
      message: 'Error Occured'
    };
    return response
  }
}



module.exports.updateUser = async function updateUser(req) {
  try {
    let connection=new DBUtil()
    let updateQuery = {
      "query": {
        _id: connection.getMongoId(req.params.userId),
        type: "USER"

      },
      "set": {
        "$set": req.body

      }
    }



    let result = await collectionUpdate('user_admin', updateQuery, 'user')
    return result
  } catch (ex) {
    let response = {
      error: ex.message,
      message: ex.message+'Error Occured'
    };
    return response
  }
}


module.exports.emailTriger = async function emailTriger(req) {
  try {
    let htmlData = await htmlFunction(req);
    
    let mailResult = await mail.sendEmail("Welcome ", htmlData, req.body.email)
    return {
      success: false,
      data: mailResult
    }
  } catch (ex) {
  
    let response = {
      error: ex.message,
      message: 'Error Occured'
    };
    return response
  }
}

async function htmlFunction(req) {
  let message = `
  <html>

 <body>

 <p>Hi ${req.body.name} </p>

  <p>welcome to riverstone technology .kindly wait for admin for furthur steps </p>
 </body>
</html>
  `
  return message
}


async function getUserById(userId) {
  let connection=new DBUtil()
  let findQuery = {
    "query": {
      _id: connection.getMongoId(userId)
    },
    fields: {
      _id:0
    }
   
  }



  let result = await collectionFindOne('user_admin', findQuery, 'user')
  return result
}




module.exports.userActiveNotification = async function userActiveNotification(req) {
  try {
   
    let result = await getUserById(req.params.userId)
    console.log(JSON.stringify(result))
    if (result.success) {
      let object = {
        body:result.data
      }
      let htmlData = await userActiveNotificationHtmlFunction(object)
      let mailResult = await mail.sendEmail("Welcome ", htmlData, object.body.email)
   
    }
    return {
      success: true,
    
    }
   
  } catch (ex) {
  
    let response = {
      error: ex.message,
      message: 'Error Occured'
    };
    return response
  }
}

async function userActiveNotificationHtmlFunction(req) {
  let message = `
  <html>

 <body>

 <p>Hi ${req.body.name} </p>

  <p>congrats!admin has approved your request  </p>
 </body>
</html>
  `
  return message
}
