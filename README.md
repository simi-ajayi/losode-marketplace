# Losode Marketplace (E-commerce App)

Losode-inspired E-commerce web app built with:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit + redux-persist
- TanStack Query
- Ant Design
- Paystack Inline (test mode)

## Live API
All product/category data is fetched from the Platzi Fake Store API.
- Docs: https://fakeapi.platzi.com/en
- Default base URL in this project: `https://api.escuelajs.co/api/v1`

## Features Implemented
- Product listing page (grid, image/title/price)
- Product details page
- Search by title
- Category filter + price range filter
- Proper loading and error states for queries
- Cart state with Redux Toolkit
- Derived selectors (item count and total)
- Persisted cart state using redux-persist
- Checkout page (name + email)
- Paystack modal payment trigger (inline-js)
- Success / failed / cancelled confirmation UI
- Responsive layout and reusable components

## Design Direction
- Losode-style clean luxury layout direction
- Custom typography (Manrope + Cormorant Garamond)
- Elevated cards, generous spacing, soft editorial background gradients
- Mobile + desktop responsive layouts

## Tech Stack
- `next@16` + App Router
- `react@19`
- `typescript`
- `tailwindcss@4`
- `@reduxjs/toolkit`, `react-redux`, `redux-persist`
- `@tanstack/react-query`
- `antd`, `@ant-design/nextjs-registry`
- `@paystack/inline-js`

## Project Setup
### 1. Node version (NVM 22)
```bash
nvm use 22
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

Then set your Paystack public key:
```env
NEXT_PUBLIC_PLATZI_API_URL=https://api.escuelajs.co/api/v1
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_PAYSTACK_CURRENCY=NGN
```

### 4. Run development server
```bash
npm run dev
```

### 5. Production checks
```bash
npm run lint
npm run build
```

