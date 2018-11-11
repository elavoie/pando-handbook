# Random Testing of StreamLender's Correctness

Author: Erick Lavoie

This example distributes the execution of random tests on many volunteers. Those test cases ensure that the properties of StreamLender, which is the core abstraction at the heart of Pando, are maintained on each possible interleaving of concurrent executions between volunteers and the master process.  

This example shows how the distribution of random cases enables a quicker assessment of the quality of the library. Moreover, this is an example of bootstrapping as the distribution capabilities of Pando are used to ensure its own correctness.

## Example Usage:
````
  ./cases | pando tester.js --stdin --start-idle | DEBUG='throughput*' ./monitor
````

## Dependencies Installation
````
  cd random-testing
  npm install
````

See possible [test cases options](./cases_usage.txt).
