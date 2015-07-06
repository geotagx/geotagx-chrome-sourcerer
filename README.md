#GeoTag-X Chrome Sourcerer
--------------------------

The GeoTag-X soucerers are multiple ways in which GeoTag-X can ingest media. This is the repository for the GeoTag-X Chrome Sourcerer, which is basically a Chrome extension.   

#Installation Instructions
--------------------------

* Download the zip of this repository from https://github.com/spMohanty/geotagx-chrome-sourcerer/archive/master.zip
* Unzip the zip file and save it to an easily accesible location
* Open Chrome
* Go to `chrome://extensions/`
    * (Basically type this in the URL bar and press enter)
* Check the checkbox called as `Developer Mode` on the top-right of the screen
* Click on `Load Unpacked Extension` and browse to the folder where you unzipped the zip
* Now it should successfully load, and you should see the GeoTag-X logo in a bit.
* Now if you right-click on any image on any page, you should see an option called as `Upload Image URL To GeoTag-X`
    * On clicking this you should upload the Image URL to the GeoTag-X database through the `geotagx-proxy`

#How to read the images that are uploaded
------------------------------------------
You will have to log into the server and execute :
```bash
redis-cli LRANGE "GEOTAGX-SOURCERER-QUEUE" 0 -1
```

This will list down all the images that have been pushed via the `geotagx-proxy`.   
**NOTE** : The images are pushed into a Queue on a redis cluster running in Sentinel mode. The name of the key of the queue is `GEOTAGX-SOURCERER-QUEUE` and this queue can be manipulated by any means that is available to the developers. We will soon be releasing something called as the `geotagx-sink` which consumes all images collected via the geotagx-proxy

#Author
-------
S.P. Mohanty < sp.mohanty@cern.ch >