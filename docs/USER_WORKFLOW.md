# User Workflows (UX Scenarios)

This document outlines the core user journeys for the Safety Management System prototype. It describes how different roles interact with the application to achieve their safety goals.

## 1. Worker Workflow: Submitting a Safety Checklist

**Goal**: Perform a safety inspection before starting a specific task (e.g., Ladder Work) and report any risks.

1.  **Login**:
    *   User arrives at the landing page.
    *   Selects **"Worker"** role from the simulated login screen.
    *   Redirected to the **Worker Dashboard**.
2.  **Initiate Checklist**:
    *   Clicks the **"New Checklist"** button on the dashboard.
    *   Views available checklist templates (e.g., "Ladder Work", "Confined Space").
    *   Selects the appropriate template.
3.  **Fill Form**:
    *   Answers standard safety questions (Yes/No).
    *   **Scenario A (Safe)**: Answers "Yes" to all safety precautions.
    *   **Scenario B (Risk Identified)**:
        *   Answers "No" to a question (e.g., "Is the ladder stable?").
        *   System highlights the risk visually (Red border).
        *   User clicks **"Upload Evidence"** to take/upload a photo of the hazard.
        *   System simulates **AI Analysis** on the photo to determine risk severity (Safe/Warning/Danger).
4.  **Submission**:
    *   Clicks **"Submit Safety Checklist"**.
    *   Receives a success toast notification.
    *   Redirected back to Dashboard; the new checklist appears in history with status `submitted`.

## 2. Supervisor Workflow: Reviewing & Approving

**Goal**: Monitor team safety activities and approve/reject submitted checklists based on compliance.

1.  **Login**:
    *   Selects **"Supervisor"** role.
    *   Redirected to **Supervisor Dashboard**.
2.  **Review Queue**:
    *   Views a list of checklists with status `submitted`.
    *   Identifies high-priority items via the **Risk Level** badge (e.g., "Danger").
3.  **Detailed Inspection**:
    *   Clicks on a checklist item to view details.
    *   Reviews worker's answers.
    *   If a risk was reported, views the **uploaded photo** and the **AI Risk Assessment**.
4.  **Decision**:
    *   **Approve**: If safety measures are adequate, clicks **"Approve"**. Status changes to `approved`.
    *   **Reject**: If the environment is unsafe, clicks **"Reject"**. Status changes to `rejected`.
5.  **Update**:
    *   The list refreshes, and the processed item moves out of the pending queue (or updates status).

## 3. Safety Manager Workflow: High-Level Monitoring

**Goal**: Analyze overall safety trends and view all historical data.

1.  **Login**:
    *   Selects **"Safety Manager"** role.
    *   Redirected to **Manager Dashboard**.
2.  **Global Overview**:
    *   Views a master list of *all* checklists from *all* workers.
    *   The list is **sorted by priority**: High-risk items ("Danger") appear at the top regardless of date.
3.  **Drill Down**:
    *   Can click into any checklist to view the full audit trail (Submission time, Supervisor approval time, Risk evidence).
4.  **Refresh**:
    *   Uses the **Refresh Button** in the header to fetch the latest real-time data from the field.

