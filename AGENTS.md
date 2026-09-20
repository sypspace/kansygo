# AGENTS.md

## 1. Purpose

This repository contains an Android-first internal application for managing a frozen-food consignment and distribution business.

This file defines the universal working rules for AI coding agents working on this repository, including but not limited to:

- GitHub Copilot
- Cline
- Claude Code
- Cursor
- Other AI coding agents

This file is tool-independent.

The agent MUST treat the approved project documentation as the primary source of truth for product behavior and business rules.

The agent MUST NOT silently change confirmed requirements, business rules, data relationships, or approved user flows.

---

## 2. Source of Truth

Before implementing or modifying a feature, the agent MUST read the relevant project documentation.

The current source-of-truth documents are:

1. `00-Baseline.md`
2. `01-PRD.md`
3. `02-Business-Rules.md`
4. `03-Functional-Requirements.md`
5. `04-UX-Flows.md`
6. `05-Data-Model.md`
7. `06-Acceptance-Criteria.md`
8. `08-Technical-Architecture.md`
9. `09-Decision-Log.md`

All documents are located in the `docs/` directory.

`09-Decision-Log.md` mencatat keputusan final atas item yang sebelumnya `OPEN`,
`PROPOSED`, atau saling bertentangan antar dokumen. Bila terjadi konflik antar
dokumen, keputusan pada `09-Decision-Log.md` yang berlaku sampai dokumen terkait
diperbarui.

The documents describe different levels of the system:

```text
01-PRD
    ↓
02-Business-Rules
    ↓
03-Functional-Requirements
    ↓
04-UX-Flows
    ↓
05-Data-Model
    ↓
06-Acceptance-Criteria
```

Use the document most relevant to the task, but read additional documents when the task crosses multiple areas.

If documents appear to conflict:

1. Identify the conflict.
2. Do not silently choose an interpretation.
3. Report the conflict.
4. Ask for clarification before implementing the affected behavior.

The agent may propose a solution, but changes to confirmed requirements require user approval.

---

# 3. Product Context

The application is an internal operational tool for a frozen-food consignment and distribution business.

The core lifecycle is:

```text
Production
    ↓
Owner Stock
    ↓
Delivery Planning
    ↓
Delivery Confirmation
    ↓
Agent Stock
    ↓
Sales Confirmation
    ↓
HABIS / TIDAK_HABIS
    ↓
Reconciliation (if TIDAK_HABIS)
    ↓
Settlement
    ↓
Invoice
    ↓
Payment
```

The application is designed around the operational question:

> "Hari ini saya harus mengunjungi siapa dan melakukan apa?"

The MVP prioritizes:

- correctness,
- operational simplicity,
- traceability,
- financial safety,
- offline operation,
- low implementation complexity.

---

# 4. MVP Constraints

The MVP is:

- Android-first.
- Built with React Native and Expo.
- Written in TypeScript.
- Single business.
- Single device.
- Single operational user/admin.
- Local-first.
- Offline-first.
- No required cloud backend.
- No required internet connection for core operations.
- Agent does not use the application.
- No agent self-service application.
- No multi-user role/permission system.
- No multi-device synchronization.
- No Laravel/PostgreSQL backend in the MVP.
- No web/admin application in the MVP.

Google Drive may be used for optional database backup.

Backup is NOT synchronization.

The agent MUST NOT introduce cloud infrastructure, authentication infrastructure, synchronization mechanisms, or multi-user architecture merely because they may be needed in the future.

---

# 5. Technology Stack

The current MVP stack is:

```text
React Native
Expo
TypeScript
SQLite / Local Database
```

The exact supporting libraries may be selected during implementation.

Do not add supporting libraries merely because they are commonly used in React Native projects.

When choosing a library, consider:

- maintenance status,
- Expo compatibility,
- Android compatibility,
- offline behavior,
- bundle/application complexity,
- API stability,
- whether the platform or Expo already provides the required capability.

Prefer the simplest stable solution.

---

# 6. Architectural Direction

The conceptual architecture is:

```text
┌─────────────────────────────┐
│       React Native UI       │
│           Expo              │
├─────────────────────────────┤
│     Application / Use Cases │
├─────────────────────────────┤
│      Domain / Business      │
│           Rules             │
├─────────────────────────────┤
│        Repository           │
├─────────────────────────────┤
│       Local Data Source     │
├─────────────────────────────┤
│           SQLite            │
└─────────────────────────────┘
```

Future architecture may evolve toward:

```text
Android
    ↓
Repository / Sync Layer
    ↓
Laravel API
    ↓
PostgreSQL

Web/Admin
    ↓
Filament
    ↓
Laravel
```

The MVP should prepare for this direction without implementing it prematurely.

---

# 7. Separation of Concerns

Keep the following concerns reasonably separated:

```text
UI
 ↓
Application / Use Cases
 ↓
Domain / Business Rules
 ↓
Repository
 ↓
Local Database
```

### UI

Responsible for:

- displaying information,
- collecting user input,
- navigation,
- UI state,
- presenting validation/errors.

UI should NOT contain core business calculations.

### Application / Use Cases

Responsible for:

- coordinating business operations,
- invoking repositories,
- validating workflows,
- managing transaction boundaries where appropriate.

### Domain / Business Rules

Responsible for:

- business calculations,
- invariants,
- financial calculations,
- inventory rules,
- sales/reconciliation rules.

Business logic should be testable without rendering React Native components.

### Repository

Responsible for:

- persistence access,
- querying,
- storing domain/application data,
- hiding database implementation details.

### Database

Responsible for:

- persistent local storage,
- relationships,
- constraints,
- transactions,
- indexes appropriate to actual queries.

---

# 8. React and React Native Principles

Use normal React principles.

Prefer:

- functional components,
- hooks,
- composition,
- explicit data flow,
- predictable state management.

Avoid:

- unnecessary class components,
- excessive prop drilling when a simpler solution exists,
- global state for data that belongs locally to one screen,
- components containing large amounts of business logic.

Keep components focused.

A screen should coordinate UI behavior rather than become the location of all application logic.

---

# 9. Component Design

Prefer small, reusable components when reuse is meaningful.

Do not create a component abstraction merely because two pieces of JSX look slightly similar.

A component should have a clear responsibility.

Examples of reasonable boundaries:

```text
Screen
 ├── Header
 ├── Summary
 ├── List
 │    └── List Item
 └── Primary Action
```

Avoid deeply nested abstraction layers unless they solve a real problem.

---

# 10. TypeScript Rules

TypeScript is required.

Prefer explicit domain types for important business concepts.

For example:

```ts
type SalesResult = "HABIS" | "TIDAK_HABIS";
```

and:

```ts
type StockMovementType =
  | "PRODUCTION"
  | "DELIVERY"
  | "RETURN"
  | "SOLD"
  | "WASTE"
  | "ADJUSTMENT";
```

Use types to protect business invariants where practical.

Avoid:

```ts
any;
```

unless there is a documented reason.

Prefer:

- interfaces/types for domain structures,
- discriminated unions for finite states,
- explicit function input/output types where useful,
- nullable types where null is a meaningful state.

Do not use TypeScript complexity for its own sake.

---

# 11. Domain Types and Statuses

Important business states must be represented explicitly.

Do not invent alternative names for approved domain states.

For example, use:

```text
HABIS
TIDAK_HABIS
```

rather than introducing unrelated equivalents such as:

```text
SOLD_OUT
NOT_SOLD_OUT
UNSOLD
RETURNED
```

unless the documentation explicitly defines them as separate concepts.

Centralize important domain constants/types rather than duplicating string literals throughout the application.

---

# 12. State Management

Use the simplest state management approach appropriate to the feature.

Not all state needs global management.

Distinguish between:

### UI State

Examples:

- modal open/closed,
- selected tab,
- temporary form input,
- loading state.

### Application State

Examples:

- current operational flow,
- pending confirmation,
- selected delivery.

### Persistent Business Data

Examples:

- agents,
- products,
- deliveries,
- settlements,
- payments,
- stock movements.

Persistent business data belongs in the repository/database layer, not merely in React state.

Do not introduce a global state library unless the actual application needs it.

---

# 13. Navigation

Navigation should follow `04-UX-Flows.md`.

Do not introduce navigation paths that bypass required business steps.

For example:

```text
TIDAK_HABIS
    ↓
Reconciliation
    ↓
Settlement
```

must not be bypassed merely because it is convenient to navigate directly to settlement.

Navigation should represent the approved operational flow.

---

# 14. Forms and Validation

Forms should provide clear and immediate feedback where appropriate.

Validate:

- required fields,
- quantity,
- monetary values,
- active master data,
- business relationships,
- domain invariants.

However, UI validation is not sufficient.

Critical business validation must also exist outside the UI.

Example:

```text
UI validation
     +
Application/domain validation
     +
Database constraints where appropriate
```

This prevents future interfaces or code paths from bypassing critical rules.

---

# 15. Local Database

The local database is the primary operational data store for the MVP.

Core application behavior MUST NOT depend on a network connection.

Use SQLite or the selected Expo-compatible local database implementation.

Database access must be isolated behind the repository/data-access boundary.

Do not scatter raw SQL/database calls throughout React components.

---

# 16. Database Schema

The database should follow `05-Data-Model.md`.

The primary conceptual entities include:

```text
Business
User
Product Variant
Agent

Production Batch
Production Item

Delivery Plan
Delivery Plan Item
Delivery
Delivery Item

Sales Confirmation
Reconciliation
Reconciliation Item

Settlement
Settlement Item
Invoice
Invoice Item
Payment

Stock Movement
Operational Task
```

Do not add entities simply because a framework or library convention suggests them.

Do not remove entities required by the approved data model without approval.

---

# 17. Database Migrations

Database schema changes require deliberate migration handling.

Before changing the schema:

1. Read `05-Data-Model.md`.
2. Identify affected entities.
3. Identify affected historical data.
4. Determine migration requirements.
5. Check acceptance criteria.
6. Preserve existing valid data.

Never use destructive database recreation as a normal upgrade strategy.

Do not silently drop tables or historical data.

---

# 18. Database Transactions

Business operations should be atomic.

For example:

### Production

```text
Production Batch
+
Production Items
+
Stock Movement
```

must succeed or fail as one logical operation.

### Delivery

```text
Delivery
+
Delivery Items
+
Stock Movement
```

must remain consistent.

### Reconciliation

```text
Reconciliation
+
Reconciliation Items
+
Sold / Return Movements
```

must remain consistent.

Use the transaction capabilities of the selected database implementation.

---

# 19. Inventory

Inventory is movement-based.

Do not use a manually editable stock balance as the primary source of truth.

Movement types:

```text
PRODUCTION
DELIVERY
RETURN
SOLD
WASTE
ADJUSTMENT
```

Conceptually:

```text
Owner Stock
= Production
+ Return
- Delivery
- Owner Waste
+/- Owner Adjustment
```

Agent stock:

```text
Agent Stock
= Delivery
- Sold
- Return
+/- Agent Adjustment
```

Negative stock should normally be rejected.

Stock adjustments require a reason and must remain traceable.

---

# 20. Production

Production records actual production output.

Example:

```text
Batch 001
- Coklat       41
- Strawberry   42
-----------------
Total          83
```

The system calculates totals.

Creating production should create the appropriate stock movement.

Do not allow ordinary UI operations to arbitrarily modify resulting stock.

---

# 21. Delivery

Delivery planning and actual delivery are separate.

```text
Delivery Plan
    ≠
Delivery
```

Planning does not change inventory.

Actual delivery changes inventory.

Always preserve:

- planned quantity,
- actual delivered quantity.

Sales and settlement must be based on actual delivered quantity.

---

# 22. Sales Confirmation

The MVP supports:

```text
HABIS
TIDAK_HABIS
```

### HABIS

```text
Sold = Actual Delivered
Return = 0
```

Do not require manual sold quantity.

Do not require physical reconciliation.

### TIDAK_HABIS

Reconciliation is required.

```text
Sold = Delivered - Returned
```

Enforce:

```text
Returned <= Delivered
Sold >= 0
Sold + Returned = Delivered
```

Settlement must not be finalized before required reconciliation is complete.

---

# 23. Settlement and Financial Logic

Settlement and payment are separate.

```text
Settlement
    ≠
Payment
```

Core calculations:

```text
Gross = Sold × Selling Price Snapshot

Fee = Sold × Fee Per Unit Snapshot

Net = Gross - Fee
```

The MVP uses fixed nominal fee per unit per agent.

Do not introduce:

- percentage commission,
- agent leveling,
- automatic fee tiers,

without explicit approval.

Financial calculations must have one authoritative implementation.

Do not duplicate formulas across multiple screens.

---

# 24. Monetary Representation

Use a safe representation for Indonesian Rupiah.

Prefer integer-based monetary values where appropriate, such as:

```text
150000
```

representing:

```text
Rp150.000
```

Avoid floating-point values for monetary calculations.

Do not use formatted strings such as `"Rp 150.000"` as the underlying financial value.

Formatting belongs at the presentation layer.

---

# 25. Historical Data

Historical transactions must remain historically correct.

Changing current master data must not alter past transactions.

Examples:

```text
Current Product Price
        ↓
must NOT modify
        ↓
Historical Settlement Price
```

```text
Current Agent Fee
        ↓
must NOT modify
        ↓
Historical Settlement Fee
```

Use snapshots defined by the data model.

When displaying historical financial data, use transaction snapshots rather than current master data.

---

# 26. IDs and Relationships

Use stable IDs.

Never use display names as primary identifiers.

Examples:

```text
product_variant_id
agent_id
delivery_id
settlement_id
invoice_id
payment_id
```

Relationships must be explicit.

Avoid fragile relationships based on:

- display names,
- array indexes,
- list order,
- dates alone.

---

# 27. Deletion and Historical Integrity

Do not destructively delete historical transactions.

Used master data should normally be deactivated.

Examples:

```text
Product Variant → inactive
Agent           → inactive
```

Do not silently overwrite historical financial or inventory records.

If correction behavior is not defined in the requirements, request clarification.

---

# 28. Offline-First

Treat offline operation as the normal operating condition.

Do not design the application as an online application with an offline fallback.

Core features must work without internet:

- production,
- inventory,
- delivery planning,
- delivery confirmation,
- sales confirmation,
- reconciliation,
- settlement,
- invoice,
- payment,
- reports.

Network-dependent functionality must be isolated.

---

# 29. Google Drive Backup

Google Drive backup is optional.

Conceptually:

```text
Local Database
      ↓
Backup File
      ↓
Google Drive
```

Backup is not synchronization.

A backup failure must not:

- corrupt local data,
- delete local data,
- roll back valid transactions,
- block core operations.

Do not implement cloud synchronization as part of the MVP.

---

# 30. Future Cloud Compatibility

Prepare the application for a possible future API without implementing the API now.

Good preparation includes:

- stable IDs,
- clear repository boundaries,
- historical timestamps,
- explicit relationships,
- separation of master and transaction data,
- business logic independent of SQLite,
- immutable historical snapshots where required.

Do NOT implement prematurely:

- sync queues,
- conflict resolution,
- server-authority rules,
- retry engines,
- distributed transactions,
- multi-device coordination,
- cloud synchronization tables.

---

# 31. Error Handling

Expected business errors must be handled explicitly.

Examples:

```text
Delivery > Available Stock
Return > Delivered
Negative Quantity
Invalid Settlement
Invalid Payment
TIDAK_HABIS without Reconciliation
Invalid Master Data
Backup Failure
```

User-facing errors should be understandable and actionable.

Do not expose raw:

- stack traces,
- SQL errors,
- framework exceptions,
- internal implementation details.

Technical details may be logged appropriately for development/debugging.

---

# 32. Testing Strategy

Every meaningful business feature should have appropriate tests.

Prioritize:

### Unit Tests

For:

- business calculations,
- validation,
- domain rules,
- financial formulas,
- inventory calculations.

### Integration Tests

For:

- repository behavior,
- database transactions,
- stock movement creation,
- settlement/payment relationships.

### UI Tests

For:

- important operational flows,
- navigation,
- user input,
- critical states.

### End-to-End Tests

For important complete workflows.

---

# 33. Critical Business Tests

At minimum, protect these invariants:

```text
Sold + Returned = Delivered

Gross = Sold × Selling Price

Fee = Sold × Fee Per Unit

Net = Gross - Fee
```

Also test:

```text
Delivery > Stock → rejected

Return > Delivered → rejected

TIDAK_HABIS without Reconciliation → rejected

Historical Price remains unchanged

Historical Fee remains unchanged
```

Core operations should also be tested without network access.

---

# 34. Test Data

Tests must be deterministic.

Do not depend on:

- live network services,
- production data,
- uncontrolled current date/time,
- random values without controlled seeds,
- external Google Drive state.

Use meaningful fixtures.

Financial test values should use realistic Rupiah amounts.

---

# 35. Dependency Policy

Before adding a dependency, ask:

1. Is it actually necessary?
2. Does Expo already provide the capability?
3. Can the functionality be implemented simply?
4. Does the dependency work reliably with the current Expo setup?
5. Does it increase maintenance complexity?
6. Does it introduce network dependency?
7. Is it needed for the MVP?

Prefer fewer, stable dependencies.

Do not add libraries simply because they are popular in tutorials or boilerplate projects.

---

# 36. Expo Rules

Use Expo capabilities whenever they satisfy the requirement.

Do not eject from Expo or introduce custom native code unless there is a concrete requirement that cannot reasonably be satisfied otherwise.

Before introducing native-specific functionality:

1. Verify whether Expo already supports it.
2. Check compatibility with the current Expo SDK.
3. Consider whether it affects build/deployment complexity.
4. Consider whether it is actually required for the MVP.

Keep the application compatible with the chosen Expo workflow.

---

# 37. Platform-Specific Code

Keep Android-specific code isolated when possible.

Do not spread platform checks throughout business logic.

Prefer:

```text
UI / Platform Adapter
        ↓
Application / Domain Logic
```

rather than:

```text
Domain Logic
    ↓
Android-specific APIs
```

Business rules must remain platform-independent.

---

# 38. Async Operations

Handle asynchronous operations explicitly.

UI should correctly represent:

```text
idle
loading
success
error
```

where appropriate.

Do not create race conditions by allowing multiple concurrent executions of the same critical business operation.

Examples:

- duplicate payment,
- duplicate delivery confirmation,
- duplicate reconciliation,
- duplicate settlement.

Business-level duplicate protection must not depend solely on disabling a UI button.

---

# 39. React State vs Database State

Do not treat React state as permanent business storage.

The general rule is:

```text
Temporary UI state
    → React state

Persistent business data
    → Repository / Database
```

If the application is restarted, important completed transactions must remain available.

---

# 40. UI and UX

Follow `04-UX-Flows.md`.

Prioritize:

- few steps,
- clear primary actions,
- readable quantities,
- readable monetary values,
- clear statuses,
- obvious next action,
- fast operational data entry.

Avoid unnecessary dialogs, confirmation steps, and navigation.

Do not redesign approved business flows merely because another UX pattern appears more fashionable.

---

# 41. Dashboard

The dashboard should be operational rather than merely decorative.

It should help answer:

> "Hari ini saya harus mengunjungi siapa dan melakukan apa?"

Dashboard information must be derived from source data.

Do not maintain manually editable dashboard counters.

---

# 42. Accessibility and Usability

The application should remain comfortable for routine operational use.

Where appropriate:

- use readable text,
- use adequate touch targets,
- provide meaningful labels,
- avoid relying only on color for important states,
- provide understandable validation feedback.

Operational clarity is more important than visual complexity.

---

# 43. Logging

Logging should help diagnose problems without unnecessarily exposing sensitive information.

Do not log:

- credentials,
- access tokens,
- secrets,
- unnecessary personal information,
- unnecessary complete financial records.

Avoid excessive logging in production builds.

---

# 44. Security

Never commit:

- API keys,
- passwords,
- access tokens,
- private credentials,
- signing secrets.

Do not hardcode secrets in source code.

Use appropriate secure mechanisms when external credentials are actually required.

Do not introduce a complex authentication system without explicit approval.

---

# 45. Performance

Optimize for the actual MVP environment.

The application targets:

- one business,
- one device,
- a relatively small dataset,
- routine operational use.

Prioritize:

- responsive screens,
- reliable local persistence,
- efficient queries,
- fast data entry.

Do not prematurely optimize for enterprise-scale workloads.

Avoid obviously inefficient implementations such as repeated database queries inside large lists when a reasonable batched query is available.

---

# 46. Code Quality

Code should be:

- readable,
- predictable,
- testable,
- reasonably modular,
- consistent.

Prefer clear code over clever code.

Avoid:

- giant components,
- giant functions,
- duplicated business logic,
- magic numbers,
- hidden side effects,
- unnecessary global state,
- unnecessary abstraction layers.

---

# 47. Comments

Comments should explain **why**, not merely restate what the code does.

Good:

```ts
// Keep the historical fee because the agent fee may change later.
```

Avoid:

```ts
// Multiply sold quantity by fee.
const fee = sold * feePerUnit;
```

Document non-obvious business decisions when necessary.

---

# 48. Change Management

Before a substantial change:

1. Identify the requirement.
2. Identify affected business rules.
3. Inspect existing code.
4. Identify affected data.
5. Identify affected UX.
6. Identify tests.
7. Determine whether documentation changes are required.

For non-trivial work:

```text
PLAN
  ↓
REVIEW / APPROVAL
  ↓
IMPLEMENT
  ↓
TEST
  ↓
VERIFY
```

Do not silently change approved requirements.

---

# 49. Do Not Guess Business Rules

Do not invent behavior for unresolved requirements.

Examples include:

- partial payment,
- overpayment,
- payment cancellation,
- payment method details,
- delivery cancellation,
- transaction correction,
- restore behavior,
- authentication details,
- draft behavior,
- exact status transitions.

If the behavior affects inventory, money, historical data, or transaction integrity, ask for clarification.

---

# 50. Scope Discipline

Only modify files necessary for the requested task.

Do not use a feature task as an excuse to:

- refactor unrelated modules,
- redesign unrelated screens,
- upgrade dependencies unnecessarily,
- rename unrelated classes,
- restructure the entire project.

If broader refactoring is necessary, explain why.

---

# 51. Git Discipline

Prefer focused changes.

```text
One logical task
       ↓
One logical change
       ↓
Focused commit
```

Avoid mixing unrelated changes.

Do not modify unrelated files simply because they could be "cleaned up."

---

# 52. Existing Code

Before modifying existing code:

1. Read it.
2. Understand its dependencies.
3. Check its tests.
4. Check relevant requirements.
5. Identify side effects.
6. Make the smallest safe change.

Do not rewrite working code solely because another coding style is preferred.

When refactoring, preserve behavior unless the task explicitly changes it.

---

# 53. Documentation Synchronization

Code must not become the accidental source of truth.

If implementation reveals an incomplete or contradictory requirement:

1. Stop before making a consequential assumption.
2. Explain the issue.
3. Propose the smallest reasonable change.
4. Obtain approval.
5. Update the relevant documentation.
6. Then implement the approved behavior.

The intended relationship is:

```text
Requirements
     ↓
Design
     ↓
Implementation
     ↓
Tests
```

Not:

```text
Implementation
     ↓
Whatever the requirements must have meant
```

---

# 54. Feature Development Workflow

For a new feature:

### Step 1 — Read

Read the relevant requirements and existing implementation.

### Step 2 — Understand

Identify the intended business flow.

### Step 3 — Plan

Identify:

- screens,
- components,
- use cases,
- domain rules,
- repository operations,
- database changes,
- tests.

### Step 4 — Review

For non-trivial work, present the plan before implementation.

### Step 5 — Implement

Implement the smallest complete feature slice.

### Step 6 — Test

Add or update relevant tests.

### Step 7 — Verify

Verify:

- business rules,
- data integrity,
- offline behavior,
- UX flow,
- regression risk.

### Step 8 — Report

Report:

- what changed,
- files affected,
- tests executed,
- build result,
- unresolved issues,
- documentation changes.

---

# 55. Definition of Done

A feature is not complete merely because:

- the application compiles,
- the screen appears,
- the database accepts the input,
- the happy path works.

A feature is complete when:

1. The approved requirement is implemented.
2. Business rules are respected.
3. Data remains consistent.
4. Historical data remains correct.
5. Expected errors are handled.
6. Relevant tests exist.
7. Relevant tests pass.
8. Offline behavior remains intact where required.
9. Existing behavior is not unintentionally broken.
10. Documentation is updated when an approved requirement changes.

---

# 56. Priority When Making Trade-offs

When implementation choices conflict, prioritize:

```text
1. Data integrity
2. Business-rule correctness
3. Financial correctness
4. Approved UX flow
5. Operational simplicity
6. Maintainability
7. Future compatibility
8. Performance optimization
9. Architectural elegance
```

Do not sacrifice business correctness merely to make the code cleaner or more sophisticated.

---

# 57. Final Agent Principle

Build the smallest reliable system that correctly supports the approved business process.

The project follows this principle:

> **Build simple for today, but don't design yourself into a dead end for tomorrow.**

The agent should optimize for:

```text
Correctness
+
Reliability
+
Traceability
+
Offline operation
+
Testability
+
Maintainability
```

not for:

```text
Maximum abstraction
+
Maximum number of libraries
+
Maximum architectural complexity
```

The goal is not to build the most sophisticated application possible.

The goal is to build the **simplest reliable application that correctly serves the business today while preserving a reasonable path for future evolution**.
