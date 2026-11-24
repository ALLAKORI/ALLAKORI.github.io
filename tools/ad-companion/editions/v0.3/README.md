> **Historical edition:** The main [AD Companion](../../index.html) in this repository has more recent enhancements. This folder preserves the independent v0.3 snapshot; it does not replace the newer application. Private, active HTB challenge-specific notes are deliberately excluded.

# Active Directory Pentest Companion — public v0.3 archive (23 Nov 2026)

This is an archived, **self-contained offline browser command generator** plus a 46-page PDF field guide for authorized Active Directory labs. The command generator contains **125 recipes**, including all 70 recipes from the previous version and 55 new ones.

## Open it

1. Unzip the archive.
2. Open `index.html` (or `AD_Pentest_Companion_v0.3_Offline.html`) in a normal desktop browser (Chrome, Firefox, Edge). No service or backend required.
3. Select a technique category or phase, or search a concept such as `RBCD`, `S4U`, `trust`, `ESC14`, `pass-the-hash`, `WriteGPLink`.
4. Fill the fields shown for the selected recipe, read its prerequisites/interpretation, then copy its command. Sensitive or AD-modifying commands require an on-screen acknowledgement.
5. The top navigation opens the companion PDF. No password is stored on disk by the app or transmitted to a server. A copied command can still leak via your terminal history/process arguments.

## What's new

- AD105 multi-forest case study: SOKOLO / LONIPO / BORITO, trust direction and attributes, inter-forest routing, staged tickets, and limits of published write-ups.
- BloodHound CE Cypher beyond shortest paths; exact ACL proof and visibility limitations.
- RBCD, `msDS-AllowedToActOnBehalfOfOtherIdentity`, MachineAccountQuota, S4U2Self/S4U2Proxy, Kerberos ccache and AES-key tool examples.
- WinRM, Impacket, FreeRDP 3 smartcard logon, pass-the-hash and Windows task/session/GPO checks.
- AD CS ESC14 / Credential Roaming / DPAPI and certificate-key matching.
- Defensive and troubleshooting notes: 0x48/0x808 trust flags, KDC error codes, modern SMB/NTLM controls, CVE-2025-33073 specificity and AORTA prerequisites.
- Evidence-provenance rubric: VERIFIED / EXTERNAL / HYPOTHESIS / UNRESOLVED.

## Files

- `index.html`, `app.js`, `style.css`, `recipes.js` — modular offline command builder.
- `AD_Pentest_Companion_v0.3_Offline.html` — single-file offline command builder (JavaScript/CSS embedded).
- `recipe_catalog.json` — human-readable library for editing and auditing.
- `Active_Directory_Pentest_Companion_v0.3.pdf` — updated guide and full recipe catalog.

## Trust and quality notes

- The earlier methodology sources were **AD_Lab_Methodology_Master_Guide.pdf**, **ad_ultimate.pdf**, and the v0.2 companion manual. The v0.3 PDF consolidates their coverage rather than reproducing each source's PDF bytes.
- The AD105 case study is **externally published**, not an independent AD105 lab replay. One publicly available AD105 GitHub write-up still has an unfinished BORITO segment; treat specific claimed exploit chains as hypotheses until verified.
- The new recipes are syntax/intent reviewed; they are **not individually integration-tested on a fresh Windows forest**. Options may vary with tools and Kali versions. Verify local `--help` output and preconditions before use.
- The UI was statically checked; automatic headless-browser testing was blocked by the execution environment's browser policy.
- This is for explicitly authorized CTFs, isolated labs and security assessments only. Do not place real private keys, hashes or credentials in a public repository.

## Reference links

- https://github.com/SaamNoLimits/AD105-WriteUP
- https://plur1bu5.dev/posts/
- https://bloodhound.specterops.io/
- https://shenaniganslabs.io/2019/01/28/Wagging-the-Dog.html
- https://specterops.io/blog/2024/02/28/adcs-esc14-abuse-technique/
- https://specterops.io/blog/2025/06/25/untrustworthy-trust-builders-account-operators-replicating-trust-attack-aorta/
- https://msrc.microsoft.com/update-guide/vulnerability/CVE-2025-33073