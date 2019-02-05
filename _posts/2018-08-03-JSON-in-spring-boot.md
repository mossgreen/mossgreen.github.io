---
title: JSON in Spring Boot
search: true
tags: 
  - JSON
  - Spring Boot
  - JPA
  - Jackson
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---

## Returning JSON in Spring Boot

In Sprint Boot, REST controller returns JSON obect in the response body. Reason is that Spring implicitely uses message converter `MappingJackson2HttpMessageConverter`, which handles the conversion of Object to JSON format if the request's `Accept` header specifies JSON should be returned. 

This converter is from `spring-boot-starter-json` package, which nested in`spring-boot-starter-web` package. Rather to use `@ResponseBody` annotation in each REST method, `@RestController` would do the same work.

## Returning a customized JSON using Jackson Annotation

1. @JsonAnyGetter
`@JsonAnyGetter` allows the returned object has `Map` fields as properties.

```
public class Attribute {
  public String name;
  private Map <String, String> properties;
  
  @JsonAnyGetter
  public Map<String, String> getProperties() {
    return properties;
  }
}
```

returns
```
"name":"Attribute Name Example",
"prp2":"val2",
"prp1":"val1"
```

Returning JSON object as response in Spring Boot
https://stackoverflow.com/questions/44839753/returning-json-object-as-response-in-spring-boot

2. @JsonGetter
`@JsonGetter` marks a specified method as a getter method.

```
public class Attribute {
  public int id;
  private String name;
  
  @JsonGetter("name")
  public String getTheName() {
    return this.name;
  }
}
```

3. @JsonPropertyOrder
`@JsonPropertyOrder` specifies the order of each properties.

```
@JsonPropertyOrder({"type", "name", "id"})
public class Attribute {
  public int id;
  public String name;
  public String type;
}
```
returns
```
{
    "type":"You guess",
    "name":"My bean",
    "id":1
}
```

4. @JsonRootName
`@JsonRootName` is used if wrapping is needed. It's mapped as the root name of current object.

```
{
    "id": 1,
    "name": "Moss"
}
```
Maps to 
```
{
    "User": {
        "id": 1,
        "name": "Moss"
    }
}
```

See example:
```
@JsonRootName(value = "user")
public class User {
  public int id;
  public String name;
}
```

5. @JsonAnySetter
`@JsonAnySetter` allows a Map properties map to the Map.

6. @JsonSetter
`@JsonSetter` marks the method as a setter method.

```
public class Attribute {
  public int id;
  private String name;
  
  @JsonSetter("name")
  public String setTheName(String name) {
    this.name = name;
  }
}
```

7. @JsonIgnoreProperties
`@JsonIgnoreProperties` is used to intentionly ignore a property in class level.

```
@JsonIgnoreProperties({ "id" })
public class Attribute {
  public int id;
  private String name;
}
```

8. @JsonIgnore
`@JsonIgnore` is used to mark a property to be ignored at the field level.
```
public class Attribute {

  @JsonIgnore
  public int id;
  private String name;
}
```

9. @JsonProperty
`@JsonProperty` is used to indicate the **property name in JSON**.

```
public class Attribute {

  public int id;
  private String name;
 
  @JsonProperty("name")
  public void setTheName(String name) {
      this.name = name;
  }
 
  @JsonProperty("name")
  public String getTheName() {
      return name;
  }
}
```
https://www.baeldung.com/jackson-annotations


## Wrap a JSON in a JSON

Given two classes

```

public class Attribute { 
    private Long id;
    private String name;

    @JsonProperty("options")
    private List<AttributeOption> attributeOptions = new ArrayList<>();
}


public class AttributeOption {
// some properties here
}
```

## json in front end

- to be continued

## References

