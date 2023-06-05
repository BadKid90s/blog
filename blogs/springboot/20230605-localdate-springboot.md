---
title: SpringBoot接收前端Date类型参数转换LocalDate或LocalDateTime类型
date: 2023-06-05 10:00:00
categories:
  - SpringBoot
---

## 问题

SpringBoot默认是不支持将时间类型转换成LocalDate类型的

## 解决方案1:(添加 Jackson 的 @JsonFormat 注解) 不推荐
### java
```java
@Data
public class Obj {
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime time;
}
```
### kotlin
```kotlin
@Data
 class Obj (
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        var  time:LocalDateTime,
 )
```
## 解决方案2:(@JsonSerialize、@JsonDeserialize 自定义序列化器和反序列化器) 不推荐
@JsonSerialize、@JsonDeserialize 可分别指定序列化、反序列化时的格式：
### java
```java
public class MyLocalDateTimeSerializer extends com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer {
    public MyLocalDateTimeSerializer() {
        super(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}

public class MyLocalDateTimeDeserializer extends com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer {
    public MyLocalDateTimeDeserializer() {
        super(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}

@Data
public class Obj {
    @JsonSerialize(using = MyLocalDateTimeSerializer.class)
    @JsonDeserialize(using = MyLocalDateTimeDeserializer.class)
    private LocalDateTime time;
}
```
### kotlin
```kotlin
class MyLocalDateTimeSerializer : LocalDateTimeSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

class MyLocalDateTimeDeserializer : LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

class Obj (
        @JsonSerialize(using = MyLocalDateTimeSerializer::class)
        @JsonDeserialize(using = MyLocalDateTimeDeserializer::class)
      val time: LocalDateTime? = null
)
```



## 解决方案3:(使用 Jackson扩展工具包的JavaTimeModule ) 推荐
使用 jackson-datatype-jsr310 定制化 ObjectMapper
### 依赖
[com.fasterxml.jackson.datatype:jackson-datatype-jsr310](https://mvnrepository.com/artifact/com.fasterxml.jackson.datatype/jackson-datatype-jsr310)
#### gradle(kotlin)
```kotlin
implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:last-version")
```
#### gradle(groovy)
```groovy
implementation group: 'com.fasterxml.jackson.datatype', name: 'jackson-datatype-jsr310', version: 'last-version'
```

#### maven
```xml
<dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-jsr310</artifactId>
    <version>last-version</version>
</dependency>
```
### java
```java
@Configuration
public class AppConfig {
    
    @Bean
    public MappingJackson2HttpMessageConverter customJackson2HttpMessageConverter() {
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
        ObjectMapper objectMapper = ObjectMapper();

        //注册JavaTimeModule，解决无法序列化时间到LocalDate、LocalDateTime类型
        objectMapper.registerModule(new JavaTimeModule());
      
        jsonConverter.objectMapper = objectMapper;
        return jsonConverter;
    }
}
```

### kotlin
```kotlin
@Configuration
class AppConfig {
    
    @Bean
    fun customJackson2HttpMessageConverter(): MappingJackson2HttpMessageConverter {
        val jsonConverter = MappingJackson2HttpMessageConverter()
        val objectMapper = ObjectMapper()

        //注册JavaTimeModule，解决无法序列化时间到LocalDate、LocalDateTime类型
        objectMapper.registerModule(JavaTimeModule())
      
        jsonConverter.objectMapper = objectMapper
        return jsonConverter
    }
}
```






