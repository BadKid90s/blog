---
title: Golang 序列化和反序列化
date: 2025-01-08 10:00:00
tags:
- golang
categories:
- golang
cover: /post/2025/golang/go-serialize/logo.png

---

# 序列化和反序列化

Go 语言中，序列化和反序列化是将数据结构转换为字节流（序列化）以及将字节流转换回数据结构（反序列化）的过程。

Go 提供了多种方式来实现序列化和反序列化，常见的方式包括使用 `encoding/json`、`encoding/gob`、`encoding/xml` 等包。

以下是几种常见的序列化和反序列化方法：

## encoding/json

JSON 是一种常用的数据交换格式，Go 提供了 `encoding/json` 包来处理 JSON 数据。

#### 序列化（结构体 -> JSON）



```go
package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func main() {
	p := Person{Name: "Alice", Age: 30}
	jsonData, err := json.Marshal(p)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(string(jsonData)) // 输出: {"name":"Alice","age":30}
}
```

#### 反序列化（JSON -> 结构体）

```go
package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func main() {
	jsonData := `{"name":"Alice","age":30}`
	var p Person
	err := json.Unmarshal([]byte(jsonData), &p)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(p) // 输出: {Alice 30}
}
```



## encoding/xml

XML 是另一种常见的数据交换格式，Go 提供了 `encoding/xml` 包来处理 XML 数据。

#### 序列化（结构体 -> XML）



```go
package main

import (
	"encoding/xml"
	"fmt"
)

type Person struct {
	Name string `xml:"name"`
	Age  int    `xml:"age"`
}

func main() {
	p := Person{Name: "Alice", Age: 30}
	xmlData, err := xml.Marshal(p)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(string(xmlData)) // 输出: <Person><name>Alice</name><age>30</age></Person>
}
```

#### 反序列化（XML -> 结构体）



```go
package main

import (
	"encoding/xml"
	"fmt"
)

type Person struct {
	Name string `xml:"name"`
	Age  int    `xml:"age"`
}

func main() {
	xmlData := `<Person><name>Alice</name><age>30</age></Person>`
	var p Person
	err := xml.Unmarshal([]byte(xmlData), &p)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(p) // 输出: {Alice 30}
}
```

## 二进制序列化和反序列化

### 1. 使用 `encoding/gob` 进行

`encoding/gob` 是 Go 语言特有的二进制序列化格式，适合在 Go 程序之间进行数据交换。

#### 序列化（结构体 -> 二进制）

```go
package main

import (
	"bytes"
	"encoding/gob"
	"fmt"
)

type Person struct {
	Name string
	Age  int
}

func main() {
	p := Person{Name: "Alice", Age: 30}
	var buf bytes.Buffer
	enc := gob.NewEncoder(&buf)
	err := enc.Encode(p)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(buf.Bytes()) // 输出二进制数据
}
```

#### 反序列化（二进制 -> 结构体）

```go
package main

import (
	"bytes"
	"encoding/gob"
	"fmt"
)

type Person struct {
	Name string
	Age  int
}

func main() {
	// 假设 buf 是之前序列化得到的二进制数据
	buf := bytes.NewBuffer([]byte{...}) // 替换为实际的二进制数据
	dec := gob.NewDecoder(buf)
	var p Person
	err := dec.Decode(&p)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(p) // 输出: {Alice 30}
}
```

### 2.使用第三方库

如 `github.com/golang/protobuf` 或 `github.com/vmihailenco/msgpack`）

除了标准库，Go 社区还提供了许多第三方库来处理不同的序列化格式，例如 Protocol Buffers、MessagePack 等。

#### `msgpack` 

```go
package main

import (
	"fmt"
	"github.com/vmihailenco/msgpack"
)

type Person struct {
	Name string
	Age  int
}

func main() {
	p := Person{Name: "Alice", Age: 30}
	msgpackData, err := msgpack.Marshal(p)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(msgpackData) // 输出二进制数据

	var p2 Person
	err = msgpack.Unmarshal(msgpackData, &p2)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(p2) // 输出: {Alice 30}
}
```

#### Protobuf

##### 安装 Protobuf 编译器 (`protoc`)

首先需要安装 Protobuf 编译器 `protoc`，用于将 `.proto` 文件编译成目标语言的代码。

###### 在 macOS 上安装

```sh
brew install protobuf
```

###### 在 Ubuntu 上安装

```sh
sudo apt-get install protobuf-compiler
```

###### 在 Windows 上安装

可以从 [Protobuf 官方 GitHub 发布页面](https://github.com/protocolbuffers/protobuf/releases) 下载预编译的 `protoc` 二进制文件。

##### 安装 Go 的 Protobuf 插件

Go 语言需要安装 `protoc-gen-go` 插件来生成 Go 代码。

```go
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
```

确保 `protoc-gen-go` 在 `PATH` 中可用：

```go
export PATH=$PATH:$(go env GOPATH)/bin
```

------

##### 定义 `.proto` 文件

创建一个 `.proto` 文件来定义数据结构。例如，创建一个 `person.proto` 文件：

```go
syntax = "proto3";

package example;

message Person {
  string name = 1;
  int32 age = 2;
  repeated string hobbies = 3; // 重复字段，类似于切片
}
```

- `syntax = "proto3";` 指定使用 Protobuf 的版本 3。
- `message` 定义了一个数据结构。
- 每个字段都有一个唯一的编号（如 `1`, `2`, `3`），用于二进制编码。

##### 编译 `.proto` 文件生成 Go 代码

使用 `protoc` 命令将 `.proto` 文件编译为 Go 代码：

```go
protoc --go_out=. person.proto
```

这会生成一个 `person.pb.go` 文件，其中包含 Go 结构体和序列化/反序列化方法。

##### 在 Go 中使用 Protobuf

生成的 `person.pb.go` 文件可以直接在 Go 代码中使用。

```go
package main

import (
	"fmt"
	"log"

	"google.golang.org/protobuf/proto"
	"example" // 替换为你的包名
)

func main() {
	// 创建一个 Person 对象
	p := &example.Person{
		Name:    "Alice",
		Age:     30,
		Hobbies: []string{"reading", "coding"},
	}

	// 序列化为二进制数据
	data, err := proto.Marshal(p)
	if err != nil {
		log.Fatalf("Failed to encode person: %v", err)
	}
	fmt.Printf("Serialized data: %x\n", data)

	// 反序列化为 Person 对象
	var p2 example.Person
	err = proto.Unmarshal(data, &p2)
	if err != nil {
		log.Fatalf("Failed to decode person: %v", err)
	}
	fmt.Printf("Deserialized person: %+v\n", p2)
}
```



## 总结

- **JSON**：适合跨语言的数据交换，使用 `encoding/json`。
- **Gob**：适合 Go 语言内部的数据交换，使用 `encoding/gob`。
- **XML**：适合需要 XML 格式的场景，使用 `encoding/xml`。
- **第三方库**：如 Protocol Buffers、MessagePack 等，适合特定场景或性能要求较高的场景。