# Edo SaaS Repo Guidelines

- **Tech stack**: Django REST backend (`backend/edoAPI`) + Next.js/React frontend (`edo/src`).
- **Auth**: All API calls use JWT/Token via existing `apiRequest` helper.
- **Routing**: Backend endpoints mounted under `/api/v1/` using DRF routers.
- **Frontend data fetching**: Prefer React Query hooks; use `apiRequest` for HTTP layer.
- **Code style**: Keep TypeScript where present; otherwise modern ES modules with hooks.
- **Backend style**: DRF viewsets + serializers; ensure permissions align with tenant/landlord roles.
- **Testing**: Manual verification acceptable unless automated tests already exist.
- **Linting**: Follow existing ESLint and Prettier defaults.
