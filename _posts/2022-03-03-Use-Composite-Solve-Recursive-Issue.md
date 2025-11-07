---
title: Composite Pattern for Recursion
tags:
  - java
  - spring
  - composite
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

A practice of using composite to resolve a recursive issue.

## Overview

The task is deceptively simple: we receive an entry-point in a file system that can be either a single file or a directory.

If the entry is a file, we perform the required operation on that file.

If the entry is a directory, we first process the directory itself and then traverse its contents recursively, handling every nested file and sub-directory in the same way.

To keep the solution clean, extensible, and test-friendly I introduced two symmetrical composite hierarchies:

File-system components
– File and Directory both implement the common FileSystemComponent interface.
– Because they share an abstraction, the traversal code can treat a leaf (file) and a branch (directory) as the same concept and simply call accept() on either of them.

Handlers
– Every unit of behaviour (printing, counting, uploading, …) implements the
FileSystemHandler interface.
– CompositeFileSystemHandler keeps a list of concrete handlers and delegates the call to each one, ensuring that “the right handler handles the right node”.

## code
```java
public interface FileSystemComponent {
    void accept(FileSystemHandler handler);
}

public interface FileSystemHandler {
    void handle(FileSystemComponent component);
}
```

```java
@Data
class File implements FileSystemComponent {
    private String name;

    public File(String name) {
        this.name = name;
    }

    @Override
    public void accept(FileSystemHandler handler) {
        handler.handle(this);
    }
}

@Data
class Directory implements FileSystemComponent {
    private String name;
    private List<File> files = new ArrayList<>();

    public Directory(String name, List<File> components) {
        this.name = name;
        this.files = components;
    }

    @Override
    public void accept(FileSystemHandler handler) {
        handler.handle(this);
        for (FileSystemComponent component : files) {
            component.accept(handler);
        }
    }
}

class CompositeFileSystemComponent implements FileSystemComponent {
    private List<FileSystemComponent> components = new ArrayList<>();

    public CompositeFileSystemComponent(FileSystemComponent... fileSystemComponents) {
        this(List.of(fileSystemComponents));
    }

    CompositeFileSystemComponent(List<FileSystemComponent> components) {
        this.components = components;
    }

    @Override
    public void accept(FileSystemHandler handler) {
        for (FileSystemComponent component : components) {
            component.accept(handler);
        }
    }
}
```

```java
class FileHandler implements FileSystemHandler {
    @Override
    public void handle(FileSystemComponent component) {
        if (component instanceof File) {
            File file = (File) component;
            System.out.println("Handling file: " + file.getName());
        }
    }
}

class DirectoryHandler implements FileSystemHandler {
    @Override
    public void handle(FileSystemComponent component) {
        if (component instanceof Directory) {
            Directory directory = (Directory) component;
            System.out.println("Handling directory: " + directory.getName());
        }
    }
}

class CompositeFileSystemHandler implements FileSystemHandler {
    private List<FileSystemHandler> handlers = new ArrayList<>();

    public CompositeFileSystemHandler(FileSystemHandler... fileSystemHandlers) {
        this(List.of(fileSystemHandlers));
    }

    CompositeFileSystemHandler(List<FileSystemHandler> handlers) {
        this.handlers = handlers;
    }

    @Override
    public void handle(FileSystemComponent component) {
        for (FileSystemHandler handler : handlers) {
            handler.handle(component);
        }
    }
}
```

```java
public class CompositeHandlerDemo {
    public static void main(String[] args) {
        FileSystemComponent randomComponent = createRandomComponent();

        CompositeFileSystemHandler compositeHandler = new CompositeFileSystemHandler(new FileHandler(), new DirectoryHandler());
        randomComponent.accept(compositeHandler);
    }

    public static FileSystemComponent createRandomComponent() {
        return null;
    }
}
```

## Analyze

### Single Responsibility

good part: file, directory only do one thing
bad part: fileHander and directoryHandler both handle sth and decide whether to handle. (InstanceOf check)
thinking: a resolver/strategy like pattern can take the instanceOf check respnsibility.

### Open for Extension, Closed for Modification

good part:  Adding a new component (e.g. Symlink) or a new handler (e.g. SizeCalculator) requires no existing code changes.
bad part: However, every handler is forced to contain explicit instanceof blocks.

### Liskov Substitution

good part: File and Directory can safely be used wherever FileSystemComponent is expected; they never weaken pre-conditions or strengthen post-conditions.
bad part: FileHandler has code smell

### Interface Segregation

The `instanceof` block is a symptom of ISP violation.
`Generic` should be used.


```java
public interface FileSystemHandler<T extends FileSystemComponent> {
    void handle(T component);
}
```

```java
class FileHandler implements FileSystemHandler<File> {
    @Override public void handle(File file) {
        System.out.println("file: " + file.getName());
    }
}

class CompositeHandler implements FileSystemHandler<FileSystemComponent> {
    private final Map<Class<?>, FileSystemHandler<?>> table = new HashMap<>();

    <T extends FileSystemComponent> void register(
            Class<T> type, FileSystemHandler<? super T> h) {
        table.put(type, h);
    }

    @Override @SuppressWarnings("unchecked")
    public void handle(FileSystemComponent c) {
        FileSystemHandler handler = table.get(c.getClass());
        if (handler != null) handler.handle(c);   // no instanceof cascade
    }
}
```

### Dependency Inversion

    ignore the system out.... everything is injected via constructor to assure it's fully unit-testable.

## References
