importScripts('../../build/three105.min.js');

var library = '', geometries = {};

onmessage = function( e ) {

    console.log( 'worker: ColladaLoaderGeometry' );
    library = '<library_geometries>' + e.data;

    parseLibrary( 'library_geometries', 'geometry', parseGeometry );

    postMessage( geometries );

}

/**
 * ### 使用方式：
 * ```js
 * var sourceTag = getElementByTag( 'source', true, 1 );
 * // <source id="ID15"> <float_array id="ID19" count="60">...</float_array>...</source>
 * var floatArrayTag = getElementByTag( 'float_array', true, 0, sourceTag );
 * // <float_array id="ID19" count="60">...</float_array>
 * var idString = getDataByElement( floatArrayTag, 'attribute', 'id' );
 * // ID19
 * var content = getDataByElement( floatArrayTag, 'content' );
 * // 0 1.818989e-12 60.61458 59.05512
 * var name = getDataByElement( floatArrayTag, 'name' );
 * // float_array
 * ```
 *
 * ### 参数：
 * `element` 元素字符串；`type` 获取的方式：`attribute` 属性，`content` 内容，`name` 标签名；`name` 属性名称，可不传
 *
 * ### 返回：
 * 包含数据的字符串；`null`
 */

function getDataByElement( element, type, name ) {

    if ( ! element || ! type ) return null;

    if ( type === 'attribute' ) {

        if ( ! name ) return null;

        var reg = new RegExp( ' ' + name + '=".*?"', 'g' );
        var subEle = element.slice( 1, element.indexOf( '>' ) );
        var array = subEle.match( reg );

        if ( array ) return array[ 0 ].slice( name.length + 3, -1 );
        return null;

    } else if ( type === 'content' ) {

        var index0, index1;
        index0 = element.indexOf( '>' );
        index1 = element.lastIndexOf( '</' );

        if ( index0 === -1 || index1 === -1 ) return null;
        return element.slice( index0 + 1, index1 );

    } else if ( type === 'name' ) {

        var reg = new RegExp( '<.+?[ >]{1,1}', 'g' );
        var array = element.match( reg );

        if ( array ) return array[ 0 ].slice( 1, -1 );
        return null;

    }

}

/**
 * ### 使用方式：
 * ```js
 * var sourceTag = getElementByTag( 'source', true, 1 );
 * // <source id="ID15"> <float_array id="ID19" count="60">...</float_array>...</source>
 * var floatArrayTag = getElementByTag( 'float_array', true, 0, sourceTag );
 * // <float_array id="ID19" count="60">...</float_array>
 * var floatArrayTag = setDataByElement( floatArrayTag, 'attribute', { key: 'ddd', value: '222' } );
 * // <float_array ddd="222" id="ID19" count="60">...</float_array>
 * var floatArrayTag = setDataByElement( floatArrayTag, 'content', { content: 'ddd' } );
 * // <float_array ddd="222" id="ID19" count="60">ddd</float_array>
 * ```
 *
 * ### 参数：
 * `element` 元素字符串；`type` 设置的方式：`attribute` 属性，`content` 内容；
 * `data` 设置的内容，对象类型：`key` 属性名，`value` 属性值，`content` 内容
 *
 * ### 返回：
 * 包含设置的字符串；`null` 设置失败
 */

function setDataByElement( element, type, data ) {

    if ( ! element || ! type ) return null;

    if ( type === 'attribute' ) {

        if ( ! data || ! data.key ) return null;

        var index0, index1, index2;
        index0 = element.indexOf( '<' );
        index1 = element.indexOf( '>' );
        index2 = element.indexOf( ' ' );

        if ( index0 === -1 || index1 === -1 ) return null;

        var attr = ' ' + data.key + '="' + data.value + '"';
        if ( index2 === -1 || index2 > index1 ) {

            if ( element.charAt( index1 - 1 ) === '/' ) index1 -= 1;
            element = element.slice( 0, index1 ) + attr + element.slice( index1 );

        } else {

            element = element.slice( 0, index2 ) + attr + element.slice( index2 );

        }

        return element;

    } else if ( type === 'content' ) {

        if ( ! data ) return null;

        var index0, index1;
        index0 = element.indexOf( '>' );
        index1 = element.lastIndexOf( '</' );

        if ( index0 === -1 || index1 === -1 ) return null;
        element = element.slice( 0, index0 + 1 ) + data.content + element.slice( index1 );
        return element;

    }

}

/**
 * ### 使用方式：
 * ```js
 * var sourceTag = getElementByTag( 'source', true, 1 );
 * // <source id="ID15"> <float_array id="ID19" count="60">...</float_array>...</source>
 * var floatArrayTag = getElementByTag( 'float_array', true, 0, sourceTag );
 * // <float_array id="ID19" count="60">...</float_array>
 * var paramTag = getElementByTag( 'param', false, 1, sourceTag );
 * // <param name="Y" type="float" />
 * ```
 *
 * ### 参数：
 * `tag` 标签名称；`end` 是否有结束标签，自动判断；`index` 匹配字符串的索引，从 0 开始；`subText` 字符串，可不传
 *
 * ### 返回：
 * 包含标签的字符串；`null`
 */

function getElementByTag( tag, end1, index, subText ) {

    if ( ! tag || isNaN( parseInt( index ) ) ) return null;

    var index0 = 0, index1, match, endIndex, end;  // 结束标签自动判断，不需要传入
    var startNum = 0, endNum = 0, checkIndex, checkChar;

    if (
        tag === 'up_axis' || tag === 'visual_scene' ||
        tag === 'asset' || tag === 'scene' ||
        tag.indexOf( 'library' ) !== -1
    ) {

        index0 = text.indexOf( '<' + tag );

        if ( index0 === -1 || index > 0 ) {

            console.log( 'getElementByTag return null, tag:', tag );
            return null;

        }

        index1 = text.indexOf( '</' + tag + '>' ) + tag.length + 3;
        return text.slice( index0, index1 );

    } else if (
        tag === 'unit' || tag === 'instance_visual_scene'
    ) {

        index0 = text.indexOf( '<' + tag );

        if ( index0 === -1 || index > 0 ) {

            console.log( 'getElementByTag return null, tag:', tag );
            return null;

        }

        index1 = text.indexOf( '/>', index0 ) + 2;
        return text.slice( index0, index1 );

    }

    if ( ! subText ) {

        console.log( 'getElementByTag return null, tag:', tag );
        return null;

    }

    index1 = subText.indexOf( '>' );
    if ( index1 === -1 ) return null;

    for ( var i = 0; i <= index; i++ ) {

        // 开始搜索

        index0 = subText.indexOf( '<', index1 + 1 );
        if ( index0 === -1 ) return null;

        // 是否有结束标签

        endIndex = subText.indexOf( '>', index0 );
        if ( subText.charAt( endIndex - 1 ) === '/' ) {
            end = false;
        } else {
            end = true;
        }

        // 是否匹配

        match = subText.slice( index0, tag.length + 2 + index0 );

        if ( match === '<' + tag + ' ' || match === '<' + tag + '>' ) {

            match = true;

        } else {

            match = false;
            index++;

        }

        // 循环检查

        checkIndex = index0;

        while ( true ) {

            checkChar = subText.charAt( checkIndex );

            if ( checkChar === '<' ) {

                if ( subText.charAt( checkIndex + 1 ) !== '/' ) startNum++;

            } else if ( checkChar === '/' ) {

                if (
                    subText.charAt( checkIndex - 1 ) === '<' ||
                    subText.charAt( checkIndex + 1 ) === '>'
                ) endNum++;

            }

            if ( startNum === 0 && endNum === 1 ) return null;

            if ( startNum !== 0 && startNum === endNum ) {

                index1 = checkIndex;
                break;

            }

            checkIndex++;

        }

        // 进入下一轮搜索

        index1 = subText.indexOf( '>', index1 );

    }

    if ( match ) {
        return subText.slice( index0, index1 + 1 );
    } else {
        return null;
    }

}

/**
 * ### 使用方式：
 * ```js
 * var sourceTag = getElementByTag( 'source', true, 1 );
 * // <source id="ID15"> <float_array id="ID19" count="60">...</float_array>...</source>
 * var paramTag = getElementByTag( 'param', false, 1, sourceTag );
 * // <param name="Y" type="float" />
 * var sourceTag = replaceElementByTag( 'float_array', 0, paramTag, sourceTag );
 * // <source id="ID15"> <param name="Y" type="float" />...</source>
 * ```
 *
 * ### 参数：
 * `tag` 替换的标签名称；`index` 匹配字符串的索引，从 0 开始；`element` 新的字符串；`subText` 字符串
 *
 * ### 返回：
 * 包含标签的字符串；`null`
 */

function replaceElementByTag( tag, index, element, subText ) {

    if ( ! tag || isNaN( parseInt( index ) ) ) return subText;

    var index0 = 0, index1, match, endIndex, end;  // 结束标签自动判断，不需要传入
    var startNum = 0, endNum = 0, checkIndex, checkChar;

    if ( subText ) {

        index1 = subText.indexOf( '>' );
        if ( index1 === -1 ) return subText;

        for ( var i = 0; i <= index; i++ ) {

            // 开始搜索

            index0 = subText.indexOf( '<', index1 + 1 );
            if ( index0 === -1 ) return subText;

            // 是否有结束标签

            endIndex = subText.indexOf( '>', index0 );
            if ( subText.charAt( endIndex - 1 ) === '/' ) {
                end = false;
            } else {
                end = true;
            }

            // 是否匹配

            match = subText.slice( index0, tag.length + 2 + index0 );

            if ( match === '<' + tag + ' ' || match === '<' + tag + '>' ) {

                match = true;

            } else {

                match = false;
                index++;

            }

            // 循环检查

            checkIndex = index0;

            while ( true ) {

                checkChar = subText.charAt( checkIndex );

                if ( checkChar === '<' ) {

                    if ( subText.charAt( checkIndex + 1 ) !== '/' ) startNum++;

                } else if ( checkChar === '/' ) {

                    if (
                        subText.charAt( checkIndex - 1 ) === '<' ||
                        subText.charAt( checkIndex + 1 ) === '>'
                    ) endNum++;

                }

                if ( startNum === 0 && endNum === 1 ) return null;

                if ( startNum !== 0 && startNum === endNum ) {

                    index1 = checkIndex;
                    break;

                }

                checkIndex++;

            }

            // 进入下一轮搜索

            index1 = subText.indexOf( '>', index1 );

        }

        if ( match ) {
            return subText.slice( 0, index0 )  + element + subText.slice( index1 + 1 );
        } else {
            return subText;
        }

    } else {
        return subText;
    }

}

/**
 * ### 使用方式：
 * ```js
 * deleteElementByTag( 'scene' );
 * // 从读取到的字符串`text`中删除指定的标签：
 * // `up_axis/visual_scene/asset/scene/library_.../unit/instance_visual_scene`
 * ```
 *
 * ### 参数：
 * `tag` 要删除的标签名称
 *
 * ### 返回：
 * 无
 */

function deleteElementByTag( tag ) {

    if (
        tag === 'up_axis' || tag === 'visual_scene' ||
        tag === 'asset' || tag === 'scene' ||
        tag.indexOf( 'library' ) !== -1
    ) {

        index0 = text.indexOf( '<' + tag );

        if ( index0 === -1 ) {

            console.log( 'deleteElementByTag can not find tag, tag:', tag );
            return null;

        }

        index1 = text.indexOf( '</' + tag + '>' ) + tag.length + 3;
        text = text.slice( 0, index0 ) + text.slice( index1 );

    } else if (
        tag === 'unit' || tag === 'instance_visual_scene'
    ) {

        index0 = text.indexOf( '<' + tag );

        if ( index0 === -1 ) {

            console.log( 'deleteElementByTag can not find tag, tag:', tag );
            return null;

        }

        index1 = text.indexOf( '/>', index0 ) + 2;
        text = text.slice( 0, index0 ) + text.slice( index1 );

    } else {

        console.log( 'deleteElementByTag can not find tag, tag:', tag );

    }

}

function parseStrings( text ) {

    if ( text.length === 0 ) return [];

    var parts = text.trim().split( /\s+/ );
    var array = new Array( parts.length );

    for ( var i = 0, l = parts.length; i < l; i ++ ) {

        array[ i ] = parts[ i ];

    }

    return array;

}

function parseFloats( text ) {

    if ( text.length === 0 ) return [];

    var parts = text.trim().split( /\s+/ );
    var array = new Array( parts.length );

    for ( var i = 0, l = parts.length; i < l; i ++ ) {

        array[ i ] = parseFloat( parts[ i ] );

    }

    return array;

}

function parseInts( text ) {

    if ( text.length === 0 ) return [];

    var parts = text.trim().split( /\s+/ );
    var array = new Array( parts.length );

    for ( var i = 0, l = parts.length; i < l; i ++ ) {

        array[ i ] = parseInt( parts[ i ] );

    }

    return array;

}

function parseId( text ) {

    return text.substring( 1 );

}

function generateId() {

    return 'three_default_' + ( count ++ );

}

function isEmpty( object ) {

    return Object.keys( object ).length === 0;

}

// asset

function parseAsset( xml ) {

    return {
        unit: parseAssetUnit( getElementByTag( 'unit', false, 0, xml ) ),
        upAxis: parseAssetUpAxis( getElementByTag( 'up_axis', true, 0, xml ) )
    };

}

function parseAssetUnit( xml ) {

    var unit = getDataByElement( xml, 'attribute', 'meter' );
    return unit !== null ? parseFloat( unit ) : 1;

}

function parseAssetUpAxis( xml ) {

    var axis = getDataByElement( xml, 'content' );
    return axis !== null ? axis : 'Y_UP';

}

// library

function parseLibrary( libraryName, nodeName, parser ) {

    if ( library !== null ) {

        var index = 0, element;

        while ( true ) {

            element = getElementByTag( nodeName, true, index, library );

            if ( element ) {

                parser( element );
                index++;
                // if ( nodeName === 'visual_scene' ) break;

            } else {
                break;
            }

        }

    }

    // if ( libraryName !== 'scene' ) deleteElementByTag( libraryName );

}

function buildLibrary( data, builder ) {

    for ( var name in data ) {

        var object = data[ name ];
        object.build = builder( data[ name ] );

    }

}

// get

function getBuild( data, builder ) {

    if ( data.build !== undefined ) return data.build;

    data.build = builder( data );

    return data.build;

}

// animation

function parseAnimation( xml ) {

    var data = {
        sources: {},
        samplers: {},
        channels: {}
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'source', true, index, xml );

        if ( element ) {

            data.sources[ getDataByElement( element, 'attribute', 'id' ) ] = parseSource( element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'sampler', true, index, xml );

        if ( element ) {

            data.samplers[ getDataByElement( element, 'attribute', 'id' ) ] = parseAnimationSampler( element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'channel', true, index, xml );

        if ( element ) {

            data.channels[ getDataByElement( element, 'attribute', 'target' ) ] = parseAnimationChannel( element );
            index++;

        } else {
            break;
        }

    }

    library.animations[ getDataByElement( xml, 'attribute', 'id' ) ] = data;

}

function parseAnimationSampler( xml ) {

    var data = {
        inputs: {},
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'input', false, index, xml );

        if ( element ) {

            data.inputs[ getDataByElement( element, 'attribute', 'semantic' ) ] = parseId( getDataByElement( element, 'attribute', 'source' ) );
            index++;

        } else {
            return data;
        }
    }

}

function parseAnimationChannel( xml ) {

    var data = {};

    var target = getDataByElement( xml, 'attribute', 'target' );

    // parsing SID Addressing Syntax

    var parts = target.split( '/' );

    var id = parts.shift();
    var sid = parts.shift();

    // check selection syntax

    var arraySyntax = ( sid.indexOf( '(' ) !== - 1 );
    var memberSyntax = ( sid.indexOf( '.' ) !== - 1 );

    if ( memberSyntax ) {

        //  member selection access

        parts = sid.split( '.' );
        sid = parts.shift();
        data.member = parts.shift();

    } else if ( arraySyntax ) {

        // array-access syntax. can be used to express fields in one-dimensional vectors or two-dimensional matrices.

        var indices = sid.split( '(' );
        sid = indices.shift();

        for ( var i = 0; i < indices.length; i ++ ) {

            indices[ i ] = parseInt( indices[ i ].replace( /\)/, '' ) );

        }

        data.indices = indices;

    }

    data.id = id;
    data.sid = sid;

    data.arraySyntax = arraySyntax;
    data.memberSyntax = memberSyntax;

    data.sampler = parseId( getDataByElement( xml, 'attribute', 'source' ) );

    return data;

}

function buildAnimation( data ) {

    var tracks = [];

    var channels = data.channels;
    var samplers = data.samplers;
    var sources = data.sources;

    for ( var target in channels ) {

        if ( channels.hasOwnProperty( target ) ) {

            var channel = channels[ target ];
            var sampler = samplers[ channel.sampler ];

            var inputId = sampler.inputs.INPUT;
            var outputId = sampler.inputs.OUTPUT;

            var inputSource = sources[ inputId ];
            var outputSource = sources[ outputId ];

            var animation = buildAnimationChannel( channel, inputSource, outputSource );

            createKeyframeTracks( animation, tracks );

        }

    }

    return tracks;

}

function getAnimation( id ) {

    return getBuild( library.animations[ id ], buildAnimation );

}

function buildAnimationChannel( channel, inputSource, outputSource ) {

    var node = library.nodes[ channel.id ];
    var object3D = getNode( node.id );

    var transform = node.transforms[ channel.sid ];
    var defaultMatrix = node.matrix.clone().transpose();

    var time, stride;
    var i, il, j, jl;

    var data = {};

    // the collada spec allows the animation of data in various ways.
    // depending on the transform type (matrix, translate, rotate, scale), we execute different logic

    switch ( transform ) {

        case 'matrix':

            for ( i = 0, il = inputSource.array.length; i < il; i ++ ) {

                time = inputSource.array[ i ];
                stride = i * outputSource.stride;

                if ( data[ time ] === undefined ) data[ time ] = {};

                if ( channel.arraySyntax === true ) {

                    var value = outputSource.array[ stride ];
                    var index = channel.indices[ 0 ] + 4 * channel.indices[ 1 ];

                    data[ time ][ index ] = value;

                } else {

                    for ( j = 0, jl = outputSource.stride; j < jl; j ++ ) {

                        data[ time ][ j ] = outputSource.array[ stride + j ];

                    }

                }

            }

            break;

        case 'translate':
            console.warn( 'THREE.ColladaLoader: Animation transform type "%s" not yet implemented.', transform );
            break;

        case 'rotate':
            console.warn( 'THREE.ColladaLoader: Animation transform type "%s" not yet implemented.', transform );
            break;

        case 'scale':
            console.warn( 'THREE.ColladaLoader: Animation transform type "%s" not yet implemented.', transform );
            break;

    }

    var keyframes = prepareAnimationData( data, defaultMatrix );

    var animation = {
        name: object3D.uuid,
        keyframes: keyframes
    };

    return animation;

}

function prepareAnimationData( data, defaultMatrix ) {

    var keyframes = [];

    // transfer data into a sortable array

    for ( var time in data ) {

        keyframes.push( { time: parseFloat( time ), value: data[ time ] } );

    }

    // ensure keyframes are sorted by time

    keyframes.sort( ascending );

    // now we clean up all animation data, so we can use them for keyframe tracks

    for ( var i = 0; i < 16; i ++ ) {

        transformAnimationData( keyframes, i, defaultMatrix.elements[ i ] );

    }

    return keyframes;

    // array sort function

    function ascending( a, b ) {

        return a.time - b.time;

    }

}

var position = new THREE.Vector3();
var scale = new THREE.Vector3();
var quaternion = new THREE.Quaternion();

function createKeyframeTracks( animation, tracks ) {

    var keyframes = animation.keyframes;
    var name = animation.name;

    var times = [];
    var positionData = [];
    var quaternionData = [];
    var scaleData = [];

    for ( var i = 0, l = keyframes.length; i < l; i ++ ) {

        var keyframe = keyframes[ i ];

        var time = keyframe.time;
        var value = keyframe.value;

        matrix.fromArray( value ).transpose();
        matrix.decompose( position, quaternion, scale );

        times.push( time );
        positionData.push( position.x, position.y, position.z );
        quaternionData.push( quaternion.x, quaternion.y, quaternion.z, quaternion.w );
        scaleData.push( scale.x, scale.y, scale.z );

    }

    if ( positionData.length > 0 ) tracks.push( new THREE.VectorKeyframeTrack( name + '.position', times, positionData ) );
    if ( quaternionData.length > 0 ) tracks.push( new THREE.QuaternionKeyframeTrack( name + '.quaternion', times, quaternionData ) );
    if ( scaleData.length > 0 ) tracks.push( new THREE.VectorKeyframeTrack( name + '.scale', times, scaleData ) );

    return tracks;

}

function transformAnimationData( keyframes, property, defaultValue ) {

    var keyframe;

    var empty = true;
    var i, l;

    // check, if values of a property are missing in our keyframes

    for ( i = 0, l = keyframes.length; i < l; i ++ ) {

        keyframe = keyframes[ i ];

        if ( keyframe.value[ property ] === undefined ) {

            keyframe.value[ property ] = null; // mark as missing

        } else {

            empty = false;

        }

    }

    if ( empty === true ) {

        // no values at all, so we set a default value

        for ( i = 0, l = keyframes.length; i < l; i ++ ) {

            keyframe = keyframes[ i ];

            keyframe.value[ property ] = defaultValue;

        }

    } else {

        // filling gaps

        createMissingKeyframes( keyframes, property );

    }

}

function createMissingKeyframes( keyframes, property ) {

    var prev, next;

    for ( var i = 0, l = keyframes.length; i < l; i ++ ) {

        var keyframe = keyframes[ i ];

        if ( keyframe.value[ property ] === null ) {

            prev = getPrev( keyframes, i, property );
            next = getNext( keyframes, i, property );

            if ( prev === null ) {

                keyframe.value[ property ] = next.value[ property ];
                continue;

            }

            if ( next === null ) {

                keyframe.value[ property ] = prev.value[ property ];
                continue;

            }

            interpolate( keyframe, prev, next, property );

        }

    }

}

function getPrev( keyframes, i, property ) {

    while ( i >= 0 ) {

        var keyframe = keyframes[ i ];

        if ( keyframe.value[ property ] !== null ) return keyframe;

        i --;

    }

    return null;

}

function getNext( keyframes, i, property ) {

    while ( i < keyframes.length ) {

        var keyframe = keyframes[ i ];

        if ( keyframe.value[ property ] !== null ) return keyframe;

        i ++;

    }

    return null;

}

function interpolate( key, prev, next, property ) {

    if ( ( next.time - prev.time ) === 0 ) {

        key.value[ property ] = prev.value[ property ];
        return;

    }

    key.value[ property ] = ( ( key.time - prev.time ) * ( next.value[ property ] - prev.value[ property ] ) / ( next.time - prev.time ) ) + prev.value[ property ];

}

// animation clips

function parseAnimationClip( xml ) {

    var data = {
        name: getDataByElement( xml, 'attribute', 'id' ) || 'default',
        start: parseFloat( getDataByElement( xml, 'attribute', 'start' ) || 0 ),
        end: parseFloat( getDataByElement( xml, 'attribute', 'end' ) || 0 ),
        animations: []
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'instance_animation', false, index, xml );

        if ( element ) {

            data.animations.push( parseId( getDataByElement( element, 'attribute', 'url' ) ) );
            index++;

        } else {
            break;
        }
    }

    library.clips[ getDataByElement( xml, 'attribute', 'id') ] = data;

}

function buildAnimationClip( data ) {

    var tracks = [];

    var name = data.name;
    var duration = ( data.end - data.start ) || - 1;
    var animations = data.animations;

    for ( var i = 0, il = animations.length; i < il; i ++ ) {

        var animationTracks = getAnimation( animations[ i ] );

        for ( var j = 0, jl = animationTracks.length; j < jl; j ++ ) {

            tracks.push( animationTracks[ j ] );

        }

    }

    return new THREE.AnimationClip( name, duration, tracks );

}

function getAnimationClip( id ) {

    return getBuild( library.clips[ id ], buildAnimationClip );

}

// controller

function parseController( xml ) {

    var data = {};

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'skin', false, index, xml );

        if ( element ) {

            data.id = parseId( getDataByElement( element, 'attribute', 'source' ) );
            data.skin = parseSkin( element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'morph', false, index, xml );

        if ( element ) {

            data.id = parseId( getDataByElement( element, 'attribute', 'source' ) );
            console.warn( 'THREE.ColladaLoader: Morph target animation not supported yet.' );
            index++;

        } else {
            break;
        }

    }

    library.controllers[ getDataByElement( xml, 'attribute', 'id' ) ] = data;

}

function parseSkin( xml ) {

    var data = {
        sources: {}
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'bind_shape_matrix', true, index, xml );

        if ( element ) {

            data.bindShapeMatrix = parseFloats( getDataByElement( element, 'content' ) );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'source', true, index, xml );

        if ( element ) {

            data.sources[ getDataByElement( element, 'attribute', 'id' ) ] = parseSource( element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'joints', true, index, xml );

        if ( element ) {

            data.joints = parseJoints( element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'vertex_weights', true, index, xml );

        if ( element ) {

            data.vertexWeights = parseVertexWeights( element );
            index++;

        } else {
            break;
        }

    }

    return data;

}

function parseJoints( xml ) {

    var data = {
        inputs: {}
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'input', false, index, xml );

        if ( element ) {

            data.inputs[ getDataByElement( element, 'attribute', 'semantic' ) ] = parseId( getDataByElement( element, 'attribute', 'source' ) );
            index++;

        } else {
            break;
        }
    }

    return data;

}

function parseVertexWeights( xml ) {

    var data = {
        inputs: {}
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'input', false, index, xml );

        if ( element ) {

            data.inputs[ getDataByElement( element, 'attribute', 'semantic' ) ] = {

                id: parseId( getDataByElement( element, 'attribute', 'source' ) ),
                offset: parseInt( getDataByElement( element, 'attribute', 'offset' ) )

            };
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'vcount', true, index, xml );

        if ( element ) {

            data.vcount = parseInts( getDataByElement( element, 'content' ) );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'v', true, index, xml );

        if ( element ) {

            data.v = parseInts( getDataByElement( element, 'content' ) );
            index++;

        } else {
            break;
        }

    }

    return data;

}

function buildController( data ) {

    var build = {
        id: data.id
    };

    var geometry = library.geometries[ build.id ];

    if ( data.skin !== undefined ) {

        build.skin = buildSkin( data.skin );

        // we enhance the 'sources' property of the corresponding geometry with our skin data

        geometry.sources.skinIndices = build.skin.indices;
        geometry.sources.skinWeights = build.skin.weights;

    }

    return build;

}

function buildSkin( data ) {

    var BONE_LIMIT = 4;

    var build = {
        joints: [], // this must be an array to preserve the joint order
        indices: {
            array: [],
            stride: BONE_LIMIT
        },
        weights: {
            array: [],
            stride: BONE_LIMIT
        }
    };

    var sources = data.sources;
    var vertexWeights = data.vertexWeights;

    var vcount = vertexWeights.vcount;
    var v = vertexWeights.v;
    var jointOffset = vertexWeights.inputs.JOINT.offset;
    var weightOffset = vertexWeights.inputs.WEIGHT.offset;

    var jointSource = data.sources[ data.joints.inputs.JOINT ];
    var inverseSource = data.sources[ data.joints.inputs.INV_BIND_MATRIX ];

    var weights = sources[ vertexWeights.inputs.WEIGHT.id ].array;
    var stride = 0;

    var i, j, l;

    // procces skin data for each vertex

    for ( i = 0, l = vcount.length; i < l; i ++ ) {

        var jointCount = vcount[ i ]; // this is the amount of joints that affect a single vertex
        var vertexSkinData = [];

        for ( j = 0; j < jointCount; j ++ ) {

            var skinIndex = v[ stride + jointOffset ];
            var weightId = v[ stride + weightOffset ];
            var skinWeight = weights[ weightId ];

            vertexSkinData.push( { index: skinIndex, weight: skinWeight } );

            stride += 2;

        }

        // we sort the joints in descending order based on the weights.
        // this ensures, we only procced the most important joints of the vertex

        vertexSkinData.sort( descending );

        // now we provide for each vertex a set of four index and weight values.
        // the order of the skin data matches the order of vertices

        for ( j = 0; j < BONE_LIMIT; j ++ ) {

            var d = vertexSkinData[ j ];

            if ( d !== undefined ) {

                build.indices.array.push( d.index );
                build.weights.array.push( d.weight );

            } else {

                build.indices.array.push( 0 );
                build.weights.array.push( 0 );

            }

        }

    }

    // setup bind matrix

    build.bindMatrix = new THREE.Matrix4().fromArray( data.bindShapeMatrix ).transpose();

    // process bones and inverse bind matrix data

    for ( i = 0, l = jointSource.array.length; i < l; i ++ ) {

        var name = jointSource.array[ i ];
        var boneInverse = new THREE.Matrix4().fromArray( inverseSource.array, i * inverseSource.stride ).transpose();

        build.joints.push( { name: name, boneInverse: boneInverse } );

    }

    return build;

    // array sort function

    function descending( a, b ) {

        return b.weight - a.weight;

    }

}

function getController( id ) {

    return getBuild( library.controllers[ id ], buildController );

}

// image

function parseImage( xml ) {

    var initTag = getElementByTag( 'init_from', true, 0, xml );
    var data = {
        init_from: getDataByElement( initTag, 'content' )
    };

    library.images[ getDataByElement( xml, 'attribute', 'id' ) ] = data;

}

function buildImage( data ) {

    if ( data.build !== undefined ) return data.build;

    return data.init_from;

}

function getImage( id ) {

    return getBuild( library.images[ id ], buildImage );

}

// effect

function parseEffect( xml ) {

    var data = {};

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'profile_COMMON', true, index, xml );

        if ( element ) {

            data.profile = parseEffectProfileCOMMON( element );
            index++;

        } else {
            break;
        }

    }

    library.effects[ getDataByElement( xml, 'attribute', 'id' ) ] = data;

}

function parseEffectProfileCOMMON( xml ) {

    var data = {
        surfaces: {},
        samplers: {}
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'newparam', true, index, xml );

        if ( element ) {

            parseEffectNewparam( element, data );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'technique', true, index, xml );

        if ( element ) {

            data.technique = parseEffectTechnique( element );
            index++;

        } else {
            break;
        }

    }

    return data;

}

function parseEffectNewparam( xml, data ) {

    var sid = getDataByElement( xml, 'attribute', 'sid' );

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'surface', true, index, xml );

        if ( element ) {

            data.surfaces[ sid ] = parseEffectSurface( element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'sampler2D', true, index, xml );

        if ( element ) {

            data.samplers[ sid ] = parseEffectSampler( element );
            index++;

        } else {
            break;
        }

    }

}

function parseEffectSurface( xml ) {

    var data = {};

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'init_from', false, index, xml );

        if ( element ) {

            data.init_from = getDataByElement( element, 'content' );
            index++;

        } else {
            break;
        }

    }

    return data;

}

function parseEffectSampler( xml ) {

    var data = {};

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'source', true, index, xml );

        if ( element ) {

            data.source = getDataByElement( element, 'content' );
            index++;

        } else {
            break;
        }

    }

    return data;

}

function parseEffectTechnique( xml ) {

    var data = {};

    function ok( type, child ) {

        data.type = type;
        data.parameters = parseEffectParameters( child );

    }

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'constant', true, index, xml );

        if ( element ) {

            ok( 'constant', element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'lambert', true, index, xml );

        if ( element ) {

            ok( 'lambert', element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'blinn', true, index, xml );

        if ( element ) {

            ok( 'blinn', element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'phong', true, index, xml );

        if ( element ) {

            ok( 'phong', element );
            index++;

        } else {
            break;
        }

    }

    return data;

}

function parseEffectParameters( xml ) {

    var data = {};

    var index = 0, element;

    function get( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, xml );

            if ( element ) {

                data[ name ] = parseEffectParameter( element );
                index++;

            } else {
                break;
            }

        }

    }

    get( 'emission' );
    get( 'diffuse' );
    get( 'specular' );
    get( 'shininess' );
    get( 'transparent' );
    get( 'transparency' );

    return data;

}

function parseEffectParameter( xml ) {

    var data = {};

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, name === 'texture' ? false : true, index, xml );

            if ( element ) {

                switch ( name ) {

                    case 'color':
                        data[ name ] = parseFloats( getDataByElement( element, 'content' ) );
                        break;

                    case 'float':
                        data[ name ] = parseFloat( getDataByElement( element, 'content' ) );
                        break;

                    case 'texture':
                        data[ name ] = {
                            id: getDataByElement( element, 'attribute', 'texture' ),
                            extra: parseEffectParameterTexture( element )
                        };
                        break;

                }

                index++;

            } else {
                break;
            }

        }

    }

    getData( 'color' );
    getData( 'float' );
    getData( 'texture' );

    return data;

}

function parseEffectParameterTexture( xml ) {

    var data = {
        technique: {}
    };

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, xml );

            if ( element ) {

                parseEffectParameterTextureExtra( element, data );
                index++;

            } else {
                break;
            }

        }

    }

    getData( 'extra' );

    return data;

}

function parseEffectParameterTextureExtra( xml, data ) {

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, xml );

            if ( element ) {

                parseEffectParameterTextureExtraTechnique( element, data );
                index++;

            } else {
                break;
            }

        }

    }

    getData( 'technique' );

}

function parseEffectParameterTextureExtraTechnique( xml, data ) {

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, xml );

            if ( element ) {

                switch ( name ) {

                    case 'repeatU':
                    case 'repeatV':
                    case 'offsetU':
                    case 'offsetV':
                        data.technique[ name ] = parseFloat( getDataByElement( element, 'content' ) );
                        break;

                    case 'wrapU':
                    case 'wrapV':

                        // some files have values for wrapU/wrapV which become NaN via parseInt

                        if ( getDataByElement( element, 'content' ).toUpperCase() === 'TRUE' ) {

                            data.technique[ name ] = 1;

                        } else if ( getDataByElement( element, 'content' ).toUpperCase() === 'FALSE' ) {

                            data.technique[ name ] = 0;

                        } else {

                            data.technique[ name ] = parseInt( getDataByElement( element, 'content' ) );

                        }

                        break;

                }

                index++;

            } else {
                break;
            }

        }

    }

    getData( 'repeatU' );
    getData( 'repeatV' );
    getData( 'offsetU' );
    getData( 'offsetV' );
    getData( 'wrapU' );
    getData( 'wrapV' );

}

function buildEffect( data ) {

    return data;

}

function getEffect( id ) {

    return getBuild( library.effects[ id ], buildEffect );

}

// material

function parseMaterial( xml ) {

    var data = {
        name: getDataByElement( xml, 'attribute', 'name' )
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'instance_effect', false, index, xml );

        if ( element ) {

            data.url = parseId( getDataByElement( element, 'attribute', 'url' ) );
            index++;

        } else {
            break;
        }

    }

    library.materials[ getDataByElement( xml, 'attribute', 'id' ) ] = data;

}

function buildMaterial( data ) {

    var effect = getEffect( data.url );
    var technique = effect.profile.technique;

    var material;

    switch ( technique.type ) {

        case 'phong':
        case 'blinn':
            material = new THREE.MeshPhongMaterial();
            break;

        case 'lambert':
            material = new THREE.MeshLambertMaterial();
            break;

        default:
            material = new THREE.MeshBasicMaterial();
            break;

    }

    material.name = data.name;

    function getTexture( textureObject ) {

        var sampler = effect.profile.samplers[ textureObject.id ];

        if ( sampler !== undefined ) {

            var surface = effect.profile.surfaces[ sampler.source ];

            var texture = textureLoader.load( getImage( surface.init_from ) );

            var extra = textureObject.extra;

            if ( extra !== undefined && extra.technique !== undefined && isEmpty( extra.technique ) === false ) {

                var technique = extra.technique;

                texture.wrapS = technique.wrapU ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
                texture.wrapT = technique.wrapV ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;

                texture.offset.set( technique.offsetU || 0, technique.offsetV || 0 );
                texture.repeat.set( technique.repeatU || 1, technique.repeatV || 1 );

            } else {

                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;

            }

            return texture;

        }

        console.error( 'THREE.ColladaLoader: Undefined sampler', textureObject.id );

        return null;

    }

    var parameters = technique.parameters;

    for ( var key in parameters ) {

        var parameter = parameters[ key ];

        switch ( key ) {

            case 'diffuse':
                if ( parameter.color ) material.color.fromArray( parameter.color );
                if ( parameter.texture ) material.map = getTexture( parameter.texture );
                break;
            case 'specular':
                if ( parameter.color && material.specular ) material.specular.fromArray( parameter.color );
                if ( parameter.texture ) material.specularMap = getTexture( parameter.texture );
                break;
            case 'shininess':
                if ( parameter.float && material.shininess )
                    material.shininess = parameter.float;
                break;
            case 'emission':
                if ( parameter.color && material.emissive )
                    material.emissive.fromArray( parameter.color );
                break;
            case 'transparent':
                // if ( parameter.texture ) material.alphaMap = getTexture( parameter.texture );
                material.transparent = true;
                break;
            case 'transparency':
                if ( parameter.float !== undefined ) material.opacity = parameter.float;
                material.transparent = true;
                break;

        }

    }

    return material;

}

function getMaterial( id ) {

    return getBuild( library.materials[ id ], buildMaterial );

}

// camera

function parseCamera( xml ) {

    var data = {
        name: getDataByElement( xml, 'attribute', 'name' )
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'optics', true, index, xml );

        if ( element ) {

            data.optics = parseCameraOptics( element );
            index++;

        } else {
            break;
        }

    }

    library.cameras[ getDataByElement( xml, 'attribute', 'id' ) ] = data;

}

function parseCameraOptics( xml ) {

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'technique_common', true, index, xml );

        if ( element ) {

            return parseCameraTechnique( element );

        } else {
            break;
        }

    }

    return {};

}

function parseCameraTechnique( xml ) {

    var data = {};

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, xml );

            if ( element ) {

                data.technique = name;
                data.parameters = parseCameraParameters( element );
                index++;

            } else {
                break;
            }

        }

    }

    getData( 'perspective' );
    getData( 'orthographic' );

    return data;

}

function parseCameraParameters( xml ) {

    var data = {};

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, xml );

            if ( element ) {

                data[ name ] = parseFloat( getDataByElement( element, 'content' ) );
                index++;

            } else {
                break;
            }

        }

    }

    getData( 'xfov' );
    getData( 'yfov' );
    getData( 'xmag' );
    getData( 'ymag' );
    getData( 'znear' );
    getData( 'zfar' );
    getData( 'aspect_ratio' );

    return data;

}

function buildCamera( data ) {

    var camera;

    switch ( data.optics.technique ) {

        case 'perspective':
            camera = new THREE.PerspectiveCamera(
                data.optics.parameters.yfov,
                data.optics.parameters.aspect_ratio,
                data.optics.parameters.znear,
                data.optics.parameters.zfar
            );
            break;

        case 'orthographic':
            var ymag = data.optics.parameters.ymag;
            var xmag = data.optics.parameters.xmag;
            var aspectRatio = data.optics.parameters.aspect_ratio;

            xmag = ( xmag === undefined ) ? ( ymag * aspectRatio ) : xmag;
            ymag = ( ymag === undefined ) ? ( xmag / aspectRatio ) : ymag;

            xmag *= 0.5;
            ymag *= 0.5;

            camera = new THREE.OrthographicCamera(
                - xmag, xmag, ymag, - ymag, // left, right, top, bottom
                data.optics.parameters.znear,
                data.optics.parameters.zfar
            );
            break;

        default:
            camera = new THREE.PerspectiveCamera();
            break;

    }

    camera.name = data.name;

    return camera;

}

function getCamera( id ) {

    var data = library.cameras[ id ];

    if ( data !== undefined ) {

        return getBuild( data, buildCamera );

    }

    console.warn( 'THREE.ColladaLoader: Couldn\'t find camera with ID:', id );

    return null;

}

// light

function parseLight( xml ) {

    var data = {};

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'technique_common', true, index, xml );

        if ( element ) {

            data = parseLightTechnique( element );
            index++;

        } else {
            break;
        }

    }

    library.lights[ getDataByElement( xml, 'attribute', 'id' ) ] = data;

}

function parseLightTechnique( xml ) {

    var data = {};

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, xml );

            if ( element ) {

                switch ( name ) {

                    case 'directional':
                    case 'point':
                    case 'spot':
                    case 'ambient':

                        data.technique = name;
                        data.parameters = parseLightParameters( element );

                }

                index++;

            } else {
                break;
            }

        }

    }

    getData( 'directional' );
    getData( 'point' );
    getData( 'spot' );
    getData( 'ambient' );

    return data;

}

function parseLightParameters( xml ) {

    var data = {};

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, xml );

            if ( element ) {

                switch ( name ) {

                    case 'color':
                        var array = parseFloats( getDataByElement( element, 'content' ) );
                        data.color = new THREE.Color().fromArray( array );
                        break;

                    case 'falloff_angle':
                        data.falloffAngle = parseFloat( getDataByElement( element, 'content' ) );
                        break;

                    case 'quadratic_attenuation':
                        var f = parseFloat( getDataByElement( element, 'content' ) );
                        data.distance = f ? Math.sqrt( 1 / f ) : 0;
                        break;

                }

                index++;

            } else {
                break;
            }

        }

    }

    getData( 'color' );
    getData( 'falloff_angle' );
    getData( 'quadratic_attenuation' );

    return data;

}

function buildLight( data ) {

    var light;

    switch ( data.technique ) {

        case 'directional':
            light = new THREE.DirectionalLight();
            break;

        case 'point':
            light = new THREE.PointLight();
            break;

        case 'spot':
            light = new THREE.SpotLight();
            break;

        case 'ambient':
            light = new THREE.AmbientLight();
            break;

    }

    if ( data.parameters.color ) light.color.copy( data.parameters.color );
    if ( data.parameters.distance ) light.distance = data.parameters.distance;

    return light;

}

function getLight( id ) {

    var data = library.lights[ id ];

    if ( data !== undefined ) {

        return getBuild( data, buildLight );

    }

    console.warn( 'THREE.ColladaLoader: Couldn\'t find light with ID:', id );

    return null;

}

// geometry

function parseGeometry( xml ) {

    var data = {
        name: getDataByElement( xml, 'attribute', 'name' ) || '',
        sources: {},
        vertices: {},
        primitives: []
    };

    var mesh = getElementByTag( 'mesh', true, 0, xml );

    // the following tags inside geometry are not supported yet (see https://github.com/mrdoob/three.js/pull/12606): convex_mesh, spline, brep
    if ( mesh === null ) return;

    var index = 0, element, id;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, mesh );

            if ( element ) {

                id = getDataByElement( element, 'attribute', 'id' );

                switch ( name ) {

                    case 'source':
                        data.sources[ id ] = parseSource( element );
                        break;

                    case 'vertices':
                        // data.sources[ id ] = data.sources[ parseId( getElementsByTagName( child, 'input' )[ 0 ].getAttribute( 'source' ) ) ];
                        data.vertices = parseGeometryVertices( element );
                        break;

                    case 'polygons':
                        console.warn( 'THREE.ColladaLoader: Unsupported primitive type: ', name );
                        break;

                    case 'lines':
                    case 'linestrips':
                    case 'polylist':
                    case 'triangles':
                        data.primitives.push( parseGeometryPrimitive( element ) );
                        break;

                    default:
                        console.log( element );

                }

                index++;

            } else {
                break;
            }

        }

    }

    getData( 'source' );
    getData( 'vertices' );
    getData( 'polygons' );
    getData( 'lines' );
    getData( 'linestrips' );
    getData( 'polylist' );
    getData( 'triangles' );

    var xmlId = getDataByElement( xml, 'attribute', 'id' );
    geometries[ xmlId ] = data;
    console.log( '解析几何体：' + xmlId );

}

function parseSource( xml ) {

    var data = {
        array: [],
        stride: 3
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'float_array', true, index, xml );

        if ( element ) {

            data.array = parseFloats( getDataByElement( element, 'content' ) );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'Name_array', true, index, xml );

        if ( element ) {

            data.array = parseStrings( getDataByElement( element, 'content' ) );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'technique_common', true, index, xml );

        if ( element ) {

            element = getElementByTag( 'accessor', true, 0, element );
            if ( element ) data.stride = parseInt( getDataByElement( element, 'attribute', 'stride' ) );

            index++;

        } else {
            break;
        }

    }

    return data;

}

function parseGeometryVertices( xml ) {

    var data = {};

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'input', false, index, xml );

        if ( element ) {

            data[ getDataByElement( element, 'attribute', 'semantic') ] = parseId( getDataByElement( element, 'attribute', 'source') );
            index++;

        } else {
            break;
        }

    }

    return data;

}

function parseGeometryPrimitive( xml ) {

    var primitive = {
        type: getDataByElement( xml, 'name' ),
        material: getDataByElement( xml, 'attribute', 'material' ),
        count: parseInt( getDataByElement( xml, 'attribute', 'count' ) ),
        inputs: {},
        stride: 0
    };

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, name === 'input' ? false : true, index, xml );

            if ( element ) {

                switch ( name ) {

                    case 'input':
                        var id = parseId( getDataByElement( element, 'attribute', 'source' ) );
                        var semantic = getDataByElement( element, 'attribute', 'semantic' );
                        var offset = parseInt( getDataByElement( element, 'attribute', 'offset' ) );
                        primitive.inputs[ semantic ] = { id: id, offset: offset };
                        primitive.stride = Math.max( primitive.stride, offset + 1 );
                        break;

                    case 'vcount':
                        primitive.vcount = parseInts( getDataByElement( element, 'content' ) );
                        break;

                    case 'p':
                        primitive.p = parseInts( getDataByElement( element, 'content' ) );
                        break;


                    }

                index++;

            } else {
                break;
            }

        }

    }

    getData( 'input' );
    getData( 'vcount' );
    getData( 'p' );

    return primitive;

}

function groupPrimitives( primitives ) {

    var build = {};

    for ( var i = 0; i < primitives.length; i ++ ) {

        var primitive = primitives[ i ];

        if ( build[ primitive.type ] === undefined ) build[ primitive.type ] = [];

        build[ primitive.type ].push( primitive );

    }

    return build;

}

function buildGeometry( data ) {

    var build = {};

    var sources = data.sources;
    var vertices = data.vertices;
    var primitives = data.primitives;

    if ( primitives.length === 0 ) return {};

    // our goal is to create one buffer geoemtry for a single type of primitives
    // first, we group all primitives by their type

    var groupedPrimitives = groupPrimitives( primitives );

    for ( var type in groupedPrimitives ) {

        // second, we create for each type of primitives (polylist,triangles or lines) a buffer geometry

        build[ type ] = buildGeometryType( groupedPrimitives[ type ], sources, vertices );

    }

    return build;

}

function buildGeometryType( primitives, sources, vertices ) {

    var build = {};

    var position = { array: [], stride: 0 };
    var normal = { array: [], stride: 0 };
    var uv = { array: [], stride: 0 };
    var color = { array: [], stride: 0 };

    var skinIndex = { array: [], stride: 4 };
    var skinWeight = { array: [], stride: 4 };

    var geometry = new THREE.BufferGeometry();

    var materialKeys = [];

    var start = 0, count = 0;

    for ( var p = 0; p < primitives.length; p ++ ) {

        var primitive = primitives[ p ];
        var inputs = primitive.inputs;
        var triangleCount = 1;

        if ( primitive.vcount && primitive.vcount[ 0 ] === 4 ) {

            triangleCount = 2; // one quad -> two triangles

        }

        // groups

        if ( primitive.type === 'lines' || primitive.type === 'linestrips' ) {

            count = primitive.count * 2;

        } else {

            count = primitive.count * 3 * triangleCount;

        }

        geometry.addGroup( start, count, p );
        start += count;

        // material

        if ( primitive.material ) {

            materialKeys.push( primitive.material );

        }

        // geometry data

        for ( var name in inputs ) {

            var input = inputs[ name ];

            switch ( name )	{

                case 'VERTEX':
                    for ( var key in vertices ) {

                        var id = vertices[ key ];

                        switch ( key ) {

                            case 'POSITION':
                                buildGeometryData( primitive, sources[ id ], input.offset, position.array );
                                position.stride = sources[ id ].stride;

                                if ( sources.skinWeights && sources.skinIndices ) {

                                    buildGeometryData( primitive, sources.skinIndices, input.offset, skinIndex.array );
                                    buildGeometryData( primitive, sources.skinWeights, input.offset, skinWeight.array );

                                }
                                break;

                            case 'NORMAL':
                                buildGeometryData( primitive, sources[ id ], input.offset, normal.array );
                                normal.stride = sources[ id ].stride;
                                break;

                            case 'COLOR':
                                buildGeometryData( primitive, sources[ id ], input.offset, color.array );
                                color.stride = sources[ id ].stride;
                                break;

                            case 'TEXCOORD':
                                buildGeometryData( primitive, sources[ id ], input.offset, uv.array );
                                uv.stride = sources[ id ].stride;
                                break;

                            default:
                                console.warn( 'THREE.ColladaLoader: Semantic "%s" not handled in geometry build process.', key );

                        }

                    }
                    break;

                case 'NORMAL':
                    buildGeometryData( primitive, sources[ input.id ], input.offset, normal.array );
                    normal.stride = sources[ input.id ].stride;
                    break;

                case 'COLOR':
                    buildGeometryData( primitive, sources[ input.id ], input.offset, color.array );
                    color.stride = sources[ input.id ].stride;
                    break;

                case 'TEXCOORD':
                    buildGeometryData( primitive, sources[ input.id ], input.offset, uv.array );
                    uv.stride = sources[ input.id ].stride;
                    break;

            }

        }

    }

    // build geometry

    if ( position.array.length > 0 ) geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( position.array, position.stride ) );
    if ( normal.array.length > 0 ) geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normal.array, normal.stride ) );
    if ( color.array.length > 0 ) geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( color.array, color.stride ) );
    if ( uv.array.length > 0 ) geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uv.array, uv.stride ) );

    if ( skinIndex.array.length > 0 ) geometry.addAttribute( 'skinIndex', new THREE.Float32BufferAttribute( skinIndex.array, skinIndex.stride ) );
    if ( skinWeight.array.length > 0 ) geometry.addAttribute( 'skinWeight', new THREE.Float32BufferAttribute( skinWeight.array, skinWeight.stride ) );

    build.data = geometry;
    build.type = primitives[ 0 ].type;
    build.materialKeys = materialKeys;

    return build;

}

function buildGeometryData( primitive, source, offset, array ) {

    var indices = primitive.p;
    var stride = primitive.stride;
    var vcount = primitive.vcount;

    function pushVector( i ) {

        var index = indices[ i + offset ] * sourceStride;
        var length = index + sourceStride;

        for ( ; index < length; index ++ ) {

            array.push( sourceArray[ index ] );

        }

    }

    var maxcount = 0;

    var sourceArray = source.array;
    var sourceStride = source.stride;

    if ( primitive.vcount !== undefined ) {

        var index = 0;

        for ( var i = 0, l = vcount.length; i < l; i ++ ) {

            var count = vcount[ i ];

            if ( count === 4 ) {

                var a = index + stride * 0;
                var b = index + stride * 1;
                var c = index + stride * 2;
                var d = index + stride * 3;

                pushVector( a ); pushVector( b ); pushVector( d );
                pushVector( b ); pushVector( c ); pushVector( d );

            } else if ( count === 3 ) {

                var a = index + stride * 0;
                var b = index + stride * 1;
                var c = index + stride * 2;

                pushVector( a ); pushVector( b ); pushVector( c );

            } else {

                maxcount = Math.max( maxcount, count );

            }

            index += stride * count;

        }

        if ( maxcount > 0 ) {

            console.log( 'THREE.ColladaLoader: Geometry has faces with more than 4 vertices.' );

        }

    } else {

        for ( var i = 0, l = indices.length; i < l; i += stride ) {

            pushVector( i );

        }

    }

}

function getGeometry( id ) {

    return getBuild( library.geometries[ id ], buildGeometry );

}

// kinematics

function parseKinematicsModel( xml ) {

    var data = {
        name: getDataByElement( xml, 'attribute', 'name' ) || '',
        joints: {},
        links: []
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'technique_common', false, index, xml );

        if ( element ) {

            parseKinematicsTechniqueCommon( element, data );
            index++;

        } else {
            break;
        }

    }

    library.kinematicsModels[ getDataByElement( xml, 'attribute', 'id' ) ] = data;

}

function buildKinematicsModel( data ) {

    if ( data.build !== undefined ) return data.build;

    return data;

}

function getKinematicsModel( id ) {

    return getBuild( library.kinematicsModels[ id ], buildKinematicsModel );

}

function parseKinematicsTechniqueCommon( xml, data ) {

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'joint', false, index, xml );

        if ( element ) {

            data.joints[ getDataByElement( element, 'attribute', 'sid' ) ] = parseKinematicsJoint( element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'link', false, index, xml );

        if ( element ) {

            data.links.push( parseKinematicsLink( element ) );
            index++;

        } else {
            break;
        }

    }

}

function parseKinematicsJoint( xml ) {

    var data;

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'prismatic', false, index, xml );

        if ( element ) {

            data = parseKinematicsJointParameter( element );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'revolute', false, index, xml );

        if ( element ) {

            data = parseKinematicsJointParameter( element );
            index++;

        } else {
            break;
        }

    }

    return data;

}

function parseKinematicsJointParameter( xml, data ) {

    var data = {
        sid: getDataByElement( xml, 'attribute', 'sid' ),
        name: getDataByElement( xml, 'attribute', 'name' ) || '',
        axis: new THREE.Vector3(),
        limits: {
            min: 0,
            max: 0
        },
        type: getDataByElement( xml, 'name' ),
        static: false,
        zeroPosition: 0,
        middlePosition: 0
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'axis', false, index, xml );

        if ( element ) {

            var array = parseFloats( getDataByElement( xml, 'content' ) );
            data.axis.fromArray( array );
            index++;

        } else {
            break;
        }

    }

    index = 0;

    while ( true ) {

        element = getElementByTag( 'limits', false, index, xml );

        if ( element ) {

            var max = getElementByTag( 'max', false, 0, element );
            var min = getElementByTag( 'min', false, 0, element );

            data.limits.max = parseFloat( getDataByElement( max, 'content' ) );
            data.limits.min = parseFloat( getDataByElement( min, 'content' ) );
            index++;

        } else {
            break;
        }

    }

    // if min is equal to or greater than max, consider the joint static

    if ( data.limits.min >= data.limits.max ) {

        data.static = true;

    }

    // calculate middle position

    data.middlePosition = ( data.limits.min + data.limits.max ) / 2.0;

    return data;

}

function parseKinematicsLink( xml ) {

    var data = {
        sid: getDataByElement( xml, 'attribute', 'sid' ),
        name: getDataByElement( xml, 'attribute', 'name' ) || '',
        attachments: [],
        transforms: []
    };

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, false, index, xml );

            if ( element ) {

                switch ( name ) {

                    case 'attachment_full':
                        data.attachments.push( parseKinematicsAttachment( element ) );
                        break;

                    case 'matrix':
                    case 'translate':
                    case 'rotate':
                        data.transforms.push( parseKinematicsTransform( element ) );
                        break;

                }

                index++;

            } else {
                break;
            }

        }

    }

    getData( 'attachment_full' );
    getData( 'matrix' );
    getData( 'translate' );
    getData( 'rotate' );

    return data;

}

function parseKinematicsAttachment( xml ) {

    var data = {
        joint: getDataByElement( xml, 'attribute', 'joint').split( '/' ).pop(),
        transforms: [],
        links: []
    };

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, false, index, xml );

            if ( element ) {

                switch ( name ) {

                    case 'link':
                        data.links.push( parseKinematicsLink( element ) );
                        break;

                    case 'matrix':
                    case 'translate':
                    case 'rotate':
                        data.transforms.push( parseKinematicsTransform( element ) );
                        break;

                }

                index++;

            } else {
                break;
            }

        }

    }

    getData( 'link' );
    getData( 'matrix' );
    getData( 'translate' );
    getData( 'rotate' );

    return data;

}

function parseKinematicsTransform( xml ) {

    var data = {
        type: getDataByElement( xml, 'name' )
    };

    var array = parseFloats( getDataByElement( xml, 'content' ) );

    switch ( data.type ) {

        case 'matrix':
            data.obj = new THREE.Matrix4();
            data.obj.fromArray( array ).transpose();
            break;

        case 'translate':
            data.obj = new THREE.Vector3();
            data.obj.fromArray( array );
            break;

        case 'rotate':
            data.obj = new THREE.Vector3();
            data.obj.fromArray( array );
            data.angle = THREE.Math.degToRad( array[ 3 ] );
            break;

    }

    return data;

}

function parseKinematicsScene( xml ) {

    var data = {
        bindJointAxis: []
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'bind_joint_axis', false, index, xml );

        if ( element ) {

            data.bindJointAxis.push( parseKinematicsBindJointAxis( element ) );
            index++;

        } else {
            break;
        }

    }

    library.kinematicsScenes[ parseId( getDataByElement( xml, 'attribute', 'url' ) ) ] = data;

}

function parseKinematicsBindJointAxis( xml ) {

    var data = {
        target: getDataByElement( xml, 'attribute', 'target' ).split( '/' ).pop()
    };

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'axis', false, index, xml );

        if ( element ) {

            var param = getElementByTag( 'param', false, 0, element );
            data.axis = getDataByElement( param, 'content' );
            var tmpJointIndex = data.axis.split( 'inst_' ).pop().split( 'axis' )[ 0 ];
            data.jointIndex = tmpJointIndex.substr( 0, tmpJointIndex.length - 1 );
            index++;

        } else {
            break;
        }

    }

    return data;

}

function buildKinematicsScene( data ) {

    if ( data.build !== undefined ) return data.build;

    return data;

}

function getKinematicsScene( id ) {

    return getBuild( library.kinematicsScenes[ id ], buildKinematicsScene );

}

function setupKinematics() {

    var kinematicsModelId = Object.keys( library.kinematicsModels )[ 0 ];
    var kinematicsSceneId = Object.keys( library.kinematicsScenes )[ 0 ];
    var visualSceneId = Object.keys( library.visualScenes )[ 0 ];

    if ( kinematicsModelId === undefined || kinematicsSceneId === undefined ) return;

    var kinematicsModel = getKinematicsModel( kinematicsModelId );
    var kinematicsScene = getKinematicsScene( kinematicsSceneId );
    var visualScene = getVisualScene( visualSceneId );

    var bindJointAxis = kinematicsScene.bindJointAxis;
    var jointMap = {};

    for ( var i = 0, l = bindJointAxis.length; i < l; i ++ ) {

        var axis = bindJointAxis[ i ];

        // the result of the following query is an element of type 'translate', 'rotate','scale' or 'matrix'

        var targetElement = collada.querySelector( '[sid="' + axis.target + '"]' );

        if ( targetElement ) {

            // get the parent of the transfrom element

            var parentVisualElement = targetElement.parentElement;

            // connect the joint of the kinematics model with the element in the visual scene

            connect( axis.jointIndex, parentVisualElement );

        }

    }

    function connect( jointIndex, visualElement ) {

        var visualElementName = visualElement.getAttribute( 'name' );
        var joint = kinematicsModel.joints[ jointIndex ];

        visualScene.traverse( function ( object ) {

            if ( object.name === visualElementName ) {

                jointMap[ jointIndex ] = {
                    object: object,
                    transforms: buildTransformList( visualElement ),
                    joint: joint,
                    position: joint.zeroPosition
                };

            }

        } );

    }

    var m0 = new THREE.Matrix4();

    kinematics = {

        joints: kinematicsModel && kinematicsModel.joints,

        getJointValue: function ( jointIndex ) {

            var jointData = jointMap[ jointIndex ];

            if ( jointData ) {

                return jointData.position;

            } else {

                console.warn( 'THREE.ColladaLoader: Joint ' + jointIndex + ' doesn\'t exist.' );

            }

        },

        setJointValue: function ( jointIndex, value ) {

            var jointData = jointMap[ jointIndex ];

            if ( jointData ) {

                var joint = jointData.joint;

                if ( value > joint.limits.max || value < joint.limits.min ) {

                    console.warn( 'THREE.ColladaLoader: Joint ' + jointIndex + ' value ' + value + ' outside of limits (min: ' + joint.limits.min + ', max: ' + joint.limits.max + ').' );

                } else if ( joint.static ) {

                    console.warn( 'THREE.ColladaLoader: Joint ' + jointIndex + ' is static.' );

                } else {

                    var object = jointData.object;
                    var axis = joint.axis;
                    var transforms = jointData.transforms;

                    matrix.identity();

                    // each update, we have to apply all transforms in the correct order

                    for ( var i = 0; i < transforms.length; i ++ ) {

                        var transform = transforms[ i ];

                        // if there is a connection of the transform node with a joint, apply the joint value

                        if ( transform.sid && transform.sid.indexOf( jointIndex ) !== - 1 ) {

                            switch ( joint.type ) {

                                case 'revolute':
                                    matrix.multiply( m0.makeRotationAxis( axis, THREE.Math.degToRad( value ) ) );
                                    break;

                                case 'prismatic':
                                    matrix.multiply( m0.makeTranslation( axis.x * value, axis.y * value, axis.z * value ) );
                                    break;

                                default:
                                    console.warn( 'THREE.ColladaLoader: Unknown joint type: ' + joint.type );
                                    break;

                            }

                        } else {

                            switch ( transform.type ) {

                                case 'matrix':
                                    matrix.multiply( transform.obj );
                                    break;

                                case 'translate':
                                    matrix.multiply( m0.makeTranslation( transform.obj.x, transform.obj.y, transform.obj.z ) );
                                    break;

                                case 'scale':
                                    matrix.scale( transform.obj );
                                    break;

                                case 'rotate':
                                    matrix.multiply( m0.makeRotationAxis( transform.obj, transform.angle ) );
                                    break;

                            }

                        }

                    }

                    object.matrix.copy( matrix );
                    object.matrix.decompose( object.position, object.quaternion, object.scale );

                    jointMap[ jointIndex ].position = value;

                }

            } else {

                console.log( 'THREE.ColladaLoader: ' + jointIndex + ' does not exist.' );

            }

        }

    };

}

function buildTransformList( node ) {

    var transforms = [];

    var xml = collada.querySelector( '[id="' + node.id + '"]' );

    for ( var i = 0; i < xml.childNodes.length; i ++ ) {

        var child = xml.childNodes[ i ];

        if ( child.nodeType !== 1 ) continue;

        switch ( child.nodeName ) {

            case 'matrix':
                var array = parseFloats( child.textContent );
                var matrix = new THREE.Matrix4().fromArray( array ).transpose();
                transforms.push( {
                    sid: child.getAttribute( 'sid' ),
                    type: child.nodeName,
                    obj: matrix
                } );
                break;

            case 'translate':
            case 'scale':
                var array = parseFloats( child.textContent );
                var vector = new THREE.Vector3().fromArray( array );
                transforms.push( {
                    sid: child.getAttribute( 'sid' ),
                    type: child.nodeName,
                    obj: vector
                } );
                break;

            case 'rotate':
                var array = parseFloats( child.textContent );
                var vector = new THREE.Vector3().fromArray( array );
                var angle = THREE.Math.degToRad( array[ 3 ] );
                transforms.push( {
                    sid: child.getAttribute( 'sid' ),
                    type: child.nodeName,
                    obj: vector,
                    angle: angle
                } );
                break;

        }

    }

    return transforms;

}

// nodes

function prepareNodes( xml ) {

    var index = 0, element, index1 = 0, element1;

    while ( true ) {

        element = getElementByTag( 'node', true, index, xml );

        if ( element ) {

            if ( ! getDataByElement( element, 'attribute', 'id' ) ) {

                element = setDataByElement( element, 'attribute', { key: 'id', value: generateId() } );
                xml = replaceElementByTag( 'node', index, element, xml );

            }

            index1 = 0;

            while( true ) {

                element1 = getElementByTag( 'node', true, index1, element );
                if ( element1 ) {

                    if ( ! getDataByElement( element1, 'attribute', 'id' ) ) {

                        element1 = setDataByElement( element1, 'attribute', { key: 'id', value: generateId() } );
                        element = replaceElementByTag( 'node', index1, element1, element );
                        xml = replaceElementByTag( 'node', index, element, xml );

                    }

                    index1++;

                } else {
                    break;
                }

            }

            index++;

        } else {
            break;
        }

    }

    return xml;

}

var matrix = new THREE.Matrix4();
var vector = new THREE.Vector3();

function parseNode( xml ) {

    var data = {
        name: getDataByElement( xml, 'attribute', 'name' ) || '',
        type: getDataByElement( xml, 'attribute', 'type' ),
        id: getDataByElement( xml, 'attribute', 'id' ),
        sid: getDataByElement( xml, 'attribute', 'sid' ),
        matrix: new THREE.Matrix4(),
        nodes: [],
        instanceCameras: [],
        instanceControllers: [],
        instanceLights: [],
        instanceGeometries: [],
        instanceNodes: [],
        transforms: {}
    };

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, xml );

            if ( element ) {

                switch ( name ) {

                    case 'node':
                        data.nodes.push( getDataByElement( element, 'attribute', 'id' ) );
                        parseNode( element );
                        break;

                    case 'instance_camera':
                        data.instanceCameras.push( parseId( getDataByElement( element, 'attribute', 'url' ) ) );
                        break;

                    case 'instance_controller':
                        data.instanceControllers.push( parseNodeInstance( element ) );
                        break;

                    case 'instance_light':
                        data.instanceLights.push( parseId( getDataByElement( element, 'attribute', 'url' ) ) );
                        break;

                    case 'instance_geometry':
                        data.instanceGeometries.push( parseNodeInstance( element ) );
                        break;

                    case 'instance_node':
                        data.instanceNodes.push( parseId( getDataByElement( element, 'attribute', 'url' ) ) );
                        break;

                    case 'matrix':
                        var array = parseFloats( getDataByElement( element, 'content', 'url' ) );
                        data.matrix.multiply( matrix.fromArray( array ).transpose() );
                        data.transforms[ getDataByElement( element, 'attribute', 'sid' ) ] = name;
                        break;

                    case 'translate':
                        var array = parseFloats( getDataByElement( element, 'content', 'url' ) );
                        vector.fromArray( array );
                        data.matrix.multiply( matrix.makeTranslation( vector.x, vector.y, vector.z ) );
                        data.transforms[ getDataByElement( element, 'attribute', 'sid' ) ] = name;
                        break;

                    case 'rotate':
                        var array = parseFloats( getDataByElement( element, 'content', 'url' ) );
                        var angle = THREE.Math.degToRad( array[ 3 ] );
                        data.matrix.multiply( matrix.makeRotationAxis( vector.fromArray( array ), angle ) );
                        data.transforms[ getDataByElement( element, 'attribute', 'sid' ) ] = name;
                        break;

                    case 'scale':
                        var array = parseFloats( getDataByElement( element, 'content', 'url' ) );
                        data.matrix.scale( vector.fromArray( array ) );
                        data.transforms[ getDataByElement( element, 'attribute', 'sid' ) ] = name;
                        break;

                    case 'extra':
                        break;

                    default:
                        console.log( child );

                }

                index++;

            } else {
                break;
            }

        }

    }

    getData( 'node' );
    getData( 'instance_camera' );
    getData( 'instance_controller' );
    getData( 'instance_light' );
    getData( 'instance_geometry' );
    getData( 'instance_node' );
    getData( 'matrix' );
    getData( 'translate' );
    getData( 'rotate' );
    getData( 'scale' );
    getData( 'extra' );

    library.nodes[ data.id ] = data;
    console.log( 'parse library.nodes' );

    return data;

}

function parseNodeInstance( xml ) {

    var data = {
        id: parseId( getDataByElement( xml, 'attribute', 'url' ) ),
        materials: {},
        skeletons: []
    };

    var index = 0, element;

    function getData( name ) {

        index = 0;

        while ( true ) {

            element = getElementByTag( name, true, index, xml );

            if ( element ) {

                switch ( name ) {

                    case 'bind_material':
                        var index1 = 0, instance, instance1;
                        instance = getElementByTag( 'technique_common', true, 0, element );
                        if ( ! instance ) break;

                        while ( true ) {

                            instance1 = getElementByTag( 'instance_material', true, index1, instance );
                            if ( instance1 ) {
                                data.materials[ getDataByElement( instance1, 'attribute', 'symbol' ) ] = parseId( getDataByElement( instance1, 'attribute', 'target' ) );
                                index1++;
                            } else {
                                break;
                            }

                        }

                        break;

                    case 'skeleton':
                        data.skeletons.push( parseId( getDataByElement( instance, 'content', 'symbol' ) ) );
                        break;

                    default:
                        break;

                }

                index++;

            } else {
                break;
            }

        }

    }

    getData( 'bind_material' );
    getData( 'skeleton' );

    return data;

}

function buildSkeleton( skeletons, joints ) {

    var boneData = [];
    var sortedBoneData = [];

    var i, j, data;

    // a skeleton can have multiple root bones. collada expresses this
    // situtation with multiple "skeleton" tags per controller instance

    for ( i = 0; i < skeletons.length; i ++ ) {

        var skeleton = skeletons[ i ];
        var root = getNode( skeleton );

        // setup bone data for a single bone hierarchy

        buildBoneHierarchy( root, joints, boneData );

    }

    // sort bone data (the order is defined in the corresponding controller)

    for ( i = 0; i < joints.length; i ++ ) {

        for ( j = 0; j < boneData.length; j ++ ) {

            data = boneData[ j ];

            if ( data.bone.name === joints[ i ].name ) {

                sortedBoneData[ i ] = data;
                data.processed = true;
                break;

            }

        }

    }

    // add unprocessed bone data at the end of the list

    for ( i = 0; i < boneData.length; i ++ ) {

        data = boneData[ i ];

        if ( data.processed === false ) {

            sortedBoneData.push( data );
            data.processed = true;

        }

    }

    // setup arrays for skeleton creation

    var bones = [];
    var boneInverses = [];

    for ( i = 0; i < sortedBoneData.length; i ++ ) {

        data = sortedBoneData[ i ];

        bones.push( data.bone );
        boneInverses.push( data.boneInverse );

    }

    return new THREE.Skeleton( bones, boneInverses );

}

function buildBoneHierarchy( root, joints, boneData ) {

    // setup bone data from visual scene

    root.traverse( function ( object ) {

        if ( object.isBone === true ) {

            var boneInverse;

            // retrieve the boneInverse from the controller data

            for ( var i = 0; i < joints.length; i ++ ) {

                var joint = joints[ i ];

                if ( joint.name === object.name ) {

                    boneInverse = joint.boneInverse;
                    break;

                }

            }

            if ( boneInverse === undefined ) {

                // Unfortunately, there can be joints in the visual scene that are not part of the
                // corresponding controller. In this case, we have to create a dummy boneInverse matrix
                // for the respective bone. This bone won't affect any vertices, because there are no skin indices
                // and weights defined for it. But we still have to add the bone to the sorted bone list in order to
                // ensure a correct animation of the model.

                    boneInverse = new THREE.Matrix4();

            }

            boneData.push( { bone: object, boneInverse: boneInverse, processed: false } );

        }

    } );

}

function buildNode( data ) {

    var objects = [];

    var matrix = data.matrix;
    var nodes = data.nodes;
    var type = data.type;
    var instanceCameras = data.instanceCameras;
    var instanceControllers = data.instanceControllers;
    var instanceLights = data.instanceLights;
    var instanceGeometries = data.instanceGeometries;
    var instanceNodes = data.instanceNodes;

    // nodes

    for ( var i = 0, l = nodes.length; i < l; i ++ ) {

        objects.push( getNode( nodes[ i ] ) );

    }

    // instance cameras

    for ( var i = 0, l = instanceCameras.length; i < l; i ++ ) {

        var instanceCamera = getCamera( instanceCameras[ i ] );

        if ( instanceCamera !== null ) {

            objects.push( instanceCamera.clone() );

        }

    }

    // instance controllers

    for ( var i = 0, l = instanceControllers.length; i < l; i ++ ) {

        var instance = instanceControllers[ i ];
        var controller = getController( instance.id );
        var geometries = getGeometry( controller.id );
        var newObjects = buildObjects( geometries, instance.materials );

        var skeletons = instance.skeletons;
        var joints = controller.skin.joints;

        var skeleton = buildSkeleton( skeletons, joints );

        for ( var j = 0, jl = newObjects.length; j < jl; j ++ ) {

            var object = newObjects[ j ];

            if ( object.isSkinnedMesh ) {

                object.bind( skeleton, controller.skin.bindMatrix );
                object.normalizeSkinWeights();

            }

            objects.push( object );

        }

    }

    // instance lights

    for ( var i = 0, l = instanceLights.length; i < l; i ++ ) {

        var instanceLight = getLight( instanceLights[ i ] );

        if ( instanceLight !== null ) {

            objects.push( instanceLight.clone() );

        }

    }

    // instance geometries

    for ( var i = 0, l = instanceGeometries.length; i < l; i ++ ) {

        var instance = instanceGeometries[ i ];

        // a single geometry instance in collada can lead to multiple object3Ds.
        // this is the case when primitives are combined like triangles and lines

        var geometries = getGeometry( instance.id );
        var newObjects = buildObjects( geometries, instance.materials );

        for ( var j = 0, jl = newObjects.length; j < jl; j ++ ) {

            objects.push( newObjects[ j ] );

        }

    }

    // instance nodes

    for ( var i = 0, l = instanceNodes.length; i < l; i ++ ) {

        objects.push( getNode( instanceNodes[ i ] ).clone() );

    }

    var object;

    if ( nodes.length === 0 && objects.length === 1 ) {

        object = objects[ 0 ];

    } else {

        object = ( type === 'JOINT' ) ? new THREE.Bone() : new THREE.Group();

        for ( var i = 0; i < objects.length; i ++ ) {

            object.add( objects[ i ] );

        }

    }

    object.name = ( type === 'JOINT' ) ? data.sid : data.name;
    object.matrix.copy( matrix );
    object.matrix.decompose( object.position, object.quaternion, object.scale );

    return object;

}

function resolveMaterialBinding( keys, instanceMaterials ) {

    var materials = [];

    for ( var i = 0, l = keys.length; i < l; i ++ ) {

        var id = instanceMaterials[ keys[ i ] ];
        materials.push( getMaterial( id ) );

    }

    return materials;

}

function buildObjects( geometries, instanceMaterials ) {

    var objects = [];

    for ( var type in geometries ) {

        var geometry = geometries[ type ];

        var materials = resolveMaterialBinding( geometry.materialKeys, instanceMaterials );

        // handle case if no materials are defined

        if ( materials.length === 0 ) {

            if ( type === 'lines' || type === 'linestrips' ) {

                materials.push( new THREE.LineBasicMaterial() );

            } else {

                materials.push( new THREE.MeshPhongMaterial() );

            }

        }

        // regard skinning

        var skinning = ( geometry.data.attributes.skinIndex !== undefined );

        if ( skinning ) {

            for ( var i = 0, l = materials.length; i < l; i ++ ) {

                materials[ i ].skinning = true;

            }

        }

        // choose between a single or multi materials (material array)

        var material = ( materials.length === 1 ) ? materials[ 0 ] : materials;

        // now create a specific 3D object

        var object;

        switch ( type ) {

            case 'lines':
                object = new THREE.LineSegments( geometry.data, material );
                break;

            case 'linestrips':
                object = new THREE.Line( geometry.data, material );
                break;

            case 'triangles':
            case 'polylist':
                if ( skinning ) {

                    object = new THREE.SkinnedMesh( geometry.data, material );

                } else {

                    object = new THREE.Mesh( geometry.data, material );

                }
                break;

        }

        objects.push( object );

    }

    return objects;

}

function getNode( id ) {

    return getBuild( library.nodes[ id ], buildNode );

}

// visual scenes

function parseVisualScene( xml ) {

    var data = {
        name: getDataByElement( xml, 'attribute', 'name' ) || '',
        children: []
    };

    xml = prepareNodes( xml );

    var index = 0, element;

    while ( true ) {

        element = getElementByTag( 'node', true, index, xml );

        if ( element ) {

            data.children.push( parseNode( element ) );
            index++;

        } else {
            break;
        }

    }

    library.visualScenes[ getDataByElement( xml, 'attribute', 'id' ) ] = data;

}

function buildVisualScene( data ) {

    var group = new THREE.Group();
    group.name = data.name;

    var children = data.children;

    for ( var i = 0; i < children.length; i ++ ) {

        var child = children[ i ];

        if ( child.id === null ) {

            group.add( buildNode( child ) );

        } else {

            // if there is an ID, let's try to get the finished build (e.g. joints are already build)

            group.add( getNode( child.id ) );

        }

    }

    return group;

}

function getVisualScene( id ) {

    return getBuild( library.visualScenes[ id ], buildVisualScene );

}

// scenes

function parseScene( xml ) {

    var instance = getElementByTag( 'instance_visual_scene', true, 0, xml );
    return getVisualScene( parseId( getDataByElement( instance, 'attribute', 'url' ) ) );

}

function setupAnimations() {

    var clips = library.clips;

    if ( isEmpty( clips ) === true ) {

        if ( isEmpty( library.animations ) === false ) {

            // if there are animations but no clips, we create a default clip for playback

            var tracks = [];

            for ( var id in library.animations ) {

                var animationTracks = getAnimation( id );

                for ( var i = 0, l = animationTracks.length; i < l; i ++ ) {

                    tracks.push( animationTracks[ i ] );

                }

            }

            animations.push( new THREE.AnimationClip( 'default', - 1, tracks ) );

        }

    } else {

        for ( var id in clips ) {

            animations.push( getAnimationClip( id ) );

        }

    }

}