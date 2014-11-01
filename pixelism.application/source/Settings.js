enyo.kind({
    name: "Pixelism.Settings",
    kind: "Toolbar",
    components: [ {
            kind: "RadioToolButtonGroup",
            name: "drawButton",
            onChange: "toolChange",
            value: PixelismDefaults.readyTool,
            components: [ {
                    value: "move",
                    components: [ {
                            kind: "Image",
                            src: PixelismSettings.moveIcon
                        }
                    ]
                }, {
                    value: "eraser",
                    components: [ {
                            kind: "Image",
                            src: PixelismSettings.eraserIcon
                        }
                    ]
                }, {
                    name: "brush1",
                    kind: "Pixelism.BrushButton",
                    brushInfo: PixelismDefaults.brush1,
                    value: "brush1",
                    onNewBrush: "setInteractionMode"
                }, {
                    name: "brush2",
                    kind: "Pixelism.BrushButton",
                    brushInfo: PixelismDefaults.brush2,
                    value: "brush2",
                    onNewBrush: "setInteractionMode"
                }
            ]
        }, {
            kind: "Control",
            name: "hintLabel",
            content: "<- Hold for options",
            style: "color: white; font-size: 16px; padding-left: 5px;"
        }, {
            kind: "Spacer",
            flex: 1
        }, {
            kind: "ToolButton",
            name: "sizeButton",
            caption: PixelismDefaults.width.toString() + "x" + PixelismDefaults.height.toString(),
            onclick: "showSizePopup"
        }, {
            kind: "ToolButton",
            name: "fillButton",
            caption: "Fill/Clear",
            onclick: "getFillOptions"
        }, {
            kind: "ToolButton",
            name: "backgroundButton",
            caption: "Background",
            onclick: "confirmBackgroundChange"
        }, {
            kind: "ToolButton",
            name: "saveButton",
            caption: "Save",
            onclick: "chooseSaveLocation"
        }, {
            kind: "Popup",
            name: "sizePopup",
            modal: true,
            lazy: false,
            layoutKind: "VFlexLayout",
            components: [ {
                    content: "Resize the drawing area. <br />The background will stretch to fit the new size.",
                    allowHtml: true,
                    style: "text-align: center;"
                }, {
                    kind: "RoundedInputBox",
                    components: [ {
                            content: "Width:&nbsp;"
                        }, {
                            kind: "RoundedInput",
                            name: "width",
                            value: PixelismDefaults.width,
                            style: "width: 4em;",
                            onkeypress: "filterSizeEntry",
                            autoCapitalize: false,
                            autoEmoticons: false,
                            spellcheck: false,
                            autocorrect: false,
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "+",
                            onclick: "increaseWidth"
                        }, {
                            kind: "Button",
                            caption: "-",
                            onclick: "decreaseWidth"
                        }
                    ]
                }, {
                    kind: "RoundedInputBox",
                    components: [ {
                            content: "Height:&nbsp;"
                        }, {
                            kind: "RoundedInput",
                            name: "height",
                            value: PixelismDefaults.height,
                            style: "width: 4em;",
                            onkeypress: "filterSizeEntry",
                            autoCapitalize: false,
                            autoEmoticons: false,
                            spellcheck: false,
                            autocorrect: false,
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
                }, {
                    kind: "HFlexBox",
                    components: [ {
                            kind: "Button",
                            caption: "Cancel",
                            className: "enyo-button-negative",
                            onclick: "dismissSizePopup",
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "Resize",
                            className: "enyo-button-affirmative",
                            onclick: "setSize",
                            flex: 1
                        }
                    ]
                }
            ]
        }, {
            kind: "Popup",
            name: "fillPopup",
            modal: true,
            dismissWithClick: false,
            layoutKind: "VFlexLayout",
            components: [ {
                    content: "Are you sure? This will completely overwrite <br />everything that has been drawn.",
                    allowHtml: true,
                    style: "text-align: center"
                }, {
                    kind: "Button",
                    caption: "Cancel",
                    className: "enyo-button-negative",
                    onclick: "closeFillPopup",
                    flex: 1
                }, {
                    kind: "Button",
                    caption: "Erase Entire Image",
                    className: "enyo-button-blue",
                    onclick: "executeFillErase",
                    flex: 1
                }, {
                    kind: "Button",
                    caption: "Fill with Brush 1",
                    className: "enyo-button-affirmative",
                    onclick: "executeFillBrush1",
                    flex: 1
                }, {
                    kind: "Button",
                    caption: "Fill with Brush 2",
                    className: "enyo-button-affirmative",
                    onclick: "executeFillBrush2",
                    flex: 1
                }
            ]
        }, {
            kind: "Popup",
            name: "backgroundPopup",
            modal: true,
            dismissWithClick: false,
            layoutKind: "VFlexLayout",
            components: [ {
                    content: "How do you want to change the background?"
                }, {
                    kind: "Button",
                    caption: "Cancel",
                    className: "enyo-button-negative",
                    onclick: "dismissBackgroundPopup",
                    flex: 1
                }, {
                    kind: "Button",
                    caption: "Clear to Black",
                    className: "enyo-button-blue",
                    onclick: "clearBackgroundBlack",
                    flex: 1
                }, {
                    kind: "Button",
                    caption: "Clear to Transparent",
                    className: "enyo-button-blue",
                    onclick: "clearBackgroundTransparent",
                    flex: 1
                }, {
                    kind: "Button",
                    caption: "Load Image",
                    className: "enyo-button-affirmative",
                    onclick: "loadImage",
                    flex: 1,
                }
            ]
        }, {
            kind: "FilePicker",
            name: "loadFilePicker",
            fileType: "image",
            onPickFile: "loadFile"
        }, {
            name: "cropPopup",
            kind: "Pixelism.CropPopup",
            onCrop: "setImage"
        }, {
            kind: "Popup",
            name: "chooseSaveFilePopup",
            modal: true,
            dismissWithClick: false,
            lazy: false,
            components: [ {
                    content: "Choose a file name to save the image as:"
                }, {
                    kind: "RoundedInputBox",
                    components: [ {
                            content: "File Name:&nbsp;"
                        }, {
                            kind: "RoundedInput",
                            name: "filename",
                            onkeypress: "checkFileName",
                            hint: "filename.png",
                            autoCapitalize: "lowercase",
                            autoEmoticons: false,
                            spellcheck: false,
                            autocorrect: false,
                            flex: 1
                        }
                    ]
                }, {
                    kind: "HFlexBox",
                    components: [ {
                            kind: "Button",
                            caption: "Cancel",
                            className: "enyo-button-negative",
                            onclick: "dismissSavePopup",
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "Save File",
                            className: "enyo-button-affirmative",
                            onclick: "checkFileExists",
                            flex: 1
                        }
                    ]
                }
            ]
        }, {
            name: "fileExistsErrorPopup",
            kind: "Popup",
            modal: true,
            dismissWithClick: true,
            lazy: false,
            components: [ {
                    name: "fileExistsMsg",
                    content: "File exists.  Choose another filename."
                }
            ]
        }, {
            name: "saveWaitPopup",
            kind: "Popup",
            components: [ {
                    content: "Saving, please wait..."
                }
            ]
        }, {
            name: "fileExistsService",
            kind: "PalmService",
            service: "palm://com.phantomhat.pixelism.service/",
            method: "fileexists",
            onSuccess: "fileExistsResult",
            onFailure: "fileExistsError"
        }, {
            name: "saveFileService",
            kind: "PalmService",
            service: "palm://com.phantomhat.pixelism.service/",
            method: "writefile",
            onSuccess: "fileSaved",
            onFailure: "fileNotSaved"
        }, {
            name: "fileSavedPopup",
            kind: "Popup",
            modal: true,
            dismissWithClick: true,
            components: [ {
                    content: "File saved successfully."
                }
            ]
        }, {
            name: "saveFailedPopup",
            kind: "Popup",
            modal: true,
            dismissWithClick: true,
            components: [ {
                    content: "File could not be saved."
                }
            ]
        }
    ],
    
    events: {
        onModeChange: "",
        onResize: "",
        onFill: "",
        onClear: "",
        onLoadImage: "",
        onSaveImage: ""
    },
    
    published: {
        clearOption: ""
    },
    
    fadeInterval: false,
    hintOpacity: 1.0,
    
    rendered: function() {
        this.inherited(arguments);
        
        setTimeout(function() {
            this.fadeInterval = setInterval(function() {
                this.$.hintLabel.applyStyle('opacity', this.hintOpacity -= .05);
                
                if(this.hintOpacity <= 0.0) {
                    clearInterval(this.fadeInterval);
                    this.$.hintLabel.applyStyle('opacity', 0);
                    this.$.hintLabel.applyStyle('display', 'none');
                }
            }.bind(this), 100);
        }.bind(this), 5000);
    },
    
    toolChange: function(sender) {
        
        
        this.setInteractionMode(sender);
    },
    
    setInteractionMode: function(sender) {
        var val = sender.getValue();
        
        if(val != this.$.drawButton.getValue())
            this.$.drawButton.setValue(val);
        
        if(val == 'move')
            this.doModeChange({ type: 'move', brush: false });
        else if(val == 'eraser')
            this.doModeChange({ type: 'brush', brush: PixelismSettings.eraserBrush });
        else if(val == 'brush1')
            this.doModeChange({ type: 'brush', brush: this.$.brush1.getBrush() });
        else if(val == 'brush2')
            this.doModeChange({ type: 'brush', brush: this.$.brush2.getBrush() });
    },
    
    showSizePopup: function() {
        this.$.sizePopup.openAtCenter();
    },
    
    filterSizeEntry: function(sender, event) {
        var c = String.fromCharCode(event.charCode);
        
        if('0123456789'.indexOf(c) < 0 || event.charCode == 8)
            event.preventDefault();
    },
    
    increaseWidth: function() {
        this.$.width.setValue(parseInt(this.$.width.getValue()) + 1);
    },
    
    decreaseWidth: function() {
        var w = parseInt(this.$.width.getValue()) - 1;
        this.$.width.setValue(w < 1 ? 1 : w);
    },
    
    increaseHeight: function() {
        this.$.height.setValue(parseInt(this.$.height.getValue()) + 1);
    },
    
    decreaseHeight: function() {
        var h = parseInt(this.$.height.getValue()) - 1;
        this.$.height.setValue(h < 1 ? 1 : h);
    },
    
    setSize: function() {
        this.doResize(parseInt(this.$.width.getValue()), parseInt(this.$.height.getValue()));
        
        this.$.sizeButton.setCaption(this.$.width.getValue() + 'x' + this.$.height.getValue());
        
        this.dismissSizePopup();
    },
    
    dismissSizePopup: function() {
        this.$.sizePopup.close();
    },
    
    getFillOptions: function() {
        this.$.fillPopup.openAtCenter();
    },
    
    closeFillPopup: function() {
        this.$.fillPopup.close();
    },
    
    executeFillErase: function() {
        this.$.drawButton.setValue('eraser');
        this.setInteractionMode(this.$.drawButton);
        this.doFill();
        this.closeFillPopup();
    },
    
    executeFillBrush1: function() {
        this.$.drawButton.setValue('brush1');
        this.setInteractionMode(this.$.drawButton);
        this.doFill();
        this.closeFillPopup();
    },
    
    executeFillBrush2: function() {
        this.$.drawButton.setValue('brush2');
        this.setInteractionMode(this.$.drawButton);
        this.doFill();
        this.closeFillPopup();
    },
    
    dismissClearPopup: function() {
        this.$.confirmClearPopup.close();
    },
    
    confirmBackgroundChange: function() {
        this.$.backgroundPopup.openAtCenter();
    },
    
    clearBackgroundBlack: function() {
        this.dismissBackgroundPopup();
        this.doClear('fillblack');
    },
    
    clearBackgroundTransparent: function() {
        this.dismissBackgroundPopup();
        this.doClear('filltransparency');
    },
    
    loadImage: function() {
        this.dismissBackgroundPopup();
        
        this.$.loadFilePicker.pickFile();
    },
    
    dismissBackgroundPopup: function() {
        this.$.backgroundPopup.close();
    },
    
    loadFile: function(sender, response) {
        if(response && response.length > 0) 
            setTimeout(function() {
                this.$.cropPopup.setSrc(response[0].fullPath);
                this.$.cropPopup.openAtCenter();
            }.bind(this), 0);
    },
    
    setImage: function(sender, croppedImage) {
        this.doLoadImage(croppedImage, function(width, height) {
            this.$.width.setValue(width);
            this.$.height.setValue(height);
            this.$.sizeButton.setCaption(width + 'x' + height);
        }.bind(this));
    },
    
    chooseSaveLocation: function() {
        this.$.chooseSaveFilePopup.openAtCenter();
    },
    
    checkFileName: function(sender, event) {
        var c = String.fromCharCode(event.charCode);
        if(c.match(PixelismSettings.filenameRegex))
            event.preventDefault();
    },
    
    checkFileExists: function() {
        var filename = this.$.filename.getValue();
        
        if(!filename.match(/^.+\.png$/))
            filename += '.png';
        
        this.$.fileExistsService.call({ path: PixelismSettings.savePath + filename });
    },
    
    fileExistsResult: function(sender, result) {
        if(result.exists) {
            this.$.fileExistsMsg.setContent('File "' + result.path + '" exists.  Choose another file name.');
            this.$.fileExistsErrorPopup.openAtCenter();
        }
        else
            this.saveImage();
    },
    
    fileExistsError: function(sender, result) {
        this.$.fileExistsMsg.setContent('Unable to read directory. Please try again later.');
        this.$.fileExistsErrorPopup.openAtCenter();
    },
    
    saveImage: function() {
        this.dismissSavePopup();
        this.$.saveWaitPopup.openAtCenter();
        
        var filename = this.$.filename.getValue();
        
        if(!filename.match(/^.+\.png$/))
            filename += '.png';
        
        filename = PixelismSettings.savePath + filename;
        
        setTimeout(function() {
            var png = this.doSaveImage();
            
            this.$.saveFileService.call({path: filename, content: png});
        }.bind(this), 0);
    },
    
    dismissSavePopup: function() {
        this.$.chooseSaveFilePopup.close();
    },
    
    fileSaved: function() {
        enyo.log('Save successful.');
        
        this.$.saveWaitPopup.close();
        this.$.fileSavedPopup.openAtCenter();
    },
    
    fileNotSaved: function(sender, result) {
        enyo.error(result.errorText);
        
        this.$.saveWaitPopup.close();
        this.$.saveFailedPopup.openAtCenter();
    }
});
