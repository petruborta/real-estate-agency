/*=====================================
bindings
=====================================*/
const responses = [
  "What can I help you with?",
  "One moment, please!",
  "Can you elaborate your question a little bit more, please?",
  "Glad I could help you!",
  "Sorry, I don't have an asnwer for this."
];

const mainBar = document.querySelector(".header-main-bar");
const mainNav = document.querySelector(".header-main-nav");
const headerAccountButton = document.querySelector(".header-account");
const headerChatButton = document.querySelector(".header-chat");
const menuButton = document.querySelector(".header-menu-btn");

const accountTooltip = document.querySelector(".account-tooltip");
const accountTooltipSignUpButton = document.querySelector(".signup-btn");
const accountTooltipSignInButton = document.querySelector(".signin-btn");
const signUpForm = document.querySelector(".signup-form");
const signInForm = document.querySelector(".signin-form");

const chat = document.querySelector(".chat-container");
const chatMessages = document.querySelector(".chat-messages");
const chatUserInput = document.querySelector(".user-input");
const sendMessageButton = document.querySelector(".send-message-btn");

const exploreButton = document.querySelector(".explore-btn");

const guideLinks = document.querySelectorAll(".guide-link");

const moreMarketsButton = document.querySelector(".more-markets-btn");
const moreStatesButton = document.querySelector(".more-states-btn");

/*=====================================
event listeners
=====================================*/
signUpForm.querySelector(".close-form").onclick = hideSignupForm;
signUpForm.querySelector(".cancel-btn").onclick = hideSignupForm;
signUpForm.querySelector(".log-in").addEventListener("click", hideSignupForm);
signUpForm.querySelector(".log-in").addEventListener("click",showSigninForm);

signInForm.querySelector(".close-form").onclick = hideSigninForm;
signInForm.querySelector(".cancel-btn").onclick = hideSigninForm;

chat.querySelector(".close-chat").onclick = closeChat;

moreMarketsButton.addEventListener("click", () => {
  changeButtonText(moreMarketsButton);
});
moreStatesButton.addEventListener("click", () => {
  changeButtonText(moreStatesButton);
});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.onclick = (event) => {
  if (event.target != headerAccountButton && accountTooltip.classList.contains("visible")) {
    accountTooltip.classList.remove("visible");
  }
  if (event.target == signUpForm) {
    signUpForm.style.display = "none";
  }
  if (event.target == signInForm) {
    signInForm.style.display = "none";
  }
}

window.onresize = () => {
  if (window.innerWidth >= 1024 && mainNav.classList.contains("visible")) {
    mainNav.classList.remove("visible");
    menuButton.classList.remove("open");
  }
}

/*=====================================
header functions
=====================================*/
menuButton.addEventListener("click", () => {
  menuButton.classList.toggle("open");
  mainNav.classList.toggle("visible");
});

if (exploreButton != null) {
  exploreButton.addEventListener("click", () => {
    document.querySelector('.main-page').scrollIntoView({ 
      behavior: 'smooth' 
    });
  }); 
}

headerAccountButton.addEventListener("click", () => {
  accountTooltip.classList.toggle("visible")
});

function showSignupForm() {
  signUpForm.firstElementChild.classList.remove("zoom-out");
  signUpForm.style.display="block";
}

function hideSignupForm() {
  signUpForm.firstElementChild.classList.add("zoom-out");
  setTimeout(() => { 
    signUpForm.style.display="none"; 
  }, 300);
}

accountTooltipSignUpButton.addEventListener("click", () => {
  showSignupForm();
});

function showSigninForm() {
  signInForm.firstElementChild.classList.remove("zoom-out");
  signInForm.style.display = "block";
}

function hideSigninForm() {
  signInForm.firstElementChild.classList.add("zoom-out");
  setTimeout(() => { 
    signInForm.style.display="none"; 
  }, 300);
}

accountTooltipSignInButton.addEventListener("click", () => {
  showSigninForm();
});

headerChatButton.addEventListener("click", () => {
  chat.classList.toggle("visible");
});

function closeChat() {
  chat.classList.remove("visible");
}

function getUserInputValue() {
  return chatUserInput.value;
}

function clearUserInput() {
  chatUserInput.value = "";
}

function createMessage() {
  let userInput = getUserInputValue();
  if (!userInput) {
    return null;
  }

  let newMessage = document.createElement("p");
  newMessage.classList.add("message");
  newMessage.innerText = userInput;

  return newMessage;
}

function createResponse() {
  let newResponse = document.createElement("p");
  newResponse.classList.add("response", "message");
  newResponse.innerText = responses[Math.floor(Math.random() * 5)];

  return newResponse;
}

function addMessage(message) {
  chatMessages.append(message);
}

function scrollToChatBottom() {
  chatMessages.scrollTo(0, chatMessages.scrollHeight);
}

function sendMessage() {
  let message = createMessage();
  if (message == null) {
    return false;
  }

  addMessage(message);
  clearUserInput();
  scrollToChatBottom();

  return true;
}

function sendResponse() {
  let response = createResponse();
  addMessage(response);
  scrollToChatBottom();
}

sendMessageButton.addEventListener("click", () => {
  if (sendMessage()) {
    setTimeout(() => {
      sendResponse();
    }, 500);
  }
});

/*=====================================
main page functions
=====================================*/
function headerIsInViewport() {
  const rect = document.querySelector(".site-header").getBoundingClientRect();
  return (
    rect.height + rect.top  >= 110
  );
}

function mainPageIsInViewport() {
  const rect = document.querySelector(".main-page").getBoundingClientRect();
  return (
    window.innerHeight - rect.top  <= 25
  );
}

document.addEventListener("scroll", () => {
  mainBar.style.opacity = (!headerIsInViewport()) ? "0" : "1";
  if (exploreButton != null) {
    exploreButton.style.opacity = (!mainPageIsInViewport()) ? "0" : "1";
    exploreButton.style.pointerEvents = (!mainPageIsInViewport()) ? "none" : "all";
  }
});

/*=====================================
guides section functions
=====================================*/
guideLinks.forEach(guideLink => {
  guideLink.addEventListener("mouseenter", () => {
    let guideName = guideLink.classList[1];
    let guidesImgContainer = document.querySelector(".guides-img-container");
    let bgURL = `url(images/${guideName}-bg-sm.jpg)`;
    
    if (guidesImgContainer.style.backgroundImage == bgURL) {
      return;
    }

    if (guideName == "sell") {
      guidesImgContainer.style.backgroundPosition = "75%";
    } else {
      guidesImgContainer.style.backgroundPosition = "center";
    }

    guidesImgContainer.style.backgroundImage = bgURL;
  });
});

/*=====================================
footer functions
=====================================*/
function expandList(element) {
  element.classList.toggle("expanded");
}

function changeButtonText(button) {
  if (button.innerText == "Show more") {
    button.innerText = "Show less";
  } else {
    button.innerText = "Show more";
  }
}

moreMarketsButton.addEventListener("click", () => {
  expandList(document.querySelector(".popular-markets-ul"));
});

moreStatesButton.addEventListener("click", () => {
  expandList(document.querySelector(".popular-states-ul"));
});
