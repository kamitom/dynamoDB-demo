var AWS = require("aws-sdk");

//TODO: 使用自已的credentails 
var credentials_tomrd = new AWS.SharedIniFileCredentials({profile: 'tomrd'});
AWS.config.credentials = credentials_tomrd;

const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
const client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'us-east-2' });

const dynamodb = new AWS.DynamoDB({ region: 'us-east-2', apiVersion: '2012-08-10'});

//產生min到max之間的亂數
function getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

exports.deleteCognitoUser = (event, context, callback) => {
    const params = {
        'Username': 'factorytest',
        'UserPoolId': 'us-east-2_VdUFUH85R'
    };
    
    client.adminDeleteUser(params, (err, data)=> {
        if (err) {
            console.log(err.message);
        }else{
            console.log(data);
        }
    
    });

    // client.adminDisableUser()
};

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