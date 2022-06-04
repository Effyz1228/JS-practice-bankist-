'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements=function(movements,sort=false){
  containerMovements.innerHTML="";

  //sort will mutate the array so use slice to make a shallow copy!
  const mov =sort ? movements.slice().sort((a,b)=>a-b):movements;

  mov.forEach((m,i)=>{
    const type =m > 0 ? 'deposit':'withdrawal';
  
    const html =`
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__value">$${m}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html)
  });
};



//show account balance:
const displayBalance =function(acct){
//movements: [200, 450, -400, 3000, -650, -130, 70, 1300]
acct.balance=acct.movements.reduce((acc,mov)=> acc+mov,0);
labelBalance.textContent=`\$${acct.balance}`;
}


//create user name initial
const createUsername = function(accts){
  accts.forEach(acct=>{
    acct.username = acct.owner.toLowerCase().split(' ').map(name=>name[0]).join('');
  })
}

createUsername(accounts);

//show bank movements summary
const displaySummary =function(acct){
 const sumIn= acct.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov,0);
 labelSumIn.textContent=`\$${sumIn}`;

 const sumOut=acct.movements.filter(mov=>mov<0).reduce((acc,mov)=>acc+mov,0);
 labelSumOut.textContent=`\$${Math.abs(sumOut)}`;

 const interest =acct.movements
 .filter(mov=>mov>0)
 .map(deposit=>deposit*acct.interestRate/100)
 .filter(int=>int>1)
 .reduce((acc,int)=>acc+int,0);
labelSumInterest.textContent=`\$${interest}`;
}

//function display account UI
const displayAccountUI =function(acct){
  displayMovements(acct.movements);
  displayBalance(acct);
  displaySummary(acct);
}

//the login function
let currentAccount;
btnLogin.addEventListener('click',e=>{
  e.preventDefault();
  currentAccount=accounts.find(acc=>acc.username===inputLoginUsername.value);

  if(currentAccount?.pin===Number(inputLoginPin.value)){
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity =100;
    inputLoginUsername.value= inputLoginPin.value="";
    //the pin input will lose it's focus
    inputLoginPin.blur();
    displayAccountUI(currentAccount);
    
  }  
})

//transfer function
btnTransfer.addEventListener('click',e=>{
  e.preventDefault();
  const receiver = inputTransferTo.value;
  const amount=Number(inputTransferAmount.value);

  const rAcct =accounts.find(acc=>acc.username===receiver);
  inputTransferAmount.value =inputTransferTo.value="";

  if(rAcct && receiver!==currentAccount.username && currentAccount.balance>=amount && amount >0){
    console.log('valid transfer')
    currentAccount.movements.push(-amount);
    rAcct.movements.push(amount);
    displayAccountUI(currentAccount);

  }else {console.log("invalid")}
})
//request loan
btnLoan.addEventListener('click',e=>{
  e.preventDefault();
  const amount =Number(inputLoanAmount.value);
  if(amount>0 && currentAccount.movements.some(mov=>mov>=amount*0.1)){
    currentAccount.movements.push(amount);
    displayAccountUI(currentAccount);
  }
  else{
    alert("You can't borrow that much money!")
  }
  inputLoanAmount.value="";
})


//close account
btnClose.addEventListener('click',e=>{
  e.preventDefault();
 let inputUser =inputCloseUsername.value;
 let inputPin = Number(inputClosePin.value);

 if(inputUser===currentAccount.username && inputPin===currentAccount.pin){
 const index= accounts.findIndex(acct=>acct.username === inputUser);
 accounts.splice(index,1);
 containerApp.style.opacity =0;
 }
 inputCloseUsername.value="";
 inputClosePin.value="";
})

//sort movements function

let isSorted = false;
btnSort.addEventListener('click',e=>{
  e.preventDefault();
  displayMovements(currentAccount.movements,!isSorted);
  isSorted =!isSorted;
})

//flatmap lecture
// const allMovement =accounts.flatMap(acct=>acct.movements).reduce((acc,mov)=>acc+mov,0);
// console.log(allMovement);

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/


// function checkDogs (dogsJulia,dogsKate){
// const jRealDogs =dogsJulia.slice(1,-1);
// const alldogs =[...jRealDogs,...dogsKate];

// alldogs.forEach((dogAge,i)=>{
// dogAge >=3 ? console.log(`Dog number ${i+1} is an adult, and is ${dogAge} years old`) : console.log(`Dog number ${i+1} is still a puppy 🐶"`);
// });
// }

// checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge=function(ages){
//   const humanAge = ages.map(age=> (age <=2) ? age * 2 :(age * 4 + 16));
//   const adultDogs = humanAge.filter(age=>age >= 18);
//   console.log(adultDogs, humanAge);
//   //const aveAge = adultDogs.reduce((acc,age)=> (acc+age),0)/adultDogs.length;
// //another way
// const aveAge =adultDogs.reduce((acc,age,i,arr)=>acc+age/arr.length,0);

//   console.log(aveAge);
// }

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// Coding Challenge #3
// const calcAverageHumanAge=function(ages){
//   const avehumanAge=ages
//   .map(age=>age<=2 ? age*2 :age*4+16 )
//   .filter(age=>age>=18)
//   .reduce((acc,age,i,arr)=>acc+age/arr.length,0);
//   console.log(avehumanAge)
// }

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);