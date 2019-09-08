# Sub-directories

The following directories contain data and utilities to facilitate the replication of the middleware19 experiments:

1. ````./analysis````: provides the ````throughput.js```` script to compute the average throughput of devices from the data saved in experiments, as well as the results of runs (````runs/results````);
2. ````./deploy````: provides scripts to help deployments on some volunteer devices. The chrome-tabs enables deploying a large number of tabs from a single node easily.
3. ````./experiments````: provides the logs that were used to construct the paper table. The throughputs are computed from the self-reported measurements from all the devices in the ````devices.txt```` file. The ````output.txt```` is provided for reference to compare with the throughput at the output of Pando.
4. ````./run````: provides scripts to replicate the experiments using the example applications. Those automatically save the performance logs in subdirectories of ````./run/results````.

# Reference commands

The following commands were used to deploy nodes on Grid5000 and PlanetLab-EU.

## Grid5000 experiments

````
oarsub -I -p "cluster='NAME'"
````

````
git clone git@github.com:elavoie/pando-handbook.git
cd pando-handbook/oopsla-2019
npm install
./setup-grid5k.sh
Xvfb :99 -screen 0 1024x768x24 2>&1 >/dev/null &
export DISPLAY=':99.0';
./chrome-tabs CORES "http://IP:PORT/#protocol=websocket;device=NAME;"
````

## PlanetLab experiments

````
sudo yum install -y git xorg-x11-server-Xvfb
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install stable
npm install -g electron
Xvfb :99 -screen 0 1024x768x24 2>&1 >/dev/null &
export DISPLAY=':99.0';
electron --version
git clone https://github.com/elavoie/pando-handbook.git
cd pando-handbook/ooplsa2019
nom install
./chrome-tabs 1 ‘https://pando-volunteer.herokuapp.com/'
````
