---
title: AWS Lambda with Java
tags:
  - AWS
  - Lambda
  - CloudFormation
  - SAM
  - ApiGateway
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

some lambda related concepts

## Jargons

- serverless
- cold start

## Lambda runtime

### Lambda Execution Environment

![image](https://user-images.githubusercontent.com/73862580/149485283-84d64ca2-a826-431a-b514-b4d69ddb5d87.png)

There is no "Main" method in code. Lambda Java Runtime will act as the server, like Tomcat.

### Lambda execution environment lifecycle

![image](https://user-images.githubusercontent.com/73862580/149485798-82ff8eb2-20a7-4b8d-8b6d-d8e5cbf02149.png)

1. `Init`:
   1. Lambda creates or unfreezes an execution environment with the configured resources
   2. downloads the code for the function and all layers
   3. initializes any extensions
   4. initializes the runtime
   5. run the function’s initialization code (static code, the code outside the main handler)
   6. The Init phase happens either during the first invocation, or in advance of function invocations if you have enabled `provisioned concurrency`
   7. The Init phase is limited to 10 seconds. Lambda retries the Init phase at the time of the first function invocation.
2. `Invoke`
   1. Lambda invokes the function handler
   2. After the function runs to completion, Lambda prepares to handle another function invocation
3. `Shutdown`: This phase is triggered if the Lambda function does not receive any invocations for a period of time

## Lambda Function

In real use cases, the input to the Lambda function will be a JSON object that repre‐sents an event from some other component or system

### Method Signatures

Valid Java Lambda methods must fit one of the following four signatures:

- `output-type handler-name(input-type input)`
- `output-type handler-name(input-type input, Context context)`
- `void handler-name(InputStream is, OutputStream os)`
- `void handler-name(InputStream is, OutputStream os, Context context)`

where

- `output-type` can be void, a Java primitive, or a JSON-serializable type.
- `input-type` is a Java primitive, or a JSON-serializable type.
- `Context` refers to `com.amazonaws.services.lambda.runtime.Context`. It gives information about the current Lambda invocation. We can use this formation during the processing of a Lambda event
- `handler-name` can be any valid Java method name, and we refer to it in application’s configuration
- Java Lambda methods can be either instance methods or static methods, but **must be public**

### Events

- An event is a JSON object that contains information about what happened
- Events are facts about a change in the system state, they are immutable, and the time when they happen is significant
- The first parameter of every Lambda handler contains the event.
- you determine the structure and contents of the event
- When an AWS service invokes your function, the service defines the shape of the event

  ```bash
  $ sam local generate-event apigateway aws-proxy
  {
    "body": "eyJ0ZXN0IjoiYm9keSJ9",
    "resource": "/{proxy+}",
    "path": "/path/to/resource",
    "httpMethod": "POST",
    "isBase64Encoded": true,
    "queryStringParameters": {
      "foo": "bar"
    },
    ...
  }
  ```

### Context

- `getRemainingTimeInMillis()` – Returns the number of milliseconds left before the execution times out.
- ``getFunctionName()` – Returns the name of the Lambda function.
- ``getFunctionVersion()` – Returns the version of the function.
- ``getInvokedFunctionArn()` – Returns the Amazon Resource Name (ARN) that's used to invoke the function. Indicates if the invoker specified a version number or alias.
- ``getMemoryLimitInMB()` – Returns the amount of memory that's allocated for the function.
- ``getAwsRequestId()` – Returns the identifier of the invocation request.
- ``getLogGroupName()` – Returns the log group for the function.
- ``getLogStreamName()` – Returns the log stream for the function instance.
- ``getIdentity()` – (mobile apps) Returns information about the Amazon Cognito identity that authorized the request.
- ``getClientContext()` – (mobile apps) Returns the client context that's provided to Lambda by the client application.
- ``getLogger()` – Returns the logger object for the function.

```xml
<dependency>
  <groupId>com.amazonaws</groupId>
  <artifactId>aws-lambda-java-core</artifactId>
  <version>1.2.0</version>
  <scope>provided</scope>
</dependency>
```

### Environment Variable

you can create two functions with the same code but different environment variables. One function connects to a test database, and the other connects to a production database. In this situation, you use environment variables to tell the function the hostname and other connection details for the database.

#### Retrieve environment variables

Note: Use AWS Secrets Manager instead of environment variables to store database credentials

```java
public class EnvVarLambda {   
  public void handler(Object event) {     
    String databaseUrl = System.getenv("DATABASE_URL");     
    if (databaseUrl == null || databaseUrl.isEmpty())       
      System.out.println("DATABASE_URL is not set");
    else
      System.out.println("DATABASE_URL is set to: " + databaseUrl);   
  } 
}
```

## Invoking Lambda Functions

- You can invoke a function synchronously (and wait for the response), or asynchronously.
- To invoke a function asynchronously, set InvocationType to Event.
- For asynchronous invocation, Lambda adds events to a queue before sending them to your function. If your function does not have enough capacity to keep up with the queue, events may be lost. Occasionally, your function may receive the same event multiple times, even if no error occurs. To retain events that were not processed, configure your function with a dead-letter queue.

|Event Source Type|Event Sources|
|---|---|
|Synchrinous|Api Gateway, CloudFront (lambda@Edge), Application Load Balancer, Cognito, Lex, Alexa, Kinesis Data Firehose|
|Asynchronous|S3, SNS, SES, CloudFormation, CloudWatch logs, CloudWatch events, CodeCommit, Config|
|Steam/Queue|Kinesis Data Stream, DynamoDb Streams, SQS|

![image](https://user-images.githubusercontent.com/73862580/149617457-b32f5d43-2e28-4745-ba6c-b3782ee55b8a.png)

### 1. Synchronous invocation, e.g., work with ApiGateway

- When you invoke a function synchronously, Lambda runs the function and waits for a response
- The AWS CLI and AWS SDK also automatically retry on client timeouts, throttling, and service errors

![image](https://user-images.githubusercontent.com/73862580/149615710-b68db0a8-bab0-438f-bca4-cea7d4836b8b.png)

```bash
// invoke
aws lambda invoke --function-name my-function --payload '{ "key": "value" }' response.json

// retrieve  LogResult
aws lambda invoke --function-name my-function out --log-type Tail \
--query 'LogResult' --output text |  base64 -d
```

#### ApiGateway aws-proxy event

- the current version of HTTP APIs doesn’t support custom/Lambda authorizers, but instead you could implement this feature within your Lambda handler code.
- The one we typically want from this list is the aws-proxy event, where API Gateway acts as a proxy server in front of a Lambda function,

```bash
$ sam local generate-event apigateway

Commands:
  authorizer  Generates an Amazon API Gateway Authorizer Event
  aws-proxy   Generates an Amazon API Gateway AWS Proxy Event

$ sam local generate-event apigateway aws-proxy
{
  "body": "eyJ0ZXN0IjoiYm9keSJ9",
  "resource": "/{proxy+}",
  "path": "/path/to/resource",
  "httpMethod": "POST",
  "isBase64Encoded": true,
  "queryStringParameters": {
    "foo": "bar"
  },
  ...
}
```

#### Configuring a lambda event source

```yaml
HelloAPILambda:
    Type: AWS::Serverless:Function
    Properties:
        Runtime: java8
        Handler: packageName.ClassNameAPI::handler
        CodeUri: target/lambda.zip
        Events:
            MyApiGateway:
                Type:api
                properties:
                    Path: /foo
                    Method: get

```

### 2. Asynchronise, work with SNS

![image](https://user-images.githubusercontent.com/73862580/149616305-bc573b88-4899-4372-96af-7c596720e7f3.png)

- S3 or SNS invokes functions asynchronously to process events
- For asynchronous invocation, Lambda queues the event, before passing it to your function
- When Lambda queues the event, it immediately sends a success response to the service that generated the event
- After the function processes the event, Lambda doesn’t return a response to the event-generating service

```bash
aws lambda invoke \
  --function-name my-function  \
      --invocation-type Event \
          --cli-binary-format raw-in-base64-out \
              --payload '{ "key": "value" }' response.json
```

#### Retry logic

- If the function returns an error, Lambda attempts to run it two more times:
  - with a one-minute wait between the first two attempts
  - two minutes between the second and third attempts
- If the function doesn't have enough concurrency available to process all events, additional requests are throttled. For throttling errors (429) and system errors (500-series), Lambda returns the event to the queue and attempts to run the function again for up to 6 hours.
  - The retry interval increases exponentially from 1 second after the first attempt to a maximum of 5 minutes.
  - If the queue contains many entries, Lambda increases the retry interval and reduces the rate at which it reads events from the queue.

#### handle timeout and errors

Ensure that your function code gracefully handles duplicate events, and that you have enough concurrency available to handle all invocations

- events may deliverd multiple times occationally
- If the function can't keep up with incoming events, events might also be deleted from the queue without being sent to the function
- When the queue is very long, new events might age out before Lambda has a chance to send them to your function. When an event expires or fails all processing attempts, Lambda discards it. You can configure error handling for a function to reduce the number of retries that Lambda performs, or to discard unprocessed events more quickly.

#### Configuring error handling for asynchronous invocation

Configure the following settings.

- Maximum age of event – The maximum amount of time Lambda retains an event in the asynchronous event queue, up to 6 hours.
- Retry attempts – The number of times Lambda retries when the function returns an error, between 0 and 2.

e.g. for SQS

1. Set the queue’s visibility timeout to at least six times the function timeout value. This allows the function time to process each batch of records if the function execution is throttled while processing a previous batch.
2. Set the maxReceiveCount on the source queue’s redrive policy to at least 5. This improves the chances of messages being processed before reaching the DLQ.
3. Ensure idempotency to allow messages to be safely processed more than once.

#### on-failure destination: Dead-letter queues

configure your function with a dead-letter queue to save discarded events for further processing.

To reprocess events in a dead-letter queue, you can set it as an event source for your Lambda function. Alternatively, you can manually retrieve the events.

You can choose an Amazon SQS queue or Amazon SNS topic for your dead-letter queue.

- Amazon SQS queue – A queue holds failed events until they're retrieved. Choose an Amazon SQS queue if you **expect a single entity**, such as a Lambda function or CloudWatch alarm, to process the failed event

- Amazon SNS topic – A topic relays failed events to one or more destinations. Choose an Amazon SNS topic if you expect multiple entities to act on a failed event. For example, you can configure a topic to send events to an email address, a Lambda function, and/or an HTTP endpoint.

### Work with streams, aka. Event source mappings

You can use event source mappings to process items from a stream or queue in services that don't invoke Lambda functions directly.

example: an event source mapping that reads from a Kinesis stream

For streams, an event source mapping creates an iterator for each shard in the stream, and processes items in each shard in order. You can configure the event source mapping to read only new items that appear in the stream, or to start with older items. Processed items aren't removed from the stream, and other functions or consumers can process them.

- By default, if your function returns an error, the entire batch is reprocessed until the function succeeds, or until the items in the batch expire
- To ensure in-order processing, Lambda pauses processing for the affected shard until the error is resolved
- You can configure the event source mapping to discard old events, restrict the number of retries, or process multiple batches in parallel
- If you process multiple batches in parallel, in-order processing is still guaranteed for each partition key, but multiple partition keys in the same shard are processed simultaneously.

## Classic Lambda use cases

Serverless applications generally fall into several common categories:

1. Web applications
2. Web and mobile backends
3. Data processing: event-based processing tasks triggered by data changes in data stores, or streaming data ETL tasks with Amazon Kinesis and Lambda.
4. Parallelized computing tasks (Fan out?): splitting highly complex, long-lived computations to individual tasks across many Lambda function instances to process data more quickly in parallel.
5. Internet of Things (IoT) workloads

Lambda acts as glue between the services, providing business logic to transform data as it moves between services.

### event-driven vs request-driven

For simpler applications, the difference between event-driven and request-driven applications may not be clear. As your applications develop more functionality and handle more traffic, this becomes more apparent.

- Request-driven applications typically use directed commands to coordinate downstream functions to complete an activity
- Event-driven applications create events that are observable by other services and systems, but the event producer is unaware of which consumers, if any, are listening.

### use cases

1. Using service integrations and asynchronous processing

A Lambda function consumes these messages from the queue, and updates the status in a DynamoDB table. Another API endpoint provides the status of the request by querying the DynamoDB table:

## Lambda Quotas and limitations

### Quotas

|Resource|Default quota| Can be increased up to|
|---|---|---|
|Concurrent executions| 1000  |tens of thousands|
|Storage for uploaded functions (.zip file archives) and layers|75 GB|Terabytes|

|Resource|Quota|
|---|---|
|Invocation payload (request and response)| - 6 MB (synchronous)<br/> - 256 KB (asynchronous)|
|Deployment .zip package| - 50 MB (zipped)<br> - 250 MB (unzipped)|
|/tmp directory storage| 512MB|

### Limitations

1. payload size
For an application moving a payload from API Gateway to Lambda to SQS, API Gateway supports payloads up to 10 Mb, while Lambda’s payload limit is 6 Mb and the SQS message size limit is 256 Kb. In this example, you could instead store the payload in an S3 bucket instead of uploading to API Gateway, and pass a reference token across the services. The token size is much smaller than any payload limit and may be a more efficient design for your workload, depending upon the use-case.

2. shared resources
if you have development resources in the same account as production workloads, quotas are shared across both. It’s possible for development activity to exhaust resources unintentionally that you may want to reserve only for production.
An effective way to solve this issue is to use multiple AWS accounts, dedicating workloads to their own specific account.
3. Controlling traffic flow for server-based resources

   - Lambda can scale up quickly in response to traffic, it’s possible to overwhelm downstream services with data or connection requests.
   - If your serverless workload has the capacity to overwhelm those resources, use an SQS queue to decouple the Lambda function from the target. This allows the server-based resource to process messages from the queue at a steady rate. The queue also durably stores the requests if the downstream resource becomes unavailable.
   - RDS are connection-based, so they are intended to work with a few long-lived clients, such as web servers
   - The Amazon RDS Proxy service is built to solve the high-volume use-case. It pools the connections between the Lambda service and the downstream Amazon RDS database. This means that a scaling Lambda function is able to reuse connections via the proxy. As a result, the relational database is not overwhelmed with connections requests from individual Lambda functions. This does not require code changes in many cases. You only need to replace the database endpoint with the proxy endpoint in your Lambda function.

## References

- [Event-driven architectures](https://docs.aws.amazon.com/lambda/latest/operatorguide/event-driven-architectures.html)
- [Invoking Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html)
- [Programming AWS Lambda](https://www.oreilly.com/library/view/programming-aws-lambda/9781492041047/)