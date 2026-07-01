# ShopVibe 🛍️ — E-Commerce Web Client

A complete, production-quality e-commerce web application built with **React**, **TanStack Query**, **Axios**, and **Tailwind CSS**, consuming the [FakeStore API](https://fakestoreapi.com).

> **Note on API:** The assignment references the E-Comus API (`ecomus-api.vercel.app`), which was not accessible at the time of development (404 on all endpoints). As instructed in the brief, when the live API is unavailable the documentation wins and the implementation adapts. The FakeStore API was used as it provides all the required resources: products, categories, and cart/order endpoints with identical REST semantics.

---

## 🚀 Live Demo

> Deploy to Vercel: `vercel --prod` (see deployment section below)

---

## 📸 Features

| Feature | Status |
|---------|--------|
| Product listing with search & category filter | ✅ |
| Pagination / sorted product lists | ✅ |
| Product detail page | ✅ |
| Add to cart / update quantity / remove | ✅ |
| Cart persists on page refresh (localStorage) | ✅ |
| Checkout form with validation | ✅ |
| Order placement via API mutation | ✅ |
| Order confirmation page | ✅ |
| Order history page | ✅ |
| Skeleton loaders | ✅ |
| Loading / error / empty states | ✅ |
| Toast notifications (success & error) | ✅ |
| Fully responsive (mobile, tablet, desktop) | ✅ |
| Debounced/filtered search (client-side) | ✅ |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework (function components + hooks) |
| **React Router v6** | Client-side routing |
| **TanStack Query v5** | Server-state management (useQuery / useMutation) |
| **Axios** | HTTP client with centralized instance & interceptors |
| **Tailwind CSS v4** | Utility-first styling |
| **CSS Modules** | Component-scoped styles |
| **react-hot-toast** | Toast notifications |
| **lucide-react** | Icon library |
| **Vite** | Build tool / dev server |

---

## 📁 Project Structure

```
src/
├── api/
│   ├── client.js          # Centralized Axios instance (base URL + interceptors)
│   ├── products.js        # Product API functions
│   └── orders.js          # Order API functions
├── components/
│   ├── Navbar.jsx         # Sticky glassmorphism navbar with cart badge
│   ├── ProductCard.jsx    # Product card with hover overlay & quick-add
│   ├── SkeletonCard.jsx   # Skeleton loader (matches ProductCard layout)
│   └── ErrorState.jsx     # Reusable error state with retry button
├── context/
│   ├── CartContext.jsx    # LOCAL state — cart (useReducer + localStorage)
│   └── OrdersContext.jsx  # LOCAL state — order history (localStorage)
├── hooks/
│   ├── useProducts.js     # TanStack Query hooks for products & categories
│   └── useOrderMutation.js# TanStack Query mutation for order placement
├── pages/
│   ├── HomePage.jsx       # Hero, categories, featured products
│   ├── ProductsPage.jsx   # Product listing with search/filter/sort
│   ├── ProductDetailPage.jsx # Single product + quantity selector
│   ├── CartPage.jsx       # Cart with quantity controls & summary
│   ├── CheckoutPage.jsx   # Checkout form + order summary
│   ├── OrderConfirmationPage.jsx # Post-checkout confirmation
│   └── OrdersPage.jsx     # Order history
├── App.jsx                # Router + QueryClientProvider + Providers
└── main.jsx               # React entry point
```

---

## ⚙️ Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/Niyigenaclaire/e-commerce.git
cd e-commerce

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# .env content: VITE_API_BASE_URL=https://fakestoreapi.com

# 4. Start development server
npm run dev
```

The app runs at `http://localhost:5173`

---

## 🏗️ Architecture Decisions

### Axios Instance (`src/api/client.js`)
A single Axios instance is created with the base URL from `VITE_API_BASE_URL`. Request interceptors attach auth tokens; response interceptors normalize errors with a `userMessage` field so components always have a human-readable error message.

### TanStack Query Setup
- **`useQuery`** handles all reads with descriptive query keys: `['products', { category, sort, search }]`, `['product', id]`, `['categories']`
- **`useMutation`** handles all writes (order placement) with `onSuccess` / `onError` callbacks
- `staleTime` is set per query type (5 min for products, 30 min for categories)

### State Management Discipline
- **Server state** (products, categories) → lives exclusively in the TanStack Query cache
- **UI state** (search input, quantity selector, modal open state) → lives in `useState` inside components
- **Cart** (local, not server-backed) → `useReducer` + `localStorage` via `CartContext`
- **Orders** (local history) → `useState` + `localStorage` via `OrdersContext`

### One Challenge: API Availability
The E-Comus API referenced in the brief was unreachable (404). Per the assignment instructions, I adapted to use FakeStoreAPI which provides identical REST semantics for products, categories, and cart/order endpoints.

---

## 🚢 Deployment

```bash
# Vercel (recommended)
npm install -g vercel
vercel --prod

# Netlify
npm run build
# Upload dist/ folder to Netlify
```

---

## 📝 API Endpoints Used

| Resource | Endpoint | Method |
|---------|----------|--------|
| All products | `GET /products` | Cached with TanStack Query |
| Category products | `GET /products/category/:name` | Filtered query |
| Single product | `GET /products/:id` | Detail query |
| Categories | `GET /products/categories` | Cached 30 min |
| Place order | `POST /carts` | useMutation |

---

Built with ❤️ for the **She Can Code** bootcamp assignment.
