# Active Directory Pentest Companion

**Release track:** v0.4 candidate — 125 documented command recipes. The public v0.3 remains available on `main` until this candidate is reviewed and merged.

## Scope

- `index.html` — offline, client-side command generator (125 recipes, including Impacket PTH and operator workflows across RDP, WinRM, LDAP and MSSQL).
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

1. Check page loads offline and all 125 recipes appear.
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

## Impacket Pass-the-Hash (v0.8)

- New **Impacket PTH** category: 13 recipes for `smbclient`, `lookupsid`, `samrdump`, `rpcdump`, `GetADUsers`, `findDelegation`, `getTGT`, `wmiexec`, `psexec`, `smbexec`, `atexec`, `dcomexec` and scoped lab `secretsdump`.
- Search synonyms: `pth`, `pass the hash`, `ntlm hash`, `impacket with hash`, `remote command with hash`; category filter still combines with search.
- The generator accepts **only 32-hex-character test NT hashes** in the hash input; it inserts the user-provided value into Impacket's documented `-hashes :NT_HASH` form.
- Important upstream syntax difference: `smbexec` launches an interactive shell **without** a positional command argument.
- Authentication success never implies administrator rights; WMI/DCOM, service/SCM and task scheduler paths have different prerequisites and side effects.
- `secretsdump` is a high-impact lab-only path and its output contains real credential material; use strictly within explicit authorization and do not publish it.
- CLI references: [Fortra examples](https://github.com/fortra/impacket/tree/master/examples) and [Kali Impacket help](https://www.kali.org/tools/impacket-scripts/).
- Each new recipe is documentation/source-reviewed, **not individually target-validated**. The v0.7 PDF remains a separate earlier edition until regenerated.

## Practical operator coverage (v0.9)

This update adds **30 source-reviewed command recipes** for FreeRDP 3.x, RDP certificate/authentication handling, graphical sessions and restricted-admin PTH, WinRM PowerShell and tickets, LDAP delegation/SID/LAPS/gMSA checks, MSSQL Windows/NTLM authentication, read-only SQL queries, Windows applied GPO/token inspection and local connectivity diagnostics.

**Important syntax and safety distinctions:**
- `xfreerdp3` is available in current Kali FreeRDP 3 builds; confirm whether the installed client is `xfreerdp3` or `xfreerdp`. Uses `+f` for full-screen, `+dynamic-resolution`, `/cert:tofu`, and `/pth:` with Restricted Admin requirements.
- Prefer RDP credential prompts over `/p:` in process arguments. Do not treat authentication-only success as interactive logon approval.
- WinRM, RDP, SQL Server and SMB have separate authorization requirements.
- LDAP LAPS/gMSA and Impacket secretsdump may expose sensitive credentials; store no results on the public website.
- `gpresult`, `whoami` and Windows `netstat` commands run *inside Windows*, not Kali.
- Category and free-text search are independent. Suggested searches: `xfreerdp`, `remote desktop`, `rdp with hash`, `winrm`, `mssql`, `gmsa`, `LAPS`, `applied gpo`.
- The goal is an offline, cross-tool AD reference, not a false guarantee that every command will execute successfully on every OS/tool version.

References: [Kali FreeRDP3](https://www.kali.org/tools/freerdp3/), [Evil-WinRM](https://github.com/Hackplayers/evil-winrm), [NetExec](https://www.netexec.wiki/), [Impacket](https://github.com/fortra/impacket/tree/master/examples).

## Longer-term roadmap

Implement a structured source of truth shared by generator and typeset PDF; add reproducible GOAD, Windows Server 2025, AD CS, BloodHound CE and cross-forest tests; document GPO/OU effective-permission, dMSA/BadSuccessor, delegation, NTLM relay preconditions, detection, rollback and patch dependencies. Avoid publishing real credentials, host inventories, private certificates or sensitive tickets.

## Historical v0.3 edition (November 2026)

The independently produced v0.3 reference is preserved under [editions/v0.3](editions/v0.3/README.md) with **125 command recipes**, category/keyword filters, and a 46-page PDF build script. It is an **archive**, not a replacement for the newer command companion at [index.html](index.html). The edition generalizes private lab research and keeps active HTB details out of public release files.

The archived HTML entrypoint is [v0.3/index.html](editions/v0.3/index.html). The [PDF build workflow](../../.github/workflows/ad-companion-v03.yml) generates the release PDF and self-contained offline HTML within the archive. If automated PDF publication has not completed, generate it from the included source or use the previously delivered local download.
