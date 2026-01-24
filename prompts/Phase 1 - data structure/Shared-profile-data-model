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

