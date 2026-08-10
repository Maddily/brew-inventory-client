# Brew Inventory — Client

React frontend for Brew Inventory, a full-stack inventory management app for a specialty tea and coffee store.

> **Work in progress.** Deployment coming soon.

## Related repository

[brew-inventory-server](https://github.com/Maddily/brew-inventory-server) — Express/PostgreSQL API

## Features

- Browse inventory by category or view all products at once
- Filter products by category, availability and product attributes
- Search products by name
- Add, edit, and delete products with category-specific attribute fields
- Availability status derived from stock quantity (in stock / low stock / out of stock)
- Fully responsive: mobile bottom navigation, desktop top navigation
- Accessible markup throughout

## Tech stack

- **React** with **Vite**
- **React Router** for client-side routing

## Views

| Route                | Component     | Description                                |
| -------------------- | ------------- | ------------------------------------------ |
| `/`                  | `Categories`  | Grid of all categories with product counts |
| `/products`          | `Products`    | Full product list with search and filter   |
| `/categories/:id`    | `Products`    | Products filtered by category              |
| `/products/:id`      | `Product`     | Single product detail with attributes      |
| `/products/new`      | `AddProduct`  | Add a new product                          |
| `/products/:id/edit` | `EditProduct` | Edit an existing product                   |

## Project structure

```
└── 📁brew-inventory-client
    └── 📁public
        ├── apple-touch-icon.png
        ├── favicon-96x96.png
        ├── favicon.ico
        ├── favicon.svg
        ├── icons.svg
        ├── robots.txt
        ├── site.webmanifest
        ├── web-app-manifest-192x192.png
        ├── web-app-manifest-512x512.png
    └── 📁src
        └── 📁assets
            ├── logo.png
        └── 📁components
            └── 📁BottomNav
                ├── BottomNav.jsx
                ├── BottomNav.module.css
            └── 📁BottomNavLink
                ├── BottomNavLink.jsx
                ├── BottomNavLink.module.css
            └── 📁Breadcrumb
                ├── Breadcrumb.jsx
                ├── Breadcrumb.module.css
            └── 📁FieldError
                ├── FieldError.jsx
                ├── FieldError.module.css
            └── 📁FormError
                ├── FormError.jsx
                ├── FormError.module.css
            └── 📁Header
                ├── Header.jsx
                ├── Header.module.css
            └── 📁NavLink
                ├── NavLink.jsx
                ├── NavLink.module.css
            └── 📁ProductForm
                ├── ProductForm.jsx
                ├── ProductForm.module.css
        └── 📁hooks
            ├── useAvailability.jsx
            ├── useIsWide.js
            ├── useSections.js
        └── 📁pages
            └── 📁addProduct
                └── 📁components
                    └── 📁AddProduct
                        ├── AddProduct.jsx
            └── 📁categories
                └── 📁components
                    └── 📁Categories
                        ├── Categories.jsx
                        ├── Categories.module.css
                    └── 📁Category
                        ├── Category.jsx
                        ├── Category.module.css
                    └── 📁SkeletonCategories
                        ├── SkeletonCategories.jsx
                        ├── SkeletonCategories.module.css
            └── 📁editProduct
                └── 📁components
                    └── 📁EditProduct
                        ├── EditProduct.jsx
                    └── 📁SkeletonEditProduct
                        ├── SkeletonEditProduct.jsx
                        ├── SkeletonEditProduct.module.css
            └── 📁error
                └── 📁components
                    └── 📁ErrorState
                        ├── ErrorState.jsx
                        ├── ErrorState.module.css
            └── 📁productDetail
                └── 📁components
                    └── 📁DeleteModal
                        ├── DeleteModal.jsx
                        ├── DeleteModal.module.css
                    └── 📁ProductDetail
                        ├── ProductDetail.jsx
                        ├── ProductDetail.module.css
                    └── 📁SkeletonProductDetail
                        ├── SkeletonProductDetail.jsx
                        ├── SkeletonProductDetail.module.css
            └── 📁products
                └── 📁components
                    └── 📁FilterBottomSheet
                        ├── FilterBottomSheet.jsx
                        ├── FilterBottomSheet.module.css
                    └── 📁FilterDropdown
                        ├── FilterDropdown.jsx
                        ├── FilterDropdown.module.css
                    └── 📁FilterEmptyState
                        ├── FilterEmptyState.jsx
                        ├── FilterEmptyState.module.css
                    └── 📁FilterSection
                        ├── FilterSection.jsx
                        ├── FilterSection.module.css
                    └── 📁Product
                        ├── Product.jsx
                        ├── Product.module.css
                    └── 📁ProductEmptyState
                        ├── ProductEmptyState.jsx
                        ├── ProductEmptyState.module.css
                    └── 📁ProductRow
                        ├── ProductRow.jsx
                        ├── ProductRow.module.css
                    └── 📁Products
                        ├── Products.jsx
                        ├── Products.module.css
                    └── 📁ProductsTable
                        ├── ProductsTable.jsx
                        ├── ProductsTable.module.css
                    └── 📁SearchBar
                        ├── SearchBar.jsx
                        ├── SearchBar.module.css
                    └── 📁SheetChip
                        ├── SheetChip.jsx
                        ├── SheetChip.module.css
                    └── 📁SkeletonProducts
                        ├── SkeletonProducts.jsx
                        ├── SkeletonProducts.module.css
        └── 📁router
            ├── routes.jsx
        └── 📁styles
            ├── App.css
            ├── normalize.css
        └── 📁utils
            ├── filterUtils.js
            ├── utils.js
        ├── App.jsx
        ├── constants.js
        ├── contexts.js
        ├── main.jsx
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    └── vite.config.js
```

## Getting started

### Prerequisites

- Node.js
- The [brew-inventory-server](https://github.com/Maddily/brew-inventory-server) running locally

### Setup

1. Clone the repository

```bash
git clone https://github.com/Maddily/brew-inventory-client.git
cd brew-inventory-client
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

> Make sure the API server is running at `http://localhost:3000` before using the app.
