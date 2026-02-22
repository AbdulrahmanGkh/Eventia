
from PIL import Image
import sys

def fix_logo_colors(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        data = img.getdata()
        
        new_data = []
        for item in data:
            # item is (R, G, B, A)
            r, g, b, a = item
            
            # If pixel is transparent, keep it
            if a == 0:
                new_data.append(item)
                continue
            
            # Check if pixel is "White" or very light
            # Threshold: if R, G, and B are all high -> Turn Black
            if r > 200 and g > 200 and b > 200:
                # Turn Black (0, 0, 0, original alpha)
                new_data.append((0, 0, 0, a))
            else:
                # Keep original color (The Icon)
                new_data.append(item)
        
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Saved processed logo to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_logo_colors("assets/logo.png", "assets/logo_fixed.png")
