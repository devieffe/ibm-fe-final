# StayHealthy React App

React conversion of the static Stay Healthy HTML site with:
- `react-router-dom` routing for all pages
- Redux Toolkit auth state for login/logout
- Bootstrap + Bootstrap Icons styling

## Routes
- `/` Home
- `/services`
- `/appointments`
- `/health-blog`
- `/reviews`
- `/signup`
- `/login`

## Login Redux Flow
- Auth state is managed in `src/store/authSlice.js`
- Submitting the login form dispatches `loginSuccess({ email })`
- Navbar updates based on `isAuthenticated`
- Logout dispatches `logout()`

## Quick Start
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
npm run preview
```

## Project Structure
- `src/components/` shared layout (`Navbar`, `Footer`, `AppLayout`)
- `src/pages/` route page components
- `src/store/` Redux store + auth slice
- `src/styles.css` migrated styles from static site
