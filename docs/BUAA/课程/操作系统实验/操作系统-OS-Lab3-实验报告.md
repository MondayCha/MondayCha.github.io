---
title: 操作系统 OS Lab3 实验报告
---

# OS Lab3 实验报告



## 一、实验思考题



### Thinking 3.1

为什么我们在构造空闲进程链表时必须使用特定的插入的顺序？(顺序或者逆序)

答：

因为注释要求“确保在插入之后，env在列表中的顺序应该与envs数组中的相同”，这样就会使第一次调用env_alloc()时返回envs[0]。



### Thinking 3.2

思考env.c/mkenvid 函数和envid2env 函数:

- 请你谈谈对mkenvid 函数中生成id 的运算的理解，为什么这么做？
- 为什么envid2env 中需要判断e->env_id != envid 的情况？如果没有这步判断会发生什么情况？

答：

(1) 生成ID的式子为`return (++next_env_id << (1 + LOG2NENV)) | idx;`，其中1-10位是对应进程在envs数组中的下标；12位起是由mkenvid被调用次数形成的唯一ID，这样做可以确保生成新进程id都是唯一的。

(2) 因为envid2env 中e是通过宏`ENVX()`获取envid的低10位，从而获得进程在envs数组中的下标，而不同进程可能在envs数组中有相同的下标，如果没有这步判断可能导致返回错误进程，因此需要用e->env_id != envid验证从envs数组中获取的进程是否为所需进程。



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



### Thinking 3.4

思考user_data 这个参数的作用。没有这个参数可不可以？为什么？（如果你能说明哪些应用场景中可能会应用这种设计就更好了。可以举一个实际的库中的例子）

答：

不可以。在我们的实验中，与user_data有关的函数是load_icode、load_elf、load_icode_mapper，其中的user_data就是进程e的指针，是不可或缺的。

应用场景：load_icode_mapper是一个回调函数，回调函数就是允许用户把需要调用的函数的指针作为参数传递给一个函数，以便该函数在处理相似事件的时候可以灵活的使用不同的方法。C语言标准库`<stdlib.h>`中的排序qsort就用到了这种设计：

```c
void qsort(void*base,size_t num,size_t width,int(__cdecl*compare)(const void*,const void*));
```

这之中的compare就是回调函数，两个形参是const void *型，有着很高的泛用性，与user_data的设计类似。



### Thinking 3.5

结合load_icode_mapper 的参数以及二进制镜像的大小，考虑该函数可能会面临哪几种复制的情况？你是否都考虑到了？ （提示：1、页面大小是多少；2、回顾lab1中的ELF文件解析，什么时候需要自动填充.bss段）

答：

1. 若va不对齐，拷贝长度要选择BY2PG - offset和bin_size中的最小值，复制第一页。
2. i < bin_size时，如果i < bin_size - BY2PG，那么就以BY2PG步进，复制每一页；如果出现了BY2PG > bin_size - i的情况，那么依然要分配一页的空间。
3. 如果i仍然小于sgsize，需要继续申请页面并置0。

.bss 段是全部要置零，也就包含在置零的空间中。



### Thinking 3.6

思考上面这一段话，并根据自己在lab2 中的理解，回答：

- 我们这里出现的” 指令位置” 的概念，你认为该概念是针对虚拟空间，还是物理内存所定义的呢？
- 你觉得entry_point其值对于每个进程是否一样？该如何理解这种统一或不同？

答：

(1) 虚拟空间。当我们运行进程时，CPU 将自动从pc所指的位置开始执行二进制码，此时的空间是连续的，而虚拟空间对应的物理内存可能是不连续的，因此是虚拟空间。

(2) 一样。每个进程都有独立的虚拟空间，因此entry_point其值对于每个进程一样，是程序入口；但entry_point实际映射的物理地址不同。



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

(1) TIMESTACK以下`[TIMESTACK - sizeof(struct Trapframe), TIMESTACK)`的空间存储着异常发生时的寄存器信息，是时钟中断的存储区。

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

其中的0x82000000即TIMESTACK的值。本次实验产生的都是时钟中断（4号异常），进行的是`li	sp, 0x82000000`的操作，因此是时钟中断的存储区。

(3) TIMESTACK是时钟中断的存储区，而KERNEL_SP应当是系统调用的存储区。

[参考资料]: https://www.cnblogs.com/SivilTaram/p/oslab3.html



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
	sw	sp, KERNEL_SP			// 保存堆栈现场到KERNEL_SP
setup_c0_status STATUS_CU0|0x1001 0	// 设置CP0_STATUS，set为0x10001001
	jr ra						// 函数返回

	nop							// 延迟槽
END(set_timer)					// 结束函数
```



### Thinking 3.10

阅读相关代码，思考操作系统是怎么根据时钟周期切换进程的。

答：

1. 首先在set_timer设置实时钟中断的频率，实验中为1秒1次。
2. 一旦实时钟中断产生，就会触发MIPS 4号中断，从而MIPS 将PC 指向0x80000080，从而跳转到.text.exc_vec3代码段执行。
3. 通过text.exc_vec3代码段的分发，调用handle_ int 函数来处理实时钟中断。
4. 在handle_ int 判断CP0_CAUSE寄存器是不是对应的4 号中断位引发的中断，如果是，则执行中断服务函数timer_ irq。
5. 在timer_ irq里跳转到sched_ yield，如果当前进程的时间片用完了，则切换到下一个进程。






:::note
这是一篇从Hexo迁移的文章，创建于2020-04-24 18:43:36
:::
