# PotHub 🌿

**Premium Plant Pots & Indoor Gardening E-Commerce**

A fully functional, production-ready multi-page eCommerce website built with vanilla HTML, CSS, and JavaScript. Inspired by the immersive shopping experience and bold visual design of Nike's online store.

![PotHub Preview](https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80)

## 🚀 Live Demo

Deploy to **GitHub Pages** or any static hosting service (Netlify, Vercel, Surge, etc.)

## ✨ Features

### Core Shopping Experience
- ✅ **Functional Add-to-Cart** with quantity controls
- ✅ **Cart Persistence** via LocalStorage
- ✅ **Wishlist System** with heart toggle on every product
- ✅ **Dynamic Product Rendering** from JSON catalog
- ✅ **Product Filtering** by category & collection
- ✅ **Product Search** with real-time overlay
- ✅ **Sorting** (Price, Rating, Newest, Featured)
- ✅ **Quick View** buttons on product cards
- ✅ **Cart Drawer** slides in from right
- ✅ **Cart Page** with full order summary

### Pages (15 Total)
| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, collections, bestsellers, testimonials |
| Shop | `shop.html` | Full product grid with filters & sorting |
| Product | `product.html` | Gallery, variants, tabs, related products |
| Collections | `collections.html` | Curated collection browsing |
| Cart | `cart.html` | Full cart management |
| Checkout | `checkout.html` | Multi-step checkout form |
| About | `about.html` | Brand story, stats, sustainability |
| Contact | `contact.html` | Form + contact info |
| FAQ | `faq.html` | Accordion FAQ sections |
| Blog | `blog.html` | Article grid |
| Login | `login.html` | Authentication UI |
| Register | `register.html` | Account creation |
| Account | `account.html` | Dashboard, orders, recently viewed |
| Wishlist | `wishlist.html` | Saved items page |

### Premium UX Features
- 🎨 **Dark Mode Toggle** — persists across sessions
- 🔍 **Search Overlay** — find products instantly
- 📱 **Mobile-First Responsive** — works on all devices
- ✨ **Scroll Reveal Animations** — IntersectionObserver powered
- 🛒 **Sticky Navbar** — with scroll-aware styling
- 🔔 **Toast Notifications** — for cart/wishlist actions
- 💀 **Skeleton Loaders** — while products fetch
- ⬆️ **Back to Top** button
- 💬 **Floating Chat Widget** UI
- 🖼️ **Instagram Gallery** grid
- 📰 **Newsletter Signup** section

### Technical Highlights
- **Zero Dependencies** — Pure vanilla JS, no frameworks
- **Modular Architecture** — `PotHub.*` namespace pattern
- **LocalStorage State** — Cart, Wishlist, Auth, Theme, Recent Views
- **SEO Ready** — Semantic HTML, meta tags, proper headings
- **Accessible** — ARIA labels, keyboard navigation, focus states
- **Performance** — Lazy loading images, passive event listeners

## 📁 Project Structure

```
pothub/
├── index.html              # Homepage
├── shop.html               # Product listing
├── product.html            # Product detail
├── collections.html        # Collection browsing
├── cart.html               # Shopping cart
├── checkout.html           # Checkout flow
├── about.html              # Brand story
├── contact.html            # Contact form
├── faq.html                # FAQ accordion
├── blog.html               # Blog grid
├── login.html              # Sign in
├── register.html           # Sign up
├── account.html            # User dashboard
├── wishlist.html           # Saved items
├── css/
│   ├── style.css           # Core design system
│   ├── animations.css      # Scroll reveals & keyframes
│   └── responsive.css      # Mobile breakpoints
├── js/
│   ├── app.js              # Core app, navbar, search, theme
│   ├── products.js         # Product data & card rendering
│   ├── cart.js             # Cart logic & LocalStorage
│   ├── wishlist.js         # Wishlist logic
│   ├── auth.js             # Login/register simulation
│   ├── checkout.js         # Checkout form & summary
│   └── animations.js       # IntersectionObserver effects
├── data/
│   └── products.json       # 15 realistic products
└── components/
    ├── navbar.html         # Shared navigation
    └── footer.html         # Shared footer
```

## 🛠️ Deployment

### GitHub Pages (Recommended)

1. **Create a new repository** on GitHub
2. **Upload all files** to the repo (drag & drop or push via git)
3. Go to **Settings → Pages**
4. Select **Deploy from a branch** → **main branch** → **/(root)**
5. Your site will be live at `https://yourusername.github.io/pothub/`

### Netlify Drop
1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag and drop the entire `pothub/` folder
3. Instant live URL

### Local Development
Simply open `index.html` in any modern browser. No build step or server required.

For CORS-free component loading locally, you can use any static server:
```bash
# Python 3
python -m http.server 8000

# Node.js (if you have npx)
npx serve .

# PHP
php -S localhost:8000
```

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--color-black` | `#111111` | Primary text, buttons |
| `--color-green` | `#2D6A4F` | Accents, hover states |
| `--color-beige` | `#F5F1E8` | Warm backgrounds |
| `--color-terracotta` | `#C97C5D` | CTAs, badges |
| `--font-primary` | Inter | Body text |
| `--font-display` | Poppins | Headings |
| `--font-accent` | Montserrat | Labels, uppercase |

## 🧪 Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari & Chrome

## 📄 License

MIT License — free for personal and commercial use.

---

**Built with care for plant lovers everywhere.** 🌱
