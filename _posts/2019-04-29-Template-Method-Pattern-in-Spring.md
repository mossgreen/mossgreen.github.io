---
title: Spring OAuth2 Notes
search: true
tags: 
  - Java
  - Spring
  - Spring Security
  - OAuth2
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring Security, little effort, hunge confusion.

## @EnableOAuth2Sso annotation
- **OAuth2 client** VS **Authentication**
- `@EnableOAuth2Client` is lower level
- The client is re-usable, talks to OAuth2 resources that Authorization Server provides 

### WebSecurityConfigurerAdapter
- `WebSecurityConfigurer` **+** `@EnableOAuth2Sso` class: configure the security filter chain that carries the OAuth2 authentication processor. 
- **Home page** and **login page** should be visible in `authorizeRequests()`.
- Others require authentication, e.g., `/user`.
- `/logout` requires POST. Protect user from Cross Site Request Forgery (**CSRF**).
- Requires a token in the request to link to the current session.

### Principal
**comming soon**

```java
@SpringBootApplication
@EnableOAuth2Sso
@RestController
public class SocialApplication extends WebSecurityConfigurerAdapter {
	
	@RequestMapping("/user")
	public Principal user(Principal principal) {
		return principal;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
				.antMatcher("/**")
				.authorizeRequests()
					.antMatchers("/", "/login**", "/webjars/**", "/error**")
					.permitAll()
				.anyRequest()
					.authenticated()
				.and()
			  .logout()
			    .logoutSuccessUrl("/")
			    .permitAll()
			  .and()
			  .csrf()
				  .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
	}

	public static void main(String[] args) {
		SpringApplication.run(SocialApplication.class, args);
	}

}
```

1. All requests are protected by default
2. The home page and login endpoints are explicitly excluded
3. All other endpoints require an authenticated user
4. Unauthenticated users are re-directed to the home page


## OAuth2ClientContext
Build an authentication filter that we add to our security configuration.

1. @Autowired OAuth2ClientContext
2. Add your own filter method
3. Chain your filter in the **configure**
4. Declar your **client registration**
5. Reource endpoint


```java
@Autowired
OAuth2ClientContext oauth2ClientContext;

@Override
protected void configure(HttpSecurity http) throws Exception {
  http.antMatcher("/**")
    ...
    .and().addFilterBefore(mySsoFilter(), BasicAuthenticationFilter.class);
}

private Filter mySsoFilter() {
  OAuth2ClientAuthenticationProcessingFilter facebookFilter = new OAuth2ClientAuthenticationProcessingFilter("/login/facebook");
  OAuth2RestTemplate facebookTemplate = new OAuth2RestTemplate(facebook(), oauth2ClientContext);
  facebookFilter.setRestTemplate(facebookTemplate);
  UserInfoTokenServices tokenServices = new UserInfoTokenServices(facebookResource().getUserInfoUri(), facebook().getClientId());
  tokenServices.setRestTemplate(facebookTemplate);
  facebookFilter.setTokenServices(tokenServices);
  return facebookFilter;
}

@Bean
@ConfigurationProperties("facebook.client")
public AuthorizationCodeResourceDetails facebook() {
	return new AuthorizationCodeResourceDetails();
}

@Bean
@ConfigurationProperties("facebook.resource")
public ResourceServerProperties facebookResource() {
	return new ResourceServerProperties();
}
```

### Add another authentication server, like Github
- Use `CompositeFilter`
- Add new beans

```java
private Filter ssoFilter() {
  CompositeFilter filter = new CompositeFilter();
  List<Filter> filters = new ArrayList<>();
  filters.add(ssoFilter(facebook(), "/login/facebook"));
  filters.add(ssoFilter(github(), "/login/github"));
  filter.setFilters(filters);
  return filter;
}

private Filter ssoFilter(ClientResources client, String path) {
  OAuth2ClientAuthenticationProcessingFilter filter = new OAuth2ClientAuthenticationProcessingFilter(path);
  OAuth2RestTemplate template = new OAuth2RestTemplate(client.getClient(), oauth2ClientContext);
  filter.setRestTemplate(template);
  UserInfoTokenServices tokenServices = new UserInfoTokenServices(
      client.getResource().getUserInfoUri(), client.getClient().getClientId());
  tokenServices.setRestTemplate(template);
  filter.setTokenServices(tokenServices);
  return filter;
}

@Bean
@ConfigurationProperties("github.client")
public AuthorizationCodeResourceDetails github() {
	return new AuthorizationCodeResourceDetails();
}

@Bean
@ConfigurationProperties("github.resource")
public ResourceServerProperties githubResource() {
	return new ResourceServerProperties();
}
```

### Handling Redirects
- Register the existing register in a low order, makes sure it comes before the main Spring Security filter. 

```java
@Bean
public FilterRegistrationBean<OAuth2ClientContextFilter> oauth2ClientFilterRegistration(OAuth2ClientContextFilter filter) {
	FilterRegistrationBean<OAuth2ClientContextFilter> registration = new FilterRegistrationBean<>();
	registration.setFilter(filter);
	registration.setOrder(-100);
	return registration;
}
```

## @EnableAuthorizationServer
Authorization Server is a bunch of endpoints.
comming soon...

## References

1. [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2)

