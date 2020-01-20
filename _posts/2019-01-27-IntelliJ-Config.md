---
title: IDEA IntelliJ Config for Java Projects
search: true
tags: 
  - IDE
  - IntelliJ
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

IDEA IntelliJ Config for Java

## My Sprint project config

### 1. for gradle

1. open a project via `build.gradle`, "Open as Project.".
2. Use Gradle from
    - 'gradle-wrapper.properties' file:
        - this is a recommended default option that uses Gradle wrapper.
        - The Gradle version is saved in the gradle-wrapper.properties file in the gradle directory of your project and helps you eliminate any Gradle version problems.
    - 'wrapper' task in Gradle build script: It might be convenient if you prefer to control which Gradle version to use in the project.
3. gradle.properties:
    - specify VM options for your Gradle project
4. Gradle user home
    - specify the location of stored Gradle caches, downloaded files, and so on.
    - If Gradle location has been defined by the environment variables GRADLE_HOME or PATH, then IntelliJ IDEA deduces this location, and suggests this path as the default value.

## issues

### 1. IDEA IntelliJ Config for Java

Preference | compiler | Build Project Automatically

### 2.  allow live reload with spring boot devtools

1. Enable Automake from the compiler
    - ⌘+Shift+A
    - type make project automatically,
    - Enable Make Project automatically feature

2. Enable Automake when the application is running
    - ⌘ + shift + A
    - Type: Registry
    - then enable compiler.automake.allow.when.app.running

### 3. Intellij does not succeed JAVA_HOME after using SDKMAN

> Could not resolve all dependencies for configuration ':classpath'

Set JAVA_HOME globally on MAC OS with launchctl

```bash
\$ launchctl setenv JAVA_HOME $(/usr/libexec/java_home -v 1.8)
# or
\$ launchctl setenv JAVA_HOME ~/.sdkman/candidates/java/current
```

### 4. customise your font colour

1. select your text
2. cmd + shift + a
3. select the option
4. select your colour and confirm

### 5. How to clear out all global setting info

Normally information like this will be found in one of the following places in OS X:

```bash
/Users/username/Library/Preferences/AppName
/Users/username/Library/Preferences/com.appname.plist
/Users/username/Library/Application Support/AppName
/Library/Preferences/AppName
/Library/Preferences/com.appname.plist
/Library/Application Support/AppName
```

If the app adheres to the standard OS X conventions you weill find info in one or all of these places. If it doesnt store here you might check for a `/Users/username/.intellij` folder or something similar in your home directory

## Errors

### 1. Could not target platform: 'Java SE 11' using tool chain: 'JDK 8

Gradle JVM: change to version 1.8

## References

1. [Intellij IDEA Java classes not auto compiling on save](https://stackoverflow.com/questions/12744303/intellij-idea-java-classes-not-auto-compiling-on-save)
2. [IntelliJ Gradle Settings](https://www.jetbrains.com/help/idea/gradle-settings.html)
3. [How do you clear out Intellij global setting info on mac](https://stackoverflow.com/questions/2774315/in-intellij-on-os-x-how-do-you-clear-out-all-global-setting-info-licensing-etc)
