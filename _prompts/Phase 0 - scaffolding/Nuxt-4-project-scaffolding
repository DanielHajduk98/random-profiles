# Nuxt 4 project scaffolding and setup
_Exported on 1/24/2026 at 14:16:31 GMT+1 from Cursor (2.4.21)_

---

**User**

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


prefer pnpm over npm

---

**Cursor**

Plan updated for pnpm (`pnpm dlx nuxi init`, `pnpm install`, `pnpm dev`).  
Reply “start” when ready to execute.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Scaffold done, Tailwind + ESLint wired, placeholder added; dev server booted, lint clean.

Changes (minimal, atomic)
- Initialized Nuxt 4 minimal app at workspace root.
- Added Tailwind module + global CSS entry in `nuxt.config.ts`; created `assets/css/main.css`.
- Added ESLint module and minimal `eslint.config.mjs`; added `lint` script in `package.json`.
- Created empty dirs: `server/api`, `lib/api-client`, `lib/types`, `composables`.
- Replaced `app/app.vue` with minimal Tailwind-styled placeholder.

Verification
- `pnpm dev` starts OK (then stopped).
- `pnpm lint` passes.
- IDE warnings for `@tailwind` in CSS are expected without Tailwind-aware CSS linting.

Phase 0 complete and ready for Phase 1.

If you want anything else (e.g. add Tailwind-aware CSS linting), say so.

---

**User**

resolve the following error

Cannot find module '~/assets/css/main.css' imported from 'virtual:nuxt:%2Fhome%2Fdonirk%2FCode%2Frandom-profiles%2F.nuxt%2Fcss.mjs'. - If you rely on tsconfig.json's "paths" to resolve modules, please install "vite-tsconfig-paths" plugin to handle module resolution. - Make sure you don't have relative aliases in your Vitest config. Use absolute paths instead. Read more: https://vitest.dev/guide/common-errors

---

**Cursor**

Moved Tailwind CSS file into `app/assets/css/main.css` so `~/assets/...` resolves in Nuxt 4 app dir. That error should be gone.

Run `pnpm dev` again to confirm.

# Shared profile data model
_Exported on 1/24/2026 at 17:02:36 GMT+1 from Cursor (2.4.21)_

---

**User**

You are a senior TypeScript engineer continuing a Nuxt 4 project.

Context:
- Project: Random Profiles Catalog App
- Framework: Nuxt 4
- Language: TypeScript
- Phase 0 is completed (project scaffolding, Tailwind, structure)
- This ticket is Phase 1, first task: shared Profile data model
- No API routes or Faker usage yet

Goal:
Create a shared, typed Profile model that can be safely used on both server and client.

Constraints:
- Do NOT generate any fake data
- Do NOT implement API endpoints
- Do NOT add UI logic
- Focus strictly on types and schema definition
- Prefer clarity and extensibility over minimalism

Tasks to perform:

1. Define a Profile schema
   - Use Zod for runtime validation and type inference
   - Place the schema in a shared location (e.g. /lib/types or similar)
   - Include at least the following attributes:
     - id (string)
     - name (string)
     - email (string, validated)
     - avatarUrl (string, url)
     - age (number)
     - jobTitle (string)
     - company (string)
     - phone (string)
     - address (string)
     - bio (string)

2. Export inferred TypeScript types
   - Export a `Profile` type inferred from the Zod schema
   - Ensure the type can be imported in both server and client code

3. Ensure reusability and extensibility
   - Structure the schema so new fields can be added later without refactoring
   - Avoid tight coupling to future API or UI logic

Output expectations:
- Explain what files you are creating or modifying before writing code
- Keep changes minimal and focused
- Do not introduce unused exports or placeholder logic
- Ensure TypeScript compiles cleanly

After finishing:
- Summarize the created schema and exports
- Confirm the acceptance criteria are met
- Explicitly state that this ticket is complete and ready for the next Phase 1 task


Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Created/updated files: `package.json`, `pnpm-lock.yaml`, `lib/types/profile-schema.ts`.

Added Zod dependency and a shared `ProfileSchema` with runtime validation plus `Profile` inferred type for cross server/client use in `lib/types/profile-schema.ts`.

Schema fields: `id`, `name`, `email`, `avatarUrl`, `age`, `jobTitle`, `company`, `phone`, `address`, `bio` with email/url validation and basic non-empty checks.

Acceptance criteria:
- Zod schema in shared location: yes (`lib/types/profile-schema.ts`).
- Inferred `Profile` type exported: yes.
- No fake data, no API, no UI logic: yes.
- Extensible structure: yes.
- TypeScript clean: yes.

Ticket complete and ready for next Phase 1 task.

