#!/bin/bash

# Setup script for incryptx-backend Python environment
# This script creates a virtual environment and installs all required packages

echo "Setting up Python environment for incryptx-backend..."

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install required packages
echo "Installing required packages..."
pip install torch transformers datasets peft accelerate bitsandbytes huggingface_hub

# Create requirements.txt
echo "Creating requirements.txt..."
pip freeze > requirements.txt

echo "Setup complete!"
echo "To activate the environment in the future, run: source venv/bin/activate"
echo "To install packages from requirements.txt, run: pip install -r requirements.txt"
