import gradio as gr
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

# Load models
models = {
    "VGG19 (Brain Tumor)": load_model("brain_tumor_vgg197_final.keras"),
    "Custom CNN (Brain Tumor)": load_model("brain_tumor_rgb_customs_cnn.keras"),
    "EfficientNet (Chest X-ray)": load_model("efficient_netB3.keras"),
    "DenseNet121 (Chest X-ray)": load_model("densenet_xray_classification.keras")
}

def predict_brain_tumor_or_xray(image, model_choice):
    try:
        if model_choice == "EfficientNet (Chest X-ray)":
            model = models[model_choice]
            label_mapping = {0: 'COVID19', 1: 'NORMAL', 2: 'PNEUMONIA'}

            image = image.convert("RGB")
            image = image.resize((224, 224))
            image = np.array(image) / 255.0
            image = np.expand_dims(image, axis=0)

            preds = model.predict(image)[0]

        elif model_choice == "DenseNet121 (Chest X-ray)":
            model = models[model_choice]
            label_mapping = {0: 'COVID19', 1: 'NORMAL', 2: 'PNEUMONIA'}

            image = image.convert("RGB")
            image = image.resize((224, 224))
            image = np.array(image) / 255.0
            image = np.expand_dims(image, axis=0)

            preds = model.predict(image)[0]

        elif model_choice == "VGG19 (Brain Tumor)":
            model = models[model_choice]
            label_mapping = {0: 'Glioma', 1: 'Meningioma', 2: 'No Tumor', 3: 'Pituitary'}

            image = image.convert("L")
            image = image.resize((224, 224))
            image = np.array(image) / 255.0
            if image.ndim == 2:
                image = np.expand_dims(image, axis=-1)
            image = np.expand_dims(image, axis=0)

            preds = model.predict(image)[0]

        else:  
            model = models[model_choice]
            label_mapping = {0: 'Glioma', 1: 'Meningioma', 2: 'No Tumor', 3: 'Pituitary'}

            image = image.convert("RGB")
            image = image.resize((128, 128))
            image = np.array(image) / 255.0
            image = np.expand_dims(image, axis=0)

            preds = model.predict(image)[0]

        class_idx = np.argmax(preds)
        class_name = label_mapping[class_idx]
        confidence = float(preds[class_idx])

        result = f"**Prediction:** {class_name}\n**Confidence:** {confidence:.4f}\n\n"
        result += "### Class Probabilities:\n"
        for i, prob in enumerate(preds):
            result += f"- {label_mapping[i]}: {prob:.4f}\n"

        return result

    except Exception as e:
        return f"❌ Error: {str(e)}"


# Gradio UI
gr.Interface(
    fn=predict_brain_tumor_or_xray,
    inputs=[
        gr.Image(type="pil", label="Upload Image (MRI or Chest X-ray)"),
        gr.Dropdown(
            choices=[
                "VGG19 (Brain Tumor)",
                "Custom CNN (Brain Tumor)",
                "EfficientNet (Chest X-ray)",
                "DenseNet121 (Chest X-ray)"
            ],
            value="VGG19 (Brain Tumor)",
            label="Select Model"
        )
    ],
    outputs=gr.Markdown(),
    title="🧠 Brain Tumor & Chest X-ray Classifier",
    description=(
        "Choose a model and upload an image to classify brain tumors or chest X-rays.\n\n"
        "- **VGG19 (Brain Tumor):** Brain tumor classification on MRI images (224x224).\n"
        "- **Custom CNN (Brain Tumor):** Brain tumor classification on RGB MRI images (128x128).\n"
        "- **EfficientNet (Chest X-ray):** Chest X-ray classification for COVID19, Normal, Pneumonia (224x224).\n"
        "- **DenseNet121 (Chest X-ray):** Chest X-ray classification using DenseNet (224x224)."
    )
).launch()
