// // ES6
// // 읽기 좋은 코드 -> async / await의 등장
// // 비동기함수에 대해 실행순서를 보장함

// async function logName() {
//   var user = await fetchUser('domain.com/users/1');
//   if (user.id === 1) {
//     console.log(user.name);
//   }
// }


// // 기존에는 콜백함수를 통해 실행순서를 보장했음.  
// // 문제가 되진 않지만 읽기 어려운 코드일 수 있다는 것.
// function logName() {
//   var user = fetchUser('domain.com/users/1', function(user) {
//     if (user.id === 1) {
//       console.log(user.name);
//     }
//   });
// }

// function fetchItems() {
//   return new Promise(function(resolve, reject) { // 비동기 처리를 위한 객체로, promise 이행 시
//                                                  // resolve호출을 통해 값을 반환한다. 
//     var items = [1,2,3];
//     resolve(items)
//   });
// }

// async function logItems() {
//   var resultItems = await fetchItems();
//   console.log(resultItems); // [1,2,3]
// }

// logItems();

// 비동기처리에서의 예외처리
async function logTodoTitle() {
  try {
    var user = await fetchUser();
    if (user.id === 1) {
      var todo = await fetchTodo();
      console.log(todo.title); // delectus aut autem
    }
  } catch (error) { // error
    console.log(error);
  }
}

fetchUser();

module.exports = {message: 'webpack'};