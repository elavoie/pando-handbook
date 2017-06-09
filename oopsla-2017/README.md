
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

Follow the instructions on the main README of this repository [../README.md](../README.md).

### Copy the Experimenter Files to Grid5000

Download the archive that contained this handbook using `wget` or `curl`.

Alternatively, clone the handbook from the lastest version on GitHub:

    git clone https://github.com/elavoie/pando-handbook/
    
### Setup Missing Packages

    cd pando-handbook/oopsla-2017
    ./setup-grid5k.sh
    
### Install Node Packages for Experiments
    
    cd pando-handbook/oopsla-2017
    npm install

## Connect to multiple nodes simultaneously

For testing you setup, connect to 3 nodes. One of them will become the pando process, and the two others will become volunteers.

### OSX

On OSX you may use iTerm2. 

1. Open as many split panes as the number of nodes you will need (3 in this case) (Shell->Split Pane Horizontally or Vertically);
2. Then use Shell->Broadcast Input to All Panes in Current Tab;
3. `ssh username@access.grid5000.fr`
4. `ssh grenoble`
5. `oarsub -I`


### Linux

TODO

    
## Start the VPN access

### OSX

1. Start Tunnelblick
2. Tunnerblick Tray Icon->Connect Grid5000_VPN

### Linux 

TODO
    
## Start Pando

Disconnect one of the connected nodes from the broadcasting. On that node, start Pando:

    cd pando-handbook/oopsla-2017
    npm install
    pando ./square.js 1 2 3 4 5 6 7 8 9 10 --start-idle

Note the *volunteer code url* and the *monitoring page url*.

## Monitor Experiment Progress

On your local machine, open the *monitoring page url* in your browser. The browser will connect to the pando process through the VPN.

## Setup Volunteers

On all other connected nodes, using the broadcasting option:

    cd pando-handbook/oopsla-2017
    ./setup-grid5k.sh
    Xvfb :99 -screen 0 1024x768x24; /dev/null 2>&1     &
  
## Start Volunteers

Use the specified TABS_PER_NODE (experiment-specific) and VOLUNTEER_CODE_URL (provided by pando on startup). To make sure you have a working setup, use `1` for TABS_PER_NODE:

    killall electron; export DISPLAY=':99.0'; ./chromium-tabs TABS_PER_NODE VOLUNTEER_CODE_URL
    
Verify that the monitoring page shows a number of connected children that is equal to the number of volunteers started. 

If the node that executes pando starts showing output results, at least one volunteer successfully connected. If the monitoring page shows 2 children, then all volunteers successfully connected and you are ready to perform the actual experiments of the paper.

## Troubleshooting

# Data Used for Figures

# Step-By-Step Instructions

## Synthetic Example

## Collatz Example

# Plotting the Results

# Helper Scripts
