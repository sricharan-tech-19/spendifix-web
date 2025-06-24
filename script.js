// Currency configuration
const currencies = {
    INR: { symbol: '₹', name: 'Indian Rupee' },
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' }
};

// Categories data
const categories = {
    income: [
        { id: 'salary', name: 'Salary', icon: '💼', color: '#10B981' },
        { id: 'freelance', name: 'Freelance', icon: '💻', color: '#059669' },
        { id: 'investment', name: 'Investment', icon: '📈', color: '#047857' },
        { id: 'business', name: 'Business', icon: '🏢', color: '#065F46' },
        { id: 'other-income', name: 'Other Income', icon: '💰', color: '#064E3B' }
    ],
    expense: [
        { id: 'food', name: 'Food & Dining', icon: '🍽️', color: '#EF4444' },
        { id: 'transportation', name: 'Transportation', icon: '🚗', color: '#F97316' },
        { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8B5CF6' },
        { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#EC4899' },
        { id: 'bills', name: 'Bills & Utilities', icon: '⚡', color: '#06B6D4' },
        { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#84CC16' },
        { id: 'education', name: 'Education', icon: '📚', color: '#3B82F6' },
        { id: 'travel', name: 'Travel', icon: '✈️', color: '#F59E0B' },
        { id: 'other-expense', name: 'Other Expense', icon: '📝', color: '#6B7280' }
    ]
};

// Application state
let transactions = [];
let currentTransactionType = 'expense';
let editingTransactionId = null;
let expenseChart = null;
let monthlyChart = null;
let currentCurrency = 'INR';

// DOM elements
const elements = {
    // Form elements
    transactionForm: document.getElementById('transactionForm'),
    typeButtons: document.querySelectorAll('.type-btn'),
    amountInput: document.getElementById('amount'),
    dateInput: document.getElementById('date'),
    descriptionInput: document.getElementById('description'),
    categorySelect: document.getElementById('category'),
    errorMessages: document.getElementById('errorMessages'),
    
    // Currency elements
    currencySelect: document.getElementById('currencySelect'),
    currencySymbol: document.getElementById('currencySymbol'),
    editCurrencySymbol: document.getElementById('editCurrencySymbol'),
    
    // Summary elements
    totalIncome: document.getElementById('totalIncome'),
    totalExpenses: document.getElementById('totalExpenses'),
    netIncome: document.getElementById('netIncome'),
    transactionCount: document.getElementById('transactionCount'),
    
    // Filter elements
    searchInput: document.getElementById('searchInput'),
    typeFilter: document.getElementById('typeFilter'),
    categoryFilter: document.getElementById('categoryFilter'),
    startDate: document.getElementById('startDate'),
    endDate: document.getElementById('endDate'),
    clearFilters: document.getElementById('clearFilters'),
    
    // Transaction list
    transactionList: document.getElementById('transactionList'),
    transactionListCount: document.getElementById('transactionListCount'),
    
    // Tabs
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Modal
    editModal: document.getElementById('editModal'),
    editForm: document.getElementById('editForm'),
    editAmount: document.getElementById('editAmount'),
    editDate: document.getElementById('editDate'),
    editDescription: document.getElementById('editDescription'),
    editCategory: document.getElementById('editCategory'),
    closeModal: document.getElementById('closeModal'),
    cancelEdit: document.getElementById('cancelEdit'),
    
    // Theme and export
    themeToggle: document.getElementById('themeToggle'),
    exportBtn: document.getElementById('exportBtn'),
    importFile: document.getElementById('importFile')
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadTransactions();
    loadCurrency();
    setupEventListeners();
    populateCategories();
    setDefaultDate();
    updateSummary();
    renderTransactions();
    initializeTheme();
    setupCharts();
    updateCurrencyDisplay();
}

// Event listeners
function setupEventListeners() {
    // Form submission
    elements.transactionForm.addEventListener('submit', handleFormSubmit);
    
    // Transaction type buttons
    elements.typeButtons.forEach(btn => {
        btn.addEventListener('click', () => handleTypeChange(btn.dataset.type));
    });
    
    // Currency selection
    elements.currencySelect.addEventListener('change', handleCurrencyChange);
    
    // Description character count
    elements.descriptionInput.addEventListener('input', updateCharCount);
    
    // Filters
    elements.searchInput.addEventListener('input', debounce(applyFilters, 300));
    elements.typeFilter.addEventListener('change', applyFilters);
    elements.categoryFilter.addEventListener('change', applyFilters);
    elements.startDate.addEventListener('change', applyFilters);
    elements.endDate.addEventListener('change', applyFilters);
    elements.clearFilters.addEventListener('click', clearAllFilters);
    
    // Tabs
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Modal
    elements.closeModal.addEventListener('click', closeEditModal);
    elements.cancelEdit.addEventListener('click', closeEditModal);
    elements.editForm.addEventListener('submit', handleEditSubmit);
    elements.editModal.addEventListener('click', (e) => {
        if (e.target === elements.editModal) closeEditModal();
    });
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Export/Import
    elements.exportBtn.addEventListener('click', exportToCSV);
    elements.importFile.addEventListener('change', handleImport);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Currency management
function handleCurrencyChange() {
    currentCurrency = elements.currencySelect.value;
    saveCurrency();
    updateCurrencyDisplay();
    updateSummary();
    renderTransactions();
    updateCharts();
}

function updateCurrencyDisplay() {
    const symbol = currencies[currentCurrency].symbol;
    elements.currencySymbol.textContent = symbol;
    elements.editCurrencySymbol.textContent = symbol;
}

function saveCurrency() {
    localStorage.setItem('spendifix-currency', currentCurrency);
}

function loadCurrency() {
    const saved = localStorage.getItem('spendifix-currency');
    if (saved && currencies[saved]) {
        currentCurrency = saved;
        elements.currencySelect.value = currentCurrency;
    }
}

// Transaction management
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        type: currentTransactionType,
        amount: parseFloat(elements.amountInput.value),
        date: elements.dateInput.value,
        description: elements.descriptionInput.value.trim(),
        category: elements.categorySelect.value,
        currency: currentCurrency
    };
    
    const validation = validateTransaction(formData);
    
    if (!validation.isValid) {
        showErrors(validation.errors);
        return;
    }
    
    addTransaction(formData);
    resetForm();
    hideErrors();
}

function validateTransaction(data) {
    const errors = [];
    
    // Amount validation
    if (!data.amount || data.amount <= 0) {
        errors.push('Amount must be a positive number');
    }
    if (data.amount > 10000000) {
        errors.push('Amount cannot exceed 10,000,000');
    }
    
    // Description validation
    if (!data.description) {
        errors.push('Description is required');
    }
    if (data.description.length > 100) {
        errors.push('Description must be less than 100 characters');
    }
    
    // Category validation
    if (!data.category) {
        errors.push('Category is required');
    }
    
    // Date validation
    if (!data.date) {
        errors.push('Date is required');
    } else {
        const selectedDate = new Date(data.date);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        if (selectedDate > today) {
            errors.push('Date cannot be in the future');
        }
        if (selectedDate < oneYearAgo) {
            errors.push('Date cannot be more than one year ago');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function addTransaction(data) {
    const transaction = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString()
    };
    
    transactions.unshift(transaction);
    saveTransactions();
    updateSummary();
    renderTransactions();
    updateCharts();
    
    // Show success feedback
    showNotification('Transaction added successfully!', 'success');
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    editingTransactionId = id;
    
    // Populate edit form
    elements.editAmount.value = transaction.amount;
    elements.editDate.value = transaction.date;
    elements.editDescription.value = transaction.description;
    
    // Populate edit category dropdown
    populateEditCategories(transaction.type);
    elements.editCategory.value = transaction.category;
    
    // Show modal
    elements.editModal.classList.add('show');
    elements.editAmount.focus();
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    if (!editingTransactionId) return;
    
    const updatedData = {
        amount: parseFloat(elements.editAmount.value),
        date: elements.editDate.value,
        description: elements.editDescription.value.trim(),
        category: elements.editCategory.value,
        currency: currentCurrency
    };
    
    const validation = validateTransaction({
        ...updatedData,
        type: transactions.find(t => t.id === editingTransactionId).type
    });
    
    if (!validation.isValid) {
        showNotification('Please fix the errors and try again', 'error');
        return;
    }
    
    updateTransaction(editingTransactionId, updatedData);
    closeEditModal();
}

function updateTransaction(id, updates) {
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return;
    
    transactions[index] = { ...transactions[index], ...updates };
    saveTransactions();
    updateSummary();
    renderTransactions();
    updateCharts();
    
    showNotification('Transaction updated successfully!', 'success');
}

function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateSummary();
    renderTransactions();
    updateCharts();
    
    showNotification('Transaction deleted successfully!', 'success');
}

// UI helpers
function handleTypeChange(type) {
    currentTransactionType = type;
    
    // Update button states
    elements.typeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    
    // Update categories
    populateCategories();
}

function populateCategories() {
    const categoryList = categories[currentTransactionType];
    elements.categorySelect.innerHTML = '<option value="">Select a category</option>';
    
    categoryList.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.icon} ${category.name}`;
        elements.categorySelect.appendChild(option);
    });
    
    // Also update filter dropdown
    populateFilterCategories();
}

function populateFilterCategories() {
    const allCategories = [...categories.income, ...categories.expense];
    elements.categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.icon} ${category.name}`;
        elements.categoryFilter.appendChild(option);
    });
}

function populateEditCategories(type) {
    const categoryList = categories[type];
    elements.editCategory.innerHTML = '<option value="">Select a category</option>';
    
    categoryList.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.icon} ${category.name}`;
        elements.editCategory.appendChild(option);
    });
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    elements.dateInput.value = today;
}

function updateCharCount() {
    const count = elements.descriptionInput.value.length;
    const charCountElement = document.querySelector('.char-count');
    charCountElement.textContent = `${count}/100 characters`;
    
    if (count > 80) {
        charCountElement.style.color = count > 100 ? '#ef4444' : '#f59e0b';
    } else {
        charCountElement.style.color = 'var(--text-muted)';
    }
}

function resetForm() {
    elements.transactionForm.reset();
    setDefaultDate();
    elements.categorySelect.value = '';
    updateCharCount();
}

function showErrors(errors) {
    const errorHtml = `
        <h4>Please fix the following errors:</h4>
        <ul>
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    elements.errorMessages.innerHTML = errorHtml;
    elements.errorMessages.style.display = 'block';
    
    // Scroll to errors
    elements.errorMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideErrors() {
    elements.errorMessages.style.display = 'none';
}

// Summary calculations
function updateSummary() {
    const summary = calculateSummary(transactions);
    
    elements.totalIncome.textContent = formatCurrency(summary.totalIncome);
    elements.totalExpenses.textContent = formatCurrency(summary.totalExpenses);
    elements.netIncome.textContent = formatCurrency(summary.netIncome);
    elements.transactionCount.textContent = summary.transactionCount.toString();
    
    // Update net income color
    const netIncomeElement = elements.netIncome;
    netIncomeElement.classList.remove('positive', 'negative');
    netIncomeElement.classList.add(summary.netIncome >= 0 ? 'positive' : 'negative');
}

function calculateSummary(transactionList) {
    const totalIncome = transactionList
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactionList
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    return {
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        transactionCount: transactionList.length
    };
}

// Transaction rendering
function renderTransactions() {
    const filteredTransactions = getFilteredTransactions();
    
    elements.transactionListCount.textContent = `${filteredTransactions.length} transaction${filteredTransactions.length !== 1 ? 's' : ''}`;
    
    if (filteredTransactions.length === 0) {
        elements.transactionList.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <h3>No transactions found</h3>
                <p>Try adjusting your filters or add a new transaction!</p>
            </div>
        `;
        return;
    }
    
    const transactionHtml = filteredTransactions.map(transaction => {
        const category = getCategoryInfo(transaction.category);
        const formattedDate = formatDate(transaction.date);
        
        return `
            <div class="transaction-item" data-id="${transaction.id}">
                <div class="transaction-main">
                    <div class="transaction-icon" style="background-color: ${category.color}">
                        ${category.icon}
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.description}</h4>
                        <div class="transaction-meta">
                            <span class="transaction-type ${transaction.type}">${transaction.type}</span>
                            <span>${category.name}</span>
                            <span>${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
                </div>
                <div class="transaction-actions">
                    <button class="action-btn edit" onclick="editTransaction('${transaction.id}')" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteTransaction('${transaction.id}')" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    elements.transactionList.innerHTML = transactionHtml;
}

// Filtering
function getFilteredTransactions() {
    let filtered = [...transactions];
    
    // Search filter
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(t => 
            t.description.toLowerCase().includes(searchTerm) ||
            getCategoryInfo(t.category).name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Type filter
    const typeFilter = elements.typeFilter.value;
    if (typeFilter !== 'all') {
        filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    // Category filter
    const categoryFilter = elements.categoryFilter.value;
    if (categoryFilter) {
        filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    // Date range filter
    const startDate = elements.startDate.value;
    const endDate = elements.endDate.value;
    
    if (startDate) {
        filtered = filtered.filter(t => t.date >= startDate);
    }
    
    if (endDate) {
        filtered = filtered.filter(t => t.date <= endDate);
    }
    
    return filtered;
}

function applyFilters() {
    renderTransactions();
}

function clearAllFilters() {
    elements.searchInput.value = '';
    elements.typeFilter.value = 'all';
    elements.categoryFilter.value = '';
    elements.startDate.value = '';
    elements.endDate.value = '';
    applyFilters();
}

// Tabs
function switchTab(tabName) {
    // Update tab buttons
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}Tab`);
    });
    
    // Update charts if switching to analytics
    if (tabName === 'analytics') {
        setTimeout(updateCharts, 100); // Small delay to ensure proper rendering
    }
}

// Modal management
function closeEditModal() {
    elements.editModal.classList.remove('show');
    editingTransactionId = null;
    elements.editForm.reset();
}

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('spendifix-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('spendifix-theme', newTheme);
    
    // Update charts with new theme
    setTimeout(updateCharts, 100);
}

// Charts
function setupCharts() {
    const ctx1 = document.getElementById('expenseChart');
    const ctx2 = document.getElementById('monthlyChart');
    
    if (ctx1) {
        expenseChart = new Chart(ctx1, {
            type: 'pie',
            data: { labels: [], datasets: [] },
            options: getChartOptions('pie')
        });
    }
    
    if (ctx2) {
        monthlyChart = new Chart(ctx2, {
            type: 'bar',
            data: { labels: [], datasets: [] },
            options: getChartOptions('bar')
        });
    }
    
    updateCharts();
}

function updateCharts() {
    if (!expenseChart || !monthlyChart) return;
    
    updateExpenseChart();
    updateMonthlyChart();
}

function updateExpenseChart() {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals = getCategoryTotals(expenseTransactions);
    
    if (categoryTotals.length === 0) {
        expenseChart.data = {
            labels: ['No data'],
            datasets: [{
                data: [1],
                backgroundColor: ['#e5e7eb'],
                borderWidth: 0
            }]
        };
    } else {
        expenseChart.data = {
            labels: categoryTotals.map(item => {
                const category = getCategoryInfo(item.category);
                return `${category.icon} ${category.name}`;
            }),
            datasets: [{
                data: categoryTotals.map(item => item.amount),
                backgroundColor: categoryTotals.map(item => getCategoryInfo(item.category).color),
                borderWidth: 2,
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary')
            }]
        };
    }
    
    expenseChart.update();
}

function updateMonthlyChart() {
    const monthlyData = getMonthlyTrends(transactions);
    
    if (monthlyData.length === 0) {
        monthlyChart.data = {
            labels: ['No data'],
            datasets: [{
                label: 'No data',
                data: [0],
                backgroundColor: '#e5e7eb'
            }]
        };
    } else {
        monthlyChart.data = {
            labels: monthlyData.map(item => {
                const date = new Date(item.month + '-01');
                return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }),
            datasets: [
                {
                    label: 'Income',
                    data: monthlyData.map(item => item.income),
                    backgroundColor: '#10b981',
                    borderRadius: 6
                },
                {
                    label: 'Expenses',
                    data: monthlyData.map(item => item.expenses),
                    backgroundColor: '#ef4444',
                    borderRadius: 6
                }
            ]
        };
    }
    
    monthlyChart.update();
}

function getCategoryTotals(transactionList) {
    const categoryMap = new Map();
    
    transactionList.forEach(transaction => {
        const current = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, current + transaction.amount);
    });
    
    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
        category,
        amount
    }));
}

function getMonthlyTrends(transactionList) {
    const monthlyMap = new Map();
    
    transactionList.forEach(transaction => {
        const month = transaction.date.substring(0, 7); // YYYY-MM
        const current = monthlyMap.get(month) || { income: 0, expenses: 0 };
        
        if (transaction.type === 'income') {
            current.income += transaction.amount;
        } else {
            current.expenses += transaction.amount;
        }
        
        monthlyMap.set(month, current);
    });
    
    return Array.from(monthlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
            month,
            ...data,
            net: data.income - data.expenses
        }));
}

function getChartOptions(type) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
    
    if (type === 'pie') {
        return {
            ...baseOptions,
            plugins: {
                ...baseOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(context.raw)} (${percentage}%)`;
                        }
                    }
                }
            }
        };
    }
    
    if (type === 'bar') {
        return {
            ...baseOptions,
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                y: {
                    ticks: { 
                        color: textColor,
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    grid: { color: gridColor }
                }
            }
        };
    }
    
    return baseOptions;
}

// Data persistence
function saveTransactions() {
    try {
        localStorage.setItem('spendifix-transactions', JSON.stringify(transactions));
    } catch (error) {
        console.error('Failed to save transactions:', error);
        showNotification('Failed to save data', 'error');
    }
}

function loadTransactions() {
    try {
        const saved = localStorage.getItem('spendifix-transactions');
        transactions = saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to load transactions:', error);
        transactions = [];
        showNotification('Failed to load saved data', 'error');
    }
}

// Export/Import
function exportToCSV() {
    if (transactions.length === 0) {
        showNotification('No transactions to export', 'warning');
        return;
    }
    
    const headers = ['Date', 'Type', 'Description', 'Category', 'Amount', 'Currency'];
    const csvContent = [
        headers.join(','),
        ...transactions.map(t => [
            t.date,
            t.type,
            `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in description
            getCategoryInfo(t.category).name,
            t.amount,
            t.currency || currentCurrency
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `spendifix-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Transactions exported successfully!', 'success');
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let importedTransactions = [];
            
            if (file.name.endsWith('.json')) {
                importedTransactions = JSON.parse(content);
            } else if (file.name.endsWith('.csv')) {
                importedTransactions = parseCSV(content);
            } else {
                throw new Error('Unsupported file format');
            }
            
            if (!Array.isArray(importedTransactions)) {
                throw new Error('Invalid file format');
            }
            
            // Validate imported transactions
            const validTransactions = importedTransactions.filter(t => 
                t.id && t.type && t.amount && t.description && t.category && t.date
            );
            
            if (validTransactions.length === 0) {
                throw new Error('No valid transactions found');
            }
            
            // Merge with existing transactions (avoid duplicates)
            const existingIds = new Set(transactions.map(t => t.id));
            const newTransactions = validTransactions.filter(t => !existingIds.has(t.id));
            
            transactions = [...transactions, ...newTransactions];
            saveTransactions();
            updateSummary();
            renderTransactions();
            updateCharts();
            
            showNotification(`Successfully imported ${newTransactions.length} transactions!`, 'success');
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Failed to import transactions. Please check the file format.', 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const transactions = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = parseCSVLine(line);
        if (values.length >= 6) {
            transactions.push({
                id: generateId(),
                date: values[0],
                type: values[1],
                description: values[2].replace(/^"|"$/g, '').replace(/""/g, '"'), // Remove quotes and unescape
                category: findCategoryId(values[3]),
                amount: parseFloat(values[4]),
                currency: values[5] || currentCurrency,
                createdAt: new Date().toISOString()
            });
        }
    }
    
    return transactions;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

function findCategoryId(categoryName) {
    const allCategories = [...categories.income, ...categories.expense];
    const found = allCategories.find(cat => cat.name === categoryName);
    return found ? found.id : 'other-expense';
}

// Utility functions
function getCategoryInfo(categoryId) {
    const allCategories = [...categories.income, ...categories.expense];
    return allCategories.find(cat => cat.id === categoryId) || {
        name: categoryId,
        icon: '📝',
        color: '#6B7280'
    };
}

function formatCurrency(amount) {
    const symbol = currencies[currentCurrency].symbol;
    
    // Format based on currency
    if (currentCurrency === 'INR') {
        // Indian number format with lakhs and crores
        return symbol + amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else {
        return symbol + amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + N: Focus on amount input (new transaction)
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        elements.amountInput.focus();
    }
    
    // Escape: Close modal
    if (e.key === 'Escape') {
        if (elements.editModal.classList.contains('show')) {
            closeEditModal();
        }
    }
    
    // Ctrl/Cmd + E: Export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportToCSV();
    }
    
    // Ctrl/Cmd + /: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        elements.searchInput.focus();
    }
}

// Make functions globally available for onclick handlers
window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;
