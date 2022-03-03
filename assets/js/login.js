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
const urlPrefix = 'https://pw-qc-back.herokuapp.com'
const fullNameDiv = document.querySelector(".fullname-div");
const emailDiv = document.querySelector(".email-div");
const passDiv = document.querySelector(".pass-div");
const pass2Div = document.querySelector(".pass2-div");
const loginPageText = document.querySelectorAll(".create-one-text");
const loginBtn = document.querySelector(".login-btn");
const loginHeading = document.querySelector(".login-heading");
const pageId = document.querySelector(".pageid");
const alert = document.querySelector(".alert");
const alertText = document.querySelector(".alert-text");
document.querySelector("#commonForm").addEventListener('submit', (e) => {
    e.preventDefault();
});

document.querySelector(".create-one").addEventListener('click', () => {
    fullNameDiv.classList.toggle("hidden");
    pass2Div.classList.toggle("hidden");
    loginPageText[0].classList.toggle("hidden");
    loginPageText[1].classList.toggle("hidden");
    loginBtn.innerText = "Register";
    loginHeading.innerText = "Register New Account";
    pageId.innerText = "2";
})
document.querySelector(".create-one2").addEventListener('click', () => {
    fullNameDiv.classList.toggle("hidden");
    pass2Div.classList.toggle("hidden");
    loginPageText[0].classList.toggle("hidden");
    loginPageText[1].classList.toggle("hidden");
    loginBtn.innerText = "Login";
    loginHeading.innerText = "Sign Into Your Account";
    pageId.innerText = "1";
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

function login() {
    let id = pageId.innerText;
    if (id === "1") {
        let email = emailDiv.querySelector('input').value;
        let pass = passDiv.querySelector('input').value;
        fetchData('/login', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email,
                pass,
                type: "login"
            })
        }).then(data => {
            if (data.token) {
                localStorage.setItem('accessToken', data.token);
                window.location.href = "home.html";
            } else if (data.ERROR) {
                showAlert("Invalid Email or Password")
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
            fetchData('/login', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    pass,
                    type: "reg"
                })
            }).then(data => {
                window.location.href = 'login.html'
            })
        }
    }
}
loginBtn.addEventListener('click', login)