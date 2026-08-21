# 💊 Pharmacy Management System

A full-stack **Pharmacy Management System** designed to streamline pharmacy operations such as **medicine inventory management, sales and billing, stock monitoring, purchase orders, and business analytics**.

The application follows a **client-server architecture**, with a React frontend communicating with a FastAPI backend through REST APIs.

---

## 🚀 Features

### 📦 Inventory Management

* Add new medicines to the inventory
* View all available medicines
* Update medicine details
* Delete medicines
* Track medicine quantity and stock availability
* Automatically identify:

  * Active Stock
  * Low Stock
  * Out of Stock
  * Expired Medicines

### 💰 Sales & Billing

* Select medicines and quantities to generate a bill
* Calculate total price automatically
* Validate available stock before completing a sale
* Prevent overselling when requested quantity exceeds available inventory
* Automatically update medicine stock after a successful sale
* Store sales transactions in the database

### 📊 Dashboard & Analytics

The dashboard provides real-time business insights including:

* Today's Sales
* Total Items Sold
* Low Stock Count
* Purchase Expenditure
* Recent Sales
* Inventory Summary
* Active Medicines
* Low Stock Medicines
* Expired Medicines
* Out-of-Stock Medicines

### 📋 Purchase Orders

* Create purchase orders for medicines
* Track medicine purchase quantities
* Store purchase information in the database
* Monitor pharmacy expenditure

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Axios
* HTML
* CSS

### Backend

* FastAPI
* Python
* Pydantic
* Uvicorn

### Database

* SQLite
* SQLAlchemy ORM

### Deployment

* Render Cloud

---

## 🏗️ System Architecture

```text
User
  │
  ▼
React Frontend
  │
  │ Axios / HTTP Requests
  ▼
FastAPI Backend
  │
  │ Pydantic Validation
  ▼
Business Logic
  │
  ▼
SQLAlchemy ORM
  │
  ▼
SQLite Database
  │
  ▼
JSON Response
  │
  ▼
React State Update & UI Re-render
```

---

## 🔄 Application Workflow

When a user performs an action such as adding a medicine or generating a sale:

1. The user interacts with the React frontend.
2. React collects the required data using component state.
3. Axios sends an HTTP request to the FastAPI backend.
4. FastAPI routes the request to the appropriate REST API endpoint.
5. Pydantic validates the incoming request data.
6. The backend executes the required business logic.
7. SQLAlchemy interacts with the SQLite database.
8. FastAPI returns the response in JSON format.
9. React receives the response using Axios.
10. The application updates the state and automatically re-renders the UI.

---

## 🔌 REST API Functionality

The application implements **10+ REST API endpoints** supporting operations such as:

### Medicine APIs

```text
GET     /medicines
POST    /medicines
PUT     /medicines/{id}
DELETE  /medicines/{id}
```

Used for performing CRUD operations on medicine inventory.

### Sales APIs

```text
POST    /sales
GET     /sales
```

Used for creating and retrieving sales transactions.

### Dashboard API

```text
GET /dashboard
```

Provides aggregated business metrics including sales, stock information, purchase data, and recent transactions.

### Purchase Order APIs

```text
POST /purchase-orders
GET  /purchase-orders
```

Used to create and retrieve purchase order information.

---

## 🧾 Transaction and Stock Management

The billing workflow includes multiple validation and inventory management steps.

When a sale is generated:

```text
Sale Request
     │
     ▼
Pydantic Validation
     │
     ▼
Check Medicine Availability
     │
     ▼
Validate Stock Quantity
     │
     ├── Insufficient Stock → Reject Request
     │
     ▼
Calculate Total Price
     │
     ▼
Update Inventory Quantity
     │
     ▼
Record Sale Transaction
     │
     ▼
Update Medicine Status
```

This helps prevent **overselling** and keeps inventory data synchronized with sales transactions.

---

## 🧠 Data Validation

The backend uses **Pydantic schemas** for request validation.

Pydantic ensures that:

* Required fields are present
* Data types are correct
* Numeric values such as quantity and price are valid
* Invalid requests are rejected before executing business logic

Example flow:

```text
Frontend Request
      │
      ▼
Pydantic Schema Validation
      │
      ├── Invalid Data → Error Response
      │
      ▼
Valid Data
      │
      ▼
Business Logic
```

---

## 🗄️ Database Management

The application uses **SQLite** as the database and **SQLAlchemy** as an Object Relational Mapper (ORM).

Instead of directly writing raw SQL queries, database operations are performed using Python objects.

Examples include:

```python
db.add()
db.query()
db.commit()
db.delete()
```

SQLAlchemy translates these operations into the appropriate SQL queries.

The main database entities include:

* Medicines
* Sales
* Purchase Orders

---

## ⚛️ Frontend Architecture

The frontend is built using reusable React components and pages.

Major sections include:

```text
Frontend
│
├── Dashboard
│   ├── KPI Cards
│   ├── Recent Sales
│   └── Purchase Orders
│
├── Inventory
│   ├── Medicine Form
│   ├── Medicine List
│   └── Stock Summary
│
└── Sales
    ├── Medicine Selection
    ├── Billing
    └── Sale Generation
```

React's `useState` is used to manage dynamic application data, while `useEffect` is used for operations such as fetching data when components load or refresh.

---

## 📡 API Communication

Axios is used to communicate between the React frontend and FastAPI backend.

Example:

```javascript
api.get("/dashboard")
  .then((res) => {
    setData(res.data);
  })
  .catch((err) => {
    console.error(err);
  });
```

A centralized Axios instance is configured using an environment variable:

```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});
```

This allows the application to use different backend URLs for local development and production without changing the application code.

---

## 🔐 Error Handling

The application handles common errors including:

* Failed API requests
* Invalid user input
* Insufficient stock
* Backend communication failures
* Database-related errors

Axios `.catch()` blocks and backend validation are used to handle and communicate errors appropriately.

---

## 🌐 Deployment

The application was deployed end-to-end using **Render Cloud**.

Deployment involved configuring:

* Frontend build settings
* Backend service configuration
* Environment variables
* CORS middleware
* Production API URLs
* Python version compatibility

### Environment Variable

The frontend uses:

```text
REACT_APP_API_URL=<BACKEND_URL>
```

This allows Axios to communicate with the deployed FastAPI backend.

---

## ⚠️ Deployment Challenges Resolved

During deployment, several practical issues were encountered and resolved.

### 1. Pydantic Build Failure

The initial deployment attempted to use a Python version incompatible with the installed Pydantic version.

This was resolved by configuring a compatible Python version.

---

### 2. SQLite Database Path Resolution

The backend initially failed with:

```text
sqlite3.OperationalError: unable to open database file
```

The database path was corrected to ensure the application could access the SQLite database correctly in the deployment environment.

---

### 3. CORS Configuration

Since the frontend and backend were hosted separately, they had different origins.

CORS middleware was configured in FastAPI to allow requests from the frontend.

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "YOUR_FRONTEND_URL"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

---

## 💻 Local Installation

### 1. Clone the Repository

```bash
git clone https://github.com/khushi-srivastava4/Pharmacy-Management.git
```

```bash
cd Pharmacy-Management
```

---

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the environment.

For Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run locally at:

```text
http://localhost:8000
```

---

### 3. Frontend Setup

Navigate to the frontend directory containing `package.json`.

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```text
REACT_APP_API_URL=http://localhost:8000
```

Run the application:

```bash
npm start
```

The frontend will run locally at:

```text
http://localhost:3000
```

---

## LIVE URL
Frontend: https://pharmacy-management-frontend-ukjb.onrender.com
Backend: https://pharmacy-management-1-yrxv.onrender.com
## 🎯 Key Learnings

Through this project, I gained hands-on experience with:

* Full-stack web development
* Client-server architecture
* REST API design
* React state management
* React hooks
* Axios API communication
* FastAPI backend development
* Pydantic data validation
* SQLAlchemy ORM
* SQLite database management
* CRUD operations
* Business logic implementation
* Inventory synchronization
* Oversell prevention
* CORS configuration
* Environment variables
* Cloud deployment
* Debugging production issues

---

## 👩‍💻 Author

**Khushi Srivastava**

IIT Kharagpur

---

⭐ If you found this project interesting, feel free to star the repository!
