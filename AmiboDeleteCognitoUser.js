const AWS = require("aws-sdk");
//TODO: 使用自已的credentails 
const forDev = 'dev';
let dyanmodb = '';
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
let client = '';
// let Target_table = "AmiboTable-Dev";
let Target_table = 'AmiboTb-Test-Tom1';

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
            console.log(data);
        }
    });
};
