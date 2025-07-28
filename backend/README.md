# 🚀 1 Project Objective
> To build a backend for information sharing between administration and the public, using FastAPI in a modular monolith style (inspired by microservices), with strict role-based access and field-level enforcement.


# 🧱 2 Tech Stack Chosen

| Layer             | Tool                                        | Notes                                        |
| ----------------- | ------------------------------------------- | -------------------------------------------- |
| **Language**      | Python 3.11+                                | Async-first, modern                          |
| **Web Framework** | FastAPI                                     | Type-safe, dependency-injection based        |
| **ORM**           | SQLModel                                    | SQLAlchemy-powered, Pydantic-compatible      |
| **Database**      | [Neon.tech](https://neon.tech) (PostgreSQL) | Scalable, cloud-native, serverless           |
| **Validation**    | Pydantic v2                                 | Request/response models                      |
| **Auth**          | JWT                                         | Role-based access and scopes                 |
| **Package Manager** | [`uv`](https://github.com/astral-sh/uv)   | Lightning-fast virtualenv and dependency mgmt |
| **Dev Tools**     | pre-commit, ruff, black, mypy, pytest       | Code quality, linting, type checks, testing  |


# 🧩 3. Modules Identified
> Each feature is its own self-contained module with its own files:
- `auth/` – handles user login, signup, token
- `patient/` – handles patient CRUD with role/field enforcement
- `chat_inference/` – AI response or data interaction via inference engine


# 🏗️ 4. Final Project Architecture
```bash
project_name(backend)/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/                    # System-wide setup & dependencies
│   │   ├── __init__.py
│   │   ├── config.py              # Loads .env and environment variables
│   │   ├── database.py            # SQLModel DB setup and session management
│   │   ├── security.py            # Password hashing, token logic
│   │   ├── exception_handlers.py  # Register FastAPI handlers ; Centralized app-level setup
│   │   ├── middleware.py          # Custom FastAPI middleware
│   │   └── logging.py             # Logging configuration
│   ├── shared/                  # Cross-cutting shared logic
│   │   ├── role_checker.py
│   │   ├── exceptions.py          # Define reusable exceptions ; Reuse across modules
│   │   └── utils/
│   ├── modules/                 # Feature modules
│   │   ├── __init__.py
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── api.py
│   │   │   ├── service.py
│   │   │   ├── schemas.py
│   │   │   ├── dependencies.py
│   │   │   └── helpers.py
│   │   ├── patient/
│   │   │   ├── __init__.py
│   │   │   ├── api.py
│   │   │   ├── service.py
│   │   │   ├── models.py        # SQLModel DB models
│   │   │   ├── schemas.py
│   │   │   ├── dependencies.py
│   │   │   ├── access_control.py
│   │   │   └── helpers.py
│   │   └── chat_inference/
│   │       ├── __init__.py
│   │       ├── api.py
│   │       ├── service.py
│   │       └── schemas.py
├── tests/                       # Mirrors app/modules
│   ├── auth/
│   ├── patient/
│   └── chat_inference/
├── .env
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── requirements-dev.txt
├── pyproject.toml
├── pre-commit-config.yaml
└── README.md
```



# 5 Project Architecture (Microservice-Style Architecture)
- Each module has full ownership of its routes, services, schemas, and business logic
- main.py glues all routers, middleware, and startup events together


- `app/main.py` = Entry point for FastAPI app, includes routers, middleware, startup events, etc.
- `app/modules/` = each domain module (like auth, patient) has full ownership of
- - `app/module/patient/`
- - - `api.py` = Mounts all routes for this module | Similar to: routes.js + controller.js in Express.js
- - - `schemas.py` = Pydantic models for request/response validation | Response serialization (e.g., return a structured JSON) | Prevents schema sprawl & enforces contract between frontend/backend
- - - `service.py` = Contains core business logic (calls DB, performs rules, etc.)
- - - `models.py` =  SQLModel DB models
- - - `dependencies.py` = Provides dependency-injection for routes | Authenticated user injection | Role verification | Shared param extraction (like pagination) | Injected via `Depends(...)` | similar to middleware
- - - `helpers.py` = helper/extra code block for this module
- - - `access_control.py` = Specific to role/field-based access enforcement for this module | domain-specific logic, so it’s great to keep it in the module | can also have role detection in middleware | RBAC

- `app/core/` = Holds core system-level concerns: Global middleware, Logging DB connection, Settings
File	Purpose
- - `config.py`	Loads environment variables (via Pydantic)
- - `database.py/prisma_client.py`	Initializes DB connection, creates engine/session
- - `security.py`	Token-related logic (JWT, password hashing)
- - `middleware.py`	Custom FastAPI middleware (e.g., logging, request IDs, role)
- - `logging.py`	Structured logging config (e.g., loguru or stdlib)

- `app/shared/` = Used for reusable cross-module logic

- `tests/` = Mirrors the structure of modules/


# 6 Module structure: Layer Classification/File Responsibilities (in Clean Architecture Terms)

| File                | Layer                     | Purpose                                               |
| ------------------- | ------------------------- | ----------------------------------------------------- |
| `api.py`            | Interface / Controller    | HTTP routes (FastAPI router)                          |
| `schemas.py`        | Interface / DTO Layer     | Input/output validation via Pydantic                  |
| `models.py`         |	Persistence Layer	        |SQLModel classes (database tables)                     |
| `dependencies.py`   | Framework Glue /Inj. Layer| Injected functions for auth, current user, pagination |
| `service.py`        | Use Case / Business Logic | Coordinates DB access, handles core logic             |
| `access_control.py` | Policy Layer              | Enforces domain-level authorization rules             |
| `helpers.py`        | Support / Utility Layer   | Simple, reusable logic for internal use               |



# Setup Guide
## 1. Clone the repo
```bash
git clone https://github.com/chingu-voyages/V56-tier3-team-34.git
cd V56-tier3-team-34/backend
```

## 2. Ensure Python 3.11 is installed
You can check with:
```bash
python3.11 --version
```
If not installed, install Python 3.11 via your package manager

## 3. Install uv (if not already installed)
```bash
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"     # Windows
```
### or
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh  # Linux/macOS
```

## 4. Setup virtual environment with uv
```bash
uv venv .venv
.venv\Scripts\activate     # Windows
```
### or
```bash
uv venv .venv
source .venv/bin/activate  # Linux/macOS
```

## 5. Install core + dev dependencies
```bash
uv pip install fastapi uvicorn[standard] sqlmodel asyncpg python-dotenv
uv pip install ruff black mypy pre-commit pytest pytest-asyncio httpx
```

## 6. Setup pre-commit hooks [note: avoid this step might create conflict and run test by pre-commit run command]
```bash
pre-commit install
```

## 7. Copy .env file and set your config
```bash

cp .env.example .env       # if provided
```
### Or manually create `.env`

## 8. Run the dev server
```bash
uvicorn app.main:app --reload
```


# Tooling Notes
uv is used for dependency + virtualenv management (no pip/poetry required)

pyproject.toml configures ruff, black, and mypy

pre-commit runs linting and type checks on every commit

SQLModel is used as your async ORM with asyncpg

# Pydantic vs SQLModel Roles
Tool	Purpose	DB Access?
Pydantic	Request validation, response	❌ No
SQLModel	DB Models + validation	✅ Yes
Service.py	Uses SQLModel for logic	✅ Yes


# 🤝 Contributing
- Follow the setup guide above
- Ensure pre-commit passes before pushing
- Add tests for new modules
- Keep modules self-contained and isolated


# Contributing to This Project
- Make sure you have Python 3.11 installed.
- Create and activate your virtual environment.
- Install dependencies using: pip install -r requirements-dev.txt
- Ensure .env is properly set up with necessary environment variables.

## Code Style & Quality
> We enforce code quality with automated tools:
- Formatting: We use black for consistent code formatting.
- Linting: ruff ensures code style and common issues.
- Type Checking: mypy for static type checking.

## Running Tests & Checks
> Before pushing your code, please run all tests and checks locally:
```bash
# Run all linters and formatters on all files
pre-commit run --all-files

# Run tests (adjust test command if you use pytest or similar)
pytest tests/
```
- Fix any issues reported by the linters or tests before submitting.

## Git Workflow
- Branch from `development` with descriptive names, e.g., feature/add-login, fix/address-bug.
- Commit messages should be clear and concise.
- Push your branch and open a Pull Request targeting `development`.
