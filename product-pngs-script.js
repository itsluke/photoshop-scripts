#target photoshop
#strict on

// =======================================================================// 
//                     Set Options for PNG & Thumb Sizes                  //        
// =======================================================================//  

runthis();
function runthis(){
    var path 			= Folder.selectDialog ("Please choose the location of the source image files.", Folder.myDocuments);
    var inputFolder 	= new Folder(path);
    var inputFiles 		= inputFolder.getFiles(/\.(jpg|jpeg|)$/i);
    var processedPath	= "formated";
    var retina_sufix	= "-2x";
    var thumb_sufix		= "_thumb";
    var mini_sufix		= "_mini";

    // png values
	var finalWidth		= 600;
	// 1st thumb
	var thumbHeight		= 300;
	var thumbWidth		= 300;
	// mini thumbs
	var miniHeight	= 120;
	var miniWidth	= 130;

	var pngPad 			= 20;

	var retina = confirm("Retina Versions?");

	var createPNG = confirm("Create Full Size Images?");

	var createThumbOne = confirm("Create Thumbnails " + thumbHeight + "x" + thumbWidth + "?");
	
	var createThumbTwo = confirm("Create mini Thumbnails " + miniHeight + "x" + miniWidth + "?");
	
// =======================================================================// 
//                    		 PNG & Image Resizing			              //        
// =======================================================================//  

		for(index in inputFiles){	     
			//open file
		    open(new File(inputFiles[index]));

			var doc = app.activeDocument;
			
			var pngOpts, file;
		        pngOpts = new ExportOptionsSaveForWeb();
		        pngOpts.format = SaveDocumentType.PNG;
		        pngOpts.PNG8 = false;
		        pngOpts.quality = 100;
		        interlaced = true;


			if(app.documents.length > 0) {
			var n = doc.pathItems.length;

				if((n>0) && (doc.pathItems[0].name!="Work path")){
					
					var layerRef = doc.layers[i];

					if (doc.activeLayer.isBackgroundLayer == true) {
						doc.activeLayer.isBackgroundLayer = false;
						doc.activeLayer.name  = 'Layer0';
					}

		// ************************** Functions ***************************//

					// working
					function imageSize(size, percent, padding){
						padding = (typeof padding === "undefined") ? pngPad : padding;
						percent = (typeof percent === "undefined") ? 1 : percent;
						return (size*percent) - (padding*2);
					};

					function canvasSize(size, percent, padding){
						padding = (typeof padding === "undefined") ? pngPad : padding;
						percent = (typeof percent === "undefined") ? 1 : percent;
						return (size*percent) + (padding*2);
					};

					function exportPNG(suffix, folder){
						folder = (typeof folder === "undefined") ? processedPath : folder;
						suffix = (typeof suffix === "undefined") ? "" : suffix;
						var docName = doc.name;
						docName = docName.match(/(.*)(\.[^\.]+)/) ? docName = docName.match(/(.*)(\.[^\.]+)/):docName = [docName, docName];
						var finalFolderPath = (decodeURI(doc.path)+'/' + folder);
						var saveName = new File(finalFolderPath + '/' + docName[1] + suffix + '.png');
						if(!finalFolderPath.exists) new Folder(finalFolderPath).create();
						doc.exportDocument(saveName,ExportType.SAVEFORWEB,pngOpts);
						};
					
					function resize(targetWidth,percent){
						percent = (typeof percent === "undefined") ? 1 : percent;
						var targetWidth = imageSize(targetWidth, percent);
						var docRatio = (doc.height / doc.width);
			
						if(docRatio <= 2) doc.resizeImage(width=targetWidth);
						else doc.resizeImage(height=targetWidth);
						doc.resizeCanvas(width=canvasSize(doc.width),height=canvasSize(doc.height),null,ResampleMethod.BICUBIC);
					};
					
					function resizeThumb(targetWidth, targetHeight, percent){
						percent = (typeof percent === "undefined") ? 1 : percent;
						var ratio =(targetHeight / targetWidth);
						var docRatio =(doc.height / doc.width);

					    if(docRatio >= ratio){
					    	doc.resizeImage(null,height=targetHeight*percent,null,ResampleMethod.BICUBIC);
					  		doc.resizeCanvas(width=targetWidth*percent);
					    }
					    else{
					    	doc.resizeImage(width=targetWidth*percent,null,null,ResampleMethod.BICUBIC);
					  		doc.resizeCanvas(null,height=targetHeight*percent);
						};
					}

		// ************************** Trim to Path **************************//

					doc.changeMode.RGB;
					doc.pathItems[0].makeSelection();
					doc.selection.invert();
					doc.selection.clear();
					doc.trim(TrimType.TRANSPARENT);

		// ************************** PNG Creation ***************************//

					// resize 
					if (createPNG == true){ 
						if (retina == true){ 
							resize(finalWidth,2);
							exportPNG(retina_sufix);
							resize(finalWidth);
							exportPNG();
						} 
						else { 
							resize(finalWidth);
							exportPNG();
						}
					}
					
		// ******************************* Thumbnail Creation ***************************//


					if (createThumbOne == true){
						if (retina == true){
						var inc_retina = thumb_sufix + retina_sufix;
						resizeThumb(thumbWidth, thumbHeight, 2);
					    exportPNG(inc_retina);
					    resizeThumb(thumbWidth, thumbHeight);
					    exportPNG(thumb_sufix);
						} 
						else {
							resizeThumb(thumbWidth, thumbHeight);
						    exportPNG(thumb_sufix);
						}
					}
					// resize n.2
					if (createThumbTwo == true){
						if (retina == true){
						var inc_retina = mini_sufix + retina_sufix;
						resizeThumb(miniWidth, miniHeight, 2);
					    exportPNG(inc_retina);
					    resizeThumb(miniWidth, miniHeight);
					    exportPNG(mini_sufix);
						} 
						else {
							resizeThumb(miniWidth, miniHeight);
						    exportPNG(mini_sufix);
						}
					}
					
					doc.close(SaveOptions.DONOTSAVECHANGES);
				}
			}
		}
	}

