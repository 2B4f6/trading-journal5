const trades = JSON.parse(localStorage.getItem("trades")) || [];

const wins = trades.filter(t => t.profitLoss > 0);
const losses = trades.filter(t => t.profitLoss < 0);

new Chart(document.getElementById("winLoss"), {
  type: "pie",
  data: {
    labels: ["Wins", "Losses"],
    datasets: [{ data: [wins.length, losses.length], backgroundColor: ["green","red"] }]
  }
});

const avgReward = wins.length ? wins.reduce((a,b)=>a+b.profitLoss,0)/wins.length : 0;
const avgRisk = losses.length ? Math.abs(losses.reduce((a,b)=>a+b.profitLoss,0)/losses.length) : 0;

new Chart(document.getElementById("avgRiskReward"), {
  type: "pie",
  data: {
    labels: ["Avg Reward ($)", "Avg Risk ($)"],
    datasets: [{ data: [avgReward, avgRisk], backgroundColor: ["#22c55e","#ef4444"] }]
  }
});
