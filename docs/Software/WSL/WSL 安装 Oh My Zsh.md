# WSL 安装 Oh My Zsh
[[Windows-10-安装-Ubuntu-20.04-双系统不完全踩坑记录]]

开启 Windows 的 Linux 子系统设置（之前设置过，感觉是升级 Win 11 之后被还原了）：
```cmd
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
wsl --set-default-version 2
```

在 WSL 上，使用宿主机提供的代理服务：
```shell
export hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*')
export https_proxy="http://${hostip}:10811"
export http_proxy="http://${hostip}:10811"
```

Zsh 安装：
```shell
sudo apt install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Zsh 插件配置：
```shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# Autojump
git clone https://github.com/wting/autojump.git
python3 ./install.py
```
