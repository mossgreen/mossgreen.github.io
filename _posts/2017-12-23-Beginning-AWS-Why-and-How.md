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

## Cloud Basic

- IaaS
- SaaS
- Paas

### Infrastructure as a Service (IaaS)

- Iaas provides access to virtualized computer resources over an Internet connection
- You essentially use IaaS to replace physical resources, such as servers, with virtual resources hosted and managed by Amazon.
- You can use IaaS to replace every physical element in your computing setup except
    - those required to establish and maintain Internet connectivity and 
    - those required to provide nonvirtualized services (such as printing)

Disadvantages:
1. Billing can become complex because some services are billed at different rates and within different time frames.
2. Systems-management monitoring becomes more difficult.
3. A lag often occurs between when a change in service is needed and when the host provides it.
4. Host downtime is unfixable.

### Software as a Service (SaaS)

- It's also called _software on demand_. 
- It's all about cloud-based applications
- A client typically accesses the application using a local application, such as a browser. The browser runs on local hardware, but the application runs on the host hardware.
- The host, Amazon, maintains the software, provides the required licenses, and does all the other work needed to make the software available.

### Platform as a Service (PaaS)

- PaaS is more of a development solution than a production environment solution.
- For example, Windows is a particular kind of platform. The virtual platform provided by PaaS allows a customer to develop, run, and manage applications of all sorts.


## Major AWS Competitors

- [Google Cloud Platform](https://cloud.google.com/products/): the prominence of machine learning services that aren’t found in AWS.

- [Microsoft Azure](https://azure.microsoft.com/) has strong SQL database-management support as well as the connection with the Windows platform that businesses may want to maintain.

- AWS has more to offer in the way of the Internet of Things (IoT), applications, and mobile services.


## What You Can Do With AWS Free Tier

1. [AWS starter projects](https://aws.amazon.com/getting-started/projects/)
2. [reddit discussion: Project ideas for using AWS free tier?](https://www.reddit.com/r/aws/comments/5zadfk/project_ideas_for_using_aws_free_tier/)


## Sign Up

To use AWS, you must have two levels of access:

1. User: The first level grants you user-level access to the various services. 

2. Developer: The second level, which you must obtain after getting userlevel access, is developer access. Amazon wants to know who is using its service for a number of reasons, including billing, which means you need a developer ID to obtain the required programmatic access to services.


## Most used AWS Services

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


## Certifications

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


## References

- [AWS for Developers For Dummies](https://www.amazon.com/AWS-Developers-Dummies-Computer-Tech/dp/1119371848)
- [AWS Services List - Top 10 AWS Services](https://mindmajix.com/top-aws-services)
- [Amazon Productions](https://aws.amazon.com/products/)

_Last Updated: Nov 2019_