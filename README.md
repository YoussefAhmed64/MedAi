Brain Tumor & Chest X-ray Classifier

Overview

This project is a web-based application built using Gradio, TensorFlow, and Keras to classify medical images, specifically brain MRIs and chest X-rays. It leverages pre-trained deep learning models to predict conditions such as brain tumors (Glioma, Meningioma, No Tumor, Pituitary) and chest X-ray conditions (COVID-19, Normal, Pneumonia). The application supports four models: VGG19 and a Custom CNN for brain tumor classification, and EfficientNet and DenseNet121 for chest X-ray classification.

Features

Brain Tumor Classification: Uses VGG19 and a Custom CNN to classify brain MRI images into four categories: Glioma, Meningioma, No Tumor, and Pituitary.

Chest X-ray Classification: Uses EfficientNet and DenseNet121 to classify chest X-ray images into three categories: COVID-19, Normal, and Pneumonia.

User-Friendly Interface: Built with Gradio, allowing users to upload images and select a model via a dropdown menu.

Detailed Output: Provides the predicted class, confidence score, and class probabilities for each prediction.

Requirements

To run this application, you need the following dependencies:

Python 3.8 or higher

TensorFlow/Keras

Gradio

NumPy

Pillow (PIL)

Pre-trained model files:

brain_tumor_vgg197_final.keras (VGG19 for brain tumors)

brain_tumor_rgb_customs_cnn.keras (Custom CNN for brain tumors)

efficient_netB3.keras (EfficientNet for chest X-rays)

densenet_xray_classification.keras (DenseNet121 for chest X-rays)
