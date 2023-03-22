---
title: SpringBoot使用docker部署加载外部配置文件
date: 2021-12-20 12:30:00
tags:
- springboot
- docker
categories:
- JAVA
- Docker
---

## 修改pom.xml文件，把配置文件copy到镜像中
```xml

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
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
                <dockerHost>http://192.168.1.230:2375</dockerHost>
                <imageName>${project.artifactId}:${project.version}</imageName>
                <dockerDirectory>src/main/docker</dockerDirectory>
                <resources>
                    <resource>
                        <targetPath>/</targetPath>
                        <directory>${project.build.directory}</directory>
                        <include>${project.build.finalName}.jar</include>
                    </resource>
                    <!-- 把编译后输出路径下的配置文件拷贝到config下-->
                    <resource>
                        <targetPath>/config</targetPath>
                        <directory>${project.build.outputDirectory}</directory>
                        <includes>
                            <include>*.*</include>
                        </includes>
                    </resource>
                </resources>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## 1.在容器根目录运行jar

### dockerfile

```yaml
# 该镜像需要依赖的基础镜像
FROM anapsix/alpine-java:8_server-jre_unlimited
# 将当前目录下的jar包复制到docker容器的/目录下
ADD /ebbms-admin-1.0.0-SNAPSHOT.jar  /app.jar
# 配置文件在jar包同级目录下的config文件（优先级最高），具体参考springboot配置优先级
ADD /config       /config
# 运行过程中创建一个app.jar文件
RUN bash -c 'touch /app.jar'
# 声明服务运行在8084端口
EXPOSE 8084
# 设置环境
ENV LANG='UTF-8'
ENV LC_ALL='zh_CN.UTF-8'
ENV LC_CTYPE='zh_CN.UTF-8'
# 指定docker容器启动时运行jar包
ENTRYPOINT ["java","-jar","app.jar","-Dfile.encoding=UTF-8","-Dsun.jnu.encoding=UTF-8"]
# 指定维护者的名字
MAINTAINER wangruiyu
```



## 2.在容器中自定义目录运行jar
**使用自定义路径：/usr/local/ebbms** 

设置docker的WORKDIR（工作目录）为自定义路径！

**重点：设置工作目录**
### dockerfile文件

```yml
# 该镜像需要依赖的基础镜像
FROM anapsix/alpine-java:8_server-jre_unlimited
# 将当前目录下的jar包复制到docker容器的/目录下
ADD /ebbms-admin-1.0.0-SNAPSHOT.jar  /usr/local/ebbms/app.jar
ADD /config       /usr/local/ebbms/config
# 运行过程中创建一个app.jar文件
RUN bash -c 'touch /usr/local/ebbms/app.jar'
# 声明服务运行在8084端口
EXPOSE 8084
# 设置环境
ENV LANG='UTF-8'
ENV LC_ALL='zh_CN.UTF-8'
ENV LC_CTYPE='zh_CN.UTF-8'
# 设置工作目录，不指定默认为根目录，会找不到jar
WORKDIR /usr/local/ebbms
# 指定docker容器启动时运行jar包
ENTRYPOINT ["java","-jar","app.jar","-Dfile.encoding=UTF-8","-Dsun.jnu.encoding=UTF-8"]
# 指定维护者的名字
MAINTAINER wangruiyu

```



## 3.在容器根目录运行jar，自定义路径存放配置
**使用自定义路径：/usr/local/ebbms**

在docker容器启动时运行jar包时，使用spring.config.location 指定配置文件路径即可！
### dockerfile文件

```yml
# 该镜像需要依赖的基础镜像
FROM anapsix/alpine-java:8_server-jre_unlimited
# 将当前目录下的jar包复制到docker容器的/目录下
ADD /ebbms-admin-1.0.0-SNAPSHOT.jar  /usr/local/ebbms/app.jar
ADD /config       /usr/local/ebbms/config
# 运行过程中创建一个app.jar文件
RUN bash -c 'touch /usr/local/ebbms/app.jar'
# 声明服务运行在8084端口
EXPOSE 8084
# 设置环境
ENV LANG='UTF-8'
ENV LC_ALL='zh_CN.UTF-8'
ENV LC_CTYPE='zh_CN.UTF-8'
# 指定docker容器启动时运行jar包,使用spring.config.location 指定配置文件路径
ENTRYPOINT ["java","-jar","app.jar","--spring.config.location=/usr/local/ebbms/config/application.yaml","-Dfile.encoding=UTF-8","-Dsun.jnu.encoding=UTF-8"]
# 指定维护者的名字
MAINTAINER wangruiyu

```

