document.getElementById("shipmentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const priority = document.getElementById("priority").value;

  // Dummy values — you can connect APIs later
  const modes = [
    { mode: "Air", cost: 50000, time: 2, co2: 980 },
    { mode: "Sea", cost: 12000, time: 25, co2: 130 },
    { mode: "Road", cost: 22000, time: 7, co2: 500 },
  ];

  const scores = modes.map(option => {
    let weightings = { cost: 0.33, co2: 0.33, time: 0.33 };

    if (priority === "cost") weightings = { cost: 0.6, co2: 0.2, time: 0.2 };
    if (priority === "co2")  weightings = { co2: 0.6, cost: 0.2, time: 0.2 };
    if (priority === "time") weightings = { time: 0.6, co2: 0.2, cost: 0.2 };

    const normalize = (value, max) => 1 - value / max;

    const score =
      normalize(option.cost, 50000) * weightings.cost +
      normalize(option.co2, 980) * weightings.co2 +
      normalize(option.time, 25) * weightings.time;

    return { ...option, score: score.toFixed(2) };
  });

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];
  const secondBest = scores[1];
  const confidence = ((best.score - secondBest.score) * 100).toFixed(0);

  document.getElementById("output").innerHTML = `
    <h2>🚚 Agent Recommendation</h2>
    <p><strong>Mode Selected:</strong> ${best.mode}</p>
    <p><strong>Confidence:</strong> ${confidence}%</p>
    <p><strong>Reasoning:</strong> Based on your priority, ${best.mode} has the best trade-off between CO₂, cost, and time.</p>
    <p>📤 Action Taken: Plan sent to <strong>DMS</strong> for execution.</p>

    <h3>📊 Comparison Table</h3>
    <table border="1">
      <tr><th>Mode</th><th>Cost (₹)</th><th>Time (days)</th><th>CO₂ (kg)</th><th>Score</th></tr>
      ${scores.map(s => `<tr>
        <td>${s.mode}</td>
        <td>${s.cost}</td>
        <td>${s.time}</td>
        <td>${s.co2}</td>
        <td>${s.score}</td>
      </tr>`).join("")}
    </table>
  `;
});
