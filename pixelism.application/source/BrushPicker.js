enyo.kind({
    name: "Pixelism.BrushPicker",
    kind: "Popup",
    layoutKind: "VFlexLayout",
    modal: true,
    lazy: false,
    dismissWithClick: false,
    components: [ {
            kind: "HFlexBox",
            components: [ {
                    kind: "LabeledContainer",
                    label: "Sample:",
                    components: [ {
                            name: "sampleBrush",
                            kind: "Pixelism.Canvas",
                            width: PixelismSettings.brushIconWidth,
                            height: PixelismSettings.brushIconHeight,
                            className: "sampleBrush"
                        }
                    ]
                }, {
                    flex: 1
                }, {
                    kind: "LabeledContainer",
                    label: "Shape:",
                    components: [ {
                            name: "maskButton",
                            kind: "PickerButton",
                            onclick: "showMaskSelect",
                            style: "text-align: center;",
                            components: [ {
                                    name: "maskButtonImage",
                                    style: "vertical-align: middle; padding-bottom: 4px",
                                    kind: "Image"
                                }
                            ]
                        }, {
                            name: "mask",
                            kind: "PopupSelect",
                            items: PixelismSettings.masks,
                            onSelect: "selectMask"
                        }
                    ]
                }, {
                    kind: "LabeledContainer",
                    label: "Rotation:",
                    components: [ {
                            name: "rotation",
                            kind: "Picker",
                            items: PixelismSettings.rotations,
                            onChange: "updateSampleBrush"
                        }
                    ]
                }
            ]
        }, {
            kind: "HFlexBox",
            components: [ {
                    name: "foregroundColor",
                    kind: "Pixelism.ColorPicker",
                    caption: "Foreground Color",
                    onColorChange: "updateSampleBrush"
                }, {
                    name: "backgroundColor",
                    kind: "Pixelism.ColorPicker",
                    caption: "Background Color",
                    onColorChange: "updateSampleBrush"
                }
            ]
        }, {
            kind: "HFlexBox",
            components: [ {
                    kind: "Button",
                    caption: "Cancel",
                    className: "enyo-button-negative",
                    onclick: "cancelPicker",
                    flex: 1
                    
                }, {
                    kind: "Button",
                    caption: "Select Brush",
                    className: "enyo-button-affirmative",
                    onclick: "selectBrush",
                    flex: 1
                }
            ]
        }
    ],
    
    published: {
        brush: false
    },
    
    events: {
        onSelect: ""
    },
    
    mask: false,
    
    brushChanged: function() {
        this.$.foregroundColor.setRed(this.getBrush().foregroundColor.r);
        this.$.foregroundColor.setGreen(this.getBrush().foregroundColor.g);
        this.$.foregroundColor.setBlue(this.getBrush().foregroundColor.b);
        this.$.foregroundColor.setAlpha(this.getBrush().foregroundColor.a);
        
        this.$.backgroundColor.setRed(this.getBrush().backgroundColor.r);
        this.$.backgroundColor.setGreen(this.getBrush().backgroundColor.g);
        this.$.backgroundColor.setBlue(this.getBrush().backgroundColor.b);
        this.$.backgroundColor.setAlpha(this.getBrush().backgroundColor.a);
        
        this.mask = this.getBrush().mask;
        this.$.maskButtonImage.setSrc(PixelismSettings.getIconMaskUrl(this.mask));
        
        this.$.rotation.setValue(this.getBrush().rotation);
        
        window.BrushRenderer.renderIcon(this.getBrush(), function(brush) {
            this.$.sampleBrush.getContext('2d').drawImage(PixelismSettings.transparencyBackground, 0, 0);
            this.$.sampleBrush.getContext('2d').drawImage(brush, 0, 0);
        }.bind(this));
    },
    
    pickColor: function(oldBrushInfo) {
        this.openAtCenter();
        this.setBrush(oldBrushInfo);
    },
    
    updateSampleBrush: function() {
        this.brush = {
            foregroundColor: {
                r: this.$.foregroundColor.getRed(),
                g: this.$.foregroundColor.getGreen(),
                b: this.$.foregroundColor.getBlue(),
                a: this.$.foregroundColor.getAlpha()
            },
            backgroundColor: {
                r: this.$.backgroundColor.getRed(),
                g: this.$.backgroundColor.getGreen(),
                b: this.$.backgroundColor.getBlue(),
                a: this.$.backgroundColor.getAlpha()
            },
            mask: this.mask,
            rotation: this.$.rotation.getValue()
        };
        
        setTimeout(function() {
            window.BrushRenderer.renderIcon(this.getBrush(), function(brush) {
                this.$.sampleBrush.getContext('2d').drawImage(PixelismSettings.transparencyBackground, 0, 0);
                this.$.sampleBrush.getContext('2d').drawImage(brush, 0, 0);
            }.bind(this));
        }.bind(this), 0);
    },
    
    selectBrush: function() {
        this.setBrush({
            foregroundColor: {
                r: this.$.foregroundColor.getRed(),
                g: this.$.foregroundColor.getGreen(),
                b: this.$.foregroundColor.getBlue(),
                a: this.$.foregroundColor.getAlpha()
            },
            backgroundColor: {
                r: this.$.backgroundColor.getRed(),
                g: this.$.backgroundColor.getGreen(),
                b: this.$.backgroundColor.getBlue(),
                a: this.$.backgroundColor.getAlpha()
            },
            mask: this.mask,
            rotation: this.$.rotation.getValue()
        });
        
        this.doSelect();
        this.close();
    },
    
    cancelPicker: function() {
        this.close();
    },
    
    showMaskSelect: function() {
        this.$.mask.openAtControl(this.$.maskButton);
    },
    
    selectMask: function(sender, selected) {
        this.mask = selected.value;
        this.$.maskButtonImage.setSrc(PixelismSettings.getIconMaskUrl(this.mask));
        this.updateSampleBrush();
    }
});

