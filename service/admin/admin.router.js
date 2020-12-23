var router = require('express').Router();
var admin = require('./admin')

async function signIN(req, res) {
  try {
    let response = await admin.signIN(req);
    if (response.error) {
      return res.status(200).send(response);
    }
    return res.json(response)
  } catch (error) {
    res.status(500).send(error)
  }
}

async function getUser(req, res) {
  try {
    let response = await admin.getUser(req);
    if (response.error) {
      return res.status(200).send(response);
    }
    return res.json(response)
  } catch (error) {
    res.status(500).send(error)
  }
}
async function updateUser(req, res) {
    try {
      let response = await admin.updateUser(req);
      if (response.error) {
        return res.status(200).send(response);
      }
      if (req.body.active === true) {
        
        admin.userActiveNotification(req)
      }
      return res.json(response)
    } catch (error) {
      res.status(500).send(error)
    }
}

async function signUp(req, res) {
  try {
  
    let response = await admin.signUp(req);
    if (response.error) {
      return res.status(200).send(response);
    }
    
    if (req.body.type === "USER"){
    console.log(req.body.type)
      admin.emailTriger(req)
    }
    return res.json(response)
  } catch (error) {
    res.status(500).send(error)
  }
}


async function emailTriger(req, res) {
  try {
    
    let response = await admin.emailTriger(req);
    if (response.error) {
      return res.status(200).send(response);
    }
    return res.json(response)
  } catch (error) {
    res.status(500).send(error)
  }
}

router.post('/signIn', signIN);
router.post('/signUp', signUp);

router.get('/user', getUser);
router.get('/email', emailTriger);
router.put('/user/:userId', updateUser);
module.exports = router;