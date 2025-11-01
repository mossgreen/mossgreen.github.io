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

1. Requirements
  - functional reuqirements
  - unfunctional requirements, the quality of service
    - May start from CAP 
2. Core entities, the entities db will persist or api to exchange. 
    Or, I can call it a concept. e.g., a user, an event, a ticket, etc.
3. API or Interface design, no more than 5 mins
4. Data Flow
5. High-level Design, to meet the functional requirements
6. Deep Dives, to fullfill the non-functional requirements, e.g., strongly consistent

### How are system design interviews evaluated?

1. problem solving: identify & prioritize the core challenges
2. solution design: create scalable architectures with balanced trade-offs
3. technical excellence: demonstrate deep knowledge and expertise
4. communication: clearly explain complex concepts to stakeholders


### Why do we need capacity estimation
1. determine number of servers and databases
2. cost management
3. decide the type and specifications of all hardware(server, db, etc.)
4. help us determine if the system is read heavy or write heavy, from read/write throughput analyse.
  - read heavy, choose postgres with indexing
  - write heavy, choose casandra or couchdb?

## Common System Design Concepts

### Network and Infrastructure Constraints

- Limited bandwidth or high packet loss forces TCP retransmissions, inflating tail latency —especially for large payloads .
- Geo-distributed assets served from a single origin add 100-200 ms of RTT per continent hop. Push static files to a CDN edge; Cloudflare, or AWS CloudFront usually cut download time by ≥50% .
- Blind dependence on third-party APIs (payments, auth, maps) without fallbacks can block every request during an outage. Wrap such calls in circuit-breaker logic plus timeouts <½ your SLO .
- Inefficient replication schemes: pulling full data dumps hourly balloons egress costs and stalls warm replicas; switch to delta or change-data-capture (CDC) streams to ship only modified rows/objects .

### Centralised “Choke-Point” Resources

- Single load balancer, cache cluster, or primary DB becomes a reliability and performance bottleneck. Deploy them as N + 1 pairs behind anycast or DNS load-balancing, and shard state where possible.
- Hot shards or sticky sessions cause one node to hit 90% CPU while siblings idle. Use consistent hashing or randomised load-balancing to level traffic.

### CAP Theorem Trade-Offs
We can’t have strong consistency, full availability, and partition tolerance simultaneously.

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


## Case study: design a youtube

### Requirements

1. Functional Requirements
- users shoud be able to upload videos
- users should be able to watch/stream videos

the scale
1m uplods/day
1000M DAU
Max video size of a video is 256GB

2. non-functional requirements
- availablity >> consistency for video upload
- support uploading and streaming for large videos (256GB)
- streaming low latency < 500 ms
- scalability to scale to 1 M uploads/day and 100M views

### Core entities
- video
- video metadata
- user

### API design
// upload a video
POST /api/v1/videos
{
  videoStoreId,
  videoMetadata
}

// watch a video
GET /api/v1/vides{videoId} -> video & videoMetadata

### HLD
// upload a video
client -> S3 to get videoStoreId
client -> api gateway -> video services -> videoMetadataDB (status: pending)
          S3 notification, update videoMetadata status -> uploaded

// to stream a video
client -> api gateway -> video services -> videoMetadataDB: fetch by video id, find s3Url -> S3

### Deep dive
 

## References

