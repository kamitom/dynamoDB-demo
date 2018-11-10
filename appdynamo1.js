const dyna = require('./dynamo1');

// add dummy item
dyna.helen123();  

// delete Cognito User
dyna.deleteCognitoUser();

// var AWS = require('aws-sdk');
// var CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
// var client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'us-east-23' });

// //now you can call adminDeleteUser on the client object     
// const params = {
//     'Username': 'marytest',
//     'UserPoolId': 'us-east-2_VdUFUH85R'
// };

// client.adminDeleteUser(params, (err, data)=> {
//     if (err) {
//         console.log(err.message);
//     }else{
//         console.log(data);
//     }

// });
