# 🍽️ Restaurant Admin Dashboard

A full-stack **MERN** application for restaurant owners to manage their menu, track orders, and view analytics. Built as part of the Eatoes Intern Technical Assessment.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)

## 🌐 Live Demo

| Component | URL |
|-----------|-----|
| Frontend | [https://eatoes-intern-assessment.netlify.app](https://eatoes-intern-assessment.netlify.app) |
| Backend API | [https://eatoes-intern-assessment.onrender.com](https://eatoes-intern-assessment.onrender.com) |

---

## ✨ Features Implemented

### Core Features
- ✅ **Menu Management** - Full CRUD operations for menu items
- ✅ **Order Dashboard** - View and manage customer orders
- ✅ **Search with Debouncing** - 300ms debounced search to minimize API calls
- ✅ **Category Filtering** - Filter menu items by category
- ✅ **Availability Toggle** - Quick toggle with optimistic UI updates
- ✅ **Status Management** - Update order status (Pending → Preparing → Ready → Delivered)
- ✅ **Pagination** - Efficient pagination for orders list
- ✅ **Analytics Dashboard** - Top sellers and revenue tracking

### Technical Highlights
- ✅ **Debouncing** - Custom `useDebounce` hook (300ms delay)
- ✅ **Optimistic UI Updates** - Instant UI feedback with rollback on error
- ✅ **MongoDB Text Indexing** - Fast full-text search on name & ingredients
- ✅ **MongoDB Aggregation** - Top 5 sellers pipeline
- ✅ **React.memo** - Component memoization for performance
- ✅ **Custom Hooks** - `useDebounce`, `useFetch`, `useOptimisticUpdate`
- ✅ **Lazy Loading** - Native image lazy loading
- ✅ **Toast Notifications** - User feedback with react-hot-toast

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router, Axios, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Styling | Vanilla CSS with CSS Variables |
| Notifications | react-hot-toast |

---

## 📁 Project Structure

```
restaurant-dashboard/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── MenuItem.js           # Menu item schema
│   │   └── Order.js              # Order schema with auto-increment
│   ├── routes/
│   │   ├── menuRoutes.js         # Menu API endpoints
│   │   ├── orderRoutes.js        # Order API endpoints
│   │   └── analyticsRoutes.js    # Analytics endpoints
│   ├── controllers/
│   │   ├── menuController.js     # Menu business logic
│   │   ├── orderController.js    # Order business logic
│   │   └── analyticsController.js
│   ├── middleware/
│   │   └── errorHandler.js       # Global error handling
│   ├── scripts/
│   │   └── seed.js               # Database seeding script
│   ├── .env.example              # Environment template
│   └── server.js                 # Entry point
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── index.js          # Axios API configuration
    │   ├── components/
    │   │   ├── ui/               # Reusable UI components
    │   │   ├── layout/           # Sidebar, Header
    │   │   ├── menu/             # MenuCard, MenuForm
    │   │   └── orders/           # OrderRow
    │   ├── hooks/
    │   │   ├── useDebounce.js    # Debounce hook
    │   │   ├── useFetch.js       # Data fetching hook
    │   │   └── useOptimisticUpdate.js
    │   ├── pages/
    │   │   ├── Dashboard.jsx     # Main dashboard
    │   │   ├── MenuManagement.jsx
    │   │   ├── OrdersDashboard.jsx
    │   │   └── Analytics.jsx
    │   ├── styles/
    │   │   └── theme.css         # CSS variables & global styles
    │   └── App.jsx               # Main app with routing
    └── .env.example              # Environment template
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (free tier)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/restaurant-dashboard.git
   cd restaurant-dashboard
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   ```

4. **Seed the Database**
   ```bash
   cd ../server
   npm run seed
   ```

5. **Start Development Servers**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

6. **Open in Browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 🔐 Environment Variables

### Server (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/restaurant_db` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |

### Client (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 📡 API Documentation

### Menu Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/menu` | Get all menu items (with filters) |
| `GET` | `/api/menu/search?q=query` | Search menu items |
| `GET` | `/api/menu/:id` | Get single menu item |
| `POST` | `/api/menu` | Create menu item |
| `PUT` | `/api/menu/:id` | Update menu item |
| `DELETE` | `/api/menu/:id` | Delete menu item |
| `PATCH` | `/api/menu/:id/availability` | Toggle availability |

#### GET /api/menu - Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category |
| `isAvailable` | boolean | Filter by availability |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |

#### Example Response
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Butter Chicken",
      "description": "Tender chicken in rich tomato-butter gravy",
      "category": "Main Course",
      "price": 449,
      "ingredients": ["Chicken", "Tomatoes", "Butter", "Cream"],
      "isAvailable": true,
      "preparationTime": 30,
      "imageUrl": "https://images.unsplash.com/..."
    }
  ]
}
```

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Get orders (paginated) |
| `GET` | `/api/orders/:id` | Get single order |
| `POST` | `/api/orders` | Create new order |
| `PATCH` | `/api/orders/:id/status` | Update order status |

#### GET /api/orders - Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/stats` | Get dashboard stats |
| `GET` | `/api/analytics/top-sellers` | Get top 5 selling items |

---

## 🧩 Technical Challenges & Solutions

### Challenge 1: Search with Debouncing

**Problem:** Making API calls on every keystroke causes performance issues.

**Solution:** Created a custom `useDebounce` hook that delays API calls by 300ms.

```javascript
// hooks/useDebounce.js
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage in MenuManagement.jsx
const debouncedSearch = useDebounce(searchTerm, 300);
```

### Challenge 2: MongoDB Aggregation (Top Sellers)

**Problem:** Calculate top 5 selling items across all orders.

**Solution:** Used MongoDB aggregation pipeline with $unwind, $group, and $lookup.

```javascript
const topSellers = await Order.aggregate([
  { $match: { status: { $ne: 'Cancelled' } } },
  { $unwind: '$items' },
  { $group: {
      _id: '$items.menuItem',
      totalQuantity: { $sum: '$items.quantity' },
      totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
  }},
  { $lookup: {
      from: 'menuitems',
      localField: '_id',
      foreignField: '_id',
      as: 'menuItem'
  }},
  { $unwind: '$menuItem' },
  { $sort: { totalQuantity: -1 } },
  { $limit: 5 }
]);
```

### Challenge 3: Optimistic UI Updates

**Problem:** Toggle availability should feel instant, not wait for API.

**Solution:** Update UI immediately, rollback if API fails.

```javascript
// hooks/useOptimisticUpdate.js
const toggleAvailability = async (id, currentStatus) => {
  // 1. Update UI immediately
  setMenuItems(prev => prev.map(item =>
    item._id === id ? { ...item, isAvailable: !currentStatus } : item
  ));

  try {
    await menuAPI.toggleAvailability(id);
    toast.success('Availability updated!');
  } catch (err) {
    // 2. Rollback on error
    setMenuItems(prev => prev.map(item =>
      item._id === id ? { ...item, isAvailable: currentStatus } : item
    ));
    toast.error('Failed to update. Changes reverted.');
  }
};
```

---

## 📸 Screenshots

### Dashboard
*Dashboard with stats, top sellers, and recent orders*

### Menu Management
*Menu items grid with search, filters, and CRUD operations*

### Orders Dashboard
*Orders list with status filtering and pagination*

---

## 🚢 Deployment

### MongoDB Atlas Setup
1. Create free account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create M0 (free) cluster
3. Whitelist IP: `0.0.0.0/0`
4. Create database user
5. Get connection string

### Backend (Render)
1. Create account at [render.com](https://render.com)
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables

### Frontend (Netlify)
1. Create account at [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add `_redirects` file for SPA routing

---

## 👨‍💻 Author

**Abhijith Yadav**
- GitHub: [@abhijithyadav786](https://github.com/abhijithyadav786)

---

## 📄 License

This project is created for the Eatoes Intern Technical Assessment.
