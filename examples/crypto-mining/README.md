# Crypto-mining

Author: Erick Lavoie

This example illustrates how a proof-of-work for a crypto-currency can be
distributed on multiple volunteers. We assume volunteers willfully donate the
processing time for the benefit of a third party, as in a fundraising effort
for some causes or organizations.

The proof-of-work algorithm corresponds to that of Bitcoin: a miner searches
for a nonce such that ````sha256(nonce + block) <= TARGET````, where
````sha256```` is a hashing function, ````nonce```` is a number, and ````block```` is an
arbitrary string. The lower the target, the lower the probability to find a
valid nonce and therefore the harder it is to "mine" a new block.

The work is distributed by making every volunteer *mine the same block* by
trying different nonces. The work is divided in multiple *mining attempts* that
consist in testing all nonces in a range of values. An attempt results in a
success, when a nonce is found, or a failure, if none of the nonces were valid.
After returning their results, processors obtain another attempt description.
Processors keep making attempts until a valid nonce is found. 

The ````mine```` process *lazily creates as many mining attempts as there are
processors*. There are therefore no upper bound on the number of volunteers
that may join. ````mine```` monitors the results and as soon as a valid nonce
is found, the new attempt descriptions are updated to reflect the next block to
mine.

## Usage Examples

Single block mining within the same process:
````
    ./mine --local 
````

Single block attempt in a separate child process:
````
    ./mine --worker 
````

Single block attempt using Pando (requires Pando to be installed globally):
````
    ./mine --pando
````

Read blocks from the standard input:
````
    seq 10 | ./mine --stdin
````

Adjust the target to increase the mining difficulty and range size to increase
processing time:
````
    ./mine --target='2000000F' --range-size=400000
````

Report on the average hashing rate of the last 3 seconds, including communication
latency:
````
    DEBUG='throughput*' ./mine
````

Other options ````./mine --help````.

## Optimizing Throughput

Pando's BatchSize should be ````1```` (````PANDO-OPTIONS```` includes
````--batch-size=1````) to avoid queuing attempts that could become redundant
after a valid nonce has been found.

The range of nonces to test (````RangeSize````) is paramerizable (````mine
OPTIONS```` includes ````--range-size=R````). To obtain a good throughput, it
should be chosen such that the time taken for a mining attempt on the fastest
mining machine is at least 1-2 orders of magnitude greater that the
communication delay. That means 1-10 seconds of processing time on a LAN and
10-120 seconds on the Internet.

With the right choice of ````BatchSize```` and ````RangeSize````, the total
hashing power of the volunteers will grow linearly with their number.

## Closing Notes

The miner implementation is not optimized for maximum throughput on a single
machine; it is therefore unlikely it may be useful to *actually mine Bitcoins*.
Nonetheless, it is shows that Pando is useful for parallelizing mining
attempts.  This could be useful on other proof-of-work algorithms based on CPU
mining and/or with optimized implementations of the miner using the latest Web
technologies to leverage the GPU and multicore machines.
