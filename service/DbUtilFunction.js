var DBUtil = require('../dbUtill');
module.exports.collectionInsert = async function collectionInsert(collection, insertData, meassageNode) {
    try {
        var connection = new DBUtil();

        var status = await connection.insertOne(collection, insertData);
        if (status.name !== undefined) {
            response = {
                success:false,
                error: status.name,
                message: 'Error Occured'
            };
            return response;
        }
        return {
            success: true,
            message: meassageNode + 'Details are inserted successfully',
            vehicleId: status.insertedId
        }
    } catch (ex) {
        return {
            success:false,
            error: ex,
            message: 'Exception Error Occured'

        };
    }
}


module.exports.collectionUpdate = async function collectionUpdate(collection, updateData, meassageNode) {
    try {
        var response;
        var connection = new DBUtil();

        var result = await connection.updateOne(collection, updateData);
        console.log("result", result)
        if (result.name !== undefined) {
            response = {
                success: false,
                error: result.message,
                message: 'Error Occured',
                stackTrace: JSON.stringify(result)
            };
            return response;
        }
        response = {
            success: true,
            message: meassageNode + ' Details are updated Successfully',

        };
        return response;
    } catch (ex) {
        response = {
            error: ex,
            message: 'Error Occured'
        };
        return response;
    }
}


module.exports.collectionFind = async function collectionFind(collection, findStatement, meassageNode) {
    try {
        let connection = new DBUtil();

        let status = await connection.find(collection, findStatement)

        if (status.name !== undefined) {
            response = {
                error: status.message,
                message: 'Error Occured',
                stackTrace: JSON.stringify(status)
            };
            return response;
        }
        if (status.length === 0) {

            return {
                success: false,
                message: meassageNode + ' Details not found'

            }
        }

        return {
            success: true,
            message: meassageNode + ' Details are Fetch Successfully',
            data: status
        }
    } catch (ex) {
        response = {
            error: ex,
            message: 'Error Occured'
        };
        return response
    }
}

module.exports.collectionFindOne = async function collectionFindOne(collection, findStatement, meassageNode) {
    try {
        let connection = new DBUtil();

        let status = await connection.findOne(collection, findStatement)
      
        if (!status) {
            return {
                success: false,
                message: meassageNode + ' Not Found',
            }
        }
        // if (status.name !== undefined) {
        //     response = {
        //         error: status.name,
        //         message: 'Error Occured',
        //         stackTrace: JSON.stringify(status)
        //     };
        //     return response;
        // }

        return {
            success: true,
            message: meassageNode + ' Details are Fetch Successfully',
            data: status
        }
    } catch (ex) {
        response = {
            error: ex,
            message: 'Error Occured'
        };
        return response
    }
}

module.exports.collectionAggregate = async function collectionAggregate(collection, aggregateStatement, selectFields, meassageNode) {
    try {
        var connection = new DBUtil();

        var status = await connection.aggregate(collection, aggregateStatement, selectFields)
        console.log("status", status)
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
                message: meassageNode + ' Not Found',
                data: []
            }
        }
        return {
            success: true,
            message: meassageNode + ' Details Fetch Successfully',
            data: status
        }

    } catch (ex) {
        response = {
            error: ex,
            message: 'Error Occured'
        };
        return response

    }
}
module.exports.collectionInsertMany = async function collectionInsertMany(collection, insertManyData, meassageNode) {
    try {
        var connection = new DBUtil();
        var result = await connection.insertMany(collection, insertManyData);
        if (result.name !== undefined) {
            response = {
                error: result.name,
                message: 'Error Occured',
                stackTrace: JSON.stringify(result)
            };
            return response;
        }
        response = {
            success: true,
            message: meassageNode + ' has been added Successfully',
        };
        return response;
    }
    catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'Exception Occured: ' + error
        }
    }
}


