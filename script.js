const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');

var passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbols = "~`!@#$%^&*()_-+={}[]|;:<>,./?";
// const symbols = "@";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider()
// set strength circle color to grey
setIndicator('#ccc');

//set passwordLength 
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));   //lowercase 'a' ascii number is 97 & 'z' ascii number is 123
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));   //uppercase 'A' ascii number is 65 & 'Z' ascii number is 90
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    console.log('Symbols chosen is '+symbols.charAt[randNum])
    return symbols.charAt[randNum];
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator('#0f0');
    }else if(
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >=6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied';
    }
    catch(e){
        copyMsg.innerText = 'Failed';
    }
    // to make copy wala visible
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    // Fisher Yates Method
    for(let i=array.length - 1 ; i > 0 ; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    })

    // Special Condition
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange())
})

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click',()=>{
    // none of the checkbox are selected
    console.log("Starting the journey 0")
    // if(checkCount==0)
    //     return false;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // Lets start  the journey to find new password
    console.log("Starting the journey")
    // remove old password
    password="";

    // lets put the stuff mentioned by checkboxes

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    console.log("compulsory addition done")

    // remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done")
    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log(" shuffle addition done")
    // show in UI
    console.log(password);
    passwordDisplay.value = password;
    console.log("UI addition done")
    // calculate Strength
    calcStrength();
})