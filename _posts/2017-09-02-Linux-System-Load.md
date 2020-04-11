---
title: Linux System Load Average Explained
search: true
tags: 
  - Linux
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

`Load Avg: 2.56, 2.26, 2.14`

## How to monitor linux system load average

```bash
\$ uptime
13:04  up  4:32, 4 users, load averages: 0.80, 2.72, 5.47

\$ top
Processes: 448 total, 3 running, 4 stuck, 441 sleeping, 2620 threads
Load Avg: 0.80, 2.72, 5.47  CPU usage: 21.30% user, 8.61% sys, 70.8%
```

## How to under stand the load average

Both `uptime` and `top` gives us the "Load Averages" which contains three numbers.

If it's a single core system:

1. Load average over the last 1 minutes is 0.80. CPU unitiliztion is 80%. 20% is idle.
2. Load average over the last 5 minutes is 2.72. CPU was overloaded by 172%. 1.72 processes were wating for CPU time (2.72) over the last 5 minutes.
3. Load average over the last 15 minutes is 5.47.

However, it's differenct if it's on multi core system.
On linux, we can find how many CPU cores we have

```bash
\$ nproc
4
```

If this instance has 4 cores:

1. Load average over the last 1 minutes is 0.80. CPU unitiliztion is 80%/4 = 20%.
2. Load average over the last 5 minutes is 2.72. CPU unitiliztion is 272%/4 = 68%.
3. Load average over the last 15 minutes is 5.47. 547%/4 = 137%. The CPU is overloaded.

## Understand the patterns

Example in a single core system

1. `5.0, 0.8, 0.6`: busy in a shot time, ideal in the middle term, idel in the long term. It's clitch, or a sign of a busy work

2. `5.0, 2.8, 0.6`: busy in a shot time, busy in the middle term, idel in the long term. It's normally a sign of blocking

3. `5.0, 5.8, 5.6`: system is under load

4. `0.8, 2.8, 0.6`: idel in a shot time, busy in the middle term, idel in the long term. No worries, the load is going down.

## References

- [Understand Linux Load Averages and Monitor Performance of Linux](https://www.tecmint.com/understand-linux-load-averages-and-monitor-performance/)
- [Linux Load Averages: Solving the Mystery](http://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html)

Last update: Jan 2020
