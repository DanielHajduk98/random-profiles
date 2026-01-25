# In-memory profile catalog and search API
_Exported on 1/25/2026 at 14:15:25 GMT+1 from Cursor (2.4.21)_

---

**User**

You are a senior engineer continuing a Nuxt 4 project.

Context:
- Project: Random Profiles Catalog App
- Framework: Nuxt 4
- Language: TypeScript
- Shared Profile Zod schema exists @lib/types/profile-schema.ts 
- Faker-based profile generator exists @server/utils/profile-generator.ts 
- This ticket implements GET /api/profiles using a pre-generated in-memory catalog

Design decision (important):
- Instead of generating profiles per request, the app maintains an in-memory catalog
- The catalog contains exactly 2000 profiles (add a constant for the profile amount to simplify future adjustments)
- Profiles are generated once (lazy initialization) and reused
- Search queries perform fuzzy matching against this catalog - you can use fuse.js @Fuse.js  library
- This simulates real-world application behavior without persistence

Goal:
Implement GET /api/profiles endpoint backed by a seeded, in-memory catalog of 2000 profiles,
with realistic search behavior, schema validation, error handling, and unit tests.

Constraints:
- Do NOT add Swagger or API documentation in this ticket
- Do NOT implement other endpoints
- Do NOT add client-side code
- Do NOT persist data to disk or database
- Catalog must live only in memory
- Reuse existing Profile schema and profile generator
- Keep logic readable and testable

Tasks to perform (in order):

1. Implement catalog module
   - Create a dedicated module responsible for profile catalog management
   - The module should:
     - Lazily generate exactly 2000 profiles
     - Use a fixed seed to ensure deterministic generation
     - Cache profiles in memory
     - Expose a function to retrieve the catalog
   - Profiles must be validated against the Profile Zod schema when generated

2. Catalog generation details
   - Use Faker to generate profiles via the existing generator
   - Ensure profile IDs are unique
   - Generation should happen only once per server lifecycle
   - Avoid regeneration on every request

3. Implement fuzzy search logic
   - Accept optional query parameters:
     - `q` (string)
     - `count` (number)
   - If `q` is provided:
     - Perform fuzzy matching across multiple fields:
       - name
       - email
       - phone
       - company
       - jobTitle
       - address
     - Use simple, readable matching (e.g. includes, case-insensitive)
     - Optionally apply basic scoring and sorting
   - If `q` is missing:
     - Return a deterministic slice of the catalog
   - Ensure exactly `count` profiles are returned (default to sensible value)

4. Implement API endpoint
   - Create or update `/server/api/profiles.get.ts`
   - Retrieve profiles from the catalog module
   - Apply search logic if query is present
   - Return JSON array of Profile objects

5. Validate response
   - Ensure all returned profiles conform to the Profile schema
   - Do not revalidate the entire catalog on every request
   - Fail fast if unexpected data is encountered

6. Error handling
   - Handle invalid query parameters:
     - Non-numeric count
     - Negative or zero count
   - Return appropriate HTTP status codes
   - Return errors in a consistent JSON format
   - Avoid exposing stack traces

7. Unit tests
   - Add unit tests for GET /api/profiles
   - Cover:
     - Catalog initialization
     - Default behavior (no query)
     - Search behavior with matching query
     - Search behavior with nonsense query (zero or few results)
     - Deterministic results across calls
     - Custom count parameter
     - Invalid parameters
   - Assert:
     - HTTP status codes
     - Response length
     - Schema compliance
     - Stability of results

Output expectations:
- Before writing code, explain which files you will add or modify
- Keep the catalog logic isolated from the API handler
- Avoid tight coupling between search and generation
- Keep tests deterministic and readable
- Ensure all tests pass

After finishing:
- Summarize the catalog approach and why it was chosen
- Explain search behavior for valid vs nonsense queries
- Summarize test coverage
- Explicitly state that this ticket is complete and ready for Swagger documentation


Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Built a lazy, seeded in-memory catalog (2000 profiles) and a Fuse.js search layer, then wired `GET /api/profiles` to validate params, slice deterministically, and return consistent JSON errors. Catalog lives in `server/utils/profile-catalog.ts`, search in `server/utils/profile-search.ts`, endpoint in `server/api/profiles.get.ts`, tests in `test/profiles-api.test.ts`. Added `fuse.js` to `package.json` and updated `pnpm-lock.yaml`.

- Catalog approach: `PROFILE_CATALOG_SIZE = 2000`, fixed seed per index, unique `profile-{n}` IDs, validated once at generation, cached for server lifecycle to avoid regen and per-request revalidation.
- Search behavior: when `q` is present, Fuse.js fuzzy matches across `name`, `email`, `phone`, `company`, `jobTitle`, `address` and returns up to `count`; when `q` is missing/blank, returns deterministic slice of the catalog. Nonsense queries return zero or few matches.
- Error handling: invalid `count` or `q` returns `{ error: { code, message } }` with 400; unexpected catalog errors return 500 without stack traces.

Tests run:
- `pnpm test -- profiles-api.test.ts`

Coverage highlights:
- Catalog init + caching, default behavior (count=10), deterministic results, fuzzy search match, nonsense query, custom count, invalid params, schema compliance.

Ticket complete and ready for Swagger documentation.

---

**User**

1. @server/api/profiles.get.ts:19-21 Why are we checking if count is an array? Similarly in parseQuery.

---

**Cursor**

Because `getQuery()` can return arrays when the same param is repeated (`?count=1&count=2` or `?q=a&q=b`). We treat that as invalid to avoid ambiguous input; same logic for `q`.

---

**User**

can we simplify the validation logic? both parseCound and parseQuery duplicate the first two if statements

---

**Cursor**

Yes. I added a shared `normalizeQueryValue()` to centralize the `undefined` and array handling, and both parsers now consume it. This keeps the exact behavior but removes the duplicate checks in `parseCount` and `parseQuery`.

If you want this helper in a shared utils file instead, I can move it.

---

**User**

We should throw a separate error when the same param is repeated. currently it will throw invalid param.

---

**Cursor**

Done. I added explicit repeated-param checks with dedicated error codes and updated tests to match.

- Repeated `count` now returns `REPEATED_COUNT_PARAM`
- Repeated `q` now returns `REPEATED_QUERY_PARAM`

Want me to run tests?

---

**User**

let's move the validation to a separate util for reusability

---

**Cursor**

Moved validation into reusable util.

- New helper: `server/utils/profile-query-validation.ts`
- Handler now uses `parseCountParam` + `parseQueryParam`

Want tests run?

---

**User**

additionally move the buildErrorResponse

---

**Cursor**

Done. `buildErrorResponse` now lives in `server/utils/profile-query-validation.ts` and the handler imports it. Want tests run?

---

**User**

@/home/donirk/.cursor/projects/home-donirk-Code-random-profiles/terminals/1.txt:29-57 Analyze the failing unit tests in @test/profiles-api.test.ts and associated @server/api/profiles.get.ts 

---

**Cursor**

Failure cause: `event.res.status` is `undefined` on success because the handler never explicitly sets a 200. h3 leaves status unset when you just return data. So the updated assertions in `test/profiles-api.test.ts` now read `undefined` instead of `200`.

Two fixes:
- **Preferred (test-side):** use `getResponseStatus(event)` (it returns 200 even when not explicitly set).  
- **Alternative (handler-side):** call `setResponseStatus(event, 200)` before returning profiles so `event.res.status` is always set.

Right now the test changed to `event.res.status`, so either revert to `getResponseStatus` or set status in `server/api/profiles.get.ts`.

---

**User**

getResponseStatus(event) is depreciated

---

**Cursor**

Set explicit success status. `server/api/profiles.get.ts` now calls `setResponseStatus(event, 200)` before returning profiles, so `event.res.status` is defined and tests pass without deprecated `getResponseStatus`.

---

**User**

setResponseStatus is also depraciated — Please directly set event.res.status and event.res.statusText


---

**Cursor**

Done. Swapped `setResponseStatus` for direct `event.res.status` and `event.res.statusText` via a small `setStatus` helper in `server/api/profiles.get.ts`. Want tests run?

---

**User**

calling http://localhost:3000/api/profiles returns a 500 error invalid url on @server/api/profiles.get.ts:22-23 . Analyze this error and suggest a solution

---

**Cursor**

Cause: `getQuery(event)` calls `new URL(event.req.url)` internally. In Nuxt dev, `event.req.url` is a **relative** path (`/api/profiles`), so `new URL()` throws `Invalid URL`, which maps to line 22.

Fix: build query params with a base URL so relative paths are valid. I replaced `getQuery` with a local helper that does `new URL(event.req.url, "http://localhost")` and preserves repeated params as arrays. This avoids the invalid URL error and keeps your repeated-param validation working.

If you want me to run the tests or hit the endpoint locally, say the word.

---

**User**

getQueryParams could potentialy use the validations we've made earlier. refactor the entire @server/api/profiles.get.ts  to handle the validation in a unified way

---

**Cursor**

Refactored to unify validation in `server/api/profiles.get.ts`.

- `getQueryParams` only parses raw params (no validation)
- new `validateQueryParams` uses `parseCountParam` + `parseQueryParam` and returns a single validation result
- handler now uses the unified validation result and pulls `count/query` from it

If you want this validation result type exported from the util instead, I can move it.

