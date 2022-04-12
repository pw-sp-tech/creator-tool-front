//https://drive.google.com/file/d/1MAUEW2YW1MuitAmM46Db_ucBJRcWOoHc/preview
const popup = document.querySelector(".popup");
const overlay = document.querySelector(".overlay");
overlay.addEventListener('click', () => {
    if (!popup.classList.contains("hidden")) {
        popup.classList.add("hidden");
        overlay.classList.add("hidden")
        popupHide()
    }
});

// Set the date we're counting down to


// Update the count down every 1 second
function deadline(sheetdate) {

    // Get today's date and time
    var now = new Date().getTime();
    var countDownDate = new Date(sheetdate).getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    let toReturn = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
    if (toReturn === "NaNd NaNh NaNm NaNs") {
        toReturn = "No deadline specified"
    }


    // If the count down is finished, write some text
    if (distance < 0) {
        // clearInterval(x);
        return "EXPIRED";
    } else {
        return toReturn
    }
}


const fileInput = document.querySelector(".videoInput");
const videoSelectedProp = document.querySelector(".videoSelected")
fileInput.addEventListener('change', () => {
        videoSelectedProp.innerHTML = fileInput.value.toString().replace("C:\\fakepath\\", "")
    })
    // main process==============
const preferedMode = localStorage.getItem('mode');
const switchModeBtn = document.querySelector(".switch-mode");
if (!preferedMode) {
    preferedMode == 'dark'
} else {
    if (preferedMode == 'light') {
        document.querySelector("body").classList.add("light-theme");
        switchModeBtn.innerText = "Dark Mode 🌙";
    } else {
        document.querySelector("body").classList.remove("light-theme");
    }
}

switchModeBtn.addEventListener('click', () => {
    if (switchModeBtn.innerText == "Light Mode ☀") {
        localStorage.setItem('mode', 'light');
        document.querySelector("body").classList.add("light-theme");
        switchModeBtn.innerText = "Dark Mode 🌙";

    } else {
        localStorage.setItem('mode', 'dark');

        document.querySelector("body").classList.remove("light-theme");
        switchModeBtn.innerText = "Light Mode ☀"
    }
})
const urlPrefix = "https://creator-tool-back.herokuapp.com";
const userName = localStorage.getItem("userName");
const email = localStorage.getItem("userEmail");
const welcomeName = document.querySelector(".welcomeName")
const token = localStorage.getItem("accessToken");
const navLink = document.querySelectorAll(".navbar__list");
const pending = document.querySelector(".pending");
const qcProgress = document.querySelector(".qc-progress");
const rejected = document.querySelector(".rejected");
const manageTeam = document.querySelector(".teamSwitch")
const workspaceSwitch = document.querySelector(".workspaceSwitch")
const loaderText = document.querySelector(".loader-text");
const showCountDiv = document.querySelector(".show-count-div")
const count = document.querySelector(".count")
var assignments, currentSheetLink, onPage = 1
var NomenclatureData = [];
// windows
const verifyWindow = document.querySelector(".verifyWindow");
const loadingWindow = document.querySelector(".loadingWindow");
const homeWindow = document.querySelector(".home-window");
if (!token) {
    window.location.href = "login.html"
}
if (userName) {
    loaderText.innerHTML = `Welcome, ${userName}`;
}

async function fetchData(url, params) {
    let res = await fetch(`${urlPrefix}${url}`, params);
    return await res.json();
}
document.querySelector(".btnLogout").addEventListener('click', () => {
    localStorage.setItem('accessToken', null);
    window.location.href = 'login.html'
})
manageTeam.addEventListener("click", manageTeamFn)

function manageTeamFn() {
    alert("Feature coming soon...")
}



// UPDATE TO SHEET===

function updateSheet(id, range, value) {
    fetchData("/tracker/write", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: token,
        },
        body: JSON.stringify({
            id: id,
            ranges: range,
            values: value,
        }),
    }).then((data) => {
        getFilterBook()

    });
}

// get sheet id
function getId(link) {
    return link.toString().match("[0-9a-zA-Z_-]{15,}")[0];
}

navLink.forEach((link) => {
    link.addEventListener("click", () => {
        loadingWindow.classList.remove("hidden");
        loaderText.innerHTML = ''
        if (link.innerText === "Pending") {
            qcProgress.classList.remove("active");
            rejected.classList.remove("active");
            pending.classList.add("active");
            onPage = 1
            getFilterBook()
        } else if (link.innerText === "Rejected") {
            qcProgress.classList.remove("active");
            rejected.classList.add("active");
            pending.classList.remove("active");
            onPage = 2
            getFilterBook()
        } else {
            rejected.classList.remove("active");
            qcProgress.classList.add("active");
            pending.classList.remove("active");
            onPage = 3
            getFilterBook()
        }
    });
});

// get assignment

fetchData("/user/verify", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        authorization: token,
    },
    body: JSON.stringify({
        email: email,
    }),
}).then((data) => {
    if (data.ERROR == "USER_NOT_FOUND") {
        loaderText.innerHTML = "You're not authorized to use this app. If this is a mistake, Please contact to your manager."
        document.querySelector(".loader-box").remove()
    } else {
        loaderText.innerHTML = `Please Wait, ${String(data.name).split(" ")[0]
      }.Getting your assignment`;

        getAssignment(data);
    }
});

function getAssignment(data) {
    fetchData("/user/assignments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: token,
        },
        body: JSON.stringify({
            designation: data.designation,
            email: data.email,
            employementType: data.employementType,
            gigId: data.gigId,
            name: data.name,
            status: data.status,
            subject: data.subject,
            uniqueId: data.name,
        }),
    }).then((data) => {
        assignments = data.assignmentsArr;
        NomenclatureData = data.NomenclatureData;
        welcomeName.innerHTML = `${String(userName).split(" ")[0]}`;
        verifyWindow.classList.add("hidden")
        homeWindow.classList.remove("hidden")
        totalBooks()
    });
}

// total books==
function totalBooks() {
    var books = [];
    assignments.forEach((el) => {
        books.push(el[2]);
    });
    var uniqueBook = Array.from(new Set(books));
    addFilter(uniqueBook);
}
// books filter
const bookfilter = document.querySelector(".books");
bookfilter.addEventListener("change", getFilterBook);

function addFilter(arr) {
    arr.forEach((el) => {
        var newOption = document.createElement("option");
        newOption.value = el;
        newOption.innerText = el;
        bookfilter.append(newOption);
    });
    getFilterBook();
}
// filter update

function getFilterBook() {
    var bookName = bookfilter.value;
    var bookdata = {};
    assignments.forEach((el) => {
        if (el[2] == bookName) {
            bookdata.link = getId(el[6]);
            currentSheetLink = el[6];
            bookdata.uniqueId = el[9];
        }
    });
    if (onPage == 1) {
        pendingWork(bookdata)
    } else if (onPage == 2) {
        rejWork(bookdata);
    } else {
        inQcWork(bookdata);
    }
}

// fetch pending data======
function pendingWork(bookdata) {
    fetchData("/tracker/assignments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: token,
        },
        body: JSON.stringify({
            uniqueId: bookdata.uniqueId,
            sheetId: bookdata.link,
        }),
    }).then((data) => {
        loadingWindow.classList.add("hidden");
        if (data.length > 0) {
            const finalData = []
            data.forEach(el => {
                let book = el[2];
                NomenclatureData.forEach(el2 => {
                    if (el2[0] == 'Book Code' && el2[1] == book) {
                        el[2] = el2[2]
                    }
                });
                finalData.push(el)
            })
            showCountDiv.querySelector(".show-count-divh2").innerText = `You have ${data.length} pending  tasks.`
            setPendingData(finalData);
        } else {
            showCountDiv.querySelector(".show-count-divh2").innerText = "You do not have any task assigned yet. Try switching book."
            setPendingData(data);
        }

    });
}

//   set pending data ===============
const tileContainer = document.querySelector(".tileContainer")
const tile = document.querySelector(".tile")

function setPendingData(pendingData) {
    if (document.querySelector(".new-tile")) {
        document.querySelectorAll(".new-tile").forEach((el) => el.remove())

    }
    pendingData.forEach((el) => {
        var newTile = tile.cloneNode(true)
        newTile.querySelector(".chapter-name").innerText = el[5]
        newTile.querySelector(".question-type").innerText = el[7]
        newTile.querySelector(".video-name").innerText = el[9]
        newTile.querySelector(".row-num").innerText = el[el.length - 1]
        newTile.querySelector(".videoName").value = el[9]
        newTile.querySelector(".feedback-btn").addEventListener("click", () => showErrorPopUp(el))
        newTile.querySelector(".videoInput").addEventListener("change", showvideoName)
        newTile.querySelector(".videoUploadForm").addEventListener("submit", uploadvideo)
        newTile.querySelector(".view-question-btn").addEventListener("click", () => showQuestion(el))
        newTile.querySelector(".qc-history-btn").remove()
        newTile.querySelector(".preview-btn").remove()
        setInterval(() => {
            var setTime = deadline(el[24])
            if (setTime == "EXPIRED") {
                newTile.classList.add("border-red")
            }
            newTile.querySelector(".demo").innerText = setTime
        }, 1000);
        newTile.querySelector(".sme-round").innerText = 1
        newTile.classList.remove("hidden")
        newTile.classList.add("new-tile")
        tileContainer.append(newTile)
    })

}

// pop up functions
function showQuestion(el) {
    popupHide()
    popup.classList.remove("hidden");
    overlay.classList.remove("hidden")
    popup.querySelector(".title").innerText = "Sorry...  :("
    popup.querySelector(".quePopup").classList.remove("hidden");
    document.querySelector('.waitImage').src = waitImg;

}

function showErrorPopUp(el) {
    popupHide()
    popup.classList.remove("hidden");
    overlay.classList.remove("hidden")
    popup.querySelector(".title").innerText = "Question Feedback"
    popup.querySelector(".feedbackPopup").classList.remove("hidden")
    popup.querySelector("select").addEventListener('change', () => {
        if (popup.querySelector(".feedbackPopup").querySelector("select").value == 'Other') {
            document.querySelector(".feedbackReason").classList.remove("hidden")
        }
    })
    popup.querySelector(".feedbackPopup").querySelector('.error-btn').addEventListener("click", () => sendFeedback(el))

}

function sendFeedback(el) {
    var error = document.querySelector(".issueSelect").value
    if (error == 'Other') {
        error = document.querySelector(".feedbackReason").value
    }
    document.querySelector(".feedbackReason").classList.add("hidden")
    var rowNum = el[el.length - 1]
    var id = getId(currentSheetLink);
    var range = [`Supply!N${rowNum}`];
    value = [error];
    updateSheet(id, range, value);
    setTimeout(() => {
        popupHide()
    }, 1000);

}

function popupHide() {
    document.querySelector(".feedbackReason").classList.add("hidden")
    popup.querySelector(".video-link").src = ""
    overlay.classList.add("hidden")
    popup.classList.add("hidden")
    popup.querySelector(".qcPopup").classList.add("hidden")
    popup.querySelector(".vidPopup").classList.add("hidden")
    popup.querySelector(".feedbackPopup").classList.add("hidden")
    popup.querySelector(".quePopup").classList.add("hidden");


}
// show video name
function showvideoName(e) {
    e.target.parentElement.parentElement.parentElement.parentElement.querySelector(".previewBeforeSubmit").classList.remove("hidden");
    let file = e.target.files[0];
    let url = URL.createObjectURL(file);
    e.target.parentElement.parentElement.parentElement.parentElement.querySelector(".previewBeforeSubmit").addEventListener('click', () => {
        previewVideo(url, true)
    })
    var videoName = this.parentElement.parentElement.parentElement.parentElement.querySelector(".videoSelected")
    videoName.innerText = this.files[0].name
}

// upload video

function createSerialNum() {
    var oneDay = 24 * 60 * 60 * 1000;
    var firstDate = new Date(1899, 11, 30);
    var secondDate = new Date();
    var secondDateMidnight = new Date(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());
    var diff = secondDate.getTime() - secondDateMidnight.getTime();
    var left = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay))) - 1;
    var right = diff / oneDay;
    var result = left + right;
    return result;
}

function uploadvideo(e) {
    e.preventDefault();
    var uploadLoader = this.parentElement.querySelector(".uploading-loader")
    var input = this.querySelector(".videoInput");
    var videoName = this.querySelector(".videoName").value;
    var rowNum = this.querySelector(".row-num").innerText;
    var data = new FormData()
    if (input.files[0]) {
        uploadLoader.classList.remove("hidden")
        data.append('file', input.files[0])
        var fileSize = ((input.files[0].size) / 1024 / 1024).toFixed(2)

        fetchData(`/upload?name=${videoName}.mp4`, {
            method: "POST",
            body: data,
        }).then((data) => {
            if (data.SUCCESS) {
                var sheetId = getId(currentSheetLink);
                // this.removeEventListener("submit", uploadvideo);
                var link = `https://drive.google.com/file/d/${data.id}/view?usp=sharing`
                var date = createSerialNum()
                var range = [`Supply!M${rowNum}`, `Supply!N${rowNum}`, `Supply!O${rowNum}`, `Supply!R${rowNum}`, `Supply!S${rowNum}`, `Supply!V${rowNum}`, `Supply!X${rowNum}`];
                var value = [link, "Answered", true, date, "[QC]Round1", `${fileSize} MB`, date];
                if (this.querySelector(".sme-round").innerText == 2) {
                    range = [`Supply!M${rowNum}`, `Supply!P${rowNum}`, `Supply!R${rowNum}`, `Supply!S${rowNum}`, `Supply!V${rowNum}`];
                    value = [link, true, date, "[QC]Round2", `${fileSize} MB`];

                }
                if (this.querySelector(".sme-round").innerText == 3) {
                    range = [`Supply!M${rowNum}`, `Supply!q${rowNum}`, `Supply!R${rowNum}`, `Supply!S${rowNum}`, `Supply!V${rowNum}`];
                    value = [link, true, date, "[QC]Round3", `${fileSize} MB`];

                }
                updateSheet(sheetId, range, value);


            }
        });
    } else {
        alert("Please select a video")
    }
}

//  fetch rejected data========
function rejWork(bookdata) {
    fetchData("/tracker/assignments/rejected", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: token,
        },
        body: JSON.stringify({
            uniqueId: bookdata.uniqueId,
            sheetId: bookdata.link,
        }),
    }).then((data) => {
        loadingWindow.classList.add("hidden");
        const finalData = []
        data.forEach(el => {
            let book = el[2];
            NomenclatureData.forEach(el2 => {
                if (el2[0] == 'Book Code' && el2[1] == book) {
                    el[2] = el2[2]
                }
            });
            finalData.push(el)
        })
        if (data.length > 0) {
            showCountDiv.querySelector(".show-count-divh2").innerText = `You have ${data.length} rejected  tasks.`
            setRejectedData(finalData);
        } else {
            showCountDiv.querySelector(".show-count-divh2").innerText = "No rejected task. Try switching book."
            setRejectedData(data);
        }

    });
}


function setRejectedData(arr) {
    if (document.querySelector(".new-tile")) {
        document.querySelectorAll(".new-tile").forEach((el) => el.remove())
    }
    arr.forEach((el) => {
        var newTile = tile.cloneNode(true)
        newTile.querySelector(".chapter-name").innerText = el[5]
        newTile.querySelector(".question-type").innerText = el[7]
        newTile.querySelector(".video-name").innerText = el[9]
        newTile.querySelector(".row-num").innerText = el[el.length - 1]
        newTile.querySelector(".feedback-btn").remove()
        newTile.querySelector(".videoInput").addEventListener("change", showvideoName)
        newTile.querySelector(".videoUploadForm").addEventListener("submit", uploadvideo)
        newTile.querySelector(".qc-history-btn").addEventListener("click", () => showQcHistory(el))
        newTile.querySelector(".preview-btn").addEventListener("click", () => previewVideo(el, false))
        newTile.querySelector(".view-question-btn").addEventListener("click", () => showQuestion(el))
        if (el[15] == "[SME]Round3") {
            newTile.querySelector(".sme-round").innerText = 3
        }
        if (el[15] == "[SME]Round2") {
            newTile.querySelector(".sme-round").innerText = 2
        }
        setInterval(() => {
            var setTime = deadline(el[28])
            if (setTime == "EXPIRED") {
                newTile.classList.add("border-red")
            }
            newTile.querySelector(".demo").innerText = setTime
        }, 1000);
        newTile.classList.remove("hidden")
        newTile.classList.add("new-tile")
        tileContainer.append(newTile)
    })

}

function showQcHistory(el) {
    popupHide()
    popup.querySelector(".newHistory").style.opacity = "0"
    popup.querySelector(".oldHistory").style.opacity = "0";
    popup.classList.remove("hidden");
    overlay.classList.remove("hidden")
    popup.querySelector(".title").innerText = "QC History"
    popup.querySelector(".qcPopup").classList.remove("hidden")
    popup.querySelector(".round").innerText = "Round 1"
    popup.querySelector(".comment").innerText = el[19]
    popup.querySelector(".QCTime").innerText = `QC Time : ${el[17]}`
    if (el[15] == "[SME]Round3") {
        popup.querySelector(".newHistory").style.opacity = "1";
        popup.querySelector(".newHistory").addEventListener("click", () => showNewHistory(el))

    }

}

function showNewHistory(el) {
    popup.querySelector(".newHistory").style.opacity = "0";
    popup.querySelector(".oldHistory").style.opacity = "1";
    popup.querySelector(".round").innerText = "Round 2"
    popup.querySelector(".comment").innerText = el[23]
    popup.querySelector(".QCTime").innerText = `QC Time : ${el[21]}`
    popup.querySelector(".oldHistory").addEventListener("click", () => showQcHistory(el))
}

function previewVideo(el, isFile) {
    popupHide()
    if (isFile) {
        var link = el
    } else {
        var Drivelink = el[12].toString();
        var regExMatch = Drivelink.match(/[-\w]{25,}/);
        if (regExMatch) {
            var link = 'https://drive.google.com/uc?export=download&id=' + regExMatch[0];
        }
    }

    popup.querySelector(".video-link").src = link
    popup.classList.remove("hidden");
    overlay.classList.remove("hidden")
    popup.querySelector(".title").innerText = "Video Preview"
    popup.querySelector(".vidPopup").classList.remove("hidden")
}

// In qc work data 

function inQcWork(bookdata) {
    fetchData("/tracker/assignments/submitted", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: token,
        },
        body: JSON.stringify({
            uniqueId: bookdata.uniqueId,
            sheetId: bookdata.link,
        }),
    }).then((data) => {
        loadingWindow.classList.add("hidden");

        if (data.length > 0) {
            const finalData = []
            data.forEach(el => {
                let book = el[2];
                NomenclatureData.forEach(el2 => {
                    if (el2[0] == 'Book Code' && el2[1] == book) {
                        el[2] = el2[2]
                    }
                });
                finalData.push(el)
            })
            showCountDiv.querySelector(".show-count-divh2").innerText = `QC team has ${data.length} tasks from you to QC`
            setInQcData(finalData);
        } else {
            showCountDiv.querySelector(".show-count-divh2").innerText = "All tasks have been QCed. Try switching book."
            setInQcData(data);
        }
    });
}

function setInQcData(arr) {
    if (document.querySelector(".new-tile")) {
        document.querySelectorAll(".new-tile").forEach((el) => el.remove())
    }
    arr.forEach((el) => {
        var newTile = tile.cloneNode(true)
        newTile.querySelector(".chapter-name").innerText = el[5]
        newTile.querySelector(".question-type").innerText = el[7]
        newTile.querySelector(".video-name").innerText = el[9]
        newTile.querySelector(".row-num").innerText = el[el.length - 1]
        newTile.querySelector(".feedback-btn").remove()
        newTile.querySelector(".videoUploadForm").remove()
        newTile.querySelector(".video-name-div").remove()
        newTile.querySelector(".deadline-div").remove()
        newTile.querySelector(".view-question-btn").addEventListener("click", () => showQuestion(el))
        newTile.querySelector(".qc-history-btn").addEventListener("click", () => showQcHistory2(el))
        newTile.querySelector(".preview-btn").addEventListener("click", () => previewVideo(el, false))

        if (el[15] == "[SME]Round3") {
            newTile.querySelector(".sme-round").innerText = 3
        }
        if (el[15] == "[SME]Round2") {
            newTile.querySelector(".sme-round").innerText = 2
        }
        newTile.classList.remove("hidden")
        newTile.classList.add("new-tile")
        tileContainer.append(newTile)
    })

}

function showQcHistory2(el) {
    console.log(el)
    popupHide()
    popup.querySelector(".newHistory").style.opacity = "0"
    popup.querySelector(".oldHistory").style.opacity = "0";
    popup.classList.remove("hidden");
    overlay.classList.remove("hidden")
    if (el[15] == "[QC]Round1") {
        popup.querySelector(".title").innerText = "No QC History"
    } else {
        popup.querySelector(".title").innerText = "QC History"
        popup.querySelector(".qcPopup").classList.remove("hidden")
        popup.querySelector(".round").innerText = "Round 1"
        popup.querySelector(".comment").innerText = el[19]
        popup.querySelector(".QCTime").innerText = `QC Time : ${el[17]}`
        if (el[15] == "[QC]Round3") {
            popup.querySelector(".newHistory").style.opacity = "1";
            popup.querySelector(".newHistory").addEventListener("click", () => showNewHistory2(el))

        }
    }

}

function showNewHistory2(el) {
    console.log(el)
    popup.querySelector(".newHistory").style.opacity = "0";
    popup.querySelector(".oldHistory").style.opacity = "1";
    popup.querySelector(".round").innerText = "Round 2"
    popup.querySelector(".comment").innerText = el[23]
    popup.querySelector(".QCTime").innerText = `QC Time : ${el[21]}`
    popup.querySelector(".oldHistory").addEventListener("click", () => showQcHistory(el))
}