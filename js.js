let bulkFiles = [];
const bulkFileUploadBtn = document.querySelector(".bulkFileUploadBtn");
const filePondInput = document.querySelector(".filepond");
var pond = FilePond.create(filePondInput, {
  onupdatefiles: (files) => {
    bulkFiles = files;
    let missingFiles = [];
    let fileNameArr = [];
    bulkFiles.forEach((file) => {
      fileNameArr.push(file.filename);
    });
    fileNameArr.forEach((name) => {
      if (name.toString().endsWith(".mp4")) {
        let nameOnly = name.toString().match(/.*(?=.mp4)/)[0];
        if (!fileNameArr.includes(`${nameOnly}.pdf`)) {
          missingFiles.push(`${nameOnly}.pdf`);
        }
      }
    });

    if (missingFiles.length > 0) {
      document
        .querySelector(".show-count-div")
        .querySelector(
          ".show-count-divh2"
        ).innerHTML = `The following PDFs are missing :<br> ${missingFiles.join(
          "<br>"
        )}`;
      bulkFileUploadBtn.classList.add("hidden");
    } else if (bulkFiles.length > 0) {
      document
        .querySelector(".show-count-div")
        .querySelector(".show-count-divh2").innerHTML = `Ready To Upload`;
      bulkFileUploadBtn.classList.remove("hidden");
    }
  },
});
// window.location.href = 'M.html'
//https://drive.google.com/file/d/1MAUEW2YW1MuitAmM46Db_ucBJRcWOoHc/preview
const popup = document.querySelector(".popup");
const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", () => {
  if (!popup.classList.contains("hidden")) {
    popup.classList.add("hidden");
    overlay.classList.add("hidden");
    popupHide();
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
    toReturn = "No deadline specified";
  }

  // If the count down is finished, write some text
  if (distance < 0) {
    // clearInterval(x);
    return "EXPIRED";
  } else {
    return toReturn;
  }
}

// const fileInput = document.querySelector(".videoInput");
// const fileInput2 = document.querySelector(".pdfInput");
// const videoSelectedProp = document.querySelector(".videoSelected");
// const pdfSelectedProp = document.querySelector(".pdfSelected");

// fileInput.addEventListener('change', () => {
//     videoSelectedProp.innerHTML = videoSelectedProp.innerText = 'None' ? `${fileInput.value.toString().replace("C:\\fakepath\\", "")}` : `${videoSelectedProp.innerHTML},${fileInput.value.toString().replace("C:\\fakepath\\", "")}`
// })
// fileInput2.addEventListener('change', () => {
//         videoSelectedProp.innerHTML = videoSelectedProp.innerText = 'None' ? `${fileInput2.value.toString().replace("C:\\fakepath\\", "")}` : `${videoSelectedProp.innerHTML},${fileInput2.value.toString().replace("C:\\fakepath\\", "")}`
//     })
// main process==============
const preferedMode = localStorage.getItem("mode");
const switchModeBtn = document.querySelector(".switch-mode");
if (!preferedMode) {
  preferedMode == "dark";
} else {
  if (preferedMode == "light") {
    document.querySelector("body").classList.add("light-theme");
    switchModeBtn.innerText = "Dark Mode ????";
  } else {
    document.querySelector("body").classList.remove("light-theme");
  }
}

switchModeBtn.addEventListener("click", () => {
  if (switchModeBtn.innerText == "Light Mode ???") {
    localStorage.setItem("mode", "light");
    document.querySelector("body").classList.add("light-theme");
    switchModeBtn.innerText = "Dark Mode ????";
  } else {
    localStorage.setItem("mode", "dark");

    document.querySelector("body").classList.remove("light-theme");
    switchModeBtn.innerText = "Light Mode ???";
  }
});
const urlPrefix = "http://creatortoolbackend-env.eba-nmpf5bth.ap-south-1.elasticbeanstalk.com";
const userName = localStorage.getItem("userName");
const email = localStorage.getItem("userEmail");
const welcomeName = document.querySelector(".welcomeName");
const token = localStorage.getItem("accessToken");
const navLink = document.querySelectorAll(".navbar__list");
const pending = document.querySelector(".pending");
const qcProgress = document.querySelector(".qc-progress");
const bulkUpload = document.querySelector(".bulk-upload");
const rejected = document.querySelector(".rejected");
const approved = document.querySelector(".approved");
const manageTeam = document.querySelector(".teamSwitch");
const workspaceSwitch = document.querySelector(".workspaceSwitch");
const loaderText = document.querySelector(".loader-text");
const showCountDiv = document.querySelector(".show-count-div");
const count = document.querySelector(".count");
const dangerAlert = document.querySelector(".danger-alert");
const messageBox = document.querySelector(".message-box");
const errorMessage = document.querySelector(".error-message");

var assignments,
  currentSheetLink,
  onPage = 1;
var NomenclatureData = [];
var eltObj = {
  Foundation: ["1UnUcc4BCQ4AZXvY--WKdaS9GoyAou1gi6dFuZqMWEqo", 35],
  IBU: ["1gUkN2JRmewI9xvsa9SYzaIvtajbEX9Hyq9JbTXHTan4", 0],
  "Infinite Practice": ["1reYKLTsqGjm_ZsD0AcokhY6Iypbweu6kHDh4hUtUkOU", 35],
};
// windows
const verifyWindow = document.querySelector(".verifyWindow");
const loadingWindow = document.querySelector(".loadingWindow");
const homeWindow = document.querySelector(".home-window");
if (!token) {
  window.location.href = "login.html";
}
if (userName) {
  loaderText.innerHTML = `Welcome, ${userName}`;
}

async function fetchData(url, params) {
  let res;
  if (url.toString().includes("localhost")) {
    res = await fetch(url, params);
  } else {
    res = await fetch(`${urlPrefix}${url}`, params);
  }

  return await res.json();
}
document.querySelector(".btnLogout").addEventListener("click", () => {
  localStorage.setItem("accessToken", null);
  window.location.href = "login.html";
});
manageTeam.addEventListener("click", manageTeamFn);

function manageTeamFn() {
  alert("Feature coming soon...");
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
    if (data.ERROR == "ERROR_WHILE_WRITING") {
      alert("Error while writing in sheet..Please check permissions.");
      return;
    }
    getFilterBook();
  });
}

// get sheet id
function getId(link) {
  return link.toString().match("[0-9a-zA-Z_-]{15,}")[0];
}

navLink.forEach((link) => {
  link.addEventListener("click", () => {
    loadingWindow.classList.remove("hidden");
    loaderText.innerHTML = "";
    if (link.innerText === "Pending") {
      document.querySelector(".filepond").classList.add("hidden");
      bulkFileUploadBtn.classList.add("hidden");
      qcProgress.classList.remove("active");
      approved.classList.remove("active");
      rejected.classList.remove("active");
      pending.classList.add("active");
      bulkUpload.classList.remove("active");
      onPage = 1;
      getFilterBook();
    } else if (link.innerText === "Rejected") {
      document.querySelector(".filepond").classList.add("hidden");
      bulkFileUploadBtn.classList.add("hidden");
      qcProgress.classList.remove("active");
      approved.classList.remove("active");
      rejected.classList.add("active");
      pending.classList.remove("active");
      bulkUpload.classList.remove("active");
      onPage = 2;
      getFilterBook();
    } else if (link.innerText === "QC In Progress") {
      document.querySelector(".filepond").classList.add("hidden");
      bulkFileUploadBtn.classList.add("hidden");
      rejected.classList.remove("active");
      approved.classList.remove("active");
      qcProgress.classList.add("active");
      pending.classList.remove("active");
      bulkUpload.classList.remove("active");
      onPage = 3;
      getFilterBook();
    } else if (link.innerText === "Approved") {
      document.querySelector(".filepond").classList.add("hidden");
      bulkFileUploadBtn.classList.add("hidden");
      rejected.classList.remove("active");
      qcProgress.classList.remove("active");
      approved.classList.add("active");
      pending.classList.remove("active");
      bulkUpload.classList.remove("active");
      onPage = 4;
      getFilterBook();
    } else {
      rejected.classList.remove("active");
      qcProgress.classList.remove("active");
      pending.classList.remove("active");
      approved.classList.remove("active");
      bulkUpload.classList.add("active");
      initUploadPage();
    }
  });
});

// get assignment
let verifyData;
var userData;
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
  let loader = document.querySelector(".lds-ring");
  if (data.ERROR == "USER_NOT_FOUND") {
    loader.classList.add("hidden");
    loaderText.innerHTML =
      "You're not authorized to use this app. If this is a mistake, Please contact your manager.";
    document.querySelector(".go-to-login").classList.remove("hidden");
    document.querySelector(".go-to-login").addEventListener("click", () => {
      window.location.href = "login.html";
    });
    document.querySelectorAll(".ring").forEach((el) => {
      el.remove();
    });
  } else {
    loader.classList.remove("hidden");
    verifyData = data;
    loaderText.innerHTML = `Please Wait... Getting your assignment`;
    userData = data;
    addProjectFilter(data);
  }
});

//  project filter

const projectFilter = document.querySelector(".project-filter");
projectFilter.addEventListener("change", getProject);

function addProjectFilter(data) {
  var projects = data.project.toString().split("+");
  if (projects.length > 1) {
    for (var pn = 0; pn < projects.length; pn++) {
      var filterOption = document.createElement("option");
      filterOption.value = projects[pn];
      filterOption.innerText = projects[pn];
      projectFilter.append(filterOption);
    }
    projectFilter.parentElement.classList.remove("hidden");
    verifyWindow.classList.add("hidden");
    dangerAlert.classList.remove("hidden");
    dangerAlert.classList.add("back-none");
    dangerAlert.classList.add("select_project");
    errorMessage.innerText = "Select a project to continue.";
  } else {
    getAssignment(data);
  }
}

function getProject() {
  var projectName = projectFilter.value;
  var data = userData;
  data.project = projectName;
  getAssignment(data);
}

function getAssignment(data) {
  let userName2 = data.name;
  dangerAlert.classList.add("hidden");
  dangerAlert.classList.remove("select_project");
  projectFilter.parentElement.classList.add("hidden");
  verifyWindow.classList.remove("hidden");
  if (!eltObj[data.project]) {
    verifyWindow.classList.add("hidden");
    dangerAlert.classList.remove("hidden");
    dangerAlert.classList.remove("back-none");
    errorMessage.innerText = "Project not found!!";
  } else {
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
        elt: eltObj[data.project],
      }),
    }).then((data) => {
      verifyWindow.classList.add("hidden");
      if (data.status == "OKAY") {
        assignments = data.assignmentsArr;
        if (assignments.length > 0) {
          NomenclatureData = data.NomenclatureData;
          welcomeName.innerHTML = userName2;
          homeWindow.classList.remove("hidden");
          totalBooks();
        } else {
          dangerAlert.classList.remove("hidden");
          dangerAlert.classList.remove("back-none");
          errorMessage.innerText =
            "You have not been assigned any task in this project.";
        }
      } else {
        dangerAlert.classList.remove("hidden");
        dangerAlert.classList.remove("back-none");
        errorMessage.innerText =
          "Somthing went wrong. Connect your manager";
      }
    });
  }
}

// total books==
function totalBooks() {
  var books = [];
  assignments.forEach((el) => {
    books.push(`${el[2]}-${el[1]}`);
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
  var fiterValue = bookfilter.value;
  var bookName = fiterValue.split("-")[0];
  var filterClass = fiterValue.split("-")[1];
  var bookdata = {};
  assignments.forEach((el) => {
    if (el[2] == bookName && el[1] == filterClass) {
      bookdata.link = getId(el[7]);
      currentSheetLink = el[7];
      bookdata.uniqueId = userData.name;
    }
  });
  if (onPage == 1) {
    pendingWork(bookdata);
  } else if (onPage == 2) {
    rejWork(bookdata);
  } else if (onPage == 3) {
    inQcWork(bookdata);
  } else {
    approvedWork(bookdata);
  }
}

// fetch pending data======
function pendingWork(bookdata) {
  loadingWindow.classList.remove("hidden");
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
      const finalData = [];
      data.forEach((el) => {
        let book = el[2];
        NomenclatureData.forEach((el2) => {
          if (el2[0] == "Book Code" && el2[1] == book) {
            el[2] = el2[2];
          }
        });
        finalData.push(el);
      });
      showCountDiv.querySelector(
        ".show-count-divh2"
      ).innerText = `You have ${data.length} pending  tasks.`;
      setPendingData(finalData);
    } else {
      showCountDiv.querySelector(".show-count-divh2").innerText =
        "You do not have any task assigned yet. Try switching book.";
      setPendingData(data);
    }
  });
}

//   set pending data ===============
const tileContainer = document.querySelector(".tileContainer");
const tile = document.querySelector(".tile");

function setPendingData(pendingData) {
  if (document.querySelector(".new-tile")) {
    document.querySelectorAll(".new-tile").forEach((el) => el.remove());
  }
  pendingData.forEach((el) => {
    var newTile = tile.cloneNode(true);
    newTile.querySelector(".chapter-name").innerText = el[5];
    newTile.querySelector(".question-type").innerText = el[7];
    newTile.querySelector(".video-name").innerText = el[9];
    newTile.querySelector(".row-num").innerText = el[el.length - 1];
    newTile.querySelector(".videoName").value = el[9];
    newTile
      .querySelector(".feedback-btn")
      .addEventListener("click", () => showErrorPopUp(el));
    newTile
      .querySelector(".videoInput")
      .addEventListener("change", showvideoName);
    newTile.querySelector(".pdfInput").addEventListener("change", showpdfName);
    newTile
      .querySelector(".videoUploadForm")
      .addEventListener("submit", uploadvideo);
    newTile
      .querySelector(".view-question-btn")
      .addEventListener("click", () => showQuestion(el));
    newTile.querySelector(".qc-history-btn").remove();
    newTile.querySelector(".preview-btn").remove();
    setInterval(() => {
      var setTime = deadline(el[36]);
      if (setTime == "EXPIRED") {
        newTile.classList.add("border-red");
      }
      newTile.querySelector(".demo").innerText = setTime;
    }, 50);
    var setTime = deadline(el[36]);
    if (setTime == "EXPIRED") {
      newTile.classList.add("border-red");
    }
    newTile.querySelector(".demo").innerText = setTime;
    newTile.querySelector(".sme-round").innerText = 1;
    newTile.classList.remove("hidden");
    newTile.classList.add("new-tile");
    tileContainer.append(newTile);
  });
  if (bulkUpload.classList.contains("active")) {
    if (document.querySelector(".new-tile")) {
      document.querySelectorAll(".new-tile").forEach((el) => el.remove());
    }
    return;
  }
}

// pop up functions
function showQuestion(el) {
  popupHide();
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
  popup.querySelector(".title").innerText = "Sorry...  :(";
  popup.querySelector(".quePopup").classList.remove("hidden");
  document.querySelector(".waitImage").src = waitImg;
}

function showErrorPopUp(el) {
  popupHide();
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
  popup.querySelector(".title").innerText = "Question Feedback";
  popup.querySelector(".feedbackPopup").classList.remove("hidden");
  popup.querySelector("select").addEventListener("change", () => {
    if (
      popup.querySelector(".feedbackPopup").querySelector("select").value ==
      "Other"
    ) {
      document.querySelector(".feedbackReason").classList.remove("hidden");
    }
  });
  popup
    .querySelector(".feedbackPopup")
    .querySelector(".error-btn")
    .addEventListener("click", () => sendFeedback(el));
}

function sendFeedback(el) {
  var error = document.querySelector(".issueSelect").value;
  if (error == "Other") {
    error = document.querySelector(".feedbackReason").value;
  }
  document.querySelector(".feedbackReason").classList.add("hidden");
  var rowNum = el[el.length - 1];
  var id = getId(currentSheetLink);
  var range = [`Supply!N${rowNum}`];
  value = [error];
  updateSheet(id, range, value);
  setTimeout(() => {
    popupHide();
  }, 1000);
}

function popupHide() {
  document.querySelector(".feedbackReason").classList.add("hidden");
  popup.querySelector(".video-link").src = "";
  overlay.classList.add("hidden");
  popup.classList.add("hidden");
  popup.querySelector(".qcPopup").classList.add("hidden");
  popup.querySelector(".vidPopup").classList.add("hidden");
  popup.querySelector(".feedbackPopup").classList.add("hidden");
  popup.querySelector(".quePopup").classList.add("hidden");
}
// show video name
function getVideoDimensionsOf(url) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.addEventListener(
      "loadedmetadata",
      () => {
        const height = video.videoHeight;
        const width = video.videoWidth;
        console.log(height);
        resolve({ height, width });
      },
      false
    );
    video.src = url;
  });
}

function showvideoName(e) {
  let file = e.target.files[0];
  let url = URL.createObjectURL(file);
  getVideoDimensionsOf(url).then((dimension) => {
    if (dimension.height != 720 || dimension.width != 1280) {
      e.target.value = "";
      alert("Video dimension is not acceptable");
    } else {
      e.target.parentElement.parentElement.parentElement.parentElement
        .querySelector(".previewBeforeSubmit")
        .classList.remove("hidden");
      e.target.parentElement.parentElement.parentElement.parentElement
        .querySelector(".previewBeforeSubmit")
        .addEventListener("click", () => {
          previewVideo(url, true);
        });
      var videoName =
        this.parentElement.parentElement.parentElement.parentElement.querySelector(
          ".videoSelected"
        );
      videoName.innerText = this.files[0].name;
    }
  });
  // document.querySelectorAll(".videoInput").forEach(el => {
  //     el.disabled = true
  //     el.parentElement.style.backgroundImage='none'
  //     el.parentElement.style.backgroundImage=`linear-gradient(to right, #968d8f, #989490, #a8a29b, #bba79f)`
  // })
}

function showpdfName(e) {
  var pdfName =
    this.parentElement.parentElement.parentElement.parentElement.querySelector(
      ".pdfSelected"
    );
  pdfName.innerText = this.files[0].name;
}

// upload video
const getVideoDuration = async (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const media = new Audio(reader.result);
      media.onloadedmetadata = () => resolve(media.duration);
    };
    reader.readAsDataURL(file);
    reader.onerror = (error) => reject(error);
  });

function createSerialNum() {
  var oneDay = 24 * 60 * 60 * 1000;
  var firstDate = new Date(1899, 11, 30);
  var secondDate = new Date();
  var secondDateMidnight = new Date(
    secondDate.getFullYear(),
    secondDate.getMonth(),
    secondDate.getDate()
  );
  var diff = secondDate.getTime() - secondDateMidnight.getTime();
  var left = Math.floor(
    Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
  );
  var right = diff / oneDay;
  var result = left + right;
  return result;
}

async function uploadvideo(e) {
  e.preventDefault();
  //var uploadLoader = this.parentElement.querySelector(".uploading-loader")

  var input = this.querySelector(".videoInput");
  var input2 = this.querySelector(".pdfInput");
  var videoName = this.querySelector(".videoName").value;
  var rowNum = this.querySelector(".row-num").innerText;
  var data = new FormData();
  if (input.files[0] && input2.files[0]) {
    this.parentElement.querySelector(
      "button[type='submit']"
    ).innerHTML = `Submitting <i class="fa-solid fa-spinner fa-spin-pulse"></i>`;
    //uploadLoader.classList.remove("hidden")
    data.append("files", input.files[0]);
    data.append("files", input2.files[0]);
    var fileSize = (input.files[0].size / 1024 / 1024).toFixed(2);
    var durationVid;
    durationVid = await getVideoDuration(input.files[0]);

    fetchData(`/upload?name=${videoName}`, {
      method: "POST",
      body: data,
    }).then((data) => {
      if (data.SUCCESS) {
        var sheetId = getId(currentSheetLink);
        // this.removeEventListener("submit", uploadvideo);
        var link = `https://drive.google.com/file/d/${data.id}/view?usp=sharing`;
        var date = createSerialNum();
        var range = [
          `Supply!M${rowNum}`,
          `Supply!N${rowNum}`,
          `Supply!O${rowNum}`,
          `Supply!R${rowNum}`,
          `Supply!S${rowNum}`,
          `Supply!AI${rowNum}`,
          `Supply!AJ${rowNum}`,
        ];
        var value = [
          link,
          "Answered",
          true,
          date,
          "[QC]Round1",
          `${fileSize} MB`,
          `${durationVid}Sec.`,
        ];
        if (this.querySelector(".sme-round").innerText == 2) {
          range = [
            `Supply!M${rowNum}`,
            `Supply!P${rowNum}`,
            `Supply!R${rowNum}`,
            `Supply!S${rowNum}`,
            `Supply!AI${rowNum}`,
            `Supply!AJ${rowNum}`,
          ];
          value = [
            link,
            true,
            date,
            "[QC]Round2",
            `${fileSize} MB`,
            `${durationVid}Sec.`,
          ];
        }
        if (this.querySelector(".sme-round").innerText == 3) {
          range = [
            `Supply!M${rowNum}`,
            `Supply!q${rowNum}`,
            `Supply!R${rowNum}`,
            `Supply!S${rowNum}`,
            `Supply!AI${rowNum}`,
            `Supply!AJ${rowNum}`,
          ];
          value = [
            link,
            true,
            date,
            "[QC]Round3",
            `${fileSize} MB`,
            `${durationVid}Sec.`,
          ];
        }
        updateSheet(sheetId, range, value);
      } else {
        this.parentElement.querySelector(
          "button[type='submit']"
        ).innerHTML = `ERROR <i class="fa-solid fa-triangle-exclamation fa-fade"></i>`;
      }
    });
  } else {
    this.parentElement.querySelector(
      "button[type='submit']"
    ).innerHTML = `Try Again`;
    setTimeout(() => {
      this.parentElement.querySelector(
        "button[type='submit']"
      ).innerHTML = `Submit Assignments`;
    }, 3000);
    alert("Please select both files");
  }
}

function uploadpdf() {
  e.preventDefault();
  //var uploadLoader = this.parentElement.querySelector(".uploading-loader")
  this.querySelector(
    "button[type='submit']"
  ).innerHTML = `Submitting <i class="fa-solid fa-spinner fa-spin-pulse"></i>`;
  var input = this.querySelector(".pdfInput");
  var pdfName = this.querySelector(".pdfName").value;
  var data = new FormData();
  if (input.files[0]) {
    //uploadLoader.classList.remove("hidden")
    data.append("file", input.files[0]);
    fetchData(`/upload?name=${pdfName}.pdf`, {
      method: "POST",
      body: data,
    }).then((data) => {
      if (data.SUCCESS) {
        this.querySelector(
          "button[type='submit']"
        ).innerHTML = `PDF <i class="fa-solid fa-check"></i>`;
      } else {
        this.parentElement.querySelector(
          "button[type='submit']"
        ).innerHTML = `ERROR <i class="fa-solid fa-triangle-exclamation fa-fade"></i>`;
      }
    });
  } else {
    alert("Please select a video");
  }
}
//  fetch rejected data========
function rejWork(bookdata) {
  loadingWindow.classList.remove("hidden");
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
    const finalData = [];

    if (data.length > 0) {
      data.forEach((el) => {
        let book = el[2];
        NomenclatureData.forEach((el2) => {
          if (el2[0] == "Book Code" && el2[1] == book) {
            el[2] = el2[2];
          }
        });
        finalData.push(el);
      });
      showCountDiv.querySelector(
        ".show-count-divh2"
      ).innerText = `You have ${data.length} rejected  tasks.`;
      setRejectedData(finalData);
    } else {
      showCountDiv.querySelector(".show-count-divh2").innerText =
        "No rejected task. Try switching book.";
      setRejectedData(data);
    }
  });
}

function setRejectedData(arr) {
  if (document.querySelector(".new-tile")) {
    document.querySelectorAll(".new-tile").forEach((el) => el.remove());
  }
  if (arr.length > 0) {
    arr.forEach((el) => {
      var newTile = tile.cloneNode(true);
      newTile.querySelector(".chapter-name").innerText = el[5];
      newTile.querySelector(".question-type").innerText = el[7];
      newTile.querySelector(".video-name").innerText = el[9];
      newTile.querySelectorAll(".row-num").forEach((em) => {
        em.innerText = el[el.length - 1];
      });
      newTile.querySelector(".feedback-btn").remove();
      newTile
        .querySelector(".videoInput")
        .addEventListener("change", showvideoName);
      newTile
        .querySelector(".pdfInput")
        .addEventListener("change", showpdfName);
      newTile
        .querySelector(".videoUploadForm")
        .addEventListener("submit", uploadvideo);
      newTile.querySelector(".videoName").value = el[9];
      newTile
        .querySelector(".qc-history-btn")
        .addEventListener("click", () => showQcHistory(el));
      newTile
        .querySelector(".preview-btn")
        .addEventListener("click", () => previewVideo(el, false));
      newTile
        .querySelector(".view-question-btn")
        .addEventListener("click", () => showQuestion(el));
      if (el[18] == "[SME]Round3") {
        newTile.querySelector(".sme-round").innerText = 3;
      }
      if (el[18] == "[SME]Round2") {
        newTile.querySelector(".sme-round").innerText = 2;
      }
      setInterval(() => {
        var setTime = deadline(el[28]);
        if (setTime == "EXPIRED") {
          newTile.classList.add("border-red");
        }
        newTile.querySelector(".demo").innerText = setTime;
      }, 1000);
      newTile.classList.remove("hidden");
      newTile.classList.add("new-tile");
      tileContainer.append(newTile);
    });
  }
  if (bulkUpload.classList.contains("active")) {
    if (document.querySelector(".new-tile")) {
      document.querySelectorAll(".new-tile").forEach((el) => el.remove());
    }
    return;
  }
}

function showQcHistory(el) {
  popupHide();
  popup.querySelector(".newHistory").style.opacity = "0";
  popup.querySelector(".oldHistory").style.opacity = "0";
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
  popup.querySelector(".title").innerText = "QC History";
  popup.querySelector(".qcPopup").classList.remove("hidden");
  popup.querySelector(".round").innerText = "Round 1";
  popup.querySelector(".status").innerText = "Rejected";
  popup.querySelector(".comment").innerText = el[22];
  popup.querySelector(".QCTime").innerText = `QC Date : ${el[20]}`;
  if (el[15] == "[SME]Round3") {
    popup.querySelector(".newHistory").style.opacity = "1";
    popup
      .querySelector(".newHistory")
      .addEventListener("click", () => showNewHistory(el));
  }
}

function showNewHistory(el) {
  popup.querySelector(".newHistory").style.opacity = "0";
  popup.querySelector(".oldHistory").style.opacity = "1";
  popup.querySelector(".round").innerText = "Round 2";
  popup.querySelector(".comment").innerText = el[27];
  popup.querySelector(".status").innerText = "Rejected";
  popup.querySelector(".QCTime").innerText = `QC Date : ${el[25]}`;
  popup
    .querySelector(".oldHistory")
    .addEventListener("click", () => showQcHistory(el));
}

function previewVideo(el, isFile) {
  popupHide();
  if (isFile) {
    var link = el;
  } else {
    var Drivelink = el[12].toString();
    var regExMatch = Drivelink.match(/[-\w]{25,}/);
    if (regExMatch) {
      var link =
        "https://drive.google.com/uc?export=download&id=" + regExMatch[0];
    }
  }

  popup.querySelector(".video-link").src = link;
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
  popup.querySelector(".title").innerText = "Video Preview";
  popup.querySelector(".vidPopup").classList.remove("hidden");
}

// In qc work data

function inQcWork(bookdata) {
  loadingWindow.classList.remove("hidden");
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
      const finalData = [];
      data.forEach((el) => {
        let book = el[2];
        NomenclatureData.forEach((el2) => {
          if (el2[0] == "Book Code" && el2[1] == book) {
            el[2] = el2[2];
          }
        });
        finalData.push(el);
      });
      showCountDiv.querySelector(
        ".show-count-divh2"
      ).innerText = `QC team has ${data.length} tasks from you to QC`;
      setInQcData(finalData);
    } else {
      showCountDiv.querySelector(".show-count-divh2").innerText =
        "All tasks have been QCed. Try switching book.";
      setInQcData(data);
    }
  });
}

function setInQcData(arr) {
  if (document.querySelector(".new-tile")) {
    document.querySelectorAll(".new-tile").forEach((el) => el.remove());
  }
  if (arr.length > 0) {
    arr.forEach((el) => {
      var newTile = tile.cloneNode(true);
      newTile.querySelector(".chapter-name").innerText = el[5];
      newTile.querySelector(".question-type").innerText = el[7];
      newTile.querySelector(".video-name").innerText = el[9];
      newTile.querySelector(".row-num").innerText = el[el.length - 1];
      newTile.querySelector(".videoName").value = el[9];
      newTile.querySelector(".feedback-btn").remove();
      newTile.querySelector(".videoUploadForm").remove();
      newTile.querySelector(".video-name-div").remove();
      newTile.querySelector(".deadline-div").remove();
      newTile
        .querySelector(".view-question-btn")
        .addEventListener("click", () => showQuestion(el));
      newTile
        .querySelector(".qc-history-btn")
        .addEventListener("click", () => showQcHistory2(el));
      newTile
        .querySelector(".preview-btn")
        .addEventListener("click", () => previewVideo(el, false));

      if (el[15] == "[SME]Round3") {
        newTile.querySelector(".sme-round").innerText = 3;
      }
      if (el[15] == "[SME]Round2") {
        newTile.querySelector(".sme-round").innerText = 2;
      }
      newTile.classList.remove("hidden");
      newTile.classList.add("new-tile");
      tileContainer.append(newTile);
    });
  }
}

function showQcHistory2(el) {
  popupHide();
  popup.querySelector(".newHistory").style.opacity = "0";
  popup.querySelector(".oldHistory").style.opacity = "0";
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
  if (el[15] == "[QC]Round1") {
    popup.querySelector(".title").innerText = "No QC History";
  } else {
    popup.querySelector(".title").innerText = "QC History";
    popup.querySelector(".qcPopup").classList.remove("hidden");
    popup.querySelector(".round").innerText = "Round 1";
    popup.querySelector(".comment").innerText = el[22];
    popup.querySelector(".status").innerText = "Rejected";
    popup.querySelector(".QCTime").innerText = `QC Date : ${el[20]}`;
    if (el[15] == "[QC]Round3") {
      popup.querySelector(".newHistory").style.opacity = "1";
      popup
        .querySelector(".newHistory")
        .addEventListener("click", () => showNewHistory2(el));
    }
  }
}

function showNewHistory2(el) {
  popup.querySelector(".newHistory").style.opacity = "0";
  popup.querySelector(".oldHistory").style.opacity = "1";
  popup.querySelector(".round").innerText = "Round 2";
  popup.querySelector(".comment").innerText = el[27];
  popup.querySelector(".status").innerText = "Rejected";
  popup.querySelector(".QCTime").innerText = `QC Date : ${el[25]}`;
  popup
    .querySelector(".oldHistory")
    .addEventListener("click", () => showQcHistory(el));
}

function initUploadPage() {
  document.querySelector(".filepond").classList.remove("hidden");
  loadingWindow.classList.add("hidden");
  showCountDiv.querySelector(".show-count-divh2").innerText =
    "Select videos and corresponding PDFs and hit upload button.";
  if (document.querySelector(".new-tile")) {
    document.querySelectorAll(".new-tile").forEach((el) => el.remove());
  }
}

setTimeout(() => {
  let filepond = document.querySelector(".filepond--browser");
  filepond.addEventListener("change", () => {
    document
      .querySelector(".filepond--data")
      .querySelectorAll("input")
      .forEach((el) => {
        console.log(el.value);
      });
    let fileNameArr = [];
    let fileArr = [];
    console.log(filepond.files.length);
    fileArr.forEach((file) => {
      fileNameArr.push(file.name);
    });
    let missingFiles = [];
    fileNameArr.forEach((name) => {
      if (name.toString().endsWith(".mp4")) {
        let nameOnly = name.toString().match(/.*(?=.mp4)/)[0];
        if (!fileNameArr.includes(`${nameOnly}.pdf`)) {
          missingFiles.push(`${nameOnly}.pdf`);
        }
      }
    });
    showCountDiv.querySelector(
      ".show-count-divh2"
    ).innerHTML = `The following PDFs are missing :<br> ${missingFiles.join(
      "<br>"
    )}`;
  });
}, 1000);
let bulkToken;
getProgress = () => {
  fetchData(`/bulkupload?token=${bulkToken}`).then((data) => {
    let files = data.data.filecount;
    let uploaded = data.data.uploaded;
    let per = Math.floor((uploaded / files) * 100);
    showCountDiv.innerHTML = `Uploaded ${uploaded} files out of ${files} (${per}%) PLEASE DO NOT REFRESH OR CLOSE THE PAGE`;
    if (per < 100) {
      setTimeout(() => {
        getProgress();
      }, 3500);
    } else {
      showCountDiv.innerHTML = `Uploaded successfully`;
    }
  });
};
let bulkfilesObj = {
  filesuploaded: 0,
  filescount: 0,
};
bulkFileUploadBtn.addEventListener("click", async () => {
  // let missingFiles = []
  // let fileNameArr = []
  // bulkFiles.forEach(file => {
  //     fileNameArr.push(file.filename)
  // })
  // fileNameArr.forEach(name => {
  //     if (name.toString().endsWith('.mp4')) {
  //         let nameOnly = name.toString().match(/.*(?=.mp4)/)[0];
  //         if (!fileNameArr.includes(`${nameOnly}.pdf`)) {
  //             missingFiles.push(`${nameOnly}.pdf`)
  //         }
  //     }
  // })
  // showCountDiv.querySelector(".show-count-divh2").innerHTML = `The following PDFs are missing :<br> ${missingFiles.join("<br>")}`
  bulkFileUploadBtn.classList.add("hidden");
  showCountDiv.querySelector(
    ".show-count-divh2"
  ).innerHTML = `Starting Bulk Uploading...DO NOT REFRESH THE PAGE.`;
  let files = pond.getFiles();
  bulkfilesObj.filescount = files.length;
  for (let fl = 0; fl < files.length; fl++) {
    let file = files[fl];
    let data = new FormData();
    data.append("files", file.file);
    data.append("filesuploaded", bulkfilesObj.filesuploaded);
    data.append("filescount", bulkfilesObj.filescount);
    if (bulkfilesObj.sheet) {
      data.append("sheet", bulkfilesObj.sheet);
    }
    let res = await fetchData(`/bulkupload?id=${getId(currentSheetLink)}`, {
      method: "POST",
      body: data,
    });
    if (res.status == "ERROR" && res.msg == "WRONG_BOOK_SELECTED") {
      showCountDiv.innerHTML =
        "WRONG BOOK SELECTED...Please refresh the page and upload files with correct book selected.";
      return;
    }
    let filesUploaded = res.filesuploaded;
    bulkfilesObj.filesuploaded = filesUploaded;
    bulkfilesObj.sheet = res.sheet;
    let per = Math.floor((filesUploaded / bulkfilesObj.filescount) * 100);
    if (per == 100) {
      showCountDiv.innerHTML = `All files uploaded successfully. Please refresh the page before uploading new files.`;
    } else {
      showCountDiv.innerHTML = `Uploaded ${filesUploaded} files out of ${bulkfilesObj.filescount} (${per}%) PLEASE DO NOT REFRESH OR CLOSE THE PAGE`;
    }
  }
});


// approved section====

function approvedWork(bookdata) {
  loadingWindow.classList.remove("hidden");
  fetchData("/tracker/assignments/approved", {
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

    if (data.status == "OKAY") {
      if (data.task.length > 0) {
        const finalData = [];
        data.task.forEach((el) => {
          let book = el[2];
          NomenclatureData.forEach((el2) => {
            if (el2[0] == "Book Code" && el2[1] == book) {
              el[2] = el2[2];
            }
          });
          finalData.push(el);
        });
        showCountDiv.querySelector(
          ".show-count-divh2"
        ).innerText = `You have ${data.task.length} tasks approved with suggestions in this book.`;
        setApprovedData(finalData);
      } else {
        showCountDiv.querySelector(".show-count-divh2").innerText =
          "We do not have any suggestions for you. You have done your job very adequately.";
        setApprovedData([]);
      }
    } else {
      showCountDiv.querySelector(".show-count-divh2").innerText =
        "Something went wrong. Connect your manager";
      setApprovedData([]);
    }
  });
}


function setApprovedData(arr) {
  if (document.querySelector(".new-tile")) {
    document.querySelectorAll(".new-tile").forEach((el) => el.remove());
  }
  if (arr.length > 0) {
    arr.forEach((el) => {
      var newTile = tile.cloneNode(true);
      newTile.querySelector(".chapter-name").innerText = el[5];
      newTile.querySelector(".question-type").innerText = el[7];
      newTile.querySelector(".video-name").innerText = el[9];
      newTile.querySelector(".row-num").innerText = el[el.length - 1];
      newTile.querySelector(".videoName").value = el[9];
      newTile.querySelector(".feedback-btn").remove();
      newTile.querySelector(".videoUploadForm").remove();
      newTile.querySelector(".video-name-div").remove();
      newTile.querySelector(".deadline-div").remove();
      newTile.querySelector(".view-question-btn").remove();
      newTile
        .querySelector(".qc-history-btn").innerText = "View Suggestions"
      newTile
        .querySelector(".qc-history-btn")
        .addEventListener("click", () => showSuggestion(el));
      newTile
        .querySelector(".preview-btn")
        .addEventListener("click", () => previewVideo(el, false));
      newTile.classList.remove("hidden");
      newTile.classList.add("new-tile");
      tileContainer.append(newTile);
    });
  }
}


function showSuggestion(el) {
  popupHide();
  popup.querySelector(".newHistory").style.opacity = "0";
  popup.querySelector(".oldHistory").style.opacity = "0";
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
  if (el[31] == "Approved") {
    if (el[32] == "") {
      popup.querySelector(".title").innerText = "No Suggestions";
    } else {
      popup.querySelector(".title").innerText = "Suggestions";
      popup.querySelector(".qcPopup").classList.remove("hidden");
      popup.querySelector(".round").innerText = "Round 3";
      popup.querySelector(".comment").innerText = el[32];
      popup.querySelector(".status").innerText = "Approved";
      popup.querySelector(".QCTime").innerText = `QC Date : ${el[30]}`;
    }
  } else if (el[26] == "Approved") {
    if (el[27] == "") {
      popup.querySelector(".title").innerText = "No Suggestions";
    } else {
      popup.querySelector(".title").innerText = "Suggestions";
      popup.querySelector(".qcPopup").classList.remove("hidden");
      popup.querySelector(".round").innerText = "Round 2";
      popup.querySelector(".status").innerText = "Approved";
      popup.querySelector(".comment").innerText = el[27];
      popup.querySelector(".QCTime").innerText = `QC Date : ${el[25]}`;
    }
  } else {
    if (el[22] == "") {
      popup.querySelector(".title").innerText = "No Suggestions";
    } else {
      popup.querySelector(".title").innerText = "Suggestions";
      popup.querySelector(".qcPopup").classList.remove("hidden");
      popup.querySelector(".round").innerText = "Round 1";
      popup.querySelector(".status").innerText = "Approved";
      popup.querySelector(".comment").innerText = el[22];
      popup.querySelector(".QCTime").innerText = `QC Date : ${el[20]}`;
    }
  }

}


