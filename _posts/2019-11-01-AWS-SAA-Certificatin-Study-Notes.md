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
7. For each bucket you can choose a particular place that close to your user to minimize latency, or apply compliance.

### Objects

1. Size: 0 ~ 5TB
2. A bucket can store unlimited number of objects.
3. Each object consists of data and metadata
    - data: the file itself, treated as a stream of bytes.
    - metadata: data about the file. A set of name/value pairs. Two types
        - system metadata, created and used by Amazon S3: date last modified, object size, md5 digest, http content type
        - user metadata, optional, can only be specified at the time the object is created.
4. Each object is identified by a unique key. A key can be up to 1024 bytes of Unicode UTF-8 characters, inclusing: embedded slashes, backslashes, dots and dashes.
5. Key must be unique within a bucket. Combination of bucket, key and optional version ID uniquely identifies and Amazon S3 object.
6. Each object can be addressed by a unique URL.

### Amazon S3 Operations

native interface and higher level interfaces

1. native interface
    - Bucket: Create, delete, **list keys in a bucket**
    - Object: Write, Read, delete an object

2. higher level interfaces
    - AWS Software Development Kits (SDKs)
    - AWS Command line interface (CLI)
    - AWS Management Console

### Durability

 Durability: Will my data still be there in the future? 99.999999999%. (9)

### Availability

Availability: Can I access my data right now? 99.99%.

### Data Consistency

Amazon s3 is an eventually consistent system, changes in data may take some time to propagate to replicated locations.

- Puts to the new object, all good, read-after-write consistence.
- Puts to existing objects, and DEKETES, may return stale data
- Updates to a single key are atomic. means, you get the new or old data, but never a mix.

### Access control

By default, it's secured. Only you have access.

Coarse-grained access control:
    - Amazon S3 Access Control Lists, ACLs: READ,
        - WRITE, or FULL-CONTROL at the object or bucket level.
        - Legacy mechanisim
        - best for: enabling bucket logging, or making a bucket that hosts a static website be world readable

Fine grained access controls
    - Amazon S3 bucket policies: can specify who can access that bucket, from where and during that time of day
    - AWS Identity and Access Management, IAM policies
    - query-string authentication

### Static Website Hosting

- It's a very common use case for Amazon S3 storage. Suitable for micro-sites.
- Static website means website contains only static content and don't need server-sie process.
- Advantages: fast, scalable, securer than a typical dynamic website

To host a static website:

1. Create a bucket with the same name as the desired website hostname
2. Upload the static fiels to the bucket
3. Make all the fiels public
4. Enable static website hosting for the bucket.
5. The website will be available at the S3 website, url: `<bucket-name>.s3-website-<AWS-region>.amazonaws.com`
6. Create a friendly DNS name in your own domain, using a DNS CNAME, or Amazon Route 53 alias that resolved to the url
7. The website will now be available at your website domain name.

Consider to use Amazon CloudFront distribution as a caching layer for best performance.

### Storage class

- Amazon S3 standard: frequently accessed data
- Amazon S3 Standard - Infrequent Access (Standard-IA):
  - designed for long-lived, less frequently accessed data.
  - Lower per GB-month cost.
  - minumum object size: 128K
  - minumum duration: 30 days
- Amazon S3 Reduced Redundancy Storage (RRS)
  - lower durability: 4 nines
  - reduced cost
  - good for derived data that can be easily repreduced, like image thumbnails
- Amazon Glacier
  - Low cost, curable
  - for rarely access data
  - accept a three-to-five hour retrieval time

### Object Lifecycle Management

Lifecycle configurations are attached to the bucket and can apply to all objects in the bucket, or objects specified by a prefix.

Data has natural lifecycle:
    - Hot, frequently accessed
    - Warm, less frequently access
    - Cold, long term backup or archive, eventual deletion

Reduce cost lifecycle rules:

1. Store backup data initially in Amazon S3 standard
2. After 30 days, transition to amazon Standard-IA
3. After 90 days, transition tot Amazon Glacier
4. After 3 years, delete

### Encryption

1. in flight: use Amazon S3 secure sockets layer, SSL API endpoints. ensures that data send to and from Amazon S3 is encrypted with HTTPS

2. At rest:Server-side Encryption, SSE:
    - SSE-S3, AWS handles keys  <- should use this for simplicity
    - SSE-KMS, Amazon handles your key mangement, you manage the keys <- should use this for simplicity
    - SSE-C, customer proviced keys

### Multipart Upload

Upload large objects as a set of parts,
better network utilization through parallel transfers
the ability to pause and resume
should use multipart upload for objects larger than 10M
must use for objects larger than 5G
Object lifecycle policy on a bucket tot abort incomplete uploads after a specified number of days.

### Amazon Glacier

- Extremely low-cost, durable, 11 Nines.
- designed for infrequently accessed data
  - data archiving, long term backup
  - archived for compliance purpose
- Data is stored in **archives**, each archive can contain up to 40TB. Automatically encrypted, cannot be modified if created.
- Vaults are containers for archives. Each AWS account ca nhave up to 1000 vaults.
- Cost: retrieve up to 5% of your data stored in Amazon Glacier is free each month, calculated on a daily prorated basis.

### Amazon S3 VS Glacier

1. S3 max object is 5TB. Glacier is 40TB.
2. S3 has user friendly key name. Glacier uses system generated archive ids.
3. S3 uses optional encryption. Glacier is auto encrypted.

## Amazon Elastic Compute Cloud, Amazon EC2

Amazon Ec2 provides resizable compute capacity in cloud.

Compute refers to the amount of computational power required to fullfill your workload.

Two concepts key to launching instances:

1. The acount of virtual hardware dedicated to the instance
2. The software loaded on the instance

### Instance Type

Instance type varies in the following dimensions;

- Virtual CPUs, vCPUs
- Memory
- Storage, size and type
- Network performance

Instance types are grouped into families.

- c4: Compute optimized: for workloads requiring significant processing
- r3: memory optimized: for memory-intensive workloads
- i2: Storage optimized: for workloads requiring high amounts of fast SSD storage
- g2: GPU-based instances: intented for graphics and general-purposed GPU compute workloads

### Amazon Machine Images, AMIs

The initial software that wil lbe on an isntance when it's launched.

- Operating system and its configuration
- the initial state of any patches
- Application or system software

Four sources of AMIs

1. published By aWS
2. The AWS Marketplace. two benefies:
    - The customer doesn not need to install the software
    - The license agreement is appropriate for the cloud
3. Generated from Exsiting Instances
4. Uploaded Virtual Servers

### Securely Using an instance

Addressing an instance

1. Public Domain Name System Name, DNS.
    - It's generated automatically and cannot be specified by the customer.
    - cannot transfer to another instance.

2. Public IP.
    - AWS reserved IP, cannot be spedified
    - cannot transfer to another instance

3. Elastic IP
    - associated with an Amazon EC3 isntance
    - It can be transferred toa replacement instance in the event of an instance failure
    - it's a public address that can be sharedexternally without coupling clients to the particular isntance.

### Virtual Firewall Protection

Security Groups, allow you control traffic based on port, protocal and source/destination.

By default, it doesn't allow any traffic that is not explicitly allowed by a security group rule.

### Instance Lifecycle

1. Launching
    1.1 Bootstrapping. You can pass in the OS a string named **UserData**.
    1.2 VM import/export
    1.3 Instance Metadata

2. Modifying an instance
    1. modify instance type. Instances can be resized
    2. Security groups
    3. Termination protection

### Price options

three price options:

1. On-Demand Instances
    - The most flexible pricing
    - requires no up-frount commitment
    - customer controls when to launch and terminate
    - for unpredictable workloads

2. Reserved Instances
    - for predictable workloads, can save up to 75% over on0demand hourly rate
    - two factors that determine the cost: the term commitment and payment

3. Spot instances
    - for workloads that are not time critical and are tolerant of interruption. Analytics, financial modeling, big data, media encoding, scientific computing, testing.
    - Spot isntances offer the greatest discount

### Tenancy options

1. Shared Tenancy: default model for all Amazon EC2.
2. Dedicated Instances, run on hardware that's decicated t oa single customer.
3. Dedicated Host: An Amazon EC2 Host

## References

- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558)
