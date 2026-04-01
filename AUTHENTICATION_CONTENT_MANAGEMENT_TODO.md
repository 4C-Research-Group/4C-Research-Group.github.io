# 4C Research Website Authentication & Content Management TODO

## Overview
Implement user authentication (signin/signup) with Supabase integration and create an admin content management system to make the website fully autonomous, similar to the 4c-research-group implementation.

## Phase 1: Supabase Setup & Dependencies

### 1.1 Install Required Dependencies
- [ ] Install Supabase client libraries: `@supabase/auth-helpers-nextjs`, `@supabase/ssr`, `@supabase/supabase-js`
- [ ] Install form handling: `react-hook-form`, `@hookform/resolvers`, `zod`
- [ ] Install UI components: `@radix-ui/react-*` components (dialog, label, button, etc.)
- [ ] Install additional utilities: `sonner` (toasts), `clsx`, `tailwind-merge`

### 1.2 Environment Configuration
- [ ] Create `.env.local` file with Supabase configuration
- [ ] Add NEXT_PUBLIC_SUPABASE_URL
- [ ] Add NEXT_PUBLIC_SUPABASE_KEY
- [ ] Add SUPABASE_SERVICE_KEY (for admin operations)

### 1.3 Supabase Client Setup
- [ ] Create `lib/supabase/client.ts` (browser client)
- [ ] Create `lib/supabase/server.ts` (server client)
- [ ] Create `lib/supabase/database.types.ts` (type definitions)
- [ ] Create `lib/supabase/middleware.ts` (auth middleware)

## Phase 2: Authentication System

### 2.1 Authentication Pages
- [ ] Create `app/login/page.tsx` (login page)
- [ ] Create `app/signup/page.tsx` (signup page)
- [ ] Create `components/auth/auth-form.tsx` (shared auth component)
- [ ] Create `app/api/auth/callback/route.ts` (auth callback handler)

### 2.2 User Management
- [ ] Create users table in Supabase with roles (admin/user)
- [ ] Implement user registration with automatic user record creation
- [ ] Implement role-based redirects (admin → admin, user → dashboard/home)
- [ ] Add session management and middleware protection

### 2.3 Authentication Components
- [ ] Create auth form component with login/signup toggle
- [ ] Add password visibility toggles
- [ ] Add form validation with react-hook-form + zod
- [ ] Add loading states and error handling
- [ ] Add session checking on component mount

## Phase 3: Content Management System

### 3.1 Database Schema Design
- [ ] Create content tables for:
  - [ ] `home_page` (hero section, features, announcements)
  - [ ] `about_page` (about content, team info)
  - [ ] `projects` (research projects, descriptions)
  - [ ] `blog_posts` (blog content, metadata)
  - [ ] `contact_page` (contact info, form settings)
  - [ ] `navigation` (menu items, links)

### 3.2 Admin Interface
- [ ] Create `app/admin/layout.tsx` (admin layout with navigation)
- [ ] Create `app/admin/page.tsx` (admin dashboard)
- [ ] Create content editing pages:
  - [ ] `app/admin/edit-home/page.tsx`
  - [ ] `app/admin/edit-about/page.tsx`
  - [ ] `app/admin/projects/page.tsx`
  - [ ] `app/admin/blog/page.tsx`
  - [ ] `app/admin/contact/page.tsx`

### 3.3 Content Editor Components
- [ ] Create rich text editor component (react-quill or similar)
- [ ] Create image upload component with Supabase storage
- [ ] Create form components for different content types
- [ ] Add preview functionality for content changes
- [ ] Add draft/published status management

## Phase 4: Website Integration

### 4.1 Content Fetching
- [ ] Create `lib/supabase/content.ts` (content fetching functions)
- [ ] Update existing pages to fetch content from Supabase:
  - [ ] Update home page to use dynamic content
  - [ ] Update about page to use dynamic content
  - [ ] Update projects page to use dynamic content
  - [ ] Update contact page to use dynamic content

### 4.2 Static Content Migration
- [ ] Identify all static content in current website
- [ ] Create migration scripts to move content to Supabase
- [ ] Update component props to use dynamic data
- [ ] Add loading states and error handling for content

### 4.3 Navigation & Routing
- [ ] Create protected routes for admin pages
- [ ] Add authentication middleware
- [ ] Update navigation to show admin links only for authenticated users
- [ ] Add logout functionality

## Phase 5: Admin Features

### 5.1 User Management
- [ ] Create `app/admin/users/page.tsx` (user management)
- [ ] Add ability to view all users
- [ ] Add ability to change user roles
- [ ] Add ability to delete/disable users

### 5.2 Content Management
- [ ] Create CRUD operations for all content types
- [ ] Add content versioning/history
- [ ] Add bulk content operations
- [ ] Add content search and filtering

### 5.3 Site Settings
- [ ] Create `app/admin/settings/page.tsx` (site settings)
- [ ] Add site configuration options
- [ ] Add theme customization
- [ ] Add SEO settings management

## Phase 6: Testing & Deployment

### 6.1 Testing
- [ ] Test authentication flow (login/signup/logout)
- [ ] Test role-based access control
- [ ] Test content creation and editing
- [ ] Test content display on public pages
- [ ] Test admin panel functionality

### 6.2 Performance & Security
- [ ] Implement proper caching strategies
- [ ] Add rate limiting for auth endpoints
- [ ] Add CSRF protection
- [ ] Optimize image loading and storage

### 6.3 Deployment Preparation
- [ ] Update environment variables for production
- [ ] Test Supabase connection in production
- [ ] Set up proper CORS configuration
- [ ] Create deployment documentation

## Technical Requirements

### Dependencies to Add
```json
{
  "@supabase/auth-helpers-nextjs": "^0.10.0",
  "@supabase/ssr": "^0.6.1",
  "@supabase/supabase-js": "^2.74.0",
  "@hookform/resolvers": "^4.1.0",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-toast": "^1.1.5",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "react-hook-form": "^7.58.1",
  "zod": "^3.24.2",
  "sonner": "^2.0.5",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "react-quill": "^2.0.0"
}
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## Notes
- Follow the existing 4c-research-group implementation patterns
- Maintain consistent styling with the current website design
- Ensure responsive design for all admin components
- Add proper error handling and loading states
- Implement proper TypeScript types throughout
- Use the existing color scheme (cognition, consciousness, care themes)
