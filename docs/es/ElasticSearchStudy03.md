---
title: 文档的操作
date: 2020-12-04
tags:
- ElasticSearch
categories:
- ElasticSearch
---

## 文档的操作

### 基本操作

#### 添加文档数据

```
PUT /wry/_doc/1
{
  "name":"wry",
  "age":23,
  "desc":"一顿操作猛如虎，一看工资2500",
  "tags":["直男","IT","温暖"]
}

PUT /wry/_doc/2
{
  "name":"张三",
  "age":23,
  "desc":"法外狂徒",
  "tags":["直男"]
}

PUT /wry/_doc/3
{
  "name":"老干妈",
  "age":30,
  "desc":"不知道怎么形容",
  "tags":["靓女"]
}

PUT /wry/_doc/4
{
  "name":"张三SOS",
  "age":60,
  "desc":"SOS",
  "tags":["SOS"]
}

```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/2c2a64c5-a391-4389-afb3-58ff68e64e56.png)

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/6cdd49b4-5d7b-4a51-81f9-9cf9ae09f412.png)

#### GET 获取文档数据

```
GET /wry/_doc/1
```



![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/46374de1-ce5b-46f0-a9b2-ec546ae32117.png)

**`version` 代表记录被修改的次数**

#### 更新文档

##### PUT 更新文档数据

```
PUT /wry/_doc/5
{
  "name":"李四",
  "age":23,
  "desc":"一顿操作猛如虎，一看工资2500",
  "tags":["直男","IT","温暖"]
}
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/c5c6bf93-8e41-4527-9850-5bd88f711549.png)
**`version` 代表记录被修改的次数**

`PUT`请求修改数据，如果请求体修改时少写字段，会丢失。

##### POST 更新文档数据 (推荐使用)

```
POST /wry/_doc/1/_update
{
  "doc": {
    "age": 50
  }
}
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/9f0c24fb-f026-42a8-8b15-d5294138f272.png)
![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/f4c85eb5-7823-4629-9ae4-aa8ac542d0c5.png)



#### 简单条件查询

查询name等于李四的数据：

```
GET /wry/_doc/_search?q=name:李四
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/fa964ef9-a288-428a-b054-2490e1fafbf9.png)

**`_score` 查询的匹配度越高分数越高**

### 复杂操作

#### 精确匹配

```
GET /wry/_doc/_search
{
  "query":{
    "match":{
      "name":"张三"
    }
  }
}
```

精确匹配文档内容 name是Key,张三是Value

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/3073be71-e000-4933-9804-c49a7dbe522c.png)

#### 字段过滤

```
GET /wry/_doc/_search
{
  "query":{
    "match": {
      "name":"张三"
    } 
  },
  "_source":["name","age"]
}

```

使用`_source`选择需要查询的字段

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/b2a6ad55-6b34-417b-a81f-747f6f2537a1.png)

#### 字段排序

```
GET /wry/_doc/_search
{
  "query": {
    "match": {
      "name": "张三"
    }
  },
  "sort": [
    {
      "age":{
        "order":"desc"
      }
    }
  ]
}
```

使用`sort`进行排序，指定字段和排序方式
![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/c0fd8c50-e6ea-4f16-bd8d-4d41172ee28c.png)



```
GET /wry/_doc/_search
{
  "query": {
    "match": {
      "name": "张三"
    }
  },
  "sort": [
    {
      "age":{
        "order":"asc"
      }
    }
  ]
}
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/d88198eb-5ded-4c56-bf1e-d6cf93721777.png)


#### 分页查询

```
GET /wry/_doc/_search
{
  "query": {
    "match": {
      "name": "张三"
    }
  },
  "from":0,
  "size":1
}
```

`form` 从那条记录开始，`size` 每页显示多少条记录

**数据下标是从`0`开始**
![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/8b60b443-5e9c-454c-a01b-2f513ad03d75.png)

#### 布尔值查询 多条件匹配

#### 且条件查询

`must` (相当于MySQL中的`and`) 所有条件都要符合

```
GET /wry/_doc/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "name": "张三"
          }
        },
        {
          "match": {
            "desc": "SOS"
          }
        }
      ]
    }
  }
}
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/b606e799-98c3-48bb-b24e-ce8848350470.png)

#### 或条件查询

`should` (相当于MySQL中的`or`) 条件符合一个就可以

```
GET /wry/_doc/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "name": "张三"
          }
        },
        {
          "match": {
            "desc": "SOS"
          }
        }
      ]
    }
  }
}
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/31a3f053-8e26-4051-bfeb-086738dfd359.png)

#### 不包含查询

`must_not` （相当于MySQL中的`not`）

```
GET /wry/_doc/_search
{
  "query": {
    "bool": {
      "must_not": [
        {
          "match": {
            "name": "张三"
          }
        },
        {
          "match": {
            "desc": "SOS"
          }
        }
      ]
    }
  }
}
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/71bd7d5d-fa64-48a1-afbb-b02f54d27d8e.png)


#### 过滤条件查询

`gt` 大于 （相当于MySQL中的`>`）   
`gte` 大于等于 （相当于MySQL中的`>=`）    
`lt` 小于 （相当于MySQL中的`<`）  
`lte` 小于等于 （相当于MySQL中的`<=`）

```
GET /wry/_doc/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "name": "张三"
          }
        }
      ],
      "filter":{
        "range":{
          "age":{
            "gt":10,
            "lt":40
          }
        }
      }
    }
  }
}
```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/b87ece62-0890-4b27-88cc-bf9934d45d4c.png)

#### 短语匹配

就像用于全文搜索的的match查询一样，当你希望寻找`邻近的单词`时，`match_phrase`查询可以帮你达到目的。

```
GET /wry/_doc/_search
{
    "query": {
        "match_phrase": {
            "desc": "法外狂徒"
        }
    }
}
```

![image-20200804074951055](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200804074951055.png)

和`match`查询类似，`match_phrase`查询首先解析查询字符串来产生一个词条列表。然后会搜索所有的词条，但只保留包含了所有搜索词条的文档，并且词条的位置要邻接。


#### 匹配多个条件

多个字段空格隔开即可，分数(匹配度)高的优先匹配

```
GET /wry/_search
{
  "query": {
    "match": {
      "tags": "女 it"
    }
  }
}

```

![](https://gitee.com/Post-90sBadKid/imageshack/raw/master/7e15f1b6-a10b-4bbf-a229-7ab9017fa3a0.png)

#### 精确查询

因为上边我们的索引库没有指定字段类型所以我们重新准备个测试索引。

##### 创建测试索引库

```
PUT /testdb/
{
  "mappings": {
    "properties": {
      "name":{
        "type": "text"
      },
      "desc":{
        "type": "keyword"
      }
    }
  }
}
```

![image-20200802230130398](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230130398.png)

##### 准备测试文档

```
PUT /testdb/_doc/1
{
  "name":"张三学习ElasticSearch",
  "desc":"法外狂徒"
}

PUT /testdb/_doc/2
{
  "name":"张三学习ElasticSearch",
  "desc":"逍遥的法外狂徒"
}
```

![image-20200802230203947](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230203947.png)


在这里发现一个坑，就是再`创建索引`的时候是`不用写类型`的,但是在插入数据的时候`必须指定文档类型`。否则会`报错`。

**错误演示**

![image-20200802230228873](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230228873.png)

**我们重点说一下这里**

>**两个类型：**  
>`text`  会被分词器解析  
>`keyword` **不会**被分词器解析

使用分词器查询，类型为`keyword`,不会被分词器解析

```
GET _analyze
{
  "analyzer": "keyword",
  "text": "张三学习ElasticSearch"
}
```

![image-20200802230245660](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230245660.png)

使用分词器查询，类型为标准`standard`,可以看到被分词器拆分了

```
GET _analyze
{
  "analyzer": "standard",
  "text": "张三学习ElasticSearch"
}

```

![image-20200802230305586](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230305586.png)

`name`属性是`text`类型，会被分词器进行解析处理成  【"张","三","学","习","ElasticSearch"】,  
所以查询的时候只有输入以上被解析后的结果才能匹配到值进行输出。

```
GET /testdb/_search
{
  "query": {
    "term": {
      "name": "三"
    }
  }
}
```

![image-20200802230326924](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230326924.png)

```
GET /testdb/_search
{
  "query": {
    "term": {
      "name": "张"
    }
  }
}
```

![image-20200802230351493](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230351493.png)


输入`不是被解析的结果`进行查询，`匹配不到输出结果`。

```
GET /testdb/_search
{
  "query": {
    "term": {
      "name": "学习"
    }
  }
}
```

![image-20200802230438720](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230438720.png)

`desc`属性是`keyword`类型，不会被分词器进行解析。

```
GET /testdb/_search
{
  "query": {
    "term": {
      "desc": "法外狂徒"
    }
  }
}
```

输入 `法外狂徒` 他会完全匹配，才能输出结果
![image-20200802230456475](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230456475.png)

```
GET /testdb/_search
{
  "query": {
    "term": {
      "desc": "逍遥的法外狂徒"
    }
  }
}
```

![image-20200802230511853](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230511853.png)

`term`查询是直接通过**倒排索引**指定的词条进行**精确查询**的。

>**关于分词：**  
>`term` 直接精确查询 （效率高）   
>`match` 会使用分词器解析(先分析文档，然后再通过分析的文档进行查询。)

#### 多个值匹配的精确查询

准备数据

```
PUT /testdb/_doc/3
{
  "t1":"22",
  "t2":"2020-07-31"
}

PUT /testdb/_doc/4
{
  "t1":"22",
  "t2":"2020-05-31"
}

PUT /testdb/_doc/5
{
  "t1":"33",
  "t2":"2020-05-31"
}
```

![image-20200802230535141](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230535141.png)

是不是在想`testdb索引`中没有`t1`和`t2`两个字段，
这样写会`动态新增`2个字段的


![image-20200802230720325](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230720325.png)

并且`默认指定了类型`， `t1`是`text`类型，`t2`是`date`类型。
![image-20200802230757400](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230757400.png)


```
GET /testdb/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "t1": {
              "value": "33"
            }
          }
        },
        {
          "term": {
            "t2": {
              "value": "2020-05-31"
            }
          }
        }
      ]
    }
  }
}
```

![image-20200802230938107](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802230938107.png)


#### 高亮查询

使用以前的库进行查询

```
GET /wry/_search
{
  "query": {
    "match": {
      "name": "张三"
    }
  },
  "highlight": {
    "fields": {
      "name": {}
    }
  }
}
```

高亮关键字被加了`<em></em>` 标签

![image-20200802231054144](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802231054144.png)

如果我们不想使用默认的，我们可以自己定义标签

```
GET /wry/_search
{
  "query": {
    "match": {
      "name": "张三"
    }
  },
  "highlight": {
    "pre_tags": "<p class='key' style='color:red'>", 
    "post_tags": "</p>", 
    "fields": {
      "name": {}
    }
  }
}
```

![image-20200802231110593](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20200802231110593.png)

# 