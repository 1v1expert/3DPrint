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

## Install 3DPrint
````
1. git clone https://github.com/1v1expert/3DPrint.git .3DPrint
2. cd .3DPrint/
3. python --version
>> python2.7
4. mkvirtualenv -p /usr/bin/python venv
5. cd software
6. pip install .
7. Run "octoprint serve"
8. sudo apt-get update
9. sudo apt-get install --no-install-recommends xinit xinput xserver-xorg xserver-xorg-video-fbdev x11-xserver-utils matchbox unclutter chromium-browser
10. ls /dev | grep fb
11. sudo nano /usr/share/X11/xorg.conf.d/99-fbdev.conf
12. #touch (ls /dev | grep fb) >> 99-fbdev.conf
13. 
>> Section "Device"
>>  Identifier "touchscreen"
>>  Driver "fbdev"
>>  Option "fbdev" "/dev/fb1"
>> EndSection
14. sudo sed -i 's/allowed_users=console/allowed_users=anybody/' /etc/X11/Xwrapper.config
15. cd ..
16. sudo cp touchui.init /etc/init.d/touchui
17. sudo chmod +x /etc/init.d/touchui
18. sudo cp touchui.default /etc/default/touchui
19. sudo update-rc.d touchui defaults

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


<img width="480" src="https://user-images.githubusercontent.com/1573114/33559609-a73a969e-d90d-11e7-9cf2-cf212412aaa5.png" />

## installation guide
### Configuration

If not specified via the command line, the config file `config.yaml` for OctoPrint is expected in the settings folder,
which is located at `~/.octoprint` on Linux, at `%APPDATA%/OctoPrint` on Windows and
at `~/Library/Application Support/OctoPrint` on MacOS.

[SEE DOCS](http://docs.octoprint.org/en/master/)\
[source octoprint](https://github.com/foosel/OctoPrint)
