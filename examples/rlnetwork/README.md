# Hyper-parameter Optimization of a Learning Agent

Author: Erick Lavoie

This example illustrates how the optimization of hyper-parameters for a machine learning can distributed on multiple volunteers. It features:

* Parallel testing of combinations of hyper-parameters
* In-progress visualization when executing inside Web browsers
* Human input for faster convergence by eliminating by hyper-parameter combinations

It is based on the [ConvNetJS Deep Q Learning Demo originally written by Andrej Karpathy](https://cs.stanford.edu/people/karpathy/convnetjs/demo/rldemo.html), itself based on the paper ["Playing Atari with Deep Reinforcement Learning"](http://arxiv.org/pdf/1312.5602v1.pdf). In this example, we parallelize the testing of various learning rates to find which one works best. The training time for a single example is about 10 min. of processing on a MacBook Air 2011, the communication overhead of Pando is therefore negligible.

## Usage Examples

Install dependencies:
````
    cd rlnetwork
    npm install
````

Train a single example with the learning rate originally used in the ConvNetJS example:

````
    ./hyperparameters | pando rldemo.js --stdin --start-idle
````

Train four examples with learning rates between 0.0001 and 0.003:

````
    ./hyperparams --low=0.0001 --high=0.003 --steps=4 | pando rldemo.js --stdin --start-idle
````

## Closing Notes

The example could be adapter to explore other hyper-parameters such as the number of layers and parameteres the neural network.

