# Recipe Book

Recipe Book is a web application that helps users explore and manage a variety of recipes. Built using a **TypeScript frontend** and a **Java Spring Boot backend**, it offers a modern and efficient way to discover, organize, and share culinary inspiration.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Recipe Management**: Create, update, and delete recipes.
- **Search and Filter**: Find recipes based on ingredients, name, or category.
- **User Authentication**: Secure login and registration system with JWT-based authentication.
- **Redux State Management**: Modular and efficient state handling using Redux slices.
- **Protected Routes**: Implemented using `axios-jwt` for authenticated API calls with token refresh support.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **API Integration**: Robust backend API for recipe data.
- **Custom Hooks**: Simplifies logic and ensures cleaner React components.

## Technology Stack

### Backend
- **Language**: Java
- **Framework**: Spring Boot
- **Database**: MySQL/PostgreSQL (configurable)
- **Tools**: Maven, Hibernate, Spring Data JPA
- **Authentication**: JSON Web Tokens (JWT) for secure user sessions

### Frontend
- **Language**: TypeScript
- **Framework**: React with Vite for fast development
- **Styling**: Tailwind CSS
- **Tools**: 
  - **Axios**: For handling API requests.
  - **AxiosJWT**: For managing authenticated requests with automatic token refresh.
  - **Redux Toolkit**: Utilized for state management with slices to modularize logic.
  - **React Router**: For navigation and route protection.
  - **React Hook Form**: For efficient and user-friendly form handling.
  - **Framer Motion**: For smooth animations and enhanced user interactions.
  - **Notyf**: For user notifications and feedback.
  - **Slick Carousel**: For visually appealing carousels and sliders.
  - **React Icons**: For customizable and lightweight icons.

## Installation

### Backend Setup

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

4. Verify the backend is running at `http://localhost:8080`.

### Frontend Setup

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

4. Access the application at `http://localhost:3000`.

## Usage

1. Register or log in to the application.
2. Browse or search for recipes.
3. Add new recipes or edit existing ones.
4. Filter recipes by ingredients, categories, or preparation time.
5. Enjoy seamless user sessions powered by JWT authentication.
6. Manage state efficiently with Redux slices and utilize custom hooks for cleaner component logic.
7. Experience enhanced user interactions with animations powered by Framer Motion.

## Contributing

We welcome contributions! To contribute:

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

## License

This project is licensed under the [MIT License](LICENSE).

---

Happy Cooking! If you have any questions or feedback, feel free to open an issue or contact the repository maintainer.
