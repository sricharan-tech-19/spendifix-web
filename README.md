# Spendifix - Smart Expense Tracker
try it: https://spendifix.vercel.app/
A comprehensive web-based expense tracking application built with HTML, CSS, and JavaScript. Track your income and expenses with beautiful visualizations, multiple currency support, and powerful filtering capabilities.

## 🌟 Features

### Core Functionality
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Multi-Currency Support**: Support for INR (Indian Rupee), USD, EUR, and GBP with proper formatting
- **Category Organization**: Pre-defined categories for both income and expenses with colorful icons
- **Real-time Calculations**: Automatic calculation of total income, expenses, and net income
- **Data Persistence**: All data is saved locally in your browser

### Advanced Features
- **Search & Filter**: Filter transactions by type, category, date range, or search by description
- **Visual Analytics**: Interactive pie charts for expense breakdown and bar charts for monthly trends
- **Dark/Light Theme**: Toggle between light and dark themes with smooth transitions
- **Export/Import**: Export data to CSV format and import from JSON/CSV files
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: Quick access to common functions

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Download all project files to a folder on your computer
2. Open `index.html` in your web browser
3. Start tracking your expenses immediately!

### File Structure
```
spendifix/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and themes
├── script.js           # JavaScript functionality
└── README.md           # This documentation file
```

## 📖 How to Use

### Adding Transactions
1. **Select Transaction Type**: Click either "Expense" or "Income" button
2. **Enter Amount**: Input the transaction amount (supports up to 2 decimal places)
3. **Set Date**: Choose the transaction date (defaults to today)
4. **Add Description**: Enter a meaningful description (max 100 characters)
5. **Choose Category**: Select from predefined categories
6. **Submit**: Click "Add Transaction" to save

### Managing Transactions
- **View All**: See all transactions in the "Transactions" tab
- **Edit**: Click the edit icon (pencil) next to any transaction
- **Delete**: Click the delete icon (trash) and confirm deletion
- **Filter**: Use the filter section to narrow down transactions by:
  - Search term (description or category)
  - Transaction type (income/expense/all)
  - Category
  - Date range

### Currency Selection
- Use the currency dropdown in the header to switch between:
  - ₹ INR (Indian Rupee) - Default
  - $ USD (US Dollar)
  - € EUR (Euro)
  - £ GBP (British Pound)
- All amounts will be formatted according to the selected currency

### Analytics
1. Switch to the "Analytics" tab to view:
   - **Expense Breakdown**: Pie chart showing expense distribution by category
   - **Monthly Overview**: Bar chart comparing income vs expenses by month

### Data Management
- **Export**: Click "Export CSV" to download your data
- **Import**: Click "Import" to upload JSON or CSV files
- **Automatic Save**: All changes are automatically saved to your browser

### Theme Toggle
- Click the sun/moon icon in the header to switch between light and dark themes
- Your preference is automatically saved

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + N`: Focus on amount input (quick new transaction)
- `Ctrl/Cmd + E`: Export data to CSV
- `Ctrl/Cmd + /`: Focus on search input
- `Escape`: Close any open modal

## 🎨 Categories

### Income Categories
- 💼 Salary
- 💻 Freelance
- 📈 Investment
- 🏢 Business
- 💰 Other Income

### Expense Categories
- 🍽️ Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 🎬 Entertainment
- ⚡ Bills & Utilities
- 🏥 Healthcare
- 📚 Education
- ✈️ Travel
- 📝 Other Expense

## 💾 Data Storage

- **Local Storage**: All data is stored in your browser's local storage
- **Privacy**: No data is sent to external servers
- **Backup**: Regular exports are recommended to prevent data loss
- **Capacity**: Can handle thousands of transactions efficiently

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Streamlined interface for small screens

## 🔧 Technical Details

### Code Structure

#### HTML (index.html)
- Semantic HTML5 structure
- Accessible form elements
- Modal dialogs for editing
- Canvas elements for charts

#### CSS (styles.css)
- CSS Custom Properties for theming
- Flexbox and Grid layouts
- Smooth animations and transitions
- Media queries for responsiveness
- Print-friendly styles

#### JavaScript (script.js)
- Modular function organization
- Event-driven architecture
- Local storage management
- Chart.js integration
- Input validation and error handling

### Key Functions

#### Data Management
- `addTransaction()`: Add new transactions
- `updateTransaction()`: Edit existing transactions
- `deleteTransaction()`: Remove transactions
- `saveTransactions()`: Persist to local storage
- `loadTransactions()`: Retrieve from local storage

#### UI Updates
- `renderTransactions()`: Display transaction list
- `updateSummary()`: Calculate and show totals
- `updateCharts()`: Refresh analytics charts
- `applyFilters()`: Filter transaction display

#### Utilities
- `formatCurrency()`: Format amounts by currency
- `validateTransaction()`: Input validation
- `exportToCSV()`: Data export functionality
- `handleImport()`: Data import functionality

## 🐛 Troubleshooting

### Common Issues

**Transactions not saving**
- Ensure your browser allows local storage
- Check if you're in private/incognito mode
- Clear browser cache and try again

**Charts not displaying**
- Ensure JavaScript is enabled
- Check browser console for errors
- Try refreshing the page

**Import not working**
- Verify file format (JSON or CSV)
- Check file structure matches expected format
- Ensure file size is reasonable

**Mobile display issues**
- Try rotating device orientation
- Zoom out if elements appear cut off
- Clear browser cache


## 🔒 Privacy & Security

- **No External Connections**: All data stays on your device
- **No User Tracking**: No analytics or tracking scripts
- **Local Storage Only**: Data never leaves your browser
- **No Account Required**: Use immediately without registration

## 🚀 Performance

- **Fast Loading**: Minimal dependencies, quick startup
- **Efficient Rendering**: Optimized DOM updates
- **Memory Management**: Proper cleanup and garbage collection
- **Smooth Animations**: Hardware-accelerated CSS transitions

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

While this is a standalone project, suggestions and improvements are welcome:
1. Test the application thoroughly
2. Report any bugs or issues
3. Suggest new features or improvements
4. Share feedback on user experience

## 📞 Support

For questions or issues:
1. Check this README for common solutions
2. Review the troubleshooting section
3. Test in different browsers
4. Check browser console for error messages

---

**Spendifix** - Making expense tracking simple, beautiful, and efficient! 💰✨
