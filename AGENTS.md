# AGENTS.md

## 1. Purpose

This file defines the universal working rules for AI coding agents working on this project.

These rules are tool-independent and apply whether the agent is GitHub Copilot, Cline, or another coding agent.

The agent must follow this file together with the project's approved requirement documents.

The agent must not treat requirements as an immediate coding instruction. The agent must work through the project's backlog and task workflow.

---

## 2. Project Source of Truth

The following documents define the approved product requirements:

1. `01-PRD.md`
2. `02-Business-Rules.md`
3. `03-Functional-Requirements.md`
4. `04-UX-Flows.md`
5. `05-Data-Model.md`
6. `06-Acceptance-Criteria.md`

These documents are the source of truth for product behavior and requirements.

### Priority

When interpreting requirements, use this order:

1. `01-PRD.md`
2. `02-Business-Rules.md`
3. `03-Functional-Requirements.md`
4. `04-UX-Flows.md`
5. `05-Data-Model.md`
6. `06-Acceptance-Criteria.md`
7. `BACKLOG.md`
8. `TASK.md`
9. Individual task logs in `/task/`

`BACKLOG.md`, `TASK.md`, and task logs organize implementation work. They must not silently override approved requirements.

If an implementation task appears to conflict with an approved requirement, stop and report the conflict instead of silently changing the requirement.

---

# 3. Product Context

This project is an internal Android application for a small frozen-food consignment/distribution business.

The MVP is designed around:

- Android
- React Native
- Expo
- TypeScript
- local SQLite database
- local-first / offline-first operation
- single business
- single device
- single operational user
- no mandatory cloud backend
- optional Google Drive database backup

The application supports the operational lifecycle:

```text
Production
    ↓
Inventory
    ↓
Delivery Planning
    ↓
Delivery Confirmation
    ↓
Sales Confirmation
    ↓
Reconciliation / Return
    ↓
Settlement
    ↓
Invoice
    ↓
Payment
```

The MVP should remain simple and operationally focused.

Do not introduce complexity merely because a future version may need it.

---

# 4. Core Engineering Principle

> Build simple for today, but do not design yourself into a dead end for tomorrow.

The agent must:

- keep the MVP simple;
- avoid unnecessary infrastructure;
- preserve clear separation of concerns;
- preserve historical transaction integrity;
- keep business rules independent from UI;
- keep persistence behind repositories or equivalent boundaries;
- avoid premature cloud/synchronization architecture;
- prepare stable foundations for future API/cloud evolution.

Future-readiness does not mean implementing future functionality now.

---

# 5. Requirements → Backlog → Tasks

Requirements must not be implemented directly without passing through the project's work-management layer.

The standard flow is:

```text
Requirements
    ↓
Backlog Item
    ↓
Tasks
    ↓
Implementation
    ↓
Testing
    ↓
Expo Preview
    ↓
Verification
    ↓
Task Done
    ↓
Backlog Update
```

The agent must use this workflow for substantive implementation work.

## 5.1 Backlog

`BACKLOG.md` is the bridge between approved requirements and implementation work.

A backlog item represents a meaningful functional or technical outcome.

Examples:

```text
BL-001 — Product & Variant Management
BL-002 — Agent Management
BL-003 — Production
BL-004 — Inventory
BL-005 — Delivery
```

A backlog item should reference the relevant requirements and acceptance criteria.

The agent must not create implementation tasks that have no identifiable purpose or requirement relationship, except for clearly justified technical/infrastructure work.

---

# 6. Task Registry

`TASK.md` is the central task registry and status index for the project.

It contains the complete list of defined tasks and their current statuses.

Every task defined in `TASK.md` must have a corresponding file in `task/`:

```text
task/[task-id].txt
```

The task file is the detailed record for an individual task. It is created **when the task is defined**, not only after implementation begins.

A task file may exist while the task is still `TODO`. For example:

```text
STATUS: TODO
IMPLEMENTATION: Not started
TEST: Not started
PREVIEW: Not started
VERIFICATION: Not started
```

The task file persists throughout the entire task lifecycle and records both:

- the task definition; and
- the execution and evidence history.

The task file should record, where applicable:

```text
TASK ID:
TITLE:
STATUS:

BACKLOG:
REQUIREMENTS:
ACCEPTANCE CRITERIA:

OBJECTIVE:
SCOPE:
DEPENDENCIES:

IMPLEMENTATION:
FILES CHANGED:

TEST:
TEST RESULT:

PREVIEW:
PREVIEW RESULT:

VERIFICATION:
VERIFICATION RESULT:

EVIDENCE:
ISSUES:
DECISIONS:
NOTES:
```

The exact format may evolve, but the task file must allow another developer or agent to understand what the task is and what happened during its lifecycle.

`TASK.md` and `task/` must remain consistent.

- Every task registered in `TASK.md` must have a corresponding `task/[task-id].txt`.
- Every valid task file must be registered in `TASK.md`.
- Missing task files must be created.
- A valid task file that is missing from `TASK.md` must be reconciled into `TASK.md`.
- Task IDs must be unique and must not be reused for a different task.
- The status recorded in a task file and in `TASK.md` must agree.

Historical evidence must not be fabricated. If historical information cannot be established from repository artifacts or available evidence, record it as:

```text
UNKNOWN
```

Do not claim implementation, testing, preview, or verification that cannot be supported by evidence.

---

# 7. Task IDs

Every task must have a unique and stable task ID.

Recommended format:

```text
BL-[BACKLOG NUMBER]-[TASK NUMBER]
```

Examples:

```text
BL-001-01
BL-001-02
BL-002-01
```

The task ID must be used consistently in:

- `TASK.md`
- `/task/[task-id].txt`
- commit messages when practical
- relevant implementation notes
- test/evidence references when practical

Do not reuse a task ID for a different task.

---

# 8. Task Scope

Each task should be:

- small;
- specific;
- understandable;
- independently verifiable where practical;
- limited to one coherent objective.

Avoid creating tasks that combine unrelated work.

Bad:

```text
Implement the entire inventory system.
```

Better:

```text
BL-004-01 — Create inventory stock movement model
BL-004-02 — Implement production stock movement
BL-004-03 — Implement delivery stock movement
BL-004-04 — Implement return stock movement
BL-004-05 — Display owner stock balance
```

If a task becomes too large or changes into multiple unrelated objectives, split it into additional tasks.

---

# 9. Task Files and Evidence

The `/task/` directory contains the task files for individual tasks.

Each defined task must have a corresponding task file:

```text
/task/[task-id].txt
```

The task file is created **when the task is defined**, not after implementation begins.

It records both the **task definition** and its **execution/lifecycle record**, and it persists throughout the entire task lifecycle (`TODO` → `DONE`).

A task file may therefore exist while the task is still `TODO`, for example:

```text
STATUS: TODO
IMPLEMENTATION: Not started
TEST: Not started
PREVIEW: Not started
VERIFICATION: Not started
```

Example:

```text
/task/BL-001-03.txt
```

The task file should record relevant information such as:

```text
TASK ID:
TITLE:
STATUS:

BACKLOG:
REQUIREMENTS:
ACCEPTANCE CRITERIA:

OBJECTIVE:
SCOPE:
DEPENDENCIES:

IMPLEMENTATION:

FILES CHANGED:

TEST:
TEST RESULT:

PREVIEW:
PREVIEW RESULT:

VERIFICATION:
VERIFICATION RESULT:

EVIDENCE:

ISSUES:

DECISIONS:

NOTES:
```

The exact format may evolve as the project develops, but the task file should allow another developer or agent to understand what happened during the task.

The `STATUS` recorded in the task file must match the status of the same task in `TASK.md`.

Testing, preview, and verification are lifecycle stages of a task, not separate tasks. Their outcome is recorded inside the task file (`TEST`, `PREVIEW`, `VERIFICATION`) and in the task status, unless the activity is genuinely large or independently meaningful work.

## 9.1 Evidence

Evidence may include:

- test results;
- Expo preview result;
- screenshots;
- screen recordings;
- relevant command output;
- validation results;
- notes about manual verification;
- references to changed files.

Do not create unnecessary evidence files.

If a task can be adequately documented in its `.txt` log, no additional evidence file is required.

If screenshots or other artifacts are useful, they may be stored under an appropriate task-related location.

## 9.2 Task File Consistency

The three artifacts must remain consistent:

```text
BACKLOG.md   → backlog items / outcomes
TASK.md      → central index and status registry of all defined tasks
task/        → definition and lifecycle record of each individual task
```

Rules:

- Every task registered in `TASK.md` must have a corresponding `/task/[task-id].txt`.
- Every valid task file must be registered in `TASK.md`.
- Missing task files must be created.
- A valid task file that is missing from `TASK.md` must be reconciled into `TASK.md`.
- Task IDs must be unique and must not be reused for a different task.
- The `STATUS` in a task file and in `TASK.md` must agree.
- Task definitions are not created by working backwards from code: a task file is created when the task is defined, even if no work has started.

Historical evidence must never be fabricated.

If historical information cannot be established from repository artifacts, record:

```text
UNKNOWN
```

Do not claim implementation, testing, preview, or verification that cannot be supported by evidence.

---

# 10. Task Lifecycle

The standard task lifecycle is:

```text
TODO
  ↓
IN_PROGRESS
  ↓
IMPLEMENTED
  ↓
TESTED
  ↓
PREVIEWED
  ↓
VERIFIED
  ↓
DONE
```

The statuses describe actual work completed.

A task file exists from the moment the task is defined; the statuses above describe progress, not whether a task file exists.

Do not mark a task `DONE` merely because:

- code has been written;
- TypeScript compiles;
- the application builds;
- unit tests pass.

A task is `DONE` only when its implementation, testing, preview, and verification requirements have been satisfied.

---

# 11. Standard Task Workflow

For every implementation task, the agent should follow this sequence.

## Step 0 — DEFINE AND REGISTER

Create `/task/[task-id].txt` when the task is defined, then register the task in `TASK.md`.

No task should be implemented before it exists in both places.

## Step 1 — READ

Read:

- `AGENTS.md`
- relevant requirement documents
- `BACKLOG.md`
- `TASK.md`
- relevant task file (`/task/[task-id].txt`) if one exists
- relevant source code

Do not start coding before understanding the task context.

## Step 2 — UNDERSTAND

Identify:

- objective;
- requirements;
- business rules;
- acceptance criteria;
- affected UX flow;
- affected data model;
- dependencies;
- existing implementation.

If the task is ambiguous, investigate the existing requirements before making assumptions.

## Step 3 — PLAN

Determine:

- files that will change;
- implementation approach;
- tests required;
- preview/verification approach;
- whether documentation needs updating.

Keep the plan proportional to the task.

Do not create unnecessary architecture.

## Step 4 — IMPLEMENT

Implement only the task scope.

Do not silently add unrelated features.

Follow existing project conventions.

## Step 5 — TEST

Run appropriate tests.

Depending on the task, this may include:

- unit tests;
- integration tests;
- database tests;
- validation tests;
- component tests;
- functional tests;
- TypeScript checks;
- linting;
- other project-defined checks.

Testing requirements must be proportional to the affected behavior.

## Step 6 — RUN EXPO PREVIEW

After implementation and testing, run the application through an Expo preview whenever practical.

For UI-affecting tasks, Expo preview is mandatory.

For non-UI tasks that affect application behavior, preview the integrated application whenever practical.

The purpose is to verify the actual application behavior, not merely source-code correctness.

A successful build or passing test suite is not a substitute for application preview.

## Step 7 — VERIFY

Verify the task against:

- its stated scope;
- relevant requirements;
- relevant acceptance criteria;
- actual application behavior;
- relevant UX flow.

For UI work, verify the actual rendered result.

For operational behavior, verify the relevant user flow rather than only isolated functions.

## Step 8 — UPDATE TASK LOG

Update the task file created when the task was defined:

```text
/task/[task-id].txt
```

Record:

- implementation summary;
- tests;
- preview;
- verification;
- files changed;
- evidence;
- issues or limitations.

## Step 9 — UPDATE TASK REGISTRY

Update `TASK.md`.

Only move the task to `DONE` after the required workflow has been completed.

## Step 10 — UPDATE BACKLOG

When all tasks belonging to a backlog item are complete and its acceptance criteria are satisfied, update `BACKLOG.md`.

A backlog item must not be marked complete merely because some of its tasks are complete.

---

# 12. Preview Is a Quality Gate

Application preview is part of the definition of done.

For UI-affecting work:

```text
Implementation
    ↓
Test
    ↓
Expo Preview
    ↓
Visual / Functional Verification
    ↓
DONE
```

The agent must not consider a UI task complete based only on:

```text
Code compiles
+
Tests pass
```

If Expo preview cannot be run, the agent must:

1. record the reason;
2. record what was successfully tested;
3. record what remains unverified;
4. leave the task in an appropriate non-DONE status.

Do not falsely mark an unverified task as `DONE`.

---

# 13. Requirements Traceability

Implementation should maintain traceability:

```text
Requirement
    ↓
Backlog Item
    ↓
Task
    ↓
Code
    ↓
Test
    ↓
Preview
    ↓
Verification
```

Where practical, task logs should identify the relevant:

- PRD section;
- business rule;
- functional requirement;
- UX flow;
- data model requirement;
- acceptance criterion.

This allows future developers and AI agents to understand why a piece of code exists.

---

# 14. Handling Requirement Changes

Confirmed requirements must not be silently changed during implementation.

If implementation reveals:

- contradictory requirements;
- missing rules;
- ambiguous behavior;
- an incorrect assumption;
- an impossible acceptance criterion;

the agent must stop at the relevant decision point and report the issue.

Do not "fix" the requirements silently in code.

If a requirement change is approved, update the appropriate source-of-truth document before or together with the implementation change.

Backlog and task records must then be synchronized with the updated requirement.

---

# 15. Architecture

Use the following conceptual separation:

```text
React Native UI
      ↓
Application / Use Cases
      ↓
Domain / Business Rules
      ↓
Repository
      ↓
SQLite / Local Database
```

The UI must not contain core business rules when those rules can be placed in the domain/application layer.

The application must not depend directly on Android UI components for business logic.

Persistence details should remain behind a repository or equivalent abstraction.

---

# 16. React Native / Expo

The MVP uses:

- React Native
- Expo
- TypeScript

Follow standard React principles.

Prefer:

- small components;
- predictable state;
- explicit data flow;
- reusable UI components;
- clear separation between UI and business logic.

Do not introduce a state-management library or other major framework dependency unless there is a demonstrated need.

Do not add libraries merely because they are popular.

---

# 17. TypeScript

Use TypeScript consistently.

Prefer:

- explicit domain types;
- narrow types;
- discriminated unions where appropriate;
- predictable function contracts;
- avoiding `any`;
- validation at external/input boundaries.

Do not use TypeScript merely to silence errors.

Types should represent actual domain concepts.

---

# 18. Database

SQLite is the primary MVP database.

The application must work without internet connectivity.

Database operations that represent one business operation must be atomic where necessary.

Examples:

Production should not partially create:

```text
Production Batch
+
Production Items
+
Stock Movements
```

Delivery confirmation should not partially create:

```text
Delivery
+
Delivery Items
+
Stock Movements
```

Reconciliation should preserve consistency between:

```text
Delivered
=
Sold
+
Returned
```

Do not directly manipulate calculated stock balances as if they were independent source data.

Stock should be derived from stock movements or controlled transactional operations.

---

# 19. Inventory Rules

Inventory is movement-based.

Relevant movement types include:

```text
PRODUCTION
DELIVERY
RETURN
SOLD
WASTE
ADJUSTMENT
```

Do not create arbitrary stock balance edits as the normal mechanism.

Stock corrections must remain traceable.

Avoid negative stock unless explicitly permitted by the relevant business rule.

---

# 20. Consignment and Sales Logic

Remember:

> Delivered product is not automatically sold.

For `HABIS`:

```text
Sold = Actual Delivered
Return = 0
```

For `TIDAK_HABIS`:

```text
Sold = Delivered - Returned
```

Reconciliation is required before settlement for `TIDAK_HABIS`.

The agent must not invent additional sales states or reconciliation logic without requirements approval.

---

# 21. Financial Logic

Financial calculations must use historical transaction snapshots where required.

Examples include:

- selling price;
- agent fee;
- gross amount;
- fee amount;
- net amount.

Current master-data changes must not rewrite historical transactions.

Settlement and payment are separate concepts.

An invoice may exist before payment.

Payment must not be treated as proof that the underlying settlement was recalculated.

---

# 22. Historical Data Integrity

Historical transactions must remain stable.

Examples:

Changing:

- product selling price;
- agent fee;
- business profile;

must not silently change previously created:

- delivery values;
- settlement values;
- invoices;
- payment history.

Use snapshots where defined by the data model.

---

# 23. Deletion and Correction

Do not destructively delete used transactional records.

For master data that has already been used in transactions:

- prefer deactivation;
- preserve historical references.

Corrections to historical transactions must remain auditable.

Do not overwrite historical facts merely to make current totals look correct.

If correction behavior is not yet defined by the requirements, record it as an open decision rather than inventing a rule.

---

# 24. Offline-First

Offline is the normal operating condition for the MVP.

Core operations must not require:

- API access;
- cloud database;
- continuous internet;
- Google account;
- Google Drive.

Internet is only required for external features such as Google Drive backup.

Do not introduce network dependency into core operational flows.

---

# 25. Backup

Google Drive backup is optional MVP functionality.

Remember:

> Backup is not synchronization.

The expected direction is:

```text
Local SQLite
    ↓
Backup File
    ↓
Google Drive
```

A failed backup must not modify or corrupt the local operational database.

Do not implement cloud synchronization, conflict resolution, sync queues, or server-authoritative behavior as part of the MVP unless explicitly approved.

---

# 26. Future Cloud Compatibility

The architecture should allow future evolution toward:

```text
Android
    ↓
Repository / Sync Layer
    ↓
Laravel API
    ↓
PostgreSQL
```

and:

```text
Web / Admin
    ↓
Filament
    ↓
Laravel
```

For future compatibility, preserve:

- stable IDs;
- relevant timestamps;
- historical transactions;
- separation of master and transaction data;
- repository boundaries;
- business logic independent from SQLite.

Do not implement:

- sync queues;
- conflict resolution;
- server authority;
- distributed transactions;
- multi-device synchronization;

unless they are explicitly added to scope.

---

# 27. Validation and Error Handling

Validate data at appropriate boundaries.

User-facing validation errors should be understandable and actionable.

Do not expose raw technical errors to normal users when a useful business-level message can be provided.

For critical financial or inventory operations, errors must not leave partial transaction state.

---

# 28. Testing

Testing must cover behavior, not only implementation details.

Prioritize tests for:

- business rules;
- financial calculations;
- inventory movement;
- stock calculations;
- delivery confirmation;
- sales confirmation;
- reconciliation;
- settlement;
- historical snapshots;
- payment/outstanding;
- data integrity.

UI tests should cover important user flows where practical.

Every task must perform testing appropriate to its scope.

---

# 29. Code Quality

Prefer:

- simple code;
- readable naming;
- small functions;
- clear responsibilities;
- explicit data transformations;
- minimal duplication where practical;
- existing project conventions.

Avoid:

- premature abstractions;
- unnecessary generic frameworks;
- speculative features;
- excessive indirection;
- duplicated business logic;
- hidden side effects.

Do not refactor unrelated code merely because it could be improved.

---

# 30. Dependency Policy

Before adding a dependency:

1. confirm that the requirement genuinely needs it;
2. check whether existing project capabilities are sufficient;
3. consider maintenance and compatibility;
4. avoid adding multiple libraries for overlapping purposes.

A dependency should solve a real project problem.

Do not introduce a library simply because it is commonly used in React Native projects.

---

# 31. Security

Even though the MVP is an internal single-device application:

- do not hard-code secrets;
- do not commit credentials;
- do not expose sensitive information unnecessarily;
- validate external input;
- protect backup-related credentials/tokens appropriately;
- do not treat client-side checks as future server authorization.

Future authentication and authorization must be designed separately from the MVP's local operational workflow.

---

# 32. Performance

Do not optimize prematurely.

Prioritize:

- correct business behavior;
- database integrity;
- simple user flows;
- predictable rendering;
- reasonable list performance.

Optimize based on an identified problem rather than speculation.

---

# 33. Logging and Diagnostics

Logs should help diagnose operational or technical problems.

Avoid logging:

- credentials;
- access tokens;
- unnecessary personal information;
- sensitive business information when not required.

Production-oriented logging should remain useful without becoming noisy.

---

# 34. Existing Code

Before creating new code, inspect the existing implementation.

Prefer extending or correcting existing structures when appropriate.

Do not create duplicate:

- models;
- repositories;
- business logic;
- components;
- utilities;

without first checking whether an existing implementation already serves the purpose.

When existing code conflicts with approved requirements, follow the approved requirements and document the necessary change.

---

# 35. Documentation Synchronization

If implementation changes any behavior defined by the requirement documents, the relevant documentation must be updated.

At minimum, consider whether the change affects:

- PRD;
- business rules;
- functional requirements;
- UX flows;
- data model;
- acceptance criteria;
- backlog;
- task registry;
- task log.

Do not allow implementation and requirements to silently diverge.

---

# 36. Scope Discipline

Do not expand a task because an unrelated improvement is noticed.

If additional work is discovered:

1. record it;
2. create or propose a separate backlog item/task;
3. keep the current task focused.

Exceptions are limited to changes that are necessary to correctly complete the current task.

---

# 37. Working with AI Coding Tools

The agent should behave as an implementation assistant, not as the product owner.

The agent may:

- inspect the codebase;
- identify implementation issues;
- propose technical solutions;
- implement approved scope;
- create tests;
- run previews;
- record evidence;
- identify requirement conflicts;
- propose follow-up tasks.

The agent must not independently decide:

- new business rules;
- changes to financial calculations;
- changes to transaction lifecycle;
- major scope expansion;
- replacement of approved architecture;
- removal of confirmed requirements.

When a decision has meaningful product or business impact, surface it for human review.

---

# 38. Completion Definition

A task is complete only when all applicable conditions are satisfied:

- implementation is complete;
- relevant tests pass;
- Expo preview has been run when required;
- actual behavior has been verified;
- relevant acceptance criteria are satisfied;
- task log is updated;
- `TASK.md` status is updated;
- `BACKLOG.md` is updated when appropriate.

A backlog item is complete only when:

- all required tasks are complete;
- relevant acceptance criteria are satisfied;
- the integrated behavior has been verified;
- no known blocking issue remains.

---

# 39. Minimum Agent Report

When reporting a completed task, provide a concise summary containing:

```text
Task:
Status:

Implemented:
- ...

Tests:
- ...

Preview:
- ...

Verification:
- ...

Files changed:
- ...

Evidence / Task Log:
- /task/[task-id].txt

Follow-up:
- ...
```

If the task cannot be fully verified, explicitly state:

```text
Status: NOT VERIFIED
Reason: ...
Remaining verification: ...
```

Never report an unverified task as complete.

---

# 40. Final Principles

The agent must consistently follow these principles:

1. Requirements are the source of truth.
2. Backlog is the bridge between requirements and implementation.
3. `TASK.md` is the central task registry.
4. `/task/[task-id].txt` records task execution history and evidence.
5. Tasks must be small and focused.
6. Code must not silently change approved business rules.
7. Tests are required.
8. Application preview is a quality gate.
9. Passing tests or compiling code alone does not mean DONE.
10. Inventory and financial data must remain traceable.
11. Historical transactions must remain stable.
12. Offline operation is fundamental to the MVP.
13. Backup is not synchronization.
14. Future-readiness must not become premature complexity.
15. Keep documentation and implementation synchronized.
16. Build simple for today, but do not design yourself into a dead end for tomorrow.
