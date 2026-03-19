# DishHub 🍽️

A modern, full-stack web application for storing, contributing, and exploring global recipes. DishHub brings together food enthusiasts with a sleek interface, intelligent search functionality, and personalized meal planning features.

**Live Demo:** [Coming Soon]  
**Documentation:** [View Docs]()

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Project Structure Details](#-project-structure-details)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### User Features
- 🔍 **Intelligent Recipe Search** - Advanced search with filters and sorting
- 📝 **Recipe Management** - Create, edit, and delete your own recipes
- ⭐ **User Ratings & Reviews** - Community feedback on recipes
- 🍽️ **Meal Planning** - Plan weekly meals with saved recipes
- 🏷️ **Recipe Categorization** - Organize by cuisine, diet, difficulty level
- 💾 **Save Favorites** - Bookmark your favorite recipes
- 👥 **Social Features** - Follow other users and share recipes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

### Admin Features
- 📊 **Dashboard Analytics** - Track user engagement and recipe statistics
- 🛡️ **Content Moderation** - Review and manage community recipes
- 👤 **User Management** - Manage user accounts and permissions

---

## 🛠️ Tech Stack

### Backend
- **Language:** Java
- **Framework:** Spring Boot
- **Build Tool:** Maven
- **Database:** [MySQL/PostgreSQL - to be confirmed]
- **API:** RESTful API
- **Other:** [Spring Data JPA, Spring Security, etc.]

### Frontend
- **Language:** TypeScript
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** CSS
- **State Management:** [Redux/Context API - to be added]
- **HTTP Client:** [Axios/Fetch API - to be added]
- **Package Manager:** npm

### Development Tools
- **IDE:** IntelliJ IDEA / VS Code
- **Version Control:** Git
- **Testing:** JUnit, Jest (to be configured)

---

## 📁 Project Structure

```
DishHub/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/nd/dishhub/
│   │   │   │       ├── Application.java
│   │   │   │       ├── controller/     # REST Controllers
│   │   │   │       ├── service/        # Business Logic
│   │   │   │       ├── model/          # Entity Models
│   │   │   │       ├── repository/     # Data Access Layer
│   │   │   │       └── exception/      # Exception Handling
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── mvnw
│
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/         # Reusable Components
│   │   ├── pages/              # Page Components
│   │   ├── services/           # API Services
│   │   ├── types/              # TypeScript Types
│   │   ├── hooks/              # Custom Hooks
│   │   ├── utils/              # Utility Functions
│   │   └── assets/             # Static Assets
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── README.md
└── docs/                       # Documentation (to be created)
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### For Backend
- **Java 11+** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- **MySQL 8.0+** or **PostgreSQL 12+** - [Download](https://www.mysql.com/downloads/)

### For Frontend
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm 7+** or **yarn 1.22+** (comes with Node.js)

### Verify Installation
```bash
# Check Java version
java -version

# Check Maven version
mvn --version

# Check Node.js and npm version
node --version
npm --version
```

---

## 💻 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/DishHub.git
cd DishHub
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
mvn install

# If using Maven wrapper (Windows)
mvnw install

# If using Maven wrapper (macOS/Linux)
./mvnw install
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
# or
yarn install
```

---

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend

# Using Maven
mvn spring-boot:run

# Or using Maven wrapper (Windows)
mvnw spring-boot:run

# Or using Maven wrapper (macOS/Linux)
./mvnw spring-boot:run
```

The backend will start on **http://localhost:8080**

### Start the Frontend Development Server

```bash
cd frontend

# Using npm
npm run dev

# Or using yarn
yarn dev
```

The frontend will start on **http://localhost:5173** (Vite default)

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api

---

## ⚙️ Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:

### Frontend Environment Variables
Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=DishHub
```

### Database Setup

#### For MySQL
```sql
CREATE DATABASE dishhub;
USE dishhub;
-- Tables will be created automatically by Hibernate (DDL)
```

#### For PostgreSQL
```sql
CREATE DATABASE dishhub;
-- Tables will be created automatically by Hibernate (DDL)
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints Structure (to be implemented)
- **Recipes:** `/api/recipes`
  - `GET /recipes` - Get all recipes
  - `POST /recipes` - Create a new recipe
  - `GET /recipes/{id}` - Get recipe by ID
  - `PUT /recipes/{id}` - Update recipe
  - `DELETE /recipes/{id}` - Delete recipe

- **Users:** `/api/users`
  - `GET /users/{id}` - Get user profile
  - `POST /users/register` - Register new user
  - `POST /users/login` - User login

- **Categories:** `/api/categories`
  - `GET /categories` - Get all categories

### API Documentation Tool
Swagger UI Documentation: `http://localhost:8080/swagger-ui.html` (when configured)

---

## 🏗️ Project Structure Details

### Backend Architecture
- **MVC Pattern** - Model, View, Controller separation
- **Service Layer** - Business logic encapsulation
- **Repository Pattern** - Data access abstraction

### Frontend Architecture
- **Component-Based** - Reusable React components
- **Custom Hooks** - Shared logic across components
- **Service Layer** - API communication
- **Type-Safe** - Full TypeScript support

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/DishHub.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes**
   ```bash
   git commit -m "Add your meaningful commit message"
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit a Pull Request**
   - Include a clear description of changes
   - Reference any related issues

### Code Style
- **Backend:** Follow Google Java Style Guide
- **Frontend:** Follow Airbnb's JavaScript/TypeScript style guide
- Use ESLint for frontend code quality
- Use Maven checkstyle for backend code quality

### Testing
- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Maintain minimum 80% code coverage

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

### Project Maintainers
- **Your Name** - [Email](mailto:your-email@example.com) | [GitHub](https://github.com/yourusername)

### Support
- 📧 Email: support@dishhub.com
- 🐛 Report Issues: [GitHub Issues](https://github.com/yourusername/DishHub/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/DishHub/discussions)

### Documentation
- [API Documentation](./docs/API.md) - Detailed API endpoints
- [Setup Guide](SETUP.md) - Step-by-step setup
- [Contributing Guide](./docs/CONTRIBUTING.md) - Contribution guidelines
- [Architecture](./docs/ARCHITECTURE.md) - Project architecture overview

---

## 🎯 Roadmap

### v1.0 (Current)
- ✅ Recipe CRUD operations
- ✅ User authentication
- ✅ Search functionality
- 🔄 Recipe ratings and reviews
- 🔄 Meal planning

### v1.1 (Planned)
- 📅 Social features (follow, share)
- 🛒 Shopping list integration
- 🔔 Notifications
- 🌍 Multi-language support

### v2.0 (Future)
- 📱 Mobile app
- 🤖 AI recipe recommendations
- 🎥 Video tutorials
- 🔗 Third-party integrations

---

## 📊 Project Statistics

- **Backend Language:** Java
- **Frontend Language:** TypeScript
- **Build Time:** ~2-3 minutes
- **Test Coverage:** To be determined
- **Last Updated:** March 2025

---

**Happy Cooking! 🍳**

*If you find this project helpful, please consider giving it a ⭐ Star on GitHub!*

