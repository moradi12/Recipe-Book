# 🍲 Recipe Book  

**Recipe Book** is a dynamic web application that helps users explore and manage a variety of recipes. Built using a **TypeScript frontend** and a **Java Spring Boot backend**, it offers a modern and efficient way to discover, organize, and share culinary inspiration.  

---

## 📚 Table of Contents  
- ✨ [Features](#features)  
- 💻 [Technology Stack](#technology-stack)  
- ⚙️ [Installation](#installation)  
  - 🔧 Backend Setup  
  - 🔅️ Frontend Setup  
- 🚀 [Usage](#usage)  
- 🤝 [Contributing](#contributing)  
- 📜 [License](#license)  

---

## ✨ Features  

- 📝 **Recipe Management**: Create, update, and delete recipes.  
- 🔍 **Search and Filter**: Find recipes based on ingredients, name, or category.  
- 🔒 **User Authentication**: Secure login and registration system with JWT-based authentication.  
- 📦 **Redux State Management**: Efficient state handling using Redux slices.  
- 🚪 **Protected Routes**: Secure API calls with token refresh support via `axios-jwt`.  
- 📱 **Responsive Design**: Fully optimized for desktop and mobile devices.  
- 🌐 **API Integration**: Robust backend API for seamless data interaction.  
- 🦡 **Custom Hooks**: Clean and modularized React components.  
- 🎨 **Smooth Animations**: Enhances user experience with transitions and effects.  

---

## 💻 Technology Stack  

### Backend  
- 🔄 **Language**: Java  
- ⚡ **Framework**: Spring Boot  
- 💄 **Database**: MySQL/PostgreSQL (configurable)  
- 🛠️ **Tools**: Maven, Hibernate, Spring Data JPA  
- 🔐 **Authentication**: JSON Web Tokens (JWT)  

### Frontend  
- 🔄 **Language**: TypeScript  
- ⚡ **Framework**: React with Vite for fast development  
- 🎨 **Styling**: Tailwind CSS  

#### Additional Tools and Libraries  
- 📡 **Axios**: Handles API requests.  
- 🔒 **AxiosJWT**: Manages authenticated requests with automatic token refresh.  
- 📦 **Redux Toolkit**: State management with modular slices.  
- 🌐 **React Router**: Navigation and route protection.  
- 🦡 **React Hook Form**: Efficient form handling.  
- 💫 **Framer Motion**: Smooth animations and user interactions.  
- 🔔 **Notyf**: User notifications and feedback.  
- 🎠 **Slick Carousel**: Stylish carousels and sliders.  
- 🎨 **React Icons**: Lightweight and customizable icons.  

---

## ⚙️ Installation  

### 🔧 Backend Setup  

1. Clone the repository:  
   ```bash
   git clone https://github.com/moradi12/AllrecipesV2.git
   cd AllrecipesV2/Recipesdemo
   ```
2. Configure the database:  
   - Update the `application.properties` or `application.yml` file with your database credentials.  

3. Build and run the backend:  
   ```bash
   mvn spring-boot:run
   ```
4. Verify the backend is running at [http://localhost:8080](http://localhost:8080).  

---

### 🔅️ Frontend Setup  

1. Navigate to the frontend directory:  
   ```bash
   cd AllrecipesV2/my-react-app
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start the frontend:  
   ```bash
   npm run dev
   ```
4. Access the application at [http://localhost:3000](http://localhost:3000).  

---

## 🚀 Usage  

- 🔒 **Register or log in** to the application.  
- 🔍 **Search for recipes** using filters for ingredients, categories, or preparation time.  
- 📝 **Add, edit, or delete recipes** seamlessly.  
- 🛡️ **Enjoy secure sessions** with JWT authentication.  
- 📦 **Efficiently manage state** using Redux slices.  
- 💫 **Experience smooth animations** with Framer Motion.  

---

## 🤝 Contributing  

We welcome contributions!  

1. Fork the repository.  
2. Create a new branch:  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:  
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to your branch:  
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.  

---

## 📜 License  

This project is licensed under the **MIT License**.  

---  

🎉 **Happy Cooking!**  
For questions or feedback, feel free to open an issue or send me a message.
---
