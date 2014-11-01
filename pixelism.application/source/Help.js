enyo.kind({
    name: "Pixelism.Help",
    kind: "VFlexBox",
    components: [ {
            kind: "Header",
            components: [ {
                    content: "How to Use Pixelism",
                    flex: 1
                }, {
                    kind: "Button",
                    caption: "Contact Support",
                    onclick: "contactSupport"
                }
            ]
        }, {
            kind: "Scroller",
            flex: 1,
            components: [ {
                    kind: "HtmlContent",
                    srcId: "help"
                }, {
                    kind: "HFlexBox",
                    components: [ {
                            kind: "Button",
                            flex: 1,
                            onclick: "goToPixelism",
                            components: [ {
                                    kind: "Image",
                                    src: "images/icon.png"
                                }, {
                                    content: "Pixelism"
                                }
                            ]
                        }, {
                            kind: "Button",
                            flex: 1,
                            onclick: "goToPhantomHat",
                            components: [ {
                                    kind: "Image",
                                    src: "images/phantomhat.png"
                                }, {
                                    content: "Phantom Hat"
                                }
                            ]
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
    
    goToPixelism: function() {
        this.$.appLauncher.call({ target: window.PixelismSettings.pixelismUrl });
    },
    
    goToPhantomHat: function() {
        this.$.appLauncher.call({ target: window.PixelismSettings.phantomHatUrl });
    },
    
    contactSupport: function() {
        this.$.appLauncher.call({ target: window.PixelismSettings.supportEmail });
    }
});
