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
