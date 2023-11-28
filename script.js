function calculateTradingStrategy() {
    var initialAmountInput = document.getElementById('initial-amount');
    var targetAmountInput = document.getElementById('target-amount');
    var firstProfitInput = document.getElementById('firstProfit');
    var secondProfitInput = document.getElementById('secondProfit');
    var thirdProfitInput = document.getElementById('thirdProfit');
    var lossInput = document.getElementById('lossPercentage');
    var resultElement = document.getElementById('result');
    var tableElement = document.getElementById('table');
    var chartElement = document.getElementById('chart');

    var initialAmount = parseFloat(initialAmountInput.value);
    var targetAmount = parseFloat(targetAmountInput.value);
    var firstProfit = parseFloat(firstProfitInput.value)/100;
    var secondProfit = parseFloat(secondProfitInput.value)/100;
    var thirdProfit = parseFloat(thirdProfitInput.value)/100;
    var loss = parseFloat(lossInput.value)/100;
    var kellyFraction = calculateKellyFraction(initialAmount, firstProfit, loss, 0.6);
  
    var currentAmount = initialAmount;
    var trades = [];
    var iteration = 0 ;
  
    while (currentAmount < targetAmount) {
      var tradeAmount1, tradeAmount2, tradeAmount3;
      
      tradeAmount1 = (currentAmount * kellyFraction)  / 3;
      tradeAmount2 = (currentAmount * kellyFraction)  / 3;
      tradeAmount3 = (currentAmount * kellyFraction)  / 3;
      var combination = '';
  
      if (Math.random() < 0.6) { // 60% win rate
        currentAmount += tradeAmount1 * firstProfit;
        tradeAmount1 += tradeAmount1 * firstProfit;
  
        if (Math.random() < 0.3) { // 30% win rate
          currentAmount += tradeAmount2 * secondProfit;
          tradeAmount2 += tradeAmount2 * secondProfit;
  
          if (Math.random() < 0.1) { // 10% win rate
            currentAmount += tradeAmount3 * thirdProfit;
            tradeAmount3 += tradeAmount3 * thirdProfit;
            combination = 'GGG';
          } else {
            currentAmount += tradeAmount3 * firstProfit;
            tradeAmount3 += tradeAmount3 * firstProfit;
            combination = 'GGR';
          }
        } else {
          currentAmount += tradeAmount2;
          tradeAmount2 = tradeAmount2;
          currentAmount += tradeAmount3;
          tradeAmount3 = tradeAmount3;
          combination = 'GRR';
        }
      } else {
        currentAmount += tradeAmount1 * -1 * loss;
        tradeAmount1 += tradeAmount1 * -1 * loss;
        currentAmount += tradeAmount2 * -1 * loss;
        tradeAmount2 += tradeAmount2 * -1 * loss;
        currentAmount += tradeAmount3 * -1 * loss;
        tradeAmount3 += tradeAmount3 * -1 * loss;
        combination = 'RRR';
      }
  
      iteration += 1;
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
        'Current Amount': currentAmount,
        'Kelly Fraction': kellyFraction * currentAmount
      });
    }

    resultElement.innerHTML = 'Kelly Fraction:' + Math.floor(kellyFraction*100) + '<br>' + 'Final Amount: ' +Math.floor( currentAmount )
    + "<br>" + '  Iteration: ' + iteration;

    var tableContent = generateTable(trades);
    tableElement.innerHTML = tableContent;
  
    generateChart(trades, chartElement);
  
  }
  
  // Rest of the code
  
  
  
  function calculateKellyFraction(initialAmount, profitPercentage, lossPercentage, winRate) {
    var profitLoss = (profitPercentage * initialAmount) - (lossPercentage * initialAmount);
    var kellyFraction = (winRate * profitLoss - (1 - winRate) * lossPercentage) / profitLoss;
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

    var labels = trades.map(function(trade) {
        return trade['Trade Count'];
    });

    var amounts = trades.map(function(trade) {
        return trade['Current Amount'];
    });

    var chartData = {
        labels: labels,
        datasets: [{
            label: 'Current Amount',
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


  
  document.getElementById('calculate-button').addEventListener('click', calculateTradingStrategy);