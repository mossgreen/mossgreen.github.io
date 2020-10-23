---
title: AWS Servcies - Monitoring
search: true
tags:
  - AWS
  - SAA Certificatin
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

CloudWatch, cloutTrail, etc.

## AWS CloudWatch

- Use CloudWatch to monitor your AWS resources and the applications you run on AWS in real time.
- It's responsible for metirc colectin, monitoring, and virualization for most AWS services and can be extended for no-premises infrastructure and custom applications.
- It's a service that provides near real-time monitoring of AWS products. In essence, it's a metrics repository. You can import custom metric data in real-time from some AWS services and no-premises platforms.

Data retention is based on granularity:

- one hour metrics are retained for 455 days
- five minutes metirc for 63 days
- one minute metrics for 15 days

Metrics can be configured with alarms that can take actiosn, and data can be presented as a dashboard.

### CloudWatch Metric and Alarms

A CloudWatch metric is a set of data points over time. An example is CPU utilization of an EC2 isntance.

Alarms can be created on metircs, taking an action of the alarm is triggerred.

Alarms have three states:

- INSUFFICIENT: not enough data to judge the state - alarms are often start in this state. alarms are oftenstart in this state.
- ALARM: the alarm threshold has been breached (e.g., > 90% CPU
- OK: the threshold has not been breached.

Alarms have a number of key components:

- Metric: the data points over time being measured
- Threshold: exceeding this is bad (static or anomaly)
- Period: how long the threashold should be bad before an alarm is generated
- Action: What do to when an alarm triggeres:
  - SNS
  - Auto Scaling
  - EC2

### CloudWatch Logs

- It forms part of the wider CloudWatch product and offers log ingestion, searching, management, and metric filter functionality.
- CloudWatch Logs is used by many AWS services for log storage and can be extended for custom applications and on-premises servers.
- It accesses logs from EC2, on-premises servers, Lambda, CloudTrail, Route 53, VPN Flow Logs, custom applications, and much more.
- Metirc filters can be used to analyze logs and create metrics (e.g., failed SSH logins)

A **metric filter** pattern matches text in all log events in all log streams of whichever log group it's created on, creating a metric.
A **log group** is a container for log streams. It controls retention, monitoring, and access control.
A **log event** is a timestamp and a raw message.
A **log stream** is a sequence of log events with the same source

### CloudWatch Events

It has a near real-time visibility of changes tht happend within an AWS account. Using rules, you can match against certain events within an account and deliver those events to a number of supported targets.

Within rles, many AWS services are natively supported as event sources and deliver the events directly. For others, CloudWatch allows event pattern matching against CloudTrail events. Additional rules support scheduled events as sources, allowing a cron-style fucntion for periodically passing events to targets.

Some examples of event targets include:

- EC2 instance
- lambda fucntions
- Step functions state machines
- SNS topics
- SQS queues

## Amazon CloudTrail

- It is a critical product within AWS, as it provides full API/account activity logging across all regions in an account and (optionally) all accounts within an AWS Organization.
- It'a a governace, compliance, risk management, and auditing service that records account activity with an AWS account.
- Any actions taken by **users, roles, or AWS services** are recorded to the service.
- Activity is recorded as a CloudTrail event, and by default you can view 90 days via event history.
- Trails can be created, giving more control over logging and allowing events to be stored in S3 and CloudWatch logs

Events cna be **management events** that log control plane events (e.g., user login, configuring security, and adjustring security groups) or data events (e.g., object-level events in S3 or function-level events in Lambda)

AWS CloudTrail can integrate with AWS KMS to provde with logs of all key usage to help meet regulatory and compliance needs.

It records API calls made on your account and delivers log files to your Amazon S3 bucket. AWS CloudTrail’s benefit is visibility into account activity by recording API calls made on your account.

AWS CloudTrail records the following information about each API call:

- The name of the API
- The identity of the caller
- The time of the API call
- The request parameters
- The response elements returned by the AWS Cloud service

Validated log files are invaluable in security and forensic investigations.

Key words:

- Audit log

### CloudWatch vs. CloudTrail

- CloudWatch: What's happening?
- CloudTrail: Who do what?

## References

- [Linux Academy: AWS Certified Solutions Architect - Associate Level](https://linuxacademy.com/course/aws-certified-solutions-architect-2019-associate-level)
- [AWS Certified SAA 2018 - Exam Feedback](https://acloud.guru/forums/aws-certified-solutions-architect-associate/discussion/-KSDNs4nfg5ikp6yBN9l/exam_feedback_-_20_specific_po)
- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558) (out-of-date)
