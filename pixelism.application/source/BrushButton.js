enyo.kind({
    name: "Pixelism.BrushButton",
    kind: "RadioToolButton",
    components: [ {
            kind: "Pixelism.Canvas",
            name: "brushIcon",
            width: PixelismSettings.brushIconWidth,
            height: PixelismSettings.brushIconHeight
        }, {
            kind: "Pixelism.BrushPicker",
            name: "brushPicker",
            onSelect: "selectBrush"
        }, {
            name: "caption",
            showing: false
        }, {
            name: "icon",
            showing: false
        }
    ],
    
    published: {
        brush: false,
        brushInfo: false
    },
    
    events: {
        onNewBrush: ""
    },
    
    popupWait: false,
    
    rendered: function() {
        this.inherited(arguments);
        
        window.BrushRenderer.renderBrush(this.getBrushInfo(), this.setBrush.bind(this));
        
        window.BrushRenderer.renderIcon(this.getBrushInfo(), function(iconImg) {
            var cxt = this.$.brushIcon.getContext('2d');
            cxt.clearRect(0, 0, PixelismSettings.brushIconWidth, PixelismSettings.brushIconHeight);
            cxt.drawImage(iconImg, 0, 0, PixelismSettings.brushIconWidth, PixelismSettings.brushIconHeight);
        }.bind(this));
    },
    
    brushInfoChanged: function() {
        window.BrushRenderer.renderBrush(this.getBrushInfo(), function(brush) {
            this.setBrush(brush);
            
            this.doNewBrush();
        }.bind(this));
        
        window.BrushRenderer.renderIcon(this.getBrushInfo(), function(iconImg) {
            var cxt = this.$.brushIcon.getContext('2d');
            cxt.clearRect(0, 0, PixelismSettings.brushIconWidth, PixelismSettings.brushIconHeight);
            cxt.drawImage(iconImg, 0, 0, PixelismSettings.brushIconWidth, PixelismSettings.brushIconHeight);
        }.bind(this));
    },
    
    mousedownHandler: function() {
        this.startPopupWait();
    },
    
    mouseupHandler: function() {
        this.endPopupWait();
    },
    
    mouseoutHandler: function() {
        this.endPopupWait();
    },
    
    startPopupWait: function() {
        //enyo.log('Starting popup wait...');
        
        this.popupWait = setTimeout(function() {
            //enyo.log('Timeout Finished.');
            
            this.$.brushPicker.pickColor(this.brushInfo);
        }.bind(this), PixelismSettings.brushPickerDelay);
    },
    
    endPopupWait: function() {
        //enyo.log('Killing popup wait.');
        
        clearTimeout(this.popupWait);
    },
    
    selectBrush: function() {
        this.setBrushInfo(this.$.brushPicker.getBrush());
    }
});
