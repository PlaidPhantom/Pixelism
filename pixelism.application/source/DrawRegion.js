enyo.kind({
    name: "Pixelism.DrawRegion",
    kind: "Scroller",
    horizontal: false,
    vertical: false,
    autoHorizontal: true,
    autoVertical: true,
    className: "drawRegion",
    components: [ {
            name: "canvasContainer",
            kind: "HFlexBox",
            pack: "center",
            align: "center",
            style: "min-height: 710px",
            components: [ {
                    kind: "Control",
                    className: "canvasContainer",
                    components: [ {
                            kind: "Pixelism.Canvas",
                            name: "BackgroundCanvas",
                            width: PixelismDefaults.width * PixelismSettings.brushWidth,
                            height: PixelismDefaults.height * PixelismSettings.brushHeight,
                            className: "BackgroundCanvas"
                        }, {
                            kind: "Pixelism.Canvas",
                            name: "DrawCanvas",
                            width: PixelismDefaults.width * PixelismSettings.brushWidth,
                            height: PixelismDefaults.height * PixelismSettings.brushHeight,
                            onmousedown: "startDraw",
                            onmousemove: "contDraw",
                            className: "DrawCanvas"
                        }
                    ]
                }
            ]
        }
    ],
    
    published: {
        mode: { type: "move", brush: false } // types: "move" "brush"
    },
    
    canvasSize: { width: PixelismDefaults.width, height: PixelismDefaults.height},
    
    rendered: function () {
        this.inherited(arguments);
        
        document.addEventListener('orientationchange', this.orientationChange.bind(this), false);
        
        this.clearImage();
        var context = this.$.BackgroundCanvas.getContext('2d')
        context.fillStyle = '#000';
        context.fillRect(0, 0, this.$.BackgroundCanvas.width, this.$.BackgroundCanvas.height);
        
        this.modeChanged();
    },
    
    orientationChange: function(event) {
        switch(event.position) {
            case 2:
            case 3:
                this.$.canvasContainer.applyStyle('min-height', '900px');
                break;
            case 4:
            case 5:
                this.$.canvasContainer.applyStyle('min-height', '650px');
                break;
            default:
                break;
        }
    },
    
    modeChanged: function() {
        if(this.getMode().type == 'move') {
            this.horizontal = false;
            this.autoHorizontal = true;
            this.vertical = false;
            this.autoVertical = true;
        }
        else {
            this.horizontal = false;
            this.autoHorizontal = false;
            this.vertical = false;
            this.autoVertical = false;
        }
    },
    
    startDraw: function(sender, event) {
        if(this.getMode().type == 'brush') {
            var x = Math.floor(event.offsetX / PixelismSettings.brushWidth);
            var y = Math.floor(event.offsetY / PixelismSettings.brushHeight);
            
            this.drawPoint(x, y);
        }
    },
    
    contDraw: function(sender, event) {
        if(this.getMode().type == 'brush') {
            var x = Math.floor(event.offsetX / PixelismSettings.brushWidth);
            var y = Math.floor(event.offsetY / PixelismSettings.brushHeight);
            
            this.drawPoint(x, y);
        }
    },
    
    setSize: function(width, height) {
        var brushWidth = PixelismSettings.brushWidth;
        var brushHeight = PixelismSettings.brushHeight;
        
        var context = this.$.DrawCanvas.getContext('2d');
        var existing = context.getImageData(0, 0, this.canvasSize.width * brushWidth, this.canvasSize.height * brushHeight);
        
        this.$.DrawCanvas.setWidth(width * brushWidth);
        this.$.DrawCanvas.setHeight(height * brushHeight);
        
        context.putImageData(existing, 0, 0);
        
        context = this.$.BackgroundCanvas.getContext('2d');
        existing = context.getImageData(0, 0, this.canvasSize.width * brushWidth, this.canvasSize.height * brushHeight);
        
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.$.BackgroundCanvas.getWidth();
        tempCanvas.height = this.$.BackgroundCanvas.getHeight();
        
        tempCanvas.getContext('2d').putImageData(existing, 0, 0);
        
        this.$.BackgroundCanvas.setWidth(width * brushWidth);
        this.$.BackgroundCanvas.setHeight(height * brushHeight);
        
        context.drawImage(tempCanvas, 0, 0, this.$.BackgroundCanvas.getWidth(), this.$.BackgroundCanvas.getHeight());
        
        this.canvasSize.width = width;
        this.canvasSize.height = height;
        
        this.scrollTo(0, 0);
    },
    
    drawPoint: function(x, y) {
        var brushWidth = PixelismSettings.brushWidth;
        var brushHeight = PixelismSettings.brushHeight;
        
        var context = this.$.DrawCanvas.getContext('2d');
        
        context.clearRect(x * brushWidth, y * brushHeight, brushWidth, brushHeight)
        
        var mode = this.getMode();
        
        if(mode.brush)
            context.drawImage(mode.brush, x * brushWidth, y * brushHeight);
    },
    
    fill: function() {
        for(var y = 0; y < this.canvasSize.height; y++) {
            for(var x = 0; x < this.canvasSize.width; x++) {
                this.drawPoint(x, y);
            }
        }
    },
    
    clearImage: function(clearOption) {
        var context = this.$.BackgroundCanvas.getContext('2d');
        
        if(clearOption == 'fillblack') {
            context.fillStyle = 'rgba(0, 0, 0, 1.0)';
            context.fillRect(0, 0, this.canvasSize.width * PixelismSettings.brushWidth, this.canvasSize.height * PixelismSettings.brushHeight);
        }
        else
            context.clearRect(0, 0, this.canvasSize.width * PixelismSettings.brushWidth, this.canvasSize.height * PixelismSettings.brushHeight);
    },
    
    loadImage: function(image, callback) {
        var width = Math.ceil(image.width / PixelismSettings.brushWidth);
        var height = Math.ceil(image.height / PixelismSettings.brushHeight);
        
        this.setSize(width, height);
        this.clearImage();
        
        this.$.BackgroundCanvas.getContext('2d').drawImage(image, 0, 0);
        
        callback(width, height);
    },
    
    getPNG: function() {
        var result = document.createElement('canvas');
        result.width = this.$.DrawCanvas.getWidth();
        result.height = this.$.DrawCanvas.getHeight();
        
        var context = result.getContext('2d');
        
        context.drawImage(this.$.BackgroundCanvas.node, 0, 0);
        context.drawImage(this.$.DrawCanvas.node, 0, 0);
        
        // the "substr(22)" strips the data url to bare base64 code; it strips "data:image/png;base64,"
        return result.toDataURL().substr(22);
    }
});
