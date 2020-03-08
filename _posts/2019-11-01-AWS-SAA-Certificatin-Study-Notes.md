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

Only a subset of services.
knowledge will be the architecture, how they work together,
how to achieve well performaing, scaleable, secure and cost effective designs.

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

### Multi-Factor Authentication (MFA)

MFA requires you to verify your identity with both something you know and something you have.

### Key rotation

To protect your AWS infrastructure, access keys should be rotated regularly.

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

It's afully managed servcie, is MySQL-compatible our of the box and privides for increated reliability and performance over standard MySQL deployments.

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

  Partitioning a large relational database into multiple isntances or shards is a common technique for handling more requests beyond the capabilities of a single instance. It allows you to scal horizontally to handle more users and requests but requires additional logic in the application layer. The app needs to decide how to route database requests to the correct shard and becoems limited in the types of queri3es that can be performed across server bundaries. NoSQL database like Amazon DynamoDB or Cassandra are desinged to scale horizontally.

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

It's a fully managed NoSQL database service. Fast. Low-latency performance. Scales with ease.

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

Amazon SQS is a unique service designed by Amazon to help you decouple your infrastructure.

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

### DNS

The Internet Protocol (IP) address of your website is like your phone number—it could change if you move to a new area. DNS is like the phonebook. look you up by name in the phonebook. When a visitor wants to access your website, their computer takes the domain name typed in (www.amazon .com, for example) and looks up the IP address for that domain using DNS.

Amazon Route 53 is an authoritative DNS system.

#### Top-Level Domains (TLDs)

- Common TLDs are .com, .net, .org, .gov, .edu, and .io.
- Internet Corporation for Assigned Names and Numbers (ICANN) controls TLDs.
- Each domain name becomes registered in a central database, known as the **WhoIS** database.

#### IP Addresses

- Each IP address must be unique within its network. For public websites, this network is the entire Internet.
- **IPv4 addresses**: four sets of numbers separated by a dot, with each set having up to three digits. For example, 111.222.111.222
- Pv4 address range has quickly been depleted. **IPv6** was created to solve this depletion issue, it has an address space of 128 bits.

#### Hosts

- Within a domain, the domain owner can define individual hosts
- Web host: example.com, www.example.com
- API host (api.example.com)
- Files host: ftp.example.com, files.example.com

#### Subdomains

The difference between a host name and a subdomain is that a host defines a computer or resource, while a subdomain extends the parent domain. Subdomains are a method of subdividing the domain itself.

#### Fully Qualified Domain Name (FQDN)

##### Name Servers

A name server is a computer designated to translate domain names into IP addresses.

do most of the work in the DNS

#### Zone Files

A zone file is a simple text file that contains the mappings between domain names and IP addresses.

#### Domain Name System (DNS) Resolution

1. You type a domain name in broswer
2. It checks host file in your local computer, to see if it's domain name stores locally, if not
3. Check its DNS cache to see if you have visited the same site before, if not
4. contact a DNS server to resolve the domain name

#### A and AAAA

A record: map a host to an IPv4 IP address
AAAA record: map a host to an IPv6 address

#### Canonical Name (CNAME)

It is a type of resource record in the DNS that defines an alias for the CNAME for your server.

### Amazon Route 53

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

#### Hosted Zones

A hosted zone is a collection of resource record sets hosted by Amazon Route 53.

It represents resource record sets that are managed together under a single domain name. Each hosted zone has its own metadata and configuration information.

The resource record sets contained in a hosted zone must share the same suffix.

two types of hosted zones: private and public.

- **private hosted zone**: a container that holds information about how you want to route traffic for a domain and its subdomains within one or more Amazon Virtual Private Clouds (Amazon VPCs)
- **public hosted zone**: a container that holds information about how you want to route traffic on the Internet for a domain and its subdomains

Use an alias record, not a CNAME, for your hosted zone. CNAMEs are not allowed for hosted zones in Amazon Route 53.

#### routing policies

- Simple: Most commonly used when you have a single resource that performs a given function for your domain.
- Weighted: When you want to route a percentage of your traffic to one particular resource or resources.
- Latency-Based—Used to route your traffic based on the lowest latency so that your users get the fastest response times
- Latency-based routing allows you to route your traffic based on the lowest network latency for your end user (for example, using the AWS region that will give them the fastest response time). Use it when:
  - you have resources that perform the same function in multiple AWS Availability Zones
  - regions and you want Amazon Route 53 to respond to DNS queries using the resources that provide the best latency.
- Geolocation routing lets you choose where Amazon Route 53 will send your traffic based on the geographic location of your users. Geolocation works by mapping IP addresses to locations. It uses geolocation routing to restrict distribution of content to only the locations in which you have distribution rights.

### In Memory Caching

successful application: fast and responsive user experience.
Caching is one of the most importance performance optimizations. E.g., app session state for a large website can be stored in an in-memory caching engine.
two engines:

- Memcached: key/value store that can be used to store arbitrary types of data.
- Redis: can be used as a cache, database, or message broker.

### Amazon ElastiCache

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

Amazon CloudFront is a global Content Delivery Network (CDN) service,Amazon CloudFront is AWS CDN, and it's AWS CDN.

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

## References

- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558)
