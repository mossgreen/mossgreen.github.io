---
title: AWS CloudFormation 101
tags:
  - AWS
  - CloudFormation
  - IaC
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Simplify infrastructure management

## Jargons

- CloudFormation:
  AWS CloudFormation is a service that helps you model and set up your AWS resources so that you can spend less time managing those resources and more time focusing on your applications that run in AWS.

- template:  
  - CloudFormation uses these templates as blueprints for building your AWS resources.
  - A template is a declaration of the AWS resources that make up a stack.

- CloudFormation functions

- Stack: related resources as a single unit called a stack.

- Change sets: a preview of changes that will be executed by stack operations to create, update, or remove resources.

- StackSets: is a group of stacks you manage together that can replicate a group.

- CloudFormation registry

## CloudFormation Template

- `Template` includes six top-level sections: `AWSTemplateFormatVersion`, `Description`, `Parameters`, `Mappings`, `Resources`, and `Outputs`. Only the Resources section is required. Others are optional.

- The `Resources` section contains the definitions of the AWS resources you want to create with the template. Each resource is listed separately and specifies the properties that are necessary for creating that particular resource.

- You use the `Parameters` section to declare values that can be passed to the template when you create the stack.

- A `parameter` is an effective way to specify sensitive information, such as user names and passwords, that you don't want to store in the template itself.

### Resources

```yml
Resources:
  HelloBucket:
    Type: AWS::S3::Bucket
```

- When CloudFormation creates the resource, it generates a physical name that is based on the combination of the logical name, the stack name, and a unique ID.
- The Resources object contains a list of resource objects
- A resource must have a `Type` attribute, format: `AWS::ProductIdentifier::ResourceType`, in this case: `Type: AWS::S3::Bucket`
- Logical ID: Use the logical name to reference the resource in other parts of the template.
- Creating a bucket with default settings, don't need more `Properties`, however
- when you create a EC2, which requires more infomation other then default settings, use `Properties` attribute to specify, e.g.,

    ```yml
    Resources:
      HelloBucket:
        Type: AWS::S3::Bucket
        Properties:
          AccessControl: PublicRead
          WebsiteConfiguration:
            IndexDocument: index.html
            ErrorDocument: error.html
    ```

### Parameters

Parameters enable you to input custom values to your template each time you create or update a stack, so that allows us to make our template reusable.
You pass parameters either in a JSON file or as a command-line argument.

1. how to refer to input parameters
2. receiving user input using input parameters

#### Defining a parameter in a template

```yml
Parameters:
  KeyName:
    Description: The EC2 Key Pair to allow SSH access to the instance
    Type: 'AWS::EC2::KeyPair::KeyName'
```

#### Referencing a parameter

- `Ref` function to refer to an identifying property of a resource.
- You can reference parameters from the Resources and Outputs sections of the same template.

```yml
Parameters:
  KeyName:
    Description: The EC2 Key Pair to allow SSH access to the instance
    Type: 'AWS::EC2::KeyPair::KeyName'
Resources:
  Ec2Instance:
    Type: 'AWS::EC2::Instance'
    Properties:
      SecurityGroups:
        - !Ref InstanceSecurityGroup
        - MyExistingSecurityGroup
      KeyName: !Ref KeyName
      ImageId: ami-7a11e213
  InstanceSecurityGroup:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupDescription: Enable SSH access via port 22
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: '22'
          ToPort: '22'
          CidrIp: 0.0.0.0/0
```

The `SecurityGroups` property is a list of security groups, you can add a `Ref`, and also can have you existing group names

Ref vs Fn::GetAtt

1. The `Ref` function is handy if the parameter or the value returned for a resource is exactly what you want
2. need other attributes of a resource
   - For example, if you want to create a CloudFront distribution with an S3 origin, you need to specify the bucket location by using a DNS-style address. A number of resources have additional attributes whose values you can use in your template. To get these attributes, you use the Fn::GetAtt function.

```yaml
Resources:
  myBucket:
    Type: 'AWS::S3::Bucket'
  myDistribution:
    Type: 'AWS::CloudFront::Distribution'
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt 
              - myBucket
              - DomainName
            Id: myS3Origin
            S3OriginConfig: {}
        Enabled: 'true'
        DefaultCacheBehavior:
          TargetOriginId: myS3Origin
          ForwardedValues:
            QueryString: 'false'
          ViewerProtocolPolicy: allow-all
```

The `Fn::GetAtt` function takes two parameters in an array

   1. the logical name of the resource `myBucket`
   2. the name of the attribute to be retrieved `DomainName`

#### parameter declarations, restrict and validate user input

```yml
Parameters:
  KeyName:
    Description: Name of an existing EC2 KeyPair to enable SSH access into the WordPress web server
    Type: AWS::EC2::KeyPair::KeyName
  WordPressUser:
    Default: admin
    NoEcho: true
    Description: The WordPress database admin account user name
    Type: String
    MinLength: 1
    MaxLength: 16
    AllowedPattern: "[a-zA-Z][a-zA-Z0-9]*"
```

- You declare parameters the `Parameters`
- A parameter contains a list of attributes and constraints
- The only required attribute is **Type**, e.g., `Type: AWS::EC2::KeyPair::KeyName`
- no `Default` will throw exception if user failed to provide one `Parameters: [KeyName] must have values.`

type validations

- AWS-specific parameter type: CloudFormation validates
- String type: MinLength, MaxLength, Default, AllowedValues, and AllowedPattern
- Number type: MinValue, MaxValue, Default, and AllowedValues

**Do not embed credentials in your templates!**

Rather than embedding sensitive information directly in your CloudFormation templates, we recommend you use dynamic parameters in the stack template to reference sensitive information that is stored and managed outside of CloudFormation, such as in the AWS Systems Manager Parameter Store or AWS Secrets Manager.

### Mappings

- Mappings are similar to parameters, but are provided in a dictionary format.
- Specify the right resource based on a conditional input, e.g., region dependent resource.
- Maintaining mappings can be troublesome, so the best way of using them is to store constant values that are rarely changed
- There are two template features that can help, the Mappings object and the AWS::Region pseudo parameter.

  1. `Pseudo parameters` resolved by CloudFormation.
     - The `AWS::Region` pseudo parameter enables you to get the region where the stack is created.
  2. `Mappings` enable you to use an input value as a condition that determines another value. Similar to **a switch statement**

- `Fn::FindInMap` function takes in 3 parameters
  1. passing the name of the map,
  2. the value used to find the mapped value,
  3. and the label of the mapped value you want to return.

```yml
Parameters:
  KeyName:
    Description: Name of an existing EC2 KeyPair to enable SSH access to the instance
    Type: String
Mappings:
  RegionMap:
    us-east-1:
      AMI: ami-76f0061f
    us-west-1:
      AMI: ami-655a0a20
    eu-west-1:
      AMI: ami-7fd4e10b
    ap-southeast-1:
      AMI: ami-72621c20
    ap-northeast-1:
      AMI: ami-8e08a38f
Resources:
  Ec2Instance:
    Type: 'AWS::EC2::Instance'
    Properties:
      KeyName: !Ref KeyName
      ImageId: !FindInMap 
        - RegionMap
        - !Ref 'AWS::Region'
        - AMI
      UserData: !Base64 '80'
```

### Conditions

- While `Mappings` is like a swith statement, `Conditions` is like a if-else statement.
- Conditions are declared in a separate block in the template and are referred to in the resource declaration.
- You might use conditions when you want to reuse a template that can create resources in different contexts:
  - add an `EnvironmentType` input parameter, which accepts either `prod` or `test` as inputs
  - For the production environment, you might include Amazon EC2 instances with certain capabilities; however, for the test environment, you want to use reduced capabilities
- Within each condition, you can reference another condition, a parameter value, or a mapping.
- Depending on the entity you want to conditionally create or configure, you must include statements in the following template sections:
  - Parameters: Define the inputs that you want your conditions to evaluate
  - Conditions: Define conditions by using the intrinsic condition functions.
  - Resources and Outputs
- defination

    ```yaml
    Conditions:
      Logical ID:
        Intrinsic function
    ```

- Condition intrinsic functions
  - Fn::And
  - Fn::Equals
  - Fn::If
  - Fn::Not
  - Fn::Or

- Example

    ```yaml
    AWSTemplateFormatVersion: 2010-09-09
    Parameters:
      EnvType:
        Description: Environment type.
        Default: test
        Type: String
        AllowedValues:
          - prod
          - test
        ConstraintDescription: must specify prod or test.
    Conditions:
      CreateProdResources: !Equals 
        - !Ref EnvType
        - prod
    Resources:
      EC2Instance:
        Type: 'AWS::EC2::Instance'
        Properties:
          ImageId: ami-0ff8a91507f77f867
      MountPoint:
        Type: 'AWS::EC2::VolumeAttachment'
        Condition: CreateProdResources
        Properties:
          InstanceId: !Ref EC2Instance
          VolumeId: !Ref NewVolume
          Device: /dev/sdh
      NewVolume:
        Type: 'AWS::EC2::Volume'
        Condition: CreateProdResources
        Properties:
          Size: 100
          AvailabilityZone: !GetAtt 
            - EC2Instance
            - AvailabilityZone
    ```

### Output vs Fn::Join

- Outputs are the values we export from the stack after its creation.
- Outputs can retrieve the physical name or ID of the resource or its attributes.

- `Fn::Join`
  - function takes two parameters, a delimiter that separates the values you want to concatenate and 
  - an array of values in the order that you want them to appear.
  - e.g., the Fn::Join function specifies an empty string as the delimiter and HTTP:, the value of the WebServerPort parameter, and a / character as the values to concatenate. If WebServerPort had a value of 8888, the Target property: `HTTP:8888/`

    ```yml
    HealthCheck:
    Target: !Join 
      - ''
      - - 'HTTP:'
        - !Ref WebServerPort
        - /
    ```

  - `Fn::Join` function is also useful for declaring output values for the stack. An output is a convenient way to capture important information about your resources or input parameters.

    ```yml
    Outputs:
      InstallURL:
        Value: !Join 
          - ''
          - - 'http://'
            - !GetAtt 
              - ElasticLoadBalancer
              - DNSName
            - /wp-admin/install.php
        Description: Installation URL of the WordPress website
      WebsiteURL:
        Value: !Join 
          - ''
          - - 'http://'
            - !GetAtt 
              - ElasticLoadBalancer
              - DNSName
    ```

    out put: `http://mywptests-elasticl-1gb51l6sl8y5v-206169572.us-east-2.elb.amazonaws.com/wp-admin/install.php`

## AWS pseudo parameters

They are obtained from AWS itself.

- AWS::AccountId
  - use it when we are using an IAM principal
  - it is dangerous to expose your AWS account ID, we should always stick to using AWS pseudo parameters when we specify this kind of sensitive information.

- AWS::NotificationARNs

- AWS::NoValue
  - equivalent of the null value.

- AWS::Region
  - best practice to use this pseudo parameter, even if you don't plan to deploy multi-regional applications
  - `awslogs-region: !Ref "AWS::Region"`: create a CloudWatch log group in the same region where the stack resources were provisioned

- AWS::StackId
- AWS::StackName
- AWS::URLSuffix
  - needed for specifying AWS URLs. In 99% of cases, it's going to be `amazonaws.com`

- AWS::Partition
  - When we need to define an ARN of the resource manually

## CloudFormation vs SAM

SAM template is designed to be used with serverless applications and services.

- AWS::Serverless::API: Creates an API gateway and related resources
- AWS::Serverless::Application: Creates a serverless application
- AWS::Serverless::Function: Creates a Lambda function and related resources
- AWS::Serverless::HttpApi: Creates an HTTP API gateway and related resources
- AWS::Serverless::LayerVersion: Creates a Lambda layer
- AWS::Serverless::SimpleTable: Creates a simplified DynamoDB table (only a primary key without a sort key)

## References

- [Learn template basics](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/gettingstarted.templatebasics.html#gettingstarted.templatebasics.parameters)
