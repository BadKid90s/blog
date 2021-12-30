---
title: 几种Reactor模型
date: 2020-12-03
tags:
- Netty
categories:
- Netty
---



## 几种Reactor模型

## 单Reactor单线程 

![image-20211223160059792](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20211223160059792.png)

### 说明

1. select是前面I/O复用模型介绍的标准网络编程API,可以实现应用程序通过一个阻塞对象监听多路连接请求。
2. Reactor 对象通过Select监听客户端请求事件，收到事件后通过Dispatch进行分发。
3. 如果是建立连接请求事件，则是有Acceptor通过Accept处理连接请求，然后创建一个Handler对象处理连接完成后的后续业务处理。
4. 如果不是建立连接事件，则Reactor会分发调用连接对于的Handler来响应。
5. Handler会完成Read-->业务处理-->Send的完整业务流程。

### 优点

模型简单，没有多线程、进程通信、竞争的问题，全部都在一个线程中完成。

### 缺点

1. 性能问题，只有一个线程，无法发挥多核CPU的性能.Handler在处理某个连接上的业务时，整个进程无法处理其他连接事件，很容易导致性能瓶颈。
2. 可靠性问题，线程意外终止，或者进入死循环，会导致整个系统通讯模块不可用，不能接收和处理外部消息，造成节点故障。



### 使用场景

客户端的数量有限，业务处理非常快速，比如Redis在业务处理的事间复杂度O(1)的情况。

## 单Reactor多线程 

![image-20211223160122949](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20211223160122949.png)

### 说明

1. Reactor对象通过Select监听客户端请求，收到请求后，通过Dispatch进行分发。
2. 如果是建立连接请求事件，则是有Acceptor通过Accept处理连接请求，然后创建一个Handler对象处理连接完成后的后续业务处理。
3. 如果不是连接请求，则Reactor分发调用连接对于的Handler来处理。
4. Hander只负责响应事件，不做具体的业务处理。通过Read读取数据后，会分发给后面的worker线程池的某个线程处理业务。
5. worker线程池会分配独立的线程完成真正的业务，并将结构返回给Handler。
6. Handler收到响应后，通过Send将结果返回给客户端。

### 优点

可以充分利用多核CPU的处理能力。

### 缺点

多线程数据共享和访问比较复杂，Reactor处理所有的事件的监听和响应都在单线程运行。在高并发的情况下容易出现性能瓶颈。



## 主从Reactor多线程

![image-20211223160209220](https://gitee.com/Post-90sBadKid/imageshack/raw/master/image-20211223160209220.png)

### 说明

1. Reactor主线程（MainReactor）对象通过Select监听客户端请求，收到请求后，如果是建立连接请求事件，则是有Acceptor通过Accept处理连接请求
2. 当Acceptor处理连接事件后，MainReactor将连接分配给SubReactor对象。
3. SubReactor对象将连接加入到连接队列进行监听，并创建Handler进行各种事件的处理。
4. 当有事件发生时，SubReactor就会调用对于的Handler处理。
5. Hander只负责响应事件，不做具体的业务处理。通过Read读取数据后，会分发给后面的worker线程池的某个线程处理业务。
6. worker线程池会分配独立的线程完成真正的业务，并将结构返回给Handler。
7. Handler收到响应后，通过Send将结果返回给客户端。
8. 一个Reactor主线程可以对应多个SubReactor子线程。

### 优点

1. 父线程和子线程的数据交互简单职责明确，父线程只需要接收新连接，子线程完成后续的业务处理。
2. 父线程和子线程的数据交互简单，Reactor主线程只需要把新来连接传给子线程，子线程无需返回数据。

### 缺点

编程复杂度高。



## Reactor模型的优点

1. 响应快，不必为单个同步时间所阻塞，虽然Reactor本身依然是同步的。
2. 可以最大程度的避免复杂的多线程及同步问题，并且避免了多线程/进程的切换开销。
3. 扩展性好，可以方便的通过增加Reactor实例个数。来充分利用CPU资源。
4. 复用性好，Reactor模型本身与具体事件处理逻辑无关，具有很高的复用性。
