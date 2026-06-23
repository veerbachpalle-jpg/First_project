Update the centralized API configuration so the backend base URL changes from `http://localhost:8000/api/v1` to `http://localhost:8000`.

Files to modify:
1. `.env` — change `VITE_API_URL` value from `http://localhost:8000/api/v1` to `http://localhost:8000`
2. `src/services/api.ts` — change the fallback `BASE_URL` default from `"http://localhost:8000/api/v1"` to `"http://localhost:8000"`

No service file paths need changing; they already call `/users/*` relative endpoints which will now resolve to `http://localhost:8000/users/*`.