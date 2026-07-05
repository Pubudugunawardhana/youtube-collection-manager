<div align="center">
  
  <h1 align="center">FocusTube</h1>
  <p align="center">
    <strong>A distraction-free, highly organized way to manage and learn from YouTube videos.</strong>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </p>
</div>

<br />

> **FocusTube** is a complete, full-stack web application designed to help you organize, manage, and watch YouTube educational content without the distractions of the regular YouTube interface. Curate your own video collections, sort them seamlessly, and stay focused on your learning goals!

---

## ✨ Key Features

- **🛡️ Distraction-Free Environment**: Watch and learn without algorithm-driven recommendations, comments, or related videos.
- **📚 Collection Management**: Create, edit, and organize YouTube videos into custom, visually appealing lists.
- **🖱️ Drag & Drop Interface**: Intuitively reorder your videos and collections using smooth drag-and-drop mechanics.
- **🌓 Adaptive Theme**: A modern, premium UI with seamless Dark Mode and Light Mode transitions that respect system preferences.
- **🔐 Secure Authentication**: Full user authentication system powered by JWT and bcrypt, ensuring your data is safe.
- **👤 Profile Personalization**: Customize your learning profile, update passwords, and manage your account securely.
- **🚀 Serverless Optimized**: Backend architecture designed specifically for seamless deployments on serverless platforms like Vercel.

---

## 🛠️ Technology Stack

| Frontend 🎨 | Backend ⚙️ | Tools & Integrations 🔧 |
| :--- | :--- | :--- |
| **Next.js 16** (App Router) | **Node.js** | **Vercel** (Deployment) |
| **React 19** | **Express.js 5** | **Mailtrap** (Emails) |
| **Tailwind CSS v4** | **MongoDB & Mongoose** | **GitHub Actions** |
| **Lucide Icons** | **JWT & bcryptjs** | **Axios** |
| **@dnd-kit** (Drag & Drop) | **Nodemailer** | **Google APIs** |

---

## 🚀 Getting Started

Follow these steps to get the project up and running locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A [MongoDB](https://www.mongodb.com/) account and Cluster (MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/Pubudugunawardhana/youtube-collection-manager.git
cd youtube-collection-manager
```

### 2. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your secrets:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Email Configuration (Optional)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

🎉 The app is now running! Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment

This project is configured and optimized for deployment on **Vercel**.

1. Connect your GitHub repository to Vercel.
2. Deploy the `backend` and `frontend` separately.
3. Ensure you add `MONGODB_URI` and `JWT_SECRET` in the Vercel **Environment Variables** settings.
4. **Important:** Ensure your MongoDB Atlas Network Access is set to `0.0.0.0/0` (Allow access from anywhere) to allow Vercel's dynamic IP addresses to connect.

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <i>Developed with ❤️ for focused, distraction-free learning.</i>
  <br/>
  <a href="https://github.com/Pubudugunawardhana">Pubudugunawardhana</a>
</div>
