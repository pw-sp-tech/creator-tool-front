const urlPrefix = 'https://pw-qc-back.herokuapp.com'

async function fetchData(url, params) {
    let res = await fetch(`${urlPrefix}${url}`, params);
    return await res.json();
}
const rings = document.querySelectorAll(".ring");
const loaderBox = document.querySelector(".loader-box");
const loaderText = document.querySelector(".loader-text");
const token = localStorage.getItem('accessToken');
//Header Elements
const header = document.querySelector(".headerContainer");
const trackerNameHeader = document.querySelector("#trackerName").querySelector(".headerPropValue");
const sheetNameHeader = document.querySelector("#sheetName").querySelector(".headerPropValue");

const qcPersonHeader = document.querySelector(".welcome").querySelector("h2");

const filterContainer = document.querySelector(".filterContainer");
const filterSelectStatus = document.querySelector("#filterSelect");
const defaultStatusFilterOption = filterSelectStatus.querySelectorAll("option")[1];
const dynamicFilterSelect = document.querySelector(".dynamic-filterSelect");
const choices = document.querySelector(".choices");
const managerChoice = document.querySelector(".manager-choice");
const trackerChoice = document.querySelector(".tracker-choice");
const sheetChoice = document.querySelector(".subSheet-choice");
const btnChoice = document.querySelector(".choice-btn");
const filterBtnContainer = document.querySelector(".filterBtnContainer");
const customTextCard = document.querySelector(".customTextCard");
const customText = document.querySelector(".customText");
//Verifying User
loaderBox.classList.toggle("hidden");
let params, assignmentArr = [],
    qcName, filterObj = {},
    filteredData = [],
    timeObj = {},
    isRoundMandatory = 1,
    teamData;
fetchData('/assignments', {
    headers: {
        authorization: token
    }
}).then(data => {
    if (data.ERROR) {
        window.location.href = 'login.html'
    }
    assignmentArr = data.assignments;
    teamData = data.teamData
    if (assignmentArr.length == 0) {
        rings.forEach(ring => {
            ring.remove();
        });
        loaderText.innerHTML = `Nothing Assigned To You Right Now. Please Check Back Later.`
    } else if (assignmentArr.length == 1) {
        qcName = assignmentArr[0][0];
        loaderText.innerHTML = `We have found one assignment in tracker <span class="yellow">${assignmentArr[0][5]}</span>. Getting data from tracker please wait...`
        getParameters(assignmentArr[0][2], assignmentArr[0][5], assignmentArr[0][4])
    } else {
        qcName = assignmentArr[0][0];
        loaderText.innerHTML = `We have found ${assignmentArr.length} assignments for you. Please select one tracker to proceed.`;
        choices.classList.toggle("hidden")
        let managers = [];
        let trackers = [];
        let subSheets = [];
        assignmentArr.forEach(el => {
            if (!managers.includes(el[2])) {
                managers.push(el[2]);
            }
            if (!trackers.includes(el[5])) {
                trackers.push(el[5]);
            }
            if (!subSheets.includes(el[4])) {
                subSheets.push(el[4]);
            }

        });
        let defaultManager = managerChoice.querySelector("option");

        managers.forEach(manager => {
            let currManagerOption = defaultManager.cloneNode(true);
            currManagerOption.removeAttribute('disabled');
            currManagerOption.removeAttribute('selected');
            currManagerOption.removeAttribute('hidden');
            currManagerOption.innerHTML = manager;
            currManagerOption.value = manager;
            managerChoice.append(currManagerOption);
        })
    }
})
managerChoice.addEventListener('change', () => {
    trackerChoice.removeAttribute("disabled");
    managerChoice.classList.add("back-green-dark")
    trackerChoice.querySelectorAll(".visibleChoice").forEach(el => {
        el.remove()
    });
    let currManagerValue = managerChoice.value;
    let currTrackers = []
    assignmentArr.forEach(el => {
        if (el[2] == currManagerValue && !currTrackers.includes(el[5])) {
            currTrackers.push(el[5]);
        }
    })
    let defaultTracker = trackerChoice.querySelector("option");
    currTrackers.forEach(tracker => {
        let currtrackerOption = defaultTracker.cloneNode(true);
        currtrackerOption.removeAttribute('disabled');
        currtrackerOption.removeAttribute('selected');
        currtrackerOption.removeAttribute('hidden');
        currtrackerOption.classList.add("visibleChoice")
        currtrackerOption.innerHTML = tracker;
        currtrackerOption.value = tracker;
        trackerChoice.append(currtrackerOption);
    })
})
trackerChoice.addEventListener('change', () => {
    trackerChoice.classList.add("back-green-dark")
    sheetChoice.removeAttribute("disabled");
    sheetChoice.querySelectorAll(".visibleChoice").forEach(el => {
        el.remove()
    });
    let currTrackerValue = trackerChoice.value;
    let currSubSheets = []
    assignmentArr.forEach(el => {
        if (el[5] == currTrackerValue && !currSubSheets.includes(el[4])) {
            currSubSheets.push(el[4]);
        }
    })
    let defaultSubSheet = sheetChoice.querySelector("option");
    currSubSheets.forEach(subsheet => {
        let currSheetOption = defaultSubSheet.cloneNode(true);
        currSheetOption.removeAttribute('disabled');
        currSheetOption.removeAttribute('selected');
        currSheetOption.removeAttribute('hidden');
        currSheetOption.classList.add("visibleChoice")
        currSheetOption.innerHTML = subsheet;
        currSheetOption.value = subsheet;
        sheetChoice.append(currSheetOption);
    })
});

sheetChoice.addEventListener('change', () => {
    btnChoice.classList.remove("hidden");
    sheetChoice.classList.add("back-green-dark")
});
btnChoice.addEventListener('click', () => {
    let managerName = managerChoice.value;
    let trackerName = trackerChoice.value;
    let subSheetName = sheetChoice.value;
    getParameters(managerName, trackerName, subSheetName);
})

function getParameters(managerName, trackerName, subSheetName) {
    loaderText.innerHTML = `Getting data from <span class="yellow">${trackerName}(${subSheetName})</span>. Please wait...`;

    let managerSheetURL;
    assignmentArr.forEach(el => {
        if (el[2] == managerName && el[4] == subSheetName && el[5] == trackerName) {
            managerSheetURL = el[6];
        }
    });
    let managerSheetId = managerSheetURL.toString().match(/[-\w]{25,}/)[0];
    choices.remove();
    fetchData(`/tracker?id=${managerSheetId}&tracker=${trackerName}&sheet=${subSheetName}`, {
        headers: {
            authorization: token
        }
    }).then(data => {
        if (data.ERROR) {
            window.location.href = 'login.html'
        }
        data.name = qcName;
        params = data;
        params.teamData = teamData;
        console.log(params)
        trackerNameHeader.innerHTML = data.trackerName;
        sheetNameHeader.innerHTML = data.sheetName;
        qcPersonHeader.innerHTML = `Welcome, ${qcName}`;

        header.classList.remove("hidden");
        loaderBox.remove();
        configureFilters();
        customTextCard.classList.remove("hidden")
        filterBtnContainer.classList.remove("hidden2")
    })
}

function configureFilters() {
    //QC Status Filter
    params.qcStatusValues.forEach(el => {
        let currOption = defaultStatusFilterOption.cloneNode(true);
        currOption.value = el;
        currOption.innerHTML = el;
        filterSelectStatus.append(currOption);
    });
    filterContainer.classList.remove("hidden");
    if (params.optionalFiltersColumn && params.optionalFilters.toString().length > 0) {
        let optionalFilters = params.optionalFilters.toString().split(",");
        let count = -1;
        optionalFilters.forEach(el => {
            count++;
            let currFilter = dynamicFilterSelect.cloneNode(true);
            currFilter.classList.remove("hidden");
            currFilter.id = params.optionalFiltersColumn.toString().split(",")[count]
            currFilter.querySelector("option").innerHTML = `Filter By ${el}&nbsp;&#9660;`
            params.optionalFiltersValues[count].forEach(el2 => {
                let currValue = defaultStatusFilterOption.cloneNode(true);
                currValue.value = el2;
                currValue.innerHTML = el2;
                currFilter.append(currValue);
            })
            filterContainer.append(currFilter)
        })
    }
};
const info = document.querySelector(".info");
const loadNextBtn = document.querySelector(".loadNextBtn");
const loadPreBtn = document.querySelector(".loadPreBtn");
const resetCanvasBtn = document.querySelector(".resetCanvasBtn");
const footer = document.querySelector("#footer");
const progressBar = document.querySelector(".progressBar");
const progressNum = document.querySelector(".progressNum");
const body = document.body;
const cardTemplate = document.querySelector(".videoCard");

function resetCanvas() {
    resetCanvasBtn.classList.add("btnDisabled")
    loadNextBtn.removeEventListener('click', loadNextPage);
    loadPreBtn.removeEventListener('click', loadNextPage);
    loadNextBtn.classList.add("btnDisabled")
    loadPreBtn.classList.add("btnDisabled")
    let id = window.setTimeout(function() {}, 0);
    while (id--) {
        window.clearTimeout(id);
    }
    let toDelete = document.querySelectorAll(".active").forEach((x) => {
        x.remove();
    });
    progressBar.style.width = "0";
    progressNum.innerText = progressNum.innerText.split("/").length == 2 ? "0/" + progressNum.innerText.split("/")[1] : ""
    customText.innerText = "Select a filter and click search.";
    customTextCard.classList.remove("hidden");
    customText.classList.remove("loading");

    if (this == resetCanvasBtn) {
        timeObj = {};
        loadedIndex = -1;
    }
}
let togglePlayer = (e) => {
    let allVideoShowBtns = document.querySelectorAll(".active").forEach((x) => {
        let currBtn = x.querySelector(".btnShowVid");
        if (currBtn != e.target && currBtn && currBtn.innerText == "Hide Video") {
            currBtn.click();
        }
    });
    let currShowVidBtn = e.target;
    let currShowVidBtnText = currShowVidBtn.innerText;
    let currVideoCard = e.target.parentElement.parentElement;
    let currVidId = currVideoCard.querySelector(".id").innerText;
    if (!timeObj[currVidId]["isDriveFetched"] || timeObj[currVidId]["isDriveFetched"] == 0) {
        currVideoCard.querySelector(".btnFetch").click();
    }
    let currFrame = currVideoCard.querySelector("iframe");
    currShowVidBtn.removeEventListener('click', togglePlayer);
    setTimeout(() => {
        currShowVidBtn.addEventListener('click', togglePlayer);
    }, 1300);
    currFrame.classList.toggle("hidden2");
    if (currShowVidBtnText == "Open Video") {
        currShowVidBtn.innerText = "Hide Video"
        currFrame.src = currFrame.srcdoc;
        currFrame.removeAttribute("srcdoc");
        timeObj[currVidId]["state"] = 1;
        timeObj[currVidId]["timeOpen"] = new Date();

    } else {
        currShowVidBtn.innerText = "Open Video"
        timeObj[currVidId]["state"] = 0;
        timeObj[currVidId]["duration"] = timeObj[currVidId]["duration"] + (new Date() - timeObj[currVidId]["timeOpen"]);
        timeObj[currVidId]["timeOpen"] = null;
        setTimeout(() => {
            currFrame.srcdoc = currFrame.src;
        }, 1000);
        //Start From Here
    }
    console.log(timeObj)
}
let blinkUpdate = (e) => {
    let target = e.target;
    target.classList.add("updated");
    setTimeout(() => {
        target.classList.remove("updated");
    }, 1000)
}

function loadNextPage() {
    resetCanvasBtn.removeEventListener('click', resetCanvas);
    loadNextBtn.removeEventListener('click', loadNextPage);
    loadPreBtn.removeEventListener('click', loadNextPage);
    resetCanvasBtn.classList.add("btnDisabled")
    loadNextBtn.classList.add("btnDisabled")
    loadPreBtn.classList.add("btnDisabled")
    let btnClicked = this;
    let direction = 1;
    if (btnClicked == loadNextBtn) {
        loadNextBtn.innerText = "Loading";
        loadNextBtn.classList.add("loading");
    } else if (btnClicked == loadPreBtn) {
        direction = 0;
        loadPreBtn.innerText = "Loading";
        loadPreBtn.classList.add("loading");
    } else if (btnClicked == document.querySelector("#footerPreBtn")) {
        direction = 0;
    }
    resetCanvas();
    customTextCard.classList.add("hidden");
    if (direction == 0) {
        loadedIndex = loadedIndex - 100 <= -1 ? -1 : loadedIndex - 100
    }
    var loadTo = loadedIndex + 50 > filteredData.length - 1 ? filteredData.length - 1 : loadedIndex + 50;

    let b = 0;
    for (let a = loadedIndex + 1; a <= loadTo; a++) {
        b++;

        setTimeout(() => {
            loadedIndex++;
            progressBar.style.width = `${(loadedIndex+1)/(filteredData.length)*95}%`
            progressNum.innerText = `${loadedIndex+1}/${filteredData.length}`
            let currCard = cardTemplate.cloneNode(true);
            currCard.classList.remove('hidden');
            currCard.classList.add('active');
            body.append(currCard);
            let videoProps = currCard.querySelector(".vidPropContainer").querySelectorAll("p").forEach((x) => {
                x.addEventListener('click', blinkUpdate);
            });
            currCard.querySelector(".rowInSheet").querySelector(".videoCardPropValue").innerText = filteredData[a]["row"];
            currCard.querySelector(".nameInSheet").querySelector(".videoCardPropValue").innerText = filteredData[a]["nameInSheet"];
            currCard.querySelector(".verUploaded").querySelector(".videoCardPropValue").innerText = filteredData[a]["verUploaded"];
            currCard.querySelector(".verQCed").querySelector(".videoCardPropValue").innerText = filteredData[a]["verQCed"];
            currCard.querySelector(".qcStatus").querySelector(".videoCardPropValue").innerText = filteredData[a]["qcStatus"];
            currCard.querySelector(".qcComment").querySelector(".videoCardPropValue").innerText = filteredData[a]["qcComment"];
            currCard.querySelector(".educatorName").querySelector(".videoCardPropValue").innerText = filteredData[a]["educatorName"];
            currCard.querySelector(".educatorFeedback").querySelector(".videoCardPropValue").innerText = filteredData[a]["educatorFeedback"];
            let currVidId = filteredData[a]["URL"].toString().match(/[-\w]{25,}/) ? filteredData[a]["URL"].toString().match(/[-\w]{25,}/)[0] : null;
            currCard.querySelector(".id").querySelector(".videoCardPropValue").innerText = currVidId;
            currCard.querySelector(".parentURL").querySelector(".videoCardPropValue").innerText = filteredData[a]["parentURL"];
            let currFrame = currCard.querySelector("iframe");
            currFrame.srcdoc = 'https://drive.google.com/file/d/' + currVidId + '/preview?start=1'
            let currStatusSelect = currCard.querySelector(".statusSelect");
            let currRoundSelect = currCard.querySelector(".roundSelect");
            let currSubmitBtn = currCard.querySelector(".btnSubmit");
            let currFetchBtn = currCard.querySelector(".btnFetch");
            let currShowVidBtn = currCard.querySelector(".btnShowVid");
            //Dynamic Props************************************
            if (params.optionalPropsColumn) {
                let optionalPropsDiv = currCard.querySelector(".dynamic-props");
                optionalPropsDiv.classList.remove("hidden")
                let templatePropTitle = optionalPropsDiv.querySelector(".videoCardPropTitle");
                let templatePropValue = optionalPropsDiv.querySelector(".videoCardPropValue");
                let optionalPropsArr = params.optionalProps.split(",");
                let optionalPropsColumns = params.optionalPropsColumn.split(",");
                let count = -1;
                optionalPropsArr.forEach(el => {
                    count++
                    let currDynamicPropTitle = templatePropTitle.cloneNode(true);
                    let currDynamicPropValue = templatePropValue.cloneNode(true);
                    let seperator = document.createElement("p")
                    seperator.innerText = ` ; `
                    currDynamicPropTitle.innerHTML = `${el} : `
                    currDynamicPropTitle.setAttribute('for', optionalPropsColumns[count]);
                    currDynamicPropValue.value = `${filteredData[a]["optionalProps"][count]}`;
                    currDynamicPropValue.id = optionalPropsColumns[count]
                    optionalPropsDiv.append(currDynamicPropTitle)
                    optionalPropsDiv.append(currDynamicPropValue)
                    optionalPropsDiv.append(seperator)
                })
                templatePropTitle.remove();
                templatePropValue.remove();
            }


            if (!timeObj[currVidId]) {
                timeObj[currVidId] = {
                    "row": filteredData[a]["row"],
                    "nameInSheet": filteredData[a]["nameInSheet"],
                    "duration": 0,
                    "state": 0,
                    "timeOpen": null,
                    "isQCed": 0,
                }
            } else {
                if (timeObj[currVidId]["isDriveFetched"] == 1) {
                    if (timeObj[currVidId]["parentMatch"] == 0) {
                        currCard.querySelector(".pathShouldBe").classList.remove("hidden")
                    }
                    let nameActual = currCard.querySelector(".nameActual").querySelector(".videoCardPropValue")
                    nameActual.innerText = timeObj[currVidId]["nameActual"]
                    let videoSize = currCard.querySelector(".videoSize").querySelector(".videoCardPropValue")
                    videoSize.innerText = timeObj[currVidId]["videoSize"]
                    let format = currCard.querySelector(".format").querySelector(".videoCardPropValue")
                    format.innerText = timeObj[currVidId]["format"]
                    let owner = currCard.querySelector(".owner").querySelector(".videoCardPropValue")
                    owner.innerText = timeObj[currVidId]["owner"]
                    let dim = currCard.querySelector(".dim").querySelector(".videoCardPropValue")
                    dim.innerText = timeObj[currVidId]["dim"]
                    let duration = currCard.querySelector(".duration").querySelector(".videoCardPropValue");
                    duration.innerText = timeObj[currVidId]["duration"]
                    let pathActual = currCard.querySelector(".pathActual").querySelector(".videoCardPropValue");
                    pathActual.innerText = timeObj[currVidId]["pathActual"]
                    let pathShouldBe = currCard.querySelector(".pathShouldBe").querySelector(".videoCardPropValue");
                    pathShouldBe.innerText = timeObj[currVidId]["pathShouldBe"]
                }
                if (timeObj[currVidId]["isQCed"] == 1) {
                    currCard.classList.add("back-green")
                    currCard.querySelector(".comment_textarea").value = timeObj[currVidId]["comment"];
                    currCard.querySelector(".statusSelect").value = timeObj[currVidId]["status"];
                    if (timeObj[currVidId]["round"]) {
                        currCard.querySelector(".roundSelect").value = timeObj[currVidId]["round"];
                    }

                }
            }

            //showvid Button 
            currShowVidBtn.addEventListener('click', togglePlayer);
            //submitBtn
            currSubmitBtn.addEventListener('click', submitRes);
            //round Select
            if (params["verQCedValues"]) {
                params["verQCedValues"].forEach((x) => {
                    let currRound = document.createElement("option");
                    currRound.value = x;
                    currRound.innerText = x;
                    currRoundSelect.append(currRound);
                });
            } else {
                isRoundMandatory = 0;
                currRoundSelect.classList.add("hidden");
            }
            //status Select
            params["qcStatusValues"].forEach((x) => {
                if (x != "Not Picked") {
                    let currStatus = document.createElement("option");
                    currStatus.value = x;
                    currStatus.innerText = x;
                    currStatusSelect.append(currStatus);
                }

            });
            //Fetch Button
            currFetchBtn.addEventListener('click', fetchFromDrive);

        }, 100 * b)
    }
    setTimeout(() => {
        console.log(loadTo)
        console.log(filteredData.length)
        resetCanvasBtn.classList.remove("btnDisabled")
        loadNextBtn.innerText = "Next Page";
        loadPreBtn.innerText = "Previous Page";
        loadNextBtn.classList.remove("loading");
        loadPreBtn.classList.remove("loading");
        let currFooter = footer.cloneNode(true);
        body.append(currFooter);
        currFooter.classList.remove("hidden2");
        currFooter.classList.add("active");
        currFooter.id = "";
        currFooter.querySelector(".loadPreBtn").id = "footerPreBtn"
        currFooter.querySelector(".loadNextBtn").id = "footerNextBtn"
        if (filteredData.length < 50) {
            currFooter.innerHTML = `<h2>END OF RESULTS!</h2>`
            loadNextBtn.classList.add("btnDisabled");
            loadPreBtn.classList.add("btnDisabled");
        } else {
            if (loadTo + 1 >= filteredData.length) {
                currFooter.querySelector(".loadNextBtn").classList.add("btnDisabled")
                loadNextBtn.classList.add("btnDisabled")
            } else {
                currFooter.querySelector(".loadNextBtn").classList.remove("btnDisabled")
                currFooter.querySelector(".loadNextBtn").addEventListener('click', loadNextPage);
                loadNextBtn.classList.remove("btnDisabled")
                loadNextBtn.addEventListener('click', loadNextPage);
            }
            if (loadTo <= 49) {
                currFooter.querySelector(".loadPreBtn").classList.add("btnDisabled");
                loadPreBtn.classList.add("btnDisabled");

            } else {
                currFooter.querySelector(".loadPreBtn").classList.remove("btnDisabled");
                currFooter.querySelector(".loadPreBtn").addEventListener('click', loadNextPage);
                loadPreBtn.classList.remove("btnDisabled");
                loadPreBtn.addEventListener('click', loadNextPage);
            }
        }

        resetCanvasBtn.addEventListener('click', resetCanvas);
        searchBtn.addEventListener('click', runSearch);
        searchBtn.innerText = "Search";
        searchBtn.classList.remove("loading");
    }, 100 * (b + 1))

}
let runSearch = () => {
    filteredData = [];
    let statusColumn = params.qcStatusColumn;
    filterObj = {};
    let allFilters = filterContainer.querySelectorAll("select");
    allFilters.forEach(el => {
        filterObj[el.id] = el.selectedOptions[0].value;
    });
    filterObj[statusColumn] = filterObj.filterSelect;
    timeObj = {};
    loadedIndex = -1;
    customText.innerText = `Filtering Data`;
    customText.classList.add("loading")
    searchBtn.removeEventListener('click', runSearch);
    searchBtn.innerText = "Fetching Sheet Data";
    searchBtn.classList.add("loading");
    fetchTrackerData();
}
const searchBtn = document.querySelector(".searchBtn");
searchBtn.addEventListener('click', runSearch);

function fetchTrackerData() {
    fetchData(`/trackerall?id=${params.trackerId}&sheet=${params.sheetName}&name=${qcName}&col=${params.assignToColumn}`, {
        headers: {
            authorization: token
        }
    }).then(data => {
        if (data.ERROR) {
            window.location.href = 'login.html'
        }
        filteredDataArr = data;
        delete filterObj.filterSelect;
        delete filterObj["filter-copy"]
        let filterColumns = Object.keys(filterObj);
        let filterValues = Object.values(filterObj);
        let count = -1
        filterColumns.forEach(el => {
            count++;
            let filter = filterValues[count].toString();
            if (filter !== '') {
                if (filter == "Not Picked") {
                    filter = ''
                }
                filteredDataArr = filteredDataArr.filter(x => x[el.toString().toLowerCase().charCodeAt(0) - 97] == filter);
            }
        });
        let optionalPropsColumns
        if (params.optionalPropsColumn) {
            optionalPropsColumns = params.optionalPropsColumn.split(",");
        } else {
            optionalPropsColumns = null;
        }

        for (let x = 0; x < filteredDataArr.length; x++) {
            let optionPropsValueArr = [];
            if (optionalPropsColumns) {
                optionalPropsColumns.forEach(column => {
                    optionPropsValueArr.push(filteredDataArr[x][column.toString().toLowerCase().charCodeAt(0) - 97])
                })
            }

            filteredData.push({
                "row": filteredDataArr[x][filteredDataArr[x].length - 1] + 1,
                "nameInSheet": filteredDataArr[x][params["videoNameColumn"].charCodeAt(0) - 97],
                "verUploaded": filteredDataArr[x][params["verUploadedColumn"].charCodeAt(0) - 97],
                "verQCed": params["verQCedColumn"].charCodeAt(0) - 97 ? filteredDataArr[x][params["verQCedColumn"].charCodeAt(0) - 97] : "Column Not Specified",
                "qcStatus": filteredDataArr[x][params["qcStatusColumn"].charCodeAt(0) - 97],
                "URL": filteredDataArr[x][params["videoLinkColumn"].charCodeAt(0) - 97],
                "qcComment": filteredDataArr[x][params["qcCommentColumn"].charCodeAt(0) - 97],
                "parentURL": filteredDataArr[x][params["desiredDriveLocationColumn"].charCodeAt(0) - 97],
                "educatorFeedback": params["educatorFeedbackColumn"].charCodeAt(0) - 97 ? filteredDataArr[x][params["educatorFeedbackColumn"].charCodeAt(0) - 97] : "Column Not Specified",
                "educatorName": params["EducatorNameColumn"].charCodeAt(0) - 97 ? filteredDataArr[x][params["EducatorNameColumn"].charCodeAt(0) - 97] : "Column Not Specified",
                "optionalProps": optionPropsValueArr
            })

        }
        console.log(filteredData)
        loadNextBtn.classList.remove("hidden");
        loadPreBtn.classList.remove("hidden");
        resetCanvasBtn.classList.remove("hidden");
        info.classList.remove("hidden2");
        info.innerText = `Found ${filteredData.length} Matches!`
        loadNextPage()
    })

}

let submitRes = (e) => {
    let btn = e.target;
    let currVideoCard = e.target.parentElement.parentElement;
    let currShowVidBtn = currVideoCard.querySelector(".btnShowVid");
    if (currShowVidBtn.innerText == "Hide Video") {
        currShowVidBtn.click();
    }
    let row = currVideoCard.querySelector(".rowInSheet").querySelector(".videoCardPropValue").innerText;
    let comment = currVideoCard.querySelector(".comment_textarea").value;
    if (comment.toString().length < 2) {
        comment = "No Comments";
    }
    let currVidId = currVideoCard.querySelector(".id").querySelector(".videoCardPropValue").innerText;
    let status = currVideoCard.querySelector(".statusSelect").selectedOptions[0].value;
    let round = currVideoCard.querySelector(".roundSelect").selectedOptions[0].value;
    let optionalProps = currVideoCard.querySelector(".dynamic-props").querySelectorAll(".videoCardPropValue");
    let optionalPropsValues = [];
    let optionalPropsColumns = [];
    optionalProps.forEach(el => {
        if (el.value.toString().length > 0) {
            optionalPropsValues.push(el.value);
            optionalPropsColumns.push(el.id)
        }

    })
    let qcDuration = timeObj[currVidId]["duration"];
    let vidDuration = currVideoCard.querySelector(".duration").querySelector(".videoCardPropValue").innerText;
    if (vidDuration == "N/A") {
        vidDuration = "Not Fetched"
    }
    let newFiles = [];
    if (!timeObj[currVidId]["isDriveFetched"] || timeObj[currVidId]["isDriveFetched"] == 0) {
        currVideoCard.querySelector(".btnFetch").click();
    }
    if (timeObj[currVidId]["newFiles"]) {
        newFiles = timeObj[currVidId]["newFiles"];
    }
    if (isRoundMandatory == 1 ? (round && status) : (status)) {
        btn.innerText = "Submitting";
        btn.classList.add("loading");
        btn.removeEventListener('click', submitRes)
        fetchData('/trackerall', {
            method: "POST",
            headers: {
                authorization: token,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                row,
                status,
                round,
                comment,
                params,
                qcDuration,
                newFiles,
                currVidId,
                optionalPropsValues,
                optionalPropsColumns,
                vidDuration
            })
        }).then(x => {
            if (x.ERROR) {
                window.location.href = 'login.html'
            }
            timeObj[currVidId]["isQCed"] = 1;
            timeObj[currVidId]["status"] = status;
            timeObj[currVidId]["round"] = round;
            timeObj[currVidId]["comment"] = comment;
            btn.innerText = "Submitted";
            btn.classList.remove("loading");
            btn.addEventListener('click', submitRes)
            currVideoCard.classList.add("back-green")
        })
    } else {
        alert("Please fill all inputs.");
        return;
    }
}

async function fetchFromDrive(e) {
    let target = e.target;
    target.innerText = "Fetching";
    target.classList.add("loading");
    target.removeEventListener('click', fetchFromDrive)
    let currVideoCard = e.target.parentElement.parentElement;
    let currVidId = currVideoCard.querySelector(".id").querySelector(".videoCardPropValue").innerText;
    let currEducatorName = currVideoCard.querySelector(".educatorName").querySelector(".videoCardPropValue").innerText;
    let currNameInSheet = currVideoCard.querySelector(".nameInSheet").querySelector(".videoCardPropValue").innerText;
    let folderURL = currVideoCard.querySelector(".parentURL").querySelector(".videoCardPropValue").innerText;
    let objToFetch = {
        params,
        currVidId,
        educatorName: currEducatorName,
        nameInSheet: currNameInSheet,
        folderURL
    }
    let res = await fetchData('/fetchdrive', {
            method: "POST",
            headers: {
                authorization: token,
                "content-type": "application/json"
            },
            body: JSON.stringify(objToFetch)
        })
        // let res = await axios.post(urlToFetch, JSON.stringify(objToFetch));
    if (res.ERROR) {
        window.location.href = 'login.html'
    }
    target.classList.add("back-green-dark")
    timeObj[currVidId]["isDriveFetched"] = 1;
    timeObj[currVidId]["parentMatch"] = res["parentMatch"];
    timeObj[currVidId]["pathShouldBe"] = res["pathShouldBe"];
    timeObj[currVidId]["nameActual"] = res["nameActual"];
    if (res["parentMatch"] == 0) {
        currVideoCard.querySelector(".pathShouldBe").classList.remove("hidden")
        let pathShouldBe = currVideoCard.querySelector(".pathShouldBe").querySelector(".videoCardPropValue")
        pathShouldBe.innerText = res["pathShouldBe"];

    }

    if (res["newFiles"].length > 0 && res["newFiles"].length < 2) {
        timeObj[currVidId]["newFiles"] = res["newFiles"];
        currVideoCard.querySelector(".newFiles").classList.remove("hidden")
        let newFiles = currVideoCard.querySelector(".newFiles").querySelector(".videoCardPropValue")
        newFiles.innerText = `Found ${res["duplicateFounds"]} duplicate video(s) including 1 newer video.`;
        newFiles.classList.add("failed")
        newFiles.classList.remove("passed")
    } else if (res["newFiles"].length > 0) {
        timeObj[currVidId]["newFiles"] = res["newFiles"];
        currVideoCard.querySelector(".newFiles").classList.remove("hidden")
        let newFiles = currVideoCard.querySelector(".newFiles").querySelector(".videoCardPropValue")
        newFiles.innerText = `Found ${res["duplicateFounds"]} duplicate video(s) including ${res["newFiles"].length} newer videos.`;
        newFiles.classList.add("failed")
        newFiles.classList.remove("passed")
    }
    let nameActual = currVideoCard.querySelector(".nameActual").querySelector(".videoCardPropValue")
    nameActual.innerText = res["nameActual"];
    let videoSize = currVideoCard.querySelector(".videoSize").querySelector(".videoCardPropValue")
    videoSize.innerText = res["videoSize"];
    let format = currVideoCard.querySelector(".format").querySelector(".videoCardPropValue")
    format.innerText = res["format"];
    let owner = currVideoCard.querySelector(".owner").querySelector(".videoCardPropValue")
    owner.innerText = res["owner"];
    let dim = currVideoCard.querySelector(".dim").querySelector(".videoCardPropValue")
    dim.innerText = res["dim"];
    let duration = currVideoCard.querySelector(".duration").querySelector(".videoCardPropValue");
    duration.innerText = res["duration"];
    let pathActual = currVideoCard.querySelector(".pathActual").querySelector(".videoCardPropValue");
    pathActual.innerText = res["pathActual"];
    let pathShouldBe = currVideoCard.querySelector(".pathShouldBe").querySelector(".videoCardPropValue");
    pathShouldBe.innerText = res["pathShouldBe"];
    pathShouldBe.parentElement.click();
    nameActual.parentElement.click();
    if (res["nameActual"].toString().trim().match(/[0-9A-Za-z]*/)[0] == currNameInSheet.toString().trim().match(/[0-9A-Za-z]*/)[0]) {
        nameActual.classList.add("passed");
        nameActual.classList.remove("failed")
    } else {
        nameActual.classList.remove("passed");
        nameActual.classList.add("failed")
    }
    videoSize.parentElement.click();
    timeObj[currVidId]["videoSize"] = res["videoSize"];
    timeObj[currVidId]["sizeOkay"] = res["sizeOkay"];
    if (res["sizeOkay"] == 0) {
        videoSize.classList.remove("passed");
        videoSize.classList.add("failed")
    } else if (res["sizeOkay"] == 1) {
        videoSize.classList.add("passed");
        videoSize.classList.remove("failed")
    }
    format.parentElement.click();
    timeObj[currVidId]["format"] = res["format"];
    if (res["format"] == params.desiredVideoFormat) {
        format.classList.add("passed");
        format.classList.remove("failed")
    } else {
        format.classList.remove("passed");
        format.classList.add("failed")
    }
    owner.parentElement.click();
    timeObj[currVidId]["owner"] = res["owner"];
    timeObj[currVidId]["ownerOkay"] = res["ownerOkay"];
    if (res["ownerOkay"] == 0) {
        owner.classList.remove("passed");
        owner.classList.add("failed")
    } else if (res["ownerOkay"] == 1) {
        owner.classList.add("passed");
        owner.classList.remove("failed")
    }
    timeObj[currVidId]["dim"] = res["dim"];
    dim.parentElement.click();
    duration.parentElement.click();
    if (res["durationOkay"] == 0) {
        duration.classList.remove("passed");
        duration.classList.add("failed")
    } else if (res["durationOkay"] == 1) {
        duration.classList.add("passed");
        duration.classList.remove("failed")
    }
    pathActual.parentElement.click();
    if (res["parentMatch"] == 0) {
        pathActual.classList.remove("passed");
        pathActual.classList.add("failed")
    } else {
        pathActual.classList.add("passed");
        pathActual.classList.remove("failed")
    }
    pathShouldBe.parentElement.click();
    target.innerText = "Refresh Details";
    target.classList.remove("loading");
    target.addEventListener('click', fetchFromDrive);
    // if(currVideoCard.querySelectorAll(".failed").length > 0){
    //   currVideoCard.classList.add(".back-red");
    // }
    let notMatchedFields = [];
    currVideoCard.querySelectorAll(".failed").forEach((x) => {
        notMatchedFields.push(x.previousElementSibling.innerText.replace(":", ""));
    });
    if (notMatchedFields.length > 0) {
        currVideoCard.querySelector(".comment_textarea").value = `Found error in : ${notMatchedFields.join(", ")}, ${currVideoCard.querySelector(".comment_textarea").value}`
    }
}

document.querySelector(".btnLogout").addEventListener('click', () => {
    localStorage.setItem('accessToken', null);
    window.location.href = 'login.html'
})

window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 2000 || document.documentElement.scrollTop > 2000) {
        document.querySelector(".btnTop").classList.remove("hidden");
    } else {
        document.querySelector(".btnTop").classList.add("hidden");
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}
document.querySelector(".btnTop").addEventListener('click', topFunction);
document.querySelector(".btnSwitchTracker").addEventListener('click', () => {
    window.location.reload();
});