---
title: 简陋的Java生产者消费者模型
---

上次面试的时候, 一面面试官问我怎么用多线程写个生产者消费者模型. 在圣杯战争之后, 我就再也没碰过Java多线程了, 上次Vue项目里需要向后台发送多条并列请求时是直接抄的别人写好的轮子......

在LeetCode上做了几道多线程的题目, 已经封装好了, 只需要写内部实现, 但是面试的时候是全手撸呀...... 于是今天复习了一下怎么写Java的多线程, 用`BlockingQueue`实现的最简单的一种:

```java
import java.util.Random;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

class Producer implements Runnable {
    private final BlockingQueue<Integer> queue;

    Producer(BlockingQueue<Integer> queue) {
        this.queue = queue;
    }

    @Override
    public void run() {
        try {
            while (true) {
                Thread.sleep(1000);
                queue.put(produce());
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private int produce() {
        int n = new Random().nextInt(10000);
        System.out.println("Producer name is " + Thread.currentThread().getName()+ " put " + n);
        return n;
    }
}

class Customer implements Runnable{
    private final BlockingQueue<Integer> queue;

    Customer(BlockingQueue<Integer> queue) {
        this.queue = queue;
    }
    @Override
    public void run() {
        try {
            while (true) {
                Thread.sleep(2000);
                consume(queue.take());
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void consume(int n){
        System.out.println("Customer name is " + Thread.currentThread().getName()+ " take " + n);
    }
}

public class main {

    public static void main(String[] args) {
        BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(100);
        Producer p = new Producer(queue);
        Customer c1 = new Customer(queue);
        Customer c2 = new Customer(queue);
        Thread producer = new Thread(p);
        producer.setName("生产者");
        Thread cm1 = new Thread(c1);
        Thread cm2 = new Thread(c2);
        cm1.setName("消费者1");
        cm2.setName("消费者2");
        producer.start();
        cm1.start();
        cm2.start();
    }
}
```

最后总结一下创建线程时的要点:

- 继承Thread: 没有共享资源
- 实现`Runnable`接口
- Callable和Future: 不会

在主线程中, 则是这样初始化的:

```java
Producer p = new Producer(queue);
Thread producer = new Thread(p);
producer.setName("生产者");
producer.start();
```


:::note
这是一篇从Hexo迁移的文章，创建于2021-01-11 20:46:58
:::
