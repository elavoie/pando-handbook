# Pando Raytracer

Leverage Pando to generate an animation using a raytracer algorithm.

```
$ cd examples/raytracer
$ ./generate-angles.js | pando raytracer.js --stdin | ./gif-encoder.js
```

# Note

The gif-encoder has limitations that prevent sending images that are too big (> 65kB) on the standard input, when connected to Pando. It also does not handle flow control properly when reading the same input from a file. The image size is therefore artificially limited to 300x300 pixels to operate within those limitations.

## Author

[Mohammad Umair](https://github.com/omerjerk)
[Erick Lavoie](https://github.com/elavoie)
