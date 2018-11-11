# Collatz Conjecture

Author: Erick Lavoie

This example distributes the calculations for the collatz conjecture. The conjecture asks whether for any positive integer, applying the following recursion always reach 1:
1. If the previous term *n* is even, the next term is *n/2*;
2. If the previous term *n* is odd, the next term is *3n + 1*.

The numerical challenge, as performed on the BOINC challenge, is to find an integer such that the number of steps applied until reaching 1 is higher than for all other known integers. This example shows that Pando can be applied to some existing volunteer computing problems.

## Example Usage:

````
    ./count-range-bignum | pando collatz-range-bignum.js --stdin --start-idle | DEBUG='throughput*' ./monitor
````

## Dependencies Installation
````
  cd collatz
  npm install
````

See possible [count-rage-bignum options](./count_usage.txt)


