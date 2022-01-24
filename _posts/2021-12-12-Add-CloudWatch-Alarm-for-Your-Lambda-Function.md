---
title: Add CloudWatch Alarms to A Lambda Function
tags:
  - CloudWatch
  - Lambda
  - Alarm
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Better monitoring your app.

## Jargons

## What alarms do you want to set for you service

![image](https://user-images.githubusercontent.com/73862580/150747559-84742745-663e-47bc-9db8-6eff11dcf58c.png)

### we want to alarm Errors on Lambda, yes we do

- 4xx response is not an error, it’s a response that indicates the client made a mistake
- 5xx response is not an error, it’s a response that indicates the code process had an issue
- an error would be something, the Lambda fails to respond, e.g., times out

### we want to alarm 4XX and 5XX errors on the API Gateway

(Why do we want to set alarms on API Gateway even though we already have alarms on the Lambda side?)

- We want to set an alarm on 5XX error. We have to do it on the API gateway
- Sometimes, Lambda successfully returns a response, however, it exceeds API Gateway’s 29s limit, it won’t trigger the alarm on the Lambda side
- we want to set up alarms for 4xx response too. Because we can monitor a DDos attack if there are too many 4xx responses in a short period of time

## Evaluating an alarm

see: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation

When you create an alarm, you specify three settings:

- `Period` is the length of time to evaluate the metric, in seconds.
- `Evaluation Periods` is the number of the most recent periods.
- `Datapoints` to Alarm is the number of data points within the Evaluation Periods that must be breaching to cause the alarm to go to the ALARM state.

## With SAM

```yml
MyFunctionErrorsAlarm:
    Type: 'AWS::CloudWatch::Alarm'
    Properties:
      ActionsEnabled: true
      AlarmDescription: 'My Function Errors'
      ComparisonOperator: GreaterThanOrEqualToThreshold
      Dimensions:
         - Name: FunctionName
           Value: !Sub "${AWS::StackName}-v1"
      EvaluationPeriods: 1
      MetricName: Errors
      Namespace: AWS/Lambda
      Statistic: Minimum
      Period: 60
      Threshold: 1
      TreatMissingData: notBreaching
      AlarmActions:
        - !Sub 'arn:aws:sns:${AWS::Region}:${AWS::AccountId}:MyCompany_Cloudwatch_Alarms_Topic'

MyApiGateway5XXErrorAlarm:
    Type: 'AWS::CloudWatch::Alarm'
    Properties:
      ActionsEnabled: true
      AlarmDescription: 'My-Blah-api-v1 ApiGateway 5XXError'
      ComparisonOperator: GreaterThanOrEqualToThreshold
      Dimensions:
        - Name: ApiName
          Value: !Sub "${AWS::StackName}-api-v1"
      EvaluationPeriods: 1
      MetricName: 5XXError
      Namespace: AWS/ApiGateway
      Statistic: Minimum
      Period: 60
      Threshold: 1
      TreatMissingData: notBreaching
      AlarmActions:
        - !Sub 'arn:aws:sns:${AWS::Region}:${AWS::AccountId}:MyCompany_Cloudwatch_Alarms_Topic'

  MyApiGateway4XXErrorAlarm:
    Type: 'AWS::CloudWatch::Alarm'
    Properties:
      ActionsEnabled: true
      AlarmDescription: 'My-Blah-api-v1 ApiGateway 4XXError'
      ComparisonOperator: GreaterThanOrEqualToThreshold
      Dimensions:
        - Name: ApiName
          Value: !Sub "${AWS::StackName}-api-v1"
      EvaluationPeriods: 1
      MetricName: 4XXError
      Namespace: AWS/ApiGateway
      Statistic: Sum
      Period: 60
      Threshold: 20
      TreatMissingData: notBreaching
      AlarmActions:
        - !Sub 'arn:aws:sns:${AWS::Region}:${AWS::AccountId}:MyCompany_Cloudwatch_Alarms_Topic'
```

about `Dimensions`

- current example is to pass in the function name (Lambda) to monitor
- if you want to monitor on an API gateway, you can do this way 

  ```yml
  - Name: ApiName
    Value: !Sub "${AWS::StackName}-api-v1"
  ```

## With CDK

```java
    private void buildCloudwatchAlarm(Function function, RestApi api) {
        var internalServerErrorMetric = MetricFilter.Builder.create(this, "LambdaErrorLogMetric")
                .metricName("MyApiLambdaErrors")
                .metricNamespace("my-project/Lambda")
                .filterPattern(FilterPattern.anyTerm("ERROR"))
                .logGroup(function.getLogGroup())
                .build();

        var alarms = List.of(
                Alarm.Builder.create(this, "LambdaFailureAlarm")
                        .metric(function.metricErrors())
                        .threshold(1)
                        .comparisonOperator(ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD)
                        .alarmDescription("My Api lambda failure")
                        .evaluationPeriods(1)
                        .treatMissingData(TreatMissingData.NOT_BREACHING)
                        .build(),

                Alarm.Builder.create(this, "ApiGateway4XXAlarm")
                        .metric(api.metricClientError())
                        .threshold(20)
                        .comparisonOperator(ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD)
                        .alarmDescription("High number of Api Gateway 4xx failures")
                        .evaluationPeriods(1)
                        .treatMissingData(TreatMissingData.NOT_BREACHING)
                        .build(),

                Alarm.Builder.create(this, "ApiGateway5XXAlarm")
                        .metric(api.metricServerError())
                        .threshold(1)
                        .comparisonOperator(ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD)
                        .alarmDescription("My Api Gateway 5xx failures")
                        .evaluationPeriods(1)
                        .treatMissingData(TreatMissingData.NOT_BREACHING)
                        .build(),

                Alarm.Builder.create(this, "LambdaDurationAlarm")
                        .metric(function.metricDuration())
                        .threshold(Duration.seconds(10).toMilliseconds())
                        .comparisonOperator(ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD)
                        .alarmDescription("High duration of My Api lambda")
                        .evaluationPeriods(1)
                        .treatMissingData(TreatMissingData.NOT_BREACHING)
                        .build(),
                Alarm.Builder.create(this, "LambdaErrorLogAlarm")
                        .metric(internalServerErrorMetric.metric())
                        .threshold(1)
                        .comparisonOperator(ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD)
                        .alarmDescription("My Api lambda errors logged")
                        .evaluationPeriods(1)
                        .treatMissingData(TreatMissingData.NOT_BREACHING)
                        .build()
        );

        if (DeployEnvironment.getAlarmArn() != null) {
            ITopic alarmTopic = Topic.fromTopicArn(this, "MyCompanyAlarmTopic", DeployEnvironment.getAlarmArn());
            alarms.forEach(alarm -> alarm.addAlarmAction(new SnsAction(alarmTopic)));
        }
    }
```

Set your metric

- your component/function. e.g., ApiGateway = `RestApi` or Lambda = `Function`
- they have their own metric, let your IDE help
  ![image](https://user-images.githubusercontent.com/73862580/150748884-151169dd-f99f-488a-afe4-cc51505ba34c.png)

evaluationPeriods + threshold

- during this period, how many occurrence will trigger this alarm
- e.g., for `metricClientError`, we don’t want to know each user’s error. However, It’s good idea to monitor high amount of client error in short period of time. It could be a DDoS attack. Curently we set an alarm, when 20 client errors per minute. It may change to a higher number later.

## Notes

1. don’t try to name your alarm, it will pick up a name from AWS. So that we don’t have to maintain a naming convention.

2. An AWS tutorial for Create a CloudWatch alarm based on a static threshold: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ConsoleAlarms.html

## References
