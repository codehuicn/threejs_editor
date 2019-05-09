/**
 * @author codehuicn / https://github.com/codehuicn
 */

var Api = function () {

	this.version = '1.4.2';
	this.threejsVersion = '0.104.0';

	this.urlData = {
		baseUrl: 'http://localhost:3000/',
		editorUrl: 'http://localhost:3000/threejs_editor/',

		sceneDownload: '',
		modelUpload: '',
		setupDownload: ''
	};

};

Api.prototype = {

	getScene: function () {

		$.ajax({
			type: 'POST',
			url: this.urlData.baseUrl + this.urlData.sceneDownload,
			data: {},
			dataType: 'json',
			success: function( msg ){

			  console.log( msg );

			}
		});

	}

}
