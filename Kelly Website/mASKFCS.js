function calculateTradingStrategy() {
  var initialAmountInput = document.getElementById('initialAmount');
  var targetAmountInput = document.getElementById('targetAmount');
  var firstProfitInput = document.getElementById('firstProfit');
  var secondProfitInput = document.getElementById('secondProfit');
  var thirdProfitInput = document.getElementById('thirdProfit');
  var firstWinRateInput = document.getElementById('firstWinRate');
  var secondWinRateInput = document.getElementById('secondWinRate');
  var thirdWinRateInput = document.getElementById('thirdWinRate');
  var lossInput = document.getElementById('lossPercentage');
  var resultElement = document.getElementById('result');
  var tableElement = document.getElementById('table');
  var chartElement = document.getElementById('chart');
  var selectedStrategy = document.getElementById("strategySelector").value;
  var iterations = parseInt(document.getElementById("iterations").value);

  var initialAmount = parseFloat(initialAmountInput.value);
  var firstProfit = parseFloat(firstProfitInput.value) / 100;
  var secondProfit = parseFloat(secondProfitInput.value) / 100;
  var thirdProfit = parseFloat(thirdProfitInput.value) / 100;
  var firstWinRate = parseFloat(firstWinRateInput.value) / 100;
  var secondWinRate = parseFloat(secondWinRateInput.value) / 100;
  var thirdWinRate = parseFloat(thirdWinRateInput.value) / 100;
  var loss = parseFloat(lossInput.value) / 100;
  var kellyFraction = calculateKellyFraction(firstProfit, loss, firstWinRate);
  var targetAmount = parseFloat(targetAmountInput.value);

  var balance = initialAmount;
  var trades = [];

  if (selectedStrategy === "Iteration") {
      for (let i = 1; i <= iterations; i++) {
        let beforeTradeAmount;
        let combination;
    
        if (i == 1) {
            beforeTradeAmount = (initialAmount * kellyFraction) / 3;
        }
        else {
            let kellyFractionAmount = balance * kellyFraction;
            beforeTradeAmount = kellyFractionAmount / 3;
        }
    
        balance = balance - 3 * beforeTradeAmount;
        let tradeAmount1 = beforeTradeAmount;
        let tradeAmount2 = beforeTradeAmount;
        let tradeAmount3 = beforeTradeAmount;
    
        if (Math.random() < firstWinRate) {
            balance += beforeTradeAmount + (beforeTradeAmount * firstProfit);
            tradeAmount1 = beforeTradeAmount + (beforeTradeAmount * firstProfit);
            if (Math.random() < secondWinRate) {
                balance += beforeTradeAmount + (beforeTradeAmount * secondProfit);
                tradeAmount2 = beforeTradeAmount + (beforeTradeAmount * secondProfit);
    
                if (Math.random() < thirdWinRate) {
                    balance += beforeTradeAmount + (beforeTradeAmount * thirdProfit);
                    tradeAmount3 = beforeTradeAmount + (beforeTradeAmount * thirdProfit);
                    combination = 'GGG';
                } else {
                    balance +=  beforeTradeAmount + (beforeTradeAmount * secondProfit);
                    tradeAmount3 = beforeTradeAmount + (beforeTradeAmount * secondProfit);
                    combination = 'GGR';
                }
            } else {
                balance += 2 * ( beforeTradeAmount + (beforeTradeAmount * firstProfit));
                tradeAmount2 = beforeTradeAmount + (beforeTradeAmount * firstProfit);
                tradeAmount3 = beforeTradeAmount + (beforeTradeAmount * firstProfit);
                combination = 'GRR';
            }}
        else {
            balance += 3 * (beforeTradeAmount - (beforeTradeAmount * loss));
            tradeAmount1 = beforeTradeAmount - (beforeTradeAmount * loss);
            tradeAmount2 = beforeTradeAmount - (beforeTradeAmount * loss);
            tradeAmount3 = beforeTradeAmount - (beforeTradeAmount * loss);
            combination = 'RRR';
        }
    
        let kellyFractionAmount = balance * kellyFraction;
        beforeTradeAmount = kellyFractionAmount / 3;
    
        trades.push({
            'Trade Count': trades.length + 1,
            'Trade Amount 1': {
                value: tradeAmount1,
                color: combination.charAt(0) === 'G' ? 'green' : 'red'
            },
            'Trade Amount 2': {
                value: tradeAmount2,
                color: combination.charAt(1) === 'G' ? 'green' : 'red'
            },
            'Trade Amount 3': {
                value: tradeAmount3,
                color: combination.charAt(2) === 'G' ? 'green' : 'red'
            },
            'Balance Amount': balance,
            'Kelly Fraction Amount': kellyFractionAmount
        });
      }
  } 
  else if (selectedStrategy === "TargetAmount") {
    let i = 0;
    while (balance <= targetAmount) {
      let beforeTradeAmount;
      let combination;
  
      if (i == 0) {
          beforeTradeAmount = (initialAmount * kellyFraction) / 3;
      }
      else {
        let kellyFractionAmount = balance * kellyFraction;
        beforeTradeAmount = kellyFractionAmount / 3;
    }
      
      balance = balance - 3 * beforeTradeAmount;
      let tradeAmount1 = beforeTradeAmount;
      let tradeAmount2 = beforeTradeAmount;
      let tradeAmount3 = beforeTradeAmount;
  
      if (Math.random() < firstWinRate) {
          balance += beforeTradeAmount + (beforeTradeAmount * firstProfit);
          tradeAmount1 = beforeTradeAmount + (beforeTradeAmount * firstProfit);
          if (Math.random() < secondWinRate) {
              balance += beforeTradeAmount + (beforeTradeAmount * secondProfit);
              tradeAmount2 = beforeTradeAmount + (beforeTradeAmount * secondProfit);
  
              if (Math.random() < thirdWinRate) {
                  balance += beforeTradeAmount + (beforeTradeAmount * thirdProfit);
                  tradeAmount3 = beforeTradeAmount + (beforeTradeAmount * thirdProfit);
                  combination = 'GGG';
              } else {
                  balance +=  beforeTradeAmount + (beforeTradeAmount * secondProfit);
                  tradeAmount3 = beforeTradeAmount + (beforeTradeAmount * secondProfit);
                  combination = 'GGR';
              }
          } else {
              balance += 2 * ( beforeTradeAmount + (beforeTradeAmount * firstProfit));
              tradeAmount2 = beforeTradeAmount + (beforeTradeAmount * firstProfit);
              tradeAmount3 = beforeTradeAmount + (beforeTradeAmount * firstProfit);
              combination = 'GRR';
          }}
      else {
          balance += 3 * (beforeTradeAmount - (beforeTradeAmount * loss));
          tradeAmount1 = beforeTradeAmount - (beforeTradeAmount * loss);
          tradeAmount2 = beforeTradeAmount - (beforeTradeAmount * loss);
          tradeAmount3 = beforeTradeAmount - (beforeTradeAmount * loss);
          combination = 'RRR';
      }
  
      let kellyFractionAmount = balance * kellyFraction;
      beforeTradeAmount = kellyFractionAmount / 3;
  
      trades.push({
          'Trade Count': trades.length + 1,
          'Trade Amount 1': {
              value: tradeAmount1,
              color: combination.charAt(0) === 'G' ? 'green' : 'red'
          },
          'Trade Amount 2': {
              value: tradeAmount2,
              color: combination.charAt(1) === 'G' ? 'green' : 'red'
          },
          'Trade Amount 3': {
              value: tradeAmount3,
              color: combination.charAt(2) === 'G' ? 'green' : 'red'
          },
          'Balance Amount': balance,
          'Kelly Fraction Amount': kellyFractionAmount
      });
      i++
  }
  }

  resultElement.innerHTML = 'Kelly Fraction:' + Math.floor(kellyFraction * 100) + '<br>' + 'Final Amount: ' + Math.floor(balance)
      + "<br>" + '  Iteration: ' + trades.length;

  var tableContent = generateTable(trades);
  tableElement.innerHTML = tableContent;

  generateChart(trades, chartElement);
}

function calculateKellyFraction(profitPercentage, lossPercentage, winRate) {
  var kellyFraction = ((profitPercentage / lossPercentage) * (winRate ) - ((1 - winRate))) / (profitPercentage / lossPercentage);
  kellyFraction = Math.min(1, kellyFraction);  
  return kellyFraction;
}

function generateTable(trades) {
  var tableContent = '<tr>';
  for (var key in trades[0]) {
      if (trades[0].hasOwnProperty(key)) {
          tableContent += '<th>' + key + '</th>';
      }
  }
  tableContent += '</tr>';

  for (var i = 0; i < trades.length; i++) {
      var trade = trades[i];

      tableContent += '<tr>';
      for (var key in trade) {
          if (trade.hasOwnProperty(key)) {
              var cellValue = trade[key];
              if (key.startsWith('Trade Amount')) {
                  var cellColor = cellValue.color;
                  tableContent += '<td style="color: ' + cellColor + ';">' + cellValue.value.toFixed(2) + '</td>';
              } else {
                  tableContent += '<td>' + cellValue.toFixed(2) + '</td>';
              }
          }
      }
      tableContent += '</tr>';
  }

  return tableContent;
}

function generateChart(trades, chartElement) {
  try {
      // Try to destroy existing chart
      var existingChart = Chart.getChart(chartElement);
      if (existingChart) {
          existingChart.destroy();
      }
  } catch (error) {
      // Handle any potential errors
      console.error("Error destroying existing chart:", error);
  }

  var labels = trades.map(function (trade) {
      return trade['Trade Count'];
  });

  var amounts = trades.map(function (trade) {
      return trade['Balance Amount']; // Use 'Balance Amount' instead of 'Current Amount'
  });

  var chartData = {
      labels: labels,
      datasets: [{
          label: 'Balance Amount',
          data: amounts,
          borderColor: 'blue',
          fill: false
      }]
  };

  var chartOptions = {
      scales: {
          x: {
              title: {
                  display: true,
                  text: 'Trade Count'
              }
          },
          y: {
              title: {
                  display: true,
                  text: 'Amount'
              }
          }
      }
  };

  var lineChart = new Chart(chartElement, {
      type: 'line',
      data: chartData,
      options: chartOptions
  });
}

document.getElementById("strategySelector").addEventListener("change", function () {
  const selectedValue = document.getElementById("strategySelector").value;

  if (selectedValue === "Iteration") {
      document.getElementById("iterations").disabled = false;
      document.getElementById("targetAmount").disabled = true;
  } else if (selectedValue === "TargetAmount") {
      document.getElementById("iterations").disabled = true;
      document.getElementById("targetAmount").disabled = false;
  }
});

document.getElementById('calculate-button').addEventListener('click', calculateTradingStrategy);
