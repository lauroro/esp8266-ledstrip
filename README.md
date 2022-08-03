# esp8266-ledstrip
A project to interact with a WS2812b led strip via web-interface, using WS2812FX library. You can change leds color, effect mode and effect's speed.

## Diagram
![image](https://user-images.githubusercontent.com/88981092/180605580-85468224-4cd8-482d-a53f-a9edce21295e.png)

## What's needed
- 1x Esp8266.
- 1x WS2812b led strip
- (Optional if you don't want to solder) 1x Breadboard
- 3x Cables (or jumpers if you opt for the breadboard)
- Arduino IDE
- Clone this repo: you need both the sketch and the data folder.

## Libraries used
1. If you use Arduino IDE be sure to [install esp8266 support](https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/) first.
2. External libraries (look into each library's readme file to see further dependancies):
    - [WS2812FX](https://github.com/kitesurfer1404/WS2812FX)
    - [Arduino ESP8266 LittleFS Filesystem Uploader](https://github.com/earlephilhower/arduino-esp8266littlefs-plugin)
    - [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)

## Project Structure
Using LittleFS uploader you will upload actual html, css and javascript files on the esp8266. As it works under Arduino IDE, just open a new project -> paste the sketch.ino content -> press CTRL+k -> from the project folder create a new folder named "data" -> copy the data folder content of this repo on your data folder. At the end, assuming you are working from a "sketch" folder you will have this situation:
```
sketch/
  |
  ꜔ sketch.ino
  ꜔ data/
      |
      ꜔ index.html
      ꜔ style.css
      ꜔ main.js
      ꜔ iro.min.js
```
Follow the LittleFS usage guide to flash the data/ content on the esp filesystem.

## How it works
### Sketch
The keyword is _websocket_. Using **ESPAsyncWebServer** we can also use a websocket on the esp8266! This is mandatory. Otherwise you should handle every change on the interface with an http request. This would be too much for an esp8266. Using the websocket we can also reflect every change to every client connected. With our server + websocket capabilities the esp will read clients' requests and change the state of the led strip accordingly, and will also notify every client about the new state.
**Attention:** Be sure to set your wifi ssid and password in the sketch file. The ip address of the esp8266 will be printed on the serial monitor with the MAC address in case you want to bind it to a static ip from your router. You should also adapt the LED_COUNT definition accordingly to how many leds your strip has. 
### data/ files
Inside this folder there is all the necessary for the web-interface. Talking about some javascript, I used [iro.js](https://iro.js.org/) as the color picker, cause it's aesthetic and easy to use. In the file **main.js** it's written the client-side logic. When the DOM is loaded the client sends an http request to the esp to ask for the modes available. This response is a string that contains the definition of buttons, one for each effect mode. This string will be inserted in the html file dinamically hacking into the DOM. Here in main.js we also see that the client open a websocket to communicate with the esp (at _"/ws"_). Color changes, mode changes and speed changes will be handled with the websocket.

## Custom name
Last commit introduced the possibility to open the webpage with a custom name as the header. The way it's done is via URL.
```
<ESP-IP-ADDRESS>[/?name=name-value]

// Fields
name-value : everything but blank

// Defaults
name-value : "Led strip controller"
```

## Demo
This is a demo of the final result... sorry for the potato quality...
- [Video from youtube](https://youtu.be/jmez4LsH3O4)

And here some close-ups on the web-interface UI.

![Schermata del 2022-08-03 17-38-39](https://user-images.githubusercontent.com/88981092/182650473-c13326eb-c6f5-4a50-944b-007047c1612b.png)
![Schermata del 2022-08-03 17-22-14](https://user-images.githubusercontent.com/88981092/182648791-c7de10da-b43c-4fa3-8353-d46db4914e06.png)
![Schermata del 2022-08-03 17-19-42](https://user-images.githubusercontent.com/88981092/182648780-bf4898d3-c25c-4719-a844-fcc9622c8d5a.png)
