---
title: Set up a composite bean
tags:
  - java
  - spring
  - composite
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

A bean represents part-whole hierarchies.

## Key Concepts of a Composite Bean:

- Interface: defines the common operations for both simple (leaf) and composite objects.
- Leaf: Represents individual objects.
- Composite: Represents objects that can have multi leafs.

## code

```java
@Configuration
public class EventConfig {

    public interface Event {}

    public interface EventHandler {

        void onEvent(Event event);
    }

    public class GoodEventHandler implements EventHandler{

    }

    public class BadEventHandler implements EventHandler{

    }

    public class CompositeEventHandler implements EventHandler {
      private List<EventHandler> eventHandlers;
      public CompositeEventHandler(EventHandler... eventHandlers){
        this(List.of(eventHandlers));
      }

      // for unit testing
      CompositeEventHandler(List<EventHandler> eventHandlers){
        this.eventHandlers = eventHandlers;
      }

      public void onEvent(Event event) {
        eventHandlers.forEach(handler -> {
            try {
                handler.onEvent(event);
            } catch (Exception e) {              
            }
        });
    }
    }
    
    @Bean
    public EventHandler compositeEventHandler() {
        return new CompositeEventHandler<>(new GoodEventHandler(), new BadEventHandler());
    }    
}

@Component
public class MainClass {

  private EventHandler compositeEventHandler;
}

```

## analyze

1. use single interface to handle multi senarioes
2. expose a composite interface, the caller doesn't need to know the details, e.g., data structure is a list or map or sth else


## References
