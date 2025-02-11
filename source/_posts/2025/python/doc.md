# 使用python-docx-template渲染word文档

## 快速开始

To install using pip:

```python
pip install docxtpl
```

or using conda:

```python
conda install docxtpl --channel conda-forge
```

Usage:

```python
from docxtpl import DocxTemplate

doc = DocxTemplate("my_word_template.docx")
context = { 'company_name' : "World company" }
doc.render(context)
doc.save("generated_doc.docx")
```

## 文档案例

[官方文档](https://github.com/elapouya/python-docx-template/blob/master/docs/index.rst)

[代码示例](https://github.com/elapouya/python-docx-template/tree/master/tests)

[模板示例](https://github.com/elapouya/python-docx-template/tree/master/tests/templates)



## 使用案例

### 需求

获取数据库的表结构、索引结构按照特定的文档格式生成word文档。

### 代码

```python
import pymysql
from docxtpl import DocxTemplate

def getTableMetadata(host, user, password, dbName):
    # 连接到数据库
    conn = pymysql.connect(host=host, user=user, password=password, database=dbName)
    cursor = conn.cursor()

    # 获取所有表名及其备注
    cursor.execute("SELECT TABLE_NAME, TABLE_COMMENT FROM information_schema.tables WHERE TABLE_SCHEMA = %s;", (dbName,))
    tables = cursor.fetchall()

    # 准备存储元数据的结构
    metadata = []

    for table in tables:
        tableName = table[0]
        tableRemark = table[1]  # 表的备注
        
        # 获取表的列信息
        cursor.execute(f"SHOW FULL COLUMNS FROM {tableName};")
        columns = cursor.fetchall()

        # 组织列信息
        columnList = []
        for column in columns:
            columnInfo = {
                "name": column[0],  # 列名
                "type": column[1],  # 数据类型
                "key": column[4],  # 主键
                "empty": column[3],  # 允许为空
                "default": column[5] if column[5] is not None else "",  # 默认值
                "remark": column[8] if column[8] else ""  # 列的备注
            }
            columnList.append(columnInfo)

        # 获取表的索引信息
        cursor.execute(f"SHOW INDEX FROM {tableName};")
        indexes = cursor.fetchall()

        # 组织索引信息
        indexDict = {}
        for index in indexes:
            keyName = index[2]  # 索引名称
            columnName = index[4]  # 列名
            nonUnique = index[1]  # 是否唯一
            seqInIndex = index[3]  # 列在索引中的顺序
            indexType = index[10]  # 索引类型

            if keyName not in indexDict:
                indexDict[keyName] = {
                    "nonUnique": "YES" if nonUnique else "NO",  # 转换为 Yes/No
                    "seqInIndex": seqInIndex,
                    "indexType": indexType,
                    "columns": []  # 存储列名
                }
            indexDict[keyName]["columns"].append(columnName)

        # 将索引信息转换为列表，并合并列名
        indexList = []
        for keyName, indexInfo in indexDict.items():
            indexList.append({
                "keyName": keyName,
                "columns": ", ".join(indexInfo["columns"]),  # 合并列名
                "nonUnique": indexInfo["nonUnique"],  # 使用 Yes/No
                "seqInIndex": indexInfo["seqInIndex"],
                "indexType": indexInfo["indexType"]
            })

        # 组织表信息
        tableInfo = {
            "name": tableName,
            "remark": tableRemark,  # 备注
            "list": columnList,
            "indexList": indexList  # 添加索引信息
        }
        metadata.append(tableInfo)

    # 关闭数据库连接
    conn.close()
    
    return metadata

def main():
    # 数据库连接信息
    host = "192.168.1.145"  # 数据库主机
    user = "root"  # 数据库用户名
    password = "123456"  # 数据库密码
    dbName = "db_sovecloud_mgr"  # 数据库名称

    tablesMetadata = getTableMetadata(host, user, password, dbName)

    # 准备上下文字典
    context = {
        "tables": tablesMetadata  # 将元数据放入字典中
    }
    # 准备模板
    template = DocxTemplate("tpl.docx")
    # 渲染模板并保存输出
    template.render(context)
    template.save("output.docx")

if __name__ == "__main__":
    main()

```

### 模板

![image-20250211105527664](./tpl.png)

### 结果

![image-20250211105811948](./output)
