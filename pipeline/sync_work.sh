#!/bin/sh
# Copy expensive intermediate artifacts (agent results, batches, base list) from the session scratch dir into the repo.
S="${1:-/private/tmp/claude-501/-Users-diptidhawade-Plaksha-Code-Projects-GATE/8d662bfb-fe3f-4cfb-b9dc-aa5d7b3a5856/scratchpad}"
D="$(dirname "$0")/work"
mkdir -p "$D/results" "$D/batches"
cp "$S"/results/*.txt "$D/results/" 2>/dev/null
cp "$S"/batches/*.json "$D/batches/" 2>/dev/null
for d in adj_batches adj_results fix_batches fix_results; do
  [ -d "$S/$d" ] && mkdir -p "$D/$d" && cp "$S/$d"/* "$D/$d/" 2>/dev/null
done
for f in base.json es_parsed.json pdfkeys.json go_match.json lists.json go_crops_index.json es_images_map.json adjudications.json textfixes.json launched.txt second_pass_launched.txt; do
  [ -f "$S/$f" ] && cp "$S/$f" "$D/$f"
done
[ -f "$S/raw/go/go_inventory.json" ] && cp "$S/raw/go/go_inventory.json" "$D/go_inventory.json"
echo "synced to $D"
