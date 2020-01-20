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

Amazon Web Services (AWS) is a platform of web services that offers solutions for computing, storing, and networking, at different layers of abstraction.

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

### Benefits from AWS

//todo

### Major AWS Competitors

- [Google Cloud Platform](https://cloud.google.com/products/): the prominence of machine learning services that aren’t found in AWS.

- [Microsoft Azure](https://azure.microsoft.com/) has strong SQL database-management support as well as the connection with the Windows platform that businesses may want to maintain.

- AWS has more to offer in the way of the Internet of Things (IoT), applications, and mobile services.


## What AWS Free Tier provides

- The 12-Month Free Tier
- Permanently Free Services
- https://aws.amazon.com/free 

### The 12-Month Free Tier

- 30 GB of either magnetic or solid-state drive (SSD) volumes from Amazon Elastic Block Storage (EBS).
- 500 MB/month of free storage on the Amazon Elastic Container Registry (ECR).
- 50 GB of outbound data transfers and 2 million HTTP or HTTPS requests for Amazon CloudFront distributions. (These are annual rather than monthly amounts.)
- One million API calls/month on Amazon API Gateway

### Permanently Free Services

- 10 custom monitoring metrics and 10 alarms on Amazon CloudWatch active at any given time.
- 10 GB of data retrievals from Amazon Glacier per month.
- 62,000 outbound email messages per month using Amazon Simple Email Service (SES).
- One million requests and 3.2 million seconds of compute time for AWS Lambda functions.

### How to minitor your Free tier services

1. Free Tier–related email alerts
2. Billing Dashboard


### What You Can Do With AWS Services Free Tier

1. [AWS starter projects](https://aws.amazon.com/getting-started/projects/)
2. [reddit discussion: Project ideas for using AWS free tier?](https://www.reddit.com/r/aws/comments/5zadfk/project_ideas_for_using_aws_free_tier/)


## Product Pricing

1. Each AWS service has its own web page dedicated to pricing.
    - https://aws.amazon.com/s3/pricing
    - https://aws.amazon.com/ec2/pricing
2. Paying less if buy in bulk
3. Server licensing costs are included in the hourly EC2 rates.

### Product cost calculators

1. Simple Monthly Calculator
    - http://calculator .s3.amazonaws.com/index.html
    - what running any combination of AWS resources will cost you

2. Total Cost of Ownership Calculator
    - https://aws.amazon.com/ tco-calculator
    - compare what you’re currently paying for on-premises servers with what the same workload would cost on AWS.


### Billing and Cost Management

1. The AWS Billing Dashboard
    - previous
    - current
    - forecast

2. AWS Budgets

### Service Limits

1. run only 20 on-demand and 20 reserved instances of the EC2 m5.large instance type at any one time within a single AWS Region
2. protect customers from having automated processes accidentally (or maliciously) launch resources that generate unsustainable costs.
3. Most service limits are soft (or adjustable)—meaning that you can manually request that AWS increase a limit for your account.
4. https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html


## Getting Support on AWS

1. Support plans: https://aws.amazon.com/ premiumsupport
2. AWS Professional Services
3. Documentation and Online Help
4. Trusted Advisor

### Support plans
- The Basic Support Plan
    - not paying anything
    - access only to publicly available documentation, including white papers, tutorials, and support forums
    - contact customer service at any time of the day or night for account-related issues (such as bill payment)
    - limited access to the Trusted Advisor tool

- Developer Support Plan
    - starts at $29 /month
    - Suitable for running nonproduction workloads, not ideal for critical applications
    - AWS cloud support associates is limited to emails during business hours and to asking their advice on general information about AWS use cases.
    - The associates you contact when you open a support ticket won’t be able to discuss specific problems you’re having or details about the way your particular application should be deployed.

- Business Support Plan 
    - starts at $100 /month
    - meet the needs of many organizations
    - guarantees a response from a cloud support engineer via email, chat, or phone within one hour.
    - support can include help troubleshooting interoperability between AWS resources and third-party software and operating systems.

- Enterprise Support Plan
    - starting at $15,000/month
    - appropriate only for large operations whose scope is global and for whom downtime is simply unthinkable
    - the technical account manager (TAM) who is assigned as a dedicated “guide and advocate” for your account. the TAM becomes closely involved in your deployment, guiding your team through planning, launches, and proactive reviews—all optimized using best practices.
    - 24/7 access to senior cloud support engineers and a 15-minute response time for business-critical troubleshooting.

### AWS Professional Services

https://aws.amazon.com/professional-services.

### Documentation and Online Help

- https://docs.aws.amazon.com
- to get the latest version: `https://docs.aws.amazon.com/AmazonS3/latest/user-guide/what-is-s3.html`
- AWS Knowledge Center (https://aws.amazon.com/premiumsupport/knowledge-center) is basically a frequently asked questions (FAQ) page
- Security Resources: https://aws.amazon.com/security/security-resources
- Forums: https://forums.aws.amazon.com and 

### Trusted Advisor

- Trusted Advisor is to visually confirm whether your account resource configurations are sound and are compliant with best practices. 
- Full range of Trusted Advisor alerts is only available for users signed on to either the Business or Enterprise Support service tier
- free Basic Support plan has some security alerts

- Cost Optimization
- Performance
- Security
- Fault Tolerance
- Service Limits


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

- An edge location is a site where AWS deploys physical server infrastructure to provide lowlatency user access to Amazon-based data.
- Edge locations are smaller set of roles and  stock a much narrower set of hardware.
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

2. Developer: The second level, which you must obtain after getting userlevel access, is developer access. Amazon wants to know who is using its service for a number of reasons, including billing, which means you need a developer ID to obtain the required programmatic access to services.


### Most used AWS Services

1. Amazon S3: storing and retrieving the data
2. EC2 [Elastic Compute Cloud]: develop and deploy applications quickly and effectively for a low cost.
3. AWS Lambda: run code without any server.
4. Glacier: online web storage service that provides you with low cost.
5. Amazon SNS [Simple Notification Service]: manages and delivers the messages or notifications to the users and clients from any cloud platform. 
6. Amazon Elastic Beanstalk: Developers can easily deploy the services and web applications.
7. DynamoDB: NOSQL DB
8. Amazon RDS [Relational Database Service]
9.  Amazon ElastiCache: a memory cache system service on the cloud and supports Redis and Memcached.
10.  Amazon Redshift: a fully managed data warehouse service in the cloud.

### Certifications

Depense on the difficulties, easiest is on the top

1. AWS Certified Cloud Practitioner
2. AWS Certified Developer – Associate
3. AWS Certified Solutions Architect – Associate
4. AWS Certified SysOps Administrator – Associate
5. AWS Certified DevOps Engineer – Professional
6. AWS Certified Security – Specialty
7. AWS Certified Big Data – Specialty
8. AWS Certified Advanced Networking – Specialty
9. AWS Certified Solutions Architect – Professional


## Official 10-Minute Tutorials

See: https://aws.amazon.com/getting-started/tutorials/

### 1. Control your AWS Costs

- AWS Budgets is cost control tool that allows you to create custom cost budgets that alert you when you exceed your budgeted threshold.
- AWS Budgets has a Free Tier limit of 62 budget days per month
- It is a best practice to create a total monthly cost budget for each AWS account you use.

In toturail, I created three buget, they're:
1. When actual costs exceed 50%
2. When forecasted costs exceed 100%
3. When actual costs exceed 100%


### 2. Launch a Linux Virtual Machine

- Amazon Elastic Compute Cloud (EC2): create and run virtual machines in the cloud.
- Amazon Machine Image (AMI)
- Save your key pair in the .ssh sub-directory from your home directory (ex. ~/.ssh/MyKeyPair.pem).
    ```bash
    mv ~/Downloads/MyKeyPair.pem ~/.ssh/MyKeyPair.pem
    ```
Obstacle

1. Permission issue

    > Permissions 0644 for 'MyKeyPair.pem' are too open.
    It is required that your private key files are NOT accessible by others.
    This private key will be ignored.

    Solution: 
    ```bash
    chmod 400 MyKeyPair.pem
    ```

### 3. Deploy Code to a Virtual Machine

- AWS CodeDeploy, a service that automates code deployments to AWS or on-premises servers
- To deploy code to virtual machines that you create and manage with Amazon EC2. 

### 4. Deploy and host a ReactJS app

- AWS Amplify Console will now build your source code and deploy your app at https://<branchname>.<appid>.amplifyapp.com

- With AWS Amplify Console, you can continuously deploy your application in the cloud and host it on a globally available CDN.

### 5. Create and Connect to a MySQL Database

- Amazon RDS
- If you want to visit db from your local client, need to set Public accessibility to Yes.


## References

- [AWS for Developers For Dummies](https://www.amazon.com/AWS-Developers-Dummies-Computer-Tech/dp/1119371848)
- [AWS Services List - Top 10 AWS Services](https://mindmajix.com/top-aws-services)
- [Amazon Productions](https://aws.amazon.com/products/)

_Last Updated: Nov 2019_