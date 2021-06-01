const database = "UserManagement";
const usersTableName = 'Users';
const employeesTableName = 'Employees';
const mysqlConnection = require("../helper/connection");
const apiResponse = require('../helper/apiResponse');

exports.getUsersList = async (req, res) => {
    try {
        console.log('UserController::getUsersList::req.body:: ', req.body);
        const { searchByFirstName, searchByLastName, searchByEmployeeId, sortBy, page = 1, pageSize = 10 } = req.body;

        let getUsersListQuery = `Select USER.firstName, USER.lastName, USER.email, USER.employeeId, EMP.organizationName
                            from ${database}.${usersTableName} as USER`;

        // Join with Employees table to get organization name
        getUsersListQuery += ` left join ${database}.${employeesTableName} as EMP
                            ON  USER.employeeId = EMP.id`;

        let whereCheck = [];
        // Check for search
        if (searchByFirstName) {
            whereCheck.push(` USER.firstName like '%${searchByFirstName}%'`);
        }
        if (searchByLastName) {
            whereCheck.push(` USER.lastName like '%${searchByLastName}%'`);
        }
        if (searchByEmployeeId) {
            whereCheck.push(` USER.employeeId = ${searchByEmployeeId}`);
        }

        if (whereCheck.length) {
            getUsersListQuery += ' WHERE ' + whereCheck.join(' AND ');
        }

        if (sortBy != '') {
            getUsersListQuery += ` ORDER by ${sortBy}`
        }

        if (page && pageSize) {
            const offsetValue = (page - 1) * pageSize;
            getUsersListQuery += ` LIMIT ${pageSize} OFFSET ${offsetValue}`;
        }

        getUsersListQuery += ';';


        console.log('UserController::getUsersList::getUsersListQuery:: ', getUsersListQuery);
        mysqlConnection.query(getUsersListQuery, function (error, result, fields) {
            if (error) {
                console.log('UserController::getUsersList::error:: ', error);
                return apiResponse.ErrorResponse(res, 'Error occurred..');
            }
            return apiResponse.successResponseWithData(res, result);
        });

    } catch (error) {
        console.log('Controllers::users::getUsersList:: ', error)
        return apiResponse.ErrorResponse(res, 'Error occurred in get user listing api.');
    }
};
