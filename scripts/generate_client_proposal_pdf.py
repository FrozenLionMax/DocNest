import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and render total page count
    and clean running headers/footers on all pages except the cover page.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#059669")) # Brand Emerald
        self.drawString(40, 812, "DOCNEST™ HEALTHCARE PLATFORM")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B")) # Muted Slate
        self.drawRightString(555, 812, "Commercial Proposal, System Architecture & ROI Case")
        
        # Header line
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(40, 806, 555, 806)

        # Footer line
        self.line(40, 42, 555, 42)
        self.drawString(40, 30, "Confidential — Prepared for Healthcare Leadership & Operations")
        self.drawRightString(555, 30, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename="DocNest_Commercial_Proposal_and_ROI_Case.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    PRIMARY = colors.HexColor("#0F172A")    # Slate 900
    PRIMARY_LIGHT = colors.HexColor("#1E293B")
    BRAND = colors.HexColor("#059669")      # Emerald 600
    BRAND_DARK = colors.HexColor("#065F46") # Emerald 800
    BRAND_LIGHT = colors.HexColor("#ECFDF5")# Emerald 50
    TEXT_MUTED = colors.HexColor("#475569") # Slate 600
    BORDER_LIGHT = colors.HexColor("#E2E8F0")
    BG_CARD = colors.HexColor("#F8FAFC")
    AMBER = colors.HexColor("#D97706")
    AMBER_LIGHT = colors.HexColor("#FFFBEB")
    BLUE = colors.HexColor("#2563EB")
    BLUE_LIGHT = colors.HexColor("#EFF6FF")

    # Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=21,
        leading=25,
        textColor=PRIMARY
    )
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=BRAND
    )
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=5
    )
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=BRAND_DARK,
        spaceBefore=6,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=PRIMARY
    )
    body_muted = ParagraphStyle(
        'BodyMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=TEXT_MUTED
    )
    th_style = ParagraphStyle(
        'TableHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )
    td_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.5,
        textColor=PRIMARY
    )
    td_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.5,
        textColor=PRIMARY
    )
    td_green = ParagraphStyle(
        'TableCellGreen',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.5,
        textColor=BRAND_DARK
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER, EXECUTIVE SUMMARY & 7 FUNCTIONAL MODULES
    # =========================================================================
    header_data = [
        [
            Paragraph("<b>DOCNEST™ HEALTHCARE PLATFORM</b>", title_style),
            Paragraph("<b>COMMERCIAL PROPOSAL</b><br/><font color='#059669'>REF: DN-PROP-2026-V1</font>", ParagraphStyle('MetaRight', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=12, alignment=2, textColor=PRIMARY))
        ],
        [
            Paragraph("Next-Gen Clinic Management, Real-Time OPD Queue System & Digital Health Ecosystem", subtitle_style),
            Paragraph("<b>Date:</b> October 2026<br/><b>Validity:</b> 45 Days", ParagraphStyle('MetaRight2', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, leading=10.5, alignment=2, textColor=TEXT_MUTED))
        ]
    ]
    t_header = Table(header_data, colWidths=[360, 155])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_header)
    story.append(Spacer(1, 6))

    story.append(HRFlowable(width="100%", thickness=1.5, color=BRAND, spaceBefore=0, spaceAfter=8))

    # Executive Overview Box
    exec_text = (
        "<b>EXECUTIVE OVERVIEW:</b><br/>"
        "DocNest™ is an enterprise clinical operations platform engineered specifically for clinics, polyclinics, and healthcare centers. "
        "It eliminates waiting room overcrowding, paper token chaos, handwritten prescription errors, and financial fee leakage. "
        "Built on cloud-native technology with real-time WebSockets synchronization, the platform seamlessly connects <b>Patients, Doctors, "
        "Dispensaries/Compounders, Reception Desks, and Waiting Room Smart TVs</b> without requiring expensive proprietary hardware."
    )
    exec_table = Table([[Paragraph(exec_text, body_style)]], colWidths=[515])
    exec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BRAND_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BRAND),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(exec_table)
    story.append(Spacer(1, 10))

    # Section 1 Header
    story.append(Paragraph("1. System Architecture & Complete Functional Modules", h1_style))
    story.append(Paragraph("The software delivers an end-to-end clinical workflow through 7 dedicated role-based portals:", body_muted))
    story.append(Spacer(1, 6))

    modules_data = [
        [
            Paragraph("<b>Role Module</b>", th_style),
            Paragraph("<b>Core Capabilities & Operational Functions</b>", th_style),
            Paragraph("<b>Direct Clinical Benefit</b>", th_style)
        ],
        [
            Paragraph("<b>Doctor OPD Controller</b><br/><font color='#64748B'>Web & Tablet</font>", td_bold),
            Paragraph("• Live token caller with WebSockets broadcast<br/>• Realtime patient wait-ring and queue progression<br/>• 1-click consultation status updates (Active, Paused, Done)", td_style),
            Paragraph("Saves 1.5–2 hours of doctor time daily; zero shouting in clinic.", td_green)
        ],
        [
            Paragraph("<b>Digital Rx Builder</b><br/><font color='#64748B'>Prescription Engine</font>", td_bold),
            Paragraph("• Autocomplete drug formulary with dosage regimens (1-0-1)<br/>• 1-Click WhatsApp delivery directly to patient mobile<br/>• Instant thermal print format & cloud medical history", td_style),
            Paragraph("Zero lost records; 100% legible prescriptions eliminate pharmacy dispensing errors.", td_green)
        ],
        [
            Paragraph("<b>Smart TV Lobby Display</b><br/><font color='#64748B'>Waiting Room Mode</font>", td_bold),
            Paragraph("• Fullscreen digital token display for clinic waiting areas<br/>• Automated audio chime sound on token advance<br/>• Shows current serving token, patient name & clinic branding", td_style),
            Paragraph("Cuts lobby crowding by 75%; creates modern corporate hospital ambiance.", td_green)
        ],
        [
            Paragraph("<b>Patient Web Portal</b><br/><font color='#64748B'>Mobile Responsive</font>", td_bold),
            Paragraph("• Online appointment and token booking<br/>• Remote live queue tracking from home/market<br/>• Access past digital prescriptions and family records", td_style),
            Paragraph("Reduces patient in-clinic wait from 150 min down to 15–20 min.", td_green)
        ],
        [
            Paragraph("<b>Pharmacy / Dispense</b><br/><font color='#64748B'>Compounder Portal</font>", td_bold),
            Paragraph("• Direct digital pipeline of doctor prescriptions<br/>• Order fulfillment tracking (Pending, Dispensed, Delivered)<br/>• Integration with Medicave inventory pipeline", td_style),
            Paragraph("Recovers 30%+ prescription leakage that usually walks out to external shops.", td_green)
        ],
        [
            Paragraph("<b>Reception QR Flyer</b><br/><font color='#64748B'>Desk Tool</font>", td_bold),
            Paragraph("• Dynamic printable clinic poster with embedded QR code<br/>• Walk-in patient self-service scan & queue tracking<br/>• Fast offline patient manual registration", td_style),
            Paragraph("Cuts front-desk manual registration burden by over 70%.", td_green)
        ],
        [
            Paragraph("<b>Admin & AI Auditor</b><br/><font color='#64748B'>Master Dashboard</font>", td_bold),
            Paragraph("• AI Revenue Anomaly Auditor detecting unlogged cash fees<br/>• AI Predictive Footfall & Rush Forecaster<br/>• Doctor fee reconciliation, ledger audits, and NEFT payout logs", td_style),
            Paragraph("Stops 8–10% cash leakage; gives owners total financial transparency.", td_green)
        ],
    ]
    t_modules = Table(modules_data, colWidths=[115, 260, 140])
    t_modules.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_CARD]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_modules)
    story.append(Spacer(1, 10))

    # Architecture Footnote Box
    tech_note = (
        "<b>INFRASTRUCTURE HIGHLIGHT:</b> Built on Next.js 15, PostgreSQL Realtime (Supabase), and Tailwind CSS. "
        "<b>Zero proprietary hardware required</b> — runs smoothly on existing smartphones, reception PCs, and standard Smart TVs."
    )
    t_tech = Table([[Paragraph(tech_note, body_muted)]], colWidths=[515])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BLUE_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, BLUE),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tech)

    # PAGE BREAK TO MAKE PAGE 2 CLEAN & COMPLETE
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: CLINICAL COST ANALYSIS (BEFORE VS. AFTER) & ROI METRICS
    # =========================================================================
    story.append(Paragraph("2. Financial & Operational Cost Impact (Before vs. After)", h1_style))
    story.append(Paragraph(
        "Economic analysis based on an active outpatient clinic handling ~1,000–1,200 patients/month at Rs. 300 average fee:",
        body_muted
    ))
    story.append(Spacer(1, 8))

    cost_data = [
        [
            Paragraph("<b>Operational / Expense Category</b>", th_style),
            Paragraph("<b>Before Implementation<br/>(Traditional Manual Clinic)</b>", th_style),
            Paragraph("<b>After DocNest<br/>Implementation</b>", th_style),
            Paragraph("<b>Monthly Net Benefit<br/>& Savings (INR)</b>", th_style)
        ],
        [
            Paragraph("<b>Paper Stationery & Token Slips</b>", td_bold),
            Paragraph("Rs. 2,500 – Rs. 3,500 / mo<br/><font color='#64748B'>Printed slips, counter pads, registers</font>", td_style),
            Paragraph("Rs. 300 – Rs. 500 / mo<br/><font color='#059669'>Digital tokens & QR self-scan</font>", td_style),
            Paragraph("<b>Save: Rs. 2,500 / mo</b><br/><font color='#059669'>85% paper cost reduction</font>", td_green)
        ],
        [
            Paragraph("<b>Front-Desk Staff Overhead</b>", td_bold),
            Paragraph("Rs. 18,000 – Rs. 22,000 / mo<br/><font color='#64748B'>2 clerks for line calling & manual logs</font>", td_style),
            Paragraph("Rs. 10,000 / mo<br/><font color='#059669'>1 coordinator (multitasking)</font>", td_style),
            Paragraph("<b>Save: Rs. 10,000 / mo</b><br/><font color='#059669'>50% staff overhead savings</font>", td_green)
        ],
        [
            Paragraph("<b>Prescription Pads & Archiving</b>", td_bold),
            Paragraph("Rs. 3,000 – Rs. 4,000 / mo<br/><font color='#64748B'>Printed letterheads & physical files</font>", td_style),
            Paragraph("Rs. 0 – Rs. 400 / mo<br/><font color='#059669'>Digital Rx & secure cloud storage</font>", td_style),
            Paragraph("<b>Save: Rs. 3,200 / mo</b><br/><font color='#059669'>90% document savings</font>", td_green)
        ],
        [
            Paragraph("<b>Unrecorded Fee Leakage</b><br/><font color='#D97706'>Cash Collection Discrepancies</font>", td_bold),
            Paragraph("Rs. 20,000 – Rs. 28,000 / mo<br/><font color='#64748B'>~8% of gross fees lost to manual gaps</font>", td_style),
            Paragraph("Rs. 1,000 – Rs. 2,000 / mo<br/><font color='#059669'>AI Anomaly Auditor logs all tokens</font>", td_style),
            Paragraph("<b>Recover: ~Rs. 22,000 / mo</b><br/><font color='#059669'>Direct recovered revenue</font>", td_green)
        ],
        [
            Paragraph("<b>Pharmacy Prescription Leakage</b><br/><font color='#D97706'>Walkouts to External Chemists</font>", td_bold),
            Paragraph("Rs. 25,000 – Rs. 32,000 / mo<br/><font color='#64748B'>35% patients leave clinic pharmacy</font>", td_style),
            Paragraph("Rs. 6,000 – Rs. 8,000 / mo<br/><font color='#059669'>Digital Rx directly sent to dispensary</font>", td_style),
            Paragraph("<b>Gain: ~Rs. 20,000 / mo</b><br/><font color='#059669'>Retained dispensary profit</font>", td_green)
        ],
        [
            Paragraph("<b>Patient Drop-Offs & No-Shows</b>", td_bold),
            Paragraph("~15–20% patients walk away<br/><font color='#64748B'>Frustrated by 2-3 hour wait times</font>", td_style),
            Paragraph("&lt; 3% drop-offs<br/><font color='#059669'>Remote token tracking on phone</font>", td_style),
            Paragraph("<b>Recover: ~Rs. 17,000 / mo</b><br/><font color='#059669'>Consultation fees saved</font>", td_green)
        ],
        [
            Paragraph("<b>Software & Cloud Maintenance</b>", td_bold),
            Paragraph("Rs. 0 / mo (No software)", td_style),
            Paragraph("Rs. 2,500 / mo (Cloud & hosting)", td_style),
            Paragraph("Net cost: -Rs. 2,500 / mo", td_style)
        ],
    ]
    t_cost = Table(cost_data, colWidths=[125, 130, 130, 130])
    t_cost.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_CARD]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_cost)
    story.append(Spacer(1, 10))

    # Net ROI Summary Banner
    roi_summary_data = [
        [
            Paragraph("<b>DIRECT EXPENSE SAVINGS:</b><br/><font color='#065F46' size='10'><b>Rs. 15,700 / month</b></font>", ParagraphStyle('R1', parent=td_style, alignment=1)),
            Paragraph("<b>RECOVERED REVENUE:</b><br/><font color='#065F46' size='10'><b>Rs. 59,000 / month</b></font>", ParagraphStyle('R2', parent=td_style, alignment=1)),
            Paragraph("<b>NET CLINICAL GAIN:</b><br/><font color='#059669' size='11'><b>+Rs. 72,200 / month</b></font>", ParagraphStyle('R3', parent=td_style, alignment=1))
        ]
    ]
    t_roi = Table(roi_summary_data, colWidths=[170, 175, 170])
    t_roi.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BRAND_LIGHT),
        ('BOX', (0,0), (-1,-1), 1.2, BRAND),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_roi)
    story.append(Spacer(1, 14))

    # KPI Transformation Metrics
    story.append(Paragraph("Clinical Efficiency & Experience Benchmarks", h2_style))
    kpi_data = [
        [
            Paragraph("<b>Average Patient In-Clinic Wait Time</b><br/>Before: 120 – 180 Minutes<br/><b>After DocNest: 15 – 25 Minutes (85% Faster)</b>", td_style),
            Paragraph("<b>Doctor Daily Documentation Time</b><br/>Before: ~75 Hours / month on paper<br/><b>After DocNest: ~20 Hours / month (Saves 55 hrs)</b>", td_style)
        ],
        [
            Paragraph("<b>Prescription Record Accuracy</b><br/>Before: &lt;10% stored (frequent lost slips)<br/><b>After DocNest: 100% digital cloud & WhatsApp</b>", td_style),
            Paragraph("<b>Pharmacy In-House Retention</b><br/>Before: ~60% capture rate<br/><b>After DocNest: 90%+ retained within clinic</b>", td_style)
        ]
    ]
    t_kpi = Table(kpi_data, colWidths=[255, 260])
    t_kpi.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_kpi)

    # PAGE BREAK TO MAKE PAGE 3 CLEAN & COMPLETE
    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: COMMERCIAL PACKAGES, TIMELINE & APPROVAL SIGN-OFF
    # =========================================================================
    story.append(Paragraph("3. Commercial Investment Quotation & Package Options", h1_style))
    story.append(Paragraph("Choose from 3 customized implementation packages based on your clinical scale:", body_muted))
    story.append(Spacer(1, 6))

    pkg_data = [
        [
            Paragraph("<b>Package Tier</b>", th_style),
            Paragraph("<b>Scope of Deliverables & Inclusions</b>", th_style),
            Paragraph("<b>One-Time Setup Fee</b>", th_style),
            Paragraph("<b>Monthly Support (AMC)</b>", th_style)
        ],
        [
            Paragraph("<b>OPTION 1: STANDARD</b><br/><font color='#64748B'>Core Clinic Package</font>", td_bold),
            Paragraph(
                "• Doctor OPD Queue Controller + Patient Booking Web App<br/>"
                "• Digital Prescription Builder with 1-Click WhatsApp delivery<br/>"
                "• Waiting Room Smart TV Lobby Display mode<br/>"
                "• Reception Desk QR Flyer custom branding<br/>"
                "• Production Cloud Deployment (Vercel + Supabase Database)",
                td_style
            ),
            Paragraph("<b>Rs. 1,49,000</b><br/><font color='#64748B'>One-time fee</font>", td_bold),
            Paragraph("<b>Rs. 5,000 / mo</b><br/><font color='#64748B'>Cloud maintenance, backups & bug fixes</font>", td_style)
        ],
        [
            Paragraph("<b>OPTION 2: PROFESSIONAL</b><br/><font color='#059669'><b>★ RECOMMENDED</b></font><br/><font color='#64748B'>Polyclinic / Hospital Center</font>", td_bold),
            Paragraph(
                "• <b>All Standard features included</b><br/>"
                "• In-house Pharmacy / Compounder Dispensing Dashboard<br/>"
                "• <b>AI Revenue Anomaly Auditor</b> (cash leakage detection)<br/>"
                "• <b>AI Footfall Rush Forecaster</b> (staffing & token prediction)<br/>"
                "• Multi-Doctor support (up to 5 doctors under one roof)<br/>"
                "• <b>90 Days Comprehensive On-Site/Remote Warranty</b>",
                td_style
            ),
            Paragraph("<b>Rs. 2,89,000</b><br/><font color='#059669'>Best Value ROI</font>", ParagraphStyle('RecPrice', parent=td_bold, textColor=BRAND_DARK, fontSize=9)),
            Paragraph("<b>Rs. 12,000 / mo</b><br/><font color='#64748B'>Priority SLA support, monthly database audits</font>", td_style)
        ],
        [
            Paragraph("<b>OPTION 3: ENTERPRISE</b><br/><font color='#64748B'>District SaaS Network</font>", td_bold),
            Paragraph(
                "• <b>All Professional features included</b><br/>"
                "• Full District Network: Village CSC Mitras & Block coordinators<br/>"
                "• React Native / Expo Mobile App Build (Android APK)<br/>"
                "• Unlimited Doctors, Clinics & Multi-Branch Support<br/>"
                "• Complete Source Code & Intellectual Property Handover",
                td_style
            ),
            Paragraph("<b>Rs. 5,49,000</b><br/><font color='#64748B'>Full Enterprise IP</font>", td_bold),
            Paragraph("<b>Rs. 25,000 / mo</b><br/><font color='#64748B'>Dedicated engineer support, custom features</font>", td_style)
        ],
    ]
    t_pkg = Table(pkg_data, colWidths=[120, 225, 95, 75])
    t_pkg.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('BACKGROUND', (0,2), (-1,2), BRAND_LIGHT),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_pkg)
    story.append(Spacer(1, 8))

    # SaaS Alternative Callout
    saas_alt = (
        "<b>ALTERNATIVE ZERO-RISK SAAS SUBSCRIPTION MODEL:</b> "
        "Prefer to avoid upfront capital expenditure? Opt for the <b>DocNest Cloud SaaS Model</b>: "
        "<b>Rs. 35,000 One-time Setup & Onboarding Fee</b> + <b>Rs. 4,500 / month per doctor</b> (or a 12% revenue share on online bookings). "
        "Includes ongoing cloud hosting, updates, and customer support with zero lock-in."
    )
    t_saas = Table([[Paragraph(saas_alt, body_style)]], colWidths=[515])
    t_saas.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), AMBER_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, AMBER),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_saas)
    story.append(Spacer(1, 10))

    # Section 4: Implementation Schedule
    story.append(Paragraph("4. Implementation Timeline & Commercial Terms", h1_style))
    story.append(Spacer(1, 4))

    timeline_data = [
        [
            Paragraph("<b>Phase & Milestone</b>", th_style),
            Paragraph("<b>Timeline</b>", th_style),
            Paragraph("<b>Deliverable Scope</b>", th_style),
            Paragraph("<b>Payment Milestone</b>", th_style)
        ],
        [
            Paragraph("<b>Phase 1: Setup & Cloud Provisioning</b>", td_bold),
            Paragraph("Week 1", td_style),
            Paragraph("Database schema setup, Supabase Realtime configuration, Vercel production hosting link", td_style),
            Paragraph("40% Advance on Agreement Signing", td_bold)
        ],
        [
            Paragraph("<b>Phase 2: Customization & Onboarding</b>", td_bold),
            Paragraph("Week 2", td_style),
            Paragraph("Doctor credentials, OPD timing schedules, drug formulary setup, custom clinic branding", td_style),
            Paragraph("30% on User Acceptance Testing (UAT)", td_style)
        ],
        [
            Paragraph("<b>Phase 3: Staff Training & TV Hardware Sync</b>", td_bold),
            Paragraph("Week 3", td_style),
            Paragraph("Receptionist training, TV lobby display HDMI pairing, QR reception flyer printing test", td_style),
            Paragraph("20% on Live System Launch", td_style)
        ],
        [
            Paragraph("<b>Phase 4: Warranty & Optimization</b>", td_bold),
            Paragraph("30–90 Days", td_style),
            Paragraph("Live queue monitoring, speed optimization, staff query support, AI auditor calibration", td_style),
            Paragraph("10% Retention after 30 days live", td_style)
        ],
    ]
    t_timeline = Table(timeline_data, colWidths=[140, 60, 215, 100])
    t_timeline.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_CARD]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_timeline)
    story.append(Spacer(1, 10))

    # Formal Sign-off box
    sign_data = [
        [
            Paragraph("<b>SUBMITTED BY:</b><br/>DocNest Software Architecture & Engineering Team<br/>Email: contact@docnest.in | Mobile: +91 98765 43210", td_style),
            Paragraph("<b>ACCEPTED & APPROVED BY:</b><br/>Authorized Client Representative / Clinic Director<br/>Signature: _______________________ Date: ________", td_style)
        ]
    ]
    t_sign = Table(sign_data, colWidths=[255, 260])
    t_sign.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, BORDER_LIGHT),
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_sign)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF Generated at: {filename}")

if __name__ == "__main__":
    output_pdf = os.path.join(os.getcwd(), "DocNest_Commercial_Proposal_and_ROI_Case.pdf")
    build_pdf(output_pdf)
