var AWS = require("aws-sdk");

// AWS.config.update({
//   region: "local",
//   endpoint: "http://localhost:8000"
// });

var credentials_tomrd = new AWS.SharedIniFileCredentials({
    profile: 'tomrd'
});
AWS.config.credentials = credentials_tomrd;


// const dynamodb = new AWS.DynamoDB();
    const dynamodb = new AWS.DynamoDB({
        region: 'us-east-2',
        apiVersion: '2012-08-10'
    });



var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Movies";

var year = '2015';
var title = "Mad Max: Fury Road";

// var params = {
//     TableName:table,
//     Item:{
//         "year": year,
//         "title": title,
//         "info":{
//             "plot": "History.",
//             "rating": 8.1
//         }
//     }
// };

const params = {
    Item: {
        "year": {
            // S: `user_${Math.random()}`
            N: year
        },
        "title": {
            // N: `${getRandom(20,63)}`
            S: title
        },
        // "Height": {
        //     N: `${getRandom(55,73)}`
        //     // N: event.height
        // },
        // "Income": {
        //     N: `${getRandom(2888,9999)}`
        //     // N: event.income
        // }

    },
    TableName: table
}

console.log("Adding a new item...");
// docClient.put(params, function(err, data) {
//     if (err) {
//         console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Added item:", JSON.stringify(data, null, 2));
//     }
// });
dynamodb.putItem(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});


