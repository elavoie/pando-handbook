
# Getting Started

## Requesting an account on Grid5000

Submit a request for an Open Access account at the following address:

https://www.grid5000.fr/mediawiki/index.php/Special:G5KRequestOpenAccess

## Setup VPN access for remote monitoring

Once you have obtained an account on Grid5000, follow the instructions here:

https://www.grid5000.fr/mediawiki/index.php/VPN

## Setup Files

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
    
    cd pando-handbook/oopsla-2017
    npm install

## Connect to multiple nodes simultaneously

For testing your setup, connect to 3 nodes. One of them will become the pando process, and the two others will become volunteers.

### OSX

On OSX you may use iTerm2. 

1. Open as many split panes as the number of nodes you will need (3 in this case) (Shell->Split Pane Horizontally or Vertically);
2. Then use Shell->Broadcast Input to All Panes in Current Tab;
3. `ssh username@access.grid5000.fr`
4. `ssh grenoble`
5. `oarsub -I`


### Linux

TODO


## Setup Missing Packages

On all nodes, broadcast the following commands:

    cd pando-handbook/oopsla-2017
    ./setup-grid5k.sh
    Xvfb :99 -screen 0 1024x768x24 2>&1 >/dev/null &
    export DISPLAY=':99.0';
    
## Start the VPN access

### OSX

1. Start Tunnelblick
2. Tunnerblick Tray Icon->Connect Grid5000_VPN

### Linux 

TODO
    
## Start Pando

Disconnect one of the connected nodes from the broadcasting. On that node, start Pando:

    cd pando-handbook/oopsla-2017
    pando ./square.js 1 2 3 4 5 6 7 8 9 10 --start-idle --headless

Note the *volunteer code url* and the *monitoring page url*.

## Monitor Experiment Progress

On your local machine, open the *monitoring page url* in your browser. The browser will connect to the pando process through the VPN.

The `root status` section regularly provides the status of system as seen from the root node of the tree overlay (the client) and obtained through the WebRTC fat-tree overlay. It is a summary of the internal state of the node and many of its sub-modules. The most important property is the `childrenNb` that tells the number of children in the tree.

The `global monitoring` provides a snapshot of the state of the entire system from the point of view of all the nodes. It is only active when the `--global-monitoring` option is passed to the commandline tool.  Each volunteer will maintain an additional direct WebSocket connection to Pando to send its internal state regularly. Its state will be shown in the section.
  
## Start Volunteers

Use the specified TABS_PER_NODE (experiment-specific) and VOLUNTEER_CODE_URL (provided by pando on startup). To test it for the first time, use `1` for TABS_PER_NODE:

    ./chromium-tabs TABS_PER_NODE VOLUNTEER_CODE_URL
    
Verify that the monitoring page shows a number of connected children that is equal to the number of volunteers started. 

If the node that executes pando starts showing output results, at least one volunteer successfully connected. If the monitoring page shows 2 children (Root Status's `childrenNb` should be equal to `2`), then all volunteers successfully connected and you are ready to perform the actual experiments of the paper.

## Troubleshooting

### Error: electron-eval error: Electron process exited with code 1

You probably forgot to use the `--headless` option.

### ./setup-grid5k.sh: line 2: sudo-g5k: command not found

You are probably trying to execute the setup script from the access node. Obtain a grid node first with `oarsub -I` then run `./setup-grid5k.sh` again.

### The number of connected children is less than 2 (root status's `childrenNb` is less than 2)

Start the experiment with the `--global-monitoring` option. If the number of volunteers monitored is correct but the number of connected children (root status's `childrenNb`) is less than expected, there is probably a problem establishing the tree overlay. Redo the experiment multiple times. If the problem presists there might be a problem in the WebRTC library used or a bug in the tree overlay code.

### The number of volunteers monitored is zero, (or less than expected) in the `global status`

If you have not used the `--global-monitoring` option this is normal. Otherwise, make sure the url you use for starting volunteers is correct. If the url is correct but you cannot establish connection, try using the Unix commandline tool `ping` to test for connectivity between nodes.

# Data Used for Figures

# Step-By-Step Instructions

## Synthetic Example

## Collatz Example

# Plotting the Results

# Helper Scripts
