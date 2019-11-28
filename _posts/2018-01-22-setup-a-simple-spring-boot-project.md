---
title: Setup a simplest Spring Project Demo Project
search: true
tags: 
  - Spring
  - Spring Boot
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---

A Spring Demo project. See: <https://github.com/digitalsonic/geektime-spring-family>

## Where to start

1. [Spring initializr](https://start.spring.io/) (recommended)
2. Create project from your IDE: IntelliJ, or Eclipse, etc..

## Spring Boot & JPA with H2

### 0. Gradle dependency

`build.gradle`

```properties
implementation 'org.springframework.boot:spring-boot-starter'
compileOnly 'org.projectlombok:lombok'
developmentOnly 'org.springframework.boot:spring-boot-devtools'
annotationProcessor 'org.springframework.boot:spring-boot-configuration-processor'
annotationProcessor 'org.projectlombok:lombok'
testImplementation 'org.springframework.boot:spring-boot-starter-test'
implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
compile 'com.h2database:h2'
testImplementation 'org.springframework.boot:spring-boot-starter-test'
compile 'org.joda:joda-money:1.0.1'
implementation 'org.jadira.usertype:usertype.core:6.0.1.GA'
```

Note: from offical website, joda money gradle dependency uses `compile 'org.joda:joda-money:1.0.2-SNAP-SHOT'` which is wrong.

### 1. Entity

1. Base Entity
    - Abstraction of multiple entites
    - `@MappedSuperclass`
    - no `toString()` method
    - `createTime` is not updatable

    ```java
    @MappedSuperclass
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class BaseEntity implements Serializable {
        @Id
        @GeneratedValue
        private Long id;

        @Column(updatable = false)
        @CreationTimestamp
        private LocalDateTime createTime;

        @UpdateTimestamp
        private LocalDateTime updateTime;
    }
    ```

2. Enum

    ```java
    public enum OrderState {
        INIT, PAID, BREWING, BREWED, TAKEN,CANCELLED
    }
    ```

3. Entity
    - Be careful of the Money `joda.PersistentMoneyAmount`
    - Extends base entity
    - in `toString`, uses `callSuper = true`
    - `@Enumerated`

    ```java
    @Entity
    @Table(name = "T_MENU")
    @Builder
    @Data
    @ToString(callSuper = true)
    @NoArgsConstructor
    @AllArgsConstructor
    public class Coffee extends BaseEntity implements Serializable {

        private String name;
        @Column
        @Type(type = "org.jadira.usertype.moneyandcurrency.joda.PersistentMoneyAmount",
                parameters = {@org.hibernate.annotations.Parameter(name = "currencyCode", value = "CNY")})
        private Money price;
    }
    ```

    ```java
    @Entity
    @Table(name = "T_ORDER")
    @Data
    @ToString(callSuper = true)
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class CoffeeOrder extends BaseEntity implements Serializable {

        private String customer;
        @ManyToMany
        @JoinTable(name = "T_ORDER_COFFEE")
        @OrderBy("id")
        private List<Coffee> items;

        @Enumerated
        @Column(nullable = false)
        private Integer state;
    }
    ```

### 2. Repository

1. Base Repository

    - `@NoRepositoryBean`

    ```java
    @NoRepositoryBean
    public interface BaseRepository<T, Long> extends PagingAndSortingRepository<T, Long> {
        List<T> findTop3ByOrderByUpdateTimeDescIdAsc();
    }
    ```

2. Regular repositories
    - extends base repository

    ```java
    public interface CoffeeRepository extends BaseRepository<Coffee, Long> {}

    public interface CoffeeOrderRepository extends BaseRepository<CoffeeOrder, Long> {
        List<CoffeeOrder> findByCustomerOrderById(String customer);
        List<CoffeeOrder> findByItems_Name(String name);
    }
    ```

### 3. Main method

- `@SpringBootApplication`
- @EnableJpaRepositories

### 4. application.properties

```properties
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.properties.hibernate.show_sql=true
spring.jpa.properties.hibernate.format_sql=true
```

## references

- <https://github.com/digitalsonic/geektime-spring-family>
- https://www.baeldung.com/spring-data-redis-tutorial