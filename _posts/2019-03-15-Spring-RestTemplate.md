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

## GET example with basic Auth
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


## How to POST form data with Spring RestTemplate?

The POST method should be sent along the HTTP request object. And the request may contain either of HTTP header or HTTP body or both.

Hence let's create an HTTP entity and send the headers and parameter in body.

```java
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

MultiValueMap<String, String> map= new LinkedMultiValueMap<String, String>();
map.add("email", "first.last@example.com");

HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map, headers);

ResponseEntity<String> response = restTemplate.postForEntity( url, request , String.class );
```




## References

1. [The Guide to RestTemplate](https://www.baeldung.com/rest-template)
2. [Spring RestTemplate – Spring REST Client Example](https://howtodoinjava.com/spring-restful/spring-restful-client-resttemplate-example/)1. [How to set an “Accept:” header on Spring RestTemplate request?](https://stackoverflow.com/questions/19238715/how-to-set-an-accept-header-on-spring-resttemplate-request)
3. [org.springframework.web.client.HttpClientErrorException: 401 Unauthorized](https://stackoverflow.com/questions/40025338/org-springframework-web-client-httpclienterrorexception-401-unauthorized)
4. [Sending GET request with Authentication headers using restTemplate](https://stackoverflow.com/questions/21101250/sending-get-request-with-authentication-headers-using-resttemplate)
5. [Spring RestTemplate GET with parameters](https://stackoverflow.com/questions/8297215/spring-resttemplate-get-with-parameters)






