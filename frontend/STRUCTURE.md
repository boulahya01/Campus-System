Frontend Structure — quick reference

Purpose
- Keep the frontend simple and discoverable: one responsibility per folder, concise naming.

Top-level `src/` layout
- `main.tsx` — app bootstrap, render router
- `App.tsx` — layout and shared components (Navbar, footer)
- `routes/Routes.tsx` — React Router configuration
- `api/` — API client and endpoint wrapper functions
  - `client.ts` — Axios instance with base URL and interceptors
  - `endpoints.ts` — grouped API calls: `authAPI`, `studentsAPI`, etc.
- `stores/` — state management (Zustand or alternatives). Keep auth logic here.
- `hooks/` — reusable hooks like `useFetch`, `useForm`, `useAuth`.
- `pages/` — top-level pages (one file per page): `Login`, `Dashboard`, `AdminDashboard`, `Courses`, `Materials`, `Exams`, `Grades`, `Requests`.
- `components/` — shared UI (Navbar, ProtectedRoute, Form components, Table components).

Conventions
- Keep pages thin: fetch data with `useFetch` or a custom hook, render via components.
- Keep API interaction in `api/endpoints.ts` so tests or replacements are trivial.
- Store tokens in `stores/authStore.ts` and persist to `localStorage` for session rehydration.
- Routes: protect pages with `ProtectedRoute` wrapper that reads auth store.

Adding features
1. Add backend API wrapper in `api/endpoints.ts`.
2. Add hook in `hooks/` if reusable behavior emerges.
3. Add page in `pages/`, composing components from `components/`.
4. Add routes in `routes/Routes.tsx` and update `Navbar` for navigation links.

Testing & Build
- Dev server: `npm run dev` (Vite)
- Build: `npm run build`

Notes
- Keep styling minimal and consistent; consider introducing Tailwind or a design system for larger projects.
- Keep forms validated and show clear loading/error states.

Example:
- `pages/AdminDashboard.tsx` uses `api/endpoints.ts` to fetch `studentsAPI.list`, `teachersAPI.list`, `modulesAPI.list` and displays them in small tables.
