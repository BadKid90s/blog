---
title: Dockerfile 基本语法
date: 2021-12-20 12:30:00
tags:
 - docker
categories:
 - Docker
---

# 保留字介绍
## FROM
基础镜像，当前镜像是基于那个镜像创建的
## MAINTAINER
镜像作者加邮箱
## RUN
构建镜像时执行的命令
## EXPOSE
镜像暴露的端口
## WORKDIR
指定容器创建后，终端默认登陆进来的工作目录，一个落脚点
##  ENV (key value)
构建镜像中设置环境变量(键值对)
## ADD
添加并解压缩
```dockerfile
ADD 源路径 目标路径 
```
COPY
## 添加并解压缩
```dockerfile
COPY 源路径 目标路径 
```
##  VOLUME
容器卷，用于数据保存和持久化工作
##  CMD (exec/shell)
指定容器启动时的命令，一个容器可有多个cmd 命令，但只有最后一个生效,CMD 会被docker run 的参数替换
##  ENTRYPOINT XXX
指定容器启动时的命令，追加 docker run 的参数
##  ONBUILD XXX
当构建一个被继承的Dockerfile 时运行命令，父镜像在被子镜像继承后，父镜像的ONBUILD 被触发

# 案例
## 自定义mycentos 镜像
自定义mycentos 镜像让其具备以下功能：

- 登陆后的默认lujing
- vim 编辑器
- 查看网络配置 ipconfig
```dockerfile
FROM centos
MAINTAINER Mr.Wang<wry10150@outlook.com>
ENV mypath /temp
WORKDIR  $mypath
RUN yum -y install vim
RUN yum -y install net-tools
EXPOSE 80
CMD /bin/bash
```
