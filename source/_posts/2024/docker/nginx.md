---
title: Nginx配置使用环境变量
date: 2024-11-01 16:00:00
tags:
- nginx
- docker
categories:
- Nginx

cover: /post/2024/docker/nginx/logo.jpg
---



# 在使用docker-compose建立nginx时，使用环境变量的方法

在使用docker-compose部署nginx时，我们将解释如何在conf文件中使用环境变量的方法。请注意，由于不同于1.19版本之前和之后的nginx版本有所不同，请注意这一点。

## 使用最新版本的nginx（1.19或更高）

您可以使用官方支持的方法来自1.19版本开始。
以以下docker-compose.yml为例。

```
version: "3"
services:
  nginx_service:
    container_name: nginx
    image: nginx:1.19-alpine
    volumes:
      - ./templates:/etc/nginx/templates
    environment:
      - PORT=8080
    ports:
      - 3000:8080
```

默认情况下，容器会加载/etc/nginx/templates/*.template文件，并将设置了环境变量的结果输出到/etc/nginx/conf.d目录下。

例如，我们准备好了一个名为default.conf.template的文件，并将其配置如下。

```
server {
  server_name         localhost;
  listen              ${PORT};
}
```

执行”docker-compose up –build”命令后，上述文件将被挂载到容器内的”/etc/nginx/templates”目录中。

在容器的/etc/nginx/conf.d文件夹中可以确认到输出了设置了环境变量的文件。

```
server {
  server_name         localhost;
  listen              8080;
}
```

## 在nginx的1.19版本之前

在1.19之前，需要使用envsubst命令自行设置环境变量。
以以下docker-compose.yml为例。与上述方法的不同之处在于在command中执行init.sh。

```
version: "3"
services:
  nginx_service:
    container_name: nginx_1.19_earlier
    image: nginx:1.18-alpine
    volumes:
      - ./nginx:/etc/nginx/conf.d
    environment:
      - PORT=8080
    ports:
      - 3000:8080
    command: sh /etc/nginx/conf.d/init.sh
```

把default.conf.template如下所示。此与上述相同。

```
server {
  server_name         localhost;
  listen              ${PORT};
}
```

把init.sh的内容设置为以下内容。使用envsubst命令将环境变量设置到default.conf.template中，并将结果输出到default.conf。别忘记编写启动nginx的命令。

```
#!/bin/sh

envsubst '$$PORT' < \
  /etc/nginx/conf.d/default.conf.template > \
  /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'
```

执行docker-compose up –build后，您可以在容器内的/etc/nginx/conf.d目录中查看设置了环境变量的文件。

```conf
server {
  server_name         localhost;
  listen              8080;
}
```