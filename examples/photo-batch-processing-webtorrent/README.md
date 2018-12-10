# Batch processing of satellite images (with WebTorrent)

Author: Erick Lavoie

This example shows how satellite images may be processed collaboratively. Since images may be large (multi-megabytes) and may run into the limitations of some of the libraries we are using, we combine Pando with [WebTorrent](https://webtorrent.io/), to transfer the images to transfer images in and out of the browser. 

The example shares input images with the [webtorrent-hybrid](https://github.com/webtorrent/webtorrent-hybrid) client, which provides a Web-compatible BitTorrent implementation for the Web running in Node.js. The images are then loaded and processed in a browser through the [webtorrent](https://github.com/webtorrent/webtorrent) library. Finally the results are transferred back and saved on the filesystem. Since a volunteer may close a browser tab before the result has finished transferring back, we introduce a new abstraction for fault-tolerance, [pull-stubborn](https://github.com/elavoie/pull-stubborn), which resubmits an input for processing if the download of the result failed. The WebTorrent library for browsers relies on WebRTC, it has been tested to work with Firefox and Chrome.

In our tests, the latency in loading a torrent can be quite high, even when the data is transferred between processes on the same machine. It can take tens of seconds and sometimes a few minutes before a torrent is resolved, the data is transferred and is finally usable. Firefox 63.0.3 seemed slower at that than Chrome 71.0, possibly because establishing a WebRTC connection is slower (not sure why). Moreover, in both cases, when a new torrent is created within the browser to transfer the result back, in some of our tests, it could take several minutes before the torrent was downloaded on the filesystem. 

The high and random latency for transferring data with WebTorrent currently makes it unsuitable for performance testing with Pando. We will perform more exhaustive testing in the future to determine the causes.

## Example Usage:

````
    ./metainfo --after='2017' --keep-alive --peer | ./process src/blur.js -- --start-idle
    open http://localhost:5000
```` 

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

### Processing the images with Pando

The example uses the [./src/blur.js](./src/blur.js) processing function, which
loads the image from the BitTorrent archive, applies a gaussian-filter on a gray
scale version, creates a new BitTorrent archive for the result inside the
browser, and saves the result obtained on the file system.

## Notes on using the Landsat-8 dataset

The example downloads the full index of LANDSAT 8 images from http://landsat-pds.s3.amazonaws.com/scene_list.gz.

The scene list is stored in the following format:
````
entityId,acquisitionDate,cloudCover,processingLevel,path,row,min_lat,min_lon,max_lat,max_lon,download_url
LC80101172015002LGN00,2015-01-02 15:49:05.571384,80.81,L1GT,10,117,-79.09923,-139.66082,-77.7544,-125.09297,https://s3-us-west-2.amazonaws.com/landsat-pds/L8/010/117/LC80101172015002LGN00/index.html
````

By default, the ````./metainfo```` only keeps results pertaining to Grenoble (lattitude: 45.189 longitude: 6.017, which is [equivalent to WRS daytime](https://landsat.usgs.gov/wrs-2-pathrow-latitudelongitude-converter) path: 196 row: 29). Please use the previous link to select a different place and pass the path and row option to ````metainfo````.

## Notes on testing WebTorrent

The creation of a torrent with webtorrent-hybrid can take 5-8s in Node.js.

Downloading a torrent is significantly faster if some of the open trackers are used to seed the torrent and download it with a magnet link (ex: wss://tracker.openwebtorrent.com). Presumably this is because, they remove the need for a lookup through the DHT which itself requires WebRTC connections.

Creating many torrents in the browser (ex: 7) can exhaust the number of concurrent WebRTC allowed. It may also exhaust the maximum number of listeners used by event emitter internally by WebTorrent.

The current version seeds all input data from within the same torrent, to speed up the initialization. It seemed to work well in practice.
