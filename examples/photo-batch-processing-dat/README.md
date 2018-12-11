# Batch processing of satellite images (DAT version).

Author: Erick Lavoie

This example shows how satellite images may be processed collaboratively. Since images may be large (multi-megabytes) and may run into the limitations of some of the libraries we are using, we combine Pando with the [DAT protocol](https://www.datprotocol.com/) to transfer images in and out of the browser. At the time of writing, this protocol is only supported on [Node.js](https://www.npmjs.com/package/dat) and in the [Beaker Browser](https://beakerbrowser.com/) but we expect it should get more traction in the next years.

The example shares input images through a DAT archive, which has its own unique URL. The images are then loaded and processed in the Beaker Browser. Finally the results are transferred back using the DAT protocol and saved on the filesystem. Since a volunteer may close a browser tab before the result has finished transferring back, it introduces a new abstraction for fault-tolerance, [pull-stubborn](https://github.com/elavoie/pull-stubborn), which resubmits an input for processing if the download of the result failed.

The example should also be straightforward to adapt for wider compatibility across browsers by modifying it to use the [WebTorrent protocol](https://webtorrent.io/) for data transfer instead of DAT. WebTorrent implements BitTorrent inside browsers by using WebRTC. It also provides a hybrid client that can talk to both hosts running inside and outside browsers.  It is therefore currently compatible with at least Firefox and Chrome. If you succeed at adapting the example to WebTorrent, please submit a Pull-Request and your version will be integrated to this repository with proper credit attribution.

## Example Usage:

The example uses two utilities that are intended to be combined in a Unix pipeline:
1. ````metainfo```` to download and list the images to be processed;
2. ````process```` to start Pando and download the results after processing, resubmitting inputs if necessary.

Options for both can be listed with ````--help````.


### Dependencies Installation

````
    npm install
````

### (Optional) Pre-Downloading a copy of the images to serve locally

Images are downloaded as needed when listed. This step can be forced with the following option:

````
    ./metainfo --peer
````

The list may be limited to the images taken in 2017 by passing the option ````--after='2017'````. Other options are available by doing ````./metainfo --help````.

### Processing the images with Pando in the Beaker Browser

The example uses the [./src/blur.js](./src/blur.js) processing function, which
loads the image from a remote DatArchive, applies a gaussian-filter on a gray
scale version, creates a single-use DatArchive for the result inside the
browser, and saves the result obtained on the file system.

For security reasons, the Beaker Browser restricts access to the [DatArchive API](https://beakerbrowser.com/docs/apis/dat.html) to specific contexts:
1. It enables it for any website served with the dat protocol;
2. It also enables access when [connected using ````localhost````](https://github.com/beakerbrowser/beaker/pull/590) for testing the API locally;
3. It also enables it on [secure (https) websites](https://github.com/beakerbrowser/beaker/pull/586).

The first option required too many changes to Pando because the url of WebSockets used to bootstrap WebRTC is currently derived from the location of the Web page observed during the loading. So we support only the two other cases, which are presented in turn hereafter. In all cases, after the image is processed a user needs to manually allow the creation of a DatArchive to transmit back the result. Hopefully, as the security policies of the Beaker Browser evolve in the future there will be a fully automatic possibility we can use.

#### Accessing the Pando-Server locally on the same machine (with ````localhost````)

Simply open the url with ````localhost```` rather than the explicit IP address provided by Pando:

Example:
````
    ./metainfo --after='2017' --keep-alive --peer | ./process src/blur.js -- --start-idle
    open http://localhost:5000
````

Make sure to use the ````--keep-alive```` option to keep the DAT archive up after all the images have been listed by the ````metainfo```` utility. Otherwise, by the time the volunteer code inside browser tries to load an image it may not be accessible anymore.

#### Accessing the Pando-Server from Heroku with https

The Pando-Server does not currently support https. However, the free tier of Heroku provides a secure endpoint for http (````https://````) and WebSockets (````wss://````) in addition to the regular ones (````http://```` and ````ws://````) with no extra configuration. So we are using it for this example.

##### Deploying the Pando-Server on Heroku

Install the heroku commandline tools. Then:

````
    git clone https://github.com/elavoie/pando-server
    heroku login
    heroku create
````

See ````https://github.com/elavoie/pando-server````'s [README](https://github.com/elavoie/pando-server) for security options. Note the URL of the Heroku deployed server.

##### Starting the example using the Heroku secure endpoint:

````
    ./metainfo --after='2017' --peer --keep-alive | ./process src/blur.js -- --stdin --start-idle --host='YOUR_HOST.herokuapp.com'
    open https://YOUR_HOST.herokuapp.com
````

Make sure to use the ````--keep-alive```` option to keep the DAT archive up after all the images have been listed by the ````metainfo```` utility. Otherwise, by the time the volunteer code inside browser tries to load an image it may not be accessible anymore.

## Notes on using the Landsat-8 dataset

The example downloads the full index of LANDSAT 8 images from http://landsat-pds.s3.amazonaws.com/scene_list.gz.

The scene list is stored in the following format:
````
entityId,acquisitionDate,cloudCover,processingLevel,path,row,min_lat,min_lon,max_lat,max_lon,download_url
LC80101172015002LGN00,2015-01-02 15:49:05.571384,80.81,L1GT,10,117,-79.09923,-139.66082,-77.7544,-125.09297,https://s3-us-west-2.amazonaws.com/landsat-pds/L8/010/117/LC80101172015002LGN00/index.html
````

By default, the ````./metainfo```` only keeps results pertaining to Grenoble (lattitude: 45.189 longitude: 6.017, which is [equivalent to WRS daytime](https://landsat.usgs.gov/wrs-2-pathrow-latitudelongitude-converter) path: 196 row: 29). Please use the previous link to select a different place and pass the path and row option to ````metainfo````.

