# OverSpend - Personal Finance Tracking App

A comprehensive web application for tracking personal finances, replicating and enhancing the functionality of your Google Sheets "Money Checker" spreadsheet.

## Features

### Dashboard
- Real-time financial overview with key metrics
- Total income and expenses for the current month
- Current balance and daily budget calculations
- Weekly and monthly spending progress bars
- Risk level assessment
- Days until zero (runway) calculation based on spending patterns

### Income & Expenses Management
- Add, edit, and delete income transactions
- Add, edit, and delete expense transactions
- Categorize transactions
- Add descriptions and notes
- Mark expenses as recurring
- Filter and search capabilities
- Date-based organization

### Categories Management
- Create custom income and expense categories
- Set monthly budget limits per category
- Customize category colors
- Activate/deactivate categories
- Visual organization with color-coded cards

### Monthly Control
- Complete monthly financial overview
- Income vs expenses comparison
- Budget progress tracking
- Risk assessment based on spending thresholds
- Category-wise expense breakdown with budget comparison
- Visual progress bars for each category

### Weekly Control
- Weekly spending overview
- Daily expense breakdown
- Week-to-date spending progress
- Remaining weekly budget
- Recent expense list

### Settings
- Currency selection (USD, EUR, GBP, JPY, and more)
- Configure start of month and week
- Set monthly income targets
- Set monthly and weekly expense limits
- Choose daily budget calculation mode (fixed or calculated)
- Customize risk thresholds (low, medium, high)

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Lucide React for icons

### Backend & Database
- Supabase (PostgreSQL) for data storage
- Row Level Security (RLS) for data protection
- Real-time data synchronization

### Authentication
- Supabase Auth with email/password
- Secure user sessions
- Protected routes

## Database Schema

### Tables
1. **user_profiles** - User account information
2. **categories** - Income and expense categories with budget limits
3. **income** - Income transaction records
4. **expenses** - Expense transaction records
5. **user_settings** - User-specific application settings

All tables include Row Level Security policies ensuring users can only access their own data.

## Financial Calculations

### Daily Budget
Calculated based on:
- Current balance (income - expenses)
- Days remaining in the month
- Or fixed amount if configured

### Risk Level
Determined by spending percentage against monthly limit:
- Low: < 50% (default)
- Medium: 50-75% (default)
- High: 75-90% (default)
- Critical: > 90%

### Days Until Zero
Calculated using:
- Current balance
- Average daily spending from last 30 days
- Projects when funds will be depleted

### Monthly/Weekly Control
- Tracks spending against configured limits
- Shows progress with visual indicators
- Category-wise budget tracking

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env`

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

### First Time Setup

1. Sign up for a new account using email and password
2. Navigate to Settings and configure:
   - Your preferred currency
   - Monthly income target
   - Monthly and weekly expense limits
   - Start of month and week
   - Risk thresholds
3. Create categories for your income and expenses
4. Start adding transactions!

## Usage Guide

### Adding Transactions

**Income:**
1. Navigate to Income tab
2. Click "Add Income"
3. Fill in amount, date, category, and description
4. Save

**Expenses:**
1. Navigate to Expenses tab
2. Click "Add Expense"
3. Fill in amount, date, category, and description
4. Optionally mark as recurring
5. Save

### Managing Categories

1. Navigate to Categories tab
2. Click "Add Category"
3. Choose type (income or expense)
4. Set name and budget limit
5. Select a color for visual identification
6. Save

### Viewing Analytics

**Dashboard:**
- Quick overview of your financial status
- Key metrics at a glance

**Monthly Control:**
- Detailed monthly breakdown
- Category-wise spending analysis
- Budget vs actual comparison

**Weekly Control:**
- Week-to-date spending
- Daily expense patterns
- Remaining weekly budget

## Security Features

- All data is encrypted in transit and at rest
- Row Level Security ensures data isolation between users
- Secure authentication with Supabase Auth
- No data is shared between users
- Session management with automatic token refresh

## Deployment

The application is ready for deployment to:
- Vercel (recommended for frontend)
- Netlify
- AWS Amplify
- Any static hosting service

Supabase provides the hosted database and authentication backend.

## Future Enhancements

Potential features for future versions:
- Google Sheets sync for importing existing data
- Data export to CSV/Excel
- Budget notifications and alerts
- Recurring transaction automation
- Multi-currency support
- Charts and visualizations
- Mobile app (React Native)
- Offline support
- Receipt photo uploads
- Budget forecasting with AI

## Support

For issues or questions, please review the documentation or check the application settings.

## License

This project is private and confidential.
