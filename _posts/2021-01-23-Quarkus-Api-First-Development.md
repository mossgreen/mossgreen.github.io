---
title: Quarkus API First Development
tags:
  - Quarkus
  - Swagger
  - Maven
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

With Swagger Open API

## Jargons

- API first development

## Steps

### 1. Create a Quarkus project

1. from `https://code.quarkus.io/` with RestEasy etc. plugins
2. open project, remove existing controllers and tests

### 2. Update Pom to include swagger

1. get demo file from `https://editor.swagger.io/`.

    for the demo, we will replace `- "multipart/form-data"` with `- "application/json"`

    ```yml
    swagger: "2.0"
    info:
      description: "This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters."
      version: "1.0.0"
      title: "Swagger Petstore"
      termsOfService: "http://swagger.io/terms/"
      contact:
        email: "apiteam@swagger.io"
      license:
        name: "Apache 2.0"
        url: "http://www.apache.org/licenses/LICENSE-2.0.html"
    host: "petstore.swagger.io"
    basePath: "/v2"
    tags:
    - name: "pet"
      description: "Everything about your Pets"
      ...
    ```

2. add swagger dependency

    ```xml
    <dependency>
        <groupId>io.swagger.core.v3</groupId>
        <artifactId>swagger-annotations</artifactId>
        <version>2.1.4</version>
    </dependency>
    ```

3. update mvn profiles

```xml
<profile>
    <id>swagger-generation</id>
    <activation>
        <file>
            <exists>swagger/swagger.yml</exists>
        </file>
    </activation>
    <build>
        <plugins>
            <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <version>0.8.5</version>
                <configuration>
                    <excludes>
                        <exclude>**/model/*</exclude>
                        <exclude>**/dto/*</exclude>
                        <exclude>**/configuration/*</exclude>
                        <exclude>**/filter/*</exclude>
                    </excludes>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>prepare-agent</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>report</id>
                        <phase>prepare-package</phase>
                        <goals>
                            <goal>report</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <groupId>io.swagger.codegen.v3</groupId>
                <artifactId>swagger-codegen-maven-plugin</artifactId>
                <version>3.0.22</version>
                <executions>
                    <execution>
                        <id>generate-api</id>
                        <phase>generate-sources</phase>
                        <goals>
                            <goal>generate</goal>
                        </goals>
                        <configuration>
                            <inputSpec>${project.basedir}/swagger/swagger.yml</inputSpec>
                            <language>jaxrs-resteasy-eap</language>
                            <generateSupportingFiles>false</generateSupportingFiles>
                            <apiPackage>define.your.package.here</apiPackage> 
                            <modelPackage>define.your.package.here<modelPackage>
                            <configOptions>
                                <useTags>true</useTags>
                                <useSwaggerFeature>true</useSwaggerFeature>
                                <dateLibrary>java8</dateLibrary>
                                <java8>true</java8>
                                <interfaceOnly>true</interfaceOnly>
                                <bigDecimalAsString>true</bigDecimalAsString>
                                <sourceFolder>src/gen/java/main</sourceFolder>
                            </configOptions>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</profile>
```

### 3. Create Swagger file

create a folder under the root, create a file in the folder, named `swagger.yml`

### 4. genereate your files

do `mvn clean install`, you can see the generated files in `target/generated-sources/swagger/src/gen/java/main/io/swagger/api/PetApi.java`

to use it, define you controller and implement this interface. It will prompt you to implement the methods defined in Swagger.

## References
