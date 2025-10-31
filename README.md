# 🌱 FeedYourSeed

This is the **backend code** for my graduation project **FeedYourSeed** — a website that helps users identify plants and get personalized care advice such as watering, sunlight, and feeding tips.  
The platform also includes an e-commerce feature for buying and selling plants online.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **JWT Authentication**
- **Cloudinary** (for image uploads)
- **Dotenv** for environment configuration
- **CORS**, **Multer**, etc.

---

## ⚙️ Features

- 🌿 User authentication (Register / Login / JWT)
- 🪴 Plant recognition & care tips
- 🛒 E-commerce system (Buy & Sell plants)
- 🧺 Cart management
- 🧾 Order management
- 📦 Product CRUD operations (for admins)
- ☁️ Image upload to Cloudinary

---

## 📁 Folder Structure
FeedYourSeed/
│
├── public/                       # Public assets (images, docs, etc.)
│
├── src/                          # Main source folder
│   ├── db/                       # Database connection and configuration
│   ├── models/                   # Database Models
│   │
│   ├── middlewares/              # Express middlewares (auth, validation, etc.)
│   │
│   ├── modules/                  # Main app modules (grouped by feature)
│   │   ├── auth/                 # Authentication (login, signup, JWT)
│   │   ├── order/                # Order management logic
│   │   ├── shop/                 # Shop and product-related logic
│   │   └── user/                 # User management and profile handling
│   │
│   ├── templates/                # Email or HTML templates
│   │
│   └── utils/                    # Helper functions and reusable utilities
│       ├── email/                # Email sending utilities
│       ├── error/                # Error handling
│       ├── file upload/          # File upload logic (e.g. multer config)
│       ├── hash/                 # Hashing utilities (passwords, etc.)
│       ├── messages/             # Predefined response or validation messages
│       ├── otp/                  # OTP generation and verification
│       └── token/                # Token generation & validation (JWT helpers)
│
├── .gitignore                    # Git ignored files (includes .env)
├── README.md                     # Project documentation
├── index.js                      # App entry point
├── package.json                  # Dependencies and scripts
└── package-lock.json             # Dependency lock file

---

# 👨‍💻 Author
Mohanad Tarek (Honda)
🎓 Computer Science Student — Tanta University
💼 Aspiring Backend Developer , Frondend developer , Full Stack developer
📧 Mohanadtarek742203@gmail.com
