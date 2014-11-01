enyo.kind({
    name: "Pixelism.ColorPicker",
    kind: "Group",
    layoutKind: "VFlexLayout",
    components: [ {
            kind: "HFlexBox",
            style: "padding-top: 5px;",
            components: [ {
                    content: "Color:",
                    style: "padding: 0 10px 0 10px;"
                }, {
                    name: "sampleSwatch",
                    kind: "Pixelism.Canvas",
                    style: "border: 1px solid black;",
                    width: PixelismSettings.swatchWidth,
                    height: PixelismSettings.swatchHeight
                }
            ]
        }, {
            kind: "HFlexBox",
            className: "colorslider",
            components: [ {
                    content: "R"
                }, {
                    name: "red",
                    kind: "Pixelism.Canvas",
                    width: PixelismSettings.sliderTotalWidth,
                    height: PixelismSettings.sliderTotalHeight,
                    onclick: "tapRed",
                    onmousemove: "tapRed"
                }
            ]
        }, {
            kind: "HFlexBox",
            className: "colorslider",
            components: [ {
                    content: "G"
                }, {
                    name: "green",
                    kind: "Pixelism.Canvas",
                    width: PixelismSettings.sliderTotalWidth,
                    height: PixelismSettings.sliderTotalHeight,
                    onclick: "tapGreen",
                    onmousemove: "tapGreen"
                }
            ]
        }, {
            kind: "HFlexBox",
            className: "colorslider",
            components: [ {
                    content: "B"
                }, {
                    name: "blue",
                    kind: "Pixelism.Canvas",
                    width: PixelismSettings.sliderTotalWidth,
                    height: PixelismSettings.sliderTotalHeight,
                    onclick: "tapBlue",
                    onmousemove: "tapBlue"
                }
            ]
        }, {
            kind: "HFlexBox",
            className: "colorslider",
            components: [ {
                    content: "A"
                }, {
                    name: "alpha",
                    kind: "Pixelism.Canvas",
                    width: PixelismSettings.sliderTotalWidth,
                    height: PixelismSettings.sliderTotalHeight,
                    onclick: "tapAlpha",
                    onmousemove: "tapAlpha"
                }
            ]
        }, {
            components: [ {
                    kind: "Pixelism.Canvas",
                    name: "presets",
                    width: PixelismSettings.swatchWidth * PixelismSettings.swatchPresets[0].length,
                    height: PixelismSettings.swatchHeight * PixelismSettings.swatchPresets.length,
                    onclick: "setPreset",
                    className: "presetSwatches"
                }
            ]
        }
    ],
    
    published: {
        red: 255,
        green: 255,
        blue: 255,
        alpha: 255
    },
    
    events: {
        onColorChange: ""
    },
    
    rendered: function() {
        this.inherited(arguments);
        
        var sWidth = PixelismSettings.swatchWidth;
        var sHeight = PixelismSettings.swatchHeight;
        var presets = PixelismSettings.swatchPresets;
        
        var context = this.$.presets.getContext('2d');
        
        for(var y = 0; y < presets.length; y++) {
            for(var x = 0; x < presets[y].length; x++) {
                context.fillStyle = presets[y][x];
                context.fillRect(sWidth * x, sHeight * y, sWidth, sHeight);
            }
        }
        
        var tWidth = PixelismSettings.sliderTotalWidth;
        var tHeight = PixelismSettings.sliderTotalHeight;
        var dWidth = PixelismSettings.sliderDrawWidth;
        var dHeight = PixelismSettings.sliderDrawHeight;
        var hGutter = (tWidth - dWidth) / 2;
        var vGutter = (tHeight - dHeight) / 2;
        
        var redContext = this.$.red.getContext('2d');
        var greenContext = this.$.green.getContext('2d');
        var blueContext = this.$.blue.getContext('2d');
        var alphaContext = this.$.alpha.getContext('2d');
        
        redContext.clearRect(0, 0, this.$.red.getWidth(), this.$.red.getHeight());
        greenContext.clearRect(0, 0, this.$.green.getWidth(), this.$.green.getHeight());
        blueContext.clearRect(0, 0, this.$.blue.getWidth(), this.$.blue.getHeight());
        alphaContext.clearRect(0, 0, this.$.alpha.getWidth(), this.$.alpha.getHeight());
        
        var redData = redContext.getImageData(hGutter, vGutter, dWidth, dHeight);
        var greenData = greenContext.getImageData(hGutter, vGutter, dWidth, dHeight);
        var blueData = blueContext.getImageData(hGutter, vGutter, dWidth, dHeight);
        var alphaData = alphaContext.getImageData(hGutter, vGutter, dWidth, dHeight);
        
        for(var i = 0; i < redData.data.length; i += 4) {
            redData.data[i+3] = greenData.data[i+3] = blueData.data[i+3] = 255;
            redData.data[i] = greenData.data[i+1] = blueData.data[i+2] = alphaData.data[i+3] = (i / 4) % redData.width;
        }
        
        redContext.putImageData(redData, hGutter, vGutter);
        greenContext.putImageData(greenData, hGutter, vGutter);
        blueContext.putImageData(blueData, hGutter, vGutter);
        alphaContext.putImageData(alphaData, hGutter, vGutter);
    },
    
    setColor: function(r, g, b, a) {
        this.setRed(r);
        this.setGreen(g);
        this.setBlue(b);
        this.setAlpha(a);
    },
    
    redChanged: function(oldRed, partialUpdate) {
        var fullUpdate = !partialUpdate;
        
        var red = this.getRed();
        
        var tWidth = PixelismSettings.sliderTotalWidth;
        var tHeight = PixelismSettings.sliderTotalHeight;
        var dWidth = PixelismSettings.sliderDrawWidth;
        var dHeight = PixelismSettings.sliderDrawHeight;
        var cOffset = PixelismSettings.sliderCursorOffset;
        var hGutter = (tWidth - dWidth) / 2;
        var vGutter = (tHeight - dHeight) / 2;
        
        var redContext = this.$.red.getContext('2d');
        redContext.clearRect(oldRed - cOffset + hGutter,
                             0,
                             cOffset * 2 + 1,
                             vGutter);
        redContext.clearRect(oldRed - cOffset + hGutter,
                             tHeight - vGutter,
                             cOffset * 2 + 1,
                             vGutter);
        
        redContext.drawImage(PixelismSettings.colorPickerCursorImage, red - cOffset + hGutter, 0);
        
        if(fullUpdate) {
            var greenContext = this.$.green.getContext('2d');
            var blueContext = this.$.blue.getContext('2d');
            var alphaContext = this.$.alpha.getContext('2d');
            
            var greenData = greenContext.getImageData(hGutter, vGutter, dWidth, dHeight);
            var blueData = blueContext.getImageData(hGutter, vGutter, dWidth, dHeight);
            var alphaData = alphaContext.getImageData(hGutter, vGutter, dWidth, dHeight);
            
            for(var i = 0; i < greenData.data.length; i += 4) {
                greenData.data[i] = red;
                blueData.data[i] = red;
                alphaData.data[i] = red;
            }
            
            greenContext.putImageData(greenData, hGutter, vGutter);
            blueContext.putImageData(blueData, hGutter, vGutter);
            alphaContext.putImageData(alphaData, hGutter, vGutter);
        }
        
        var context = this.$.sampleSwatch.getContext('2d');
        context.drawImage(PixelismSettings.transparencyBackground, 0, 0, PixelismSettings.swatchWidth, PixelismSettings.swatchHeight);
        context.fillStyle = 'rgba(' + red + ', ' + this.getGreen() + ', ' + this.getBlue() + ', ' + (this.getAlpha() / 255.0) + ')';
        context.fillRect(0, 0, PixelismSettings.swatchWidth, PixelismSettings.swatchHeight);
    },
    
    greenChanged: function(oldGreen, partialUpdate) {
        var fullUpdate = !partialUpdate;
        
        var green = this.getGreen();
        
        var tWidth = PixelismSettings.sliderTotalWidth;
        var tHeight = PixelismSettings.sliderTotalHeight;
        var dWidth = PixelismSettings.sliderDrawWidth;
        var dHeight = PixelismSettings.sliderDrawHeight;
        var cOffset = PixelismSettings.sliderCursorOffset;
        var hGutter = (tWidth - dWidth) / 2;
        var vGutter = (tHeight - dHeight) / 2;
        
        var greenContext = this.$.green.getContext('2d');
        greenContext.clearRect(oldGreen - cOffset + hGutter,
                               0,
                               cOffset * 2 + 1,
                               vGutter);
        greenContext.clearRect(oldGreen - cOffset + hGutter,
                               tHeight - vGutter,
                               cOffset * 2 + 1,
                               vGutter);
        
        greenContext.drawImage(PixelismSettings.colorPickerCursorImage, green - cOffset + hGutter, 0);
        
        if(fullUpdate) {
            var redContext = this.$.red.getContext('2d');
            var blueContext = this.$.blue.getContext('2d');
            var alphaContext = this.$.alpha.getContext('2d');
            
            var redData = redContext.getImageData(hGutter, vGutter, dWidth, dHeight);
            var blueData = blueContext.getImageData(hGutter, vGutter, dWidth, dHeight);
            var alphaData = alphaContext.getImageData(hGutter, vGutter, dWidth, dHeight);
            
            for(var i = 0; i < redData.data.length; i += 4) {
                redData.data[i+1] = green;
                blueData.data[i+1] = green;
                alphaData.data[i+1] = green;
            }
            
            redContext.putImageData(redData, hGutter, vGutter);
            blueContext.putImageData(blueData, hGutter, vGutter);
            alphaContext.putImageData(alphaData, hGutter, vGutter);
        }
        
        var context = this.$.sampleSwatch.getContext('2d');
        context.drawImage(PixelismSettings.transparencyBackground, 0, 0, PixelismSettings.swatchWidth, PixelismSettings.swatchHeight);
        context.fillStyle = 'rgba(' + this.getRed() + ', ' + green + ', ' + this.getBlue() + ', ' + (this.getAlpha() / 255.0) + ')';
        context.fillRect(0, 0, PixelismSettings.swatchWidth, PixelismSettings.swatchHeight);
    },
    
    blueChanged: function(oldBlue, partialUpdate) {
        var fullUpdate = !partialUpdate;
        
        var blue = this.getBlue();
        
        var tWidth = PixelismSettings.sliderTotalWidth;
        var tHeight = PixelismSettings.sliderTotalHeight;
        var dWidth = PixelismSettings.sliderDrawWidth;
        var dHeight = PixelismSettings.sliderDrawHeight;
        var cOffset = PixelismSettings.sliderCursorOffset;
        var hGutter = (tWidth - dWidth) / 2;
        var vGutter = (tHeight - dHeight) / 2;
        
        var blueContext = this.$.blue.getContext('2d');
        blueContext.clearRect(oldBlue - cOffset + hGutter,
                              0,
                              cOffset * 2 + 1,
                              vGutter);
        blueContext.clearRect(oldBlue - cOffset + hGutter,
                              tHeight - vGutter,
                              cOffset * 2 + 1,
                              vGutter);
        
        blueContext.drawImage(PixelismSettings.colorPickerCursorImage, blue - cOffset + hGutter, 0);
        
        if(fullUpdate) {
            var redContext = this.$.red.getContext('2d');
            var greenContext = this.$.green.getContext('2d');
            var alphaContext = this.$.alpha.getContext('2d');
            
            var redData = redContext.getImageData(hGutter, vGutter, dWidth, dHeight);
            var greenData = greenContext.getImageData(hGutter, vGutter, dWidth, dHeight);
            var alphaData = alphaContext.getImageData(hGutter, vGutter, dWidth, dHeight);
            
            for(var i = 0; i < redData.data.length; i += 4) {
                redData.data[i+2] = blue;
                greenData.data[i+2] = blue;
                alphaData.data[i+2] = blue;
            }
            
            redContext.putImageData(redData, hGutter, vGutter);
            greenContext.putImageData(greenData, hGutter, vGutter);
            alphaContext.putImageData(alphaData, hGutter, vGutter);
        }
        
        var context = this.$.sampleSwatch.getContext('2d');
        context.drawImage(PixelismSettings.transparencyBackground, 0, 0, PixelismSettings.swatchWidth, PixelismSettings.swatchHeight);
        context.fillStyle = 'rgba(' + this.getRed() + ', ' + this.getGreen() + ', ' + blue + ', ' + (this.getAlpha() / 255.0) + ')';
        context.fillRect(0, 0, PixelismSettings.swatchWidth, PixelismSettings.swatchHeight);
    },
    
    alphaChanged: function(oldAlpha) {
        var alpha = this.getAlpha();
        
        var tWidth = PixelismSettings.sliderTotalWidth;
        var tHeight = PixelismSettings.sliderTotalHeight;
        var dWidth = PixelismSettings.sliderDrawWidth;
        var dHeight = PixelismSettings.sliderDrawHeight;
        var cOffset = PixelismSettings.sliderCursorOffset;
        var hGutter = (tWidth - dWidth) / 2;
        var vGutter = (tHeight - dHeight) / 2;
        
        var alphaContext = this.$.alpha.getContext('2d');
        alphaContext.clearRect(oldAlpha - cOffset + hGutter,
                              0,
                              cOffset * 2 + 1,
                              vGutter);
        alphaContext.clearRect(oldAlpha - cOffset + hGutter,
                              tHeight - vGutter,
                              cOffset * 2 + 1,
                              vGutter);
        
        alphaContext.drawImage(PixelismSettings.colorPickerCursorImage, alpha - cOffset + hGutter, 0);
        
        var context = this.$.sampleSwatch.getContext('2d');
        context.drawImage(PixelismSettings.transparencyBackground, 0, 0, PixelismSettings.swatchWidth, PixelismSettings.swatchHeight);
        context.fillStyle = 'rgba(' + this.getRed() + ', ' + this.getGreen() + ', ' + this.getBlue() + ', ' + (alpha / 255.0) + ')';
        context.fillRect(0, 0, PixelismSettings.swatchWidth, PixelismSettings.swatchHeight);
    },
    
    redEventTimeout: false,
    greenEventTimeout: false,
    blueEventTimeout: false,
    alphaEventTimeout: false,
    
    tapRed: function(sender, event) {
        var r = Math.floor(event.offsetX - (PixelismSettings.sliderTotalWidth - PixelismSettings.sliderDrawWidth) / 2);
        if(r < 0)
            r = 0;
        else if(r > 255)
            r = 255;
        
        if(this.redEventTimeout) {
            clearTimeout(this.redEventTimeout);
            
            var oldR = this.red;
            this.red = r;
            this.redChanged(oldR, true);
        }
        
        this.redEventTimeout = setTimeout(function(red) {
            this.setRed(red);
            this.doColorChange();
        }.bind(this, r), 250);
    },
    
    tapGreen: function(sender, event) {
        var g = Math.floor(event.offsetX - (PixelismSettings.sliderTotalWidth - PixelismSettings.sliderDrawWidth) / 2);
        if(g < 0)
            g = 0;
        else if(g > 255)
            g = 255;
        
        if(this.greenEventTimeout) {
            clearTimeout(this.greenEventTimeout);
            
            var oldG = this.green;
            this.green = g;
            this.greenChanged(oldG, true);
        }
        
        this.greenEventTimeout = setTimeout(function(green) {
            this.setGreen(green);
            this.doColorChange();
        }.bind(this, g), 250);
    },
    
    tapBlue: function(sender, event) {
        var b = Math.floor(event.offsetX - (PixelismSettings.sliderTotalWidth - PixelismSettings.sliderDrawWidth) / 2);
        if(b < 0)
            b = 0;
        else if(b > 255)
            b = 255;
        
        if(this.blueEventTimeout) {
            clearTimeout(this.blueEventTimeout);
            
            var oldB = this.blue;
            this.blue = b;
            this.blueChanged(oldB, true);
        }
        
        this.blueEventTimeout = setTimeout(function(blue) {
            this.setBlue(blue);
            this.doColorChange();
        }.bind(this, b), 250);
    },
    
    tapAlpha: function() {
        var a = Math.floor(event.offsetX - (PixelismSettings.sliderTotalWidth - PixelismSettings.sliderDrawWidth) / 2);
        if(a < 0)
            a = 0;
        else if(a > 255)
            a = 255;
        
        if(this.alphaEventTimeout) {
            clearTimeout(this.alphaEventTimeout);
            
            this.setAlpha(a);
        }
        
        this.alphaEventTimeout = setTimeout(function() {
            this.doColorChange();
        }.bind(this), 250);
    },
    
    setPreset: function(sender, event) {
        var context = this.$.presets.getContext('2d');
        
        var color = context.getImageData(event.offsetX, event.offsetY, 1, 1);
        
        this.setRed(color.data[0]);
        this.setGreen(color.data[1]);
        this.setBlue(color.data[2]);
        this.doColorChange();
    }
});

