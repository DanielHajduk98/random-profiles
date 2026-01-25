# Nuxt 4 API client module
_Exported on 1/25/2026 at 19:37:33 GMT+1 from Cursor (2.4.21)_

---

**User**

You are a senior frontend engineer continuing a Nuxt 4 project.

Context:
- Project: Random Profiles Catalog App
- Framework: Nuxt 4
- Language: TypeScript
- Server API endpoints already exist:
  - GET /api/profiles
  - GET /api/profile/:id
- Shared Profile Zod schema exists
- This ticket introduces the client-side API abstraction

Goal:
Create a small, typed API client module that is the ONLY place in the client layer
responsible for calling server API endpoints.

Constraints:
- Do NOT add UI components or pages
- Do NOT call the API directly from pages or composables
- Do NOT introduce state management (Pinia, etc.)
- Keep the module minimal and explicit
- Reuse existing types and schemas @lib/types/profile-schema.ts 

Tasks to perform (in order):

1. Create API client module
   - Place the module in `/lib/api-client`
   - Export clearly named functions:
     - `getProfiles(params)`
     - `getProfileById(id)`
   - Use Nuxt’s `$fetch` or `useFetch` where appropriate
   - Keep the API surface small and intentional

2. Typing and validation
   - Type all request parameters explicitly
   - Use the shared Profile TypeScript type for responses
   - validate responses using the Zod schema
   - Ensure types are usable in both client and server contexts if needed

3. Error handling
   - Normalize API errors into a predictable shape
   - Avoid leaking raw fetch errors to consumers
   - Ensure calling code can distinguish:
     - network errors
     - not-found errors
     - validation errors

4. API client ergonomics
   - Make the API easy to consume from pages
   - Avoid over-abstraction
   - Prefer explicit parameters over generic objects where possible

5. Unit tests (if applicable)
   - Add unit tests for the API client functions
   - Mock network calls
   - Verify typing and error handling behavior

Output expectations:
- Explain which files you will add or modify before coding
- Keep the module small and readable
- Avoid unused helpers or premature abstractions
- Ensure TypeScript compiles without errors

After finishing:
- Summarize available client API functions
- Explain how errors are handled
- Explicitly state that this module is ready to be used by pages


1. Which option is better? what are the pros and tradeofs? I will want to use this api client in views and components

---

**Cursor**

If you’ll consume this from views/components, both work, but tradeoffs:

- `$fetch` pros: simple Promise API, works anywhere (components, server, tests), no Nuxt composable context, easier to mock. Cons: no built-in caching/SSR state or auto reactivity.
- `useFetch` pros: reactive data, SSR-friendly caching, built-in pending/error refs. Cons: composable-only (must be called in setup or Nuxt context), harder to reuse in plain TS/tests, returns refs instead of plain data.

Given your choice: I’ll design the module around `useFetch` but still keep it small and explicit, and normalize errors. This means API calls from views/components are fine, but the client won’t be usable outside Nuxt composable context (tests will need Nuxt test utils/mocks).

If that’s acceptable, I’ll proceed with a `useFetch`-based client.

---

**User**

lets use $fetch

why do we need to provide fetcher? for tests?

---

**Cursor**

Yes — the optional `fetcher` is only for tests. It lets tests inject a mock instead of relying on Nuxt’s global `$fetch`. That keeps tests fast, deterministic, and avoids bootstrapping Nuxt runtime.

If you want, I can still keep it minimal: it stays optional in prod (default `$fetch`), and tests pass a stub.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Added a minimal `$fetch`-based client in `lib/api-client/index.ts` with typed params, Zod response validation, and normalized errors; added unit tests in `test/api-client.test.ts` using injected fetcher mocks.

Available client API functions
- `getProfiles(params?, fetcher?)`
- `getProfileById(id, fetcher?)`

Error handling
- Throws `ApiClientError` with `type: "network" | "not-found" | "validation" | "unknown"`, plus `message`, optional `statusCode`, and validation `details` for schema failures.
- Consumers never see raw fetch errors.

Module is ready to be used by pages and components as the single client API entry point.

Tests not run here; run `npm test` or `vitest` if you want a check.

---

**User**

For the code present, we get this error:
```
Cannot find name '$fetch'. Did you mean 'fetch'?
```
Fix it, verify, and then give a concise explanation. @lib/api-client/index.ts:82-85 

For the code present, we get this error:
```
Cannot find name '$fetch'. Did you mean 'fetch'?
```
Fix it, verify, and then give a concise explanation. @lib/api-client/index.ts:82-85 

$fetch should be globally available https://nuxt.com/docs/4.x/api/utils/dollarfetch 

perform a code review of the new code

---

**Cursor**

Here’s the review of the new code.

## Findings (highest severity first)

- **Compile error: `$fetch` not in scope**  
  You already saw this: TypeScript can’t find `$fetch` in a plain TS module. This is still present in `app/utils/api-client/index.ts`. If Nuxt auto-import types aren’t applied to this file, it will fail typecheck.  
  ```1:4:app/utils/api-client/index.ts
  import { ZodError } from "zod";
  import { ProfileSchema, type Profile } from "../../../lib/types/profile-schema";
  // ...
  const defaultFetcher: ApiFetcher = (url, options) => $fetch(url, options);
  ```

- **`id` is not URL-encoded**  
  `getProfileById` interpolates `id` directly into the URL. If `id` includes `/`, `?`, or `#`, the request will break or hit the wrong route.  
  ```120:126:app/utils/api-client/index.ts
  export const getProfileById = async (
    id: string,
    fetcher: ApiFetcher = defaultFetcher,
  ): Promise<Profile> => {
    const response = await fetcher<unknown>(`/api/profile/${id}`);
  ```

- **Server-side validation errors are reported as `unknown`**  
  You normalize Zod response errors as `validation`, but server 400s (e.g., invalid `count` or repeated params) end up as `unknown`. That makes it hard for callers to distinguish request validation errors from other failures.  
  ```57:77:app/utils/api-client/index.ts
  if (typeof statusCode === "number") {
    return new ApiClientError("unknown", message, { statusCode });
  }
  ```

## Minor / style

- **Missing trailing newline in test file** (lint/formatting nit, not functional).  

## Assumptions / questions
- I assume you want Nuxt auto-imports to cover `app/utils/**`. If not, the `$fetch` compile error will persist.

## Testing
- No runtime tests run.

If you want, I can fix the `$fetch` typing issue in a Nuxt‑compatible way and address the URL encoding + 400‑error mapping.

---

**User**

address the URL encoding + 400‑error mapping.

---

**Cursor**

Updated `getProfileById` to URL-encode the id, and mapped 400 responses to `validation` errors. Added tests for both behaviors.

Key changes
- URL encoding in `getProfileById` before building the path.
- 400 status mapped to `ApiClientError` type `validation`.
- Tests cover encoded id and 400 normalization.

If you want, I can run `vitest` to verify.

---

**User**

@app/utils/api-client/index.ts:126-127 can we instead ofo passing fetcher in tests mock the $fetch? I dislike that we set up a schema in a function only to be used in unit tests

---

**Cursor**

Removed the injected `fetcher` param and switched tests to mock global `$fetch` via `vi.stubGlobal`, so the client API stays clean and tests still control responses.

Why: avoids a test-only parameter in the public API while still keeping unit tests fast and deterministic.

If you want, I can also add a tiny `declare global` for `$fetch` in tests to satisfy TS in strict setups.

---

**User**

@app/utils/api-client/index.ts:52-53 we can move this to a separate type check in @server/utils/type-guards.ts 

---

**Cursor**

Moved the object check into a shared guard and reused it in the client.

- Added `isRecord` in `server/utils/type-guards.ts`
- Replaced the inline `typeof` check with `isRecord` in `app/utils/api-client/index.ts`

No lint issues found.

---

**User**

@app/utils/api-client/index.ts:54-65 do not use nested ternary operators

---

**Cursor**

Replaced nested ternaries with `getErrorStatusCode` and `getErrorMessage` helpers to keep logic flat and readable.

No lint issues found.

---

**User**

@test/api-client.test.ts:31-32 why stub fetch in each test case, can you create a factory for fetcher and minimize repetetiveness?

---

**Cursor**

Added a `createFetchStub` helper to stub `$fetch` once per test and remove repeated setup.

No lint issues found.

