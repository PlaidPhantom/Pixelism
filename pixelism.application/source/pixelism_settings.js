PixelismSettings = {
    // general app info
    appVersion: "2.0.0",
    fullVersion: true,  // shouldn't do anything anymore
    fullVersionLink: 'http://www.phantomhat.com/pixelism/',  // referenced in unused nag screen. meh.
    pixelismUrl: 'http://www.phantomhat.com/pixelism/',
    phantomHatUrl: 'http://www.phantomhat.com/',
    twitterUrl: 'http://twitter.com/PixelismApp',
    supportEmail: 'mailto:support@phantomhat.com?Subject=[Pixelism] Support',
    
    //general settings
    filenameRegex: /[\\\/*?<>:"|]/,
    savePath: '/media/internal/',
    
    // settings bar
    moveIcon: 'images/move.png',
    eraserIcon: 'images/poof.png',
    
    // brush settings
    brushWidth: 16,
    brushHeight: 16,
    brushIconWidth: 24,
    brushIconHeight: 24,
    eraserBrush: false, // DrawRegion checks for brush existence before drawing
    getMaskUrl: function(mask) { return 'images/masks/' + mask + '.png'; },
    getIconMaskUrl: function(mask) { return 'images/masks/' + mask + '-icon.png'; },
    masks: [
        { value: "dot",         caption: "Dot",      icon: "images/masks/dot-icon.png" },
        { value: "diamond",     caption: "Diamond",  icon: "images/masks/diamond-icon.png" },
        { value: "heart",       caption: "Heart",    icon: "images/masks/heart-icon.png" },
        { value: "square",      caption: "Square",   icon: "images/masks/square-icon.png" },
        { value: "triangle",    caption: "Triangle", icon: "images/masks/triangle-icon.png" },
        { value: "star",        caption: "Star",     icon: "images/masks/star-icon.png" },
        { value: "man",         caption: "Man",      icon: "images/masks/man-icon.png" },
        { value: "woman",       caption: "Woman",    icon: "images/masks/woman-icon.png" },
        { value: "transparent", caption: "Solid FG", icon: "images/masks/transparent-icon.png" }
    ],
    
    rotations: [
        { value: "u", caption: "Up" },
        { value: "d", caption: "Down" },
        { value: "l", caption: "Left" },
        { value: "r", caption: "Right" }
    ],
    
    // color picker
    brushPickerDelay: 1000,
    colorPickerCursorImage: new Image(),
    sliderTotalWidth: 266,
    sliderTotalHeight: 24,
    sliderDrawWidth: 256,
    sliderDrawHeight: 16,
    sliderCursorOffset: 4,
    
    transparencyBackground: new Image(),
    swatchWidth: 32,
    swatchHeight: 32,
    swatchPresets: [
        [ '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#7f00ff', '#ffffff' ],
        [ '#7f0000', '#7f3f00', '#7f7f00', '#007f00', '#007f7f', '#00007f', '#7f007f', '#3f007f', '#7f7f7f' ]
    ],
    
    // image cropper
    cropCanvasWidth: 400,
    cropCanvasHeight: 400
};

PixelismSettings.colorPickerCursorImage.src = 'images/colorcursor.png';
PixelismSettings.transparencyBackground.src = 'images/transparencybackground.png';

PixelismDefaults = {
    width: 64,
    height: 64,
    readyTool: 'move',
    brush1: { foregroundColor: { r: 255, g: 0, b: 0, a: 255 }, backgroundColor: { r: 255, g: 0, b: 0, a: 0 }, mask: 'dot', rotation: 'u' },
    brush2: { foregroundColor: { r: 0, g: 0, b: 255, a: 255 }, backgroundColor: { r: 0, g: 0, b: 255, a: 0 }, mask: 'dot', rotation: 'u' }
};
