import os
from PIL import Image, ImageDraw, ImageFont
import qrcode

def create_ad_poster():
    W, H = 1400, 2400
    poster = Image.new('RGB', (W, H), '#070b12')
    draw = ImageDraw.Draw(poster)

    # 1. Load Hero Image
    hero_path = r"C:\Users\Acer\.gemini\antigravity\brain\d7a7c8b5-9855-484c-a754-2034c053849e\docnest_commercial_poster_1793477187040.jpg"
    if os.path.exists(hero_path):
        hero = Image.open(hero_path)
        # Scaled to fit top portion (1400 px wide, 1160 px high)
        hero_w = W
        hero_h = int(hero.height * (W / hero.width))
        hero_resized = hero.resize((hero_w, hero_h), Image.Resampling.LANCZOS)
        
        # Take the top 1140 px so doctor, phone, TV and queue tablet are visible
        hero_cropped = hero_resized.crop((0, 0, W, 1140))
        poster.paste(hero_cropped, (0, 0))
        
        # Smooth seamless dark gradient fade
        fade_h = 200
        fade_top = 1140 - fade_h
        for y in range(fade_h):
            alpha = int(255 * (y / fade_h))
            overlay = Image.new('RGBA', (W, 1), (7, 11, 18, alpha))
            poster.paste(overlay, (0, fade_top + y), overlay)

    # Fonts
    font_bold = r"C:\Windows\Fonts\segoeuib.ttf"
    font_reg = r"C:\Windows\Fonts\segoeui.ttf"
    font_black = r"C:\Windows\Fonts\arialbd.ttf"
    
    f_mega = ImageFont.truetype(font_bold, 42)
    f_title = ImageFont.truetype(font_bold, 32)
    f_sub = ImageFont.truetype(font_bold, 24)
    f_head = ImageFont.truetype(font_bold, 22)
    f_body = ImageFont.truetype(font_reg, 19)
    f_small = ImageFont.truetype(font_reg, 16)
    f_badge = ImageFont.truetype(font_bold, 17)

    # Top Brand Watermark Overlay on Hero (if needed)
    # The hero image already has glowing "DocNest: Unified Smart Healthcare" at the top!

    # SECTION 1: Headline Value Proposition Banner
    bar_y = 1150
    draw.rounded_rectangle([40, bar_y, W - 40, bar_y + 100], radius=24, fill='#0d1b2a', outline='#10b981', width=2)
    
    # Glowing decorative dot
    draw.ellipse([65, bar_y + 36, 85, bar_y + 56], fill='#34d399')
    draw.text((100, bar_y + 20), "ALL-IN-ONE SMART HEALTHCARE & CLINIC OPERATING SYSTEM", font=f_sub, fill='#34d399')
    draw.text((100, bar_y + 58), "Zero Waiting Lines • Instant WhatsApp Rx Delivery • Zero Server Invoices • Real-time Cross-Device Sync", font=f_small, fill='#94a3b8')

    # SECTION 2: 3 Detailed Pillars (Patients | Doctors & Clinics | Pharmacy POS)
    cols_y = 1275
    card_w = (W - 80 - 40) // 3
    
    pillars = [
        {
            "tag": "PATIENT PORTAL",
            "subtitle": "Mobile App & Web Access",
            "accent": "#38bdf8",
            "accent_bg": "#082f49",
            "items": [
                ("Live OPD Token on Phone", "Never wait in crowded waiting rooms"),
                ("Voice Search (Hindi / English)", "Natural voice search for specialists"),
                ("Fast QR Counter Check-in", "Instant 1-tap pass for clinic entrance"),
                ("1080p Tele-Consultation", "Encrypted WebRTC video calls with chat"),
                ("Lifelong Digital Rx History", "Store, view & download official prescriptions"),
                ("Verified Doctor Reviews", "5-star rating post-consultation")
            ]
        },
        {
            "tag": "DOCTORS & CLINICS",
            "subtitle": "Queue, TV Display & Digital Rx",
            "accent": "#34d399",
            "accent_bg": "#064e3b",
            "items": [
                ("Live OPD Queue Controller", "Next patient, pause, resume & walk-ins"),
                ("Smart TV Display with Audio", "Bilingual chime & voice announcements"),
                ("1-Click Rx Illness Templates", "Auto-fills diagnosis & common drugs"),
                ("AI Drug Duplicate Salt Checker", "Protects patients from Paracetamol/NSAID toxicity"),
                ("1-Tap WhatsApp Rx Sharing", "Instant delivery to patient mobile"),
                ("Schedule & Leave Manager", "Morning/Evening OPD slot management")
            ]
        },
        {
            "tag": "PHARMACY & POS",
            "subtitle": "Instant Dispense & Thermal Receipt",
            "accent": "#fbbf24",
            "accent_bg": "#451a03",
            "items": [
                ("Real-time Prescription Stream", "Direct live feed from doctor consultation room"),
                ("Acoustic Arrival Chime Alert", "Instant audio ding when doctor saves Rx"),
                ("1-Click Medicine Dispense", "Marks medicine packed and delivered"),
                ("80mm Thermal Receipt Printer", "Instant physical slip for patient POS"),
                ("AI Stock Depletion Tags", "Flags low inventory drugs automatically"),
                ("Daily Revenue Analytics", "Tracks OPD fees & pharmacy sales")
            ]
        }
    ]

    for i, p in enumerate(pillars):
        x1 = 40 + i * (card_w + 20)
        x2 = x1 + card_w
        y1 = cols_y
        y2 = y1 + 450
        
        # Card Body
        draw.rounded_rectangle([x1, y1, x2, y2], radius=24, fill='#0d1522', outline='#1e293b', width=2)
        # Top Accent Header Box
        draw.rounded_rectangle([x1, y1, x2, y1 + 68], radius=24, fill=p['accent_bg'])
        draw.rounded_rectangle([x1, y1 + 40, x2, y1 + 68], fill=p['accent_bg'])
        draw.text((x1 + 18, y1 + 12), p['tag'], font=f_head, fill=p['accent'])
        draw.text((x1 + 18, y1 + 40), p['subtitle'], font=f_small, fill='#94a3b8')
        
        # Features list with crisp bullet points
        item_y = y1 + 86
        for title, desc in p['items']:
            # Bullet dot
            draw.ellipse([x1 + 18, item_y + 6, x1 + 26, item_y + 14], fill=p['accent'])
            draw.text((x1 + 34, item_y), title, font=f_body, fill='#f1f5f9')
            draw.text((x1 + 34, item_y + 24), desc, font=f_small, fill='#94a3b8')
            item_y += 58

    # SECTION 3: Universal Multi-Platform Availability + Scannable QR Code
    tech_y = 1755
    draw.rounded_rectangle([40, tech_y, W - 40, tech_y + 270], radius=26, fill='#0f172a', outline='#334155', width=2)
    
    draw.text((70, tech_y + 22), "UNIVERSAL RUNTIME & DEPLOYMENT ARCHITECTURE", font=f_sub, fill='#ffffff')
    draw.text((70, tech_y + 58), "A single responsive Next.js PWA powers all screens with zero duplicate code", font=f_small, fill='#94a3b8')

    platforms = [
        ("Android (Google Play Store)", "TWA App package • Offline Service Worker Sync", "#4ade80"),
        ("Windows PC & POS (Microsoft Store)", "Reception desk counter, waiting room TV & thermal printer", "#38bdf8"),
        ("Global Edge Web (drugs.systems)", "Instant access on any mobile, tablet or PC browser", "#c084fc"),
        ("DPDP Act 2023 & DISHA Compliant", "End-to-end encrypted medical data & ABDM-ready", "#fb7185"),
    ]

    for idx, (p_title, p_desc, p_color) in enumerate(platforms):
        col = idx % 2
        row = idx // 2
        px = 70 + col * 460
        py = tech_y + 100 + row * 75
        draw.rounded_rectangle([px, py, px + 430, py + 62], radius=16, fill='#162338', outline=p_color, width=1)
        draw.ellipse([px + 16, py + 26, px + 26, py + 36], fill=p_color)
        draw.text((px + 36, py + 10), p_title, font=f_badge, fill=p_color)
        draw.text((px + 36, py + 34), p_desc, font=f_small, fill='#cbd5e1')

    # Real Working QR Code
    qr = qrcode.QRCode(box_size=6, border=2)
    qr.add_data("https://www.drugs.systems")
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#070b12", back_color="#ffffff").convert('RGB')
    qr_img = qr_img.resize((190, 190), Image.Resampling.LANCZOS)
    
    qr_x = W - 40 - 240
    qr_y = tech_y + 25
    draw.rounded_rectangle([qr_x - 10, qr_y - 10, qr_x + 200, qr_y + 200], radius=20, fill='#ffffff')
    poster.paste(qr_img, (qr_x, qr_y))
    draw.text((qr_x + 5, qr_y + 208), "SCAN TO LAUNCH APP", font=f_badge, fill='#38bdf8')

    # SECTION 4: Live Call-To-Action Banner
    cta_y = 2055
    draw.rounded_rectangle([40, cta_y, W - 40, cta_y + 190], radius=28, fill='#022c22', outline='#10b981', width=3)
    
    draw.text((70, cta_y + 22), "OFFICIAL LIVE PRODUCTION SYSTEM", font=f_badge, fill='#34d399')
    draw.text((70, cta_y + 55), "https://www.drugs.systems", font=ImageFont.truetype(font_bold, 46), fill='#ffffff')
    draw.text((70, cta_y + 125), "Instant Demo Access • Doctors, Patients, Compounders & Clinics Welcome", font=f_body, fill='#a7f3d0')

    # Footer
    draw.text((W // 2 - 250, H - 75), "DocNest Healthcare Platform © 2026 • Powered by Vercel & Supabase", font=f_small, fill='#64748b')

    # Output paths
    out_dir = r"c:\Users\Acer\Desktop\DocNest\scripts"
    out_path = os.path.join(out_dir, "docnest_commercial_infographic_poster.png")
    poster.save(out_path, quality=95)
    
    art_path = r"C:\Users\Acer\.gemini\antigravity\brain\d7a7c8b5-9855-484c-a754-2034c053849e\docnest_commercial_infographic_poster.png"
    poster.save(art_path, quality=95)
    
    print(f"Infographic poster generated at: {out_path} and {art_path}")

if __name__ == "__main__":
    create_ad_poster()
