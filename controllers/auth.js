const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const database = "UserManagement";
const usersTableName = 'Users';
const employeesTableName = 'Employees';
const mysqlConnection = require("../helper/connection");
const apiResponse = require('../helper/apiResponse');

const insertEmployeeData = async (sqlQueryToInsertInEmployees) => {
    let employeeId;
    return new Promise(function (resolve, reject) {
        mysqlConnection.query(sqlQueryToInsertInEmployees, function (error, result, fields) {
            if (error) {
                console.log('AuthController::insertEmployeeData::error:: ', error);
                return apiResponse.ErrorResponse(res, 'Error occurred..');
            } else {
                console.log('result:: ', result);
                for (const key in result) {
                    if (result.hasOwnProperty(key) && key == 'insertId') {
                        employeeId = result[key];
                        console.log('employeeId:: ', employeeId);
                        break;
                    }
                }
                resolve(employeeId);
            }
        });
    });
}

exports.register = async (req, res) => {
    console.log('AuthController::register::req.body:: ', req.body);
    const { firstName, lastName, email, password, organizationName } = req.body;

    const checkEmailQuery = `Select email from ${database}.${usersTableName} where email = '${email}';`;
    mysqlConnection.query(checkEmailQuery, function (error, result, fields) {
        if (error) {
            console.log('AuthController::register::error:: ', error);
            return apiResponse.ErrorResponse(res, 'Error occurred..');
        }
        if (result && result.length > 0) {
            return apiResponse.ErrorResponse(res, 'This email is already in use');
        }
    });

    const sqlQueryToInsertInEmployees = `Insert into ${database}.${employeesTableName}
                     (organizationName) values ('${organizationName}');`

    let employeeId = await insertEmployeeData(sqlQueryToInsertInEmployees);
    let hashPassword = await bcrypt.hash(password, 8);

    const sqlQueryToInsertInUsers = `Insert into ${database}.${usersTableName}
                     (firstName, lastName, email, password, employeeId)
                     values ('${firstName}','${lastName}', '${email}', '${hashPassword}', ${employeeId});`

    mysqlConnection.query(sqlQueryToInsertInUsers, async (err, result) => {
        if (err) {
            console.log('AuthController::register::error:: ', err);
            return apiResponse.ErrorResponse(res, 'Error occurred..');
        }
        else {
            mysqlConnection.query(checkEmailQuery, async (error, response) => {
                if (error) {
                    console.log('AuthController::register::error:: ', error);
                    return apiResponse.ErrorResponse(res, 'Error occurred..');
                }
                if (response && response.length > 0) {
                    const email = response[0].email;
                    const token = await jwt.sign({ email }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    console.log('AuthController::register::token:: ', token);

                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    };

                    return apiResponse.successResponseWithData(res, { firstName, lastName, email, token });
                }
            });
        }
    });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return apiResponse.ErrorResponse(res, 'Please provide email and password!');
        }

        const sqlQuery = `Select * from ${database}.${usersTableName} where email = '${email}';`;
        mysqlConnection.query(sqlQuery, async (error, result) => {
            if (!result || !(await bcrypt.compare(password, result[0].password))) {
                return apiResponse.ErrorResponse(res, 'Email or Password is incorrect');
            } else {
                const email = result[0].email;
                const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log('token:: ', token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                };

                return apiResponse.successResponseWithData(res, { token });
            }
        });
    } catch (error) {
        console.log('login::error:: ', error);
    }
};