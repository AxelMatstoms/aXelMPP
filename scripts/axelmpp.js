const remote = require('electron').remote;

window.onload = () => {
    bindWindowButtons();
    bindSideNavListener();
    bindLatestMessagesListener();

    onSideNav("messages");
}

function bindWindowButtons() {
    let minBtn = id("minimize-button");
    let maxBtn = id("maximize-button");
    let closeBtn = id("close-button");

    let win = remote.getCurrentWindow();

    minBtn.addEventListener("click", (ev) => {
        win.minimize();
    });

    maxBtn.addEventListener("click", (ev) => {
      let use = maxBtn.getElementsByTagName("use")[0];
        if (win.isMaximized()) {
            win.unmaximize();
            use.setAttribute("xlink:href", "#ic-maximize")
        } else {
            win.maximize();
            use.setAttribute("xlink:href", "#ic-unmaximize")
        }
    });

    closeBtn.addEventListener("click", (ev) => {
        win.close();
    });
}

function bindSideNavListener() {
    let sideNav = id("sideNav");
    sideNav.addEventListener("click", (ev) => {
        onSideNav(ev.target.id);
    });
}

function bindLatestMessagesListener() {
    cssSelectAll(".message-latest").forEach(el => {
        el.addEventListener("click", ev => {
            openTab("tab-chat");
        });
    });
}

function onSideNav(tID) {
    let target = id(tID);
    if(tID != "sideNav") {
        cssSelectAll(`.nav-item:not(#${tID})`).forEach(el => {
            el.classList.remove("nav-item--active")
        });
        target.classList.add("nav-item--active");
        let tabID = `tab-${tID}`;
        openTab(tabID);
        console.log(`#${tID} .nav-item__text`);
        classSelect("app-bar-title")[0].innerHTML=cssSelect(`#${tID} .nav-item__text`).innerHTML;
    }
}

function openTab(tabID) {
  id(tabID).style.display = "block";
  cssSelectAll(`.tab:not(#${tabID})`).forEach(el => {
      el.style.display = "";
  });
}

function id(findID) {
    return document.getElementById(findID);
}

function cssSelect(selector) {
    return document.querySelector(selector);
}

function cssSelectAll(selector) {
    return document.querySelectorAll(selector);
}

function classSelect(classname) {
    return document.getElementsByClassName(classname);
}
