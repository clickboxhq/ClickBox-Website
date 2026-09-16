"""Generate favicon/icon assets from two sources (exact source, resize only).

Two deliberately different sources:
  - favicon-source.png    -> browser tab icon (favicon.ico, 16x16, 32x32)
  - search-icon-source.png -> larger icons (apple-touch-icon, android-chrome
    192/512). Google's search-result favicon picker prefers larger icons
    ("a multiple of 48px" per Google's own docs), so keeping these on the
    ClickBox wordmark logo while the small tab icons use a different mark
    lets the browser tab and Google search results show different images
    without any per-crawler special-casing.

To change the browser tab icon: replace favicon-source.png and rerun.
To change the logo Google search results tend to pick up: replace
search-icon-source.png and rerun.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

TAB_SOURCE = PUBLIC / "favicon-source.png"
TAB_OUTPUTS = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
}

SEARCH_SOURCE = PUBLIC / "search-icon-source.png"
SEARCH_OUTPUTS = {
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
}


def render(source_path: Path, outputs: dict[str, int]) -> None:
    if not source_path.exists():
        raise SystemExit(f"Missing source image: {source_path}")
    source = Image.open(source_path).convert("RGBA")
    for name, size in outputs.items():
        resized = source.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(PUBLIC / name, format="PNG", optimize=True)


def main() -> None:
    render(TAB_SOURCE, TAB_OUTPUTS)
    render(SEARCH_SOURCE, SEARCH_OUTPUTS)

    # favicon.ico — 16, 32, 48 for broad browser support, from the tab source
    tab_source = Image.open(TAB_SOURCE).convert("RGBA")
    ico_images = [
        tab_source.resize((16, 16), Image.Resampling.LANCZOS),
        tab_source.resize((32, 32), Image.Resampling.LANCZOS),
        tab_source.resize((48, 48), Image.Resampling.LANCZOS),
    ]
    ico_images[0].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=ico_images[1:],
    )

    print("Generated favicon/icon assets in", PUBLIC)


if __name__ == "__main__":
    main()
