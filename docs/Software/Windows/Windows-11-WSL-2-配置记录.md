---
title: Win11 WSL2 配置记录
---

今天打算在小新 Pro 14 的 WSL2 上安装 Ruby 2.7.4，但是发现我在 Y7000 上安装时没有记录……现在又得挨一遍折磨。为了方便之后换电脑时快速完成 WSL 的 oh-my-zsh 配置，故记录如下：

> 环境：Windows 11 家庭中文版 21H2

## 通过 Microsoft Store 安装 Ubuntu 出错

### 报错信息

```
Installing, this may take a few minutes...
WslRegisterDistribution failed with error: 0x800701bc
Error: 0x800701bc WSL 2 ??????????????????
```

### 解决方案

- 应该是我之前先指定了 WSL2 作为默认内核导致的问题
- [旧版 WSL 的手动安装步骤 | Microsoft Docs](https://docs.microsoft.com/zh-cn/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)

## WSL 使用 powerlevel10k 主题

- 安装 zsh：`sudo apt install zsh`
- 安装 oh-my-zsh：[ohmyzsh (github.com)](https://github.com/ohmyzsh/ohmyzsh#basic-installation)
- 使用 powerlevel10k 主题：[powerlevel10k (github.com)](https://github.com/romkatv/powerlevel10k)

powerlevel10k 需要特殊字体：

- 仓库地址：[nerd-fonts/patched-fonts/SourceCodePro/Regular/complete at master · ryanoasis/nerd-fonts (github.com)](https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/SourceCodePro/Regular/complete)
- 下载地址：[Sauce Code Pro Nerd Font Complete Mono Windows Compatible.ttf (github.com)](https://github.com/ryanoasis/nerd-fonts/raw/master/patched-fonts/SourceCodePro/Regular/complete/Sauce Code Pro Nerd Font Complete Mono Windows Compatible.ttf)

安装后，在 Windows Terminal 中指定 Ubuntu 配置文件的外观。

