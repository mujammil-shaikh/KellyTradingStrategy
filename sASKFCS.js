let initialAmount, winRate, profitPercentage, lossPercentage, selectedStrategy, targetAmount, iterations;
let kellyFraction, currentAmount;
let chart;

function calculate() {
    initialAmount = parseFloat(document.getElementById("initialAmount").value);
    winRate = parseFloat(document.getElementById("winRate").value);
    profitPercentage = parseFloat(document.getElementById("profitPercentage").value);
    lossPercentage = parseFloat(document.getElementById("lossPercentage").value);
    selectedStrategy = document.getElementById("strategySelector").value;
    targetAmount = parseFloat(document.getElementById("targetAmount").value);
    iterations = parseInt(document.getElementById("iterations").value);

    if (isNaN(initialAmount) || isNaN(winRate) || isNaN(profitPercentage) || isNaN(lossPercentage)) {
        alert("Invalid input. Please enter numeric values for all parameters.");
        return;
    }

    kellyFraction = ((profitPercentage / lossPercentage) * (winRate / 100) - ((100 - winRate) / 100)) / (profitPercentage / lossPercentage);
    kellyFraction = Math.min(1, kellyFraction);

    currentAmount = initialAmount;

    if (selectedStrategy === "Iteration") {
        iterateForIterations();
    } else if (selectedStrategy === "TargetAmount") {
        iterateUntilTarget();
    }

    iterations = selectedStrategy === "Iteration"
        ? parseInt(document.getElementById("iterations").value)
        : 1; // or any default value you want for TargetAmount

    generateTable();
}

function iterateForIterations() {
    let balance = initialAmount;

    for (let i = 1; i <= iterations; i++) {
        let beforeTradeAmount;

        if (i === 1) {
            beforeTradeAmount = initialAmount * kellyFraction;
        } else {
            let kellyFractionAmount = balance * kellyFraction;
            beforeTradeAmount = kellyFractionAmount;
        }
        
        balance = balance - beforeTradeAmount;

        // Calculate trade outcome based on random value
        let tradeOutcome = Math.random();

        if (tradeOutcome <= winRate / 100) {
            balance += beforeTradeAmount + (profitPercentage / 100) * beforeTradeAmount;
        } else {
            balance += beforeTradeAmount - (lossPercentage / 100) * beforeTradeAmount;
        }

        let kellyFractionAmount = balance * kellyFraction;

        displayIterationResult(i, beforeTradeAmount, tradeOutcome, balance, kellyFractionAmount);
    }
}

function iterateUntilTarget() {
    let iteration = 0;
    let balance = initialAmount;

    while (balance <= targetAmount) {
        let beforeTradeAmount;

        if (iteration === 0) {
            beforeTradeAmount = initialAmount * kellyFraction;
        } else {
            let kellyFractionAmount = balance * kellyFraction;
            beforeTradeAmount = kellyFractionAmount;
        }

        balance = balance - beforeTradeAmount;

        // Calculate trade outcome based on random value
        let tradeOutcome = Math.random();

        if (tradeOutcome <= winRate / 100) {
            balance += beforeTradeAmount + (profitPercentage / 100) * beforeTradeAmount;
        } else {
            balance += beforeTradeAmount - (lossPercentage / 100) * beforeTradeAmount;
        }

        let kellyFractionAmount = balance * kellyFraction;

        displayIterationResult(iteration + 1, beforeTradeAmount, tradeOutcome, balance, kellyFractionAmount);

        iteration++;
    }
}




function displayIterationResult(iteration, beforeTradeAmount, tradeOutcome, balanceAmount, kellyFractionMultipliedBalance) {
    let table = document.getElementById("resultTable");
    let resultRow = table.insertRow();

    resultRow.insertCell().appendChild(document.createTextNode(iteration));
    resultRow.insertCell().appendChild(document.createTextNode(formatCurrency(beforeTradeAmount)));
    resultRow.insertCell().appendChild(document.createTextNode(tradeOutcome <= winRate / 100 ? "Win" : "Loss"));
    resultRow.insertCell().appendChild(document.createTextNode(formatCurrency(balanceAmount)));
    resultRow.insertCell().appendChild(document.createTextNode(formatCurrency(kellyFractionMultipliedBalance)));
}


function generateTable() {
    let table = document.getElementById("resultTable");
    table.innerHTML = ""; // Clear previous content

    let headers = ["Iteration", "Before Trade Amount", "Trade Outcome", "Balance Amount", "Kelly Fraction Multiplied Balance"];
    let headerRow = table.insertRow();

    headers.forEach(headerText => {
        let th = document.createElement("th");
        let text = document.createTextNode(headerText);
        th.appendChild(text);
        headerRow.appendChild(th);
    });

    if (selectedStrategy === "Iteration") {
        iterateForIterations();
    } else if (selectedStrategy === "TargetAmount") {
        iterateUntilTarget();
    }

    let strategyIterations = table.rows.length - 1; // Exclude header row
    generateChart(strategyIterations);

    // Extract information from the last row
    let lastRow = table.rows[strategyIterations];
    let lastBalance = lastRow.cells[3].textContent; // Assuming 4th column is the Balance Amount
    let lastIteration = lastRow.cells[0].textContent; // Assuming 1st column is the Iteration number

    // Display summary information above the table
    let summaryRow = table.insertRow(0);
    summaryRow.insertCell().appendChild(document.createTextNode("Kelly Fraction: " + kellyFraction.toFixed(2)));
    summaryRow.insertCell().appendChild(document.createTextNode("Last Iteration: " + lastIteration));
    summaryRow.insertCell().appendChild(document.createTextNode("Last Balance: " + lastBalance));
    summaryRow.insertCell().colSpan = headers.length; // Span the cells to cover the entire row
}




function generateChart(iterations) {
    let chartCanvas = document.getElementById("chart");
    let ctx = chartCanvas.getContext("2d");

    let balanceValues = [];
    let currentBalance = initialAmount;

    for (let i = 1; i <= iterations; i++) {
        let beforeTradeAmount = currentBalance * kellyFraction;
        let tradeOutcome = Math.random() <= winRate / 100 ? 1 : -1;
        let tradeProfit = tradeOutcome * beforeTradeAmount * (profitPercentage / 100);
        currentBalance += tradeProfit;
        balanceValues.push(currentBalance);
    }

    if (!chart) {
        // Create the chart if it doesn't exist
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: iterations }, (_, i) => i + 1),
                datasets: [{
                    label: 'Balance',
                    data: balanceValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointRadius: window.innerWidth < 600 ? 0 : 5,
                    pointHoverRadius: window.innerWidth < 600 ? 0 : 8,
                    fill: false
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
                },
                tooltips: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                }
            }
        });
    } else {
        // Update the existing chart data and options
        chart.data.labels = Array.from({ length: iterations }, (_, i) => i + 1);
        chart.data.datasets[0].data = balanceValues;
    
        // Get the current screen width
        const screenWidth = window.innerWidth;
    
        // Modify the dataset options to hide circle markers if screen width is 600 or less
        if (screenWidth < 600) {
            chart.data.datasets[0].pointRadius = 0;
            chart.data.datasets[0].pointHoverRadius = 0;
        } else {
            chart.data.datasets[0].pointRadius = 5;
            chart.data.datasets[0].pointHoverRadius = 8;
        }
    
        chart.update(); // Update the chart
    }
}



function formatCurrency(amount) {
    return "$" + amount.toFixed(2);
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
