# 🌙 Dream Twins

A mystical dream-matching web app where users share their dreams and get connected to someone across the world who dreamed something similar.

---

## ✨ Features

- Submit your name, country, and dream
- AI-powered dream matching across a shared database
- Dreamy animated frontend with vintage celestial aesthetic
- Real-time search feedback with smooth transitions

---

## 🗂 Project Structure

```
dream-twins/
├── frontend/        # React + Tailwind + Framer Motion
├── backend/         # FastAPI (Python)
└── database/        # PostgreSQL
```

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, Tailwind CSS, Framer Motion  |
| Backend   | FastAPI, Python                     |
| Database  | PostgreSQL                          |

---

## 🚀 Local Setup

### Prerequisites
- Node.js
- Python 3.9+
- PostgreSQL

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Database

Create a PostgreSQL database and configure your connection string in a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dreamtwins
```

---

## 🌍 Deployment

The app is deployed across three platforms:

| Part      | Platform  | Notes                              |
|-----------|-----------|------------------------------------|
| Frontend  | Vercel    | Auto-deploys from GitHub           |
| Backend   | Render    | Start command: `uvicorn main:app --host 0.0.0.0 --port 8000` |
| Database  | Supabase  | Hosted PostgreSQL                  |

### Steps

1. Push your code to GitHub
2. Set up a PostgreSQL database on [Supabase](https://supabase.com)
3. Deploy the backend on [Render](https://render.com) and add your environment variables
4. Deploy the frontend on [Vercel](https://vercel.com) and update the API base URL to your Render URL:

```js
axios.post('https://your-app.onrender.com/connect-dream', formData)
```

---

## 📁 Environment Variables

| Variable       | Description                  |
|----------------|------------------------------|
| `DATABASE_URL` | PostgreSQL connection string |

---

## 🎨 Assets

Icons and images live in `/public/icons/`:

- `sun.png` — decorative sun icon
- `moon.png` — decorative moon icon
- `star.png` — hanging star icon
- `angel.png` — cherub icon (behind clouds)
- `cloud-left.png` / `cloud-right.png` — animated drifting clouds
- `ornate-frame.png` — vintage frame around the input form
- `title.png` — "Dream Twins" title image

---

## 🤖 Model Credit

Dream matching is powered by **[all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)**, a sentence embedding model developed by Microsoft and fine-tuned by the [Sentence Transformers](https://www.sbert.net/) team.

- **Model**: all-MiniLM-L6-v2
- **Source**: [Hugging Face](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- **Library**: [sentence-transformers](https://github.com/UKPLab/sentence-transformers)
- **Use case**: Semantic similarity — encoding dream text into vector embeddings to find the closest match in the database

---

## 📄 License

MIT
