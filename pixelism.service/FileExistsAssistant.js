var FileExistsAssistant = function() {
}

FileExistsAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var path = this.controller.args.path;
	
	fs.stat(path, function(err, stat) {
        future.result = { path: path, exists: !err };
    });
}
