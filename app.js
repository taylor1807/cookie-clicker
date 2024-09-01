console.log("test");

let cookieCount = 0;
let cookiesPerSecond = 1;
let soundEnabled = true;

const cookieCountDisplay = document.getElementById("cookieCount");
const cookiePerSecondDisplay = document.getElementById("cookiesPerSecond");
const cookie = document.getElementById("cookie");
const shopUpgrade = document.getElementById("shopUpgrade");
const clickSound = document.getElementById("clickSound");
const upgradeSound = document.getElementById("upgradeSound");

function load() {
  const savedCookieCount = localStorage.getItem("cookieCount");
  const savedCookiesPerSecond = localStorage.getItem("cookiesPerSecond");
  const savedSoundEnabled = localStorage.getItem("soundEnabled");

  if (savedCookieCount !== null) {
    cookieCount = JSON.parse(savedCookieCount);
  }
  if (savedCookiesPerSecond !== null) {
    cookiesPerSecond = JSON.parse(savedCookiesPerSecond);
  }
  if (savedSoundEnabled !== null) {
    soundEnabled = JSON.parse(savedSoundEnabled);
  }
  updateUI();
}

function save() {
  localStorage.setItem("cookieCount", cookieCount);
  localStorage.setItem("cookiesPerSecond", cookiesPerSecond);
  localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
}

load();
updateUI();

cookie.addEventListener("click", function () {
  cookieCount++;
  save();
  updateUI();
  if (soundEnabled) clickSound.play();
  cookie.classList.toggle("clicked");
  setTimeout(function () {
    cookie.classList.remove("clicked");
  }, 1000);
});

function updateUI() {
  cookieCountDisplay.innerText = cookieCount;
  cookiePerSecondDisplay.innerText = cookiesPerSecond;
}

function update() {
  cookieCount += cookiesPerSecond;
  // console.log(cookieCount);
  updateUI();
  save();
}

setInterval(update, 1000);

function createElements(resource) {
  const shopUpgrades = document.createElement("div");
  shopUpgrades.classList.add("shopUpgrades");

  const name = document.createElement("h3");
  name.classList.add("name");
  name.textContent = resource.name;

  const cost = document.createElement("p");
  cost.classList.add("cost");
  cost.textContent = `Cost: ${resource.cost}`;

  const increase = document.createElement("p");
  increase.classList.add("increase");
  increase.textContent = `+${resource.increase} PPS`;

  const buyButton = document.createElement("button");
  buyButton.classList.add("button");
  buyButton.textContent = "Buy";

  shopUpgrades.appendChild(name);
  shopUpgrades.appendChild(cost);
  shopUpgrades.appendChild(increase);
  shopUpgrades.appendChild(buyButton);
  document.getElementById("shop").appendChild(shopUpgrades);

  buyButton.addEventListener("click", function () {
    if (cookieCount >= resource.cost) {
      cookieCount -= resource.cost;
      cookiesPerSecond += resource.increase;
      resource.cost = Math.round(resource.cost * 1.25);
      cost.textContent = `cost:${resource.cost}`;
      updateUI();
      if (soundEnabled) upgradeSound.play();
    } else {
      let shortage = resource.cost - cookieCount;
      alert(`Not enough Potatoes, gather ${shortage} potatoes and try again`);
    }
  });
}

async function fetchUpgrades() {
  const resource = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  const cookieUpgrade = await resource.json();
  cookieUpgrade.forEach(function (resource) {
    createElements(resource);
  });
}
fetchUpgrades();

function createOptionsMenu() {
  const menu = document.createElement("div");
  menu.id = "optionsMenu";
  menu.innerHTML = `
      <h3>Options</h3>
      <label>
          <input type="checkbox" id="toggleSound" ${
            soundEnabled ? "checked" : ""
          }>
          Sound Effects
      </label>
      <button  class= "button" id="resetButton">Reset Progress</button>
  `;
  document.body.appendChild(menu);

  document
    .getElementById("toggleSound")
    .addEventListener("change", toggleSound);

  document
    .getElementById("resetButton")
    .addEventListener("click", resetProgress);
}
createOptionsMenu();

function resetProgress() {
  cookieCount = 0;
  cookiesPerSecond = 1;
  soundEnabled = true;

  localStorage.removeItem("cookieCount");
  localStorage.removeItem("cookiesPerSecond");
  localStorage.removeItem("soundEnabled");

  updateUI();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
}
