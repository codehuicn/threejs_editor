/**
 * @author codehuicn / https://github.com/codehuicn
 *
 * ### 模型辅助功能
 * * 1 实例化：
 * * `var objectHelper = new ObjectHelper();`
 *
 * #### 查找最近的模型
 * * 1 使用方式：
 * * `objectHelper.getMinObject( objNow, objAll, check );`
 * * 2 参数：
 * * `objNow` 模型；`objAll` 模型数组；`check` 检测函数，排除不需要判断的模型（传入移动模型和数组元素）
 * * `check` 函数：
 * * `function( objNow, objAll[i] ) { return true; }`
 * * 3 返回：
 * * `{objNow: objNow, objMin: objMin, distance: len, objNowDot: objNowDot, objMinDot: objMinDot}`
 *
 * #### 查找模型的端点
 * * 1 使用方式：
 * * `objectHelper.getObjDots( obj, refer );`
 * * 2 参数：
 * * `obj` 模型；`refer` 参考值 `{ axis: 'x', max: 3, min: 2 }` ，不传默认模型所有的点
 * * 3 返回：
 * * 空数组、包含 `Vector3` 点的数组
 *
 * #### 获取盒模型的端点
 * * 1 使用方式：
 * * `objectHelper.getBoxDots( obj );`
 * * 2 参数：
 * * `obj` 模型
 * * 3 返回：
 * * 数组（点 `min` 、底面三个点、上面三个点、点 `max` ）
 *
 * #### 创建一个小模型
 * * 1 使用方式：
 * * `objectHelper.getDotObj( opt );`
 * * 2 参数：
 * * `opt` 小模型的配置 `{color: 0xff0000, type: 'sphere'}`
 * * `type` 可选：
 * * `sphere box circle semicircle triangle square pentagon triangle2 pentagon2 circle2 triangle1 square1 pentagon1 circle1 triangle3 square3 pentagon3 circle3`
 * * 3 返回：
 * * 模型对象
 *
 * #### 缩放模型到合适的大小
 * * 1 使用方式：
 * * `objectHelper.scaleObjectsRelatively( objs, camera, scale );`
 * * 2 参数：
 * * `objs` 模型数组；`camera` 相机；`scale` 缩放数值
 * * 3 返回：
 * * 无
 *
 * #### 刷新模型的辅助线
 * * 1 使用方式：
 * * `objectHelper.refreshObjectHelper( obj, scene, sceneHelpers, textHelper );`
 * * 2 参数：
 * * `obj` 模型；`scene` 模型的场景；`sceneHelpers` 辅助模型的场景；`textHelper` 文本辅助功能
 * * `var textHelper = new ObjectHelper.Text();` 初始化的时候实例化，先加载字体文件
 * * 3 返回：
 * * 无
 *
 * #### 删除模型的辅助线
 * * 1 使用方式：
 * * `objectHelper.deleteObjectHelper( obj, sceneHelpers );`
 * * 2 参数：
 * * `obj` 模型；`sceneHelpers` 辅助模型的场景
 * * 3 返回：
 * * 无
 *
 * #### 清空模型的辅助线
 * * 1 使用方式：
 * * `objectHelper.clearObjectHelper( sceneHelpers );`
 * * 2 参数：
 * * `sceneHelpers` 辅助模型的场景
 * * 3 返回：
 * * 无
 *
 * #### 合并模型
 * 按照模型的类型进行合并，排除了 `Group` 类型
 * * 1 使用方式：
 * * `objectHelper.mergeObjectByType( obj, refer );`
 * * 2 参数：
 * * `obj` 一个大模型；`refer` 函数引用，包含 `mergeObjects` 和 `mergeBufferGeometry`
 * * 3 返回：
 * * 包含合并模型的单个模型
 *
 * #### 合并某个类型的所有模型
 * 对某个类型的所有模型合并，模型类型取决于第一个模型
 * * 1 使用方式：
 * * `objectHelper.mergeObjects( objs, refer );`
 * * 2 参数：
 * * `objs` 模型数组；`refer` 函数引用，包含 `mergeBufferGeometry`
 * * 3 返回：
 * * 一个模型
 *
 * #### 合并几何体
 * 把第二个几何体合并到第一个几何体中
 * * 1 使用方式：
 * * `objectHelper.mergeBufferGeometry( geometry1, offset, geometry2, start, count );`
 * * 2 参数：
 * * `geometry1` 几何体；`offset` 第一个几何体的偏移；`geometry2` 几何体；`start` 第二个几何体的开始位置；
 * `count` 第二个几何体的合并数量
 * * 3 返回：
 * * 合并后的几何体
 */

var ObjectHelper = function () {

    this.objectIdTag = 'objectHelperOid';

}

ObjectHelper.prototype.getMinObject = function ( objNow, objAll, check ) {

    var box = new THREE.Box3(), objMin, objNowDot4 = [], objMinDot4 = [], objNowDot, objMinDot, len, len0;

    box.setFromObject( objNow );
    objNowDot4.push( box.min.clone() );
    objNowDot4.push( box.min.clone() );
    objNowDot4.push( box.min.clone() );
    objNowDot4.push( box.max.clone() );
    objNowDot4[1].setX( box.max.x );
    objNowDot4[2].setZ( box.max.z );
    objNowDot4[3].setY( box.min.y );

    for (var i = 0, il = objAll.length; i < il; i++) {

        if ( check(objNow, objAll[i]) ) {

            box.setFromObject( objAll[i] );
            objMinDot4 = [];
            objMinDot4.push( box.min.clone() );
            objMinDot4.push( box.min.clone() );
            objMinDot4.push( box.min.clone() );
            objMinDot4.push( box.max.clone() );
            objMinDot4[1].setX( box.max.x );
            objMinDot4[2].setZ( box.max.z );
            objMinDot4[3].setY( box.min.y );

            for (var j = 0; j < 4; j++) {
                for (var k = 0; k < 4; k++) {

                    len0 = objNowDot4[j].distanceTo( objMinDot4[k] );
                    if ( !len || len0 < len ) {

                        len = len0;
                        objNowDot = objNowDot4[j].clone();
                        objMinDot = objMinDot4[k].clone();
                        objMin = objAll[i];

                    }

                }
            }
        }

    }

    return {objNow: objNow, objMin: objMin, distance: len, objNowDot: objNowDot, objMinDot: objMinDot};

}

ObjectHelper.prototype.getObjDots = function ( obj, refer ) {

    var dots = [], dotAll, dotTemp;

    if ( obj.geometry.type === 'Geometry' ) {
        dotAll = obj.geometry.vertices;
        for (var i = 0, il = dotAll.length; i < il; i++) {
            dotTemp = dotAll[i].clone();
            obj.localToWorld( dotTemp );

            if ( !refer ) {
                dots.push( dotTemp );
            } else if ( dotTemp[refer.axis] <= refer.max && dotTemp[refer.axis] >= refer.min ) {
                dots.push( dotTemp );
            }
        }
    } else if ( obj.geometry.type === 'BufferGeometry' ) {
        dotAll = obj.geometry.attributes.position;
        dotTemp = new THREE.Vector3();
        for (var i = 0, il = dotAll.count * 3; i < il; i+=3) {
            dotTemp.set(dotAll.array[i], dotAll.array[i+1], dotAll.array[i+2]);
            obj.localToWorld( dotTemp );

            if ( !refer ) {
                dots.push( dotTemp.clone() );
            } else if ( dotTemp[refer.axis] <= refer.max && dotTemp[refer.axis] >= refer.min ) {
                dots.push( dotTemp.clone() );
            }
        }
    }

    return dots;

}

ObjectHelper.prototype.getBoxDots = function ( obj ) {

    var box = THREE.Box3();
    box.setFromObject( obj );

    var arr = [], min = box.min.clone(), max = box.max.clone();
    arr.push( min );
    arr.push( min.clone().setX( max.x ) );
    arr.push( min.clone().setZ( max.z ) );
    arr.push( max.clone().setY( min.y ) );

    arr.push( min.clone().setY( max.y ) );
    arr.push( max.clone().setZ( min.z ) );
    arr.push( max.clone().setX( min.x ) );
    arr.push( max );

    return arr;

}

ObjectHelper.prototype.getDotObj = function ( opt ) {

    var option = {color: 0xff0000, type: 'sphere'};
    $.extend(option, opt);

    var geometry, material, obj;

    if ( option.type === 'sphere' || option.type === 1 ) {                 // 球体
        geometry = new THREE.SphereBufferGeometry( 1, 10, 10 );
    } else if ( option.type === 'box' || option.type === 2 ) {             // 正方体
        geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );

    } else if ( option.type === 'circle' || option.type === 3 ) {          // 圆形
        geometry = new THREE.CircleBufferGeometry( 1, 16, 0, Math.PI * 2 );
    } else if ( option.type === 'semicircle' || option.type === 4) {       // 半圆
        geometry = new THREE.CircleBufferGeometry( 1, 8, 0, Math.PI );
    } else if ( option.type === 'triangle' || option.type === 5 ) {        // 三角形
        geometry = new THREE.CircleBufferGeometry( 1, 3, 0, Math.PI * 2 );
    } else if ( option.type === 'square' || option.type === 6 ) {          // 正方形
        geometry = new THREE.CircleBufferGeometry( 1, 4, 0, Math.PI * 2 );
    } else if ( option.type === 'pentagon' || option.type === 7 ) {        // 五边形
        geometry = new THREE.CircleBufferGeometry( 1, 5, 0, Math.PI * 2 );

    } else if ( option.type === 'triangle2' || option.type === 8 ) {       // 拉伸的三角形
        geometry = new THREE.CylinderBufferGeometry( 1, 1, 1, 3 );
    } else if ( option.type === 'pentagon2' || option.type === 9 ) {       // 拉伸的五边形
        geometry = new THREE.CylinderBufferGeometry( 1, 1, 1, 5 );
    } else if ( option.type === 'circle2' || option.type === 10 ) {        // 拉伸的圆形
        geometry = new THREE.CylinderBufferGeometry( 1, 1, 1, 16 );

    } else if ( option.type === 'triangle1' || option.type === 11 ) {      // 空心的三角形
        geometry = new THREE.RingBufferGeometry( 1, 1.3, 3, 1 );
    } else if ( option.type === 'square1' || option.type === 12 ) {        // 空心的四边形
        geometry = new THREE.RingBufferGeometry( 1, 1.3, 4, 1 );
    } else if ( option.type === 'pentagon1' || option.type === 13 ) {      // 空心的五边形
        geometry = new THREE.RingBufferGeometry( 1, 1.3, 5, 1 );
    } else if ( option.type === 'circle1' || option.type === 14 ) {        // 空心的圆
        geometry = new THREE.RingBufferGeometry( 1, 1.3, 16, 1 );

    } else if ( option.type === 'triangle3' || option.type === 15 ) {      // 管状三角形
        geometry = new THREE.TorusBufferGeometry( 1, 0.3, 8, 3 );
    } else if ( option.type === 'square3' || option.type === 16 ) {        // 管状四边形
        geometry = new THREE.TorusBufferGeometry( 1, 0.3, 8, 4 );
    } else if ( option.type === 'pentagon3' || option.type === 17 ) {      // 管状五边形
        geometry = new THREE.TorusBufferGeometry( 1, 0.3, 8, 5 );
    } else if ( option.type === 'circle3' || option.type === 18 ) {        // 管状圆
        geometry = new THREE.TorusBufferGeometry( 1, 0.3, 8, 16 );
    }

    material = new THREE.MeshBasicMaterial( {color: option.color} );
    obj = new THREE.Mesh( geometry, material );

    return obj;

}

ObjectHelper.prototype.scaleObjectsRelatively = function ( objs, camera, scale ) {

    var distance, scaleNew;
    for ( var i = 0, il = objs.length; i < il; i++ ) {

        distance = objs[ i ].position.distanceTo( camera.position );
        scaleNew = distance / 200 * scale;
        objs[ i ].scale.set( scaleNew, scaleNew, scaleNew );

    }

}

ObjectHelper.prototype.refreshObjectHelper = function ( obj, scene, sceneHelpers, textHelper ) {

    var minObjData = this.getMinObject( obj, scene.children, function ( obj1, obj2 ) {

        return obj1.id !== obj2.id && obj2.visible;

    } );

    this.deleteObjectHelper( obj, sceneHelpers );

    if ( minObjData.objMin ) {

        var lineHelper = new ObjectHelper.Line();
        var dashedLine = lineHelper.getDashedLine( [ minObjData.objNowDot, minObjData.objMinDot ], { color: 0xff0000 } );
        dashedLine.userData[ this.objectIdTag ] = obj.id;

        var refer = {
            getLine: lineHelper.getLine.bind( lineHelper ),
            getTextObject: textHelper.getTextObject.bind( textHelper )
        };

        var textObj = textHelper.getLineLengthObj(
            [ minObjData.objNowDot, minObjData.objMinDot ],
            {},
            refer
        );
        textObj.userData[ this.objectIdTag ] = obj.id;
        sceneHelpers.add( textObj );

        sceneHelpers.add( dashedLine );

    }

}

ObjectHelper.prototype.deleteObjectHelper = function ( obj, sceneHelpers ) {

    var objHelper;
    for ( var i = 0, l = sceneHelpers.children.length; i < l; i++ ) {

        objHelper = sceneHelpers.children[i];

        if (
            objHelper.userData[ this.objectIdTag ] &&
            ( objHelper.userData[ this.objectIdTag ] === obj.id )
        ) {
            sceneHelpers.remove( objHelper );
            i--;
            l--;
        }

    }

}

ObjectHelper.prototype.clearObjectHelper = function ( sceneHelpers ) {

    var objHelper;
    for ( var i = 0, l = sceneHelpers.children.length; i < l; i++ ) {

        objHelper = sceneHelpers.children[i];

        if ( objHelper.userData[ this.objectIdTag ] ) {
            sceneHelpers.remove( objHelper );
            i--;
            l--;
        }

    }

}

ObjectHelper.prototype.mergeObjectByType = function ( obj, refer ) {

    if ( ! obj || ! refer || ! refer.mergeObjects || ! refer.mergeBufferGeometry ) return null;
    console.time( '合并模型 ' + obj.name );

    var objAll, objCopy, matrixTemp;
    objAll = {
        'Mesh': [],
        'SkinnedMesh': [],
        'Line': [],
        'LineSegments': [],
        'other': []
    };

    obj.updateMatrixWorld( true );
    obj.traverse( function ( child ) {

        objCopy = child.clone( false );
        matrixTemp = objCopy.matrix.clone();
        matrixTemp.getInverse( matrixTemp.clone() );
        objCopy.applyMatrix( matrixTemp.clone() );
        objCopy.applyMatrix( child.matrixWorld.clone() );

        if ( child.type === 'Mesh' ) {

            objCopy.name = '[已合并Mesh] ' + objCopy.name;
            objAll[ child.type ].push( objCopy );

        } else if ( child.type === 'SkinnedMesh' ) {

            objCopy.name = '[已合并SkinnedMesh] ' + objCopy.name;
            objAll[ child.type ].push( objCopy );

        } else if ( child.type === 'Line' ) {

            objCopy.name = '[已合并Line] ' + objCopy.name;
            objAll[ child.type ].push( objCopy );

        } else if ( child.type === 'LineSegments' ) {

            objCopy.name = '[已合并LineSegments] ' + objCopy.name;
            objAll[ child.type ].push( objCopy );

        } else if ( child.type !== 'Group' ) {

            objCopy.name = '[未合并] ' + objCopy.name;
            objAll[ 'other' ].push( objCopy );

        }

    } );

    var group = new THREE.Group();

    for ( var type in objAll ) {

        if ( objAll[ type ].length < 1 ) continue;

        if ( type === 'other' ) {

            for ( var i = 0, l = objAll[ type ].length; i < l; i++ ) {
                group.add( objAll[ type ][ i ] );
            }

        } else {

            objCopy = refer.mergeObjects( objAll[ type ], refer );
            objCopy.name = objAll[ type ][ 0 ][ 'name' ];
            $.extend( objCopy.userData, objAll[ type ][ 0 ][ 'userData' ] );
            group.add( objCopy );

        }

    }

    group.name = obj.name;
    $.extend( group.userData, obj.userData );
    console.timeEnd( '合并模型 ' + obj.name );

    return group;

}

ObjectHelper.prototype.mergeObjects = function ( objs, refer ) {

    if ( ! objs || objs.length < 1 || ! refer || ! refer.mergeBufferGeometry ) return null;

    var type = objs[ 0 ].type, geometries = [], materials = {}, materialsArr = [],
        groups, materialTemp, geometryTemp, count = 0, countTemp = 0, startTemp,
        uvAttr = false, vertices, uvs, geometry = new THREE.BufferGeometry(),
        geometry2, midNow;
    
    if ( type === 'Mesh' || type === 'SkinnedMesh' ) 
    materialsArr.push( new THREE.MeshBasicMaterial( { side: THREE.BackSide, name: '默认背面材质' } ) );

    for ( var i = 0, l = objs.length; i < l; i++ ) {

        materialTemp = objs[ i ].material;
        geometryTemp = objs[ i ].geometry.clone();
        geometryTemp.applyMatrix( objs[ i ].matrix.clone() );
        objs[ i ].geometry.dispose();

        if ( geometryTemp.vertices ) {

            countTemp = geometryTemp.vertices.length;
            if ( objs[i].geometry.faceVertexUvs ) uvAttr = true;

        } else {

            countTemp = geometryTemp.attributes.position.count;
            if ( objs[i].geometry.attributes.uv ) uvAttr = true;

        }

        if ( geometryTemp.groups.length === 0 ) {

            geometries.push( {
                geo: geometryTemp,
                start: 0,
                count: countTemp,
                mid: materialTemp.id
            } );

            count += countTemp;

        } else {

            groups = geometryTemp.groups;
            for ( var j = 0, jl = groups.length; j < jl; j++ ) {

                geometries.push( {
                    geo: geometryTemp,
                    start: groups[ j ].start,
                    count: groups[ j ].count,
                    mid: materialTemp.id ? materialTemp.id : materialTemp[ groups[ j ].materialIndex ].id
                } );

                count += groups[ j ].count;

            }

        }

        if ( materialTemp.id ) {

            materials[ materialTemp.id ] = materialTemp;

            if ( materialTemp.transparent ) {

                materialTemp.side = THREE.DoubleSide;
                if ( materialTemp.opacity === 1 ) materialTemp.opacity = 0.6;
                
            }

        } else {

            for ( var j = 0, jl = materialTemp.length; j < jl; j++ ) {

                materials[ materialTemp[ j ].id ] = materialTemp[ j ];

                if ( materialTemp[ j ].transparent ) {

                    materialTemp[ j ].side = THREE.DoubleSide;
                    if ( materialTemp[ j ].opacity === 1 ) materialTemp[ j ].opacity = 0.6;
                    
                }
                
            }

        }

    }

    vertices = new Float32Array( count * 3 );
    uvs = new Float32Array( count * 2 );
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    if ( uvAttr ) geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    geometry.computeVertexNormals();
    geometry2 = geometry.clone();
    count = 0;

    while ( geometries.length > 0 ) {

        midNow = geometries[ 0 ].mid;
        startTemp = count;
        countTemp = 0;

        for ( var i = 0, l = geometries.length; i < l; i++ ) {

            if ( geometries[ i ].mid === midNow ) {

                if ( geometries[ i ].geo.isBufferGeometry ) {
                    refer.mergeBufferGeometry( geometry, count, geometries[ i ].geo, geometries[ i ].start, geometries[ i ].count );
                } else {

                    geometry2.fromGeometry( geometries[ i ].geo );
                    refer.mergeBufferGeometry( geometry, count, geometry2, geometries[ i ].start, geometries[ i ].count );

                }

                count += geometries[ i ].count;
                countTemp += geometries[ i ].count;

                geometries[ i ].geo.dispose();
                geometries.splice( i, 1 );
                i--;
                l--;

            }

        }
        
        if ( type === 'Mesh' || type === 'SkinnedMesh' ) {

            if ( ! materials[ midNow ].transparent )
            geometry.addGroup(
                startTemp,
                countTemp,
                0
            );
            
        }

        console.log( '合并模型：', materials[ midNow ].name );
        materialsArr.push( materials[ midNow ] );
        materials[ midNow ] = materialsArr.length - 1;

        geometry.addGroup(
            startTemp,
            countTemp,
            materials[ midNow ]
        );

    }

    var obj;

    if ( materialsArr.length === 1 ) {
        obj = new THREE[ type ]( geometry, materialsArr[ 0 ] );
    } else {
        obj = new THREE[ type ]( geometry, materialsArr );
    }

    return obj;

}

ObjectHelper.prototype.mergeBufferGeometry = function ( geometry1, offset, geometry2, start, count ) {

    if (
        ! geometry1 || ! geometry1.isBufferGeometry || ! geometry2 || ! geometry2.isBufferGeometry
        || offset < 0 || start < 0 || count < 0
    ) return null;

    var attributes1 = geometry1.attributes, attributes2 = geometry2.attributes,
        attribute1, attributeArray1, attribute2, attributeArray2, attributeOffset, length,
        attributeStart, attributeCount;

    for ( var key in attributes1 ) {

        if ( attributes2[ key ] === undefined ) continue;

        attribute1 = attributes1[ key ];
        attributeArray1 = attribute1.array;
        attribute2 = attributes2[ key ];
        attributeArray2 = attribute2.array;

        attributeOffset = attribute1.itemSize * offset;
        attributeStart = attribute2.itemSize * start;
        attributeCount = attribute2.itemSize * count;

        length = Math.min( attributeCount, attributeArray1.length - attributeOffset );

        for ( var i = attributeStart, j = attributeOffset, z = 0; z < length; i ++, j ++, z ++ ) {
            attributeArray1[ j ] = attributeArray2[ i ];
        }

    }

    return geometry1;

}
