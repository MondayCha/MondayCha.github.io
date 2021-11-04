---
authors: mondaycha
title: Windows 10 安装 Ubuntu 20.04 双系统不完全踩坑记录
date: '2021-02-04 06:17:25'
tags:
- OS
keywords:
- 学习
---
<!--truncate-->

> 2021.2.2 在第三次重装后终于成功了……记录下中间踩的坑
> 硬件设备: 联想Y7000 2018, GTX1050显卡

网上关于Windows 10 安装 Ubuntu双系统的文章已经非常多了，然而中间存在大量过时的内容，让人摸不到头脑。

这篇文章对于具体的安装流程仅是略微带过，重点放在遇到的坑点和如何优化双系统使用体验上。最后感谢 [@火村夕](https://zhuanlan.zhihu.com/people/7dc6cfef3681ffebfea8c09248694e7e) [@比企谷雪乃](https://zhuanlan.zhihu.com/people/f65376327795a1683cbf777170f30b0c) 大佬们在知乎评论区的指正，否则感觉这篇文章同样是误人子弟（捂脸）……


## 准备工作

首先需要划分出Ubuntu所需的硬盘空间，在Windows的磁盘管理中压缩卷即可，不需要分配盘符。

![](https://pic3.zhimg.com/v2-1c67104be0c9cfdad1692cf9e7f86012_b.png)

![](https://pic4.zhimg.com/v2-a3add0facbcf1c31305308024c79a417_b.png)

目前在用的系统盘是光威弈系列的Nvme M.2 512G，所以划分了100G的空闲空间。之后下载Ubuntu20.04 LTS的镜像，使用rufus等工具制作启动盘。

![](https://pic1.zhimg.com/v2-a90b3db94d3f58e2ddc0a6f9a50a9cac_b.png)

为了保证开机能进入BIOS界面，先关闭Windows快速启动，采用UEFI方式进行引导。

## Linux安装坑点

* 按F12进入Boot Manager，找到看起来像Ubuntu引导盘的选项
* 由于笔记本外接显卡可能存在种种问题，选择“Install Ubuntu (safe graogics)”选项
* 不要联网，还没换源的话下载很慢
* 在安装界面，勾选“为图形或者无线硬件……”选项
* 在安装类型，记得选“其他选项”，不要相信Ubuntu自己的共存或者重装，每次都要自己分区（这就是我重装三次的理由orz）

重点说说分区，我物理内存16G，所以最后分了8G虚拟内存，500M EFI引导文件，60G“/分区”，30G“home分区”（现在貌似已经没必要为usr挂载单独的分区了）。

由于Y7000的显卡问题，在安装完成进入系统选择界面时按e，然后将倒数第2行ro后面的内容全部删掉并改为 nouveau.modeset=0 ，F10保存开机。

## 无法输出HDMI信号

此时无法识别外接显示器，显卡驱动未更新。

将软件源更新为阿里源，更新完成后，外接显卡功能正常。更新过程出现长时间黑屏要有耐心，否则就会像第二次的我一样强制关机之后进GRUB并得知内核已损坏……

## 解决时间相差8小时问题

在切换双系统时，发现Windows的时间总是会慢8小时，查询后发现是Linux系统将电脑的物理时间当作UTC时间并修正的结果。

解决方法有两种，一种是修改Windows的注册表，另外就是在Linux上做文章：使用命令sudo hwclock -w --localtime 完成adjtime 文件的修改。（文章中的办法三我试了，没有用……）

## 将Ubuntu中文字体替换为微软雅黑

在Ubuntu下访问Windows的系统盘，拷贝相关字体。

![](https://pic1.zhimg.com/v2-6f463d3f0abbf8f96a6762a2b7759df0_b.png)

之后就要修改窗格的默认字体了，我没能启动unity tweak tool，所以使用gnome-tweak-tools，通过sudo apt install gnome-tweak-tool安装。

之后可以在“显示应用程序/工具/优化”中启动，并修改字体。

## 当Firefox浏览网页时提醒你安装Flash插件

那就在Ubuntu下安装个Chrome试试：


目前20.04不需要修改配置文件，可以直接启动。不过Chrome的账号同步是个大问题，Edge也推出了Linux版，可惜暂不支持登录账号，要不想必会成为我的主力浏览器了。


