import base64

import cv2
import numpy as np
from sklearn.linear_model import LogisticRegression
from skimage.feature import local_binary_pattern
import os

##############################
# Mock Data Creation & Model Training
##############################

def create_lab_training_data_with_lbp():
    """
    Create mock training data with Lab color and LBP texture features.
    In a real scenario, you'd load actual labeled data.

    We'll:
    - Generate 6 classes (0 to 5) corresponding to categories like "Very Dark" to "Very Light".
    - For each class, we choose a Lab center and create samples around it.
    - For texture, we'll create random histograms as placeholders.
    """

    np.random.seed(42)
    num_samples_per_class = 30
    data = []
    labels = []

    # Arbitrary Lab class centers (L, a, b in OpenCV scale):
    # L: 0-255, a:0-255, b:0-255 (128 is neutral for a and b)
    class_centers = [
        (30, 135, 135),   # Class 0: Very Dark
        (60, 135, 135),   # Class 1: Dark
        (100,135,135),    # Class 2: Medium-Dark
        (140,135,135),    # Class 3: Medium
        (180,135,135),    # Class 4: Light
        (220,135,135)     # Class 5: Very Light
    ]

    # Each sample: Lab + LBP histogram
    # For simplicity, LBP histogram will be random here.
    # Real case: Extract LBP from actual images.
    for class_idx, center in enumerate(class_centers):
        L_vals = np.random.normal(loc=center[0], scale=5, size=num_samples_per_class)
        a_vals = np.random.normal(loc=center[1], scale=5, size=num_samples_per_class)
        b_vals = np.random.normal(loc=center[2], scale=5, size=num_samples_per_class)

        for L, a, b in zip(L_vals, a_vals, b_vals):
            # Simulate a LBP histogram with 10 bins, random for demonstration
            lbp_hist = np.random.rand(10)
            # Normalize
            lbp_hist = lbp_hist / (lbp_hist.sum() + 1e-7)

            # Features: [L, a, b, lbp_hist...]
            features = [L, a, b] + lbp_hist.tolist()
            data.append(features)
            labels.append(class_idx)
    
    return np.array(data), np.array(labels)

def map_class_to_label(class_idx):
    labels = [
        "Very Dark",
        "Dark",
        "Medium-Dark",
        "Medium",
        "Light",
        "Very Light"
    ]
    return labels[class_idx]

def train_lab_lbp_model():
    data, labels = create_lab_training_data_with_lbp()
    model = LogisticRegression(max_iter=1000)
    model.fit(data, labels)
    return model

##############################
# Feature Extraction Functions
##############################

def rgb_to_lab_single(rgb_color):
    """
    Convert a single RGB color tuple to Lab (OpenCV’s Lab).
    rgb_color: (R, G, B)
    Returns: (L, a, b)
    """
    color_bgr = np.uint8([[[rgb_color[2], rgb_color[1], rgb_color[0]]]])
    color_lab = cv2.cvtColor(color_bgr, cv2.COLOR_BGR2Lab)
    L, a, b = color_lab[0, 0]
    return (L, a, b)

def compute_lbp_hist(image_gray, radius=1, n_points=8):
    """
    Compute LBP histogram for a grayscale image region.
    image_gray: grayscale image region (np.array)
    radius, n_points: LBP parameters
    Returns: normalized LBP histogram (list)
    """
    lbp = local_binary_pattern(image_gray, n_points, radius, method='uniform')
    (hist, _) = np.histogram(lbp.ravel(),
                             bins=np.arange(0, n_points+3),
                             range=(0, n_points+2))
    hist = hist.astype("float")
    hist /= (hist.sum() + 1e-7)
    return hist

##############################
# Main Detection & Classification
##############################

def detect_face(image, face_cascade_path='haarcascade_frontalface_default.xml'):
    """
    Detect a face in the image. Returns the bounding box of the first face found.
    """
    if not os.path.exists(face_cascade_path):
        raise FileNotFoundError("Haar cascade file not found. Please download from OpenCV GitHub or use your own path.")

    face_cascade = cv2.CascadeClassifier(face_cascade_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    if len(faces) > 0:
        return faces[0]  # x, y, w, h of the first face
    else:
        return None


def decode_base64_image(base64_str):
    """
    Decode a base64 image string into a numpy array that OpenCV can work with.
    """
    img_data = base64.b64decode(base64_str)
    np_img = np.frombuffer(img_data, dtype=np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    return img

def detect_skin_color(image_path, model, face_cascade_path='haarcascade_frontalface_default.xml'):
    """
    1. Load image
    2. Detect face
    3. Extract face region
    4. Apply YCrCb mask to find skin pixels
    5. Compute average Lab color
    6. Compute LBP texture features
    7. Combine features and classify
    """
    image = decode_base64_image(image_path)
    if image is None:
        print("Error: Image not found. Check the file path.")
        return None

    face_box = detect_face(image, face_cascade_path=face_cascade_path)
    if face_box is None:
        print("No face detected. Cannot extract skin features.")
        return None

    x, y, w, h = face_box
    face_region = image[y:y+h, x:x+w]

    # Convert face region to YCrCb
    face_ycrcb = cv2.cvtColor(face_region, cv2.COLOR_BGR2YCrCb)
    # YCrCb skin range
    lower = np.array([0, 133, 77], dtype=np.uint8)
    upper = np.array([255, 173, 127], dtype=np.uint8)

    mask = cv2.inRange(face_ycrcb, lower, upper)
    skin = cv2.bitwise_and(face_region, face_region, mask=mask)

    skin_pixels = skin[np.where(mask > 0)]
    if len(skin_pixels) == 0:
        print("No skin regions detected in the face. The mask might be too restrictive or lighting is poor.")
        return None

    # Average skin color in BGR
    avg_bgr = np.mean(skin_pixels, axis=0).astype(int)
    avg_rgb = (avg_bgr[2], avg_bgr[1], avg_bgr[0])
    avg_lab = rgb_to_lab_single(avg_rgb)

    # Compute LBP on the skin region
    # Convert the entire skin mask region to grayscale
    gray_skin = cv2.cvtColor(skin, cv2.COLOR_BGR2GRAY)
    lbp_hist = compute_lbp_hist(gray_skin)

    # Combine features: Lab + LBP hist
    features = [avg_lab[0], avg_lab[1], avg_lab[2]] + lbp_hist.tolist()
    predicted_class = model.predict([features])
    class_label = map_class_to_label(predicted_class[0])

    print(f"Average Skin Tone (RGB): {avg_rgb}, (Lab): {avg_lab}, Classified as: {class_label}")

    # Optional: Display
    # cv2.rectangle(image, (x, y), (x+w, y+h), (0,255,0), 2)
    # cv2.imshow("Original Image", image)
    # cv2.imshow("Face Region", face_region)
    # cv2.imshow("Skin Mask", mask)
    # cv2.imshow("Skin Detection", skin)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    return class_label

##############################
# Example Usage
##############################

# Train model (mock)
# model = train_lab_lbp_model()
#
# # Update with the path to your cascade file (often included with OpenCV installations)
# cascade_path = 'data/haarcascade_frontalface_default.xml'
# image_path = 'person2.jpg'  # Replace with your image path

# detect_skin_color(image_path, model, face_cascade_path=cascade_path)
