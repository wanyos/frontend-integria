# integria-frontend

Web application developed with Vue 3 and Vite for managing and tracking technical incidents. This dashboard offers data visualization, report generation, and automated email communication.

🗂️ Project Structure

frontend-integria/
├── src/ # Main source code
│ ├── api/ # API clients and HTTP services
│ │ └── incidents_api.js # Incidents API client
│ ├── assets/ # Static resources (images, fonts)
│ ├── components/ # Reusable Vue components
│ │ ├── global-components/ # Shared components
│ │ │ ├── ButtonList.vue # Email list management
│ │ │ ├── CardFile.vue # File display
│ │ │ └── CardItem.vue # Information card
│ │ ├── TableChart.vue # Data table
│ │ └── DateFilter.vue # Date selector
│ ├── constants/ # Constants and configuration
│ │ └── emailList.js # Predefined email list
│ ├── router/ # Route configuration
│ ├── stores/ # Global state (Pinia)
│ │ └── authentication.js # Authentication state
│ ├── utils/ # Utilities and helper functions
│ │ └── create_files.js # Excel file generation
│ ├── views/ # Page views
│ │ └── IncidentsView.vue # Main incidents screen
│ ├── App.vue # Root component
│ └── main.js # Application entry point
├── public/ # Public files (favicon, etc.)
├── cypress/ # End-to-end tests
├── eslint.config.js # ESLint configuration
├── .prettierrc # Prettier configuration
├── vite.config.js # Vite configuration
└── cypress.config.js # Cypress configuration

🔧 Requirements

Node.js (v14 or higher)
npm or yarn
Internet connection for external APIs

🚀 Installation and Setup

# clone and install project

```sh
git clone <repository-url>
cd frontend-integria
npm install
```

# Start development server

```sh
npm run dev
```

# Start development server and automatically open browser

```sh
npm run dev:open
```

# Build for production

```sh
npm run build
```

# Preview production build

```sh
npm run preview
```

# Run unit tests with Vitest [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

# Open Cypress for E2E tests [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e
```

# Run E2E tests in Chrome headless

```sh
npm run test:all
```

# Run tests in Electron mode

```sh
npm run test:electron
```

# Check linting issues

```sh
npm run lint
```

# Automatically fix linting issues

```sh
npm run lint:fix
```

# Format code with Prettier

```sh
npm run format
```

# Check formatting without modifying files

```sh
npm run format:check
```

📏 Code Standards

# Check code

```sh
npm run lint && npm run format:check
```

# Fix automatically

```sh
npm run lint:fix && npm run format
```
