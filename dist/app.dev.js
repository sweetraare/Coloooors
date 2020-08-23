"use strict";

//global variables
var initalColors;
var savedPalettes; //selector

var colorDivs = document.querySelectorAll(".color");
var generateColors = document.querySelector(".generate");
var sliders = document.querySelectorAll('input[type="range"]');
var currentHex = document.querySelectorAll(".color h2");
var copyContainer = document.querySelector(".copy-container");
var saveContainer = document.querySelector(".save-container");
var libraryContainer = document.querySelector(".library-container");
var adjustButtons = document.querySelectorAll(".adjust");
var lockButtons = document.querySelectorAll(".lock");
var closeAdjustmentButtons = document.querySelectorAll(".close-adjustment");
var generateButton = document.querySelector("button.generate");
var saveButton = document.querySelector("button.save");
var closeSaveButton = document.querySelector(".close-save");
var libraryButton = document.querySelector("button.library");
var closeLibraryButton = document.querySelector(".close-library");
var submitSave = document.querySelector("button.submit-save");
var saveName = document.querySelector(".save-name"); //event listeners

sliders.forEach(function (slider) {
  slider.addEventListener("input", hslControls);
});
colorDivs.forEach(function (colorDiv, index) {
  colorDiv.addEventListener("change", function () {
    updateText(index);
  });
});
currentHex.forEach(function (ch) {
  ch.addEventListener("click", function () {
    copyToClipborard(ch);
  });
});
copyContainer.addEventListener("transitionend", function () {
  copyContainer.classList.remove("active");
  copyContainer.children[0].classList.remove("active");
});
adjustButtons.forEach(function (adjustButton) {
  adjustButton.addEventListener("click", function () {
    return handleAdjustButtonClick(adjustButton);
  });
});
closeAdjustmentButtons.forEach(function (closeAdjustmentButton) {
  closeAdjustmentButton.addEventListener("click", function (e) {
    e.target.parentElement.classList.toggle("active");
  });
});
generateButton.addEventListener("click", randomColors);
lockButtons.forEach(function (lockButton) {
  lockButton.addEventListener("click", function () {
    return handleLockButtonClick(lockButton);
  });
});
saveButton.addEventListener("click", function () {
  saveContainer.classList.add("active");
  saveContainer.children[0].classList.add("active");
});
closeSaveButton.addEventListener("click", function () {
  closeSave();
});
libraryButton.addEventListener("click", function () {
  libraryContainer.classList.add("active");
  libraryContainer.children[0].classList.add("active");
});
closeLibraryButton.addEventListener("click", function () {
  closeLibrary();
});
submitSave.addEventListener("click", function () {
  savePallette();
}); //functions

function generateRandomColor() {
  return chroma.random();
}

function checkContrast(backgroundColor, text) {
  var luminance = chroma(backgroundColor).luminance();

  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(_ref) {
  var color = _ref.color,
      hue = _ref.hue,
      brightness = _ref.brightness,
      saturation = _ref.saturation;
  //saturation
  var minSaturation = color.set("hsl.s", 0);
  var maxSaturation = color.set("hsl.s", 1);
  var saturationSacale = chroma.scale([minSaturation, color, maxSaturation]);
  saturation.style.backgroundImage = "linear-gradient(to right, ".concat(saturationSacale(0), ", ").concat(saturationSacale(1), ")"); //brigthness -> min is black, max is white, so I need the mid one

  var midBrightness = color.set("hsl.l", 0.5);
  var brightnessSacale = chroma.scale(["black", midBrightness, "white"]);
  brightness.style.backgroundImage = "linear-gradient(to right, ".concat(brightnessSacale(0), ", ").concat(brightnessSacale(0.5), ", ").concat(brightnessSacale(1), ")"); //hue

  hue.style.backgroundImage = "linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))";
}

function hslControls(e) {
  var index = e.target.getAttribute("data-hue") || e.target.getAttribute("data-brightness") || e.target.getAttribute("data-saturation");
  var sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  var newColorObj = {};
  sliders.forEach(function (slider) {
    newColorObj[slider.getAttribute("name")] = +slider.value;
  });
  var selectedColorDiv = colorDivs[index];
  var currentColor = initalColors[index];
  var newColor = chroma(currentColor).set("hsl.h", newColorObj.hue).set("hsl.s", newColorObj.saturation).set("hsl.l", newColorObj.brightness);
  selectedColorDiv.style.backgroundColor = newColor;
  var hue = sliders[0];
  var brightness = sliders[1];
  var saturation = sliders[2];
  colorizeSliders({
    color: newColor,
    hue: hue,
    brightness: brightness,
    saturation: saturation
  });
}

function updateText(index) {
  var currentColorDiv = colorDivs[index];
  var color = chroma(currentColorDiv.style.backgroundColor);
  var text = currentColorDiv.querySelector("h2");
  var icons = currentColorDiv.querySelectorAll("i");
  text.innerText = color.hex();
  checkContrast(color, text);
  icons.forEach(function (icon) {
    checkContrast(color, icon);
  });
}

function resetSliders() {
  sliders.forEach(function (slider) {
    if (slider.name === "hue") {
      var hueColor = chroma(initalColors[slider.getAttribute("data-hue")]);
      var hueValue = hueColor.hsl()[0];
      slider.value = hueValue;
    }

    if (slider.name === "saturation") {
      var saturationColor = chroma(initalColors[slider.getAttribute("data-saturation")]);
      var saturationValue = saturationColor.hsl()[1];
      slider.value = saturationValue;
    }

    if (slider.name === "brightness") {
      var brightnessColor = chroma(initalColors[slider.getAttribute("data-brightness")]);
      var brightnessValue = brightnessColor.hsl()[2];
      slider.value = brightnessValue;
    }
  });
}

function copyToClipborard(hex) {
  var auxElement = document.createElement("textarea");
  auxElement.value = hex.innerText;
  document.body.appendChild(auxElement);
  auxElement.select();
  document.execCommand("copy");
  document.body.removeChild(auxElement);
  copyContainer.classList.add("active");
  copyContainer.children[0].classList.add("active");
}

function handleAdjustButtonClick(adjustButton) {
  adjustButton.parentElement.parentElement.querySelector(".sliders").classList.toggle("active");
}

function handleLockButtonClick(lockButton) {
  var icon = lockButton.children[0];

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
  var colors = [];
  currentHex.forEach(function (color) {
    colors.push(color.innerText);
  });
  var name = saveName.value;
  saveToLocalStorage({
    name: name,
    colors: colors
  });
  saveName.value = "";
  closeSave();
}

function saveToLocalStorage(newPaletteObject) {
  var storageArray;

  if (localStorage.getItem("palettes")) {
    storageArray = JSON.parse(localStorage.getItem("palettes"));
  } else {
    storageArray = [];
  }

  storageArray.push(newPaletteObject);
  localStorage.setItem("palettes", JSON.stringify(storageArray));
  savedPalettes = storageArray;
  updateLibrary(newPaletteObject, savedPalettes.length - 1);
}

function updateLibrary(_ref2, index) {
  var name = _ref2.name,
      colors = _ref2.colors;
  var preview = document.createElement("div");
  preview.classList.add("preview");
  var previewName = document.createElement("h5");
  previewName.classList.add("preview-name");
  previewName.innerHTML = name;
  var colorsContainer = document.createElement("div");
  colorsContainer.classList.add("colors-container");
  colors.forEach(function (color) {
    var smallColor = document.createElement("div");
    smallColor.classList.add("small-color");
    smallColor.style.background = color;
    colorsContainer.appendChild(smallColor);
  });
  var previewButton = document.createElement("button");
  previewButton.classList.add("preview-button");
  previewButton.innerText = "Select!";
  previewButton.setAttribute("data-number", "".concat(index));
  previewButton.addEventListener("click", function (e) {
    pickPallete(e.target);
  });
  preview.appendChild(previewName);
  preview.appendChild(colorsContainer);
  preview.appendChild(previewButton);
  libraryContainer.children[0].appendChild(preview);
}

function pickPallete(selectedPallete) {
  var selectedPalleteIndex = selectedPallete.dataset.number;
  var pallete = savedPalettes[selectedPalleteIndex];
  initalColors = savedPalettes[selectedPalleteIndex].colors;
  colorDivs.forEach(function (colorDiv, index) {
    var color = pallete.colors[index];
    colorDiv.style.backgroundColor = color;
    var text = colorDiv.querySelector(".color h2");
    var icons = colorDiv.querySelectorAll("i");
    text.innerText = color;
    checkContrast(color, text);
    icons.forEach(function (icon) {
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

  savedPalettes.forEach(function (pallete, index) {
    updateLibrary(pallete, index);
  });
}

function randomColors() {
  initalColors = [];
  colorDivs.forEach(function (colorDiv) {
    var text = colorDiv.querySelector("h2");
    var icons = colorDiv.querySelectorAll("i");
    var randomColor = generateRandomColor();

    if (colorDiv.classList.contains("locked")) {
      initalColors.push(text.innerText);
      return;
    } else {
      initalColors.push(randomColor);
    }

    text.innerText = randomColor;
    colorDiv.style.backgroundColor = randomColor;
    checkContrast(randomColor, text);
    icons.forEach(function (icon) {
      checkContrast(randomColor, icon);
    });
    var color = chroma(randomColor);
    var hue = colorDiv.querySelector("[name=\"hue\"]");
    var brightness = colorDiv.querySelector("[name=\"brightness\"]");
    var saturation = colorDiv.querySelector("[name=\"saturation\"]");
    colorizeSliders({
      color: color,
      hue: hue,
      brightness: brightness,
      saturation: saturation
    });
  });
  resetSliders();
}

getDataFromLocalStorage();
randomColors();