---
title: 创建线程那么容易，为什么非要让我使用线程池？
date: 2023-03-21
tags:
- thread
categories:
- JAVA
---


# 一、概述
## 1、问题
>先看我们遇到的问题：我们创建线程的方式很简单，new Thread(() -> {...})，就是因为这么简单粗暴的方式，才带来了致命的问题。首先线程的创建和销毁都是**很耗时很浪费性能**的操作，你用线程为了什么？为了就是异步，为了就是**提升性能**。简单的new三五个Thread还好，我需要一千个线程呢？你也for循环new1000个Thread吗？用完在销毁掉。那这一千个线程的创建和销毁的性能是很糟糕的！
## 2、解决
>为了解决上述问题，线程池诞生了，线程池的核心思想就是：**线程复用**。也就是说线程用完后不销毁，放到池子里等着新任务的到来，反复利用N个线程来执行所有新老任务。这带来的开销只会是那N个线程的创建，而不是每来一个请求都带来一个线程的从生到死的过程。
# 二、线程池
## 1、概念
还说个鸡儿，上面的问题解决方案已经很通俗易懂了。  
针对特级小白我在举个生活的案例：
>比如找工作面试，涉及到两个角色：面试官、求职者。求职者成千上万，每来一个求职者都要为其单独新找一个面试官来面试吗？显然不是，公司都有面试官池子，比如：A、B、C你们三就是这公司的面试官了，有人来面试你们三轮流面就行了。可能不是很恰当，含义就是说我并不需要为每个请求（求职者）都单独分配一个新的线程（面试官） ，而是我固定好几个线程，由他们几个来处理所有请求。不会反复创建销毁。
## 2、参数
### 2.1、源码
``` java
public ThreadPoolExecutor(int corePoolSize,
    int maximumPoolSize,
    long keepAliveTime,
    TimeUnit unit,
    BlockingQueue<Runnable> workQueue,
    ThreadFactory threadFactory,
    RejectedExecutionHandler handler) {}
```
### 2.2、解释
- **corePoolSize**：核心线程数  

   线程池在完成初始化之后，默认情况下，线程池中不会有任何线程，线程池会等有任务来的时候再去创建线程。核心线程创建出来后即使超出了线程保持的存活时间配置也不会销毁，核心线程只要创建就永驻了，就等着新任务进来进行处理。
  
- **maximumPoolSize**：最大线程数  

   核心线程忙不过来且任务存储队列满了的情况下，还有新任务进来的话就会继续开辟线程，但是也不是任意的开辟线程数量，线程数（包含核心线程）达到**maximumPoolSize**后就不会产生新线程了，就会执行拒绝策略。

- **keepAliveTime**：线程保持的存活时间

  如果线程池当前的线程数多于**corePoolSize**，那么如果多余的线程空闲时间超过**keepAliveTime**，那么这些多余的线程（超出核心线程数的那些线程）就会被回收。

- **unit**：线程保持的存活时间单位

  比如：TimeUnit.MILLISECONDS、TimeUnit.SECONDS

- **workQueue**：任务存储队列
  
  核心线程数满了后还有任务继续提交到线程池的话，就先进入workQueue。  
  
  workQueue通常情况下有如下选择：
  -  **LinkedBlockingQueue**：无界队列，意味着无限制，其实是有限制，大小是int的最大值。也可以自定义大小。
  - **ArrayBlockingQueue**：有界队列，可以自定义大小，到了阈值就开启新线程（不会超过maximumPoolSize）。
  - **SynchronousQueue**：**Executors.newCachedThreadPool()**;默认使用的队列。也不算是个队列，他不没有存储元素的能力。

  一般都采取**LinkedBlockingQueue**，因为他也可以设置大小，可以取代**ArrayBlockingQueue**有界队列。

- **threadFactory**：当线程池需要新的线程时，会用**threadFactory**来生成新的线程

  默认采用的是**DefaultThreadFactory**，主要负责创建线程。newThread()方法。创建出来的线程都在同一个线程组且优先级也是一样的。
  
- **handler**：拒绝策略，任务量超出线程池的配置限制或执行shutdown还在继续提交任务的话，会执行handler的逻辑。

  默认采用的是**AbortPolicy**，遇到上面的情况，线程池将直接采取直接拒绝策略，也就是直接抛出异常**RejectedExecutionException**
  
## 3、原理
### 3.1、原理

- 线程池刚启动的时候核心线程数为0

- 丢任务给线程池的时候，线程池会新开启线程来执行这个任务

- 如果线程数小于corePoolSize，即使工作线程处于空闲状态，也会创建一个新线程来执行新任务

- 如果线程数大于或等于corePoolSize，则会将任务放到workQueue，也就是任务队列

- 如果任务队列满了，且线程数小于maximumPoolSize，则会创建一个新线程来运行任务

- 如果任务队列满了，且线程数大于或等于maximumPoolSize，则直接采取拒绝策略
### 3.2、图解

![](./thread-pool/e0733727-92bd-4438-a628-3b3989d8e838.png)
### 3.3、举例

线程池参数配置：核心线程5个，最大线程数10个，队列长度为100。

那么线程池启动的时候不会创建任何线程，假设请求进来6个，则会创建5个核心线程来处理五个请求，另一个没被处理到的进入到队列。这时候有进来99个请求，线程池发现核心线程满了，队列还在空着99个位置，所以会进入到队列里99个，加上刚才的1个正好100个。这时候再次进来5个请求，线程池会再次开辟五个非核心线程来处理这五个请求。目前的情况是线程池里线程数是10个RUNNING状态的，队列里100个也满了。如果这时候又进来1个请求，则直接走拒绝策略。

### 3.4、源码
``` java
public void execute(Runnable command) {
    int c = ctl.get();
    // workerCountOf(c)：工作线程数
    // worker数量比核心线程数小，直接创建worker执行任务
    if (workerCountOf(c) < corePoolSize) {
        // addWorker里面负责创建线程且执行任务
        if (addWorker(command, true))
            return;
        c = ctl.get();
    }
    // worker数量超过核心线程数，任务直接进入队列
    if (isRunning(c) && workQueue.offer(command)) {
        int recheck = ctl.get();
        // 线程池状态不是RUNNING状态，说明执行过shutdown命令，需要对新加入的任务执行reject()操作。
        // 这儿为什么需要recheck，是因为任务入队列前后，线程池的状态可能会发生变化。
        if (! isRunning(recheck) && remove(command))
            reject(command);
        // 这儿为什么需要判断0值，主要是在线程池构造方法中，核心线程数允许为0
        else if (workerCountOf(recheck) == 0)
            addWorker(null, false);
    }
    // 如果线程池不是运行状态，或者任务进入队列失败，则尝试创建worker执行任务。
    // 这儿有3点需要注意：
    // 1. 线程池不是运行状态时，addWorker内部会判断线程池状态
    // 2. addWorker第2个参数表示是否创建核心线程
    // 3. addWorker返回false，则说明任务执行失败，需要执行reject操作
    else if (!addWorker(command, false))
        reject(command);
}
```
## 4、Executors
### 4.1、概念

首先这不是一个线程池，这是线程池的工具类，他能方便的为我们创建线程。

但是阿里巴巴开发手册上说明不推荐用Executors创建线程池，推荐自己定义线程池。这是因为Executors创建的任何一种线程池都可能引发血案，具体是什么问题下面会说。

### 4.2、固定线程数
#### 4.2.1、描述
核心线程数和最大线程数是一样的，所以称之为固定线程数。

其他参数配置默认为：永不超时（0ms），无界队列（**LinkedBlockingQueue**）、默认线程工厂（**DefaultThreadFactory**）、直接拒绝策略（**AbortPolicy**）。

#### 4.2.2、api

**Executors.newFixedThreadPool(n);**

#### 4.2.3、demo

``` java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Description: 创建2个线程来执行10个任务。
 */
public class ThreadPoolTest {
    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        for (int i = 0; i < 10; i++) {
            // 从结果中可以发现线程name永远都是两个。不会有第三个。
            executorService.execute(() -> System.out.println(Thread.currentThread().getName()));
        }
    }
}
```
####  4.2.4、问题

问题就在于它是**无界队列**，队列里能放int的最大值个任务，并发巨高的情况下极大可能直接OOM了然后任务还在堆积，毕竟直接用的是jvm内存。所以建议自定义线程池，自己按照需求指定合适的队列大小，自定义拒绝策略将超出队列大小的任务放到对外内存做补偿，比如Redis。别把业务系统压垮就行。

#### 4.2.5、源码
``` java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(
                // 核心线程数和最大线程数都是nThreads
                nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  // 无界队列！！！致命问题的关键所在。
                                  new LinkedBlockingQueue<Runnable>());
}
```
### 4.3、单个线程
#### 4.3.1、描述
核心线程数和最大线程数是1，内部默认的，不可更改，所以称之为单线程数的线程池。

类似于**Executors.newFixedThreadPool(1)**;

其他参数配置默认为：永不超时（0ms），无界队列（**LinkedBlockingQueue**）、默认线程工厂（**DefaultThreadFactory**）、直接拒绝策略（**AbortPolicy**）。
#### 4.3.2、api

**Executors.newSingleThreadExecutor();**

#### 4.3.3、demo
``` java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Description: 创建1个线程来执行10个任务。
 */
public class ThreadPoolTest {
    public static void main(String[] args) {
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        for (int i = 0; i < 10; i++) {
            // 从结果中可以发现线程name永远都是pool-1-thread-1。不会有第二个出现。
            executorService.execute(() -> System.out.println(Thread.currentThread().getName()));
        }
    }
}
```
#### 4.3.4、问题
同【4.2、固定线程数】的问题，都是无界队列惹的祸。
#### 4.3.5、源码
``` java 

public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(
        // 核心线程数和最大线程数都是1，写死的，客户端不可更改。
                 1, 1,
                                0L, TimeUnit.MILLISECONDS,
                 // 无界队列！！！致命问题的关键所在。
                                new LinkedBlockingQueue<Runnable>()));
}
```

### 4.4、带缓存的线程池
#### 4.4.1、描述
他的功能是来个任务我就开辟个线程去处理，不会进入队列，**SynchronousQueue**队列也不带存储元素的功能。那这意味着来一亿个请求就会开辟一亿个线程去处理，**keepAliveTime**为60S，意味着线程空闲时间超过60S就会被杀死；这就叫带缓存功能的线程池。

核心线程数是0，最大线程数是int的最大值，内部默认的，不可更改。

其他参数配置默认为：1min超时（60s），**SynchronousQueue队列**、默认线程工厂（**DefaultThreadFactory**）、直接拒绝策略（**AbortPolicy**）。

#### 4.4.2、api
**Executors.newCachedThreadPool();**
#### 4.4.3、demo
``` java

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Description: 创建个带缓存功能的线程池来执行10个任务。
 *
 * @author TongWei.Chen 2020-07-09 21:28:34
 */
public class ThreadPoolTest {
    public static void main(String[] args) {
        ExecutorService executorService = Executors.newCachedThreadPool();
        for (int i = 0; i < 10; i++) {
            // 从结果中可以发现线程name有10个。也就是有几个任务就会开辟几个线程。
            executorService.execute(() -> System.out.println(Thread.currentThread().getName()));
        }
    }
}
```
#### 4.4.4、问题
问题就在于他的最大线程数是int的最大值，因为他内部采取的队列是**SynchronousQueue**，这个队列没有容纳元素的能力，这将意味着只要来请求我就开启线程去工作，巅峰期能创建二十几亿个线程出来工作，你自己想想多么可怕！！！

#### 4.4.5、源码
``` java

public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(
                // 核心线程数是0，最大线程数都是Integer.MAX_VALUE，这个可致命了！！！
                0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
````


###  4.5、有调度功能的线程池
#### 4.5.1、描述
RocketMQ内部大量采用了此种线程池来做心跳等任务。

核心线程数手动传进来，最大线程数是Integer.MAX_VALUE，最大线程数是内部默认的，不可更改。
其他参数配置默认为：永不超时（0ns），带延迟功能的队列（**DelayedWorkQueue**）、默认线程工厂（**DefaultThreadFactory**）、直接拒绝策略（**AbortPolicy**）。

#### 4.5.2、api
**Executors.newScheduledThreadPool(n);**
#### 4.5.3、demo
``` java 

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Description: 创建个带调度功能的线程池来执行任务。
 *
 * @author TongWei.Chen 2020-07-09 21:28:34
 */
public class ThreadPoolTest {
    public static void main(String[] args) {
        ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(2);
        // 五秒一次
        scheduledExecutorService.schedule(() -> System.out.println(Thread.currentThread().getName()), 5, TimeUnit.SECONDS);
        // 首次五秒后执行，其次每隔1s执行一次
        scheduledExecutorService.scheduleAtFixedRate(() -> System.out.println(Thread.currentThread().getName()), 5, 1, TimeUnit.SECONDS);
    }
}
```
#### 4.5.4、问题
【同4.4、带缓存的线程池的问题】

问题就在于他的最大线程数是int的最大值，这将意味海量并发期能创建二十几亿个线程出来工作，你自己想想多么可怕！！！
#### 4.5.5、源码
``` java

public ScheduledThreadPoolExecutor(int corePoolSize) {
    // 致命的问题跟newCachedThreadPool一样，最大线程数能开到几十亿（Integer.MAX_VALUE）！！！
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue());
}
```

## 4.6、停止线程
### 4.6.1、shutdown

平缓的结束线程池，比如当前线程池还在执行任务，还没执行完，这时候执行了shutdown的话，线程池并不会立即停止工作，而是会等待线程池中的任务都执行完成后才会shutdown掉，但是如果执行shutdown了，外界还在继续提交任务到线程池，那么线程池会直接采取拒绝策略。

### 4.6.2、isShutdown

判断线程池是否已经shutdown。

### 4.6.3、shutdownNow
暴力结束线程池。不管你当前线程池有没有任务在执行，队列里有没有堆积消息，我都直接让线程池挂掉。但是他的返回值是队列里那些未被执行的任务。有需要的可以记录下log啥的。
### 4.7、疑问
这几种线程池为什么要采取不一样的队列？比如**newFixedThreadPool**为什么采取**LinkedBlockingQueue**，而**newCachedThreadPool**又为什么采取**SynchronousQueue**？

因为**newFixedThreadPool**线程数量有限，他又不想丢失任务，只能采取无界队列，而**newCachedThreadPool**的话本身自带int最大值个线程数，所以没必要用无界队列，他的宗旨就是我有线程能处理，不需要队列。

## 5、总结几个问题

### 1、线程池的状态
- RUNNING：接受新任务并处理排队任务。
- SHUTDOWN：不接受新任务，但是会处理排队任务。【见：停止线程的4.6.1、shutdown】
- STOP：不接受新任务，也不处理排队任务，并中端正在进行的任务。
- TIDYING：所有任务都已经完事，工作线程为0的时候 ，线程会进入这个状态并执行terminate()钩子方法。
- TERMINATED：terminate()钩子方法运行完成。

### 2、线程池自动创建还是手动？
那肯定是手动了，因为Executors自动创建的那些线程池都存在致命的问题。手动创建线程池我们能自己控制线程数大小以及队列大小，还可以指定组名称等等个性化配置。重点不会出现致命问题，风险都把控在我们手里。
### 3、线程数多少合适？
CPU密集型（比如加密、各种复杂计算等）：建议设置为CPU核数+1。
耗时IO操作（比如读写数据库，压缩解压缩大文件等等）：一般会设置CPU核数的2倍。当然也有个很牛X的计算公式：线程数=CPU核数 *（1+平均等待时间/平均工作时间）
### 4、before&after
在线程执行前后可以通过两个方法来进行打印log或其他工作。
源码如下：
``` java
// 执行前的before
beforeExecute(wt, task);
Throwable thrown = null;
try {
    // 真正执行
    task.run();
} catch (RuntimeException x) {
    thrown = x; throw x;
} catch (Error x) {
    thrown = x; throw x;
} catch (Throwable x) {
    thrown = x; throw new Error(x);
} finally {
    // 执行完成后after
    afterExecute(task, thrown);
}
```

## 6、核心源码（全）

### 1、常用变量的解释
``` java
// 1. `ctl`，可以看做一个int类型的数字，高3位表示线程池状态，低29位表示worker数量
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
// 2. `COUNT_BITS`，`Integer.SIZE`为32，所以`COUNT_BITS`为29
private static final int COUNT_BITS = Integer.SIZE - 3;
// 3. `CAPACITY`，线程池允许的最大线程数。1左移29位，然后减1，即为 2^29 - 1
private static final int CAPACITY   = (1 << COUNT_BITS) - 1;

// runState is stored in the high-order bits
// 4. 线程池有5种状态，按大小排序如下：RUNNING < SHUTDOWN < STOP < TIDYING < TERMINATED
private static final int RUNNING    = -1 << COUNT_BITS;
private static final int SHUTDOWN   =  0 << COUNT_BITS;
private static final int STOP       =  1 << COUNT_BITS;
private static final int TIDYING    =  2 << COUNT_BITS;
private static final int TERMINATED =  3 << COUNT_BITS;

// Packing and unpacking ctl
// 5. `runStateOf()`，获取线程池状态，通过按位与操作，低29位将全部变成0
private static int runStateOf(int c)     { return c & ~CAPACITY; }
// 6. `workerCountOf()`，获取线程池worker数量，通过按位与操作，高3位将全部变成0
private static int workerCountOf(int c)  { return c & CAPACITY; }
// 7. `ctlOf()`，根据线程池状态和线程池worker数量，生成ctl值
private static int ctlOf(int rs, int wc) { return rs | wc; }

/*
 * Bit field accessors that don't require unpacking ctl.
 * These depend on the bit layout and on workerCount being never negative.
 */
// 8. `runStateLessThan()`，线程池状态小于xx
private static boolean runStateLessThan(int c, int s) {
    return c < s;
}
// 9. `runStateAtLeast()`，线程池状态大于等于xx
private static boolean runStateAtLeast(int c, int s) {
    return c >= s;
}
```
### 2、构造方法
``` java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    // 基本类型参数校验
    if (corePoolSize < 0 ||
        maximumPoolSize <= 0 ||
        maximumPoolSize < corePoolSize ||
        keepAliveTime < 0)
        throw new IllegalArgumentException();
    // 空指针校验
    if (workQueue == null || threadFactory == null || handler == null)
        throw new NullPointerException();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    // 根据传入参数`unit`和`keepAliveTime`，将存活时间转换为纳秒存到变量`keepAliveTime `中
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```

### 3、提交执行task的过程
``` java
public void execute(Runnable command) {
    if (command == null)
        throw new NullPointerException();
    /*
     * Proceed in 3 steps:
     *
     * 1. If fewer than corePoolSize threads are running, try to
     * start a new thread with the given command as its first
     * task.  The call to addWorker atomically checks runState and
     * workerCount, and so prevents false alarms that would add
     * threads when it shouldn't, by returning false.
     *
     * 2. If a task can be successfully queued, then we still need
     * to double-check whether we should have added a thread
     * (because existing ones died since last checking) or that
     * the pool shut down since entry into this method. So we
     * recheck state and if necessary roll back the enqueuing if
     * stopped, or start a new thread if there are none.
     *
     * 3. If we cannot queue task, then we try to add a new
     * thread.  If it fails, we know we are shut down or saturated
     * and so reject the task.
     */
    int c = ctl.get();
    // worker数量比核心线程数小，直接创建worker执行任务
    if (workerCountOf(c) < corePoolSize) {
        if (addWorker(command, true))
            return;
        c = ctl.get();
    }
    // worker数量超过核心线程数，任务直接进入队列
    if (isRunning(c) && workQueue.offer(command)) {
        int recheck = ctl.get();
        // 线程池状态不是RUNNING状态，说明执行过shutdown命令，需要对新加入的任务执行reject()操作。
        // 这儿为什么需要recheck，是因为任务入队列前后，线程池的状态可能会发生变化。
        if (! isRunning(recheck) && remove(command))
            reject(command);
        // 这儿为什么需要判断0值，主要是在线程池构造方法中，核心线程数允许为0
        else if (workerCountOf(recheck) == 0)
            addWorker(null, false);
    }
    // 如果线程池不是运行状态，或者任务进入队列失败，则尝试创建worker执行任务。
    // 这儿有3点需要注意：
    // 1. 线程池不是运行状态时，addWorker内部会判断线程池状态
    // 2. addWorker第2个参数表示是否创建核心线程
    // 3. addWorker返回false，则说明任务执行失败，需要执行reject操作
    else if (!addWorker(command, false))
        reject(command);
}
```

### 4、addworker源码解析
``` java

private boolean addWorker(Runnable firstTask, boolean core) {
    retry:
    // 外层自旋
    for (;;) {
        int c = ctl.get();
        int rs = runStateOf(c);

        // 这个条件写得比较难懂，我对其进行了调整，和下面的条件等价
        // (rs > SHUTDOWN) || 
        // (rs == SHUTDOWN && firstTask != null) || 
        // (rs == SHUTDOWN && workQueue.isEmpty())
        // 1. 线程池状态大于SHUTDOWN时，直接返回false
        // 2. 线程池状态等于SHUTDOWN，且firstTask不为null，直接返回false
        // 3. 线程池状态等于SHUTDOWN，且队列为空，直接返回false
        // Check if queue empty only if necessary.
        if (rs >= SHUTDOWN &&
            ! (rs == SHUTDOWN &&
               firstTask == null &&
               ! workQueue.isEmpty()))
            return false;

        // 内层自旋
        for (;;) {
            int wc = workerCountOf(c);
            // worker数量超过容量，直接返回false
            if (wc >= CAPACITY ||
                wc >= (core ? corePoolSize : maximumPoolSize))
                return false;
            // 使用CAS的方式增加worker数量。
            // 若增加成功，则直接跳出外层循环进入到第二部分
            if (compareAndIncrementWorkerCount(c))
                break retry;
            c = ctl.get();  // Re-read ctl
            // 线程池状态发生变化，对外层循环进行自旋
            if (runStateOf(c) != rs)
                continue retry;
            // 其他情况，直接内层循环进行自旋即可
            // else CAS failed due to workerCount change; retry inner loop
        } 
    }
    boolean workerStarted = false;
    boolean workerAdded = false;
    Worker w = null;
    try {
        w = new Worker(firstTask);
        final Thread t = w.thread;
        if (t != null) {
            final ReentrantLock mainLock = this.mainLock;
            // worker的添加必须是串行的，因此需要加锁
            mainLock.lock();
            try {
                // Recheck while holding lock.
                // Back out on ThreadFactory failure or if
                // shut down before lock acquired.
                // 这儿需要重新检查线程池状态
                int rs = runStateOf(ctl.get());

                if (rs < SHUTDOWN ||
                    (rs == SHUTDOWN && firstTask == null)) {
                    // worker已经调用过了start()方法，则不再创建worker
                    if (t.isAlive()) // precheck that t is startable
                        throw new IllegalThreadStateException();
                    // worker创建并添加到workers成功
                    workers.add(w);
                    // 更新`largestPoolSize`变量
                    int s = workers.size();
                    if (s > largestPoolSize)
                        largestPoolSize = s;
                    workerAdded = true;
                }
            } finally {
                mainLock.unlock();
            }
            // 启动worker线程
            if (workerAdded) {
                t.start();
                workerStarted = true;
            }
        }
    } finally {
        // worker线程启动失败，说明线程池状态发生了变化（关闭操作被执行），需要进行shutdown相关操作
        if (! workerStarted)
            addWorkerFailed(w);
    }
    return workerStarted;
}
```
###  5、线程池worker任务单元
``` java
private final class Worker
    extends AbstractQueuedSynchronizer
    implements Runnable
{
    /**
     * This class will never be serialized, but we provide a
     * serialVersionUID to suppress a javac warning.
     */
    private static final long serialVersionUID = 6138294804551838833L;

    /** Thread this worker is running in.  Null if factory fails. */
    final Thread thread;
    /** Initial task to run.  Possibly null. */
    Runnable firstTask;
    /** Per-thread task counter */
    volatile long completedTasks;

    /**
     * Creates with given first task and thread from ThreadFactory.
     * @param firstTask the first task (null if none)
     */
    Worker(Runnable firstTask) {
        setState(-1); // inhibit interrupts until runWorker
        this.firstTask = firstTask;
        // 这儿是Worker的关键所在，使用了线程工厂创建了一个线程。传入的参数为当前worker
        this.thread = getThreadFactory().newThread(this);
    }

    /** Delegates main run loop to outer runWorker  */
    public void run() {
        runWorker(this);
    }

    // 省略代码...
}
```
### 6、核心线程执行逻辑-runworker
``` java

final void runWorker(Worker w) {
    Thread wt = Thread.currentThread();
    Runnable task = w.firstTask;
    w.firstTask = null;
    // 调用unlock()是为了让外部可以中断
    w.unlock(); // allow interrupts
    // 这个变量用于判断是否进入过自旋（while循环）
    boolean completedAbruptly = true;
    try {
        // 这儿是自旋
        // 1. 如果firstTask不为null，则执行firstTask；
        // 2. 如果firstTask为null，则调用getTask()从队列获取任务。
        // 3. 阻塞队列的特性就是：当队列为空时，当前线程会被阻塞等待
        while (task != null || (task = getTask()) != null) {
            // 这儿对worker进行加锁，是为了达到下面的目的
            // 1. 降低锁范围，提升性能
            // 2. 保证每个worker执行的任务是串行的
            w.lock();
            // If pool is stopping, ensure thread is interrupted;
            // if not, ensure thread is not interrupted.  This
            // requires a recheck in second case to deal with
            // shutdownNow race while clearing interrupt
            // 如果线程池正在停止，则对当前线程进行中断操作
            if ((runStateAtLeast(ctl.get(), STOP) ||
                 (Thread.interrupted() &&
                  runStateAtLeast(ctl.get(), STOP))) &&
                !wt.isInterrupted())
                wt.interrupt();
            // 执行任务，且在执行前后通过`beforeExecute()`和`afterExecute()`来扩展其功能。
            // 这两个方法在当前类里面为空实现。
            try {
                beforeExecute(wt, task);
                Throwable thrown = null;
                try {
                    task.run();
                } catch (RuntimeException x) {
                    thrown = x; throw x;
                } catch (Error x) {
                    thrown = x; throw x;
                } catch (Throwable x) {
                    thrown = x; throw new Error(x);
                } finally {
                    afterExecute(task, thrown);
                }
            } finally {
                // 帮助gc
                task = null;
                // 已完成任务数加一 
                w.completedTasks++;
                w.unlock();
            }
        }
        completedAbruptly = false;
    } finally {
        // 自旋操作被退出，说明线程池正在结束
        processWorkerExit(w, completedAbruptly);
    }
}
```

### 7、自建线程池注意点

- 阻塞任务队列数
- 线程池的名字，最好跟业务相关

- 核心线程池大小，看业务实际情况。  

  一般情况：**CPU核数+1**,可以参考【线程数多少合适？】
- 最大线程池大小，看业务实际情况。
  
  一般情况：**2*CPU核数+1**,可以参考【线程数多少合适？】
- 拒绝策略，我个人一般都是记录log，如果主要的业务我会根据log做补偿。
比如：
``` java

ThreadPoolExecutor executor = new ThreadPoolExecutor(CPU核数 + 1, 2 * CPU核数 + 1,
      5, TimeUnit.SECONDS, new ArrayBlockingQueue<>(2000),
         // 线程池名字pay-account
          new DefaultThreadFactory("pay-account"), (r1, executor) -> {
         // 记录log 重新入队列做补偿
 });
```



