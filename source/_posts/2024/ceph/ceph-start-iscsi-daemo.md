---
title: Ceph Start ISCSI Daemon
date: 2024-08-17 16:50:18
tags:
- Ceph
categories:
- 分布式存储
cover: /images/ceph/ceph.png

---

# Ceph Start ISCSI Deamon

# 查文档

## 查看`ceph orch`命令的帮助文档

```shell
ceph orch --help
```

查询到有关`ISCSI`的命令：

```shell
orch apply iscsi <pool> <api_user> <api_password>          Scale an iSCSI service
 [<trusted_ip_list>] [<placement>] [--unmanaged] [--dry-   
 run] [--format {plain|json|json-pretty|yaml|xml-pretty|   
 xml}] [--no-overwrite] 
 
orch daemon add iscsi <pool> <api_user> <api_password>     Start iscsi daemon(s)
 [<trusted_ip_list>] [<placement>]   
 
orch daemon rm <names>... [--force]                        Remove specific daemon(s)

orch daemon start|stop|restart|reconfig <name>             Start, stop, restart, (redeploy,) or reconfig a specific 
                                                            daemon                                                            
orch rm <service_name> [--force]                           Remove a service
```

## 红帽文档

[第 12 章 使用 Ceph Orchestrator（有限可用性）管理 iSCSI 网关 | Red Hat Product Documentation](https://docs.redhat.com/zh_hans/documentation/red_hat_ceph_storage/5/html/operations_guide/management-of-iscsi-gateway-using-the-ceph-orchestrator)

# 部署ISCSI

## **先决条件**

- 一个正在运行的  Ceph Storage 集群。
- 主机添加到集群中。
- 部署所有管理器、监控器和 OSD 守护进程。



## 创建池

**语法**

```none
ceph osd pool create POOL_NAME
```

**示例**

```none
ceph osd pool create mypool
```

## 使用命令行界面部署 iSCSI 网关

**语法**

```none
orch apply iscsi <pool> <api_user> <api_password> [<trusted_ip_list>] [<placement>] [--unmanaged] 
[--dry-run] [--format {plain|json|json-pretty|yaml|xml-pretty| xml}] [--no-overwrite] 
```

**示例**

```none
ceph orch apply iscsi mypool admin admin --placement="1 host01"
```

**验证**

- 列出服务：

  **示例**

  ```none
  ceph orch ls
  ```



## 使用服务规格部署 iSCSI 网关

### 创建 `iscsi.yml` 配置文件

**示例**

```none
touch iscsi.yml
```

**编辑 `iscsi.yml` 文件，使其包含以下详情：**

**语法**

```none
service_type: iscsi
service_id: iscsi
placement:
  hosts:
    - HOST_NAME_1
    - HOST_NAME_2
spec:
  pool: POOL_NAME  # RADOS pool where ceph-iscsi config data is stored.
  trusted_ip_list: "IP_ADDRESS_1,IP_ADDRESS_2" # optional
  api_port: ... # optional
  api_user: API_USERNAME # optional
  api_password: API_PASSWORD # optional
  api_secure: true/false # optional
  ssl_cert: | # optional
  ...
  ssl_key: | # optional
  ...
```

**示例**

```none
service_type: iscsi
service_id: iscsi
placement:
  hosts:
    - host01
spec:
  pool: mypool
```

1. **示例**

   ```none
   cephadm shell --mount iscsi.yaml:/var/lib/ceph/iscsi.yaml
   ```

2. 进入以下目录：

   **语法**

   ```none
   cd /var/lib/ceph/DAEMON_PATH/
   ```

   **示例**

   ```none
   cd /var/lib/ceph/
   ```

3. 使用服务规格部署 iSCSI 网关：

   **语法**

   ```none
   ceph orch apply -i FILE_NAME.yml
   ```

   **示例**

   ```none
   ceph orch apply -i iscsi.yml
   ```

**验证**

- 列出服务：

  **示例**

  ```none
  ceph orch ls
  ```



# 状态查询

## 列出主机、守护进程和进程：

**语法**

```none
ceph orch ps --daemon_type=DAEMON_NAME
```

**示例**

```none
ceph orch ps --daemon_type=iscsi
```

# 启动、停止、重启、删除 ISCSI 网关中的某个进程

## 语法

```none
orch daemon start|stop|restart|reconfig <name> 
```

### 先查看进程名称

```shell
ceph orch ps --daemon_type=iscsi
```

输出结果：

```shell
NAME                         HOST   PORTS   STATUS         REFRESHED  AGE  MEM USE  MEM LIM  VERSION  IMAGE ID      CONTAINER ID  
iscsi.rbd-pool.node2.aaplvm  node2  *:5000  running (56s)    48s ago  57s    68.2M        -  3.6      4e09faf6bcb2  a11b84946e58  
iscsi.rbd-pool.node3.nmhnko  node3  *:5000  running (59s)    50s ago  60s    45.2M        -  3.6      4e09faf6bcb2  ea84ff4efed7 
```



## 启动

```none
ceph orch daemon start iscsi.rbd-pool.node2.aaplvm
```

## 停止

```none
ceph orch daemon stop iscsi.rbd-pool.node2.aaplvm
```

## 重启

```none
ceph orch daemon restart iscsi.rbd-pool.node2.aaplvm
```

## 删除

```shell
ceph orch daemon rm iscsi.rbd-pool.node2.aaplvm
```

输出结果：

```shell
Removed iscsi.rbd-pool.node2.aaplvm from host 'node2'
```

# 删除 ISCSI 网关

>您可以使用 `ceph 或ch rm` 命令删除 ISCSI 网关守护进程。

## 列出服务：

**示例**

```none
ceph orch ls
```

## 删除服务

**语法**

```none
ceph orch rm SERVICE_NAME
```

**示例**

```none
ceph orch rm iscsi.iscsi
```

## 验证

列出主机、守护进程和进程：

**语法**

```none
ceph orch ps
```

**示例**

```none
ceph orch ps
```