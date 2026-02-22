# Ecommerce UI Instructions for Storefront

This document defines the design system, UI patterns, and implementation rules for the storefront domain of the Sanaeva Store ecommerce application.

## Design Direction

### Visual Identity
- **Primary Theme**: Modern pastel pink ecommerce aesthetic
- **Color Palette**: Soft, approachable pastels with pink as the hero color
- **Typography**: Clean, readable sans-serif fonts (Geist Sans)
- **Mood**: Friendly, elegant, trustworthy, and modern

### Design Principles
1. **Mobile-first**: Design and implement for mobile screens first
2. **Progressive Enhancement**: Add tablet and desktop enhancements
3. **Accessibility**: WCAG 2.1 AA compliance minimum
4. **Performance**: Optimize for fast load times and smooth interactions
5. **Consistency**: Use shared design tokens and semantic tokens

## Responsive Design Strategy

### Mobile-First Approach (Required)
- **Base styles**: Target mobile screens (320px - 639px)
- **Default breakpoint**: No breakpoint prefix = mobile
- **Touch targets**: Minimum 44x44px for interactive elements
- **Font sizes**: Slightly larger for readability on small screens
- **Spacing**: Generous padding for thumb-friendly interactions

### Tablet-First Enhancement
- **Breakpoint**: `md:` (768px+)
- **Layout**: Transition from single-column to multi-column
- **Navigation**: Expand from hamburger to horizontal nav
- **Cards**: Display 2-3 items per row instead of 1
- **Images**: Larger hero images and product photos

### Desktop Enhancement
- **Breakpoint**: `lg:` (1024px+) and `xl:` (1280px+)
- **Layout**: Full multi-column layouts with sidebars
- **Navigation**: Full horizontal navigation with dropdowns
- **Cards**: Display 3-4+ items per row
- **Max width**: Container constraints (max-w-7xl) for readability

### Breakpoint Usage Rules
```tsx
// ✅ CORRECT: Mobile-first progression
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>
</div>

// ❌ WRONG: Desktop-first (avoid this)
<div className="p-8 md:p-6 sm:p-4">
```

## Animation & Motion

### Framer Motion Usage Rules

#### When to Use Framer Motion
- **Page transitions**: Smooth navigation between routes
- **Product cards**: Hover effects, scale, and reveal animations
- **Modal/Dialog**: Enter/exit animations
- **Image galleries**: Carousel transitions and zoom effects
- **Shopping cart**: Add-to-cart animations
- **Interactive elements**: Buttons, dropdowns with micro-interactions

#### Performance Guidelines
```tsx
// ✅ CORRECT: Use layout animations for smooth transitions
<motion.div layout layoutId="product-card">

// ✅ CORRECT: Optimize with will-change
<motion.div
  whileHover={{ scale: 1.05 }}
  style={{ willChange: 'transform' }}
>

// ❌ WRONG: Animating expensive properties
<motion.div animate={{ width: '100%', height: '500px' }}>
```

#### Animation Presets (from design-tokens.ts)
```tsx
import { animations } from '@/shared/config/design-tokens';

// Fade in
<motion.div {...animations.fadeIn}>

// Slide up
<motion.div {...animations.slideUp}>

// Slide down
<motion.div {...animations.slideDown}>
```

#### Custom Animation Patterns
```tsx
// Product card hover
const productCardVariants = {
  initial: { scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  hover: { 
    scale: 1.02, 
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    transition: { duration: 0.25 }
  }
};

// Stagger children animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### embla-carousel-react Usage Rules

#### When to Use Embla Carousel
- **Product image galleries**: Multiple product photos
- **Featured products**: Homepage hero carousels
- **Category showcases**: Scrollable category cards
- **Testimonials**: Customer review carousels
- **Related products**: Horizontal scrolling product lists

#### Implementation Pattern
```tsx
'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

export function ProductCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0">
              <Image src={src} alt={`Product ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <button onClick={scrollPrev}>Previous</button>
      <button onClick={scrollNext}>Next</button>
    </div>
  );
}
```

#### Mobile-First Carousel Configuration
```tsx
// Mobile: Show 1 item
// Tablet: Show 2-3 items
// Desktop: Show 4+ items
const [emblaRef] = useEmblaCarousel({
  align: 'start',
  slidesToScroll: 1,
  breakpoints: {
    '(min-width: 768px)': { slidesToScroll: 2 },
    '(min-width: 1024px)': { slidesToScroll: 3 }
  }
});
```

## Image Handling

### next/image Configuration

#### Approved Mockup Domains
Use placeholder images from these approved domains (configured in `next.config.ts`):
- `images.unsplash.com` - High-quality product photos
- `picsum.photos` - Random placeholder images
- `via.placeholder.com` - Simple placeholder generation
- `placehold.co` - Customizable placeholders
- `dummyimage.com` - Text-based placeholders

#### Image Component Rules
```tsx
import Image from 'next/image';

// ✅ CORRECT: Always include alt text and dimensions
<Image
  src="https://images.unsplash.com/photo-product"
  alt="Pink cotton t-shirt with floral pattern"
  width={600}
  height={800}
  className="object-cover"
  priority={false}
/>

// ✅ CORRECT: Use fill for responsive containers
<div className="relative aspect-square w-full">
  <Image
    src="https://images.unsplash.com/photo-product"
    alt="Product image"
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>

// ❌ WRONG: Missing alt text
<Image src="/product.jpg" width={600} height={800} />

// ❌ WRONG: No dimensions or fill
<Image src="/product.jpg" alt="Product" />
```

#### Fallback Strategy
```tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      onError={() => {
        setImgSrc('https://placehold.co/600x800/FFE4E6/DB2777?text=No+Image');
      }}
    />
  );
}
```

#### Optimization Settings
```tsx
// Product thumbnails
<Image
  src={src}
  alt={alt}
  width={300}
  height={400}
  quality={75}
  loading="lazy"
/>

// Hero images
<Image
  src={src}
  alt={alt}
  width={1920}
  height={1080}
  quality={90}
  priority
/>
```

## Design Token Architecture

### Shared Foundation Tokens
Located in `shared/config/design-tokens.ts`:
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, 2xl, 3xl)
- **Typography**: Font sizes and line heights
- **Border Radius**: Corner rounding values
- **Motion**: Animation durations (fast, base, slow, slower)
- **Z-index**: Layering system
- **Breakpoints**: Responsive breakpoint values

### Domain-Specific Semantic Tokens

#### Storefront Domain Tokens
CSS variables scoped to `[data-theme-domain="storefront"]`:
```css
/* Storefront-specific colors */
--storefront-primary: #FFB6C1;        /* Pastel pink */
--storefront-primary-hover: #FF69B4;  /* Hot pink */
--storefront-accent: #FFC0CB;         /* Light pink */
--storefront-background: #FFF5F7;     /* Very light pink */
--storefront-text: #2D3748;           /* Dark gray */
--storefront-border: #FFE4E6;         /* Pink border */

/* Product card specific */
--storefront-card-bg: #FFFFFF;
--storefront-card-shadow: 0 2px 8px rgba(255, 105, 180, 0.1);
--storefront-card-hover-shadow: 0 8px 24px rgba(255, 105, 180, 0.2);

/* Button variants */
--storefront-button-primary-bg: var(--storefront-primary);
--storefront-button-primary-text: #FFFFFF;
--storefront-button-secondary-bg: transparent;
--storefront-button-secondary-border: var(--storefront-primary);
```

#### Backoffice Domain Tokens
CSS variables scoped to `[data-theme-domain="backoffice"]`:
```css
/* Admin-specific colors */
--backoffice-primary: #4F46E5;        /* Indigo */
--backoffice-background: #F9FAFB;     /* Light gray */
--backoffice-sidebar-bg: #1F2937;     /* Dark gray */
--backoffice-text: #111827;           /* Almost black */
```

### Token Usage in Components
```tsx
// ✅ CORRECT: Use semantic tokens
<div className="bg-[var(--storefront-background)] text-[var(--storefront-text)]">

// ✅ CORRECT: Use Tailwind with custom colors
<button className="bg-storefront-primary hover:bg-storefront-primary-hover">

// ❌ WRONG: Hardcoded colors
<div className="bg-pink-200 text-gray-800">
```

## Page-Specific Guidance

### app/[locale]/(storefront)/page.tsx (Homepage)

#### Layout Structure
```tsx
export default function StorefrontHomePage() {
  return (
    <>
      {/* Hero Section - Full width, pastel pink gradient */}
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gradient-to-br from-pink-50 to-pink-100">
        <HeroCarousel />
      </section>

      {/* Featured Categories - Grid layout */}
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Category cards */}
        </div>
      </section>

      {/* Featured Products - Carousel */}
      <section className="bg-pink-50 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
            Trending Now
          </h2>
          <ProductCarousel products={featuredProducts} />
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container mx-auto px-4 py-12">
        <PromotionalBanner />
      </section>
    </>
  );
}
```

#### Key Components
- **HeroCarousel**: embla-carousel-react with auto-play
- **CategoryCard**: Framer Motion hover effects
- **ProductCarousel**: Horizontal scrolling product grid
- **PromotionalBanner**: Call-to-action with next/image

### app/[locale]/(storefront)/products/page.tsx (Product Listing)

#### Layout Structure
```tsx
export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Mobile: Drawer, Desktop: Sidebar */}
        <aside className="lg:w-64">
          <ProductFilters />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {count} products
            </p>
            <ProductSort />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination className="mt-8" />
        </main>
      </div>
    </div>
  );
}
```

#### Key Features
- **Responsive grid**: 1 col mobile → 2 col tablet → 3-4 col desktop
- **Filter drawer**: Mobile sheet, desktop sidebar
- **Product cards**: Framer Motion hover with scale effect
- **Lazy loading**: Intersection Observer for infinite scroll (optional)

### app/[locale]/(storefront)/products/[id]/page.tsx (Product Detail)

#### Layout Structure
```tsx
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images - Left side */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <ProductImageGallery images={product.images} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {/* Thumbnail navigation */}
          </div>
        </div>

        {/* Product Info - Right side */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {product.name}
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-storefront-primary">
              ${product.price}
            </p>
          </div>

          <ProductVariantSelector variants={product.variants} />
          
          <AddToCartButton productId={product.id} />

          <ProductDescription description={product.description} />

          <ProductReviews reviews={product.reviews} />
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <ProductCarousel products={relatedProducts} />
      </section>
    </div>
  );
}
```

#### Key Components
- **ProductImageGallery**: embla-carousel-react with zoom on click
- **ProductVariantSelector**: Size/color selection with visual feedback
- **AddToCartButton**: Framer Motion animation on add
- **ProductReviews**: Star ratings with expandable reviews

### app/[locale]/(storefront)/layout.tsx (Storefront Layout)

#### Implementation
```tsx
import type { PropsWithChildren } from "react";
import { StorefrontHeader } from "@/components/components-design/storefront/storefront-header";
import { StorefrontFooter } from "@/components/components-design/storefront/storefront-footer";

export default function StorefrontLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col" data-theme-domain="storefront">
      <StorefrontHeader />
      <main className="flex-1">{children}</main>
      <StorefrontFooter />
    </div>
  );
}
```

#### Key Requirements
- **data-theme-domain="storefront"**: Applies storefront CSS variables
- **Sticky header**: Position sticky on scroll (mobile-first)
- **Footer**: Always at bottom with flex-1 on main
- **Consistent spacing**: Use container classes

### components/components-design/storefront/storefront-header.tsx

#### Mobile-First Header
```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function StorefrontHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <MobileNav onClose={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Sanaeva Store"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/products" className="text-sm font-medium hover:text-storefront-primary">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-storefront-primary">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-storefront-primary">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-storefront-primary text-xs text-white">
                3
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

#### Key Features
- **Sticky positioning**: Stays at top on scroll
- **Backdrop blur**: Modern glassmorphism effect
- **Mobile menu**: Sheet component from shadcn/ui
- **Cart badge**: Animated count indicator
- **Search**: Modal or dropdown search (implement as needed)

## Component Patterns

### Product Card
```tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.badge && (
            <span className="absolute left-2 top-2 rounded-full bg-storefront-primary px-3 py-1 text-xs font-semibold text-white">
              {product.badge}
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="mb-1 font-semibold line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product.category}
          </p>
          <p className="mt-2 text-lg font-bold text-storefront-primary">
            ${product.price}
          </p>
        </div>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Heart className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}
```

## Accessibility Requirements

### ARIA Labels
- All interactive elements must have accessible names
- Use `aria-label` for icon-only buttons
- Provide `aria-describedby` for form inputs with hints

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Implement focus visible styles
- Maintain logical tab order

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18px+)
- Test with tools like axe DevTools

### Screen Reader Support
- Use semantic HTML elements
- Provide alt text for all images
- Announce dynamic content changes with `aria-live`

## Performance Checklist

- [ ] Use `next/image` for all images with proper dimensions
- [ ] Implement lazy loading for below-fold content
- [ ] Use `loading="lazy"` for images not in viewport
- [ ] Optimize Framer Motion animations (transform/opacity only)
- [ ] Use `will-change` sparingly for animated elements
- [ ] Implement code splitting for heavy components
- [ ] Use React.lazy() for route-level code splitting
- [ ] Minimize bundle size with tree-shaking
- [ ] Use embla-carousel-react efficiently (avoid re-renders)
- [ ] Implement proper error boundaries

## Testing Requirements

### Visual Testing
- Test on mobile (375px), tablet (768px), desktop (1280px)
- Test on iOS Safari and Android Chrome
- Verify touch interactions on mobile devices

### Functionality Testing
- Cart add/remove operations
- Product filtering and sorting
- Image gallery navigation
- Form validation and submission
- Search functionality

### Performance Testing
- Lighthouse score > 90 for mobile
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

## Common Pitfalls to Avoid

1. **Don't hardcode colors**: Always use design tokens or Tailwind classes
2. **Don't skip alt text**: Every image needs descriptive alt text
3. **Don't animate expensive properties**: Stick to transform and opacity
4. **Don't forget mobile**: Always test mobile-first
5. **Don't use inline styles**: Use Tailwind or CSS modules
6. **Don't skip loading states**: Show skeletons or spinners
7. **Don't ignore errors**: Implement proper error boundaries
8. **Don't over-animate**: Respect prefers-reduced-motion

## Resources

- Design Tokens: `shared/config/design-tokens.ts`
- Global Styles: `styles/globals.css`
- shadcn/ui Components: `components/ui/`
- Framer Motion Docs: https://www.framer.com/motion/
- embla-carousel Docs: https://www.embla-carousel.com/
- Next.js Image Docs: https://nextjs.org/docs/app/api-reference/components/image
