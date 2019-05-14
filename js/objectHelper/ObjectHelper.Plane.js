/**
 * @author codehuicn / https://github.com/codehuicn
 *
 * ### 模型辅助功能-平面模型辅助
 * * 1 实例化：
 * * `var planeHelper = new ObjectHelper.Plane();`
 *
 * #### 获取平面
 * * 1 使用方式：
 * * `planeHelper.getPlane( optG, optM );`
 * * 2 参数：
 * * `optG` 几何体配置；`optM` 材质配置
 *    ```js
 *    optG = {
 *        width: 60,
 *        height: 60,
 *        widthSeg: 1,
 *        heightSeg: 1
 *    };
 *    optM = {
 *        color: 0x666666,
 *        transparent: true,
 *        opacity: .5,
 *        side: THREE.DoubleSide
 *    };
 *    ```
 * * 3 返回：
 * * 平面模型
 */

ObjectHelper.Plane = function () {

}

ObjectHelper.Plane.prototype.getPlane = function ( optG, optM ) {

    var optGeometry = {
        width: 60,
        height: 60,
        widthSeg: 1,
        heightSeg: 1
    },
    optMaterial = {
        color: 0x666666,
        transparent: true,
        opacity: .5,
        side: THREE.DoubleSide
    };
    if ( optG ) $.extend( optGeometry, optG );
    if ( optM ) $.extend( optMaterial, optM );

    var geometry = new THREE.PlaneBufferGeometry( optGeometry.width, optGeometry.height, optGeometry.widthSeg, optGeometry.heightSeg );
    var material = new THREE.MeshBasicMaterial( optMaterial );
    var mesh = new THREE.Mesh( geometry, material );

    return mesh;

}
