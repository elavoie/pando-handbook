
````
seq 1000000 | DEBUG='pando-computing:monitoring:children' pando square.js --stdin --headless --start-idle 2>$EXP_DIR/children.txt | DEBUG='throughput*' ./expect-square 2>$EXP_DIR/output.txt 1>/dev/null
````
