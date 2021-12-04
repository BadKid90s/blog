---
title: 索引的基本操作
date: 2020-12-04
tags:
- ElasticSearch
categories:
- ElasticSearch
---

## 索引的基本操作

### 创建一个索引

```
PUT /索引名/~类型名~ /文档Id
{
	请求体
}
```


![image-20211204170057923](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20211204170057923.png)

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/3b6471ad-761d-4389-9c9c-82ffbfae9ed1.png)

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/9ab4a007-1fdf-41b5-98c9-c9dd4b942a3d.png)

### 定义一个设置数据类型的索引

```
PUT /test1
{
  "mappings": {
    "properties": {
      "name":{
        "type": "text"
      },
      "age":{
        "type": "long"
      },
      "birthday":{
        "type": "date"
      }
    }
  }
}
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/1e6166ef-d8e0-4b65-86c5-c9b9440449c8.png)

### 获取索引信息

```
GET /test1
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/9a4d53a9-0acb-40df-8b72-d4a2dda7a76f.png)

### 查看默认信息

7.8以后文档类型默认`_doc`

```
PUT /test2/_doc/1
{
  "name":"王瑞玉",
  "age":24,
  "birthday":"1997-10-15"
}
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/717a0d84-96e9-4190-a9b1-cdfbd86203c4.png)

查看默认信息

``` 
GET /test2
```

如果自己得文档字段没有指定，那么ES 就会自己给我们默认设置字段类型！

![image-20211204170245851](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20211204170245851.png)



### 扩展查询

可以通过`_cat`命令查看es更多的信息

查看检查值

```
GET _cat/health
```

包含的信息

```
GET _cat/indices?v
```



### 修改索引

- 直接覆盖

  ```
  PUT /test2/_doc/1
  {
    "name":"王瑞玉123",
    "age":24,
    "birthday":"1997-10-15"
  }
  ```

  ![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/c7076451-97a8-454c-aa36-a61b69bc434f.png)

- 修改

  ```
  POST /test2/_doc/1/_update
  {
    "doc":{
      "name":"法外狂徒张三"
    }
  }
  ```

  ![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/07e756b2-6ac0-4dc3-9978-a04bd775e921.png)

版本号会增加，状态更新。

### 删除索引

```
DELETE test
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/bc1173a3-56da-4e0e-8254-300585f88148.png)

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/127b675e-defe-4376-985f-6885ad7b147f.png)