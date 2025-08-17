# Agile Project Plan: Surgery Status Board

This document outlines a 5-week agile development plan for the "Surgery Status Board" project. It includes feature breakdowns, technology choices, a suggested directory structure, and a 5-sprint plan complete with UX focus, user stories, tasks, and acceptance criteria.

## 1. Project Overview

The goal is to build a full-stack application that allows surgery center staff to manage and track a patient's surgical progress. This information is then displayed on a public-facing status board for waiting family and friends. The application will support three user roles (Guest, Admin, Surgical Team Member) and optionally include an AI-powered chat assistant for help.

## 2. Technology Stack

*   **Backend:** FastAPI (Python)
*   **Database:** PostgreSQL
*   **Frontend:** Next.js (React/TypeScript)
*   **Styling:** Tailwind CSS (Recommended for utility-first approach, works well with Next.js)
*   **AI Integration:** Google Gemini API

## 3. Suggested Directory Structure

Here is a suggested monorepo structure to manage both the frontend and backend codebases.

```
/voyage-project-surgerystatus/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app instance
│   │   ├── crud.py             # Create, Read, Update, Delete database operations
│   │   ├── database.py         # Database session management
│   │   ├── models.py           # SQLAlchemy ORM models
│   │   ├── schemas.py          # Pydantic schemas for data validation & serialization
│   │   └── dependencies.py     # Shared dependencies (e.g., get_db)
│   │   └── security.py         # Authentication logic (passwords, tokens)
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── auth.py         # Authentication routes (/login)
│   │       ├── patients.py     # Patient data routes
│   │       └── status.py       # Patient status update routes
│   │       └── users.py        # User management routes
│   ├── tests/                  # Backend tests
│   ├── .env.example            # Environment variable template
│   ├── alembic/                # Alembic database migration scripts
│   ├── alembic.ini             # Alembic configuration
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/             # Route group for authentication pages
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (app)/              # Route group for main application pages
│   │   │   ├── layout.tsx      # Main app layout with header/footer
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── patient-info/
│   │   │   │   └── page.tsx
│   │   │   ├── patient-status-update/
│   │   │   │   └── page.tsx
│   │   │   └── status-board/
│   │   │       └── page.tsx
│   │   └── globals.css
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── ui/                   # Reusable UI elements (Button, Input, etc.)
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AIChat.tsx
│   │   └── forms/
│   │       ├── LoginForm.tsx
│   │       └── PatientForm.tsx
│   ├── lib/
│   │   ├── api.ts              # Functions for making API calls to the backend
│   │   └── hooks.ts            # Custom React hooks
│   │   └── utils.ts            # Utility functions
│   ├── styles/
│   ├── public/
│   ├── .env.local.example
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── PROJECT_PLAN.md
```

## 4. Feature Prioritization

*   **Must-Have (MVP):**
    *   User authentication for "Admin" and "Surgical Team Member" roles.
    *   Guest access to the status display screen.
    *   Admins can add new patients.
    *   Admins and Surgical Team Members can update a patient's surgical status.
    *   A public screen that displays all non-dismissed patients' numbers and statuses.
    *   The status display screen updates automatically (or via a refresh button for MVP).
    *   Basic, clean, and responsive UI.

*   **Could-Have:**
    *   The status display screen automatically cycles through pages if content overflows.
    *   Search functionality for patients by last name on the "Patient Information" and "Patient Status Update" screens.
    *   Real-time updates on the status board using WebSockets.
    *   Personalized welcome messages for logged-in users.

*   **Nice-to-Have:**
    *   AI Chatbot integration for user help.
    *   OAuth authentication (Google/GitHub).
    *   Email notifications for status changes.
    *   Advanced patient search criteria (e.g., partial address, phone number).

---

## 5. The 5-Week Agile Sprint Plan

### **Sprint 1: Project Setup & Core Backend**

*   **Goal:** Initialize project repositories, set up the database, and build the core API endpoints for managing patients and users (without authentication).
*   **UX/UI Focus:** N/A. Focus is on backend architecture and setup.

---

**User Story 1.1:** As a developer, I want to set up the project structure for both the backend and frontend.

*   **Tasks:**
    * [ ] Create a monorepo with `backend` and `frontend` directories.
    * [ ] Initialize a FastAPI project in `backend`.
    * [ ] Initialize a Next.js with TypeScript project in `frontend`.
    * [ ] Set up `requirements.txt` for Python and `package.json` for Node.js.
*   **Acceptance Criteria:**
    * [ ] Backend and frontend projects are created in their respective directories.
    * [ ] Basic "hello world" endpoints/pages are functional.

---

**User Story 1.2:** As a backend developer, I want to define the database models for Patients and Users.

*   **Tasks:**
    * [ ] Define a `Patient` model in `backend/app/models.py` with all required fields (name, address, etc.).
    * [ ] Define a `User` model with fields for username, hashed password, and role (Admin, Surgical Team).
    * [ ] Configure Alembic for database migrations.
    * [ ] Generate and apply the initial migration.
*   **Acceptance Criteria:**
    * [ ] `Patient` and `User` tables are created in the PostgreSQL database.
    * [ ] Alembic is correctly configured and can generate migrations.

---

**User Story 1.3:** As a backend developer, I want to create basic CRUD API endpoints for patients.

*   **Tasks:**
    * [ ] Create Pydantic schemas in `backend/app/schemas.py` for patient creation and display.
    * [ ] Implement `create_patient`, `get_patient`, `get_all_patients` functions in `crud.py`.
    * [ ] Create API routes in `routers/patients.py` for `POST /patients` and `GET /patients`.
*   **Acceptance Criteria:**
    * [ ] `POST /patients` successfully creates a new patient in the database.
    * [ ] `GET /patients` and `GET /patients/{id}` retrieve patient data correctly.
    * [ ] API endpoints are documented (e.g., via Swagger UI).

### **Sprint 2: Authentication & Frontend Foundation**

*   **Goal:** Implement user authentication on the backend and set up the basic frontend structure with pages, navigation, and API communication.
*   **UX/UI Focus:** Wireframe the main application layout (Header, Footer, Nav) and the Login page. Design a simple and intuitive navigation flow.

---

**User Story 2.1:** As a backend developer, I want to implement JWT authentication for secure user login.

*   **Tasks:**
    * [ ] Add password hashing to the `User` model.
    * [ ] Create a `/login` endpoint in `routers/auth.py` that accepts a username/password, verifies credentials, and returns a JWT token.
    * [ ] Implement dependency functions in `security.py` to verify JWT tokens and protect routes.
    * [ ] Create a hard-coded list of Admin and Surgical Team users.
*   **Acceptance Criteria:**
    * [ ] Users can send a POST request to `/login` with correct credentials and receive a JWT.
    * [ ] Sending an invalid token or no token to a protected route results in a 401 Unauthorized error.

---

**User Story 2.2:** As a frontend developer, I want to set up the main application layout and pages.

*   **Tasks:**
    * [ ] Create a `Header` component with the app name, date, and navigation links.
    * [ ] Create a `Footer` component with the GitHub link and team names.
    * [ ] Implement the root layout in `frontend/app/(app)/layout.tsx` to include the Header and Footer.
    * [ ] Create placeholder pages for Home, Patient Info, Patient Status Update, and Status Board.
*   **Acceptance Criteria:**
    * [ ] All main pages render with a consistent Header and Footer.
    * [ ] Navigation links in the header correctly route to their respective pages.

---

**User Story 2.3:** As a user, I want to be able to log in to the application through a login form.

*   **Tasks:**
    * [ ] Create a `LoginForm` component in the frontend.
    * [ ] Add the form to the `/login` page.
    * [ ] Implement a function in `lib/api.ts` to call the backend's `/login` endpoint.
    * [ ] On successful login, store the JWT in a secure client-side location (e.g., httpOnly cookie) and redirect the user to the home page.
*   **Acceptance Criteria:**
    * [ ] A user can enter credentials into the login form and click "Login".
    * [ ] On success, they are redirected and the token is stored.
    * [ ] On failure, an appropriate error message is displayed.

### **Sprint 3: Core Functionality - Patient Management**

*   **Goal:** Enable Admins to add and update patient information and allow Admins/Surgical Team members to update a patient's status.
*   **UX/UI Focus:** Design the "Patient Information" form and the "Patient Status Update" interface. Ensure forms are user-friendly with clear labels, validation, and feedback.

---

**User Story 3.1:** As an Admin, I want to add a new patient to the system so their surgery can be tracked.

*   **Tasks:**
    * [ ] Create a `PatientForm` component in the frontend for all patient details.
    * [ ] Protect the `/patient-info` page so only Admins can access it.
    * [ ] Implement the backend `POST /patients` endpoint to accept patient data, generate a unique 6-character patient number, and save it with a "Checked In" status.
    * [ ] Connect the frontend form to the backend API.
*   **Acceptance Criteria:**
    * [ ] An Admin can fill out and submit the new patient form.
    * [ ] A unique patient number is generated and displayed.
    * [ ] The patient is saved to the database with the correct initial status.
    * [ ] Non-Admins are redirected if they try to access the page.

---

**User Story 3.2:** As an Admin or Surgical Team Member, I want to update a patient's status.

*   **Tasks:**
    * [ ] Create the UI for the "Patient Status Update" screen.
    * [ ] The user enters a patient number to fetch and display patient details.
    * [ ] Create a backend endpoint `PUT /patients/{patient_id}/status` that accepts a new status.
    * [ ] Enforce the business logic: status can only move to the next or previous step.
    * [ ] Protect the route for Admins and Surgical Team members.
*   **Acceptance Criteria:**
    * [ ] Entering a valid patient number displays their information.
    * [ ] The status dropdown correctly shows only the valid next/previous statuses.
    * [ ] Submitting the change updates the patient's status in the database.
    * [ ] An error is shown if an invalid status transition is attempted.

### **Sprint 4: Patient Status Display & Real-time Updates**

*   **Goal:** Build the public-facing patient status board and ensure it updates when a patient's status changes.
*   **UX/UI Focus:** Design a clear, high-contrast, and easily scannable "Patient Status Display" board. Use color-coding effectively to communicate status at a glance. Plan the layout for automatic page cycling if needed.

---

**User Story 4.1:** As a Guest, I want to see the status of all patients on a single screen.

*   **Tasks:**
    * [ ] Create the "Patient Status Display" component/page.
    * [ ] Create a public backend endpoint `GET /status` that returns all patients not yet "Dismissed".
    * [ ] The frontend fetches data from this endpoint and displays each patient's number and status.
    * [ ] Implement the color-coding for each status.
*   **Acceptance Criteria:**
    * [ ] The status board page loads and displays a list of patient numbers and their current status.
    * [ ] Each status has a distinct, visually clear background color.
    * [ ] Patients with the "Dismissed" status are not shown.

---

**User Story 4.2:** As a user, I want the status board to update automatically when a change occurs.

*   **Tasks:**
    * [ ] **(MVP Approach):** Add a "Refresh" button to the status board page that re-fetches the data.
    * [ ] **(Stretch Goal - WebSockets):** Integrate WebSockets into the FastAPI backend.
    * [ ] **(Stretch Goal - WebSockets):** When a status is updated, broadcast the change to all connected clients.
    * [ ] **(Stretch Goal - WebSockets):** The frontend listens for WebSocket messages and updates the UI in real-time without a page reload.
*   **Acceptance Criteria:**
    * [ ] **(MVP):** Clicking the "Refresh" button updates the board with the latest patient statuses.
    * [ ] **(Stretch Goal):** When a patient's status is updated on the update screen, the change is reflected on the status board within seconds without any user interaction.

### **Sprint 5: AI Chatbot, Final Polish & Deployment**

*   **Goal:** Integrate the AI chatbot, refine the overall UI/UX, conduct thorough end-to-end testing, and prepare the application for deployment.
*   **UX/UI Focus:** Design the AI chat dialog. Conduct a final review of all screens for consistency, clarity, and responsiveness. Ensure a polished and professional look and feel.

---

**User Story 5.1:** As a user, I want to use an AI chatbot to get help about the application.

*   **Tasks:**
    * [ ] Create an `AIChat` component with a display area, input field, and submit button.
    * [ ] Create a backend route (e.g., `POST /chat`) that takes a user's question, adds pre-defined context about the application, and calls the Google Gemini API.
    * [ ] The frontend sends the user's query to this backend route and displays the streaming response from the AI.
*   **Acceptance Criteria:**
    * [ ] Clicking the chat icon opens a chat dialog.
    * [ ] Users can type a question and receive a relevant, helpful answer from the AI.
    * [ ] The conversation history is displayed in the chat window.

---

**User Story 5.2:** As a developer, I want to finalize the application's styling and ensure it is responsive.

*   **Tasks:**
    * [ ] Review all pages and components for consistent styling (fonts, colors, spacing).
    * [ ] Test the application on various screen sizes (desktop, tablet, mobile) and fix any layout issues.
    * [ ] Add loading states and spinners for asynchronous operations.
    * [ ] Refine error message displays to be user-friendly.
*   **Acceptance Criteria:**
    * [ ] The application has a cohesive and professional visual design.
    * [ ] All pages are fully responsive and usable on common device sizes.
    * [ ] The user experience feels smooth, with clear feedback for loading and error states.

---

**User Story 5.3:** As a developer, I want to deploy the application to a hosting service.

*   **Tasks:**
    * [ ] Prepare the backend and frontend for production (e.g., setting environment variables, build optimizations).
    * [ ] Choose hosting providers with free tiers (e.g., Vercel for Next.js, Render or Heroku for FastAPI/Postgres).
    * [ ] Write deployment scripts/configurations.
    * [ ] Deploy both applications and ensure they can communicate with each other.
*   **Acceptance Criteria:**
    * [ ] The frontend is accessible via a public URL.
    * [ ] The backend is accessible via a public URL.
    * [ ] The full application is functional in the deployed environment.
