// Stable, live endpoint URL structure
const API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

// Grab UI elements from the DOM
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const resultDiv = document.getElementById('result');
const rateText = document.getElementById('rate-text');
const lastUpdated = document.getElementById('last-updated');
const swapBtn = document.getElementById('swap-btn');

// Fetch and calculate rates
async function convertCurrency() {
    const amount = amountInput.value;
    const from = fromSelect.value.toLowerCase();
    const to = toSelect.value.toLowerCase();

    if (amount === '' || amount <= 0) {
        resultDiv.innerText = "0.00";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${from}.json`);
        const data = await response.json();
        
        const rate = data[from][to];
        const convertedAmount = (amount * rate).toFixed(2);
        
        // Format numbers nicely as currency (e.g., $100.00 or €100.00)
        const formattedResult = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: to.toUpperCase() 
        }).format(convertedAmount);
        
        resultDiv.innerText = formattedResult;
        rateText.innerText = `1 ${from.toUpperCase()} = ${rate.toFixed(4)} ${to.toUpperCase()}`;
        
        const now = new Date();
        lastUpdated.innerText = `Updated: ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } catch (error) {
        console.error("Error fetching rates:", error);
        resultDiv.innerText = "Error loading rates";
    }
}

// Event Listeners for responsive calculation
amountInput.addEventListener('input', convertCurrency);
fromSelect.addEventListener('change', convertCurrency);
toSelect.addEventListener('change', convertCurrency);

// Swap button logic
swapBtn.addEventListener('click', () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    convertCurrency();
});

// Run the function immediately upon opening the widget
convertCurrency();