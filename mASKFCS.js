function runSimulation() {
    // Fetch input values from the form
    let initialAmount = parseFloat(document.getElementById('initialAmount').value);
    let initialProfit = parseFloat(document.getElementById('initialProfit').value);
    let initialWinrate = parseFloat(document.getElementById('initialWinrate').value);
    let loss = parseFloat(document.getElementById('loss').value);
    let amountSplitNumber = parseInt(document.getElementById('amountSplitNumber').value);
    let profitIncreamentNumber = parseFloat(document.getElementById('profitIncreamentNumber').value);
    let winrateDecrementNumber = parseFloat(document.getElementById('winrateDecrementNumber').value);
    let selectedStrategy = document.getElementById("strategySelector").value;
    let targetAmount = parseFloat(document.getElementById("targetAmount").value);
    let iteration = parseInt(document.getElementById('iteration').value);

    let profit = [];
    let winRate = [];
    let trade = [];
    let tradeOutput = [];
    let kellyFractionAmountArray = [];
    let beforeTradeAmount = [];

    // Initialize profit and winRate lists
    for (let k = 0; k < amountSplitNumber; k++) {
      if (k === 0) {
        profit.push(initialProfit);
        winRate.push(initialWinrate);
      } else {
        profit.push(profit[k - 1] + profitIncreamentNumber);
        winRate.push(winRate[k - 1] - winrateDecrementNumber);
      }
    }
    
    // Convert percentages to decimals
    let B =(initialProfit) / loss;
    let Q = (100 - initialWinrate) / 100;
  
    // Calculate the Kelly fraction
    let kellyFraction = (((B * (initialWinrate / 100)) - Q) / B);
  
    let balance = initialAmount;
    let c = 0;
    if (selectedStrategy === "Iteration") {
      for (let i = 0; i < iteration; i++) {
        let tradeOutputString = "";
        let kellyFractionAmount = balance * kellyFraction;
        let tradeAmount = kellyFractionAmount / amountSplitNumber;
        balance -= (amountSplitNumber * tradeAmount);
    
        for (let j = 0; j < amountSplitNumber; j++) {
          if (Math.random() < winRate[j] / 100) {  // Convert winRate to decimal
            balance += tradeAmount + tradeAmount * (profit[j] / 100);
            tradeOutputString += "W"  // Convert profit to decimal
          } else {
            if (j === 0) {
              balance += (amountSplitNumber - j) * (tradeAmount - (tradeAmount * (loss / 100)));
              
            } else {
              balance += (amountSplitNumber - j) * (tradeAmount + (tradeAmount * (profit[j - 1] / 100)));
            }
            {tradeOutputString +=(amountSplitNumber - j)+ "R"}
            break;
          }
        }
        
        let kellyFractionAfterAmount = balance * kellyFraction;
        beforeTradeAmount.push(tradeAmount);
        trade.push(balance);
        tradeOutput.push(tradeOutputString);
        kellyFractionAmountArray.push(kellyFractionAfterAmount)

        c++;
      }
  } else if (selectedStrategy === "TargetAmount") {
    while (balance <= targetAmount) {
      let tradeOutputString = "";
      let kellyFractionAmount = balance * kellyFraction;
      let tradeAmount = kellyFractionAmount / amountSplitNumber;
      balance -= (amountSplitNumber * tradeAmount);
  
      for (let j = 0; j < amountSplitNumber; j++) {
        if (Math.random() < winRate[j] / 100) {  // Convert winRate to decimal
          balance += tradeAmount + tradeAmount * (profit[j] / 100);
          tradeOutputString += "W"  // Convert profit to decimal
        } else {
          if (j === 0) {
            balance += (amountSplitNumber - j) * (tradeAmount - (tradeAmount * (loss / 100)));
            
          } else {
            balance += (amountSplitNumber - j) * (tradeAmount + (tradeAmount * (profit[j - 1] / 100)));
          }
          {tradeOutputString +=(amountSplitNumber - j)+ "R"}
          break;
        }
      }
      
      let kellyFractionAfterAmount = balance * kellyFraction;
      beforeTradeAmount.push(tradeAmount);
      trade.push(balance);
      tradeOutput.push(tradeOutputString);
      kellyFractionAmountArray.push(kellyFractionAfterAmount)

      c++;

    }
  }

    
  
    // Display summary, table, and chart
    displaySummary(kellyFraction, c , balance);
    displayTable(c, beforeTradeAmount, trade, tradeOutput, kellyFractionAmountArray);
    displayChart(c, initialAmount, trade);
  }
  
  function displaySummary(kellyFraction, lastIteration, lastBalance) {
    let summaryElement = document.getElementById('summary');
    summaryElement.innerHTML = `<p><strong>Kelly Fraction:</strong> ${kellyFraction.toFixed(2)}</p>
                                <p><strong>Iteration Number of the last row:</strong> ${lastIteration}</p>
                                <p><strong>Balance of the last row:</strong> ${lastBalance.toFixed(2)}</p>`;
  }
  
  function displayTable(iteration, beforeTradeAmount, trade, tradeOutput, kellyFractionAmountArray) {
    let tableBody = document.getElementById('simulationTableBody');
    tableBody.innerHTML = '';
  
    for (let i = 0; i < iteration; i++) {
      // Check if the array has an element at index i before accessing it
      let beforeTradeAmountValue = beforeTradeAmount[i] ? beforeTradeAmount[i].toFixed(2) : '';
      
      tableBody.innerHTML += `<tr>
                                <td>${i + 1}</td>
                                <td>${beforeTradeAmountValue}</td>
                                <td>${tradeOutput[i]}</td>
                                <td>${trade[i].toFixed(2)}</td>
                                <td>${kellyFractionAmountArray[i].toFixed(2)}</td>
                              </tr>`;
  }
  
  }
  
  let balanceChart;

  function displayChart(iteration, initialAmount, trade) {
    let ctx = document.getElementById("chart").getContext('2d');
  
    if (!balanceChart) {
      // If the chart doesn't exist, create a new chart
      balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: iteration }, (_, i) => i + 1),
          datasets: [{
            label: 'Balance Across Iterations',
            data: [initialAmount, ...trade], // Include initial amount in the data array
            borderColor: 'rgba(75, 192, 192, 1)',
            pointRadius: window.innerWidth < 600 ? 0 : 5,
            pointHoverRadius: window.innerWidth < 600 ? 0 : 8,
            borderWidth: 2,
            fill: false,
          }]
        },
        options: {
          scales: {
            x: {
              type: 'linear',
              position: 'bottom'
            },
            y: {
              type: 'linear',
              position: 'left'
            }
          }
        }
      });
    } else {
      // If the chart already exists, update its data
      balanceChart.data.labels = Array.from({ length: iteration }, (_, i) => i + 1);
      balanceChart.data.datasets[0].data = [initialAmount, ...trade];
      balanceChart.update(); // Update the chart
    }
  }
  
  document.getElementById("strategySelector").addEventListener("change", function () {
    const selectedValue = document.getElementById("strategySelector").value;
  
    if (selectedValue === "Iteration") {
        document.getElementById("iteration").disabled = false;
        document.getElementById("targetAmount").disabled = true;
    } else if (selectedValue === "TargetAmount") {
        document.getElementById("iteration").disabled = true;
        document.getElementById("targetAmount").disabled = false;
    }
  });
  