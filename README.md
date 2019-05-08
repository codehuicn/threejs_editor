# Threejs Editor
学习 Threejs Editor 的项目。

## 项目目录结构
* `common`文件夹：`build`里面是主要的类库`threejs`和`jqueryjs`；其它是三维小例子使用的代码和资源，根据需要自己引入。
* `css`文件夹：项目的样式文件，可切换皮肤。
* `docs`文件夹：项目的技术点介绍。
* `examples`文件夹：项目引用的场景实例。
* `js`文件夹：`commands`里面是用来写具体撤销和重做操作的代码；`libs`使用的第三方代码；其它是项目的主要代码。

## 项目代码结构
* `index.html`项目的入口文件。
* `Editor.js`项目主功能的函数。
* `config.js`项目的配置，会保存到`localStorage`本地存储。
* `History.js`项目的历史记录，撤销和重做的队列。
* `Storage.js`项目的`indexedDB`本地数据库。
* `Loader.js`项目的文件加载功能。
* `Api.js`项目的后台数据获取功能，项目的信息，项目的版本信息，不会保存到本地存储。

## 项目功能流程
### 定位相机
* 勾选定位相机，在场景中选择一个点，这个点在网格平面或模型平面，高度是相机高度的值；
* 相机的位置就是点的坐标，方向不变，通过鼠标移动控制方向，鼠标滚轮控制前进和后退；
* W/A/S/D 控制移动，C 控制跳跃，方向键控制移动，ESC 退出控制。
### 模型动画
* 选择模型后，在右侧场景页最下方的模型脚本里，新建一个模型脚本，输入脚本文件名，点击编辑写模型动画代码；
* 在提供的函数回调名称下，编辑对应的函数名称的具体代码，函数作用域为模型，传入的参数根据需要选择；
* 编写完模型代码后，点击菜单栏的播放按钮可以看运行效果。
### 场景播放
* 点击菜单栏的场景播放按钮后，会切换到新的页面，并播放模型动画；
* 场景播放提供了观察的控件，点击右下角的切换按钮后控件切换为游览模式；
* 点击播放按钮后，根据定位相机时的操作和游览进行播放；
* 在发布后的代码里，除了上面的功能之外，还有编辑功能，点击编辑场景切换到编辑器；
* 发布功能在文件菜单栏里，发布后的代码需要在服务器上运行。

## 注意事项
### 项目的版本信息
* 第一个数字表示主版本；
* 第二个数字表示增加功能；
* 第三个数字表示修改问题。
### 代码的版本问题
* 修改代码的引用时，要把旧版本备份，确保所有功能都没问题时才能删除；