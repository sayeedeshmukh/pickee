from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from pathlib import Path
import json
import traceback

# inference helpers
from inference.infer_pros_cons import generate as gen_pc, tokenizer as gen_tokenizer, model as gen_model
from inference.infer_decision import decide as decide_fn

app = FastAPI()
ROOT = Path(__file__).parent.parent

class GenerateRequest(BaseModel):
    topic: str
    option_a: str
    option_b: str
    mindset: Optional[str] = "mixed"

class GenerateResponse(BaseModel):
    pros_a: List[str]
    cons_a: List[str]
    pros_b: List[str]
    cons_b: List[str]
    raw: str

class DecideRequest(BaseModel):
    pros_a: List[str]
    cons_a: List[str]
    pros_b: List[str]
    cons_b: List[str]
    mindset: Optional[str] = "mixed"

class DecideResponse(BaseModel):
    winner: str
    confidence: float
    class_probs: dict

@app.post("/generate", response_model=GenerateResponse)
async def generate_endpoint(req: GenerateRequest):
    try:
        out = gen_pc(req.topic, req.option_a, req.option_b, req.mindset)
        return GenerateResponse(
            pros_a = out["pros_a"],
            cons_a = out["cons_a"],
            pros_b = out["pros_b"],
            cons_b = out["cons_b"],
            raw = out["raw"]
        )
    except Exception as e:
        traceback.print_exc()
        return {"pros_a": [], "cons_a": [], "pros_b": [], "cons_b": [], "raw": str(e)}

@app.post("/decide", response_model=DecideResponse)
async def decide_endpoint(req: DecideRequest):
    try:
        res = decide_fn(req.pros_a, req.cons_a, req.pros_b, req.cons_b, req.mindset)
        return DecideResponse(winner=res["winner"], confidence=res["confidence"], class_probs=res["class_probs"])
    except Exception as e:
        traceback.print_exc()
        return {"winner": "A", "confidence": 0.5, "class_probs": {}}

if __name__ == "__main__":
    uvicorn.run("ml_api:app", host="0.0.0.0", port=8000, reload=False)
