#!/bin/sh
# Stamps a new version (1.0.0.YYYYMMDD.HHMM, US Eastern time) into the game.
# Run this before each commit that changes the game, so "Check for update" can see it.
set -e
cd "$(dirname "$0")/.."
BASE="1.0.0"
STAMP=$(TZ=America/Detroit date +%Y%m%d.%H%M)
V="$BASE.$STAMP"
printf "// Set by tools/stamp-version.sh\nconst APP_VERSION = '%s';\n" "$V" > js/version.js
printf '{ "version": "%s" }\n' "$V" > version.json
sed -i.bak "s/^const CACHE = .*/const CACHE = 'pupcafe-$V';/" sw.js && rm -f sw.js.bak
echo "$V"
