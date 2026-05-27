# 🚀 Intelligent Task Prioritizer

Intelligent Task Prioritizer is a smart, full-stack task management application designed to help users focus on what truly matters. Unlike traditional to-do lists, this application uses a scoring algorithm to automatically prioritize your tasks based on urgency, importance, and "quick win" potential.

![Dashboard Preview](https://todoist.com/_next/static/images/empty-state@2x.png)

## ✨ Key Features

- **🧠 Smart Prioritization**: Automatically calculates a priority score for every task using:
    - **Priority Levels (P1-P4)**: Focus on high-impact work.
    - **Urgency (Due Dates)**: Higher weight for overdue and today's tasks.
    - **Quick Wins**: Small boost for shorter tasks (under 30 mins) to maintain momentum.
- **🔐 Secure Authentication**: Full user registration and login system.
- **📊 Intuitive Dashboard**: Organize tasks by Inbox, Today, Upcoming, and Completed views.
- **⚙️ Customizable Settings**: Manage your profile and account preferences.
- **📱 Responsive Design**: Clean and modern UI that works across devices.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Backend**: PHP (RESTful API)
- **Database**: MySQL
- **Styling**: Vanilla CSS (Custom Design System)
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+)
- **PHP** (v7.4+)
- **MySQL** (or XAMPP/WAMP/MAMP)
- **Web Server** (Apache or Nginx)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sauch0/intelligent-task-priotizer.git
   cd intelligent-task-prioritizer
   ```

2. **Frontend Setup**:
   ```bash
   npm install
   npm run dev
   ```

3. **Database Setup**:
   - Create a database named `intelligent_task_prioritizer`.
   - Import the schema from `api/config/schema.sql`.
   - Update `api/config/database.php` with your database credentials.

4. **Backend Setup**:
   - Ensure your PHP server (like XAMPP Apache) is running.
   - The project is configured to proxy `/api` requests to `http://localhost/Intelligent-task-priotizer`. If your local path is different, update the `proxy` settings in `vite.config.js`.

## 📂 Project Structure

```text
├── api/                  # PHP Backend API
│   ├── auth/            # Authentication endpoints
│   ├── config/          # DB connection & Schema
│   ├── tasks/           # CRUD operations for tasks
│   └── user/            # Profile management
├── src/                  # React Frontend
│   ├── components/      # UI Components (Dashboard, Login, etc.)
│   ├── context/         # Auth & Global State
│   └── assets/          # Static assets
├── public/               # Public assets
└── index.html            # Entry point
```

## ⚖️ License

This is a personal project and is not licensed for commercial use.
---

