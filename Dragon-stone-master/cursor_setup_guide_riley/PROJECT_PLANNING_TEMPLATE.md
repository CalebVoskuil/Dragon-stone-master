# Project Planning Template — Stone Dragon Volunteer Hours App

## Project Overview

### Basic Information
- **Project Name:** Stone Dragon Volunteer Hours App  
- **Project Type:** Cross-platform Mobile App (Android + iOS)  
- **Target Users:** Students, Volunteers, and Coordinators from partnered schools affiliated with the Stone Dragon NPO (Cape Town).  
- **Project Description:**  
  The Stone Dragon Volunteer Hours App enables students and volunteers to log their service hours, upload proof of participation, and track their progress through badges and streaks. Coordinators can verify and manage submissions, approve or reject hours, and provide feedback. The system follows POPIA compliance and stores data locally during the prototype phase.

### Key Features
1. **Volunteer Hour Logging**
   - Description: Allows students/volunteers to log hours, upload signed proof documents, and select their affiliated school.  
   - Priority: High  
   - Dependencies: Local SQLite database, secure local file storage  

2. **Coordinator Verification Dashboard**
   - Description: Enables coordinators to view, approve, or reject submitted logs with comments.  
   - Priority: High  
   - Dependencies: User roles, Prisma schema, backend Express routes  

3. **Gamification (Points and Badges)**
   - Description: Tracks volunteer streaks and awards badges based on accumulated hours.  
   - Priority: Medium  
   - Dependencies: Badge and VolunteerLog tables in Prisma  

4. **Push Notifications**
   - Description: Sends local push notifications to users for approval/rejection updates and streak reminders.  
   - Priority: Medium  
   - Dependencies: React Native Notifications API  

5. **Accessibility & POPIA Compliance**
   - Description: English-only interface with accessibility options and POPIA-compliant data handling (user consent upload).  
   - Priority: High  
   - Dependencies: Secure data storage, local consent upload handling  

---

## Technical Requirements

### Technology Stack
- **Frontend:** React Native (Expo) + TypeScript  
- **Backend:** Node.js + Express  
- **Database:** SQLite (via Prisma ORM)  
- **Other Tools:** Prisma Studio, ESLint, Prettier, Jest, React Testing Library  

### Development Environment
- **Operating System:** Windows 11  
- **IDE:** Cursor or Visual Studio Code  
- **Version Control:** Git + GitHub  
- **Other Tools:** Node.js LTS, npm, Expo CLI  

---

## Project Structure

### Directory Organization
- **Do you want to keep all template directories?** Yes  
- **Additional directories needed:**  
  - `docs/` for POPIA compliance, setup, and project documentation  
  - `frontend/assets/` for icons, badges, and logos  
- **Naming conventions:**  
  - Files: kebab-case  
  - Components: PascalCase  
  - Database models: singular nouns (e.g., `User`, `VolunteerLog`)  

---

## Development Workflow

### Version Control
- **Branching strategy:** `main` → `dev` → `feature/*`  
- **Code review process:** Pull requests reviewed via Cursor’s AI or GitHub suggestions  
- **Coding standards:** Airbnb TypeScript/JavaScript style guide + Prettier formatting  

### Testing Strategy
- **Test types needed:** Unit and Integration  
- **Testing frameworks:** Jest, React Testing Library, Supertest  
- **Coverage requirements:** 80% backend and 70% frontend  

---

## Deployment

### Environment Setup
- **Deployment targets:** Local (prototype phase only)  
- **Environments needed:** Development  
- **Deployment tools:** Manual local setup with npm scripts  

### Security Requirements
- **Authentication system:** Email + password using bcrypt for hashing  
- **Security standards:** POPIA-aligned (local storage encryption, consent handling)  
- **Compliance needs:** POPIA — Protection of Personal Information Act (South Africa)  

---

## Project Timeline

### Milestones
1. **Milestone 1 — MVP Build**
   - Target Date: November 2025  
   - Deliverables: React Native frontend + local Node.js backend + SQLite database connection  
   - Dependencies: Prisma setup, authentication routes  

2. **Milestone 2 — Coordinator Dashboard**
   - Target Date: December 2025  
   - Deliverables: Functional verification system for proof submissions (approve/reject/comments)  
   - Dependencies: VolunteerLog model, frontend routes  

3. **Milestone 3 — Gamification and Notifications**
   - Target Date: February 2026  
   - Deliverables: Points and badge system with local push notifications  
   - Dependencies: Badge logic, local notification setup  

### Current Status
- **Current Phase:** Planning  
- **Start Date:** October 2025  
- **Target Completion:** February 2026  

---

## Team Information

### Team Structure
- **Number of developers:** 1 (Caleb Voskuil)  
- **Roles needed:**  
  - Developer (React Native, Node.js, Prisma)  
  - Designer (optional, Figma prototype)  
- **Access levels:**  
  - Student/Volunteer: Log hours and upload documents  
  - Coordinator: Verify submissions and leave feedback  

### Communication
- **Team communication tools:** GitHub Issues, Cursor comments  
- **Meeting schedule:** Weekly solo progress reviews  
- **Documentation preferences:** Markdown (`.md`) with AI-assisted updates  

---

## Additional Requirements

### Documentation
- **Documentation format:** Markdown  
- **Required sections:** Setup, POPIA compliance, Security, Project planning, Prisma schema  
- **Additional sections:** Future AWS migration guide  

### Maintenance
- **Monitoring needs:** Local console logs for errors, debug-level tracking  
- **Backup requirements:** Regular backup of local SQLite file  
- **Update schedule:** Bi-weekly feature commits or per milestone completion  

---

## Notes
- Prototype runs fully offline with a local SQLite database (no external API).  
- Prisma ORM manages schema, migrations, and seeding.  
- Future versions will migrate to AWS (S3 for document uploads, RDS for data).  
- Coordinators are the first admin-level users, managing proof verification and student claims.  
- The app’s visual design will follow the Figma layout guidelines for the coordinator dashboard.

---

*Completed: October 2025 — Defines the local prototype version of the Stone Dragon Volunteer Hours App.*
