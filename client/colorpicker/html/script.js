//https://github.com/bgrins/TinyColor


var modeToggle = document.getElementById('mode-toggle');
var colorIndicator = document.getElementById('color-indicator');

var spectrumCanvas = document.getElementById('spectrum-canvas');
var spectrumCtx = spectrumCanvas.getContext('2d');
var spectrumCursor = document.getElementById('spectrum-cursor'); 
var spectrumRect = spectrumCanvas.getBoundingClientRect();

var hueCanvas = document.getElementById('hue-canvas');
var hueCtx = hueCanvas.getContext('2d');
var hueCursor = document.getElementById('hue-cursor'); 
var hueRect = hueCanvas.getBoundingClientRect();

var currentColor = '';
var hue = 0;
var saturation = 1;
var lightness = .5;

var rgbFields = document.getElementById('rgb-fields');
var hexField = document.getElementById('hex-field');

var red = document.getElementById('red');
var blue = document.getElementById('blue');
var green = document.getElementById('green');
var hex = document.getElementById('hex');

var primaryBut = document.getElementById("primaryBut");
var secondaryBut = document.getElementById("secondaryBut");
primaryBut.disabled = "disabled";
secondaryBut.disabled = "disabled";

function ColorPicker(){
  createShadeSpectrum();
  createHueSpectrum();
};

function refreshElementRects(){
  spectrumRect = spectrumCanvas.getBoundingClientRect();
  hueRect = hueCanvas.getBoundingClientRect();
}

function createShadeSpectrum(color) {
  canvas = spectrumCanvas;
  ctx = spectrumCtx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(!color) color = '#f00';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  whiteGradient.addColorStop(0, "#fff");
  whiteGradient.addColorStop(1, "transparent");
  ctx.fillStyle = whiteGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  blackGradient.addColorStop(0, "transparent");
  blackGradient.addColorStop(1, "#000");
  ctx.fillStyle = blackGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener('mousedown', function(e){
    startGetSpectrumColor(e);
  });
};

function createHueSpectrum() {
  var canvas = hueCanvas;
  var ctx = hueCtx;
  var hueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  hueGradient.addColorStop(0.00, "hsl(0,100%,50%)");
  hueGradient.addColorStop(0.17, "hsl(298.8, 100%, 50%)");
  hueGradient.addColorStop(0.33, "hsl(241.2, 100%, 50%)");
  hueGradient.addColorStop(0.50, "hsl(180, 100%, 50%)");
  hueGradient.addColorStop(0.67, "hsl(118.8, 100%, 50%)");
  hueGradient.addColorStop(0.83, "hsl(61.2,100%,50%)");
  hueGradient.addColorStop(1.00, "hsl(360,100%,50%)");
  ctx.fillStyle = hueGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvas.addEventListener('mousedown', function(e){
    startGetHueColor(e);
  });
};

function colorToHue(color){
  var color = tinycolor(color);
  var hueString = tinycolor('hsl '+ color.toHsl().h + ' 1 .5').toHslString();
  return hueString;
};

function colorToPos(color){
  var color = tinycolor(color);
  var hsl = color.toHsl();
  hue = hsl.h;
  var hsv = color.toHsv();
  var x = spectrumRect.width * hsv.s;
  var y = spectrumRect.height * (1 - hsv.v);
  var hueY = hueRect.height - ((hue / 360) * hueRect.height);
  updateSpectrumCursor(x,y);
  updateHueCursor(hueY);
  updateCarColor(color);
  setCurrentColor(color);
  createShadeSpectrum(colorToHue(color));   
};

function setColorValues(color){  
  //convert to tinycolor object
  var color = tinycolor(color);
  var rgbValues = color.toRgb();
  var hexValue = color.toHex();
  //set inputs
  red.value = rgbValues.r;
  green.value = rgbValues.g;
  blue.value = rgbValues.b;
  hex.value = hexValue;
};

function updateHueCursor(y){
  hueCursor.style.top = y + 'px';
}

function updateSpectrumCursor(x, y){
  //assign position
  spectrumCursor.style.left = x + 'px';
  spectrumCursor.style.top = y + 'px';
};

var startGetSpectrumColor = function(e) {
  getSpectrumColor(e);
  spectrumCursor.classList.add('dragging');
  window.addEventListener('mousemove', getSpectrumColor);
  window.addEventListener('mouseup', endGetSpectrumColor);
};

function getSpectrumColor(e) {
  // got some help here - http://stackoverflow.com/questions/23520909/get-hsl-value-given-x-y-and-hue
  e.preventDefault();
  //get x/y coordinates
  var x = e.pageX - spectrumRect.left;
  var y = e.pageY - spectrumRect.top;
  //constrain x max
  if(x > spectrumRect.width){ x = spectrumRect.width}
  if(x < 0){ x = 0}
  if(y > spectrumRect.height){ y = spectrumRect.height}
  if(y < 0){ y = .1}  
  //convert between hsv and hsl
  var xRatio = x / spectrumRect.width * 100;
  var yRatio = y / spectrumRect.height * 100; 
  var hsvValue = 1 - (yRatio / 100);
  var hsvSaturation = xRatio / 100;
  lightness = (hsvValue / 2) * (2 - hsvSaturation);
  saturation = (hsvValue * hsvSaturation) / (1 - Math.abs(2 * lightness - 1));
  var color = tinycolor('hsl ' + hue + ' ' + saturation + ' ' + lightness);
  setCurrentColor(color);
  setColorValues(color);
  updateSpectrumCursor(x,y);
  updateCarColor(color);
};

function endGetSpectrumColor(e){
  spectrumCursor.classList.remove('dragging');
  window.removeEventListener('mousemove', getSpectrumColor);
};

function startGetHueColor(e) {
  getHueColor(e);
  hueCursor.classList.add('dragging');
  window.addEventListener('mousemove', getHueColor);
  window.addEventListener('mouseup', endGetHueColor);
};

function getHueColor(e){
  e.preventDefault();
  var y = e.pageY - hueRect.top;
  if (y > hueRect.height){ y = hueRect.height};
  if (y < 0){ y = 0};  
  var percent = y / hueRect.height;
  hue = 360 - (360 * percent);
  var hueColor = tinycolor('hsl '+ hue + ' 1 .5').toHslString();
  var color = tinycolor('hsl '+ hue + ' ' + saturation + ' ' + lightness).toHslString();
  createShadeSpectrum(hueColor);
  updateHueCursor(y, hueColor);
  setCurrentColor(color);
  updateCarColor(color);
  setColorValues(color);
};

function endGetHueColor(e){
    hueCursor.classList.remove('dragging');
  window.removeEventListener('mousemove', getHueColor);
};

// Add event listeners

red.addEventListener('change', function(){
  var color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value );
  colorToPos(color);
});

green.addEventListener('change', function(){
    var color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value );
    colorToPos(color);
});

blue.addEventListener('change', function(){
    var color = tinycolor('rgb ' + red.value + ' ' + green.value + ' ' + blue.value );
    colorToPos(color);
});

modeToggle.addEventListener('click', function(){
  if(rgbFields.classList.contains('active') ? rgbFields.classList.remove('active') : rgbFields.classList.add('active'));
  if(hexField.classList.contains('active') ? hexField.classList.remove('active') : hexField.classList.add('active'));
});

window.addEventListener('resize', function(){
  refreshElementRects();
});

function updateCarColor(color){
  var checkedPrimary = null;
  var checkedSecondary = null; 
  var inputPrimary = document.getElementsByClassName('primaryColor');
  var inputSecondary = document.getElementsByClassName('secondaryColor');

  for(var i=0; inputPrimary[i]; ++i){
    if(inputPrimary[i].checked){
      checkedPrimary = inputPrimary[i].value;
    }
  }

  for(var i=0; inputSecondary[i]; ++i){
    if(inputSecondary[i].checked){
      checkedSecondary = inputSecondary[i].value;
    }
  }

  if(checkedSecondary === "setSek" && checkedPrimary === "setPrim"){
    alt.emit("setCarColorLive:ClientSide", checkedPrimary, checkedSecondary, color.toRgb());
  }
  
  if(checkedPrimary === "setPrim"){
    alt.emit("setCarColorLive:ClientSide", checkedPrimary, checkedSecondary, color.toRgb());
  }
  
  if(checkedSecondary === "setSek"){
    alt.emit("setCarColorLive:ClientSide", checkedPrimary, checkedSecondary, color.toRgb());
  }
  
  if(!checkedPrimary && !checkedSecondary){
    return;
  }
}

function setCurrentColor(color){

  color = tinycolor(color);
  colorIndicator.style.backgroundColor = color;
  spectrumCursor.style.backgroundColor = color; 
  hueCursor.style.backgroundColor = 'hsl('+ color.toHsl().h +', 100%, 50%)';

};

function setCarColorCP() {
  
  var checkedPrimary = null;
  var checkedSecondary = null; 
  var inputPrimary = document.getElementsByClassName('primaryColor');
  var inputSecondary = document.getElementsByClassName('secondaryColor');

  for(var i=0; inputPrimary[i]; ++i){
    if(inputPrimary[i].checked){
      checkedPrimary = inputPrimary[i].value;
    }
  }

  for(var i=0; inputSecondary[i]; ++i){
    if(inputSecondary[i].checked){
      checkedSecondary = inputSecondary[i].value;
    }
  }

  if(checkedSecondary === "setSek" && checkedPrimary === "setPrim"){
    alt.emit("setCarColor:ClientSide", checkedPrimary, checkedSecondary);
  }
  
  if(checkedPrimary === "setPrim"){
    alt.emit("setCarColor:ClientSide", checkedPrimary, checkedSecondary);
  }
  
  if(checkedSecondary === "setSek"){
    alt.emit("setCarColor:ClientSide", checkedPrimary, checkedSecondary);
  }
  
  if(!checkedPrimary && !checkedSecondary){
    return;
  }

};

function setModColor(modId) {
  var checkedPrimary = null;
  var checkedSecondary = null; 
  var inputPrimary = document.getElementsByClassName('primaryColor');
  var inputSecondary = document.getElementsByClassName('secondaryColor');

  for(var i=0; inputPrimary[i]; ++i){
    if(inputPrimary[i].checked){
      checkedPrimary = inputPrimary[i].value;
    }
  }

  for(var i=0; inputSecondary[i]; ++i){
    if(inputSecondary[i].checked){
      checkedSecondary = inputSecondary[i].value;
    }
  }
  
  if(modId === 3){
    let colorId = 12;
    alt.emit("setModColor:ClientSide", colorId, checkedPrimary, checkedSecondary);
    //alert("Matt" + " PRIMÄR: " + checkedPrimary + " SEKUNDÄR: " + checkedSecondary)
  }

  if(modId === 5){
    let colorId = 120;
    alt.emit("setModColor:ClientSide", colorId, checkedPrimary, checkedSecondary);
    //alert("Chrome" + " PRIMÄR: " + checkedPrimary + " SEKUNDÄR: " + checkedSecondary)
  }

  if(modId === 2){
    let colorId = 44;
    alt.emit("setModColor:ClientSide", colorId, checkedPrimary, checkedSecondary);
    //alert("Pearl" + " PRIMÄR: " + checkedPrimary + " SEKUNDÄR: " + checkedSecondary)
  }

  if(modId === 0){
    let colorId = 0;
    alt.emit("setModColor:ClientSide", colorId, checkedPrimary, checkedSecondary);
    //alert("Normal" + " PRIMÄR: " + checkedPrimary + " SEKUNDÄR: " + checkedSecondary)
  }
}

function closeCP() {
  alt.emit("cancelSetColor:ClientSide");
}

new ColorPicker();

//SLIDER
var slider = document.getElementById("pearlslider");
var output = document.getElementById("output-slider");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
  alt.emit("setPearlColorLive:ClientSide", slider.value);
}

function setPearlColor(){
  console.log(slider.value);
  alt.emit("setPearlColor:ClientSide", slider.value);
}


function openCloseSlider(){
  var colorpicker = document.getElementById("colorpicker");
  var slider = document.getElementById("slider");
  if(slider.style.display != "block"){
    slider.style.display = "block";
    colorpicker.style.display ="none";
  } else {
    slider.style.display = "none";
    colorpicker.style.display ="block";
  }

}
