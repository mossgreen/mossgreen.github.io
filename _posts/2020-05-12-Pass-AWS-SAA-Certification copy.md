---
title: Pass AWS SAA Certification, SAA-C01
search: true
tags:
  - AWS
  - SAA
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

AWS Certified Solutions Architect - Associate, SAA-C01

## Reason why I take the exam

- We use lots of AWS services on production
- They're fast and stable
- AWS vs. Azure

## Where to start

- AWS Official Online labs
- Linux academy ★★
- Only a subset of services are in the test

## Amazon Services in SAA

- `★★` appears in SAA exam, multiple questions
- `★` appears in SAA exam, few question
- `(no start)` Mentioned in SAA exam, but it's not an exam point

1. Analytics
    - Amazon Athena
    - Amazon Kinesis ★★
      - Amazon Kinesis Stream

2. Application Integration
    - Amazon Step functions (with Lambda)
    - SNS&SQS ★★

3. Compute
    - EC2 ★★
      - types
      - Monitoring ★
    - EC2 Auto Scaling ★★
    - Elastic Beanstalk
    - Lambda ★★

4. Containers
    - ECS ★

5. Database
    - Aurora ★★
    - DynamoDB ★★
    - ElastiCache ★
    - RDS ★★
    - Redshift ★

6. Management & Governance
    - CloudWatch ★★
       - Memory monitoring ★
    - CloudTrail ★
    - CloudFormation
    - AWS Config
    - AWS Organizations

7. Networking & content Delivery
    - Amazon VPC ★★
    - API Gateway ★
    - CloudFront ★★
      - CloudFront IOA ★★
    - Route 53 ★★
    - PrivateLink
    - Elastic Load Balancing ★★
      - ALB ★★
      - NLB

8. Security, Identity & Compliance
    - IAM ★★
    - KMS ★★
      - KMS-S3 ★*
      - KMS-C
    - Congito ★
    - WAF

9. Storage
    - S3 ★★
      - lifecycle policy ★★
      - types ★★
      - content hosting ★
    - S3 Glacier ★
    - EBS ★
    - EFS ★
    - Storage Gateway

## Next Steps

After this certification, my eyes are opened up. My plans:

1. How to test AWS services locally? Current solution is to set up testing AWS resource. I know there are some frameworks can do this job. So I'll try them out.
2. From MicroServices, to MicroServices Mesh. In fact, serverless is the true future. I want to try more Servicesless services.
3. Dive into SNS*SQS, to see more posibilities.
4. Pass the professional level certification when I'm ready.
