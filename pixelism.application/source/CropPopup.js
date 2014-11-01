enyo.kind({
    name: "Pixelism.CropPopup",
    kind: "Popup",
    modal: true,
    dismissWithClick: false,
    lazy: false,
    layoutKind: "VFlexLayout",
    components: [ {
            content: "Select the shape and size of the background to create."
        }, {
            kind: "HFlexBox",
            components: [ {
                    kind: "RoundedInputBox",
                    flex: 1,
                    components: [ {
                            content: "Width:&nbsp;"
                        }, {
                            kind: "RoundedInput",
                            name: "width",
                            onkeypress: "filterSizeEntry",
                            onchange: "changeWidth",
                            autoCapitalize: "lowercase",
                            autoEmoticons: false,
                            spellcheck: false,
                            autocorrect: false,
                            style: "width: 4em;",
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "+",
                            onclick: "increaseWidth"
                        }, {
                            kind: "Button",
                            caption: "-",
                            onclick: "decreaseWidth"
                        }, {
                            content: "Height:&nbsp;"
                        }, {
                            kind: "RoundedInput",
                            name: "height",
                            onkeypress: "filterSizeEntry",
                            onchange: "changeHeight",
                            autoCapitalize: "lowercase",
                            autoEmoticons: false,
                            spellcheck: false,
                            autocorrect: false,
                            style: "width: 4em;",
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "+",
                            onclick: "increaseHeight"
                        }, {
                            kind: "Button",
                            caption: "-",
                            onclick: "decreaseHeight"
                        }
                    ]
                }
            ]
        }, {
            kind: "HFlexBox",
            pack: "center",
            components: [ {
                    name: "cropCanvas",
                    kind: "Pixelism.Canvas",
                    width: PixelismSettings.cropCanvasWidth,
                    height: PixelismSettings.cropCanvasHeight,
                    onmousedown: "startMoveCrop",
                    onmousemove: "moveCrop",
                    onmouseup: "endMoveCrop",
                    ongesturestart: "startScaleCrop",
                    ongesturechange: "scaleCrop",
                    ongestureend: "endScaleCrop"
                }
            ]
        }, {
            kind: "HFlexBox",
            components: [ {
                    kind: "Button",
                    caption: "Cancel",
                    className: "enyo-button-negative",
                    onclick: "close",
                    flex: 1
                }, {
                    kind: "Button",
                    caption: "Crop Image",
                    className: "enyo-button-affirmative",
                    onclick: "cropImage",
                    flex: 1
                }
            ]
        }
    ],
    
    published: {
        src: ""
    },
    
    events: {
        onCrop: ""
    },
    
    originalImage: new Image(),
    canvasOffsetX: 0,
    canvasOffsetY: 0,
    canvasScale: 1,
    isScaling: false,
    isDragging: false,
    isTapping: false,
    lastDragX: 0,
    lastDragY: 0,
    
    cropX: 0,
    cropY: 0,
    cropWidth: 0,
    cropHeight: 0,
    drawWidth: 0,
    drawHeight: 0,
    
    srcChanged: function() {
        this.originalImage = new Image();
        
        this.originalImage.addEventListener('load', function() {
            this.drawWidth = Math.floor(this.originalImage.width / PixelismSettings.brushWidth);
            this.drawHeight = Math.floor(this.originalImage.height / PixelismSettings.brushHeight);
            this.cropWidth = this.drawWidth * PixelismSettings.brushWidth;
            this.cropHeight = this.drawHeight * PixelismSettings.brushHeight;
            this.cropX = (this.originalImage.width - this.cropWidth) / 2;
            this.cropY = (this.originalImage.height - this.cropHeight) / 2;
            
            if(this.originalImage.width >= this.originalImage.height && this.originalImage.width > PixelismSettings.cropCanvasWidth) {
                this.canvasScale = PixelismSettings.cropCanvasWidth / this.originalImage.width;
                this.canvasOffsetX = 0;
                
                if(this.originalImage.height * this.canvasScale < PixelismSettings.cropCanvasHeight)
                    this.canvasOffsetY = Math.round((PixelismSettings.cropCanvasHeight - this.originalImage.height * this.canvasScale) / 2);
            }
            else if(this.originalImage.height > this.originalImage.width && this.originalImage.height > PixelismSettings.cropCanvasHeight) {
                this.canvasScale = PixelismSettings.cropCanvasHeight / this.originalImage.height;
                this.canvasOffsetY = 0;
                
                if(this.originalImage.width * this.canvasScale < PixelismSettings.cropCanvasWidth)
                    this.canvasOffsetX = Math.round((PixelismSettings.cropCanvasWidth - this.originalImage.width * this.canvasScale) / 2);
            }
            else {
                this.canvasScale = 1;
                this.canvasOffsetX = Math.round((PixelismSettings.cropCanvasWidth - this.originalImage.width) / 2);
                this.canvasOffsetY = Math.round((PixelismSettings.cropCanvasHeight - this.originalImage.height) / 2);
            }
            
            this.$.width.setValue(this.drawWidth);
            this.$.height.setValue(this.drawHeight);
            this.redrawCanvas();
        }.bind(this), false);
        
        this.originalImage.src = this.getSrc();
    },
    
    filterSizeEntry: function(sender, event) {
        var c = String.fromCharCode(event.charCode);
        
        if('0123456789'.indexOf(c) < 0 || event.charCode == 8)
            event.preventDefault();
    },
    
    changeWidth: function() {
        var width = parseInt(this.$.width.getValue());
        
        this.cropWidth *= width / this.drawWidth;
        this.drawWidth = width;
        
        this.redrawCanvas();
    },
    
    increaseWidth: function() {
        this.$.width.setValue(parseInt(this.$.width.getValue()) + 1);
        this.changeWidth();
    },
    
    decreaseWidth: function() {
        var w = parseInt(this.$.width.getValue()) - 1;
        this.$.width.setValue(w < 1 ? 1 : w);
        this.changeWidth();
    },
    
    changeHeight: function() {
        var height = parseInt(this.$.height.getValue());
        
        this.cropHeight *= height / this.drawHeight;
        this.drawHeight = height;
        
        this.redrawCanvas();
    },
    
    increaseHeight: function() {
        this.$.height.setValue(parseInt(this.$.height.getValue()) + 1);
        this.changeHeight();
    },
    
    decreaseHeight: function() {
        var h = parseInt(this.$.height.getValue()) - 1;
        this.$.height.setValue(h < 1 ? 1 : h);
        this.changeHeight();
    },
    
    fromCanvasX: function(x) {
        return (x - this.canvasOffsetX) / this.canvasScale;
    },
    
    fromCanvasY: function(y) {
        return (y - this.canvasOffsetY) / this.canvasScale;
    },
    
    toCanvasX: function(x) {
        return x * this.canvasScale + this.canvasOffsetX;
    },
    
    toCanvasY: function(y) {
        return y * this.canvasScale + this.canvasOffsetY;
    },
    
    startMoveCrop: function(sender, event) {
        if(!this.isScaling) {
            this.lastDragX = Math.floor(this.fromCanvasX(event.offsetX));
            this.lastDragY = Math.floor(this.fromCanvasY(event.offsetY));
            
            this.redrawCanvas();
            this.isTapping = true;
        }
    },
    
    moveCrop: function(sender, event) {
        if(!this.isScaling) {
            this.isDragging = true;
            this.isTapping = false;
            
            var x = this.fromCanvasX(event.offsetX);
            var y = this.fromCanvasY(event.offsetY);
            
            this.cropX += Math.floor(x) - this.lastDragX;
            this.cropY += Math.floor(y) - this.lastDragY;
            
            this.lastDragX = x;
            this.lastDragY = y;
            
            this.redrawCanvas();
        }
    },
    
    endMoveCrop: function(sender, event) {
        if(this.isDragging)
            this.isDragging = false;
        else if(this.isTapping) {
            var x = this.fromCanvasX(event.offsetX);
            var y = this.fromCanvasY(event.offsetY);
            
            this.cropX = Math.floor(x - this.cropWidth / 2);
            this.cropY = Math.floor(y - this.cropHeight / 2);
            
            this.redrawCanvas();
        }
    },
    
    startScaleCrop: function(sender, event) {
        if(!this.isDragging) {
            this.isScaling = true;
            this.isTapping = false;
            
            this.redrawCanvas(event.scale);
        }
    },
    
    scaleCrop: function(sender, event) {
        if(this.isScaling) {
            this.isTapping = false;
            
            this.redrawCanvas(event.scale);
        }
    },
    
    endScaleCrop: function(sender, event) {
        if(this.isScaling) {
            this.cropX += (this.cropWidth - this.cropWidth * event.scale) / 2;
            this.cropY += (this.cropHeight - this.cropHeight * event.scale) / 2;
            
            this.cropWidth *= event.scale;
            this.cropHeight *= event.scale;
            
            this.redrawCanvas();
            
            this.isScaling = false;
            this.isTapping = false;
        }
    },
    
    redrawCanvas: function(tempScale) {
        var context = this.$.cropCanvas.getContext('2d');
        
        context.clearRect(0, 0, this.$.cropCanvas.getWidth(), this.$.cropCanvas.getHeight());
        context.drawImage(this.originalImage,
                          this.canvasOffsetX, this.canvasOffsetY,
                          this.originalImage.width * this.canvasScale,
                          this.originalImage.height * this.canvasScale);
        
        // draw selection
        var selectX = this.toCanvasX(this.cropX),
            selectY = this.toCanvasY(this.cropY),
            selectWidth = this.cropWidth * this.canvasScale,
            selectHeight = this.cropHeight * this.canvasScale,
            gridInterval = selectWidth / this.drawWidth;
        
        if(tempScale) {
            selectX += (selectWidth - selectWidth * tempScale) / 2;
            selectY += (selectHeight - selectHeight * tempScale) / 2;
            
            selectWidth *= tempScale;
            selectHeight *= tempScale;
            
            gridInterval *= tempScale;
        }
        
        context.fillStyle = 'rgba(192, 192, 192, .5)';
        context.fillRect(selectX, selectY, selectWidth, selectHeight);
        
        context.strokeStyle = 'rgba(64, 64, 64, .75)';
        context.strokeRect(selectX, selectY, selectWidth, selectHeight);
        context.beginPath();
        
        //vertical rules
        for(var x = 1; x < this.drawWidth; x++) {
            context.moveTo(selectX + x * gridInterval, selectY);
            context.lineTo(selectX + x * gridInterval, selectY + selectHeight - 1);
        }
        
        //horizontal rules
        for(var y = 1; y < this.drawHeight; y++) {
            context.moveTo(selectX, selectY + y * gridInterval);
            context.lineTo(selectX + selectWidth - 1, selectY + y * gridInterval);
        }
        
        context.stroke();
    },
    
    cropImage: function() {
        var result = document.createElement('canvas');
        result.width = this.drawWidth * PixelismSettings.brushWidth;
        result.height = this.drawHeight * PixelismSettings.brushHeight;
        
        var startX = 0, startY = 0, cX = 0, cY = 0, cWidth = 0, cHeight = 0;
        
        if(this.cropX < 0) {
            startX = -this.cropX;
            cX = 0;
            cWidth = this.cropWidth - startX;
        }
        else {
            cX = this.cropX;
            cWidth = this.cropWidth;
        }
        
        if(this.cropY < 0) {
            startY = -this.cropY;
            cY = 0;
            cHeight = this.cropHeight - startY;
        }
        else {
            cY = this.cropY;
            cHeight = this.cropHeight;
        }
        
        var widthScale = 1;
        var heightScale = 1;
        
        if(cX + cWidth > this.originalImage.width) {
            widthScale = (this.originalImage.width - cX) / cWidth;
            cWidth = this.originalImage.width - cX;
        }
        
        if(cY + cHeight > this.originalImage.height) {
            heightScale = (this.originalImage.height - cY) / cHeight;
            cHeight = this.originalImage.height - cY;
        }
        
        var context = result.getContext('2d');
        
        context.drawImage(this.originalImage,
                          cX, cY, cWidth, cHeight,
                          startX, startY, (result.width - startX) * widthScale, (result.height - startY) * heightScale);
        
        this.doCrop(result);
        this.close();
    }
});
