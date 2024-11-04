console.log("loader.js");
let slowLoadingIcon = null;

loadOnSlowConnection();

document.addEventListener("DOMContentLoaded", function () {
  const loaderFrame = document.querySelector(".loader-frame");
  const loaderBackground = document.querySelector(".loader");

  if (loaderFrame) {
    let divs = loaderFrame.querySelectorAll("div");
    let totalWidth = loaderFrame.offsetWidth;
    const screenWidth = window.innerWidth;

    while (totalWidth < screenWidth * 1.5) {
      divs.forEach((div) => {
        const newDiv = div.cloneNode(true);
        loaderFrame.appendChild(newDiv);
      });
      divs = loaderFrame.querySelectorAll("div");
      totalWidth = loaderFrame.offsetWidth;
    }

    loaderBackground.style.backgroundColor = "transparent";

    divs.forEach((div, index) => {
      div.id = `unique-id-${index + 1}`;
      setTimeout(() => {
        div.style.transition = "opacity 0.5s";
        div.style.opacity = "0";
      }, index * 100);
    });
  }
});

function loadOnSlowConnection() {
  if (navigator.connection) {
    const connection = navigator.connection;
    const slowConnections = ["slow-2g", "2g", "3g"];
    if (slowConnections.includes(connection.effectiveType)) {
      showSlowConnectionMessage();
      showSlowLoadingIcon();
    }
  } else {
    // Fallback if the page takes longer than 5 seconds to load
    setTimeout(() => {
      if (document.readyState !== "complete") {
        console.log("Page is taking longer than 2 seconds to load");
        showSlowLoadingMessage();
        showSlowLoadingIcon();
      }
    }, 5000);
  }

  document.addEventListener("DOMContentLoaded", hideSlowLoadingElements);
}

function showSlowConnectionMessage() {
  console.log("Loading on slow connection");
  const slowConnectionMessage = document.createElement("div");
  slowConnectionMessage.id = "slow-connection-message";
  slowConnectionMessage.textContent =
    "You are on a slow connection. Please be patient.";
  styleMessage(slowConnectionMessage);
  try {
    document.write(slowConnectionMessage.outerHTML);
  } catch (error) {
    console.error("Error writing slow connection message to document:", error);
    document.body.appendChild(slowConnectionMessage);
  }
}

function showSlowLoadingMessage() {
  const slowLoadingMessage = document.createElement("div");
  slowLoadingMessage.id = "slow-loading-message";
  slowLoadingMessage.textContent =
    "The page is taking longer than expected to load. Please be patient.";
  styleMessage(slowLoadingMessage);
  document.body.appendChild(slowLoadingMessage);
}
function showSlowLoadingIcon() {
  slowLoadingIcon = document.createElement("div");
  slowLoadingIcon.classList.add("preload-icon-wrapper");
  slowLoadingIcon.id = "slow-loading-icon";
  slowLoadingIcon.style.opacity = "100";
  slowLoadingIcon.style.transition = "opacity 0.5s";
  slowLoadingIcon.style.position = "absolute";
  slowLoadingIcon.style.left = "0%";
  slowLoadingIcon.style.top = "0%";
  slowLoadingIcon.style.right = "0%";
  slowLoadingIcon.style.bottom = "0%";
  slowLoadingIcon.style.zIndex = "999";
  slowLoadingIcon.style.display = "flex";
  slowLoadingIcon.style.justifyContent = "center";
  slowLoadingIcon.style.alignItems = "center";

  const svgContainer = document.createElement("div");
  svgContainer.style.width = "100%";
  svgContainer.style.height = "10vh";
  svgContainer.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 83 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.851562 200L12.2737 94.7368H24.3678L35.79 200H0.851562Z" fill="#fff"></path>
      <path d="M47.884 200L59.3062 94.7368H71.4003L82.8224 200H47.884Z" fill="#fff"></path>
      <path d="M35.6271 94.7368L24.2049 0H59.1433L47.7211 94.7368H35.6271Z" fill="#fff"></path>
    </svg>
  `;

  slowLoadingIcon.appendChild(svgContainer);

  if (document.readyState !== "complete") {
    try {
      document.body.appendChild(slowLoadingIcon);
    } catch (error) {
      console.error("Error appending slow loading icon to document:", error);
    }
  }
}

function styleMessage(messageElement) {
  messageElement.style.position = "fixed";
  messageElement.style.top = "10px";
  messageElement.style.left = "50%";
  messageElement.style.transform = "translateX(-50%)";
  messageElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  messageElement.style.color = "white";
  messageElement.style.padding = "10px";
  messageElement.style.borderRadius = "5px";
  messageElement.style.zIndex = "9999";
}

function hideSlowLoadingElements() {
  const slowConnectionMessage = document.getElementById(
    "slow-connection-message"
  );
  if (slowConnectionMessage) {
    slowConnectionMessage.style.display = "none";
  }
  const slowLoadingMessage = document.getElementById("slow-loading-message");
  if (slowLoadingMessage) {
    slowLoadingMessage.style.display = "none";
  }
  if (slowLoadingIcon !== null) {
    console.log("Hiding slow loading icon");
    slowLoadingIcon.style.opacity = "0";
  }
}
