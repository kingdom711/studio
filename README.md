# Safety Management Studio (Prototype)

This project is a **Safety Management System** prototype built with **Vite (React)**, **Firebase**, and **Simulated AI**. It is designed to streamline safety workflows in industrial or construction environments by providing role-based dashboards, digital checklists, and AI-powered risk analysis.

## 📋 Project Overview

The application serves three primary user roles, each with a dedicated workflow:

1.  **Worker**:
    *   Submit safety checklists (e.g., Daily Inspection, Machinery Check).
    *   Report issues with photos and descriptions.
    *   View status of submitted checklists.
2.  **Supervisor**:
    *   Review checklists submitted by workers.
    *   Approve or reject checklists based on safety standards.
    *   Monitor team activity via a dashboard.
3.  **Safety Manager**:
    *   High-level overview of safety compliance.
    *   Analyze risk trends and statistics.
    *   Manage system-wide settings (implied).

### Key Features
*   **Role-Based Authentication**: Seamless switching between user roles for demonstration and testing.
*   **Digital Checklists**: Dynamic forms for various work types with validation.
*   **AI Risk Analysis**: Simulated AI analysis of safety data and potential risks (Client-side mock for prototype).
*   **Real-time Updates**: Powered by Firebase Firestore with manual refresh capabilities.
*   **Modern UI**: Built with Tailwind CSS and Radix UI components, featuring a consistent and responsive design.

## 📚 Documentation

Detailed documentation for this project is available in the `docs/` directory:

*   [**User Workflows**](./docs/USER_WORKFLOW.md): Step-by-step guide to core user scenarios (Worker, Supervisor, Manager).
*   [**Component Architecture**](./docs/COMPONENT_ARCHITECTURE.md): System structure, component tree, and architectural decisions.
*   [**Code Quality Assessment**](./CODE_QUALITY_ASSESSMENT.md): Analysis of codebase readability, reusability, and maintainability.

## 🛠 Tech Stack

*   **Framework**: [Vite](https://vitejs.dev/) + [React](https://react.dev/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **Backend / Database**: [Firebase](https://firebase.google.com/) (Firestore, Auth)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/)
*   **Forms**: React Hook Form + Zod

---

## 🚀 Getting Started

Follow these instructions to set up and run the project in your local development environment.

### Prerequisites

*   **Node.js**: Version 18 or higher recommended.
*   **npm** or **yarn**: Package manager.
*   **Firebase Project**: (Optional if using existing config) Access to a Firebase project with Firestore enabled.

### Installation

1.  Clone the repository (if applicable):
    ```bash
    git clone <repository-url>
    cd studio
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Configuration

1.  **Firebase Configuration**:
    *   The Firebase client configuration is currently located in `src/firebase/config.ts`.
    *   Ensure this configuration matches your Firebase project credentials if you are setting up a new backend.

2.  **AI Configuration**:
    *   This prototype uses a simulated AI flow on the client side, so no API keys are strictly required for the AI features to function in demo mode.

### Database Seeding

To populate Firestore with initial sample data (users, checklists, templates):

```bash
npm run seed
```

This script (`scripts/seed.ts`) will create necessary documents for testing the application.

---

## 🏃‍♂️ Running the Application

### Start the Web Application

Run the Vite development server:

```bash
npm run dev
```

*   Open [http://localhost:3000](http://localhost:3000) in your browser.
*   You will see the login page where you can select a role to sign in (simulated auth).

---

## 📂 Project Structure

```
studio/
├── docs/               # Project documentation (Architecture, Workflows)
├── src/
│   ├── ai/             # AI simulation logic
│   ├── components/     # React components (UI, Feature-specific)
│   ├── firebase/       # Firebase configuration and hooks
│   ├── hooks/          # Custom React hooks (useChecklistQuery, etc.)
│   ├── lib/            # Utility functions, types, constants
│   ├── pages/          # Page components (Routes)
│   ├── providers/      # Context providers (Auth, etc.)
│   ├── App.tsx         # Main Application component with Routing
│   ├── main.tsx        # Entry point
│   └── scripts/        # Helper scripts (e.g., database seeding)
├── public/             # Static assets
└── ...config files
```

## 📄 License

This project is a prototype and intended for demonstration purposes.
