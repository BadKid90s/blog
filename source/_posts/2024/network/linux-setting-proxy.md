---
title: Linux Setting Proxy
date: 2024-08-26 16:00:00
tags:
- proxy
- linux
categories:
- 网络

cover: /post/2024/network/linux-setting-proxy/logo.jpg
---


# 下载安装包

[GitHub网址](https://github.com/MetaCubeX/mihomo): `https://github.com/MetaCubeX/mihomo`

[安装包下载](https://github.com/MetaCubeX/mihomo/releases):  `https://github.com/MetaCubeX/mihomo/releases`

[参考文档](https://wiki.metacubex.one/): `https://wiki.metacubex.one/`

Web面板：

- [yacd](https://yacd.haishan.me/) `https://yacd.haishan.me/`
- [Metacubexd](https://metacubex.github.io/metacubexd) `https://metacubex.github.io/metacubexd`



# Ubuntu 安装



## 下载安装包

```shell
wget https://github.com/MetaCubeX/mihomo/releases/download/v1.18.7/mihomo-linux-amd64-v1.18.7.deb
```

## 安装

```shell
dpkg -i ./mihomo-linux-amd64-v1.18.7.deb
```

## 启动

```shell
 systemctl daemon-reload  &&  systemctl start mihomo
```

## 状态

```shell
 systemctl status mihomo
```



## 配置订阅

```shell
curl -L -o /etc/mihomo/config.yaml -A "clash" <SUB_URL>
```

><SUB_URL> ：自行替换 SUB_URL 为机场给到的订阅地址

### 定时从网络更新配置文件

```shell
sudo crontab -e
```

如果你第一次使用 crontab，会让你选择编辑器，我选择 VI。进入定时任务配置文件，按 i 进入编辑状态，新起一行（可以是文件头部）输入：

```shell
0 4 * * * curl -L -o /etc/mihomo/config.yaml -A "clash"  <SUB_URL>; systemctl reload mihomo
```

>以上配置的意思是：在每天夜里 4 点从 SUB_URL 更新订阅配置，配置保存在 /etc/mihomo/config 中，更新完成后重载 mihomo 服务。记得自行替换 SUB_URL 为机场给到的订阅地址。



# Web页面监控

![image-20240823155227838](image-20240823155227838.png)

>
>
>后端地址在`/etc/mihomo/config.yaml` 文件
>
>external-controller: 127.0.0.1:9090 # 外部控制器，可以使用 RESTful API 来控制你的 Clash 内核；API 监听地址，你可以将 127.0.0.1 修改为 0.0.0.0 来监听所有 IP；访问地址：http://127.0.0.1:9090
>
>secret: "" # API 的访问密钥



## 配置文件说明

[Mihomo/config.yaml ](https://github.com/huLter/Mihomo/blob/main/config.yaml) ：`https://github.com/huLter/Mihomo/blob/main/config.yaml`



## 查询订阅规则

https://metacubex.github.io/metacubexd

![image-20240823155703014](image-20240823155703014.png)

**请修改安全策略**

![image-20240823155905892](image-20240823155905892.png)



![image-20240823160000756](image-20240823160000756.png)



![image-20240823160035448](image-20240823160035448.png)



# 配置使用

>[在 Ubuntu 中设置全局 Proxy](https://ouch1978.github.io/docs/containerization/linux-cheatsheet/set-system-proxy-on-ubuntu)
>
>https://ouch1978.github.io/docs/containerization/linux-cheatsheet/set-system-proxy-on-ubuntu



## 编辑` /etc/environment` (https://ouch1978.github.io/docs/containerization/linux-cheatsheet/set-system-proxy-on-ubuntu)

## 编辑 /etc/environment 文件

在 Console 输入下列命令通过 nano 来编辑 /etc/environment 文件，来把 Proxy 相关设置写入环境变量：

```sh
sudo nano /etc/environment
```

接着在里面加上下列内容：

`/etc/environment`

```toml
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games"

http_proxy="http://account:password@192.168.178.2:8080/"
https_proxy="http://account:password@192.168.178.2:8080/"
ftp_proxy="http://account:password@192.168.178.2:8080/"
no_prxoy="127.0.0.1,localhost"
```

>注意
>
>1. 请自行将上面示例的帐号、密码、IP 和 Port 替换为你的 Proxy 的设定。
>2. 完成之后，请重新登录让 Ubuntu 自动读取环境变量。

我们也可以通过下面这个命令来确认加入的值是不是有生效：

```sh
sudo env | grep proxy
```

没意外的话，应该大部分通过系统来访问网络的软件就都能上网啰。



## 查询代理日志

![image-20240823160633739](image-20240823160633739.png)