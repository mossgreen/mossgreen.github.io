---
title: AWS SAA Certification Study Notes
search: true
tags:
  - AWS
  - SAA Certificatin
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

AWS Certified Solutions Architect - Associate SAA-C03

Only a subset of services.
knowledge will be the architecture, how they work together,
how to achieve well performaing, scaleable, secure and cost effective designs.

## Key Concepts

### Durability and Availability

- **Durability** addresses the question, “Will my data still be there in the future?”
- **Availability** addresses the question, “Can I access my data right now?”

Amazon S3 is designed to provide both very high durability and very high availability for your data.

Amazon S3 standard storage is designed for 99.999999999% durability and 99.99% availability of objects over a given year.

### High availability VS Fault tolerance

- **High availability**:

  - hardware, software and configuration that allowing a system to recover quickly in the event of a failure.
  - The key part is the recover quickly.
  - It doesn't prevent a failure from occurring and it doesn't stop that failure from impacting customers.
  - The primary aim of high availability is to minimize downtime and recover quickly.
  - It aims to minimize downtime and recover quickly in the event of a failure.
  - E.g., for a car, if one tyre broken, we have a backup tyre, it may break down, but can be fix quickly

- **Fault tolerance**:
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

### Availability Zones vs. AWS regions

Regions

- AWS infrastructure Regions meet the highest levels of security, compliance, and data protection.

AZs

- highly available, fault tolerant, and scalable.
- AZs are within 100 km (60 miles) of each other.

## Amazon Services in SAA

1. Compute and Networking Services

   - Amazon EC2 ★★
   - Elastic Load Balancing ★★
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

- traditional IT environments, 2 ways:

  1. block storage: operates at a lower level, the raw storage device level and amnages data as a set of numberred, fixed size blocks.
  2. file storage: operates at a higher level, the operating system level, and manages data as a named hierarchy of files and folders.

- Amazon S3 object storage is cloud object storeage

  1. data is manged as objects using an API with http verbs. operating on the whole object at once, cannot incrementally updateing portions of the object as you do with a file.
  2. objects reside in containers called buckets and each object is identified by a unique user-specified key (filename).

Note:

If you need the traditioanl block or file storage in addition tot Amazon S3 storage,

1. you can use Amazon EBS for EC2 instances
2. Amazon Elastic File systems (AWS EFS) provices network-attached shared file storage using the NFX v4 protocol.

Amazon EFS provides a simple, scalable, elastic file system for Linux-based workloads for use with AWS Cloud services and onpremises resources.

It is designed to provide massively parallel shared access to thousands of Amazon EC2 instances, enabling your applications to achieve high levels of aggregate throughput and IOPS with consistent low latencies.

Amazon EFS is a regional service storing data within and across multiple Availability Zones (AZs) for high availability and durability.

### AWS S3 Buckets

1. Buckets are a simple flat structure. You can have multiple buckets, but cannot have a sub-bucket.
2. A bucket can store an unlimited number of files.
3. Files are automatically replicated on multiple devices in multiple facilities, **within a region**.
4. Bucket names are glocal, must be unique across all AWS accounts.
5. can contain up to 63 lowercase letters, numbers, hyphens, and periods.
6. Best practice: use bucket names that contain your domain name and conform to the rules for DNS names. It ensures that your bucket names can be used in all reqioins and can host static websites.
7. For each bucket you can choose a particular place that close to your user to minimize latency, or apply compliance.

AWS S3 Objects

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

### Amazon S3 Object Versioning

Versioning is a feature allowing multiple versions of an object to exist in an S3 bucket. Versioning needs to be enabled at a bucket level, meaning every object is given an object ID. When objects are deleted, a version ID is added rather than actually deleting the object.

Once Versioning is enalbed on an S3 bucket, any operations that would otherwise modify objects generate new versions of that original object. Once a bucket is version-enabled, it can never be fully switched off - only **suspended**.

With versioning enabed, an AWS account is billed for all versions of all objects. Object deletions by default don't delete an object - instead, a delete marker is added to indicate the object can be accessed using the object name and a version ID. Specific version can be deleted.

**MFA delete** is a feature designed to prevent accidental deletion of objects. Once enabled, a one-time password is required to delete an object version or when changing the versioning state of a bucket.

### Amazon S3 Permissions

Bucket authorization within S3 is controlled using:

- identity policies on AWS identities
- bucket policies in the form of resource policies on the bucket
- bucket or object ACLS

Final authorization is a combination of all aplicable policies. priority order is:

1. Explicit Deny
2. Explicit Allow
3. Implicit Deny

When to use IAM policies vs. S3 policies

- Use IAM policies if:
  - you need to control access to AWS servcies other than S3.
  - You have numerous S3 buckets each with different permissions requirements.
  - You prefer to keep access control policiesin the IAM environment
  - intereset in **"what can this user do in AWS? "** use IAM policies.
- Use S3 bucket policies if:
  - You want a simple way to grant **croll-acount access** to your S3 environment, without using IAM roles.
  - Your IAM policies bump up against the size limit.
  - You prefer to keep access control policies in the S3 environment.
  - intereset in **"Who can acess this S3 bucket"**, use S3 bucket policies.

### Uploads data to Amazon S3 buckets

It can be done using: S3 console, CLI, directly using the APIs. Uploads either use a single operation (PUT) or multipart upload.

- Single PUT upload: object is uploaded i na single stream of data. Limit of 5 GB, can cause performance issues, and if the upload fails the whole upload fails.
- Multipart upload:
  - An object is broken up into parts (up to 10,000), each part is 5MB to 5 GB, and the last part can be less.
  - Multipart upload is faster, and the individual parts can fail and be retried individually.
  - AWS recommends multipart for anything over 100 MB, but it's required for anything beyond 5 GB.
  - better network utilization through parallel transfers
  - the ability to pause and resume
  - should use multipart upload for objects larger than 10M
  - must use for objects larger than 5G
  - Object lifecycle policy on a bucket to abort incomplete uploads after a specified number of days.

### Amazon S3 Static Website Hosting

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

Cross-origin Resource Sharing (CORS)

CORS is a security measure allowing a web application running in one domain to reference resources in another.

### Amazon S3 Storage Classes

All objects within a S3 bucket use a storage class, known as a storage tier. Storage classes influence the cost, durability, availability, and "first byte latency" for objects in S3. The class used for an object can be changed manually or using lifecycle policies.

- **S3 Standard**
  - for general-purpose storage of frequently accessed data
  - Default, all-purpose storage or when usage is unknown
  - 11 Nines durability and four Nines availability
  - Replicated in 3+ AZs - no minimum object size or retrieval fee

- **Standard Infrequent Access (Standard-IA)**
  - Objects where real-time access is required but infrequent
  - 99.9% availability, 3+ AZs replication, cheaper than Standard
  - 30-day and 128KB minimum charges and object retrieval fee

- **Amazon S3 One Zone-Infrequent Access (S3 One Zone-IA)**
  - Non-critical and/or repreducible objects
  - 99.5% availability, one 1 AZ, 30 day and 128KB minimum charges
  - cheaper than standard IA

- **Glarcier**
  - Long-term archival storage 9warm or cold backups)
  - Retrievals could take minutes or hours (faster = higher cost)
  - 3+ AZ replication, 90-day and 40KB minimum charge and retrieval

- **Glacier Deep Archive**
  - Long-term archival (cold backups) - 180 day and 40KB Minimum
  - Longer retrievals but cheaper than Glacier -replacement for tape-style storage

- **Amazon S3 Intelligent-Tiering (S3 Intelligent-Tiering)**
  - for data with unknown or changing access patterns
  - designed to optimize costs by automatically moving data to the most cost-effective access tier, without performance impact or operational overhead.
  - It works by storing objects in two access tiers: one tier that is optimized for frequent access and another lower-cost tier that is optimized for infrequent access.
  - Small monthly monitoring and auto-tiering fee

NB:

- Lifecycle policies allow objects or versions to be transitioned between storage classes or expired when no longer required.
- **S3 and S3-IA has the same retrieval time**. The diff is that you are charged for retrieval. Availability is 99.99 vs 99.9

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

Lifecycle Configuration VS Lifecycle Policy

You can use **lifecycle policies** to define actions you want Amazon S3 to take during an object's lifetime (for example, transition objects to another storage class, archive them, or delete them after a specified period of time).

### Amazon S3 Encryption

Data between a client and S3 is encrypted **in transit**. Encryption at rest can be configured on a per-object basis.
S3 is capable of encrypting objects — either allowing the customer to manage keys or providing an end-to-end solution.

- **Client-side encryption**
  - The client/application is responsible for managing both the encryption/decryption process and its keys.
  - This mothed is generally only used when strict security compliance is required
  - it has significant admin and processing overhead.
- **Server-side encryption with customer-managed keys (SSE-C)**
  - You manage both data key and master key
  - S3 handles the encryption and decryption process.
  - keys must be supplied with each PUT or GET erquest.
- **Server-side encryption with S3-managed keys (SSE-S3)**
  - AWS manages both data key and master key
  - objects are encrypted using AES-256 by S3.
  - The keys are generated by S3 suing KMS on your behalf.
  - keys are stored with object in an encrpted from.
  - If you have permissions on the object (e.g., S3 read or S3 admin), you can decrypt and access it.
- **Server-side encryption with AWS KMS-manged keys (SSE-KMS)**
  - AWS manages data key and you manage master key
  - Objects are encrypted suing individual keys generated by KMS.
  - Encrypted keys are stored with the encrypted objects.
  - Decryption of an object needs both S3 and KMS key permissions (role separation)

Bucket Default Encryption

Objects are encrypted in S3, not buckets. Each PUT operation needs to specify encryption and type or not. A bucket default captures any put operations where no encryption method/directive is specified. It doesn't enforce that type can and cannot be used. Bucket policies can enforce.

Bucket policy vs. Default encryption

- Bucket policy only prevents users from uploading unencrypted objects. That is to say, users MUST encrypt the objects **before** uploads.
- While enabling default encryption allows users to upload unencrypted objects to S3 while Amazon encrypts all the objects uploaded to the S3 bucket.

### Amazon S3 Presigned URLs

All Amazon S3 objects by default are private, meaning that only the owner has access. The owner can share objects with others by creating a pre-signed URL, using their own security credentials to grant time-limited permission to download the objects.

Presigned URLs allow access to objects on a temporary basis. They are created, and the bearer of the URL has the same level of authorization as the creator.

A presigned URL can be created by an identity in AWS, providing access to an object using the creator's access permissions. When the presigned URL is used, AWS verifies the creator's access to the object - not yours. The URL is encoded with authenticatin built in and has an expiry time.

Prisigned URLs can be used to download or upload objects.

Any identity can create a presigned URL - even if that identity doesn't have access to the object.

example presigned URL scenarios:

- Stock images website - media stored privately on S3, presigned URLgenerated when an image is purchased.
- Client access t oupload an image for process to an S3 bucket

When using presigned URLs, you may get an error. Some common situations include:

- the presigned URL has expired - seven-day maximum
- the premission of the creator of the URL has changed
- the URL was created usign a role (360hour max) and the role's temporary credentials have expired (aim to never create presigned URLs using roles)

To enable it, you must provide

1. your security credentials and
2. specify a bucket name,
3. an object key,
4. the HTTP method (GET to download the object),
5. and an expiration date and time.

This is particularly useful to protect against “content scraping” of web content such as media files stored in Amazon S3.

### Cross-region replication

Asynchronously replicate to another region, includes metadata and ACLs.

By default, replicated objects keep their:

- Storage class
- Object name (key)
- Owner
- Object permissions

Replication configuration is applied to the source bucket, and to do so requires versioning to be enabled on both buckets. Replication requires and IAM role with permissions to replicate objects. With the replication configuration, it's posiible to override the storage class and object permissions as they are written to the destination.

Excluded from Replication

- System actions (lifecycle events)
- Any existing objects from before replciation is enabled
- SSE-C encrypted objects - only SSE-S3 and (if enabled) KMS encrypted objects are supported

To enable cross-region replication:

1. **versioning** must be turned on for both source and destination buckets,
2. you must use an IAM policy to give Amazon S3 permission to replicate objects on your behalf.

Commonly used to:

1. reduce the latency required to access objects in Amazon S3 by placing objects closer to a set of users
2. meet requirements to store backup data at a certain distance from the original source data.

A second region does not significantly increase durability.

### Amazon S3 Logging

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

## Amazon Glacier

- Extremely low-cost, durable, 11 Nines.
- designed for infrequently accessed data
  - data archiving, long term backup
  - archived for compliance purpose

### Glacier Archive Retrieval Options

- Expedited: occasional urgent requests for a subset of archives are required, largest archives 250 MB. 1-5 minutes.
- Standard: access any of your archives within 3-5 hours. Default option.
- Bulk:  lowest-cost retrieval option. within 5-12 hours.

## Elastic File System, EFS

- It is an AWS-managed implementation of the Network File System (NFS).
- It's an implementation of the Newwork file System (NFSv4) delivered as a service.
- File systems can be created and mounted on multiple Linux instances **at the same time**.

Examp points

EFS is an implementation of the NFSv4 protocal within AWS. Use EFS when you need a file system that can be accessed from multiple instances (e.g., shared media, home folders, documentation, shared logs).

- Its base entity is a file system
- The file system is accessed via "mount targets" that are placed in subnets inside a VPC and have an IP address.
- The file system is "mounted" on Linux instances. (**important:** EFS is current only supported in Linux)
- File system are accessbible from a VPC or from on-premises locations via a VPN or Direct Connect.

EFS has two performance modes:

1. **General Purpose**: the default and suitable for 99% of needs
2. **Max IO**: designed for when a large number of instances needs to access the file system

EFS has two throughput modes:

1. **Bursting Throughput**: 100 MB/s base curst. 100 MB/s per 1TB. Earning 50 MB per TB of storage.
2. **Provisioned Throughtput**: allows control over throughput independently of file system size.

Security groups are used to control access to NFS mount targets

EFS supports two storage classes: **Standard** and **Infrequent Access (IA)**.
Lifecycle management is used to move files between classes baed on access patterns.

### EFS VS EBS

|  | EFS | Amazon EBS Provisioned IOPS |
|---|---|---|
|type |file storage service   | block level storage |
| Per-operation latency Low|consistent latency| Lowest, consistent latency|
| Throughput scale|10+ GB per second| Up to 2 GB per second|
| Availability and durability| Data is stored redundantly across multiple AZs|Data is stored redundantly in a single AZ|
|Access  |Up to thousands of Amazon EC2 instances, from multiple AZs, can connect concurrently to a file system|A single Amazon EC2 instance in a single AZ can connect to a file system|
| Use cases |- Big data and analytics, <br/>- media processing workflows, <br/>- content management, <br/>- web serving, <br/>- home directories.|- Boot volumes, <br/>- transactional and NoSQL databases, <br/>- data warehousing, <br/>- ETL|

## Amazon CloudFormation

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

### Amazon EC2 Dedicated Hosts

**Dedicated Host** gives you additional visibility and control over how instances are placed on a physical server, and you can consistently deploy your instances to the same physical server over time.

As a result, Dedicated Hosts enable you to use your existing server-bound software licenses and address corporate compliance and regulatory requirements.

Benefis:

1. Save money on licensing costs
2. Help meet corporate compliance requirements

Comparing Dedicated Hosts to Dedicated Instances

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

### EC2 Instance Lifecycle

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

### EC2 Instance options

three price options:

1. On-Demand Instances
   - The most flexible pricing
   - requires no up-front commitment
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

### Spot Instance interruptions

Reasons for interruption

1. price
2. Capacity – If there are not enough unused EC2 instances to meet the demand for Spot Instances
3. Constraints – If your request includes a constraint such as a launch group or an Availability Zone group, these Spot Instances are terminated as a group when the constraint can no longer be met.

Stopping interrupted Spot Instances Requirements:

1. For a Spot Instance request, the type must be `persistent`.
2. For an EC2 Fleet or Spot Fleet request, the type must be `maintain`.
3. The root volume must be an `EBS volume`, not an instance store volume.

After a Spot Instance is stopped by the Spot service, only the Spot service can restart the Spot Instance, and the same launch specification must be used.

### Amazon EC2 Instance Store

- temporary block-level storage for your EC2 instance.
- This storage is located on disks that are physically attached to the host computer.

Ideal for

- temporary storage of information that changes frequently, such as buffers, caches, scratch data
- other temporary content
- data that is replicated across a fleet of instances, such as a load-balanced pool of web servers.

## Amazon Elastic Block Store, Amazon EBS

### Why you want to use EBS for EC2

**Amazon EC2** Instance Stores are low-durability, high-IOPS storage that is included **for free** with the hourly cost of an instance. **Data is lost when the instance stops**.

**Amazon EBS** provides **durable block storage** for use with Amazon EC2 instance.

- Amazon EBS allows you to create storage volumes and **attach them to Amazon EC2 instances**.
- Once attached, you can **create a file system on top of these volumes**, run a database, or use them in any other way you would use block storage.
- **Volumes are persistent**, can be attached and removed from EC2 instances, and are replicated within a single AZ.
- EBS supports a maximum per-instance throughput of 1,750MiB/s and 80,000 IOPS.
- If you need more... use **Amazon EC2 Instance Store**.

### Amazon EBS Volumes Types

Two major categories: see link

1. SSD-backed storage: gp2, io1
   - for transactional workloads, such as databases and boot volumes (performance depends primarily on IOPS)
   - the **highest performance Provisioned IOPS SSD (io1)**
     - for latency-sensitive transactional workloads, can adjust size and IOPS seperately
     - provides **sustained performanc**e for mission-critical low-latency workloads
   - **Default, General Purpose SSD (gp2)**
     - balance price and performance for a wide variety of transactional data.
     - provide **bursts of performance** up to 3,000 IOPS and have a maximum baseline performance of 10,000 IOPS for volume sizes greater than 3.3 TB.

2. HDD-backed storage: sc1, st1
   - for throughput intensive workloads, such as MapReduce and log processing (performance depends primarily on MB/s).
   - Throughput Optimized HDD (st1): low cost, frequently accessed, throughput intensive, cannot be a boot volume
   - the lowest cost Cold HDD (sc1): low cost, infrequest access, cannot be boot volume

Details:[Amazon EBS volume types link](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html)

|Type  |  EBS Provisioned IOPS SSD (io1)  |  EBS General Purpose SSD (gp2)*  | Throughput Optimized HDD (st1)|  Cold HDD (sc1)|
|---|---|---|---|---|
| Description  | Highest performance   | General Purpose  | frequently accessed  | less frequently accessed |
| Use Cases  | I/O-intensive DB  | Boot volumes, others  | Big data, processing  | Colder data  |
| Volume Size  | 4 - 16 TB  |1 - 16 TB| 0.5 - 16 TB  |  0.5 - 16 TB |
|Max IOPS**/Volume   | 64,000  | 16,000  | 500  | 250  |
|Max Throughput***/Volume |1,000 MB/s   | 250 MB/s  |500 MB/s    | 250 MB/s|
|Max IOPS/Instance |80,000  |80,000  |80,000    |80,000||Max Throughput***/Volume |1,000 MB/s   | 250 MB/s  |500 MB/s    | 250 MB/s|

### EBS Snapshots

EBS volumes occupy a single Availability Zone (AZ), and while they do replicate within this AZ, this replication isn’t shared to other AZs. This makes EBS volumes vulnerable to AZ failure. EBS snapshots not only provide data backup capabilities but also enable you to move your data to other AZs and regions.

EBS snapshots are a point-in-time backup of an EBS volume stored in S3.
The initial snapshot is a full copy of the volume.
Future snapshots only store the data change since the last snapshot.

Snapshots can be used to create new volumes and a great way to move or copy instances between AZs.
When creating a snapshot of the root/boot volume of an instance or budy volume, it's recommended that instance is powered off, or disks are "flused".

Snapshots can be copied between regions, shared, and automated using Data Lifecycle Manager (DLM).

Volume encryption uses EC2 host hardware to encrypt data at rest and in transit between EBS and EC2 instances. Encryption generates a data encryption key (DEK) from a customer master key (CMK) in each region. A unique DEK encrypts each volume. Snapshots of that volume are encrypted with the same DEK, as are any volumes created from that snapshot.

## Amazon Serverless Compute

A microservices architecture is the inverse of a monolithis architecture. Instead of having all system functions in one codebase, components are separated into microservices and operate independently. A microservice does one thing - and does it well. Operations, updates, and scaling can be done on a per-microservice basis.

When using an **event-driven architecture**, a system operates around "events" that represent an action or a change of state, e.g., a button being clicked, a file being uploaded, or a temperature dropping below a certain level. it's efficient because events are generated and pushed, rather than things being polled. Polling requires always-on compute and doesn't scale well.

### Baas VS Faas VS AWS Lambda

Serverless architecture consists of two main principles, including Baas and Faas.

1. Baas, Backend as a Service, using 3rd party services where possible rather than running your own. Examples include Auth0 or Cognito for authentication and Firebase or DynamoDB for data storage.

2. Faas, Function as a Service, using an event-driven architecture to provide application logic. These functions are only active (invoked) when they are needed (when an event is received)
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

## Amazon Elastic Container Service, ECS

- A **container** is a package that contains an application, libraries and file system required to run it.
- Contianers run on a **container engine** which generally runs within a single OS sunch as Linux. Containers provide the isolation benefits of virtualisation - but are more lightweight allowing faster starts and more dense packing within a host.
- An image is a collection of file system layers. Docker file system are differential - each layer stores differeces from previous layers.
- A populat contianer enginer is Docker and is the basis for ECS.
Amazon ECS is a fully managed container orchestration service.

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

### ECS use case

1. Hybrid deployment
2. Machine learning
3. Batch processing
4. Web applications

## Amazon Virtual Private Cloud, VPC

### Sever Layer OSI Model

It provides a good overview of how networking works at all levels of abstraction. Each layer uses the layers below and adds additional capabilities. Data between two devices moves down the stack at the A side (and wrapped at each layer) ... is transmitted .. before moving up the stack at the B side (and the wrapping stripped at each stage). This process is called encapsulation.

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

IP Classes have a number of ranges within then used for private networking only:

- 10.0.0.0 to 10.255.255.255 private networking within the Class A range.
- 172.16.0.0 to 172.31.255.255 private networking within the Class B range 916 class B networks)
- 192.168.0.0 to 192.168.255.255 private networking within the Class C range 9256 Class C networks)
  There ranges are often used on private business networks, cloud networks and home networks.

**CIDR**, Classless Inter-Domain Routing is used for IPv4 IP Networking rather than the Class system. It allows more effective allocation and sub networking.

Either you are allocated a network range to use, or you decided on it. It will be represented as network/prefix, e.g., 10.0.0.0/16.

The network address is your starting point. The prefix is the number of bits the network uses, the remaining bits, the node part is yours to use. The node (or host) partis yours from all 0's to all 1's.

### Subnetting

Subnetting is the process of breaking a network down into smaller sub-networks. You might be allocated a public range for your business, or decided on a privte range for a VPC. Subnetting allows you to break it into smaller allocations for use in smaller networks, e.g., VPC subnets.

If you pick 10.0.0.0/16 for your VPC. It's a single network from 10.0.0.0 to 10.0.255.255 and offers 65,536 addresses. That VPC could have a single subnet within it also 10.0.0.0/16.

With a certain size of VPC, increasing the prefix creates 2 smaller sized networks. Increasing again, creates 4 even smaller networks. Increasing again creates 8 even smaller and so on.

For instance:

10.0.0.0/60 - 10.0.0.0/17 - 10.0.0.0/18 - 10.0.64.0/18 - 10.0.128.0/17 `<-- 128 = 256/2 - 10.0.128.0/18 - 10.0.192.0/18`

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

- A RT is a colelction of routers that are used when traffic from a subnet arrives at the VPC router.
- Every route table has a local route, which matches the CIDR of the VPC and lets traffic be routed between subnets.
- A route cotnians a destination and a target. Traffic is forwared to the target if its destination matches the route destination.
- If nultiple routes apply, the most specific is chosen. A /32 is chose before a /24, before a /16.
- Default routes (0.0.0.0/0 v4 and ::/0 v6) can be added that match any traffic not already matched.
- Targets can be IPs or AWS networking gateways/objects
- A subnet is a public subnet if it's
- configured to allocate public IPs
- if the VPC has an associated internet gateway
- if that subnet has a default route to that internet gateway.

### Amazon VPC components

- **Subnet**: A subnet is a range of IP addresses in your VPC, where you can place groups of isolated resources
- **Internet Gateway**: The Amazon VPC side of a connection to the public internet.
- **NAT Gateway**: a highly available, managed **Network Address Traslation (NAT)** servcie for your resource in a private subnet to access the internet.
- **Virtual private gateway**: The Amazon VPC side of a VPN connection.
- **Peering Conenction**: A peering connection enables you to route traffic via private IP address between two peered VPCs.
- **VPC Endpoints**: Enables private connectivity to services hosted in AWS, from within your CPC without using an Internet Gateway, VPN, NAT devices, or firewall proxies.
- **Egress-only Internet Gateway**: A stateful gatewy to provide egress only access for IPv6 traffic from the VPC to the internet.

### VPC use scenarios

[Examples for VPC link](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenarios.html)

1. VPC with a single public subnet only
2. VPC with publci and private subnets
3. VPC with public and private subnets and AWS Site-to-Site VPN access
4. VPC with a private subnet only and AWS Site-to-Site VPN access

### Bastion Hosts, or Jumpboxes

- A host that sits at the perimeter of a VPC
- It functions as an entry point to the VPC for trusted admins.
- Allows for updates or configuration tweaks remotely while allowing the VPC to stay private and protected
- Generally connected to via SSH or RDP
- Bastion hosts must be kept updated, and security hardened and audited regularly
- Multifactor authentication, ID federation, and/or IP blocks.

### Network address translation, NAT

You can use a NAT device to enable instances in a private subnet to connect to the internet (for example, for software updates) or other AWS services, but prevent the internet from initiating connections with the instances.

Redirect process:

1. When traffic goes to the internet, the source IPv4 address is replaced with the NAT device’s address
2. when the response traffic goes to those instances, the NAT device translates the address back to those instances’ private IPv4 addresses.

Two types of NAT devices:

1. NAT instance: It's a customer-managed instances.
2. **NAT getway (recommend)**: an AWS-managed service, better availability and bandwidth

Static VS dynamic NAT

- Static NAT: A private IP is mapped to a public IP (what IGWs do). the process of 1:1 translation where an internet gateway converts a private address to a public IP address.
- Dynamic NAT: A range of private addresses are mapped onto one or more public (used by your home router and NAT gateways). Dynamic NAT is a variation that allows many private IP addresses to get outgoing internet access using a smaller number of public IPs (generally one). Dynamic NAT is provided within AWS using a NAT gateway that allows private subnets in an AWS VPC to access the internet.

### Security Group

It's a virtual stateful firewall that controls inbound and outbound traffic to Amazon EC2 instances.
You can specify allow rules, but not deny rules. This is an important difference between security groups and ACLs.

Default security group:

- allows communication between all resources within the security group,
- allows all outbound traffic, and
- no inbound traffic is allowed until you add inbound rules to the security group.
- denies all other traffic.

### Network Access Control List, NACLs

It's another layer of security that acts as a stateless firewall on a subnet level.

- NACLs operate at layer 4 of the OSI model (TCP/UDP and below).
- A subnet has to be associated with a NACL - either the VPC default or a custom NACL
- NACLs only impact traffic crossing the boundary of a subnet.
- NACLs are collections of rules that can explicitly **allow** or **deny** traffic based on its protocaol, port range, and source/destination
- Rules are processed in number order, lowest first. When a match is found, that action is taken and processing stops.
- The `*` rule is processed last and is an implicit deny.
- NACLs have two sets of rules: **inbound** and **outbound**.

Security Group VS. ACLS

| Security Group                                                             | Network ACLs                                                                                                                                                             |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Operates at the instance level (first layer of defense)                    | Operates at the subnet level (second layer of defense)                                                                                                                   |
| Supports allow rules only                                                  | Supports allow rules and deny rules                                                                                                                                      |
| Stateful: Return traffic is automatically allowed, regardless of any rules | Stateless: Return traffic must be explicitly allowed by rules.                                                                                                           |
| AWS evaluates all rules before deciding whether to allow traffic           | AWS processes rules in number order when deciding whether to allow traffic.                                                                                              |
| Applied selectively to individual instances                                | Automatically applied to all instances in the associated subnets; this is a backup layer of defense, so you don’t have to rely on someone specifying the security group. |

Ephemeral Ports:

- When a client initiates communications with a server, its to a well-known port number (e.g., tcp/443) on that server.
- The response is from that well-known port to an ephemeral port on the client. The client decides the port.
- NACLs are stateless, they have to consider both initiating and response traffic - state is a session-layer concept.

A use case:

Q: [I host a website on an EC2 instance. How do I allow my users to connect on HTTP (80) or HTTPS (443)?](https://aws.amazon.com/premiumsupport/knowledge-center/connect-http-https-ec2/)

Answer:

1. Security group rules
    - in bound:
      - For HTTP traffic, add an inbound rule on port 80 from the source address 0.0.0.0/0.
      - For HTTPS traffic, add an inbound rule on port 443 from the source address 0.0.0.0/0.
      - To allow IPv6 traffic, add inbound rules on the same ports from the source address ::/0
    - Out bound:
      - security groups are stateful, the return traffic from the instance to users is allowed automatically, so you don't need to modify the security group's outbound rules.
2. Network ACL
    - The default network ACL allows all inbound and outbound traffic.
    - Network ACLs are stateless, so add both inbound and outbound rules to enable the connection to your website.
    - explicitly allow traffic on port 80 and 443

NB: If the website owner or administrator wants to access other websites from the EC2 instance:

1. Network ACL outbound rules allowing traffic on port 80 or port 443 to the destination IP address
2. Network ACL inbound rules allowing traffic on ephemeral ports (1024-65535)
3. Security group rules allowing outbound traffic

### VPC Subnets

It's a segment of an Amazon VPC's IP address range where you can place groups of isolated resources.
Subnets are defined by CIDR blocks, are cotnained within an Availability zone.
The smallest subnet that you can create is a /28 (16 IP addresses).

Can be public, private or VPN-only.

1. public: the associated route table directs the subnet's traffic to the amazon VPC's IGW.
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
- DNS resolution to private IPs can be enabled, but it's a setting needed at both sides.

### VPC Endpoints

VPC Endpoints are gateway objects created within a VPC. They can be used to connect to AWS public services without the need for the VPC to have an attached internet gateway and be public.

Two types of VPC endpoints:

- Gateway endpoints: Can be used for **DynamoDB** and **S3**
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

### VPC Flow Logs

VPC Flow Logs allows you to capture metadata about the traffic flowing in and out of networking interfaces within a VPC. Flow logs can be placed on a specific network interface, a subnet, or an entire VPC and will capture metadata fro mthe capture poit and anything within it. Flow logs aren't real-time and don't capture the actual traffic - only metadata on the traffic.

Flow logs capture: account-id, interface-id, srcaddr, dstaddr, srcport, dstport, protocol, packets, tytes, start, end, ation, and log-status.

Flow logs don't capture some traffic, including Amazon DNS server, windowns license activation, DHCP traffic ,and VPC router
It can be enabled on a VPC, subnet, or ENI level and monitor traffic metadata for any included interfaces. Flow logs monitor:

## VPC VPN and Direct Connect

### AWS VPC Virtual Private Networks, VPNs

VPC Virtual Private Networks (VPNs) provide a software based secure conenction between a VPC and on premises networks.

VPC VPN Components:

- A virtual private Cloud (VPC)
- Virtual Private Gateway (VGW) attached to a VPC
- A customer gateway (CGW) - configuration for on-premises router
- VPN Connection (using 1 or 2 IPsec tunnels)

Best Practice & HA:

- Use dynamic VPNs (uses BGP) where possible
- Connect both Tunnels to your CGW - BPC VPN is HA by design
- Where possible use two VPN connections and two CGWs

### AWS Direct Connect, DX

Direct Connect (DX) is a high-speed, low-latency physical connection providing access to public and private AWS services from your business premises. This lesson details its high-level architecture and the key points required for the exam.

A Direct Connect (DX) is a physical connection between your network and either directly via a cross-connect and customer router at a DX location or via a DX partner.

**Dedicated Connections** are direct via AWS and use single-mode fiber, running either 1 Gbps using 1000Base-LX or 10 Gbps using 10GBASE-LR.

Virtual interfaces (VIFs) run on top of a DX. Public VIFs can access AWS public services such as S3 only. Private VIFs are used to conenct into VPCs. DX is not highly available or encrypted.

### VPN and Direct Connect

Chossing between Direct Connect (DX) and VPC VPN is a critial part of any connectivity-based example questions.

VPC VPN

- Urgent need - can be deployed in minutes
- Cost constrained - cheap and economical
- Low end or consumer hardware - DX requires BGP, boarder gateway protocol
- Encryption required
- Flexibility to change locations
- Highly available options aavailable
- Short-term conenctivity (DX generally has physical minimums due to the physical transit conenctions requried) - not applicatble if you are in a DX location because then it's almost on demand

Direct Connect

- High throughput
- Consistent performance (throughput)
- consistent low latency
- large amounts of data - cheaper than VPN for higher volume
- No contention with existing internet connection

Both

- VPN as acheaper HA option for DX
- VPN as an additional layer of HA (in addition to two DX)
- if some form of connectivity is needed immediately, provides as it before the SX connection is live
- VPN Can be add ed to add encryption over the top of a DX (public VIF VPN)

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

### Active-active and active-passive failover

- Active-active failover
  - use it when you want all of your resources to be available the majority of the time.
  - When a resource becomes unavailable, Route 53 can detect that it's unhealthy and stop including it when responding to queries.
- Active-passive failover
  - use it when you want a primary resource or group of resources to be available the majority of the time and you want a secondary resource or group of resources to be on standby in case all the primary resources become unavailable.
  - When responding to queries, Route 53 includes only the healthy primary resources. If all the primary resources are unhealthy, Route 53 begins to include only the healthy secondary resources in response to DNS queries.

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

use `linuxacademy.com` as an example. The domain name system (DNS) does many things, but the common use case is to turn DNS names into IP address - like turning linuxcademay.com into `52.86.183.13`. It's a distributed system - no one part knows all.

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
- **split-view DNS**is supported, suign the same zone name for public and private zones - providing VPC resources with differenct records, e.g., testing ,internal versions of websites. With split view, private is preferred, if no matches, public is used.

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

### Route 53 Routing Policy

It determines how Amazon Route 53 responds to queries:

- Simple Routing Policy:
  - A simple routing policy is a single recordw ithin a hosted zone that contains one or more values. When queried, a simple routing policy record returns all the values in a randomized order.
  - use for a single reource that performs a given function for your domain. E.g., a web server that serves content for the `example.com` website.
  - CANNOT: create nultiple records that have the same name and type
  - CAN: specify multiple values in the same record, e.g., multiple IP address.
  - The DNS client (the laptop) receives a randomized list of IPs as a result. The client can select the appropriate one and initiate an HTTP session with a resource.
  - **Pros**: Simple, the default, even spread ofrequests
  - **Cons**: No performance control, no granular health checks, for alias type - only a sinle AWS resource.
- Failover routing policy
  - it allows you to create two records with the same name. One is designated as the primary and another as secondary. Queries will resolve to the primamry - unless it's unhealthy, in which case Route 53 will respond with the secondary.
  - use when you want to configure active-passive failover.
  - used in conjunction with Route 53 health checks to provide failover between a primary record and a secondary record.
  - Failover can be combined with other types to allow multiple primary and secondary records. Generally, failover is used to provide emergency resources during failures. Like a page says website is under maintenance.
- Weighted routing policy
  - allow granular control over queries, allowing a certain percentage of queries to reach specific records.
  - used to control the amount of traffic that reaches specific resources.
  - useful when testing new software or when resources are being added or removed from a configuration that doesn't use a load balancer.
  - Records are returned based on a ratio of their weight to the total weight, assuing records are healthy.
- Latency routing policy
  - allows clients to be matched to resources with the lowest latency
  - use when you have resources in multiple AWS Regions and you wnat to route traffic to the region that provides the best latency
  - Route53 consults a latency database each time a request occurs to a given latency-based host in DNS from a resolver server. Record sets with the same name are considered part of the same latency-based set. Each is allocated to a region. The record set returned is the one with the lowest latency to the resolver server.
- Geolocation routing policy
  - use when you want to route traffic based on the location of your users.
  - A no-result is returned if no match exists between a record set and the query location. Geoproximity allows a bias to expand a geographic area.
- Geoproximity routing policy
  - use when you want to route traffic based on the location of your resources and, optionally, shift traffic from resources in one location to resources in another.
- Multivalue answer routing policy
  - use when you want Route 53 to respond to DNS queries with up to eight healthy records selected at random.

## Amazon Load Balancing

- Load balancing is a method used to distribute incoming conenctions across a group o servers of services.
- Incoming connections are made to the load balancer, which distributes them to associated services.
- Elastic Load Balancing (ELB) is a service that provides a set of highly available and scalable load balancers in one of three versions:
  - Classic: CLB
  - Application: ALB
  - Network: NLB
- ELBs can be paired with Auto Scaling groups to enhance high availability and fault tolerance - automating scaling/elasticity
- An elastic load balancer has a DNS record, which allows access at the external side.

A node is placed in each AZ the load balancer is active in. Each node gets 1/N of the traffic, where N is the number of nodes. Historically, each node could only load balance to instances in the same AZ. The reuslts in uneven traffic distribution. Cross-zone load balancing allows each node to distribute traffic to all instances.

An elastic load balancer can be public facing, meaning it accepts traffic from the public internet, or internal, which is only accessible from inside a VPC and is often used between application tiers.

An elastic load balancer accepts traffic via listeners using proteocol and ports. It can strip HTTPS at this point, meaning it handles encryption/decryption, reducing CPU usage on instances.

### Classic Load Balancer, Amazon CLB

Classic Load Balancers are the oldest type of load balancer and generally should be avoid for new projects.

- support layer 3 &4 (TCP and SSL) and some HTTP/S features
- it isn't a layer 7 device, so no real HTTP/S
- one SSL certificate per CLB - can get expensive for complex projects
- can **offload** SSL connections - HTTPS to the load balancer and HTTP to the instance (lower CPU and admin overhead on instances)
- can be associated with Auto Scaling groups
- DNS A record is uded to conenct to the CLB

### Application Load Balancer, ALB

Application Load Balancers (ALBs) are devices that operate at Layer 7 of the OSI network model — understanding the HTTP/S protocol. In addition, ALBs introduce a number of advanced features that result in a cost reduction, performance increase, and added flexibility. ALBs are, in most cases, the recommended load balancer to use for projects.

- ALBs operate at layer 7 of the OSI model. They undertand HTTP and HTTPS and can load balance based on this protoccol layer.
- ALBs are now recommended as the default LB for VPCs. They perform better than CLBs and are almost always cheaper.
- Content rules can direct certain traffic to specific target groups.
  - Host-based rules: Route traffic based on the host used
  - Path-based ruels: Route traffic based on URL path
- ALBs support EC2, ECS, EKS, Lambda, HTTPS, HTTP/2 and WebSockets, and they can be integrated with AWS Web Application Firewall (WAF).
- Use an ALB if you need to use containers or microservices.
- Targets -> target groups -> content rules
- An ALB can host multiple SSL Certificates using SNI.

### Network Load Balancer, NLB

NLBs are the newest type of load balancer and operate at layer 4 of the OSI network model. There are a few scenarios and benefits to using an NLB versus and ALB:

- can support protocols other than HTTP/S because it forwards upper layers unchanged
- Less latency because no processing above layer 4 is required
- IP addressable - static address
- Best local balancing performance within AWS
- Source IP address preservation - packets unchagned
- Targets can be addreseed using IP address

-> NLB ->

- TCP 80 ->
  - 10.0.1.126
  - 10.0.1.128
- TCP 8080 ->
  - 10.0.2.126
  - 10.0.2.128

### Launch templates and Lunch configurations

They allow you to configure various configuration attributes that can be set include:

- AMI to use for EC2 launch
- Instance type
- Storage
- Key pair
- IAM role
- User data
- Purchase options
- newwork configuration
- Security group(s)

Launch templates address some of the weaknesses of the legacy launch configurations and add the following features:

- Versioning and inheritance
- Tagging
- More advanced purchasing options
- new instance features, like:
  - Elastic graphics
  - T2/T3 unlimited settings
  - Placement groups
  - Capacity reservations
  - Tenacy options

Launch templates should be used over launch configurations where possible. Neither can be edited after creation - a few version of the template or a new launch configuration should be created.

### Auto Scaling Groups

Auto Scaling groups allow EC2 instances to scale in a way that allows elasticity. When used in conjunction with load balancers and launch templates and configurations, it allows for a self-healing infrastructure that can also scale based on demand.

Auto Scaling groups use launch configurations or launch templates and allow automatic scale-out or scale-in based on configurable metrics. Auto Scaling groups are often paired with elastic load balancers.

Auto Scaling groups can be configured to use multiple AZs to improve high availability. Unhealthy instances are terminated and recreated. ELB health checks or EC2 status can be used.

Metrics such as CPU unilization or network transfer can be used either to scale out or scal in using scaling policies. Scaling can be manaul, scheduled, or dynamic. Cooldowns can be defined to ensure rapid in/out events don't occur.

Scaling policies can be simple, step scaling, or target tracking.

### Route 53 vs. ELB

|Route 53 | ELB |
|---|---|
|Route 53 routes domain traffic to ELB load balancer  | distribute traffic to each EC2 instances |
|help balance traffic 'across' regions  | within one region |
|only changes the address that your clients' requests resolve to  |ELB actually reroutes traffic  |
|have to either manually replace the old failed instance with the new one in the route or add some script to your launch configuration to automatically register the new instance with Route53 and remove the failed one.  |can use autoscaling to automatically register new instances added to the group  |

### Monitoring Load Balancer

- CloudWatch metrics
  - use Amazon CloudWatch to retrieve statistics about data points for your load balancers and targets as an ordered set of time-series data, known as metrics.
  - use these metrics to verify that your system is **performing as expected**
- Access logs
  - use access logs to capture detailed information about the requests made to your load balancer and store them as log files in Amazon S3.
  - use these access logs to analyze **traffic patterns** and to **troubleshoot issues** with your targets.
- Request tracing
  - use request tracing to track HTTP requests.
  - The load balancer adds a header with a trace identifier to each request it receives.
- CloudTril logs
  - capture detailed information about the calls made to the Elastic Load Balancing API and store them as log files in Amazon S3.
  - to determine which calls were made, the source IP address where the call came from, who made the call, when the call was made, and so on

## AWS Identity and Access Management, IAM

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
   - Crosss-Acount Access: Granting permissions to users from other AWS accounts, whether you control those accounts or not
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

## Amazon CloudFront

- CloudFront is an essential component for global applications.
- It speeds up distribution of your static and dynamic web content, such as .html, .css, .js, and image files, to your users.
- It's a content delivery network (CDN).
- A CDN is a glocal cache that stores copies of your data on edge caches, which are positioned as close to your customers as possible.
- Main benefits:

  - lower latency
  - higher transfer speeds
  - reduced load on the content server

CloudFront Components

- **Origin**: The server or service that hosts your content. Can be an S3 bucket, web server, or Amazon MediaStore
- **Distribution**: the "configuration" entity within CloudFront. It's where you configure all aspects of a specific "implementation" of CloudFront from.
- **Edge Location**: The lcoal infrastructure that hosts caches of your data. Positioned in over 150 locatins globally in over 30 countries.
- **Regional Edge Caches**: larger version of edge locations. Less of them but have more capacity and can serve larger areas.

Caching Process:

- Create a distribution and point at one or more origins. A distribution has a DNS address that is used to access it.
- The DNS Address directs clients at the closest available edge location.
- If the edge location has a cached copy of your data, it's delivered locally from that edge location.
- If it's not cached, the edge location attemptes to download it from either a regional cache or from the origin (known as an origin fetch)
- As the edge location, receives the data, it immediately begins forwarding it and caches it for the next visitor.

Content can expire, be discarded, and be recached. Or you can explicitly invalidate content to remove it from caches.

By default, CloudFront is fully publicly accessible - anyone with the DNS endpoint address can access content cached by the distribution.

A distribution can be configured to be **private** where each access requries a signed URL or cookie. This is done by setting the trusted signers on the distribution.

Private distributions can be bypassed by going straight to the origin (e.g., an S3 bucket).

An **origin access identity (OAI)** is a virtual identity that can be associated with a distribution. As S3 bucket can then be restricted to only allow this OAI to access it - all other identiteis can be denied.
It works with:

1. other AWS cloud service: Amazon S3 buckets, Amazon S3 static websites, Amazon Elastic Compute Cloud (Amazon EC2), and Elastic Load Balancing.
2. any non-AWS origin server, such as an existing on-premises web server
3. Amazon Route 53.

It supports all content that can be served over HTTP or HTTPS, including:

1. any popular static files that are a part of your web application, such as HTML files, images, JavaScript, and CSS files, and also audio, video, media files.
2. serving dynamic web pages, so it can actually be used to deliver your entire website
3. media streaming, using both HTTP and RTMP.

Three core concepts: distributions, origins,and cache control.

Amazon CloudFront Use Cases

Good for:

- Serving the Static Assets of Popular Websites
- Serving a Whole Website or Web Application. both dynamic and static content
- Serving Content to Users Who Are Widely Distributed Geographically
- Distributing Software or Other Large Files
- Serving Streaming Media

Not appropriate:

- All or Most Requests Come From a Single Location. you will not take advantage of multiple edge locations.
- All or Most Requests Come Through a Corporate VPN.

### Invalidate CloudFront Caches

By default, CloudFront caches a response from Amazon S3 for 24 hours (Default TTL of 86,400 seconds). If your request lands at an edge location that served the Amazon S3 response within 24 hours, CloudFront uses the cached response even if you updated the content in Amazon S3.

push the updated S3 content from CloudFront:

- Invalidate the S3 objects:
  - the next request retrieves the object directly from Amazon S3.
  - Each AWS account is allowed 1,000 free invalidation paths per month
- Use object versioning
  - use if update content frequently
  - you can revert changes because the previous version of the object remains in Amazon S3 under the previous name
  - equires more Amazon S3 storage.

## Database and AWS

The database needs to meet the performance demands, the availability needs, and the recoverability characteristics of the system.

1. RDBS: relational database management system
2. NoSQL: non-relationsal database

### Relational Database

Every table has a schema that defines a fixed layout for each row, which is defined when the table is created. Every row in the table needs to have all the attributes adn the correct data tyeps.

1. OLTP: Online Transactin Processing. regquently writing and changing data, e.g., data entry and e-commerce
2. OLAP: Online Analytical processing. reporting or analyzing large data sets.

Amazon RDS significantly simplifies the setup and maintenance of OLTP and OLAP database.

### NoSQL Database

Simple, flexible and can achieve performance levels that are difficult with tradictional relational databases.
A common case is managing user session state, user profiles, shopping cart data, or time-series data.

Four main types:

- **Key Value**: Data is stored as key and value pairs. Super fast queries and ability to scale. No relationships and weak schema. E.g., Amazon DynamoDB.
- **Document**: DAta is stored as structured key and value pairs called documents. Operations on documents are highly performant. E.g., MongoDB
- **Column**: Data is stored in columns rather than rows. Queries against attribute sets, such as all DOBs or all surnames, are fast. Great for data warehousing and analytics. E.g., Amazon Redshift
- **Graph**: Designed for dynamic relationships. Stores data as nodes and relationships between those nodes. Ideal for human-related data, such as social media. E.g., Neo4j

### Data Warehouse

A _data warehouse_ is a central repository for data that can come fromone ormore sources, used for reportign and analysis via OLAP using highly complex queries.

_Amazon Redshif_ is a high-performance data warehouse designed for OLAP use cases

## Amazon RDS

- RDS is a Database as a Service (DBaas) product. Amazon is responsible for backups, patching, scaling and replication.
- It can be used to provision a fully functional database without the admin overhead traditionally associated with DB platforms.
- It can perform at scale, be made public accessible, and can be configured for demanding availability and durability scenarios.

RDS is capable of a number of different types of backups. Automated backups to S3 occur daily and can be retrianed from 0 to 35 days. Manual snapshots are taken manually and exist until deleted, and point-in-time log-based backups are also stored on S3.

1. Primary -> Standby: sychronous data replication from primary to standby
2. Standby -> S3: Backups occur once per day if enabled. Backups are taken from the standby isntance. Restention is from 0 to 35 days.
3. Standay -> S3: Manual snapshots can be performed at anytime and are retined until explicitly deleted
4. S3 -> primary: Restores create a new RDS instance with a new endpoint address - this wil lrequire application changes (or DNS changes).

### Amazon RDS Multi-AZ

- RDS can be provisioned in single or multi-az mode.
- Multi-AZ provisions a primary instance and a standby instance in a different AZ of the same region.
- Only the primary can be accessed using the instance CNAME.
- There is no performance benefit, but it provides a better RTO than restoring a snapshot.

### Amazon RDS Read Replicas

They're read only copies of an RDS instance that can be created in the same region of a differenct region from the primary instance.

Read Replicas can be addressed independently (each having their own DNS name) and used for read workloads, allowing you to scale reads. Five Read Replicas can be created from RDS instance, allowing a 5X increase in reads. Read Replicas can be created from Read Replicas,and they can be promoted to primary instances and can be themselves Multi-AZ.

Read Replicas dont' scale writes, which have to occur on the primary instance.

Reads from a Read Replica are eventually consistent - normally seconds, but the applicatin needs to support it.

| Multi-AZ deployments                                                                                                        | Read replicas                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Main purpose is high availability                                                                                           | Main purpose is scalability                                                                                                        |
| - Non-Aurora: synchronous replication; <br/>- Aurora: asynchronous replication                                              | Asynchronous replication                                                                                                           |
| - Non-Aurora: only the primary instance is active;<br/>- Aurora: all instances are active                                   | All read replicas are accessible and can be used for readscaling                                                                   |
| - Non-Aurora: automated backups are taken from standby;<br/>- Aurora: automated backups are taken from shared storage layer | No backups configured by default                                                                                                   |
| Always span at least two Availability Zones within a single region                                                          | Can be within an Availability Zone, Cross-AZ, or Cross-Region                                                                      |
| - Non-Aurora: database engine version upgrades happen on primary;<br/>- Aurora: all instances are updated together          | - Non-Aurora: database engine version upgrade is independent from source instance;<br>- Aurora: all instances are updated together |
| - non-Aurora: Automatic failover to standby;<br>- Aurora: read replica when a problem is detected                           | - non-Aurora: Can be manually promoted to a standalone database instance;<br/>- Aurora: to be the primary instance                 |

Exam points

RDS supports a number of database engines:

- MySQL, MariaDB, PostgresQL, Oracle, Microsoft SQL Server
- Aurora: an in-house developed engine with substantial feature and performance enhancements

RDS can be deployed in single AZ or multi-AZs mode (for resilience) and supports the following instance types:

- General purpose (currently DB.M4 and DB.M5)
- Memory optimized (currently DB.R4 and DB.R5, and DB.X1e and DB.X1 for Orcale)
- Burstable (DB.T2 and DB.T3)

Two types of storage are supported:

- General Purpose SSD (gp2): 3 IOPS per GB, burst to 3,000 IOPS (pool architecure like EBS)
- Provisined IOPS (io1): 1,000 to 80,000 IOPS (engine dependent) size, and IOPS can be confired independetly

RDS instance are charged based on:

- Instance size
- Provisioned storage (not used)
- IOPS transferred out
- Any backups/snapshots beyond the 100% that is free with each DB isntance

RDS supports encryption with the following limits/restrictions/conditions

- Encryption can be configured when creating DB instances.
- Encryption can be added by taking a snapshot, making an encrypted snapshot, and creating a new encrypted isntance from that encrypted snapshot.
- Encrytion cannot be removed.
- Read Replicas need to be the same state as the primary isntance (encrypted or not)
- encrypted snapshots can be copied between regions - but a new destination region KMS CMK is used (because they're region specific)

Network access to an RDS instance is controlled by a security group (SG) associated with the RDS instance.

### Amazon RDS High Availability

Two easy-to-use options

1. For MySQL, MariaDB, PostgreSQL, Oracle, and SQL Server DB instances, you can use Amazon RDS Multi-AZ deployments. Amazon RDS automatically creates a primary DB instance and synchronously replicates the data to a standby instance in a different Availability Zone (AZ). In case of an infrastructure failure, Amazon RDS performs an automatic failover to the standby DB instance.
2. The Amazon Aurora PostgreSQL and Amazon Aurora MySQL engines include additional High Availability options. Even with a single database instance, Amazon Aurora increases availability by replicating your data six ways across three Availability Zones. This means that your DB cluster can tolerate a failure of an Availability Zone without any loss of data and only a brief interruption of service.

### Multi AZ vs. Read Replicas

For highly availability and disaster recovery -- Multi AZ
For performance -- read replicas

## Amazon Aurora

Aurora is not just an enhancement of RDS - it's a new architecture with shared storage, addressable replicas, and parallel queries.

- To improve relilience, use additional replicas.
- To scale write workloads, scale up the instance size.
- To scale reads, scale out (adding more replicas).

### Aurora architecture

Aurora is a custom-designed relational database engine that forms part of RDS. Rather than an evolution, Aurora significantly replaces much of the traditional MySQL and PostgreSQL architecture in favor of cluster and shared storage architecture, which is more scalable and resilient with much higher performance.

Aurora operates with a radically differenct architecture as opposed to the other RDS database engines:

- Autota uses a base configuration of a "cluster"
- A cluster contains a single primary instance and zero or more repicas

### Cluster Storage

- All instances (primary and replicas) use the same shared storage - the cluster volumnes.
- Cluster volumne is totally SSD based, which can scale to 64 TB in size
- Replicates data 6 times, across 3 AZs.
- Aurora can tolerate two failures without writes being impacted and 3 failures without impact reads
- Aurora storage is auto-healing

### Cluster Scaling and Availability

- Cluster volumne scales automatically, only bills for consumed data, and is constantly backed up to S3.
- Aurora replicas improve availability, can be promoted to be a primary instance quickly, and allow for efficient read scaling.
- Reads and writes use the cluster endpoint.
- Reads can use the reader endpoint, which balances connections over all replica instances.

### Aurora Parallel Queries Database features

- One writer and multiple readers
- One writer and multiple readers - Parallel query

### Auroral Global

### Aurora Serverless

Aurora Serverless is based on the same database engine as Aurora, but instead of provisioning certain resource allocation, Aurora Serverless handles this as a service.

You simply specify a minimum and maximum number of Aurora capacity units (ACUs) - Aurora Serverless can use the Data API.

Aurora Serverless provides many of the same features Aurora provisioned does, but it abstracts farther away from the concept of database servers.

With Aurora Serverless, you indicate your minimum and maxiumum load levels with Aurora Capacity Units, and the product scales based on the incoming load.

Aurora Serverless is also able to scale down to zero, where the only cost is storage.

## Amazon Redshift

- It's a petabyte-scale data warehouse product available within AWS.
- It's capable of being used for ad-hoc warehousing/analytics or long-running deployments.
- It's a column-based database desinged for analytical workloads.
- Generally, a relational store like RDS would be used for OLTP workloads (e.g., queries, inserts, updates, and deletes), and Redshift would be used for OLAP (e.g., retrieval and analytics).
- Multiple databases become source data to be injected into a data warehouse solution such as Redshit.

Data can be loaded from S3 and unloaded to S3. Additionally, backups can be performed to S3, and various AWS services such as Kinesis can inject data into Redshift.
You can configure Amazon Redshift to automatically copy snapshots (automated or manual) for a cluster to another AWS Region.
You can restore a single table from a snapshot instead of restoring an entire cluster.

### Workload management

Amazon Redshift workload management (WLM) enables users to flexibly manage priorities within workloads so that short, fast-running queries won't get stuck in queues behind long-running queries.

NB:

- Amazon Redshift does not support read replicas and will not automatically scale
- Amazon Redshift has the ability to automatically back up your cluster to a second AWS region!

## Amazon DynamoDB

DynamoDB is a NoSQL database servcie. It's a global service, partitioned regionally and allows the creation of tables.

- A **Table** is a collection of items that share the same partition key (PK) or partition key and sort key (SK) together with other configuration and performance settings.
- An **Item** is a colelction of attributes (up to 400KB is size) inside a table that shares the same key structure as every other item in the table.
- An **Attribute** is a key and value - an attribute name and value.

E.g.,

- table: Albums
- item: Song01, song02, song03
- primary key: song track id, 01,02,03...;
  - Attributes: name: song1, length:2min,...

### DynamoDB capacity modes

- On-demand
- Provisioned
- Provisioned with Auto Scaling

DynamoDB has two read/write capacity modes: provisioned throughput (default) and on-demand mode.

1. on-demand mode, DynamoDB automatically scales to handle performance demands and bills a per-request charge.

2. provisioned throughput mode, each table is configured with read capacity units (RCU) and write capacity unites (WCU). Every operatin on ITEMS consumes at least 1 RCU or WCU - partial RCU/WCU cannot be consumed.

- **Read Capacity Units (RCU)**
  - One RCU is 4 KB of data read from a table per second in a strongly consistent way.
  - Reading 2KB of data consumes 1 RCU, reading 4.5 KB of data takes 2 RCU, reading 10\*400 bytes takes 10 RCU.
  - If eventaully consistent reads are okay, 1 RCU can allow for 2\*4KB of data reads per second.
  - Atomic transactions require 2X the RCU.
- **Write Capacity Units (WCU)**
  - One WCU is 1 KB of data or less written to a table.
  - An operation that writes 200 bytes consumes 1 WCU, an operation writes 2 KB consumes 2 WCU.
  - Five operations of 200 bytes consumes 5 WCU.
  - Atomic transactions require 2X the WCU to complete.

### DynamoDB Streams

When enabled, streams provide an ordered list of changes that occur to items within a DynamoDB table. A stream is a rolling 24-hour window of changes. Streams are enabled per table and only contian data from the point of being enabled.

Every stream has an ARN that identifies it globally across all tables, accounts and regions.

Streams can be configured with one of four view types:

- **KEYS_ONLY**: whenever an iterm is added, updated, or deleted, the keys of that item are added to the stream
- **NEW_IMAGE**: the entire item is added to the stream "post-change"
- **OLD_IMAGE**: the entire item is added to the stream "pre-change"
- **NEW_AND_OLD_IMAGES**: both the new and old versions of the item are added to the stream.

Triggers

Streams can be integrated with AWS Lambda, invoking a function whenever items are changed in a DynamoDB table(a DB trigger)

### AWS DynamoDB Indexes

Local secondary indexes (LSIs) allow an alternative view of a table's data to be created, using the same partition key but with an alternative sort key.

LSIs can be created only at the time of table creation, and there is currently a limit of five LSIs per table.

Indexes provide an alternative representation of data in a table, which is useful for applications with varying query demands.
Indexes come in two forms: local secondary indexes (LSI) and global secondary indexes (GSI). Indexes are interacted with as though they are tables, but they are just an alternate representation of data in an existing table.

- **Local secondary indexes** must be created at the same time as creating a table. They use the same partition key but an alternative sort key. They share the RCU and WCU values for the main table.

- **Global secondary indexes** can be created at any point after the table is created. They can use differenct partition and sort keys. They have their own RCU and WCU values. GSIs can be used to support alternative data access patterns, allowing efficient use of query operations.

### DynamoDB Accelerator (DAX)

- **DAX** is an in-memory cache specifically designed for DynamoDB.
- It supports caching **eventually consistent** reads for items and query results, **NOT** for strongly consistent
- Results delivered from DAX are available in microseconds rather than in the single-digit milliseconds available from DynamoDB.
- DAX is ideal for latency-sensitive applications or for read-heavy workloads on consistent data sets.

DAX maintains two distinct caches: the item cache and the query cache.

- the **item cache** is populated with results from `GetItem` and `BatchGetItem` and has a five-minites default TTL.
- the **query cache** stores results of `Query` and `Scan` operations and caches based on the parmeters specified.

## Amazon ElastiCache

It is an in-memory cache that provides the Memcached and Redis caching engines.

ElastiCache is used for two common use cases:

- Offloading database reads by caching responses, improving application speed and reducing costs
- Storing user session state, allowing for stateless compute instances (used for fault-tolerant architecures)

Generally, ElastiCache is used with key/value database or to store dimple session data, but it can be sued with SQL database engines.

- good to cache:a list of products in a catalog.
- not be cached: if you generate a unique page every request, you probably should not cache the page results

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

## Amazon Snowball

AWS provides three methods for movign large amoutns of data quickly in and out of AWS:

- Snowball
- Snowball Edge
- Snowball Mobile

With any snowball devices, you don't need to worry about writing code or the speed or data allocation of your internet, VPN, or DX connection. You just need to log a job and receive and empty device or one full of the data requested. You can perform a data copy with your usual tooling and ship the device back.

### Snowball

- can be used for in or out jobs
- Log a job and an empty device or device with data is shipped
- Ideal for TB or PB data transfer
- Data encryption using KMS
- Generally used from 10 TB -> 10 PB 9the economical range)
- larger jobs or multiple locations can use multiple Snowballs
- End-to-end process time is low for the amount of data

### Snowball Edge

- includes both storage and compute
- larger capacity
- compute can be used for lcoal instances or lambda fucntionality
- three types
  - Edge storage optimized
  - Edge compute optimized
  - Edge compute optimized with GPU
- compute can be used for lcoal IOT, for data processing prior to ingestion into AWS, and much more
- used in the same type of situations as Snowballs but when compute is required

### Snowball Mobile

- Portable storage data center within a shipping container on a semitruck
- Used when single location 10+ PB is requried
- up to 100 PB
- Not economical for sub 10 PB and where multiple locations are requried
- situated  on-site and connected into your data center for the duration of the transfer

## Amazon Storage Gateway

Storage Gateway is a hybrid storage service that allows you to migrate data into AWS, extending your on-premises storage capacity using AWS. It is a virtual appliance used for data center extensions or migrations.

Three main types of Storage Gateway:

- File gateway: store fiels as objects in Amazon S3, with a local cache for low-ltency access to your most recent used data.
- Tape Gateway: Gateway Virtual Tape Libraries (VTL).Back up data to Aazon S3 and archive in Amazon Glacier using your existing tape-based processes.
- Volume gateway: iSCSI protocol, block storage in Amazon S3 with point-in-time backups as Amaon EBS.

**Volume gateway** In two modes:  cached and stored.

1. Cached mode:
    - you store your primary data **in Amazon S3** and retain your frequently accessed data locally in cache.
    - you can achieve substantial cost savings on primary storage, minimizing the need to scale your storage on-premises, while retaining low-latency access to your frequently accessed data.

2. Stored mode:
    - you store your entire data set **locally**, while making an asynchronous copy of your volume in Amazon S3 and point-in-time EBS snapshots.
    - This mode provides durable and **inexpensive offsite backups** that you can recover locally, to another site or in Amazon EC2.  

## Amazon Database Migration Service, DMS

- The Database Migration Service (DMS) is a managed service to migrate relational databases.
- It's capable of both data migration and schema conversion.
- It can migrate **to** and **from** any locations with network connectivity to AWS.

Details:

- DMS is compatible with a broad range of DB sources, including Oracle, MS SQL, MySQL, MariaDB, PostgreSQL, MongoDB, Aurora, and SAP.
- Data can be synced to most of the above engines, as well as Redshit, S3, and DynamoDB.
- You can also use the Schema Conversion Tool (AWS SCT) to transform between different database engiens as part of a migration.

With DMS at a high level, you provision a replication instance, define source and destination endpoints that point at source and target database, and create a replication task. DMS handles the rest, and you can continue using your database while the process runs.DMS is useful in a number of common scenarios:

- Scaling database resources up or down without downtime
- migrating database from on-premises to AWS, from AWS to on-premises, or to/fro mother cloud plateforms
- moving data between different DB engines, including schema conversion
- Partical/subset data migration
- migration with little to no admin overhead, as a service

## Kinesis and Firehose

Kinesis and Kinesis Data Firehose are two essential pieces of any high-performance streaming architecture.

**Kinesis** is a scalable and relilient streaming service from AWS. it's designed to ingetst large amounts of data from hundreds, thousands, or even millions or products. Consumers can access a rolling window of that data, or it can be stored in persistent storage of database products.

- **Kinesis Stream** is where you data put into. It can be used to collect, process, and analyze a large amount of incoming data. A stream is a public service accessible from inside VPCs or from the public internet by an unlimited number of producers. Kinesis streams include storage for all incoming data with a 24-hour default window, which can be increased t oseven days for an additional charge. Data records are added by producers and read by consuemrs.
- **Kinesis Shard** provides the capacity of the stream. Kinesis shards are added to streams to allow them to scale. A stream stars with at a least one shard, which allows 1 MB of ingetstion and 2 MB of consuption. Shards can be removed from streams.
- **Kinesis Data Record** the basic entity written to and read from Kinesis streams, a data record can be up to 1MB in size.

You would use Kinesis rather than SQS when you need many producers and many consumers as well as a rolling window of data. SQS is a queue; Kinesis allows lots of independent consumer reading the same data window.

the 24 hours tiem window and can get all the data is the biggest difference between Kinesis and SQS.
You dont use Kinesis to decouple modules, to inter process messaging.

## AWS CloudTrail

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

## AWS Elastic Transcoder

Elastic Transcoder is an AWS service that allows you to convert media fiels from an input format to one or more output formats. it's delivered as a servcie, and you're billed a per-minute charge while using the service.

A pip line is a queue for jobs. It stores source and destination settings, notification, security, and other high settings. Jobs are processed in the ordr they are added as resources allow.

A job defiens the input object and up to 30 output objects/formats. Jobs are added to a pipeline in the same region and use the buckets defined in the pipeline for input/output.

**Presets** contain transcoding settings and can be applied to jobs to ensure output compatible with various devices, such as iPhones, tablets, or other form factors.

## Amazon Athena

Athena is an interactive query servcie that utilizes **schema-on-read**, allowing you to run ad-hoc SQL-like queries on data from a range of sources. Results are returned in seconds, and you arebilled oly for the compute time used and any existing storage costs.

Athena can query many forms of structured, and unstructured data in S3.

Athena can be used to query various AWS logs, including flow logs and ELB logs.

Tables are defined in a data catalog and are applied on read. Athena allows SQL queries against data stored on S3, through the schema-on-read tables.

No data is modified by Anthena, and output can be sent to visualization tools.

## Amazon Elastic MapReduce, EMR

EMR is a tool for large-scale parallel processing of big data and other large data workloads. It is an AWS-managed implementation of the Apache Hadoop ecosystem of products, and is delivered as amanaged cluster using EC2 instance. EMR is sued for huge-scale log analysis, indexing, machine learning, financial analysis, simulations, bioinformatics, and many other large-scale applications.

The **master node** manages the cluster. It manages HDFS naming, distributes workloads, and monitors health. you log in to the master node via SSH. If the master node fails, the cluster fails.

EMR clusters have zero or more **core nodes**, which are managed by the master node. They run tasks and mange data for HDFS. If they fail, it can cause cluster instability.

**Task nodes** are optional. They can be sued to execute tasks, but they ahve no involvement with important cluster fucntions, whhich means they can be used with spot instances. If task nodes fail, a core node starts the task on another task/core node.

Data can be input from and output to S3. Intermediate data can be stored using HDFS in the cluster or EMRFS using S3.

## Logging and Monitoring: CloudWatch, CloudTrail, VPC Flow Logs

## CloudWatch

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

### CloudWatch vs. CloudTrail

- CloudWatch: What's happening?
- CloudTrail: Who do what?

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

- [Linux Academy: AWS Certified Solutions Architect - Associate Level](https://linuxacademy.com/course/aws-certified-solutions-architect-2019-associate-level)
- [AWS Certified SAA 2018 - Exam Feedback](https://acloud.guru/forums/aws-certified-solutions-architect-associate/discussion/-KSDNs4nfg5ikp6yBN9l/exam_feedback_-_20_specific_po)
- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558) (out-of-date)
