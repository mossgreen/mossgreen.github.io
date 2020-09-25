---
title: DTO mapper with MapStruct and Mockito
search: true
tags: 
  - MapStruct
  - Spring Boot
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

A type-safe and performant mappers for Java bean

## Why and how

Multi-layered applications often require to map between different object models (e.g. entities and DTOs). Writing such mapping code is a tedious and error-prone task.

Manual mapping is cumbersome. So object mappers come on to the stage.

There are serveral of them on the market

- MapStruct
- Selma
- ModelMapper
- Dozer
- others ...

### MapStruct is better than others

I don't trust no magic. Mapping doesn't happen by itself. There are two main categories that how it's implemeted

1. runtime reflection. It uses reflection to call get and set method to give values to the fields. While invoking the getter and setters, it uses bean utils or Javassis open source library. E.g., Dozer, ModelMaper

2. During compiling, it generates getter and setters in the `.class` files.  It calls getter and setters during the runtime. We would notice that getters and setter exists, the only difference is that we don't have to manually write them. E.g., MapStruct, Selma, Orika.

Conclusion:

1. MapStruct doesn't use reflection and actually is times faster than ModelMaper
2. As per [Awesome Java](https://java.libhunt.com/compare-mapstruct-vs-modelmapper), MapStructer has better popularity and activity than Selma and ModelMapper
3. jHipster team selects MapStruct as well
4. there is an interesting debate on [MapStruct and Selma](https://stackoverflow.com/questions/34786737/java-mapping-selma-vs-mapstruct), it seems like MapStruct has got more votes

### user MapStruct in a Spring Boot project

## Import and IDE support

lombok plugin

```gradle
implementation 'org.mapstruct:mapstruct:1.3.1.Final'
annotationProcessor 'org.mapstruct:mapstruct-processor:1.3.1.Final'
```

## details

### Set up and basic mapping

Dependency Injection in spring

```java
@Controller
public class DoctorController() {
    @Autowired
    private DoctorMapper doctorMapper;
}
```

```java
@Mapper(componentModel = "spring")
public interface TodoMapper {

    public static final TodoMapper INSTANCE = Mappers.getMapper(TodoMapper.class);

    ToDoDto from(ToDo todo);
}
```

```java
class TodoMapperTest {

    private TodoMapper mapper = Mappers.getMapper(TodoMapper.class);

    @Test
    public void givenToDoDto_whenMapsToToDo_thenCorrect() {
        ToDoDto dto = new ToDoDto();
        UUID uuid = UUID.randomUUID();
        dto.setUuid(uuid);

        ToDo todo = mapper.todoDTOToTodo(dto);

        Assertions.assertEquals(dto.getUuid(), todo.getUuid());
    }

    @Test
    public void givenTodo_whenMapsToDTO_thenCorrect() {
        ToDo todo = new ToDo();
        UUID uuid = UUID.randomUUID();
        todo.setUuid(uuid);

        ToDoDto dto = mapper.todoToToDoDTO(todo);

        Assertions.assertEquals(dto.getUuid(), todo.getUuid());
    }
}
```

### Mapping Enums

### Mapping DataTypes

### Mappings Multiple Models to one DTO

```java
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue
    private Long id;

    private String postAddress;
    private String postCode;

}
```

```java
@Mappings({
    @Mapping( source = "address.postAddress", target = "postAddress" ),
    @Mapping( source = "address.postCode", target = "postCode" ),
})
ToDoDto from(ToDo todo, Address address);
```

### Mapping Child Entities

For example, a Doctor will have 1..n patients:

### Exception Handling while Mapping

### Adding Custom Methods

So far, we've been adding a placeholder method that we want MapStruct to implement for us. What we can also do is add a custom default method to the interface as well. By adding a default method, we can add the implementation directly as well. We'll be able to access it through the instance without a problem.

### Adding Default Values

## testing

```java
public class BookMapperTest {
   private static Library library;
   private static Book book1, book2;

   @BeforeClass
   public static void setup() {
       library = new Library();
       library.setLibraryID(1);
       library.setBooksCount(10);
       library.setInstitutionType(InstitutionType.ACADEMIC);
       library.setInstitutionCode("AA01");

       book1 = new Book();
       book1.setAuthor("author1");
       book1.setBookID(1);
       book1.setName("name1");
       book1.setPages(100);

       book2 = new Book();
       book2.setAuthor("author2");
       book2.setBookID(2);
       book2.setName("name2");
       book2.setPages(200);
 
       List<Book> bookList = new ArrayList<Book>(); 
       bookList.add(book1); 
       bookList.add(book2);

       library.getBookList().addAll(bookList);
   }

   @Test
   public void convertToDtoTest() {
      List<BookDto> bookDtoList = BookMapper.INSTANCE.map(library.getBookList(), library);
      Assert.assertEquals(2, bookDtoList.size());
      Assert.assertEquals("1", bookDtoList.get(0).getLibraryID());
   }
}
@Test
public void test() {
    Order order = Order.builder()
    	.id(123L)
    	.buyerPhone("13707318123")
    	.buyerAddress("中电软件园")
    	.amount(10000L)
    	.payStatus(1)
    	.createTime(LocalDateTime.now())
    	.build();

    OrderConvert orderConvert = Mappers.getMapper(OrderConvert.class);
    OrderDTO orderDTO = orderConvert.from(order);

    System.out.println("order:    " + order);
    System.out.println("orderDTO: " + orderDTO);
}

```
## References

- [MapStruct Reference Guide](https://mapstruct.org/documentation/reference-guide/)

- [Jackson Annotation Examples](https://www.baeldung.com/jackson-annotations)
