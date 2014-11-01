// brush info object layout:
// 
// {
//     mask: 'maskname',
//     foregroundColor: { r: 255, g: 255, b: 255, a: 255 },
//     backgroundColor: { r: 255, g: 255, b: 255, a: 255 },
//     rotation: 'u'    // 'u', 'd', 'l', 'r'
// }
// 
//
// both functions will pass the completed image back to the callback function
// 

window.BrushRenderer = {

    renderBrush: function(brushInfo, callback) {
        var maskImg = new Image();
        
        maskImg.addEventListener('load', function(e) {
            this.render(maskImg, brushInfo, callback); 
        }.bind(this), false);
        
        maskImg.src = PixelismSettings.getMaskUrl(brushInfo.mask);
    },

    renderIcon: function(brushInfo, callback) {
        var maskImg = new Image();
        
        maskImg.addEventListener('load', function(e) {
            this.render(maskImg, brushInfo, callback); 
        }.bind(this), false);
        
        maskImg.src = PixelismSettings.getIconMaskUrl(brushInfo.mask);
    },
    
    render: function(maskImg, brushInfo, callback) {
        var brush = document.createElement('canvas');
        brush.width = maskImg.width;
        brush.height = maskImg.height;
        
        var context = brush.getContext('2d');
        
        context.save();
        
        switch(brushInfo.rotation) {
            case 'd':
                context.translate(brush.width, brush.height);
                context.rotate(Math.PI);
                break;
            case 'r':
                context.translate(brush.height, 0);
                context.rotate(Math.PI / 2);
                break;
            case 'l':
                context.translate(0, brush.width);
                context.rotate(Math.PI * 1.5);
                break;
            case 'u':
            default:
                break;
        }
        
        context.drawImage(maskImg, 0, 0);
        
        context.restore();
        
        var imgData = context.getImageData(0, 0, brush.width, brush.height);
        
        var black = brushInfo.backgroundColor;
        var white = brushInfo.foregroundColor;
        var newColor = false;
        var ab = 0;
        var aw = 0;
        
        for(var i = 0; i < imgData.data.length; i += 4) {
            ab = black.a * (255 - imgData.data[i]) / 255.0;
            aw = white.a * imgData.data[i] / 255.0;
            
            imgData.data[i+3] = ab + aw * (255 - ab) / 255.0;
            imgData.data[i]   = (black.r * ab + white.r * aw * (255 - ab) / 255.0) / imgData.data[i+3];
            imgData.data[i+1] = (black.g * ab + white.g * aw * (255 - ab) / 255.0) / imgData.data[i+3];
            imgData.data[i+2] = (black.b * ab + white.b * aw * (255 - ab) / 255.0) / imgData.data[i+3];
        }
        
        context.putImageData(imgData, 0, 0);
        
        callback(brush);
    }
};
