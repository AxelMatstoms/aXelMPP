const remote = require('electron').remote;

window.onload = () => {
    bindWindowButtons();
    bindSideNavListener();
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
      let mdIcon = maxBtn.firstElementChild;
        if (win.isMaximized()) {
            win.unmaximize();
            mdIcon.innerHTML = "fullscreen";
        } else {
            win.maximize();
            mdIcon.innerHTML = "fullscreen_exit"
        }
    });

    closeBtn.addEventListener("click", (ev) => {
        win.close();
    });
}

function bindSideNavListener() {
    let sideNav = id("sideNav");
    sideNav.addEventListener("click", (ev) => {
        let target = ev.target;
        let tID = target.id;
        if(tID != "sideNav") {
            console.log(tID);
        }
    });
}

function id(findID) {
    return document.getElementById(findID);
}

function cssSelect(selector) {
    return document.querySelect(selector);
}

function cssSelectAll(selector) {
    return document.querySelectAll(selector);
}

function classSelect(classname) {
    return document.getElementsByClassName(classname);
}
