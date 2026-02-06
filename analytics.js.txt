const trades = JSON.parse(localStorage.getItem("trades")) || [];

/* ---------- HELPERS ---------- */
function getR(trade) {
  if (!trade.risk || trade.risk === 0) return null;
  return trade.profitLoss / trade.risk;
}

/* ---------- PREP DATA ---------- */
const rTrades = trades
  .map(t => ({ ...t, R: getR(t) }))
  .filter(t => t.R !== null && t.R !== Infinity && !isNaN(t.R));

const wins = rTrades.filter(t => t.R > 0);
const losses = rTrades.filter(t => t.R < 0);

const totalTrades = wins.length + losses.length;

/* ---------- CORE METRICS ---------- */
const winRate = totalTrades ? (wins.length / totalTrades) : 0;

const avgWinR = wins.length
  ? wins.reduce((a,b)=>a+b.R,0) / wins.length
  : 0;

const avgLossR = losses.length
  ? Math.abs(losses.reduce((a,b)=>a+b.R,0) / losses.length)
  : 0;

const expectancy =
  (winRate * avgWinR) -
  ((1 - winRate) * avgLossR);

const sumWinR = wins.reduce((a,b)=>a+b.R,0);
const sumLossR = Math.abs(losses.reduce((a,b)=>a+b.R,0));

const profitFactor = sumLossR ? (sumWinR / sumLossR) : Infinity;

/* ---------- UPDATE UI ---------- */
document.getElementById("totalTrades").innerText = totalTrades;
document.getElementById("winRate").innerText = (winRate * 100).toFixed(1) + "%";
document.getElementById("expectancy").innerText = expectancy.toFixed(2) + "R";
document.getElementById("profitFactor").innerText =
  profitFactor === Infinity ? "∞" : profitFactor.toFixed(2);
document.getElementById("avgWin").innerText = avgWinR.toFixed(2) + "R";
document.getElementById("avgLoss").innerText = "-" + avgLossR.toFixed(2) + "R";

/* ---------- EQUITY CURVE (R-BASED) ---------- */
let cumulativeR = 0;
const equity = [];
const labels = [];

rTrades
  .sort((a,b)=>new Date(a.date)-new Date(b.date))
  .forEach(t => {
    cumulativeR += t.R;
    equity.push(cumulativeR);
    labels.push(new Date(t.date).toLocaleDateString());
  });

new Chart(document.getElementById("equityChart"), {
  type: "line",
  data: {
    labels,
    datasets: [{
      label: "Cumulative R",
      data: equity,
      borderWidth: 2,
      tension: 0.3
    }]
  },
  options: {
    plugins: {
      legend: { display: false }
    }
  }
});
