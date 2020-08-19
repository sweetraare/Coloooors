//global variables
let initalColors;

//selector
const colorDivs = document.querySelectorAll(".color");
const generateColors = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelectorAll(".color h2");
const copyContainer = document.querySelector(".copy-container");
const adjustButtons = document.querySelectorAll(".adjust");
const lockButtons = document.querySelectorAll(".lock");
const closeAdjustmentButtons = document.querySelectorAll(".close-adjustment");
const generateButton = document.querySelector("button.generate");

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

randomColors();
