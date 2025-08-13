// console.log(
//   "----------------------------main . js------------------------------"
// );

// const { sub, add } = require("./subfile");
// console.log(sub, add);
// console.log(sub(1, 3));
// console.log(add(1, 3));

/*
Output
------


----------------------------main . js------------------------------
[Function: sub] [Function: add]
----------------------------subfile . js sub------------------------------
-2
----------------------------subfile . js add ------------------------------
4


*/

const { sub, add } = require("./subfile");
console.log(sub, add);
console.log(sub(1, 3));
console.log(add(1, 3));

/*
Output
------
[Function (anonymous)] [Function (anonymous)]
-2
4


*/
