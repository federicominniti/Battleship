
/*
    starts with a letter (uppercase or lowercase)
    continues with other letters and symbols where in the case of symbols we have:
    A symbol obligatorily followed immediately after by a letter
    has length between 4 and 9.
*/
function checkUsername(){
    let username = document.getElementById("username");
    let regex = new RegExp("^[a-zA-Z]+([!_.]?[a-zA-Z0-9]){4,9}$");
    let checkRegex = regex.test(username.value);
    setStyle("username", checkRegex);
}

/*
    Set the border color of the input element to of different color,
    due to the control of its value.
 */
function setStyle(id, check){
    let element = document.getElementById(id);
    if(check){
        element.style.borderColor = "green";
        element.style.borderStyle = "solid";
        element.style.borderWidth = "thick";
        if(isAllOk())
            document.getElementById("register").disabled = false;
    }else{
        element.style.borderColor = "red";
        element.style.borderStyle = "solid";
        element.style.borderWidth = "thick";
        document.getElementById("register").disabled = true;
    }
}

/*
    Password check that contains uppercase, lowercase, numbers and has a length of at least 8.
 */
function checkPassword(id){
    let string = document.getElementById(id);
    let patternOk = true;

    let lowerCaseLetters = /[a-z]/g;
    if(!string.value.match(lowerCaseLetters)){
        patternOk = false;
    }

    let upperCaseLetters = /[A-Z]/g;
    if(!string.value.match(upperCaseLetters)){
        patternOk = false;
    }

    let numbers = /[0-9]/g;
    if(!string.value.match(numbers)){
        patternOk = false;
    }

    if(!(string.value.length >= 8)){
        patternOk = false;
    }
    setStyle(id, patternOk);
}

/**
    check if the user confirm correctly the password.
 */
function checkPasswordEquality(id1, id2){
    let password = document.getElementById(id1);
    let repeatPassword = document.getElementById(id2);
    if(password.value !== '' && repeatPassword.value !== ''){
        if(password.value === repeatPassword.value){
            setStyle(id1, true);
            setStyle(id2, true);
        } else{
            setStyle(id1, false);
            setStyle(id2, false);
        }
    }
}

/**
    check if the user correctly compile the form, if it's ok it will
    set the register button available.
 */
function isAllOk(){
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let repeat_password = document.getElementById("repeat_password");

    if(username.style.borderColor === "green" && password.style.borderColor === "green"
        && repeat_password.style.borderColor === "green"){
        return true;
    }
    return false;
}

/**
    set which form set as visible, register or login.
 */
function changeForm(hide, visible) {
    document.getElementById(hide).setAttribute('class', 'hidden');
    document.getElementById(visible).setAttribute('class', 'visible');
}