console.log("Content script injected");

const floatingButton = document.createElement("button");
floatingButton.textContent = "SPAT Notes";
floatingButton.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
`;

floatingButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "openPopup" });
});

document.body.appendChild(floatingButton);