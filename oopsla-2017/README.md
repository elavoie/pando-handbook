
# Getting Started

## Requesting an Account on Grid5000

Submit a request for an Open Access account at the following address:

https://www.grid5000.fr/mediawiki/index.php/Special:G5KRequestOpenAccess

## Setup VPN Access for Remote Monitoring

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

## Connect to Multiple Nodes Simultaneously

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

## Setup Missing Packages

On all nodes, execute the following commands:

    cd pando-handbook/oopsla-2017
    ./setup-grid5k.sh
    Xvfb :99 -screen 0 1024x768x24 2>&1 >/dev/null &
    export DISPLAY=':99.0';
    
## Start the VPN access

### OSX

1. Start Tunnelblick
2. Tunnerblick Tray Icon->Connect Grid5000_VPN

### Other Platforms 

Follow instructions at https://www.grid5000.fr/mediawiki/index.php/VPN.
    
## Start Pando

Disconnect one of the connected nodes from the broadcasting (if applicable). On that node, start Pando:

    cd pando-handbook/oopsla-2017
    pando ./square.js 1 2 3 4 5 6 7 8 9 10 --start-idle --headless

Note the *volunteer code url* and the *monitoring page url*.

## Monitor Experiment Progress

On your local machine, open the *monitoring page url* in your browser. The browser will connect to the Pando client through the VPN.

The `root status` section regularly provides the status of system as seen from the root node of the tree overlay (the client) and obtained through the WebRTC fat-tree overlay. It is a summary of the internal state of the node and many of its sub-modules. The most important property is the `childrenNb` that tells the number of children in the tree.

The `global monitoring` section provides a snapshot of the state of the entire system from the point of view of all the nodes. It is only active when the `--global-monitoring` option is passed to the commandline tool.  Each volunteer will maintain an additional direct WebSocket connection to Pando to send its internal state regularly. Its state will be shown in the section.
  
## Start Volunteers

On the other two nodes, start chromium with one tab that will load the volunteer code (other experiments later may request more than one tab per node):

    ./chromium-tabs 1 VOLUNTEER_CODE_URL
    
Verify that the monitoring page shows a number of connected children that is equal to the number of volunteers started. 

If the node that executes the Pando client starts showing output results, at least one volunteer successfully connected. If the monitoring page shows 2 children (root status's `childrenNb` is equal to `2`), then all volunteers successfully connected and you are ready to perform the actual experiments of the paper.

## Troubleshooting

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

# Data Used for Figures

# Step-By-Step Instructions

## Synthetic Example

## Collatz Example

# Plotting the Results

# Helper Scripts
