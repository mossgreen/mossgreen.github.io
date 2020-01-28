---
title: AWS SAA Certificatin Resilient Architectures
search: true
tags: 
  - AWS
  - SAA Certificatin
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

AWS SAA Certificatin Resilient Architectures

## Certificate Versions

### Versions before March 2020

Domain 1: Design Resilient Architectures

1.1 Choose reliable/resilient storage.
1.2 Determine how to design decoupling mechanisms using AWS services.
1.3 Determine how to design a multi-tier architecture solution.
1.4 Determine how to design high availability and/or fault tolerant architectures.

### new

Domain 1: Design Resilient Architectures

1.1 Design a multi-tier architecture solution
1.2 Design highly available and/or fault-tolerant architectures
1.3 Design decoupling mechanisms using AWS services
1.4 Choose appropriate resilient storage

## important services

Amazon EC2
Amazon VPC
Amazon S3
Amazon EBS
Amazon RDS
Amazon DynamoDB
Elastic Load Balancing
Amazon CloudWatch
AWS Identity & Access Management
Amazon Simple Queue Service

## other  services need to know

Amazon Glacier
Amazon ElastiCache
Amazon Redshift
Amazon CloudFront
Amazon Route53
AWS CloudFormation
AWS Config
AWS CloudTrial
AWS WAF
Amazon Simple Notification Service
Amazon Simple Email Service
AWS Import/Export
AWS connect

## Services in SAA

1. Compute and Networking Services

    - Amazon EC2 ★★
    - Elastic Load Balancing  ★★
    - Amazon VPC ★★
    - AWS Lambda
    - Auto Scaling
    - AWS Elastic Beanstalk
    - Amazon Virtual Private Cloud (Amazon VPC) ★★
    - AWS Direct Connect
    - Amazon Route 53 ★★

2. Storage and Content Delivery

    - Amazon S3 ★★
    - Amazon Glacier ★
    - Amazon EBS ★★
    - AWS Storage Gateway ★
    - Amazon CloudFront

3. Database Services

    - Amazon RDS ★★
    - Amazon DynamoDB
    - Amazon Redshift ★
    - Amazon ElastiCache ★

4. Management Tools
    - Amazon CloudWatch ★★
    - AWS CloudFormation ★
    - Amazon CloudFront ★
    - AWS CloudTrail

5. Security and Identity
    - AWS Identity and Access Management (IAM) ★★
    - AWS Key Management Service (KMS) ★
    - AWS Directory Service ★
    - AWS Certificate Manager
    - AWS Web Application Firewall (WAF)
    - AWS Kinesis ★

6. Application Services
    - Amazon API Gateway
    - Amazon Elastic Transcoder
    - Amazon Simple Notification Service (Amazon SNS) ★
    - Amazon Simple Email Service (Amazon SES) ★
    - Amazon Simple Workflow Service (Amazon SWF)
    - Amazon Simple Queue Service (Amazon SQS) ★★

## Amazon Simple Storage Service (Amazon S3)

### Comman use cases for Amazon S3 storeage

1. Backup and archive for on-premises or cloud data

2. Content, media, and software storeage and distribution
3. Big dta analytics
4. Static website hosting
5. Cloud-native mobile and Internet application hosting
6. Disaster recovery

### Object storage VS. traditional block and file storage

traditional IT environments, 2 ways:

1. block storage: operates at a lower level, the raw storage device level and amnages data as a set of numberred, fixed size blocks.
2. file storage: operates at a higher level, the operating system level, and manages data as a named hierarchy of files and folders.

Amazon S3 object storage is cloud object storeage

1. data is manged as objects using an API with http verbs. operating on the whole object at once, cannot incrementally updateing portions of the object as you do with a file.
2. objects reside in containers called buckets and each object is identified by a unique user-specified key (filename).
3. each object contains data and meta data
    - data:

Note:

If you need the traditioanl block or file storage in addition tot Amazon S3 storage,

1. you can use Amazon EBS for EC2 instances
2. Amazon Elastic File systems (AWS EFS) provices network-attached shared file storage using the NFX v4 protocol.

### Buckets

1. Buckets are a simple flet structure. You can have multiple buckets, but cannot have a sub-bucket.
2. A bucket can store an unlimited number of files.
3. Files are automatically replicated on multiple devices in multiple facilities, **within a region**.
4. Bucket names are glocal, must be unique across all AWS accounts.
5. can contain up to 63 lowercase letters, numbers, hyphens, and periods.
6. Best practice: use bucket names that contain your domain name and conform to the rules for DNS names. It ensures that your bucket names can be used in all reqioins and can host static websites.

## References

- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558)
