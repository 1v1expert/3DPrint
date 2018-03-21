# The snappy web interface for your 3D printer
### 3DPrint porject [![GitHub release](https://img.shields.io/badge/release-v0.1.1-blue.svg)](https://github.com/1v1expert/3DPrint/releases) [![GitHub license](https://img.shields.io/github/license/1v1expert/3DPrint.svg?style=plastic)](https://github.com/1v1expert/3DPrint/blob/master/LICENSE)
````
Dependencies:
 - Ngrok (https://ngrok.com/) - remote access
 - Python2.7 - basic project
 - Python3.5 - django framework for design view
 - screenfetch - for only fun
 - zsh
 - Octoprint - main project
 - Touchui - plugin
 - themeplate jetson
 - OctoPrint-TFT
````
### 1. Theme [Jetson](https://cloud.mail.ru/public/2gbz/UHGrjgGnH)

### 2. Installation [Ngrok](https://github.com/foosel/OctoPrint/wiki/OctoPrint-and-Ngrok)
1. Go to [https://ngrok.com/](https://ngrok.com/) and sign up.  You will end up at the get started page.  Keep this open we need this later.  Open the link to download ngrok in a new page.  Find the Linux ARM download link and copy this link location to clipboard.
2. Type sudo wget [download link], at the time of writing:

 `sudo wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-386.zip` - linux(32bit)
 
 `sudo wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip` - linux(64bit)

It will download.  If you used copy on the download address you can right click within the putty window to paste.
3. Type unzip [filename downloaded in previous step], at the time of writing:

`unzip ngrok-stable-linux-arm.zip` 

It will then unzip.

4. Type `ls` to LIST the files.  You should see the zip file (in red) and a program (in green) called ngrok as well as the various octoprint folders (in blue).

![LIST the files](https://i.imgur.com/XHNtfeT.png)

5. Type rm [zip file name] to delete the zip file now we have unzipped it, so at the time of writing:

`rm ngrok-stable-linux-arm.zip` 

7. To start ngrok, type:

`./ngrok http 80`
-------
#### 3.Index.html [hot-keys chromium](https://os-chrome.ru/chrome-os/hotkeys/)
- ctrl-o open new file browser
- ctrl-r reload
- ctrl-t new tab 
- ctrl-u view source

#### 4.Autostart [ref](https://github.com/BillyBlaze/OctoPrint-TouchUI-autostart)


#### 5.[OctoPrint-TFT](https://github.com/mcuadros/OctoPrint-TFT)

_OctoPrint-TFT_, a touch interface for TFT touch modules based on GTK+3.

Is a _X application_ to be executed directly in the X Server without any windows
manager, as _frontend of a [OctoPrint](http://octoprint.org) server_ in a Raspberry Pi
equipped with any [TFT Touch module](https://www.waveshare.com/wiki/3.5inch_RPi_LCD_(A)).

Allows you to control your 3D Printer, like you can do with any [TFT/LCD panel](http://reprap.org/wiki/RepRapTouch), but using _OctoPrint_ and a Raspberry Pi.

<img width="480" src="https://user-images.githubusercontent.com/1573114/33559609-a73a969e-d90d-11e7-9cf2-cf212412aaa5.png" />

## installation guide
### Configuration

If not specified via the command line, the config file `config.yaml` for OctoPrint is expected in the settings folder,
which is located at `~/.octoprint` on Linux, at `%APPDATA%/OctoPrint` on Windows and
at `~/Library/Application Support/OctoPrint` on MacOS.

[SEE DOCS](http://docs.octoprint.org/en/master/)\
[source octoprint](https://github.com/foosel/OctoPrint)
