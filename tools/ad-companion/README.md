# Active Directory Pentest Companion

**Release track:** v0.4 candidate — 82 documented command recipes. The public v0.3 remains available on `main` until this candidate is reviewed and merged.

## Scope

- `index.html` — offline, client-side command generator (82 recipes; original 44 plus 35 lab-driven and 3 password/Kerberos additions).
- `manual.html` — English, printable online manual with prerequisite and command provenance.
- No backend or analytics. User input never leaves the browser through this application.
- Command arguments, shell history, terminal paste and screenshots may still expose passwords, hashes or tickets.

## New coverage

Added **Setup & DNS** for NetExec `--generate-hosts-file`, `--generate-krb5-file`, backup-safe `/etc/hosts` merging, `getent`, and DNS SRV checks (including TCP behind a pivot); expanded SMB / RPC / RID enumeration, password-policy and share workflows, BloodHound CE, Certipy ESC13 policy OIDs, tickets and Kerberos troubleshooting, `bloodyAD` permission introspection, proxychains checks, and toolchain dependency health.

Some commands deliberately run only `--help` or inspect configuration instead of modifying an AD target. Some are version-sensitive, so inspect `--help` before execution. `/etc/hosts` cannot answer DNS SRV queries.

## Case-study input

Grounded in existing public write-ups:
- [TryHackMe Reset](https://github.com/ALLAKORI/writeups/blob/main/_posts/2026-11-12-tryhackme-reset-hard-active-directory-case-study.md)
- [TryHackMe VulnNet-RST](https://github.com/ALLAKORI/writeups/blob/main/_posts/2026-11-10-tryhackme-vulnnet-rst-active-directory.md)
- [HTB DanglingTree](https://github.com/ALLAKORI/writeups/blob/main/_posts/2026-11-10-htb-danglingtree-active-directory.md)
- [HTB Checkpoint](https://github.com/ALLAKORI/htb-season-11-writeups/blob/main/Checkpoint/README.md)
- [HTB DarkZeroReturns](https://github.com/ALLAKORI/htb-season-11-writeups/blob/main/DarkZeroReturns/README.md)
- [HTB RedEye](https://github.com/ALLAKORI/htb-season-12-writeups/blob/main/RedEye/README.md)
- [HTB Autopilot](https://github.com/ALLAKORI/htb-season-12-writeups/blob/main/Autopilot/README.md)

Official research: [NetExec](https://www.netexec.wiki/smb-protocol/generate-hosts-file), [Certipy](https://github.com/ly4k/Certipy/wiki), [BloodHound](https://github.com/SpecterOps/BloodHound), [Impacket](https://github.com/fortra/impacket).

## Verification policy

- **Documentation reviewed:** command template or principle compared against an upstream reference, a public case study or a local help example.
- **Generated command validated:** inputs checked before the recipe becomes copyable.
- **Target-tested:** reserved for actual execution in an isolated lab with version, expected output and evidence logged. Not claimed for all 79 recipes.
- **No guarantee of completeness:** future labs can introduce capabilities, changes or regression cases not represented here.

## Tests before publishing

1. Check page loads offline and all 82 recipes appear.
2. Check category/search selection and dynamic field visibility.
3. Check IPv4, CIDR and NT-hash validation; test shell quoting with spaces and apostrophes.
4. Generate single-host and subnet commands; inspect host-file backup/merge and duplicate detection.
5. Run portfolio integrity CI and inspect GitHub Pages links.
6. Do not merge until the CI and relevant manual tests pass.


## Fast search and password attack awareness (v0.5)

- Case- and punctuation-insensitive alias matching: `as rep`, `AS-REP`, `asrep`, and `GetNPUsers` map to the AS-REP roasting recipe.
- `spray`, `password spray`, and `kerbrute` lead to two authorized-lab, single-candidate password-spraying templates and one Kerbrute user-enumeration template.
- Search includes technique title, alias keywords, category, command and explanatory fields; priority favors exact titles and aliases.
- Popular-technique chips, `/` or `Ctrl+K` search focus, `Enter` to select the first result, `Escape` to clear, empty-results guidance, and a clear button.
- Spraying can trigger lockouts and alarms, even when used once; review password/fine-grained lockout policy and explicit test scope first.

**Search smoke tests:** as rep, AS-REP, asrep, GetNPUsers, password spray, spray, Kerbrute, hosts, WriteDACL, ESC13, kerberoast and a no-match query. Verify the expected first result and the generated command before copying.

## Navigation UX (v0.6)

The command library offers two independent controls:
- **Category selector:** optional browsing by SMB, Kerberos, LDAP, AD CS, or any other category.
- **Search box:** free keyword/alias/task search, including English and selected French intent phrases.

The search box does not clear the category. A **Clear** button clears only search text; **Show all** resets both filters. When the current category and search have no intersection, **Search all categories** preserves the query and clears only the category.

Example acceptance checks: `All + find users`, `All + lister les utilisateurs`, `Kerberos + as rep`, `SMB + share`, `SMB + as rep` (zero hits with cross-category fallback). This is curated, deterministic intent mapping, not AI-powered semantic search.

## Longer-term roadmap

Implement a structured source of truth shared by generator and typeset PDF; add reproducible GOAD, Windows Server 2025, AD CS, BloodHound CE and cross-forest tests; document GPO/OU effective-permission, dMSA/BadSuccessor, delegation, NTLM relay preconditions, detection, rollback and patch dependencies. Avoid publishing real credentials, host inventories, private certificates or sensitive tickets.
