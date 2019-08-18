---
title: Spring RestTemplate 101
search: true
tags: 
  - Spring
  - Spring MVC
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring RestTemplate 101.

## What is RestTemplate?

`RestTemplate` is a synchronous client to perform HTTP requests. It is the original Spring REST client and exposes a simple, template-method API over underlying HTTP client libraries.

## Why do you need it?

- Provides a higher-level API to perform HTTP requests compared to traditional HTTP client libraries.
- Supports URI templates
- Automatically encodes URI templates. For example, a space character2 in an URI will be replaced with `%20` using percent-encoding.
- Supports automatic detection of content type
- Supports automatic conversion between objects and HTTP messages.
- Allows for easy customization of response errors. A custom ResponseErrorHandler can be registered on the RestTemplate.
- Provides methods for conveniently sending common HTTP request types and also provides methods that allow for increased detail when sending requests. Examples of the former method type are: delete, getForObject, getForEntity, headForHeaders, postForObject and put.


## How to delare it in your app?

2 ways of using resttemplate in your projects:

1. create an instance at the point you need it
    ```
    RestTemplate rest = new RestTemplate();
    ```
2. you can declare it as a bean and inject it where you need it.


## How to configure it?

### Reuse rest template bean
One of the best ways to do this is to create a bean which would return a RestTemplate and then Autowire it in which ever class you need.

```java
@Configuration
public class ProductServiceConfig {

    @Value("${product.username}")
    private String productServiceUsername;

    @Value("${product.password}")
    private String productServicePassword;

    @Bean(name = "restTemplateForProductService")
    public RestTemplate prepareRestTemplateForProductService() {

        BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(productServiceUsername, productServicePassword));

        RequestConfig.Builder requestBuilder = RequestConfig.custom();
        requestBuilder = requestBuilder.setConnectTimeout(1000);

        HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();
        httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
        httpClientBuilder.setDefaultRequestConfig(requestBuilder.build());
        CloseableHttpClient httpClient = httpClientBuilder.build();

        HttpComponentsClientHttpRequestFactory rf = new HttpComponentsClientHttpRequestFactory(httpClient);

        return new RestTemplate(rf);
    }
}
```

This way you can set different parameters that you want for your rest call, like timeouts or credentials etc. And when you want to use, you can just do

```java
@Autowired
RestTemplate restTemplateForProductService;
```

### Configure Timeout

We can configure RestTemplate to time out by simply using `ClientHttpRequestFactory`.
// todo 


## Consuming REST endpoints with RestTemplate

RestTemplate provides 41 methods for interacting with REST resources. Some are overloaded so that they can be summerized as 12 operations.

- `delete()`
- `exchange()`
- `execute()`
- `getForEntity()`
- `getForObject()`
- `headForHeaders()`
- `optionsForAllow()`
- `patchForObject()`
- `postForEntity()`
- `postForObject()`
- `postForLocation()`
- `put()`

**NB.**
1. the execute and exchange methods can be used for any type of REST calls as long as the HTTP method is given as a parameter for the methods.

    - The exchange method uses an HttpEntity object to encapsulate request headers and use it as a parameter. The method returns a ResponseEntity object containing the result of a REST request, and its body is automatically converted using the registered HttpMessageConverter implementation.

2. getForEntity() works in much the same way as getForObject(), but instead of returning a domain object that represents the response’s payload, it returns a ResponseEntity object that wraps that domain object. The ResponseEntity gives access to additional response details, such as the response headers.

## RestTemplate Methods Mapped to HTTP Methods

- GET
- PUT
- POST
- DELETE
- HEAD
- OPTIONS

### GET: Retrieve Resources

- Can get plain JSON `restTemplate.getForEntity(fooResourceUrl + "/1", String.class);`

**Retrieving POJO Instead of JSON **

1. getForObject()
    ```java
    public Ingredient getIngredientById(String ingredientId) { 
      return rest.getForObject("http://localhost:8080/ingredients/{id}", Ingredient.class, ingredientId); 
    }
    ```

2. use a Map to specify the URL variables
    ```java
    public Ingredient getIngredientById(String ingredientId) { 
      Map<String,String> urlVariables = new HashMap<>(); 
      urlVariables.put("id", ingredientId); 
      return rest.getForObject("http://localhost:8080/ingredients/{id}", Ingredient.class, urlVariables); 
    }
    ```

3. Using a URI parameter
    ```java
    public Ingredient getIngredientById(String ingredientId) {
    
      Map<String,String> urlVariables = new HashMap<>(); 
      urlVariables.put("id", ingredientId); 
      URI url = UriComponentsBuilder 
        .fromHttpUrl("http://localhost:8080/ingredients/{id}") 
        .build(urlVariables);
    
      return rest.getForObject(url, Ingredient.class);
    }
    ```

### PUT: Update a Resource

1. Simple PUT with exchange. Doesn't return anything.
```java
Foo updatedInstance = new Foo("newName");
updatedInstance.setId(createResponse.getBody().getId());
String resourceUrl =  fooResourceUrl + '/' + createResponse.getBody().getId();
HttpEntity<Foo> requestUpdate = new HttpEntity<>(updatedInstance, headers);

template.exchange(resourceUrl, HttpMethod.PUT, requestUpdate, Void.class);
```

2. PUT with `.exchange` and a Request Callback

```java
RequestCallback requestCallback(final Foo updatedInstance) {
    return clientHttpRequest -> {
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(clientHttpRequest.getBody(), updatedInstance);
        clientHttpRequest.getHeaders().add(
          HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        clientHttpRequest.getHeaders().add(
          HttpHeaders.AUTHORIZATION, "Basic " + getBase64EncodedLogPass());
    };
}
```
```java
ResponseEntity<Foo> response = restTemplate.exchange(fooResourceUrl, HttpMethod.POST, request, Foo.class);
assertThat(response.getStatusCode(), is(HttpStatus.CREATED));

Foo updatedInstance = new Foo("newName");
updatedInstance.setId(response.getBody().getId());

String resourceUrl =fooResourceUrl + '/' + response.getBody().getId();

restTemplate.execute(
  resourceUrl, 
  HttpMethod.PUT, 
  requestCallback(updatedInstance), 
  clientHttpResponse -> null);
```

### POST: Create a Resource

- The postForObject API

- The postForLocation API

- The exchange API 
    ```java
    ResponseEntity<Foo> response = restTemplate.exchange(fooResourceUrl, HttpMethod.POST, request, Foo.class);
    ```

- Submit Form Data
    1. set the `Content-Type` header to `application/x-www-form-urlencoded`. This makes sure that a large query string can be sent to the server, containing name/value pairs separated by ‘&‘.
        ```java
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        ```
    2. wrap the form variables into a `LinkedMultiValueMap`:
        ```java
        MultiValueMap<String, String> map= new LinkedMultiValueMap<>();
        map.add("id", "1");
        ```
    3. we build the Request using an HttpEntity instance:
    ```java
    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
    ```
    4. connect to the REST service by calling the Endpoint: `/foos/form`
    ```java
    ResponseEntity<String> response = restTemplate.postForEntity( fooResourceUrl+"/form", request , String.class);

    assertThat(response.getStatusCode(), is(HttpStatus.CREATED));
    ```
    
### DELETE: Remove a Resource

```java
String entityUrl = fooResourceUrl + "/" + existingResource.getId();
```

### HEAD: Use HEAD to Retrieve Headers

```java
HttpHeaders httpHeaders = restTemplate.headForHeaders(fooResourceUrl);
assertTrue(httpHeaders.getContentType().includes(MediaType.APPLICATION_JSON));
```

### OPTIONS: to get Allowed Operations

```java
Set<HttpMethod> optionsForAllow = restTemplate.optionsForAllow(fooResourceUrl);
HttpMethod[] supportedMethods = {HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE};
assertTrue(optionsForAllow.containsAll(Arrays.asList(supportedMethods)));
```


## Examples

### GET example with basic Auth
```java 
public void testTemplate(){

    RestTemplate restTemplate = new RestTemplate();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
    headers.add("Authorization", "Basic " + getBase64Credentials());

    UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(uri)
            .queryParam("onetimetoken", token);

    HttpEntity<?> entity = new HttpEntity<>(headers);

    HttpEntity<SsoUser> ssoUser = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.GET,
            entity,
            SsoUser.class);
}

private String getBase64Credentials(){
    String plainCreds = "applicationhardtoguesthing" + ":" +  "somereallyreallyhardpasswordtoremember";
    byte[] plainCredsBytes = plainCreds.getBytes();
    byte[] base64CredsBytes = Base64.encodeBase64(plainCredsBytes);
    return new String(base64CredsBytes);
}
```

## Client side reset tests

You can use client-side tests to test code that internally uses the RestTemplate. The idea is to declare expected requests and to provide “stub” responses so that you can focus on testing the code in isolation (that is, without running a server).You can use client-side tests to test code that internally uses the RestTemplate. The idea is to declare expected requests and to provide “stub” responses so that you can focus on testing the code in isolation (that is, without running a server).

```java
RestTemplate restTemplate = new RestTemplate(); MockRestServiceServer mockServer = MockRestServiceServer.bindTo(restTemplate) .build(); mockServer.expect(requestTo("/greeting")).andRespond(withSuccess()); // Test code that uses the above RestTemplate ...

mockServer.verify();
```


## References

1. [The Guide to RestTemplate](https://www.baeldung.com/rest-template)
2. [Spring RestTemplate – Spring REST Client Example](https://howtodoinjava.com/spring-restful/spring-restful-client-resttemplate-example/)1. [How to set an “Accept:” header on Spring RestTemplate request?](https://stackoverflow.com/questions/19238715/how-to-set-an-accept-header-on-spring-resttemplate-request)
3. [org.springframework.web.client.HttpClientErrorException: 401 Unauthorized](https://stackoverflow.com/questions/40025338/org-springframework-web-client-httpclienterrorexception-401-unauthorized)
4. [Sending GET request with Authentication headers using restTemplate](https://stackoverflow.com/questions/21101250/sending-get-request-with-authentication-headers-using-resttemplate)
5. [Spring RestTemplate GET with parameters](https://stackoverflow.com/questions/8297215/spring-resttemplate-get-with-parameters)
6. [Best practices on rest client using spring RestTemplate](https://stackoverflow.com/questions/47388545/best-practices-on-rest-client-using-spring-resttemplate)