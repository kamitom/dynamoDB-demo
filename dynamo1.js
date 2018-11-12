const AWS = require("aws-sdk");

//TODO: 使用自已的credentails 
const forDev = 'cc';
let dyanmodb = '';
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
let client = '';


if (forDev === 'dev') {

    var credentials_tomrd = new AWS.SharedIniFileCredentials({
        profile: 'tomrd'
    });
    // console.log(credentials_tomrd);
    AWS.config.credentials = credentials_tomrd;

    client = new CognitoIdentityServiceProvider({
        apiVersion: '2016-04-19',
        region: 'us-east-2'
    });

    dynamodb = new AWS.DynamoDB({
        region: 'us-east-2',
        apiVersion: '2012-08-10'
    });
} else {

    var credentials_tomaws = new AWS.SharedIniFileCredentials();

    // console.log(credentials_tomaws);

    AWS.config.credentials = credentials_tomaws;

    dynamodb = new AWS.DynamoDB({
        region: 'ap-southeast-1',
        apiVersion: '2012-08-10'
    });

    client = new CognitoIdentityServiceProvider({
        apiVersion: '2016-04-19',
        region: 'ap-southeast-1'
    });

    console.log(dyanmodb);

}


//產生min到max之間的亂數
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.qryAmibo_Dev = (thePK, theSK, event, context, callback) => {

    let table = "AmiboTable-Dev";

    // thePK = 'MobileUser-60f16463-4f9e-4c98-a492-b3e17185923c';
    // theSK = 'MobileUser-60f16463-4f9e-4c98-a492-b3e17185923c';

    const params = {
        Key: {
            "PK": {
                S: thePK
            },
            "SK": {
                S: theSK
            },
        },
        TableName: table

    }

    // console.log(params);

    dynamodb.getItem(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}




let m_sub;
let d_sub;
exports.qryByPhone = (cogUser) => {

    const params = {
        // 'Username': 'mobile+886905936283',
        'UserPoolId': 'ap-southeast-1_ntfECmrjH', // amibo
        // 'Limit': 2,
        'Filter': `phone_number^=\"${cogUser}\"` // starts with
        // 'Filter': 'phone_number=\"+886971088033\"'
    };

    // console.log(params);

    client.listUsers(params, (err, data) => {

        if (err) {
            console.log(err.message);
            return [];
        } else {
            // console.log(data);
            // console.log(data.Users[1].Attributes[1].Value);  // todo: get sub value
            // console.log(data.Users[0].Username);

            for (let i = 0; i < data.Users.length; i++) {
                let test = data.Users[i].Username;
                if (test.startsWith('device')) {
                    d_sub = 'Device-' + data.Users[i].Attributes[1].Value;
                } else {
                    m_sub = 'MobileUser-' + data.Users[i].Attributes[1].Value;
                }

            }

            // console.log ([m_sub, d_sub]);

            // start --
            let table = "AmiboTable-Dev";

            const params2 = {
                Key: {
                    "PK": {
                        S: m_sub
                    },
                    "SK": {
                        S: m_sub
                    },
                },
                TableName: table

            };
            // dynamodb.getItem(params2, function (err, data) {
            //     if (err) {
            //         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            //     } else {
            //         console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            //     }
            // });
            // end --

            // query PK -- begin
            var params3 = {
                ExpressionAttributeValues: {
                    ":v1": {
                        S: m_sub
                    }
                },
                KeyConditionExpression: "PK = :v1",
                TableName: table
            };
            dynamodb.query(params3, function (err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("QUERY PK - succeeded:", JSON.stringify(data, null, 2));
                }

            });
            // query PK -- end 

            // query SK -- begin
            var params4 = {
                ExpressionAttributeValues: {
                    ":v2": {
                        S: d_sub
                    }
                },
                KeyConditionExpression: "PK = :v2",
                TableName: table
            };
            dynamodb.query(params4, function (err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("QUERY SK - succeeded:", JSON.stringify(data, null, 2));
                }

            });
            // query SK -- end 

        }

    });

    // return [m_sub, d_sub];




}


exports.deleteCognitoUser = (event, context, callback) => {
    const params = {
        'Username': 'factorytest',
        'UserPoolId': 'us-east-2_VdUFUH85R' // tomcoon
        // 'UserPoolId': 'ap-southeast-1_ntfECmrjH' // amibo
    };

    client.adminDeleteUser(params, (err, data) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(data);
        }

    });

};

// create one item
exports.helen123 = (event, context, callback) => {
    const params = {
        Item: {
            "UserId": {
                S: `user_${Math.random()}`
            },
            "Age": {
                N: `${getRandom(20,63)}`
                // N: event.age
            },
            "Height": {
                N: `${getRandom(55,73)}`
                // N: event.height
            },
            "Income": {
                N: `${getRandom(2888,9999)}`
                // N: event.income
            }

        },
        TableName: "compare-yourself"
    }


    dynamodb.putItem(params, function (err, data) {
        // body...
        if (err) {
            console.log(err.message);
        } else {
            console.log(data);
            //    console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });


};