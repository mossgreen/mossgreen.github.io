---
title: AWS Servcies - Security
search: true
tags:
  - AWS
  - SAA Certificatin
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---
IAM, KMS, IDF, etc.

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

### Web Identity Federation

Web identity federation is the best architecture to use where an external IDP is trusted to assume an IAM role.

If you are writing an application targeted at large numbers of users, you can optionally use web identity federation for authentication and authorization. Web identity federation removes the need for creating individual IAM users. Instead, users can sign in to an identity provider and then obtain temporary security credentials from AWS Security Token Service (AWS STS). The app can then use these credentials to access AWS services.

Web identity federation supports the following identity providers:

- Login with Amazon
- Facebook
- Google

### Authentication

three ways that IAM authenticates a principal:

1. User Name/Password. E.g., you login in AWS Management Console as an IAM user or root user.
2. Access Key. combination of an access key ID(20 characters) and an access secret key (40 characters). E.g., a proram that access the API with an IAM user or root user uses a two-part acess key.
3. Access key/ session token. E.g., a temporary security token authenticates with an access key plus and additional session token unique to that temporary security token.

### IAM database authentication

An authentication token is a string of characters that you use instead of a password. After you generate an authentication token, it's valid for 15 minutes before it expires. If you try to connect using an expired token, the connection request is denied.

You can use an authentication token when you connect to Amazon Aurora from another AWS service, such as AWS Lambda. By using a token, you can avoid placing a password in your code. Alternatively, you can use the AWS SDK for Java to programmatically create and programmatically sign an authentication token.

After you have a signed IAM authentication token, you can connect to an Aurora DB cluster.

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

## AWS Organizations

It's an account management service that lets you consolidate multiple AWS accounts into an organization that you create and centrally manage.

### Service control policies, SCPs

SCPs offer central control over the maximum available permissions for all accounts in your organization, allowing you to ensure your accounts stay within your organization’s access control guidelines.

SCPs are available only in an organization that has all features enabled.

SCPs alone are **not sufficient** for allowing access in the accounts in your organization.

Attaching an SCP to an **AWS Organizations entity** (root, OU, or account) defines a guardrail for what actions the principals can perform.

You still need to attach identity-based or resource-based policies to principals or resources in your organization's accounts to actually grant permissions to them.

### SCPs vs. IAM policy

- AWS Organizations does not replace associating IAM policies with users, groups, and roles within an AWS account.
- **IAM policies** let you allow or deny access to AWS services (such as Amazon S3), individual AWS resources (such as a specific S3 bucket), or individual API actions (such as s3:CreateBucket). An IAM policy can be applied only to IAM users, groups, or roles, and it can never restrict the root identity of the AWS account.
- **AWS Organizations** lets you use service control policies (SCPs) to allow or deny access to particular AWS services for individual AWS accounts, or for groups of accounts within an organizational unit (OU). The specified actions from an attached SCP affect all IAM users, groups, and roles for an account, including the root account identity. When an SCP is applied to an OU, it is inherited by all of the AWS accounts in that OU.

## Amazon Key Management Service, KMS

key words:

- In EBS, encrypted at rest
- In EBS, use KMS to generate encryption keys which can be used to encrypt the volume.

KMS provides regional, secure key management and encryption and decryption services. KMS is FIPS 140-2 level 2 validated, and certain aspects support level 3 (exam hint). Everything is KMS is regional. KMS can use CloudHSM via Custom key Stores (FIPS 140-2 Level 3)

KMS Manages customer master keys (CMK), which are created in region ans never leave the region or KMS. They can encrypt or decrypt data up to 4KB. CMKs have key policies and can be used to create other keys.

- KMS can **encrypt** data up to 4KB with a CMK - you can supply the data and specify the specify the key to use
- It can **decrypt** up to 4KB - you provide the ciphertext, and it returns the plaintext.
- You can **also re-encrypt** up to 4KB - you supply the ciphertext, the new key to use ,and you are returned new cipher text (at no point do you see the plaintext)

KMS can generate a data encyption key (DEK) using a CMK. YOu or a service can use a DEK to encrypt or decrypt data of any size. KMS supplies a plaintext version and an ecrypted version.

The encrypted DEK and encrypted data can be stored together. KMS is used to decrypt the DEK, which can the decrypte the data.

### Envelope encyption

When you encrypt your data, your data is protected, but you have to protect your encryption key. One strategy is to encrypt it.

**Envelope encryption** is the practice of encrypting plaintext data with a data key, and then encrypting the data key under another key.

Eventually, one key must remain in plaintext so you can decrypt the keys and your data. This top-level plaintext key encryption key is known as the **master key**.

AWS KMS helps you to protect your master keys by storing and managing them securely.

### Three types of AWS KMS

1. Customer managed CMK
2. AWS managed CMK
3. AWS owned CMK

## Amazon Identity federation, IDF and SSO

- **Identity federation (IDF)** is an architecture where identities of an external identity provider (IDP) are recognized.
- **Single sign-on (SSO)** is where the credentials of an external identity are used to allow access to a local system (e.g., AWS).

Types of IDF:

- **Crosee-acount roles**: a remote account (IDP) is allowed to assume a role and access your accout's resource.
- **SAML 2.0 IDF**: an on-premises or AWS-hosted directory service instance is configured to allow Active Directory users to log in to the AWS console.
- **Web Identity Federation**: IDPs sunch as Google, Amazon, and Facebook are allowed to assume roels and access resources in your account.

**Congnito** and the **Secure Token Service (STS)** are used for IDF. A federated identity is verified using an external IDP and by proving the identity (using a token or assertion of some kind) is allowed to swap that ID for temporary AWS credentials by assuming a role.

IDF is the process of allowing external identities to be used to indirectly access AWS services. This lesson covers the architecture of IDF using SAML 2.0 and web identities, and concludes with a brief demo using the Web Identity Federation Playground.

### When and hwo to use IDF

### Enterprise Access to AWS Resources

- users/staff have an existing pool of identities
- you need those identities to be used across all enterprise systems, including AWS
- access to AWS resources using SSO
- potentially tens or hundreds of thousands of users - more than IAM can handle
- you might have an ID team within your business

### Mobile and Web Application

- Mobile or web application requries access to AWS resources
- you need a certain level of guest access - and extra once logged in
- customers have other identities - Google, Twitter, Facebook, etc - and need to use those
- you don't want credentials stored within the application
- could be millions or more users - beyond the capabilities of IAM
- customers might have multiple third-party logins, but they represent one real person

### Centralized identity Management (AWS Accounts)

- tens or hundreds of AWS accounts in an organization
- need central store of IDs - either IAM or an external provider
- roels switching used fro man ID account into memeber accounts

### Congito vs. others

Amazon Cognito lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily. Amazon Cognito scales to millions of users and supports sign-in with social identity providers, such as Facebook, Google, and Amazon, and enterprise identity providers via SAML 2.0.

Congito user pool provides sign up and sign in funcitonality along with identity pool which provides temp credentials for using aws services.

- KMS is for encryption, not for IAM
- Directory Service is for connecting on Prep AD.
- IAM is not suitable for mobile platform

## References

- [Linux Academy: AWS Certified Solutions Architect - Associate Level](https://linuxacademy.com/course/aws-certified-solutions-architect-2019-associate-level)
- [AWS Certified SAA 2018 - Exam Feedback](https://acloud.guru/forums/aws-certified-solutions-architect-associate/discussion/-KSDNs4nfg5ikp6yBN9l/exam_feedback_-_20_specific_po)
- [AWS Certified Solutions Architect Official Study Guide: Associate Exam](https://www.amazon.com/Certified-Solutions-Architect-Official-Study/dp/1119138558) (out-of-date)
