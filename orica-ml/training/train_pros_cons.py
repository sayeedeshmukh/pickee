import os
import json
from pathlib import Path
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, Seq2SeqTrainingArguments, Seq2SeqTrainer
import numpy as np

ROOT = Path(__file__).parent.parent
DATA = ROOT / "dataset" / "dataset.json"
OUT = ROOT / "models" / "pros_cons_model"
OUT.mkdir(parents=True, exist_ok=True)

model_name = "google/flan-t5-small"  # small and works on CPU (but still slow)
tokenizer = AutoTokenizer.from_pretrained(model_name)

def prepare_example(example):
    # create a single-text format: prompt -> pros/cons for A and B in structured format
    src = (
        f"Topic: {example['topic']}\n"
        f"Option A: {example['option_a']}\n"
        f"Option B: {example['option_b']}\n"
        f"Mindset: {example['mindset']}\n"
        f"Generate structured pros and cons lists for A and B.\n"
        f"Return as: PROS_A: ...; CONS_A: ...; PROS_B: ...; CONS_B: ..."
    )
    tgt = (
        f"PROS_A: {' | '.join(example['pros_a'])}; "
        f"CONS_A: {' | '.join(example['cons_a'])}; "
        f"PROS_B: {' | '.join(example['pros_b'])}; "
        f"CONS_B: {' | '.join(example['cons_b'])}"
    )
    return {"input_text": src, "target_text": tgt}

def main():
    print("Loading dataset...")
    # load from local json
    ds = load_dataset("json", data_files=str(DATA))["train"]
    ds = ds.map(lambda ex: prepare_example(ex))
    # tokenizer
    def tokenize_fn(ex):
        model_inputs = tokenizer(ex["input_text"], truncation=True, padding="longest", max_length=256)
        labels = tokenizer(ex["target_text"], truncation=True, padding="longest", max_length=256).input_ids
        model_inputs["labels"] = labels
        return model_inputs

    tokenized = ds.map(tokenize_fn, batched=False, remove_columns=ds.column_names)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    args = Seq2SeqTrainingArguments(
        output_dir=str(OUT),
        per_device_train_batch_size=4,
        num_train_epochs=3,
        logging_steps=50,
        save_total_limit=2,
        fp16=False,
        predict_with_generate=True,
        do_train=True,
        seed=42,
    )

    trainer = Seq2SeqTrainer(
        model=model,
        args=args,
        train_dataset=tokenized,
        tokenizer=tokenizer,
    )

    trainer.train()
    trainer.save_model(OUT)
    tokenizer.save_pretrained(OUT)
    print("Saved pros/cons model to", OUT)

if __name__ == "__main__":
    main()
