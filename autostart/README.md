-------

## Fresh install

1. Make sure you're up-to-date with packages:

   ````
   sudo apt-get update
   ````
1. Install X.org and stuff:

   ````
   sudo apt-get install matchbox xinit x11-xserver-utils unclutter chromium-browser
   ````
1. Allow X11 to run as anybody by running the following command:  
   **Ignore this step if it fails**  

   ````
   sudo sed -i 's/allowed_users=console/allowed_users=anybody/' /etc/X11/Xwrapper.config
   ````
1. Get the TouchUI boot files:
   ````
   git clone https://github.com/1v1expert/3DPrint.git ~/TouchUI-autostart/		
   ````
1. Copy service file and register it as auto boot:
   ````
   sudo cp wintouch.init /etc/init.d/wintouch
   sudo chmod +x /etc/init.d/wintouch
   sudo cp wintouch.default /etc/default/wintouch
   sudo update-rc.d wintouch defaults
   ````

