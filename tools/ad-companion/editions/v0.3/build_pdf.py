from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Preformatted, CondPageBreak, HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from xml.sax.saxutils import escape
from pathlib import Path
import json,re,datetime, collections
P=Path(__file__).parent
pdfmetrics.registerFont(TTFont('DVS','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DVS-B','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DVS-M','/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))
pdfmetrics.registerFontFamily('DVS',normal='DVS',bold='DVS-B')
NAVY=colors.HexColor('#142740');BLUE=colors.HexColor('#115e9a');INK=colors.HexColor('#202e3e');GRAY=colors.HexColor('#52667a');PALE=colors.HexColor('#eaf2f8');BORDER=colors.HexColor('#cbd9e7');BG=colors.HexColor('#f5f8fb')
ST={
'coverbrand':ParagraphStyle('cb',fontName='DVS-B',fontSize=11,leading=14,textColor=BLUE,spaceAfter=34),
'covertitle':ParagraphStyle('ct',fontName='DVS-B',fontSize=29,leading=37,textColor=NAVY,spaceAfter=14),
'coversub':ParagraphStyle('cs',fontName='DVS',fontSize=12,leading=19,textColor=GRAY,spaceAfter=28),
'h1':ParagraphStyle('h1',fontName='DVS-B',fontSize=16,leading=21,textColor=NAVY,spaceBefore=20,spaceAfter=12,keepWithNext=True),
'h2':ParagraphStyle('h2',fontName='DVS-B',fontSize=11.5,leading=16,textColor=BLUE,spaceBefore=12,spaceAfter=7,keepWithNext=True),
'h3':ParagraphStyle('h3',fontName='DVS-B',fontSize=9.5,leading=14,textColor=INK,spaceBefore=8,spaceAfter=5,keepWithNext=True),
'body':ParagraphStyle('body',fontName='DVS',fontSize=9,leading=14.2,textColor=INK,spaceAfter=8),
'small':ParagraphStyle('small',fontName='DVS',fontSize=8.1,leading=12.5,textColor=INK,spaceAfter=6),
'bullet':ParagraphStyle('bullet',fontName='DVS',fontSize=8.7,leading=13.3,textColor=INK,leftIndent=14,firstLineIndent=-9,spaceAfter=5),
'code':ParagraphStyle('code',fontName='DVS-M',fontSize=7.2,leading=10.5,textColor=INK,backColor=BG,borderPadding=(8,9,8,9),spaceAfter=11),
'caption':ParagraphStyle('caption',fontName='DVS',fontSize=7.2,leading=10.5,textColor=GRAY,spaceAfter=8),
'warn':ParagraphStyle('warn',fontName='DVS',fontSize=8.3,leading=13,textColor=NAVY,backColor=PALE,borderPadding=9,spaceBefore=6,spaceAfter=10),
}
recipes=json.loads((P/'recipes.js').read_text().split('=',1)[1].strip().rstrip(';'))['recipes']
E=[]
def p(t,style='body'):
    E.append(Paragraph(t,ST[style]))
def h1(t):p(escape(t),'h1')
def h2(t):p(escape(t),'h2')
def h3(t):p(escape(t),'h3')
def body(t):p(t,'body')
def sm(t):p(t,'small')
def bullet(t):p('•  '+t,'bullet')
def warn(t):p('<b>CHECK:</b> '+t,'warn')
def code(t):
    # wrap commands safely; Preserve command semantics while rendering long strings over multiple visual lines.
    lines=[]
    for orig in t.splitlines():
        if len(orig)>103:
            # display long commands wrapped at spaces WITHOUT inserting shell backslash: explicitly visual only.
            import textwrap
            lines+=textwrap.wrap(orig,width=100,subsequent_indent='  ',break_long_words=False,break_on_hyphens=False)
        else:lines.append(orig)
    E.append(Preformatted('\n'.join(lines),ST['code'],maxLineLength=108))
def tab(rows,widths=None):
    x=Table([[Paragraph(escape(str(z)),ST['small']) for z in row] for row in rows],colWidths=widths,repeatRows=1,hAlign='LEFT')
    x.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PALE),('LINEBELOW',(0,0),(-1,0),0.7,BORDER),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,BG]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
    E.append(x);E.append(Spacer(1,8))

E.append(Spacer(1,35))
p('ALLAKORI  /  SECURITY FIELD MANUAL','coverbrand')
p('ACTIVE DIRECTORY\nPENTEST COMPANION','covertitle')
p('v0.3  |  Multi-forest, BloodHound CE, Kerberos delegation, RBCD, AD CS and evidence-first lab methodology','coversub')
E.append(HRFlowable(width='100%',thickness=2,color=BLUE,spaceBefore=13,spaceAfter=26))
p('<b>125 searchable command recipes</b> in the included offline HTML companion, with category filters, free-text search, context parameters, risk indicators and copy-to-clipboard.','body')
p('<b>Based on:</b> the previous v0.2 English manual, AD_Lab_Methodology_Master_Guide.pdf, ad_ultimate.pdf, generalized observations from private AD labs, published AD105 case-study material, and referenced research.','body')
p('<b>Edition:</b> 23 November 2026   |   <b>Scope:</b> isolated CTFs, explicit authorized testing. Syntax is a documented starting point, not a guarantee of applicability to an arbitrary domain.','body')
E.append(Spacer(1,50))
warn('No real secrets are embedded. The examples are training templates. Read-only vs. modifying operations are labeled. Source-based AD105 claims must not be mistaken for our independent live observations.')
E.append(PageBreak())
h1('How to use this edition')
body('This edition keeps the prior manual’s major themes—reconnaissance, shares, LDAP, Kerberos, BloodHound, ACL/GPO, delegation, AD CS, trusts, local Windows inspection, modern hardening, troubleshooting, and personal labs—and strengthens the transitions highlighted by AD105 and private lab examples. Use the HTML catalogue for commands; use this PDF for reasoning, validation and provenance.')
tab([['Status','Meaning'],['LAB-VERIFIED','Technique or result observed in our authorized lab evidence; a supplied secret may still have external provenance.'],['SOURCE-REPORTED','A third-party walkthrough, research article or another player described the technique.'],['SYNTAX-REVIEWED','A candidate command to verify against the installed tool version; not a full live regression test.'],['UNRESOLVED','Prerequisite, source of a credential, or mechanism still lacks proof.']],[125,373])
h2('Contents')
for x in ['Part I - Core AD methodology and baseline coverage','Part II - AD105: multi-forest trust case study','Part III - BloodHound beyond shortest paths and effective ACLs','Part IV - RBCD, S4U2Self/S4U2Proxy and ticket evidence','Part V - Kerberos, trust types, SID filtering, referral and errors','Part VI - Modern Windows, AD CS and credentials provenance','Part VII - Evidence provenance: independent vs externally supplied','Part VIII - 125-command searchable catalog (also shipped offline)','Appendix - sources, tool setup and decision checklist']:
    bullet(escape(x))
E.append(PageBreak())

h1('Part I — Core AD methodology (v0.2 baseline retained)')
body('The existing companion covered 24 themes and 70 code recipes. All 70 recipes remain in the offline application; the catalogue at the end of this PDF presents them together with the 55 new recipes. This section consolidates the original procedural rules without substituting an external write-up for the original guides.')
legacy=[
('01  Investigation loop','Recon → identity → reachability → directory/shares → graph → effective ACL → hypothesis → validation → evidence → reassess. Document each failed precondition before choosing a new technique.'),
('02  AD topology','Differentiate DC, member, CA, Global Catalog, child domain and independent forest. Service discovery, DNS and LDAP RootDSE each answer different questions.'),
('03  No-credential enumeration','Compare anonymous RootDSE, SMB anonymous/guest, RPC SAMR, Kerberos usernames and DNS SRV. Authentication acceptance and data authorization are separate.'),
('04  SYSVOL and shared files','Read shares and policy artifacts, task scripts and GPP settings with actual ACLs. Reading a GPO is not writing it. Be careful with old cpassword examples.'),
('05  LDAP truth','Read attributes and security descriptors for exact target objects. BloodHound visualization alone does not prove an attribute-level ACE.'),
('06  Initial identities','Record password policy and lockout threshold before validating account hypotheses; one successful login need not imply local admin or domain admin.'),
('07  Kerberos','Differentiate AS-REQ/AS-REP, TGT, TGS, SPN and caches. Etypes, PKINIT, time and referral behavior affect results.'),
('08  Authentication material','Password, NT hash, AES key, ccache and certificate are not interchangeable. DCC2 caches are offline verifiers, not PTH-ready NT hashes.'),
('09  BloodHound CE','Collect per domain, record visibility and versions, mark only owned identities actually proven. Explore effective relations and not only shortest paths.'),
('10  Directory ACLs','Check GenericAll, GenericWrite, WriteDACL, WriteOwner, AddMember, WriteAccountRestrictions, WriteGPLink and attribute-specific WriteProperty against object class and scope.'),
('11  GPO control','A writable gPLink, editable GPO content and applicable policy are different prerequisites. Check filtering, inheritance, OU membership, GP refresh and SYSVOL integrity.'),
('12  Graph evidence','Treat graph edges as investigative hypotheses. Reconfirm LDAP, local token and target service authorization.'),
('13  Delegation','Separate unconstrained, traditional constrained and resource-based constrained delegation. Each demands different SPN, ticket and directory permissions.'),
('14  PKINIT / shadow credentials','Certificates and key credentials need appropriate KDC trust, identity mapping, EKU, SID binding and attribute write rights.'),
('15  AD CS taxonomy','Review enrollment ACL, templates, issuing CA, permissions, mapping, key material and whether ESC1–ESC17 findings actually apply; not all templates grant domain impersonation.'),
('16  Forest trusts','Trust is relative to the local domain; inspect attributes, security boundaries, selective authentication, SID filtering and realm referrals.'),
('17  Domain control','DCSync requires directory replication rights or a DC machine security context. Membership in local Administrators is not replication authorization.'),
('18  Windows triage','Collect whoami /all, tokens, task actions, service identities, logon sessions, event logs, local ACLs and policy effects.'),
('19  Remote access','SMB/SCM, WMI, WinRM, RDP and SQL each have distinct network and logon-right requirements. Verify return principal and actual scope.'),
('20  Modern defenses','SMB signing, LDAP signing/CBT, NTLM restrictions, Kerberos crypto defaults, AppLocker/WDAC and Server 2025 capabilities must be observed, not presumed.'),
('21  Defensive evidence','Retain raw output, policy pre/post state and cleanup. Important log IDs can support but seldom alone prove causality.'),
('22  Troubleshooting','Name resolution, clock skew, SPN, key mismatch, NTLM restriction, delegation flags and host access are different failure families.'),
('23  Personal lab','Use isolated forest/DC/member snapshots and reversible configuration when testing RBCD, GPO or trust modifications.'),
('24  Decision playbooks','A narrow, read-only test that disproves a hypothesis is preferable to repeated noisy attacks or destructive changes.'),
]
for a,b in legacy:
    h3(a);sm(escape(b))
E.append(PageBreak())

h1('Part II — AD105: interpreting a hardened three-forest lab')
body('AD105 is a SecDojo advanced Active Directory lab described publicly as a three-forest environment: SOKOLO.dojo, LONIPO.dojo and BORITO.dojo. One public repository presents topology, staged tickets, inter-forest trust attributes, port forwarding and multiple failed or pending attempts; its BORITO step is marked incomplete (“sooon”), so it must not be treated as a fully verified account of the last flag. Another published case-study introduction also identifies AD105 as multi-forest. These are external sources, not our own independently re-run findings.')
tab([['Observed/claimed structure','Methodological lesson'],['SOKOLO ↔ LONIPO ↔ BORITO','A chain of trust links is not blanket authorization across two trust hops.'],['LONIPO-side 0x48 / BORITO-side 0x808','Different sides may record different trust attributes; direction and bits must be read locally.'],['Some services unreachable from attacker Kali','Check exact path to target and reverse path from DC to callback listener.'],['Cached .kirbi tickets and NTDS materials in write-up','Artifact provenance matters: when was the ticket obtained and what principal does it represent?'],['CVE-2025-33073 listed as possible later path','Verify Windows build, patch, name resolution and reflection conditions rather than assume a universal bypass.']],[183,315])
h2('Trust direction and common flags')
code('trustDirection: 1 inbound, 2 outbound, 3 bidirectional (viewed on local TDO)\n0x008 = FOREST_TRANSITIVE\n0x040 = CROSS_ORGANIZATION\n0x800 = CROSS_ORGANIZATION_ENABLE_TGT_DELEGATION\n0x048 = 0x040 + 0x008\n0x808 = 0x800 + 0x008')
body('These bits must not be conflated with selective authentication, SID filtering decisions, AllowedToAuthenticate rights, DNS reachability or Kerberos referral ticket availability. AORTA uses a controlled inbound forest trust and TGT delegation; that is a distinct scenario from observing an existing 0x808 attribute in another lab.')
h2('The AD105 field checklist')
for x in [
'Identify each forest’s DC hostnames, naming contexts and DNS SRV records from a specific source point.',
'Collect trustedDomain objects on BOTH sides of each trust. Write down trustType, trustDirection, trustAttributes and linked policy.',
'Measure whether Kali, the pivot host, and each DC can reach each other on 53/88/389/445. Include callbacks.',
'For each supplied kirbi/ccache, record principal, etype, service, flags, expiry, realm and independent discovery source.',
'Test whether a plausible NTLM relay/reflection route is blocked by SMB signing, NTLM policy, name resolution, Windows patch or reverse reachability.',
'When an RBCD/ACL edge looks exploitable, locate the exact target computer object, attribute security descriptor and source service account key.',
]:bullet(escape(x))
E.append(PageBreak())

h1('Part III — BloodHound CE beyond shortest path')
body('Shortest paths are a useful starting filter, not a proof of exploitability. The graph may omit current ACL data due to collection scope, deny messages, cross-forest boundaries, local sessions, or unsupported edge collection. For each interesting edge, gather an independent LDAP, GPO or local proof and the exact service behavior.')
for title,explain,query in [
('Reachable from proven owned objects','Investigate multiple hops without presuming the shortest path is complete. Graph ownership flags must be set only after live validation.','MATCH (n) WHERE n.owned=true MATCH p=(n)-[*1..3]->(m) RETURN p LIMIT 100'),
('RBCD relationships','AllowedToAct helps identify affected target computers; distinguish present RBCD from permission to WRITE its attribute.','MATCH (a)-[r:AllowedToAct]->(b) RETURN a.name,b.name LIMIT 100'),
('WriteAccountRestrictions','Computer-object property rights can be a lead toward delegation control, but a specific ACE and target object matter.','MATCH (a)-[r:WriteAccountRestrictions]->(b) RETURN a.name,b.name LIMIT 100'),
('WriteGPLink','A scope object may permit linking GPOs without permitting editing an existing GPO.','MATCH (a)-[r:WriteGPLink]->(b) RETURN a.name,b.name LIMIT 100'),
('Group and service relationships','Search for users with many outward edges then review types instead of assuming centrality implies control.','MATCH (u:User)-[r]->(n) RETURN u.name,count(r) AS count ORDER BY count DESC LIMIT 30'),
]:
    h2(title);body(explain);code(query)
warn('Cypher labels and property names can change across CE versions. Validate each query on the installed graph; do not describe a missing result as proof the permission is absent.')
h2('Evidence tuple for an ACL hypothesis')
code('Source principal + SID  | Target DN + objectClass\nACE (type, rights, objectType GUID, inherited scope)\nAttribute / operation planned | Current value | Proposed change\nExpected service acceptance | Actual result | Cleanup state')
E.append(PageBreak())

h1('Part IV — RBCD and Kerberos S4U')
body('Resource-based constrained delegation stores a security descriptor in msDS-AllowedToActOnBehalfOfOtherIdentity on the TARGET computer. The descriptor grants selected service identities the right to act for users toward that target. It is not the same as traditional constrained delegation or inheriting a TGT.')
for title,meaning in [
('Source principal','An account/service with a working credential or key; typically has an SPN to support S4U. If MachineAccountQuota is zero, do not assume a new computer can be created.'),
('Target computer','An actual object with a readable/writable RBCD descriptor; owner/ACE and attribute rights must be confirmed. Existing rights are independent of the service’s remote admin role.'),
('S4U2Self','Request a service ticket representing another identity to the source service, subject to the mechanism’s rules.'),
('S4U2Proxy','Use the relevant delegation permissions and S4U evidence to obtain a ticket for a target SPN such as cifs/srv02.example.'),
('Verification','A KDC-issued TGS is evidence of ticket issuance, not proof that the SMB/WinRM service authorizes remote admin access.'),
('Rollback','For write tests, preserve the original binary security descriptor, use a clean account, and restore the original value.'),
]: h2(title);body(meaning)
h2('Read-only first')
code('impacket-rbcd -action read -delegate-to TARGET$ -dc-ip DC-IP DOMAIN/user:pass\n# Observe actual msDS-AllowedToActOnBehalfOfOtherIdentity\n# Observe user rights, SPN and domain MachineAccountQuota\n# Do not perform -action write unless current ACE permits it')
h2('S4U troubleshooting by evidence')
tab([['Observed failure','Check first'],['KDC_ERR_BADOPTION','RBCD descriptor, source SPN, impersonation rights, service principal and source ticket flags.'],['KDC_ERR_S_PRINCIPAL_UNKNOWN','Correct target service SPN and realm; check duplicate/missing SPN.'],['KRB_AP_ERR_MODIFIED','Ticket encrypted for wrong account or service binding mismatch.'],['TGS obtained, access denied','Server-side ACL and local group/privileges, SPN audience or delegation restrictions.']],[165,333])
E.append(PageBreak())

h1('Part V — Authentication material, network routes and errors')
body('Never collapse all “hash/ticket” strings into one credential bucket. An NT hash may be useful only where NTLM-compatible authentication is allowed; a Kerberos AES key supports a KDC request; a TGT requests service tickets; a TGS has a specific service audience; a DCC2 cached logon verifier is not directly usable for pass-the-hash.')
tab([['Material','What it proves / does not prove'],['Password','May authenticate under account policy; does not prove privilege.'],['NT hash','NTLM-compatible credential if NTLM and account restrictions permit it.'],['AES key','Kerberos secret for a particular account/etype; obtaining TGT does not prove how key was recovered.'],['TGT / referral','Can request TGS across recognized realms, not guarantee service access.'],['TGS / CIFS silver ticket','Service-specific. Forging silver ticket needs the target SPN owner’s long-term key.'],['DCC2 cached credential','Offline verifier only; not the same as a reusable NT hash.'],['PFX/Smartcard','Requires CA trust, key match, EKU, KDC mapping and RDP credential-provider support.']],[155,343])
h2('What a packet capture does not show')
body('A tcpdump on Kali captures what traverses Kali’s interfaces. It does not prove the absence of a direct member server→jump host RDP exchange. Collect Windows event logs or instrument the host that actually receives the traffic. Also distinguish port forward/proxy availability in one direction from reverse reachability required for coercion or trust callbacks.')
h2('Symptom → minimum hypothesis test')
for x in [
'KRB_AP_ERR_SKEW: read DC time and compare; measure offsets independently for each test session.',
'KDC_ERR_POLICY / STATUS_ACCOUNT_RESTRICTION: inspect trust/authentication policy rather than retry a guessed hash.',
'WinRM accepts account but denies command: verify remote management permissions and effective remote identity.',
'SMB successful but no C$: validate local admin/ADMIN$ authorization; machine account alone is not sufficient.',
'NTLM blocked: collect NTLM operational logs and attempt Kerberos only when a usable SPN/key exists.',
'RDP smartcard fails despite PKINIT TGT: distinguish FreeRDP PKCS#11/provider and TERMSRV channel requirements.',
]:bullet(escape(x))
E.append(PageBreak())

h1('Part VI — AD CS, DPAPI and modern Windows privilege context')
h2('Private lab lessons (without active-machine spoilers)')
body('In a private lab, we observed readable roaming credential material on an AD user, recovery of a matching webmail client certificate/key, mTLS Roundcube access, a separate admin PFX, a writable altSecurityIdentities mapping (ESC14) to a smartcard-only user, and full RDP to a member server. These are separate authentication boundaries; webmail mTLS identity is not automatically an AD smartcard identity.')
body('In a private AD lab we investigated a User Rights Assignment granting a service account an unusually privileged token. The general lesson is to trace each local privilege to the applied GPO, separate local SYSTEM from domain-level rights, and track whether credentials were independently recovered or supplied by a collaborator. Details of active challenge machines remain private.')
h2('Certificate and DPAPI separation')
for x in [
'Cracking a DPAPI-protected masterkey blob yields a password candidate; the decrypted DPAPI master key is separate cryptographic material.',
'Decrypting a CAPI private key and pairing it to a certificate requires a public-key match, not merely the same subject CN.',
'A webmail mTLS client certificate authorizes the TLS handshake; application login and domain PKINIT still require distinct evidence.',
'ESC14 requires an exact altSecurityIdentities write and suitable certificate mapping; always restore original mapping after testing.',
]:bullet(escape(x))
h2('AD CS troubleshooting checks')
code('1. Was a matching private key actually recovered?\n2. Does the CA trust the issuer? What does the template allow?\n3. EKU: Client Authentication vs Smartcard Logon vs PKINIT\n4. Mapping: explicit altSecurityIdentities / SID binding / UPN\n5. Can the client obtain a TGT AND authenticate to target TERMSRV?')
h2('AORTA differs from AD105’s existing-trust investigation')
body('The AORTA research describes a controlled inbound trust with TGT delegation enabled, DNS control and coerced DC authentication to a service in the external forest, followed by recovery of a delegated machine TGT if all preconditions hold. A private AD lab final-domain access was validated with externally supplied authentication material; we did not independently create an inbound trust or retrieve the delegated TGT. In other labs, an already-present trust attribute 0x808 does not by itself prove that AORTA is feasible.')
E.append(PageBreak())

h1('Part VII — Fast decision trees and evidence discipline')
h2('After obtaining a new account')
for x in ['Validate authentication mechanism and actual realm: password, hash, AES, ticket or PFX.','Collect LDAP read access and effective groups; do not equate admin-sounding names with permissions.','Read GPO/user-right assignments and local whoami /priv if a Windows shell exists.','Run BloodHound CE and read exact LDAP ACLs for interesting edges.','Check service reachability and authentication rights separately.','Prove any privilege transition; capture the returned identity and independent resource access.','Log the provenance of each secret before moving to the next.']:bullet(escape(x))
h2('After seeing a forest trust')
for x in ['Read both sides’ TDO properties, direction and attributes.','Check SID filtering, selective auth, service AllowedToAuthenticate and realm trust relationships.','Resolve target KDC, service SPNs, TCP/UDP paths and return connections.','Separate actual delegation rights from merely possessing a trust key or referral.','Check Windows patch state for the specific relay/reflection or delegation attack under consideration.','Stop before modifying forest trusts/DNS or promoting servers without snapshots, restoration plan and authorization.']:bullet(escape(x))
h2('Investigation provenance matrix')
tab([['Category','Write down'],['VERIFIED BY US','Local path, command, date/time, output snippet and successful identity.'],['EXTERNAL CLUE','Player/article and what exactly was asserted, without silently claiming reproduction.'],['HYPOTHESIS','Condition that would make it work and cheapest disconfirming test.'],['UNRESOLVED','Missing prerequisite, wrong path, unavailable evidence or need for reset.']],[145,353])
E.append(PageBreak())

h1('Part VIII — Offline command catalog')
body(f'The bundled generator includes {len(recipes)} recipes. All previous 70 recipes remain; 55 new recipes were appended for the AD105 and private lab lessons. Entries below are syntax-reviewed candidates and must be checked against the exact Kali or Windows tool version. The HTML app offers category + phase + access + risk filters and full-text search, with contextual parameter fields.')
counts=collections.Counter(r.get('category',r['phase']) for r in recipes)
tab([['Technique category','Recipes']]+[[k,str(v)] for k,v in sorted(counts.items(),key=lambda x:x[0].lower())],[390,108])
E.append(PageBreak())
last=None
for idx,r in enumerate(recipes,1):
    phase=r.get('category',r['phase'])
    if phase!=last:
        E.append(CondPageBreak(110))
        h2(phase)
        last=phase
    E.append(CondPageBreak(110))
    h3(f'{idx:03d}  {r["title"]}  [{r["risk"].upper()}]')
    sm('<b>Purpose:</b> '+escape(r['summary']))
    sm('<b>Prerequisites:</b> '+escape(r['requires']))
    code(r['command'])
    sm('<b>Interpret:</b> '+escape(r['reading']))
    sm('<b>Next:</b> '+escape(r['next']))
    sm('<b>Reference:</b> '+escape(r['source']))

E.append(PageBreak())
h1('Sources and boundaries')
for url,why in [
('AD_Lab_Methodology_Master_Guide.pdf','User-supplied methodology guide: iterative enumeration, evidence, escalating AD permissions.'),
('ad_ultimate.pdf','User-supplied inventory: AD reconnaissance, password testing, Impacket, Kerberos and AD CS.'),
('Active_Directory_Pentest_Companion_English_v0.2.pdf','Previous companion edition; 24 baseline sections consolidated here.'),
('https://github.com/SaamNoLimits/AD105-WriteUP','External AD105 case study; public repo had an unfinished BORITO section in checked snapshot.'),
('https://plur1bu5.dev/posts/','Public SecDojo AD105 multi-forest introduction and related Windows lab articles.'),
('https://bloodhound.specterops.io/','BloodHound CE docs and schema context.'),
('https://shenaniganslabs.io/2019/01/28/Wagging-the-Dog.html','Technical foundation for RBCD and S4U.'),
('https://specterops.io/blog/2024/02/28/adcs-esc14-abuse-technique/','ESC14 attribute mapping research.'),
('https://specterops.io/blog/2025/06/25/untrustworthy-trust-builders-account-operators-replicating-trust-attack-aorta/','Cross-forest AORTA research.'),
('https://msrc.microsoft.com/update-guide/vulnerability/CVE-2025-33073','Vendor advisory for a specific SMB reflection vulnerability.'),
('https://github.com/fortra/impacket/tree/master/examples','Impacket command interfaces; verify per installed build.'),
('https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/e9a2d23c-c31e-4a6f-88a0-6646fdb51a3c','Microsoft trustAttributes documentation.'),
]:
    sm('<b>'+escape(why)+'</b> — '+escape(url))
warn('The companion neither executes commands nor authenticates to remote targets. Avoid storing real lab secrets in Git or browser-copied shell history. Do not treat a third-party solution as an independently discovered exploitation chain.')

def page(canvas,doc):
    canvas.saveState();w,h=A4
    canvas.setStrokeColor(BORDER);canvas.setLineWidth(.5);canvas.line(45,h-48,w-45,h-48)
    canvas.setFont('DVS-B',8);canvas.setFillColor(BLUE);canvas.drawString(46,h-41,'ALLAKORI  /  ACTIVE DIRECTORY PENTEST COMPANION  v0.3')
    canvas.setFont('DVS',7);canvas.setFillColor(GRAY);canvas.drawString(46,32,'RESEARCH / AUTHORIZED LABS  |  23 NOV 2026')
    canvas.drawRightString(w-46,32,str(doc.page));canvas.restoreState()

doc=SimpleDocTemplate(str(P/'Active_Directory_Pentest_Companion_v0.3.pdf'),pagesize=A4,leftMargin=46,rightMargin=46,topMargin=66,bottomMargin=48,title='Active Directory Pentest Companion v0.3',author='ALLAKORI',subject='AD105, private lab methodology, Kerberos, RBCD, BloodHound CE, trusts, and portable command reference',pageCompression=1)
doc.build(E,onFirstPage=page,onLaterPages=page)
print('PDF generated',P/'Active_Directory_Pentest_Companion_v0.3.pdf', 'recipes',len(recipes))