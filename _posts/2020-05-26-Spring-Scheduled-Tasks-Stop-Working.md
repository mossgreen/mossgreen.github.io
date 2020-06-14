---
title: Spring Scheduled Tasks Stop Working
search: true
tags:
  - Spring
  - Scheduled Tasks
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Investigate and fix stopped Spring Scheduled Tasks.

## The issue

I have a Spring Scheduled task just stopped on production. In the log, see the task run every minitue, and it just disappears for good untile I restarted the docker container.

```log
2020-05-22 14:04:32.801  INFO 1 --- [   scheduling-1] org.xxx.xxx.xxx             : scheduled task is running
2020-05-22 14:05:32.801  INFO 1 --- [   scheduling-1] org.xxx.xxx.xxx             : scheduled task is running
2020-05-22 14:06:32.801  INFO 1 --- [   scheduling-1] org.xxx.xxx.xxx             : scheduled task is running
```

## Investigate

### 1. ThreadPool size

The scheduled tasks thread pool size by default is 1. I had a look our Services, there're 10 more scheduled tasks other than mine. So the size should bigger.

In the log, `scheduling-1` is the thread name. This thread is reused all the time. If there is anything run too long, and the thread pool cannot recycle it, all scheduled tasks will stop.

### 2. AOP method to log all `@Scheduled` execution time

1. Dependencies

    ```gradle
    compile("org.springframework.boot:spring-boot-starter-aop")
    ```

2. AOP

    ```java
    @Aspect
    @Component
    public class LoggingAspect {

        @Around("@annotation(org.springframework.scheduling.annotation.Scheduled)")
        public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
            long start = System.currentTimeMillis();

            Object proceed = joinPoint.proceed();

            long executionTime = System.currentTimeMillis() - start;

            if (executionTime > 1000) {
                System.out.println(joinPoint.getSignature() + " executed in " + executionTime + "ms ----- attention");
            } else {
                System.out.println(joinPoint.getSignature() + " executed in " + executionTime + "ms");
            }

            return proceed;
        }
    }
    ```

    NB: `@annotation(org.springframework.scheduling.annotation.Scheduled)` is the package name.

3. Find your long running tasks

    Watch your log and find out thoese tasks took too long time.

    - Query/Update db actions
    - IO

## Fix

After investigation, I've known the tasks that took most of time and how many threads I need.

### 1. Larger ThreadPool size

Add `config/ScheduledTaskConfig.java`

```java
@Configuration
public class ScheduledTaskConfig {

    @Bean
    public ThreadPoolTaskScheduler taskScheduler (){
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.setPoolSize(3);
        return taskScheduler;
    }
}
```

## Test

//todo

## References

- [Methods annotated with @Scheduled stops working in Open Source Spring](https://community.pivotal.io/s/article/methods-annotated-with-scheduled-stops-working?language=en_US)
- [A Guide to the Spring Task Scheduler](https://www.baeldung.com/spring-task-scheduler)
