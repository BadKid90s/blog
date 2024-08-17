---
title: Ubuntu Export Offline Packages
date: 2024-08-16 16:50:18
tags:
- Ceph
categories:
- 分布式存储
cover: /images/ceph/ceph.png

---

# Ubuntu 离线包制作

## 创建保存目录

```shell
mkdir /root/offline-depends
```



## 安装工具包`apt-rdepends`

>`apt-rdepends` 是一个用于查看软件包依赖关系的工具，它可以帮助你理解一个软件包安装时需要哪些其他软件包作为依赖。

```shell
sudo apt install apt-rdepends
```



## 下载包

>使用以下命令下载主包（我们以 Vim为例子）以及所有依赖项。

```shell
sudo apt-rdepends vim | grep -v "^ "  | xargs -r sudo apt-get download
```

**`| grep -v "^ "`**： 用于过滤掉`^`开头的依赖包

- `|`：管道符号，用于将前一个命令的输出作为后一个命令的输入。
- `grep -v "^ "`：`grep` 是一个文本搜索工具，`-v` 选项用于反转匹配，即选择不匹配给定模式的行。`"^ "` 是一个正则表达式，匹配任何以空格开头的行。

![image-20240810105023675](image-20240810105023675.png)

**`| xargs -r sudo apt-get download`**：

- 管道 `|` 将 `apt-rdepends` 的输出传递给 `xargs` 命令。

- `xargs` 命令用于从标准输入构建并执行命令。在这里，它接收 `apt-rdepends` 输出的软件包名列表，并为每个软件包名执行 `sudo apt-get download` 命令。

- `-r` 或 `--no-run-if-empty` 选项告诉 `xargs` 如果输入为空（即没有软件包名传递给它），则不要执行任何命令。这是一个很好的安全特性。

  

### 找不到对于的包时先过滤掉

![image-20240810105145553](image-20240810105145553.png)



### 过滤

```shell
sudo apt-rdepends vim | grep -v "^ "  |grep -v 'debconf-2.0' | xargs -r sudo apt-get download
```

![image-20240810105552583](image-20240810105552583.png)

![image-20240810105703217](image-20240810105703217.png)

### 查询过滤掉的包

[Ubuntu Repositories](https://ubuntu.pkgs.org/)  地址：https://ubuntu.pkgs.org/

>有些包全称可能搜索不到，删减一些，保留关键词



![image-20240810110014734](image-20240810110014734.png)

![image-20240810110058958](image-20240810110058958.png)

### 离线对应的包

```shell
sudo apt-rdepends debconf | grep -v "^ "  | xargs -r sudo apt-get download
```

![image-20240810110226945](image-20240810110226945.png)



## 查看离线包

> 拷贝这些包到需要安装的环境中

![image-20240810110427960](image-20240810110427960.png)



## 安装

>在离线包的同级目录

```shell
sudo dpkg -i *
```



**没错，就这么简单！**