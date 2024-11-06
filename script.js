// Smart contract details (replace with real values)
const CONTRACT_ADDRESS = "0xYourTokenContractAddress"; // Your contract address here
const CONTRACT_ABI = [/* Your Contract ABI */]; // Your contract ABI here

let web3;
let contract;
let userAddress;

// Price of one token in USD
const TOKEN_PRICE = 0.005; // 0.005 USD per token

// Connect Wallet Logic
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            alert(`Connected Wallet: ${userAddress}`);

            // Initialize Web3 and the contract
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

            // Hide the Connect Wallet button and show the Buy Tokens button
            document.getElementById("connect-wallet").style.display = "none";
            document.getElementById("buy-tokens").style.display = "inline-block";
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Failed to connect wallet: " + error.message);
        }
    } else {
        alert("MetaMask not found. Please install MetaMask.");
    }
}

// Calculate Tokens based on USDT input
function calculateTokens() {
    const usdtAmount = parseFloat(document.getElementById("usdt-amount").value);
    if (!isNaN(usdtAmount) && usdtAmount >= 0) {
        const tokenAmount = (usdtAmount / TOKEN_PRICE).toFixed(2); // Calculate tokens
        document.getElementById("token-amount").value = tokenAmount; // Set calculated tokens
    } else {
        document.getElementById("token-amount").value = ""; // Clear if input is invalid
    }
}

// Buy Tokens Logic
async function buyTokens() {
    const usdtAmount = document.getElementById("usdt-amount").value;
    const tokenAmount = document.getElementById("token-amount").value;

    if (!usdtAmount || usdtAmount <= 0) {
        alert("Please enter a valid amount in USDT.");
        return;
    }

    try {
        const valueInBNB = web3.utils.toWei((usdtAmount * 1).toString(), 'ether'); // Adjust if token price is different
        const tx = await contract.methods.buyTokens().send({
            from: userAddress,
            value: valueInBNB
        });

        alert("Tokens purchased successfully!");
        console.log("Transaction:", tx);
    } catch (error) {
        console.error("Error purchasing tokens:", error);
        alert("Token purchase failed: " + error.message);
    }
}

// Event Listeners
document.getElementById("connect-wallet").addEventListener("click", connectWallet);
document.getElementById("buy-tokens").addEventListener("click", buyTokens);
document.getElementById("usdt-amount").addEventListener("input", calculateTokens);






// Countdown Timer Logic
function startCountdown(endDate) {
    const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance <= 0) {
            clearInterval(countdownTimer);
            document.getElementById("countdown-timer").innerHTML = "<h2>Presale Ended</h2>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(days).padStart(2, '0');
        document.getElementById("hours").textContent = String(hours).padStart(2, '0');
        document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
        document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

// Set the presale end date (2 months from now)
const presaleEndDate = new Date();
presaleEndDate.setMonth(presaleEndDate.getMonth() + 2);
startCountdown(presaleEndDate);

document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('active');
});

