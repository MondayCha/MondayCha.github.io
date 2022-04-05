---
title: 操作系统 OS Lab4-extra 学习笔记
---

# Lab4-extra 学习笔记

Extra，干巴爹。

（5/9，刚刚才知道今年的Extra基础是去年的Exam1，我biss……）



## 基础测试1

### 题目要求

实现可变参数的系统调用参数传递。



### 题目解析

之前提到过，syscall 开头的函数与内核中的系统调用函数（sys 开头的函数）是一一对应的。调用过程如下：

```c
int
syscall_mem_map(u_int srcid, u_int srcva, u_int dstid, u_int dstva, u_int perm)
{
	return msyscall(SYS_mem_map, srcid, srcva, dstid, dstva, perm);
}
```

所以现在就要指定参数数目，在原有lib/syscall_all.c中代码不更改的情况下可以使系统调用机制正常运行。

指导书提示我们学习printf的实现方式，下面就来看看。



### Printf

首先是lib/printf.c中的实现：

```c
void printf(char *fmt, ...)				// printf有一个固定参数fmt
{
        va_list ap;						// 定义了一个指针ap, 用于指示可选的参数
        va_start(ap, fmt);				// 以固定参数的地址为起点，确定变参的内存起始地址
        lp_Print(myoutput, 0, fmt, ap);	// 将printf的va_list传递给lp_Print
        va_end(ap);						// 清空参数列表, 并置参数指针ap无效
}
```

除了有一个参数fmt固定以外，后面跟的参数的个数和类型是可变的（用三个点“…”做参数占位符）。这里我们实际上是将printf的可变长参数直接传递给lp_Print，后者在在Lab1实现过，也比较复杂。关于那几个宏定义的作用，参考这里的解释：

> （1）va_list 
> 　　定义了一个指针arg_ptr, 用于指示可选的参数.
>
> （2）va_start(arg_ptr, argN)
>  　使参数列表指针arg_ptr指向函数参数列表中的第一个可选参数，argN是位于第一个可选参数之前的固定参数, 或者说最后一个固定参数.如有一va函数的声明是void va_test(char a, char b, char c, ...), 则它的固定参数依次是a,b,c, 最后一个固定参数argN为c, 因此就是va_start(arg_ptr, c).
>
> （3）va_arg(arg_ptr, type)
>  返回参数列表中指针arg_ptr所指的参数, 返回类型为type. 并使指针arg_ptr指向参数列表中下一个参数.返回的是可选参数, 不包括固定参数.
>
> （4）va_end(arg_ptr)
>  清空参数列表, 并置参数指针arg_ptr无效.
>
>   （注：va在这里是variable-argument(可变参数)的意思.  这些宏定义在stdarg.h中,所以用到可变参数的程序应该包含这个头文件）

以上知识均在基础中没有用。



### 具体实现

首先修改user/lib.h中的msyscall函数声明：

```c
//////////////////////////////////////////////////syscall_lib
extern int msyscall(int, int, ...);
```

C语言调用汇编函数，用extern关键字定义。在syscall_* 系列函数中，我们将参数传递给了msyscall 函数。

在MIPS 的调用规范中，进入函数体时会通过对栈指针做减法的方式为自身的局部变量、返回地址、调用函数的参数分配存储空间（叶函数没有后两者），在函数调用结束之后会对栈指针做加法来释放这部分空间，我们把这部分空间称为栈帧（Stack Frame）。非叶函数是在调用方的栈帧的底部预留被调用函数的参数存储空间（被调用方从调用方函数的栈帧中取得参数）。

msyscall叶函数没有局部变量，不需要分配栈帧，我们只需要执行特权指令（syscall）来陷入内核态以及函数调用返回即可。在通过特权指令syscall 陷入内核态后，处理器将PC 寄存器指向一个相同的内核异常入口。在trap_init 函数中将系统调用类型的异常的入口设置为了handle_sys 函数，这就是我们要修改的第二个地方：修改lib/syscall.S，增加拷贝多个参数的循环。

> TIPS：汇编内的跳转注意延迟槽，内核态参数拷贝时注意使用s0-s7保存栈空间

```c
NESTED(handle_sys,TF_SIZE, sp)
    SAVE_ALL                            // 用于保存所有寄存器的汇编宏
    CLI                                 // 用于屏蔽中断位的设置的汇编宏
    nop
    .set at                             // 恢复$at寄存器的使用

	lw 		t0, TF_EPC(sp) 				// 将Trapframe的EPC寄存器取出
	addu 	t0, 4 						// 计算一个合理的值
	sw 		t0, TF_EPC(sp) 				// 存回Trapframe中

	lw 		a0, TF_REG4(sp) 			// 将系统调用号“复制”入寄存器$a0

    addiu   a0, a0, -__SYSCALL_BASE     // a0 <- “相对”系统调用号
    sll     t0, a0, 2                   // t0 <- 相对系统调用号* 4
    la      t1, sys_call_table          // t1 <- 系统调用函数的入口表基地址
    addu    t1, t1, t0                  // t1 <- 特定系统调用函数入口表项地址
    lw      t2, 0(t1)                   // t2 <- 特定系统调用函数入口函数地址

    lw      t0, TF_REG29(sp)            // t0 <- 用户态的栈指针

    /* lw      t3, 16(t0)                  // t3 <- msyscall的第5个参数 */
    /* lw      t4, 20(t0)                  // t4 <- msyscall的第6个参数 */

    // TODO: Allocate a space of six arguments on current kernel stack and copy the six arguments to proper location
    lw      a0, TF_REG4(sp)
    lw      a1, TF_REG5(sp)

    li		s0, 0		                // 当前参数个数

    beq		s0, a1, labelend	        // if s0 == a1 then target
    nop
    lw      a2, TF_REG6(sp)
    addiu   s0, s0, 1                   // s0 = 1

    beq		s0, a1, labelend	        // if s0 == a1 then target
    nop
    lw      a3, TF_REG7(sp)
    addiu   s0, s0, 1                   // s0 = 2

    li		s1, 16		                // 当前栈高度

fori:
    beq		s0, a1, beforej	            // if s0 == a1 then target
    nop
    addiu   s0, s0, 1                   // s0 = s0 + 1
    addiu   s1, s1, 4                   // s1 = s1 + 4
    j       fori
    nop

beforej:
    subu	sp, sp, s1			        // sp = sp - s1
    li      s0, 2                       // 当前已保存的参数个数
    addiu   s2, t0, 16                  // tf寄存器偏移量，每次步进4
    addiu   s3, sp, 16                  // sp寄存器偏移量，每次步进4

forj:
    beq		s0, a1, labelend	        // if s0 == a1 then target
    nop
    
    lw      t3, 0(s2)                   // t3 <- msyscall的第((s2 - t0) / 4 + 1)个参数
    sw      t3, 0(s3)
    addiu   s0, s0, 1                   // s0 = s0 + 1
    addiu   s2, s2, 4
    addiu   s3, s3, 4
    j       forj
    nop
    
labelend:

    jalr    t2                          // Invoke sys_* function
    nop
    
    // TODO: Resume current kernel stack
	addiu 	sp, sp, s1

    sw      v0, TF_REG2(sp)             // Store return value of function sys_* (in $v0) into trapframe

    j       ret_from_exception          // Return from exeception
    nop
END(handle_sys)
```







# PB,YYDS
































:::note
这是一篇从Hexo迁移的文章，创建于2020-05-06 18:22:36
:::
