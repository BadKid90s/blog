---
title: Tap-Windows install
date: 2024-10-20 15:30:00
tags:
- windows
categories:
- 网络
cover: /post/2024/network/tap-windows/logo.png

---





## 什么是 TAP-Windows 适配器

- **TAP-Windows 适配器**在 Windows 操作系统上提供虚拟 TAP 设备功能，VPN 软件需要它才能运行。
- **TAP 设备**是完全由软件支持的虚拟网络内核设备，不受硬件网络适配器的支持。
- **TAP 驱动程序** 用于 TAP 设备工作，它们设计为支持以太网隧道的低级内核。

[tap-windows6：Windows TAP 驱动程序](https://github.com/OpenVPN/tap-windows6)

[什么是 TAP-Windows 适配器 v9？我在哪里下载它？](https://cn.windows-office.net/?p=14257)



## 安装

[OpenVPN releases](https://build.openvpn.net/downloads/releases/)



Windows下的驱动均通过签名证书来确认其安全性，首次安装时，因为系统没有存放驱动的可信证书，所以会弹出提示。而当二次安装时，因为之前系统已保存其证书，所以就不会弹出提示。

以下方法使用 [tap-windows-9.21.2.exe](http://build.openvpn.net/downloads/releases/tap-windows-9.21.2.exe)（一键包） 和 [tap-windows-9.21.2.zip](http://build.openvpn.net/downloads/releases/tap-windows-9.21.2.zip)（手动包） 为例



### 未安装过Tap适配器的朋友

下载驱动压缩包 [下载地址](http://build.openvpn.net/downloads/releases/tap-windows-9.21.2.zip) ，解压（压缩包内i386对应32位系统，amd64对应64位系统）

ps 如果只需要装一个TAP-Windows网络适配器，直接下载安装包（exe），一路下一步即可，[安装包下载地址](http://build.openvpn.net/downloads/releases/tap-windows-9.21.2.exe)

### 命令行安装

管理员权限运行CMD（或者PowerShell）

```
#进入文件夹（根据你解压到哪里）
cd "E:\SystemFile\Desktop\amd64"
#开始安装
tapinstall.exe install OemVista.inf tap0901
```

提示 “Drivers installed successfully.”

### 安装多个Tap-Windows网络适配器

第一个安装完成，需要安装第二个、第三个……还是执行上一步的命令.

```
tapinstall.exe install OemVista.inf tap0901
```

## 使用PowerShell重命名网络接口

1. 打开PowerShell：

   - 按下`Win + X`键，然后选择“Windows PowerShell（管理员）”。
   - 或者在开始菜单中搜索“PowerShell”，右键选择“以管理员身份运行”。

2. 使用`Rename-NetAdapter`命令重命名网络适配器：

   - 在PowerShell中，使用以下命令来重命名网络适配器，其中是"old_name"当前的网络适配器名称，"new_name"是你想要设置的新名称：

     ```text
     Rename-NetAdapter -Name "old_name" -NewName "new_name"
     ```

   - 例如，如果你的网络适配器当前名为“以太网”，你想要将其重命名为“家庭网络”，则命令如下：

     ```text
     Rename-NetAdapter -Name "以太网" -NewName "家庭网络"
     ```

   - 注意：在PowerShell中，网络适配器的名称可能与设备管理器中显示的名称不同。你可能需要先通过`Get-NetAdapter`命令查看所有网络适配器的列表，以找到正确的名称。