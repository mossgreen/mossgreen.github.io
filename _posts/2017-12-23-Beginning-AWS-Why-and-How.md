---
title: Beginning AWS, Why and How
search: true
tags: 
  - AWS
  - Cloud
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

AWS does everything. This the first step.



## Cloud Platform Models

- IaaS
- SaaS
- Paas
- Serverless

### Infrastructure as a Service (IaaS)

- Iaas provides access to virtualized computer resources over an Internet connection.
- IaaS products give you direct access to a provider’s compute, storage, and networking assets.
- You can use IaaS to replace every physical element in your computing setup except
    - those required to establish and maintain Internet connectivity and 
    - those required to provide nonvirtualized services (such as printing)

Disadvantages:
1. Billing can become complex because some services are billed at different rates and within different time frames.
2. Systems-management monitoring becomes more difficult.
3. A lag often occurs between when a change in service is needed and when the host provides it.
4. Host downtime is unfixable.

### Platform as a Service (PaaS)

- PaaS is more of a development solution than a production environment solution.
- It hides the complexity of the infrastructure that runs it
- For example, Windows is a particular kind of platform. The virtual platform provided by PaaS allows a customer to develop, run, and manage applications of all sorts.

### Software as a Service (SaaS)

- It's also called _software on demand_. 
- It's all about cloud-based applications.
- It offers services meant to be accessed by end users.
- A client typically accesses the application using a local application, such as a browser. The browser runs on local hardware, but the application runs on the host hardware.
- The host, Amazon, maintains the software, provides the required licenses, and does all the other work needed to make the software available.

### Serverless workload

- No need to manage a server
- Inherent scaling and HA
- No idle capacity - lower cost
- Quick deployment and updates
- Pay-as-you-go model
- Event/mocroservices architectures

### Benefits of Cloud Solution

1. Infrastructure automation is a big advantage of the cloud compared to hosting on-premises.
2. Scalability
    A scalable service will automatically grow in capacity to seamlessly meet any changes in demand.
3. Elasticity. Services are built to be easily and automatically resized, 

## What is AWS

Amazon Web Services (AWS) is a platform of web services that offer solutions for computing, storing, and networking, at different layers of abstraction.

- Computing
- Storing
- Networking

### Cloud Platform Models is AWS

- IaaS
    - Elastic Cloud Compute (EC2) for virtual machine instances,
    - Elastic Block Store (EBS) for storage volumes
    - Elastic Load Balancing
- Paas
    - Elastic Beanstalk
    - Elastic Container Service (ECS)
- Saas
    - Simple Email Service
    - Amazon WorkSpaces
    - (Google’s Gmail service)
    - (Microsoft Outlook)
- Serverless
    - AWS lamda

### Major AWS Competitors

- [Google Cloud Platform](https://cloud.google.com/products/): the prominence of machine learning services that aren’t found in AWS.

- [Microsoft Azure](https://azure.microsoft.com/) has strong SQL database-management support as well as the connection with the Windows platform that businesses may want to maintain.

- AWS has more to offer in the way of the Internet of Things (IoT), applications, and mobile services.



## AWS Infrastructure

https://aws.amazon.com/about-aws/global-infrastructure

### Regionally Based Services

- Locate your infrastructure geographically closer to your users to allow access with the lowest possible latency
- Locate your infrastructure within national borders to meet regulatory compliance with legal and banking rules
- Isolate groups of resources from each other and from larger networks to allow the greatest possible security

### Globally Based Services

- AWS Identity and Access Management (IAM)
- Amazon CloudFront (CDN, content delivery network)
- Amazon S3 buckets

### Availability Zones and High Availability

- A resource running without backup is known as a single point of failure.
- The only effective protection against failure is redundancy.
- Geographically parallel distribute your resources across remote locations. Cloud is easier and cheaper.
- **Autoscaling** can be configured to replace or replicate a resource to ensure that a predefined service level is maintained.
- **Load balancing** orchestrates the use of multiple parallel resources to direct user requests to the server resource that’s best able to provide a successful experience.

### Edge Locations

- An edge location is a site where AWS deploys physical server infrastructure to provide low latency user access to Amazon-based data.
- Edge locations are a smaller set of roles and stock a much narrower set of hardware.
- the best-known tenant of edge locations is **CloudFront**, Amazon’s CDN service.
- **Amazon Route 53**: Amazon’s Domain Name System (DNS) administration tool for managing domain name registration and traffic routing 
- **AWS Shield** A managed service for countering the threat of distributed denial-of-service (DDoS) attacks against your AWS-based infrastructure
- **AWS Web Application Firewall (WAF) **A managed service for protecting web applications from web-based threats 
- **Lambda@Edge** A tool designed to use the serverless power of Lambda to customize CloudFront behavior

### The AWS Shared Responsibility Model

- **Managed Resources**: A managed cloud service will “hide” all or some of the underlying configuration and administration work needed to keep things running, leaving you free to focus on the “business” end of your project. **Beanstalk** handles the instances, storage, databases, and networking headaches—including ongoing patches and administration—invisibly.

- **Unmanaged Resources**: think about EC2. if you can edit it, you own it.

### AWS Acceptable Use Policy

Amazon reserves the right to suspend or even terminate your use of its services should you engage in illegal, insecure, or abusive activities (including the sending of spam and related mass mailings).

---

### Sign Up

To use AWS, you must have two levels of access:

1. User: The first level grants you user-level access to the various services. 

2. Developer: The second level, which you must obtain after getting user-level access, is developer access. Amazon wants to know who is using its service for a number of reasons, including billing, which means you need a developer ID to obtain the required programmatic access to services.


### Most used AWS Services

1. Amazon S3: storing and retrieving the data
2. EC2 [Elastic Compute Cloud]: develop and deploy applications quickly and effectively for a low cost.
3. AWS Lambda: run code without any server.
4. Glacier: an online web storage service that provides you with low cost.
5. Amazon SNS [Simple Notification Service]: manages and delivers the messages or notifications to the users and clients from any cloud platform. 
6. Amazon Elastic Beanstalk: Developers can easily deploy the services and web applications.
7. DynamoDB: NoSQL DB
8. Amazon RDS [Relational Database Service]
9. Amazon ElastiCache: a memory cache system service on the cloud and supports Redis and Memcached.
10. Amazon Redshift: a fully managed data warehouse service in the cloud.


## Job roles in the cloud

![image](https://user-images.githubusercontent.com/8748075/110194198-2541cf80-7e9c-11eb-9f74-77ebe382bd35.png)

![image](https://user-images.githubusercontent.com/8748075/110194769-232d4000-7e9f-11eb-81b6-262f76c288d9.png)

### Roles

1. Application Architect, responsible for designing cloud-optimized applications.
 - They work as technical leaders with the business development and infrastructure teams.
 - They work with the cloud enterprise architect and other project teams to develop the functional requirements of the app.
 - They define capacity and scaling requirements for the app
 - They provide deep software knowledge to app developers concerning cloud architecture, design patterns, and programming languages.
 - They advise on AWS best practices

2. Application Developer, responsible for application development
 - They responsible for managing the changes to the application codebase.
 - they manage the release of code into the cloud environment and they manage the deployment of code into the virtual infrastructure and platform services
 - they support and monitor the performance of the application code
 - application documentation
 - training to the users
 
3. DevOps Engineer, responsible for building and operating fast and scalable workflows
 - deploying and configuring daily builds and troubleshooting failed builds.
 - they communicate with developers and project managers.
 - They design and build automation solutions for your environment for application source, deploy, pipeline, and configuration management systems.
 - They implement continuous build, integration, deployment, and infrastructure as code systems.


### AWS Certifications

Depends on the difficulties, from easy to difficult

1. AWS Certified Cloud Practitioner
2. AWS Certified Developer – Associate
3. AWS Certified Solutions Architect – Associate
4. AWS Certified SysOps Administrator – Associate
5. AWS Certified DevOps Engineer – Professional
6. AWS Certified Security – Specialty
7. AWS Certified Big Data – Specialty
8. AWS Certified Advanced Networking – Specialty
9. AWS Certified Solutions Architect – Professional


## References

- [AWS for Developers For Dummies](https://www.amazon.com/AWS-Developers-Dummies-Computer-Tech/dp/1119371848)
- [AWS Services List - Top 10 AWS Services](https://mindmajix.com/top-aws-services)
- [Amazon Productions](https://aws.amazon.com/products/)

_Last Updated: March 2021_