# Deploy the portfolio on Vercel

This repository is arranged as one Vercel project:

- Vite/React frontend: `frontend/`
- FastAPI backend: `api/index.py` + `backend/app/`
- API routes: `/api/*`
- PostgreSQL: managed external PostgreSQL (Neon is the recommended Vercel-integrated option)
- Images: Cloudinary

## 1. Create a new PostgreSQL database

Create a fresh PostgreSQL database through the Vercel Marketplace using Neon, or use another managed PostgreSQL provider.

Copy the provider's PostgreSQL connection string into the Vercel environment variable:

```text
DATABASE_URL=postgresql://...
```

The application creates its `users` and `posts` tables automatically when the API starts.

## 2. Add Vercel environment variables

Set these for Production (and Preview if desired):

```text
DATABASE_URL
SECRET_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

The `ADMIN_USERNAME` and `ADMIN_PASSWORD` variables are only required when running `backend/create_admin.py` locally against the new database. They do not need to be exposed to the deployed function.

## 3. Deploy

The Vercel project root must be the repository root, not `frontend/`.

The repository's `vercel.json` runs:

```text
cd frontend && npm ci && npm run build
```

and serves `frontend/dist` as the static site while `api/index.py` handles `/api/*`.

## 4. Create the admin account

From a local clone, set the new database URL and admin credentials in a local `.env` file based on `.env.example`, then run:

```bash
python backend/create_admin.py
```

This creates or updates the admin user in PostgreSQL.

## 5. Verify

Open:

```text
/api
/api/posts/
/admin/login
```

`/api/posts/` should initially return an empty list on a new database.

## Important

Do not commit a real `.env` file, database URL, JWT secret, Cloudinary secret, or plaintext admin password.
