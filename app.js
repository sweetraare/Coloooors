//global variables
let initalColors;

//selector
const colorDivs = document.querySelectorAll(".color");
const generateColors = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelectorAll(".h2 color");

//event listeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((colorDiv, index) => {
  colorDiv.addEventListener("change", () => {
    updateText(index);
  });
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

function randomColors() {
  initalColors = [];
  colorDivs.forEach((colorDiv) => {
    const text = colorDiv.querySelector("h2");
    const icons = colorDiv.querySelectorAll("i");

    const randomColor = generateRandomColor();
    initalColors.push(randomColor);
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

randomColors();
