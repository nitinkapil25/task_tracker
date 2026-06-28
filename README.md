# TaskFlow — MERN Task Tracker

A responsive full-stack task manager with complete CRUD, validation, search, filtering, sorting, status tracking, due dates, and toast notifications. The React UI updates immediately after every operation without refreshing the page.

## Stack

- React 18 + Vite
- Node.js + Express
- MongoDB + Mongoose
- Plain responsive CSS

## Run locally

1. Make sure Node.js 18+ and MongoDB are available (local MongoDB or MongoDB Atlas).
2. Install dependencies:

   ```bash
   npm run install:all
   ```

3. Copy `server/.env.example` to `server/.env` and update `MONGODB_URI`.
4. Optionally copy `client/.env.example` to `client/.env` (the default already targets the local API).
5. Start both applications:

   ```bash
   npm run dev
   ```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:5000`.

## REST API

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | API health check |
| `GET` | `/api/tasks` | List tasks |
| `GET` | `/api/tasks/:id` | Get one task |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

`GET /api/tasks` also accepts `status`, `priority`, `search`, `sort`, and `order` query parameters.

## Deployment

### Backend (Render)

1. Push the repository to GitHub and create a Render **Blueprint** from the included `render.yaml` (or create a Web Service manually).
2. Set **Root Directory** to `server`, **Build Command** to `npm install`, and **Start Command** to `npm start`.
3. Add `MONGODB_URI`, `NODE_ENV=production`, and `CLIENT_URL=<your deployed frontend URL>` as environment variables.
4. Use a MongoDB Atlas connection string and allow Render's outbound connections in Atlas network access.

### Frontend (Vercel)

1. Import the GitHub repository into Vercel.
2. Set **Root Directory** to `client`; the included `vercel.json` supplies the Vite build settings.
3. Add `VITE_API_URL=https://<your-render-service>/api`.
4. Deploy, then copy the Vercel URL into the backend's `CLIENT_URL` setting and redeploy the backend.

Both services need their own public URL because the assignment explicitly requires public frontend and backend deployments.
