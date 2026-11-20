# Active Directory Pentest Companion (review candidate)

**Status:** v0.3 RC — portfolio integration for review, not yet a target-validated pentest toolkit.

This directory contains:

- `index.html`: client-side interactive command generator with 44 categorized recipes and local-only inputs;
- `manual.html`: accessible English research manual, print-ready from the browser.

**Launch:** visit `/tools/ad-companion/` on GitHub Pages or open `index.html` locally. No package installation, runtime build or backend is required.

**Operator safety:** enter targets only in authorized environments; never expose sensitive passwords, secrets, private certificates or live tickets in public demos. Command-line credentials may leak through terminal history and process arguments.

**Quality evidence:** reviewed JavaScript generator behavior with 44 recipes, missing/invalid IP checks, search and sensitive string quoting in a local Chromium render. Commands have *not* all been executed against a live AD controller, and installed tool CLI flags should be checked before use.

**Manual artifact:** the independently typeset English v0.2 PDF remains in the standalone release archive delivered separately. The GitHub Pages version provides a printable English manual rather than an unverified binary upload.

**Maintenance roadmap:** per-tool version matrix, reproducible isolated AD lab tests and expected output captures, defensive mitigations, rollback instructions and improved structured source-of-truth synchronization for PDF and web versions.
