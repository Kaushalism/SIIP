function nitin() {
  return new Promise(function (resolve, reject) {
    resolve('hello');
  });
}

let newVariable = nitin();
console.log(newVariable);
console.log(typeof newVariable);
