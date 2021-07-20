---
title: Use AWS X-Ray in Lambda
tags:
  - AWS
  - Lambda
  - XRay
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Identify performance bottlenecks

## Jargons

## Configuration

### 1. Maven

```xml
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-xray-recorder-sdk-core</artifactId>
    <version>1.2.1</version>
</depe
```

### 2. Handle an exception from XRAY class

1. do `export AWS_XRAY_CONTEXT_MISSING=LOG_ERROR` in your terminal to fix your failing integration test

2. in `buildspec.yml`, fix for your CI/CD pipe line

    ```yaml
    env:
      variables:
        AWS_XRAY_CONTEXT_MISSING: "LOG_ERROR"
    ```

### 3. `TracingEnabled`

```yaml
Resources:
  HelloWorldAPI:
    Type: AWS::Serverless::Api
    Properties:
      StageName: v1
      TracingEnabled: true
```

```yaml
Resources:
  HelloWorldAPIService:
    Type: 'AWS::Serverless::Function'
    Properties:
      Timeout: 900
      Environment:
        Variables:
          PARAM_NAME_DB_HOST: "awsdb.com"
          PARAM_NAME_DB_USER: "postgres"
          PARAM_NAME_DB_PASS: "password"
          PARAM_NAME_DB_PORT: "5432"
          AWS_XRAY_CONTEXT_MISSING: LOG_ERROR
```

## Add Segment

```java
public void myMethod(){

  AWSXRay.beginSubsegment("fetching user");
  User user = userService.getUser(userId);
  AWSXRay.endSubsegment();

  AWSXRay.beginSubsegment("fetching configs");
  Config config = configService.getConfigs(userId);
  AWSXRay.endSubsegment();
}
```

## X-Ray vs RayGun

// todo

## References

- [Getting started with AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-gettingstarted.html)
- [Using AWS Lambda with AWS X-Ray](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html)
