cd pando-handbook/saso-2019
./setup-grid5k.sh
Xvfb :99 -screen 0 1024x768x24 2>&1 >/dev/null &
export DISPLAY=':99.0';


dahu-28 -30 -27 -5 -26 -29 -25 -31 -6
yeti-1 

./count-range-bignum --nb-test-ranges=100000 | DEBUG='pando-computing:monitoring:children' pando collatz-range-bignum.js --stdin --start-idle --batch-size=2 --headless 2>$EXP_DIR/children.txt | DEBUG='throughput*' ./monitor 2>$EXP_DIR/output.txt —stats
