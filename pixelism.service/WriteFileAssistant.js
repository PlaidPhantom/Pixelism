var WriteFileAssistant = function() {
}

WriteFileAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var path = this.controller.args.path;
	var content = this.controller.args.content;
	
    var buffer = new Buffer(content, 'base64');
    
	fs.writeFile(path, buffer, false, function(err) { future.result = { path: path, success: !!err   }; });
}