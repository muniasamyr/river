function DbUtil() {

}
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'river';
let db;
DbUtil.prototype.initiateConnection = async function () {
  let client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  console.log('connect db url'+url)
  db = client.db(dbName);
  console.log(db)
  return db
}

DbUtil.prototype.insertMany = async function (table, data) {
  try {
    const collection = db.collection(table);
    var status = await collection.insertMany(data);
    return status;
  } catch (ex) {
    return ex;
  }
}

DbUtil.prototype.insertOne = async function (table, data, lastIdFieldName) {
  try {
    const collection = db.collection(table);
    async function getNextSequence(fieldName) {
      var ret = await collection.find().project({
        [fieldName]: 1
      }).sort({
        [fieldName]: -1
      }).limit(1).toArray();
      if (ret.length === 0)
        return 1;
      else {
        return ret[0][fieldName] + 1;
      }
    }
    if (lastIdFieldName === '' || lastIdFieldName === null || lastIdFieldName == undefined) { } else {
      data[lastIdFieldName] = await getNextSequence(lastIdFieldName);
    }
    var status = await collection.insertOne(data);
    return status;

  } catch (ex) {
    return ex;
  }
}


DbUtil.prototype.getMongoId = function (id) {
  var ObjectId = require('mongodb').ObjectId;
  return ObjectId(id);
}

DbUtil.prototype.find = async function (table, data) {
  try {
    const collection = db.collection(table);
    var resp = await collection.find(data.query).project(data.fields)
      .sort(data.sort)
      .skip(data.skip || 0)
      .limit(data.limit || 0)
      .toArray();
    return resp;
  } catch (ex) {
    return ex;
  }

}

DbUtil.prototype.findOne = async function (table, data) {
  try {
    const collection = db.collection(table);
    var resp = await collection.findOne(data.query, {
      projection: data.fields
    });
    return resp;

  } catch (ex) {
    return ex;
  }

}


DbUtil.prototype.aggregate = async function (table, aggregateData, projectFields) {
  try {
    const collection = db.collection(table);
    var resp = await collection.aggregate(aggregateData).project(projectFields).toArray()
    return resp;

  } catch (ex) {
    return ex;
  }

}
DbUtil.prototype.aggregateWithFunc = async function (table, aggregateData, projectFields, functionExcute) {
  try {
    const collection = db.collection(table);
    const data = [];
    await collection.aggregate(aggregateData).project(projectFields).forEach(element => {
      const output = functionExcute(element);
      if (output) {
        data.push(functionExcute(element));
      }
    })
    return data;
  } catch (ex) {
    return ex;
  }

}

DbUtil.prototype.update = async function (table, data) {
  try {
    const collection = db.collection(table);
    var resp = await collection.updateMany(data.query, data.set, data.options);
    return resp;
  } catch (ex) {
    return ex;
  }

}

DbUtil.prototype.updateOne = async function (table, data) {
  try {
    const collection = db.collection(table);
    var resp = await collection.updateOne(data.query, data.set, data.options);
    return resp;
  } catch (ex) {
    return ex;
  }
}

DbUtil.prototype.insertOneCb = function (table, data, callback) {
  try {
    const collection = db.collection(table);
    collection.insertOne(data, (err, status) => {
      if (err) return callback(err, null);
      return callback(null, status);
    });
  } catch (ex) {
    return ex;
  }
}

DbUtil.prototype.updateOneCb = function (table, data, callback) {
  try {
    const collection = db.collection(table);
    collection.updateOne(data.query, data.set, data.options, (err, status) => {
      if (err) return callback(err, null)
      return callback(null, status);
    });
  } catch (ex) {
    return ex;
  }
}

DbUtil.prototype.getLastSequence = async function (table, fieldName) {
  try {
    const collection = db.collection(table);
    var ret = await collection.find({
      [fieldName]: {
        $exists: true
      }
    }).project({
      [fieldName]: 1
    }).sort({
      '_id': -1
    }).limit(1).toArray();
    if (ret.length === 0)
      return 1;
    else {
      return ret[0][fieldName]
    }
  } catch (ex) {
    return ex;
  }
}

DbUtil.prototype.deleteOne = async function (table, data) {
  try {
    const collection = db.collection(table);
    var resp = await collection.remove(data.query);
    return resp;

  } catch (ex) {
    return ex;
  }
}
DbUtil.prototype.deleteMany = async function (table, data) {
  try {
    const collection = db.collection(table);
    var resp = await collection.deleteMany(data.query);
    return resp;

  } catch (ex) {
    return ex;
  }
}



module.exports = DbUtil;
