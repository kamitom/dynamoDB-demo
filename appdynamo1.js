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
let cogUser = '+886971088033';
cogUser = '+886939719255'; //error data?
// cogUser = '+886905936283';  // mobileUser(14); Device(56) 
cogUser = '+886972879078';  // mobuleUser(9); Device(40);

// cogUser = '+88693';
// todo: query by phone
dyna.qryByPhone(cogUser);
// console.log('ans is ' + take_PK);

// todo: batch delete by Phone
dyna.DeleteItemByPhone(cogUser);

