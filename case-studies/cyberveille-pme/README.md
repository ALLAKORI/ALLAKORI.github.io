# CyberVeille PME - Early Warning for Suspicious URLs

Sanitized public overview of my completed PFA project with CMRPI, Espace Maroc Cyberconfiance.

The project explored a practical early-warning workflow for small and medium-sized businesses: an employee submits a suspicious URL, the system combines threat-intelligence lookup with machine-learning features, then returns an explainable risk result and an appropriate response action.

## Problem

SMEs often need a lightweight way to triage suspicious links before an employee opens them. The workflow had to remain simple for a non-specialist user while preserving an investigation history and supporting an IT contact during response.

## Public Scope

This page documents the project at a portfolio level only. Internal stage documents, supplied datasets, private infrastructure details, supervisor information and confidential deliverables are intentionally excluded.

## Implemented Workflow

```text
URL submitted by user
        |
        v
Input validation and safe normalization
        |
        v
Local threat-intelligence lookup + URL feature extraction
        |
        v
Logistic-regression risk classification
        |
        +--> Risk level, reasons and practical advice
        +--> SQLite analysis history
        +--> Optional email alert
        +--> SME response sheet
```

## Main Contributions

- Structured a safe URL-analysis flow that does not open or automatically browse the submitted URL.
- Connected local threat-intelligence data with lexical and host-related URL features.
- Used a scikit-learn logistic-regression model to produce a phishing-risk classification.
- Added readable explanations and response guidance instead of returning only a binary prediction.
- Implemented analysis history and CSV-oriented processing for repeated checks.
- Added configurable alerting and response sheets for common situations such as a suspicious link or compromised credentials.
- Tested invalid input, lookup behavior, CSV processing, local persistence, disabled alerts and email failure cases.

## Technical Environment

| Area | Technologies |
|---|---|
| Interface | Python, Streamlit |
| Analysis | Python, feature engineering, scikit-learn |
| Threat intelligence | Local URLHaus-derived lookup |
| Persistence | SQLite |
| Notifications | Configurable SMTP integration |
| Quality | Automated tests and documented validation scenarios |

## Security Decisions

- The submitted URL is treated as untrusted input and is never opened by the application.
- Optional external reputation checks are isolated from the main decision flow.
- Alerts are configurable so a deployment can disable email delivery during testing.
- The result includes reasoning and response guidance to support human validation.
- The public portfolio version contains no internal stage data or confidential documents.

## What This Project Demonstrates

- Threat-intelligence workflow design for an SME context.
- Applied machine learning used as a supporting security signal, not as an unexplained verdict.
- Secure input handling, persistence, alerting and testing in one small security product.
- Ability to translate a cybersecurity objective into an understandable operational workflow.

## Status

Completed PFA project, July-August 2026. This public summary is intended for portfolio review and does not replace the confidential stage deliverables.

`Cybersecurity` `Threat Intelligence` `Phishing Detection` `Applied Machine Learning` `Streamlit` `SQLite` `Security Engineering`
