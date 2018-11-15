const AWS = require("aws-sdk");

//TODO: 使用自已的credentails  
const forDev = 'cc';
let dyanmodb = '';
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
let client = '';
// let Target_table = "AmiboTable-Dev";
let Target_table = 'AmiboTb-Test-Tom2';

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
}

exports.AmiboDeleteItemByPhone = (cognitoUsr, event, context, callback) => {
    let mobile_sub2;
    let device_sub2;

    // let x = event.phone;

    const params5 = {
        // 'Username': 'mobile+886905936283',
        'UserPoolId': 'ap-southeast-1_ntfECmrjH', // amibo
        // 'Limit': 2,
        // 'Filter': `phone_number^=\"${cognitoUsr}\"` // starts with
        'Filter': `phone_number=\"+${cognitoUsr}\"` // equals
        // 'Filter': 'phone_number=\"+886971088033\"'
    };

    client.listUsers(params5, (err, data5) => {

        if (err) {
            console.log(err.message);
            return [];
        } else {
            console.log(data5.Users.length);
            const UserExists = (data5.Users.length);
            if (UserExists > 0) {
                for (let i = 0; i < data5.Users.length; i++) {
                    let test = data5.Users[i].Username;
                    if (test.startsWith('device')) {
                        device_sub2 = 'Device-' + data5.Users[i].Attributes[1].Value;
                    } else {
                        mobile_sub2 = 'MobileUser-' + data5.Users[i].Attributes[1].Value;
                    }
    
                }
                // delete PK -- MobileUser- begin
                let objMobileUser;
                let itemsArray1 = []; 
                let itemsArray1_1 = [];
                let itemsArray4 = [];
                let itemsArray4_1 = [];
                {
                    var params411 = {
                        ExpressionAttributeValues: {
                            ":v2": {
                                S: device_sub2
                            }
                        },
                        KeyConditionExpression: "PK = :v2",
                        TableName: Target_table
                    };
                    dynamodb.query(params411, function (err, data4) {
                        if (err) {
                            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                            // console.log("QUERY Device- PK - succeeded:", JSON.stringify(data4, null, 2));
                            const DeviceCount = data4.Items.length;
                            // console.log('device count: ' + DeviceCount);
    
                            if (DeviceCount > 0 ) {
                                let item4;
                                let item4_1;
                                let WhatINeed4;
                                for (let index = 0; index < data4.Items.length; index++) {
                                    // const element = array[index];
                                    WhatINeed4 = data4.Items[index];
                                    // console.log(WhatINeed4.PK, WhatINeed4.SK);
                                    // console.log('------');
                                    item4 = {
                                        DeleteRequest: {
                                            Key: {
                                                'PK': {
                                                    S: WhatINeed4.PK.S
                                                },
                                                'SK': {
                                                    S: WhatINeed4.SK.S
                                                }
                                            },
                                        },
                                    };
                                    item4_1 = {
                                        Key: {
                                            'PK': {
                                                S: WhatINeed4.PK.S
                                            },
                                            'SK': {
                                                S: WhatINeed4.SK.S
                                            }
                                        },
                                        TableName: Target_table,
                                    };
                                    itemsArray4.push(item4);
                                    itemsArray4_1.push(item4_1);
                                }
    
                                itemsArray4_1.forEach(element4 => {
                                    // console.log(element);
                                    var params412_1 = element4;
                                    // console.log(params412_1);
                                    //deleteitem
                                    dynamodb.deleteItem(params412_1, function(err, data4_1){
                                        if (err) {
                                            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                                        } else {
                                            // console.log("delete Device - PK - succeeded:", JSON.stringify(data4_1, null, 2));
                                        }
                                    });
                                });
        
                                var params412 = {
                                    RequestItems: {
                                        'AmiboTb-Test-Tom1': itemsArray4
                                    }
                                };
    
                                // console.log(params412);
                                // dynamodb.batchWriteItem(params412, function (err, data) {
                                //     if (err) {
                                //         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                                //     } else {
                                //         console.log("delete Device - PK - succeeded:", JSON.stringify(data, null, 2));
                                //     }
                                // });
                            }
                        }
                    });
    
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
                            objMobileUser = Object.assign({}, data2);
                            
                            const mobileUserCount = (objMobileUser.Items.length); 
                            // console.log('mobileUser count: ' + mobileUserCount);
    
                            if (mobileUserCount > 0) {
                                let item2;
                                let item2_1;
                                let WhatINeed;
                                for (let index = 0; index < objMobileUser.Items.length; index++) {
        
                                    // todo start
                                    // console.log(objTest.Items[index]);
                                    WhatINeed = (objMobileUser.Items[index]);
                                    // console.log(WhatINeed.PK, WhatINeed.SK);
                                    item2 = {
                                        DeleteRequest: {
                                            Key: {
                                                'PK': {
                                                    S: WhatINeed.PK.S
                                                },
                                                'SK': {
                                                    S: WhatINeed.SK.S
                                                }
                                            },
                                        },
                                    };
                                    item2_1 = {
                                        Key: {
                                            'PK': {
                                                S: WhatINeed.PK.S
                                            },
                                            'SK': {
                                                S: WhatINeed.SK.S
                                            }
                                        },
                                        TableName: Target_table, 
                                    };
    
                                    itemsArray1.push(item2);
                                    itemsArray1_1.push(item2_1);
                                    
                                    // todo end
                                }
    
                                itemsArray1_1.forEach(element1 => {
                                    var params312_1 = element1;
                                    // console.log(params312_1);
                                    //deleteitem
                                    dynamodb.deleteItem(params312_1, function(err, data1_1){
                                        if (err) {
                                            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                                        } else {
                                            // console.log("delete MobileUser - PK - succeeded:", JSON.stringify(data1_1, null, 2));
                                        }
                                    });
                                });
    
                                var params312 = {
                                    RequestItems: {
                                        'AmiboTb-Test-Tom1': itemsArray1
                                    }
                                };
                                // dynamodb.batchWriteItem(params312, function (err, data) {
                                //     if (err) {
                                //         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                                //     } else {
                                //         console.log("delete MobileUser - PK - succeeded:", JSON.stringify(data, null, 2));
                                //     }
                                // });
                            }
                        }
                    });
                }
    
            }
            else {
                console.log(`User: ${cognitoUsr} does not exist.`);
            }

        }
        // callback(null, {"mobile": cognitoUsr, "mobile_sub": mobile_sub2, "device_sub": device_sub2, "seccussful": 'deleted!'});
        console.log('deleted!',  {"mobile": cognitoUsr, "mobile_sub": mobile_sub2, "device_sub": device_sub2, "seccussful": 'deleted!'});
    });

};