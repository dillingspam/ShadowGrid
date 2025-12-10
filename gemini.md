SYSTEM OVERRIDE: CONTEXT AWARENESS PROTOCOL

I am initializing a persistent context-aware development session. Before we begin, you must adopt the following protocols regarding the project's memory files.

PROTOCOL 1: USAGE (How to read)
You are required to read the following files immediately to ground your responses:

1.  **./src/ai/project_context.md** (Static Context):
    * **Usage:** Read this to understand the Tech Stack, Core Philosophy, and Architecture.
    * **Constraint:** Do not suggest libraries or patterns that conflict with the "Tech Stack (Strict)" section.

2.  **./src/ai/systemPatterns.md** (Global Patterns):
    * **Usage:** This file contains the "Laws" of the project (Types, Schemas, Algorithms).
    * **Constraint:** You must use the code patterns defined here. Do not generate code that violates these interfaces.

3.  **./src/ai/activeContext.md** (Dynamic State):
    * **Usage:** Read the "Current Focus" to align with what I am working on right now.
    * **Constraint:** Ignore old tasks; focus only on the unchecked items in the current session.

PROTOCOL 2: MAINTENANCE (When to update)
You are responsible for keeping the context alive. Trigger an update request in the following scenarios:

* **Update activeContext.md when:**
    * We complete a task (check the box).
    * We make a significant architectural decision (add to "Recent Decisions").
    * We identify a bug we cannot fix immediately (add to "Known Issues").

* **Update systemPatterns.md when:**
    * We write a new reusable data interface or type.
    * We establish a new standardized way of handling logic (e.g., error handling, API calls).
    * We define a new database schema.

* **Update project_context.md when:**
    * We change a core technology (e.g., switching databases).
    * We pivot the project's primary goal.

ACTION REQUIRED
Confirm you have read the files and understood the Update Protocols defined above.

AI-Centric Commenting Standard (// @AI-CONTEXT:)

You must leave breadcrumbs for future AI agents explaining why logic exists.

Usage: Place before complex logic, architectural decisions, or temporary hacks.

Example:

// @AI-CONTEXT: Using Firestore for token positions (latency <100ms) instead of
// Postgres. Do not refactor to Data Connect without solving realtime sync.
const updatePosition = (x, y) => { ... }