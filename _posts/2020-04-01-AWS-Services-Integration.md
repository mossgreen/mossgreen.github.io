---
title: AWS Servcies Study Notes, Integration
search: true
tags:
  - AWS
  - SAA Certificatin
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---
SNS, SQS, etc.

## Amazon Simple Notification Services, SNS

- Simple Notification Service (SNS) is a key part of AWS application integration products.
- It provides a pub/sub-based notification system, which supports a wide range of subscriber endpoint types.
- SNS coordinates and manages the sending and delivery of messages. Messages sent to a topic are delivered to subscribers.
- SNS is intergrated with many AWS servcies and can be used for certain event notifications, e.g., CloudFormation stack creation
- using SNS, CloudWatch can notify admins of important alerts
- SNS can be used for mobile push notifications

### SNS Components

- Topic: An isolated configuration for SNS, including permissions.
  - messages (<= 256KB) are sent to a topic
  - subscribers to that topic receive messages
- Subscriber: endpoints  that receive messsages for a top
  - HTTP(S)
  - Email and Email-JSON
  - SQS 9message can be added to one or more queues)
  - Mobile push notifications (ios, android, Amazon, MS)
  - lambda fucntions (function invoked)
  - SMS (cellular message)
- Publisher: an entity that publishes/sends messages to queue
  - Application
  - AWS servcies, including S3 (S3 events), CloudWatch, CloudFormation, etc

### Common Amazon SNS scenarios

1. Fanout
    - SNS message is sent to a topic and then replicated and pushed to multiple Amazon SQS queues, HTTP endpoints, or email addresses.
    - This allows for parallel asynchronous processing
2. Application and system alerts
3. Push email and text messaging
4. Mobile push notifications
5. Message durability

## Amazon Simple Queue Service, SQS

- SQS provides fully managed, highly available message queues for inter-process/server/service messaging.
- SQS is used mainly to create decoupled architectures.
- Messages are added to a queue and retrieved via polling

Polling Types:

- Short polling: Available messages are returned ASAP - a short poll might return 0 messages. Causes increated number of API calls
- Long polling: Waits for messages for a given `WaitTimeSeconds`, it's more Efficient: less empty api calls/responses

there are two types of queues

1. standard queues
  Standard queues are distributed and scalable to nearly unlimited message volume. the order is not guaranteed, best-effort only, and messages are guaranteed to be delivered at lease once but sometimes more than once.
2. FIFO queues
  first-in, first-out. Messages are delivered once only - duplicates do not occur. The throughput is limited to ~3,000 messages per second with batching or ~300 without by default.

Each SQS message can contain up to 256KB of data but can link data stored in S3 for any larger payloads.

When a message is polled, it's hidden in the queue. It can be deleted when processing is completed - otherwise, after a `VisibilityTimeOut` period, it will return to the queue.

Queues can be configured with a `maxReveiveCount`, allowing message that are failing to be moved to a dead-letter queue.

Lambda fucntions can be invoked based on messages on a queue offering better scaling and faster response than Auto Scaling groups for any messages that can be processed quickly.

### SNS + SQS fanout architecture

- SNS pushes them to everywhere they need to go
- SQS queues the messages

## AWS Elastic Transcoder

Elastic Transcoder is an AWS service that allows you to convert media fiels from an input format to one or more output formats. it's delivered as a servcie, and you're billed a per-minute charge while using the service.

A pip line is a queue for jobs. It stores source and destination settings, notification, security, and other high settings. Jobs are processed in the ordr they are added as resources allow.

A job defiens the input object and up to 30 output objects/formats. Jobs are added to a pipeline in the same region and use the buckets defined in the pipeline for input/output.

**Presets** contain transcoding settings and can be applied to jobs to ensure output compatible with various devices, such as iPhones, tablets, or other form factors.

## References

- [Linux Academy: AWS Certified Solutions Architect - Associate Level](https://linuxacademy.com/course/aws-certified-solutions-architect-2019-associate-level)
- [AWS Certified SAA 2018 - Exam Feedback](https://acloud.guru/forums/aws-certified-solutions-architect-associate/discussion/-KSDNs4nfg5ikp6yBN9l/exam_feedback_-_20_specific_po)
- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558) (out-of-date)
