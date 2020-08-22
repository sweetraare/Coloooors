//global variables
let initalColors;
let savedPalettes;

//selector
const colorDivs = document.querySelectorAll(".color");
const generateColors = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelectorAll(".color h2");
const copyContainer = document.querySelector(".copy-container");
const saveContainer = document.querySelector(".save-container");
const libraryContainer = document.querySelector(".library-container");
const adjustButtons = document.querySelectorAll(".adjust");
const lockButtons = document.querySelectorAll(".lock");
const closeAdjustmentButtons = document.querySelectorAll(".close-adjustment");
const generateButton = document.querySelector("button.generate");
const saveButton = document.querySelector("button.save");
const closeSaveButton = document.querySelector(".close-save");
const libraryButton = document.querySelector("button.library");
const closeLibraryButton = document.querySelector(".close-library");
const submitSave = document.querySelector("button.submit-save");
const saveName = document.querySelector(".save-name");

//event listeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((colorDiv, index) => {
  colorDiv.addEventListener("change", () => {
    updateText(index);
  });
});

currentHex.forEach((ch) => {
  ch.addEventListener("click", () => {
    copyToClipborard(ch);
  });
});

copyContainer.addEventListener("transitionend", () => {
  copyContainer.classList.remove("active");
  copyContainer.children[0].classList.remove("active");
});

adjustButtons.forEach((adjustButton) => {
  adjustButton.addEventListener("click", () =>
    handleAdjustButtonClick(adjustButton)
  );
});

closeAdjustmentButtons.forEach((closeAdjustmentButton) => {
  closeAdjustmentButton.addEventListener("click", (e) => {
    e.target.parentElement.classList.toggle("active");
  });
});

generateButton.addEventListener("click", randomColors);

lockButtons.forEach((lockButton) => {
  lockButton.addEventListener("click", () => handleLockButtonClick(lockButton));
});

saveButton.addEventListener("click", () => {
  saveContainer.classList.add("active");
  saveContainer.children[0].classList.add("active");
});

closeSaveButton.addEventListener("click", () => {
  closeSave();
});

libraryButton.addEventListener("click", () => {
  libraryContainer.classList.add("active");
  libraryContainer.children[0].classList.add("active");
});

closeLibraryButton.addEventListener("click", () => {
  closeLibrary();
});

submitSave.addEventListener("click", () => {
  savePallette();
});

//functions
function generateRandomColor() {
  return chroma.random();
}

function checkContrast(backgroundColor, text) {
  const luminance = chroma(backgroundColor).luminance();

  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders({ color, hue, brightness, saturation }) {
  //saturation
  const minSaturation = color.set("hsl.s", 0);
  const maxSaturation = color.set("hsl.s", 1);
  const saturationSacale = chroma.scale([minSaturation, color, maxSaturation]);
  saturation.style.backgroundImage = `linear-gradient(to right, ${saturationSacale(
    0
  )}, ${saturationSacale(1)})`;

  //brigthness -> min is black, max is white, so I need the mid one
  const midBrightness = color.set("hsl.l", 0.5);
  const brightnessSacale = chroma.scale(["black", midBrightness, "white"]);
  brightness.style.backgroundImage = `linear-gradient(to right, ${brightnessSacale(
    0
  )}, ${brightnessSacale(0.5)}, ${brightnessSacale(1)})`;

  //hue
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-brightness") ||
    e.target.getAttribute("data-saturation");

  const sliders = e.target.parentElement.querySelectorAll(
    'input[type="range"]'
  );

  const newColorObj = {};

  sliders.forEach((slider) => {
    newColorObj[slider.getAttribute("name")] = +slider.value;
  });

  const selectedColorDiv = colorDivs[index];

  const currentColor = initalColors[index];

  const newColor = chroma(currentColor)
    .set("hsl.h", newColorObj.hue)
    .set("hsl.s", newColorObj.saturation)
    .set("hsl.l", newColorObj.brightness);

  selectedColorDiv.style.backgroundColor = newColor;

  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  colorizeSliders({ color: newColor, hue, brightness, saturation });
}

function updateText(index) {
  const currentColorDiv = colorDivs[index];

  const color = chroma(currentColorDiv.style.backgroundColor);
  const text = currentColorDiv.querySelector("h2");
  const icons = currentColorDiv.querySelectorAll("i");

  text.innerText = color.hex();

  checkContrast(color, text);

  icons.forEach((icon) => {
    checkContrast(color, icon);
  });
}

function resetSliders() {
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = chroma(initalColors[slider.getAttribute("data-hue")]);
      const hueValue = hueColor.hsl()[0];
      slider.value = hueValue;
    }

    if (slider.name === "saturation") {
      const saturationColor = chroma(
        initalColors[slider.getAttribute("data-saturation")]
      );
      const saturationValue = saturationColor.hsl()[1];
      slider.value = saturationValue;
    }

    if (slider.name === "brightness") {
      const brightnessColor = chroma(
        initalColors[slider.getAttribute("data-brightness")]
      );
      const brightnessValue = brightnessColor.hsl()[2];
      slider.value = brightnessValue;
    }
  });
}

function copyToClipborard(hex) {
  const auxElement = document.createElement("textarea");
  auxElement.value = hex.innerText;
  document.body.appendChild(auxElement);
  auxElement.select();
  document.execCommand("copy");
  document.body.removeChild(auxElement);

  copyContainer.classList.add("active");
  copyContainer.children[0].classList.add("active");
}

function handleAdjustButtonClick(adjustButton) {
  adjustButton.parentElement.parentElement
    .querySelector(".sliders")
    .classList.toggle("active");
}

function handleLockButtonClick(lockButton) {
  const icon = lockButton.children[0];

  if (icon.classList.contains("fa-lock-open")) {
    icon.classList.remove("fa-lock-open");
    icon.classList.add("fa-lock");
  } else {
    icon.classList.remove("fa-lock");
    icon.classList.add("fa-lock-open");
  }

  lockButton.parentElement.parentElement.classList.toggle("locked");
}

function closeSave() {
  saveContainer.classList.remove("active");
  saveContainer.children[0].classList.remove("active");
}

function closeLibrary() {
  libraryContainer.classList.remove("active");
  libraryContainer.children[0].classList.remove("active");
}

function savePallette() {
  const colors = [];

  currentHex.forEach((color) => {
    colors.push(color.innerText);
  });

  const name = saveName.value;

  saveToLocalStorage({ name, colors });
  saveName.value = "";
  closeSave();
}

function saveToLocalStorage(newPaletteObject) {
  let storageArray;

  if (localStorage.getItem("palettes")) {
    storageArray = JSON.parse(localStorage.getItem("palettes"));
  } else {
    storageArray = [];
  }

  storageArray.push(newPaletteObject);

  localStorage.setItem("palettes", JSON.stringify(storageArray));

  savedPalettes = storageArray;

  updateLibrary(newPaletteObject, savedPalettes.length - 7);
}

function updateLibrary({ name, colors }, index) {
  const preview = document.createElement("div");
  preview.classList.add("preview");

  const previewName = document.createElement("h5");
  previewName.classList.add("preview-name");
  previewName.innerHTML = name;

  const colorsContainer = document.createElement("div");
  colorsContainer.classList.add("colors-container");

  colors.forEach((color) => {
    const smallColor = document.createElement("div");
    smallColor.classList.add("small-color");
    smallColor.style.background = color;

    colorsContainer.appendChild(smallColor);
  });

  const previewButton = document.createElement("button");
  previewButton.classList.add("preview-button");
  previewButton.innerText = "Select!";
  previewButton.setAttribute("data-number", `${index}`);
  previewButton.addEventListener("click", (e) => {
    pickPallete(e.target);
  });

  preview.appendChild(previewName);
  preview.appendChild(colorsContainer);
  preview.appendChild(previewButton);

  libraryContainer.children[0].appendChild(preview);
}

function pickPallete(selectedPallete) {
  const selectedPalleteIndex = selectedPallete.dataset.number;
  const pallete = savedPalettes[selectedPalleteIndex];
  initalColors = savedPalettes[selectedPalleteIndex].colors;

  colorDivs.forEach((colorDiv, index) => {
    const color = pallete.colors[index];
    colorDiv.style.backgroundColor = color;
    const text = colorDiv.querySelector(".color h2");
    const icons = colorDiv.querySelectorAll("i");

    text.innerText = color;
    checkContrast(color, text);

    icons.forEach((icon) => {
      checkContrast(color, icon);
    });
  });
  resetSliders();
  closeLibrary();
}

function getDataFromLocalStorage() {
  if (localStorage.getItem("palettes")) {
    savedPalettes = JSON.parse(localStorage.getItem("palettes"));
  } else {
    savedPalettes = [];
  }

  savedPalettes.forEach((pallete, index) => {
    updateLibrary(pallete, index);
  });
}

function randomColors() {
  initalColors = [];
  colorDivs.forEach((colorDiv) => {
    const text = colorDiv.querySelector("h2");
    const icons = colorDiv.querySelectorAll("i");

    const randomColor = generateRandomColor();

    if (colorDiv.classList.contains("locked")) {
      initalColors.push(text.innerText);
      return;
    } else {
      initalColors.push(randomColor);
    }

    text.innerText = randomColor;
    colorDiv.style.backgroundColor = randomColor;
    checkContrast(randomColor, text);

    icons.forEach((icon) => {
      checkContrast(randomColor, icon);
    });

    const color = chroma(randomColor);

    const hue = colorDiv.querySelector(`[name="hue"]`);
    const brightness = colorDiv.querySelector(`[name="brightness"]`);
    const saturation = colorDiv.querySelector(`[name="saturation"]`);

    colorizeSliders({ color, hue, brightness, saturation });
  });

  resetSliders();
}

getDataFromLocalStorage();

randomColors();
