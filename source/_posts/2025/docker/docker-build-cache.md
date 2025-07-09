---
title: 你敢信？Docker竟然把我操作系统磁盘空间干满了
date: 2025-07-09 16:20:00
tags:
  - network
categories:
  - Docker
cover: /post/2025/docker/docker-build-cache/logo.png
---

# 你敢信？Docker竟然把我操作系统磁盘空间干满了


## 起因

今天是我们发版的日子，大家都在如火如荼的进行发版前的准备工作。下午15：00我们需要给后端程序打包Docker镜像，通过Gitlab流水线查看单元测试一直出现错误（单元测试需要连接Docker环境启动临时数据库用于测试）。

![image-20250709152155256](image-20250709152155256.png)

## 排查原因

奇了怪，前几天一直都好好的，难道是IT部门又改了网络配置？导致端口无法联调了?（之前出现过，第一反应怀疑IT部门），经过排查网络环境是通的。

突然同事灵光乍现说会不会是磁盘导致的，然后就去排查Gitlab流水线所在机器的磁盘空间。

![2025_07_09_14_42_34](2025_07_09_14_42_34.png)

不查不知道，一查吓一跳，系统盘根目录全被Docker干完了,直接占用100%。



## 到底是谁占用的空间

知道是Docker 占用的空间，但是不知道是那个环境占用的。到底是本地镜像太多了？还是容器太久没释放了？

通过度娘和问AI得到查询Docker磁盘占用命令：

```bash
root@template：# docker system df --help

Usage:  docker system df [OPTIONS]

Show docker disk usage

Options:
      --format string   Pretty-print images using a Go template
  -v, --verbose         Show detailed information on space usage
```

立马使用以下命令进行排查：

```bash
docker system df -v 
```

![2025_07_09_14_56_00](2025_07_09_14_56_00.png)

结果看到`Images`、`Containers`、`Local Volumes`磁盘占用都比较合理，但是`Build Cache`占用就有点夸张了，竟然是`300GB`.

## 解决方案

找到问题就好办多了，既然占用的多，那就清理掉它。

那就先来个大瘦身吧。

```bash
docker system prune
```

>  什么是 `docker system prune`？
>
> 它是 Docker 提供的一个系统级清理命令，用于清理 Docker 系统中不再使用的资源。它的目的是帮助你释放磁盘空间，尤其是在 Docker 占用大量存储空间时非常有用，可以删除以下类型的无用资源：
>
> |              |                    |                                          |
> | ------------ | ------------------ | ---------------------------------------- |
> | 停止的容器   | ✅ 是               | 所有状态为`Exited`的容器                 |
> | 未使用的网络 | ✅ 是               | 没有被任何容器使用的网络                 |
> | 未使用的镜像 | ❌ 否（除非加`-a`） | 默认只删 dangling 镜像（没有标签的镜像） |
> | 构建缓存     | ✅ 是               | 构建镜像过程中产生的中间层等缓存数据     |

再来查询下磁盘占用。

```bash
root@template：# docker system df 

TYPE                TOTAL               ACTIVE              SIZE                RECLAIMABLE
Images              20                  6                   4.799GB             3.379GB (70%)
Containers          6                   6                   164kB               0B (0%)
Local Volumes       12                  0                   4.844GB             4.844GB(100%)
Build Cache         54                  0                   1.086GB             1.086GB
```

```bash
df -h
```

![image-20250709154749348](image-20250709154749348.png)

磁盘占用一下就由`100%`下降到`11%`了!!!



你以为这就完了?  作为一个优秀的程序员，要做到一劳永逸，我可不想下次半夜被叫起来。

那就想想有没有什么办法可以解决啦。。。

有了，写个定时任务每天运行清理命令。我可真是个大聪明。O(∩_∩)O哈哈~

不对，不对，作为一个优秀的程序员怎么可以这么敷衍啦。

经过查询Docker的官方文档得到最终的解决方案：

**修改构建缓存保留大小**

**步骤：**

1. **编辑 Docker 配置文件** ：

   - 在 Linux 上，Docker 的配置文件通常是 `/etc/docker/daemon.json`。
   - 如果文件不存在，可以手动创建。

2. **添加缓存路径配置** ： 在配置文件中添加以下内容：

   ```
   {
    "builder": {
       "gc": {
         "defaultKeepStorage": "20GB",
         "enabled": true
       }
     }
   }
   ```

   - `defaultKeepStorage`：设置缓存的最大存储空间（例如 `20GB`）。

3. **重启 Docker 服务** ：

   ```bash
   systemctl restart docker
   ```

修改构建缓存保留大小，Docker 会自动清理超出限制的缓存。

查看了同事Windows 系统的Docker Desktop，安装完后会自动配置。

![71da950a179c1484aa5ec05a962b330b-446599](71da950a179c1484aa5ec05a962b330b-446599.png)



完结撒花......



我继续去发版了.........