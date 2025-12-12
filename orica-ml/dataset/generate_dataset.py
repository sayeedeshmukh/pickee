# dataset/generate_dataset.py
import json
import random
from pathlib import Path

OUT = Path(__file__).parent
OUT.mkdir(parents=True, exist_ok=True)

topics = [
    "Joining a startup vs joining a big MNC",
    "Buying a new laptop vs a used laptop",
    "Hostel A (closer) vs Hostel B (cheaper)",
    "Taking an internship vs taking a semester off",
    "Studying CS vs studying EE",
    "Moving to city A vs city B",
    "Android phone vs iPhone",
    "Buying bike vs buying car (used)",
]

pro_templates = [
    "Better learning opportunities",
    "Higher stability and structure",
    "Lower monthly cost",
    "Closer to college / commute is easier",
    "Higher pay potential",
    "More freedom and flexibility",
    "Easier to resell later",
    "Has better customer support and warranty"
]

con_templates = [
    "Less stability",
    "Higher initial cost",
    "Longer commute",
    "Lower team mentorship",
    "Not good for long-term resell",
    "Requires more maintenance",
    "Fewer networking opportunities",
    "Higher monthly expenses"
]

def gen_pros_cons(topic):
    # make 3 pros and 2 cons for A and B, with some variation
    pros_a = random.sample(pro_templates, 3)
    cons_a = random.sample(con_templates, 2)
    pros_b = random.sample(pro_templates, 3)
    cons_b = random.sample(con_templates, 2)
    # add small variations to make them more natural
    pros_a = [p + random.choice(["", " — great for growth", " — practical choice", ""]) for p in pros_a]
    pros_b = [p + random.choice(["", " — less risky", " — long-term benefit", ""]) for p in pros_b]
    return pros_a, cons_a, pros_b, cons_b

def make_dataset(n_per_topic=80):
    data = []
    for t in topics:
        for i in range(n_per_topic):
            pros_a, cons_a, pros_b, cons_b = gen_pros_cons(t)
            mindset = random.choices(["emotional", "practical", "mixed"], weights=[0.3,0.5,0.2])[0]
            # naive decision scoring: count pros length + slight bias from mindset
            score_a = len(pros_a) - len(cons_a) + (0.5 if mindset=="practical" and "stability" in " ".join(pros_a).lower() else 0)
            score_b = len(pros_b) - len(cons_b) + (0.5 if mindset=="emotional" and "freedom" in " ".join(pros_b).lower() else 0)
            final_decision = "A" if score_a >= score_b else "B"
            item = {
                "topic": t,
                "option_a": f"{t.split(' vs ')[0]}",
                "option_b": f"{t.split(' vs ')[1]}",
                "pros_a": pros_a,
                "cons_a": cons_a,
                "pros_b": pros_b,
                "cons_b": cons_b,
                "mindset": mindset,
                "final_decision": final_decision
            }
            data.append(item)
    return data

if __name__ == "__main__":
    ds = make_dataset(n_per_topic=80)  # ~640 samples
    out_file = OUT / "dataset.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(ds, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(ds)} examples to {out_file}")
