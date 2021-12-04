---
title: 基本数据类型
date: 2020-12-04
tags:
- ElasticSearch
categories:
- ElasticSearch
---


## 数据类型

[官网地址](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html#mapping-types)

###  核心数据类型 （Core data types）

[官网地址](https://github.com/elastic/elasticsearch/edit/7.8/docs/reference/mapping/types.asciidoc)

- **[string 串](https://www.elastic.co/guide/en/elasticsearch/reference/current/string.html)**

  [`text`](https://www.elastic.co/guide/en/elasticsearch/reference/current/text.html) 和 [`keyword`](https://www.elastic.co/guide/en/elasticsearch/reference/current/keyword.html)

- **[Number 数字](https://www.elastic.co/guide/en/elasticsearch/reference/current/number.html)**

  `long`，`integer`，`short`，`byte`，`double`，`float`，`half_float`，`scaled_float`

- **[Date 日期](https://www.elastic.co/guide/en/elasticsearch/reference/current/date.html)**

  `date`

- **[Date nanoseconds 日期纳秒](https://www.elastic.co/guide/en/elasticsearch/reference/current/date_nanos.html)**

  `date_nanos`

- **[Boolean 布尔型](https://www.elastic.co/guide/en/elasticsearch/reference/current/boolean.html)**

  `boolean`

- **[Binary 二进制](https://www.elastic.co/guide/en/elasticsearch/reference/current/binary.html)**

  `binary`

- **[Range 范围](https://www.elastic.co/guide/en/elasticsearch/reference/current/range.html)**

  `integer_range`，`float_range`，`long_range`，`double_range`，`date_range`，`ip_range`

###  复杂数据类型（Complex data types）

[官网地址](https://github.com/elastic/elasticsearch/edit/7.8/docs/reference/mapping/types.asciidoc)

- **[Object 对象](https://www.elastic.co/guide/en/elasticsearch/reference/current/object.html)**

  `object` 用于单个JSON对象

- **[Nested 嵌套对象](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html)**

  `nested` 用于JSON对象数组

###  地理数据类型 （Geo data types）

[官网地址](https://github.com/elastic/elasticsearch/edit/7.8/docs/reference/mapping/types.asciidoc)

- **[Geo-point 地理位置](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-point.html)**

  `geo_point` 纬度/经度积分

- **[Geo-shape 地理形状](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-shape.html)**

  `geo_shape` 用于多边形等复杂形状

###  专用数据类型 （Specialised data types）

[官网地址](https://github.com/elastic/elasticsearch/edit/7.8/docs/reference/mapping/types.asciidoc)

- **[IP](https://www.elastic.co/guide/en/elasticsearch/reference/current/ip.html)**

  `ip` 用于IPv4和IPv6地址

- **[ Completion data type 完成数据类型](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html#completion-suggester)**

  `completion` 提供自动完成建议

- **[Token count](https://www.elastic.co/guide/en/elasticsearch/reference/current/token-count.html)**

  `token_count` 计算字符串中令牌的数量

- **[mapper-murmur3](https://www.elastic.co/guide/en/elasticsearch/plugins/7.8/mapper-murmur3.html)**

  `murmur3` 在索引时计算值的哈希并将其存储在索引中

- **[mapper-annotated-text](https://www.elastic.co/guide/en/elasticsearch/plugins/7.8/mapper-annotated-text.html)**

  `annotated-text` 索引包含特殊标记的文本（通常用于标识命名实体）

- **[Percolator](https://www.elastic.co/guide/en/elasticsearch/reference/current/percolator.html)**

  接受来自query-dsl的查询

- **[Join](https://www.elastic.co/guide/en/elasticsearch/reference/current/parent-join.html)**

  为同一索引内的文档定义父/子关系

- **[Rank feature 排名功能](https://www.elastic.co/guide/en/elasticsearch/reference/current/rank-feature.html)**

  记录数字功能以提高查询时的点击率。

- **[Rank features 等级特征](https://www.elastic.co/guide/en/elasticsearch/reference/current/rank-features.html)**

  记录数字功能以提高查询时的点击率。

- **[Dense vector密集矢量](https://www.elastic.co/guide/en/elasticsearch/reference/current/dense-vector.html)**

  记录浮点值的密集向量。

- **[Sparse vector 稀疏矢量](https://www.elastic.co/guide/en/elasticsearch/reference/current/sparse-vector.html)**

  记录浮点值的稀疏向量。

- **[Search -as-you-type 按类型搜索](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html)**

  针对查询进行优化的类文本字段，以实现按需输入完成

- **[Alias 别名](https://www.elastic.co/guide/en/elasticsearch/reference/current/alias.html)**

  为现有字段定义别名。

- **[Flattened 展平](https://www.elastic.co/guide/en/elasticsearch/reference/current/flattened.html)**

  允许将整个JSON对象索引为单个字段。

- **[Shape 形状](https://www.elastic.co/guide/en/elasticsearch/reference/current/shape.html)**

  `shape` 对于任意笛卡尔几何。

- **[Histogram 直方图](https://www.elastic.co/guide/en/elasticsearch/reference/current/histogram.html)**

  `histogram` 用于百分位数聚合的预聚合数值。

- **[constant keyword 常数关键字](https://www.elastic.co/guide/en/elasticsearch/reference/current/constant-keyword.html)**

  `keyword`当所有文档具有相同值时的情况的 专业化。

###  数组 （Arrays）

[官网地址](https://github.com/elastic/elasticsearch/edit/7.8/docs/reference/mapping/types.asciidoc)

在Elasticsearch中，数组不需要专用的字段数据类型。默认情况下，任何字段都可以包含零个或多个值，但是，数组中的所有值都必须具有相同的数据类型。请参阅[数组](https://www.elastic.co/guide/en/elasticsearch/reference/current/array.html)。

###  多领域 (Multi-fieds)

[官网地址](https://github.com/elastic/elasticsearch/edit/7.8/docs/reference/mapping/types.asciidoc)

为不同的目的以不同的方式对同一字段建立索引通常很有用。例如，一个`string`字段可以映射为`text`用于全文搜索的字段，也可以映射为`keyword`用于排序或聚合的字段。或者，您可以使用[`standard`分析仪](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-standard-analyzer.html)， [`english`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lang-analyzer.html#english-analyzer)分析仪和 [`french`分析仪](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lang-analyzer.html#french-analyzer)索引文本字段。

这是*多领域*的目的。大多数数据类型通过[`fields`](https://www.elastic.co/guide/en/elasticsearch/reference/current/multi-fields.html)参数支持多字段。


## Rest风格说明

一种软件架构风格,而不是标准,只是提供了一组设计原则和约束条件。它主要用于客户端和服务器交互类的软件。基于这个风格设计的软件可以更简洁,更有层次,更易于实现缓存等机制。

| method | URL                                             | 描述                        |
| :----: | :---------------------------------------------- | :-------------------------- |
|  PUT   | localhost:9200/索引名称/类型名称/文档Id         | 创建/修改文档（指定文档Id） |
|  POST  | localhost:9200/索引名称/类型名称                | 创建文档（随机文档Id）      |
|  POST  | localhost:9200/索引名称/类型名称/文档Id/_update | 修改文档                    |
| DELETE | localhost:9200/索引名称/类型名称/文档Id         | 删除文档                    |
|  GET   | localhost:9200/索引名称/类型名称/文档Id         | 查询文档 通过文档Id         |
|  POST  | localhost:9200/索引名称/类型名称/_search        | 查询所有文档                |

## 

