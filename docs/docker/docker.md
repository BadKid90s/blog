---
title: Docker基本语法
date: 2021-12-20 12:30:00
tags:
- docker
categories:
- Docker
---

## 安装
### 1.查看系统、内核
CentOS7 要求64位系统、内核版本3.10以上
CentOS6 要求版本在6.5以上，系统64位、内核版本2.6.32-431以上
查看内核版本号
```shell
uname -r #查看内核版本

cat /etc/os-release #查看系统信息.
```
开启centos-extras资源库
使用Centos 7，开启centos-extras资源库
### 2.卸载旧版本
卸载旧版本
```shell
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```
删除旧版本Docker文件
```shell
sudo rm /var/lib/docker/ -rf
```
### 3.设置仓库
#### 设置yum仓库
安装必要依赖包
```shell
sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
```
添加阿里镜像稳定版仓库
```shell
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
添加阿里源时有时会报错，如果报错，使用如下命令使用官方源
```shell
#删除异常源
sudo rm -f /etc/yum.repos.d/docker-ce.repo

#使用官方源
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```
#### 更新yum缓存
```shell
sudo yum makecache fast
```
### 4.安装Docker-CE
注意事项：本步骤分两部分，仅需按需求使用其一
#### 安装最新版
```shell
sudo yum install -y docker-ce docker-ce-cli containerd.io
```
#### 安装指定版本
列出可用版本
```shell
yum list docker-ce --showduplicates | sort -r

# 显示结果
# docker-ce.x86_64  3:18.09.1-3.el7                     docker-ce-stable
# docker-ce.x86_64  3:18.09.0-3.el7                     docker-ce-stable
# docker-ce.x86_64  18.06.1.ce-3.el7                    docker-ce-stable
# docker-ce.x86_64  18.06.0.ce-3.el7                    docker-ce-stable
```
安装指定版本
需要替换为第二列的版本号，如：18.06.0.ce-3.el7
```shell
sudo yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io
```
### 设置**镜像代理**
**阿里Docker镜像云服务**
[https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)
## 运行
### 启动Docker服务
```shell
systemctl start docker
```
### 运行镜像
```shell
docker run  hello-world
```
### 查看本地的镜像
```shell
docker images
```
![](https://cdn.nlark.com/yuque/0/2022/png/21973095/1672381927401-6e68e3d2-847d-42e8-aeba-d5aec4ca9a9c.png#averageHue=%23262a2c&id=xsf1S&originHeight=77&originWidth=821&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- REPOSITORY:表示 镜像的仓库源
- TAG: 表示镜像的版本标签 （:版本号）
- IMAGE ID :镜像ID
- CREATED :镜像创建的时间
- SIZE: 镜像的大小
### 所有本地镜像包含中间镜像层
```shell
docker images -a
```
### 只显示镜像的ID
```shell
docker images -q
```
### 显示当前镜像的ID
```shell
docker images -qa
```
### 显示镜像的描述信息
```shell
docker images --digests
```
### 显示完整的镜像信息
```shell
docker images --digests --no-trunc
```
### 查找镜像命名
```shell
docker search 镜像名称
```
### 找Start大于30的tomca
```shell
docker search -s 30 tomcat
```
### 下载镜像
```shell
docker pull 镜像名称:latest   
```
### 删除镜像
```shell
docker rmi 镜像名称
```
### 强制删除
```shell
docker rmi -f 镜像名称
```
### 删除多个镜像
```shell
docker rmi  镜像名称 :TAG  镜像名称2:TAG
```
### 删除全部镜像
```shell
docker rmi -f $(docker images -q)

```
### 创建一个新的容器并运行一个命令
#### 基本语法
```shell
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```
#### OPTIONS说明

- **-a stdin:** 指定标准输入输出内容类型，可选 STDIN/STDOUT/STDERR 三项；
- **-d:** 后台运行容器，并返回容器ID；
- **-i:** 以交互模式运行容器，通常与 -t 同时使用；
- **-t:** 为容器重新分配一个伪输入终端，通常与 -i 同时使用；
- **-P:** 随机端口映射，容器内部端口**随机**映射到主机的高端口
- **-p:** 指定端口映射，格式为：**主机(宿主)端口:容器端口**
- **--name="nginx-lb":** 为容器指定一个名称；
- **--dns 8.8.8.8:** 指定容器使用的DNS服务器，默认和宿主一致；
- **--dns-search example.com:** 指定容器DNS搜索域名，默认和宿主一致；
- **-h "mars":** 指定容器的hostname；
- **-e username="ritchie":** 设置环境变量；
- **--env-file=[]:** 从指定文件读入环境变量；
- **--cpuset="0-2" or --cpuset="0,1,2":** 绑定容器到指定CPU运行；
- **-m :**设置容器使用内存最大值；
- **--net="bridge":** 指定容器的网络连接类型，支持 bridge/host/none/container: 四种类型；
- **--link=[]:** 添加链接到另一个容器；
- **--expose=[]:** 开放一个端口或一组端口；
- **--volume , -v: **绑定一个卷
#### 测试用例
使用docker镜像nginx:latest以后台模式启动一个容器,并将容器命名为mynginx。
`docker run --name mynginx -d nginx:latest`
使用镜像nginx:latest以后台模式启动一个容器,并将容器的80端口映射到主机随机端口。
`docker run -P -d nginx:latest`
使用镜像 nginx:latest，以后台模式启动一个容器,将容器的 80 端口映射到主机的 80 端口,主机的目录 /data 映射到容器的 /data。
`docker run -p 80:80 -v /data:/data -d nginx:latest`
绑定容器的 8080 端口，并将其映射到本地主机 127.0.0.1 的 80 端口上。
`$docker run -p 127.0.0.1:80:8080/tcp ubuntu bash`
使用镜像nginx:latest以交互模式启动一**-n:** 显示最近N个容器；个容器,在容器内执行/bin/bash命令。
`docker run -it nginx:latest /bin/bash`
### 查看正在运行的容器
#### 基本语法
```shell
docker ps  [OPTIONS] 
```
#### OPTIONS说明：

- **-a :**当前正在运行的+历史运行过的；
- **-l:** 最近创建的容器ID；
- **-n:** 显示最近N个容器；
- **-q:** 静默模式，只显示容器Id
- -**-no -trunc**；不断输出
#### 退出容器
`exit` 容器停止推出
`ctrl+P+Q `容器不停止退出
#### 启动容器
```shell
docker start 容器名称或ID
```
#### 重启容器
```shell
docker restart 容器名称或ID
```
#### 停止容器
```shell
docker stop 容器名称或ID   （温柔）

docker kill 容器名称或ID   （强制停止）
```
#### 删除容器
```shell
docker rm 容器名称或ID
```
#### 一次性删除多个容器
```shell
docker rm  -f $(docker ps -a -q)
# 或
docker ps -a -q|xagrgs docker rm
```
查看容器内部的细节
```shell
docker inspect 容器ID或容器名
```
#### 查看容器的IP地址
```shell
docker inspect 容器ID或容器名 |grep "IPAddress"
```
#### 连接运行的容器并以命令行交互
```shell
docker exec -it 容器ID bashShell(shell命令)
```
#### 重新进入容器
```shell
docker attach 容器ID
```
**exec与 attach的区别**

- attach :直接进入容器，启动命令终端，不会启动新的进程
- exec：实在容器中打开新的终端，并且可以启动新的

