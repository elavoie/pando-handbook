
````
seq 1000000 | DEBUG='pando-computing:monitoring:children' pando square.js --stdin --headless --start-idle 2>$EXP_DIR/children.txt | DEBUG='throughput*' ./expect-square 2>$EXP_DIR/output.txt 1>/dev/null

sleep X; # 1 to 10 seconds
./chrome-tabs N 'http://172.18.20.25:5000/#protocol=webrtc;device=dahu;' # N 1 to 100
````

Machines:
dahu-25 (Pando Master)
dahu-9 -29 -5 -28 -7 -6 -8 -32 -3 -4

5 Experiments each of 10, 50, 100, 250, 500, 1000


