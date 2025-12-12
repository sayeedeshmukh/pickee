from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from typing import Dict
from pathlib import Path

MODEL_DIR = Path(__file__).parent.parent / "models" / "pros_cons_model"
# if you didn't train, use the base model id:
FALLBACK_MODEL = "google/flan-t5-small"

def load(model_dir=None):
    model_name = str(model_dir) if model_dir and model_dir.exists() else FALLBACK_MODEL
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return tokenizer, model

tokenizer, model = load(MODEL_DIR)

def generate(topic: str, option_a: str, option_b: str, mindset: str = "mixed", max_length=200):
    prompt = (
        f"Topic: {topic}\nOption A: {option_a}\nOption B: {option_b}\nMindset: {mindset}\n"
        "Provide PROS_A, CONS_A, PROS_B, CONS_B. Use ' | ' between items."
    )
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=256)
    out = model.generate(**inputs, max_length=max_length, num_beams=4, do_sample=False)
    text = tokenizer.decode(out[0], skip_special_tokens=True)
    # naive parse
    parts = {"PROS_A": [], "CONS_A": [], "PROS_B": [], "CONS_B": []}
    for key in parts.keys():
        if key in text:
            try:
                seg = text.split(key+":",1)[1]
                # split by next key or end
                remainder = seg
                for other in parts.keys():
                    if other != key and other in seg:
                        remainder = seg.split(other+":",1)[0]
                items = [it.strip() for it in remainder.split("|") if it.strip()]
                parts[key] = items
            except Exception:
                parts[key] = []
    return {
        "raw": text,
        "pros_a": parts["PROS_A"],
        "cons_a": parts["CONS_A"],
        "pros_b": parts["PROS_B"],
        "cons_b": parts["CONS_B"]
    }

if __name__ == "__main__":
    res = generate("Joining a startup vs MNC", "Joining a startup", "Joining a big MNC", "mixed")
    print(res)
