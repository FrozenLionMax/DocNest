import os
from PIL import Image, ImageDraw, ImageFont

PUBLIC_DIR = r"c:\Users\Acer\Desktop\DocNest\apps\web\public"
os.makedirs(PUBLIC_DIR, exist_ok=True)

def draw_medical_icon(size, is_maskable=False):
    # Render at 4x supersampling for ultra crisp edges
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background
    bg_color = (12, 18, 28, 255) # Deep slate #0C121C
    
    if is_maskable:
        # Full bleed square for Android adaptive icons
        draw.rectangle([0, 0, canvas_size, canvas_size], fill=bg_color)
    else:
        # Rounded squircle for standard icons
        radius = int(canvas_size * 0.22)
        draw.rounded_rectangle([0, 0, canvas_size, canvas_size], radius=radius, fill=bg_color)

    # Ambient radial glow behind the cross
    center = canvas_size // 2
    glow_radius = int(canvas_size * 0.42)
    for r in range(glow_radius, 0, -8):
        alpha = int(45 * (1 - r / glow_radius))
        draw.ellipse([center - r, center - r, center + r, center + r], fill=(13, 148, 136, alpha))

    # Inner circular badge or shield
    badge_r = int(canvas_size * 0.38) if not is_maskable else int(canvas_size * 0.32)
    badge_bg = (15, 23, 42, 255) # slate-900
    draw.ellipse([center - badge_r, center - badge_r, center + badge_r, center + badge_r], fill=badge_bg, outline=(20, 184, 166, 180), width=int(12 * scale * (size/512)))

    # Medical Cross dimensions
    cross_span = int(canvas_size * (0.46 if not is_maskable else 0.38))
    arm_thickness = int(cross_span * 0.34)
    cr_radius = int(arm_thickness * 0.30)
    
    cross_color = (16, 185, 129, 255) # Emerald-500 #10B981
    
    # Vertical arm
    v_box = [
        center - arm_thickness // 2,
        center - cross_span // 2,
        center + arm_thickness // 2,
        center + cross_span // 2
    ]
    draw.rounded_rectangle(v_box, radius=cr_radius, fill=cross_color)

    # Horizontal arm
    h_box = [
        center - cross_span // 2,
        center - arm_thickness // 2,
        center + cross_span // 2,
        center + arm_thickness // 2
    ]
    draw.rounded_rectangle(h_box, radius=cr_radius, fill=cross_color)

    # Center Heartbeat / Pulse Accent (White & Cyan)
    pulse_width = int(8 * scale * (size/512))
    cyan_line = (248, 250, 252, 255) # crisp white
    
    half_arm = arm_thickness // 2
    p1 = (center - cross_span // 3, center)
    p2 = (center - arm_thickness // 3, center)
    p3 = (center - arm_thickness // 6, center - arm_thickness // 2)
    p4 = (center + arm_thickness // 8, center + arm_thickness // 2)
    p5 = (center + arm_thickness // 3, center - arm_thickness // 4)
    p6 = (center + arm_thickness // 2, center)
    p7 = (center + cross_span // 3, center)

    points = [p1, p2, p3, p4, p5, p6, p7]
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill=cyan_line, width=pulse_width, joint="curve")

    # Downsample using high quality Lanczos filter
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

# 1. Generate 192x192
icon_192 = draw_medical_icon(192)
icon_192.save(os.path.join(PUBLIC_DIR, "icon-192.png"), "PNG")
print("Generated icon-192.png")

# 2. Generate 512x512
icon_512 = draw_medical_icon(512)
icon_512.save(os.path.join(PUBLIC_DIR, "icon-512.png"), "PNG")
print("Generated icon-512.png")

# 3. Generate 512x512 Maskable (Android Adaptive Icon)
icon_maskable = draw_medical_icon(512, is_maskable=True)
icon_maskable.save(os.path.join(PUBLIC_DIR, "icon-maskable-512.png"), "PNG")
print("Generated icon-maskable-512.png")

# 4. Generate 1024x1024 Play Console High-Res Icon
icon_1024 = draw_medical_icon(1024)
icon_1024.save(os.path.join(PUBLIC_DIR, "icon-1024.png"), "PNG")
print("Generated icon-1024.png")

# 5. Generate Play Store Feature Graphic Banner (1024 x 500)
def generate_feature_banner():
    banner = Image.new("RGBA", (1024, 500), (11, 19, 31, 255))
    draw = ImageDraw.Draw(banner)

    # Ambient emerald glow gradient on right
    for r in range(400, 0, -10):
        alpha = int(35 * (1 - r / 400))
        draw.ellipse([700 - r, 250 - r, 700 + r, 250 + r], fill=(13, 148, 136, alpha))

    # Paste scaled icon emblem on left
    emblem = draw_medical_icon(320)
    banner.paste(emblem, (80, 90), emblem)

    # Try loading clean font or default
    try:
        font_large = ImageFont.truetype("arial.ttf", 52)
        font_sub = ImageFont.truetype("arial.ttf", 26)
        font_tag = ImageFont.truetype("arial.ttf", 19)
    except:
        font_large = font_sub = font_tag = ImageFont.load_default()

    # Typography
    draw.text((450, 130), "DocNest Healthcare", fill=(255, 255, 255, 255), font=font_large)
    draw.text((450, 200), "Smart Clinic & Pharmacy OS", fill=(16, 185, 129, 255), font=font_sub)
    draw.text((450, 250), "• Live OPD Queue & Smart TV Display", fill=(203, 213, 225, 255), font=font_tag)
    draw.text((450, 285), "• 1-Click WhatsApp Digital Prescriptions", fill=(203, 213, 225, 255), font=font_tag)
    draw.text((450, 320), "• Instant Pharmacy Counter & Medicine Dispensing", fill=(203, 213, 225, 255), font=font_tag)

    # Bottom domain pill
    draw.rounded_rectangle([450, 370, 720, 415], radius=12, fill=(13, 148, 136, 60), outline=(20, 184, 166, 180), width=2)
    draw.text((475, 382), "Domain: drugs.systems", fill=(52, 211, 153, 255), font=font_tag)

    banner.save(os.path.join(PUBLIC_DIR, "playstore-banner.png"), "PNG")
    print("Generated playstore-banner.png (1024x500)")

generate_feature_banner()
print("All app and store assets generated successfully!")
