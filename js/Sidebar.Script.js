/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Script = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	container.add( new UI.Text( '模型脚本' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break() );
	container.add( new UI.Break() );

	//

	var scriptsContainer = new UI.Row();
	container.add( scriptsContainer );

	var newScript = new UI.Button( '新建' );
	newScript.onClick( function () {

		var script = { name: '脚本名称', source: '// 提供了以下函数回调：\n// init -> start -> update -> stop \n// keydown keyup mousedown mousemove mouseup touchstart touchmove touchend \n// 每个函数回调都绑定了 this 为当前模型\n\nfunction update( event ) {}' };
		editor.execute( new AddScriptCommand( editor.selected, script ) );

	} );
	container.add( newScript );

	/*
	var loadScript = new UI.Button( 'Load' );
	loadScript.setMarginLeft( '4px' );
	container.add( loadScript );
	*/

	//

	function update() {

		scriptsContainer.clear();
		scriptsContainer.setDisplay( 'none' );

		var object = editor.selected;

		if ( object === null ) {

			return;

		}

		var scripts = editor.scripts[ object.uuid ];

		if ( scripts !== undefined ) {

			scriptsContainer.setDisplay( 'block' );

			for ( var i = 0; i < scripts.length; i ++ ) {

				( function ( object, script ) {

					var name = new UI.Input( script.name ).setWidth( '130px' ).setFontSize( '12px' );
					name.onChange( function () {

						editor.execute( new SetScriptValueCommand( editor.selected, script, 'name', this.getValue() ) );

					} );
					scriptsContainer.add( name );

					var edit = new UI.Button( '编辑' );
					edit.setMarginLeft( '4px' );
					edit.onClick( function () {

						signals.editScript.dispatch( object, script );

					} );
					scriptsContainer.add( edit );

					var remove = new UI.Button( '移除' );
					remove.setMarginLeft( '4px' );
					remove.onClick( function () {

						if ( confirm( '是否移除？' ) ) {

							editor.execute( new RemoveScriptCommand( editor.selected, script ) );

						}

					} );
					scriptsContainer.add( remove );

					scriptsContainer.add( new UI.Break() );

				} )( object, scripts[ i ] )

			}

		}

	}

	// signals

	signals.objectSelected.add( function ( object ) {

		if ( object !== null && editor.camera !== object ) {

			container.setDisplay( 'block' );

			update();

		} else {

			container.setDisplay( 'none' );

		}

	} );

	signals.scriptAdded.add( update );
	signals.scriptRemoved.add( update );
	signals.scriptChanged.add( update );

	return container;

};
