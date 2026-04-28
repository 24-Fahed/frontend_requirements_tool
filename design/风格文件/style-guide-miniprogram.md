# Mini Program UI Style Guide
> Adapted from PeachwoodGrill.com for mobile WeChat Mini Program

---

## 1. Color Palette

### Primary Colors
| Token                | Hex       | Usage                          |
|----------------------|-----------|---------------------------------|
| `--color-bg-primary` | `#000000` | Page background, header, footer |
| `--color-accent`     | `#A3231F` | Active breadcrumb, accent highlights |
| `--color-highlight`  | `#D81B00` | Product count number, emphasis  |

### Text Colors
| Token                | Hex       | Usage                          |
|----------------------|-----------|---------------------------------|
| `--color-text-primary`   | `#FFFFFF` | Nav text, footer text, section titles |
| `--color-text-body`      | `#404040` | Product titles                  |
| `--color-text-secondary` | `#666666` | Breadcrumb "Home", pagination, muted text |
| `--color-text-dark`      | `#333333` | Sidebar category links          |

### UI / Border Colors
| Token                | Hex       | Usage                          |
|----------------------|-----------|---------------------------------|
| `--color-border-light` | `#CCCCCC` | Pagination border              |
| `--color-border`       | `#DDDDDD` | Pagination "next" border       |
| `--color-surface-light`| `#EEEEEE` | Pagination number background   |
| `--color-surface`      | `#FFFFFF` | Pagination "next" background   |
| `--color-link`         | `#609EE9` | Default link color             |

---

## 2. Typography

### Font Families
- **Primary**: `Arial, Helvetica, sans-serif` — Used for nav, product titles, sidebar links, "All Products" heading
- **Secondary**: `Tahoma` — Used for breadcrumb text

### Font Scale (Mobile Adapted)
| Role              | PC Size | Mobile Size | Weight | Line-Height | Family   | Color    |
|-------------------|---------|-------------|--------|-------------|----------|----------|
| Nav link          | 18px    | 16px        | 400    | 48px        | Arial    | #FFFFFF  |
| Section title     | 22px    | 18px        | 700    | 32px        | Arial    | #FFFFFF  |
| Product title     | 18px    | 16px        | 400    | 32px        | Arial    | #404040 |
| Sidebar/Category link | 15px | 14px    | 400    | 40px        | Arial    | #333333 |
| Breadcrumb        | 14px    | 12px        | 400    | 28px        | Tahoma   | #666/#A3231F |
| Pagination        | 12px    | 12px        | 400    | 28px        | Arial    | #666666 |
| Footer text       | inherit | 14px        | 400    | 24px        | inherit  | #FFFFFF  |

---

## 3. Spacing System (Mobile Adapted)

| Context                | PC Spacing       | Mobile Spacing   | Notes                    |
|------------------------|------------------|------------------|--------------------------|
| Nav item padding       | Auto (89px height) | Auto (48px height) | Full-height clickable area |
| Sidebar link padding   | `0 12px`         | `0 16px`         | Horizontal padding only  |
| Product title margin   | `5px 0 0 0`      | `4px 0 0 0`      | Gap between image & title |
| Content container      | `1420px` max     | `100%`           | Full-width mobile layout |
| Section padding        | -                | `16px`           | Content edge spacing     |

### Key Ratios for Mini Program
- Font scale reduced by approximately **10-15%** for mobile
- Line-height reduced proportionally
- Spacing reduced while maintaining visual hierarchy

---

## 4. Component Styles (Mobile Adapted)

### 4.1 Navigation Bar
```
Background:     #000000 (pure black, full-width)
Height:         48px (adapted from 89px)
Nav text:       16px Arial, white, vertically centered
Layout:         Logo left | Nav links | Actions right
```

### 4.2 Breadcrumb
```
Background:     transparent (inherits from section behind)
Text:           12px Tahoma
"Home" link:    #666
Current page:   #A3231F (accent red)
Separator:      icon (arrow character)
Line-height:    28px
```

### 4.3 Category List
```
Section title ("All Products"): 18px bold, white, line-height 32px
Category item:  14px Arial, #333, line-height 40px, padding 0 16px
Container:      scrollable horizontal or drawer
```

### 4.4 Product Card
```
Layout:         image on top, title below
Image:          full-width of card, no border-radius
Title:          16px Arial, #404040, centered, margin-top 4px
Card spacing:   grid gap between cards
```

### 4.5 Pagination
```
Number button:  bg #EEE, border 0.5px solid #CCC, border-radius 3px, 12px Arial #666
"Next" button:  bg #FFF, border 0.5px solid #DDD, border-radius 3px, 12px Arial #666
Line-height:    28px
Active state:   uses accent color
```

### 4.6 Footer
```
Background:     #000000
"Contact" title: 16px bold, white
Separator:      em-dash (—) in white
Contact items:  white text, 14px, line-height 24px
Layout:         left-aligned, compact
```

---

## 5. Shadows & Elevation

**Minimal to no shadows**. The design is flat and industrial:
- No box-shadow on product cards
- No shadow on navigation
- No shadow on sidebar
- Elevation is achieved through **background color contrast** (dark vs light), not shadows

---

## 6. Border Radius

The design is predominantly **sharp-cornered**:
- Product images: **0 radius** (rectangular)
- Navigation: **0 radius**
- Pagination: **3px** (the only rounded element)
- Footer: **0 radius**

This aligns with the industrial/grill aesthetic.

---

## 7. Animations & Transitions

- Dropdown/expand interactions: slide transition
- Overall: **minimal animation**, functional feel
- Transition: `all 0.3s ease` for interactive elements

---

## 8. Opacity & Transparency

- Main background: fully opaque `#000`
- Breadcrumb bar: transparent background
- No semi-transparent overlays
- Clean, solid color blocking throughout

---

## 9. Design Principles Summary

1. **Dark dominant**: 80%+ of the page is black (#000)
2. **High contrast**: White text on black, dark text on light surfaces
3. **Sharp geometry**: Almost zero border-radius — rectangular, industrial feel
4. **Minimal decoration**: No shadows, no gradients, no ornamental borders
5. **Accent color sparingly used**: `#A3231F` (dark red) only for active/selected states
6. **Compact spacing**: Reduced from PC for mobile, maintaining hierarchy
7. **Typography-driven**: Clear hierarchy through size/weight, not color variety

---

## 10. Visual Reference: Color Blocks

```
+-----------------------------------------------+
|  #000000  HEADER (pure black)                  |
|  #FFFFFF  Nav text: 16px                       |
+-----------------------------------------------+
| #000 bg |                                      |
|         |  Product Grid (#FFF surface)         |
| "All    |  +------+ +------+                   |
|  Prods" |  | [img]| | [img]|                   |
| 18px bd |  |title | |title |                   |
|         |  |#4040 | |      |                   |
| ------- |  +------+ +------+                   |
| #333    |  Pagination: #EEE bg, #CCC border   |
| 14px    |  [ 1 ] [ 2 ] [ 3 ] [Next>]          |
|         |         #666 text, 3px radius        |
+-----------------------------------------------+
|  #000000  FOOTER                                |
|  #FFFFFF  "Contact" 16px bold                   |
|  #FFFFFF  Phone / Email / Address               |
+-----------------------------------------------+
```

---

*Adapted from PeachwoodGrill.com for WeChat Mini Program*
*Platform: Mobile WeChat Mini Program*
