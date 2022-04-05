# WSL 安装 Oh My Zsh

开启 Windows 的 Linux 子系统设置（之前设置过，感觉是升级 Win 11 之后被还原了）：
```cmd
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
wsl --set-default-version 2
```

在 WSL 上，使用宿主机 Clash 提供的代理服务：
```shell
export hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*')
export https_proxy="http://${hostip}:7890"
export http_proxy="http://${hostip}:7890"
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

Zsh 配置文件：
[EnjoyCoding/.zshrc at main · MondayCha/EnjoyCoding (github.com)](https://github.com/MondayCha/EnjoyCoding/blob/main/zsh/.zshrc)