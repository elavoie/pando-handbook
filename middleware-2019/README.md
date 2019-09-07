
# Grid5000 experiments

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

# PlanetLab experiments

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
