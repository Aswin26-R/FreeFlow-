# 🌟 FreeFlow CRM

**FreeFlow CRM** is a lightweight, client-side **freelancer CRM application** built with **vanilla HTML, CSS, and JavaScript**.  
It helps freelancers **manage clients, track invoices, organize projects, and set reminders** — all without any backend setup.  
Everything runs directly in the browser using **localStorage**, making it **fast, offline-ready, and easy to use**.

---

## 🚀 Features

### 🔑 Authentication & User Management
- Client-side signup/login with session persistence  
- LocalStorage-based authentication (no backend required)  
- Route protection with automatic redirects  

### 👥 Client Management
- Store client profiles, contact details, and notes  
- Search and filter clients with ease  

### 💰 Invoice Tracking
- Create and manage invoices with due dates  
- Track **pending, paid, and overdue** invoices  
- Automated reminders for overdue payments  
- Financial overview on dashboard  

### 📌 Project Management (Kanban Board)
- Simple drag-and-drop task board: **Todo → In Progress → Done**  
- Create, edit, and delete tasks  
- Link tasks to clients for better organization  
- Priority and status indicators with color-coded cards  

### 📊 Dashboard Overview
- Key business metrics at a glance  
- Pending invoices, active clients, and project status summary  

### 🎨 User Interface
- Clean, modern, **responsive design** (desktop + mobile)  
- Modal-based forms for seamless interactions  
- Unified styling with **Flexbox + CSS Grid**  

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)  
- **Data Storage:** Browser `localStorage`  
- **APIs Used:**  
  - `localStorage API` (data persistence & sessions)  
  - `Drag and Drop API` (Kanban board)  
  - `Form Validation API` (client-side validation)  
- **Styling:** Pure CSS (no frameworks) + system fonts  

---
## Roadmap
 Export/Import data (backup functionality)

 Dark mode toggle 🌙

 Invoice PDF generation

 Search & filter for projects and invoices

 Multi-language support

🤝 Contributing
Contributions are welcome!
If you’d like to contribute:

Fork the repo

Create a feature branch (git checkout -b feature-new)

Commit changes (git commit -m "Added new feature")

Push branch (git push origin feature-new)

Open a Pull Request 🚀

📜 License
This project is licensed under the MIT License – feel free to use, modify, and share.

👨‍💻 Author
Built with ❤️ by Aswin.R and Jaswanth
## 📂 Project Structure

FreeFlow-CRM/
│── index.html # Landing Page
│── login.html # User Login
│── signup.html # User Registration
│── dashboard.html # Dashboard with business overview
│── clients.html # Manage client profiles
│── invoices.html # Create and track invoices
│── projects.html # Kanban project board
│── reminders.html # Reminders & overdue payments
│
├── js/
│ ├── auth.js # Authentication & session handling
│ ├── dashboard.js # Dashboard logic
│ ├── clients.js # Client management
│ ├── invoices.js # Invoice management
│ ├── projects.js # Kanban functionality
│ ├── reminders.js # Reminder logic
│ └── utils.js # Shared utility functions
│
└── styles.css # Unified styling

yaml
Copy code

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/FreeFlow-CRM.git
2️⃣ Open in Browser
Just open index.html in your preferred browser.
No backend or setup required ✅

