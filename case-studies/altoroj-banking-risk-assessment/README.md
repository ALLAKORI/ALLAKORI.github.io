# AltoroJ Banking Web Application Risk Assessment

Academic black-box security assessment of the deliberately vulnerable AltoroJ banking application, based on the IBM/OWASP Altoro Mutual demo.

This case study shows the complete workflow used in the lab: identify business assets, assess risk, combine automated scanning with manual validation, and turn findings into a prioritized remediation plan.

## Executive Summary

| Item | Result |
|---|---|
| Target | `https://demo.testfire.net/` |
| Application | IBM/OWASP AltoroJ banking demo |
| Assessment type | Unauthenticated black-box assessment plus targeted manual checks |
| Assessment date | 22 October 2026 |
| Critical assets | 3 of 9: customer database, banking application, credentials/sessions |
| Risk register | 12 risks: 1 critical, 7 high, 4 medium |
| Automated findings | 26 observations: 14 medium and 12 low; no critical or high finding from the scan |
| Highest manual finding | Authentication-bypass SQL injection, CVSS 9.8, CWE-89 |

## Scope and Assets

The analysis mapped the banking flows and their supporting infrastructure using confidentiality, integrity and availability (CIA/DIC) criteria.

| Asset | Classification | Why it matters |
|---|---|---|
| Customer database | Critical | Accounts, balances, personal data and transaction history |
| Web application | Critical | Authentication, account access and transfer logic |
| Credentials and sessions | Critical | Passwords, session cookies and direct account access |
| TLS certificate and keys | High | Server identity and protection of the HTTPS channel |
| Web server and runtime | High | Apache Tomcat, JVM and exposed execution platform |
| Configuration and secrets | High | Connection strings, service credentials and application secrets |
| Backups | High | Recovery of data and configuration after an incident |
| Logs and traces | Medium | Detection, investigation and transaction traceability |
| Public content | Low | Public pages with limited business impact |

## Assessment Method

1. Mapped the application surface, banking workflows and business-critical assets.
2. Built a probability-versus-impact risk matrix and a 12-item risk register.
3. Scanned the public demo with OpenVAS through HostedScan, complemented by passive ZAP, SSLyze, Nmap and Nuclei checks.
4. Performed targeted, non-destructive manual validation of authentication, input handling and authorization behavior.
5. Assigned CVSS v3.1 scores where appropriate and translated technical findings into business risk.
6. Produced a prioritized remediation plan with immediate, short-term and medium-term actions.

## Concrete Findings

### Manual validation

| ID | Finding | Evidence observed | Severity |
|---|---|---|---|
| M1 | SQL injection in authentication | Crafted input bypassed the login flow and opened a valid banking session. | Critical, CVSS 9.8, CWE-89 |
| M2 | Reflected cross-site scripting | The search `query` parameter was reflected without HTML encoding and executed a proof-of-concept script in the browser. | Medium, CVSS 6.1, CWE-79 |
| M3 | Broken access control / IDOR | Account identifiers exposed detailed statements without a visible server-side ownership check. | High, CVSS 7.5, CWE-639 |
| V11 | Missing anti-CSRF protection | Sensitive forms did not contain session-bound anti-CSRF tokens. The workflow was analyzed but not submitted to avoid changing demo account state. | Medium, CWE-352 |

The manual checks were essential because the unauthenticated passive scan did not cover authenticated pages or business logic. The most serious issues were therefore not visible in the automated severity summary.

### Automated scan findings

The scan reported 26 observations: 14 medium and 12 low. The most relevant observations were:

| ID | Observation | Technical reference | Severity |
|---|---|---|---|
| V1 | Expired TLS certificate | CWE-295, certificate expired on 21 June 2026 | Medium, CVSS 5.0 |
| V2 | TLS 1.0 and TLS 1.1 still accepted | CWE-327 | Medium, CVSS 4.3 |
| V3 | HTTP exposure and missing HSTS | CWE-319 | Medium, CVSS 4.8 |
| V4 | Missing CSP, X-Frame-Options and X-Content-Type-Options | CWE-693 | Medium |
| V5 | Session cookie without `SameSite` | CWE-1275 | Low |
| V7 | Mixed content, missing SRI and third-party JavaScript exposure | CWE-829 | Medium |
| V8 | 1024-bit Diffie-Hellman group and weak cipher suites | CWE-326 | Medium, CVSS 4.0 |
| V9 | TCP port 8080 exposed | CWE-16 | Medium |
| V10 | ICMP and TCP timestamps disclosed | CWE-200 | Low, CVSS 2.6 |

The scan also identified server banner disclosure and missing anti-CSRF tokens. Duplicate observations across scanners were kept as separate tool results but not treated as separate underlying vulnerabilities.

## Risk Prioritization

The risk matrix contextualized technical severity with banking impact. The priority order was:

1. **Immediate:** fix the authentication-bypass SQL injection and renew the expired TLS certificate.
2. **Short term:** correct output encoding and CSP, add CSRF tokens and `SameSite`, enforce server-side account authorization, harden TLS, patch the runtime, close unnecessary HTTP exposure and strengthen sessions.
3. **Medium term:** add rate limiting or anti-DDoS controls, protect administrative interfaces and secrets, secure certificate keys, centralize logs in a SIEM and train administrators.

This distinction matters: a CVSS score describes technical exploitability, while the risk register also considers the consequences for customer data, transactions, confidentiality and service continuity.

## Remediation Examples

- Replace concatenated SQL with prepared statements and server-side input validation.
- Encode output by context and publish a restrictive, tested Content Security Policy.
- Add session-bound anti-CSRF tokens and set `SameSite=Lax` or `Strict` where compatible.
- Enforce object ownership on the server before returning account or statement data.
- Renew certificates, restrict the channel to TLS 1.2/1.3, remove weak groups and enable HSTS.
- Patch Tomcat and the JVM, hide version banners and close the unnecessary 8080 connector.
- Use short session lifetimes, rotate identifiers after authentication and invalidate inactive sessions.
- Store application secrets in a dedicated vault and centralize security logs with controlled retention.

## What This Project Demonstrates

- Application security analysis in a banking context.
- Asset classification and risk reasoning using CIA/DIC criteria.
- Practical use of OpenVAS/HostedScan, ZAP passive checks, SSLyze, Nmap and Nuclei.
- Manual validation of SQL injection, reflected XSS and broken access control.
- CVSS v3.1 interpretation without confusing technical severity with business risk.
- Clear security reporting: evidence, limitations, prioritization and actionable remediation.

## Boundaries

This was an academic lab against the public AltoroJ demonstration instance, not a client engagement. Testing was limited to the authorized demo target. No destructive exploitation, denial-of-service test, account transfer or CSRF action was performed. The scan was unauthenticated and results describe the instance as observed on 22 October 2026; they do not represent a production audit.

## Related Topics

`Application Security` `Banking Security` `OWASP Top 10` `OpenVAS` `ZAP` `Nmap` `SSLyze` `Nuclei` `Risk Assessment` `CVSS v3.1` `Vulnerability Management` `Security Reporting`
