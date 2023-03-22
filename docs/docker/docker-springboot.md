---
title: SpringBoot使用docker打包的两种方式
date: 2021-12-01 18:00:00
tags:
- springboot
- docker
categories:
- JAVA
- Docker
---

## 只使用maven插件

### 在项目的根路径下打开pom.xml文件，在build节点加入一下内容
```xml

<build>
    <plugins>
        <plugin>
            <groupId>com.spotify</groupId>
            <artifactId>docker-maven-plugin</artifactId>
            <version>1.1.0</version>
            <executions>
                <execution>
                    <id>build-image</id>
                    <phase>package</phase>
                    <goals>
                        <goal>build</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <!--docker仓库地址-->
                <dockerHost>http://192.168.1.20:2375</dockerHost>
                <!--docker镜像名称-->
                <imageName>${project.artifactId}:${project.version}</imageName>
                <!--依赖的基础镜像-->
                <baseImage>java:8</baseImage>
                <!--运行命令-->
                <entryPoint>["java","-jar","-Dfile.encoding=UTF-8","-Dsun.jnu.encoding=UTF-8","/${project.build.finalName}.jar"]
                </entryPoint>
                <!--jar包所在目录-->
                <resources>
                    <resource>
                        <targetPath>/</targetPath>
                        <directory>${project.build.directory}</directory>
                        <include>${project.build.finalName}.jar</include>
                    </resource>
                </resources>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## 使用maven插件+dockerfile

### 在src->main->下创建docker文件夹，并在其目录下创建dockerfile文件

```yml
# 该镜像需要依赖的基础镜像
FROM java:8
  # 将当前目录下的jar包复制到docker容器的/目录下
ADD ebbms-admin-1.0.0-SNAPSHOT.jar /app.jar
  # 运行过程中创建一个app.jar文件
RUN bash -c 'touch /app.jar'
  # 声明服务运行在8080端口
EXPOSE 8084
  # 指定docker容器启动时运行jar包
ENTRYPOINT ["java", "-jar","-Dfile.encoding=UTF-8","-Dsun.jnu.encoding=UTF-8","/app.jar"]
  # 设置环境
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
  # 指定维护者的名字
MAINTAINER wangruiyu
```

### 在项目的根路径下打开pom.xml文件，在build节点加入一下内容

```xml

<build>
    <plugins>
        <plugin>
            <groupId>com.spotify</groupId>
            <artifactId>docker-maven-plugin</artifactId>
            <version>1.1.0</version>
            <executions>
                <execution>
                    <id>build-image</id>
                    <phase>package</phase>
                    <goals>
                        <goal>build</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <!--docker仓库地址-->
                <dockerHost>http://192.168.1.20:2375</dockerHost>
                <!--docker镜像名称-->
                <imageName>${project.artifactId}:${project.version}</imageName>
                <!--dockerfile所在的目录-->
                <dockerDirectory>src/main/docker</dockerDirectory>
                <!--jar包所在目录-->
                <resources>
                    <resource>
                        <targetPath>/</targetPath>
                        <directory>${project.build.directory}</directory>
                        <include>${project.build.finalName}.jar</include>
                    </resource>
                </resources>
            </configuration>
        </plugin>
    </plugins>
</build>
```

