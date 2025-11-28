# **App Name**: Safety Guardian

## Core Features:

- Role-Based Authentication: Secure user authentication with role-based access control (Worker, Supervisor, SafetyManager) using Firebase Authentication.
- Checklist Form Generation: Dynamically render checklist forms based on selected work type, fetched from Firestore checklist templates.
- Risk Flagging: Flag checklist items as 'risky' if 'No' is selected, triggering further review.
- Photo Upload Simulation: Simulate photo uploads using Firebase Storage. UI will be basic for MVP.
- Approval Workflow: Supervisors can view submitted checklists and approve or reject them.
- Risk Dashboard: Safety managers view a dashboard highlighting checklists with 'risky' items or 'Danger' AI risk levels.
- AI Risk Assessment Tool: Simulate AI analysis of uploaded photos, returning a risk level (Safe, Warning, Danger) using a mock function. The mock function is a tool that reasons about image safety.

## Style Guidelines:

- Primary color: Deep blue (#1E3A8A) to convey trust and safety.
- Background color: Light blue (#E0F2FE) for a calm and clean interface.
- Accent color: Orange (#E45826) for alerts and important actions.
- Body and headline font: 'Inter' for a clean, modern, and readable experience.
- Use clear and simple icons to represent checklist items and risk levels.
- Prioritize data clarity with a clean, well-organized layout. Utilize cards and lists to display information efficiently.
- Use subtle animations to provide feedback and guide users through workflows.