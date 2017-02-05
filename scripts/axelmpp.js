const remote = require('electron').remote;
const XMPP = require('stanza.io');

var client;

window.onload = () => {
    bindWindowButtons();
    bindSideNavListener();
    bindLatestMessagesListener();
    bindLoginListener();

    onSideNav("messages");
    openTab("tab-login");
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

function bindLoginListener() {
    id("loginButton").addEventListener("click", (ev) => {
        let username = id("loginUsername").value;
        let password = id("loginPassword").value;
        login(username, password);
        openTab("tab-messages");
    });
}

function login(username, password) {
    client = XMPP.createClient({
      "jid": `${username}@lserver.alite.am`,
      "password": password,
      "transport": "websocket",
      "wsURL": "ws://lserver.alite.am:5280/websocket"
    });

    client.on("session:started", () => {
        client.sendPresence();
    })

    client.on("chat", msg => {
        console.log(msg);
        putMessage(msg.body, false);
    })

    client.connect();
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

  let tabContainer = id("tabContainer");

  if(tabID == "tab-login") {
      id("navBar").style.display = "none";
      id("sideNav").classList.add("hidden")
      tabContainer.style.paddingLeft = "0";
      tabContainer.style.paddingTop = "32px";
  } else {
    id("navBar").style = "";
    id("sideNav").classList.remove("hidden")
    tabContainer.style = "";
  }
}

function putMessage(message, sent) {
    let cssClass = sent ? "sent-message" : "received-message";
    let convArea = id("conversationArea");
    let msgElement = document.createElement("div");
    msgElement.className = "chat-message";
    let textNode = document.createTextNode(message);
    msgElement.appendChild(textNode);

    if(convArea.lastElementChild.classList.contains(cssClass)) {
        convArea.lastElementChild.appendChild(msgElement);
    } else {
        let msgGroup = document.createElement("div");
        msgGroup.className = `message-group ${cssClass}`;
        msgGroup.appendChild(msgElement);
        convArea.appendChild(msgGroup);
    }
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
