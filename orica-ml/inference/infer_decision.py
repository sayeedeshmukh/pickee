from pathlib import Path
import joblib
import numpy as np

ROOT = Path(__file__).parent.parent
MODEL_PATH = ROOT / "models" / "decision_model" / "decision.pkl"

def load():
    d = joblib.load(MODEL_PATH)
    return d["model"], d["tfidf"], d["mindset_map"]

model, tfidf, mindset_map = load()

def decide(pros_a, cons_a, pros_b, cons_b, mindset="mixed"):
    text = " ".join(pros_a + cons_a + pros_b + cons_b)
    X_text = tfidf.transform([text]).toarray()
    X_mind = np.array([mindset_map.get(mindset,2)]).reshape(-1,1)
    X = np.hstack([X_text, X_mind])
    pred = model.predict(X)[0]
    probs = model.predict_proba(X)[0]
    # map classes to probs
    classes = model.classes_
    conf = float(max(probs))
    return {"winner": pred, "confidence": conf, "class_probs": dict(zip(classes.tolist(), probs.tolist()))}

if __name__ == "__main__":
    # tiny example
    res = decide(["good learning"], ["poor pay"], ["stable"], ["less freedom"], "practical")
    print(res)
