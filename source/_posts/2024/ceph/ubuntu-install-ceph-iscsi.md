---
title: Ubuntu Install Ceph ISCSI
date: 2024-08-5 20:00:00
tags:
- Ceph
categories:
- 分布式存储
cover: /images/ceph/ceph2.png
---

# Ubuntu 在线安装 Ceph-ISCSI服务

## 前提

- 正常的Ceph集群环境
- 有`rbd`类型名称是`rbd`的存储池

## 添加源

拷贝以下内容到`/etc/apt/sources.list`

```shell
deb http://archive.ubuntu.com/ubuntu focal main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu focal-updates main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu focal-backports main restricted universe multiverse
deb http://security.ubuntu.com/ubuntu focal-security main restricted universe multiverse
```

或者执行以下命令

```shell
sudo printf '%s\n'  \
'deb http://archive.ubuntu.com/ubuntu focal main restricted universe multiverse' \
'deb http://archive.ubuntu.com/ubuntu focal-updates main restricted universe multiverse'  \
'deb http://archive.ubuntu.com/ubuntu focal-backports main restricted universe multiverse'  \
'deb http://security.ubuntu.com/ubuntu focal-security main restricted universe multiverse' \
| sudo tee -a /etc/apt/sources.list
```



# 更新源

```shell
sudo apt-get update
```



# 安装依赖

> 会自动安装其所需要的依赖包

```shell
sudo apt-get install -y ceph-iscsi
```

>查询此包的依赖包可访问 https://ubuntu.pkgs.org/20.04/ubuntu-universe-amd64/ceph-iscsi_3.4-0ubuntu2_all.deb.html
>
>[ceph-iscsi_3.4-0ubuntu2_all.deb Ubuntu 20.04 LTS Download (pkgs.org)](https://ubuntu.pkgs.org/20.04/ubuntu-universe-amd64/ceph-iscsi_3.4-0ubuntu2_all.deb.html)

# 添加配置文件

```
touch /etc/ceph/iscsi-gateway.cfg
```

```
[config]
# Name of the Ceph storage cluster. A suitable Ceph configuration file allowing
# access to the Ceph storage cluster from the gateway node is required, if not
# colocated on an OSD node.
cluster_name = ceph

# Place a copy of the ceph cluster's admin keyring in the gateway's /etc/ceph
# drectory and reference the filename here
gateway_keyring = ceph.client.admin.keyring


# API settings.
# The API supports a number of options that allow you to tailor it to your
# local environment. If you want to run the API under https, you will need to
# create cert/key files that are compatible for each iSCSI gateway node, that is
# not locked to a specific node. SSL cert and key files *must* be called
# 'iscsi-gateway.crt' and 'iscsi-gateway.key' and placed in the '/etc/ceph/' directory
# on *each* gateway node. With the SSL files in place, you can use 'api_secure = true'
# to switch to https mode.

# To support the API, the bear minimum settings are:
api_secure = false

# Additional API configuration options are as follows, defaults shown.
# api_user = admin
# api_password = admin
# api_port = 5001
# 修改IP为要装ISCSI服务的节点
trusted_ip_list = 10.20.41.91
```



# 启动服务

```shell
systemctl daemon-reload
systemctl enable rbd-target-gw
systemctl start rbd-target-gw
systemctl enable rbd-target-api
systemctl start rbd-target-api
```



## 查询状态检查是否正常启动

**查看状态**

```shell
systemctl status rbd-target-gw
```

**查看详细日志**

```shell
journalctl -u rbd-target-gw --no-pager
```



**查看状态**

```shell
systemctl status rbd-target-api
```

****查看详细日志****

```shell
journalctl -u rbd-target-api --no-pager
```



>ceph-iscsi的日志文件在`/var/log/rbd-target-api/` `/var/log/rbd-target-gw/` 目录下，
>
>详细日志也可以到这里查看！！！



## 错误解决

### 1.缺少配置文件

#### 错误日志

```
Aug 12 09:50:09 node3 rbd-target-api[741226]: Started Ceph iscsi target configuration API.
Aug 12 09:50:09 node3 rbd-target-api[741226]: Invaid cluster_client_name or setting in /etc/ceph/ceph.conf - [errno 2] RADOS object not found (error calling conf_read_file)
Aug 12 09:50:09 node3 rbd-target-api[741226]: Unable to open/read the configuration object
Aug 12 09:50:09 node3 systemd[1]: rbd-target-api.service: Main process exited, code=exited, status=16/n/a
Aug 12 09:50:09 node3 systemd[1]: rbd-target-api.service: Failed with result 'exit-code'.
```

#### 原因

缺少配置文件`/etc/ceph/ceph.conf`

#### 解决方案

从主节点拷贝`/etc/ceph/ceph.conf`到安装目录

>
>
>正确的配置目录结构是
>
>```shell
>root@node3:/etc/ceph# ls -l /etc/ceph/
>total 16
>-rw------- 1 root root   63 Aug 12 09:43 ceph.client.admin.keyring
>-rw-r--r-- 1 root root  868 Aug 12 09:51 ceph.conf
>-rw-r--r-- 1 root root 1156 Aug 12 09:49 iscsi-gateway.cfg
>```
>
>



### 2.启动太频繁

#### 错误日志

```shell
root@node3:/etc/ceph# systemctl status rbd-target-api.service
● rbd-target-api.service - Ceph iscsi target configuration API
     Loaded: loaded (/lib/systemd/system/rbd-target-api.service; disabled; vendor preset: enabled)
     Active: failed (Result: exit-code) since Mon 2024-08-12 09:50:09 UTC; 7min ago
   Main PID: 741226 (code=exited, status=16)

Aug 12 09:54:19 node3 systemd[1]: Failed to start Ceph iscsi target configuration API.
Aug 12 09:55:36 node3 systemd[1]: rbd-target-api.service: Start request repeated too quickly.
Aug 12 09:55:36 node3 systemd[1]: rbd-target-api.service: Failed with result 'exit-code'.
Aug 12 09:55:36 node3 systemd[1]: Failed to start Ceph iscsi target configuration API.
Aug 12 09:55:44 node3 systemd[1]: rbd-target-api.service: Start request repeated too quickly.
Aug 12 09:55:44 node3 systemd[1]: rbd-target-api.service: Failed with result 'exit-code'.
Aug 12 09:55:44 node3 systemd[1]: Failed to start Ceph iscsi target configuration API.
Aug 12 09:57:01 node3 systemd[1]: rbd-target-api.service: Start request repeated too quickly.
Aug 12 09:57:01 node3 systemd[1]: rbd-target-api.service: Failed with result 'exit-code'.
Aug 12 09:57:01 node3 systemd[1]: Failed to start Ceph iscsi target configuration API.
```

#### 原因

启动太频繁

#### 解决方案

先关闭系统启动时自动启动 `rbd-target-api` 服务

```shell
systemctl disable rbd-target-api
```

再尝试启动

```shell
systemctl start rbd-target-api
```

```shell
root@node3:/etc/ceph# systemctl start rbd-target-api
root@node3:/etc/ceph# systemctl status rbd-target-api.service
● rbd-target-api.service - Ceph iscsi target configuration API
     Loaded: loaded (/lib/systemd/system/rbd-target-api.service; disabled; vendor preset: enabled)
     Active: active (running) since Mon 2024-08-12 09:58:04 UTC; 7s ago
   Main PID: 744312 (rbd-target-api)
      Tasks: 26 (limit: 19066)
     Memory: 42.7M
     CGroup: /system.slice/rbd-target-api.service
             └─744312 /usr/bin/python3 /usr/bin/rbd-target-api

Aug 12 09:58:06 node3 rbd-target-api[744312]: Checking for config object changes every 1s
Aug 12 09:58:06 node3 rbd-target-api[744312]: Processing osd blacklist entries for this node
Aug 12 09:58:07 node3 rbd-target-api[744312]: Reading the configuration object to update local LIO configuration
Aug 12 09:58:07 node3 rbd-target-api[744312]: Configuration does not have an entry for this host(node3) - nothing to define to LIO
Aug 12 09:58:07 node3 rbd-target-api[744312]:  * Serving Flask app "rbd-target-api" (lazy loading)
Aug 12 09:58:07 node3 rbd-target-api[744312]:  * Environment: production
Aug 12 09:58:07 node3 rbd-target-api[744312]:    WARNING: This is a development server. Do not use it in a production deployment.
Aug 12 09:58:07 node3 rbd-target-api[744312]:    Use a production WSGI server instead.
Aug 12 09:58:07 node3 rbd-target-api[744312]:  * Debug mode: off
Aug 12 09:58:07 node3 rbd-target-api[744312]:  * Running on http://[::]:5000/ (Press CTRL+C to quit)
```

恢复开机启动

```shell
systemctl enable rbd-target-api
```



### 3.删除黑名单失败

#### 错误日志

```shell
Aug 09 09:52:49 node1 systemd[1]: Started Ceph iscsi target configuration API.
Aug 09 09:52:50 node1 rbd-target-api[43659]: Started the configuration object watcher
Aug 09 09:52:50 node1 rbd-target-api[43659]: Checking for config object changes every 1s
Aug 09 09:52:50 node1 rbd-target-api[43659]: Processing osd blacklist entries for this node
Aug 09 09:52:51 node1 rbd-target-api[43659]: Removing blacklisted entry for this host : 10.20.41.91:0/3374673318
Aug 09 09:52:53 node1 rbd-target-api[43659]: blacklist removal failed. Run 'ceph -n client.admin --conf /etc/ceph/ceph.conf osd blacklist rm 10.20.41.91:0/3374673318'
Aug 09 09:52:54 node1 systemd[1]: rbd-target-api.service: Main process exited, code=exited, status=16/n/a
Aug 09 09:52:54 node1 systemd[1]: rbd-target-api.service: Failed with result 'exit-code'.

```

#### 原因

删除黑名单失败

#### 解决方案

在`ceph`客户端中执行`osd blacklist ls`查看黑名单列表

```shell
root@node1:/etc/ceph# ceph
ceph>  osd blacklist ls
listed 4 entries
10.20.41.91:6801/984155830 2024-08-12T22:28:10.684517+0000
10.20.41.91:0/3546845001 2024-08-12T22:28:10.684517+0000
10.20.41.91:0/3099014955 2024-08-12T22:28:10.684517+0000
10.20.41.91:6800/984155830 2024-08-12T22:28:10.684517+0000

```

手动删除黑名单

```shell
ceph>  osd blacklist rm 10.20.41.91:6801/984155830
un-blocklisting 10.20.41.91:6801/984155830
```

再次查看

```shell
ceph>  osd blacklist ls
listed 0 entries
```

重新启动



# ISCSI命令行工具

>要重新打开终端才会生效哦（天坑）

```shell
gwcli
```

```
root@node1:/etc/ceph# gwcli
/> ls
o- / .............................................................................................. [...]
  o- cluster .............................................................................. [Clusters: 1]
  | o- ceph ................................................................................. [HEALTH_OK]
  |   o- pools ............................................................................... [Pools: 3]
  |   | o- device_health_metrics ..................... [(x3), Commit: 0.00Y/198574144K (0%), Used: 0.00Y]
  |   | o- rbd ......................................... [(x3), Commit: 0.00Y/198574144K (0%), Used: 12K]
  |   | o- rbd-pool ................................. [(x3), Commit: 0.00Y/198574144K (0%), Used: 41594b]
  |   o- topology ..................................................................... [OSDs: 6,MONs: 1]
  o- disks ............................................................................ [0.00Y, Disks: 0]
  o- iscsi-targets .................................................... [DiscoveryAuth: None, Targets: 0]
/> exit
```

