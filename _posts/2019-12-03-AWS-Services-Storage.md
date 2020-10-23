---
title: AWS Servcies - Storage
search: true
tags:
  - AWS
  - SAA Certificatin
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---
S3, Glacier, EBS, Stoarage Gateway, SnowX, etc.

## Amazon Simple Storage Service, S3

### Comman use cases for Amazon S3

1. Backup and archive for on-premises or cloud data
2. Content, media, and software storeage and distribution
3. Big data analytics
4. Static website hosting
5. Cloud-native mobile and Internet application hosting
6. Disaster recovery

### Block Storage vs. File Storage vs. Object Storage

Block Storage:

- Raw storage
- Data organised as an array of unrelated blocks
- Host File System places data on disk
- Amazon EBS provides block level storage volumes for use with EC2 instances
- E.g., MS NTFS, Unix ZFS

File Storage

- Unrelated data blocks managed by a file (serving) system
- Native file system places data on disk
- Amazon EFS provides a simple, scalable, fully managed elastic NFS file system

Object Storage

- Stores Virtual containers that encapsulate the data, data attributes, metadata and Object Ids
- APIs access to data
- Metadata Driven, Policy-based
- Amazon S3 object storage is cloud object storeage
  1. data is manged as objects using an API with http verbs. operating on the whole object at once, cannot incrementally updateing portions of the object as you do with a file.
  2. objects reside in containers called buckets and each object is identified by a unique user-specified key (filename).

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

From Hot to Cold: S3 Standard -> S3 Intelligent-Tiering -> S3 Standard-IA -> S3 One Zone-IA -> S3 Glacier -> S3 Glacier Deep Archieve

- **S3 Standard**
  - for general-purpose storage of frequently accessed data
  - Default, all-purpose storage or when usage is unknown
  - 11 Nines durability and four Nines availability
  - Replicated in 3+ AZs - no minimum object size or retrieval fee

- **Amazon S3 Intelligent-Tiering (S3 Intelligent-Tiering)**
  - for data with unknown or changing access patterns
  - designed to optimize costs by automatically moving data to the most cost-effective access tier, without performance impact or operational overhead.
  - It works by storing objects in two access tiers: one tier that is optimized for frequent access and another lower-cost tier that is optimized for infrequent access.
  - Small monthly monitoring and auto-tiering fee

- **Standard Infrequent Access (Standard-IA)**
  - Objects where real-time access is required but infrequent
  - 99.9% availability, 3+ AZs replication, cheaper than Standard
  - 30-day and 128KB minimum charges and object retrieval fee

- **Amazon S3 One Zone-Infrequent Access (S3 One Zone-IA)**
  - Non-critical and/or repreducible objects
  - 99.5% availability, one 1 AZ, 30 day and 128KB minimum charges
  - cheaper than standard IA

- **Glarcier**
  - Long-term archival storage (warm or cold backups)
  - Retrievals could take minutes or hours (faster = higher cost)
  - 3+ AZ replication, 90-day and 40KB minimum charge and retrieval

- **Glacier Deep Archive**
  - Long-term archival (cold backups) - 180 day and 40KB Minimum
  - Longer retrievals but cheaper than Glacier -replacement for tape-style storage

### Amazon S3 Storage Classes use cases

- **Standard**
  - Cloud App
  - Big Data Analytics
  - Content Distribution
  - Primary Data
  - Temporary & Small Objects
- **IA**
  - File Sync & Share
  - Active Archive
  - Enterprise Backup
  - Media Transcoding
  - Disaster Recovery/ Geo redundancy
- **One Zone IA**
  - Secondary Backups
  - Easily re-Creatable Data
  - S3 Cross-Region replication Target
- **Glacier**
  - Depp/ Offline Archives
  - Tape Vaulting replacement
  - WORM Compliant Data

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

Lifecycle policies allow objects or versions to be transitioned between storage classes or expired when no longer required.

**S3 and S3-IA has the same retrieval time**. The diff is that you are charged for retrieval. Availability is 99.99 vs 99.9

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

### S3 with CloudFront

To allow access to an Amazon S3 bucket only from a CloudFront distribution:

- First add an origin access identity (OAI) to your distribution.
- Then, review your bucket policy and Amazon S3 access control list (ACL) to be sure that:
  - Only the OAI can access your bucket.
  - CloudFront can access the bucket on behalf of requesters.
  - Users can't access the objects in other ways, such as by using Amazon S3 URLs.

Note: After you restrict access to your bucket using CloudFront, you can optionally add another layer of security by integrating AWS WAF.

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

## References

- [Linux Academy: AWS Certified Solutions Architect - Associate Level](https://linuxacademy.com/course/aws-certified-solutions-architect-2019-associate-level)
- [AWS Certified SAA 2018 - Exam Feedback](https://acloud.guru/forums/aws-certified-solutions-architect-associate/discussion/-KSDNs4nfg5ikp6yBN9l/exam_feedback_-_20_specific_po)
- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558) (out-of-date)
