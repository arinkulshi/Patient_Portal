import re

# Core pack keywords
PACK_KEYWORDS = [
    r'packs?', r'cases?', r'bundles?', r'boxes?', r'cartons?',
    r'trays?', r'reels?', r'pkgs?', r'units?'
]

# Common plural item types that indicate multi-pack when quantified
PLURAL_ITEMS = [
    # Food items
    r'bars?', r'rolls?', r'cans?', r'bottles?', r'packets?', r'sachets?',
    r'bags?', r'pouches?', r'tubes?', r'cups?', r'bowls?', r'containers?',
    r'wraps?', r'sticks?', r'pieces?', r'slices?', r'strips?',
    
    # Paper/hygiene products
    r'sheets?', r'tissues?', r'wipes?', r'towels?', r'napkins?',
    
    # General items
    r'items?', r'products?', r'servings?', r'portions?', r'doses?',
    r'tablets?', r'capsules?', r'pills?', r'drops?',
    
    # Batteries/tech
    r'batteries?', r'cells?', r'cartridges?', r'refills?',
    
    # Size modifiers that often indicate multiple units
    r'mega\s*rolls?', r'super\s*rolls?', r'big\s*rolls?', r'jumbo\s*rolls?',
    r'family\s*rolls?', r'giant\s*rolls?', r'double\s*rolls?',
    r'mega\s*bars?', r'king\s*size\s*bars?', r'fun\s*size\s*bars?',
]

# All keywords combined
ALL_KEYWORDS = PACK_KEYWORDS + PLURAL_ITEMS

# Quantity patterns
QUANTITY_PATTERNS = [
    r'\d+',                    # Simple number: "12"
    r'\d+\s*[xX×]\s*\d+',     # Multiplication: "2x6", "3 X 4"
    r'\d+\s*[xX×]',           # "2x", "3X" (standalone)
    r'[xX×]\s*\d+',           # "x12", "X 6"
    r'\d+\s*ct',              # "12ct", "6 ct"
    r'\d+\s*count',           # "12 count"
]

def build_multipack_regex():
    """Build comprehensive regex for detecting multi-pack items"""
    patterns = []
    
    # 1. Quantity + any item type ("12 bars", "2x cans", "6 rolls")
    for qty in QUANTITY_PATTERNS:
        for item in ALL_KEYWORDS:
            patterns.extend([
                rf'\b{qty}\s*{item}\b',     # "12 bars", "2x rolls"
                rf'\b{item}\s*{qty}\b',     # "bars 12" (less common but possible)
            ])
    
    # 2. Standalone quantity indicators that strongly suggest multi-pack
    standalone_multipack = [
        r'\b\d{2,}\s*ct\b',           # "24ct" (double digit count)
        r'\b\d+\s*[xX×]\s*\d+\b',    # "2x6", "3X4"
        r'\b[2-9]\s*[xX×]\b',         # "2x", "3X" (2 or more)
        r'\b\d+\s*count\b',           # "12 count"
        r'\b\d+[-\s]*pk\b',           # "6-pk", "6 pk"
    ]
    patterns.extend(standalone_multipack)
    
    # 3. Multi-pack specific descriptors
    multipack_descriptors = [
        r'\bmulti\s*pack\b',
        r'\bvariety\s*pack\b',
        r'\bfamily\s*pack\b',
        r'\bbulk\s*pack\b',
        r'\bvalue\s*pack\b',
        r'\bassorted\s*pack\b',
        r'\bmixed\s*pack\b',
    ]
    patterns.extend(multipack_descriptors)
    
    # 4. Size indicators that often suggest multiple units
    size_indicators = [
        r'\bfamily\s*size\b',
        r'\bbulk\s*size\b',
        r'\bparty\s*size\b',
        r'\bshare\s*size\b',
        r'\beconomy\s*size\b',
    ]
    patterns.extend(size_indicators)
    
    # 5. Plural items with size modifiers (mega rolls, king size bars, etc.)
    # These are already included in PLURAL_ITEMS but adding explicit patterns
    modifier_patterns = [
        r'\b(?:mega|super|big|jumbo|giant|double|king\s*size|fun\s*size)\s+\w+s\b',
    ]
    patterns.extend(modifier_patterns)
    
    return re.compile('|'.join(f'({p})' for p in patterns), re.IGNORECASE)

# Compile the regex
MULTIPACK_RE = build_multipack_regex()

def is_multipack(title: str) -> bool:
    """
    Determine if a product title indicates a multi-pack item
    
    Args:
        title: Product title string
        
    Returns:
        bool: True if title indicates multi-pack, False otherwise
    """
    # Clean title for better matching
    clean_title = title.strip()
    
    # Primary regex check
    if MULTIPACK_RE.search(clean_title):
        return True
    
    # Additional heuristics for edge cases
    
    # Check for dash-separated quantities with any item type
    if re.search(r'\b\d+[-\s]*(?:pk|ct|pack|count|pc|pcs|piece|pieces)\b', clean_title, re.IGNORECASE):
        return True
    
    # Check for parenthetical quantities
    if re.search(r'\(\s*(?:\d+\s*(?:pack|ct|count|x\d+|pcs?|pieces?))\s*\)', clean_title, re.IGNORECASE):
        return True
    
    # Check for "set of X" patterns
    if re.search(r'\bset\s+of\s+\d+\b', clean_title, re.IGNORECASE):
        return True
    
    # Check for explicit plural quantities with common items
    # This catches cases like "12 cookies", "6 donuts", etc.
    plural_with_qty = re.search(r'\b\d+\s+\w+s\b', clean_title, re.IGNORECASE)
    if plural_with_qty:
        # Extract the plural word
        match = re.search(r'\b\d+\s+(\w+s)\b', clean_title, re.IGNORECASE)
        if match:
            plural_word = match.group(1).lower()
            # Exclude common false positives
            false_positives = {
                'ounces', 'pounds', 'grams', 'kilos', 'lbs', 'oz', 'ml', 'liters',
                'inches', 'feet', 'meters', 'cms', 'years', 'months', 'days',
                'hours', 'minutes', 'seconds', 'watts', 'volts', 'degrees',
                'calories', 'servings', 'uses', 'washes', 'loads'
            }
            if plural_word not in false_positives:
                return True
    
    return False

# Test cases
def test_multipack_detection():
    test_cases = [
        # Should be TRUE (multi-pack)
        ("Granola Bars 12 Pack", True),
        ("Energy Bars 6ct", True),
        ("Toilet Paper 2x Mega Rolls", True),
        ("Paper Towels 12 Rolls", True),
        ("Soda 24 Cans", True),
        ("Chocolate Bars 3x2", True),
        ("Protein Bars Variety Pack", True),
        ("Snack Bars 8-pack", True),
        ("Candy Bars (6 count)", True),
        ("Juice Bottles 12ct", True),
        ("Soap Bars Set of 4", True),
        ("Cereal Bars Family Pack", True),
        ("Granola 6 Bars", True),
        ("Cookies 12 pieces", True),
        ("Muffins 6 count", True),
        ("Donuts 12ct", True),
        ("King Size Bars 3pk", True),
        ("Fun Size Bars 20ct", True),
        ("Double Rolls 6 Pack", True),
        ("Mega Bars 4ct", True),
        
        # Should be FALSE (single pack)  
        ("Protein Bar Single", False),
        ("Granola Bar Individual", False),
        ("Study Guide Case Edition", False),
        ("Single Roll Premium", False),
        ("Pack of Lies Novel", False),
        ("Roll Call List", False),
        ("Count Dracula Story", False),
        ("Bars and Restaurants Guide", False),
        ("24 Hours Service", False),          # Time, not quantity
        ("5 Pounds Weight", False),           # Weight measurement
        ("12 Ounces Bottle", False),          # Volume measurement
        ("3 Years Warranty", False),          # Time period
        ("100 Calories Bar", False),          # Nutrition info
        ("20 Servings Container", False),     # Serving info (borderline)
    ]
    
    print("Testing multi-pack detection:")
    print("-" * 60)
    
    correct = 0
    total = len(test_cases)
    
    for title, expected in test_cases:
        result = is_multipack(title)
        status = "✓" if result == expected else "✗"
        print(f"{status} {title:<35} → {result:<5} (expected {expected})")
        if result == expected:
            correct += 1
    
    print("-" * 60)
    print(f"Accuracy: {correct}/{total} ({correct/total*100:.1f}%)")
    
    # Show some regex matches for debugging
    print("\nDebug - What patterns matched:")
    debug_titles = ["Granola Bars 12 Pack", "2x Mega Rolls", "Candy 6ct"]
    for title in debug_titles:
        matches = MULTIPACK_RE.findall(title)
        print(f"'{title}' → matches: {[m for m in matches if m]}")

if __name__ == "__main__":
    test_multipack_detection()
