let trades = JSON.parse(localStorage.getItem("trades")) || [];

const tbody = document.querySelector("#trades-table tbody");
const form = document.getElementById("trade-form");

const confidence = document.getElementById("confidence");
const confidenceVal = document.getElementById("confidenceVal");

confidence.oninput = () => confidenceVal.innerText = confidence.value;

// MODAL
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-image");
document.querySelector(".close").onclick = () => modal.style.display = "none";

function openImage(src) {
  modal.style.display = "block";
  modalImg.src = src;
}

// ADD TRADE
form.onsubmit = e => {
  e.preventDefault();
  const data = new FormData(form);
  const reader = new FileReader();

  const trade = {
    date: new Date().toISOString(),
    profitLoss: +data.get("profitLoss"),
    dailyGain: +data.get("dailyGain") || 0,
    strategy: data.get("strategy"),
    risk: +data.get("risk") || 0,
    platform: data.get("platform"),
    accountBalance: +data.get("accountBalance") || 0,
    confidence: +data.get("confidence"),
    emotion: +data.get("emotion"),
    screenshot: null
  };

  const file = data.get("screenshot");
  if (file && file.size > 0) {
    reader.onload = () => {
      trade.screenshot = reader.result;
      saveTrade(trade);
    };
    reader.readAsDataURL(file);
  } else saveTrade(trade);
};

function saveTrade(trade) {
  trades.push(trade);
  localStorage.setItem("trades", JSON.stringify(trades));
  form.reset();
  render();
}

// DELETE
function deleteTrade(i) {
  if (!confirm("Delete trade?")) return;
  trades.splice(i,1);
  localStorage.setItem("trades", JSON.stringify(trades));
  render();
}

// RENDER
function render() {
  tbody.innerHTML = "";
  trades.forEach((t,i) => {
    const tr = tbody.insertRow();
    tr.insertCell().innerText = new Date(t.date).toLocaleDateString();

    const pl = tr.insertCell();
    pl.innerText = t.profitLoss.toFixed(2);
    pl.className = t.profitLoss >= 0 ? "profit" : "loss";

    tr.insertCell().innerText = t.accountBalance.toFixed(2);
    tr.insertCell().innerText = t.accountBalance ? ((t.profitLoss/t.accountBalance)*100).toFixed(2)+"%" : "0%";
    tr.insertCell().innerText = t.risk;
    tr.insertCell().innerText = t.strategy;
    tr.insertCell().innerText = t.platform;
    tr.insertCell().innerText = t.confidence;
    tr.insertCell().innerText = t.emotion;

    const imgCell = tr.insertCell();
    if (t.screenshot) {
      const img = document.createElement("img");
      img.src = t.screenshot;
      img.onclick = () => openImage(t.screenshot);
      imgCell.appendChild(img);
    }

    const act = tr.insertCell();
    const del = document.createElement("button");
    del.innerText = "Delete";
    del.onclick = () => deleteTrade(i);
    act.appendChild(del);
  });

  updateCharts();
}

render();
