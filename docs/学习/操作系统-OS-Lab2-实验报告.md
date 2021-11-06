---
title: 操作系统 OS Lab2 实验报告
---

# OS Lab2 实验报告




感谢PB，PB大救星。



## 一、实验思考题



### Thinking 2.1

请思考cache用虚拟地址来查询的可能性，并且给出这种方式对访存带来的好处和坏处。另外，你能否能根据前一个问题的解答来得出用物理地址来查询的优势?

**答：**

如果使用虚拟地址来查询cache：

- 好处：当TLB未命中，cache命中时，可以直接用虚拟地址查询，不需要经过MMU的转换。
- 坏处：一个物理地址可映射到多个虚拟地址，多进程共用cache可能会造成数据访问错误，最终还是需要通过物理地址校验是否命中。

用物理地址来查询的优势：

- 用物理地址查询，物理地址命中则必命中。



### Thinking 2.2

请查阅相关资料，针对我们提出的疑问，给出一个上述流程的优化版本，新的版本需要有更快的访存效率。（提示：考虑并行执行某些步骤）

**答：**

优化版本：

1. CPU给出虚拟地址来访问数据，TLB接收到这个地址之后查找是否有对应的页表项。
2. 假设页表项存在，则根据物理地址在cache中查询；如果不存在，则MMU执行正常的页表查询工作之后再根据物理地址在cache中查询，同时更新TLB中的内容。
3. 如果cache命中，则直接返回给CPU数据；如果没有命中则按照相应的算法进行cache的替换或者装填，同时并行返回给CPU数据。



### Thinking 2.3

在我们的实验中，有许多对虚拟地址或者物理地址操作的宏函数(详见include/mmu.h ),那么我们在调用这些宏的时候需要弄清楚需要操作的地址是物理地址还是虚拟地址，阅读下面的代码，指出x是一个物理地址还是虚拟地址。

```
int x;
char *value = return_a_pointer();
*value = 10;
x = (int) value;
```

**答：**

x是虚拟地址。



### Thinking 2.4

我们在 include/queue.h 中定义了一系列的宏函数来简化对链表的操作。实际上，我们在 include/queue.h 文件中定义的链表和 glibc 相关源码较为相似，这一链表设计也应用于 Linux 系统中 (sys/queue.h 文件)。请阅读这些宏函数的代码，说说它们的原理和巧妙之处。

**答：**

原理：通过宏定义的形式描述双向链表。

巧妙之处：

1. 不依赖具体的类型，由宏定义的传参决定。
2. 采用特殊的双重链表结构，好处是删除方便。比如在`Page`结构体中，`pp_link`有两个域，其中`le_next`指向下一个页结构体，`le_prev`指向上一个页结构体的`pp_link`的`le_next`。这样在进行删除的时候主要知道需要删除的节点就可以了。



### Thinking 2.5

我们注意到我们把宏函数的函数体写成了 `do { /* ... */ } while(0)`的形式，而不是仅仅写成形如 `{ /* ... */ }` 的语句块，这样的写法好处是什么？

**答：**

辅助定义复杂的宏，避免在进行引用时出错，使宏在展开后保留语义。



### Thinking 2.6
注意，我们定义的 Page 结构体只是一个信息的载体，它只代表了相应物理内存页的信息，它本身并不是物理内存页。 那我们的物理内存页究竟在哪呢？Page 结构体又是通过怎样的方式找到它代表的物理内存页的地址呢？ 请你阅读 include/pmap.h 与 mm/pmap.c 中相关代码，给出你的想法。

**答：**

物理内存页在设备的物理内存中，Page 结构体由alloc初始化入口，根据Page 结构体指针，通过page2pa，减去起始位找到它的页号，乘以页面大小，得到其代表的物理内存页的地址。



### Thinking 2.7

请阅读 include/queue.h 以及 include/pmap.h, 将Page\_list的结构梳理清楚,选择正确的展开结构(请注意指针)。

**答：**

**C:**

```
struct Page_list{
    struct {
        struct {
            struct Page *le_next;
            struct Page **le_prev;
        } pp_link;
        u_short pp_ref;
    }* lh_first;
}
```



### Thinking 2.8

在 `mmu.h` 中定义了 `bzero(void *b, size_t)` 这样一个函数,请你思考，此处的b指针是一个物理地址， 还是一个虚拟地址呢？

**答：**

虚拟地址。



### Thinking 2.9
了解了二级页表页目录自映射的原理之后，我们知道，Win2k内核的虚存管理也是采用了二级页表的形式，其页表所占的 4M 空间对应的虚存起始地址为 `0xC0000000`，那么，它的页目录的起始地址是多少呢？

**答：**

`0xC0030000`

计算方式：`0xC0000000 + (0xC0000000 >> 12) * 4 = 0xC0030000`。



### Thinking 2.10

注意到页表在进程地址空间中连续存放，并线性映射到整个地址空间，思考：是否可以由虚拟地址直接得到对应页表项的虚拟地址？上一节末尾所述转换过程中，第一步查页目录有必要吗，为什么？

**答：**

由页表与虚拟地址空间的映射关系，可以根据虚拟地址得到对应页表项的虚拟地址。

有必要。第一步查页目录获取的时二级页表的物理地址。



### Thinking 2.11

思考一下tlb_out 汇编函数，结合代码阐述一下跳转到NOFOUND的流程？从MIPS手册中查找tlbp和tlbwi指令，明确其用途，并解释为何第10行处指令后有4条nop指令。

**答：**

跳转到NOFOUND的流程：

- 保存CP0_ENTRYHI的值，刷新CP0_ENTRYHI，查询TLB表项，如无效跳转到NOFOUND，并恢复CP0_ENTRYHI的值；若有效，valid写入0，跳转到NOFOUND，并恢复CP0_ENTRYHI的值。

指令：

> Format: TLBP MIPS32
> Purpose: To find a matching entry in the TLB.
>
> Format: TLBWI MIPS32
> Purpose: To write a TLB entry indexed by the Index register.

- TLBP用于查找TLB，TLBWI用于向TLB指定位置写入。

4条nop指令：

- 清空流水线，防止异常出现影响CP0工作。



### Thinking 2.12
显然，运行后结果与我们预期的不符，va值为0x88888，相应的pa中的值为0。这说明我们的代码中存在问题，请你仔细思考我们的访存模型，指出问题所在。

**答：**

在代码中使用了va2pa函数，返回的是页的起始地址，转换过程中清空了低12位，因此获取的pa并不是0x88888对应的值。



### Thinking 2.13
在X86体系结构下的操作系统，有一个特殊的寄存器CR4，在其中有一个PSE位，当该位设为1时将开启4MB大物理页面模式，请查阅相关资料，说明当PSE开启时的页表组织形式与我们当前的页表组织形式的区别。

**答：**

目前是二级页表组织形式，开启4MB大物理页面模式后是一个一级页表表项直接映射到4MB大小的页。在Xv6系统初始化时，会使用到4MB大页。



### Thinking 2.11（指导书）

观察给出的代码可以发现，page_insert 会默认为页面设置PTE_V的权限。请问，你认为是否应该将PTE_R 也作为默认权限？并说明理由。

**答：**

不应该，PTE_R为写权限位，而在进行page_insert时并不知道页面是否可写。



## 二、实验难点图示

实验中比较难的地方，一个是这里的地址转换：

![](http://cscore.net.cn/assets/courseware/v1/79285678df7ddb18b4761b7d88a87de9/asset-v1:Internal+B3I062140+2019_T2+type@asset+block/lab2-pic-2.jpg)

另外一个地方就是双重链表的操作，这边的链表操作函数实在是绕……比如`LIST_INSERT_BEFORE`函数：

```c
/*
 * Insert the element "elm" *before* the element "listelm" which is
 * already in the list.  The "field" name is the link element
 * as above.
 */
#define LIST_INSERT_BEFORE(listelm, elm, field) do {                    \
                (elm)->field.le_prev = (listelm)->field.le_prev;        \
                LIST_NEXT((elm), field) = (listelm);                    \
                *(listelm)->field.le_prev = (elm);                      \	
                (listelm)->field.le_prev = &LIST_NEXT((elm), field);    \	
        } while (0)
```

这里的9是`*((listelm)->field.le_prev)`，也就是`listelm`的上一个`preelm`的`next`指向插入的`elm`；10则是让`listelm`的`prev`指针指向`elm`的`next`指针，从而实现链表的前插操作。

再次祭出这张群友发的图（现在想想数据结构是大一下，彼时是大二下的助教们大概率就是从OS课上获得的灵感）：

![](https://pic.downk.cc/item/5e78981c5c56091129c65218.png)

所以`LIST_REMOVE`函数就是这么写的：

```c
/*
 * Remove the element "elm" from the list.
 * The "field" name is the link element as above.
 */
#define LIST_REMOVE(elm, field) do {                                    \
                if (LIST_NEXT((elm), field) != NULL)                    \
                        LIST_NEXT((elm), field)->field.le_prev =        \
                                        (elm)->field.le_prev;           \
                *(elm)->field.le_prev = LIST_NEXT((elm), fieldc);       \
        } while (0)
```

要从链表中删除`elm`，那么就先把`elm`的下一个元素的`prev`指针设置为`elm`的前一个元素的`next`，再将`elm`的上一个`preelm`的`next`指向后一个`elm`。删除这个元素只需知道其自身。

最后是思维导图式的难点树——

![](G:\OneDrive\OneDrive - buaa.edu.cn\MWD\学习\操作系统\作业\Refer\内存管理难点.png)



## 三、体会与感想

**Lab2难度评价：**★★★★☆

**Lab2-extra难度评价：**★★★☆☆

**花费时间：**Lab2 15h，Lab2-extra 4h

**体会和感想：**

第二次Lab我也写了很久，总结发在了自己的暂定·博客里——https://mondaycha.github.io/2020/03/29/329-1/。

这也是一次很有挑战性的Lab，分值也很高。感谢学长的资料以及群里的讨论，让我学到了很多。OS对自学的要求很高，之后也要继续加油。


:::note
这是一篇从Hexo迁移的文章，创建于2020-04-04 18:37:09
:::
