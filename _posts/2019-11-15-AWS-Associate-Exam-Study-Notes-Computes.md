---
title: AWS Associate Exams Study Notes, Computes
search: true
tags:
  - AWS
  - SAA Certificatin
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---
sss

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

### prevent my EBS volumes from being deleted when I terminate my EC2 instances

To preserve the root volume when an instance is terminated, change the `DeleteOnTermination` attribute for the root volume to `false`.

By default, the `DeleteOnTermination` attribute for the root volume of an instance is set to true, but it is set to false for all other volume types.

## AWS Auto Scaling

Multiple options for scaling resources:

- Amazon EC2 Auto Scaling: applications gain better fault tolerance, availability, and cost management.
- Application Auto Scaling API: To scale a resource **other than EC2**, for developers and system admins.

AWS Auto Scaling enables you to configure automatic scaling for the AWS resources that are part of your application in a matter of minutes.

you configure and manage scaling for your resources through a scaling plan.

This ensures that you add the required computing power to handle the load on your application and then remove it when it's no longer required.

AWS Auto Scaling is useful for applications that experience daily or weekly variations in traffic flow, including the following:

- Cyclical traffic such as high use of resources during regular business hours and low use of resources overnight
- On and off workload patterns, such as batch processing, testing, or periodic analysis
- Variable traffic patterns, such as marketing campaigns with periods of spiky growth

dynamic scaling and predictive scaling

1. Dynamic scaling
    - creates target tracking scaling policies for the scalable resources in your application.
2. Predictive scaling
    - Load forecasting: forecasts the future demand for the next two days
    - Scheduled scaling actions
    - Maximum capacity behavior
    - Currently, predictive scaling is only available for Amazon EC2 Auto Scaling groups.

Two of the dynamic scaling options: Scaling Policies and Simple Scaling Policies

- Both require you to create CloudWatch alarms for the scaling policies
- In most cases, step scaling policies are a better choice than simple scaling policies

### Application Auto Scaling

- Target tracking scaling—Scale a resource based on a target value for a specific CloudWatch metric.
- Step scaling— Scale a resource based on a set of scaling adjustments that vary based on the size of the alarm breach.
- Scheduled scaling—Scale a resource based on the date and time.

### AWS Auto Scaling vs. Amazon EC2 Auto scaling

| AWS Auto Scaling | Amazon EC2 Auto scaling |
|---|---|
| for multiple resources across multiple services | only need to scale Amazon EC2 Auto Scaling groups, or if you are only interested in maintaining the health of your EC2 fleet |
| define dynamic scaling policies for multiple EC2 Auto Scaling groups or other resources using predefined scaling strategies |  |
|  includes predefined scaling strategies that simplify the setup of scaling policies | you need to create or configure Amazon EC2 Auto Scaling groups, or if you need to set up scheduled or step scaling policies |
| use AWS Auto Scaling if you want to create predictive scaling for EC2 resources. |  |
|  |  |

## Amazon Elastic Beanstalk, EB

Key words:

- least amount of disruption
- reduce the risk of a business interruption

EB is a Platform as a Service product. It allows you to deploy code and with very little effort or modifications, the service will provision the infrastructure on your behalf.

EB handles provisoning, monitoring, Auto Scaling, load balancing, and software updating for you - you just worry about the cost.

DB supports a number of languages and platforms: Java, .net, Node.js, PHP, Python ...

Patterns and Anti-patterns for EB:

- Yes: To provision an environment for an applciation with little admin overhead
- Yes: if you use one of the supported languages and can add EB-specific config
- No: if you want low level infrastructure control
- No: if you need Chef support

Deployment Options:

- All at once: an updated applciation version is deployed to all instances. Quick and simple but not recommended for production deployments
- Rolling: Splits instances into batches and deploys one batch at a time.
- Rolling with additional Batch: as above, but provisons a new batch, deploying and testing before removing the old batch (immutable)
- Blue/Green: Maintain two environments, deploy, and swap CNAME.

### EB Auto Scaling triggers

- The Auto Scaling group in your EB uses **two** Amazon CloudWatch alarms to trigger scaling operations
- automatically scales your application **up and down**
- The **default triggers** scale when the average outbound network traffic from each instance is higher than 6 MB or lower than 2 MB over a period of five minutes.
- other triggers like: latency, disk I/O, CPU utilization, and request count.

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

### API Gateway control access

API Gateway supports multiple mechanisms of access control using

- AWS Identity and Access Management (IAM)
- AWS Lambda authorizers, and
- Amazon Cognito (user pool).

### AWS Lambda requires an API key

Use AWS Systems Manager Parameter Store, you can store data such as passwords, database strings, Amazon Machine Image (AMI) IDs, and license codes as parameter values.

### AWS Step Fuctions

It enables you to coordinate the components of distributed applications and microservices using visual workflows. You build applications from individual components that each perform a discrete function, or task, allowing you to scale and change applications quickly.

It automatically triggers and tracks each step, and retries when there are errors, so your application executes in order and as expected, every time.

Step Functions logs the state of each step, so when things go wrong, you can diagnose and debug problems quickly.

Step Functions manages the operations and underlying infrastructure for you to ensure your application is available at any scale.

Without Stap Functions, lambda functions could only run for 15 minutes.
lambda functions are stateless. State machiens maintain state and allow longer-running processes.
Step Functions "replaces" SWF with a serverless version.

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

### ECS Service Load Balancing

It supports:

- Application Load Balancer: route HTTP/HTTPS (or Layer 7) traffic
- Network Load Balancer: route TCP (or Layer 4) traffic
- Classic Load Balancer: route TCP (or Layer 4) traffic

Layer 7 routing means it can route based on content metadata.

## AWS OpsWorks

It's an AWS implementation of the Chef infrastructure and configuration management platform.
It's an implementation of the Chef configuration management and deployment platform.
OpsWorks moves away from the low-level configurability of Cloudformation but not as far as Elastic Beanstalk
OpsWorks lets you create a stack of resources with layers and manage resources as a unit.

OpsWorks components:

- Stacks
  - A unit of managed infrastructure
  - Can use stacks per application or per platform
  - could use stacks for development, staging, or production environment
- Layers
  - comparable to application tiers within a stack
  - e.g., database layer, appication layer, proxy layer
  - recipes are generally associated with layers and configure what to install on instances in that layer
- Instances
  - Instances are EC2 instances associated with a layer
  - Configured as 24/7, load based, or time based
- Apps
  - apps are deployed to alyers from a source code repo or S3
  - actual deployment happends using recipes o na layer
  - other recipes are run when deployments happen, potencially to reconfigure other instanes
- Recipes
  - setup: exceuted on an instance when first provisioned
  - Configure: excuted on all instances when instances are added or removed
  - Deply and Undeploy: excuted when apps are added or removed
  - Shutdown: Executed when an instance is shut down but before it's stopped

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

## References

- [Linux Academy: AWS Certified Solutions Architect - Associate Level](https://linuxacademy.com/course/aws-certified-solutions-architect-2019-associate-level)
- [AWS Certified SAA 2018 - Exam Feedback](https://acloud.guru/forums/aws-certified-solutions-architect-associate/discussion/-KSDNs4nfg5ikp6yBN9l/exam_feedback_-_20_specific_po)
- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558) (out-of-date)
