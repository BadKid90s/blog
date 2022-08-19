---
title: SpringBoot整合
date: 2020-12-04
tags:
- ElasticSearch
categories:
- ElasticSearch
---


# 集成SpringBoot

## 找文档

[官网地址](https://www.elastic.co/guide/index.html)：https://www.elastic.co/guide/index.html  
[客户端集成](https://www.elastic.co/guide/en/elasticsearch/client/index.html)https://www.elastic.co/guide/en/elasticsearch/client/index.html

一般我们使用高级API

![image-20200802231215650](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802231215650.png)

```xml
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
    <version>7.8.1</version>
</dependency>
```

## 找对象

![image-20200802231348859](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802231348859.png)

## 搭建项目

### pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.3.2.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.wry</groupId>
	<artifactId>es-api</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>es-api</name>
	<description>Spring Boot for ElasticSearch</description>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-elasticsearch</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-configuration-processor</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
			<exclusions>
				<exclusion>
					<groupId>org.junit.vintage</groupId>
					<artifactId>junit-vintage-engine</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>

```

SpringBoot默认使用7.6.2,与本地版本不一致会连接不成功。
![image-20200802231523942](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802231523942.png)

### 自定义es 版本依赖，与本地版本保持一直

```xml
	<properties>
        <java.version>1.8</java.version>
		<!--自定义es 版本依赖，与本地版本保持一直 -->
		<elasticsearch.version>7.8.1</elasticsearch.version>
	</properties>
```
![image-20200802231614736](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802231614736.png)

### 

### 自动配置

![image-20200802231807542](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802231807542.png)

### application.yml

```yaml
server:
  port: 9000

spring:
  elasticsearch:
    rest:
      uris: http://localhost:9200

```

## 索引 API 操作

注入`ElasticSearch`的客户端对象`RestHighLevelClient`

```
package com.wry.esapi;

import org.elasticsearch.client.IndicesClient;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import x.annotation.Resource;
import .io.IOException;

@SpringBootTest
class EsApiApplicationTests {
    
    private final String INDEX_NAME="spring_boot_index";

    @Resource
    private RestHighLevelClient restHighLevelClient;
    
}

```

### 创建索引

```
    /**
     * 创建索引
     *
     * @throws IOException
     */
    @Test
    void testCreateIndexRequest() throws IOException {
        //创建索引请求
        CreateIndexRequest request = new CreateIndexRequest(INDEX_NAME);
        //执行请求并获取响应结果
        IndicesClient indices = restHighLevelClient.indices();
        CreateIndexResponse response = indices.create(request, RequestOptions.DEFAULT);
        System.out.println(response.index());
    }
    
```


![image-20200802232058865](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802232058865.png)

![image-20200802232120173](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802232120173.png)


### 判断索引是否存在

```
    /**
     * 判断索引是否存在
     *
     * @throws IOException
     */
    @Test
    void testExistsIndexRequest() throws IOException {
        //创建索引请求
        GetIndexRequest request = new GetIndexRequest(INDEX_NAME);
        //执行请求并获取响应结果
        boolean exists = restHighLevelClient.indices().exists(request, RequestOptions.DEFAULT);

        System.out.println(exists);
    }
    
```

![image-20200802232203179](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802232203179.png)

### 删除索引

```
    /**
     * 删除索引
     *
     * @throws IOException
     */
    @Test
    void testDeleteIndexRequest() throws IOException {
        //创建索引请求
        DeleteIndexRequest request = new DeleteIndexRequest(INDEX_NAME);
        //执行请求并获取响应结果
        AcknowledgedResponse response = restHighLevelClient.indices().delete(request, RequestOptions.DEFAULT);

        System.out.println(response.isAcknowledged());
    }
```

![image-20200802232231687](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802232231687.png)

![image-20200802232525542](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802232525542.png)

## 文档 API 操作

```
package com.wry.esapi.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 创建一个User 对应提供全参，无参构造器
 * </p>
 *
 * @author wangruiyu
 * @since 2020/8/1
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class User {
    
    private String name;
    private Integer age;
}

```

###  创建文档

```
 	/**
     * 创建文档
     *
     * @throws IOException
     */    
	@Test
    void testAddDocumentRequest() throws IOException {
        //创建对象
        User user = new User("张三", 24);
        //创建文档请求
        IndexRequest indexRequest = new IndexRequest(INDEX_NAME);
        // PUT /spring_boot_index/_doc/1
        indexRequest.id("1");
        indexRequest.timeout(TimeValue.timeValueSeconds(1));

        //将对象转换为
        ObjectMapper mapper=new ObjectMapper();
        indexRequest.source(mapper.writeValueAsString(user), XContentType.);
        //执行请求并获取响应结果
        IndexResponse response = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
        System.out.println(response.toString());

    }

```

![image-20200802232349921](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802232349921.png)

![image-20200802232653106](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802232653106.png)

###  判断文档是否存在

```
    /**
     * 判断文档是否存在
     *
     * @throws IOException
     */
    @Test
    void testExistsDocumentRequest() throws IOException {
        //创建文档请求
        //GET /spring_boot_index/_doc/1
        GetRequest getRequest = new GetRequest(INDEX_NAME, "1");
        //不获取返回的_source 的上下文
        getRequest.fetchSourceContext(new FetchSourceContext(false));
        //执行请求并获取响应结果
        GetResponse response = restHighLevelClient.get(getRequest, RequestOptions.DEFAULT);
        System.out.println(response.toString());

    }  

```

![image-20200802232752850](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802232752850.png)

###  查询文档内容

```
    /**
     * 查询文档内容
     *
     * @throws IOException
     */
    @Test
    void testGetDocumentRequest() throws IOException {
        //创建文档请求
        //GET /spring_boot_index/_doc/1
        GetRequest getRequest = new GetRequest(INDEX_NAME, "1");
        //执行请求并获取响应结果
        GetResponse response = restHighLevelClient.get(getRequest, RequestOptions.DEFAULT);
        System.out.println(response.getSourceAsString());
        System.out.println(response.toString());

    }

```

![image-20200802232856318](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802232856318.png)

### 更新文档

```
    /**
     * 更新文档内容
     *
     * @throws IOException
     */
    @Test
    void testUpdateDocumentRequest() throws IOException {
        //创建文档请求
        //POST /wry/_doc/1/_update
        UpdateRequest updateRequest = new UpdateRequest(INDEX_NAME, "1");
        updateRequest.timeout(TimeValue.timeValueSeconds(1));
        //创建对象
        User user=new User("张三",124);
        //将对象转换为
        ObjectMapper mapper = new ObjectMapper();
        updateRequest.doc(mapper.writeValueAsString(user), XContentType.);
        //执行请求并获取响应结果
        UpdateResponse response = restHighLevelClient.update(updateRequest, RequestOptions.DEFAULT);
        System.out.println(response.status());
        System.out.println(response.toString());

    }

```

![image-20200802233004057](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802233004057.png)

### 删除文档

```
    /**
     * 删除文档内容
     *
     * @throws IOException
     */
    @Test
    void testDeleteDocumentRequest() throws IOException {
        //创建文档请求
        DeleteRequest deleteRequest = new DeleteRequest(INDEX_NAME, "1");
        deleteRequest.timeout(TimeValue.timeValueSeconds(1));
        //执行请求并获取响应结果
        DeleteResponse response = restHighLevelClient.delete(deleteRequest, RequestOptions.DEFAULT);
        System.out.println(response.status());
        System.out.println(response.toString());

    }
```

![image-20200802233030746](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802233030746.png)

### 批量操作文档内容

```
   /**
     * 批量操作文档内容
     *
     * @throws IOException
     */
    @Test
    void testBulkDocumentRequest() throws IOException {
        List<User> list = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            list.add(new User("z" + i, i + 10));
        }
        BulkRequest bulkRequest = new BulkRequest();
        bulkRequest.timeout(TimeValue.timeValueSeconds(10));

        //将对象转换为
        ObjectMapper mapper = new ObjectMapper();
        for (int i = 0; i < list.size(); i++) {
            IndexRequest indexRequest = new IndexRequest(INDEX_NAME)
                    .id(String.valueOf(i+1))
                    .source(mapper.writeValueAsString(list.get(i)),XContentType.);
            bulkRequest.add(indexRequest);
        }
        //执行请求并获取响应结果
        BulkResponse response = restHighLevelClient.bulk(bulkRequest, RequestOptions.DEFAULT);
        //是否失败 false 成功， true 失败
        System.out.println(response.hasFailures());
    }
    
```


![image-20200802233054885](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802233054885.png)

![](https://gitee.com/BadKid90s/imageshack/blob/other/image-20200802233116205.png)[image-20200802233116205](ElasticSearch学习.assets/image-20200802233116205.png)

### 查询文档

```
    /**
     * 查询文档内容
     *
     * @throws IOException
     */
    @Test
    void testSearchDocumentRequest() throws IOException {
        SearchRequest searchRequest = new SearchRequest(INDEX_NAME);
        //构建搜索条件
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        //查询条件，通过 QueryBuilders 工具类实现
        //termQuery 精确匹配
        //matchAllQuery 匹配所有
        QueryBuilders.termQuery("name","z10");
        sourceBuilder.query();
        sourceBuilder.timeout(TimeValue.timeValueSeconds(10));

        SearchResponse response = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        SearchHits hits = response.getHits();
        SearchHit[] hitsHits = hits.getHits();
        for (SearchHit hitsHit : hitsHits) {
            System.out.println(hitsHit);
        }
    }
```

