from flask import Flask, send_from_directory
import os
from .app import app as app_blueprint  # Import the app blueprint from app.py

def create_app():
    # Initialize the Flask application
    app = Flask(__name__, static_folder='./dist')

    # Serve the front-end entry point
    @app.route('/')
    def index():
        return send_from_directory(app.static_folder, 'index.html')

    # Serve other static files
    @app.route('/<path:path>')
    def serve_static(path):
        return send_from_directory(app.static_folder, path)

    # Register the app blueprint for API routes
    app.register_blueprint(app_blueprint)

    return app
