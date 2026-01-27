# Search page redesign specifications
_Exported on 1/27/2026 at 22:15:39 GMT+1 from Cursor (2.4.21)_

---

**User**

Redesign the Search page. If the following
┌─────────────────────────────────────────────────────────────┐
│                   Page Container (max-w-7xl)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Header Section (mb-8)                    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Title Row (flex justify-between)               │  │  │
│  │  │  ├─ "Search Profiles" (left)                    │  │  │
│  │  │  └─ "Browse All →" link (right)                 │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Search Bar (relative container)                │  │  │
│  │  │  ├─ Search icon (absolute left)                 │  │  │
│  │  │  ├─ Input field (full width)                    │  │  │
│  │  │  └─ Clear button (absolute right, conditional)  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Results Bar (flex justify-between)             │  │  │
│  │  │  ├─ Results count (left)                        │  │  │
│  │  │                                                 │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  (List)     │  │
│  │  │   Card 1 Wide   │  │   Card 2 Wide   │             │  │
│  │  └─────────────────┘  └─────────────────┘             │  │
│  │  ┌─────────────────┐  ┌─────────────────┐             │  │
│  │  │   Card 3 Wide   │  │   Card 4 Wide   │             │  │
│  │  └─────────────────┘  └─────────────────┘             │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Empty State (conditional, centered)           │  │
│  │  ┌───────────────────────────────────────────────┐    │  │
│  │  │  Search icon (large, centered)                │    │  │
│  │  │  "No profiles found" heading                  │    │  │
│  │  │  "Try adjusting your search query" text       │    │  │
│  │  └───────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

Redesign the profile page using the above layout structure.

Component Breakdown
1. Page Container

    Classes: min-h-screen bg-gradient-to-tr from-black via-black to-purple-900
    Inner Container: max-w-7xl mx-auto px-6 py-12

2. Header Section (mb-8)
A. Title Row (mb-6)

    Container: flex items-center justify-between mb-6

    Left: Page Title
        Text: "Search Profiles"
        Classes: text-white text-3xl

    Right: Browse Link
        Text: "Browse All →"
        Classes: text-zinc-400 hover:text-white transition-colors text-sm
        Action: Navigate to /

B. Search Bar (mb-6)

    Container: relative mb-6

    Search Icon (absolute positioned)
        Classes: absolute left-4 top-1/2 -translate-y-1/2
        Icon: Search (lucide-react)
        Icon classes: w-5 h-5 text-zinc-500

    Input Field
        Classes: w-full h-14 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 pl-12 pr-12 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors
        Placeholder: "Search by name, role, company, or bio..."
        Auto-focus: Yes
        Height: 56px (h-14)
        Padding: Left 48px (pl-12), Right 48px (pr-12)

    Clear Button (conditional, absolute positioned)
        Renders only when searchQuery exists
        Classes: absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors
        Icon: X (lucide-react)
        Icon classes: w-5 h-5

C. Results Info Bar

    Container: flex items-center justify-between

    Left: Results Count
        Classes: text-zinc-400
        Dynamic text:
            With search: "X results found" (with purple-400 number)
            Without search: "Showing 10 profiles" (with purple-400 number)
            Shows "(showing first 10)" when results === 10

3. Results Section
A. Results Grid (Conditional - When results exist)

List View Mode

    Container classes: grid gap-6 grid-cols-1 md:grid-cols-2
    Responsive:
        Mobile: 1 column
        Medium (768px+): 2 columns

B. Profile Card

    Container: reuse styling from @app/components/profile-card.vue 
    Container: flex gap-4 items-start
    Avatar container: flex-shrink-0
    Avatar: w-16 h-16 
    Content wrapper: flex-1 min-w-0
    Name: text-white text-lg
    Job info: text-purple-400 text-sm mb-2 (job title + company)
    Bio: text-zinc-400 text-sm

Search Highlighting

    Matched text wrapped in <mark> tag
    Classes: bg-purple-600/30 text-purple-300

s: text-zinc-500

Design Tokens
Colors - keep consistens with previous pages and components

Spacing

    Container padding: px-6 py-12
    Section gap: mb-8
    Element gaps: mb-6, mb-4, mb-2
    Grid gaps: gap-6, gap-4, gap-2

Responsive Breakpoints

    Small: < 768px (mobile)
    Medium: 768px+ (md:)
    Large: 1024px+ (lg:)

Functional Features
    Results limit: Maximum 10 profiles displayed
    Auto-focus: Search input focuses on page load
    Clear search: X button appears when query exists
    Reuse the empty search query to display a message when there's no query searched

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Search page now matches the new layout: gradient container, custom header/search bar, results info bar, list-style cards with match highlighting, and updated empty/error/loading states, all wired to the existing query + results logic. Tests updated to assert the new card `data-testid`.  

Tests not run (not requested). If you want: `npm test` or `npx vitest run test/nuxt/search-page.test.ts`.

---

**User**

1. move the search input to separate file.
2. Remove browser all -> button and instead add @app/components/back-button.vue above search profiles. space it above search profiels header with 32 px

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Search input extracted into new `search-input` component, and the search page header now uses `BackButton` above the title with `mb-8` spacing and no “Browse All” link. Wiring stays the same via v-model + input/clear events, and tests now include a back button click check.

Tests not run (not requested). If you want: `npx vitest run test/nuxt/search-page.test.ts`.

---

**User**

Move the profile card from @app/pages/search.vue  to a separate component

---

**Cursor**

Moved the search result card into `app/components/search-profile-card.vue` and wired `search.vue` to render it, passing `profile` + `query` and emitting `select` to keep the store sync.

Tests not run (not requested). If you want: `npx vitest run test/nuxt/search-page.test.ts`.

---

**User**

update tests @/home/donirk/.cursor/projects/home-donirk-Code-random-profiles/terminals/1.txt:94-277 

---

**Cursor**

Updated tests to match current UI/behavior and fix the router mock:

- `index-page.test.ts`: count 8 + query undefined, skeleton count 8, CTA link assertion.
- `search-page.test.ts`: add `router.resolve` to the mocked router so NuxtLink renders in tests.

Re-run: `npx vitest run test/nuxt/index-page.test.ts test/nuxt/search-page.test.ts`.

