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

## Amazon elastic Block Store, Amazon EBS

Instance stores, like S3, have their limitations. Amazon EBS provides durable block storage for use with Amazon EC2 instance.

### Types of Amazon EBS Volumes

It varies in areas like underlying hardware, performance, and cost.

1. Magnetic volumes
    - lowest cost
    - lowest performance
    - size: 1GB - 1TB
    - average 100 IOPS
    - Best for:
      - workloads where data is accessed infrequently,
      - Sequential reads,
      - requires low-cost storage

2. General Purpose SSD
    - cost effective storage, strong performance at a moderate price, suitable for a wide range of workloads
    - size: 1GB - 16TB
    - a baseline performance of three IOPS per gig provisioned, capping at 10,000 IOPS
    - whenever you are not using your IOPS, they're accumulated as IO credits.
    - For workloads:
        - System boot volumes
        - Small to medium sized databases
        - Development and test environments

3. Provisioned IOPS SSD
    - For IO intensive workloads. databse workloads that are sensitive to storage performance and consistency in random access IO throughtput
    - size: 4GB - 16TB
    - Additional monthly fee is applied based on  the number of IOPS provisioned, whether they are comsumed or not.
    - Best for:
      - Critical business applications that require sustained IOPS performance
      - Large databse workloads

### Amazon EBS-Optimized Instances

Use Amazon EBS-optimized isntances to ensure that Amazon EC2 instance is prepared to take advantage of the IO.

need to pay additional hourly charge for that instance.

### Protecting Data

You back up data by taking snapshots. it's incremental backups, only most recent changed blocks are saved.

You recover data by detach the volume from the failed instance and attach the backed up one.

You can create avolume fro ma snapshot. Best practice is to initialize a volume created fro ma snapshot by accessing all the blocks in the volume.

## Amazon Virtual Private Cloud, Amazon VPC

Amazon VPC is a custom-defined virtual network within the AWS Cloud.
It's the networking layer for Amazon EC2, and it allows you to build your own virtual network within AWS.

In your Amazon, VPC, uou can control:

1. Selecting your own IP address range
2. creating your own subnets and configuring your own route tables
3. network gateways
4. security settings

When you create an Amazon VPC, you must specify the IPv4 address range by choosing a Classless Inter-Domain routing block, CIDR, such as `10.0.0.0/16`. The address range cannot be changed after the VPC is created.

Amazon VPC Components

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

### Subnets

It's a segment of an Amazon VPC's IP address range where you can place groups of isolated resources.
Subnets are defined by CIDR blocks, are cotnained within an Availability zone.

Can be public, private or VPN-only.

1. public: the associated route table directs the subnet's traffic to  the amazon VPC's IGW.
2. private: the associated route table doesn't direct the subnet's traffic to the Amazon VPC's IGW
3. VPN-only: the associated route table directs the subnet's traffic to the Amazon VPC's VPG and doesn't have a route to the IGW.

### Rotue table

- A logical construct within an Amazon VPC that contians a set of rules (called routes)that are applied to the subnet and used to determine where network traffic is directed.
- You can use route tables to specify which subnets are public, which are private.
- The router also enables subnets, IGWs and VPGs to communicate with each other.

### IGW

It's horizontally scaled, redundant and highly available Amazon vPC component that allows communication between instances in your Amazon VPC and the Inernet.

An IGW provides a target in your Amazon VPC route tables for Internet-routeable traffic, and it performs network address translation for instances that have been assigned public IP address.

### DHCP

Allows ytou to direct Amazon EC2 host name assignment to your own resources.

### EIP

A static, public IP address in the pool for the region that you can allocate to your account and release.

It allows you to maintain a set of IP addresses that remain fixed while the underlying infrastructure may change over time.

### VPC endpoint

It enables you to create a private connection between your Amazon VPC and another AWS service without requiring access over the Internet or through a NAT isntance, VPN connection, or AWS Direct Connect.

### VPC peering

It's a networking connection between two Amazon VPCs that enabled instances in either Amazon VPC t o communicate with each otehr as if they were within the same network.

### security group

It's avirtual stateful firewall that controls inbound and outbound traffic to Amazon EC2 instances.

### network ACL

It's another layer of security that acts as a stateless firewall on a subnet level.

### NAT instance

It's a customer-managed isntances that is designed to accept traffic from instances within a private subnet, translate the source IP address to the public IP address of the NAT instance and forward the traffic to the IGW.

### NAT getway

It's an AWS-managed service that is designed to accept traffic from instances within a private subnet, traslate the source IP address to the public IP address of the NAT gateway and forward the traffic to the IGW.

### VPG & CGW

A VPG is the VPN concentrator on the AWS side of the VPN connection between the two networks. A CGW represents a physical device or a software application on the customer’s side of the VPN connection. The VPN connection must be initiated from the CGW side, and the connection consists of two IPSec tunnels.

## ELB, Amazon CloudWatch, Auto Scaling

ELB, Amazon CloudWatch and Auto Scaling allows you to maintain the availability of your Applications by scaling Amazon EC2 capacity up or down in accordance with conditions you set.

### Elastic Loading Balancing

ELB is a highly available service that distributes traffic across Amazon EC2 instances and includes options that provideflexibility and control of incoming requests tot Amazon EC2 instances.

Types of Load Balancers

1. internet-facing load balancers.
    It receives a public DNS name that clients can use to send requests to your application. The DBS servers resolve the DBS name to your load balancer's public IP address.

    it's best practice to reference a load balancer by its DNS name, instead of by the IP address of the load balancer, in order to provide a single, stable entry point.

2. internal load balancers.
    Works in EC2 VPCs with private subnets

3. Https load balancers
    In order to use SSL, you must install an SSL certificate on the load balancer that it uses to terminate the connection and then decrypt requests from clients before endign requests tot the back-end Amazon Ec2 isntances.

Listeners proteocols: HTTP, HTTPS, TCP, SSL

Configuring Elastic Load Balancing

- **Idle Connection Timeout**: for each request that a client makes through a load balancer, the load balancer maintains two connection. One is with the client and the other is to the backend. By default, the timeout is 60 seconds for both connection.

- **Cross-Zone load Balancing**: it's recommended t hat you maintain approximately equivalent numbers of instancesin each Availibility Zone for higher fault tolerance.

- **Connection Draining**: Enable it to ensure that the load balancer stops sending requests to instances that are deregistering or unhealthy, while keeping the existing connections open.

- **Procy Protocol**: Enable it, a human readable header is added tothe request header with connection information.

- **Sticky Sessions**: It enables loading balander tot cind a user'ssession to a specific instance, and insures that all requests fro mthe user during the session are snet to the same instance.

- **Health Checks**: The status of the isntances that are healthy at the time of the health check is inServcie, otherwise is outOfService. A health check is a ping, a conenction attempt, or a page that is checked periodically.

### Amazon CloudWatch

It monitors AWS resources and applications in real time. It collects and tracks metrics, create alarms that send notifications, and make changes to the resources being monitored based on rules you define.

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

## References

- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558)
