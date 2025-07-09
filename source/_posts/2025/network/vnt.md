---
title: 完全免费的P2P异地组网工具
date: 2025-07-07 17:30:00
tags:
  - network
categories:
  - VPN
cover: /post/2025/network/vnt/logo.png
---


# [VNT介绍](https://rustvnt.com/guide/introduction.html#介绍)

将异地组网变成一个简单的事，轻松应对自建内网服务、联机游戏、点对点&网对网等场景

## [特点](https://rustvnt.com/guide/introduction.html#特点)

- **高性能**: 使用rust开发，内存和CPU占用率低，速度快
- **跨平台**: 支持Windows/MacOS/Linux/Android
- **和WireGuard互通**: 能使用WireGuard接入VNT网络，iOS可以使用这种方式接入
- **穿透多层NAT**: 多种打洞策略，轻松穿透锥形网络，遇到对称网络也有一战之力
- **应对运营商QOS**: 多通道UDP，能有效减缓UDP QOS
- **支持UDP/TCP/WebSocket等协议**: 遭遇UDP丢包严重的时候，总有一个协议适合你
- **ipv4/ipv6双协议栈**: 可以使用ipv6连接网络
- **域名解析优化**: 可以利用txt记录解析动态公网IP、动态公网端口，家庭宽带也能轻松自建服务器
- **安全**: 支持AES-GCM、CHACHA20-POLY1305等多种加密算法，端到端加密保证数据安全
- **优化广播**: 自适应的点对点广播，降低延迟的同时减少服务器的压力，适合广播/组播游戏
- **数据压缩**: 可开启数据压缩减少网络压力

## [开源地址](https://rustvnt.com/guide/introduction.html#开源地址)

- **主程序**：https://github.com/vnt-dev/vnt
- **中继服务程序**： https://github.com/vnt-dev/vnts
- **用户界面程序**：https://github.com/vnt-dev/VntApp

## 组网场景

![vnt组网.drawio](vnt组网.drawio.png)

**现状：**

- 局域网A与局域网B是物理相互独立的两个局域网。
- 设备B、C、D都是局域网B中的设备没有公网IPV4和IPV6。

**目标：**

- 设备A可以访问局域网B中的任意一台机器。

## 客户机配置

### 1.下载二进制文件

- 下载vnt 二进制文件

下载地址：[https://github.com/vnt-dev/vnt/releases](https://github.com/vnt-dev/vnt/releases)

> 我的客户机是Windows系统，x86 架构，所以我下载[vnt-x86_64-pc-windows-msvc-v1.2.16.tar.gz](https://github.com/vnt-dev/vnt/releases/download/v1.2.16/vnt-x86_64-pc-windows-msvc-v1.2.16.tar.gz)

- 下载NSSM 服务注册Windows 系统服务，解压后找到对应系统的文件。

[http://nssm.cc/download](http://nssm.cc/download)

### 2.创建配置文件

config.yaml

```
tap: false #是否使用tap 仅在windows上支持使用tap
token: xxx #组网token
device_id: Windows #当前设备id
name: Windows22 #当前设备名称
server_address: vnt.wherewego.top:29872 #注册和中继服务器
in_ips: #代理ip入站
  - 10.20.40.0/23,10.26.0.21
#password: xxxx #密码
mtu: 1420  #mtu
tcp: false #tcp模式
ip: 10.26.0.22 #指定虚拟ip
use_channel: p2p #relay:仅中继模式.p2p:仅直连模式
server_encrypt: true #服务端加密
parallel: 1 #任务并行度
cipher_model: aes_gcm #客户端加密算法
finger: false #关闭数据指纹
punch_model: ipv4 #打洞模式，表示只使用ipv4地址打洞，默认会同时使用v6和v4
ports:
  - 0 #使用随机端口，tcp监听此端口
  - 0
cmd: false #关闭控制台输入
no_proxy: true #是否关闭内置代理，true为关闭
first_latency: false #是否优先低延迟通道，默认为false，表示优先使用p2p通道
device_name: vnt-tun #网卡名称
packet_loss: 0 #指定丢包率 取值0~1之间的数 用于模拟弱网
packet_delay: 0 #指定延迟 单位毫秒 用于模拟弱网
dns:
  - 223.5.5.5 # 首选dns
  - 8.8.8.8 # 备选dns
disable_stats: false # 为true表示关闭统计
allow_wire_guard: false # 为true则表示允许接入wg
```

参考文档：[vnt/vnt-cli/README.md at main · vnt-dev/vnt](https://github.com/vnt-dev/vnt/blob/main/vnt-cli/README.md)

>中继服务器我使用的是社区公益服务器。
>
>[可使用社区服务器](https://rustvnt.com/guide/server.html#可使用社区服务器)

### 3.注册为系统服务

我的安装路径在`D:\Program\vnt`,所有配置都存放此目录。

```
# 安装服务
nssm install vnt "D:\Program\vnt\vnt-cli.exe" "-f config.yaml"

# 设置工作目录
nssm set vnt AppDirectory "D:\Program\vnt"

# 设置启动类型（自动-延时启动）
nssm set vnt Start SERVICE_DELAYED_AUTO_START

# 启动服务
nssm start vnt
```

>必须以超级管理员身份运行CMD，执行上述命令。

- 卸载服务

```
nssm stop vnt
nssm remove vnt confirm
```

### 4.检查连接状态

```
D:\Program\vnt>vnt-cli.exe --info
```

期望输出：

```
Name: Windows22
Virtual ip: 10.26.0.22
Virtual gateway: 10.26.0.1
Virtual netmask: 255.255.255.0
Connection status: Connected
NAT type: Symmetric
Relay server: 8.134.146.7:29872
Udp listen: 0.0.0.0:xxxx, 0.0.0.0:xxxx
Tcp listen: 0.0.0.0:xxxx
Public ips: xx.xx.xx.xx
Local addr: xx.xx.xx.xx
IPv6: None
------------------------------------------
IP forwarding 1
  -- 10.26.0.21 --> 10.20.40.0/23
```



## 代理机配置

### 1.下载二进制文件

下载地址：[https://github.com/vnt-dev/vnt/releases](https://github.com/vnt-dev/vnt/releases)

> 我的代理机是Ubuntu 系统，x86 架构，所以我下载[vnt-x86_64-unknown-linux-musl-v1.2.16.tar.gz](https://github.com/vnt-dev/vnt/releases/download/v1.2.16/vnt-x86_64-unknown-linux-musl-v1.2.16.tar.gz)

或者使用wget命令下载

```sh
wget https://github.com/vnt-dev/vnt/releases/download/v1.2.16/vnt-x86_64-unknown-linux-musl-v1.2.16.tar.gz
```

### 2.解压二进制

创建应用程序目录

```
mkdir /opt/vnt
```

解压文件

```
tar -zxvf vnt-x86_64-unknown-linux-musl-v1.2.16.tar.gz  -C /opt/vnt/
```

### 3.创建配置文件

```yaml
vim  /opt/vnt/config.yaml
```

配置内容

```yaml
tap: false #是否使用tap 仅在windows上支持使用tap
token: xxx #组网token
device_id: ubuntu #当前设备id
name: Ubuntu 21 #当前设备名称
server_address: vnt.wherewego.top:29872 #注册和中继服务器
out_ips: #代理ip出站
  - 0.0.0.0/0
#password: xxxx #密码
mtu: 1420  #mtu
tcp: false #tcp模式
ip: 10.26.0.21 #指定虚拟ip
use_channel: p2p #relay:仅中继模式.p2p:仅直连模式
server_encrypt: true #服务端加密
parallel: 1 #任务并行度
cipher_model: aes_gcm #客户端加密算法
finger: false #关闭数据指纹
punch_model: ipv4 #打洞模式，表示只使用ipv4地址打洞，默认会同时使用v6和v4
ports:
  - 0 #使用随机端口，tcp监听此端口
  - 0
cmd: false #关闭控制台输入
no_proxy: true #是否关闭内置代理，true为关闭
first_latency: false #是否优先低延迟通道，默认为false，表示优先使用p2p通道
device_name: vnt-tun #网卡名称
packet_loss: 0 #指定丢包率 取值0~1之间的数 用于模拟弱网
packet_delay: 0 #指定延迟 单位毫秒 用于模拟弱网
dns:
  - 223.5.5.5 # 首选dns
  - 8.8.8.8 # 备选dns
disable_stats: false # 为true表示关闭统计
allow_wire_guard: false # 为true则表示允许接入wg

```

参考文档：[vnt/vnt-cli/README.md at main · vnt-dev/vnt](https://github.com/vnt-dev/vnt/blob/main/vnt-cli/README.md)

>中继服务器我使用的是社区公益服务器。
>
>[可使用社区服务器](https://rustvnt.com/guide/server.html#可使用社区服务器)

**开启IP转发**

```
 sudo nano /etc/sysctl.conf
```

取消注释或添加：

```
net.ipv4.ip_forward=1
```

配置环境变量

```
# 隧道接口名称
TUN_IF=vnt-tun

# 局域网接口（客户端要访问的目标内网）
LAN_IF=ens192

# 用于 NAT 的接口（通常是能访问公网的网卡）
NAT_IF=ens160

# 隧道分配的子网
TUN_SUBNET=10.26.0.0/24
```

> 由于我的局域网B是包含2个网段的。
>
> ens192网卡是10.20.40.0/23，无法访问外网。
>
> ens160网卡是192.168.0.0/32，具有范围外网的权限。
>
> 所以在配置iptables时要进行区分，否则可能导致无法实现点对网的代理模式。

### 4.创建服务文件

```
vim /etc/systemd/system/vnt.service
```

配置如下：

```
[Unit]
Description = vntserver
After = network.target syslog.target
Wants = network.target

[Service]
Type = simple
User=root

# 设置默认环境变量
EnvironmentFile=/opt/vnt/vntserver
# 启动命令
ExecStart = /opt/vnt/vnt-cli -f /opt/vnt/vntc.yaml
# 允许从隧道接口入站
ExecStartPost = /sbin/iptables -I INPUT -i ${TUN_IF} -j ACCEPT
# 允许客户端之间通信
ExecStartPost = /sbin/iptables -I FORWARD -i ${TUN_IF} -o ${TUN_IF} -j ACCEPT
# 允许从隧道接口转发到局域网接口
ExecStartPost = /sbin/iptables -I FORWARD -i ${TUN_IF} -o ${LAN_IF} -j ACCEPT
# 允许已建立连接的回程流量
ExecStartPost = /sbin/iptables -I FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
# 启用 MASQUERADE/NAT（根据需要选择 LAN_IF 或 WAN_IF）
ExecStartPost = /sbin/iptables -t nat -I POSTROUTING -o ${NAT_IF} -s ${TUN_SUBNET} -j MASQUERADE

# 停止时删除规则
ExecStopPost = /sbin/iptables -D INPUT -i ${TUN_IF} -j ACCEPT
ExecStopPost = /sbin/iptables -D FORWARD -i ${TUN_IF} -o ${TUN_IF} -j ACCEPT
ExecStopPost = /sbin/iptables -D FORWARD -i ${TUN_IF} -o ${LAN_IF} -j ACCEPT
ExecStopPost = /sbin/iptables -D FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
ExecStopPost = /sbin/iptables -t nat -D POSTROUTING -o ${NAT_IF} -s ${TUN_SUBNET} -j MASQUERADE

Restart = on-failure
RestartSec = 5s

[Install]
WantedBy = multi-user.target
```

### 5.启动服务

```
systemctl daemon-reload

systemctl enable vnt.service

systemctl start vnt.service
```

### 6.检查连接状态

```
cd /opt/vnt/ && ./vnt-cli --info
```

期望输出：

```
Name: Ubuntu 21
Virtual ip: 10.26.0.21
Virtual gateway: 10.26.0.1
Virtual netmask: 255.255.255.0
Connection status: Connected
NAT type: Cone
Relay server: 198.18.0.104:29872
Udp listen: 0.0.0.0:xxxx, 0.0.0.0:xxxx
Tcp listen: 0.0.0.0:xxxx
Public ips: xx.xx.xx.xx
Local addr: xx.xx.xx.xx
IPv6: None
------------------------------------------
Allows network 1
  0.0.0.0/0
```



## 检查上线的节点

```
D:\Program\vnt>vnt-cli.exe --list
```

```
D:\Program\vnt>vnt-cli --list
Name              Virtual Ip    Status     P2P/Relay    Rt
Ubuntu 21         10.26.0.21    Online     p2p          21
```

## 联调网络

```
D:\Program\vnt>ping 10.20.40.3

正在 Ping 10.20.40.3 具有 32 字节的数据:
来自 10.20.40.3 的回复: 字节=32 时间=22ms TTL=254
来自 10.20.40.3 的回复: 字节=32 时间=20ms TTL=254
来自 10.20.40.3 的回复: 字节=32 时间=20ms TTL=254
来自 10.20.40.3 的回复: 字节=32 时间=20ms TTL=254

10.20.40.3 的 Ping 统计信息:
    数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 20ms，最长 = 22ms，平均 = 20ms
```

```
D:\Program\vnt>ping 10.20.41.21

正在 Ping 10.20.41.21 具有 32 字节的数据:
来自 10.20.41.21 的回复: 字节=32 时间=15ms TTL=64
来自 10.20.41.21 的回复: 字节=32 时间=15ms TTL=64
来自 10.20.41.21 的回复: 字节=32 时间=19ms TTL=64
来自 10.20.41.21 的回复: 字节=32 时间=16ms TTL=64

10.20.41.21 的 Ping 统计信息:
    数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 15ms，最长 = 19ms，平均 = 16ms
```

