const utility = require('../helper/utility');
const apiResponse = require('../helper/apiResponse');
const database = "UserManagement";
const usersTableName = 'Users';
const mysqlConnection = require("../helper/connection");

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization;

        if (!token) {
            apiResponse.unauthorizedResponse(res, 'Unauthorized Access');
        } else {
            const decodedUser = utility.verifyJwtToken(token);
            console.log('Decoded user:: ', decodedUser);
            const { email } = decodedUser;

            if (email != '') {
                const checkIfUserExistsQuery = `Select * from ${database}.${usersTableName} where email = '${email}';`;
                mysqlConnection.query(checkIfUserExistsQuery, function (error, result, fields) {
                    console.log('result:: ', result);
                    console.log('result.password:: ', result[0]['password']);
                    if (error) {
                        console.log('Authentication::error:: ', error);
                        return apiResponse.ErrorResponse(res, 'Unable to fetch details of this user.');
                    }
                    if (result && result.length > 0) {
                        next();
                    }
                });
            } else {
                apiResponse.unauthorizedResponse(res, 'Invalid token!!');
            }
        }
    } catch (error) {
        console.log('Authentication::error:: ', error);
        apiResponse.unauthorizedResponse(res, 'Invalid token');
    }
};