/*The MIT License (MIT)

Copyright (c) 2015 Marvel App

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

var rootURL = "https://marvelapp.com/api/";
var tokenPath = NSHomeDirectory() + "/.marvelToken"
var pluginPath = sketch.scriptPath.substring(0, sketch.scriptPath.lastIndexOf('/'));

// Plugin Calls

function getActiveTokenFromComputer() {
	var fileExists = NSFileManager.defaultManager().fileExistsAtPath(tokenPath);
	if (fileExists) {
		var token = NSString.stringWithContentsOfFile_encoding_error(tokenPath,NSUTF8StringEncoding,nil)
		return token
	} else {
		return false;
	}
}

function fireLoginWindow(){
		
	var alert = createAlertBase();
	
	alert.setMessageText("Login to Marvel");
	alert.setInformativeText("After you are logged in to marvelapp.com you upload artboards to Marvel.");
	
	alert.addTextLabelWithValue("Email");
	alert.addTextFieldWithValue("");
	
	alert.addTextLabelWithValue("Password");
	alert.addTextFieldWithValue("");
	
	var responseCode = alert.runModal();
	
	if (responseCode == "1000") {
	
	    var opts = {
	      email: valAtIndex(alert, 1),
	      password: valAtIndex(alert, 3)
	    }
			
			NSLog("Get Token From Server Start");
			var token = getTokenFromServer(opts.email,opts.password)
			NSLog("Get Token From Server End");
			
			if(token){
				
				var fileManager = NSFileManager.defaultManager()
				fileManager.createFileAtPath_contents_attributes(tokenPath, token, nil)
				
				var app = [NSApplication sharedApplication];
				[app displayDialog:"Select your artboards, go to plugins > Marvel > Send to Project..." withTitle:"You are now logged in."]
			} else {
				var app = [NSApplication sharedApplication];
				[app displayDialog:"If you sign into Marvel using Dropbox, you'll need to set a password for your account to use Sketch, head to My Profile in Marvel to set one up." withTitle:"Incorrect email or password."]
			}
	
	 }
	 
}

function fireError(title,text){
		var app = [NSApplication sharedApplication];
		[app displayDialog:text withTitle:title]
}

// Api Calls

function getTokenFromServer(email,password){
							
		var task = NSTask.alloc().init()
		task.setLaunchPath("/usr/bin/curl");
		
		var args = NSArray.arrayWithObjects("-v", "POST", "--header", "User-Agent: Sketch", "--header", "Content-Type: application/x-www-form-urlencoded", "--data", "email=" + email + "&password=" + password, rootURL + "loginApp/", nil);
		task.setArguments(args);
		var outputPipe = [NSPipe pipe];
		[task setStandardOutput:outputPipe];
		task.launch();
		var outputData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
		
		NSLog("Output pipe finished");
		
		if(outputData) {
		
				NSLog("Convert output data to string")
				var stringRead = [[NSString alloc] initWithData:outputData encoding:NSUTF8StringEncoding];
				NSLog("Return data " + stringRead)
				NSLog("Convert output data to string finished")
				
				NSLog("Convert output data to JSON")   		    
			  var error;
			  var res = [NSJSONSerialization JSONObjectWithData:outputData options:NSJSONReadingMutableLeaves error:error];
			  NSLog("Convert output data to JSON finished")   
			  
			  var token = res.token
			  
			  NSLog("Return token if exists")  
			  if(token){
			  		NSLog("Token exists and gets returned")  
			  		return token
			  } 
			  
			  NSLog("Token does not exist")  		
		} 
		
		return false;	

}

function getProjectNames() {
	
	var token = getActiveTokenFromComputer()
		
	var task = NSTask.alloc().init()
	task.setLaunchPath("/usr/bin/curl");
	
	var args = NSArray.arrayWithObjects("-v", "GET", "--header", "User-Agent: Marvel/4.0 CFNetwork/711.1.16 Darwin/14.0.0", "--header", "Content-Type: application/x-www-form-urlencoded", "--header", "Authorization: Token " + token, "--header", "HTTP_AUTHORIZATION: " + token, rootURL + "project/all/", nil);
	task.setArguments(args);
	var outputPipe = [NSPipe pipe];
	[task setStandardOutput:outputPipe];
	task.launch();
	var outputData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
	
	if(outputData) {
			    		    
		  var error;
		  var res = [NSJSONSerialization JSONObjectWithData:outputData options:NSJSONReadingMutableLeaves error:error];
		  
		  if(res.count() > 0){
		   
		   	var projects = [];
		   	for (var i = 0; i < res.count(); i++) {
		   		var project = res[i]
		   		projects.push(project.name)
		   	}
		   	
		   	return projects;
		   	 
		   } else {
		   	
		   	return false
		   	
		  }
	
	} 
	
	return false;	
			
}

function getProjectId(position) {
	
		NSLog("Get project id")
		
		var token = getActiveTokenFromComputer()
			
		var task = NSTask.alloc().init()
		task.setLaunchPath("/usr/bin/curl");
		
		var args = NSArray.arrayWithObjects("-v", "GET", "--header", "User-Agent: Marvel/4.0 CFNetwork/711.1.16 Darwin/14.0.0", "--header", "Content-Type: application/x-www-form-urlencoded", "--header", "Authorization: Token " + token, "--header", "HTTP_AUTHORIZATION: " + token, rootURL + "project/all/", nil);
		task.setArguments(args);
		var outputPipe = [NSPipe pipe];
		[task setStandardOutput:outputPipe];
		task.launch();
		var outputData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
		
		if(outputData) {
				    		    
			  var error;
			  var res = [NSJSONSerialization JSONObjectWithData:outputData options:NSJSONReadingMutableLeaves error:error];
			  
			  if(res.count() > 0){
			   
			   	var projects = [];
			   	for (var i = 0; i < res.count(); i++) {
			   		
			   		if(i== position){
			   			var project = res[i]
			   			projects.push(project.id)
			   		}	
			   		
			   	}
			   	
			   	 return projects;
			   	 
			   } else {
			   	
			   	return false
			   	
			  }
		
		} 
		
		return false;
		
}

function postFile(path, projectId, filename, uuid, width, height) {
			
			var dataImg = [[NSFileManager defaultManager] contentsAtPath:path];
			var token = getActiveTokenFromComputer()
			var postLength = [dataImg length].toString()

			var task = NSTask.alloc().init()
			task.setLaunchPath("/usr/bin/curl");
			
			var args = NSArray.arrayWithObjects("-v", "POST", "--header", "Content-Type: multipart/form-data; boundary=0xKhTmLbOuNdArY", "--header", "Authorization: Token " + token, "--header", "HTTP_AUTHORIZATION: 373bd37e71c4b0e8ac8bf6c5f1de8fe14196f6c8", "--header", "User-Agent: Marvel/4.0 CFNetwork/711.1.16 Darwin/14.0.0", "--header", "width: " + width, "--header", "height: " + height, "-F", "Content-Disposition: form-data; name=file; filename=" + filename + "; Content-Type=image/png;", "-F", "file=@" + path, rootURL + "content/upload/sketch/" + projectId + "/" + uuid + "/", nil);
						
			task.setArguments(args);
			//var outputPipe = [NSPipe pipe];
			//[task setStandardOutput:outputPipe];
			task.launch();
			//var outputData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
			//var outputString = [[[NSString alloc] initWithData:outputData encoding:NSUTF8StringEncoding]]; // Autorelease optional, depending on usage.
			//NSLog("result " + outputString)
}

// Helpers

function isRetinaDisplay() {
    return NSScreen.isOnRetinaScreen();
}

function valAtIndex(view, index){
  return view.viewAtIndex(index).stringValue()
}

function createAlertBase () {
  var alert = COSAlertWindow.new();

 	// Set icon.
  var scriptPath = scriptPath || sketch.scriptPath;
  var pluginPath = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
 
  function imageSuffix() {
     return isRetinaDisplay() ? "@2x" : "";
  }
 
  var imageFilePath=pluginPath + '/images/' + 'logo' + imageSuffix() + '.png';
  var icon = NSImage.alloc().initByReferencingFile(imageFilePath);
  alert.setIcon(icon);

  alert.addButtonWithTitle('OK');
  alert.addButtonWithTitle('Cancel');

  return alert;
}

function createSelect(msg, items, selectedItemIndex){
  selectedItemIndex = selectedItemIndex || 0

  var accessory = [[NSComboBox alloc] initWithFrame:NSMakeRect(0,0,200,25)]
  [accessory setCompletes:true]
  [accessory addItemsWithObjectValues:items]
  [accessory selectItemAtIndex:selectedItemIndex]

  var alert = [[NSAlert alloc] init]
  [alert setMessageText:msg]
  [alert addButtonWithTitle:'OK']
  [alert addButtonWithTitle:'Cancel']
  [alert setAccessoryView:accessory]

  var responseCode = [alert runModal]
  
	if (responseCode == "1000") {
		var sel = [accessory indexOfSelectedItem]
		return sel
	} 
	
  return nil
  
}

function exportArtboardsAndSendTo(projectId) {
	
	NSLog("Export All Artboards and send to project with id " + projectId)

				var loop = [selection objectEnumerator];
				var existing_artboards_names = [];
										
				while (artboard = [loop nextObject]) {
				  	
				  	if (artboard.className() == "MSArtboardGroup") {
				  	
				  	var arrayLength = existing_artboards_names.length;
				  	for (var i = 0; i < arrayLength; i++) {
				  	
				  			if(existing_artboards_names[i] == [artboard name]){
				  				
				  				fireError("You have more than one artboard with the name '" + [artboard name]  + "', please change one of these artboard names.","Please rename one of these artboards in order to solve this issue.")
				  				return false
				  				  
				  			} 
				  	}
				  	
				  	existing_artboards_names.push([artboard name]); 
				  	
				  	}					  	 					  	 
			
				}
				
				if(existing_artboards_names.length == 0){
				  fireError("You didn't select any artboards.","Select at least one artboard before sending.")
				  return false
				}
		
	sendArtboardOnArray(selection)


}

function exportAllArtboardsAndSendTo(projectId) {
		
		NSLog("Export All Artboards and send to project with id " + projectId)
					
					var artboards = [[doc currentPage] artboards];
					var loop = [artboards objectEnumerator];
					var existing_artboards_names = [];
											
					while (artboard = [loop nextObject]) {
					  	
					  	var arrayLength = existing_artboards_names.length;
					  	for (var i = 0; i < arrayLength; i++) {
					  	
					  			if(existing_artboards_names[i] == [artboard name]){
					  				
					  				fireError("You have more than one artboard with the name '" + [artboard name]  + "', please change one of these artboard names.","Please rename one of these artboards in order to solve this issue.")
					  				return false
					  				  
					  			} 
					  	}
					  	
					  	existing_artboards_names.push([artboard name]); 					  	 					  	 
				
					}
			
		sendArtboardOnArray(artboards)
				
}

function sendArtboardOnArray(array){

		var loopFinal = [array objectEnumerator];
		
		while (item = [loopFinal nextObject]) {
				
				if (item.className() == "MSArtboardGroup") {
				
				var filename = [item name] + ".png"
				
				NSLog("Artboard found with name " + filename + " and object id " + item.objectID())
				var path = NSTemporaryDirectory() + filename
				[doc saveArtboardOrSlice:item toFile: path];
				postFile(path, projectId, filename,item.objectID(), [[item frame] width], [[item frame] height])
				
				}
		}

}