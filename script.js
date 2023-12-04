const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy-btn]");
const copyMsgElement = document.querySelector("[data-copyMsg");
const Lowercase = document.querySelector("#LowerCase");
const Uppercase = document.querySelector("#UpperCase");
const Numbers = document.querySelector("#Numbers");
const Symbols = document.querySelector("#Symbols");
const Indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-btn");
const checkBoxAll = document.querySelectorAll("input[type=checkBox]");
const symbols = '-*/+(-=+)&^%$#@!~{}[]></?_';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handlerSlider();
// set strength circle color to grey
setIndicator("#ccc");

//set passwordlength
function handlerSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength; 
    const min = parseInt(inputSlider.min);
    const max = parseInt(inputSlider.max);

    if (passwordLength >= min && passwordLength <= max) {
        const percentage = ((passwordLength - min) * 100) / (max - min);
        inputSlider.style.backgroundSize = `${percentage}% 100%`;
        console.log("Handler Slider: Updated backgroundSize");
    } else {
        console.error("Handler Slider: passwordLength is outside the valid range");
    }
}


function setIndicator(color){
    Indicator.style.background = color;
    Indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    //show
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function generaterRandomNumber () {
    return getRndInteger(0, 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols(){
    const ranNum = getRndInteger(0, symbols.length);
    return symbols.charAt(ranNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbols = false;

    if(Uppercase.checked) hasUpper = true;
    if(Lowercase.checked) hasLower = true;
    if(Numbers.checked) hasNum = true;
    if(Symbols.checked) hasSymbols = true;

    if(hasUpper && hasLower && hasNum && hasSymbols <= 8) {
        setIndicator('#0f0');
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSymbols) && 
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function handleCopyMsg (){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsgElement.innerText = "copied";
    }
    catch(e){
        copyMsgElement.innerText = "failed";
    }
    
    copyMsgElement.classList.add('active');
    setTimeout( () => {
        copyMsgElement.classList.remove("active");
    }, 2000);


}

function handleCheckBoxChange(){
    checkCount = 0;
    checkBoxAll.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }

    });

    if(passwordLength < checkCount){
        passwordLength =  checkCount;
        handlerSlider();
    }

}

//shuffle function

function shufflePassword(array) {
    //Fisher yates algo 
    for (let i = array.length - 1; i > 0; i--) {
        // find out random j
        const j = Math.floor(Math.random() * (i + 1));
        // swap 2 numbers
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      let str = "";
      // array.forEach((el) => (str += el));
      str = array.join("");
      return str;
}

checkBoxAll.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange)
})



inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handlerSlider();
})

copybtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    handleCopyMsg();
})


generateBtn.addEventListener('click', () => { 
    //nocheckbox are selected 
    if(checkCount == 0){
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handlerSlider();
    }

    //lets start the journey to find newpassword

    //remove old pass
    password = "";

    //let start adding the stuff by checkboxes
    // if(UppercaseCheck.checked){
    //     password += generateUpperCase;
    // }

    // if(LowercaseCheck.checked){
    //     password += generateLowerCase;
    // }

    // if(NumberCheck.checked){
    //     password += generaterRandomNumber;
    // }

    // if(SymbolsCheck.checked){
    //     password += generateSymbols;
    // }

    let funcArr = [];
    
    console.log("uppercase", Uppercase)
    if(Uppercase.checked){
        funcArr.push(generateUpperCase);
    }
    console.log("lowercase")


    if(Lowercase.checked){
        funcArr.push(generateLowerCase);
    }

    if(Number.checked){
        funcArr.push(generaterRandomNumber);
    }

    if(Symbols.checked){
        funcArr.push(generateSymbols);
    }

    //compulsory addition 

    for(let i=0; i<funcArr.length;i++){
        password += funcArr[i]();
    }
    
    for(let i=0; i<passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randamIndex", randIndex)
        password += funcArr[randIndex]();

    }
    console.log("compulsory addition")

    //shuffle password 
    password = shufflePassword(Array.from(password));
    console.log("shuffle completed")
    
    //show in UI
    passwordDisplay.value = password;
    console.log("showing in UI")

    //calc strength of the password
    calcStrength();


});



