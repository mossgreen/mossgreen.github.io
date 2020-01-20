---
title: Returning JSON in Spring Boot
search: true
tags: 
  - JSON
  - Spring Boot
  - JPA
  - Jackson
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Converting Json in Spring projects.

## Returning JSON in Spring Boot

In Sprint Boot, REST controller returns JSON obect in the response body. Reason is that Spring implicitely uses message converter `MappingJackson2HttpMessageConverter`, which handles the conversion of Object to JSON format if the request's `Accept` header specifies JSON should be returned. 

This converter is from `spring-boot-starter-json` package, which nested in`spring-boot-starter-web` package. Rather to use `@ResponseBody` annotation in each REST method, `@RestController` would do the same work.

## Returning a customized JSON using Jackson Annotation

1. @JsonAnyGetter  
`@JsonAnyGetter` allows the returned object has `Map` fields as properties.

    ```java
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
    ```json
    {
    "name":"Attribute Name Example",
    "prp2":"val2",
    "prp1":"val1"
    }
    ```

2. @JsonGetter  
`@JsonGetter` marks a specified method as a getter method.

    ```java
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

    ```java
    @JsonPropertyOrder({"type", "name", "id"})
    public class Attribute {
    public int id;
    public String name;
    public String type;
    }
    ```
    returns
    ```json
    {
        "type":"You guess",
        "name":"My bean",
        "id":1
    }
    ```

4. @JsonRootName    
`@JsonRootName` is used if wrapping is needed. It's mapped as the root name of current object.

    ```json
    {
        "id": 1,
        "name": "Moss"
    }
    ```
    Maps to 
    ```json
    {
        "User": {
            "id": 1,
            "name": "Moss"
        }
    }
    ```

    See example:
    ```java
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

    ```java
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

    ```java
    @JsonIgnoreProperties({ "id" })
    public class Attribute {
    public int id;
    private String name;
    }
    ```

8. @JsonIgnore  
`@JsonIgnore` is used to mark a property to be ignored at the field level.

    ```java
    public class Attribute {

    @JsonIgnore
    public int id;
    private String name;
    }
    ```

9. @JsonProperty  
`@JsonProperty` is used to indicate the **property name in JSON**.

    ```java
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

## Wrap a JSON in a JSON

Given two classes

```java
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

## Get JSON in front end (Angular, Typescript)

Objects that map to back end

```javascript
export class Attribute {
    public id: number;
    public name: string;
    public options: AttributeOption[];
}

export class AttributeOption {
    public label: string;
    public value: string;
}

```

REST Servcie
```javascript
export class AttributeService {

    constructor(private restService: RESTService) {
    }

    public getAttributeFields(): Observable<Attribute[]> {
        return this.restService.get('/attributes', true)
            .pipe(
                map((attributes: Attribute[]) => {
                    return attributes.map((attribute) => {
                        attribute.options = attribute.options
                            .map((option: AttributeOption) => {
                                return option;
                        });
                        return attribute;
                    });
                })
            );
    }
}

```

## References

- [Returning JSON object as response in Spring Boot](https://stackoverflow.com/questions/44839753/returning-json-object-as-response-in-spring-boot)

- [Jackson Annotation Examples](https://www.baeldung.com/jackson-annotations)