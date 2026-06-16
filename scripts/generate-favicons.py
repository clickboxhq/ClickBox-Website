"""Generate favicon assets from public/favicon-source.png (exact source, resize only)."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SOURCE = PUBLIC / "favicon-source.png"

OUTPUTS = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
}


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing source image: {SOURCE}")

    source = Image.open(SOURCE).convert("RGBA")

    ico_sizes = []
    for name, size in OUTPUTS.items():
        resized = source.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(PUBLIC / name, format="PNG", optimize=True)
        if size in (16, 32, 48):
            ico_sizes.append(resized)

    # favicon.ico — 16, 32, 48 for broad browser support
    ico_images = [
        source.resize((16, 16), Image.Resampling.LANCZOS),
        source.resize((32, 32), Image.Resampling.LANCZOS),
        source.resize((48, 48), Image.Resampling.LANCZOS),
    ]
    ico_images[0].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=ico_images[1:],
    )

    print("Generated favicon assets in", PUBLIC)


if __name__ == "__main__":
    main()
