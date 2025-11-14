# Shift Log - Server-Side Rendering (SSR) Setup

This document explains the SSR implementation for the Shift Log marketing landing page.

## Overview

The landing page has been configured with Server-Side Rendering (SSR) for better SEO performance and faster initial page loads. This is crucial for marketing purposes as search engines can properly index the content.

## Architecture

### Files Created/Modified

1. **src/entry-server.tsx** - Server-side entry point that renders React to HTML string
2. **src/entry-client.tsx** - Client-side entry point that hydrates the server-rendered HTML
3. **server.js** - Express server that handles SSR in both development and production
4. **index.html** - Updated with SEO meta tags and SSR placeholder
5. **vite.config.ts** - Updated with SSR configuration
6. **package.json** - Added SSR scripts and dependencies

### How It Works

1. **Server-Side**: When a user visits the landing page, the Express server renders the React app to an HTML string using `renderToString()`
2. **Client-Side**: Once the HTML loads, React "hydrates" it, making it interactive
3. **Routing**: Static routing on server (StaticRouter), dynamic routing on client (BrowserRouter)

## Development

### Standard Development (Client-Side Only)
```bash
npm run dev
```
This runs the standard Vite dev server on port 3000 (no SSR).

### Development with SSR
```bash
npm run dev:ssr
```
This runs the Express server with SSR in development mode on port 3000.

## Building for Production

### Standard Build (Client-Side Only)
```bash
npm run build
```

### Build with SSR
```bash
npm run build:ssr
```

This command does two things:
1. Builds the client bundle: `npm run build:client`
2. Builds the server bundle: `npm run build:server`

Output:
- `dist/client/` - Client-side assets (HTML, JS, CSS)
- `dist/server/` - Server-side rendering bundle

## Production

### Preview Production Build
```bash
npm run preview:ssr
```

This runs the Express server in production mode, serving the built files.

### Deployment

For production deployment:

1. Build the SSR bundles:
   ```bash
   npm run build:ssr
   ```

2. Deploy the entire `dist/` folder along with `server.js` and `package.json`

3. On your server, install only production dependencies:
   ```bash
   npm install --production
   ```

4. Start the server:
   ```bash
   NODE_ENV=production node server.js
   ```

### Environment Variables

- `NODE_ENV` - Set to `production` for production builds
- `PORT` - Server port (default: 3000)
- `BASE` - Base URL path (default: `/`)

## SEO Features

### Meta Tags
The landing page includes comprehensive SEO meta tags:
- Primary meta tags (title, description, keywords)
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Canonical URL
- Theme color
- Structured data (JSON-LD)

### Structured Data
JSON-LD structured data for search engines:
- Software Application schema
- Pricing information
- Feature list
- Aggregate ratings

### Benefits of SSR

1. **SEO**: Search engines can crawl and index content immediately
2. **Performance**: Faster First Contentful Paint (FCP)
3. **Social Sharing**: Proper previews on social media platforms
4. **Accessibility**: Content available even before JavaScript loads

## Routes with SSR

The following routes are server-side rendered:
- `/` - Landing page (marketing)
- `/login` - Login page
- `/signup` - Signup page

Protected routes (`/dashboard`, `/admin`) are client-side only as they require authentication.

## Troubleshooting

### Common Issues

1. **Module not found errors**: Make sure to install SSR dependencies:
   ```bash
   npm install express compression sirv
   ```

2. **Hydration mismatch**: Ensure server and client render the same initial HTML. Avoid:
   - `Date.now()` or random values during initial render
   - Browser-only APIs (localStorage, window) in component render
   - Different content based on environment

3. **Firebase in SSR**: Firebase client SDK should only run on client. The entry-server.tsx only renders landing/public pages without Firebase.

## Performance Monitoring

Monitor these metrics:
- **Time to First Byte (TTFB)**: Should be < 200ms
- **First Contentful Paint (FCP)**: Should be < 1s
- **Lighthouse SEO Score**: Should be 90+

## Next Steps

For further optimization:
1. Add service worker for offline support
2. Implement static site generation (SSG) for landing page
3. Add CDN for static assets
4. Implement response caching
5. Add rate limiting for production

## Resources

- [Vite SSR Guide](https://vitejs.dev/guide/ssr.html)
- [React Server-Side Rendering](https://react.dev/reference/react-dom/server)
- [Express.js Documentation](https://expressjs.com/)
