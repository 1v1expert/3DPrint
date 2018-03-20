#The snappy web interface for your 3D printer
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

````
### Theme [Jetson](https://cloud.mail.ru/public/2gbz/UHGrjgGnH)

### Installation [Ngrok](https://github.com/foosel/OctoPrint/wiki/OctoPrint-and-Ngrok)
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

