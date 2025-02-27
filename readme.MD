# 🚀 ASSIGNMENT-5 BACKEND WORK

## 📌 Project Overview
This project is a backend application built with **Node.js**, **Express.js**, and **Sequelize** (ORM for PostgreSQL). It includes user authentication, JWT-based authorization, password reset functionality, and email notifications using Mailtrap.

---

## 📂 Project Structure
```
Assignment/
├── .gitignore
├── api/
│   ├── .env
│   ├── app.js
│   ├── config/
│   │   └── database.js
│   ├── controller/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── index.js
│   │   └── user.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes/
│   │   └── authRoute.js
│   └── utils/
│       └── mailer.js
└── README.md
```

---

## ⚙️ Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/assignment5-backend.git
cd assignment5-backend/api
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the `api/` directory and add the following values:
```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
```

---

## 🛠️ Features
✅ **User Authentication** (Signup/Login/Logout)  
✅ **JWT-based Authorization**  
✅ **Reset & Change Password**  
✅ **Email Notifications** (Mailtrap)  
✅ **Sequelize ORM with PostgreSQL**  

---

## 🔗 API Endpoints
| Method | Endpoint           | Description                        | Auth Required |
|--------|-------------------|------------------------------------|--------------|
| POST   | `/auth/signup`    | Register a new user               | ❌ No         |
| POST   | `/auth/login`     | Log in and get JWT token          | ❌ No         |
| POST   | `/auth/logout`    | Log out and clear token cookie    | ✅ Yes        |
| POST   | `/auth/reset-password` | Reset password (Authenticated) | ✅ Yes        |
| POST   | `/auth/forgot-password` | Send password reset email | ❌ No         |

---

## ✨ Technologies Used
- **Node.js** & **Express.js** – Backend Framework
- **Sequelize** – ORM for PostgreSQL
- **JWT (JSON Web Token)** – Authentication
- **Bcrypt.js** – Password Hashing
- **Nodemailer & Mailtrap** – Email Notifications