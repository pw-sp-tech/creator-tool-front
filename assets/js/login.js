// window.location.href = 'M.html'
$(function() {
    'use strict';

    $(document).on('click', '.password-indicator', function() {
        var PASSWORD_FIELD = $(this).closest('.password-wrapper').find('input');
        $(this).toggleClass('fa-eye-slash');
        var attrType = PASSWORD_FIELD.attr('type');
        if (attrType == 'password') {
            PASSWORD_FIELD.attr('type', 'text');
        } else {
            PASSWORD_FIELD.attr('type', 'password');
        }
    })

    $('.login-popover').popover({
        trigger: 'hover',
        container: 'body'
    })

    $("#commonForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 3
            },
            email: {
                required: true,
            },
            password: {
                required: true,
            }
        },
        messages: {
            name: {
                required: "Please enter your name",
                minlength: "Your name must consist of at least 3 characters"
            },
            email: {
                required: "Please enter your email address",
            },
            password: {
                required: "Please enter your password",
            }
        }
    });
})
const urlPrefix ='http://localhost:3000' // 'https://creator-tool-back.herokuapp.com'
const fullNameDiv = document.querySelector(".fullname-div");
const emailDiv = document.querySelector(".email-div");
const passDiv = document.querySelector(".pass-div");
const pass2Div = document.querySelector(".pass2-div");
const loginPageText = document.querySelectorAll(".create-one-text");
const loginBtn = document.querySelector(".login-btn");
const loginHeading = document.querySelector(".login-heading");
const pageId = document.querySelector(".pageid");
const alert = document.querySelector(".alert");
const alert2 = document.querySelector(".alert2");
const alert3 = document.querySelector(".alert3");
const alertText = document.querySelector(".alert-text");
const forgotPassBox = document.querySelector(".forgot-pass-box")
const loginBox=document.querySelector(".login-box")
const changePassBox=document.querySelector(".resets-pass-box")
let resettoken
document.querySelector("#commonForm").addEventListener('submit', (e) => {
    e.preventDefault();
});

document.querySelector(".create-one").addEventListener('click', () => {
    fullNameDiv.classList.toggle("hidden");
    pass2Div.classList.toggle("hidden");
    loginPageText[0].classList.add("hidden");
    loginPageText[1].classList.remove("hidden");
    loginPageText[2].classList.add("hidden");
    loginBtn.innerText = "Register";
    loginHeading.innerText = "Register New Account";
    pageId.innerText = "2";
})
document.querySelectorAll(".create-one2").forEach(el=> el.addEventListener('click', () => {
    loginBox.classList.remove("hidden")
    forgotPassBox.classList.add("hidden")
    fullNameDiv.classList.add("hidden");
    changePassBox.classList.add("hidden")
    pass2Div.classList.add("hidden");
    loginPageText[0].classList.remove("hidden");
    loginPageText[1].classList.add("hidden");
    loginPageText[2].classList.remove("hidden");
    loginBtn.innerText = "Login";
    loginHeading.innerText = "Sign Into Your Account";
    pageId.innerText = "1";
})
)
document.querySelector(".create-one3").addEventListener('click', () => {
   loginBox.classList.add("hidden")
   forgotPassBox.classList.remove("hidden")
});

async function fetchData(url, params) {
    let res = await fetch(`${urlPrefix}${url}`, params);
    return await res.json();
}

function showAlert(text) {
    alertText.innerText = text
    alert.classList.remove("hidden");
    setTimeout(() => {
        alert.classList.add("hidden");
    }, 3000);
}
function showAlert2(text) {
    alert2.querySelector(".alert-text").innerText = text
    alert2.classList.remove("hidden");
    setTimeout(() => {
        alert2.classList.add("hidden");
    }, 3000);
}
function showAlert3(text) {
    alert3.querySelector(".alert-text").innerText = text
    alert3.classList.remove("hidden");
    setTimeout(() => {
        alert3.classList.add("hidden");
    }, 3000);
}

function login() {
    let id = pageId.innerText;
    if (id === "1") {
        let email = emailDiv.querySelector('input').value;
        let pass = passDiv.querySelector('input').value;
        loginBtn.innerHTML = `Logging In...`
        fetchData('/auth/signin', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": pass,

            })
        }).then(data => {
            if (data.user && data.user.token) {
                if(data.user.resettoken==null){
                localStorage.setItem('accessToken', data.user.token);
                localStorage.setItem("userName", data.user.fullName);
                localStorage.setItem("userEmail", data.user.email)
                window.location.href = "home.html";
                }else{
                    resettoken=data.user.resettoken
                    changePassAction()
                }
            } else if (data.message == "USER_NOT_FOUND") {
                showAlert("Invalid Email or Password")
                loginBtn.innerHTML = `Login`
            }
        })
    } else {
        let name = fullNameDiv.querySelector('input').value;
        let email = emailDiv.querySelector('input').value;
        let pass = passDiv.querySelector('input').value;
        let pass2 = pass2Div.querySelector('input').value;

        if (!email || !name || !pass || !pass2) {
            showAlert("Please fill all inputs!")
        } else if (pass !== pass2) {
            showAlert("Passwords Not Matched!")
        } else {
            loginBtn.innerHTML = `Please Wait...`
            fetchData('/auth/signup', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    "fullName": name,
                    "email": email,
                    "password": pass,

                })
            }).then(data => {
                if (data.message == "USER_REGISTERED_SUCCESSFULLY") {
                    window.location.href = 'login.html'
                } else if (data.message == "USER_ALREADY_EXIST") {
                    showAlert("USER_ALREADY_EXIST")
                    loginBtn.innerHTML = "Register"
                }
            })
        }
    }
}
loginBtn.addEventListener('click', login)

//  forgot password

const sendMailBtn = document.querySelector(".send-mail-btn")
document.querySelector("#forgot-pass-form").addEventListener('submit', (e) => {
    e.preventDefault();
});



function sendForgotMail() {
    const mailId = forgotPassBox.querySelector(".email-div").querySelector('input').value;
    if (!mailId) {
        console.log("enter mail")
    } else {
        sendMailBtn.innerText="Sending Mail..."
        fetchData('/auth/forgotpass', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "email": mailId,
            })
        }).then(data => {
            if(data.status=="OKAY"){
            sendMailBtn.innerText="Mail Sent"
            }else{
                showAlert2("Mail Not found")
                sendMailBtn.innerText="Send password reset email"
            }
        })
    }
}
sendMailBtn.addEventListener("click", sendForgotMail)

// change password

const changepassBtn = document.querySelector(".change-pass-btn")
document.querySelector("#reset-pass-form").addEventListener('submit', (e) => {
    e.preventDefault();
});

function changePassAction(){
    loginBox.classList.add("hidden")
    changePassBox.classList.remove("hidden")
}

function changePass(){
    const changePass1=changePassBox.querySelector(".pass-div").querySelector("input").value
    const changePass2=changePassBox.querySelector(".pass2-div").querySelector("input").value
    if (!changePass1 || !changePass2) {
        showAlert3("Please fill all inputs!")
    } else if (changePass1 !== changePass2) {
        showAlert3("Passwords Not Matched!")
    } else {
        fetchData('/auth/resetPass', {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "resettoken":resettoken,
            },
            body: JSON.stringify({
                "password": changePass1,
            })
        }).then(data => {
            if(data.status=="OKAY"){
            window.location.href = 'login.html'
            }else{
                showAlert3("error")
            }
        })
    }

}

changepassBtn.addEventListener("click", changePass)
