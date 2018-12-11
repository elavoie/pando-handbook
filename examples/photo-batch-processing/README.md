# Batch processing of satellite images (serving files over HTTP)

Author: Erick Lavoie

This example shows how satellite images may be processed collaboratively. Since images may be large (multi-megabytes) and may run into the limitations of some of the libraries we are using, we combine Pando with a minimal http server to transfer the images in and out of the browser. 

Input image files are sent from an Express-based static file server to a participating browser through HTTP. Pando sends only the URL of the input image to a participant, the browser actually loads the image through a GET request. The browser then processes the image and sends the result through a POST request. After the POST succeeded, the result's meta-information is sent to Pando which outputs it on the standard output.

Since the result meta-information is not submitted unless the POST succeeded, we have the guarantee that once it has been received by Pando the result has been saved on the file system. Compared to the [DAT](../photo-batch-processing-dat/) and [WebTorrent](../photo-batch-processing-webtorrent/) versions of the same example, this version removes the need for [pull-stubborn](https://github.com/elavoie/pull-stubborn).

## Example Usage:

````
    ./metainfo --after='2017' | ./process src/blur.js -- --start-idle
    open http://localhost:5000
```` 

The example uses two utilities that are intended to be combined in a Unix pipeline:
1. ````metainfo```` to download and list the images to be processed;
2. ````process```` to start Pando, serve the input files, and download the results after processing.

Options for both can be listed with ````--help````.


### Dependencies Installation

````
    npm install
````

### (Optional) Filter list of files 

The list of images may be limited to the images taken in 2017 by passing the option ````--after='2017'````. Other options are available by doing ````./metainfo --help````.

### Processing the images with Pando

The example uses the [./src/blur.js](./src/blur.js) processing function, which
loads the image from the HTTP server, applies a gaussian-filter on a gray
scale version, submit back the result to the HTTP server, which then saves the result on the file system.

## Notes on using the Landsat-8 dataset

The example downloads the full index of LANDSAT 8 images from http://landsat-pds.s3.amazonaws.com/scene_list.gz.

The scene list is stored in the following format:
````
entityId,acquisitionDate,cloudCover,processingLevel,path,row,min_lat,min_lon,max_lat,max_lon,download_url
LC80101172015002LGN00,2015-01-02 15:49:05.571384,80.81,L1GT,10,117,-79.09923,-139.66082,-77.7544,-125.09297,https://s3-us-west-2.amazonaws.com/landsat-pds/L8/010/117/LC80101172015002LGN00/index.html
````

By default, the ````./metainfo```` only keeps results pertaining to Grenoble (lattitude: 45.189 longitude: 6.017, which is [equivalent to WRS daytime](https://landsat.usgs.gov/wrs-2-pathrow-latitudelongitude-converter) path: 196 row: 29). Please use the previous link to select a different place and pass the path and row option to ````metainfo````.

## Notes when using Firefox

Firefox gives an: ````XML Parsing Error: syntax error````, while Chrome does not. Not sure why. It does not affect the result.
