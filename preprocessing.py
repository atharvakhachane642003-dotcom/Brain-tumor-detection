import cv2
import numpy as np

def clahe_preprocess_cv2(img, to_model_preprocess_fn):
    img_uint8 = (img * 255).astype(np.uint8)
    lab = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)

    merged = cv2.merge((cl, a, b))
    enhanced = cv2.cvtColor(merged, cv2.COLOR_LAB2RGB)
    enhanced = enhanced.astype("float32") / 255.0
    enhanced = to_model_preprocess_fn(enhanced * 255.0)
    return enhanced
