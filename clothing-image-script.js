#target photoshop
#strict on

// =======================================================================// 
//                     Set Options for PNG & Thumb Sizes                  //        
// =======================================================================//  

runthis();
function runthis(){
    var path 			= Folder.selectDialog ("Please choose the location of the source image files.", Folder.myDocuments);
    var inputFolder 	= new Folder(path);
    var inputFiles 		= inputFolder.getFiles(/\.(tif|tiff|)$/i);
    var processedPath	= "processed";
    // png values
	var finalWidth		= 350;
	// 1st thumb
	var thumbHeight		= 145;
	var thumbWidth		= 118;
	// 2nd thumb
	var thumbHeightAlt	= 28;
	var thumbWidthAlt	= 28;

	var pngPad 			= 5;
	var trouserSize		= 0.68; 

	var createPNG = confirm("Create Full Size Images?");

	var createThumbOne = confirm("Create Thumbnails " + thumbHeight + "x" + thumbWidth + "?");
	
	var createThumbTwo = confirm("Create mini Thumbnails " + thumbHeightAlt + "x" + thumbWidthAlt + "?");
	
	var trousers = confirm("just trousers/shorts?", { buttons: { Yes: true, No: false }, focus: 1 });

// =======================================================================// 
//                     This is where the real code begins                 //        
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
						var targetWidth = imageSize(targetWidth);
						var targetWidthAlt = imageSize(targetWidth, percent);

						var docRatio = (doc.height / doc.width);
			
						if(docRatio <= 2) doc.resizeImage(width=targetWidth);
						else if(trousers == true) doc.resizeImage(width=(targetWidthAlt*trouserSize));
						else doc.resizeImage(width=targetWidthAlt);

						doc.resizeCanvas(width=canvasSize(doc.width),height=canvasSize(doc.height),null,ResampleMethod.BICUBIC);
					};
					
					function resizeThumb(targetWidth, targetHeight){
						var ratio =(targetHeight / targetWidth);
						var docRatio =(doc.height / doc.width);

					    if(docRatio >= ratio){
					    	doc.resizeImage(null,height=targetHeight,null,ResampleMethod.BICUBIC);
					  		doc.resizeCanvas(width=targetWidth);
					    }
					    else{
					    	doc.resizeImage(width=targetWidth,null,null,ResampleMethod.BICUBIC);
					  		doc.resizeCanvas(null,height=targetHeight);
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
						resize(finalWidth, trouserSize);
						exportPNG();
					}
					
		// ******************************* Thumbnail Creation ***************************//


					if (createThumbOne == true){
						resizeThumb(thumbWidth, thumbHeight);
					    exportPNG('_th');
					}
					// resize n.2
					if (createThumbTwo == true){
						resizeThumb(thumbWidthAlt, thumbHeightAlt)
					    exportPNG('_th2');
					}
					
					doc.close(SaveOptions.DONOTSAVECHANGES);
				}
			}
		}
	}

