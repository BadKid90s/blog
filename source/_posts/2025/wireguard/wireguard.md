---
title: 搭建异地组网
date: 2025-01-05 17:30:00
tags:
- wireguard
categories:
- VPN
cover: /post/2025/wireguard/wireguard/logo.png

---


## 前提

需要公网服务器做中转。

## 服务端

> 使用Docker部署

### docker-compose

```yaml
services:
  wireguard:
    image: linuxserver/wireguard:latest
    container_name: wireguard
    cap_add:
      - NET_ADMIN
    volumes:
      - ./config:/config
    ports:
      - "5000:5000"
      - "51820:51820/udp"
    restart: unless-stopped

  wireguard-ui:
    image: ngoduykhanh/wireguard-ui:latest
    container_name: wireguard-ui
    depends_on:
      - wireguard
    cap_add:
      - NET_ADMIN
    # use the network of the 'wireguard' service. this enables to show active clients in the status page
    network_mode: service:wireguard
    environment:
      - SENDGRID_API_KEY
      - EMAIL_FROM_ADDRESS
      - EMAIL_FROM_NAME
      - SESSION_SECRET
      - WGUI_USERNAME=admin
      - WGUI_PASSWORD=admin
      - WG_CONF_TEMPLATE
      - WGUI_MANAGE_START=true
      - WGUI_MANAGE_RESTART=true
      - SUBNET_RANGES=SR2:8.8.0.0/24
    logging:
      driver: json-file
      options:
        max-size: 50m
    volumes:
      - ./db:/app/db
      - ./config:/etc/wireguard
    restart: unless-stopped
```

### wireguard-ui

http://ip:5000/



### 服务端配置

`MAIN` -> `Wireguard Server` 



**Server Interface Addresses**:  服务接口地址，一般是组网的访问

> 默认是`10.252.1.0/25`,可根据实际情况进行修改。



**Listen Port** ： 监听端口

>默认是`51820`，UDP协议



**Post Up Script** : 启动后执行的脚本

```bash
iptables -A FORWARD -i %1 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth+ -j MASQUERADE
```



**Pre Down Script**： 关闭前执行的脚本

>不填写



**Post Down Script**： 关闭后执行的脚本

```bash
iptables -D FORWARD -i %1 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth+ -j MASQUERADE
```



修改完成后点击保存✅



### 创建客户端

`MAIN` -> `Wireguard Clients` -> `New Client` -> `Save` -> `Apply Config`



 ![image-20250105164352429](image-20250105164352429.png)



![image-20250105164822526](image-20250105164822526.png)



## 客户端

https://www.wireguard.com/install/



![image-20250105170821376](image-20250105170821376.png)



https://github.com/WireGuard



![image-20250105170115079](image-20250105170115079.png)

### Windows

https://download.wireguard.com/windows-client/wireguard-installer.exe



### Linux

```sh
# wg-quick命令
wg-quick up wg0  #启动服务
wg-quick down wg0 #停止服务
wg-quick strip wg0 #查看配置
wg-quick #查看所有支持的命令
```

#### Ubuntu 

```sh
# 更新软件包
apt update 

# 安装依赖
apt install wireguard resolvconf -y

# 进入配置目录
cd /etc/

# 编辑配置文件，内容为实际客户端配置
vim wg0.conf

# 文件夹给予权限
chmod 0777 /etc/wireguard

# 设置开机启动
systemctl enable wg-quick@wg0

# 启动服务
systemctl start wg-quick@wg0

```

### MacOS

1. 无美区ID

```sh
# 在线安装wireguard软，提前要安装：brew
sudo brew install wireguard-tools

# 创建文件夹 (以管理员身份)
sudo mkdir /etc/wireguard

# 设置文件夹权限 (以管理员身份)
sudo chmod 777  /etc/wireguard

# 切入到创建的目录下
cd /etc/wireguard


# 创建虚拟网卡配置文件
touch wg0.conf

# 编辑虚拟网卡配置文件内容
vim wg0.conf
```

在wg0.conf文件中写入如下内容，需要注意的是，需要自己修改文件内容，保持可用。

```conf
[Interface]
Address = 10.10.10.8/32
PrivateKey = 客户端的私钥（刚刚生成的privatekey文件的内容）
DNS = 114.114.114.114

[Peer]
PublicKey = 服务器的公钥(需要去服务器查看服务器的公钥)
Endpoint = 服务器的物理ip地址:51820
AllowedIPs = 10.10.10.0/24
PersistentKeepalive = 21

```

启动客户端的网卡

```sh
# 启动网卡
wg-quick up wg0
```

```sh

# wg-quick命令
wg-quick up wg0  #启动服务
wg-quick down wg0 #停止服务
wg-quick strip wg0 #查看配置
wg-quick #查看所有支持的命令
```





2. 使用美区ID登录App Store，搜索 `Wireguard`,使用方式如`Windows`![image-20250105165412539](image-20250105165412539.png)
