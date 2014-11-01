enyo.kind({
    name: "Pixelism.NagScreen",
    kind: "Popup",
    modal: true,
    dismissWithClick: false,
    //layoutKind: "VFlexLayout",
    //align: "center",
    lazy: false,
    components: [ {
            kind: "HFlexBox",
            components: [ {
                    flex: 1
                }, {
                    kind: "Image",
                    src: "images/logo-small-free.png"
                }, {
                    flex: 1
                }
            ]
        }, {
            kind: "Control",
            name: "webContent",
            allowHtml: true,
            content: ""
        }, {
            kind: "HFlexBox",
            components: [ {
                    kind: "Button",
                    onclick: "decline",
                    layoutKind: "VFlexLayout",
                    pack: "center",
                    components: [ {
                            content: "No<br />Thanks",
                            allowHtml: true
                        }
                    ]
                }, {
                    kind: "Button",
                    flex: 1,
                    onclick: "openAppCatalog",
                    components: [ {
                            kind: "Image",
                            src: "images/buynow.png"
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
    
    updateInterval: false,
    
    rendered: function() {
    },
    
    showNagScreen: function() {
        this.updateInterval = setInterval(function() {
            if(PixelismSettings.webNagText) {
                this.$.webContent.setContent(PixelismSettings.webNagText);
                clearInterval(this.updateInterval);
                
                this.openAtCenter();
            }
        }.bind(this), 100);
    },
    
    decline: function() {
        clearInterval(this.updateInterval);
        
        this.close();
    },
    
    openAppCatalog: function() {
        this.$.appLauncher.call({ target: window.PixelismSettings.fullVersionLink });
        
        this.close();
    }
});