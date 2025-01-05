---
title: 自定义ubuntu-22.04 ISO
date: 2024-12-12 11:30:00
tags:
  - ISO
categories:
  - Ubuntu
cover: /images/ubuntu/ubuntu.png

---


# 自定义ubuntu-22.04 ISO

## 构建条件

1. 一个运行 Ubuntu 的设备（虚拟机也是可以的，但不推荐 WSL1/2，因为 WSL2 经过实际测试会出现一些问题）。
2. 确保已经安装 `xorriso`、`vim`、`wget`、`7zip`软件包。

```sh
apt install -y 7zip wget xorriso
```

1. 打开终端。
2. 全程需要 root 权限，请输入 `sudo -s` 进入 root 权限。



## 构建步骤

### 下载 ISO

从 [Ubuntu ISO 下载页面](https://releases.ubuntu.com/)下载版本为`22.04`的 Ubuntu 服务器映像 （ISO）。

>我下载的镜像是ubuntu-22.04-live-server-amd64.iso

### 提取 ISO

```sh
7z -y x ubuntu-22.04-live-server-amd64.iso -ocustom
```

>注意！在 7z 命令中，没有空格。`-o`

### 引导文件

移动引导文件到上级目录

```sh
mv  '[BOOT]' ../BOOT
```

>生成新的ISO时，会生成新的引导文件

### 修改 GRUB

```sh
vim boot/grub/grub.cfg
```

在现有菜单项上方添加以下菜单项：

```
menuentry "Autoinstall Ubuntu Server" {
    set gfxpayload=keep
    linux   /casper/vmlinuz quiet autoinstall "ds=nocloud-net;s=file:///cdrom/server/"  ---
    initrd  /casper/initrd
}
```

### 创建 autoinstall 指令

```sh
mkdir server

cat > server/user-data << 'EOF'
#cloud-config
autoinstall:
  version: 1
  identity:
    hostname: ubuntu-server
    password: "$6$exDY1mhS4KUYCE/2$zmn9ToZwTKLhCw.b4/b.ZRTIZM30JZ4QrOQ2aOXJ8yk96xpcCof0kxKwuX1kqLG/ygbJ1f8wxED22bTL4F46P0"
    username: ubuntu
EOF

touch server/meta-data

```

加密的密码为 `ubuntu`。

用户数据文件的官方文档可以在这里找到：https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-reference.html 我在下面提供了一个工作示例：`user-data`

```yaml
#cloud-config
autoinstall:
  # version is an Autoinstall required field.
  version: 1

  # This adds the default ubuntu-desktop packages to the system.
  # Any desired additional packages may also be listed here.
  packages:
    - ubuntu-server

  # User creation can occur in one of 3 ways:
  # 1. Create a user using this `identity` section.
  # 2. Create users as documented in cloud-init inside the user-data section,
  #    which means this single-user identity section may be removed.
  # 3. Prompt for user configuration on first boot.  Remove this identity
  #    section and see the "Installation without a default user" section.
  identity:
    realname: 'UntouchedWagons'
    username: untouchedwagons
    # A password hash is needed. `openssl passwd -6 $CLEARTEXT_PASSWORD` can help.
    password: ''
    hostname: ubuntu-test

  locale: en_US.UTF-8
  keyboard:
    layout: us

  package_update: true
  package_upgrade: true

  # Subiquity will, by default, configure a partition layout using LVM.
  # The 'direct' layout method shown here will produce a non-LVM result.
  storage:
    swap:
      size: 0
    layout:
      name: direct

  ssh:
    allow-pw: true
    install-server: true
    authorized-keys:
      - ssh-key 1
      - ssh-key 2

  network:
    network:
      version: 2
      ethernets:
        enp6s18:
          dhcp4: true
          dhcp-identifier: mac

  late-commands:
    - curtin in-target -- update-grub
    - curtin in-target -- apt-get install -y cloud-init
    - curtin in-target -- apt-get autoremove -y
```

>请注意，由于使用了可预测的接口命名，因此可能很难预测接口的名称。
>
>在 Proxmox VM 中，Ubuntu 倾向于命名 virtio NIC ，您的里程可能会有所不同。
>
>它可能是`enp6s18``eth0``eno1` ，或者完全不同的东西。

### 重建 ISO

我几乎完全从下面列出的 Puget Systems 链接中取消了重建 ISO 的命令，我对每个部分的作用只有一个模糊的概念。

```sh
xorriso -as mkisofs -r \
  -V 'Ubuntu_22.04_Auto' \
  -o ../ubuntu-22.04-autoinstall.iso \
  --grub2-mbr ../BOOT/1-Boot-NoEmul.img \
  -partition_offset 16 \
  --mbr-force-bootable \
  -append_partition 2 28732ac11ff8d211ba4b00a0c93ec93b ../BOOT/2-Boot-NoEmul.img \
  -appended_part_as_gpt \
  -iso_mbr_part_type a2a0d0ebe5b9334487c068b6b72699c7 \
  -c '/boot.catalog' \
  -b '/boot/grub/i386-pc/eltorito.img' \
    -no-emul-boot -boot-load-size 4 -boot-info-table --grub2-boot-info \
  -eltorito-alt-boot \
  -e '--interval:appended_partition_2:::' \
  -no-emul-boot \
  .
```

如果一切顺利，您应该会看到以下消息`Writing to 'stdio:../ubuntu-24.04-autoinstall.iso' completed successfully.`

就是这样。您可以将 ISO 上传到语音管理程序，使用 RUFUS 将其写入 USB 驱动器，或将其复制到 IODD 外部虚拟 ODD。

## 脚本

```sh
#!/bin/bash

set -e
##################################### 全局变量 ####################################

#获取当前脚本所在的目录。
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)
#当前时间
today=$(date +"%Y-%m-%d-%H%M%S")
#创建临时目录
tmpdir="iso_dir"

# 是否使用自动配置
all_in_one=0
# user-data 文件
user_data_file=''
# meta-data 文件
meta_data_file=''
# 原始ISO镜像文件
source_iso=''
# 生成的ISO文件
destination_iso="${script_dir}/ubuntu-autoInstall-$today.iso"
# autoinstall 配置在ISO中的目录
install_conf_dir="server"

#################################################################################


function cleanup() {
        if [ -n "${tmpdir}" ]; then
            rm -rf "$tmpdir"
            log "🚽 Deleted temporary working directory $tmpdir"
        fi
        if [ ! -f BOOT ]; then
            rm -rf BOOT
            log "🚽 Deleted BOOT directory "
        fi
}

function log() {
        echo >&2 -e "[$(date +"%Y-%m-%d %H:%M:%S")] ${1-}"
}

function die() {
        local msg=$1
        local code=${2-1} # Bash parameter expansion - default exit status 1. See https://wiki.bash-hackers.org/syntax/pe#use_a_default_value
        log "$msg"
        exit "$code"
}


function usage() {
        cat <<EOF
Usage: $(basename "${BASH_SOURCE[0]}") [-h] [-v] [-a]  [-u user-data-file] [-m meta-data-file] [-s source-iso-file] [-d destination-iso-file]

💁 This script will create fully-automated Ubuntu 22.04 Focal Fossa installation media.
💁 Ubuntu ISO Download Url: https://releases.ubuntu.com/20.04/ubuntu-20.04.6-live-server-amd64.iso

Available options:

-h, --help              Print this help and exit
-v, --verbose           Print script debug info
-a, --all-in-one        Bake user-data and meta-data into the generated ISO. By default you will
                        need to boot systems with a CIDATA volume attached containing your
                        autoinstall user-data and meta-data files.
                        For more information see: https://ubuntu.com/server/docs/install/autoinstall-quickstart
-u, --user-data         Path to user-data file. Required if using -a
-m, --meta-data         Path to meta-data file. Will be an empty file if not specified and using -a
-s, --source            Source ISO file.
                        That file will be used by default if it already exists.
-d, --destination       Destination ISO file. By default ${script_dir}/ubuntu-autoinstall-$today.iso will be
                        created, overwriting any existing file.
EOF
        exit
}

#检查环境
function checkEnvironment () {
    log "🔎 Checking for required utilities..."
	#检查 date 命令是否可用
	[[ ! -x "$(command -v date)" ]] && die "💥 date command not found." && exit 1
    [[ ! -x "$(command -v xorriso)" ]] && die "💥 xorriso is not installed. On Ubuntu, install  the 'xorriso' package." && exit 1
    [[ ! -x "$(command -v 7z)" ]] && die "💥 sed is not installed. On Ubuntu, install the '7zip' package." && exit 1
    log "👍 All required utilities are installed."
}


function parseParam() {

  while :; do
    case "${1-}" in
        -h | --help) usage ;;
        -v | --verbose) set -x ;;
        -a | --all-in-one) all_in_one=1 ;;
        -u | --user-data)
                user_data_file="${2-}"
                shift
                ;;
        -s | --source)
                source_iso="${2-}"
                shift
                ;;
        -d | --destination)
                destination_iso="${2-}"
                shift
                ;;
        -m | --meta-data)
                meta_data_file="${2-}"
                shift
                ;;
        -?*) die "Unknown option: $1" ;;
        *) break ;;  # 如果没有更多参数，退出循环
    esac
    shift
  done
}


function checkParam() {
    if [ ${all_in_one} -ne 0 ]; then
        [[ -z "${user_data_file}" ]] && die "💥 user-data file was not specified." && exit 1
        [[ ! -f "$user_data_file" ]] && die "💥 user-data file could not be found." && exit 1
        [[ -n "${meta_data_file}" ]] && [[ ! -f "$meta_data_file" ]] && die "💥 meta-data file could not be found." && exit 1
    fi

    if [[ -z "${source_iso}" ]]; then
        die "💥 Source ISO file was not specified." && exit 1
    else
        [[ ! -f "${source_iso}" ]] && die "💥 Source ISO file could not be found." && exit 1
    fi


    destination_iso=$(realpath "${destination_iso}")
    source_iso=$(realpath "${source_iso}")
}


function setup () {
    
    mkdir "$tmpdir"

    log "🧩 Extracting ISO files..."
    7z -y -bso0 -bsp1 x "$source_iso" -o"$tmpdir"
    log "👍 Extracted ISO file."

    mv $tmpdir/'[BOOT]' ./BOOT

    if [ ${all_in_one} -eq 1 ]; then
        log "🧩 Adding user-data and meta-data files..."
        mkdir "$tmpdir/server"
        cp "$user_data_file" "$tmpdir/$install_conf_dir/user-data"
        if [ -n "${meta_data_file}" ]; then
          cp "$meta_data_file" "$tmpdir/$install_conf_dir/meta-data"
        else
          touch "$tmpdir/$install_conf_dir/meta-data"
        fi
        log "👍 Added data and configured kernel command line."


        log "🧩 Adding autoinstall parameter to kernel command line..."
	
        sed -i -e "s,---, autoinstall ds=nocloud-net;s=\"file:///cdrom/$install_conf_dir/\" ---,g" "$tmpdir/boot/grub/grub.cfg"
        log "👍 Added parameter to UEFI and BIOS kernel command lines."
    fi

}

function generateISO() {
    log "📦 Repackaging extracted files into an ISO image..."
    xorriso -as mkisofs -r \
      -V 'UBUNTU_AUTO_ISO' \
      -o "$destination_iso" \
      --grub2-mbr "./BOOT/1-Boot-NoEmul.img" \
      -partition_offset 16 \
      --mbr-force-bootable \
      -append_partition 2 28732ac11ff8d211ba4b00a0c93ec93b "./BOOT/2-Boot-NoEmul.img" \
      -appended_part_as_gpt \
      -iso_mbr_part_type a2a0d0ebe5b9334487c068b6b72699c7 \
      -c '/boot.catalog' \
      -b '/boot/grub/efi.img' \
        -no-emul-boot -boot-load-size 4 -boot-info-table --grub2-boot-info \
      -eltorito-alt-boot \
      -e '--interval:appended_partition_2:::' \
      -no-emul-boot \
      $tmpdir
    log "👍 Repackaged into ${destination_iso}"
    cd ..
}


log "👶 Starting up..."
# 检查环境
checkEnvironment
# 调用参数解析函数
parseParam "$@"

cleanup
# 检查参数
checkParam
# 操作镜像
setup
# 生成镜像
generateISO

die "✅ Completed." 0
```



## 参考文档

[Ubuntu 22.04 服务器自动安装 ISO |普吉特系统](https://www.pugetsystems.com/labs/hpc/ubuntu-22-04-server-autoinstall-iso/#Step_2_Unpack_files_and_partition_images_from_the_Ubuntu_2204_live_server_ISO)

[UntouchedWagons/Ubuntu-AutoInstall-Docs：使用 Ubuntu 自动安装功能的简要指南](https://github.com/UntouchedWagons/Ubuntu-AutoInstall-Docs)

[Autoinstall quick start - Ubuntu installation documentation](https://canonical-subiquity.readthedocs-hosted.com/en/latest/howto/autoinstall-quickstart.html)

[启动 - Ubuntu 22.04 build ISO （MBR 和 EFI ） - Ask Ubuntu](https://askubuntu.com/questions/1403546/ubuntu-22-04-build-iso-both-mbr-and-efi)

[build-ubuntu-live: 从零开始制作 Ubuntu 22.04 Live CD](https://gitee.com/narukeu/build-ubuntu-live)

[YasuhiroABE/ub-autoinstall-iso: Creating an custom AutoInstall ISO image for ubuntu 22.04 and 24.04.](https://github.com/YasuhiroABE/ub-autoinstall-iso)