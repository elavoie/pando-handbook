# Nodes

Master: dahu-8

Workers: dahu-31 -27 -28 -6 -29 -35 -7 -3 -30 -5

# Commands

./count-range-bignum --nb-test-ranges=100000 | DEBUG='pando-computing:monitoring:children' pando collatz-range-bignum.js --stdin --start-idle --headless --batch-size=2 2>$EXP_DIR/children.txt | DEBUG='throughput*' ./monitor 2>$EXP_DIR/output.txt --stats2

sleep 8; ./chrome-tabs 32 'http://172.18.20.8:5000/#protocol=webrtc;device=dahu;'
