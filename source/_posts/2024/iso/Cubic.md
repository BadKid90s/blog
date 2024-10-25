---
title: Cubic（Custom Ubuntu ISO Creator）
date: 2024-10-23 16:30:00
tags:
  - ISO
categories:
  - Ubuntu
cover: /post/2024/iso/Cubic/logo.png

---


# Cubic

## 简介

Cubic（Custom Ubuntu ISO Creator）是一个用于创建自定义 Ubuntu ISO 的工具，它提供了一个图形用户界面，使得用户可以更方便地修改和定制 ISO 文件。

[Cubic in Launchpad](https://launchpad.net/cubic)

[github.com/PJ-Singh-001/Cubic)](https://github.com/PJ-Singh-001/Cubic)



Cubic 之所以能够将安装后的软件直接打包进去，主要是因为它使用了以下几个关键技术和步骤：

### 1. **基于现有的文件系统**

Cubic 允许用户从现有的 Ubuntu ISO 文件中提取文件系统，并在此基础上进行修改。用户可以在一个虚拟环境中运行和测试修改，这样可以确保所做的更改是有效的。

### 2. **使用 SquashFS**

Cubic 使用 SquashFS 文件系统来压缩和打包文件。SquashFS 是一种只读的压缩文件系统，适合用于嵌入式系统和 Live CD。Cubic 可以将用户安装的软件和其他文件打包到 SquashFS 中，从而在创建的 ISO 中包含这些软件。

### 3. **自动处理依赖关系**

Cubic 可以自动处理软件包的依赖关系。当用户在 Cubic 中安装软件时，它会确保所有必要的依赖项都被包含在内。这使得用户可以轻松地将已安装的软件打包到 ISO 中，而不必手动管理依赖关系。

### 4. **集成安装脚本**

Cubic 允许用户创建自定义的安装脚本，这些脚本可以在系统启动时自动运行。通过这些脚本，用户可以在安装过程中自动安装特定的软件包或执行其他自定义操作。

### 5. **图形用户界面**

Cubic 提供了一个直观的图形用户界面，使得用户可以轻松地选择要包含的软件、文件和设置，而不需要深入了解命令行操作。这降低了创建自定义 ISO 的门槛。

### 6. **实时环境**

Cubic 提供了一个实时的环境，用户可以在其中测试和验证他们的更改。这意味着用户可以在创建 ISO 之前，确保所有软件和配置都按预期工作。

### 总结

通过这些功能，Cubic 使得用户能够方便地将安装后的软件和自定义设置打包到新的 Ubuntu ISO 中，从而创建一个符合自己需求的操作系统镜像。这种灵活性和易用性使得 Cubic 成为许多用户的首选工具。



## 实践

## 安装cubic

```bash
sudo apt-add-repository universe
sudo apt-add-repository ppa:cubic-wizard/release
sudo apt update
sudo apt install --no-install-recommends cubic
```

## 自定义ISO

### 选择项目路径

> 即选择一个路径来存放构建过程中的配置文件。注意，需要考虑磁盘的空间大小，防止后期构建空间不够。
>
> 选择好之后点击右上角的 Next 进入下一步。



![img](Home.png)

### 选择源镜像

>需要自行去网上下载好需要的基础镜像。我这里使用的是21.10作为基础镜像进行DIY。

在 Cubic 项目页面上，单击 Original 部分中的文件夹图标以选择要自定义的 Live ISO 映像。系统会自动为您填写有关您的项目的信息。您可以更改有关自定义 ISO 的信息，也可以接受建议的默认值。

如果您选择更改某些值，则相关参数将在您键入时自动更新。的 Undo 和 Redo 按钮仅影响 Custom 部分中的字段。Refresh 按钮允许您将新 ISO 的版本更新到今天的日期，单击此按钮会将 Custom 字段中出现的所有旧版本替换为新版本。

![img](CubicProjectPage.png)

对于具有以前生成的 ISO 的现有项目，请单击 Test 按钮以测试以前生成的 ISO。QEMU † 模拟器将启动并引导至新的 ISO。如果以前没有为您的项目生成 ISO，或者您没有足够的内存来允许测试，则不会看到 Test （测试） 按钮。

![img](CubicProjectPageExistingProject.png)

### 解压源镜像

Cubic Extract 页面分析原始 ISO，复制用于引导 ISO 的重要文件，并从原始 ISO 中提取压缩的 Linux 文件系统。

完成后，此页面将自动过渡到下一页。

![img](CubicExtractPage.png)

### 进入chroot

> 当上一步完成之后，会进入chroot模式，相当于一个还没有创建用户的模式，所有的自定义都是在这里进行，在这里你可以安装软件、卸载软件或者拖入文件复制到系统内。

Cubic Terminal Page 是一个虚拟环境，您可以在其中自定义 Linux 文件系统。您将需要使用命令行，但由于您以 root 用户身份登录，因此在键入命令时不需要使用`sudo`。

![img](CubicTerminalPage.png)

> 请注意，此虚拟环境中没有活动服务，就像在实际运行的操作系统中一样。这是因为 Cubic 中的终端不是一个“正在运行的”操作系统。它只是一个安全、隔离的文件系统，您对其具有 root 访问权限，以便编辑、添加或删除文件。因此`systemd`等服务无法在 Cubic 的虚拟环境中运行。

您对文件系统所做的任何更改都会立即应用。完成更改后，单击 `Next` 按钮。请记住，您始终可以返回到此项目的终端环境，以便在将来进行其他自定义。

如果您不小心退出了虚拟环境，它将自动重新启动。

DNS 查找在此环境中可能不起作用，并且由于“Name or service not known”错误，您可能无法使用 apt。这是因为该链接指向不存在的配置。`/etc/resolv.conf` `/run/systemd/resolve/stub-resolv.conf` `stub-resolv.conf`

要解决此问题，请执行以下命令...

```bash
mkdir /run/systemd/resolve/
echo "nameserver 127.0.1.1
search network" | tee /run/systemd/resolve/resolv.conf
ln -sr /run/systemd/resolve/resolv.conf /run/systemd/resolve/stub-resolv.conf
```



以下是使用命令行自定义 Ubuntu 的几个示例...

您可以使用 nano 文本编辑器编辑文件。例如，要编辑源存储库列表，请键入

```bash
nano /etc/apt/sources.list
```



要退出 nano，请键入 +，系统将提示您保存文件。键入以保存文件，然后按 接受默认文件名。否则，键入以取消保存文件。

![img](CubicTerminalPageNano.png)

您可以通过将文件或目录拖动到终端窗口、使用标题栏中的复制按钮或使用右键单击上下文菜单，将文件或目录复制到*当前目录中*。尽管 Cubic 目前不支持通过网络复制文件，但您可以在终端环境中使用 `scp,rcp` 命令来复制网络文件。

以下是将其他壁纸复制到自定义环境中的示例。

```bash
cd /usr/share/backgrounds
```

然后只需将新壁纸拖到 Cubic 窗口上。

### 准备导出镜像

Cubic Prepare 页面会自动分析您的自定义项，并为自定义流程的后续步骤准备高级选项：

- 确定磁盘引导内核
- 识别已安装的软件包
- 为典型的安装†创建软件包清单
- 为最小安装††创建程序包清单
- 保存程序包清单

![img](CubicPreparePage.png)

完成后，此页面将自动过渡到下一页。

### 自定义系统设置

Cubic 选项页面包含三个选项卡：

1. [Kernel](https://github.com/PJ-Singh-001/wiki/Options-Page#kernel-tab)
2. [Preseed](https://github.com/PJ-Singh-001/wiki/Options-Page#preseed-tab)
3. [Boot](https://github.com/PJ-Singh-001/wiki/Options-Page#boot-tab)

#### 内核

如果您在[虚拟环境中](https://github.com/PJ-Singh-001/wiki/Terminal-Page)安装了其他内核，它们将列在 Kernel （内核） 选项卡上。你可以选择使用其中一个作为新的 live ISO 的启动内核。最好只接受此页面上建议的默认值。

这不是您的自定义 Linux 系统将使用的内核。*此内核将仅用于引导您的新 Live ISO。*

无论您在此页面上选择哪个内核来引导 Live ISO，您的自定义 Linux 系统都将使用您在[虚拟环境中](https://github.com/PJ-Singh-001/wiki/Terminal-Page)安装并配置为默认内核的内核。（默认内核通常是您安装的最后一个内核）。

![img](CubicOptionsPageKernelTab.png)

#### 预置

Preseed 允许您创建、编辑或删除 Preseed 文件。使用扩展名创建的文件将自动分配可执行权限。

![img](CubicOptionsPagePreseedTab.png)

#### 引导

Boot 允许您更新在引导自定义的 Live ISO 时使用的引导参数。这些文件会自动更新以反映正确的内核文件（vmlinuz 和 initrd）。使用扩展名创建的文件将自动分配可执行权限。

![img](CubicOptionsPageBootTab2.png)

### 压缩算法选择

Cubic Compression Page 允许您选择用于压缩自定义 Linux 文件系统的算法。对于大多数用户来说，继续使用默认算法 gzip 是可以的。

![img](CubicCompressionPage.png)

### 生成ISO镜像

在 Cubic 生成页面上，Cubic 会自动将您的自定义打包到新的磁盘映像中。将显示每个步骤的进度和结果。请注意，“压缩自定义的 Linux 文件系统”步骤可能需要很长时间，具体取决于所选的压缩算法和您的系统硬件。（在此步骤中，您可能需要打开系统监视器以跟踪 CPU 利用率）。

![img](CubicGeneratePage.png)

您可以随时单击 Back 按钮中断此过程，以便更新之前的选择或导航到虚拟环境并进行您可能忽略的其他更改或自定义。

最大 ISO 大小为 8 TB，因此可以使用 Cubic 创建大于 4GB 的 ISO。

完成后，此页面将自动过渡到下一页。



### 导出完成

在 Cubic Finish 页面上，将显示有关自定义磁盘映像的信息。

![img](CubicFinishPage.png)

单击 Test 按钮以测试生成的 ISO。QEMU † 模拟器将启动并引导至新的 ISO。如果您没有足够的内存来允许测试，则不会看到 Test （测试） 按钮。

单击 Back 按钮进行更改并生成新的 ISO 文件。

单击自定义磁盘文件名旁边的文件夹图标将打开显示此文件的文件浏览器。单击校验和文件名旁边的文件夹图标将打开显示此文件的文件浏览器。

如果您想删除所有项目工作文件（为了节省磁盘空间），请选中 “Delete all project files...”复选框。虽然生成的 *.iso 文件和相应的 *.md5 校验和文件不会被删除，但您将来将无法继续自定义此项目。

但是，如果您选择保留所有项目文件，则可以在将来继续自定义您的项目。

单击 Close 按钮退出 Cubic。