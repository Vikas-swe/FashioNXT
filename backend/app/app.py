import json
import time
import traceback
import re
import base64
from crypt import methods
from itertools import product

import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from future.backports.datetime import datetime
from jaxlib.xla_extension import json_to_pprof_profile
from pydantic.v1.datetime_parse import datetime_re

from ChatCodeOpenAI import get_user_preference
from skin_tone_model import train_lab_lbp_model, detect_skin_color
from controller.measurement import size_estimation
import logging, os, certifi
from supabase import create_client, Client
import uuid
import ssl
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
PUBLIC_BUCKET_NAME = os.getenv("PUBLIC_BUCKET")
VTON_API_KEY=os.getenv('VTON_API_KEY')
cascade_path = os.getenv('CASCADE_PATH')
ssl._create_default_https_context = ssl._create_unverified_context

os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()

app = Flask(__name__, static_folder='./dist')
CORS(app)
logger = logging.getLogger(__name__)

model = train_lab_lbp_model()
supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

# Serve the front-end entry point
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Serve other static files
@app.route('/assets/<path:path>')
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, 'assets'), path)

@app.route('/<path:path>')
def catch_all(path):
    return send_from_directory(os.path.join(app.static_folder), 'index.html')

@app.route('/api/matrix')
def index():
    return "Hello, Matrix Users!"


@app.route('/api/matrix/uploadAsset', methods=['POST'])
def upload_asset():
    try:
        app.logger.info("[Matrix-app.py] upload_asset API | Start")
        data = request.get_json()
        required_fields = ['type', 'base64', 'userID', 'fileType']
        missing_or_null_fields = [field for field in required_fields if not data.get(field)]

        if missing_or_null_fields:
            return jsonify({
                'error': 'Missing or invalid parameters',
                'missing_fields': missing_or_null_fields
            }), 400

        file_content = base64.b64decode(data['base64'])
        user_id = data.get('userID')
        # response = supabase.table('auth.users').select('*').execute()
        # response = supabase.auth.get_user(user_id)
        #
        # if not response.data:
        #     return jsonify({
        #         'error': 'User not found',
        #         'userId': user_id
        #     }), 404
        file_type = data['type']
        file_name = f"assets/{file_type}/{user_id}/{uuid.uuid4()}.{data.get('fileType')}"
        response = None
        response = supabase.storage.from_(PUBLIC_BUCKET_NAME).upload(file_name, file_content)
        if not response:
            return jsonify({'error': 'Failed to upload file to Supabase bucket', 'details': response['error']}), 500

        public_url = supabase.storage.from_(PUBLIC_BUCKET_NAME).get_public_url(file_name)
        asset_data = {
            'type': data.get('type'),
            'user_id': user_id,
            'base64': data.get('base64'),
            'public_url': public_url
        }
        upload_data = supabase.table('asset').insert([asset_data]).execute()
        return jsonify({'id': upload_data.data[0].get('id'), 'url': public_url}), 200
    except Exception as e:
        app.logger.error(f"[Matrix-app.py] upload_asset API | exception occured | ex:{e}", exc_info=True)
        return jsonify(status="failure", error=str(e))




@app.route('/api/get_files/<string:user_id>', methods=['GET'])
def get_files(user_id):
    try:
        # Define the path to the images
        folder_path = f"assets/image/{user_id}/"
        
        # Fetch the list of files in the specified folder
        files = supabase.storage.from_(PUBLIC_BUCKET_NAME).list(folder_path)
        # If no files are found, return an empty list
        if not files:
            return jsonify({"user_id": user_id, "images": []})
        
        return jsonify({"user_id": user_id, "files": files})

        # Extract the image URLs from the list of files
        # print(files)
        # image_urls = []
        # for file in files:
        #     print(file)
        #     # file_name = file['name']
        #     # Construct the public URL for each file
        #     file_url = supabase.storage.from_(PUBLIC_BUCKET_NAME).get_public_url(f"{folder_path}{'04f51d23-8f3c-438a-9037-0b2e24700812.png'}")
        #     image_urls.append(file_url['publicURL'])

        # # Return the list of image URLs
        # return jsonify({"user_id": user_id, "images": image_urls})

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500


@app.route('/api/matrix/users/add', methods=['POST'])
def add_user():
    try:
        app.logger.info("[Matrix-app.py] add_user API | Start")
        data = request.get_json()
        supabase.auth.sign_up({"email": data.get('email'), "password": data.get('password')})
        return jsonify(message='User added successfully')
    except Exception as e:
        app.logger.error(f"[Matrix-app.py] add_user API | exception occured | ex:{e}", exc_info=True)
        return jsonify(status="failure", error=str(e))



@app.route('/api/matrix/users', methods=['GET'])
def get_user():
    try:
        app.logger.info("[Matrix-app.py] get_user API | Start")
        user_id = request.args.get('userID')
        if user_id:
            user_data = supabase.table('user').select('*').eq('user_id', user_id).execute().data
            if user_data:
                user = user_data[0]
                path_prefix = f"assets/image/{user_id}/"
                files = supabase.storage.from_("matrix_public").list(path_prefix)
                images = []
                if files:
                    for file in files:
                        image_url = supabase.storage.from_("matrix_public").get_public_url(f"assets/image/{user_id}/{file['name']}")
                        images.append(image_url)

                user['images'] = images
                response = user
        else:
            response = supabase.table('user').select('*').execute().data
        return jsonify(status='success', data=response)
    except Exception as ex:
        app.logger.error(f"[Matrix-app.py] add_user API | exception occured | ex:{ex}", exc_info=True)
        return jsonify(status="failure", error=str(ex))


#----------Fetch all clothing products---------------
@app.route('/api/products', methods=['GET'])
def fetch_all_products():
    try:
        app.logger.info("[Matrix-app.py] Fetch All Products | Start")
        category = request.args.get('gender')
        cloth_prefernce = request.args.get('cloth_preference')
        if category and cloth_prefernce:
            response = (
                supabase.table("Products")
                .select("*")
                .eq("meta->>cloth_type", f"{cloth_prefernce}")
                .eq("category",f"{category}")
                .execute()
            )
        elif category:
            response = (
                supabase.table("Products")
                .select("*")
                .eq("category", f"{category}")
                .execute()
            )
        elif cloth_prefernce:
            response = (
                supabase.table("Products")
                .select("*")
                .eq("meta->>cloth_type", f"{cloth_prefernce}")
                .execute()
            )
        else:
            response = supabase.table("Products").select("*").execute()
        return jsonify(response.data)
    except Exception as e:
        app.logger.error(f"[Matrix-app.py] Fetch All Products API | exception occured | ex:{e}", exc_info=True)



@app.route('/api/products/<int:product_id>', methods=['GET'])
def fetch_single_product(product_id):
    try:
        app.logger.info("[Matrix-app.py] Fetch Single Products | Start")
        response = supabase.table("Products").select("*").eq("id",f"{product_id}").execute()
        return jsonify(response.data)
    except Exception as e:
        app.logger.error(f"[Matrix-app.py] Fetch Fetch Products API | exception occured | ex:{e}", exc_info=True)


@app.route('/api/matrix/sizeMeasurement', methods=['POST'])
def size_measurement_route():
    try:
        data = request.get_json()
        update = request.args.get('update')
        required_fields = ['height', 'weight', 'frontImage', 'sideImage', 'userID', 'gender']
        missing_or_null_fields = [field for field in required_fields if not data.get(field)]
        if not update and missing_or_null_fields:
            return jsonify({
                'error': 'Missing or invalid parameters',
                'missing_fields': missing_or_null_fields
            }), 400

        user_id = data.get('userID')
        measurements = None
        skin_tone = None
        if not update:
            measurements = size_estimation(
                height=data.get('height'),
                weight=data.get('weight'),
                frontImageID=data.get('frontImage'),
                sideImageID=data.get('sideImage'),
                gender=data.get('gender')
            )
            front_image_base64 = \
            supabase.table('asset').select('base64').eq('id', data.get('frontImage')).execute().data[0].get('base64')
            print(datetime.now())
            skin_tone = detect_skin_color(front_image_base64, model, cascade_path)
            print(datetime.now())
        user_response = supabase.table('user').select('*').eq('user_id', user_id).execute().data
        if update:
            if user_response:
                supabase.table('user').update({'size_measurements': data['size_measurements']}).eq('user_id',
                                                                                                   user_id).execute()
                measurements = data['size_measurements']
            else:
                return jsonify({'error': 'User not found'}), 404
        elif user_response:
            if measurements:
                supabase.table('user').update({'size_measurements': measurements['data']}).eq('user_id',
                                                                                              user_id).execute()
            if skin_tone:
                supabase.table('user').update({'skin_tone': skin_tone}).eq('user_id', user_id).execute()
        else:
            front_image_url = \
            supabase.table('asset').select('public_url').eq('id', data.get('frontImage')).execute().data[0].get(
                'public_url')
            side_image_url = \
            supabase.table('asset').select('public_url').eq('id', data.get('sideImage')).execute().data[0].get(
                'public_url')
            user_data = {
                "user_id": user_id,
                "front_image_url": front_image_url,
                "side_image_url": side_image_url,
                "size_measurements": measurements['data'] if measurements else None,
                "height": data.get('height'),
                "weight": data.get('weight'),
                "gender": data.get('gender'),
                "skin_tone": skin_tone if skin_tone else None
            }
            supabase.table('user').insert([user_data]).execute()
        return jsonify(measurements), 200
    except Exception as ex:
        app.logger.error(
            f"[size_measurement_route] | Exception occurred: {ex} | traceback info: {traceback.format_exc()}",
            exc_info=True)
        return jsonify({'error': 'Internal server error', 'message': str(ex)}), 500



@app.route('/api/matrix/userPreference', methods=['POST'])
def user_preference():
    try:
        data = request.get_json()
        prompt = request.args.get('ai')
        if prompt:
            required_fields = ['prompt', 'userID']
        else:
            required_fields = ['style', 'occasion', 'feel', 'userID']
        missing_or_null_fields = [field for field in required_fields if not data.get(field)]
        if missing_or_null_fields:
            return jsonify({
                'error': 'Missing or invalid parameters',
                'missing_fields': missing_or_null_fields
            }), 400
        if prompt:
            payload_input = get_user_preference(data.get('prompt'))
            payload = json.loads(payload_input)
        else:
            payload={
                "style": data['style'],
                "occasion": data['occasion'],
                "feel": data['feel']
            }
        supabase.table('user').update({'user_preference': payload}).eq('user_id', data.get('userID')).execute()
        return payload
    except Exception as ex:
        app.logger.error(
            f"[Matrix-app.py] Exception Occured: {ex}, traceback: {traceback.format_exc()}",
            exc_info=True
        )
        app.logger.error(ex)
        response_payload = {
            "status": "failure",
            "error": str(ex)
        }
        return response_payload




@app.route('/api/try-on', methods=['POST'])
def try_on():
    data = request.get_json()
    if not data.get('model_image') or not data.get('garment_image') or not data.get('category'):
        return jsonify({"error": "Missing required parameters: model_image, garment_image, category"}), 400
    if data['category'] not in ['tops', 'bottoms', 'one-piece']:
        return jsonify({"error": "Invalid category. Must be one of ['tops', 'bottoms', 'one-pieces']"}), 400
    payload = {
        "model_image": data['model_image'],
        "garment_image": data['garment_image'],
        "category": data['category']
    }
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {VTON_API_KEY}'
    }
    url = 'https://api.fashn.ai/v1/run'
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            return jsonify({"error": f"External API request failed with status code {response.status_code}"}), 500
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error occurred: {str(e)}"}), 500

@app.route('/api/try-on-status/<task_id>', methods=['GET'])
def check_status(task_id):
    url = f'https://api.fashn.ai/v1/status/{task_id}'
    headers = {
        'Authorization': f'Bearer {VTON_API_KEY}'
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return jsonify({"error": f"Failed to retrieve task status with status code {response.status_code}"}), 500
        data = response.json()
        if 'status' in data:
            status = data['status']
            if status == 'completed' and 'output' in data:
                image_base64 = image_to_base64(data['output'][0])
                return jsonify({
                    "id": task_id,
                    "status": status,
                    "output": image_base64,
                    "error": data.get('error', None)
                })
            elif status != 'completed':
                return jsonify({
                    "id": task_id,
                    "status": status,
                    "error": data.get('error', None)
                })
            elif status == 'completed' and 'output' not in data:
                return jsonify({
                    "id": task_id,
                    "status": status,
                    "error": data.get('error', None)
                })
        return jsonify({"error": "Invalid response format from external API"}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error occurred: {str(e)}"}), 500

def image_to_base64(image_url):
    try:
        return base64.b64encode(requests.get(image_url).content).decode('utf-8')
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to fetch or encode image: {str(e)}"}


if __name__ == "__main__":
    app.run(debug=True)
