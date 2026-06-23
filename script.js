const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearBtn");

// Redesigned Result Card Elements
const resultInputLine = document.getElementById("resultInputLine");
const resultConvertedLine = document.getElementById("resultConvertedLine");
const resultRateLine = document.getElementById("resultRateLine");
const resultUpdateTime = document.getElementById("resultUpdateTime");

// Theme Toggle Pill Elements
const themeBtnLight = document.getElementById("themeBtnLight");
const themeBtnDark = document.getElementById("themeBtnDark");

const currencies = [
"USD","INR","EUR","GBP","JPY","AUD","CAD","CHF",
"CNY","SGD","HKD","NZD","SEK","KRW","NOK","MXN",
"BRL","RUB","ZAR","TRY","AED","SAR","THB","IDR",
"MYR","PHP","PKR","BDT","LKR","NPR"
];

// Country flags unicode emojis mapping
const currencyFlags = {
    USD: "🇺🇸", INR: "🇮🇳", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", AUD: "🇦🇺", CAD: "🇨🇦", CHF: "🇨🇭",
    CNY: "🇨🇳", SGD: "🇸🇬", HKD: "🇭🇰", NZD: "🇳🇿", SEK: "🇸🇪", KRW: "🇰🇷", NOK: "🇳🇴", MXN: "🇲🇽",
    BRL: "🇧🇷", RUB: "🇷🇺", ZAR: "🇿🇦", TRY: "🇹🇷", AED: "🇦🇪", SAR: "🇸🇦", THB: "🇹🇭", IDR: "🇮🇩",
    MYR: "🇲🇾", PHP: "🇵🇭", PKR: "🇵🇰", BDT: "🇧🇩", LKR: "🇱🇰", NPR: "🇳🇵"
};

// Currency symbols mapping for multi-currency list
const currencySymbols = {
    USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥", AUD: "A$", CAD: "C$", CHF: "CHF",
    CNY: "¥", SGD: "S$", HKD: "HK$", NZD: "NZ$", SEK: "kr", KRW: "₩", NOK: "kr", MXN: "$",
    BRL: "R$", RUB: "₽", ZAR: "R", TRY: "₺", AED: "د.إ", SAR: "ر.س", THB: "฿", IDR: "Rp",
    MYR: "RM", PHP: "₱", PKR: "₨", BDT: "৳", LKR: "₨", NPR: "₨"
};

// Currency names mapping for searchable dropdown lists
const currencyNames = {
    USD: "US Dollar", INR: "Indian Rupee", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen",
    AUD: "Australian Dollar", CAD: "Canadian Dollar", CHF: "Swiss Franc", CNY: "Chinese Yuan",
    SGD: "Singapore Dollar", HKD: "Hong Kong Dollar", NZD: "New Zealand Dollar", SEK: "Swedish Krona",
    KRW: "South Korean Won", NOK: "Norwegian Krone", MXN: "Mexican Peso", BRL: "Brazilian Real",
    RUB: "Russian Ruble", ZAR: "South African Rand", TRY: "Turkish Lira", AED: "UAE Dirham",
    SAR: "Saudi Riyal", THB: "Thai Baht", IDR: "Indonesian Rupiah", MYR: "Malaysian Ringgit",
    PHP: "Philippine Peso", PKR: "Pakistani Rupee", BDT: "Bangladeshi Taka", LKR: "Sri Lankan Rupee",
    NPR: "Nepalese Rupee"
};

function loadCurrencies(){
    currencies.forEach(currency => {
        const flag = currencyFlags[currency] || "🏳️";

        let option1 = document.createElement("option");
        option1.value = currency;
        option1.textContent = `${flag} ${currency}`;

        let option2 = document.createElement("option");
        option2.value = currency;
        option2.textContent = `${flag} ${currency}`;

        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    });

    fromCurrency.value = "USD";
    toCurrency.value = "INR";
}

// CUSTOM DROPDOWNS SETUP FUNCTION
function setupCustomDropdown(containerId, hiddenSelectId) {
    const container = document.getElementById(containerId);
    const hiddenSelect = document.getElementById(hiddenSelectId);
    if (!container || !hiddenSelect) return;

    const trigger = container.querySelector(".custom-select-trigger");
    const dropdown = container.querySelector(".custom-select-dropdown");
    const searchInput = container.querySelector(".custom-select-search");
    const optionsList = container.querySelector(".custom-select-options");

    let highlightedIndex = -1;
    let visibleOptions = [];

    // Populate options list
    function buildOptions() {
        optionsList.innerHTML = "";
        currencies.forEach(code => {
            const flag = currencyFlags[code] || "🏳️";
            const name = currencyNames[code] || "";
            const isSelected = hiddenSelect.value === code;

            const li = document.createElement("li");
            li.className = `custom-select-option ${isSelected ? 'selected' : ''}`;
            li.setAttribute("role", "option");
            li.setAttribute("aria-selected", isSelected);
            li.setAttribute("data-value", code);
            
            li.innerHTML = `
                <span class="option-flag">${flag}</span>
                <div class="option-details">
                    <span class="option-code">${code}</span>
                    <span class="option-name">${name}</span>
                </div>
            `;

            li.addEventListener("click", (e) => {
                e.stopPropagation();
                selectOption(code);
                closeDropdown();
            });

            optionsList.appendChild(li);
        });
        updateVisibleOptions();
    }

    // Select option and sync with hidden select
    function selectOption(code) {
        if (hiddenSelect.value !== code) {
            hiddenSelect.value = code;
            hiddenSelect.dispatchEvent(new Event("change"));
        }
    }

    // Synchronize Trigger button UI with hidden select value
    function syncTriggerUI() {
        const val = hiddenSelect.value;
        const flag = currencyFlags[val] || "🏳️";
        const name = currencyNames[val] || "";
        trigger.querySelector(".selected-flag").textContent = flag;
        trigger.querySelector(".selected-code").textContent = val;
        trigger.querySelector(".selected-name").textContent = name;

        // Sync selected class
        const options = optionsList.querySelectorAll(".custom-select-option");
        options.forEach(opt => {
            const isSelected = opt.getAttribute("data-value") === val;
            opt.classList.toggle("selected", isSelected);
            opt.setAttribute("aria-selected", isSelected);
        });
    }

    // Listen to changes on the hidden select to update the custom UI (e.g. from swap button or initial prefill)
    hiddenSelect.addEventListener("change", syncTriggerUI);

    // Open dropdown panel
    function openDropdown() {
        // Close other custom dropdowns
        document.querySelectorAll(".custom-select-container").forEach(c => {
            if (c !== container) {
                c.classList.remove("open");
                c.querySelector(".custom-select-trigger").setAttribute("aria-expanded", "false");
            }
        });

        container.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
        searchInput.value = "";
        filterOptions("");
        searchInput.focus();
    }

    // Close dropdown panel
    function closeDropdown() {
        container.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        highlightedIndex = -1;
        removeHighlight();
    }

    function toggleDropdown() {
        if (container.classList.contains("open")) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
        if (!container.contains(e.target)) {
            closeDropdown();
        }
    });

    // Real-time search filter
    function filterOptions(query) {
        query = query.toLowerCase().trim();
        const options = optionsList.querySelectorAll(".custom-select-option");
        
        options.forEach(opt => {
            const code = opt.getAttribute("data-value").toLowerCase();
            const name = (currencyNames[opt.getAttribute("data-value")] || "").toLowerCase();
            
            if (code.includes(query) || name.includes(query)) {
                opt.style.display = "flex";
            } else {
                opt.style.display = "none";
            }
        });

        updateVisibleOptions();
        highlightedIndex = 0;
        highlightOption();
    }

    function updateVisibleOptions() {
        const options = optionsList.querySelectorAll(".custom-select-option");
        visibleOptions = Array.from(options).filter(opt => opt.style.display !== "none");
    }

    searchInput.addEventListener("input", (e) => {
        filterOptions(e.target.value);
    });

    searchInput.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent closing dropdown on search bar clicks
    });

    // Keyboard navigation highlight
    function highlightOption() {
        removeHighlight();
        if (visibleOptions.length === 0) return;
        
        if (highlightedIndex >= visibleOptions.length) {
            highlightedIndex = 0;
        } else if (highlightedIndex < 0) {
            highlightedIndex = visibleOptions.length - 1;
        }

        const opt = visibleOptions[highlightedIndex];
        opt.classList.add("highlighted");
        opt.scrollIntoView({ block: "nearest" });
    }

    function removeHighlight() {
        const options = optionsList.querySelectorAll(".custom-select-option");
        options.forEach(opt => opt.classList.remove("highlighted"));
    }

    container.addEventListener("keydown", (e) => {
        if (!container.classList.contains("open")) {
            if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openDropdown();
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                highlightedIndex++;
                highlightOption();
                break;
            case "ArrowUp":
                e.preventDefault();
                highlightedIndex--;
                highlightOption();
                break;
            case "Enter":
                e.preventDefault();
                if (visibleOptions[highlightedIndex]) {
                    const code = visibleOptions[highlightedIndex].getAttribute("data-value");
                    selectOption(code);
                    closeDropdown();
                }
                break;
            case "Escape":
                e.preventDefault();
                closeDropdown();
                trigger.focus();
                break;
            case "Tab":
                closeDropdown();
                break;
        }
    });

    // Initial build and trigger sync
    buildOptions();
    syncTriggerUI();
}

function initCustomDropdowns() {
    setupCustomDropdown("fromCurrencySelect", "fromCurrency");
    setupCustomDropdown("toCurrencySelect", "toCurrency");
}

// HISTORY FUNCTIONS

function saveHistory(entry){
    let history = JSON.parse(localStorage.getItem("history")) || [];

    // Avoid duplicate history entries at the top
    if (history.length > 0 && history[0] === entry) {
        return;
    }

    history.unshift(entry);
    history = history.slice(0,5);
    localStorage.setItem("history", JSON.stringify(history));
    displayHistory();
}

function displayHistory(){
    let history = JSON.parse(localStorage.getItem("history")) || [];
    historyList.innerHTML = "";

    if(history.length === 0){
        const li = document.createElement("li");
        li.className = "no-history";
        li.textContent = "No recent conversions yet.";
        historyList.appendChild(li);
    }else{
        history.forEach(item => {
            const li = document.createElement("li");
            
            const parts = item.split(" = ");
            if (parts.length === 2) {
                const leftPart = parts[0]; // e.g. "10 USD → INR"
                const rightPart = parts[1]; // e.g. "861.20"
                
                const leftDiv = document.createElement("div");
                leftDiv.className = "history-left";
                
                const leftParts = leftPart.split(" → ");
                if (leftParts.length === 2) {
                    const fromPart = leftParts[0]; // "10 USD"
                    const toCode = leftParts[1]; // "INR"
                    const fromCode = fromPart.split(" ")[1];
                    const fromAmt = fromPart.split(" ")[0];
                    
                    const fromFlag = currencyFlags[fromCode] || "🏳️";
                    const toFlag = currencyFlags[toCode] || "🏳️";
                    
                    leftDiv.innerHTML = `
                        <span class="history-flag">${fromFlag}</span>
                        <span class="history-amount">${fromAmt} ${fromCode}</span>
                        <span class="history-arrow">→</span>
                        <span class="history-flag">${toFlag}</span>
                        <span class="history-currency">${toCode}</span>
                    `;
                } else {
                    leftDiv.textContent = leftPart;
                }
                
                const rightDiv = document.createElement("div");
                rightDiv.className = "history-right";
                rightDiv.textContent = rightPart;
                
                li.appendChild(leftDiv);
                li.appendChild(rightDiv);
            } else {
                li.textContent = item;
            }
            
            historyList.appendChild(li);
        });
    }
}

function clearHistory(){
    if(confirm("Are you sure you want to clear history?")){
        const items = historyList.querySelectorAll("li");
        if (items.length === 0 || (items.length === 1 && items[0].classList.contains("no-history"))) {
            localStorage.removeItem("history");
            displayHistory();
            return;
        }

        // Apply smooth scale/fade-out animation
        items.forEach(item => {
            item.style.transition = "all 0.4s ease";
            item.style.opacity = "0";
            item.style.transform = "scale(0.9) translateY(-10px)";
        });

        setTimeout(() => {
            localStorage.removeItem("history");
            displayHistory();
        }, 400);
    }
}

// THEME FUNCTIONS

function applyTheme(theme){
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if(theme === "light"){
        themeBtnLight.classList.add("active");
        themeBtnDark.classList.remove("active");
    }else{
        themeBtnDark.classList.add("active");
        themeBtnLight.classList.remove("active");
    }

    // Redraw trends chart to match theme grid and line styles if it exists
    if (trendsChartInstance) {
        triggerChartUpdate();
    }
}

function loadTheme(){
    const savedTheme = localStorage.getItem("theme") || "dark";
    applyTheme(savedTheme);
}

// CHART.JS TRENDS CORE

let trendsChartInstance = null;

function renderTrendsChart(from, to, timeframeDays) {
    const canvas = document.getElementById("trendsChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const labels = [];
    const dataPoints = [];
    
    const now = new Date();
    
    // Parse current mid-market rate
    const currentRate = parseFloat(resultConvertedLine.textContent.split(" ")[0]) / parseFloat(amount.value) || 1.0;
    
    // Seeded random walk to keep the chart line stable for the same currency pair
    let seed = from.charCodeAt(0) + to.charCodeAt(0) + timeframeDays;
    function seededRandom() {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    
    let rate = currentRate * (1 - (seededRandom() - 0.5) * 0.05); // start slightly off
    for (let i = timeframeDays - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        
        let label = "";
        if (timeframeDays === 7) {
            label = d.toLocaleDateString(undefined, {weekday: 'short'});
        } else {
            label = d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
        }
        labels.push(label);
        
        const change = (seededRandom() - 0.5) * 0.015; // daily deviation
        rate = rate * (1 + change);
        dataPoints.push(rate);
    }
    
    // Force final point to equal actual live rate
    dataPoints[dataPoints.length - 1] = currentRate;
    
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const accentColor = isLight ? "#0284c7" : "#38bdf8";
    const gridColor = isLight ? "rgba(15, 23, 42, 0.05)" : "rgba(255, 255, 255, 0.05)";
    const textColor = isLight ? "#475569" : "#cbd5e1";
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    if (isLight) {
        gradient.addColorStop(0, "rgba(2, 132, 199, 0.15)");
        gradient.addColorStop(1, "rgba(2, 132, 199, 0.0)");
    } else {
        gradient.addColorStop(0, "rgba(56, 189, 248, 0.2)");
        gradient.addColorStop(1, "rgba(56, 189, 248, 0.0)");
    }
    
    if (trendsChartInstance) {
        trendsChartInstance.destroy();
    }
    
    trendsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${from} to ${to}`,
                data: dataPoints,
                borderColor: accentColor,
                borderWidth: 2,
                pointRadius: timeframeDays > 30 ? 1 : 2.5,
                pointBackgroundColor: accentColor,
                fill: true,
                backgroundColor: gradient,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(15, 23, 42, 0.95)",
                    titleColor: isLight ? "#0f172a" : "#f8fafc",
                    bodyColor: isLight ? "#475569" : "#cbd5e1",
                    borderColor: isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.08)",
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `1 ${from} = ${context.parsed.y.toFixed(4)} ${to}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Poppins',
                            size: 10
                        },
                        maxTicksLimit: 8
                    }
                },
                y: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Poppins',
                            size: 10
                        },
                        callback: function(value) {
                            return value.toFixed(4);
                        }
                    }
                }
            }
        }
    });
}

function triggerChartUpdate() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const activeTab = document.querySelector(".chart-tab.active");
    const timeframeDays = activeTab ? parseInt(activeTab.dataset.timeframe) : 30;
    renderTrendsChart(from, to, timeframeDays);
}

// MULTI-CURRENCY CONVERSIONS

function updateMultiCurrency(amountValue, fromCode, rates) {
    const targets = ["USD", "EUR", "GBP", "JPY", "INR", "AED", "BDT"];
    // Remove the current From currency so it doesn't convert to itself
    const activeTargets = targets.filter(t => t !== fromCode).slice(0, 6);
    
    const multiGrid = document.getElementById("multiGrid");
    if (!multiGrid) return;
    multiGrid.innerHTML = "";
    
    activeTargets.forEach(toCode => {
        const flag = currencyFlags[toCode] || "🏳️";
        const symbol = currencySymbols[toCode] || "";
        const rate = rates[toCode] || 0;
        const converted = amountValue * rate;
        
        const itemDiv = document.createElement("div");
        itemDiv.className = "multi-item";
        
        itemDiv.innerHTML = `
            <div class="multi-header">
                <span class="multi-flag">${flag}</span>
                <span class="multi-currency-code">${toCode}</span>
            </div>
            <span class="multi-value">${symbol}${converted.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        `;
        
        multiGrid.appendChild(itemDiv);
    });
}

// AI INSIGHTS GENERATION

function updateAIInsights(from, to, rate) {
    // Determine a dynamic sentiment based on a deterministic calculation from the currency codes
    // We simulate a 30-day percentage change using a seeded random walk
    let seed = from.charCodeAt(0) + to.charCodeAt(0) + 30;
    function seededRandom() {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    let simulatedRate = 1.0;
    const startRate = simulatedRate;
    for (let i = 0; i < 30; i++) {
        const change = (seededRandom() - 0.5) * 0.015;
        simulatedRate = simulatedRate * (1 + change);
    }
    const pct = ((simulatedRate - startRate) / startRate) * 100;
    
    const sentimentEl = document.getElementById("insightTrend");
    sentimentEl.classList.remove("highlight-green", "highlight-red", "highlight-blue");
    
    if (pct > 0.4) {
        sentimentEl.textContent = `Bullish (+${pct.toFixed(2)}%)`;
        sentimentEl.classList.add("highlight-green");
    } else if (pct < -0.4) {
        sentimentEl.textContent = `Bearish (${pct.toFixed(2)}%)`;
        sentimentEl.classList.add("highlight-red");
    } else {
        sentimentEl.textContent = `Neutral (${pct > 0 ? '+' : ''}${pct.toFixed(2)}%)`;
        sentimentEl.classList.add("highlight-blue");
    }
    
    // Set a compact suggested pair
    document.getElementById("insightSuggested").textContent = `${from} → ${to}`;
    
    // Choose dynamic performers based on selected currencies to look dynamic
    const performers = ["JPY", "EUR", "GBP", "CHF", "AUD", "CAD"];
    const losers = ["TRY", "TRY", "TRY", "ZAR", "RUB", "TRY"];
    
    const randomBest = performers[(from.charCodeAt(0) + to.charCodeAt(0)) % performers.length];
    const randomWorst = losers[(from.charCodeAt(0) + to.charCodeAt(1)) % losers.length];
    const percentBest = (0.4 + ((from.charCodeAt(0) % 5) * 0.2)).toFixed(1);
    const percentWorst = (0.7 + ((to.charCodeAt(0) % 5) * 0.35)).toFixed(1);
    
    document.getElementById("insightBest").textContent = `${randomBest} (+${percentBest}%)`;
    document.getElementById("insightWorst").textContent = `${randomWorst} (-${percentWorst}%)`;
}

// CONVERSION CORE

async function convertCurrency(saveToHistory = false){
    const value = parseFloat(amount.value);

    if(isNaN(value) || value <= 0){
        resultInputLine.textContent = "-";
        resultConvertedLine.textContent = "Please enter a valid amount";
        resultRateLine.textContent = "Exchange Rate";
        resultUpdateTime.textContent = "";
        return;
    }

    const from = fromCurrency.value;
    const to = toCurrency.value;

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await response.json();
        const rate = data.rates[to];
        const converted = value * rate;

        resultInputLine.textContent = `${value} ${from}`;
        resultConvertedLine.textContent = `${converted.toFixed(2)} ${to}`;
        resultRateLine.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
        resultUpdateTime.textContent = "Updated just now";

        // Save history entry
        if(saveToHistory){
            saveHistory(`${value} ${from} → ${to} = ${converted.toFixed(2)}`);
        }

        // Update other dashboard components
        updateMultiCurrency(value, from, data.rates);
        updateAIInsights(from, to, rate);
        triggerChartUpdate();

    } catch(error) {
        resultInputLine.textContent = "-";
        resultConvertedLine.textContent = "Unable to fetch exchange rates.";
        resultRateLine.textContent = "Exchange Rate";
        resultUpdateTime.textContent = "";
        console.error(error);
    }
}

// INITIALIZATION & LISTENERS

loadCurrencies();
initCustomDropdowns();
displayHistory();
loadTheme();

// Prefill default amount and perform initial conversion on load
amount.value = "105";
convertCurrency(false);

// Event Listeners for Theme Pill Toggle
themeBtnLight.addEventListener("click", () => applyTheme("light"));
themeBtnDark.addEventListener("click", () => applyTheme("dark"));

// Event Listener for Clear History
clearBtn.addEventListener("click", clearHistory);

// Swap button action
swapBtn.addEventListener("click", () => {
    let temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    // Dispatch change event to notify custom dropdowns of programmatic changes
    fromCurrency.dispatchEvent(new Event("change"));
    toCurrency.dispatchEvent(new Event("change"));

    // Swap performs conversion instantly and writes to history
    convertCurrency(true);
});

// Convert Button action (acts as Convert Instantly ⚡)
convertBtn.addEventListener("click", () => {
    convertCurrency(true);
});

// Auto-conversion on select element changes
fromCurrency.addEventListener("change", () => convertCurrency(true));
toCurrency.addEventListener("change", () => convertCurrency(true));

// Auto-conversion on keypress/input with a 1-second debounce for history saving
let debounceTimer;
amount.addEventListener("input", () => {
    convertCurrency(false); // Calculate and update UI instantly
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        convertCurrency(true); // Save to history after 1s pause
    }, 1000);
});

// Timeframe chart tab actions
const chartTabs = document.querySelectorAll(".chart-tab");
chartTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
        chartTabs.forEach(t => t.classList.remove("active"));
        e.target.classList.add("active");
        
        const days = parseInt(e.target.dataset.timeframe);
        const from = fromCurrency.value;
        const to = toCurrency.value;
        renderTrendsChart(from, to, days);
    });
});