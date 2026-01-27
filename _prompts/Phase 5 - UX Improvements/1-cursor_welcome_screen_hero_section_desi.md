# Welcome screen hero section design
_Exported on 1/27/2026 at 21:10:21 GMT+1 from Cursor (2.4.21)_

---

**User**

# Welcome Screen Hero Section - Design Specification

## Layout Structure
A centered hero section using CSS Grid and Flexbox, positioned above the profile cards grid. The container uses `max-w-7xl mx-auto px-6 py-12` for consistent page width.

## Hero Section Container
- **Layout**: `text-center mb-16` (centered text, large bottom margin)
- **Background**: Inherits the gradient from parent (`bg-gradient-to-tr from-black via-black to-purple-900`)

## Elements (Top to Bottom)

### 1. Welcome Badge
- **Container**: Inline flex container with rounded pill shape
  - Classes: `inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 rounded-full border border-purple-500/30 mb-6`
  - Background: Semi-transparent purple (20% opacity)
  - Border: Purple with 30% opacity
  - Spacing: 24px bottom margin

- **Icon**: Sparkles icon from lucide-react
  - Classes: `w-4 h-4 text-purple-400`
  - Size: 16x16px
  - Color: Purple-400

- **Text**: "Welcome to our community"
  - Classes: `text-purple-400 text-sm`
  - Color: Purple-400
  - Size: Small (14px)

### 2. Main Heading
- **Text**: "Meet Amazing People"
- **Classes**: `text-5xl md:text-6xl text-white mb-4`
- **Responsive**: 
  - Mobile: text-5xl (48px)
  - Desktop (md+): text-6xl (60px)
- **Color**: White
- **Spacing**: 16px bottom margin

### 3. Description Paragraph
- **Text**: "Discover talented professionals from around the world. Connect, collaborate, and grow together."
- **Classes**: `text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-8`
- **Responsive**:
  - Mobile: text-lg (18px)
  - Desktop (md+): text-xl (20px)
- **Max Width**: 2xl (672px), centered with `mx-auto`
- **Color**: Zinc-400 (muted gray)
- **Spacing**: 32px bottom margin

### 4. Call-to-Action Button
- **Container**: Inline flex button
  - Classes: `inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors shadow-lg shadow-purple-600/20`
  - Background: Solid purple-600, darkens to purple-700 on hover
  - Padding: 24px horizontal, 12px vertical
  - Border radius: Extra large (12px)
  - Shadow: Large purple glow at 20% opacity

- **Icon**: Search icon from lucide-react
  - Classes: `w-5 h-5`
  - Size: 20x20px
  - Color: Inherits white from parent

- **Text**: "Search Profiles"
  - Color: Inherits white from parent
  - No additional classes

## Responsive Behavior
- Text scales up on medium breakpoint (md: 768px+)
- Description paragraph constrains to max-w-2xl and centers on all screens
- All elements remain centered across all viewport sizes

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Hero section is now the home page header, matching the spec with centered layout, badge, heading, description, and CTA link to search. I also swapped the container classes to the specified width/padding and added lucide icons.

Updated: `app/pages/index.vue`

If you want, I can run the Nuxt/Vitest checks next.

---

**User**

limit profiles displayed to 8

---

**Cursor**

Updated home page to show 8 profiles.

