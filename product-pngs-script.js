#target photoshop
#strict on

// =======================================================================// 
//                     Set Options for PNG & Thumb Sizes                  //        
// =======================================================================//  

runthis();
function runthis(){
    var path 			= Folder.selectDialog ("Please choose the location of the source image files.", Folder.myDocuments);
    	inputFolder 	= new Folder(path);
    	inputFiles 		= inputFolder.getFiles(/\.(jpg|jpeg|)$/i);
    	processedPath	= "formated";
    	retina_sufix	= "-2x";
    	thumb_sufix		= "_thumb";
    	mini_sufix		= "_mini";
    	exportPNG		= true;
    	imgPad 			= 0;

    // export quality
	var jpegQuality		= 80;
		pngQuality		= 80;

    // size values
	var fullSize		= 500;
		thumbHeight		= 350;
		thumbWidth		= 350;
		miniHeight		= 120;
		miniWidth		= 130;

	// PNG export options
	var pngOpts, file;
        pngOpts = new ExportOptionsSaveForWeb();
        pngOpts.format = SaveDocumentType.PNG;
        pngOpts.PNG8 = false;
        pngOpts.quality = pngQuality;
        interlaced = true;

	// JPG export options
    var sfwOpts = new ExportOptionsSaveForWeb(); 
		sfwOpts.format = SaveDocumentType.JPEG; 
		sfwOpts.includeProfile = false; 
		sfwOpts.interlaced = 0; 
		sfwOpts.optimized = true; 
		sfwOpts.quality = jpegQuality; //0-100


	// Choose export options
	var retina = confirm("Retina Versions?");
		createFull = confirm(fullSize +"px max height images?");
		createThumbs = confirm("Thumbnails?");
	
	if (createThumbs == true) {
		var createThumbOne = confirm("Create Thumbnails " + thumbHeight + "x" + thumbWidth + "?");
		var createThumbTwo = confirm("Create mini Thumbnails " + miniHeight + "x" + miniWidth + "?");
	}
		
// =======================================================================// 
//                    		 PNG & Image Resizing			              //        
// =======================================================================//  

		for(index in inputFiles){	     

		    open(new File(inputFiles[index]));
			var doc = app.activeDocument;
			
			if(app.documents.length > 0) {
			var n = doc.pathItems.length;

				if((n>0) && (doc.pathItems[0].name!="Work path")){
					var layerRef = doc.layers[i];

		// ************************** Functions ***************************//

					// working
					function imageSize(size, percent, padding){
						padding = (typeof padding === "undefined") ? imgPad : padding;
						percent = (typeof percent === "undefined") ? 1 : percent;
						return (size*percent) - (padding*2);
					};

					function canvasSize(size, percent, padding){
						padding = (typeof padding === "undefined") ? imgPad : padding;
						percent = (typeof percent === "undefined") ? 1 : percent;
						return (size*percent) + (padding*2);
					};

					function exportFileType(suffix, folder){
						folder = (typeof folder === "undefined") ? processedPath : folder;
						suffix = (typeof suffix === "undefined") ? "" : suffix;

						var docName = doc.name;
						docName = docName.match(/(.*)(\.[^\.]+)/) ? docName = docName.match(/(.*)(\.[^\.]+)/):docName = [docName, docName];
						var finalFolderPath = (decodeURI(doc.path)+'/' + folder);

						if (exportPNG == true){	var typeOpts = pngOpts; var fileExt = '.png'; }
						else{ var typeOpts = sfwOpts; var fileExt = '.jpg' }

						var saveName = new File(finalFolderPath + '/' + docName[1] + suffix + fileExt);
							if(!finalFolderPath.exists) new Folder(finalFolderPath).create();
							doc.exportDocument(saveName,ExportType.SAVEFORWEB,typeOpts);
						};
					}

					
					function resize(targetWidth,percent){
						percent = (typeof percent === "undefined") ? 1 : percent;
						var targetWidth = imageSize(targetWidth, percent);
							docRatio = (doc.height / doc.width);
			
						if(docRatio <= 2) doc.resizeImage(null,height=targetWidth);
						else doc.resizeImage(null,height=targetWidth);
						doc.resizeCanvas(width=canvasSize(doc.width),height=canvasSize(doc.height),null,ResampleMethod.BICUBIC);
					};
					
					function resizeThumb(targetWidth, targetHeight, percent){
						percent = (typeof percent === "undefined") ? 1 : percent;
						var ratio =(targetHeight / targetWidth);
							docRatio =(doc.height / doc.width);

					    if(docRatio >= ratio){
					    	doc.resizeImage(null,height=targetHeight*percent,null,ResampleMethod.BICUBIC);
					  		doc.resizeCanvas(width=targetWidth*percent);
					    }
					    else{
					    	doc.resizeImage(width=targetWidth*percent,null,null,ResampleMethod.BICUBIC);
					  		doc.resizeCanvas(null,height=targetHeight*percent);
						};
					}

		// ************************** Setup **************************//


					doc.changeMode.RGB;

					if (doc.activeLayer.isBackgroundLayer == true) {
						doc.activeLayer.isBackgroundLayer = false;
						doc.activeLayer.name  = 'Layer0';
					}

		// ************************** Trim to Path **************************//

					// if (exportPNG == true) {
						if (doc.pathItems.length != 0){
							doc.pathItems[0].makeSelection();
							doc.selection.invert();
							doc.selection.clear();
							doc.trim(TrimType.TRANSPARENT);
						}
						else {
							exportPNG = false
						}
					// }

		// ************************** Full Size Creation ***************************//

					// resize 
					if (createFull == true){ 
						if (retina == true){ 
							resize(fullSize,2);
							exportFileType(retina_sufix);
							resize(fullSize);
							exportFileType();
						} 
						else { 
							resize(fullSize);
							exportFileType();
						}
					}

		// ******************************* Thumbnail Creation ***************************//


					if (createThumbOne == true){
						if (retina == true){
						var inc_retina = thumb_sufix + retina_sufix;
						resizeThumb(thumbWidth, thumbHeight, 2);
					    exportFileType(inc_retina);
					    resizeThumb(thumbWidth, thumbHeight);
					    exportFileType(thumb_sufix);
						} 
						else {
							resizeThumb(thumbWidth, thumbHeight);
						    exportFileType(thumb_sufix);
						}
					}

					// resize n.2
					if (createThumbTwo == true){
						if (retina == true){
						var inc_retina = mini_sufix + retina_sufix;
						resizeThumb(miniWidth, miniHeight, 2);
					    exportFileType(inc_retina);
					    resizeThumb(miniWidth, miniHeight);
					    exportFileType(mini_sufix);
						} 
						else {
							resizeThumb(miniWidth, miniHeight);
						    exportFileType(mini_sufix);
						}
					}
					
					doc.close(SaveOptions.DONOTSAVECHANGES);
				}
			}
		}
