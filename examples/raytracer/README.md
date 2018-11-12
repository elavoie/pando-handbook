# Pando Raytracer

Leverage Pando to generate an animation using a raytracer algorithm.

## Overwrite the same image as they are produced 
```
$ ./generate-angles | pando raytracer.js --stdin | ./write-current-frame
```

## Create an animated gif
```
$ ./generate-angles | pando raytracer.js --stdin | ./gif-encoder
```

## Monitor the throughput in real-time
```
$ ./generate-angles | pando raytracer.js --stdin --start-idle | DEBUG='throughput*' ./monitor |  ./write-current-frame
```

# Note

The gif-encoder has limitations that prevent sending images that are too big (> 65kB) on the standard input, when connected to Pando. It also does not handle flow control properly when reading the same input from a file. The image size is therefore artificially limited to 400x400 pixels to operate within those limitations.

## Author

[Mohammad Umair](https://github.com/omerjerk)
[Erick Lavoie](https://github.com/elavoie)
