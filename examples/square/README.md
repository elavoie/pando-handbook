# Square

Author: Erick Lavoie

This example squares input values, after a 1 second delay. It is useful for testing Pando: the end-to-end correctness and be tested by comparing the output values to the expected ones, and the startup time can be measured by measuring the time it takes for reaching maximum throughput (N numbers/s for N participants). 

## Example Usage:

````
    seq 10000 | pando square.js --stdin --start-idle 
````

## Dependencies Installation
````
  cd square
  npm install
````
