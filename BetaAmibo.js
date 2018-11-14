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
    };

    // console.log(params);

    dynamodb.getItem(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
};

exports.AmiboQryByPhone = (cogUser, event, context, callback) => {
    let mobileUser_sub;
    let device_sub;

    const params = {
        // 'Username': 'mobile+886905936283',
        'UserPoolId': 'ap-southeast-1_ntfECmrjH', // amibo
        // 'Limit': 2,
        // 'Filter': `phone_number^=\"${cogUser}\"` // starts with
        'Filter': `phone_number=\"+${cogUser}\"` // equals
        // 'Filter': 'phone_number=\"+886971088033\"'
    };

    console.log(params);

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
                    device_sub = 'Device-' + data.Users[i].Attributes[1].Value;
                } else {
                    mobileUser_sub = 'MobileUser-' + data.Users[i].Attributes[1].Value;
                }
            }
      
            // query MobileUser- PK -- begin
            var params3 = {
                ExpressionAttributeValues: {
                    ":v1": {
                        S: mobileUser_sub
                    }
                },
                KeyConditionExpression: "PK = :v1",
                TableName: Target_table
            };
            console.log(params3);
            dynamodb.query(params3, function (err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    // console.log("QUERY PK - succeeded:", JSON.stringify(data, null, 2));
                    console.log('mobileUser count: ' + data.Items.length);
                }
            });
            // query MobileUser- PK -- end 

            // query Device- PK -- begin
            if (device_sub !== undefined) {
                var params4 = {
                    ExpressionAttributeValues: {
                        ":v2": {
                            S: device_sub
                        }
                    },
                    KeyConditionExpression: "PK = :v2",
                    TableName: Target_table
                };
                console.log(params4);
                dynamodb.query(params4, function (err, data) {
                    if (err) {
                        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        // console.log("QUERY SK - succeeded:", JSON.stringify(data, null, 2));
                        console.log('device count: ' + data.Items.length);
                    }
                });
            }
            // query Device- PK -- end 
        }
        console.log({'mo': mobileUser_sub, 'de': device_sub, 'phone': cogUser});
        // callback(null, {"mobile": cogUser, "mobile_sub": mobileUser_sub, "device_sub": device_sub});
    });
};

exports.AmiboDeleteItemByPhone = (cognitoUsr, event, context, callback) => {
    let mobile_sub2;
    let device_sub2;
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
                            console.log('Has no MobileUser record : ' + mobileUserCount);
    
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
                                    console.log(params312_1);
                                    //deleteitem
                                    dynamodb.deleteItem(params312_1, function(err, data1_1){
                                        if (err) {
                                            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                                        } else {
                                            console.log("delete MobileUser - PK - succeeded:", JSON.stringify(data1_1, null, 2));
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
    });

};

exports.AmiboDeleteCognitoUser = (cogUser,event, context, callback) => {
    const params = {
        // 'Username': 'factorytest',
        'Username': cogUser,
        'UserPoolId': 'us-east-2_VdUFUH85R' // tomcoon
        // 'UserPoolId': 'ap-southeast-1_ntfECmrjH' // amibo
    };

    client.adminDeleteUser(params, (err, data) => {
        if (err) {
            console.log(err.message);
        } else {
            // console.log(data);
        }
    });
};

