let currentQuestionIndex = -1;
let answers = {};
let isWaitingForImage = false;
let chatActive = false;
let selectedModel = null;

const questions = [
    "Skin & Nail Symptoms",
    "Respiratory & Throat Symptoms",
    "Gastrointestinal & Digestive Symptoms",
    "Urinary & Bladder Symptoms",
    "Liver & Metabolic Symptoms",
    "Fever/Infection/Inflammation",
    "Neurological & Sensory Symptoms",
    "Musculoskeletal & Joint Symptoms",
    "Cardiovascular & Circulation",
    "Weight/Appetite & Endocrine",
    "Psychological & Mood Symptoms",
    "Eye & Vision Symptoms",
    "Miscellaneous/Other",
    "Risk Factors & Exposures"
];

const textModels = [
    { name: "KNN Model", value: "knn" },
    { name: "Decision Tree Model", value: "decision_tree" },
    { name: "Random Forest Model", value: "random_forest" }
];

const skinModels = [
    { name: "Skin Disease Model", value: "best_skin_cnn__model_fold_2.keras" }
];

const brainModels = [
    { name: "VGG16", value: "brain_tumor_vgg1999" },
    { name: "Custom CNN", value: "brain_tumor_rgb_customs_cnn" }
];

// DOM Elements
const messagesDiv = document.querySelector('.messages');
const inputField = document.querySelector('input');
const sendButton = document.querySelector('button');
const uploadButton = document.createElement('button');
const fileInput = document.createElement('input');
const modelSelect = document.getElementById('model-select');
const modelSelection = document.querySelector('.model-selection');

// Setup UI
uploadButton.innerHTML = '+';
uploadButton.className = 'upload-btn';
uploadButton.style.display = 'none';

fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';

document.querySelector('.input-container').appendChild(uploadButton);
document.querySelector('.input-container').appendChild(fileInput);

function initChat() {
    currentQuestionIndex = -1;
    chatActive = false;
    isWaitingForImage = false;
    answers = {};
    selectedModel = null;
    uploadButton.style.display = 'none';
    modelSelection.style.display = 'none';
    messagesDiv.innerHTML = '';
    addBotMessage("🩺 Welcome to MedAI! Choose an option:\n1: Text Symptom Analysis\n2: Image Analysis");
}

function populateModelSelect(models) {
    modelSelect.innerHTML = '<option value="">Select a model...</option>';
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.name;
        modelSelect.appendChild(option);
    });
    modelSelection.style.display = 'block';
}

function handleModelSelection() {
    selectedModel = modelSelect.value;
    if (!selectedModel) {
        showError("Please select a model");
        return false;
    }
    modelSelection.style.display = 'none';
    selectedModel = null;
    chatActive = true;
    currentQuestionIndex = 0;
    askQuestion();
    return true;
}

function addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'message bot-message';
    msg.textContent = text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'message user-message';
    msg.textContent = text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showError(text) {
    addBotMessage(`❌ ${text}`);
}

async function processImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 64, 64);
                
                const preview = document.createElement('img');
                preview.src = canvas.toDataURL();
                preview.style.maxWidth = '200px';
                preview.style.margin = '10px 0';
                addBotMessage("Uploaded image:");
                messagesDiv.appendChild(preview);
                
                resolve(canvas.toDataURL('image/jpeg'));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

async function predictSymptoms() {
    addBotMessage("Analyzing your symptoms...");
    
    try {
        const response = await fetch('http://localhost:8000/predict-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answers)
        });
        
        if (!response.ok) throw new Error(await response.text());
        
        const data = await response.json();
        showResults(data);
    } catch (error) {
        showError(`Prediction failed: ${error.message}`);
        askToRestart();
    }
}

async function predictImage(file) {
    if (!handleModelSelection()) return;
    
    addBotMessage("Analyzing your image...");
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', selectedModel);
        
        const response = await fetch('http://localhost:8000/predict-image', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error(await response.text());
        
        const data = await response.json();
        showImageResults(data);
    } catch (error) {
        showError(`Image analysis failed: ${error.message}`);
        askToRestart();
    }
}

function showResults(data) {
    const result = `Diagnosis: ${data.prediction}\nConfidence: ${(data.confidence * 100).toFixed(1)}%`;
    addBotMessage(result);
    askToRestart();
}

function showImageResults(data) {
    const result = `Skin Condition: ${data.prediction}\nConfidence: ${(data.confidence * 100).toFixed(1)}%`;
    addBotMessage(result);
    askToRestart();
}

function askToRestart() {
    addBotMessage("Type 'restart' to begin a new session or anything else to exit.");
    isWaitingForImage = false;
    chatActive = false;
}

function handleInitialChoice(choice) {
    if (choice === '1') {
        populateModelSelect(textModels);
        addBotMessage("Please select a model from the dropdown menu:\n1. KNN Model\n2. Random Forest Model\n3. Decision Tree Model");
    } else if (choice === '2') {
        addBotMessage("Please select the type of image analysis:\n1. Skin Disease\n2. Brain Tumor");
        isWaitingForImage = true;
    } else {
        showError("Please enter 1 or 2");
    }
}

function handleImageTypeChoice(choice) {
    if (choice === '1') {
        populateModelSelect(skinModels);
        addBotMessage("Please select a model from the dropdown menu");
    } else if (choice === '2') {
        populateModelSelect(brainModels);
        addBotMessage("Please select a model from the dropdown menu");
        uploadButton.style.display = 'inline-block';
    } else {
        showError("Please enter 1 or 2");
    }
}

function askQuestion() {
    addBotMessage(`Have you experienced any ${questions[currentQuestionIndex]}? (Yes/No)`);
}

function handleUserInput(input) {
    const normalized = input.toLowerCase();
    if (!['yes', 'no', 'y', 'n'].includes(normalized)) {
        showError("Please answer with Yes or No");
        return false;
    }
    
    answers[questions[currentQuestionIndex]] = normalized.startsWith('y');
    currentQuestionIndex++;
    return true;
}

function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;
    
    addUserMessage(message);
    
    if (!chatActive && !isWaitingForImage) {
        if (message.toLowerCase() === 'restart') {
            initChat();
        } else if (modelSelection.style.display === 'none') {
            handleInitialChoice(message);
        } else if (selectedModel === null) {
            handleModelSelection();
        } else {
            handleImageTypeChoice(message);
        }
    } else if (isWaitingForImage) {
        handleImageTypeChoice(message);
    } else if (chatActive) {
        if (!handleUserInput(message)) {
            inputField.value = '';
            return;
        }
        
        if (currentQuestionIndex < questions.length) {
            askQuestion();
        } else {
            predictSymptoms();
        }
    }
    
    inputField.value = '';
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
uploadButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
        await predictImage(e.target.files[0]);
        fileInput.value = '';
        uploadButton.style.display = 'none';
    }
});

// Start the chat
initChat();
