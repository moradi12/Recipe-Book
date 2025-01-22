# 🥗 Recipesdemo Project

Welcome to **Recipesdemo**, a full-stack web application designed to help users discover, create, and manage their favorite recipes. This project leverages modern technologies to deliver a seamless and responsive user experience, coupled with a robust backend infrastructure.

![Recipesdemo Banner](https://your-image-url.com/banner.png) <!-- Replace with your banner image URL -->

## 📑 Table of Contents

- [📖 Project Overview](#-project-overview)
- [🛠️ Technologies Used](#%ef%b8%8f-technologies-used)
  - [🎨 Frontend](#-frontend)
  - [⚙️ Backend](#%ef%b8%8f-backend)
- [🚀 Getting Started](#-getting-started)
  - [🔍 Prerequisites](#-prerequisites)
  - [⚙️ Setup Instructions](#%ef%b8%8f-setup-instructions)
    - [🎨 Frontend Setup](#-frontend-setup)
    - [⚙️ Backend Setup](#%ef%b8%8f-backend-setup)
- [📜 Scripts and Commands](#-scripts-and-commands)
  - [🌐 Frontend Scripts](#-frontend-scripts)
  - [🔧 Backend Scripts](#-backend-scripts)
- [📚 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
  - [🌐 Frontend Testing](#-frontend-testing)
  - [🔧 Backend Testing](#-backend-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 📖 Project Overview

**Recipesdemo** is a web application that allows users to:

- **🍲 Browse Recipes:** Explore a wide variety of recipes categorized by cuisine, difficulty, ingredients, and more.
- **✍️ Create and Manage Recipes:** Users can add their own recipes, complete with images, ingredients, instructions, and personal notes.
- **🔒 User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
- **🔔 Real-time Notifications:** Receive updates and notifications about new recipes, comments, and user interactions.
- **🔍 Search and Filter:** Advanced search functionality to find recipes based on specific criteria.
- **📱 Responsive Design:** Optimized for both desktop and mobile devices for an enhanced user experience.

The application is divided into two main parts:

1. **🌐 Frontend:** Built with React, utilizing modern libraries and tools for state management, routing, and UI components.
2. **⚙️ Backend:** Powered by Spring Boot, providing RESTful APIs, authentication, database interactions, and real-time communication.

## 🛠️ Technologies Used

### 🎨 Frontend

- **React** (`^18.3.1`) 🟢: A JavaScript library for building user interfaces.
- **Vite** (`^6.0.3`) ⚡: A fast frontend build tool and development server.
- **TypeScript** (`~5.6.2`) 🔵: A statically typed superset of JavaScript.
- **Material-UI (MUI)** (`@mui/material ^6.2.1`) 🎨: React components for faster and easier web development.
- **Redux Toolkit** (`@reduxjs/toolkit ^2.5.0`) 📦: Simplifies Redux state management.
- **React Router DOM** (`^7.0.2`) 🚦: Declarative routing for React applications.
- **Axios** (`^1.7.9`) 📡: Promise-based HTTP client for the browser and Node.js.
- **Framer Motion** (`^11.18.0`) 🕺: A production-ready motion library for React.
- **React Hook Form** (`^7.54.2`) 📝: Performant, flexible, and extensible forms with easy-to-use validation.
- **ESLint** (`^9.17.0`) 🛠️: Linting utility for JavaScript and TypeScript.
- **Notyf** (`^3.10.0`) 🔔: Toast notification library.
- **Others:** Additional libraries for icons, animations, and utilities.

### ⚙️ Backend

- **Spring Boot** (`3.1.2`) 🔧: Framework for building production-ready applications.
- **Spring Web** 🌐: For building RESTful APIs.
- **Spring Data JPA** 💾: Simplifies database interactions with JPA.
- **MySQL** 🐬: Relational database management system.
- **Swagger/OpenAPI** (`2.1.0`) 📖: API documentation and exploration.
- **JWT (JSON Web Tokens)** (`0.11.5`) 🔐: Secure authentication mechanism.
- **Lombok** (`1.18.28`) 📉: Reduces boilerplate code in Java.
- **MapStruct** (`1.5.3.Final`) 🗺️: Object mapping for Java.
- **Kafka** (`3.4.0`) 🛢️: Distributed streaming platform.
- **RabbitMQ** 🐇: Message broker for handling asynchronous tasks.
- **Jakarta Transaction API** (`2.0.0`) 💱: Transaction management.
- **Testing Libraries:** JUnit 5, Mockito, Spring Test, etc.

## 🚀 Getting Started

### 🔍 Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (`>= 16.x`)
- **npm** (`>= 7.x`) or **yarn**
- **Java** (`17`)
- **Maven** (`3.6.x` or higher)
- **MySQL** (`8.x`)
- **Kafka** and **RabbitMQ** (if setting up messaging services)

### ⚙️ Setup Instructions

#### 🎨 Frontend Setup

1. **Navigate to the Frontend Directory:**

   ```bash
   cd my-react-app
   ```

2. **Install Dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root of `my-react-app` and add necessary environment variables, such as API endpoints.

   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

#### ⚙️ Backend Setup

1. **Navigate to the Backend Directory:**

   ```bash
   cd Recipesdemo
   ```

2. **Configure Database:**

   - Create a MySQL database named `recipesdb`.
   - Update `src/main/resources/application.properties` with your MySQL credentials:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/recipesdb
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     spring.jpa.hibernate.ddl-auto=update
     ```

3. **Build the Project:**

   ```bash
   mvn clean install
   ```

4. **Run the Application:**

   ```bash
   mvn spring-boot:run
   ```

   The backend will be available at `http://localhost:8080`.

5. **Access Swagger UI:**

   Navigate to `http://localhost:8080/swagger-ui.html` to explore and test the API endpoints.

## 📜 Scripts and Commands

### 🌐 Frontend Scripts

- **Start Development Server:**

  ```bash
  npm run dev
  ```

- **Build for Production:**

  ```bash
  npm run build
  ```

- **Type Check and Build:**

  ```bash
  npm run build
  ```

- **Lint the Codebase:**

  ```bash
  npm run lint
  ```

- **Preview Production Build:**

  ```bash
  npm run preview
  ```

### 🔧 Backend Scripts

- **Build the Project:**

  ```bash
  mvn clean install
  ```

- **Run the Application:**

  ```bash
  mvn spring-boot:run
  ```

- **Run Tests:**

  ```bash
  mvn test
  ```

## 📚 API Documentation

The backend leverages Swagger/OpenAPI for API documentation. Once the application is running, access the Swagger UI at:

`http://localhost:8080/swagger-ui.html`

Here, you can explore all available endpoints, their request/response structures, and interact with the APIs directly.

## 🧪 Testing

### 🌐 Frontend Testing

The frontend setup includes ESLint for linting and ensures code quality. While specific testing libraries (like Jest or React Testing Library) aren't listed in the `package.json`, it's recommended to integrate them for comprehensive testing.

### 🔧 Backend Testing

The backend uses JUnit 5 and Mockito for unit and integration testing. To run the tests:

```bash
mvn test
```

This command will execute all tests located in the `src/test` directory, ensuring that your application behaves as expected.

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a New Branch:**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch:**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request**

Please ensure that your code adheres to the project's coding standards and passes all tests before submitting a pull request.

## 📄 License

This project is licensed under the MIT License.
