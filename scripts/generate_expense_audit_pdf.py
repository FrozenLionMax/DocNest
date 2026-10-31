import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class ExpenseNumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and render total page count
    with a clean medical theme header and footer.
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
        self.setFillColor(colors.HexColor("#0D9488")) # Medical Teal
        self.drawString(36, 812, "DOCNEST™ CLINICAL SOFTWARE — DETAILED EXPENSE AUDIT")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B")) # Slate 500
        self.drawRightString(559, 812, "Function-by-Function Cost & Hostinger Server Operating Expenses")
        
        # Header hairline
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(36, 806, 559, 806)

        # Footer hairline
        self.line(36, 36, 559, 36)
        self.drawString(36, 25, "Confidential — Prepared for Clinic Director & Financial Operations")
        self.drawRightString(559, 25, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_expense_pdf(filename="DocNest_Technology_and_Running_Expense_Audit.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=44,
        bottomMargin=42
    )

    styles = getSampleStyleSheet()

    # Premium Clinical Color Palette
    PRIMARY = colors.HexColor("#0F172A")       # Slate 900
    TEAL = colors.HexColor("#0D9488")          # Medical Teal 600
    TEAL_DARK = colors.HexColor("#115E59")     # Teal 800
    TEAL_LIGHT = colors.HexColor("#F0FDFA")    # Teal 50
    EMERALD = colors.HexColor("#059669")       # Green 600
    EMERALD_LIGHT = colors.HexColor("#ECFDF5") # Green 50
    TEXT_MUTED = colors.HexColor("#475569")    # Slate 600
    BORDER_LIGHT = colors.HexColor("#E2E8F0")  # Slate 200
    BG_CARD = colors.HexColor("#F8FAFC")       # Slate 50
    AMBER = colors.HexColor("#D97706")         # Amber 600
    AMBER_LIGHT = colors.HexColor("#FFFBEB")   # Amber 50
    BLUE = colors.HexColor("#2563EB")          # Blue 600
    BLUE_LIGHT = colors.HexColor("#EFF6FF")    # Blue 50

    # Typography Styles
    title_style = ParagraphStyle(
        'ExpTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=19,
        leading=23,
        textColor=PRIMARY
    )
    subtitle_style = ParagraphStyle(
        'ExpSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEAL
    )
    h1_style = ParagraphStyle(
        'ExpH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14.5,
        textColor=PRIMARY,
        spaceBefore=6,
        spaceAfter=3
    )
    body_style = ParagraphStyle(
        'ExpBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11.2,
        textColor=PRIMARY
    )
    body_muted = ParagraphStyle(
        'ExpMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=10,
        textColor=TEXT_MUTED
    )
    th_style = ParagraphStyle(
        'ExpTH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.white
    )
    td_style = ParagraphStyle(
        'ExpTD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=10,
        textColor=PRIMARY
    )
    td_bold = ParagraphStyle(
        'ExpTDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=10,
        textColor=PRIMARY
    )
    td_green = ParagraphStyle(
        'ExpTDGreen',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=10,
        textColor=TEAL_DARK
    )

    story = []

    # =========================================================================
    # PAGE 1: HOSTINGER IMPACT & FUNCTION-BY-FUNCTION MAKING COST
    # =========================================================================

    # Title & Document Meta Header
    header_data = [
        [
            Paragraph("<b>DOCNEST™ CLINICAL SOFTWARE EXPENSE AUDIT</b>", title_style),
            Paragraph("<b>COMMERCIAL AUDIT</b><br/><font color='#0D9488'>REF: EXP-AUDIT-2026-H</font>", ParagraphStyle('MetaRight', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=11, alignment=2, textColor=PRIMARY))
        ],
        [
            Paragraph("Function-by-Function Creation Costs & Hostinger Server Operating Expenses", subtitle_style),
            Paragraph("<b>Date:</b> October 2026<br/><b>Deployment:</b> Hostinger Server", ParagraphStyle('MetaRight2', parent=styles['Normal'], fontName='Helvetica', fontSize=7.2, leading=10, alignment=2, textColor=TEXT_MUTED))
        ]
    ]
    t_header = Table(header_data, colWidths=[370, 153])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_header)
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1.5, color=TEAL, spaceBefore=0, spaceAfter=5))

    # Hostinger Server Financial Benefit Box
    hostinger_banner = (
        "<b>SPECIAL HOSTINGER INFRASTRUCTURE BENEFIT:</b> "
        "Because the clinic owner already owns a server in <b>Hostinger</b>, the software will be deployed directly onto their existing server! "
        "This completely eliminates third-party cloud hosting fees (saving <b>~Rs. 1,680 / month</b>) and provides <b>Free Lifetime SSL Security</b>, "
        "unlimited patient bandwidth, and automated server snapshots at <b>Rs. 0 additional hosting cost</b>."
    )
    t_host = Table([[Paragraph(hostinger_banner, body_style)]], colWidths=[523])
    t_host.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), TEAL_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, TEAL),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_host)
    story.append(Spacer(1, 5))

    # Section 1: Function-by-Function Cost of Making
    story.append(Paragraph("1. Cost of Making (Development & Engineering) — Function by Function", h1_style))
    story.append(Paragraph("One-time custom software engineering value broken down module by module:", body_muted))
    story.append(Spacer(1, 3))

    making_data = [
        [
            Paragraph("<b>#</b>", th_style),
            Paragraph("<b>Clinical Function / Module</b>", th_style),
            Paragraph("<b>What is Engineered in This Function</b>", th_style),
            Paragraph("<b>One-Time Value</b>", th_style)
        ],
        [
            Paragraph("<b>1</b>", td_bold),
            Paragraph("<b>Doctor OPD Live Token Controller</b><br/><font color='#64748B'>Consultation Chamber</font>", td_bold),
            Paragraph("Real-time token caller, audio chime synthesizer, pause/resume OPD, skip patient, reset queue counter, instant waiting-ring progression.", td_style),
            Paragraph("<b>Rs. 25,000 – 35,000</b>", td_green)
        ],
        [
            Paragraph("<b>2</b>", td_bold),
            Paragraph("<b>Digital Prescription (Rx) Builder</b><br/><font color='#64748B'>Prescription Engine</font>", td_bold),
            Paragraph("Pre-loaded drug formulary autocomplete, standardized dose schedules (1-0-1, After food), diagnosis templates, thermal print formatting.", td_style),
            Paragraph("<b>Rs. 30,000 – 40,000</b>", td_green)
        ],
        [
            Paragraph("<b>3</b>", td_bold),
            Paragraph("<b>1-Click WhatsApp Prescription Delivery</b><br/><font color='#64748B'>Mobile Sharing Engine</font>", td_bold),
            Paragraph("Direct WhatsApp messaging hook delivering formatted digital prescriptions with clinic header, medicines, advice & follow-up dates to patient phone.", td_style),
            Paragraph("<b>Rs. 15,000 – 20,000</b>", td_green)
        ],
        [
            Paragraph("<b>4</b>", td_bold),
            Paragraph("<b>Waiting Room Smart TV Display</b><br/><font color='#64748B'>Lobby Monitor Mode</font>", td_bold),
            Paragraph("Fullscreen 1080p kiosk interface, real-time WebSocket token listener, audio chime integration, live doctor status & clinic branding.", td_style),
            Paragraph("<b>Rs. 15,000 – 22,000</b>", td_green)
        ],
        [
            Paragraph("<b>5</b>", td_bold),
            Paragraph("<b>Reception Desk & Dynamic QR Flyer</b><br/><font color='#64748B'>Front Desk Counter</font>", td_bold),
            Paragraph("5-Second walk-in token generation, dynamic SVG/Canvas QR poster generator for reception desk self-service queue tracking.", td_style),
            Paragraph("<b>Rs. 15,000 – 20,000</b>", td_green)
        ],
        [
            Paragraph("<b>6</b>", td_bold),
            Paragraph("<b>In-House Pharmacy Dispensing Portal</b><br/><font color='#64748B'>Compounder Screen</font>", td_bold),
            Paragraph("Live prescription ingestion from doctor cabin, medicine checklist, status flags (Pending, Dispensed), and automatic total billing calculator.", td_style),
            Paragraph("<b>Rs. 22,000 – 30,000</b>", td_green)
        ],
        [
            Paragraph("<b>7</b>", td_bold),
            Paragraph("<b>Patient Web Portal & Mobile Tracker</b><br/><font color='#64748B'>Patient Self-Service</font>", td_bold),
            Paragraph("Mobile-first responsive portal, doctor search, appointment slot booking, live token progress ring from home/market, past prescription history.", td_style),
            Paragraph("<b>Rs. 25,000 – 35,000</b>", td_green)
        ],
        [
            Paragraph("<b>8</b>", td_bold),
            Paragraph("<b>AI Cash Fee Ledger & Anomaly Auditor</b><br/><font color='#64748B'>Financial Audit</font>", td_bold),
            Paragraph("Reconciliation algorithm cross-verifying doctor token advancements against front-desk cash receipts to catch uncollected/leaked fees.", td_style),
            Paragraph("<b>Rs. 20,000 – 28,000</b>", td_green)
        ],
        [
            Paragraph("<b>9</b>", td_bold),
            Paragraph("<b>Doctor Schedule, Shifts & Leave Manager</b><br/><font color='#64748B'>Timings & Holidays</font>", td_bold),
            Paragraph("Morning and evening shift slot configuration, holiday lockouts, emergency leave broadcast to patient web portal.", td_style),
            Paragraph("<b>Rs. 12,000 – 16,000</b>", td_green)
        ],
        [
            Paragraph("<b>10</b>", td_bold),
            Paragraph("<b>Admin Dashboard & Role Security (RBAC)</b><br/><font color='#64748B'>Master Control</font>", td_bold),
            Paragraph("Multi-role security guards (Doctor, Compounder, Receptionist, Admin), doctor verification, revenue analytics, and bank payout logs.", td_style),
            Paragraph("<b>Rs. 18,000 – 25,000</b>", td_green)
        ],
    ]
    t_making = Table(making_data, colWidths=[18, 140, 265, 100])
    t_making.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_CARD]),
        ('TOPPADDING', (0,0), (-1,-1), 2.8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.8),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_making)
    story.append(Spacer(1, 5))

    # Packaged Setup Pricing Summary Bar
    pkg_summary_data = [
        [
            Paragraph("<b>ESSENTIAL CLINIC SETUP (Functions 1-5, 7, 9):</b><br/><font color='#0D9488' size='9'><b>Rs. 1,25,000 (One-Time)</b></font>", ParagraphStyle('P1', parent=td_style, alignment=1)),
            Paragraph("<b>FULL POLYCLINIC + PHARMACY (All 10 Functions):</b><br/><font color='#065F46' size='9'><b>Rs. 2,45,000 (Recommended)</b></font>", ParagraphStyle('P2', parent=td_style, alignment=1)),
            Paragraph("<b>ZERO-RISK MONTHLY PLAN:</b><br/><font color='#D97706' size='9'><b>Rs. 25,000 Setup + Rs. 4,000 / mo</b></font>", ParagraphStyle('P3', parent=td_style, alignment=1))
        ]
    ]
    t_pkg_sum = Table(pkg_summary_data, colWidths=[170, 183, 170])
    t_pkg_sum.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('BOX', (0,0), (-1,-1), 1, BORDER_LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_pkg_sum)

    # PAGE BREAK TO MAKE PAGE 2 CLEAN & COMPLETE
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: GRANULAR MINOR-TO-MINOR RUNNING EXPENSES & SIGN-OFF
    # =========================================================================
    story.append(Paragraph("2. Granular Running Expenses & Fees (Minors to Minors)", h1_style))
    story.append(Paragraph(
        "Line-by-line operating expenses for a busy polyclinic handling ~1,500–2,500 patients/month, deployed on Hostinger:",
        body_muted
    ))
    story.append(Spacer(1, 3))

    running_data = [
        [
            Paragraph("<b>#</b>", th_style),
            Paragraph("<b>Expense Line Item</b>", th_style),
            Paragraph("<b>Provider / Mechanism</b>", th_style),
            Paragraph("<b>Billing Basis / How it Charges</b>", th_style),
            Paragraph("<b>Monthly Cost (INR)</b>", th_style)
        ],
        [
            Paragraph("<b>1</b>", td_bold),
            Paragraph("<b>Web Application Server</b>", td_bold),
            Paragraph("Owner's Hostinger Server", td_style),
            Paragraph("Runs via Node.js / PM2 / Nginx on owner's existing server", td_style),
            Paragraph("<b>Rs. 0 / mo (SAVED)</b>", td_green)
        ],
        [
            Paragraph("<b>2</b>", td_bold),
            Paragraph("<b>SSL Security (HTTPS Padlock)</b>", td_bold),
            Paragraph("Hostinger / Let's Encrypt", td_style),
            Paragraph("Auto-renewing 256-bit medical data encryption certificate", td_style),
            Paragraph("<b>Rs. 0 / mo (Free)</b>", td_green)
        ],
        [
            Paragraph("<b>3</b>", td_bold),
            Paragraph("<b>Clinic Domain Name (`.com`/`.in`)</b>", td_bold),
            Paragraph("Hostinger / GoDaddy", td_style),
            Paragraph("Annual renewal ~Rs. 1,020 prorated monthly", td_style),
            Paragraph("Rs. 85 / mo", td_style)
        ],
        [
            Paragraph("<b>4</b>", td_bold),
            Paragraph("<b>Real-Time Live Token Database</b>", td_bold),
            Paragraph("Supabase PostgreSQL", td_style),
            Paragraph("Free tier up to 50k users (Rs. 0) OR Pro dedicated backups ($25)", td_style),
            Paragraph("<b>Rs. 0 – Rs. 2,100 / mo</b>", td_style)
        ],
        [
            Paragraph("<b>5</b>", td_bold),
            Paragraph("<b>WhatsApp Prescription Delivery</b>", td_bold),
            Paragraph("Direct Web Protocol", td_style),
            Paragraph("Opens pre-formatted Rx directly from doctor's phone WhatsApp", td_style),
            Paragraph("<b>Rs. 0 / mo (100% Free)</b>", td_green)
        ],
        [
            Paragraph("<b>6</b>", td_bold),
            Paragraph("<b>*Optional: Meta WhatsApp API</b>", td_bold),
            Paragraph("Meta Cloud API (Background)", td_style),
            Paragraph("Rs. 0.41/msg for ~1,500 automated background messages", td_style),
            Paragraph("~Rs. 615 / mo (Optional)", td_style)
        ],
        [
            Paragraph("<b>7</b>", td_bold),
            Paragraph("<b>Fallback SMS (Keypad Phones)</b>", td_bold),
            Paragraph("Fast2SMS / MSG91", td_style),
            Paragraph("Transactional SMS for ~150 elderly patients without WhatsApp", td_style),
            Paragraph("Rs. 30 / mo", td_style)
        ],
        [
            Paragraph("<b>8</b>", td_bold),
            Paragraph("<b>Payment Gateway: UPI (GPay/PhonePe)</b>", td_bold),
            Paragraph("Razorpay / Cashfree", td_style),
            Paragraph("Mandated 0% transaction fee by RBI on all UPI transactions", td_style),
            Paragraph("<b>Rs. 0 / mo (100% Free)</b>", td_green)
        ],
        [
            Paragraph("<b>9</b>", td_bold),
            Paragraph("<b>Payment Gateway: Card Fee (MDR)</b>", td_bold),
            Paragraph("Razorpay", td_style),
            Paragraph("2.36% fee *only* if patient pays by Credit Card (~Rs. 15,000 volume)", td_style),
            Paragraph("~Rs. 354 / mo", td_style)
        ],
        [
            Paragraph("<b>10</b>", td_bold),
            Paragraph("<b>Daily Automated Cloud Backups</b>", td_bold),
            Paragraph("Hostinger + Supabase PITR", td_style),
            Paragraph("Daily snapshots of all prescriptions and financial records", td_style),
            Paragraph("<b>Rs. 0 / mo (Included)</b>", td_green)
        ],
        [
            Paragraph("<b>11</b>", td_bold),
            Paragraph("<b>Waiting Room TV Electricity</b>", td_bold),
            Paragraph("UPPCL Commercial Tariff", td_style),
            Paragraph("43\" LED TV running 8 hrs/day × 26 days (10.4 units @ Rs. 8.50)", td_style),
            Paragraph("Rs. 88 / mo", td_style)
        ],
        [
            Paragraph("<b>12</b>", td_bold),
            Paragraph("<b>Fire TV Stick Amortization</b>", td_bold),
            Paragraph("Amazon Hardware", td_style),
            Paragraph("Rs. 2,999 hardware cost amortized across 36-month lifespan", td_style),
            Paragraph("Rs. 83 / mo", td_style)
        ],
        [
            Paragraph("<b>13</b>", td_bold),
            Paragraph("<b>Clinic Broadband Wi-Fi Share</b>", td_bold),
            Paragraph("Broadband (Jio / Airtel)", td_style),
            Paragraph("Prorated software bandwidth consumption (<3 GB / month)", td_style),
            Paragraph("Rs. 100 / mo", td_style)
        ],
        [
            Paragraph("<b>14</b>", td_bold),
            Paragraph("<b>Thermal Paper Rolls (Walk-ins)</b>", td_bold),
            Paragraph("Local Stationery", td_style),
            Paragraph("2 paper rolls/month for optional printed slips for elderly patients", td_style),
            Paragraph("Rs. 60 / mo", td_style)
        ],
        [
            Paragraph("<b>15</b>", td_bold),
            Paragraph("<b>Developer Maintenance & SLA Support</b>", td_bold),
            Paragraph("Engineering Partner", td_style),
            Paragraph("Hostinger server updates, staff support, drug formulary changes", td_style),
            Paragraph("<b>Rs. 4,000 – 5,000 / mo</b>", td_bold)
        ],
    ]
    t_running = Table(running_data, colWidths=[15, 130, 110, 188, 80])
    t_running.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_CARD]),
        ('TOPPADDING', (0,0), (-1,-1), 2.2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.2),
        ('LEFTPADDING', (0,0), (-1,-1), 3),
        ('RIGHTPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_running)
    story.append(Spacer(1, 4))

    # Hostinger Deployment Options Card
    host_options = (
        "<b>TWO HOSTINGER DEPLOYMENT OPTIONS FOR THE CLINIC:</b><br/>"
        "• <b>OPTION A (Hybrid — Recommended):</b> Web App on Hostinger (Rs. 0) + Supabase Realtime DB in Mumbai AWS (Rs. 0–2,100). Total monthly running: <b>~Rs. 2,800 + Developer Support</b>.<br/>"
        "• <b>OPTION B (100% Self-Hosted on Hostinger VPS):</b> Both Web App & Database installed directly on Hostinger VPS via Docker. Direct Web WhatsApp. Total monthly third-party cloud bill: <b>LITERALLY Rs. 0!</b>"
    )
    t_hopt = Table([[Paragraph(host_options, body_style)]], colWidths=[523])
    t_hopt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), EMERALD_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, EMERALD),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_hopt)
    story.append(Spacer(1, 4))

    # Grand Total Monthly Comparison Banner
    grand_data = [
        [
            Paragraph("<b>WITHOUT HOSTINGER:</b><br/><font color='#D97706' size='8.5'>Cloud Bills: ~Rs. 4,874 / mo</font>", ParagraphStyle('G1', parent=td_style, alignment=1)),
            Paragraph("<b>WITH HOSTINGER (OPTION A):</b><br/><font color='#0D9488' size='8.5'>Cloud Bills: ~Rs. 700 – 2,800 / mo</font>", ParagraphStyle('G2', parent=td_style, alignment=1)),
            Paragraph("<b>WITH HOSTINGER (OPTION B):</b><br/><font color='#065F46' size='9'><b>Third-Party Cloud Bills: Rs. 0 / mo</b></font>", ParagraphStyle('G3', parent=td_style, alignment=1))
        ]
    ]
    t_grand = Table(grand_data, colWidths=[170, 183, 170])
    t_grand.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('BOX', (0,0), (-1,-1), 1, BORDER_LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_grand)
    story.append(Spacer(1, 5))

    # Formal Sign-Off Box
    sign_data = [
        [
            Paragraph("<b>PREPARED & AUDITED BY:</b><br/>DocNest Software Engineering Team<br/>Technical Support: contact@docnest.in | Mobile: +91 98765 43210", td_style),
            Paragraph("<b>ACCEPTED & APPROVED BY:</b><br/>Clinic Director / Doctor Signature: _______________________<br/>Clinic Name: __________________________ Date: _________", td_style)
        ]
    ]
    t_sign = Table(sign_data, colWidths=[260, 263])
    t_sign.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, BORDER_LIGHT),
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_sign)

    doc.build(story, canvasmaker=ExpenseNumberedCanvas)
    print(f"[SUCCESS] Expense Audit PDF Generated at: {filename}")

if __name__ == "__main__":
    output_pdf = os.path.join(os.getcwd(), "DocNest_Technology_and_Running_Expense_Audit.pdf")
    build_expense_pdf(output_pdf)
