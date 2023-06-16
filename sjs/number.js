var action = [add, reduce, ride, divide];

function calcNumber(num, seed) {
  var numNumber = +num;
  var seedNumber = +seed;
  return chooseAction(Math.ceil(numNumber + seedNumber), action)(
    numNumber,
    seedNumber
  );
}

function chooseAction(num, action) {
  if (num >= action.length) {
    return chooseAction(num % action.length, action);
  }
  return action[num];
}

function add(a, b) {
  return Math.ceil(a + b);
}
function reduce(a, b) {
  return Math.ceil(Math.abs(a - b));
}
function ride(a, b) {
  return Math.ceil(a * b);
}
function divide(a, b) {
  return Math.ceil(a / b);
}

function sort(result) {
  var a = [...result];
  var red = a.splice(0, 5);
  var blue = a.splice(0, 2);
  return red.sort(sortFn).concat(blue.sort(sortFn));
}

function sortFn(v1, v2) {
  return v1 - v2;
}
