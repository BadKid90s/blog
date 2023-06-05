---
title: Kotlin整合SpringBoot后Jackson序列化问题
date: 2023-06-05 10:00:00
categories:
  - SpringBoot
---

## 问题

使用kotlin作为SpringBoot的开发语音后，由于Kotlin语音的特性（自定义的类有主构造器的没有无参构造器）,会造成Jackson在序列化JSON的时候报错。
```
(No Creators, like default construct, exist): cannot deserialize from Object value (no delegate- or property-based Creator
```

## 解决方案
其实只需要配置Jackson支持kotlin的序列化就可以了，并且jackson提供了kotlin-module依赖
## 依赖
[jackson-module-kotlin](https://mvnrepository.com/artifact/com.fasterxml.jackson.module/jackson-module-kotlin)
#### gradle(kotlin)
```kotlin
implementation("com.fasterxml.jackson.module:jackson-module-kotlin:last-version")
```
#### gradle(groovy)
```groovy
implementation group: 'com.fasterxml.jackson.module', name: 'jackson-module-kotlin', version: 'last-version'
```

#### maven
```xml
<dependency>
    <groupId>com.fasterxml.jackson.module</groupId>
    <artifactId>jackson-module-kotlin</artifactId>
    <version>last-version</version>
</dependency>
```

## 配置
```kotlin
@Configuration
class AppConfig {
    
    @Bean
    fun customJackson2HttpMessageConverter(): MappingJackson2HttpMessageConverter {
        val jsonConverter = MappingJackson2HttpMessageConverter()
        val objectMapper = ObjectMapper()
      
        //注册kotlinModule,解决没有无参构造器时无法序列化问题
        objectMapper.registerModule(kotlinModule())
      
        jsonConverter.objectMapper = objectMapper
        return jsonConverter
    }
}
```





