document.addEventListener('DOMContentLoaded', () => {
    // --- Screen and Element Selectors ---
    const splashScreen = document.getElementById('splashScreen');
    const mainAppScreen = document.getElementById('mainAppScreen');
    const continueGuestBtn = document.getElementById('continueGuestBtn');
    const guestNameModal = document.getElementById('guestNameModal');
    const guestNameInput = document.getElementById('guestNameInput');
    const saveGuestNameBtn = document.getElementById('saveGuestNameBtn');
    const userNameDisplay = document.getElementById('userNameDisplay');

    const expenseManagerTab = document.getElementById('expenseManagerTab');
    const splitExpenseTab = document.getElementById('splitExpenseTab');
    const expenseManagerView = document.getElementById('expenseManagerView');
    const splitExpenseView = document.getElementById('splitExpenseView');
    
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userDropdown = document.getElementById('userDropdown');

    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const currentMonthNameDisplays = document.querySelectorAll('.current-month-display-name');
    const categoryBreakdownMonthYear = document.getElementById('categoryBreakdownMonthYear');
    const currencySelect = document.getElementById('currencySelect');

    const totalExpensesElement = document.getElementById('totalExpenses');
    const totalIncomeElement = document.getElementById('totalIncome');
    const remainingBalanceElement = document.getElementById('remainingBalance');
    const transactionListElement = document.getElementById('transactionList');
    const noTransactionDataElement = document.getElementById('noTransactionData');


    // --- Data Variables (Simulated for Demo) ---
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    let userName = 'Guest';
    let currentCurrencySymbol = '₹';

    // Simulated data structure: { 'MonthIndex-Year': { income: 0, expense: 0, transactions: [] } }
    const simulatedData = {
        '8-2025': { 
            income: 55000, 
            expense: 28500,
            transactions: [
                { type: 'expense', category: 'Food', notes: 'Dinner with friends', amount: 8500 },
                { type: 'expense', category: 'Rent', notes: 'Monthly apartment rent', amount: 20000 },
            ]
        },
        '7-2025': { 
            income: 60000, 
            expense: 35000,
            transactions: [
                { type: 'income', category: 'Salary', notes: 'Monthly paycheck', amount: 60000 },
                { type: 'expense', category: 'Travel', notes: 'Flight to Delhi', amount: 15000 },
                { type: 'expense', category: 'Shopping', notes: 'New shirt and trousers', amount: 20000 },
            ]
        },
        '6-2025': { 
            income: 45000, 
            expense: 15000,
            transactions: [] // Empty list to test 'No data' state
        }
    };


    // --- CORE APP FUNCTIONS ---

    // Formats amount with the current currency symbol
    const formatAmount = (amount) => {
        // Simple Indian locale formatting for demonstration
        return `${currentCurrencySymbol}${amount.toLocaleString('en-IN')}`;
    };

    // Renders the transaction list based on selected data
    const renderTransactions = (transactions) => {
        transactionListElement.innerHTML = '';
        if (!transactions || transactions.length === 0) {
            noTransactionDataElement.classList.remove('hidden');
            return;
        }

        noTransactionDataElement.classList.add('hidden');
        
        transactions.forEach(t => {
            const item = document.createElement('div');
            item.classList.add('transaction-item');
            
            const amountClass = t.type === 'expense' ? 'transaction-amount' : 'transaction-amount income';
            
            item.innerHTML = `
                <span class="transaction-category">${t.category}</span>
                <span class="transaction-notes">${t.notes}</span>
                <span class="${amountClass}">${formatAmount(t.amount)}</span>
            `;
            transactionListElement.appendChild(item);
        });
    };
    
    // Function to handle data loading and UI updates
    const loadExpenseData = () => {
        const selectedMonthIndex = parseInt(monthSelect.value);
        const selectedYear = yearSelect.value;
        const monthName = months[selectedMonthIndex];
        const dataKey = `${selectedMonthIndex}-${selectedYear}`;
        
        // Retrieve simulated data
        const data = simulatedData[dataKey] || { income: 0, expense: 0, transactions: [] };
        
        // --- 3a. Update Expense Card Totals ---
        const remaining = data.income - data.expense;

        totalExpensesElement.textContent = formatAmount(data.expense);
        totalIncomeElement.textContent = formatAmount(data.income);
        remainingBalanceElement.textContent = formatAmount(remaining);
        
        // Update transaction count
        const expenseCount = data.transactions.filter(t => t.type === 'expense').length;
        document.getElementById('expenseTransactions').textContent = `${expenseCount} transactions this period`;

        // --- 3b. Update UI Text ---
        currentMonthNameDisplays.forEach(el => {
            el.textContent = monthName;
        });

        // Update the combined month/year selector text
        const monthOption = monthSelect.options[monthSelect.selectedIndex];
        if (monthOption) {
            monthOption.textContent = monthName; // Update text for month select
        }
        
        categoryBreakdownMonthYear.textContent = `${monthName} ${selectedYear}`;

        // --- 3c. Render Transactions ---
        renderTransactions(data.transactions);
    };

    // --- INITIALIZATION ---

    const populateDateSelectors = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Populate Months
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
            if (index === currentMonth) option.selected = true;
        });

        // Populate Years (Current year and last 4 years)
        for (let i = 0; i < 5; i++) {
            const year = currentYear - i;
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
            if (year === currentYear) option.selected = true;
        }
    };
    
    // --- EVENT LISTENERS ---

    // Initial load
    populateDateSelectors();
    loadExpenseData();
    
    // Event listeners for month/year change
    monthSelect.addEventListener('change', loadExpenseData);
    yearSelect.addEventListener('change', loadExpenseData);

    // Currency Switch Logic
    currencySelect.addEventListener('change', () => {
        // Extract the symbol from the selected option (e.g., "₹ INR" -> "₹")
        currentCurrencySymbol = currencySelect.value.split(' ')[0]; 
        loadExpenseData(); // Re-render data with the new symbol
    });

    // Login Flow
    continueGuestBtn.addEventListener('click', () => {
        guestNameModal.classList.add('active');
    });

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
            alert(`Hello ${userName}, welcome to Spendezy!`); 
            userNameDisplay.textContent = userName;
        }, 300);
    });
    
    // Navigation and Dropdown Logic
    userMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });

    expenseManagerTab.addEventListener('click', () => {
        switchTab(expenseManagerTab, expenseManagerView);
    });

    splitExpenseTab.addEventListener('click', () => {
        switchTab(splitExpenseTab, splitExpenseView);
    });
    
    // Utility for tab switching
    const switchTab = (activeTab, activeView) => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        activeTab.classList.add('active');
        activeView.classList.add('active');
    };
    
    // Split Expense Navigation
    document.getElementById('createGroupBtn').addEventListener('click', () => {
        document.getElementById('groupList').classList.remove('active');
        document.getElementById('groupDetail').classList.add('active');
    });
    
    document.getElementById('backToGroups').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('groupList').classList.add('active');
        document.getElementById('groupDetail').classList.remove('active');
    });
});
