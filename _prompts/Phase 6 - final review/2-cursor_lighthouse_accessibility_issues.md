# Lighthouse accessibility issues
_Exported on 1/28/2026 at 19:56:26 GMT+1 from Cursor (2.4.21)_

---

**User**

Here are the accessibility issues from lighthouse:
1- @app/pages/index.vue  elements are not in a sequentially-descending order
2 - @app/pages/search.vue Touch targets do not have sufficient size or spacing. button.absolute.right-4.top-1/2.-translate-y-1/2.text-zinc-500.transition-colors.hover:text-white and input#profiles-search-input.h-14.w-full.rounded-xl.border.border-zinc-800/50.bg-zinc-900/50.pl-12.pr-12.text-white.placeholder:text-zinc-500.backdrop-blur-sm.transition-colors.focus:border-purple-500/50.focus:outline-none

---

**Cursor**

Perfect! I've successfully fixed both accessibility issues from Lighthouse:

## ✅ **Fixed Issues:**

### 1. **Heading Hierarchy** (`app/pages/index.vue`)
- **Problem**: Elements weren't in sequentially-descending order (h1 → h3, skipping h2)
- **Solution**: Added an `h2` section header with `sr-only` class for the profiles section, creating proper hierarchy: h1 → h2 → h3

### 2. **Touch Target Size** (`app/components/search-input.vue`) 
- **Problem**: Clear button was only 20px × 20px (below 44px minimum)
- **Solution**: Increased touch target to 44px × 44px by adding padding and improved focus accessibility

## **Changes Made:**

1. **`app/pages/index.vue`**: Added `<h2 class="sr-only">Featured Profiles</h2>` to wrap the profiles section
2. **`app/components/search-input.vue`**: Enhanced the clear button with:
   - `p-3` padding (12px on all sides)
   - Adjusted positioning from `right-4` to `right-2`
   - Added focus ring styles for better accessibility

All tests pass and no linter errors were introduced. The fixes maintain the visual design while ensuring WCAG compliance for better accessibility.

