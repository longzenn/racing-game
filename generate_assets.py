import os
from PIL import Image, ImageDraw

os.makedirs("assets/icons", exist_ok=True)

def create_icon(size, filename):
    img = Image.new("RGBA", (size, size), (11, 12, 16, 255))
    draw = ImageDraw.Draw(img)
    
    margin = size // 16
    draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=size//8, fill=(18, 20, 29, 255), outline=(0, 242, 255, 255), width=max(2, size//32))
    
    center_y = size // 2
    road_left = size // 4
    road_right = size * 3 // 4
    draw.polygon([(size//2 - size//10, size//4), (size//2 + size//10, size//4), (road_right, size * 3//4), (road_left, size * 3//4)], fill=(30, 34, 48, 255))
    
    draw.line([(size//2, size//4 + size//20), (size//2, size * 3//4 - size//20)], fill=(0, 242, 255, 255), width=max(2, size//25))
    
    car_y = int(size * 0.52)
    cw = size // 3
    ch = size // 5
    cx = size // 2
    
    draw.rounded_rectangle([cx - cw//2, car_y - ch//2, cx + cw//2, car_y + ch//2], radius=size//20, fill=(255, 0, 127, 255), outline=(255, 255, 255, 255), width=max(1, size//40))
    draw.rounded_rectangle([cx - cw//3, car_y - ch//3, cx + cw//3, car_y + ch//6], radius=size//30, fill=(0, 242, 255, 220))
    draw.ellipse([cx - cw//2 + size//30, car_y - ch//2, cx - cw//2 + size//15, car_y - ch//4], fill=(255, 255, 200, 255))
    draw.ellipse([cx + cw//2 - size//15, car_y - ch//2, cx + cw//2 - size//30, car_y - ch//4], fill=(255, 255, 200, 255))
    draw.rectangle([cx - cw//2 + size//40, car_y + ch//2 - size//30, cx - cw//4, car_y + ch//2], fill=(255, 50, 50, 255))
    draw.rectangle([cx + cw//4, car_y + ch//2 - size//30, cx + cw//2 - size//40, car_y + ch//2], fill=(255, 50, 50, 255))
    
    img.save(filename, "PNG")
    print(f"Generated {filename} ({size}x{size})")

create_icon(192, "assets/icons/icon-192.png")
create_icon(512, "assets/icons/icon-512.png")
