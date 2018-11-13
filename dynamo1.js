const AWS = require("aws-sdk");

//TODO: 使用自已的credentails 
const forDev = 'cc';
let dyanmodb = '';
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
let client = '';
// let Target_table = "AmiboTable-Dev";
let Target_table = 'AmiboTb-Test-Tom';


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

    AWS.config.credentials = credentials_tomaws;

    dynamodb = new AWS.DynamoDB({
        region: 'ap-southeast-1',
        apiVersion: '2012-08-10'
    });

    client = new CognitoIdentityServiceProvider({
        apiVersion: '2016-04-19',
        region: 'ap-southeast-1'
    });

    // console.log(dyanmodb);

}


//產生min到max之間的亂數
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.qryAmibo_Dev = (thePK, theSK, event, context, callback) => {
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
        TableName: Target_table

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
        // 'Filter': `phone_number^=\"${cogUser}\"` // starts with
        'Filter': `phone_number=\"${cogUser}\"` // starts with
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

            const params2 = {
                Key: {
                    "PK": {
                        S: m_sub
                    },
                    "SK": {
                        S: m_sub
                    },
                },
                TableName: Target_table

            };
            // dynamodb.getItem(params2, function (err, data) {
            //     if (err) {
            //         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            //     } else {
            //         console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            //     }
            // });
            // end --

            // query MobileUser- PK -- begin
            var params3 = {
                ExpressionAttributeValues: {
                    ":v1": {
                        S: m_sub
                    }
                },
                KeyConditionExpression: "PK = :v1",
                TableName: Target_table
            };
            dynamodb.query(params3, function (err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("QUERY PK - succeeded:", JSON.stringify(data, null, 2));
                }
            });


            // query MobileUser- PK -- end 

            // query Device- PK -- begin
            var params4 = {
                ExpressionAttributeValues: {
                    ":v2": {
                        S: d_sub
                    }
                },
                KeyConditionExpression: "PK = :v2",
                TableName: Target_table
            };
            dynamodb.query(params4, function (err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("QUERY SK - succeeded:", JSON.stringify(data, null, 2));
                }
            });
            // query Device- PK -- end 
        }
    });
    // return [m_sub, d_sub];
};

let mobile_sub2;
let device_sub2;
exports.batchWriteItemByPhone = (cognitoUsr, event, context, callback) => {
    const params5 = {
        // 'Username': 'mobile+886905936283',
        'UserPoolId': 'ap-southeast-1_ntfECmrjH', // amibo
        // 'Limit': 2,
        // 'Filter': `phone_number^=\"${cognitoUsr}\"` // starts with
        'Filter': `phone_number=\"${cognitoUsr}\"` // equals
        // 'Filter': 'phone_number=\"+886971088033\"'
    };

    client.listUsers(params5, (err, data) => {

        if (err) {
            console.log(err.message);
            return [];
        } else {
 
            for (let i = 0; i < data.Users.length; i++) {
                let test = data.Users[i].Username;
                if (test.startsWith('device')) {
                    device_sub2 = 'Device-' + data.Users[i].Attributes[1].Value;
                } else {
                    mobile_sub2 = 'MobileUser-' + data.Users[i].Attributes[1].Value;
                }

            }
            // delete PK -- MobileUser- begin
            var objTest;
            let itemsArray = []; 
            let itemsArray2 = [];
            {
                var params311 = {
                    ExpressionAttributeValues: {
                        ":v1": {
                            S: mobile_sub2
                        }
                    },
                    KeyConditionExpression: "PK = :v1",
                    TableName: Target_table
                };
                dynamodb.query(params311, function (err, data2) {
                    if (err) {
                        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        // console.log("QUERY MobileUser- PK - succeeded:", JSON.stringify(data2, null, 2));
                        objTest = Object.assign({}, data2);
                        
                        console.log(objTest.Items.length); // 4

                        let item1;
                        let WhatINeed;
                        for (let index = 0; index < objTest.Items.length; index++) {

                            // todo start
                            // console.log(objTest.Items[index]);
                            WhatINeed = (objTest.Items[index]);
                            console.log(WhatINeed.PK, WhatINeed.SK);
                            // let tom1 = (objTest.Items[index]) => {
                            //     console.log(tom1.SK);
                            // }
                            // console.log(ready.SK);

                            console.log('===');
                            // todo end

                            for (let key in objTest.Items[index])
                            {
                                if (key === 'SK') {
                                    // console.log(key, objTest.Items[index][key]);
                                    item1 = {
                                        DeleteRequest: {
                                            Key: {
                                                'PK': {
                                                    S: 'MobileUser-60f16463-4f9e-4c98-a492-b3e17185923c'
                                                },
                                                'SK': {
                                                    S: 'MobileUser-60f16463-4f9e-4c98-a492-b3e17185923c-test2'
                                                }
                                            },
                                        },
                                    };
                                    itemsArray.push(item1);
                                }
                                
                            }
                        }
                        // console.log(itemsAray);
                        for (let key in itemsArray) {
                            if (itemsArray.hasOwnProperty(key)) {
                                let element = itemsArray[key];
                                // console.log(element);
                                // itemsArray2.push(element);
                            }
                        }
                        // console.log(itemsArray2);

                        //batchwriteItem - start here
                        var params3 = {
                            RequestItems: {
                                'AmiboTb-Test-Tom': [
                                    {
                                        DeleteRequest:{
                                            Key: {
                                                'PK': {
                                                    S:'MobileUser-60f16463-4f9e-4c98-a492-b3e17185923c'
                                                },
                                                'SK': {
                                                    S:'MobileUser-60f16463-4f9e-4c98-a492-b3e17185923c-test11'
                                                }
                                            },
                                        },
                                    },
                                    {
                                        DeleteRequest:{
                                            Key: {
                                                'PK': {
                                                    S:'MobileUser-60f16463-4f9e-4c98-a492-b3e17185923c'
                                                },
                                                'SK': {
                                                    S:'MobileUser-60f16463-4f9e-4c98-a492-b3e17185923c-test11'
                                                }
                                            },
                                        },
                                    },
                                ]
                            }
            
                        };

                        var params312 = {
                            RequestItems: {
                                'AmiboTb-Test-Tom': itemsArray
                            }
                        }
                        console.log(params312);
                        console.log(params3);
                        dynamodb.batchWriteItem(params312, function (err, data) {
                            if (err) {
                                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                            } else {
                                console.log("delete MobileUser - PK - succeeded:", JSON.stringify(data, null, 2));
                            }
                        });
            
            
                        // delete PK -- end 
            
                        //batchwriteItem - end here

                    }
                });
            }



            // delete PK -- Device- begin
            // var params4 = {
            //     ExpressionAttributeValues: {
            //         ":v2": {
            //             S: d_sub
            //         }
            //     },
            //     KeyConditionExpression: "PK = :v2",
            //     TableName: table
            // };
            // dynamodb.query(params4, function (err, data) {
            //     if (err) {
            //         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            //     } else {
            //         console.log("QUERY SK - succeeded:", JSON.stringify(data, null, 2));
            //     }
            // });
            // query SK -- end 
        }
    });

};

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