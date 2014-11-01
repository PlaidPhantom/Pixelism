enyo.kind( {
    name: "Pixelism.Main",
    kind: "VFlexBox",
    components: [ {
            kind: "Pixelism.DrawRegion",
            name: "drawRegion",
            flex: 1
        }, {
            name: "settings",
            kind: "Pixelism.Settings",
            onModeChange: "changeDrawRegionMode",
            onResize: "resizeDrawRegion",
            onFill: "fillDrawRegion",
            onClear: "clearDrawRegion",
            onLoadImage: "loadDrawRegion",
            onSaveImage: "saveDrawRegion"
        }, {
            kind: "AppMenu",
            components: [ {
                    caption: "Help",
                    onclick: "showHelp"
                }, {
                    caption: "About Pixelism",
                    onclick: "showAbout"
                }
            ]
        }, {
            name: "aboutpopup",
            kind: "Popup",
            modal: true,
            dismissWithClick: true,
            components: [ {
                    kind: "Image",
                    src: "images/logo-small.png"
                }, {
                    kind: "HFlexBox",
                    components: [ {
                            content: "Pixelism v" + PixelismSettings.appVersion
                        }, {
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "Go to the Pixelism Website",
                            onclick: "goToPixelism"
                        }
                    ]
                }, {
                    kind: "HFlexBox",
                    components: [ {
                            content: "by Phantom Hat"
                        }, {
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "Visit Phantom Hat on the Web",
                            onclick: "goToPhantomHat"
                        }
                    ]
                }, {
                    kind: "HFlexBox",
                    components: [ {
                            kind: "Button",
                            content: "Find us on Twitter as @PixelismApp",
                            onclick: "goToTwitter"
                        }, {
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "Contact Support",
                            onclick: "contactSupport"
                        }
                    ]
                }
            ]
        }, {
            name: "appLauncher",
            kind: "PalmService",
            service: "palm://com.palm.applicationManager/",
            method: "open"
        }
    ],
    
    rendered: function() {
        this.inherited(arguments);
    },
    
    changeDrawRegionMode: function(sender, mode) {
        this.$.drawRegion.setMode(mode);
    },
    
    resizeDrawRegion: function(sender, width, height) {
        this.$.drawRegion.setSize(width, height);
    },
    
    fillDrawRegion: function() {
        this.$.drawRegion.fill();
    },
    
    clearDrawRegion: function(sender, clearOption) {
        this.$.drawRegion.clearImage(clearOption);
    },
    
    loadDrawRegion: function(sender, image, callback) {
        this.$.drawRegion.loadImage(image, callback);
    },
    
    saveDrawRegion: function() {
        return this.$.drawRegion.getPNG();
    },
    
    showHelp: function() {
        enyo.windows.activate('help.html', 'Pixelism Help');
    },
    
    showAbout: function() {
        this.$.aboutpopup.openAtCenter();
    },
    
    goToPixelism: function() {
        this.$.appLauncher.call({ target: PixelismSettings.pixelismUrl });
    },
    
    goToPhantomHat: function() {
        this.$.appLauncher.call({ target: PixelismSettings.phantomHatUrl });
    },
    
    goToTwitter: function() {
        this.$.appLauncher.call({ target: PixelismSettings.twitterUrl });
    },
    
    contactSupport: function() {
        this.$.appLauncher.call({ target: PixelismSettings.supportEmail });
    }
});
