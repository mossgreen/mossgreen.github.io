---
title: Create Couch Views in Spring
search: true
tags: 
  - Spring
  - NoSQL
  - CouchDB
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

CouchDB is one of NoSQL database, uses JSON to store data, Javascript as its query language using MapReduce, and Http for an API.

Each document in db has a unique identifier `(_id)` and a revision`(_rev)` number.

CouchDB has a lots of benefits, I won't list here `:)`

## Import Couch in Project

We also import **GOOGLE GSON** package because we use it to transfer an object to json
```groovy
dependencies {
  compile("org.lightcouch:lightcouch:0.1.8")
  runtime("org.lightcouch:lightcouch:0.1.8")
  compile("com.google.code.gson:gson:2.2.4")
  runtime("com.google.code.gson:gson:2.2.4")
}
```

## Create a Factory Method of DbClient

```java
import org.lightcouch.CouchDbClient;
import org.lightcouch.CouchDbProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class CouchDbClientFactory {
    @Autowired
    private ApplicationContext applicationContext;

    //@Value("${couchdb.createdb.if-not-exist}")
    protected boolean ifNotExist = true;
    @Value("${couchdb.username}")
    protected String username;
    @Value("${couchdb.password}")
    protected String password;
    @Value("${couchdb.host}")
    protected String host;
    @Value("${couchdb.protocol}")
    protected String protocol;
    @Value("${couchdb.port}")
    protected int port;

    public CouchDbClient getNewClientConnection(String dbName) {
        //super("application.properties");
        CouchDbProperties properties = new CouchDbProperties()
                .setDbName(dbName)
                .setCreateDbIfNotExist(ifNotExist)
                .setProtocol(protocol)
                .setHost(host)
                .setPort(port)
                .setUsername(username)
                .setPassword(password);
        CouchDbClient c = (CouchDbClient) applicationContext.getBean("couchDbClientConnection", properties);

        try {
            c.syncDesignDocsWithDb();
        } catch (NullPointerException n) {
            //I think this happends because there are no design documents specified.
        }
        return c;
    }
}
```
## Use in Repository

```java
@Repository
public class DemoRepository{

	@Autowired
	private CouchDbClientFactory dbClientFactory;

	public CouchDbClient dbClient;
	
	@PostConstruct
	private void setupViews() {
		init(); // Set up views here
	}
}
```

## Couch view method

```java
import java.util.HashMap;

import org.lightcouch.Document;

public class CouchView extends Document {
	private String language; 
	private HashMap<String,Object> views;
	
	public CouchView(String name) {
		this.setLanguage("javascript");
		this.setViews(null);
		String id = "_design/" + name; 
		this.setId(id); 
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public HashMap<String,Object> getViews() {
		return views;
	}

	public void setViews(HashMap<String,Object> views) {
		this.views = views;
	}
}
```
## Create Document Model

Model object can be stored in Couch
```java
public class Job {

  private Long createdDate;
  private String parameterId; //your id
  private String username;
  
  //GETTERS and SETTERS here
}
```

## Create views

1. Connect to database
2. Delete the view if it exists on startup
  ```java
  try { 
    DesignDocument designDoc1 = dbClient.design().getFromDb("_design/jobs");
    dbClient.remove(designDoc1);
  } catch (NoDocumentException e) {/* that's ok, just continue */ }
  ```
3. Create views and save it to db

```java
protected void init() {
    try {
        this.dbClient = dbClientFactory.getNewClientConnection("databaseName"));

        try {
            DesignDocument designDoc1 = dbClient.design().getFromDb("_design/jobs");
            dbClient.remove(designDoc1);
        } catch (NoDocumentException e) {/* that's ok, just continue */ }

        // recreate the view
        CouchView jobsView = new CouchView("jobs");
        HashMap<String, Object> views = new HashMap<String, Object>();
        HashMap<String, Object> processableJobsView = new HashMap<String, Object>();

        //byusername
        HashMap<String, Object> byUsername = new HashMap<String, Object>();
        byUsername.put("map", "function(job) { emit(job.username, job); }");
        views.put("byusername", byUsername);

        //bydate
        HashMap<String, Object> byCreatedDate = new HashMap<String, Object>();
        byCreatedDate.put("map",
                "function(job) { var currentTime=(new Date()).getTime(); "
                        + " var numberOfDays= Math.round ((currentTime-job.createdDate)/(1000*3600*24)); "
                        + " if(job.status != undefined && job.reportPath != undefined) { "
                        + "    emit( numberOfDays,job);"
                        + " } } "
        );
        views.put("bydate", byCreatedDate);

        HashMap<String, Object> allJobs = new HashMap<String, Object>();
        allJobs.put("map", "function(job) {  " +
                "if(job.status != undefined && job.reportPath != undefined){"
                + "emit( job.id,job);}} ");
        views.put("alljobs", allJobs);
        jobsView.setViews(views);
        this.dbClient.post(jobsView);
    } catch (DocumentConflictException ex) {
        // if this happens it means that the document was already created
    }
}
```

## Use couch views

Couch privides metho to manipulate documents in it

```java
public Job getJobById(String id) {

  Job j = this.dbClient.find(Job.class,id);
  return j;
}

public void deleteJobById(String id) {

  Job job = this.getJobById(id);
  try { deleteJobZipAttachement(job); } catch(Exception e) {} //if not found no problem

  JsonObject json = this.dbClient.find(JsonObject.class, id);
  this.dbClient.remove(json.get("_id").getAsString(), json.get("_rev").getAsString());
}

public Job getJobByGeneratedid(String id) {
  
  List<JsonObject> jsons = this.dbClient.view("jobs/bygeneratedid")
      .includeDocs(true)
      .key(id)
      .query(JsonObject.class);
  
  if(jsons == null || jsons.size()!=1) {
    throw new NoDocumentException("Failed to get exactly one document back by generated id");
  }
  
  return this.getJobById(jsons.get(0).get("_id").getAsString());
}
```
