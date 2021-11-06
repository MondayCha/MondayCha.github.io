---
title: 操作系统 OS Lab3 学习笔记
---

今天的内容是OS Lab3的学习复习笔记，然后下午去写理论课第八次作业。

在一开始同样放下优秀学长博客——

> https://www.cnblogs.com/SivilTaram/p/oslab3.html
>
> https://ausar.xyz/index.php/archives/75/

Lab3的内容是进程与异常，将运行一个用户模式的进程。需要使用数据结构进程控制块 Env 来跟踪用户进程。通过建立一个简单的用户进程，加载一个程序镜像到进程控制块中，并让它运行起来。



## 进程控制块

进程控制块(PCB) 是系统为了管理进程设置的一个专门的数据结构，用它来记录进程的外部特征，描述进程的运动变化过程。



### Exercise 3.2

需要补充env_init 函数。

```c
/*** exercise 3.2 ***/
void env_init(void)
{
    int i;
    /*Step 1: Initial env_free_list. */
    LIST_INIT(&env_free_list);		
    // 初始化env_free_list
    LIST_INIT(&env_sched_list[0]);
    LIST_INIT(&env_sched_list[1]);
    // 根据调度方法进行初始化，我把这步放在了env_init(void)函数里

    /*Step 2: Traverse the elements of 'envs' array,
     * set their status as free and insert them into the env_free_list.
     * Choose the correct loop order to finish the insertion.
     * Make sure, after the insertion, the order of envs in the list
     * should be the same as it in the envs array. */
    for (i = NENV - 1; i >= 0; i--)	// 倒序插入，总共是1024个进程
    {
        envs[i].env_status = ENV_FREE;
        /* 初始化进程状态
         * 有ENV_FREE，ENV_NOT_RUNNABLE，ENV_RUNNABLE三种
         * ENV_FREE : 表明该进程是不活动的，即该进程控制块处于进程空闲链表中。
         * ENV_NOT_RUNNABLE : 表明该进程处于阻塞状态
         * 处于该状态的进程往往在等待一定的条件才可以变为就绪状态从而被CPU 调度。
         * ENV_RUNNABLE : 表明该进程处于就绪状态，正在等待被调度
         * 但处于RUNNABLE 状态的进程可以是正在运行的，也可能不在运行中 */
        LIST_INSERT_HEAD(&env_free_list, &envs[i], env_link);
    }
}
```

LIST_INSERT_HEAD效率高，采用逆序插入，确保在插入之后，env在列表中的顺序应该与envs数组中的相同，这样就会使第一次调用env_alloc()时返回envs[0]。

复习一下LIST_INSERT_HEAD，传入的三个参数分别为链表头、插入元素、链表指针。

```c
#define LIST_INSERT_HEAD(head, elm, field) do {                         \
                if ((LIST_NEXT((elm), field) = LIST_FIRST((head))) != NULL)     \
                        LIST_FIRST((head))->field.le_prev = &LIST_NEXT((elm), field);\
                LIST_FIRST((head)) = (elm);                                     \
                (elm)->field.le_prev = &LIST_FIRST((head));                     \
        } while (0)
```

在Lab3要区分清楚env_link和env_sched_link。



### Thinking 3.1

为什么我们在构造空闲进程链表时必须使用特定的插入的顺序？(顺序或者逆序)

答：

因为注释要求“确保在插入之后，env在列表中的顺序应该与envs数组中的相同”，这样就会使第一次调用env_alloc()时返回envs[0]。

（是为了Lab 4 Extra 进阶 Part 2，Pb在5月5日如是说）



## 进程的标识

每个进程都有独一无二的标识符，在创建每个新的进程的时候必须为它赋予一个与众不同的id来作为它的标识符，mkenvid的作用就是生成一个新的进程id。

```c
u_int mkenvid(struct Env *e)
{
    static u_long next_env_id = 0;

    /*Hint: lower bits of envid hold e's position in the envs array. */
    u_int idx = e - envs;

    /*Hint:  high bits of envid hold an increasing number. */
    return (++next_env_id << (1 + LOG2NENV)) | idx;
}
```

extra就涉及对这个的修改。在这里我其实是比较疑惑的，我们的操作系统设置的最大进程数目为1024，也就是idx的取值范围，按理说next_env_id只需要左移10位就可以满足需求，PB在群里问了操作系统的WL老师，表示和GET_ENV_ASID这个宏有关：

```c
#define GET_ENV_ASID(envid) (((envid)>> 11)<<6)
```

想了想可能和操作系统改成大猩猩也能看懂的实验课（此处为青猪梗，我完全看不懂）之前是支持理论最多2048个进程有关，比如Windows 32位系统中就是这样（不过一个进程能使用的最大虚拟内存为2G，而一个线程的默认线程栈为1M，一般在线程数接近2000时就异常退出了）。



### Exercise 3.3

需要补充envid2env函数，将一个envid转换为一个env指针，按照注释做就行。

用宏ENVX()从envid获取对应结构体在envs中的下标：

```c
#define ENVX(envid)	((envid) & (NENV - 1))
```



### Thinking 3.2

思考env.c/mkenvid 函数和envid2env 函数:

- 请你谈谈对mkenvid 函数中生成id 的运算的理解，为什么这么做？
- 为什么envid2env 中需要判断e->env_id != envid 的情况？如果没有这步判断会发生什么情况？

答：

(1) 生成ID的式子为`return (++next_env_id << (1 + LOG2NENV)) | idx;`，其中1-10位是对应进程在envs数组中的下标；12位起是由mkenvid被调用次数形成的唯一ID，这样做可以确保生成新进程id都是唯一的。

(2) 因为envid2env 中e是通过宏`ENVX()`获取envid的低10位，从而获得进程在envs数组中的下标，而不同进程可能在envs数组中有相同的下标，如果没有这步判断可能导致返回错误进程，因此需要用e->env_id != envid验证从envs数组中获取的进程是否为所需进程。



## 设置进程控制块

创建进程需要手动初始化进程控制块。



### Exercise 3.4

需要填写env_setup_vm函数，为env_alloc做准备。

先看看这不说人话的注释——

```c
/*Step 2: Call certain function(has been implemented) to init kernel memory
* layout for this new Env.
*The function mainly maps the kernel address to this new Env address. */
```

这个函数env_setup_vm将内核地址映射到新的Env地址，也就是初始化新进程的地址空间。

在env_setup_vm代码中预设置了int型变量i和r，i大概是用在循环体上，r则是用于错误返回值（0是无事发生），这些在其他模块中也常常见到。

```c
    if (r = page_alloc(&p))
    {
        panic("env_setup_vm - page alloc error\n");
        return r;
    }
    p->pp_ref++;
    pgdir = page2kva(p);
```

第一步先从页表中申请一页p，作为页目录使用，这样这个进程也具有成为临时内核的资格。为其设置pp_ref，并把这一页的内核虚拟地址保存到pgdir。

对于不同的进程而言，虚拟地址ULIM(`0x80000000`)以上的地方，虚拟地址到物理地址的映射关系都是一样的。而这里我们是从UTOP开始拷贝的，这里就有一个疑问——**UTOP不是在ULIM下面吗，属于用户地址，为什么是从这里拷贝的呢？**

这里再搬出mmu的图：

```c
/*
 o      ULIM     -----> +----------------------------+------------0x8000 0000-------    
 o                      |         User VPT           |     PDMAP                /|\ 
 o      UVPT     -----> +----------------------------+------------0x7fc0 0000    |
 o                      |         PAGES              |     PDMAP                 |
 o      UPAGES   -----> +----------------------------+------------0x7f80 0000    |
 o                      |         ENVS               |     PDMAP                 |
 o  UTOP,UENVS   -----> +----------------------------+------------0x7f40 0000    |
 o  UXSTACKTOP -/       |     user exception stack   |     BY2PG                 |
*/
```

UTOP同样也是UENVS，而在3.1的mips_vm_init()，我们有这样一条操作：

```c
/* Step 3, Allocate proper size of physical memory for global array `envs`,
 * for process management. Then map the physical address to `UENVS`. */
envs = (struct Env *)alloc(NENV * sizeof(struct Env), BY2PG, 1);
n = ROUND(NENV * sizeof(struct Env), BY2PG);
boot_map_segment(pgdir, UENVS, n, PADDR(envs), PTE_R);
```

在这里创建一个struct Env数组，大小为NENV个元素，而这也是全局的进程数组。通过boot_map_segment将envs对应的物理地址映射到虚拟地址UENVS，也就是说，这一块区域存储着所有的进程（mmu图中的ENVS）。

引用SivilTaram学长的解释——

> 其实足以看出来，内核在映射的时候已经为用户留下了一条路径！一条获取其他进程信息的路途！而且我们其实可以知道，这一部分对于进程而言应当是只能读不可以写的。开启中断后我们在进程中再访问内核就会产生异常来陷入内核了，所以应该是为了方便读一些进程信息，内核专门开辟了这4M的用户进程虚拟区。用户读这4M空间的内容是不需要产生异常的。

嗯……果然我还是不大懂，然后就跟着注释把[0，UTOP)的进程页目录清零。

```c
    /*Step 2: Zero pgdir's field before UTOP. */
    for (i = 0; i < PDX(UTOP); i++)
    {
        pgdir[i] = 0;
    }
```

拷贝内核虚拟页目录的[UTOP,0xffffffff)区间的内容到进程页目录。

```c
    /*Step 3: Copy kernel's boot_pgdir to pgdir. */
    for (i = PDX(UTOP); i < PDX(0xffffffff); i++)
    {
        pgdir[i] = boot_pgdir[i];
    }
```
之后将pgdir保存在e->pgdir，将pgdir的物理地址保存到e->env_cr3中，并将其映射到进程页表中——

```c
    // UVPT maps the env's own page table, with read-only permission.
    e->env_pgdir[PDX(UVPT)] = e->env_cr3 | PTE_V;	// read-only
```



### Thinking 3.3

结合include/mmu.h 中的地址空间布局，思考env_setup_vm 函数：

- 我们在初始化新进程的地址空间时为什么不把整个地址空间的pgdir 都清零，而是复制内核的boot_pgdir作为一部分模板？(提示:mips 虚拟空间布局)
- UTOP 和ULIM 的含义分别是什么，在UTOP 到ULIM 的区域与其他用户区相比有什么最大的区别？
- 在env_setup_vm 函数的最后，我们为什么要让pgdir[PDX(UVPT)]=env_cr3?(提示: 结合系统自映射机制)
- 谈谈自己对进程中物理地址和虚拟地址的理解

答：

(1) 根据mmu.h里面的布局，我们的操作系统是2G/2G 模式，在本实验中，UTOP以上的虚拟地址空间到物理地址的映射关系都是一样的。因此复制内核的boot_pgdir中UTOP以上的内容到pgdir中，在进入内核态时不需要切换CR3寄存器。

(2) ULIM划分了用户空间与内核空间，UTOP属于用户空间，但UTOP至ULIM的区域与其他用户区相比，用户只能读不能写，其由三个4M大小的空间组成，分别存放进程envs数组、pages数组、进程页表。

(3) UVPT(0x7fc00000) 到 ULIM(0x80000000) 之间的空间为4MB ，这一区域就是进程的页表的位置，而PDX(UVPT)就是页目录自映射所对应的页目录在页表中的位置，因此要让pgdir[PDX(UVPT)]=env_cr3。

(4) 不同进程有各自的虚拟空间，访问相同虚拟地址时得到的结果可能是不同的；对于不同的进程而言，虚拟地址ULIM 以上的地方虚拟地址到物理地址的映射关系都是一样的，方便内核对进程进行管理。



### Exercise 3.5

补充env_alloc，根据父进程生成子进程到new指针中，首先从env_free_list获取第一个空闲进程。

```c
/*Step 1: Get a new Env from env_free_list*/
if (LIST_EMPTY(&env_free_list))
{
    return -E_NO_FREE_ENV;
}
e = LIST_FIRST(&env_free_list);
```

接下来就要为这个纯洁的e进程分配地址空间，用之前写过的env_setup_vm实现映射。

```c
r = env_setup_vm(e);
if (r != 0)
{
	panic("env_setup_vm failed!");
}
```

然后创建独一无二的ID，设置进程状态。ENV_RUNNABLE表明该进程处于就绪状态，正在等待被调度。

```c
/*Step 3: Initialize every field of new Env with appropriate values.*/
e->env_id = mkenvid(e);
e->env_parent_id = parent_id;
e->env_status = ENV_RUNNABLE;
```

接下来就是设置29号寄存器（SP寄存器，堆栈指针寄存器）和cp0寄存器（协处理器）的值，把e的值交给new，并从空闲进程链表中删去e。

```c
/*Step 4: Focus on initializing the sp register and cp0_status of env_tf field, located at this new Env. */
e->env_tf.regs[29] = USTACKTOP;
e->env_tf.cp0_status = 0x10001004;
*new = e;

/*Step 5: Remove the new Env from env_free_list. */
LIST_REMOVE(e, env_link);
```

世界是多么的美好啊！接下来就是本次实验的坑点了，虽然我Debug3天的原因是Lab2写错……



## 加载二进制镜像

我们需要为新进程的程序分配空间来容纳程序代码，这也是本次实验的大难点了。



### Thinking 3.4

思考user_data 这个参数的作用。没有这个参数可不可以？为什么？（如果你能说明哪些应用场景中可能会应用这种设计就更好了。可以举一个实际的库中的例子）

答：

不可以。在我们的实验中，与user_data有关的函数是load_icode、load_elf、load_icode_mapper，其中的user_data就是进程e的指针，是不可或缺的。

应用场景：load_icode_mapper是一个回调函数，回调函数就是允许用户把需要调用的函数的指针作为参数传递给一个函数，以便该函数在处理相似事件的时候可以灵活的使用不同的方法。C语言标准库`<stdlib.h>`中的排序qsort就用到了这种设计：

```c
void qsort(void*base,size_t num,size_t width,int(__cdecl*compare)(const void*,const void*));
```

这之中的compare就是回调函数，两个形参是const void *型，有着很高的泛用性，与user_data的设计类似。



### Exercise 3.6

填充load_icode_mapper 函数。复制下助教的Lab3释疑解惑的内容，这样下次就不需要找PDF了。

```c
struct Env *env = (struct Env *)user_data;
struct Page *p = NULL;
u_long i = 0;
int r;
u_long offset = va - ROUNDDOWN(va, BY2PG);
```

> 这个函数集前三个lab 知识之大成，一定要熟悉lab1 中的ELF 结构和lab2 中内存分配的方法！在填写这个函数之前，要先知道它是干什么的。我们现在已经完成实验的第三步--- 创建进程中的第一小步，现在已经有了空进程，但只有骨架没有灵魂怎么行？一个进程是一个程序的一次运行，所以现在就要把程序装进给进程分配的内存空间中。
>
> 这一任务由load_icode 函数来完成，它的步骤就是分配内存，并将二进制代码装入分配好的内存中。但它一个函数要承担这么大的任务，有点吃不消啊。所以它就把装入内存的任务交给了load_elf 函数。但装入内存的任务还是有点艰巨，不仅要解析ELF 结构，还要把ELF 的内容复制到分配好的内存中。这函数比较懒，就又把内容复制的任务交给了load_icode_mapper。这下终于不再嵌套了，好像身体被掏空是不是？别急，先来看看这个函数。这个函数如果完成了，lab3 也就没啥难的了。
>
> 这个函数大体上也是两步走，第一步，复制ELF 的内容（当然，必须是代码段和全局数据段）。第二步就是难中之难，给ELF 的内容分配页面。
>
> 现在二进制码长度已经由它的参数bin_size 传入了。那又跑出一个段长度sgsize 是什么鬼？还记得lab1 的readelf 吧，二进制码长度bin_size 等于代码段.text 和全局数据段.data 长度之和，但不一定等于ELF 要占用的内存大小。回顾lab1 中的ELF 结构，代码段是通过program header 定位的，每个头部都有一个filesize 和memsize，就分别对应bin_size 和sgsize。别忘了ELF 中还有一个.bss 段哦，这.bss 段是全部要置零的，所以无需在ELF 中体现，但并不代表它就不占内存。那么请你想一下，bin_size 和sgsize 满足什么样的不等式？.bss 段的起始地址和bin_size 是什么关系？这是该函数的第一个难点。
>
> 前门狼刚走，后门虎又来。看看函数前面的说明，pre_condition 中有一条提示：va may NOT aligned 4KB。这提示了什么？lab2 中我们实现的是页式内存管理，一页的大小是4KB（BY2PG），也就是说，一个页的首地址的十六进制表示的后三位都是0。如果va 不是一个页的首地址，比如0x0003f2d4，该如何处理呢？那么同样的问题，如果.bss 段的首地址不是页对齐的，又该如何处理呢？提示：善于利用offset 变量。再给一个提示，在一段内存不满一个页（4KB）的情况下，仍然要分配一整个页来存储，就像出租车计费，就算你多走了100 米也会按1 公里算。

函数大致的作用是把大小为bin_size的*bin文件，拷贝到[va，va+sgsize]这个区间中，不足地方补零，在一段内存不满一个页（4KB）的情况下，仍然要分配一整个页来存储。由于va不一定对齐，拷贝分为三个步骤：

1. **不对齐时，载入第一页：**

```c
/*Step 1: load all content of bin into memory. */
/*First, bin->[0,BY2PG-offset] to [offset,BY2PG]*/
if (offset)
{
    u_int32_t size = MIN(BY2PG - offset, bin_size);
    r = page_alloc(&p);
    if (r)
        return r;
    bcopy(&bin[i], page2kva(p) + offset, size);
    r = page_insert(env->env_pgdir, p, va, PTE_R);
    if (r)
        return r;
    i += size;
}
```

2. **载入第二页直到拷贝完整个文件，此时i始终与BY2PG对齐：**

```c
while (i < bin_size)
{
    u_int32_t size = MIN(BY2PG, bin_size - i);
    r = page_alloc(&p);
    if (r)
        return r;
    bcopy(&bin[i], page2kva(p), size);
    r = page_insert(env->env_pgdir, p, va + i, PTE_R);
    if (r)
        return r;
    i += MIN(BY2PG, sgsize - i);
}

// i = MIN(ROUND(bin_size, BY2PG),sgsize)
```

3. **填充后面的0：**

```c
/*Step 2: alloc pages to reach `sgsize` when `bin_size` < `sgsize`.
    * hint: variable `i` has the value of `bin_size` now! */
while (i < sgsize)
{
    u_int32_t size = MIN(BY2PG, sgsize - i);
    r = page_alloc(&p);
    if (r)
        return r;
    r = page_insert(env->env_pgdir, p, va + i, PTE_R);
    if (r)
        return r;
    // bzero(page2kva(p), size); // already bzero in page_alloc
    i += size;
}
return 0;
```

需要注意的就是填充0吧，i在最开始对齐之后就保持BY2PG步进，直到sgsize加载完毕。

这个在补充指导书里讲的还蛮详细的。在每一阶段，要做的都是申请页面、复制/填0、插入页表，而因为page_alloc就包含了bzero操作，实际补0只要申请页面然后加入页表就可以了。



### Thinking 3.5

结合load_icode_mapper 的参数以及二进制镜像的大小，考虑该函数可能会面临哪几种复制的情况？你是否都考虑到了？ （提示：1、页面大小是多少；2、回顾lab1中的ELF文件解析，什么时候需要自动填充.bss段）

答：

1. 若va不对齐，拷贝长度要选择BY2PG - offset和bin_size中的最小值，复制第一页。
2. i < bin_size时，如果i < bin_size - BY2PG，那么就以BY2PG步进，复制每一页；如果出现了BY2PG > bin_size - i的情况，那么依然要分配一页的空间。
3. 如果i仍然小于sgsize，需要继续申请页面并置0。

.bss 段是全部要置零，也就包含在置零的空间中。



### Exercise 3.7

通过补充的ELF 知识与注释，填充load_elf 函数和load_icode函数。

load_elf只要填map就好了——

```c
r = map(phdr->p_vaddr, phdr->p_memsz, phdr->p_offset + binary, phdr->p_filesz, user_data);
```

这里的bin为什么是phdr->p_offset + binary呢？

```c
typedef struct {
    Elf32_Word p_type; /* Segment type */
    Elf32_Off p_offset; /* Segment file offset */
    Elf32_Addr p_vaddr; /* Segment virtual address，
    这就是需要映射的虚拟地址*/
    Elf32_Addr p_paddr; /* Segment physical address */
    Elf32_Word p_filesz; /* Segment size in file */
    Elf32_Word p_memsz; /* Segment size in memory */
    Elf32_Word p_flags; /* Segment flags */
    Elf32_Word p_align; /* Segment alignment */
} Elf32_Phdr;
```

参考ELF手册，此数据成员给出本段内容在文件中的位置，即段内容的开始位置相对于文件开头的偏移量。

load_icode首先设置用户用户栈，分配一页的空间在[UTOP，UTOP-BY2PG]区间。而我的问题就在于page_insert写错……啊啊啊啊啊理解不深入真的太惨了。

```c
/*Step 1: alloc a page. */
r = page_alloc(&p);
if (r)
    panic("page_alloc in load_icode failed");

/*Step 2: Use appropriate perm to set initial stack for new Env. */
/*Hint: Should the user-stack be writable? */
r = page_insert(e->env_pgdir, p, USTACKTOP - BY2PG, perm);
if (r)
    panic("page_insert in load_icode failed");
```

然后调用load_elf，套娃~

```c
/*Step 3:load the binary using elf loader. */
r = load_elf(binary, size, &entry_point, (void *)e, load_icode_mapper);
if (r)
    panic("load_elf in load_icode failed");

/*Step 4:Set CPU's PC register as appropriate value. */
e->env_tf.pc = entry_point;
```

最后记得设置PC寄存器到程序入口。关于这里引用学长的分析——

> 那么下面来解释一下为什么这里用的是page2kva(page)，而不是用与UTEXT有关的数值？
>
> 首先我们解释过了，UTEXT+0xb0是程序的入口，何谓入口？比如我们现在启动了一个进程，我们如何能从哪里开始，该怎样跑呢？这取决于我们run一个进程前的准备工作，当然这个工作在进程切换时也需要做，其中很重要的一点就是保存pc。这一点很重要，极其重要。如果是第一次run一个进程的时候，我们的pc是务必要被设置为UTEXT+0xb0的，这也是在env_alloc里面所做的工作。之后有一些我们没有关注过的汇编程序就会默默地根据我们设置的pc去找我们的程序入口，默默地执行，遇到中断默默地保存，切换。于是就这样完成了进程的运行与切换大计。
>
> 那么我们这里bcopy不能用UTEXT来copy是因为，我们这里还没开始一个进程，没有其页目录来作为基址，所以你现在copy到的地方也只是内核的UTEXT处。我们都知道在env_run时要切换页目录，切换为进程的页目录后，我们就再也找不到这部分copy的东西了（因为env_setup_vm只复制内核页目录ULIM以上的部分）。所以我们要copy到的地方一定是要内核和每个进程均可以访问的，显而易见要copy到ULIM以上的部分。即page2kva(page)这个地方。当然，你可以选择先切换到进程的页目录，然后copy，然后在结束的时候切换回内核的页目录，再次强调一点，bcopy也好，bzero也好，在我们编写的程序中，只要是作为访问地址来使用的（什么叫作为地址来使用，就是可以取其内容的 *address)，全部都使用的是虚拟地址！



### Thinking 3.6

思考上面这一段话，并根据自己在lab2 中的理解，回答：

- 我们这里出现的” 指令位置” 的概念，你认为该概念是针对虚拟空间，还是物理内存所定义的呢？
- 你觉得entry_point其值对于每个进程是否一样？该如何理解这种统一或不同？

答：

(1) 虚拟空间。当我们运行进程时，CPU 将自动从pc所指的位置开始执行二进制码，此时的空间是连续的，而虚拟空间对应的物理内存可能是不连续的，因此是虚拟空间。

(2) 一样。每个进程都有独立的虚拟空间，因此entry_point其值对于每个进程一样，是程序入口；但entry_point实际映射的物理地址不同。



## 创建进程

终于结束了最难的部分……下面来看看进程的创建吧！



### Exercise 3.8

完成env_create 函数与env_create_priority 的填写。

```c
void env_create_priority(u_char *binary, int size, int priority)
{
    struct Env *e;
    /*Step 1: Use env_alloc to alloc a new env. */
    int r;
    r = env_alloc(&e, 0);
    if (r)
        panic("env_alloc in env_create_priority failed");
    /*Step 2: assign priority to the new env. */
    e->env_pri = priority;

    /*Step 3: Use load_icode() to load the named elf binary,
      and insert it into env_sched_list using LIST_INSERT_HEAD. */
    load_icode(e, binary, size);
    
    LIST_INSERT_HEAD(&env_sched_list[0], e, env_sched_link);
}
```

先用env_alloc创建一个新进程，由于没有父进程，所以就把父进程id设置为0；然后设置进程优先级；最后调用load_icode载入二进制程序文件。为了调度，将进程插入到env_sched_list[0]中。

```c
void env_create(u_char *binary, int size)
{
    /*Step 1: Use env_create_priority to alloc a new env with priority 1 */
    env_create_priority(binary, size, 1);
}
```

env_create只要调用env_create_priority就好了。



### Exercise 3.9

在这次实验中我们没有用到env_create，而是用了一个宏——

```c
#define ENV_CREATE_PRIORITY(x, y) \
{\
        extern u_char binary_##x##_start[]; \
        extern u_int binary_##x##_size;\
        env_create_priority(binary_##x##_start, \
                (u_int)binary_##x##_size, y);\
}
```

`ENV_CREATE_PRIORITY(x,y)`等价于`env_create_priority(binary_x_start,binary_x_size,y)`。



## 进程运行与切换

env_run是进程运行使用的基本函数，它包括两部分：

- 保存当前进程上下文(如果当前没有运行的进程就跳过这一步)
- 恢复要启动的进程的上下文，然后运行该进程。



### Thinking 3.7

思考一下，要保存的进程上下文中的env_tf.pc的值应该设置为多少？为什么要这样设置？

答：

要保存的进程上下文中的env_tf.pc的值应该设置为cp0_epc，从而从被中断的指令继续运行。



### Thinking 3.8

思考TIMESTACK 的含义，并找出相关语句与证明来回答以下关于TIMESTACK 的问题：

- 请给出一个你认为合适的TIMESTACK 的定义
- 请为你的定义在实验中找出合适的代码段作为证据(请对代码段进行分析)
- 思考TIMESTACK 和第18 行的KERNEL_SP 的含义有何不同

答：

(1) TIMESTACK以下`[TIMESTACK - sizeof(struct Trapframe), TIMESTACK)`的空间存储着异常发生时的寄存器信息，是时钟中断后的存储区。

(2) 在include/stackframe.h中可以找到：

```c
.macro get_sp
	mfc0	k1, CP0_CAUSE
	andi	k1, 0x107C
	xori	k1, 0x1000
	bnez	k1, 1f
	nop
	li	sp, 0x82000000
	j	2f
	nop
1:
	bltz	sp, 2f
	nop
	lw	sp, KERNEL_SP
	nop

2:	nop


.endm
```

其中的0x82000000即TIMESTACK的值。本次实验产生的都是时钟中断，进行的是`li	sp, 0x82000000`的操作，因此是时钟中断后的存储区。

(3) TIMESTACK是时钟中断后的存储区，而KERNEL_SP应当是系统调用后的存储区。

[1]: https://www.cnblogs.com/SivilTaram/p/oslab3.html	"感谢学长的博客"



### Exercise 3.10

根据补充说明，填充完成env_run 函数。

```c
void env_run(struct Env *e)
{
    /*Step 1: save register state of curenv. */
    /* Hint: if there is an environment running, you should do
    *  switch the context and save the registers. You can imitate env_destroy() 's behaviors.*/
    if (curenv)
    {
        struct Trapframe *old;
        old = (struct Trapframe *)(TIMESTACK - sizeof(struct Trapframe));
        bcopy(old, &(curenv->env_tf), sizeof(struct Trapframe));
        curenv->env_tf.pc = curenv->env_tf.cp0_epc;
    }
    // 保存当前进程的上下文信息，设置当前进程上下文中的 pc 为合适的值。

    /*Step 2: Set 'curenv' to the new environment. */
    curenv = e;
    // 把当前进程 curenv 切换为需要运行的进程。

    /*Step 3: Use lcontext() to switch to its address space. */
    lcontext(e->env_pgdir);
    // 调用 lcontext 函数，设置进程的地址空间。

    /*Step 4: Use env_pop_tf() to restore the environment's
     * environment   registers and return to user mode.
     *
     * Hint: You should use GET_ENV_ASID there. Think why?
     * (read <see mips run linux>, page 135-144)
     */
    env_pop_tf(&(curenv->env_tf), GET_ENV_ASID(curenv->env_id));
    // 调用 env_pop_tf 函数，恢复现场、异常返回。
}
```

env_pop_tf把env里的tf压到寄存器中，进行返回，需要先设置lcontext切换进程页目录。



## 异常的分发

这一部分表面要做复读机，但代码理解起来好痛苦……啊啊啊我已经写了两天这个博客啦，这也太难过了为什么这么多不会根本理解不完啊……



### Exercise 3.11 

将异常分发代码填入boot/start.S 合适的部分，

```c
.section .text.exc_vec3
NESTED(except_vec3, 0, sp)
    .set noat 
    .set noreorder
1:
    mfc0 k1,CP0_CAUSE
    la k0,exception_handlers
    andi k1,0x7c
    addu k0,k1
    lw k0,(k0)
    nop
    jr k0
    nop
END(except_vec3)
.set at
```

这段异常分发代码的作用流程简述如下：

1. 取得异常码，这是区别不同异常的重要标志。
2. 以得到的异常码作为索引去exception_handlers 数组中找到对应的中断处理函数，后文中会有涉及。
3. 跳转到对应的中断处理函数中，从而响应了异常，并将异常交给了对应的异常处理函数去处理



### Exercise 3.12

将lds 代码补全使得异常后可以跳到异常分发代码，0x80000080地址存放的是异常处理程序的入口地址。

```c
. = 0x80000080;
.except_vec3 : {
    *(.text.exc_vec3)
}
```

这里将.text.exec_vec3 放到0x80000080，一旦异常发生，就会引起该段代码的执行。



## 异常向量组

填空题：阅读see-mips-run-linux中的关于异常码与异常类型的对应关系部分。

算数异常(OV)如加法溢出、减法溢出等异常，其对应的异常码为12。（来源：P78）



## 时钟中断

初始化时钟主要是在kclock_init 函数中，该函数主要调用set_timer函数。



### Exercise 3.13

补充kclock_init 函数。

```c
/*** exercise 3.13 ***/
void
kclock_init(void)
{
	// hint: use set_timer()
	set_timer();
}
```

虽然不是很理解但只要填就对了呢……



### Thinking 3.9

阅读 kclock_asm.S  文件并说出每行汇编代码的作用。

答：

```c
.macro	setup_c0_status set clr	// 定义宏setup_c0_status，传入set置位和clr清零形参
	.set	push				// 保存现场
	mfc0	t0, CP0_STATUS		// 读CP0_STATUS的值到t0寄存器		
	or	t0, \set|\clr			// t0=(t0|set|clr)，将set为1的置1
	xor	t0, \clr				// t0= xor(t0,clr)，将clr为1的置0
	mtc0	t0, CP0_STATUS		// 将t0寄存器写回CP0_STATUS
	.set	pop					// 恢复现场
.endm							// 结束宏语句			

	.text						// 代码段
LEAF(set_timer)					// LEAF定义不调用其他函数的叶子函数set_timer

	li t0, 0x01					// t0设为1
	sb t0, 0xb5000100			// 设置实时钟中断的频率为1秒1次
	sw	sp, KERNEL_SP			// 保存栈的值到KERNEL_SP
setup_c0_status STATUS_CU0|0x1001 0	// 设置CP0_STATUS
	jr ra						// 函数返回

	nop							// 延迟槽
END(set_timer)					// 结束函数
```



## 进程调度

最后一章了！



### Exercise 3.14

根据注释，完成sched_yield 函数的补充，并根据调度方法对 env.c 中的部分函数进行修改，使得进程能够被正确调度。

```c
void sched_yield(void)
{
    static int count = 0; // remaining time slices of current env
    static int point = 0; // current env_sched_list index
    static struct Env *e;

    while (count == 0)
    {
        if (LIST_EMPTY(&env_sched_list[point]))
        {
            point = 1 - point;
        }
        e = LIST_FIRST(&env_sched_list[point]);
        count = curenv->env_pri;
        LIST_REMOVE(e, env_sched_link);
        LIST_INSERT_HEAD(&env_sched_list[1 - point], e, env_sched_link);
    }
    count--;
    env_run(e);
}
```

参考Ausar的写法写的，马上的Thinking 3.10就要让我重新思考一遍。



### Thinking 3.10

阅读相关代码，思考操作系统是怎么根据时钟周期切换进程的。

答：

1. 首先在set_timer设置实时钟中断的频率，实验中为1秒1次。
2. 一旦实时钟中断产生，就会触发MIPS 4号中断，从而MIPS 将PC 指向0x80000080，从而跳转到.text.exc_vec3代码段执行。
3. 通过text.exc_vec3代码段的分发，调用handle_ int 函数来处理实时钟中断。
4. 在handle_ int 判断CP0_CAUSE寄存器是不是对应的4 号中断位引发的中断，如果是，则执行中断服务函数timer_ irq。
5. 在timer_ irq里跳转到sched_ yield，如果当前进程的时间片用完了，则切换到下一个进程。



## 总结

啊，抄完了，虚脱的感觉，我就是啥也不会的FW。

我就是啥也不会的FW。

我就是啥也不会的FW。

我就是啥也不会的FW。

我就是啥也不会的FW。

我就是啥也不会的FW。

我就是啥也不会的FW。

我就是啥也不会的FW。

我就是啥也不会的FW。

我就是啥也不会的FW。

认真你就输了。

工作你就输了。

我输了。

<p align="right">2020/4/25 21:02</p>
<p align="right">无可救药的码呆茶</p>

:::note
这是一篇从Hexo迁移的文章，创建于2020-04-24 18:22:36
:::
