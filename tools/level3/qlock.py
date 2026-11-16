# Usage: python3 /home/claude/lvl3/qlock.py <command...>   runs the command when one of two test slots is free.
# The machine has 2 CPUs; many workers share it. Always run headless-browser tests through this wrapper.
import fcntl, subprocess, sys, time
t0 = time.time()
while True:
    for i in range(2):
        f = open(f'/tmp/chrome_slot{i}.lock', 'w')
        try: fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError: f.close(); continue
        print(f'[slot {i}, waited {time.time()-t0:.0f}s]', flush=True)
        r = subprocess.run(sys.argv[1:]); sys.exit(r.returncode)
    time.sleep(3)
