This is a conversation with chat-gpt before starting the entire project. It was used to prepeare stages and [github project](https://github.com/users/DanielHajduk98/projects/5/views/1) issues

# User

You are a product engineer. In the PDF document attached you will find a task you are hired to implement. Prepare a step by step plan of implementifile:///home/donirk/Downloads/Web_Task__Random_Profiles_Catalog_App__1_.pdfng this project that can be represented in github issues to manage the process.

# GPT

Got it. Below is a **practical, honest, step-by-step implementation plan**, structured exactly how I would break it down into **GitHub issues**. Each bullet can be one issue, with clear acceptance criteria and a logical order that matches atomic commits and reviewability.

I assume Nuxt 4, TypeScript, Tailwind, Faker, optional Zod, and no external backend.

---

## Phase 0 - Project setup and guardrails

### Issue 1 - Initialize Nuxt 4 project

**Goal**
Scaffold the base Nuxt 4 app.

**Tasks**

* Create Nuxt 4 project with TypeScript
* Verify dev server runs
* Clean default boilerplate pages

**Acceptance**

* `npm run dev` works
* Empty home page renders

---

### Issue 2 - Install and configure Tailwind CSS

**Goal**
Set up styling foundation.

**Tasks**

* Install Tailwind via Nuxt module
* Configure tailwind.config
* Add base styles

**Acceptance**

* Tailwind classes apply correctly
* Responsive utility classes work

---

### Issue 3 - Project structure and conventions

**Goal**
Prepare clean architecture early.

**Tasks**

* Create folders:

  * `/server/api`
  * `/lib/api-client`
  * `/lib/types`
  * `/composables`
* Decide naming conventions
* Add ESLint / Prettier if desired

**Acceptance**

* Structure matches Nuxt 4 best practices
* No unused boilerplate

---

## Phase 1 - Shared data model and utilities

### Issue 4 - Define Profile data model (Zod optional but recommended)

**Goal**
Single source of truth for profile shape.

**Tasks**

* Define Profile schema with at least 10 attributes:

  * id
  * name
  * email
  * avatarUrl
  * age
  * jobTitle
  * company
  * phone
  * address
  * bio
* Export inferred TypeScript type
* Reuse in server and client

**Acceptance**

* Types compile on both server and client
* Easy to extend attributes

---

### Issue 5 - Faker-based profile generator utility

**Goal**
Centralized random profile generation.

**Tasks**

* Install Faker
* Create generator function:

  * Accept optional seed or count
  * Use TestingBot avatar generator URL
* Ensure deterministic ID format

**Acceptance**

* Generates valid Profile objects
* No direct Faker usage inside API routes

---

## Phase 2 - Server API (Nuxt server layer)

### Issue 6 - GET /api/profiles endpoint

**Goal**
Return a list of random profiles.

**Tasks**

* Create `/server/api/profiles.get.ts`
* Generate N profiles (configurable)
* Validate output against schema

**Acceptance**

* Endpoint returns JSON array
* Errors handled gracefully

---

### Issue 7 - GET /api/profile/:id endpoint

**Goal**
Return a single profile by id.

**Tasks**

* Create `/server/api/profile/[id].get.ts`
* Generate profile deterministically from id
* Return 404 on invalid id

**Acceptance**

* Correct profile returned per id
* Proper HTTP status codes

---

### Issue 8 - API error handling and typing

**Goal**
Make API predictable and safe.

**Tasks**

* Standardize error responses
* Ensure Zod validation errors are readable
* Add minimal logging

**Acceptance**

* Client can reliably handle errors
* No uncaught exceptions

---

## Phase 3 - Typed API client (client-only access)

### Issue 9 - Create typed API client module

**Goal**
Single place that talks to API.

**Tasks**

* Implement functions:

  * `fetchProfiles()`
  * `fetchProfileById(id)`
* Strong typing
* Handle fetch errors

**Acceptance**

* No direct `$fetch` usage outside this module
* All pages use this client

---

## Phase 4 - Pages implementation

### Issue 10 - Home page (profiles gallery)

**Goal**
Display random profiles grid.

**Tasks**

* Fetch profiles from API
* Display cards (avatar + name + email)
* Responsive grid layout

**Acceptance**

* Uses API client
* Looks good on mobile and desktop

---

### Issue 11 - Search results page (exactly 10 profiles)

**Goal**
Dedicated page showing exactly 10 profiles.

**Tasks**

* Create route `/search`
* Fetch exactly 10 profiles
* Optional query params (not required)

**Acceptance**

* Always renders exactly 10 profiles
* No duplication of logic from Home

---

### Issue 12 - Profile details page

**Goal**
Show full profile information.

**Tasks**

* Dynamic route `/profile/[id]`
* Fetch profile by id
* Render all attributes clearly

**Acceptance**

* Deep linking works
* Handles invalid id with error state

---

## Phase 5 - UX, state, and polish

### Issue 13 - Loading states

**Goal**
Clear feedback during async operations.

**Tasks**

* Skeleton loaders or spinners
* Page-level and component-level loading

**Acceptance**

* No blank screens
* Consistent loading UX

---

### Issue 14 - Error states

**Goal**
Graceful failure handling.

**Tasks**

* Error UI for API failures
* Retry suggestions
* 404 handling for profile details

**Acceptance**

* Errors are visible and user-friendly

---

### Issue 15 - Responsive design refinement

**Goal**
Clean and consistent UI.

**Tasks**

* Adjust spacing, typography
* Verify breakpoints
* Ensure touch-friendly elements

**Acceptance**

* No layout breaks on small screens

---

## Phase 6 - Bonus improvements

### Issue 16 - Accessibility improvements

**Goal**
Baseline A11Y compliance.

**Tasks**

* Semantic HTML
* Alt text for avatars
* Keyboard navigation
* Contrast checks

**Acceptance**

* No obvious A11Y violations

---

### Issue 17 - SEO metadata

**Goal**
Improve discoverability.

**Tasks**

* Page titles and descriptions
* OG tags
* Dynamic meta for profile pages

**Acceptance**

* Meta tags present per page

---

### Issue 18 - Subtle animations

**Goal**
Improve perceived quality.

**Tasks**

* Hover states
* Page transitions
* Skeleton fade-ins

**Acceptance**

* No performance regressions

---

## Phase 7 - AI usage documentation and delivery

### Issue 19 - prompts.md management

**Goal**
Meet AI usage requirement.

**Tasks**

* Create `prompts.md`
* Log every AI prompt + response
* Update in same commits as AI code

**Acceptance**

* prompts.md always in sync with commits

---

### Issue 20 - README.md

**Goal**
Clear setup instructions.

**Tasks**

* Node version
* Install steps
* Run commands

**Acceptance**

* New dev can run app in under 5 minutes

---

### Issue 21 - Final review and cleanup

**Goal**
Prepare for submission.

**Tasks**

* Remove dead code
* Verify acceptance checklist
* Manual smoke testing

**Acceptance**

* All requirements met
* Clean commit history

---

If you want, next I can:

* Convert this directly into **GitHub issue templates**
* Propose a **commit strategy** aligned with the issues
* Or review this plan from a **recruiter / tech lead evaluation angle**

---

rewrite the issues and tasks to use md format that can be used in github projects issue description

---

Below is the same plan **rewritten as clean Markdown**, ready to be copy-pasted directly into **GitHub issue descriptions**.
No fluff, task-oriented, checkbox-based, and aligned with how reviewers actually read issues.

---

# Phase 0 - Project setup

## Issue: Initialize Nuxt 4 project

### Goal

Scaffold the base Nuxt 4 application with TypeScript.

### Tasks

* [ ] Create Nuxt 4 project with TypeScript enabled
* [ ] Verify `npm run dev` starts correctly
* [ ] Remove unused default pages and components

### Acceptance criteria

* Dev server runs without errors
* Empty home page renders correctly

---

## Issue: Install and configure Tailwind CSS

### Goal

Set up Tailwind CSS for styling.

### Tasks

* [ ] Install Tailwind via Nuxt module
* [ ] Configure `tailwind.config`
* [ ] Add base styles and verify utilities work

### Acceptance criteria

* Tailwind classes apply correctly
* Responsive utilities function as expected

---

## Issue: Define project structure and conventions

### Goal

Establish clean and scalable architecture.

### Tasks

* [ ] Create folders:

  * `/server/api`
  * `/lib/api-client`
  * `/lib/types`
  * `/composables`
* [ ] Decide naming conventions
* [ ] Add linting/formatting if needed

### Acceptance criteria

* Project structure follows Nuxt 4 best practices
* No unused boilerplate remains

---

# Phase 1 - Data model and utilities

## Issue: Define Profile data model

### Goal

Create a shared, typed profile model.

### Tasks

* [ ] Define Profile schema (Zod recommended)
* [ ] Include at least 10 attributes:

  * id
  * name
  * email
  * avatarUrl
  * age
  * jobTitle
  * company
  * phone
  * address
  * bio
* [ ] Export inferred TypeScript type
* [ ] Share types between server and client

### Acceptance criteria

* Types compile on both server and client
* Profile model is reusable and extensible

---

## Issue: Create Faker-based profile generator

### Goal

Centralize random profile generation logic.

### Tasks

* [ ] Install Faker
* [ ] Implement profile generator utility
* [ ] Generate TestingBot avatar URLs
* [ ] Support deterministic generation by id/seed

### Acceptance criteria

* Generator returns valid Profile objects
* No direct Faker usage inside API routes

---

# Phase 2 - Server API (Nuxt server layer)

## Issue: Implement GET /api/profiles endpoint

### Goal

Return a list of randomly generated profiles.

### Tasks

* [ ] Create `/server/api/profiles.get.ts`
* [ ] Generate configurable number of profiles
* [ ] Validate response with schema
* [ ] Handle errors gracefully

### Acceptance criteria

* Endpoint returns JSON array
* Errors return proper HTTP status codes

---

## Issue: Implement GET /api/profile/:id endpoint

### Goal

Return details for a single profile.

### Tasks

* [ ] Create `/server/api/profile/[id].get.ts`
* [ ] Generate deterministic profile from id
* [ ] Return 404 for invalid or missing id

### Acceptance criteria

* Correct profile returned for valid id
* Invalid id handled correctly

---

## Issue: Standardize API error handling

### Goal

Make API behavior predictable and safe.

### Tasks

* [ ] Define consistent error response format
* [ ] Handle Zod validation errors
* [ ] Add minimal logging

### Acceptance criteria

* No uncaught server errors
* Client can reliably parse error responses

---

# Phase 3 - Typed API client

## Issue: Create typed API client module

### Goal

Ensure client accesses API through a single abstraction.

### Tasks

* [ ] Implement `fetchProfiles()`
* [ ] Implement `fetchProfileById(id)`
* [ ] Add error handling and typing
* [ ] Prevent direct `$fetch` usage elsewhere

### Acceptance criteria

* All pages use API client
* Strong typing enforced

---

# Phase 4 - Client pages

## Issue: Implement Home page (profiles gallery)

### Goal

Display a gallery of random profiles.

### Tasks

* [ ] Fetch profiles via API client
* [ ] Render profile cards
* [ ] Create responsive grid layout

### Acceptance criteria

* Uses local API only
* Layout works on mobile and desktop

---

## Issue: Implement Search results page

### Goal

Display exactly 10 random profiles.

### Tasks

* [ ] Create `/search` route
* [ ] Fetch exactly 10 profiles
* [ ] Reuse profile card components

### Acceptance criteria

* Always renders exactly 10 profiles
* No duplicated logic from Home page

---

## Issue: Implement Profile details page

### Goal

Display detailed profile information.

### Tasks

* [ ] Create `/profile/[id]` route
* [ ] Fetch profile by id
* [ ] Render all profile attributes
* [ ] Handle invalid id errors

### Acceptance criteria

* Deep linking works
* Proper error state shown for invalid profiles

---

# Phase 5 - UX and polish

## Issue: Add loading states

### Goal

Provide visual feedback during async operations.

### Tasks

* [ ] Add skeletons or spinners
* [ ] Handle page-level and component-level loading

### Acceptance criteria

* No blank screens
* Consistent loading experience

---

## Issue: Add error states

### Goal

Gracefully handle failures.

### Tasks

* [ ] Display user-friendly error messages
* [ ] Handle API failures
* [ ] Add retry or navigation suggestions

### Acceptance criteria

* Errors are visible and understandable

---

## Issue: Improve responsive design

### Goal

Ensure consistent UI across screen sizes.

### Tasks

* [ ] Adjust spacing and typography
* [ ] Verify breakpoints
* [ ] Improve touch targets

### Acceptance criteria

* No layout breaks on small screens

---

# Phase 6 - Bonus improvements

## Issue: Accessibility improvements

### Goal

Meet baseline A11Y standards.

### Tasks

* [ ] Use semantic HTML
* [ ] Add alt text for avatars
* [ ] Ensure keyboard navigation
* [ ] Verify color contrast

### Acceptance criteria

* No obvious accessibility violations

---

## Issue: SEO metadata

### Goal

Improve SEO and social sharing.

### Tasks

* [ ] Add page titles and descriptions
* [ ] Implement OG tags
* [ ] Add dynamic meta for profile pages

### Acceptance criteria

* Meta tags present on all pages

---

## Issue: UI animations and transitions

### Goal

Improve perceived quality.

### Tasks

* [ ] Add hover and focus states
* [ ] Add subtle page transitions
* [ ] Avoid performance regressions

### Acceptance criteria

* Animations feel smooth and non-intrusive

---

# Phase 7 - AI documentation and delivery

## Issue: Maintain prompts.md

### Goal

Document AI usage as required.

### Tasks

* [ ] Create `prompts.md`
* [ ] Record all AI prompts and responses
* [ ] Update in same commits as AI-generated code

### Acceptance criteria

* prompts.md always matches commit history

---

## Issue: Create README.md

### Goal

Provide clear setup instructions.

### Tasks

* [ ] Document Node version
* [ ] Add install and run commands
* [ ] Keep instructions minimal and accurate

### Acceptance criteria

* Project runs from scratch in minutes

---

## Issue: Final review and cleanup

### Goal

Prepare project for submission.

### Tasks

* [ ] Remove dead code
* [ ] Verify acceptance checklist
* [ ] Manual smoke testing

### Acceptance criteria

* All requirements satisfied
* Clean, readable commit history

---

If you want next:

* I can **compress this into a GitHub Project board (columns + milestones)**
* Or rewrite it as **issue templates (feature / chore / bug)**
* Or review which issues are **must-have vs nice-to-have** from a hiring perspective

---
# User


> I can compress this into a GitHub Project board (columns + milestones)
I want to separate those issues with milestones for each phase for easy tracking of project progress

---
# GPT

Perfect call. Milestones are exactly how I would expect this to be tracked.

Below is a **clean, GitHub-ready milestone structure**, with **issues mapped 1:1 to milestones**, so you can literally copy the milestone names and then assign issues to them.

No theory, no extras.

---

# Milestones Overview

## Milestone 0 - Project Setup

**Purpose:** Get a runnable, styled Nuxt 4 skeleton
**Completion signal:** App runs locally with Tailwind enabled

**Issues**

* Initialize Nuxt 4 project
* Install and configure Tailwind CSS
* Define project structure and conventions

---

## Milestone 1 - Data Model & Generation

**Purpose:** Establish shared types and data generation logic
**Completion signal:** Profiles can be generated consistently and typed

**Issues**

* Define Profile data model
* Create Faker-based profile generator

---

## Milestone 2 - Server API

**Purpose:** Expose required REST endpoints
**Completion signal:** API fully serves valid profile data

**Issues**

* Implement GET /api/profiles endpoint
* Implement GET /api/profile/:id endpoint
* Standardize API error handling

---

## Milestone 3 - Typed API Client

**Purpose:** Enforce clean data access from client
**Completion signal:** No direct API calls outside client module

**Issues**

* Create typed API client module

---

## Milestone 4 - Core Pages

**Purpose:** Deliver required application functionality
**Completion signal:** All required pages working and API-driven

**Issues**

* Implement Home page (profiles gallery)
* Implement Search results page (exactly 10 profiles)
* Implement Profile details page

---

## Milestone 5 - UX & State Handling

**Purpose:** Make the app usable and resilient
**Completion signal:** Loading and error states present everywhere

**Issues**

* Add loading states
* Add error states
* Improve responsive design

---

## Milestone 6 - Quality & Bonus Features

**Purpose:** Increase polish and evaluation score
**Completion signal:** App feels production-ready

**Issues**

* Accessibility improvements
* SEO metadata
* UI animations and transitions

---

## Milestone 7 - AI Documentation & Delivery

**Purpose:** Satisfy submission and AI usage requirements
**Completion signal:** Repo is ready to be shared

**Issues**

* Maintain prompts.md
* Create README.md
* Final review and cleanup

---

# Recommended GitHub Project Columns

Use these **globally**, independent of milestones:

* Backlog
* Ready
* In Progress
* In Review
* Done

Milestones answer **what phase**, columns answer **current state**.

---

# Practical Tips (from experience)

* Close milestones strictly in order. Reviewers notice.
* Keep **one active milestone at a time** unless blocked.
* Every PR should:

  * Reference the issue
  * Automatically close it
  * Update `prompts.md` if AI was used

If you want, I can:

* Generate **milestone descriptions** exactly as GitHub renders them
* Propose a **commit naming convention per milestone**
* Flag which milestones are **non-negotiable vs optional** from a hiring signal perspective

---
# User

the previous md version of the issues are rendered by app your answers are embedded in. wrap the entire plan in md format with codeblock

---
# GPT

Got it. The renderer is eating the Markdown.
Below is the **entire plan wrapped in a single code block**, so GitHub will interpret it correctly when you paste it into issues or docs.

No formatting leaks, no surprises.

```md
# Phase 0 - Project setup

## Issue: Initialize Nuxt 4 project

### Goal
Scaffold the base Nuxt 4 application with TypeScript.

### Tasks
- [ ] Create Nuxt 4 project with TypeScript enabled
- [ ] Verify `npm run dev` starts correctly
- [ ] Remove unused default pages and components

### Acceptance criteria
- Dev server runs without errors
- Empty home page renders correctly


## Issue: Install and configure Tailwind CSS

### Goal
Set up Tailwind CSS for styling.

### Tasks
- [ ] Install Tailwind via Nuxt module
- [ ] Configure `tailwind.config`
- [ ] Add base styles and verify utilities work

### Acceptance criteria
- Tailwind classes apply correctly
- Responsive utilities function as expected


## Issue: Define project structure and conventions

### Goal
Establish clean and scalable architecture.

### Tasks
- [ ] Create folders:
  - `/server/api`
  - `/lib/api-client`
  - `/lib/types`
  - `/composables`
- [ ] Decide naming conventions
- [ ] Add linting/formatting if needed

### Acceptance criteria
- Project structure follows Nuxt 4 best practices
- No unused boilerplate remains


# Phase 1 - Data model and utilities

## Issue: Define Profile data model

### Goal
Create a shared, typed profile model.

### Tasks
- [ ] Define Profile schema (Zod recommended)
- [ ] Include at least 10 attributes:
  - id
  - name
  - email
  - avatarUrl
  - age
  - jobTitle
  - company
  - phone
  - address
  - bio
- [ ] Export inferred TypeScript type
- [ ] Share types between server and client

### Acceptance criteria
- Types compile on both server and client
- Profile model is reusable and extensible


## Issue: Create Faker-based profile generator

### Goal
Centralize random profile generation logic.

### Tasks
- [ ] Install Faker
- [ ] Implement profile generator utility
- [ ] Generate TestingBot avatar URLs
- [ ] Support deterministic generation by id or seed

### Acceptance criteria
- Generator returns valid Profile objects
- No direct Faker usage inside API routes


# Phase 2 - Server API (Nuxt server layer)

## Issue: Implement GET /api/profiles endpoint

### Goal
Return a list of randomly generated profiles.

### Tasks
- [ ] Create `/server/api/profiles.get.ts`
- [ ] Generate configurable number of profiles
- [ ] Validate response with schema
- [ ] Handle errors gracefully

### Acceptance criteria
- Endpoint returns JSON array
- Errors return proper HTTP status codes


## Issue: Implement GET /api/profile/:id endpoint

### Goal
Return details for a single profile.

### Tasks
- [ ] Create `/server/api/profile/[id].get.ts`
- [ ] Generate deterministic profile from id
- [ ] Return 404 for invalid or missing id

### Acceptance criteria
- Correct profile returned for valid id
- Invalid id handled correctly


## Issue: Standardize API error handling

### Goal
Make API behavior predictable and safe.

### Tasks
- [ ] Define consistent error response format
- [ ] Handle Zod validation errors
- [ ] Add minimal logging

### Acceptance criteria
- No uncaught server errors
- Client can reliably parse error responses


# Phase 3 - Typed API client

## Issue: Create typed API client module

### Goal
Ensure client accesses API through a single abstraction.

### Tasks
- [ ] Implement `fetchProfiles()`
- [ ] Implement `fetchProfileById(id)`
- [ ] Add error handling and typing
- [ ] Prevent direct `$fetch` usage elsewhere

### Acceptance criteria
- All pages use API client
- Strong typing enforced


# Phase 4 - Client pages

## Issue: Implement Home page (profiles gallery)

### Goal
Display a gallery of random profiles.

### Tasks
- [ ] Fetch profiles via API client
- [ ] Render profile cards
- [ ] Create responsive grid layout

### Acceptance criteria
- Uses local API only
- Layout works on mobile and desktop


## Issue: Implement Search results page

### Goal
Display exactly 10 random profiles.

### Tasks
- [ ] Create `/search` route
- [ ] Fetch exactly 10 profiles
- [ ] Reuse profile card components

### Acceptance criteria
- Always renders exactly 10 profiles
- No duplicated logic from Home page


## Issue: Implement Profile details page

### Goal
Display detailed profile information.

### Tasks
- [ ] Create `/profile/[id]` route
- [ ] Fetch profile by id
- [ ] Render all profile attributes
- [ ] Handle invalid id errors

### Acceptance criteria
- Deep linking works
- Proper error state shown for invalid profiles


# Phase 5 - UX and polish

## Issue: Add loading states

### Goal
Provide visual feedback during async operations.

### Tasks
- [ ] Add skeletons or spinners
- [ ] Handle page-level and component-level loading

### Acceptance criteria
- No blank screens
- Consistent loading experience


## Issue: Add error states

### Goal
Gracefully handle failures.

### Tasks
- [ ] Display user-friendly error messages
- [ ] Handle API failures
- [ ] Add retry or navigation suggestions

### Acceptance criteria
- Errors are visible and understandable


## Issue: Improve responsive design

### Goal
Ensure consistent UI across screen sizes.

### Tasks
- [ ] Adjust spacing and typography
- [ ] Verify breakpoints
- [ ] Improve touch targets

### Acceptance criteria
- No layout breaks on small screens


# Phase 6 - Bonus improvements

## Issue: Accessibility improvements

### Goal
Meet baseline A11Y standards.

### Tasks
- [ ] Use semantic HTML
- [ ] Add alt text for avatars
- [ ] Ensure keyboard navigation
- [ ] Verify color contrast

### Acceptance criteria
- No obvious accessibility violations


## Issue: SEO metadata

### Goal
Improve SEO and social sharing.

### Tasks
- [ ] Add page titles and descriptions
- [ ] Implement OG tags
- [ ] Add dynamic meta for profile pages

### Acceptance criteria
- Meta tags present on all pages


## Issue: UI animations and transitions

### Goal
Improve perceived quality.

### Tasks
- [ ] Add hover and focus states
- [ ] Add subtle page transitions
- [ ] Avoid performance regressions

### Acceptance criteria
- Animations feel smooth and non-intrusive


# Phase 7 - AI documentation and delivery

## Issue: Maintain prompts.md

### Goal
Document AI usage as required.

### Tasks
- [ ] Create `prompts.md`
- [ ] Record all AI prompts and responses
- [ ] Update in same commits as AI-generated code

### Acceptance criteria
- prompts.md always matches commit history


## Issue: Create README.md

### Goal
Provide clear setup instructions.

### Tasks
- [ ] Document Node version
- [ ] Add install and run commands
- [ ] Keep instructions minimal and accurate

### Acceptance criteria
- Project runs from scratch in minutes


## Issue: Final review and cleanup

### Goal
Prepare project for submission.

### Tasks
- [ ] Remove dead code
- [ ] Verify acceptance checklist
- [ ] Manual smoke testing

### Acceptance criteria
- All requirements satisfied
- Clean, readable commit history
```

If you want next, I can:

* Split this automatically into **one file per milestone**
* Generate **GitHub issue titles + labels**
* Or compress this into a **single tracking document for reviewers**

---
# User

add mentioned nice to have steps mentioned in the pdf file

---
# GPT

Good catch - the PDF has a few **nice-to-have / appreciated** items that were not fully explicit in the plan (especially API docs and extensibility).
Below is the **updated full plan**, still wrapped in **one Markdown code block**, with **additional “nice to have” issues clearly marked** so reviewers see you went beyond minimum without mixing priorities.

I did **not** invent extras beyond what’s mentioned or clearly implied in the PDF.

```md
# Phase 0 - Project setup

## Issue: Initialize Nuxt 4 project

### Goal
Scaffold the base Nuxt 4 application with TypeScript.

### Tasks
- [ ] Create Nuxt 4 project with TypeScript enabled
- [ ] Verify `npm run dev` starts correctly
- [ ] Remove unused default pages and components

### Acceptance criteria
- Dev server runs without errors
- Empty home page renders correctly


## Issue: Install and configure Tailwind CSS

### Goal
Set up Tailwind CSS for styling.

### Tasks
- [ ] Install Tailwind via Nuxt module
- [ ] Configure `tailwind.config`
- [ ] Add base styles and verify utilities work

### Acceptance criteria
- Tailwind classes apply correctly
- Responsive utilities function as expected


## Issue: Define project structure and conventions

### Goal
Establish clean and scalable architecture.

### Tasks
- [ ] Create folders:
  - `/server/api`
  - `/lib/api-client`
  - `/lib/types`
  - `/composables`
- [ ] Decide naming conventions
- [ ] Add linting/formatting if needed

### Acceptance criteria
- Project structure follows Nuxt 4 best practices
- No unused boilerplate remains


# Phase 1 - Data model and utilities

## Issue: Define Profile data model (shared server + client)

### Goal
Create a shared, typed profile model.

### Tasks
- [ ] Define Profile schema using Zod
- [ ] Include at least 10 attributes:
  - id
  - name
  - email
  - avatarUrl
  - age
  - jobTitle
  - company
  - phone
  - address
  - bio
- [ ] Export inferred TypeScript type
- [ ] Reuse schema for API validation

### Acceptance criteria
- Types compile on both server and client
- Schema reused for runtime validation


## Issue: Create Faker-based profile generator

### Goal
Centralize random profile generation logic.

### Tasks
- [ ] Install Faker
- [ ] Implement profile generator utility
- [ ] Generate TestingBot avatar URLs
- [ ] Support deterministic generation by id or seed

### Acceptance criteria
- Generator returns valid Profile objects
- No direct Faker usage inside API routes


## Issue (Nice to have): Compose data from external random APIs

### Goal
Optionally enrich profile data.

### Tasks
- [ ] Fetch data from public APIs (e.g. randomuser.me) inside server routes
- [ ] Normalize external data into Profile schema
- [ ] Ensure client never calls external APIs directly

### Acceptance criteria
- External APIs only used server-side
- Output still matches local Profile schema


# Phase 2 - Server API (Nuxt server layer)

## Issue: Implement GET /api/profiles endpoint

### Goal
Return a list of randomly generated profiles.

### Tasks
- [ ] Create `/server/api/profiles.get.ts`
- [ ] Generate configurable number of profiles
- [ ] Validate response with Zod schema
- [ ] Handle errors gracefully

### Acceptance criteria
- Endpoint returns JSON array
- Errors return proper HTTP status codes


## Issue: Implement GET /api/profile/:id endpoint

### Goal
Return details for a single profile.

### Tasks
- [ ] Create `/server/api/profile/[id].get.ts`
- [ ] Generate deterministic profile from id
- [ ] Return 404 for invalid or missing id

### Acceptance criteria
- Correct profile returned for valid id
- Invalid id handled correctly


## Issue: Standardize API error handling

### Goal
Make API behavior predictable and safe.

### Tasks
- [ ] Define consistent error response format
- [ ] Handle Zod validation errors
- [ ] Add minimal logging

### Acceptance criteria
- No uncaught server errors
- Client can reliably parse error responses


## Issue (Nice to have): API documentation (Swagger or similar)

### Goal
Improve API discoverability and clarity.

### Tasks
- [ ] Document endpoints and payloads
- [ ] Expose local API docs endpoint (optional)
- [ ] Keep docs in sync with schema

### Acceptance criteria
- API behavior clearly documented
- No mismatch between docs and implementation


# Phase 3 - Typed API client

## Issue: Create typed API client module

### Goal
Ensure client accesses API through a single abstraction.

### Tasks
- [ ] Implement `fetchProfiles()`
- [ ] Implement `fetchProfileById(id)`
- [ ] Add error handling and typing
- [ ] Prevent direct `$fetch` usage elsewhere

### Acceptance criteria
- All pages use API client
- Strong typing enforced


# Phase 4 - Client pages

## Issue: Implement Home page (profiles gallery)

### Goal
Display a gallery of random profiles.

### Tasks
- [ ] Fetch profiles via API client
- [ ] Render profile cards
- [ ] Create responsive grid layout

### Acceptance criteria
- Uses local API only
- Layout works on mobile and desktop


## Issue: Implement Search results page

### Goal
Display exactly 10 random profiles.

### Tasks
- [ ] Create `/search` route
- [ ] Fetch exactly 10 profiles
- [ ] Reuse profile card components

### Acceptance criteria
- Always renders exactly 10 profiles
- No duplicated logic from Home page


## Issue: Implement Profile details page

### Goal
Display detailed profile information.

### Tasks
- [ ] Create `/profile/[id]` route
- [ ] Fetch profile by id
- [ ] Render all profile attributes
- [ ] Handle invalid id errors

### Acceptance criteria
- Deep linking works
- Proper error state shown for invalid profiles


# Phase 5 - UX and state handling

## Issue: Add loading states

### Goal
Provide visual feedback during async operations.

### Tasks
- [ ] Add skeletons or spinners
- [ ] Handle page-level and component-level loading

### Acceptance criteria
- No blank screens
- Consistent loading experience


## Issue: Add error states

### Goal
Gracefully handle failures
```

--- Answer stopped

# User

list only the nice to haves in your next message

---

# GPT

Here are **only the nice-to-have items** explicitly mentioned or clearly implied in the PDF, listed cleanly and ready to be turned into issues if you want.

```md
## Nice to have: Compose data from external random-data APIs

### Description
Optionally enrich profile data using public random-data APIs (e.g. randomuser.me), while keeping the client layer isolated from external services.

### Tasks
- [ ] Fetch data from external APIs inside Nuxt server routes
- [ ] Normalize external data into local Profile schema
- [ ] Ensure client never calls external APIs directly

### Acceptance criteria
- External APIs are used only server-side
- Client consumes only local API responses
```

```md
## Nice to have: Shared schema validation with Zod

### Description
Use Zod to define and validate data types shared between server and client.

### Tasks
- [ ] Define Profile schema using Zod
- [ ] Reuse schema for runtime validation in API routes
- [ ] Infer TypeScript types from schema

### Acceptance criteria
- Single source of truth for profile data
- API payloads validated at runtime
```

```md
## Nice to have: Accessibility (A11Y) improvements

### Description
Follow accessibility best practices to improve usability for all users.

### Tasks
- [ ] Use semantic HTML elements
- [ ] Add alt text to avatar images
- [ ] Ensure keyboard navigation
- [ ] Verify color contrast ratios

### Acceptance criteria
- No obvious accessibility violations
- App usable via keyboard
```

```md
## Nice to have: SEO improvements

### Description
Improve page discoverability and social sharing.

### Tasks
- [ ] Add page titles and meta descriptions
- [ ] Add Open Graph tags
- [ ] Add dynamic meta for profile detail pages

### Acceptance criteria
- Metadata present on all pages
- Profile pages have unique titles/descriptions
```

```md
## Nice to have: Smooth animations and transitions

### Description
Improve perceived quality and UX with subtle motion.

### Tasks
- [ ] Add hover and focus transitions
- [ ] Add page transitions
- [ ] Ensure animations do not impact performance

### Acceptance criteria
- Animations feel smooth and non-intrusive
- No performance regressions
```

```md
## Nice to have: API documentation and extensibility

### Description
Provide clearer API usage and prepare for future extensions.

### Tasks
- [ ] Document API endpoints and payloads
- [ ] Optionally expose Swagger or similar documentation
- [ ] Keep documentation aligned with schemas

### Acceptance criteria
- API behavior is clearly documented
- Documentation matches implementation
```

If you want, I can:

* Rank these by **impact vs effort**
* Mark which ones recruiters actually care about
* Or merge them into a **single “Polish & Extras” milestone**

---
# User

let's start with phase 0. Write a cursor prompt that will specify detailed plan for the scaffolding and phase 0 tasks.

---
# GPT

Below is a **Cursor-ready prompt** you can paste directly into Cursor.
It is scoped **only to Phase 0**, very explicit, and optimized so Cursor produces **incremental, reviewable changes**, not a big blob.

I’ve written it the way a strong product engineer would instruct an AI pair-programmer.

```
You are a senior frontend engineer working on a hiring task.

Context:
- Project: Random Profiles Catalog App
- Framework: Nuxt 4
- Language: TypeScript
- Styling: Tailwind CSS
- This is Phase 0: project scaffolding and setup only
- No feature logic, no API routes, no pages beyond a minimal placeholder

Goal of this phase:
Deliver a clean, runnable Nuxt 4 project skeleton that follows best practices and is ready for further development.

Constraints:
- Keep changes minimal and atomic
- Do NOT implement any business logic
- Do NOT add mock data, Faker, API routes, or pages beyond a minimal home placeholder
- Prefer clarity and correctness over cleverness

Tasks to perform (in order):

1. Initialize Nuxt 4 project
   - Ensure TypeScript is enabled
   - Verify the project runs with `npm run dev`
   - Remove or simplify default boilerplate that is not needed

2. Install and configure Tailwind CSS
   - Use the official Nuxt + Tailwind integration
   - Ensure Tailwind utilities work in templates
   - Add a minimal global style baseline if needed

3. Establish project structure and conventions
   - Create the following empty directories:
     - /server/api
     - /lib/api-client
     - /lib/types
     - /composables
   - Do not add placeholder files unless required by Nuxt
   - Keep naming consistent and predictable

4. Create a minimal Home page placeholder
   - Simple page confirming the app renders correctly
   - Use a few Tailwind classes to prove styling works
   - No layout complexity

5. Verify developer experience
   - Ensure there are no TypeScript errors
   - Ensure linting/build passes if configured
   - Keep configuration readable and minimal

Output expectations:
- Explain each change briefly before making it
- Make small, incremental edits
- Do not jump ahead to future phases
- If something is optional, call it out instead of assuming

After finishing:
- Summarize what was done
- Explicitly state that Phase 0 is complete and ready for Phase 1
```

If you want next, I can:

* Write the **Phase 1 Cursor prompt** (data model + Faker)
* Split this into **multiple Cursor prompts per issue**
* Or tune this to be more strict or more exploratory depending on how Cursor behaves for you

---

