document.addEventListener('DOMContentLoaded', () => {
    // --- Screen and Element Selectors ---
    const splashScreen = document.getElementById('splashScreen');
    const mainAppScreen = document.getElementById('mainAppScreen');
    const continueGuestBtn = document.getElementById('continueGuestBtn');
    const guestNameModal = document.getElementById('guestNameModal');
    const guestNameInput = document.getElementById('guestNameInput');
    const saveGuestNameBtn = document.getElementById('saveGuestNameBtn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const tagline = document.getElementById('tagline');

    const expenseManagerTab = document.getElementById('expenseManagerTab');
    const splitExpenseTab = document.getElementById('splitExpenseTab');
    const expenseManagerView = document.getElementById('expenseManagerView');
    const splitExpenseView = document.getElementById('splitExpenseView');
    
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userDropdown = document.getElementById('userDropdown');

    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const currentMonthNameDisplays = document.querySelectorAll('.current-month-display-name');
    const currentYearDisplay = document.getElementById('currentYearDisplay');
    const categoryBreakdownMonthYear = document.getElementById('categoryBreakdownMonthYear');
    const currencySelect = document.getElementById('currencySelect');

    const totalExpensesElement = document.getElementById('totalExpenses');
    const totalIncomeElement = document.getElementById('totalIncome');
    const remainingBalanceElement = document.getElementById('remainingBalance');


    // --- Data Variables (Simulated for Demo) ---
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    let userName = 'Guest';
    let currentCurrency = 'INR (₹)';

    // Simulated data structure: { 'MonthIndex-Year': { income: 0, expense: 0 } }
    const simulatedData = {
        '8-2025': { income: 55000, expense: 28500 }, // September 2025 (Current)
        '7-2025': { income: 60000, expense: 35000 }, // August 2025 (Previous)
        '6-2025': { income: 45000, expense: 15000 }  // July 2025
    };


    // --- 1. INITIAL SPLASH/LOGIN FLOW ---

    // Animate Tagline (as requested)
    setTimeout(() => {
        tagline.classList.add('animated');
    }, 500);

    // Step 1: Click 'Continue as Guest'
    continueGuestBtn.addEventListener('click', () => {
        guestNameModal.classList.add('active');
        // NOTE: Sound is intentionally skipped here as we don't have the audio file
    });

    // Step 2: Save Name and Enter App
    saveGuestNameBtn.addEventListener('click', () => {
        const inputName = guestNameInput.value.trim();
        if (inputName) {
            userName = inputName.charAt(0).toUpperCase() + inputName.slice(1);
        } else {
            userName = 'Guest';
        }
        
        guestNameModal.classList.remove('active');
        splashScreen.classList.remove('active');
        
        setTimeout(() => {
            mainAppScreen.classList.add('active');
            alert(`Hello ${userName}, let's start your financial journey!`); 
            userNameDisplay.textContent = userName;
            
            // Load initial data for the current month after login
            loadExpenseData();
        }, 300);
    });


    // --- 2. MAIN APP FUNCTIONALITY ---

    // Toggle User Dropdown Menu
    userMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    // Close User Dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });

    // Currency Switch Logic (Updates symbol across the app)
    currencySelect.addEventListener('change', () => {
        currentCurrency = currencySelect.options[currencySelect.selectedIndex].text;
        loadExpenseData(); // Reload data to apply new currency format
    });

    // Tab Switching Logic
    const switchTab = (activeTab, activeView) => {
        // Deactivate all tabs and views
        expenseManagerTab.classList.remove('active');
        splitExpenseTab.classList.remove('active');
        expenseManagerView.classList.remove('active');
        splitExpenseView.classList.remove('active');

        // Activate the selected tab and view
        activeTab.classList.add('active');
        activeView.classList.add('active');
    };

    expenseManagerTab.addEventListener('click', () => {
        switchTab(expenseManagerTab, expenseManagerView);
    });

    splitExpenseTab.addEventListener('click', () => {
        switchTab(splitExpenseTab, splitExpenseView);
    });
    
    // Split Expense Screen Group Navigation (Simulated)
    const groupList = document.getElementById('groupList');
    const groupDetail = document.getElementById('groupDetail');
    const backToGroups = document.getElementById('backToGroups');
    
    document.getElementById('createGroupBtn').addEventListener('click', () => {
        groupList.classList.remove('active');
        groupDetail.classList.add('active');
    });
    
    backToGroups.addEventListener('click', (e) => {
        e.preventDefault();
        groupList.classList.add('active');
        groupDetail.classList.remove('active');
    });


    // --- 3. EXPENSE MANAGER DATA LOGIC ---

    const populateDateSelectors = () => {
        // Populate Months
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
        });

        // Populate Years (Current year and last 4 years)
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 5; i++) {
            const year = currentYear - i;
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }

        // Set current month/year as default selection
        const now = new Date();
        monthSelect.value = now.getMonth();
        yearSelect.value = now.getFullYear();
    };
    
    // Function to handle data loading and UI updates
    const loadExpenseData = () => {
        const selectedMonthIndex = parseInt(monthSelect.value);
        const selectedYear = yearSelect.value;
        const monthName = months[selectedMonthIndex];
        const dataKey = `${selectedMonthIndex}-${selectedYear}`;
        
        // Retrieve simulated data (default to zeros if no data exists)
        const data = simulatedData[dataKey] || { income: 0, expense: 0 };
        
        // --- 3a. Update Expense Card Totals ---
        const remaining = data.income - data.expense;
        
        // Format the amount with the selected currency
        const formatAmount = (amount) => {
            const [symbol, code] = currentCurrency.match(/\(([^)]+)\)/) ? [currentCurrency.match(/\(([^)]+)\)/)[1], currentCurrency.split(' ')[0]] : ['₹', 'INR'];
            return `${symbol}${amount.toLocaleString('en-IN')}`;
        };

        totalExpensesElement.textContent = formatAmount(data.expense);
        totalIncomeElement.textContent = formatAmount(data.income);
        remainingBalanceElement.textContent = formatAmount(remaining);
        
        // --- 3b. Update UI Text ---
        currentMonthNameDisplays.forEach(el => {
            el.textContent = monthName;
        });

        // Update the combined month/year display
        currentYearDisplay.textContent = `${monthName} ${selectedYear}`;

        // Update the category breakdown title
        categoryBreakdownMonthYear.textContent = `${monthName} ${selectedYear}`;
        
        console.log(`Data loaded for: ${monthName}, ${selectedYear}. Income: ${data.income}, Expense: ${data.expense}`);
    };

    // Event listeners for month/year change
    monthSelect.addEventListener('change', loadExpenseData);
    yearSelect.addEventListener('change', loadExpenseData);

    // Initialize selectors and load initial data
    populateDateSelectors();
    
    // NOTE: loadExpenseData() is called after successful guest login to ensure the app is visible first.
    // However, it must be called here to set the correct initial state before login as well.
    loadExpenseData();
});
