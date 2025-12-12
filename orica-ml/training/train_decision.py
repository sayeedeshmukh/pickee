import json
from pathlib import Path
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import numpy as np

ROOT = Path(__file__).parent.parent
DATA = ROOT / "dataset" / "dataset.json"
OUT = ROOT / "models" / "decision_model"
OUT.mkdir(parents=True, exist_ok=True)

def load_data():
    with open(DATA, 'r', encoding='utf-8') as f:
        ds = json.load(f)
    rows = []
    for d in ds:
        text = " ".join(d["pros_a"] + d["cons_a"] + d["pros_b"] + d["cons_b"])
        rows.append({
            "text": text,
            "mindset": d["mindset"],
            "decision": d["final_decision"]
        })
    return pd.DataFrame(rows)

def preprocess_and_train():
    df = load_data()
    # create features
    tfidf = TfidfVectorizer(max_features=1500, ngram_range=(1,2))
    X_text = tfidf.fit_transform(df["text"]).toarray()
    mindset_map = {"emotional":0, "practical":1, "mixed":2}
    X_mind = np.array([mindset_map.get(m,2) for m in df["mindset"]]).reshape(-1,1)
    X = np.hstack([X_text, X_mind])
    y = df["decision"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    print("Training RandomForest...")
    model.fit(X_train, y_train)
    acc = model.score(X_test, y_test)
    print("Test accuracy:", acc)
    # save artifacts
    joblib.dump({"model": model, "tfidf": tfidf, "mindset_map": mindset_map}, OUT / "decision.pkl")
    print("Saved decision.pkl to", OUT)
    return acc

if __name__ == "__main__":
    preprocess_and_train()
