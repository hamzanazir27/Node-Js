// function add(a, b) {
//   console.log(
//     "----------------------------subfile . js add ------------------------------"
//   );

//   return a + b;
// }

// function sub(a, b) {
//   console.log(
//     "----------------------------subfile . js sub------------------------------"
//   );
//   return a - b;
// }
// module.exports = { add, sub };

exports.add = (a, b) => a + b;
exports.sub = (a, b) => a - b;
