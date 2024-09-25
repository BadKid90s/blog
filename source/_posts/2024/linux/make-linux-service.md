---
title: 制作Linux服务
date: 2024-08-26 16:00:00
tags:
- SpringBoot
categories:
- Linux

cover: /post/2024/network/linux-setting-proxy/logo.jpg
---



# 把java程序作为Linux服务启动

# 制作Linux服务

## 创建服务文件

首先，您需要创建一个 `.service` 文件。通常，这些文件位于 `/etc/systemd/system/` 目录下。

## 编辑服务文件

```shell
[Unit]
Description=My Custom Service
After=network.target

[Service]
ExecStart=/usr/bin/my_executable
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

- **[Unit]** 部分定义了服务的描述和依赖关系。
- **[Service]** 部分定义了服务的执行命令（`ExecStart`），以及在失败时的重启策略。
- **[Install]** 部分定义了服务的目标

## 重新加载 systemd

在创建或修改 `.service` 文件后，您需要重新加载 `systemd` 以使更改生效：

```bash
sudo systemctl daemon-reload
```

## 启动和管理服务

您可以使用以下命令启动、停止和查看服务状态：

- 启动服务：

```bash
sudo systemctl start my_service
```

- 停止服务：

```bash
sudo systemctl stop my_service
```

- 查看服务状态：

```bash
sudo systemctl status my_service
```

- 设置服务开机自启：

```bash
sudo systemctl enable my_service
```

## 日志查看

您可以使用 `journalctl` 查看服务的日志：

```bash
journalctl -u my_service
```

## 示例

将 Spring Boot 程序安装为 Linux 服务

### 1. 打包 Spring Boot 应用

首先，确保您的 Spring Boot 应用已经打包为一个可执行的 JAR 文件。您可以使用 Maven 或 Gradle 来构建项目。例如，使用 Maven：

```bash
mvn clean package
```

构建完成后，您将在 `target` 目录下找到一个 `.jar` 文件。

### 2. 创建服务文件

接下来，您需要创建一个 `.service` 文件。通常，这些文件位于 `/etc/systemd/system/` 目录下。使用文本编辑器创建一个新的服务文件，例如 `my_springboot_app.service`：

```bash
sudo nano /etc/systemd/system/my_springboot_app.service
```

### 3. 编辑服务文件

在打开的编辑器中，添加以下内容：

```
ini复制代码[Unit]
Description=My Spring Boot Application
After=network.target

[Service]
User=your_username
ExecStart=/usr/bin/java -jar /path/to/your/app.jar
StandardOutput=append:/var/log/my_springboot_app.log
StandardError=append:/var/log/my_springboot_app.log
Restart=on-failure
Environment=JAVA_HOME=/path/to/java

[Install]
WantedBy=multi-user.target
```

- **User**: 替换为运行服务的用户。

- **ExecStart**: 替换为您的 JAR 文件的完整路径。

- **StandardOutput**: 标准输出流。

- **StandardError**: 标准错误输出流。

- **Environment**: 如果需要，您可以设置 JAVA_HOME 或其他环境变量。

  >`StandardOutput` 和 `StandardError` 参数中的路径如果不存在请提前创建！！！

### 4. 重新加载 systemd

在创建或修改 `.service` 文件后，您需要重新加载 `systemd` 以使更改生效：

```bash
sudo systemctl daemon-reload
```

### 5. 启动和管理服务

您可以使用以下命令启动、停止和查看服务状态：

- 启动服务：

```bash
sudo systemctl start my_springboot_app
```

- 停止服务：

```bash
sudo systemctl stop my_springboot_app
```

- 查看服务状态：

```bash
sudo systemctl status my_springboot_app
```

- 设置服务开机自启：

```bash
sudo systemctl enable my_springboot_app
```

### 6. 日志查看

您可以使用 `journalctl` 查看服务的日志：

```bash
journalctl -u my_springboot_app
```

您也可以入日志文件夹中查看服务的日志：

```bash
tail -f /var/log/my_springboot_app.log
```



### 注意事项

- 确保 JAR 文件具有适当的权限，并且可以被指定的用户执行。
- 如果您的应用需要特定的配置文件或环境变量，请在 `[Service]` 部分中添加相应的 `Environment` 行。
- 确保 Java 已安装并且路径正确。

通过这些步骤，您可以将 Spring Boot 应用安装为 Linux 服务，并在系统启动时自动运行。