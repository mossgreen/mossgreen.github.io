---
title: Integrate Spring Boot and Angular
search: true
tags: 
  - Java
  - Spring Boot
  - Angular
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---

Setup a project with Spring Boot and Angular.

## Why do you want to integrate Spring Boot and Angular

1. For instance, Jhiperster, integrate them in one project
2. Two seperate projects, integrate with APIs.

## A Webapp folder in Spring Boot project

1. Set up Spring boot project from initializer

    [Spring Initializr](https://start.spring.io/)

2. Generate a Webapp using Angular CLI

    In `src/main` folder, do

    ```bash
    ng new webapp
    ```

3. Move configuration files

    - Remove `node_modules`
    - Move config files from webapp to root directory. We do this because we want to leave only the public files in Webapp folder.
        - Move App from webapp/src/ to webapp/
        - Move config files (not dirs) from webapp/e2e/ to root
        - Move config files from webapp/src/ to root

4. Update configuration files
    - angular.json
    - tsconfig.app.json
    - tsconfig.e2e.json
    - tsconfig.json
    - tsconfig.spec.json
    - protractor.conf.js
    - karma.conf.js

5. Set up frontend-maven-plugin in `pom.xml`

    ```xml
      <plugin>
        <groupId>com.github.eirslett</groupId>
        <artifactId>frontend-maven-plugin</artifactId>
        <version>1.6</version>

        <configuration>
          <nodeVersion>v13.1.0</nodeVersion>
          <npmVersion>6.12.1</npmVersion>
        </configuration>

        <executions>
          <execution>
            <id>install node and npm</id>
            <goals>
              <goal>install-node-and-npm</goal>
            </goals>
          </execution>

          <execution>
            <id>npm install</id>
            <goals>
              <goal>npm</goal>
            </goals>
          </execution>

          <execution>
            <id>npm run build</id>
            <goals>
              <goal>npm</goal>
            </goals>
            <phase>generate-resources</phase>
            <configuration>
              <arguments>run build:prod</arguments>
            </configuration>
          </execution>
        </executions>
    </plugin>
    ```

    `npm run build` command will execute the build task described in package.json. By default, angular-cli will write the files in the `src/main/web/dist` directory, but we've changed the dist directory to `target/webapp`.

    Now, run `mvn clean install` from project root dir

6. Set up NodeJS

## Angular project comsumes Spring Boot API

## References

1. [Setup a project with Angular 7 and Spring Boot](https://dreamix.eu/blog/dreamix/how-to-setup-a-project-with-angular-7-and-spring-boot-that-provides-custom-embeddable-angular-components-via-angular-elements)
2. [Build Your First PWA with Angular](https://developer.okta.com/blog/2019/01/30/first-angular-pwa)
3. [Building a Web Application with Spring Boot and Angular](https://www.baeldung.com/spring-boot-angular-web)
4. [Spring Security and Angular](https://spring.io/guides/tutorials/spring-security-and-angular-js/)
