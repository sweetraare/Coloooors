//selector
const colorDivs = document.querySelectorAll(".color");
const generateColors = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelectorAll(".h2 color");

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

function randomColors() {
  colorDivs.forEach((color) => {
    const text = color.querySelector("h2");

    const randomColor = generateRandomColor();
    text.innerText = randomColor;
    color.style.backgroundColor = randomColor;
    checkContrast(randomColor, text);
  });
}

randomColors();
