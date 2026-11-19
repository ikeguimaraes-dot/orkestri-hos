"""Rebuild transparent SVG logos from the preserved raster sources.
Use Python 3.9 with scripts/requirements-logos.txt. Pass the official Pipou JPEG as the first argument.
"""
from pathlib import Path
import re
import sys
import numpy as np
from PIL import Image
import vtracer

ROOT = Path(__file__).resolve().parents[1]
PALETTES = {
    'phi': ['#fbfbfb'], 'mise': ['#faf6f2', '#ed6039'],
    'le-chef': ['#ffffff', '#ff6026'], 'maestri': ['#e9ece6'],
    'ops': ['#f7f2eb', '#d8aa73'], 'talki': ['#ffffff', '#9343ff'],
    'pipou': ['#ffd51c'],
}

def prepare_pipou(source_path):
    source = Image.open(source_path).convert('RGB')
    data = np.asarray(source).astype(float)
    # Isolate yellow from the textured charcoal background using channel separation.
    alpha = np.clip((data[:,:,0] - data[:,:,2] - 12) / 215, 0, 1)
    alpha[alpha < 0.035] = 0
    rgba = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    rgba[:,:,:3] = (255, 213, 28)
    rgba[:,:,3] = np.round(alpha * 255).astype(np.uint8)
    rgba[alpha == 0, :3] = 0
    result = Image.fromarray(rgba)
    result = result.crop(result.getchannel('A').getbbox())
    result.save(ROOT / 'public/logos/transparent/pipou.png')
    return result

def vectorize(name, image):
    # Trace each flat brand color separately, avoiding JPEG noise and tiny color layers.
    factor = 4 if name != 'pipou' else 1
    tagline = {'le-chef': ('CADA DETALHE NO LUGAR.', 37), 'ops': ('OPERAÇÃO · KPH OS', 42)}.get(name)
    if tagline:
        # The source taglines are only 5–6 pixels tall; render their exact text cleanly.
        clean = Image.new('RGBA', image.size)
        clean.paste(image.crop((0, 0, image.width, tagline[1])), (0, 0))
        image = clean
    image = image.resize((image.width * factor, image.height * factor), Image.Resampling.LANCZOS)
    rgba = np.asarray(image)
    palette = np.array([tuple(bytes.fromhex(color[1:])) for color in PALETTES[name]])
    distances = ((rgba[:,:,:3].astype(float)[:,:,None,:] - palette[None,None,:,:]) ** 2).sum(axis=3)
    labels = distances.argmin(axis=2)
    groups = []
    for index, color in enumerate(PALETTES[name]):
        mask = (rgba[:,:,3] >= 128) & (labels == index)
        pixels = np.full((image.height, image.width, 4), 255, dtype=np.uint8)
        pixels[mask,:3] = 0
        svg = vtracer.convert_pixels_to_svg(
            [tuple(int(c) for c in pixel) for pixel in pixels.reshape(-1,4)],
            (image.width,image.height), colormode='binary', mode='spline',
            filter_speckle=3, corner_threshold=65, length_threshold=3.5,
            max_iterations=10, splice_threshold=45, path_precision=3,
        )
        paths = re.findall(r'<path\b[^>]*>', svg)
        groups.extend(path.replace('fill="#000000"', f'fill="{color}"') for path in paths)
    if tagline:
        groups.append(f'<text x="{image.width/2}" y="{image.height-5}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" textLength="{image.width*0.9}" lengthAdjust="spacing" fill="#e9ece6">{tagline[0]}</text>')
    result = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {image.width} {image.height}">' + ''.join(groups) + '</svg>\n'
    (ROOT / f'public/logos/vector/{name}.svg').write_text(result)

if __name__ == '__main__':
    for name in PALETTES:
        image = prepare_pipou(sys.argv[1]) if name == 'pipou' else Image.open(ROOT / f'public/logos/transparent/{name}.png').convert('RGBA')
        vectorize(name, image)
        print(f'{name}: transparent SVG prepared')
