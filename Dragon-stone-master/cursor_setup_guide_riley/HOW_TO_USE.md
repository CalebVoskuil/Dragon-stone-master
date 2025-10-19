# How to Use This Template  

---
title: "Template Usage Guide — Stone Dragon Volunteer Hours App"
category: "Meta"
related: ["HOW_TO_USE_NON_TECHNICAL.md", "AI_ENTRY_POINT.md"]
key_concepts: ["react_native", "sqlite", "prisma", "npo_app", "cursor_ai"]
updated: "2025-10-20"
---

This guide explains how to use this project template in **Cursor IDE** to build the **Stone Dragon Volunteer Hours App** — a secure cross-platform React Native application that allows students and volunteers to log hours and coordinators to verify submissions.

---

## Quick Start

1. Clone or copy this template into your development folder.  
2. Review this guide and provide project information to Cursor’s AI.  
3. Use the included prompts to scaffold your frontend, backend, and database.  
4. Follow the implementation checklist in the project plan to build your local prototype.

---

## Required Information

When setting up your project with Cursor AI, you’ll need to supply the following context:

### 1. Project Context
- **Project Type:** Cross-platform (Android/iOS) mobile app with local backend.  
- **Primary Technologies:** React Native (Expo), Node.js, Express, Prisma ORM, SQLite.  
- **Key Features:**  
  - Students/volunteers log service hours and upload proof.  
  - Coordinators review and approve/reject logs with comments.  
  - Gamification through streaks, badges, and hour tracking.  
  - POPIA-aligned data storage (local-only in prototype).  
- **Target Users:** Students, Coordinators, and NPO administrators.

### 2. Development Environment
- **Operating System:** Windows 11  
- **IDE:** Cursor or VS Code  
- **Version Control:** Git + GitHub  
- **Dependencies:**  
  - Node.js (LTS version)  
  - npm  
  - Expo CLI  
  - Prisma CLI  

### 3. Project Structure
- **Directories:**
  - `frontend/` — React Native code (Expo)
  - `backend/` — Node.js + Express + Prisma (local SQLite)
  - `docs/` — POPIA, privacy, and setup guides  
- **No external API or cloud infra yet (local mode).**

### 4. Development Workflow
- **Version Control:** Git  
- **Branching Strategy:** `main` → `dev` → `feature/*`  
- **Code Review Process:** PRs reviewed via Cursor or GitHub AI suggestions.  
- **Coding Standards:** ESLint + Prettier (Airbnb style for JS/TS).

### 5. Testing Strategy
- **Test Types:** Unit (frontend + backend), Integration (API routes).  
- **Testing Frameworks:** Jest, React Testing Library, Supertest.  
- **Coverage:** Aim for ~80% unit coverage on backend logic.

### 6. Deployment Requirements
- **Deployment Target:** Local (no cloud).  
- **Environments:** Development only.  
- **Future-ready:** Easily migratable to AWS or Supabase later.

### 7. Documentation Preferences
- **Format:** Markdown (`.md`).  
- **Sections to Keep:** Setup, Architecture, POPIA, Security, Project Plan.  
- **Extra Sections:** Future AWS migration notes.

### 8. Project Timeline
- **Prototype Completion Goal:** December 2025.  
- **Milestones:**  
  1. Local MVP (frontend + backend integration).  
  2. Gamification system.  
  3. Coordinator verification dashboard.  
- **Current Phase:** Planning / Early implementation.

### 9. Team Information
- **Team Size:** 1 developer (you).  
- **Access Controls:** Student / Coordinator roles handled in local DB.  
- **Team Workflow:** Local commits + GitHub sync.

### 10. Security Requirements
- **Standards:** POPIA-aligned; password hashing with bcrypt; local file isolation.  
- **Authentication:** Local email/password auth.  
- **Compliance:** POPIA, data minimization, and consent for minors.

---

## Using the AI Assistant

### 1. Initial Setup
- Tell Cursor AI that you are building a **React Native + Node.js + SQLite** volunteer-tracking app.  
- Ask it to scaffold:
  - `frontend/` structure with Expo navigation and screens.
  - `backend/` Express + Prisma server with SQLite schema.

**Example prompt:**
