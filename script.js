// CSCI 101 Project JavaScript
// Authors: Sahilpreet Singh (815334) & Bachitar Singh (816415)

// ARRAY of BCI innovations (Global and India)
var bciInnovations = [
  {
    title: "IISc Bengaluru Brain Co-Processor",
    region: "India",
    category: "Rehabilitation",
    summary: "Combines AI decoding and neuromorphic chips to help stroke patients regain motor and cognitive skills."
  },
  {
    title: "IIT Delhi Wearable Hybrid fNIRS-EEG",
    region: "India",
    category: "Non-Invasive Hardware",
    summary: "Low-power portable headset combining optical and electrical sensors for affordable brain monitoring."
  },
  {
    title: "BrainSightAI Connectomics",
    region: "India",
    category: "Clinical AI",
    summary: "Bengaluru startup using AI brain network mapping to guide safer neurosurgery."
  },
  {
    title: "AI Speech Restoration BCI",
    region: "Global",
    category: "Communication",
    summary: "Decodes motor cortex signals into text and synthesized speech for patients with paralysis."
  },
  {
    title: "Adaptive Closed-Loop Neuroprosthetics",
    region: "Global",
    category: "Assistive Robotics",
    summary: "Translates movement intent into robotic limb control while returning touch feedback to the brain."
  },
  {
    title: "Consumer Non-Invasive EEG Wearables",
    region: "Global",
    category: "Wellness & Control",
    summary: "Lightweight headsets using AI noise filtering to measure focus, fatigue, and hands-free commands."
  }
];

// Global variables for animated brainwave canvas
var wavePhase = 0;
var waveFrequency = 10;
var isAnimating = true;

// FUNCTION 1: Play a short synthesized audio tone using Web Audio API
function playNeuralTone(freqHz) {
  try {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    var ctx = new AudioCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = "sine";
    // Map brainwave Hz (1-40) into an audible pitch (220-620 Hz)
    osc.frequency.value = 220 + (freqHz * 10);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.log("Audio playback not supported in this browser.");
  }
}

// FUNCTION 2: Decode user-entered brainwave frequency using IF-ELSE statements
function decodeBrainwave() {
  var rawInput = document.getElementById("hzInput").value;
  var hz = parseFloat(rawInput);
  var resultDiv = document.getElementById("signalResult");

  if (isNaN(hz) || hz < 1 || hz > 40) {
    resultDiv.innerHTML = "<strong>Invalid Input:</strong> Please enter a number between <strong>1 and 40 Hz</strong>.";
    return;
  }

  waveFrequency = hz;
  playNeuralTone(hz);

  var bandName = "";
  var mentalState = "";
  var aiAction = "";

  if (hz < 4) {
    bandName = "Delta Wave (1–3.9 Hz)";
    mentalState = "Deep restorative sleep";
    aiAction = "AI switches assistive devices to low-power standby mode.";
  } else if (hz < 8) {
    bandName = "Theta Wave (4–7.9 Hz)";
    mentalState = "Drowsiness, deep relaxation, or memory recall";
    aiAction = "AI monitors fatigue levels and alerts rehabilitation systems.";
  } else if (hz < 13) {
    bandName = "Alpha Wave (8–12.9 Hz)";
    mentalState = "Calm, relaxed wakefulness";
    aiAction = "AI filters baseline background noise for clean calibration.";
  } else if (hz < 30) {
    bandName = "Beta Wave (13–29.9 Hz)";
    mentalState = "Active thinking, focus, and motor intention";
    aiAction = "AI decodes movement or cursor commands for a prosthetic arm.";
  } else {
    bandName = "Gamma Wave (30–40 Hz)";
    mentalState = "High-level cognitive processing and sensory binding";
    aiAction = "AI performs high-speed pattern recognition for complex tasks.";
  }

  resultDiv.innerHTML =
    "<strong>Detected Band:</strong> " + bandName + "<br>" +
    "<strong>Brain State:</strong> " + mentalState + "<br>" +
    "<strong>AI-BCI Response:</strong> " + aiAction;
}

// FUNCTION 3: Toggle wave animation
function toggleWaveAnimation() {
  isAnimating = !isAnimating;
  if (isAnimating) {
    drawBrainwave();
  }
}

// FUNCTION 4: Animate EEG wave on HTML5 Canvas using a FOR LOOP
function drawBrainwave() {
  var canvas = document.getElementById("brainCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw center reference line
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  // Draw animated neural waveform
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  for (var x = 0; x < canvas.width; x++) {
    var angle = (x * 0.025 * (waveFrequency / 8)) + wavePhase;
    var y = (canvas.height / 2) + Math.sin(angle) * 32 * Math.cos(x * 0.008);
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Label current Hz
  ctx.fillStyle = "#e0f2fe";
  ctx.font = "13px Arial";
  ctx.fillText("Simulated EEG Signal: " + waveFrequency + " Hz", 12, 20);

  wavePhase += 0.08;
  if (isAnimating) {
    requestAnimationFrame(drawBrainwave);
  }
}

// FUNCTION 5: Render items from array using a FOR LOOP
function renderProjectCards(items) {
  var container = document.getElementById("projectList");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = "No matching BCI projects found. Try another keyword like <strong>India</strong>, <strong>AI</strong>, or <strong>Speech</strong>.";
    return;
  }

  var html = "";
  for (var i = 0; i < items.length; i++) {
    html += "<div style='margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #cbd5e1;'>" +
            "<strong>" + items[i].title + "</strong> [" + items[i].region + " — " + items[i].category + "]<br>" +
            "<span>" + items[i].summary + "</span>" +
            "</div>";
  }
  container.innerHTML = html;
}

// FUNCTION 6: Filter array using a LOOP and IF-ELSE condition
function searchProjects() {
  var keyword = document.getElementById("searchBox").value.toLowerCase().trim();
  var matches = [];

  for (var i = 0; i < bciInnovations.length; i++) {
    var combined = (bciInnovations[i].title + " " + bciInnovations[i].region + " " + bciInnovations[i].category + " " + bciInnovations[i].summary).toLowerCase();
    if (combined.indexOf(keyword) !== -1) {
      matches.push(bciInnovations[i]);
    }
  }
  renderProjectCards(matches);
}

function showAllProjects() {
  document.getElementById("searchBox").value = "";
  renderProjectCards(bciInnovations);
}

// FUNCTION 7: Evaluate quiz dropdown with IF-ELSE
function checkQuizAnswer() {
  var choice = document.getElementById("quizSelect").value;
  var feedback = document.getElementById("quizFeedback");

  if (choice === "") {
    feedback.innerHTML = "Please choose an answer from the dropdown first.";
  } else if (choice === "eeg") {
    feedback.innerHTML = "<strong>Correct!</strong> Non-invasive EEG and fNIRS headsets read brain signals safely from the scalp without surgery.";
    playNeuralTone(15);
  } else {
    feedback.innerHTML = "<strong>Not quite.</strong> Microelectrode arrays and ECoG grids require surgery. Try the non-invasive option!";
  }
}

// Initialize page elements when loaded
window.onload = function() {
  drawBrainwave();
  showAllProjects();
};
