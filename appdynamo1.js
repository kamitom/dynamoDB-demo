const dyna = require('./dynamo1');

// add dummy item
// for (let index = 0; index < 4; index++) {
//     dyna.helen123();  
// }

// todo: qry Amibo_Dev
var PK = 'MobileUser-60f16463-4f9e-4c98-a492-b3e17185923c';
var SK = 'MobileUser-60f16463-4f9e-4c98-a492-b3e17185923c';
// var SK = 'Call-16d186c8-91b7-ae82-307a-1221233f1517';
// dyna.qryAmibo_Dev(PK, SK);

// todo: delete Cognito User
// dyna.deleteCognitoUser();


// list users
// +886905936282
//let cogUser = '+886905936282';
//let cogUser = '+886905936283';  //筆數較多
let cogUser = '+886905936283';

// cogUser = '+88693';
dyna.qryByPhone(cogUser);
// let take_PK = dyna.qryCognitoUser(cogUser);
// console.log('ans is ' + take_PK);



