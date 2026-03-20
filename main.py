import os

from fastapi import FastAPI, Request
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

load_dotenv()

limiter = Limiter(key_func=get_remote_address)

model = SentenceTransformer('all-MiniLM-L6-v2')
engine = create_engine(os.getenv("DATABASE_URL"))
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    )

class DreamEntry(BaseModel):
    name: str
    country: str
    dream_text: str

@app.post("/connect-dream")
@limiter.limit("5/minute")
async def connect_dream(request: Request, entry: DreamEntry):
    embedding = model.encode(entry.dream_text).tolist()

    with engine.connect() as conn:
        search_query = text("""
            SELECT author_name, country, content, ROUND(CAST((1-(embedding <=> :embedding)) * 100 AS numeric), 1) AS score
                            FROM dream 
                            ORDER BY embedding <=> :embedding 
                            LIMIT 1
        """)
        match = conn.execute(search_query, {"embedding": str(embedding)}).fetchone()
        
        insert_query = text("""
            INSERT INTO dream (author_name, country, content, embedding) 
            VALUES (:n, :co, :con, CAST(:e AS vector))
        """)
        conn.execute(insert_query, {
            "n": entry.name, 
            "co": entry.country, 
            "con": entry.dream_text, 
            "e": str(embedding)
        })
        conn.commit()

    if match:
        m_name, m_country, m_content, m_score = match
        return {
            "status": "connected",
            "message": f"{m_name} from {m_country} had a similar dream:",
            "match_text": m_content,
            "score": float(m_score)
        }
    else:
        return {"status": "first", "message": "You are the first dreamer in the database!"}

    

# stored_dreams=[
#     "I was flying over a city and I could see the buildings and streets below me. It was a beautiful sight and I felt free and happy.",
#     "I was in a dark forest and I was being chased by a monster. I was scared and I couldn't find a way out.",
#     "I was at the beach and I was swimming in the ocean. The water was warm and I felt relaxed and happy.",
#     "I was flying and heard a voice calling out to me, i didn't know where it was coming from but it felt familiar. I followed the voice and it led me to a beautiful garden filled with flowers and trees. I felt at peace and happy in that moment."
# ] #this is temporary before integrating any database

# new_dream = "I had a dream where running and i came to a cliff and i jumped and then i woke up"

# stored_embeddings = model.encode(stored_dreams)
# new_embedding = model.encode(new_dream)

# cosine_scores = util.cos_sim(new_embedding, stored_embeddings)

# best_match_index = cosine_scores.argmax()

# print("New Dream:", new_dream)
# print("Best Match:", stored_dreams[best_match_index])
# print("Cosine Similarity Score:", cosine_scores[0][best_match_index].item())
