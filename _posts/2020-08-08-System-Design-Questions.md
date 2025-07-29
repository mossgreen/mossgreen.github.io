---
title: Common System Design Questions
search: true
tags:
  - System Design
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Some common system design questions

## Delivery Framework

## Common System Design Questions

### Network and Infrastructure Constraints

- Limited bandwidth or high packet loss forces TCP retransmissions, inflating tail latency —especially for large payloads .
- Geo-distributed assets served from a single origin add 100-200 ms of RTT per continent hop. Push static files to a CDN edge; Cloudflare, or AWS CloudFront usually cut download time by ≥50% .
- Blind dependence on third-party APIs (payments, auth, maps) without fallbacks can block every request during an outage. Wrap such calls in circuit-breaker logic plus timeouts <½ your SLO .
- Inefficient replication schemes: pulling full data dumps hourly balloons egress costs and stalls warm replicas; switch to delta or change-data-capture (CDC) streams to ship only modified rows/objects .

### Centralised “Choke-Point” Resources

- Single load balancer, cache cluster, or primary DB becomes a reliability and performance bottleneck. Deploy them as N + 1 pairs behind anycast or DNS load-balancing, and shard state where possible.
- Hot shards or sticky sessions cause one node to hit 90% CPU while siblings idle. Use consistent hashing or randomised load-balancing to level traffic.

### CAP Theorem Trade-Offs
We can’t have strong consistency, full availability, and partition tolerance simultaneously:

### Database-Related Bottlenecks

- Slow queries and inefficient indexing
- Read-heavy loads without replicas
- Write-heavy traffic, especially in systems not designed for asynchronous processing

### Code and Application Design Flaws

- Inefficient algorithms or poor code quality, e.g., too many loops burn CPUs
- Monolithic architectures makes it hard to scale parts independently
- Inadequate caching

### Resource & Auto-Scaling Issues

- Resource contention: CPU, memory, or connection pools
- Inefficient scaling strategies: no elastic auto-scaling
- Third-party dependencies: Slow or rate-limited external services, like payment gateways

### Proactive Optimisation Playbook

1. Profile Resource Usage: Identify hot paths in code and DB queries.
2. Stress Testing: Simulate max load with tools like JMeter to identify weak spots.
3. Bulkheading: Isolate dependent services with timeouts/fail fast strategies.
4. Cache Layering: Tier 1 (in-app LRU) → Tier 2 (Redis) → Tier 3 (DB/Backup).





## References

