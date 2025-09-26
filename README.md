# AEON Web Engineer Assessment

This project contains solutions for the AEON web engineer assessment challenges, including a multi-step login flow with MFA, and a transaction dashboard.

## Prerequisites

- Node.js (Recommended v18+)
- npm or yarn

## Installation and Setup

1. Install dependencies:
- npm install or yarn install

## Running the Development Server

Start the Next.js development server:
npm run dev
or 
yarn dev

The app will be available at [http://localhost:3000](http://localhost:3000)

## Available Pages & APIs

- **Login flow**: [http://localhost:3000/login](http://localhost:3000/login)
  - Multi-step login form
  - Calls APIs for secure word generation, login, and MFA verification

- **Transaction Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
  - Displays transactions fetched from `/api/transaction-history`

- **API Endpoints**:
  - `POST /api/getSecureWord`: generate secure word for username
  - `POST /api/login`: login with username, secure word, hashed password
  - `POST /api/verifyMfa`: verify MFA 6-digit code
  - `GET  /api/transaction-history`: fetch transaction data

## Notes

- The backend uses in-memory data stores and mock implementations for demonstration.
- Passwords are hashed client-side but no real authentication is done.
- MFA code is simulated as '123456'.
- JWT token is mocked and stored in localStorage.
- For production, replace in-memory stores with a persistent database/cache.

## Build

To create an optimized production build:

npm run build
npm start




