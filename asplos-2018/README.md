
# Getting Started

## 1. Requesting an Account on Grid5000

Submit a request for an Open Access account at the following address:

https://www.grid5000.fr/mediawiki/index.php/Special:G5KRequestOpenAccess

## 2. Setup VPN Access for Remote Monitoring

Once you have obtained an account on Grid5000, follow the instructions here:

https://www.grid5000.fr/mediawiki/index.php/VPN

## 3. Setup Files

### Connect to Grid5000 - Grenoble Site

1. `ssh username@access.grid5000.fr`
2. `ssh grenoble`

### Install Pando

Install Pando's dependencies:

    cd pando-computing
    npm install

Or install a more recent version of Pando (with its dependencies automatically):

    npm install -g pando

### Copy the Experimenter Files to Grid5000

Download the archive that contained this handbook using `wget` or `curl`.

Alternatively, clone the handbook from the lastest version on GitHub:

    git clone https://github.com/elavoie/pando-handbook/
    
### Install Node Packages for Experiments
    
    cd pando-handbook/asplos-2018
    npm install

## 4. Connect to Multiple Nodes Simultaneously

For testing your setup, connect to 3 nodes. One of them will become the Pando client, and the two others will become volunteers. You may reuse the previous connection to the Grid5000 access node for the Pando client by skipping the unnecessary steps.

### OSX

On OSX you may use iTerm2:

1. Open as many split panes as the number of nodes you will need (Shell->Split Pane Horizontally or Vertically);
2. Then use Shell->Broadcast Input->Broadcast Input to All Panes in Current Tab;
3. `ssh username@access.grid5000.fr`
4. `ssh grenoble`
5. `oarsub -I`

If you need to, you may later disconnect a pane from broadcasting by clicking on Shell->Broadcast Input->Toggle Broadcast To Current Session.


### Other Platforms

Use the tmux installed on the Grid5000 access node (`grenoble`) to open terminals for the volunteer nodes:

1. `ssh username@access.grid5000.fr`
2. `ssh grenoble`
3. Start tmux with `tmux` and split in two vertically stacked panes with `C-b "`;
4. Setup broadcasting to all panes with `C-b :setw synchronize-panes`;
5. `oarsub -I`

Connect a second time in a different terminal to open a terminal for the Pando client node:

1. `ssh username@access.grid5000.fr`
2. `ssh grenoble`
3. `oarsub -I`

## 5. Setup Missing Packages

On all nodes, execute the following commands:

    cd pando-handbook/asplos-2018
    ./setup-grid5k.sh
    Xvfb :99 -screen 0 1024x768x24 2>&1 >/dev/null &
    export DISPLAY=':99.0';
    
## 6. Start the VPN access

### OSX

1. Start Tunnelblick
2. Tunnerblick Tray Icon->Connect Grid5000_VPN

### Other Platforms 

Follow instructions at https://www.grid5000.fr/mediawiki/index.php/VPN.
    
## 7. Start Pando

Disconnect one of the connected nodes from the broadcasting (if applicable). On that node, start Pando:

    cd pando-handbook/asplos-2018
    pando ./square.js 1 2 3 4 5 6 7 8 9 10 --start-idle --headless

Note the *volunteer code url* and the *monitoring page url*.

## 8. Monitor Experiment Progress

On your local machine, open the *monitoring page url* in your browser. The browser will connect to the Pando client through the VPN.

The `root status` section regularly provides the status of system as seen from the root node of the tree overlay (the client) and obtained through the WebRTC fat-tree overlay. It is a summary of the internal state of the node and many of its sub-modules. The most important property is the `childrenNb` that tells the number of children in the tree.

The `global monitoring` section provides a snapshot of the state of the entire system from the point of view of all the nodes. It is only active when the `--global-monitoring` option is passed to the commandline tool.  Each volunteer will maintain an additional direct WebSocket connection to Pando to send its internal state regularly. Its state will be shown in the section.
  
## 9. Start Volunteers

On the other two nodes, start chromium with one tab that will load the volunteer code (other experiments later may request more than one tab per node):

    ./chromium-tabs 1 VOLUNTEER_CODE_URL
    
Verify that the monitoring page shows a number of connected children that is equal to the number of volunteers started. 

If the node that executes the Pando client starts showing output results, at least one volunteer successfully connected. If the monitoring page shows 2 children (root status's `childrenNb` is equal to `2`), then all volunteers successfully connected and you are ready to perform the actual experiments of the paper.

# Troubleshooting

### Error: electron-eval error: Electron process exited with code 1

You probably forgot to use the `--headless` option.

### ./setup-grid5k.sh: line 2: sudo-g5k: command not found

You are probably trying to execute the setup script from the access node. Obtain a grid5000 node first with `oarsub -I` then run `./setup-grid5k.sh` again.

### Error: Could not start Xvfb: "Xvfb is not installed or is not in your $PATH"

You are probably using the `--headless` option without having started an instance of Xvfb beforehand. Start Xvfb:

    Xvfb :99 -screen 0 1024x768x24; /dev/null 2>&1     &
    export DISPLAY=':99.0';

### The number of connected children is less than 2 (root status's `childrenNb` is less than 2)

Start the experiment with the `--global-monitoring` option. If the number of volunteers monitored is correct but the number of connected children (root status's `childrenNb`) is less than expected, there is probably a problem establishing the tree overlay. Redo the experiment multiple times. If the problem persists there might be a problem in the WebRTC library used or a bug in the tree overlay code.

### The number of volunteers monitored is zero, (or less than expected) in the global status

If you have not used the `--global-monitoring` option this is normal. Otherwise, make sure the url you use for starting volunteers is correct. If the url is correct but you cannot establish connection, try using the Unix commandline tool `ping` to test for connectivity between the Grid5000 nodes.

# Experiment Design

The goal of the following experiments is to determine whether the Pando platform can scale to enough CPUs and use them efficiently enough to be useful on practical problems. As other projects based on BOINC have 100,000 volunteers contributing to them, we thought showing scaling up to a 1000 volunteers would bring us beyond what is possible with simple scripting solutions and be convincing enough that it can be seen as an interesting and valid alternative to the BOINC platform once the system is mature.

In the next experiments, we quantify the performance overhead of coordination done by the stream management modules (pull-stream abstractions in the paper) and the fat-tree overlay by measuring the average throughput achieved over a roughly one minute execution. The execution time includes the initial organization of volunteers into a fat-tree overlay on Grid5000 nodes, the dispatch of inputs, the retrieval of results, their reordering, and their output on the standard output. It does not include the reservation of Grid5000 nodes. We measure the overhead on two benchmarks, one simple benchmark that enables easy verification of output correctness and the other that represent an actual BOINC project.

The Square benchmark is a stream of increasing values `0,1,2,3,..` in which the output is the square of the input `0**2, 1**2, 2**2, 3**2, ...`. We use a simple Unix process to compare the output received with the expected value and stop the entire pipeline in case of error. Every successful execution therefore means that all outputs were received in the correct order and had the correct value.  The computation time is simulated by delaying the computation of the output by one second. By dividing the various measurements by `1 value/sec`, you then get a speedup over a single volunteer performing all computations. The difference between the throughput obtained if all browser tabs would process values without overhead, *the perfect throughput* (`(1 value/sec) * nb tabs`), and the actual measured throughput is the coordination overhead. Since the size of the input sent and of the results retrieved is really small, the overhead can be attributed to the stream management by the pull-stream abstractions, communication latency, and CPU usage rather than bandwidth capacity of the network links between Grid5000 nodes and the data management strategy (in Pando data flows through the fat-tree overlay).

The Collatz benchmark is a straightforward implementation in JavaScript of the conjecture of the same name and is one of the BOINC projects. The JavaScript implementation uses big numbers and starts counting from the latest highest known value so far (so if it found a higher value that would be an actual contribution to the project). The implementation is not optimized for single CPU performance as we are interested in the scaling properties of the Pando platform and not the actual number crunching capabilities of that particular implementation on Pando. Each volunteer tests a range of values (rather than individual numbers) so that the computation time for a single input is about 1 second to make the computation time a bottleneck (rather than the communication overhead). To make all experiments run for about 1 minute, we vary the number of inputs sent, with each composed of a range of numbers to test. The actual number depends on the number of cores available.

For both experiments, each fat-tree node has a maximum of 10 children (*maxDegree*) and the maximum number of values delegated to a single child is limited to `maxDegree * Nb leaf nodes` of that child (only leaf nodes perform computation). These values were not optimized for the paper so higher throughputs might be possible by adjusting them. Moreover, contrary to the procedure given in the Getting Started section, Pando is not started idle (`--start-idle is not used`). It starts processing values right after starting and will stop once volunteers connect. That corresponds to the expected usage scenario by an end user which would like to obtain all the processed values as soon as possible.

# Step-By-Step Instructions

For both experiments, the invidual throughput results should be saved in the `./data/*-throughput-newer-experiments.csv` in the csv format, one result per line. You may look at the [./data/square-throughput.csv](./data/square-throughput.csv) and [./data/collatz-throughput.csv](./data/collatz-throughput.csv) to understand the format.

## Square Benchmark

For each line in the following table with varying parameters, repeat the following experiment 10 times:

1. Reserve and setup 1 + *Nb Grid5000 Nodes* (Steps 4 and 5 in Getting Started).
2. `cd pando-handbook/asplos-2018`.
3. Start VPN if not already started (Step 6).
4. On one Grid5000 node, do:
    
    `./count NB_VALUES_TO_PROCESS | pando square.js --stdin --headless --degree=10 | ./expect-square | pv -l`

5. Wait 1s after `Serving volunteer code at VOLUNTEER_CODE_URL` has appeared, then simultaneously do on the other Grid5000 nodes:

    `./chromium-tabs NB_TABS_PER_NODE VOLUNTEER_CODE_URL`

6. Monitor the experiment by opening the *monitoring page url* on your local browser: 
    1. Make sure the number of children number (`childrenNb` in root status) is equal to the *Total Nb Tabs* expected (it may take a few seconds before it is reached). If after more than 10s it is still not reached, stop the experiment, discard the timing result, and restart.
    2. If the `lendStreamState.lendState.sourcedNb` stops increasing for more than a few seconds, the pipeline may have stalled. Stop the experiment, discard the throughput result, and restart.
7. When the experiment completes, note the number of lines processed per second returned by `pv`. This is the average number of values processed per second (*throughput*) during the experiment. (ex: `985m/s` means 0.985 lines/second).

Invariants: 

|       Name        |         Value          | Pando Commandline Option   |
| :---------------- | :--------------------- | :------------------------- |
| Max Tree Degree   |           10           |       `--degree=10`        |

Varying Parameters:

| Nb Grid5000 Nodes | Nb Tabs/Node | Total Nb Tabs | Nb Values to Process |
| :---------------- | :----------- | :------------ | :------------------- |
|         5         |       1      |    **5**      |          200         |
|         5         |       2      |    **10**     |          400         |
|         5         |       4      |    **20**     |          800         |
|         5         |       8      |    **40**     |         1600         |
|         5         |      20      |   **100**     |         4000         |
|         5         |      40      |   **200**     |         7000         |
|         5         |     100      |   **500**     |        24000         |
|        10         |     100      |   **1000**    |        40000         |

## Collatz Benchmark

For each line in the following table with varying parameters, repeat the following experiment 10 times:

1. Reserve and setup 1 + *Nb Grid5000 Nodes* (Steps 4 and 5 in Getting Started).
2. `cd pando-handbook/asplos-2018`.
3. Start VPN if not already started (Step 6).
4. On one Grid5000 node, do:
    
    `./count-range-bignum NB_VALUES_TO_PROCESS RANGE START_VALUE | pando collatz-range-bignum.js --stdin --headless --degree=10 | pv -l`

5. Wait 1s after `Serving volunteer code at VOLUNTEER_CODE_URL` has appeared, then simultaneously do on the other Grid5000 nodes:

    `./chromium-tabs NB_TABS_PER_NODE VOLUNTEER_CODE_URL`

6. Monitor the experiment by opening the *monitoring page url* on your local browser: 
    1. Make sure the number of children number (`childrenNb` in root status) is equal to the *Total Nb Tabs* expected (it may take a few seconds before it is reached). If after more than 10s it is still not reached, stop the experiment, discard the timing result, and restart.
    2. If the `lendStreamState.lendState.sourcedNb` stops increasing for more than a few seconds, the pipeline may have stalled. Stop the experiment, discard the throughput result, and restart.
7. When the experiment completes, note the number of lines processed per second returned by `pv`. This is the average number of values processed per second (*throughput*) during the experiment. (ex: `985m/s` means 0.985 lines/second).


Invariants: 

| Name              |         Value          | Pando Commandline Option  |
| :---------------- | :--------------------- | :------------------------ |
| Start Value       | 3179389980591125407167 |            N/A            |     
| Range             |          175           |            N/A            |
| Max Tree Degree   |           10           |       `--degree=10`       |

Varying Parameters:

| Nb Grid5000 Nodes | Nb Tabs/Node | Total Nb Cores | Nb Values to Process |
| :---------------- | :----------- | :------------- | :------------------- |
|         1         |       1      |     **1**      |          60          |
|         1         |       2      |     **2**      |         120          |
|         1         |       4      |     **4**      |         240          |
|         1         |       8      |     **8**      |         480          |
|         2         |       8      |    **16**      |         600          |
|         4         |       8      |    **32**      |        1000          |
|         8         |       8      |    **64**      |        2000          |

# Results Used for Figures

The raw data used for figures formatted in Comma Separated Values (CSV) is available in the [data](./data) subdirectory:
* [collatz-throughput.csv](./data/collatz-throughput.csv): throughput measurements obtained on the Collatz benchmark;
* [collatz-average-throughput.csv](./data/collatz-average-throughput.csv): averages for the throughput measurements on the Collatz benchmark;
* [square-throughput.csv](./data/square-throughput.csv): throughput measurements obtained on the Square benchmark;
* [square-average-throughput.csv](./data/square-average-throughput.csv): averages for the throughput measurements on the Square benchmark;

# Plotting the Results

The figures can be interactively explored using a Web browser by opening [figures/index.html](./figures/index.html) from the local file system. Once you have saved all your experiment results in the corresponding `data/*-throughput-newer-experiments.csv` files, update the figures with `./csv-to-js data/*.csv > figures/data.js` and refresh the page in your browser. Your own points should overlap with the existing experiment results on both figures.

# Helper Scripts

* [csv-to-js](./csv-to-js): converts the values in the csv format to JavaScript to be used by the Plotly figures. Simply `./csv-to-js data/*.csv > figures/data.js` to update the data for the figures.
