// SPECIFIC LOGIN CREDENTIALS - Change these to whatever you want
const VALID_EMAIL = "user@trusttello.com";
const VALID_PASSWORD = "TrustTello2025";

// FAKE ACCOUNT DATA FOR SIMULATION
let fakeUserData = {
    balance: 10000.00,
    transactions: [
        { date: "2025-05-21", description: "Coffee Shop", amount: -4.50 },
        { date: "2025-05-21", description: "Uber Ride", amount: -24.99 },
        { date: "2025-05-20", description: "Payroll Deposit", amount: 2500.00 },
        { date: "2025-05-20", description: "Amazon Purchase", amount: -89.47 },
        { date: "2025-05-19", description: "Grocery Store", amount: -68.37 },
        { date: "2025-05-19", description: "Online Transfer", amount: 250.00 },
        { date: "2025-05-18", description: "Netflix Subscription", amount: -15.99 },
        { date: "2025-05-18", description: "Gas Station", amount: -42.30 },
        { date: "2025-05-17", description: "Freelance Payment", amount: 350.00 },
        { date: "2025-05-17", description: "Restaurant Dinner", amount: -78.50 },
        { date: "2025-05-16", description: "Phone Bill", amount: -65.00 },
        { date: "2025-05-16", description: "Stock Dividend", amount: 125.75 },
        { date: "2025-05-15", description: "Gym Membership", amount: -49.99 },
        { date: "2025-05-15", description: "Client Payment", amount: 750.00 },
        { date: "2025-05-14", description: "Spotify Premium", amount: -11.99 },
        { date: "2025-05-14", description: "Target Shopping", amount: -124.32 },
        { date: "2025-05-13", description: "Interest Earned", amount: 8.42 },
        { date: "2025-05-13", description: "Pizza Delivery", amount: -27.50 },
        { date: "2025-05-12", description: "Electric Bill", amount: -94.00 },
        { date: "2025-05-12", description: "Bonus Deposit", amount: 500.00 }
    ]
};

// Helper function to update the display
function updateDashboard() {
    // Update balance display
    const balanceElement = document.getElementById("balance");
    if (balanceElement) {
        balanceElement.textContent = `$${fakeUserData.balance.toFixed(2)}`;
    }
    
    // Update transactions table
    const transactionsBody = document.getElementById("transactionsBody");
    if (transactionsBody) {
        transactionsBody.innerHTML = "";
        // Show most recent transactions
        fakeUserData.transactions.slice().reverse().forEach(trans => {
            const row = transactionsBody.insertRow();
            const dateCell = row.insertCell(0);
            const descCell = row.insertCell(1);
            const amountCell = row.insertCell(2);
            
            dateCell.textContent = trans.date;
            descCell.textContent = trans.description;
            amountCell.textContent = `${trans.amount >= 0 ? "+" : ""}$${Math.abs(trans.amount).toFixed(2)}`;
            amountCell.className = trans.amount >= 0 ? "positive" : "negative";
        });
    }
}

// LOGIN HANDLER - Now with specific credential check
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        // Check if credentials match
        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
            // Store email in session storage
            sessionStorage.setItem("trusttello_user", email);
            sessionStorage.setItem("trusttello_logged_in", "true");
            
            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            // Show error message
            const errorDiv = document.createElement("div");
            errorDiv.className = "error-message";
            errorDiv.style.backgroundColor = "#f8d7da";
            errorDiv.style.color = "#721c24";
            errorDiv.style.padding = "12px";
            errorDiv.style.borderRadius = "8px";
            errorDiv.style.marginBottom = "20px";
            errorDiv.style.textAlign = "center";
            errorDiv.innerHTML = "❌ Invalid email or password. Please try again.";
            
            // Remove any existing error message
            const existingError = document.querySelector(".error-message");
            if (existingError) existingError.remove();
            
            // Insert error before the form
            const form = document.getElementById("loginForm");
            form.parentNode.insertBefore(errorDiv, form);
            
            // Clear password field
            document.getElementById("password").value = "";
        }
    });
}

// DASHBOARD HANDLER
if (window.location.pathname.includes("dashboard.html")) {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem("trusttello_logged_in");
    if (!isLoggedIn) {
        window.location.href = "index.html";
    }
    
    // Display user email
    const userEmailSpan = document.getElementById("userEmail");
    if (userEmailSpan) {
        const email = sessionStorage.getItem("trusttello_user") || "Demo User";
        userEmailSpan.textContent = email;
        
        // Also set card holder name (use part of email or default)
        const cardHolderSpan = document.getElementById("cardHolderName");
        if (cardHolderSpan) {
            let cardName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
            cardName = cardName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            cardHolderSpan.textContent = cardName || "Demo User";
        }
    }
    
    // Initial display
    updateDashboard();
    
    // TRANSFER MONEY FUNCTIONALITY
    const transferForm = document.getElementById("transferForm");
    const transferMessage = document.getElementById("transferMessage");
    
    if (transferForm) {
        transferForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const recipientEmail = document.getElementById("recipientEmail").value;
            const amount = parseFloat(document.getElementById("transferAmount").value);
            const description = document.getElementById("transferDesc").value || "Transfer to " + recipientEmail;
            
            // Validation
            if (isNaN(amount) || amount <= 0) {
                transferMessage.textContent = "Please enter a valid amount.";
                transferMessage.className = "transfer-message error";
                return;
            }
            
            if (amount > fakeUserData.balance) {
                transferMessage.textContent = "Insufficient funds. You only have $" + fakeUserData.balance.toFixed(2);
                transferMessage.className = "transfer-message error";
                return;
            }
            
            // Process transfer
            fakeUserData.balance -= amount;
            
            // Add transaction record
            const today = new Date().toISOString().slice(0,10);
            fakeUserData.transactions.unshift({
                date: today,
                description: `Transfer to ${recipientEmail} - ${description}`,
                amount: -amount
            });
            
            // Keep only last 30 transactions
            if (fakeUserData.transactions.length > 30) {
                fakeUserData.transactions.pop();
            }
            
            // Update display
            updateDashboard();
            
            // Show success message
            transferMessage.textContent = `$${amount.toFixed(2)} sent to ${recipientEmail} successfully!`;
            transferMessage.className = "transfer-message success";
            
            // Reset form
            document.getElementById("transferAmount").value = "";
            document.getElementById("transferDesc").value = "";
            
            // Clear message after 3 seconds
            setTimeout(() => {
                transferMessage.textContent = "";
                transferMessage.className = "transfer-message";
            }, 3000);
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            sessionStorage.removeItem("trusttello_user");
            sessionStorage.removeItem("trusttello_logged_in");
            window.location.href = "index.html";
        });
    }
}