时隔半年，我终于重新开始 MIT6.824 课程的学习。本周末主要计划是 Map Reduce 文章阅读和环境配置。

### 1. 课程学习资料
> - 官方网站： [6.824 Lab 1: MapReduce (mit.edu)](http://nil.csail.mit.edu/6.824/2022/labs/lab-mr.html)
> - 官方视频：
>     - 2020： [MIT 6.824 Distributed Systems (Spring 2020) - YouTube](https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB)
>     - 2021： [MIT 6.824 Distributed Systems 2021 - Frans Kaashoek - YouTube](https://www.youtube.com/playlist?list=PLMF2PpA06Sb2S_tAzs8M-Qeu9l7O-lMfg)
> - 讲义翻译版： [简介 - MIT6.824 (gitbook.io)](https://mit-public-courses-cn-translatio.gitbook.io/mit6-824/)
> - 学习群： [6.824：分布式系统学习的最佳资源 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/466926205)
>     - 入群条件为独立完成第一个 Lab Map&Reduce

### 2. 环境配置
2022 版安装文档 [6.824 Go (mit.edu)](https://pdos.csail.mit.edu/6.824/labs/go.html) 指出 Windows 端的 WSL 似乎存在问题，但为了方便我打算先尝试 VSCode+WSL2 的方案。

在 Windows 平台安装 Ubuntu 22.04 LTS 版本，一些配置参考 [WSL 安装 Oh My Zsh](WSL%20安装%20Oh%20My%20Zsh.md) ，遇到的新问题如下：
- [windows subsystem for linux - Ubuntu 22.04 LTS on WSL: "Failed to retrieve available kernel versions"/"Failed to check for processor microcode upgrades" when installing packages - Ask Ubuntu](https://askubuntu.com/questions/1404129/ubuntu-22-04-lts-on-wsl-failed-to-retrieve-available-kernel-versions-failed)
- [[Question] How to remove Windows pathes from WSL PATH? · Issue #1493 · microsoft/WSL (github.com)](https://github.com/microsoft/WSL/issues/1493)
- [linux - How to remove the Win10's PATH from WSL - Stack Overflow](https://stackoverflow.com/questions/51336147/how-to-remove-the-win10s-path-from-wsl)

Go 的安装参考 [Download and install - The Go Programming Language](https://go.dev/doc/install) 。

```shell
uname -a
# install
rm -rf /usr/local/go
wget -qO- https://go.dev/dl/go1.18.3.linux-amd64.tar.gz | sudo tar xz -C /usr/local
sudo apt-get install build-essential
# ~/.zshrc
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
export GO111MODULE=on
export GOPROXY=https://goproxy.cn
# test
go version
```

参考 [VsCode Go 插件配置最佳实践指南 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/320343679) ，在 VSCode 中安装官方插件，调试 6.824 程序需要进一步修改 `launch.json` 文件。

### 3. Paper Reading
> - 中文翻译： [MapReduce：在大型集群上简化数据处理 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/122571315)
> - 原文链接： [MapReduce paper (google.com)](http://research.google.com/archive/mapreduce-osdi04.pdf)

![Execution Overview](https://pic1.zhimg.com/v2-5642ac8d1e37098be1c97836341a7210_r.jpg)

- coordinater(master) 需要保存任务状态、追踪任务执行者
- 3.3 节提供了关于容错的设计，如何保证原子性

待补充……

### 4. Getting started
拉取 6.824 代码后，IDE 提示多个错误，大多数是由 Go 语言限制同一包内不应存在同名函数导致的。

#### 4.1 串行版本的运行
6.824 课程代码提供了一个简单的串行 Map Reduce 实现，使用如下命令运行：

```shell
go build -race -buildmode=plugin ../mrapps/wc.go
go run -race mrsequential.go wc.so pg*.txt
```

- `-race`： [Introducing the Go Race Detector - The Go Programming Language](https://go.dev/blog/race-detector)
    - 开启后，有利于发现程序中的竞争条件
- `-buildmode`：通过 `go help buildmode` 查看可选参数
    - `plugin` 选项支持将 Go 包编译为共享库(.so)，赋予 Go 动态链接的能力。但 `plugin` 功能尚未支持 Windows（ [plugin: add Windows support · Issue #19282 · golang/go (github.com)](https://github.com/golang/go/issues/19282) ），这或许也是 6.824 一课不支持 Windows 系统开发的原因之一。

#### 4.2 串行版本的调试
为了在 VSCode 中调试 Go 程序，首先需要在「运行和调试」中配置 `launch.json` 中的调试配置：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "debugAdapter": "dlv-dap",
            "name": "mrsequential",
            "type": "go",
            "request": "launch",
            "mode": "auto",
            "program": "${workspaceFolder}/src/main/mrsequential.go",
            "args": [
                "wc.so",
                "pg-grimm.txt",
                "pg-frankenstein.txt"
            ],
            "buildFlags": "-race"
        }
    ]
}

```

在 `args` 中输入调试时的参数，需要注意的是，之前编译的 `.so` 共享库不能在调试模式下正常运行，参考 [go - Failed in error “plugin was built with a different version of package” while debugging - Stack Overflow](https://stackoverflow.com/questions/65137425/failed-in-error-plugin-was-built-with-a-different-version-of-package-while-deb) ，插件应与主应用程序使用相同的标志编译，需要在编译时开启 `-gcflags="all=-N -l"` 选项，对该插件的所有包关闭编译器优化、取消内联，以支持断点调试。

而关于整体实验的调试方法论，可以参看 [Lab guidance (mit.edu)](https://pdos.csail.mit.edu/6.824/labs/guidance.html) 。

### 5. Your Job
感觉我的 Go 语法太不扎实了，下周再写……
