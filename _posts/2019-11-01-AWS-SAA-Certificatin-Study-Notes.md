---
title: AWS SAA Certification Study Notes
search: true
tags: 
  - AWS
  - SAA Certificatin
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

AWS Certified Solutions Architect - Associate SAA-C03

Only a subset of services.
knowledge will be the architecture, how they work together,
how to achieve well performaing, scaleable, secure and cost effective designs.

## Key Concepts

### Durability and Availability

**Durability** addresses the question, “Will my data still be there in the future?”
**Availability** addresses the question, “Can I access my data right now?”

Amazon S3 is designed to provide both very high durability and very high availability for your data.

Amazon S3 standard storage is designed for 99.999999999% durability and 99.99% availability of objects over a given year.

### High availability VS Fault tolerance

- High availability:
  - hardware, software and configuration that allowing a system to recover quickly in the event of a failure.
  - The key part is the recover quickly.
  - It doesn't prevent a failure from occurring and it doesn't stop that failure from impacting customers.
  - The primary aim of high availability is to minimize downtime and recover quickly.
  - It aims to minimize downtime and recover quickly in the event of a failure.
  - E.g., for a car, if one tyre broken, we have a backup tyre, it may break down, but can be fix quickly

- Fault tolerance:
  - a system designed to operate through a failure with no user impact.
  - generally more expensive and more complex to achieve and do so reliably
  - E.g., a plane. If one engine down, plane can still operate normally

### RPO VS RTO

- RPO, recovery point objective
  - how much a business can tolerate to lose, expressed in time. The maximum time between a failure and the last successful backup.
  - E.g., you revoced backup data after data center exploded, you lost the mose recent 1 hour data before exploding.

- RTO, recovery time objective
  - The maximum amount of time a system can be down. How long a solution takes to recover.
  - E.g., website can be online again 1 hour after the data center exploded...

### Scaling

- Vertical: addign more resources to a server, e.g., add additional CPU. However, there is a limit. requires reboot of server.

- horizontal: add more machines. No size limitation. Done without outage. More complicated.

- Elasticity, elastic capacity: scale out and in a system, as demand requires. Help to achieve cost optimizatin and performance efficientcy.

## Amazon Services in SAA

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

## Amazon Simple Storage Service, Amazon S3

### Comman use cases for Amazon S3

1. Backup and archive for on-premises or cloud data
2. Content, media, and software storeage and distribution
3. Big data analytics
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

Amazon EFS provides a simple, scalable, elastic file system for Linux-based workloads for use with AWS Cloud services and onpremises resources.

It is designed to provide massively parallel shared access to thousands of Amazon EC2 instances, enabling your applications to achieve high levels of aggregate throughput and IOPS with consistent low latencies.

Amazon EFS is a regional service storing data within and across multiple Availability Zones (AZs) for high availability and durability.

### Buckets

1. Buckets are a simple flat structure. You can have multiple buckets, but cannot have a sub-bucket.
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
7. storage in a bucket does not need to be pre-allocated.

### Amazon S3 Operations

native interface and higher level interfaces

1. native interface
    - Bucket: Create, delete, **list keys in a bucket**
    - Object: Write, Read, delete an object

2. higher level interfaces
    - AWS Software Development Kits (SDKs)
    - AWS Command line interface (CLI)
    - AWS Management Console

### Amazon S3 Data Consistency

Amazon S3 is an eventually consistent system, changes in data may take some time to propagate to replicated locations.

Amazon S3 provides read-after-write consistency for PUTs to new objects (new key)
but eventual consistency for GETs and DELETEs of existing objects (existing key), so it may return stale data
Updates to a single key are atomic, you get the new or old data, but never a mix.

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

Amazon S3 offers a range of storage classes designed for various generic use cases: general purpose, infrequent access, and archive.

- **Amazon S3 Standard** offers high durability, high availability, low latency, and high performance object storage for general purpose use. It's for frequently accessed data.
- **Standard-IA**: Amazon S3 Standard - Infrequent Access
  - designed for long-lived, less frequently accessed data.
  - Lower per GB-month cost.
  - minumum object size: 128K
  - minumum duration: 30 days
  - per-GB retrieval costs
  - best for infrequently accessed data that is stored for longer than 30 days.
- **RSS**: Amazon S3 Reduced Redundancy Storage
  - lower durability: 4 nines
  - reduced cost
  - good for derived data that can be easily reproduced, such as image thumbnails.
- Amazon Glacier
  - Low cost, durable
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

### Amazon S3 Encryption

1. in flight: use Amazon S3 secure sockets layer, SSL API endpoints. ensures that data send to and from Amazon S3 is encrypted with HTTPS

2. At rest:Server-side Encryption, SSE:
    - SSE-S3, AWS handles keys  <- should use this for simplicity
    - SSE-KMS, Amazon handles your key mangement, you manage the keys <- should use this for simplicity
    - SSE-C, customer proviced keys

### Pre-Signed URLs

All Amazon S3 objects by default are private, meaning that only the owner has access.

The owner can share objects with others by creating a pre-signed URL, using their own security credentials to grant time-limited permission to download the objects.
To enable it, you must provide

1. your security credentials and
2. specify a bucket name,
3. an object key,
4. the HTTP method (GET to download the object),
5. and an expiration date and time.

This is particularly useful to protect against “content scraping” of web content such as media files stored in Amazon S3.

### Multipart Upload

Upload large objects as a set of parts,
better network utilization through parallel transfers
the ability to pause and resume
should use multipart upload for objects larger than 10M
must use for objects larger than 5G
Object lifecycle policy on a bucket tot abort incomplete uploads after a specified number of days.

### Cross-region replication

Asynchronously replicate to another region, includes metadata and ACLs.

To enable cross-region replication:

1. **versioning** must be turned on for both source and destination buckets,
2. you must use an IAM policy to give Amazon S3 permission to replicate objects on your behalf.

Commonly used to:

1. reduce the latency required to access objects in Amazon S3 by placing objects closer to a set of users
2. meet requirements to store backup data at a certain distance from the original source data.

A second region does not significantly increase durability.

### Logging

In order to track requests to your Amazon S3 bucket, you can enable Amazon S3 server access logs.
Logging is off by default.
When you enable logging for a bucket (the source bucket), you must choose where the logs will be stored (the target bucket)

A best practice: to specify a prefix, such as logs/ or yourbucketname/logs/, so that you can more easily identify your logs.

Logs include information such as:

- Requestor account and IP address
- Bucket name
- Request time
- Action (GET, PUT, LIST, and so forth)
- Response status or error code

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

### Key knowledge points

- Bucket names have to be globally unique
- Minumum of three and maximum of 63 characters - no uppercase or underscores
- Must start with a lowercase or number and can't be formatted as an IP address (1.1.1)
- Default 100 buckets per account, and hard 1,000 bucket limit via support request
- Unlimited object in buckets
- Unlimited total capacity for a bucket
- An object key is its name
- An object's value is its data
- An object size is from 0 to 5TB

## CloudFormation

It's an infrastructure as Code(IAC) product, you can create, manage, and remove infrastructure using JSON or YAML.

1. Template: A CFN template is JSON or YAML. It contains logical resources and configuration.
2. Stacks are created and modified based on templates, which can be changed and used to update a stack.
3. Stacks take logical resources from a template and create, update, or delete the physical resources in AWS.

A CloudFormation (CFN/cfn) template is used to initially create a CFN stack.
A stack creates, updates, and deletes physical AWS resources based on its logical resources, which are based on the contents of a template.

- A CFN template is written in JSON or YAML.
- A template can create up to 200 resources.
- If a stack is deleted, then, by default, any resources it has created are also deleted.
- A stack can be updated by uploading a new version of a template.
- New logical resources cause new physical resources.
- Removed logical resources cause the stack to delete physical resources.
- Changed logial resources update with some disruption or replace physical resources.

## Amazon Elastic Compute Cloud, Amazon EC2

- It's an Infrastructure-as-a-Service (IaaS) product
- EC2 is a core AWS product that provides virtual machines known as instances.
- Amazon EC2 provides resizable compute capacity in cloud.
- Compute refers to the amount of computational power required to fullfill your workload.

EC2 is ideal for:

- Monolithic applications
- Consistent, long-running compute scenarios
- Applications that require full OS/runtime installations
- Services, endpoints, and/or applications that require high availability

Two concepts key to launching instances:

1. The acount of virtual hardware dedicated to the instance
2. The software loaded on the instance

### Instance Types and Sizes

Instance type varies in the following dimensions;

- Virtual CPUs, vCPUs
- Memory
- Storage, size and type
- Network performance

Instance types are grouped into families.

- General Purpose
  - provide a balance of compute, memory and networking resources
  - ideal for applications that use these resources in equal proportions such as web servers and code repositories
  - Types: A, T, M
- Compute Optimized
  - ideal for compute bound applications that benefit from high performance processors
  - well suited for batch processing workloads, media transcoding, high performance web servers, high performance computing (HPC), scientific modeling, dedicated gaming servers and ad server engines, machine learning inference and other compute intensive applications.
  - Types: C
- Memory Optimized
  - designed to deliver fast performance for workloads that process large data sets in memory.
  - Types: R, X, z, High Memory
- Accelerated Computing
  - use hardware accelerators
  - to perform functions, such as floating point number calculations, graphics processing, or data pattern matching, more efficiently than is possible in software running on CPUs.
  - Types: P, Inf, G, F
- Storage Optimized
  - designed for workloads that require high, sequential read and write access to very large data sets on local storage
  - optimized to deliver tens of thousands of low-latency, random I/O operations per second (IOPS) to applications
  - Types: I, D, H

While changing the instance type,

1. Can only within the same instance type family,
2. you can change the Availability Zone.
3. You **cannot** change the operating system nor the instance type family.

### Amazon Machine Images, AMIs

AMIs are used to build instances.
They sotre snapshots of EBS volumes, permissions and a block device mapping, which configures how the instance OS sees the ttached volumes.
AMIs can be shared, free, or paid and can be copied to other AWS regions.

The initial software that will be on an instance when it's launched.

- Operating system and its configuration
- the initial state of any patches
- Application or system software

Four sources of AMIs

1. published By AWS
2. The AWS Marketplace. two benefies:
    - The customer doesn not need to install the software
    - The license agreement is appropriate for the cloud
3. Generated from Exsiting Instances
4. Uploaded Virtual Servers

While launching a new EC2 instance, You must specify

1. instance type, which defines the virtual hardware
2. AMI, which defines the initial software state.

### Securely Using an instance

Addressing an instance

1. Public Domain Name System Name, DNS.
    - It's generated automatically and cannot be specified by the customer.
    - cannot transfer to another instance.

2. Public IP.
    - AWS reserved IP, cannot be spedified
    - cannot transfer to another instance

3. Elastic IP
    - associated with an Amazon EC3 instance
    - It can be transferred toa replacement instance in the event of an instance failure
    - it's a public address that can be sharedexternally without coupling clients to the particular instance.

Connecting to a Linux instance using SSH:

The public half of the key pair is stored on the instance, and the private half can then be used to connect via SSH.

### EC2 Instance Roles

EC2 instance roles are IAM roles that can be "assumed" by EC2 using an intermediary called instance profile. An instance profile is either created automatically when using the console UI or manaully when using the CLI. It's a contianer for the role that is associated with an EC2 instance.

The instance profile allows applications on the EC2 instance to access the credentials from the role using the instance metadata.

### AWS CLI Credential Order

1. Command Line Options. It uses longer term credentials stored locally on the instance and is NOT RECOMMENDED for production environments.

2. Environment Variables. You can store values in the environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,and AWS_SESSION_TOKEN. Recommended for temporary use in non-production environments.

3. AWS CLI credentials file. `aws configure` This command creates a credentials file stored at `~/.aws/credentials` on Linux. This file can contian the credentials for the default profile and any named profiles. This approach uses longer term credentials stored locally on the instance and is NOT RECOMMENED for production environments.

4. Contianer Credentials. IAM roles associated with AWS Elastic Container Service (ECS) Task Definitions. Temporary credentials are available to the Task's contianers. This is recommened for ECS environments.

5. Instance Profile Credentials

IAM Roles associated with Amazon EC2 instances via instance Profiles. Temporary credentials are available to the Instance. This is recommended for EC2 environments.

### Virtual Firewall Protection

Security Groups, allow you control traffic based on port, protocal and source/destination.

By default, it doesn't allow any traffic that is not explicitly allowed by a security group rule.

### EC2 bootstrapping

Bootstrapping is a process where instructions are executed on an instane during its launch process.
Bootstrapping is used to configure the instance, perform software installatin, and add application configuration.

In EC2, user data can be used to run shell scripts or run clout-init directives.

### Instance Lifecycle

1. Launching
    1. Bootstrapping. You can pass in the OS a string named **UserData**.
    2. VM import/export
    3. Instance Metadata
        - Instance metadata is data relating to the instance that can be accessed from within the instance itself using a utility capable of accessing HTTP and using the URL: <http://169.254.169.254/latest/meta-data>
        - Instance metadata is a way that scripts and aplications running on EC2 can get visibility of data they would normaly need API calls for.
        - The metadata can provide the curent external IPv4 address for the instance, which isn't configured on the instance itself but provided by the internet gateway in the VPC. It provides the AZ the instance was launched in and the security groups applied to the instance.

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
    - for unpredictable workloads, traffic spikes, such as on the last day of the month.
    - good for temporary workloads, but don’t offer the cost savings of Spot Instances

2. Reserved Instances
    - for predictable workloads, can save up to 75% over on0demand hourly rate
    - two factors that determine the cost: the term commitment and payment
    - provide cost savings when you can commit to running instances full time, such as to handle the base traffic.

3. Spot instances
    - a very cost-effective way to address temporary compute needs that are not urgent and are tolerant of interruption.
    - E.g., analytics, financial modeling, big data, media encoding, scientific computing, testing.
    - Spot instances offer the greatest discount

### Networking

Benefits of Enhanced Networking:

1. More packets per second (PPS)
2. Lower latency
3. Less jitter

### Tenancy options

1. Shared Tenancy: default model for all Amazon EC2.
2. Dedicated Instances, run on hardware that's decicated to a single customer.
3. Dedicated Host: An Amazon EC2 Host

### Replacement Groups

- Cluster PG, for maximum performane, every instancecan talk to every other instance at the same time at full speed. Workswith enhanced networking for peek performance.
- Spread PG, for maximum availability. Each instance occupies a partition and has an isolated fault domain. Great for email servers, domain controllers, file servers, and application HA pairs.
- Partition PG: instances are separated into partitions (max of sever per AZ), each occupying isolated racks in AZs/regions. It minimize failure toa partiion and give you visibility on placement

### Amazon EC2 Instance Store

- temporary block-level storage for your EC2 instance.
- This storage is located on disks that are physically attached to the host computer.

Ideal for

- temporary storage of information that changes frequently, such as buffers, caches, scratch data
- other temporary content
- data that is replicated across a fleet of instances, such as a load-balanced pool of web servers.

## Amazon Elastic Block Store, Amazon EBS

Amazon EC2 Instance Stores are low-durability, high-IOPS storage that is included for free with the hourly cost of an instance. Data is lost when the instance stops.

Amazon EBS provides durable block storage for use with Amazon EC2 instance.

Amazon EBS is a storage service that creates and manages volumnes based on four underlying storage types.  Volumes are persistent, can be attached and removed from EC2 instances, and are replicated within a single AZ.

EBS supports a maximum per-instance throughput of 1,750MiB/s and 80,000 IOPS.
If you need more... use **Amazon EC2 Instance Store**.

### Amazon EBS Volumes Types

1. Mechanical: sc1, st1
    - sc1: low cost, infrequest access, cannot be boot volume
    - st1: low cost, throughput intensive, cannot be a boot volume
2. Solid State: gp2, io1
    - gp2: Default, balance of IOPS/MiB/s - burst pool IOPS per GB
    - io1: highest performance, can adjust size and IOPS seperately

Details:
<https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html>

- General Purpose (gp2): SSD,
  - default for most workloads
  - 3 IOPS/GiB (100 IOPS - 16,000IOPS)
  - Bursts up to 3,000 IOPS (credit based)
  - 1 GiB - 16 TiB size, max throughput p/vol of 250 MiB/s
- Provisioned IOPS SSD (io1): SSD
  - used for applications that require sustained IOPS performance
  - large database workloads
  - volume size of 4 GiB - 16 TiB up to 64,000 IOPS per volume
  - max throughput p/vol of 1,000 MiB/s
- Throughput Optimized (st1): HDD
  - Low storage cost
  - used for frequently accessed, throughput-intensive workloads (streaming, big data)
  - Cannot be a boot volume
  - Volume sized of 500 GiB - 15 TiB
  - Per-volume max throughput of 500 MiB/s and IOPS 500
- Cold HDD (sc1): HDD
  - lowest cost
  - infrequestly accessed data
  - cannot be a boot volume
  - Volume size of 500 GiB - 16 TiB
  - per-volume max throughput of 250 MiB/s and 250 IOPS

### EBS Snapshots

EBS volumes occupy a single Availability Zone (AZ), and while they do replicate within this AZ, this replication isn’t shared to other AZs. This makes EBS volumes vulnerable to AZ failure. EBS snapshots not only provide data backup capabilities but also enable you to move your data to other AZs and regions.

EBS snapshots are a point-in-time backup of an EBS volume stored in S3.
The initial snapshot is a full copy of the volume.
Future snapshots only store the data change since the last snapshot.

Snapshots can be used to create new volumes and a great way to move or copy instances between AZs.
When creating a snapshot of the root/boot volume of an instance or budy volume, it's recommended that instance is powered off, or disks are "flused".

Snapshots can be copied between regions, shared, and automated using Data Lifecycle Manager (DLM).

Volume encryption uses EC2 host hardware to encrypt data at rest and in transit between EBS and EC2 instances. Encryption generates a data encryption key (DEK) from a customer master key (CMK) in each region. A unique DEK encrypts each volume. Snapshots of that volume are encrypted with the same DEK, as are any volumes created from that snapshot.

### Protecting Data

You back up data by taking snapshots. it's incremental backups, only most recent changed blocks are saved. There is no delay in processing when commencing a snapshot.

You recover data by detach the volume from the failed instance and attach the backed up one.

You can create a volume from a snapshot. The volume is created immediately but the data is loaded lazily. This means that the volume can be accessed upon creation, and if the data being requested has not yet been restored, it will be restored upon first request.

Best practice is to initialize a volume created from a snapshot by accessing all the blocks in the volume.

### EC2 Security Groups

Security groups are an essential part of the EC2 and VPC security toolset. They operate like a virtual firewall, controlling traffic originating from or destined for a network interface (or an instance).

Security Groups each have inbound rules and outbound rules. A rule allows traffic to or from a source (IP, network, named AWS entity) and protocol.

Security groups have a hidden implicit/default deny rule but cannot explicitly deny traffic.

They're stateful - meaning for any traffic allowed in/out, the return traffic is aotumatically allowed. Security groups can reference AWS resources, other security groups, and even themselves.

## Serverless Compute

A microservices architecture is the inverse of a monolithis architecture. Instead of having all system functions in one codebase, components are separated into microservices and operate independently. A microservice does one thing - and does it well. Operations, updates, and scaling can be done on a per-microservice basis.

When using an **event-driven architecture**, a system operates around "events" that represent an action or a change of state, e.g., a button being clicked, a file being uploaded, or a temperature dropping below a certain level. it's efficient because events are generated and pushed, rather than things being polled. Polling requires always-on compute and doesn't scale well.

### Baas VS Faas VS AWS Lambda

Serverless architecture consists of two main principles, including Baas and Faas.

1. Baas, Backend as a Service, using 3rd party services where possible rather than running your own. Examples include Auth0 or Cognito for authentication and Firebase or DynamoDB for data storage.

2. Faas, Function as a Service, using an event-driven architecture  to provide application logic. These functions are only active (invoked) when they are needed (when an event is received)
    - Lambda is a Faas product. Functions are code, which run in a runtime. Functions are invoked by events, perform actions for up to 15 minutes, and terminate. Functions are also stateless - each run is clean.

### Amazon API Gateway

- It's a managed service.
- It allows the creation, management, and optimization of highly scalable API endpoints.
- API Gateway is a key component of serverless architectures in AWS.

API Gateway can use other AWS services for compute (Faas/Iaas) as well as to store and recall data.

Amazon API Gateway handles all the tasks involved in accepting and processing up to hundreds of thousands of concurrent API calls, including traﬃc management, authorization and access control, monitoring, and API version management.

### AWS Step Fuctions

It's a serverless visual workflow service that provices state machines.
A state machine can orchestrate other AWS services with simple logic, branching, and parallel execution, and it maintains a state.
Workflow steps are known as states, and they can perform work via tasks.
A state machine can be defined using Amazon States language (ASL).
With Stap Functions, lambda functions could only run for 15 minutes. lambda functions are stateless. State machiens maintain state and allow longer-running processes. Step Functions "replaces" SWF with a serverless version.

## Amazon ECS, Elastic Container Service

A container is a package that contains an application, libraries and file system required to run it. Contianers run on a container engine which generally runs within a single OS sunch as Linux. Containers provide the isolation benefits of virtualisation - but are more lightweight allowing faster starts and more dense packing within a host.

An image is a collection of file system layers. Docker file system are differential - each layer stores differeces from previous layers.

A populat contianer enginer is Docker and is the basis for ECS.

Elastic Container Service (ECS) is a managed container solution. It can operate in either EC2 mode or Fargate mode.

1. in which EC2 instances running as Docker hosts are visible in your account,
2. in Fargate mode, in which AWS manages the container hosts.

Details:

- **Cluster**: A logical collection of ECS resources - either ECS EC2 instances or a logical representation of managed Fargate infrastructure.
- **Task Definition**: Defines your application. Similar to a Dockerfile but for running containers in ECS. Can contain multiple containers.
- **Container Definition**: Inside a Task Definition a contianer definition defines the individual containers a Task uses. It controls the CPU and MEMORY each container has, in addition to port mappings for the contianer.
- **Task**: A single running copy of any contianers defined by a task definition. One working copy of an application e.g. DB and WEB contianers.
- **Service**: Services allow task definitions to be scaled by adding additional tasks. Defines Minimum and Maximum values.
- **Registry**: Storage for container images... i.e., ECS Container Registry or Dockerhub. Used to download image to create containers.

## Amazon Virtual Private Cloud, Amazon VPC

### Sever Layer OSI Model

It provides a good overview of how networking works at all levels of abstraction.  Each layer uses the layers below and adds additional capabilities. Data between two devices moves down the stack at the A side (and wrapped at each layer) ... is transmitted .. before moving up the stack at the B side (and the wrapping stripped at each stage). This process is called encapsulation.

![IMAGE](quiver-image-url/4F30ED3FA24FFDA1F05261CD507F8225.jpg =621x559)

1. L1, uses a shared medium Hardware can transmit and listen. The layer 1 standard agrees how to transmit and recieve. The medium, the voltages, the RF details
2. L2, Data Link, addes MAC Address which can be used for named communication between two devices on a local network. Additionally L2 adds controls over the media, avoiding cross-talk and allows for backoff and retransmission. L2 communications use L1 to broadcast and listen. Le runs on top of L1.
3. L3, The Network layer, allows for unique devide to device communication over interconnected networks. L3 devices can pass packets over 10's or even 100's of L2 networks. The packets remain largely unchanged during this journey -travelling within different L2 frames as they passover different networks.
    - A client Machine Generates a l3 Packet with its IP as the sourceIP and the destinationIP of the server.
    - The packet is encapsulated and un-encapsulated in a l2 frame at each step, passing between routers, orver networks.
    - The original packet is received by the server, acted on, and a reply sent back in the same way.
    - L3 allows for an IP to communicate with another IP - but only a single stream, so one conversation between the two
4. L4, Transport adds TCP and UDP.
    - Tcp is desinged for reliable transport. It uses segments to ensure data is recieved in the correct order, adds error checking and ports allowing different streams of communicatins to the same host, e.g., tcp/22 and tcp/80
    - UDP is aimed at speed.
5. L5, Session adds the concept of sessions, so that request and reply communication streams are viewed as a single session of communication between client and server
6. L6, Presentation adds data conversion, envryption, compression and standards which L7 can use.
7. L7, Application is where protocols such as HTTP, SSH, FTP are added. E.g., HTTP (L7) running over TLS (L6) is HTTPS.

### IP V4 Address

IPv4 addressess are how to devices can communicate at layer 4 and above of the OSI 7-layer model. IP Address are actually 32-bit binary values.. but are represented in dotted-decimal notation to make them easier for humans to read and understand.

IPs (IP Address) are split into a Network part and a Node or Host Part. The netmask (e.g., 255.255.255.0) or prefix (e.g., /24) shows where this split occurs.

Within the IPv4 address space (0.0.0.0 to 255.255.255.255) there are certain addrewsses which are reserved, or special in some way:

- 0.0.0.0&0.0.0.0/0: represents all IP Addresses
- 255.255.255.255: IP Address used to broadcast to all IP addresses everywhere ( this is generally filtered and not passed betweeen networks)
- 127.0.0.1: localhost. Whatever the IP address of the device you're using, it can be referenced by itself as 127.0.0.1. So a local web server can be found with 127.0.0.1:80
- 169.254.0.1 to 169.254.255.254: A range of IP addresses which a device can auto confiture with if its using DHCP and fails to automatically get an IP from a DHCP server.

Historically IP Addresses were split into classes: (including)

1. Class A (/8): 1.0.0.0 to 126.255.255.255. 126 Net works, 16,777,217 Nodes in each.
2. Class B (/16): 128.0.0.0.0 to 191.255.255.255. 16,382 Networks, 65,534 Nodes in each.
3. Class C (/24): 192.0.0.0 to 233.255.255.255. 2,097,150 networks, 254 Nodes in each.

Class A networks were initially allocated to large organisations. Class B to medium and Class C to small businesses. As the supply of IPv4 addresses became low, the class system of IPs were related with CIDR.

IP Classes have a number of ranges within  then used for private networking only:

- 10.0.0.0 to 10.255.255.255 private networking within the Class A range.
- 172.16.0.0 to 172.31.255.255 private networking within the Class B range 916 class B networks)
- 192.168.0.0 to 192.168.255.255 private networking within the Class C range 9256 Class C networks)
There ranges are often used on private business networks, cloud networks and home networks.

**CIDR**, Classless Inter-Domain Routing is used for IPv4 IP Networking rather than the Class system. It allows more effective allocation and sub networking.

Either you are allocated a network range to use, or you decided on it. It will be represented as network/prefix, e.g., 10.0.0.0/16.

The network address is your starting point. The prefix is the number of bits the network uses, the remaining bits, the node part is yours to use. The node (or host) partis yours from all 0's to all 1's.

![IMAGE](quiver-image-url/363B0AE9D6E1A45C579F75A61020F6AA.jpg =635x422)

### Subnetting

Subnetting is the process of breaking a network down into smaller sub-networks. You might be allocated a public range for your business, or decided on a privte range for a VPC. Subnetting allows you to break it into smaller allocations for use in smaller networks, e.g., VPC subnets.

If you pick 10.0.0.0/16 for your VPC. It's a single network from 10.0.0.0 to 10.0.255.255 and offers 65,536 addresses. That VPC could have a single subnet within it also 10.0.0.0/16.

With a certain size of VPC, increasing the prefix creates 2 smaller sized networks. Increasing again, creates 4 even smaller networks. Increasing again creates 8 even smaller and so on.

For instance:

10.0.0.0/60
    - 10.0.0.0/17
        - 10.0.0.0/18
        - 10.0.64.0/18
    - 10.0.128.0/17 <-- 128 = 256/2
        - 10.0.128.0/18
        - 10.0.192.0/18

### IP Routering

Local device-to-device communication takes place using L1 (phycial) and L2 (Datalink) using Mac Addresses and Physical 0's and 1's. This doesn't scale across LANs and so a methid of network-to-network transit is needed. Here comes IP Routing.
IP routing is the process required to get a layer 3 packet from source to destination. It uses a series of layer 2 hops between routers to create a single layer 3 path. The method used depends on if the two devices are local, in a known remote network or and an unknown network.

Local network communication
Known remote network
Unknown remote network

Local network communication

IP-to-IP communications which occurs locally doesn't use a router. ARP is used to find the mac address for the destination IP address. The IP packet is created at L3, passed to L2 where its encapsulated inside an ethernet (L2) frame. The frame is sent to the destination MAC address. Once recieved that L2 frame is removed and the IP packet passed to L3.

Known remote network

If Instance A wants to communicate with instance B, it can use it's IP and subnet mask to determin if B is local. If its not, the following process occurs:

1. A generates a L3 packets, the SRC is the IP A, the DST si the IP B
2. A knows its default gateway (Router) IP, so it used ARP to fidn the Rotuer MAC.
3. A passes the L3 packet to the L2, wraps it in a L2 frame and sends this to the R-MAC address (not the mac address of B)
4. R recieves this, strips away the layer 2 Frame, and checks the DST IP.
5. It knows the network of IP B because its connected to it.
6. R uses ARP to find the MAC of B, generates a frame to B, puts the unaltered IP packet inside and sends to MAC B.
7. B recieves the frame, strips it away and passes the packet to L3.
At scale, unchagned packets being passed around from router to router, each time usign a new L2 conenction.

### Firewall

A firewall is a device which historically sits at the border between differenct networks, and monitors traffic flowing between them. A firewall is capable of reading packet data and either allowing of denying traffic based on that data.

Firewall establish a barrier between networks of differenct security levels and historically have been the first line of defence against perimeter attacks.

Waht data a firewall can read and act on depends on the OSI Layer the firewall operates at:

- Layer 3, Network: source/destination IP address or ranges
- Layer 4, Transport: Protocal (TCP/UDP) & port nubmers
- Layer 5, Session: As Layer 4, but understand response traffic
- Layer 7, application: Application specifics, e.g., HTMl paths, images

### Amazon VPC basic

- a custom-defined virtual network within the AWS Cloud.
- Amazon VPC lets organizations provision a logically isolated section of the AWS Cloud where they can launch AWS resources in a virtual network that they define.
It's the networking layer for Amazon EC2, and it allows you to build your own virtual network within AWS.
- A private network within AWS. It's your private data center inside the AWS platform.
- Can be configured to be public/private or a mixture
- Regional (Cannot span regions), highly available, and can be connected to your data center and corporate networks
- Isolated from other VPCs by default
- VPC and subnet: max/16 (65,536 IPs) and minimum /28 (16 Ips)
- VPC subnets cannot span AZs (1:1 mapping)
- Certain IPs are reserved in subnets

Region default VPC:

- Requried for some servcies, used as default for most
- Pre-configured with all required networking/security
- A /20 public subnet in each AZ, allocating a public IP by default
- Attached internet gateway with a "main" route table sending all IPv4 traffic to the internet gateway using a 0.0.0.0/0 route
- A default DHCP option set attached
- SG: default - all from itself, all outbound
- NACL: Default - allow all inbound and outbound

Custom VPC:

- Can be desined an configured in any valid way
- You need to allocate IP ranges, create subnets, and provision gateways and networking, as well as design and implement security
- When you need multiple tiers or a more complex set of networking
- Best practice is to not use default for most production things

VPC Routing:

- Every VPC has a virtual routing device called the VPC router
- It has an iterface in any VPC subnet known as the "subnet + 1" address, for 10.0.1.0/24, this would be 10.0.1.1/32
- The router is highly available, scalable, and controls data entering and leaving the VPC and its subnets.
- Each VPC has a "main" route table, which is allocated to all subnets in the VPC by default. A subnet must have one route table.
- Additional "custom" route tables can be created and associated with subnets, but only one route table (RT) per subnet.
- A route table controls what the VPC router does with traffic leaving a subnet.
- An internet gateway is created and attached to a VPC (1:1). It can route traffic for public IPs to and from the internet.

Routes:

- A RT is a colelction of routers that are used when traffic fro ma subnet arrives at the VPC router.
- Every route table has a local route, which matches  the CIDR of the VPC and lets traffic be routed between subnets.
- A route cotnians a destination and a target. Traffic is forwared to the target if its destination matches the route destination.
- If nultiple routes apply, the most specific is chosen. A /32 is chose before a /24, before a /16.
- Default routes (0.0.0.0/0 v4 and ::/0 v6) can be added that match any traffic not already matched.
- Targets can be IPs or AWS networking gateways/objects
- A subnet is a public subnet if it's
- configured to allocate public IPs
- if the VPC has an associated internet gateway
- if that subnet has a default route to that internet gateway.

### Bastion Hosts, or Jumpboxes

- A host that sits at the perimeter of a VPC
- It functions as an entry point to the VPC for trusted admins.
- Allows for updates or configuration tweaks remotely while allowing the VPC to stay private and protected
- Generally connected to via SSH or RDP
- Bastion hosts must be kept updated, and security hardened and audited regularly
- Multifactor authentication, ID federation, and/or IP blocks.

### NAT, Network address translation

NAT (network address translation) is a process where the source or destination attributes of an IP packet are changed.

- NAT instance: It's a customer-managed instances.
- NAT getway: an AWS-managed service.

- Static NAT: A private IP is mapped to a public IP (what IGWs do). the process of 1:1 translation where an internet gateway converts a private address to a public IP address.
- Dynamic NAT: A range of private addresses are mapped onto one or more public (used by your home router and NAT gateways). Dynamic NAT is a variation that allows many private IP addresses to get outgoing internet access using a smaller number of public IPs (generally one). Dynamic NAT is provided within AWS using a NAT gateway that allows private subnets in an AWS VPC to access the internet.

### Security Group

It's avirtual stateful firewall that controls inbound and outbound traffic to Amazon EC2 instances.
You can specify allow rules, but not deny rules. This is an important difference between security groups and ACLs.

Default security group:

- allows communication between all resources within the security group,
- allows all outbound traffic, and
- no inbound traffic is allowed until you add inbound rules to the security group.
- denies all other traffic.

### NACLs, Network Access Control List

It's another layer of security that acts as a stateless firewall on a subnet level.

- NACLs operate at layer 4 of the OSI model (TCP/UDP and below).
- A subnet has to be associated with a NACL - either the VPC default or a custom NACL
- NACLs only impact traffic crossing the boundary of a subnet.
- NACLs are collections of rules that can explicitly **allow** or **deny** traffic based on its protocaol, port range, and source/destination
- Rules are processed in number order, lowest first. When a match is found, that action is taken and processing stops.
- The `*` rule is processed last and is an implicit deny.
- NACLs have two sets of rules: **inbound** and **outbound**.

Security Group VS. ACLS

|Security Group|Network ACLs|
|-- |-- |
|Operates at the instance level (first layer of defense)|Operates at the subnet level (second layer of defense)|
|Supports allow rules only|Supports allow rules and deny rules|
|Stateful: Return traffic is automatically allowed, regardless of any rules|Stateless: Return traffic must be explicitly allowed by rules.|
|AWS evaluates all rules before deciding whether to allow traffic|AWS processes rules in number order when deciding whether to allow traffic.|
|Applied selectively to individual instances|Automatically applied to all instances in the associated subnets; this is a backup layer of defense, so you don’t have to rely on someone specifying the security group.|

Ephemeral Ports:

- When a client initiates communications with a server, its to a well-known port number (e.g., tcp/443) on that server.
- The response is from that well-known port to an ephemeral port on the client. The client decides the port.
- NACLs are stateless, they have to consider both initiating and response traffic - state is a session-layer concept.

### Amazon VPC Components

1. Subnets
2. Route tables
3. Dynamic Host Configuration Protocal (DHCP) option sets
4. Security groups
5. Network Access Control List (ACLs)

Optional components:

- internet Gateways, IGWs
- Elastic IP addresses, EIP
- Elastic Network interfaces, ENIs
- Endpoints
- Peering
- Network Address Translation instances, NATs, and NAT Gateways
- Virtual Private Gateway, VPG, Customer Gateways, CGWs, and Virtual private Networks, VPNs

### VPC Subnets

It's a segment of an Amazon VPC's IP address range where you can place groups of isolated resources.
Subnets are defined by CIDR blocks, are cotnained within an Availability zone.
The smallest subnet that you can create is a /28 (16 IP addresses).

Can be public, private or VPN-only.

1. public: the associated route table directs the subnet's traffic to  the amazon VPC's IGW.
2. private: the associated route table doesn't direct the subnet's traffic to the Amazon VPC's IGW
3. VPN-only: the associated route table directs the subnet's traffic to the Amazon VPC's VPG and doesn't have a route to the IGW.

### Rotue table

- A logical construct within an Amazon VPC that contians a set of rules (called routes)that are applied to the subnet and used to determine where network traffic is directed.
- You can use route tables to specify which subnets are public, which are private.
- The router also enables subnets, IGWs and VPGs to communicate with each other.

### IGW, Internet Gateways

It's horizontally scaled, redundant and highly available Amazon vPC component that allows communication between instances in your Amazon VPC and the Inernet.

An IGW provides a target in your Amazon VPC route tables for Internet-routeable traffic, and it performs network address translation for instances that have been assigned public IP address.

You may only have one IGW for each Amazon VPC.

To create a public subnet with Internet access:

1. Attache an IGW to your Amazon VPC
2. Create a subnet route table rule to send all non-local traffic(0.0.0.0/0) to the IGW
3. Configure your network ACLs and security group rules to allow relevant traffic to flow to and from your instance

To enable an Amazon EC2 instance to send and receive traffic from the Internet:

- Assign a public IP address or EIP address

### DHCP, Dynamic Host Configuration Protocol

Allows ytou to direct Amazon EC2 host name assignment to your own resources.

A DHCP **option set** allows customers to

- define DNS servers for DNS name resolution,
- establish domain names for instances within an Amazon VPC,
- define NTP servers,
- and define the NetBIOS name servers.

### EIP, Elastic IP Addresses

A static, public IP address in the pool for the region that you can allocate to your account and release.

It allows you to maintain a set of IP addresses that remain fixed while the underlying infrastructure may change over time.

### VPC peering

VPC peering is a feature that allows isolated VPCs to be connected at layer 3. VPC peering uses a peering connection, which is a gateway object linking two VPCs.

- Allows direct communication between VPCs.
- Services can communicate using private IPs from VPC to VPC.
- VPC peers can span AWS accounts and even regions (with limitations)
- Dat is encrypted and transits via the AWS global backbone.
- VPC peers are used to link two VPCs at layer3: company mergers, shared servcies, companyand vendor, auditing

Important Limits and considerations

- VPC CIDR blocks cannot overlap
- VPC peers connect two VPCs - routing is not ransitive
- Routes are required at both sides (remote CIDR -> peer connection)
- NACLs and SGs can be used to control access
- SGs can be referenced but not cross-region
- IPv6 support is not available cross-region.
- DNS resolution to private IPs ca nbe enabled, but it's a setting needed at both sides.

### VPC Endpoints

VPC Endpoints are gateway objects created within a VPC. They can be used to connect to AWS public services without the need for the VPC to have an attached internet gateway and be public.

VPC Endpoint Types:

- Gateway endpoints: Can be used for DynamoDB and S3
- Interface endpoints: can be used for everything else (e.g., SNS, SQS)

When to use a VPC Endpoint:

- If the entire VPC is private eith no IGW
- If a specific instance has no public IP/NATGW and needs to access public services
- To access resources restricted to specific VPCs or endpoints (private S3 bucket)

Limitations and Considerations

- Gateway endpoints are used via route table entries - they're gateway devices. Prefix lists for a service are used in the destination field with the gateway as the target.
- Gateway endpoints can be restricted via policies.
- Gateway endpoints are HA across AZs in a region.
- Interface endpoints are interfaces in a specific subnet. for HA, you need to add multiple interfaces - one per AZ.
- Interface endpoitns are controlled via SGs on that interface. NACLs also impact traffic.
- Interface endpoints and replace the DNS for the service - no route table updates are requried.
- Code chagnes to use the endpoint DNS, or enable private DNS to override the default service DNS.

### VPG & CGW

- A VPG is the Amazon side of a VPN connection.
- A CGW is the customer side of a VPN connection
- The VPN connection must be initiated from the CGW side, and the connection consists of two IPSec tunnels.
- IPsec is the security protocol supported by Amazon VPC.

### IPv6

IPv6 is the next generation of IP available within AWS. It's not fully supported across all AWS services, and it isn't enabled by default.

IPv6 VPC Setup:

- It's currently opt-in - it's desabled by default
- To use it, the first step is to request an IPv6 allocatin. Each VPC is allocated a `/56` CIDR from the AWS pool - this cannot be adjusted.
- Within the VPC IPv6 range allocated, subnets can be allocated a `/64` CIDR from within the `/56` range
- Resources launched into a subnet with an IPv6 range can be allocated a IPv6 address via DHCP6.

Limitations and Considerations:

- DNS names are not allocated to IPv6 addresses.
- IPv6 addresses are all public routable - there is no concept of private vs. public wiht IPv6 (unlike IPv4 addresses)
- With IPv6, the OS is confired with this public address via DHCP6.
- Elastic IPs aren't relevant with IPv6.
- Not currently supported for VPCs, customer gateways and VPC endpoints.

### IPv6 Egress-Only Gateway

Egress-only internet gateways provide **outgoing-only** (and response) access for an IPv6-enabled VPC resource.

NAT gateways provide two functions for IPv4 resources:

1. Sharing a single public IP address for private resources
2. Outgoing-only access

NAT as a process isn't needed for IPv6 because all addresses are public. Egress-only gateways provide this outgoing-only access that NAT gateways provide, without the incompatible elements of functionality.

Architecturally, they're otherwise the same as an IGW.


## Amazon Route 53

It's a highly available and scalable cloud DNS web service to route end users to Internet applications.

three main functions:

1. Domain registration.
    It **isn’t required** to use Amazon Route 53 as your DNS service or to configure health checking for your resources.

2. DNS service: translates friendly domain names into IP address.
  
    - with Amazon Route 53 Domain: automatically configured as the DNS service for the domain, and a hosted zone will be created for your domain. You add resource record sets to the hosted zone, which define how you want Amazon Route 53 to respond to DNS queries for your domain.
  
    - with another domain registrar: You can transfer DNS service to Amazon Route 53, with or without transferring registration for the domain

3. Health checking

    - Health checks and DNS failover are major tools in the Amazon Route 53 feature set that help make your application highly available and resilient to failures.
    - Amazon Route 53 health checks are not triggered by DNS queries; they are run periodically by AWS, and results are published to all DNS servers.

### Amazon Route 53 basic

DNS Terms

- DNS Root Servers: Trust starts somewhere. The DNS root servers are that trust - a group of servers that are authoriative to give answers about the root zone. TLDs are controlled by the root zone.
- Top-Level Domain (TLD0: The top tier in the DNS hierarchy. Generally structured into geographic codes - such as `.au`, `.us`, `.uk` - and generic TKDs - such as `.com`. `.org` and `.edu`. large orgs or country orgs are delegated control of these by the root servers to be authoritative.
- Subdomain: Anyting between a host and a TLD is a subdomain. Anorganization is delegated control of subdomains and is authoritative.
- Zone and Zone File: A zone or zone file is a mapping of OPs and hosts for a given subdomain. The zone file for linuxacademy.com would contrain a record for www.
- Records: DNS has lots of record tyes - A, MZ, AAAA, CNAME. TXT, NS
- Name Server: A name server is a server that runs a DNS service and can either store or cache information for the DNS platform. Whether a name server caches or acts as an authority depends on if it's referenced from a higher level.
- Authoritative:
- The root servers are authoritative for the root zone - they are trusted by every operating system and networking stack globally. The root servers delegate ownership of a part of the hierarchy, such as `.com`, to an organization. That organization runs name servers that become authoritative - they can answer queries with authority. Because the root points at these servers, they are authoritative. These `.com` name servers can point at servers for sub domains that then become authoritative.
- Hosts: A record in a zone file
- FQDN: Fully qualified domain name - the host and domains: www.linuxacademy.com

DNS Flow

use `linuxacademy.com` as an example. The domain name system (DNS) does many things, but the common use case is  to turn DNS names into IP address - like turning linuxcademay.com into `52.86.183.13`. It's a distributed system - no one part knows all.

1. Step 1: Query your ISP. If it doesn't know, it handles it for ou.
2. Step 2: The ISP queries the DNS root servers. If they don't know, they help by providing servers authoritative for `.com`.
3. Step 3: The `.com` servers are queried. If they don't have an IP, they provide the linuxacademy.com authoritative servers.
4. Step 4: These servers are run by LA. They will know and return one of more IPs.

Registering a domain with DNS in Route 53

1. Step 1: Check the domain is available.
2. Step 2: Purchase the domain via a registrar
3. Step 3: hosting the domain.
4. Step 4: Records in the zone file:

DNS zones

A zone or hsoted zone is a container for DNS records relating to a particular domain. Route 53 supports public hosted zones, which influence the domain that is visible from the internet and VPCs. Private hosted zones are similar but accessible only from the VPCs they're associated with.

Public Zones

- a public hosted zone is created when you register a domain with Route 53, when you transfer a domain into Route 53, or if you created on manually
- a hosted zone has the same name as the domain it relates to - e.g., linuxacademy.com will have a hosted zone called linuxacademy.com
- a public zone is accessible either from internet-based DNS clients or from with any AWS VPCs.
- A hosted zone will have "name servers" - these are the IP addresses you can give to a domain operator, so Route 53 becomes "authoritative" for a domain.

Private Zones;

- Private zones are created manually and associated with one or more VPCs - they're only accessible from those VPCs.
- pribate zones need `enableDnsHostnames` and `enableDnsSupport` enabled on a VPC.
- Not all route 53 features supported - limits on healthchecks
- **split-view DNS **is supported, suign the same zone name for public and private zones - providing VPC resources with differenct records, e.g., testing ,internal versions of websites. With split view, private is preferred, if no matches, public is used.

DNS Record Set Types

- A Record (and AAAA): for a given host (wwww), an A record provides an IPv4 address and an AAAA provides an IPv6 address.
- CNAME Record: allows aliases to be created 9not the same as alias record). A machine might have CNAMES for `www`, `ftp` and images. Each of these CNAMEs oints at an existing record in the domain. CNAMES cannot be used at the APEX of a domain.
- MX Record: it provides the mail servers for a given domain. Each MX record has a priority. Remote mail server use this to locate the server to use when sending emails.
- NS Record: used to set the authoritative servers for a subdomain.
- TXT record: used for descriptive text in a domain - often used to verify domain ownership
- Alias Records: An extension of CNAME. Can refer to AWS logical services (load balancers, S3 buckets) and AWS doesn't charge for queries of alias records against AWS resources.

### Route 53 Health Checks

It's used to influence route 53 routing decisions.

- health checks that monitor the health of an endpoint - e.g., IP address or hostname
- health checks that monitor the health of another health check (calculated health checks)
- health checks that monitor CloudWatch alarms - you might want to consider something unhealthy if your DynamoDB table is experiencing performance issues.

Route 53 health Checkers:

- Global health check system that checks an endpoint in an agreed way with an agreed frequency.
- **>18%** of checks report healthy = healthy, **<18%** health = unhealthy

Types

- Http, https: connection check in less than four seconds. Report 2xx or 3xx code within 2 seconds.
- TCP: connection within 10 seconds
- Http/s with string match: all the checksas with Http/s but the body is checked for a string match

Route 53 and Health Checks

- Records can be linked to health checks. If the check is unhealthy, the record isn't used.
- Can be used to do failover and other routing architectures.

#### routing policies

- Simple: Most commonly used when you have a single resource that performs a given function for your domain.
- Weighted: When you want to route a percentage of your traffic to one particular resource or resources.
- Latency-Based—Used to route your traffic based on the lowest latency so that your users get the fastest response times
- Latency-based routing allows you to route your traffic based on the lowest network latency for your end user (for example, using the AWS region that will give them the fastest response time). Use it when:
  - you have resources that perform the same function in multiple AWS Availability Zones
  - regions and you want Amazon Route 53 to respond to DNS queries using the resources that provide the best latency.
- Geolocation routing lets you choose where Amazon Route 53 will send your traffic based on the geographic location of your users. Geolocation works by mapping IP addresses to locations. It uses geolocation routing to restrict distribution of content to only the locations in which you have distribution rights.

## ELB, Amazon CloudWatch, Auto Scaling

ELB, Amazon CloudWatch and Auto Scaling allows you to maintain the availability of your Applications by scaling Amazon EC2 capacity up or down in accordance with conditions you set.

### Elastic Loading Balancing

ELB is a highly available service that distributes traffic across Amazon EC2 instances and includes options that provide flexibility and control of incoming requests to Amazon EC2 instances.

It can handle the varying load of your application traffic in a single Availability Zone or across multiple Availability Zones.

Types of Load Balancers

1. **Application Load Balancer**
    - is best suited for load balancing of HTTP and HTTPS traffic and provides advanced request routing targeted at the delivery of modern application architectures, including microservices and containers.
    - Operating at the individual request level (Layer 7), Application Load Balancer routes traffic to targets within Amazon Virtual Private Cloud (Amazon VPC) based on the content of the request.
2. **Network Load Balancer**
    - is best suited for load balancing of TCP traffic where extreme performance is required.
    - Operating at the connection level (Layer 4), Network Load Balancer routes traffic to targets within Amazon Virtual Private Cloud (Amazon VPC) and is capable of handling millions of requests per second while maintaining ultra-low latencies.
    - Network Load Balancer is also optimized to handle sudden and volatile traffic patterns.
3. **Classic Load Balancer**
    - It provides basic load balancing across multiple Amazon EC2 instances and operates at both the request level and connection level.
    - Classic Load Balancer is intended for applications that were built within the EC2-Classic network.

Configuring Elastic Load Balancing

- **Idle Connection Timeout**: for each request that a client makes through a load balancer, the load balancer maintains two connection. One is with the client and the other is to the backend. By default, the timeout is 60 seconds for both connection.

- **Cross-Zone load Balancing**: it's recommended t hat you maintain approximately equivalent numbers of instancesin each Availibility Zone for higher fault tolerance.

- **Connection Draining**: Enable it to ensure that the load balancer stops sending requests to instances that are deregistering or unhealthy, while keeping the existing connections open.

- **Procy Protocol**: Enable it, a human readable header is added tothe request header with connection information.

- **Sticky Sessions**: It enables loading balander tot cind a user'ssession to a specific instance, and insures that all requests fro mthe user during the session are snet to the same instance.

- **Health Checks**: The status of the instances that are healthy at the time of the health check is inServcie, otherwise is outOfService. A health check is a ping, a conenction attempt, or a page that is checked periodically.

### Amazon CloudWatch

It is a monitoring service.
It monitors AWS resources and applications in real time.
It allows organizations to collect and track metrics, collect and monitor log files, and set alarms, and make changes to the resources being monitored based on rules you define.

Types:

1. Basic monitorning. It sends data points to Amazon CloudWatch **every five minutes** for a limited number of preselected metrics at no charge. Default option.
2. Detaild monitorning. It sends data points to Amazon CloudWatch **every minutes** and allows data aggregation for an additional charge. Need to enable it manually.

Amazon CloudWatch metrics can be retrieved by performaing a GET request.

Amazon CloudWatch Logs can be used to monitor, store and acsess log files from Amazon EC2 instances, aWS CloudTrail, and other sources.

Each AWS account is limited to 5,000 alarms per AWS account, and metrics data is retained for two weeks by default.

### Auto Scaling

It allows you to scale your Amazon EC2 capacity automatically by scaling out and scaling in according to criteria that you define.

Auto Scalling Plans

- Maintain Current Instance Levels: configure your Auto Saling group to maintain a mininum or spedific number of runnign instances at all times.
- Manual Scaling: most basic way to scale your resources. Case like, release of a new game version that will be available for downoad and require a user registration.
- Scheduled Scaling: need arises on a predicteable schedule. E.g., recurring events in end-of-month
- Dynamic Scaling: lets you define parameters that control the Auto Scaling process in a scaling policy.

Auto Scalling Components

1. launch configuration
2. Auto Scaling Group. A collection of Amazon EC2 instances managed by the Auto caling servcie.
3. an optional scaling policy

## AWS Identity and Access Management (IAM)

IAM enables you to control how people and programs are allowed to manipulate your AWS infrastructure. IAM users traditional identity concepts such as users, groups, and accesscontrol policies to control who can use your AWS account, what services and resources they can use, and how they can use them.

What IAM is **NOT**"

- IAM is not an identity store/authorization system for your applications. The permissions that you assign are permissions to manipulate AWS infrastructure, not permissions within your application. If you works with a mobile app, cosnider _Amazon Connito_ for identity management for mobile apps.
- IAM is not operating system identity management.

### Principals

A principal is an IAM entity that allowed to interact with AWS recources.
A principal can be permanent or temporary, and can represent a human or an app.
There are **three types of principals**: root users, IAM users, and roles/temporary security tokens.

1. Root user: It's associated with the actual AWS account and cannot be restricted in any way so it has full privileges to do anything, including closing the account.
2. IAM users: It represents individual people or apps. It can be created by principals with IAM administrative privileges at any time through the AWS Console, CLI or SDKs.
3. Roles/Temporary Security Tokens: roles and temporary security tokens enbable a number of use cases:
    - Amazon EC2 roles: Granting permissions to applications runnign on an Amazon EC2 instance.
    - Crosss-Acount Access: Granting permissions to users fro mother AWS accounts, whether you control those accounts or not
    - Federation: Granting permissiongs to users authenticatedby a trusted external system.

### Authentication

three ways that IAM authenticates a principal:

1. User Name/Password. E.g., you login in AWS Management Console as an IAM user or root user.
2. Access Key. combination of an access key ID(20 characters) and an access secret key (40 characters). E.g., a proram that access the API with an IAM user or root user uses a two-part acess key.
3. Access key/ session token. E.g., a temporary security token authenticates with an access key plus and additional session token unique to that temporary security token.

### Authorization

After IAM has authenticated a principal, the process of specifiying exactly what actions a principal can and cannot perform is called Authorization.

### Policies

A _policy_ is a JSOn document that fully defines a set of permissions to access and manipulate AWS resources.

Each permission includes that effect, servcie, action and resource. It may include one or more conditions.

- Effect: a signle word: Allow or Deny
- Service: for what service does this permission apply.
- Resource: the resource value specifies that specific AWS infrastructure for which this permission applies. This is specified as an Amazon Resource Name (ARN).

format of a ARN: `arn:aws:service:region:account-id:[resourcetype:]resource`

e.g.,

1. Amazon S2 bucket: `arn:aws:s3:us-east-1:123456789012:my_private_bucket`
2. IAM User: `arn:aws:iam:us-east-1:123456789012:user/moss`
3. Amazon Dynamo DB Table: `arn:aws:dynamodb:us-east-1:123456789012:table/tablename`

Action: specifies that subset of actions within a service that the permission allows or denies.
Condition: optionally defines one or more additional restrictions that limit the actions allowed by the permission.

Associating Policies with Principals

A policy can be associated directly with an IAM user in one of two ways:

- User Policy: these policies exist only in the context of the user to which they're attached. In the console, a user policy is entered intot the user interface on the IAM user page.
- Manged Policies: createdi nthe Policies tab on the IAM page and exist independently of any individual user.

Policy Evaluation Logic

When a principal tries to use the AWS Management Console, the AWS API, or the AWS CLI, that principal sends a request to AWS. When an AWS service receives the request, AWS completes several steps to determine whether to allow or deny the request.

1. Authentication – AWS first authenticates the principal that makes the request, if necessary. This step is not necessary for a few services, such as Amazon S3, that allow some requests from anonymous users.

2. Processing the Request Context – AWS processes the information gathered in the request to determine which policies apply to the request.
    - Actions (or operations) – The actions or operations that the principal wants to perform.
    - Resources – The AWS resource object upon which the actions or operations are performed.
    - Principal – The user, role, federated user, or application that sent the request. Information about the principal includes the policies that are associated with that principal.
    - Environment data – Information about the IP address, user agent, SSL enabled status, or the time of day.
    - Resource data – Data related to the resource that is being requested. This can include information such as a DynamoDB table name or a tag on an Amazon EC2 instance.
3. Evaluating Policies Within a Single Account – AWS evaluates all of the policy types, which affect the order in which the policies are evaluated.

4. Determining Whether a Request Is Allowed or Denied Within an Account – AWS then processes the policies against the request context to determine whether the request is allowed or denied.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:*",
            "Principal": { "AWS": "arn:aws:iam::111122223333:user/carlossalazar" },
            "Resource": "*"
        }
    ]
}
```

This policy specifies that only the carlossalazar user can access the carlossalazar bucket.

Exam Tips: IAM Policies

- If a request isn't explicitly allowed, it's implicity (default) denied
- If a request is explicity denied, it **overrides everyint else**
- If a request is explicitly allowed, it's allowed unless denied by an explicit deny.
- Only attached policies have any impact.
- When evaluating policies, all applicable policies are merged: All identity (user,group, role) and any resoure policies
- Merged policies allow the same policy to impact many identities.
- Inline policies allow exceptions to be applied to identities.
- AWS-managed policies are low overhead but lack flexibility.
- Customer-manged policies are flexible but require administration
- inline and manged policies can apply to users, groups and roles

### Multi-Factor Authentication (MFA)

MFA requires you to verify your identity with both something you know and something you have.

### Key rotation

To protect your AWS infrastructure, access keys should be rotated regularly.

### IAM user

An AWS Identity and Access Management (IAM) user is an entity that you create in AWS to represent the person or application that uses it to interact with AWS. A user in AWS consists of a name and credentials.

Exam Tips: IAM users

- Hard limit of 5,000 IAM users per account - this is important, as it can impact architecture
- 10 group memberships per IAM user
- Default maximum of 10 managed policies per user
- No inline limit, but you cannot exceed 2048 characters for all inline policies on a IAM user
- 2 access keys per user

### IAM Groups

An IAM group is a collection of IAM users. Groups let you specify permissions for multiple users, which can make it easier to manage the permissions for those users.

IAM groups allow for large-scale management of IAM users. This way, policies can be applied to groups and impact collections of similar users.

For example, you could have a group called Admins and give that group the types of permissions that administrators typically need. Any user in that group automatically has the permissions that are assigned to the group. If a new user joins your organization and needs administrator privileges, you can assign the appropriate permissions by adding the user to that group. Similarly, if a person changes jobs in your organization, instead of editing that user's permissions, you can remove him or her from the old groups and add him or her to the appropriate new groups.

Note that a group is not truly an "identity" in IAM because it cannot be identified as a Principal in a permission policy. It is simply a way to attach policies to multiple users at one time.

Exam Tips: IAM groups:

- A group can contain many users, and a user can belong to multiple groups.
- Groups can't be nested; they can contain only users, not other groups.
- There's no default group that automatically includes all users in the AWS account. If you want to have a group like that, you need to create it and assign each new user to it.
- There's a limit to the number of groups you can have, and a limit to how many groups a user can be in. For more information, see IAM and STS Limits.
- Groups are not "true" identities, and they can't be referenced from resource policies.
- Groups have no credentials

### IAM Roles

IAM roles are assumed by another identity allowed in the trust policy - IAM user, ASW service, another AWS account, web identity, or even an anonymous identity.

When a role is assumed, the Security Token Service (STS) generates a **time-limited** set of access keys (temporary security credentials). These access keys have the permissins defined in the permissions policy.

IAM roles have no long-term credentials (access keys or username and password).

Exam tips:

- IAM roles have no long-term credentials
- They're `sts:AssumeRole` by another identity:
  - IAM users
  - AWS services
  - External accounts
  - Web identities
- Temporary security credentials are generated by STS
- Trust policy controls which identities can assume the role.
- **Permissions** policy defines the permissions provided.
- Temporary credentials expire.
- Example scenarios:
  - company merge
  - AWS service acess
  - "Break-glass" style extra access

## Database and AWS

The database needs to meet the performance demands, the availability needs, and the recoverability characteristics of the system.

1. RDBS: relational database management system
2. NoSQL: non-relationsal database

### Relational Database

Types based on how the tables are organized and how the application uses the relational database:

1. OLTP: Online Transactin Processing. regquently writing and changing data, e.g., data entry and e-commerce
2. OLAP: Online Analytical processing. reporting or analyzing large data sets.

Amazon RDS significantly simplifies the setup and maintenance of OLTP and OLAP database.

### Data Warehouse

A _data warehouse_ is a central repository for data that can come fromone ormore sources, used for reportign and analysis via OLAP using highly complex queries.

_Amazon Redshif_ is a high-performance data warehouse designed for OLAP use cases.

### NoSQL Database

Simple, flexible and can achieve performance levels that are difficult with tradictional relational databases.
A common case is managing user session state, user profiles, shopping cart data, or time-series data.

### Amazon RDS

Amazon RDS is a service that simplifies the setup, operations and scaling of a relational database on AWS. Amazon is responsible for backups, patching, scaling and replication.

Amazon RDS does not provideshell access to DB instances and it restricts access to certain system procedures and tables that require advanced privileges.

### DB instances

A DB instance isan isolated databse environment deployed in your private network segments the could.
One DB instance can contain multiple differenct databases.

### Operational Benefits

Amazon RDS increases the operational **reliability** of your database by applying a nery consistent deployment and operational model.

E.g., you cannot use Secure Shall (SHH) to log in to the host instance and install a custom pieve of software.

If you want full control of the OS or require elevated permissions tot run, then consider installing your db on Amazon EC2 instead of Amazon RDS.

### Oracle

Amazon RDS Oracle supports three different editions of the db engine:

1. standard One
2. Standard
3. Enterprise

### Licensing

AWS offers two licensing models: License Included and Bring Your Own license (BYOL).

1. License Included: license is held by AWS and is included in the Amazon RDS instance price.
2. BYOL: you privide your own license.

### Amazon Aurora

It's a fully managed servcie, MySQL-compatible.

It can deliver up to five times the performance of MySQL without requiring changes to most of your exsiting web apps.

A Amazon Aurora DB cluster consists of two difference types of instances:

- Primary Instance: main instance, supports read and write.
- Amazon Aurora Replica: secondary instance that supports only read operations. You can locate your Amazon Aurora Replicas in multiple Availability Zones to increase your database availavility.

#### Backup and Recovery

Amazon RDS provices two mechanisms for backing up the databse: automated backups and manual snapshots.

Recovery Point Objective (RPO). It's defined as the maximum period of data loss that is acceptable in the event of a failure or incident. Enterprise systems have RPO measured in minutes.
Recovery Time Objective (RTO). It's defined as the maximum amount of downtime that is permitted to recover from backup and to resume processing. Enterprise systems have RTO measured in hours or even days.

- Automated Backups

An automated back is an Amazon RDS fearure that continuously tracks changes and backs up your database. Default one day of backup, up to 35 days. All automated backup snapshots are deleted and cannot be recoverd.

Automated backups will occur daily during a configurable 30-minute maintenance window called the backup window.

Automated backups are kept for a configurable number of days, called the _backup retention period_.

- Manual DB Snapshots
You can perform manual DB snapshots at any time.
Manual DB snapshots are kept until you explicitly delete them with the Amazon RDS console or the _DeleteDBSnapshot_ action.

#### Recovery

You cannot restore from a DB snapshot to an existing DB instance.

A new DB instance is created when you restore.

#### High Availabilty with Multi-AZ

It allows you to create a dtabse cluster across multiple Availability Zones. Highly available, fault-tolerant.

Multi-AZ lets you meet the most demanding RPO and RTO targest by using synchronous replication to minimize PRO and fast failover to mnimize RTO to minutes.

It's for disaster recovery oinly, they're not meant to enhance databse performance. Use read replicas or other DB caching technologies such as Amazon ElastiCache to improve database performance.

#### Scaling up and out

AS the number of transactions increase tothe relatiosnal database, you can do:

- Scaling up, vertically, get a larger machine allows you to process more reads and writes.
- Scaling out, horizontally, more difficult.

Horizontal Scalability with Partitioning

  Partitioning a large relational database into multiple instances or shards is a common technique for handling more requests beyond the capabilities of a single instance. It allows you to scal horizontally to handle more users and requests but requires additional logic in the application layer. The app needs to decide how to route database requests to the correct shard and becoems limited in the types of queri3es that can be performed across server bundaries. NoSQL database like Amazon DynamoDB or Cassandra are desinged to scale horizontally.

Horizontal Scalability with Read Replicas

  use read replicas to offload read transactions from the primary database and increase the overall number of transactions. Commen scenarios:
    - Scale beyond the capacity of a single DB Instance for read heavy workloads
    - Handle read traffic while the source DB Instance is unavailable. E.g., I/O suspension for backups or scheduled maintenance, you can direct read trffic to a replica.
    - Offload reporting or data warehousing scenarios.

#### Security

infrastructure resources, the database, and the network levels.

1. Infrastructure resources: using Amazon IAM
2. Deploy your Amazon RDS DB Instances into a private subnet within an Amazon Virtual Private Cloud (Amazon VPC) that limits network access to the DB Instance.

### Amazon Redshift

It's a data warehouse service, a relational database designed for OLAP scenarios and optimized for high-performance analysis and reporting of very large database. It's based on industry-standard PostgreSQL.

#### Clusters and Nodes

The key component of an Amazon Redshift data warehouse is a cluster that composed of

1. a leader node. The client app interacts only with the leader node
2. one or more compute nodes. transparent tot external apps.

six node types into two categories

1. Dense compute, up to 326TB using fast SSDs
2. Dense storage, up to 2PB using large magnetic disks.

You can increase query performance by adding multiple nodes to a cluster.

#### Distribution Strategy

The data distribution style that you select for your database has a big impact on query performance, storage requirements, data loading and maintenance. So, when creating a table, you choose from three distribution styles:

1. Even distribution: defalt option
2. Key distribution, rows are distributed according to the values in one column. The leader node will store matching values close together and increase query performance for joins.
3. All distribution, a full copy of the entire table is distributed to every node. Useful for loopup tables and other large tables that are not updated frequently.

#### Loading data

_COPY_ command can load data into a table in the most efficient manner. Best way to load data into Amazon Redshift is doing bulk data loads from flat files stored in an Amazon S3 bucket or from an Amazon Dynamo DB table.

#### Querying data

Workload management (WLM) queue and prioritize queries. It allows you define multiple queues and set the concurrency level for each query.

#### Snapshots

- automated snapshots
- manual snapshots

#### Amazon Redshift Security

- infrastructure level: IAM policies
- network level: Amazon Redshift clusters can be deployed within the private IP Address of your Amazon VPC.
- Database level
- Encryption of data

### Amazon DynamoDB

It's a fully managed NoSQL database service. Fast, Low-latency, Scales with ease.

DynamoDB can handle more than 10 trillion requests per day and support peaks of more than 20 million requests per second.

All table data is stored on high performance SSD disk drives.

Performance metrics, including transactions rates, can be monitored using Amazon CloudWatch.

Automatic high-availability and durability protections by replicating data across multiple Availavility Zones within an AWS Region.

#### Data Model

Tables, Items, Attributes.

A table is a collection of items and each item is a collection of one or more attributes.
Each item also has a primary key that uniquely identifies the item.
Each attribute in an item is a name/value pair.
An attribute can be a single valued or multi-value set.

E.g.,

- table: Albums
- item: Song01, song02, song03
- primary key: song track id, 01,02,03...;
  - Attributes: name: song1, length:2min,...

Best practice:
use the AWS SDK to interact with items and tables, rather than using Amazon DynamoDB services endpoints.

Data types in 3 categories:

1. Scalar: represents one value. String, Number, Binary (images), Boolean, Null
2. Set: represent a unique list of one or more scalar values. Each value in a set needs to be unique and must be the same data type. String Set, Number Set, Binary Set.
3. Document: represent nultiple nested attributes, like JSON file.
    - List: each list stores an ordered list of attributes of different data types
    - Map: Each map stores anunordered list of key/value pairs,. structure of any JSOn object.

Primary Key

1. Partition key: made of one attribute, a partition (or hsh) key.
2. Partition and Sort key. the primary key is made of two attributes. the partiion key and the second one is the sort key.

Best practice:
Read/write performance will not be benefit from Amazon DynamoDB cluster.
To maximize your throughput by distributing requests across the full range of partition keys.

#### Eventual Consistency

- Eventually consistent reads
- Strongly consistent reads

#### Scaling and Partitioning

A table can scale horizontally through the use of partions to meet the storage and performance requirements of your app.

To maximize Amazon Dynamo DB throughput, create tables with a partition key that has a large number of distinct values and ensure that the values are requested fairly uniformaly.

#### Amazon DynamoDB Security

- IAM policies
- All operations must be authenticated as a valid user or user session.

Best practice is to use a combination of web identity federation with the AWS Security Token Service (AWS STS) to issue temporary keys taht expire after a short period.

### Amazon Simple Queue Service (Amazon SQS)

Amazon SQS is a fast, reliable, scalable, fully managed message queuing service that allows organizations to decouple the components of a cloud application.

Amazon SNS provides a messaging bus complement to Amazon SQS; however, it doesn’t provide the decoupling of components.

- Fast, reliable, scalable, and fully managed.
- Simple and cost effective.
- Decople the componetns of a cloud application.
- It's basically a buffer between t he app components that receive data and those components that process the data.
- Amazon SQS ensures delivery of each message at lease once and supports multiple readears and writers interacting with the same queue.
- It doesn't guarantee FIFO delivery of mesages. If you need the order be preserved ,you can place sequncencing info in each message and recorder them after retrieving.

#### Message Lifecycle

1. Component1 sends message A to a queue, and the mesage is **redundantly distributed** across the Amazon SQS servers.
2. When component2 is ready to process a message, it retrives mesages from teh queue, the Message A is returned. While Message A is being processed, it remains in the queue and is not returned to subsequently receive requests for the duration of the visibility timeout.
3. Component 2 deletes message A from the queue to prevent the message from being received and processed again after the visibility timeout expires.

#### Delay Queues and Visibility Timeouts

- Delay queues allow you to postpone the delivery of new messages in a queue for a specific number of seconds.
- Create a Delay Queues. Default delay is 0
- turn a existing queue into a delay queue `SetQueueAttributes`
- When a message is in the queue but is neither delayed nor in a visibility timeout, it is considered to be “**in flight**.”

#### Queue and Message Identifiers

Amazon SQS uses three identifiers: queue URLs, message IDs, and receipt handles.

1. a queue name that is unique within the scope of all of your queues.
2. Amazon SQS assigns each message a unique ID that it returns to you in the SendMessage response. This identifier is useful for identifying messages. The maximum length of a message ID is 100 characters.
3. Each time you receive a message from a queue, you receive a receipt handle for that message.
    - The handle is associated with the **act of receiving the message, not with the message itself**.
    - to delete the message or to change the message visibility, you must provide the receipt handle and not the message ID.
    - This means you must always receive a message before you can delete it (that is, you can’t put a message into the queue and then recall it).
    - The maximum length of a receipt handle is 1,024 characters.

#### Message Attributes

- Amazon SQS provides support for message attributes.
- Message attributes allow you to provide structured metadata items (such as timestamps, geospatial data, signatures, and identifiers) about the message.
- Message attributes are optional and separate from, but sent along with, the message body.
- Each message can have up to 10 attributes.

#### Long Polling

With long polling, you send a WaitTimeSeconds argument to ReceiveMessage of up to 20 seconds. If there is no message in the queue, then the call will wait up to WaitTimeSeconds for a message to appear before returning. If a message appears before the time expires, the call will return the message right away. Long polling drastically reduces the amount of load on your client.

If your code makes periodic calls to the queue, this pattern is sufficient. If your SQS client is just a loop that repeatedly checks for new messages, however, then this pattern becomes problematic, as the constant calls to ReceiveMessage burn CPU cycles and tie up a thread.

#### Dead Letter Queues

It's a queue that other (source) queues can target to send messages that for some reason could not be successfully processed.

A primary benefit of using a dead letter queue is the ability to sideline and isolate the unsuccessfully processed messages. You can then analyze any messages sent to the dead letter queue to try to determine the cause of failure.

#### Access Control

Amazon SQS Access Control allows you to assign policies to queues that grant specific interactions to other accounts without that account having to assume IAM roles from your account.

### Amazon Simple Workflow Service (Amazon SWF)

- Amazon SWF makes it easy to build applications that coordinate work across distributed components.
- you implement workers to perform tasks
- workers can run either on cloud infrastructure, such as Amazon EC2, or on your own premises
- Amazon SWF stores tasks, assigns them to workers when they are ready, monitors their progress, and maintains their state, including details on their completion

#### Workflows

Workflows coordinate and manage the execution of activities that can be run asynchronously across multiple computing devices and that can feature both sequential and parallel processing.

The workflow’s coordination logic determines the order in which activities are executed.

**Workflow Domains** provides a way of scoping Amazon SWF resources within your AWS account. workflows in different domains cannot interact with one another.

**Workflow history** is a detailed, complete, and consistent record of every event that occurred since the workflow execution started

**Actors** can be workflow starters, deciders, or activity workers.

1. **starter** is any application that can initiate workflow executions. For example, one workflow starter could be an e-commerce website where a customer places an order.

2. **decider** is the logic that coordinates the tasks in a workflow. It schedules the activity tasks and provides input data to the activity workers.

3. An **activity worker** is a single computer process (or thread) that performs the activity tasks in your workflow.

#### Tasks

Three types of tasks: activity tasks, AWS Lambda tasks, and decision tasks.

1. An activity task tells an activity worker to perform its function, such as to check inventory or charge a credit card. The activity task contains all the information that the activity worker needs to perform its function.
2. An AWS Lambda task is similar to an activity task, but executes an AWS Lambda function.
3. A decision task tells a decider that the state of the workflow execution has changed so that the decider can determine the next activity that needs to be performed.

#### Object Identifiers

Amazon SWF objects are uniquely identified by workflow type, activity type, decision and activity tasks, and workflow execution.

---

### Amazon Simple Notification Service (Amazon SNS)

- It is a web service for mobile and enterprise messaging.
- It follows the publish-subscribe (pub-sub) messaging paradigm
- notifications being delivered to clients using a push mechanism
- two types of clients: publishers and subscribers, or producers and consumers
  - Publishers communicate to subscribers asynchronously by sending a message to a topic.
  - A topic is simply a logical access point/communication channel that contains a list of subscribers and the methods used to communicate to them
- When you send a message to a topic, it is automatically forwarded to each subscriber.
- a publisher sends a message to the topic, and Amazon SNS delivers the message to each subscriber for that topic

Common Amazon SNS Scenarios

E.g., monitoring applications, workflow systems, time-sensitive information updates, mobile applications, and any other application that generates or consumes notifications.

#### Fanout

when an Amazon SNS message is sent to a topic and then replicated and pushed to multiple Amazon SQS queues, HTTP endpoints, or email addresses.

#### Application and System Alerts

SMS and/or email notifications that are triggered by predefined thresholds.

#### Push Email and Text Messaging

to transmit messages to individuals or groups via email and/or SMS. For example, you can use Amazon SNS to push targeted news headlines to subscribers by email or SMS

#### Mobile Push Notifications

to send messages directly to mobile applications. For example, you can use Amazon SNS for sending notifications to an application, indicating that an update is available.

### In Memory Caching

successful application: fast and responsive user experience.
Caching is one of the most importance performance optimizations. E.g., app session state for a large website can be stored in an in-memory caching engine.
two engines:

- Memcached: key/value store that can be used to store arbitrary types of data.
- Redis: can be used as a cache, database, or message broker.

## Amazon ElastiCache

You can start using the servcie with very few or no modifications to your existing app that use Memcached or Redis, becasue Amazon ElastiCache is protocol-compliant with both of thrm. You only need to change the endpoint in your configuration files.

You can build and manage a cache cluster on your EC2 instance.

Enhance the reliability of critical deployments.

#### Data Access Patterns

A good example of something to cache is the list of products in a catalog.

should not be cached: if you generate a unique page every request, you probably should not cache the page results

#### Cache Engine: Memcached

Memcached deals with objects as blobs that can be retrieved using a unique key.

The object is typically the serialized results from a database query

#### Cache Engine: Redis

Beyond the object support provided in Memcached, Redis supports a rich set of data types likes strings, lists, and sets.
Unlike Memcached, Redis supports the ability to persist the in-memory data onto disk.
Redis also has advanced features that make it easy to sort and rank data.

#### Nodes and Clusters

Each deployment of Amazon ElastiCache consists of one or more nodes in a cluster.
A single Memcached cluster can contain up to 20 nodes.
Redis clusters are always made up of a single node; however, multiple clusters can be grouped into a Redis replication group.
The individual node types are derived from a subset of the Amazon EC2 instance type families, like t2, m3, and r3.
The t2 cache node family is ideal for development and low-volume applications with occasional bursts, but certain features may not be available. The m3 family is a good blend of compute and memory, while the r3 family is optimized for memory-intensive workloads.

#### Amazon ElastiCache Access Control

Access to your Amazon ElastiCache cluster is controlled primarily by restricting inbound network access to your cluster.

### Storage and Content Delivery: Amazon CloudFront

Amazon CloudFront is a global Content Delivery Network (CDN) service; Amazon CloudFront is AWS CDN.

It's to speed up distribution of your static and dynamic web content—for example, .html, .css, .php, image, and media files—to end users.

CDNs use Domain Name System (DNS) geo-location to determine the geographic location of each request for a web page or other content, then they serve that content from edge caching servers closest to that location instead of the original web server.

It works with:

  1. other AWS cloud service: Amazon S3 buckets, Amazon S3 static websites, Amazon Elastic Compute Cloud (Amazon EC2), and Elastic Load Balancing.
  2. any non-AWS origin server, such as an existing on-premises web server
  3. Amazon Route 53.

It supports all content that can be served over HTTP or HTTPS, including:

  1. any popular static files that are a part of your web application, such as HTML files, images, JavaScript, and CSS files, and also audio, video, media files.
  2. serving dynamic web pages, so it can actually be used to deliver your entire website
  3. media streaming, using both HTTP and RTMP.

Three core concepts: distributions, origins,and cache control.

#### Amazon CloudFront Use Cases

Good for:

- Serving the Static Assets of Popular Websites
- Serving a Whole Website or Web Application. both dynamic and static content
- Serving Content to Users Who Are Widely Distributed Geographically
- Distributing Software or Other Large Files
- Serving Streaming Media
  
Not appropriate:

- All or Most Requests Come From a Single Location. you will not take advantage of multiple edge locations.
- All or Most Requests Come Through a Corporate VPN.

### Storage and Content Delivery: AWS Storage Gateway

AWS Storage Gateway is a service connecting an on-premises software appliance with cloud-based storage to provide seamless and secure integration between an organization’s onpremises IT environment and AWS storage infrastructure.

The storage associated with the appliance is exposed as an iSCSI device that can be mounted by your on-premises applications.

three configurations for AWS Storage Gateway: Gateway-Cached volumes, Gateway-Stored volumes, and Gateway-Virtual Tape Libraries (VTL).

#### Gateway-Cached volumes

It allows you to expand your local storage capacity into Amazon S3. All data stored on a Gateway-Cached volume is moved to Amazon S3, while recently read data is retained in local storage to provide low-latency access.

#### Gateway-Stored volumes

It allows you to store your data on your on-premises storage and asynchronously back up that data to Amazon S3. This provides lowlatency access to all data, while also providing off-site backups taking advantage of the durability of Amazon S3.

#### Gateway Virtual Tape Libraries (VTL)

A virtual tape is analogous to a physical tape cartridge, except the data is stored on the AWS cloud. Tapes are created blank through the console or programmatically and then filled with backed up data.

Gateway-VTL offers a durable, cost-effective solution to archive your data on the AWS cloud. The VTL interface lets you leverage your existing tape-based backup application infrastructure to store data on virtual tape cartridges that you create on your Gateway-VTL.

#### AWS Storage Gateway Use Cases

- Gateway-Cached volumes enable you to expand local storage hardware to Amazon S3, allowing you to store much more data without drastically increasing your storage hardware or changing your storage processes.

- Gateway-Stored volumes provide seamless, asynchronous, and secure backup of your onpremises storage without new processes or hardware.

- Gateway-VTLs enable you to keep your current tape backup software and processes while storing your data more cost-effectively and simply on the cloud.

### AWS CloudTrail

It records API calls made on your account and delivers log files to your Amazon S3 bucket. AWS CloudTrail’s benefit is visibility into account activity by recording API calls made on your account.

AWS CloudTrail records the following information about each API call:

- The name of the API
- The identity of the caller
- The time of the API call
- The request parameters
- The response elements returned by the AWS Cloud service

Validated log files are invaluable in security and forensic investigations

### Software Architecture Best Practices

tenets of architecture best practices

- Design for failure and nothing will fail.
- Implement elasticity.
- Leverage different storage options.
- Build security in every layer.
- Think parallel.
- Loose coupling sets you free.
- Don’t fear constraints.

## AWS Well-Architected Framework

Best practices for designing and operating reliable, secure, eﬃcient, and cost-eﬀective systems in the cloud.

The **AWS WellArchitected Tool** (AWS WA Tool) is a service reviews and measures your architecture whether using the AWS WellArchitected Framework, and provides recommendations for making your workloads more reliable, secure, eﬃcient, and cost-eﬀective.

Definitions:

- Component: code, configuration and AWS Resources that together deliver against a requirement. Normally decoupled.
- Workload: a set of componetns. It's the detail the business and tech leaders communicate about.
- Milestones: key changes in your architecture
- Architecture: how componetns work together in a workload
- Technology portfolio: the collection of workloads that are requried for business to operate

Five pillars:

1. **Operational Excellence**: The ability to run and monitor systems
2. **Security**: protect infomation, systems and assets
3. **Reliability**: system recover from failure
4. **Performance Efficientcy**: use computing resources efficiently
5. **Cost Optimization**

You may need to optimize

- to reduce cost, downgrade reliability of dev env
- for mission critical solution, optimize reliability with increased costs
- In ecommerce solutions, performance should be optimized
- Security and operational excellence are generally not traded-off against the other pillars.

### General Design Principles

- Stop guessing your capacity needs: n use as much or as little capacity as you need, and scale up and down automatically.
- Test systems at production scale: only pay for the test environment when it's running
- Automate to make architectural experimentation easier: use Automation to avoid the expense of manual eﬀort.
- Allow for evolutionary architectures: the capability to automate and test on demand lowers the risk of impact from design changes
- Drive architectures using data: collect data, make fact-based decisions and improve workload.
- Improve through game days: simulate events in production which will help you understand where to improvement.

### Pillar One: Operational Excellence

It includes the ability to run and monitor systems to deliver business value and to continually improve supporting processes and procedures.

**Design Principles**:

- **Perform operations as code**: deﬁne your entire workload (applications, infrastructure) as code, limit human error and enable consistent responses to events.
- **Annotate documentation**: automate the creation of annotated documentation after every build
- **Make frequent, small, reversible changes**
- **Reﬁne operations procedures frequently**
- **Anticipate failure**: Test your failure scenarios
- **Learn from all operational failures**

**Three best practice areas**: Prepare, Operate, Evolve

Key AWS Services

The AWS service that is essential to Operational Excellence is **AWS CloudFormation**, which you can use to create templates based on best practices. This enables you to provision resources in an orderly and consistent fashion from your development through production environments.

1. Prepare:
    - **AWS Conﬁg and AWS Conﬁg rules** can be used to create standards for workloads and to determine if environments are compliant with those standards before being put into production.
    - **AWS CloudFormation** enables you to have consistent, templated, sandbox development, test, and production environments with increasing levels of operations control.
    - Data on use of resources, application programming interfaces (APIs), and network ﬂow logs can be collected using **Amazon CloudWatch**, **AWS CloudTrail**, and **VPC Flow Logs**.

2. Operaete
    - **Amazon CloudWatch** allows you to monitor the operational health of a workload.
    - AWS provides workload insights through logging capabilities including **AWS X-Ray**, **CloudWatch**, **CloudTrail**
    - **VPC Flow Logs** enabling the identiﬁcation of workload issues in support of root cause analysis and remediation.

3. Evolve
    - **Amazon Elasticsearch Service (Amazon ES)** allows you to analyze your log data to gain actionable insights quickly and securely.
    - With **AWS Developer Tools** you can implement continuous delivery build, test, and deployment activities that work with a variety of source code, build, testing, and deployment tools from AWS and third parties.

### Pillar Two: Security

It includes the ability to protect information, systems, and assets while delivering business value through risk assessments and mitigation strategies.

Design Principles

- **Implement a strong identity foundation**: appropriate authorization for each interaction with your AWS resources
- **Enable traceability**
- **Apply security at all layers**: E.g., edge network, VPC, subnet, load balancer, every instance, operating system, and application
- **Automate security best practices**
- Protect data in transit and at rest
- Keep people away from data
- Prepare for security events

Key AWS Services:

The AWS service that is essential to Security is AWS Identity and Access Management (IAM), which allows you to securely control access to AWS services and resources for your users.

5 Best Practices:

1. Identity and Access Management
    - only authorized and authenticated users are able to access your resources.
    - privilege management is primarily supported by the **AWS Identity and Access Management (IAM)** service, which allows you to control user and programmatic access to AWS services and resources.
    - best practices including password requirements and MFA enforced
    - key Services:
        - **IAM** enables you to securely control access to AWS services and resources.
        - **MFA** adds an additional layer of protection on user access.
        - **AWS Organizations** lets you centrally manage and enforce policies for multiple AWS accounts.
2. Detective Controls
    - use detective controls to identify a potential security threat or incident.
    - you can implement detective controls by processing logs, events, and monitoring that allows for auditing, automated analysis, and alarming.
    - CloudTrail logs, AWS API calls, and CloudWatch provide monitoring of metrics with alarming
    - AWS Conﬁg provides conﬁguration history.
    - Amazon GuardDuty is a managed threat detection service that continuously monitors for malicious or unauthorized behavior to help you protect your AWS accounts and workloads.
    - Service-level logs are also available, for example, you can use Amazon Simple Storage Service (Amazon S3) to log access requests.
    - Log management is important to a well-architected design for reasons ranging from security or forensics to regulatory or legal requirements.
    - Key Services:
        - **AWS CloudTrail** records AWS API calls,
        - **AWS Conﬁg** provides a detailed inventory of your AWS resources and conﬁguration.
        - **Amazon GuardDuty** is a managed threat detection service that continuously monitors for malicious or unauthorized behavior.
        - **Amazon CloudWatch** is a monitoring service for AWS resources which can trigger CloudWatch Events to automate security responses.
3. Infrastructure Protection
    - use **Amazon Virtual Private Cloud (Amazon VPC)** to create a private, secured, and scalable environment in which you can deﬁne your topology—including gateways, routing tables, and public and private subnets.
    - Multiple layers of defense are advisable in any type of environment.
    - Key Services:
        - **Amazon Virtual Private Cloud (Amazon VPC)** enables you to launch AWS resources into a virtual network that you've deﬁned.
        - **Amazon CloudFront** is a global content delivery network that securely delivers data, videos, applications, and APIs to your viewers which integrates with **AWS Shield** for DDoS mitigation.
        - **AWS WAF** is a web application ﬁrewall that is deployed on either **Amazon CloudFront** or **Application Load Balancer** to help protect your web applications from common web exploits.
4. Data Protection
    - AWS provides multiple means for encrypting data at rest and in transit.
    - server-side encryption (SSE) for Amazon S3 to make it easier for you to store your data in an encrypted form.
    - You can also arrange for the entire HTTPS encryption and decryption process (generally known as SSL termination) to be handled by Elastic Load Balancing (ELB).
    - Key Services:
        - Services such as ELB, Amazon Elastic Block Store (Amazon EBS), Amazon S3, and Amazon Relational Database Service (Amazon RDS) include encryption capabilities to protect your data in transit and at rest.
        - **Amazon Macie** automatically discovers, classiﬁes and protects sensitive data,
        - **AWS Key Management Service (AWS KMS)** makes it easy for you to create and control keys used for encryption.
5. Incident Response
    - Key Service:
        - **IAM** should be used to grant appropriate authorization to incident response teams and response tools.
        - **AWS CloudFormation** can be used to create a trusted environment or clean room for conducting investigations.
        - **Amazon CloudWatch Events** allows you to create rules that trigger automated responses including AWS Lambda.

Best Practice Details: protect data at rest

- Deﬁne data management and protection at rest requirements.
- Implement secure key management. Consider using a key management service such as AWS Key Management Service
- Enforce encryption at rest.
- Enforce access control
- Provide mechanisms to keep people away from data

Best Practice Details: protect data in transit

- Deﬁne data protection in transit requirements
- Implement secure key and certiﬁcate management: AWS Certiﬁcate Manager
- Enforce encryption in transit
- Automate detection of data leak
- Authenticate network communications

### Pillar Three: Reliability

It includes the ability of a system to recover from infrastructure or service disruptions, dynamically acquire computing resources to meet demand, and mitigate disruptions such as misconﬁgurations or transient network issues.

Design Principles

1. Test recovery procedures: test how your system fails, and you can validate your recovery procedures.
2. Automatically recover from failure: automatic notiﬁcation and tracking of failures, and for automated recovery processes that work around or repair the failure.
3. Scale horizontally to increase aggregate system availability: don't share a common point of failure.
4. Stop guessing capacity
5. Manage change in automation

Key Service

The AWS service that is essential to Reliability is Amazon CloudWatch, which monitors runtime metrics.

3 Best Practices:

1. Foundations: foundational requirements that inﬂuence reliability should be in place
    - key Services:
        - **Amazon VPC** lets you provision a private, isolated section of the AWS Cloud where you can launch AWS resources in a virtual network.
        - **AWS Trusted Advisor** provides visibility into service limits.
        - **AWS Shield** is a managed Distributed Denial of Service (DDoS) protection service that safeguards web applications running on AWS.
2. Change Management
    - key services:
        - **AWS CloudTrail** records AWS API calls for your account and delivers log ﬁles to you for auditing.
        - **AWS Conﬁg** provides a detailed inventory of your AWS resources and conﬁguration, and continuously records conﬁguration changes.
        - **Amazon Auto Scaling** is a service that will provide an automated demand management for a deployed workload.
        - **Amazon CloudWatch** provides the ability to alert on metrics, including custom metrics.
        - **Amazon CloudWatch** also has a logging feature that can be used to aggregate log ﬁles from your resources.  
3. Failure Management
    - Key Services:
        - **AWS CloudFormation** provides templates for the creation of AWS resources and provisions them in an orderly and predictable fashion.
        - **Amazon S3** provides a highly durable service to keep backups.
        - **Amazon Glacier** provides highly durable archives.
        - **AWS KMS** provides a reliable key management system that integrates with many AWS services.

### Pillar Four: Performance Efficientcy

the ability to

1. use computing resources eﬃciently to meet system requirements,
2. and to maintain that eﬃciency as demand changes and technologies evolve.

Design Principles

1. Democratize advanced technologiesanscoding and mechine learning
    - Rather than having your IT team learn how to host and run a new technology, they can simply consume it as a service. E.g., NoSQL databases, media transcoding, and machine learning.
    - In the cloud, these technologies become services.
2. Go global in minutes
    - serverless architectures remove the need for you to run and maintain servers.
    - For example, storage services can act as static websites, removing the need for web servers,
    - and event services can host your code for you.
3. Use serverless architectures
4. Experiment more often
5. Mechanical sympathy

3 Best Practices:

1. Selection, the four main resource types that you should consider (compute, storage, database, and network).
    - Compute is available in three forms: instances, containers, and functions:
        - Instances
        - Containers: a method of operating system virtualization that allow you to run an application and its dependencies in resource-isolated processes.
        - Functions: abstract the execution environment from the code you want to execute.
    - Storage:
        - vary based on the kind of access method (block, ﬁle, or object), patterns of access (random or sequential), throughput required, frequency of access (online, oﬄine, archival), frequency of update (WORM, dynamic), and availability and durability constraints.
        - The optimal storage solution for a particular system will vary based on the kind of access method (block, ﬁle, or object), patterns of access (random or sequential), throughput required, frequency of access (online, oﬄine, archival), frequency of update (WORM, dynamic), and availability and durability constraints.
        - As with storage, it is critical to consider the access patterns of your workload, and also to consider if other nondatabase solutions could solve the problem more eﬃciently (such as using a search engine or data warehouse).
    - Database:
        - vary based on requirements for availability, consistency, partition tolerance, latency, durability, scalability, and query capability.
        - Amazon RDS, DynamoDB, Redshift
        - As with storage, it is critical to consider the access patterns of your workload, and also to consider if other nondatabase solutions could solve the problem more eﬃciently (such as using a search engine or data warehouse).
    - Network
        - vary based on latency, throughput requirements
        - AWS oﬀers product features (for example, Enhanced Networking, Amazon EBS-optimized instances, Amazon S3 transfer acceleration, dynamic Amazon CloudFront) to optimize network traﬃc.
        - AWS also oﬀers networking features (for example, Amazon Route 53 latency routing, Amazon VPC endpoints, and AWS Direct Connect) to reduce network distance or jitter.
2. Review
3. Monitoring
    Amazon CloudWatch provides the ability to monitor and send notiﬁcation alarms. You can use automation to work around performance issues by triggering actions through Amazon Kinesis, Amazon Simple Queue Service (Amazon SQS), and AWS Lambda.

4. Tradeoffs
    - AWS also offers caching solutions such as Amazon ElastiCache, which provides an in-memory data store or cache,
    - and Amazon CloudFront, which caches copies of your static content closer to end users.
    - Amazon DynamoDB Accelerator (DAX) provides a read-through/write-through distributed caching tier in front of Amazon DynamoDB, supporting the same API, but providing sub-millisecond latency for entities that are in the cache.

Key Service

The AWS service that is essential to Performance Eﬃciency is **Amazon CloudWatch**, which monitors your resources and systems, providing visibility into your overall performance and operational health.

1. Selection
    - Compute: Auto Scaling is key to ensuring that you have enough instances to meet demand and maintain responsiveness.
    - Storage: Amazon EBS provides a wide range of storage options (such as SSD and provisioned input/output operations per second (PIOPS)) that allow you to optimize for your use case. Amazon S3 provides serverless content delivery, and Amazon S3 transfer acceleration enables fast, easy, and secure transfers of ﬁles over long distances.
    - Database: Amazon RDS provides a wide range of database features (such as PIOPS and read replicas) that allow you to optimize for your use case. Amazon DynamoDB provides single-digit millisecond latency at any scale.
    - Network: Amazon Route 53 provides latency-based routing. Amazon VPC endpoints and AWS Direct Connect can reduce network distance or jitter.
2. Review: The AWS website are resources for learning
3. Monitoring: Amazon CloudWatch provides metrics, alarms, and notiﬁcations.
4. Tradeoffs:
    - Amazon ElastiCache, Amazon CloudFront, and AWS Snowball are services that allow you to improve performance.
    - Read replicas in Amazon RDS can allow you to scale read-heavy workloads.

### Pillar Five: Cost Optimization

the ability to run systems to deliver business value at the lowest price point.

5 Design Principles

1. Adopt a consumption model
    - Pay only for the computing resources that you require and increase or decrease usage depending on business requirements.
    - Stopping test environments saves 75% cost
2. Measure overall eﬃciency
3. Stop spending money on data center operations
4. Analyze and attribute expenditure
    - transparent attribution of IT costs to individual workload owners.
    - This helps measure return on investment (ROI) and gives workload owners an opportunity to optimize their resources and reduce costs.
5. Use managed and application level services to reduce cost of ownership
    - remove the operational burden of maintaining servers for tasks such as sending email or managing databases.

4 Best Practices

1. Expenditure Awareness
    - Using AWS Budgets, you can send notiﬁcations if your usage or costs are not inline with your forecasts.
    - You can use tagging on resources to apply business and organization information to your usage and cost; this provides additional insights to optimization from an organization perspective.
    - Combining tagged resources with entity lifecycle tracking (employees, projects) makes it possible to identify orphaned resources or projects that are no longer generating value to the organization and should be decommissioned.
    - You can set up billing alerts to notify you of predicted overspending, and the AWS Simple Monthly Calculator allows you to calculate your data transfer costs.
2. Cost-Effective Resources
    - Using the appropriate instances and resources for your workload is key to cost savings.
    - **On-Demand Instances** allow you to pay for compute capacity by the hour, with no minimum commitments required.
    - **Reserved Instances** allow you to reserve capacity and oﬀer savings of up to 75% off On-Demand pricing.
    - With **Spot Instances**, you can leverage unused Amazon EC2 capacity and oﬀer savings of up to 90% off On-Demand pricing.
    - **Spot Instances** are appropriate where the system can tolerate using a ﬂeet of servers where individual servers can come and go dynamically, such as stateless web servers, batch processing, or when using HPC and big data.
    - Appropriate service selection can also reduce usage and costs; such as **CloudFront** to minimize data transfer, or completely eliminate costs, such as utilizing **Amazon Aurora** on RDS to remove expensive database licensing costs.
3. Matching supply and demand
    - you can automatically provision resources to match demand.
    - Auto Scaling and demand, buffer, and time-based approaches allow you to add and remove resources as needed.
4. Optimizing Over Time
    - Managed services from AWS can signiﬁcantly optimize the workload, e.g., running an Amazon RDS database can be cheaper than running your own database on Amazon EC2.

Key AWS Services

The tool that is essential to Cost Optimization is **Cost Explorer**, which helps you gain visibility and insights into your usage, across your workloads and throughout your organization.

1. Expenditure Awareness
    - **AWS Cost** Explorer allows you to view and track your usage in detail.
    - **AWS Budgets** notify you if your usage or spend exceeds actual or forecast budgeted amounts.
2. Cost-Effective Resources
    - use **Cost Explorer** for Reserved Instance recommendations, and see patterns in how much you spend on AWS resources over time.
    - Use **Amazon CloudWatch** and **Trusted Advisor** to help right size your resources.
    - You can use Amazon Aurora on RDS to remove database licensing costs.
    - **AWS Direct Connect** and **Amazon CloudFront** can be used to optimize data transfer.
3. Matching supply and demand
    - **Auto Scaling** allows you to add or remove resources to match demand without overspending.
4. Optimizing Over Time. AWS websites are resource.

## References

- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558)
