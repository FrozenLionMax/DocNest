import os
from PIL import Image, ImageDraw, ImageFont

PUBLIC_DIR = r"c:\Users\Acer\Desktop\DocNest\apps\web\public"
os.makedirs(PUBLIC_DIR, exist_ok=True)

try:
    font_title = ImageFont.truetype("arial.ttf", 36)
    font_heading = ImageFont.truetype("arial.ttf", 26)
    font_body = ImageFont.truetype("arial.ttf", 18)
    font_mono = ImageFont.truetype("arial.ttf", 48)
    font_small = ImageFont.truetype("arial.ttf", 14)
except:
    font_title = font_heading = font_body = font_mono = font_small = ImageFont.load_default()

# 1. Desktop Screenshot: 1280x720
def create_desktop_screenshot():
    w, h = 1280, 720
    img = Image.new("RGBA", (w, h), (12, 18, 25, 255)) # Dark slate #0c1219
    draw = ImageDraw.Draw(img)

    # Ambient teal/emerald glow on top right
    for r in range(350, 0, -10):
        alpha = int(25 * (1 - r / 350))
        draw.ellipse([1100 - r, 150 - r, 1100 + r, 150 + r], fill=(13, 148, 136, alpha))

    # Top Navigation Bar
    draw.rectangle([0, 0, w, 70], fill=(15, 23, 42, 255), outline=(30, 41, 59, 255), width=1)
    draw.text((40, 20), "DocNest Healthcare Platform", fill=(255, 255, 255, 255), font=font_heading)
    draw.text((420, 26), "• Live OPD Queue & Pharmacy System (drugs.systems)", fill=(16, 185, 129, 255), font=font_body)

    # Left Sidebar Menu
    draw.rounded_rectangle([30, 95, 260, 680], radius=16, fill=(15, 23, 42, 240), outline=(30, 41, 59, 255), width=1)
    sidebar_items = [
        "● Doctor OPD Queue",
        "● Digital Rx Creator",
        "● Pharmacy Dispensing",
        "● Smart TV Waiting Room",
        "● Analytics & Revenue",
        "● Clinic Settings"
    ]
    for idx, item in enumerate(sidebar_items):
        y = 120 + idx * 55
        if idx == 0:
            draw.rounded_rectangle([45, y - 5, 245, y + 35], radius=10, fill=(13, 148, 136, 60), outline=(20, 184, 166, 150), width=1)
            draw.text((60, y + 4), item, fill=(52, 211, 153, 255), font=font_body)
        else:
            draw.text((60, y + 4), item, fill=(148, 163, 184, 255), font=font_body)

    # Main Hero Controller: Live OPD Token Counter
    draw.rounded_rectangle([290, 95, 870, 390], radius=24, fill=(11, 30, 36, 255), outline=(20, 184, 166, 100), width=2)
    draw.text((320, 125), "OPD LIVE QUEUE CONTROLLER", fill=(52, 211, 153, 255), font=font_body)
    draw.text((320, 155), "Gupta Clinic & Joint Care Center — Deoria Sadar", fill=(255, 255, 255, 255), font=font_heading)
    draw.text((320, 190), "Dr. Amit Kumar (MS Ortho) • Real-time Cross-Platform Synchronization", fill=(148, 163, 184, 255), font=font_small)

    # Big Token Box
    draw.rounded_rectangle([660, 125, 840, 275], radius=18, fill=(15, 23, 42, 255), outline=(20, 184, 166, 200), width=2)
    draw.text((685, 140), "NOW SERVING", fill=(148, 163, 184, 255), font=font_small)
    draw.text((690, 170), "#14", fill=(52, 211, 153, 255), font=font_mono)
    draw.text((685, 240), "Total Issued: #28", fill=(148, 163, 184, 255), font=font_small)

    # Action Buttons inside Controller
    draw.rounded_rectangle([320, 290, 480, 345], radius=12, fill=(16, 185, 129, 255))
    draw.text((345, 305), "▶ Next Patient", fill=(12, 18, 25, 255), font=font_body)

    draw.rounded_rectangle([500, 290, 640, 345], radius=12, fill=(30, 41, 59, 255), outline=(71, 85, 105, 255), width=1)
    draw.text((530, 305), "❚❚ Pause OPD", fill=(255, 255, 255, 255), font=font_body)

    # Right Stats Box: Pharmacy & Dispensing Status
    draw.rounded_rectangle([900, 95, 1240, 390], radius=24, fill=(15, 23, 42, 255), outline=(30, 41, 59, 255), width=1)
    draw.text((930, 125), "PHARMACY DISPENSING POS", fill=(96, 165, 250, 255), font=font_body)
    draw.text((930, 165), "Pending Rx: 4", fill=(255, 255, 255, 255), font=font_heading)
    draw.text((930, 205), "Dispensed Today: 32 Rx", fill=(52, 211, 153, 255), font=font_body)
    draw.text((930, 240), "Counter Revenue: ₹14,850", fill=(251, 191, 36, 255), font=font_body)
    draw.text((930, 275), "Thermal Slip Print: Ready (80mm)", fill=(148, 163, 184, 255), font=font_small)

    # Bottom Table: Today's Patient Queue
    draw.rounded_rectangle([290, 415, 1240, 680], radius=24, fill=(15, 23, 42, 255), outline=(30, 41, 59, 255), width=1)
    draw.text((320, 435), "Today's Patient Queue (Live Sync with TV Display & Mobile)", fill=(255, 255, 255, 255), font=font_body)

    headers = ["Token #", "Patient Name", "Consultation Slot", "Fee / Payment", "Status", "Rx Action"]
    cols_x = [320, 430, 650, 840, 990, 1120]
    for i, h_text in enumerate(headers):
        draw.text((cols_x[i], 475), h_text, fill=(148, 163, 184, 255), font=font_small)

    rows = [
        ["#14", "Rahul Sharma (राहुल शर्मा)", "10:30 AM Morning", "₹300 (Counter)", "● In Consultation", "Write Rx →"],
        ["#15", "Priya Singh (प्रिया सिंह)", "10:45 AM Morning", "₹300 (Online UPI)", "Waiting (~8m)", "Pending"],
        ["#16", "Sunita Devi (सुनीता देवी)", "11:00 AM Morning", "₹300 (Counter)", "Waiting (~16m)", "Pending"]
    ]
    for r_idx, row in enumerate(rows):
        y = 515 + r_idx * 45
        draw.line([320, y - 8, 1210, y - 8], fill=(30, 41, 59, 255), width=1)
        for c_idx, val in enumerate(row):
            col_color = (52, 211, 153, 255) if c_idx == 0 or "In Consultation" in val else (255, 255, 255, 255)
            draw.text((cols_x[c_idx], y), val, fill=col_color, font=font_small)

    dest_path = os.path.join(PUBLIC_DIR, "screenshot-desktop.png")
    img.save(dest_path, "PNG")
    print("Generated screenshot-desktop.png (1280x720)")

# 2. Mobile Screenshot: 750x1334
def create_mobile_screenshot():
    w, h = 750, 1334
    img = Image.new("RGBA", (w, h), (12, 18, 25, 255))
    draw = ImageDraw.Draw(img)

    # Ambient glow
    for r in range(300, 0, -10):
        alpha = int(30 * (1 - r / 300))
        draw.ellipse([375 - r, 300 - r, 375 + r, 300 + r], fill=(13, 148, 136, alpha))

    # Top Status Bar & App Header
    draw.rectangle([0, 0, w, 110], fill=(15, 23, 42, 255), outline=(30, 41, 59, 255), width=1)
    draw.text((40, 40), "DocNest Healthcare", fill=(255, 255, 255, 255), font=font_heading)
    draw.text((40, 75), "drugs.systems • Patient App", fill=(52, 211, 153, 255), font=font_small)

    # Hero Live OPD Token Card
    draw.rounded_rectangle([40, 140, 710, 480], radius=28, fill=(11, 30, 36, 255), outline=(20, 184, 166, 180), width=2)
    draw.text((70, 170), "YOUR CONFIRMED TOKEN", fill=(52, 211, 153, 255), font=font_body)
    draw.text((70, 210), "Token #14", fill=(255, 255, 255, 255), font=font_title)
    draw.text((70, 260), "Dr. Amit Kumar (Orthopedic Surgeon)", fill=(203, 213, 225, 255), font=font_body)
    draw.text((70, 295), "Gupta Clinic & Joint Care Center", fill=(148, 163, 184, 255), font=font_small)

    # Now Serving Badge
    draw.rounded_rectangle([70, 340, 680, 440], radius=16, fill=(15, 23, 42, 255), outline=(20, 184, 166, 120), width=1)
    draw.text((100, 360), "Now Serving in Doctor Cabin:", fill=(148, 163, 184, 255), font=font_small)
    draw.text((100, 385), "Token #12 (2 patients ahead of you)", fill=(52, 211, 153, 255), font=font_body)

    # 1-Click Action Buttons
    draw.rounded_rectangle([40, 510, 710, 590], radius=20, fill=(16, 185, 129, 255))
    draw.text((180, 535), "📲 Share Token on WhatsApp", fill=(12, 18, 25, 255), font=font_heading)

    draw.rounded_rectangle([40, 610, 710, 690], radius=20, fill=(30, 41, 59, 255), outline=(71, 85, 105, 255), width=1)
    draw.text((170, 635), "📜 View Digital Prescription (Rx)", fill=(255, 255, 255, 255), font=font_heading)

    # Upcoming Appointments Section
    draw.text((40, 725), "Recent & Upcoming Appointments", fill=(255, 255, 255, 255), font=font_heading)

    cards = [
        {"doc": "Dr. Amit Kumar (Orthopedics)", "date": "Today, 10:30 AM", "token": "Token #14", "status": "Confirmed"},
        {"doc": "Dr. Sunita Rai (Gynecologist)", "date": "14 Oct 2026", "token": "Token #08", "status": "Completed"}
    ]
    for idx, c in enumerate(cards):
        cy = 770 + idx * 160
        draw.rounded_rectangle([40, cy, 710, cy + 140], radius=20, fill=(15, 23, 42, 255), outline=(30, 41, 59, 255), width=1)
        draw.text((65, cy + 25), c["doc"], fill=(255, 255, 255, 255), font=font_body)
        draw.text((65, cy + 55), c["date"], fill=(148, 163, 184, 255), font=font_small)
        draw.text((65, cy + 85), c["token"], fill=(52, 211, 153, 255), font=font_heading)

    # Bottom Mobile Navigation Bar
    draw.rectangle([0, 1234, w, 1334], fill=(15, 23, 42, 255), outline=(30, 41, 59, 255), width=1)
    nav_labels = ["Home", "Doctors", "Bookings", "History", "Settings"]
    for i, label in enumerate(nav_labels):
        x = 50 + i * 140
        color = (52, 211, 153, 255) if i == 0 else (148, 163, 184, 255)
        draw.text((x, 1270), label, fill=color, font=font_body)

    dest_path = os.path.join(PUBLIC_DIR, "screenshot-mobile.png")
    img.save(dest_path, "PNG")
    print("Generated screenshot-mobile.png (750x1334)")

create_desktop_screenshot()
create_mobile_screenshot()
print("All PWA screenshots created successfully!")
