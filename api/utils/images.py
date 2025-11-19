import io
from PIL import Image, ImageEnhance, ImageOps

def resize_image(file, max_size=(768, 1024)):
    try:
        img = Image.open(file).convert("RGB")
        img = ImageOps.exif_transpose(img)
        img.thumbnail(max_size, Image.LANCZOS)
        img = ImageEnhance.Brightness(img).enhance(1.05)
        img = ImageEnhance.Contrast(img).enhance(1.08)
        img = ImageEnhance.Color(img).enhance(1.05)
        buf = io.BytesIO(); img.save(buf, format="JPEG", quality=96, optimize=True); buf.seek(0)
        return (file.name, buf.read(), "image/jpeg")
    except Exception:
        file.seek(0)
        return (file.name, file.read(), file.content_type)

def enhance_output(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = ImageOps.autocontrast(img, cutoff=2)
        img = ImageEnhance.Brightness(img).enhance(1.02)
        img = ImageEnhance.Contrast(img).enhance(1.08)
        img = ImageEnhance.Color(img).enhance(1.04)
        img = ImageEnhance.Sharpness(img).enhance(1.1)
        buf = io.BytesIO(); img.save(buf, format="JPEG", quality=97, optimize=True)
        return buf.getvalue()
    except Exception:
        return image_bytes

def gen_mask_from_clothing(cleaned_bytes):
    try:
        img = Image.open(io.BytesIO(cleaned_bytes)).convert("RGBA")
        alpha = img.split()[-1]
        mask = alpha.point(lambda p: 255 if p > 10 else 0).convert("L")
        buf = io.BytesIO(); mask.save(buf, format="PNG", optimize=True); buf.seek(0)
        return ("mask_image.png", buf.read(), "image/png")
    except Exception:
        return None
