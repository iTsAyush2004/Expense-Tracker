document.querySelector(".add").addEventListener("click", function() {
    // Get the value from the input with class 't1' and 't2'
    let text = document.querySelector(".t1").value;
    let amount = parseFloat(document.querySelector(".t2").value);
    let totalElement = document.querySelector(".totalValue");
    let leftElement = document.querySelector(".leftV");
    let rightElement = document.querySelector(".rightV");

    // Get current totals
    let currentTotal = parseFloat(totalElement.innerHTML) || 0;
    let currentIncome = parseFloat(leftElement.innerHTML) || 0;
    let currentExpense = parseFloat(rightElement.innerHTML) || 0;

    if (amount > 0) {
        currentIncome += amount;
        leftElement.innerHTML = currentIncome.toFixed(2);
        leftElement.style.color = "green";
        leftElement.style.fontWeight = "900";
    } else if (amount < 0) {
        currentExpense += Math.abs(amount);
        rightElement.innerHTML = currentExpense.toFixed(2);
        rightElement.style.color = "red";
        rightElement.style.fontWeight = "900";
    }

    // Update total balance
    currentTotal += amount;
    totalElement.innerHTML = currentTotal.toFixed(2);
    totalElement.style.color = "black";
    totalElement.style.fontWeight = "1000";

    // Show an alert
    alert("Transaction added successfully!");

    // Optionally clear the input fields
    document.querySelector(".t1").value = "";
    document.querySelector(".t2").value = "";

    // Add transaction to the history
    let item = document.querySelector(".items");
    let transaction = document.createElement("div");
    transaction.className = "list";
    let textColor = amount > 0 ? "green" : "red";
    transaction.innerHTML = `<span style="color: ${textColor};">${text}</span> <span style="float: right;">${amount.toFixed(2)}</span>`;

    // Create delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "X";
    deleteButton.style.marginLeft = "10px";
    deleteButton.style.width = "20px";
    deleteButton.style.height = "20px";
    deleteButton.style.backgroundColor = "red";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.borderRadius = "50%";
    deleteButton.style.cursor = "pointer";
    deleteButton.addEventListener("click", function() {
        item.removeChild(transaction);
        
        // Update the total balance, income, and expense
        if (amount > 0) {
            currentIncome -= amount;
            leftElement.innerHTML = currentIncome.toFixed(2);
        } else {
            currentExpense -= Math.abs(amount);
            rightElement.innerHTML = currentExpense.toFixed(2);
        }
        currentTotal -= amount;
        totalElement.innerHTML = currentTotal.toFixed(2);
    });

    // Append delete button to the transaction
    transaction.appendChild(deleteButton);
    
    // Append the transaction to the item list
    item.appendChild(transaction);
});

document.querySelector(".clear").addEventListener("click", function() {
    let item = document.querySelector(".items");
    let totalElement = document.querySelector(".totalValue");
    let leftElement = document.querySelector(".leftV");
    let rightElement = document.querySelector(".rightV");

    // Clear input fields and totals
    item.innerHTML = "";
    totalElement.innerHTML = "";
    leftElement.innerHTML = "";
    rightElement.innerHTML = "";
});

// Function to convert transactions to Excel and download
document.querySelector(".download").addEventListener("click", function() {
    let transactions = document.querySelectorAll(".list");
    let data = [];

    // Add header row
    data.push(["Text", "Amount"]);

    // Add transaction data
    transactions.forEach(function(transaction) {
        let text = transaction.querySelector("span").innerText;
        let amount = transaction.querySelector("span:nth-child(2)").innerText;
        data.push([text, amount]);
    });

    // Add total remaining balance
    let totalElement = document.querySelector(".totalValue");
    let totalBalance = parseFloat(totalElement.innerHTML) || 0;
    data.push([]);
    data.push(["Total Balance", totalBalance.toFixed(2)]);

    // Create worksheet
    let ws = XLSX.utils.aoa_to_sheet(data);

    // Create workbook
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    // Write workbook and trigger download
    XLSX.writeFile(wb, "transactions.xlsx");
});
