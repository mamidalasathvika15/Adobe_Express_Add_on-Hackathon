const TUTORIALS = {
  'add-text': [
    {
      title: 'Step 1',
      description: "Click the 'Text' tool in the left toolbar.",
      speak: "Please move your cursor and click on the Text tool on the left side of the interface.",
      gif: 'https://i.postimg.cc/Y96sKxrF/add-text-step1.gif' // Add your GIF URL if desired
    },
    {
      title: 'Step 2',
      description: 'Click the "Add your text" button.',
      speak: "Now, click the button that says Add your text to insert a text box.",
      gif: 'https://i.postimg.cc/jjtK0SN3/add-element-step1-2.gif'
    },
    {
      title: 'Step 3',
      description: 'Edit your text on the canvas.',
      speak: "Edit your new text directly on the canvas by clicking inside the text box.",
      gif: 'https://i.postimg.cc/yNjKVCy1/add-element-step1-3.gif'
    }
  ],
  'add-elements': [
    {
      title: 'Step 1',
      description: "Click the 'Elements' tool in the left toolbar.",
      speak: "Please click on the Elements tool in the left toolbar of the editor.",
      gif: 'https://i.postimg.cc/R0XkkQvq/add-element-step2-1.gif'
    },
    {
      title: 'Step 2',
      description: 'Select any element or graphic to add it.',
      speak: "Now, pick any element or graphic you want to add by clicking on it.",
      gif: 'https://i.postimg.cc/mDn0DLzs/add-element-step2-2.gif '
    },
    {
      title: 'Step 3',
      description: 'Drag or resize the new element on your project.',
      speak: "You can now drag or resize your new element on the canvas.",
      gif: 'https://i.postimg.cc/Tw1zfLP0/add-element-step2-3.gif'
    }
  ],
};

let currentSteps = [];
let currentStepIdx = 0;
let currentTutorialKey = "";

const panel = document.getElementById('instructionPanel');
const stepTitle = document.getElementById('stepTitle');
const stepDescription = document.getElementById('stepDescription');
const stepGif = document.getElementById('stepGif');
const replayBtn = document.getElementById('replayAudio');
const nextStepBtn = document.getElementById('nextStep');
const skipBtn = document.getElementById('skipTutorial');

// Speech Synthesis controls
function speakText(text) {
  if (!window.speechSynthesis) {
    alert('Speech synthesis is not supported in this browser.');
    return;
  }
  window.speechSynthesis.cancel(); // Stop any ongoing speech
  if (text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.04;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }
}
function startTutorial(tutorialKey) {
  currentTutorialKey = tutorialKey;
  currentSteps = TUTORIALS[tutorialKey];
  currentStepIdx = 0;
  showStep();
  panel.classList.remove("hidden");
  // Hide main screen
  document.querySelector('.tutorial-buttons').style.display = "none";
  document.querySelector('.logo-title').style.display = "none";
  // Show End Tutorial as fixed button
  document.getElementById('skipTutorial').style.display = "block";
}
function showStep() {
  const step = currentSteps[currentStepIdx];

  // Text
  stepTitle.textContent = step.title;
  stepDescription.textContent = step.description;

  // GIF display
  if (step.gif && step.gif.trim() !== '') {
    stepGif.src = step.gif;
    stepGif.style.display = "block";
  } else {
    stepGif.src = "";
    stepGif.style.display = "none";
  }

  // Speak the step aloud using synth
  if (step.speak && step.speak.trim() !== '') {
    speakText(step.speak);
  }

  // Show pointer if selector provided
  if (step.selector) {
    showPointer(step.selector);
  } else {
    hidePointer();
  }
}

replayBtn.onclick = () => {
  const step = currentSteps[currentStepIdx];
  if (step && step.speak) speakText(step.speak);
};

nextStepBtn.onclick = () => {
  hidePointer();
  window.speechSynthesis.cancel();
  currentStepIdx++;
  if (currentStepIdx < currentSteps.length) {
    showStep();
  } else {
    endTutorial();
  }
};

skipBtn.onclick = endTutorial;



function endTutorial() {
  hidePointer();
  window.speechSynthesis.cancel();
  panel.classList.add("hidden"); // hide tutorial panel
  currentTutorialKey = "";
  // Reset to main screen
  document.querySelector('.tutorial-buttons').style.display = "flex";
  document.querySelector('.logo-title').style.display = "flex";
  // Also, hide End Tutorial button again
  document.getElementById('skipTutorial').style.display = "none";
}

skipBtn.onclick = endTutorial;

window.onload = () => {
  document.getElementById("start-tutorial-add-text").onclick = () => startTutorial("add-text");
  document.getElementById("start-tutorial-add-elements").onclick = () => startTutorial("add-elements");
  // Add End Tutorial button handler
  document.getElementById("skipTutorial").onclick = endTutorial;
};


function showPointer(selector) {
  if (window.addOnUISdk) {
    window.addOnUISdk.app.proxy("documentSandbox", "showPointer", { selector });
  }
}

function hidePointer() {
  if (window.addOnUISdk) {
    window.addOnUISdk.app.proxy("documentSandbox", "hidePointer", {});
  }
}

// Wire up buttons on window load
window.onload = () => {
  document.getElementById("start-tutorial-add-text").onclick = () => startTutorial("add-text");
  document.getElementById("start-tutorial-add-elements").onclick = () => startTutorial("add-elements");
};
