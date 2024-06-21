---
title: AWS Servcies - Databases
search: true
tags:
 - AWS
 - SAA Certificatin
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---
RDS, Aurora, DynamoDB, ElastiCache, DMS, EMR, Kinesis, etc.

## Database and AWS

The database needs to meet the performance demands, availability needs, and recoverability characteristics of the system.

1. RDBS: relational database management system
2. NoSQL: non-relational database

### Relational Database

Every table has a schema that defines a fixed layout for each row, which is defined when the table is created. Every row in the table needs to have all the attributes and the correct data types.

1. OLTP: Online Transaction Processing. frequently writing and changing data, e.g., data entry and e-commerce
2. OLAP: Online Analytical processing. reporting or analyzing large data sets.

Amazon RDS significantly simplifies the setup and maintenance of the OLTP and OLAP databases.

### NoSQL Database

Simple, flexible, and can achieve performance levels that are difficult with traditional relational databases.
A common case is managing user session state, user profiles, shopping cart data, or time-series data.

Four main types:

- **Key-Value**: Data is stored as key and value pairs. Superfast queries and ability to scale. No relationships and weak schema. E.g., Amazon DynamoDB.
- **Document**: Data is stored as structured key and value pairs called documents. Operations on documents are highly performant. E.g., MongoDB
- **Column**: Data is stored in columns rather than rows. Queries against attribute sets, such as all DOBs or all surnames, are fast. Great for data warehousing and analytics. E.g., Amazon Redshift
- **Graph**: Designed for dynamic relationships. Stores data as nodes and relationships between those nodes. Ideal for human-related data, such as social media. E.g., Neo4j

### Data Warehouse

A _data warehouse_ is a central repository for data that can come from one or more sources, used for reporting and analysis via OLAP using highly complex queries.

_Amazon Redshif_ is a high-performance data warehouse designed for OLAP use cases

## Amazon RDS

- RDS is a Database as a Service (DBaaS) product. Amazon is responsible for backups, patching, scaling, and replication.
- It can be used to provide a fully functional database without the admin overhead traditionally associated with DB platforms.
- It can perform at scale, be made publicly accessible, and can be configured for demanding availability and durability scenarios.

RDS is capable of several different types of backups. Automated backups to S3 occur daily and can be retrieved from 0 to 35 days. Manual snapshots are taken manually and exist until deleted, and point-in-time log-based backups are also stored on S3.

1. Primary -> Standby: synchronous data replication from primary to standby
2. Standby -> S3: Backups occur once per day if enabled. Backups are taken from the standby instance. Retention is from 0 to 35 days.
3. Standby -> S3: Manual snapshots can be performed at any time and are retained until explicitly deleted
4. S3 -> primary: Restores create a new RDS instance with a new endpoint address - this will require application changes (or DNS changes).

### Amazon RDS Multi-AZ

- RDS can be provisioned in single or multi-az mode.
- Multi-AZ provisions a primary instance and a standby instance in a different AZ of the same region.
- Only the primary can be accessed using the instance CNAME.
- There is no performance benefit, but it provides a better RTO than restoring a snapshot.

### Amazon RDS Read Replicas

They're read-only copies of an RDS instance that can be created in the same region of a different region from the primary instance.

Read Replicas can be addressed independently (each having their own DNS name) and used for reading workloads, allowing you to scale reads. Five Read Replicas can be created from the RDS instance, allowing a 5X increase in reads. Read Replicas can be created from Read Replicas, and they can be promoted to primary instances and can be themselves Multi-AZ.

Read Replicas don't scale writes, which have to occur on the primary instance.

Reads from a Read Replica are eventually consistent - normally seconds, but the application needs to support it.

| Multi-AZ deployments | Read replicas |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Main purpose is high availability | Main purpose is scalability |
| - Non-Aurora: synchronous replication; <br/>- Aurora: asynchronous replication | Asynchronous replication |
| - Non-Aurora: only the primary instance is active;<br/>- Aurora: all instances are active | All read replicas are accessible and can be used for read scaling |
| - Non-Aurora: automated backups are taken from standby;<br/>- Aurora: automated backups are taken from shared storage layer | No backups configured by default |
| Always span at least two Availability Zones within a single region | Can be within an Availability Zone, Cross-AZ, or Cross-Region |
| - Non-Aurora: database engine version upgrades happen on primary;<br/>- Aurora: all instances are updated together | - Non-Aurora: database engine version upgrade is independent from source instance;<br>- Aurora: all instances are updated together |
| - non-Aurora: Automatic failover to standby;<br>- Aurora: read replica when a problem is detected | - non-Aurora: Can be manually promoted to a standalone database instance;<br/>- Aurora: to be the primary instance |

Exam points

RDS supports a number of database engines:

- MySQL, MariaDB, PostgreSQL, Oracle, Microsoft SQL Server
- Aurora: an in-house developed engine with substantial feature and performance enhancements

RDS can be deployed in single AZ or multi-AZs mode (for resilience) and supports the following instance types:

- General-purpose (currently DB.M4 and DB.M5)
- Memory-optimized (currently DB.R4 and DB.R5, and DB.X1e and DB.X1 for Oracle)
- Burstable (DB.T2 and DB.T3)

Two types of storage are supported:

- General Purpose SSD (gp2): 3 IOPS per GB, burst to 3,000 IOPS (pool architecture like EBS)
- Provisioned IOPS (io1): 1,000 to 80,000 IOPS (engine dependent) size, and IOPS can be confirmed independently

RDS instance is charged based on:

- Instance size
- Provisioned storage (not used)
- IOPS transferred out
- Any backups/snapshots beyond the 100% that is free with each DB instance

RDS supports encryption with the following limits/restrictions/conditions

- Encryption can be configured when creating DB instances.
- Encryption can be added by taking a snapshot, making an encrypted snapshot, and creating a new encrypted instance from that encrypted snapshot.
- Encryption cannot be removed.
- Read Replicas need to be in the same state as the primary instance (encrypted or not)
- encrypted snapshots can be copied between regions - but a new destination region KMS CMK is used (because they're region-specific)

Network access to an RDS instance is controlled by a security group (SG) associated with the RDS instance.

### Amazon RDS High Availability

Two easy-to-use options

1. For MySQL, MariaDB, PostgreSQL, Oracle, and SQL Server DB instances, you can use Amazon RDS Multi-AZ deployments. Amazon RDS automatically creates a primary DB instance and synchronously replicates the data to a standby instance in a different Availability Zone (AZ). In case of an infrastructure failure, Amazon RDS performs an automatic failover to the standby DB instance.
2. The Amazon Aurora PostgreSQL and Amazon Aurora MySQL engines include additional High Availability options. Even with a single database instance, Amazon Aurora increases availability by replicating your data six ways across three Availability Zones. This means that your DB cluster can tolerate a failure of an Availability Zone without any loss of data and only a brief interruption of service.

### Multi-AZ vs. Read Replicas

For high availability and disaster recovery -- Multi-AZ
For performance -- read replicas

### RDS failover

Amazon RDS handles failovers automatically so you can resume database operations as quickly as possible without administrative intervention.

The primary DB instance switches over automatically to the standby replica if any of the following conditions occur:

- An Availability Zone outage
- The primary DB instance fails
- The DB instance's server type is changed
- The operating system of the DB instance is undergoing software patching
- A manual failover of the DB instance was initiated using **Reboot with failover**

## Amazon Aurora

Aurora is not just an enhancement of RDS - it's a new architecture with shared storage, addressable replicas, and parallel queries.

- To improve resilience, use additional replicas.
- To scale write workloads, scale up the instance size.
- To scale reads, scale-out (adding more replicas).

### Aurora architecture

Aurora is a custom-designed relational database engine that forms part of RDS. Rather than an evolution, Aurora significantly replaces much of the traditional MySQL and PostgreSQL architecture in favor of cluster and shared storage architecture, which is more scalable and resilient with much higher performance.

Aurora operates with a radically different architecture as opposed to the other RDS database engines:

- Aurora uses a base configuration of a "cluster"
- A cluster contains a single primary instance and zero or more replicas

### Cluster Storage

- All instances (primary and replicas) use the same shared storage - the cluster volumes.
- Cluster volume is totally SSD based, which can scale to 64 TB in size
- Replicates data 6 times, across 3 AZs.
- Aurora can tolerate two failures without writes being impacted and 3 failures without impact reads
- Aurora storage is auto-healing

### Cluster Scaling and Availability

- Cluster volume scales automatically, only bills for consumed data, and is constantly backed up to S3.
- Aurora replicas improve availability, can be promoted to be a primary instance quickly, and allow for efficient read scaling.
- Reads and writes use the cluster endpoint.
- Reads can use the reader endpoint, which balances connections overall replica instances.

### Aurora Parallel Queries Database features

- One writer and multiple readers
- One writer and multiple readers - Parallel query

### Aurora endpoints

Amazon Aurora typically involves a cluster of DB instances instead of a single instance. Each connection is handled by a specific DB instance. When you connect to an Aurora cluster, the hostname and port that you specify points to an **intermediate handler called an endpoint**.

Types of Aurora Endpoints

- Cluster endpoint (or writer endpoint)
  - connects to the current **primary DB** instance
  - Each Aurora DB cluster has one cluster endpoint and one primary DB instance.
  - You use the cluster endpoint for all write operations on the DB cluster, including inserts, updates, deletes, and DDL changes.
  - You can also use the cluster endpoint for reading operations, such as queries.
  - provides failover support for read/write connections to the DB cluster
- Reader endpoint
  - provides load-balancing support for read-only connections to the DB cluster.
  - Each Aurora DB cluster has one reader endpoint.
  - reduces the overhead on the primary instance
  - handle simultaneous SELECT queries
- Custom endpoint
  - You define which instances this endpoint refers to, and you decide what purpose the endpoint serves
  - An Aurora DB cluster has no custom endpoints until you create one
  - You can't use custom endpoints for Aurora Serverless clusters.
- Instance endpoint
  - connects to a specific DB
  - e.g., uses instance endpoints to improve connection speed after a failover for Aurora PostgreSQL

### Aurora Serverless

Aurora Serverless is based on the same database engine as Aurora, but instead of provisioning certain resource allocation, Aurora Serverless handles this as a service.

You simply specify a minimum and a maximum number of Aurora capacity units (ACUs) - Aurora Serverless can use the Data API.

Aurora Serverless provides many of the same features Aurora provisioned does, but it abstracts farther away from the concept of database servers.

With Aurora Serverless, you indicate your minimum and maximum load levels with Aurora Capacity Units, and the product scales based on the incoming load.

Aurora Serverless is also able to scale down to zero, where the only cost is storage.

## Amazon DynamoDB

DynamoDB is a NoSQL database service. It's a global service, partitioned regionally, and allows the creation of tables.

DynamoDB is best suited to big data, advertisement technologies, gaming, mobile applications, time-series data, logs, IoT, and other applications where **heavy write** performance, **reduced latency**, and a **dynamic schema** are required.

- A **Table** is a collection of items that share the same partition key (PK) or partition key and sort key (SK) together with other configuration and performance settings.
- An **Item** is a collection of attributes (up to 400KB in size) inside a table that shares the same key structure as every other item in the table.
- An **Attribute** is a key and value - an attribute name and value.
- A **primary key** is a mechanism to uniquely identify each item in a table. Two types of primary key:
  - Partition key = hash key
  - Partition key and sort key= composite primary key

E.g.,

- table: Albums
- item: Song01, song02, song03
- primary key: song track id, 01,02,03...;
  - Attributes: name: song1, length:2min,...

Sort key structure doesn't influence performance — it just allows range selection or ordering.

### Read Consistency Modal

- Eventually Consistent Reads: The response might include some stale data
- Strongly Consistent Reads:
  - during network delay, may return a server error (HTTP 500).
  - may have higher latency
  - not supported on global secondary indexes
  - use more throughput capacity than eventually consistent reads

By default, DynamoDB uses eventually consistent reads

To use strongly consistent reads, you need to specify this while creating the table. Read operations, such as `GetItem`, `Query`, and `Scan` provide a `ConsistentRead` parameter.

By default, Scan reads the entire table with all items and consumes more throughput. Use Query instead of Scan, as it is more economical.

### Cross-Region Replication

You can create tables that are automatically replicated across two or more AWS Regions, with full support for multi-master writes. This gives you the ability to build fast, massively scaled applications for a global user base without having to manage the replication process.

### DynamoDB capacity modes

- On-demand
- Provisioned
- Provisioned with Auto Scaling

DynamoDB has two read/write capacity modes: provisioned throughput (default) and on-demand mode.

1. on-demand mode, DynamoDB automatically scales to handle performance demands and bills a per-request charge.
2. provisioned throughput mode, each table is configured with read capacity units (RCU) and write capacity units (WCU). Every operation on ITEMS consumes at least 1 RCU or WCU - partial RCU/WCU cannot be consumed.

- **Read Capacity Units (RCU)**
  - One read capacity unit = one strongly consistent read.
  - One read capacity unit = two eventually consistent reads.
  - One read operation can process an item of up to 4 KB in size.
  - If an item is more than 4 KB in size, it requires additional read operations
  - If an item is less than 4 KB in size, it still requires one read capacity unit.
  - Atomic transactions require 2X the RCU.
- **Write Capacity Units (WCU)**
  - One write capacity unit = one write operation of up to 1 KB in size.
  - If an item is greater than 1 KB, it requires additional write capacity units
  - If an item is less than 1 KB in size, it still requires one write capacity unit.
  - Atomic transactions require 2X the WCU to complete.

If we exceed our RCU or WCU, we get
`ProvisionedThroughputExceededExceptions`, possible causes:

- Hotkeys: one partition key is being read too many times (popular item for example)
- Hot partitions:
- Very large items: remember RCU and WCU depends on the size of items

Solutions:

- Exponential back-off when an exception is encountered (already in SDK)
- Distribute partition keys as much as possible
- If RCU issue, we can use DynamoDB Accelerator (DAX)

#### Calculating table throughput

- You have an application that requires reading 15 items per second. Each item is 3 KB in size. If the application requires strongly consistent reads, what read capacity is required to address this need?

  15 items * 1 RCU (3K = 4K, strong consistent) = 15 RCU

- You have an application that requires reading 80 items per second. Each item is 5 KB in size. If the application requires using strongly consistent reads, what read capacity is required to address this need?

  80 items *2( 5k > 4k = 8K/4k )* 1 (strong consistent) = 160 RCU

- You have an application that requires reading 60 items per second. Each item is 3 KB in size and the application requires using eventual consistent reads. What read capacity is required to address this need?

60 items * 1(3<4 = 4/4) / 2 (eventual consistent) = 30 RCU

### DynamoDB Streams

When enabled, streams provide an ordered list of changes that occur to items within a DynamoDB table. A stream is a rolling 24-hour window of changes. Streams are enabled per table and only contain data from the point of being enabled.

Every stream has an ARN that identifies it globally across all tables, accounts, and regions.

Streams can be configured with one of four view types:

- **KEYS_ONLY**: whenever an item is added, updated, or deleted, the keys of that item are added to the stream
- **NEW_IMAGE**: the entire item is added to the stream "post-change"
- **OLD_IMAGE**: the entire item is added to the stream "pre-change"
- **NEW_AND_OLD_IMAGES**: both the new and old versions of the item are added to the stream.

Triggers

Streams can be integrated with AWS Lambda, invoking a function whenever items are changed in a DynamoDB table(a DB trigger).

Immediately after an item in the table is modified, a new record appears in the table's stream. AWS Lambda polls the stream and invokes your Lambda function synchronously when it detects new stream records.

The Lambda function can perform any actions you specify, such as sending a notification or initiating a workflow.

### AWS DynamoDB Indexes

Local secondary indexes (LSIs) allow an alternative view of a table's data to be created, using the same partition key but with an alternative sort key.

LSIs can be created only at the time of table creation, and there is currently a limit of five LSIs per table.

Indexes provide an alternative representation of data in a table, which is useful for applications with varying query demands.

Indexes come in two forms: local secondary indexes (LSI) and global secondary indexes (GSI). Indexes are interacted with as though they are tables, but they are just an alternate representation of data in an existing table.

- **Local secondary indexes** must be created at the same time as creating a table. They use the same partition key but an alternative sort key. They share the RCU and WCU values for the main table.
- **Global secondary indexes** can be created at any point after the table is created. They can use different partition and sort keys. They have their own RCU and WCU values. GSIs can be used to support alternative data access patterns, allowing efficient use of query operations.

### DynamoDB table query

- Reading: `GetItem` with the table name and primary key
- Writing:
  - creating: `PutItem`
  - updating: `UpdateItem`
  - deleting: `DeleteItem`
- Conditional writes succeed only where they meet an expected condition; otherwise, they return an error. Conditional writes can be used in multiple scenarios. Conditional writes can be handy in situations where multiple users try to update the same item.

### DynamoDB Accelerator (DAX)

- **DAX** is an in-memory cache specifically designed for DynamoDB.
- It supports caching **eventually consistent** reads for items and query results, **NOT** for strongly consistent
- Results delivered from DAX are available in microseconds rather than in the single-digit milliseconds available from DynamoDB.
- DAX is ideal for latency-sensitive applications or for read-heavy workloads on consistent data sets.

DAX maintains two distinct caches: the item cache and the query cache.

- the **item cache** is populated with results from `GetItem` and `BatchGetItem` and has a five-minutes default TTL.
- the **query cache** stores results of `Query` and `Scan` operations and caches based on the parameters specified.

### restrict user or role to specific attributes in a DynamoDB table

Use IAM policy conditions for **fine-grained access control (FGAC)**.

FGAC allows you to control access to individual items or item attributes for both read and write operations in a DynamoDB table.

## Amazon Redshift

- It's a petabyte-scale data warehouse product available within AWS.
- It's capable of being used for ad-hoc warehousing/analytics or long-running deployments.
- It's a column-based database designed for analytical workloads.
- Generally, a relational store like RDS would be used for OLTP workloads (e.g., queries, inserts, updates, and deletes), and Redshift would be used for OLAP (e.g., retrieval and analytics).
- Multiple databases become source data to be injected into a data warehouse solution such as Redshift.

Data can be loaded from S3 and unloaded to S3. Additionally, backups can be performed to S3, and various AWS services such as Kinesis can inject data into Redshift.
You can configure Amazon Redshift to automatically copy snapshots (automated or manual) for a cluster to another AWS Region.
You can restore a single table from a snapshot instead of restoring an entire cluster.

### Workload management

Amazon Redshift workload management (WLM) enables users to flexibly manage priorities within workloads so that short, fast-running queries won't get stuck in queues behind long-running queries.

NB:

- Amazon Redshift does not support read replicas and will not automatically scale
- Amazon Redshift can automatically back up your cluster to a second AWS region!

## Amazon ElastiCache

It is an in-memory cache that provides the Memcached and Redis caching engines.

ElastiCache common use cases:

- Offloading database reads by caching responses, improving application speed, and reducing costs
- Storing user session state, allowing for stateless compute instances (used for fault-tolerant architectures)
- Unchanged data to be displayed frequently

Generally, ElastiCache is used with key/value databases or to store dimple session data, but it can be used with SQL database engines.

- good to cache: a list of products in a catalog.
- not be cached: if you generate a unique page for every request, you probably should not cache the page results

### Choose the right engine

- Memcached has a very small footprint of metadata
  - generally used to store small and static data, such as HTML code pieces.
  - a very small footprint of metadata
  - doesn't provide persistent storage options
  - highly recommended to use Memcached with easily recoverable data
- Redis has five primary data structures, and finely-grained control over data eviction.
  - has persistent storage
  - more suitable for large e-commerce applications, IoT applications, and real-time analytics.

### industry-standard in-memory caching access patterns

- Cache miss: when the data is not found in the in-memory cache
  - may add some latency, as it involves disk I/O

- Cache hit: when the data is found in the in-memory cache
  - saves time for I/O, minimizes latency, and improves throughput

- Cache update: data may exist in the cache in a stalled state, or may not exist in the cache at all; therefore, it has to be written or updated in the cache

- Cache-aside (**lazy loading**): This is one of the **most widely used caching strategies**.
  - the application code can manually manage both the database and the cache information
  - the cache-aside caching strategy only loads data to the cache when it is required.
  - suitable for read-heavy applications

### Caching strategies

#### Lazy loading: loads data into the cache only when necessary

- Good:
  - Only requested data is cached. avoids filling up the cache with data that isn't requested.
  - Node failures aren't fatal for your application
- Bad:
  - There is a cache miss penalty. Each cache miss results in three trips:
    - Initial request for data from the cache
    - Query of the database for the data
    - Writing the data to the cache
  - Stale data. use the Write-through and Adding TTL strategies.

#### Write-through: adds data or updates data in the cache whenever data is written to the database

- good:
  - Data in the cache is never stale.
  - Write penalty vs. read penalty. Every write involves two trips:
    - A write to the cache
    - A write to the database
- bad:
  - Missing data.
    - If you spin up a new node (node failure or scaling out), there is missing data.
    - This data continues to be missing until it's added or updated on the database.
    - You can minimize this by implementing lazy loading with write-through.
  - Cache churn.
    - Most data is never read, which is a waste of resources. 
    - By adding a time to live (TTL) value, you can minimize wasted space.

#### Adding TTL

- Time to live (TTL) is an integer value that specifies the number of seconds until the key expires.
- This approach doesn't guarantee that a value isn't stale.
- it keeps data from getting too stale and requires that values in the cache are occasionally refreshed from the database.

## Amazon Database Migration Service, DMS

- The Database Migration Service (DMS) is a managed service to migrate relational databases.
- It's capable of both data migration and schema conversion.
- It can migrate **to** and **from** any locations with network connectivity to AWS.

Details:

- DMS is compatible with a broad range of DB sources, including Oracle, MS SQL, MySQL, MariaDB, PostgreSQL, MongoDB, Aurora, and SAP.
- Data can be synced to most of the above engines, as well as Redshift, S3, and DynamoDB.
- You can also use the Schema Conversion Tool (AWS SCT) to transform between different database engines as part of a migration.

With DMS at a high level, you provision a replication instance, define source and destination endpoints that point at source and target database, and create a replication task. DMS handles the rest, and you can continue using your database while the process runs.DMS is useful in a number of common scenarios:

- Scaling database resources up or down without downtime
- migrating database from on-premises to AWS, from AWS to on-premises, or to/fro mother cloud platforms
- moving data between different DB engines, including schema conversion
- Particle/subset data migration
- migration with little to no admin overhead, as a service

## Amazon Elastic MapReduce, EMR

EMR is a tool for large-scale parallel processing of big data and other large data workloads. It is an AWS-managed implementation of the Apache Hadoop ecosystem of products and is delivered as a managed cluster using an EC2 instance. EMR is used for huge-scale log analysis, indexing, machine learning, financial analysis, simulations, bioinformatics, and many other large-scale applications.

The **master node** manages the cluster. It manages HDFS naming, distributes workloads, and monitors health. you log in to the master node via SSH. If the master node fails, the cluster fails.

EMR clusters have zero or more **core nodes**, which are managed by the master node. They run tasks and manage data for HDFS. If they fail, it can cause cluster instability.

**Task nodes** are optional. They can be sued to execute tasks, but they have no involvement with important cluster functions, which means they can be used with spot instances. If task nodes fail, a core node starts the task on another task/core node.

Data can be input from and output to S3. Intermediate data can be stored using HDFS in the cluster or EMRFS using S3.

## Amazon Athena

Athena is an interactive query service that utilizes **schema-on-read**, allowing you to run ad-hoc SQL-like queries on data from a range of sources. Results are returned in seconds, and you are billed only for the compute time used and any existing storage costs.

Athena can query many forms of structured, and unstructured data in S3.

Athena can be used to query various AWS logs, including flow logs and ELB logs.

Tables are defined in a data catalog and are applied on reading. Athena allows SQL queries against data stored on S3, through the schema-on-read tables.

No data is modified by Anthena, and output can be sent to visualization tools.

## Amazon Kinesis and Firehose

keywords:

- IoT
- Streaming data
- collect and analyze streams
- real-time

**Kinesis** is a scalable and resilient streaming service from AWS. it's designed to ingest large amounts of data from hundreds, thousands, or even millions of products. Consumers can access a rolling window of that data, or it can be stored in persistent storage of database products.

Amazon Kinesis has four capabilities:

- Kinesis Video Streams (KVS): Capture, process, and store video streams for analytics and machine learning.
- Kinesis Data Streams (KDS): Build custom applications that analyze data streams using popular stream-processing frameworks.
- Kinesis Data Firehose (KDF): Load data streams into AWS data stores
- Kinesis Data Analytics (KDA): Process and analyze streaming data using SQL or Java

Kinesis Data Streams and Kinesis Data Firehose are two essential pieces of any high-performance streaming architecture.

- **Kinesis Data Stream** is where your data put into. It can be used to collect, process, and analyze a large amount of incoming data.
  - A stream is a public service accessible from inside VPCs or from the public internet by an unlimited number of producers.
  - Kinesis data streams include storage for all incoming data with a 24-hour default window, which can be increased to seven days for an additional charge.
  - Data records are added by producers and read by consumers.
  - A Kinesis data stream is a set of shards.
  - Each shard has a sequence of data records.
  - Each data record has a sequence number that is assigned by Kinesis Data Streams.

- **Kinesis Shard** provides the capacity of the stream. Kinesis shards are added to streams to allow them to scale. A stream starts with at least one shard, which allows 1 MB of ingestion and 2 MB of consumption. Shards can be removed from streams.

- **Kinesis Data Record** the basic entity written to and read from Kinesis streams, a data record can be up to 1MB in size. Data records are composed of a sequence number, a partition key, and a data blob, which is an immutable sequence of bytes.

- **Retention Period** is the length of time that data records are accessible after they are added to the stream. 
  - Minimum: 24 hours (using the DecreaseStreamRetentionPeriod operation.)
  - Maximum: 8760 hours (365 days) (using the IncreaseStreamRetentionPeriod operation)

|product|SQS|Kinesis|
|Essential|Messaging service|Streaming service|
|Use cases|Application integration, Decouple microservices, Scale jobs to multiple workers|Log and event data Collection, Real-time analytics, Mobile app event data feed, IoT data feed|
|Scaling|AWS fully-managed|Manually increase/decrease shards|
|Durability|Deleted by consumer, or up to reach max retention period|Deleted on expiry, or up to reach max retention period|
|Default Retention Period|4 days|24 hours|
|Min Retention Period|60 seconds|24 hours|
|Max Retention Period|14 days|365 days|
|Message Order|Standard - Best effort, FIFO(300 messages/snd)|Ordered within the shard|
|No Duplicates| no garantee| yes|
|Number of consumers|1|unlimited|
|Message replay | No | Yes |
|Message Consume | One message ca nbe consumed by only one consumer at a time | Consumers can read the same data records | 
|Capacity management and limits|No capacity management|Needs shard monitoring|
|Cost for 1Kb x 500 messages / day|$34.56|$0.96|
|Underlying data structure|multiple queues|like a durable linked list|

### Kinesis Data Streams vs. SQS

You would use Kinesis rather than SQS when you need many producers and many consumers as well as a rolling window of data. SQS is a queue; Kinesis allows lots of independent consumers to read the same data window.

Amazon Kinesis Data Streams:

 1. real-time processing of streaming big data, provides ordering of records
 2. the 24 hours time window and can get all the data is the biggest difference between Kinesis and SQS.
 3. for performing counting, aggregation, filtering
 4. You don't use Kinesis to decouple modules, to inter-process messaging.

SQS:

 1. reliable, highly scalable hosted queue for storing messages as they travel between computers

### Amazon Kinesis Data Streams use case

Two types:

1. Shared fan-out consumers
2. Enhanced fan-out consumers

- Accelerate log and data feed intake and proessing
- Real-time metrics and reporting
- Real-time data analytics
- Complex stream processing (using Directed Acyclic Graphs (DAGs))

### Amazon Kinesis Data Streams vs. Firehose

Kinesis Data Streams

- Kinesis Data Streams is capable of capturing large amounts of data (terabytes per hour) from data producers and streaming it into custom applications for data processing and analysis.
- Streaming data is replicated by Kinesis across three separate availability zones within AWS to ensure the reliability and availability of your data.
- It is possible to load data into Streams using a number of methods, including HTTPS, the Kinesis Producer Library, the Kinesis Client Library, and the Kinesis Agent.
- Monitoring is available through Amazon Cloudwatch.

Kinesis Firehose

- Kinesis Firehose is Amazon’s data-ingestion product offering for Kinesis. It is used to capture and load streaming data into other Amazon services such as S3 and Redshift.
- From there, you can load the streams into data processing and analysis tools like Elastic Map Reduce, and Amazon Elasticsearch Service. It is also possible to load the same data into S3 and Redshift at the same time using Firehose.
- As with Kinesis Data Streams, it is possible to load data into Firehose using a number of methods, including HTTPS, the Kinesis Producer Library, the Kinesis Client Library, and the Kinesis Agent. Currently, it is only possible to stream data via Firehose to S3 and Redshift, but once stored in one of these services, the data can be copied to other services for further processing and analysis.
- Monitoring is available through Amazon Cloudwatch.
- You use Kinesis Data Firehose by creating a Kinesis Data Firehose delivery stream and then sending data to it.

## References

- [Linux Academy: AWS Certified Solutions Architect - Associate Level](https://linuxacademy.com/course/aws-certified-solutions-architect-2019-associate-level)
- [AWS Certified SAA 2018 - Exam Feedback](https://acloud.guru/forums/aws-certified-solutions-architect-associate/discussion/-KSDNs4nfg5ikp6yBN9l/exam_feedback_-_20_specific_po)
- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558) (out-of-date)
- [Study Notes on Amazon Kinesis by Ernest Chiang](https://www.ernestchiang.com/en/notes/aws/kinesis/)
