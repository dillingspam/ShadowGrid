import os
import shutil
import re
import urllib.request
import ssl
import time

# === CONFIGURATION ===
# Where your loose icons are right now (from the previous step)
SOURCE_DIR = "/home/user/studio/src/assets/icons_sorted"
# Where you want the categorized folders
DEST_DIR = "/home/user/studio/src/assets/icons_final"

TAGS_URL = "https://game-icons.net/tags.html"

def get_tags_robust():
    print(f"🌎 Connecting to {TAGS_URL}...")
    
    # 1. Setup a "Fake Browser" context to avoid being blocked
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    html = ""
    try:
        req = urllib.request.Request(TAGS_URL, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as response:
            html = response.read().decode('utf-8')
    except Exception as e:
        print(f"❌ Network Error: {e}")
        return {}

    print("✅ Download successful. Parsing HTML...")
    
    # 2. Robust Parsing Logic
    # The page structure is: <h3 id="category-name">...</h3> ...icons... <h3...>
    # We split the massive HTML string by the "h3 id=" marker.
    
    # This splits the page into chunks, where each chunk starts with the category name
    chunks = re.split(r'<h3 id="', html)
    
    icon_map = {}
    
    # Skip the first chunk (header garbage)
    for chunk in chunks[1:]:
        # The chunk starts with: category-name">Category Title...
        # We extract "category-name"
        end_of_id = chunk.find('"')
        if end_of_id == -1: continue
        
        category = chunk[:end_of_id]
        
        # Now find all icon links in this chunk
        # Links look like: href="/lorc/originals/ak47.html"
        # We just want "ak47"
        icons_in_chunk = re.findall(r'href="/[^"]+/([a-zA-Z0-9-]+)\.html"', chunk)
        
        for icon in icons_in_chunk:
            # We map the icon to the FIRST category it appears in (usually the best one)
            if icon not in icon_map:
                icon_map[icon] = category

    print(f"✅ Successfully mapped {len(icon_map)} icons to categories.")
    return icon_map

def sort_icons():
    # 1. Verify Source
    if not os.path.exists(SOURCE_DIR):
        print(f"❌ Error: Source folder not found at {SOURCE_DIR}")
        return

    # 2. Get the Map
    tag_map = get_tags_robust()
    
    if len(tag_map) < 100:
        print("❌ Critical Error: The scraper didn't find enough tags.")
        print("The website layout might have changed radically.")
        return

    # 3. Sort Files
    print(f"📂 Sorting icons from {SOURCE_DIR}...")
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

    moved = 0
    
    for filename in os.listdir(SOURCE_DIR):
        if not filename.endswith(".svg"):
            continue
            
        # Clean the filename to match the map keys
        # "ak47.svg" -> "ak47"
        # "skull_copy.svg" -> "skull"
        clean_name = filename.replace(".svg", "")
        if "_copy" in clean_name:
            clean_name = clean_name.split("_copy")[0]
        # Handle "skull_1" -> "skull"
        elif "_" in clean_name and clean_name.split("_")[-1].isdigit():
             clean_name = "_".join(clean_name.split("_")[:-1])

        # Get Category
        category = tag_map.get(clean_name, "uncategorized")
        
        # Create Folder
        target_folder = os.path.join(DEST_DIR, category)
        if not os.path.exists(target_folder):
            os.makedirs(target_folder)
            
        # Move
        src = os.path.join(SOURCE_DIR, filename)
        dst = os.path.join(target_folder, filename)
        
        # Handle collisions
        if os.path.exists(dst):
             base, ext = os.path.splitext(filename)
             dst = os.path.join(target_folder, f"{base}_dup{ext}")

        shutil.copy2(src, dst)
        moved += 1
        
        if moved % 500 == 0:
            print(f"Moved {moved} files...")

    print(f"\n✨ DONE! Sorted {moved} icons into {DEST_DIR}")

if __name__ == "__main__":
    sort_icons()