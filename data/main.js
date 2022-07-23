// ------------------ WebSocket ----------------------

var gateway = "ws://"+window.location.hostname+"/ws";
var websocket;

window.addEventListener('load', function(event){
  initWebSocket();
});

function initWebSocket() {
  console.log('Trying to open a WebSocket connection...');
  websocket = new WebSocket(gateway);
  websocket.onopen = onOpen;
  websocket.onclose = onClose;
  websocket.onmessage = onMessage;
}

function onOpen(event) {
  console.log('Connection opened');
}

function onClose(event) {
  console.log('Connection closed');
  setTimeout(initWebSocket, 1000);
}

function onMessage(event) {
  console.log(event.data);
  var message = event.data;
  if(message.includes("s")){
    var value = event.data.slice(1);
    document.getElementById("speed-text").textContent = value;
  }
  if(message.includes("m") && buttons.length > 0){    
    selectModeButton(document.getElementById(message));
  }
  if(message.includes("c")){
    trigger = false;
    var valueStr = event.data.slice(1);
    var valueInt = parseInt(valueStr);
    var valueHexStr = valueInt.toString(16);
    colorPicker.color.hexString = "#"+valueHexStr;
    trigger = true;
  }
}


// -------------- COLOR PICKER --------------------
var trigger = true;

var colorPicker = new window.iro.ColorPicker("#picker", {
  width: 300,
});

colorPicker.on('color:change', onColorChange);

// color:change callbacks receive the current color
function onColorChange(color){
  if(trigger){
    let r = color.rgb.r;
    let g = color.rgb.g;
    let b = color.rgb.b;
    let colorDec = r*65536 + g*256 + b*1;
    websocket.send("c"+colorDec.toString());
  }
}


// ------------- SPEED -----------------
document.getElementById("su").addEventListener('click', function(){
  websocket.send("su");
});

document.getElementById("sd").addEventListener('click', function(){
  websocket.send("sd");
});


// ------------ MODES --------------------
var lastChangeMode = Date.now();
var buttons = [];

window.addEventListener('load', function(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("modes-container").innerHTML = this.responseText;
    }
  };
  xhttp.open('GET', '/modes', true);
  xhttp.send();  

  setTimeout(function(){
    var children = document.getElementById("modes-container").childNodes;
    var j = 0;
    for(var i = 0; i < children.length; i++){
      if(children[i].tagName == "BUTTON"){
        buttons[j] = children[i];
        j++;
      }
    }
    for(var i = 0; i < buttons.length; i++){
      buttons[i].addEventListener('click', function(event){
        if(Date.now() - lastChangeMode >= 1000){
          lastChangeMode = Date.now();
          websocket.send(event.currentTarget.id);
        }
      });
    }
  }, 1000);
});

function resetButtonsBorder(){
  for(var i = 0; i < buttons.length; i++){
    buttons[i].style.border = "1px solid #282828";
  }
}

function selectModeButton(button){
  resetButtonsBorder();
  button.style.border = "2px solid orange";
}
