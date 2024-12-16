import traceback
import cv2
import numpy as np
import mediapipe as mp
import matplotlib.pyplot as plt
import base64
import ssl, socket


def decode_base64_image(base64_str):
    img_data = base64.b64decode(base64_str)
    np_img = np.frombuffer(img_data, dtype=np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    return img


def get_pose_landmarks(mp_pose, image):
    with mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5, model_complexity=2) as pose:
        results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        return results


def measure_upper_body_size(chest_size, gender, calculate=None):
    # Female Upper Body Size Map
    if gender == "female":
        size_chart = [
            {'size': 'XS', 'chest': 30, 'shoulder': 14, 'length': 23, 'sleeve': 8},
            {'size': 'S', 'chest': 32, 'shoulder': 15, 'length': 23, 'sleeve': 8},
            {'size': 'M', 'chest': 34, 'shoulder': 15.5, 'length': 23, 'sleeve': 8},
            {'size': 'L', 'chest': 36, 'shoulder': 16, 'length': 23.5, 'sleeve': 8.5},
            {'size': 'XL', 'chest': 38, 'shoulder': 16, 'length': 24, 'sleeve': 8.5},
        ]
    # Male Upper Body Size Map
    else:
        size_chart = [
            {'size': 'S', 'chest': 38, 'shoulder': 17, 'length': 28, 'sleeve': 25},
            {'size': 'M', 'chest': 40, 'shoulder': 18, 'length': 28.5, 'sleeve': 25},
            {'size': 'L', 'chest': 42, 'shoulder': 19, 'length': 29, 'sleeve': 25.5},
            {'size': 'XL', 'chest': 44, 'shoulder': 20, 'length': 30, 'sleeve': 26},
            {'size': 'XXL', 'chest': 46, 'shoulder': 21, 'length': 30.5, 'sleeve': 26},
        ]

    for entry in size_chart:
        if chest_size <= entry['chest']:
            if calculate:
                return entry[calculate]
            else:
                return entry['size']

    return None


def measure_lower_body_size(waist_size, gender, calculate=None):
    # Female Lower Body Size Map
    if gender == "female":
        size_chart = [
            {'size': '24', 'waist': 24, 'inseam': 26, 'hip': 38},
            {'size': '26', 'waist': 26, 'inseam': 26, 'hip': 38},
            {'size': '28', 'waist': 28, 'inseam': 26, 'hip': 38},
            {'size': '30', 'waist': 30, 'inseam': 26, 'hip': 38},
            {'size': '32', 'waist': 32, 'inseam': 26, 'hip': 38},
            {'size': '34', 'waist': 34, 'inseam': 26, 'hip': 38},
            {'size': '36', 'waist': 36, 'inseam': 26, 'hip': 38},
            {'size': '38', 'waist': 38, 'inseam': 26, 'hip': 40},
            {'size': '40', 'waist': 40, 'inseam': 26, 'hip': 40},
        ]
    # Male Lower Body Size Map
    else:
        size_chart = [
            {'size': '30', 'waist': 30.5, 'inseam': 33},
            {'size': '32', 'waist': 32.5, 'inseam': 33},
            {'size': '34', 'waist': 34.5, 'inseam': 33},
            {'size': '36', 'waist': 36.5, 'inseam': 33},
            {'size': '38', 'waist': 38.5, 'inseam': 33},
        ]

    for entry in size_chart:
        if waist_size <= entry['waist']:
            if calculate:
                return entry[calculate]
            else:
                return entry['size']

    return None


def measure_size(chest_size, waist_size):
    size_chart = [
        {'size': 'S', 'chest': 36, 'waist': 34, 'shoulder': 14},
        {'size': 'M', 'chest': 38, 'waist': 36, 'shoulder': 14.5},
        {'size': 'L', 'chest': 40, 'waist': 38, 'shoulder': 15},
        {'size': 'XL', 'chest': 42, 'waist': 40, 'shoulder': 15.5},
        {'size': 'XXL', 'chest': 44, 'waist': 42, 'shoulder': 16},
    ]
    for entry in size_chart:
        if (chest_size <= entry['chest'] and
                waist_size <= entry['waist']):
                # shoulder_depth <= entry['shoulder']):
            return entry['size']
    return None



def size_estimation(height, weight, frontImageID, sideImageID, gender):
    from app import app, supabase
    try:
        # Fetch the front image from the database
        front_image = decode_base64_image(supabase.table('asset').select('base64').eq('id', frontImageID).execute().data[0].get('base64'))
        side_image = decode_base64_image(supabase.table('asset').select('base64').eq('id', sideImageID).execute().data[0].get('base64'))

        # Convert height and weight to appropriate units
        height_in_inches = height / 0.34  # Adjusted for unit conversion (cm to inches)
        weight_in_pounds = weight * 2.20462  # Convert kg to pounds

        # Initialize Mediapipe Pose model
        mp_pose = mp.solutions.pose
        mp_drawing = mp.solutions.drawing_utils

        # Process the front image
        front_results = get_pose_landmarks(mp_pose, front_image)
        side_results = get_pose_landmarks(mp_pose, side_image)

        if not front_results.pose_landmarks:
            print("Pose landmarks not detected in the front image.")
            exit()

        front_landmarks = front_results.pose_landmarks.landmark
        side_landmarks = side_results.pose_landmarks.landmark

        # Extract relevant landmarks
        left_shoulder = front_landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = front_landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
        left_hip = front_landmarks[mp_pose.PoseLandmark.LEFT_HIP]
        right_hip = front_landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
        left_ankle = front_landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]
        right_ankle = front_landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]
        left_foot_index = front_landmarks[mp_pose.PoseLandmark.LEFT_FOOT_INDEX]
        right_foot_index = front_landmarks[mp_pose.PoseLandmark.RIGHT_FOOT_INDEX]
        nose = front_landmarks[mp_pose.PoseLandmark.NOSE]

        # Extract landmarks for hip and ankle from side image (more accurate for leg length)
        left_hip_side = side_landmarks[mp_pose.PoseLandmark.LEFT_HIP]
        right_hip_side = side_landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
        left_ankle_side = side_landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]
        right_ankle_side = side_landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]

        # Calculate hip-to-ankle distance (side view)
        # left_hip_to_ankle_px = np.linalg.norm(
        #     np.array([left_hip_side.x - left_ankle_side.x, left_hip_side.y - left_ankle_side.y]) *
        #     [side_image.shape[1], side_image.shape[0]]
        # )
        # right_hip_to_ankle_px = np.linalg.norm(
        #     np.array([right_hip_side.x - right_ankle_side.x, right_hip_side.y - right_ankle_side.y]) *
        #     [side_image.shape[1], side_image.shape[0]]
        # )
        #
        # # Average the hip-to-ankle distances from both legs
        # hip_to_ankle_px = (left_hip_to_ankle_px + right_hip_to_ankle_px) / 2
        # print(f"Hip to ankle distance (pixels): {hip_to_ankle_px}")

        # Calculate the distance between the nose and feet (head-to-toe distance)
        head_to_toe_px = np.linalg.norm(
            np.array([nose.x - left_foot_index.x, nose.y - left_foot_index.y]) *
            [front_image.shape[1], front_image.shape[0]]
        ) + np.linalg.norm(
            np.array([nose.x - right_foot_index.x, nose.y - right_foot_index.y]) *
            [front_image.shape[1], front_image.shape[0]]
        )
        print(f"Head-to-toe distance (pixels): {head_to_toe_px}")

        # Calculate scaling factor based on the real-world height and head-to-toe distance in pixels
        scaling_factor = height_in_inches / head_to_toe_px
        print(f"Scaling factor: {scaling_factor}")

        # **Revised Chest Width Calculation** - Proportional scaling from shoulder-to-shoulder distance
        shoulder_to_shoulder_px = np.linalg.norm(
            np.array([left_shoulder.x - right_shoulder.x, left_shoulder.y - right_shoulder.y]) *
            [front_image.shape[1], front_image.shape[0]]
        )
        print(f"Shoulder-to-shoulder width (pixels): {shoulder_to_shoulder_px}")

        # inseam_length_px = np.linalg.norm(
        #     np.array([left_ankle.x - left_hip.x, left_ankle.y - left_hip.y]) *
        #     [side_image.shape[1], side_image.shape[0]]
        # )

        # Chest width should be a proportion of shoulder-to-shoulder width. We'll reduce it by a factor of 0.6 to 0.7.
        chest_width_px = shoulder_to_shoulder_px * 0.64  # This reduces the size to a more realistic chest measurement
        print(f"Chest width (pixels) - adjusted: {chest_width_px}")
        # 2. Waist width from front view
        waist_width_px = np.linalg.norm(
            np.array([left_hip.x - right_hip.x, left_hip.y - right_hip.y]) *
            [front_image.shape[1], front_image.shape[0]]
        )
        print(f"Waist width (pixels): {waist_width_px}")

        # 3. Shoulder to hip distance (front view)
        shoulder_to_hip_px = np.linalg.norm(
            np.array([left_shoulder.x - left_hip.x, left_shoulder.y - left_hip.y]) *
            [front_image.shape[1], front_image.shape[0]]
        )
        print(f"Shoulder to hip distance (pixels): {shoulder_to_hip_px}")

        # 4. Hip to toe distance (front view) using left foot
        hip_to_toe_px = np.linalg.norm(
            np.array([left_hip.x - left_foot_index.x, left_hip.y - left_foot_index.y]) *
            [front_image.shape[1], front_image.shape[0]]
        )
        print(f"Hip to toe distance (pixels): {hip_to_toe_px}")

        # hip_width_px = np.linalg.norm(
        #     np.array([left_hip.x - right_hip.x, left_hip.y - right_hip.y]) *
        #     [front_image.shape[1], front_image.shape[0]]
        # )


        chest_width_inch = chest_width_px * scaling_factor
        waist_width_inch = waist_width_px * scaling_factor
        shoulder_to_hip_inch = shoulder_to_hip_px * scaling_factor
        weight_factor = 1 + 0.015 * ((weight - 80) / 10)  # Basic adjustment based on weight over 80kg
        waist_width_inch *= weight_factor
        chest_width_inch *= weight_factor

        print(f"Estimated chest width: {chest_width_inch:.2f} inches")
        print(f"Estimated waist width: {waist_width_inch:.2f} inches")
        print(f"Estimated length: {shoulder_to_hip_inch:.2f} inches")
        # print(f"Estimated leg: {hip_to_ankle_inch:.2f} inches")

        # Visualize landmarks on the front image
        front_image_copy = front_image.copy()
        mp_drawing.draw_landmarks(front_image_copy, front_results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        # Return estimation results with the corresponding size
        return {
            "status": "success",
            "data": {
                "size": measure_upper_body_size(chest_width_inch, gender),
                "chest": chest_width_inch,
                "waist": waist_width_inch,
                "inseam": measure_lower_body_size(waist_width_inch, gender, calculate='inseam'),
                "shoulder": measure_upper_body_size(chest_width_inch, gender, calculate='shoulder'),
                "sleeve": measure_upper_body_size(chest_width_inch, gender, calculate='sleeve')
            }
        }
    except Exception as ex:
        app.logger.error(f"[size_estimation.py] | Exception occurred:{ex} | traceback info:{traceback.format_exc()}", exc_info=True)
        return {
            "status": "failure",
            "data": str(ex)
        }
