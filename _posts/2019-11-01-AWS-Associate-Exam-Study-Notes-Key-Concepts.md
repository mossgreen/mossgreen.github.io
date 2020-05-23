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

AWS SAA: Key Concepts

Only a subset of services.
knowledge will be the architecture, how they work together,
how to achieve well performaing, scaleable, secure and cost effective designs.

## Key Concepts

### Durability vs. Availability

Durability

- addresses the question, “Will my data still be there in the future?”
- e.g., a file copies to two sites, copies to three AZs

Availability

- addresses the question, “Can I access my data right now?”
- e.g., in one site, we keep two copies of one file

Amazon S3 is designed to provide both very high durability and very high availability for your data.

### High availability VS Fault tolerance

**High availability**:

- hardware, software and configuration that allowing a system to recover quickly in the event of a failure.
- The key part is the recover quickly.
- It doesn't prevent a failure from occurring and it doesn't stop that failure from impacting customers.
- The primary aim of high availability is to minimize downtime and recover quickly.
- It aims to minimize downtime and recover quickly in the event of a failure.
- E.g., for a car, if one tyre broken, we have a backup tyre, it may break down, but can be fix quickly

**Fault tolerance**:

- a system designed to operate through a failure with no user impact.
- generally more expensive and more complex to achieve and do so reliably
- E.g., a plane. If one engine down, plane can still operate normally

### RPO VS RTO

RPO, recovery point objective

- how much a business can tolerate to lose, expressed in time. The maximum time between a failure and the last successful backup.
- E.g., you revoced backup data after data center exploded, you lost the mose recent 1 hour data before exploding.

RTO, recovery time objective

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

## AWS Well-Architected Framework

### Software Architecture Best Practices

tenets of architecture best practices

- Design for failure and nothing will fail.
- Implement elasticity.
- Leverage different storage options.
- Build security in every layer.
- Think parallel.
- Loose coupling sets you free.
- Don’t fear constraints.

Best practices for designing and operating reliable, secure, eﬃcient, and cost-effective systems in the cloud.

The **AWS WellArchitected Tool** (AWS WA Tool) is a service reviews and measures your architecture whether using the AWS WellArchitected Framework, and provides recommendations for making your workloads more reliable, secure, eﬃcient, and cost-effective.

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
     - AWS offers product features (for example, Enhanced Networking, Amazon EBS-optimized instances, Amazon S3 transfer acceleration, dynamic Amazon CloudFront) to optimize network traﬃc.
     - AWS also offers networking features (for example, Amazon Route 53 latency routing, Amazon VPC endpoints, and AWS Direct Connect) to reduce network distance or jitter.
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
