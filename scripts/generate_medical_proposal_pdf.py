import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class MedicalNumberedCanvas(canvas.Canvas):
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
        # Top running bar
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0D9488")) # Medical Teal
        self.drawString(36, 812, "DOCNEST™ CLINICAL SOFTWARE SUITE")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B")) # Slate 500
        self.drawRightString(559, 812, "Smart Clinic Management & OPD Queue Software Proposal")
        
        # Header hairline
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(36, 806, 559, 806)

        # Footer hairline
        self.line(36, 36, 559, 36)
        self.drawString(36, 25, "Confidential — Prepared for Clinic Director & Medical Leadership")
        self.drawRightString(559, 25, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_medical_proposal(filename="DocNest_Clinic_Software_Proposal.pdf"):
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
    PRIMARY = colors.HexColor("#0F172A")       # Deep Slate
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

    # Custom Typography Styles (Doctor-Friendly)
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEAL
    )
    h1_style = ParagraphStyle(
        'DocH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=PRIMARY,
        spaceBefore=7,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=PRIMARY
    )
    body_muted = ParagraphStyle(
        'DocMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=TEXT_MUTED
    )
    th_style = ParagraphStyle(
        'DocTH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.5,
        textColor=colors.white
    )
    td_style = ParagraphStyle(
        'DocTD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=PRIMARY
    )
    td_bold = ParagraphStyle(
        'DocTDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=PRIMARY
    )
    td_green = ParagraphStyle(
        'DocTDGreen',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=TEAL_DARK
    )

    story = []

    # =========================================================================
    # PAGE 1: MEDICAL CLINIC VALUE, TOUCHPOINTS & OPD WORKFLOW
    # =========================================================================

    # Title & Metadata Row
    header_data = [
        [
            Paragraph("<b>DOCNEST™ DIGITAL CLINIC SUITE</b>", title_style),
            Paragraph("<b>PROPOSAL & TECH QUOTATION</b><br/><font color='#0D9488'>REF: MED-CLINIC-2026</font>", ParagraphStyle('MetaRight', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=11, alignment=2, textColor=PRIMARY))
        ],
        [
            Paragraph("Smart OPD Queue Management, Digital Prescriptions (Rx) & Reception Automation", subtitle_style),
            Paragraph("<b>Date:</b> October 2026<br/><b>Valid for:</b> 45 Days", ParagraphStyle('MetaRight2', parent=styles['Normal'], fontName='Helvetica', fontSize=7.2, leading=10, alignment=2, textColor=TEXT_MUTED))
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
    story.append(HRFlowable(width="100%", thickness=1.5, color=TEAL, spaceBefore=0, spaceAfter=6))

    # Doctor-Friendly Introduction Callout Box
    doctor_intro = (
        "<b>CLINICAL OVERVIEW FOR DOCTORS & CLINIC DIRECTORS:</b><br/>"
        "DocNest™ is specialized software built for doctors to make daily clinic operations smooth, organized, and peaceful. "
        "It eliminates waiting room overcrowding, patient arguments over tokens, lost paper slips, and illegible handwriting errors. "
        "With one unified software, your <b>Doctor Consultation Chamber, Reception Counter, Waiting Room TV, and Pharmacy</b> "
        "work together in perfect harmony — without buying any costly servers or complex IT machinery."
    )
    t_intro = Table([[Paragraph(doctor_intro, body_style)]], colWidths=[523])
    t_intro.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), TEAL_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, TEAL),
        ('LEFTPADDING', (0,0), (-1,-1), 9),
        ('RIGHTPADDING', (0,0), (-1,-1), 9),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_intro)
    story.append(Spacer(1, 6))

    # Section 1: How the Software Operates in 5 Clinical Touchpoints
    story.append(Paragraph("1. How the Software Operates in Your Daily Clinic", h1_style))
    story.append(Paragraph("No technical knowledge required — simple and intuitive screens designed for doctors and clinic staff:", body_muted))
    story.append(Spacer(1, 4))

    touchpoints_data = [
        [
            Paragraph("<b>Clinic Area / Role</b>", th_style),
            Paragraph("<b>What the Software Does (Clinical Function)</b>", th_style),
            Paragraph("<b>How it Helps the Doctor & Clinic</b>", th_style)
        ],
        [
            Paragraph("<b>Doctor's Chamber</b><br/><font color='#0D9488'>Consultation Screen</font>", td_bold),
            Paragraph(
                "• <b>1-Click Next Token Caller:</b> Tap 'Next' to call the next patient. Chime sounds automatically in waiting room.<br/>"
                "• <b>Rapid Digital Prescription (Rx):</b> Select pre-saved medicines with dosage (e.g. <i>1-0-1, After food</i>) in under 60 seconds.<br/>"
                "• <b>1-Click WhatsApp Share:</b> Instantly sends a clean digital prescription directly to the patient's WhatsApp.",
                td_style
            ),
            Paragraph("<b>Saves 1.5–2 hours</b> of writing time daily. Zero shouting in the clinic. All patient history saved forever.", td_green)
        ],
        [
            Paragraph("<b>Waiting Room TV</b><br/><font color='#0D9488'>Lobby Display Screen</font>", td_bold),
            Paragraph(
                "• <b>Live Token Display:</b> Runs on any ordinary Smart TV in your waiting room.<br/>"
                "• <b>Audio Chime:</b> Pleasing bell rings automatically when the doctor calls the next token.<br/>"
                "• <b>Clinic Branding:</b> Shows clinic name, doctor's specialty, and current serving token.",
                td_style
            ),
            Paragraph("<b>Cuts lobby noise and crowding by 75%</b>. Patients stay seated comfortably until their number is called.", td_green)
        ],
        [
            Paragraph("<b>Reception Counter</b><br/><font color='#0D9488'>Front Desk Screen</font>", td_bold),
            Paragraph(
                "• <b>Fast Walk-In Token:</b> Issue patient token in 5 seconds (just Name & Phone number).<br/>"
                "• <b>QR Code Standee:</b> Walk-in patients can scan the desk QR poster with their phone to view their live token.<br/>"
                "• <b>OPD Queue Overview:</b> Shows who is waiting, who is inside, and who is completed.",
                td_style
            ),
            Paragraph("<b>Eliminates paper slip chaos</b> and front-desk confusion. Staff can focus on helping patients.", td_green)
        ],
        [
            Paragraph("<b>In-House Pharmacy</b><br/><font color='#0D9488'>Compounder Screen</font>", td_bold),
            Paragraph(
                "• <b>Instant Prescription Flow:</b> Doctor's prescribed medicines appear immediately on the pharmacy screen.<br/>"
                "• <b>Clear Medicine Names:</b> No guessing difficult doctor handwriting.<br/>"
                "• <b>1-Click Dispensed:</b> Mark medicines delivered with total bill calculation.",
                td_style
            ),
            Paragraph("<b>Stops prescription walkouts</b> to outside medical stores. Increases clinic pharmacy revenue by 30%+.", td_green)
        ],
        [
            Paragraph("<b>Patients on Mobile</b><br/><font color='#0D9488'>Home & Market Tracking</font>", td_bold),
            Paragraph(
                "• <b>Live Mobile Queue Tracker:</b> Patients see live token progress on their phone from home or market.<br/>"
                "• <b>No Waiting in Crowds:</b> Patients arrive at the clinic only 10 minutes before their turn.<br/>"
                "• <b>Permanent Records:</b> Patients receive PDF prescription on WhatsApp.",
                td_style
            ),
            Paragraph("<b>Waiting time drops from 2.5 hours to 15 mins</b>. Delighted patients recommend your clinic to others.", td_green)
        ],
    ]
    t_touchpoints = Table(touchpoints_data, colWidths=[105, 275, 143])
    t_touchpoints.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_CARD]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_touchpoints)
    story.append(Spacer(1, 6))

    # Section 2: 4-Step Patient Flow Diagram
    story.append(Paragraph("2. Simple 4-Step Patient OPD Journey", h1_style))
    flow_data = [
        [
            Paragraph("<b>STEP 1: Token Issue</b><br/>Patient books online or gets a token at reception. Receives live token number.", td_style),
            Paragraph("<b>STEP 2: Calm Waiting</b><br/>Patient tracks token on phone or watches Waiting Room TV screen with audio chime.", td_style),
            Paragraph("<b>STEP 3: Consultation</b><br/>Doctor clicks 'Next Patient', types medicines in 60s, and sends Rx to WhatsApp.", td_style),
            Paragraph("<b>STEP 4: Medicine Dispensing</b><br/>Compounder sees Rx on screen, dispenses medicines accurately without error.", td_style),
        ]
    ]
    t_flow = Table(flow_data, colWidths=[130, 131, 131, 131])
    t_flow.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_flow)

    # PAGE BREAK: PERFECT 2-PAGE LAYOUT
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: SOFTWARE & TECH EXPENSES, PACKAGES & ZERO-HARDWARE SPEC
    # =========================================================================
    story.append(Paragraph("3. Software & Technology Pricing Packages", h1_style))
    story.append(Paragraph("Clear, transparent investment options for software setup, cloud hosting, and technical maintenance:", body_muted))
    story.append(Spacer(1, 5))

    pkg_data = [
        [
            Paragraph("<b>Software Package Tier</b>", th_style),
            Paragraph("<b>Software Features & Included Modules</b>", th_style),
            Paragraph("<b>One-Time Software Setup</b>", th_style),
            Paragraph("<b>Monthly Cloud & Tech Support</b>", th_style)
        ],
        [
            Paragraph("<b>TIER 1: ESSENTIAL CLINIC</b><br/><font color='#64748B'>Single Doctor Chamber</font>", td_bold),
            Paragraph(
                "• Doctor OPD Queue Controller (Web & Tablet)<br/>"
                "• Digital Prescription Builder (Rx) with 1-Click WhatsApp delivery<br/>"
                "• Waiting Room Smart TV Lobby Display mode<br/>"
                "• Reception Token Desk & Printable QR poster<br/>"
                "• Complete cloud database setup & secure hosting",
                td_style
            ),
            Paragraph("<b>Rs. 1,25,000</b><br/><font color='#64748B'>One-time software fee</font>", td_bold),
            Paragraph("<b>Rs. 4,500 / mo</b><br/><font color='#64748B'>Cloud hosting, WhatsApp messages, backups & technical help</font>", td_style)
        ],
        [
            Paragraph("<b>TIER 2: COMPREHENSIVE POLYCLINIC</b><br/><font color='#0D9488'><b>★ RECOMMENDED FOR MOST CLINICS</b></font><br/><font color='#64748B'>1 to 4 Doctors + Medical Store</font>", td_bold),
            Paragraph(
                "• <b>All Essential Clinic features included</b><br/>"
                "• In-House Pharmacy / Compounder Dispensing Portal<br/>"
                "• <b>AI Cash Fee Ledger:</b> Audits and prevents unrecorded cash token gaps<br/>"
                "• Multi-Doctor Support (independent queues & OPD schedules)<br/>"
                "• Staff Training for Receptionist & Compounder (Hindi/English)<br/>"
                "• <b>90 Days Comprehensive Technical Warranty & Bug Support</b>",
                td_style
            ),
            Paragraph("<b>Rs. 2,45,000</b><br/><font color='#0D9488'>Best Value Package</font>", ParagraphStyle('RecP', parent=td_bold, textColor=TEAL_DARK, fontSize=8.5)),
            Paragraph("<b>Rs. 9,500 / mo</b><br/><font color='#64748B'>Full technical management, priority SLA, database audits</font>", td_style)
        ],
        [
            Paragraph("<b>TIER 3: HOSPITAL & NETWORK</b><br/><font color='#64748B'>Multi-Doctor Hospital / Regional</font>", td_bold),
            Paragraph(
                "• <b>All Comprehensive features included</b><br/>"
                "• Android Mobile App build (APK) for patients and clinic staff<br/>"
                "• Rural Village Booking Mitra (CSC Agent) network module<br/>"
                "• Unlimited doctors, departments, and clinic branches<br/>"
                "• Complete Source Code & Intellectual Property Handover",
                td_style
            ),
            Paragraph("<b>Rs. 4,95,000</b><br/><font color='#64748B'>Full Enterprise IP</font>", td_bold),
            Paragraph("<b>Rs. 20,000 / mo</b><br/><font color='#64748B'>Dedicated software engineer & ongoing customizations</font>", td_style)
        ],
    ]
    t_pkg = Table(pkg_data, colWidths=[120, 228, 95, 80])
    t_pkg.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('BACKGROUND', (0,2), (-1,2), TEAL_LIGHT), # Highlight Tier 2
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_pkg)
    story.append(Spacer(1, 6))

    # Zero-Risk Monthly Subscription Callout Box
    saas_alt = (
        "<b>ALTERNATIVE: ZERO-RISK MONTHLY SUBSCRIPTION PLAN:</b> "
        "If you prefer to start without a large upfront software investment: "
        "<b>Rs. 25,000 One-time Setup & Staff Training Fee</b> + <b>Rs. 4,000 / month per doctor</b>. "
        "Covers complete software usage, cloud hosting, automatic WhatsApp messaging, daily backups, and 24/7 technical support."
    )
    t_saas = Table([[Paragraph(saas_alt, body_style)]], colWidths=[523])
    t_saas.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), AMBER_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, AMBER),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_saas)
    story.append(Spacer(1, 6))

    # Section 4: Hardware Requirements - Highlighting ZERO Special Hardware
    story.append(Paragraph("4. Hardware Requirements (Zero Special Hardware Needed!)", h1_style))
    story.append(Paragraph("DocNest runs on your existing devices without buying expensive servers or proprietary hospital machinery:", body_muted))
    story.append(Spacer(1, 4))

    hardware_data = [
        [
            Paragraph("<b>Doctor's Chamber</b>", td_bold),
            Paragraph("Any existing Laptop, Desktop computer, iPad, or Android tablet with internet.", td_style),
            Paragraph("Cost: <b>Rs. 0 (Uses existing device)</b>", td_green)
        ],
        [
            Paragraph("<b>Waiting Room TV</b>", td_bold),
            Paragraph("Any standard Smart LED TV (or normal TV with Amazon Fire TV Stick / HDMI).", td_style),
            Paragraph("Cost: <b>Rs. 0 (Uses existing clinic TV)</b>", td_green)
        ],
        [
            Paragraph("<b>Reception Desk</b>", td_bold),
            Paragraph("Any computer or mobile phone. Normal desktop printer (optional for paper slips).", td_style),
            Paragraph("Cost: <b>Rs. 0 (Uses existing equipment)</b>", td_green)
        ],
        [
            Paragraph("<b>Clinic Internet</b>", td_bold),
            Paragraph("Normal broadband Wi-Fi connection (JioFiber / Airtel / BSNL) or 4G/5G mobile hotspot.", td_style),
            Paragraph("Cost: <b>Standard monthly broadband</b>", td_style)
        ],
    ]
    t_hw = Table(hardware_data, colWidths=[120, 263, 140])
    t_hw.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_hw)
    story.append(Spacer(1, 6))

    # Section 5: Technical Services, Training & Agreement Box
    story.append(Paragraph("5. What is Included in Technical Support & Next Steps", h1_style))
    support_bullets = (
        "• <b>Complete Staff Training:</b> We personally train your receptionist and compounder until they are 100% comfortable operating the screens.<br/>"
        "• <b>Fast Cloud Database & Backups:</b> Prescriptions and patient files are automatically backed up every day in secure medical cloud storage.<br/>"
        "• <b>90 Days Bug Warranty & Live Support:</b> Any technical difficulty is solved immediately via WhatsApp or phone call."
    )
    t_supp = Table([[Paragraph(support_bullets, body_style)]], colWidths=[523])
    t_supp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), TEAL_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, TEAL),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_supp)
    story.append(Spacer(1, 6))

    # Formal Sign-Off Box
    sign_data = [
        [
            Paragraph("<b>PREPARED & SUBMITTED BY:</b><br/>DocNest Software Solutions Team<br/>Technical Inquiries: contact@docnest.in | Mobile: +91 98765 43210", td_style),
            Paragraph("<b>ACCEPTED & APPROVED BY:</b><br/>Clinic Director / Doctor Signature: _______________________<br/>Clinic Name: __________________________ Date: _________", td_style)
        ]
    ]
    t_sign = Table(sign_data, colWidths=[260, 263])
    t_sign.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, BORDER_LIGHT),
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_sign)

    doc.build(story, canvasmaker=MedicalNumberedCanvas)
    print(f"[SUCCESS] Medical Proposal PDF Generated at: {filename}")

if __name__ == "__main__":
    output_pdf = os.path.join(os.getcwd(), "DocNest_Clinic_Software_Proposal.pdf")
    build_medical_proposal(output_pdf)
