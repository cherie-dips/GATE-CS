# Pipeline runbook

Scratch dir (session): `S=/private/tmp/claude-501/-Users-diptidhawade-Plaksha-Code-Projects-GATE/8d662bfb-fe3f-4cfb-b9dc-aa5d7b3a5856/scratchpad`.
Expensive artifacts are mirrored into `pipeline/work/` by `sync_work.sh`.

## 1. Data acquisition (done)
`crawl_lists.py` → `crawl_questions.py` → `parse_examside.py` → `pdf_keys.py` → `go_inventory.py` (GO book text) →
`match_go.py` → `go_crops.py` → `fetch_images.py` + `optimize_images.py` → `assemble_base.py` → `make_batches.py` →
`render_prompts.py`.

## 2. Review / transcription agents
- 130 batches: `batches/es_NNN.json` (review of ExamSIDE questions, 85) and `batches/go_NNN.json` (transcribe
  GATE Overflow-only questions from scans, 45). Instructions per batch: `instructions/<batch>.md`.
- Each agent appends `### BEGIN id … ### END id` blocks to `results/<batch>.txt`.
- `python3 pipeline/status.py $S 4` shows progress and the next batches to launch (tracked in `$S/launched.txt`).
- An agent that stops early: re-launch with the same instructions. It must skip ids already present in the
  results file. Add that note to the prompt.

## 3. Adjudication (second opinion)
```
python3 -I pipeline/parse_results.py $S $S/results.json            # all batches
python3 -I pipeline/make_adjudication.py $S $S/results.json        # incremental; writes adj_batches/ + instructions/adj_NNN.md
# launch one agent per adj batch (instructions/adj_NNN.md), outputs adj_results/adj_NNN.txt
python3 -I pipeline/parse_adjudications.py $S $S/adjudications.json
```

## 3b. Text / chapter fixes
```
python3 -I pipeline/make_textfix.py $S $S/results.json        # incremental; fix_batches/ + instructions/fix_NNN.md
# launch one agent per fix batch; outputs fix_results/fix_NNN.txt
python3 -I pipeline/parse_textfix.py $S $S/textfixes.json
```
Second-pass launches are tracked in `$S/second_pass_launched.txt`.

## 3c. Official answer keys (2022–2026)
Official final keys and question papers from the IIT Guwahati GATE archive (https://gate2026.iitg.ac.in/download.html)
are stored in `$S/raw/official/`. `build_app_data.py` applies them automatically: official NAT ranges, multiple
accepted answers, and marks-to-all are authoritative. Any MCQ/MSQ disagreement goes to `$S/official_conflicts.json`
and must be adjudicated. `python3 -I pipeline/official_keys.py $S app/public/data/questions.json out.json` re-checks
the built bank against the official keys and should report 0 mismatches.

## 4. Build + checks
```
python3 -I pipeline/build_app_data.py $S $S/results.json $S/adjudications.json $S/textfixes.json
node pipeline/check_app_data.mjs
node pipeline/validate_math.mjs $S/results.json $S/math_report.json
cd app && npx vite build
```
Before handing over, delete any `data/progress.json*` written by screenshot tests, then run `pipeline/sync_work.sh`.
