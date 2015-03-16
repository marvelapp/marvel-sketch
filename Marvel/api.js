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
var pluginPath = sketch.scriptPath.substring(0, sketch.scriptPath.lastIndexOf('/'));
var tokenPath = pluginPath + "/.marvelToken"
var scaleSettingsPath = pluginPath + "/.marvelScaleSettings"
var scriptPath = scriptPath || sketch.scriptPath;

// Plugin Calls

function getActiveTokenFromComputer() {
	var fileExists = NSFileManager.defaultManager().fileExistsAtPath(tokenPath);
	if (fileExists) {
		var token = NSString.stringWithContentsOfFile_encoding_error(tokenPath,NSUTF8StringEncoding,nil)
		if(token){
			return token
		} else {
			return false
		}
	} else {
		return false;
	}
}

function deleteActiveTokenFromComputer() {
	var fileManager = NSFileManager.defaultManager()
	fileManager.removeItemAtPath_error(tokenPath,nil)
}

function getScaleSettingFromComputer() {
	var fileExists = NSFileManager.defaultManager().fileExistsAtPath(scaleSettingsPath);
	if (fileExists) {
		var scale = NSString.stringWithContentsOfFile_encoding_error(scaleSettingsPath,NSUTF8StringEncoding,nil)
		if(scale){
			return scale
		} else {
			return false
		}
	} else {
		return false;
	}
}

function saveScaleSetting(value){
	var fileManager = NSFileManager.defaultManager()
	fileManager.createFileAtPath_contents_attributes(scaleSettingsPath, value, nil)
}

function fireLoginWindow(){
	
	// create window
	var loginWindow = [[NSWindow alloc] init]
	[loginWindow setFrame:NSMakeRect(0, 0, 540, 332) display:false]
	[loginWindow setBackgroundColor:NSColor.whiteColor()]
		
	//Image
	function imageSuffix() {
	   return isRetinaDisplay() ? "@2x" : "";
	}
	var imageFilePath=pluginPath + '/images/' + 'logo' + imageSuffix() + '.png';
	var image = NSImage.alloc().initByReferencingFile(imageFilePath);
	
	var imageView = [[NSImageView alloc] initWithFrame:NSMakeRect(46, 124, 164, 149)];
	[imageView setImage: image];
	[[loginWindow contentView] addSubview:imageView];
	
	// create prompt text
	var titleField = [[NSTextField alloc] initWithFrame:NSMakeRect(248, 249, 243, 17)]
	[titleField setEditable:false]
	[titleField setBordered:false]
	[titleField setDrawsBackground:false]
	[titleField setFont:[NSFont boldSystemFontOfSize:13]];
	[titleField setStringValue:"Prototype with Sketch"]
	[[loginWindow contentView] addSubview:titleField]
	
	// create prompt text
	var subtitleField = [[NSTextField alloc] initWithFrame:NSMakeRect(248, 224, 243, 15)]
	[subtitleField setEditable:false]
	[subtitleField setBordered:false]
	[subtitleField setFont:[NSFont systemFontOfSize:13]];
	[subtitleField setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]];
	[subtitleField setDrawsBackground:false]
	[subtitleField setStringValue:"Sign in and sent artboards to Marvel!"]
	[subtitleField sizeToFit]
	[[loginWindow contentView] addSubview:subtitleField]
	
	var emailInputField = [[NSTextField alloc] initWithFrame:NSMakeRect(250, 181, 243, 23)]
	[[emailInputField cell] setPlaceholderString:"Email"]
	[[loginWindow contentView] addSubview:emailInputField]	
	  
	var passwordField = [[NSSecureTextField alloc] initWithFrame:NSMakeRect(250, 150, 243, 23)]
	[[passwordField cell] setPlaceholderString:"Password"]
	[[loginWindow contentView] addSubview:passwordField]	
	
	var yPosButtons = 102;
	
	var loginButton = [[NSButton alloc] initWithFrame:NSMakeRect(407, yPosButtons, 92, 46)]
	[loginButton setTitle:"Login"]
	[loginButton setBezelStyle:NSRoundedBezelStyle]
	[loginButton setKeyEquivalent:"\r"]
	[loginButton setCOSJSTargetFunction:function(sender) {
	    [loginWindow orderOut:nil]
	    [NSApp stopModal]
	    var email = emailInputField.stringValue()
	    var password = passwordField.stringValue()
	    loginWithUsernameAndPassword(email, password)
	}];
	[loginButton setAction:"callAction:"]
	[[loginWindow contentView] addSubview:loginButton]
	
	
	var cancelButton = [[NSButton alloc] initWithFrame:NSMakeRect(321, yPosButtons, 92, 46)]
	[cancelButton setTitle:"Cancel"]
	[cancelButton setBezelStyle:NSRoundedBezelStyle]
	[cancelButton setCOSJSTargetFunction:function(sender) {
	    [loginWindow orderOut:nil]
	    [NSApp stopModal]
	}];
	[cancelButton setAction:"callAction:"]
	[[loginWindow contentView] addSubview:cancelButton]
	

	//Bottom Bar

	var bottomActionsView = [[NSView alloc] initWithFrame:NSMakeRect(0, 0, 540, 79)];
	bottomActionsView.setWantsLayer(true);
	[[loginWindow contentView] addSubview:bottomActionsView];	
	
	var backgroundLayer = [CALayer layer];
	[backgroundLayer setBackgroundColor:CGColorCreateGenericRGB(246/255, 246/255, 246/255, 1.0)]; //RGB plus Alpha Channel
	[bottomActionsView setLayer:backgroundLayer]
	
	var borderLayer = [CALayer layer];
	borderLayer.frame = CGRectMake(0, 78, 540, 1);
	[borderLayer setBackgroundColor:CGColorCreateGenericRGB(220/255, 220/255, 220/255, 1.0)]; //RGB plus Alpha Channel
	[backgroundLayer addSublayer:borderLayer];

	//Create Marvel Button
	
	var createMarvelButton = [[NSButton alloc] initWithFrame:NSMakeRect(44, 23, 162, 32)]
	[createMarvelButton setTitle:"Create Marvel account"]
	[createMarvelButton setBezelStyle:NSRoundedBezelStyle]
	[createMarvelButton setCOSJSTargetFunction:function(sender) {
	    var url = [NSURL URLWithString:@"https://marvelapp.com/manage/account/"];
	    if( ![[NSWorkspace sharedWorkspace] openURL:url] ){
	        NSLog(@"Failed to open url:" + [url description])
	    }    
	}];
	[createMarvelButton setAction:"callAction:"]
	[bottomActionsView addSubview:createMarvelButton]
	
	
	var createHelpButton = [[NSButton alloc] initWithFrame:NSMakeRect(470, 23, 32, 32)]
	[createHelpButton setBezelStyle:NSHelpButtonBezelStyle]
	[createHelpButton setTitle:nil]
	[createHelpButton setCOSJSTargetFunction:function(sender) {
	    var url = [NSURL URLWithString:@"http://marvel.helpscoutdocs.com/article/62-getting-started-with-the-marvel-sketch-plugin"];
	    if( ![[NSWorkspace sharedWorkspace] openURL:url] ){
	        NSLog(@"Failed to open url:" + [url description])
	    }    
	}];
	[createHelpButton setAction:"callAction:"]
	[bottomActionsView addSubview:createHelpButton]
	

	[loginWindow setDefaultButtonCell:[loginButton cell]];
	
	[NSApp runModalForWindow:loginWindow]
	
}

function fireAlreadyLoggedInWindow(){
	
	// create window
	var alreadyLoggedInWindow = [[NSWindow alloc] init]
	[alreadyLoggedInWindow setFrame:NSMakeRect(0, 0, 540, 332) display:false]
	[alreadyLoggedInWindow setBackgroundColor:NSColor.whiteColor()]
	
	// create prompt text
	var titleField = [[NSTextField alloc] initWithFrame:NSMakeRect(0, 179, 540, 17)]
	[titleField setEditable:false]
	[titleField setBordered:false]
	[titleField setAlignment:NSCenterTextAlignment] 
	[titleField setDrawsBackground:false]
	[titleField setFont:[NSFont boldSystemFontOfSize:13]];
	[titleField setStringValue:"You are already logged in!"]
	[[alreadyLoggedInWindow contentView] addSubview:titleField]
	
	// create prompt text
	var subtitleField = [[NSTextField alloc] initWithFrame:NSMakeRect(0, 140, 540, 30)]
	[subtitleField setEditable:false]
	[subtitleField setBordered:false]
	[subtitleField setAlignment:NSCenterTextAlignment] 
	[subtitleField setFont:[NSFont systemFontOfSize:13]];
	[subtitleField setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]];
	[subtitleField setDrawsBackground:false]
	[subtitleField setStringValue:"Logout first if you would like to use a different account."]
	[[alreadyLoggedInWindow contentView] addSubview:subtitleField]
	
	var yPosButtons = 100;
	
	var logoutButton = [[NSButton alloc] initWithFrame:NSMakeRect(267, yPosButtons, 92, 46)]
	[logoutButton setTitle:"Log out"]
	[logoutButton setBezelStyle:NSRoundedBezelStyle]
	[logoutButton setCOSJSTargetFunction:function(sender) {
			deleteActiveTokenFromComputer()
	    [alreadyLoggedInWindow orderOut:nil]
	    [NSApp stopModal]
	    fireLoginWindow()
	}];
	[logoutButton setAction:"callAction:"]
	[[alreadyLoggedInWindow contentView] addSubview:logoutButton]
	
	
	var cancelButton = [[NSButton alloc] initWithFrame:NSMakeRect(181, yPosButtons, 92, 46)]
	[cancelButton setTitle:"Cancel"]
	[cancelButton setBezelStyle:NSRoundedBezelStyle]
	[cancelButton setCOSJSTargetFunction:function(sender) {
	    [alreadyLoggedInWindow  orderOut:nil]
	    [NSApp stopModal]
	}];
	[cancelButton setAction:"callAction:"]
	[[alreadyLoggedInWindow contentView] addSubview:cancelButton]

	[alreadyLoggedInWindow setDefaultButtonCell:[logoutButton cell]];
	
	[NSApp runModalForWindow:alreadyLoggedInWindow]

}

function fireSendArtboards(projectsArray, all){
	
	NSLog("Trigger Send Artboards");
		
	var windowSendArtboards = [[NSWindow alloc] init]
	[windowSendArtboards setFrame:NSMakeRect(0, 0, 485, 333) display:false]
	[windowSendArtboards setBackgroundColor:NSColor.whiteColor()]
	
	var titleField = [[NSTextField alloc] initWithFrame:NSMakeRect(74, 225, 540, 17)]
	[titleField setEditable:false]
	[titleField setBordered:false]
	[titleField setDrawsBackground:false]
	[titleField setFont:[NSFont boldSystemFontOfSize:13]];
	[titleField setStringValue:"Export settings"]
	[[windowSendArtboards contentView] addSubview:titleField]

	var yDropdowns = 170;
	
	var projectPopup = [[NSPopUpButton alloc] initWithFrame:NSMakeRect(74, yDropdowns, 266, 26)]
	[projectPopup removeAllItems]
	[projectPopup setFocusRingType:NSFocusRingTypeNone]
	var projectNames = [];
	for (i = 0; i < projectsArray.length; ++i) {
			projectNames.push(projectsArray[i].name);
	}
	[projectPopup addItemsWithTitles:projectNames]
	[projectPopup selectItemAtIndex:0]
	[[windowSendArtboards contentView] addSubview:projectPopup]
	
	var subtitleField = [[NSTextField alloc] initWithFrame:NSMakeRect(74, yDropdowns - 28, 266, 26)]
	[subtitleField setEditable:false]
	[subtitleField setBordered:false]
	[subtitleField setAlignment:NSCenterTextAlignment] 
	[subtitleField setFont:[NSFont systemFontOfSize:11]];
	[subtitleField setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]];
	[subtitleField setDrawsBackground:false]
	[subtitleField setStringValue:"Project"]
	[[windowSendArtboards contentView] addSubview:subtitleField]

	var pluralNounPopup = [[NSComboBox alloc] initWithFrame:NSMakeRect(345, yDropdowns, 78, 26)]
	var pluralNouns  = ["1x", "1.5x", "2x", "0.5x"]
	[pluralNounPopup removeAllItems]
	[pluralNounPopup setFocusRingType:NSFocusRingTypeNone]
	[pluralNounPopup addItemsWithObjectValues:pluralNouns]
	[[windowSendArtboards contentView] addSubview:pluralNounPopup]
		
	var scale = getScaleSettingFromComputer();
	
	if(scale){	
		var foundIndex = 0;
		for (i = 0; i < pluralNouns.length; ++i) {
				if(scale == pluralNouns[i]){
					[pluralNounPopup selectItemAtIndex:i]
					foundIndex = 1
				}
		}
			
		if(foundIndex != 1){
				[pluralNounPopup insertItemWithObjectValue:scale atIndex:0];
				[pluralNounPopup selectItemAtIndex:0]
		}
	} else {
		[pluralNounPopup selectItemAtIndex:0]
	}

	var subtitleField2 = [[NSTextField alloc] initWithFrame:NSMakeRect(345, yDropdowns - 28, 78, 26)]
	[subtitleField2 setEditable:false]
	[subtitleField2 setBordered:false]
	[subtitleField2 setAlignment:NSCenterTextAlignment] 
	[subtitleField2 setFont:[NSFont systemFontOfSize:11]];
	[subtitleField2 setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]];
	[subtitleField2 setDrawsBackground:false]
	[subtitleField2 setStringValue:"Size"]
	[[windowSendArtboards contentView] addSubview:subtitleField2]
	
	var bottomActionsView = [[NSView alloc] initWithFrame:NSMakeRect(74, 112, 348, 1)]
	bottomActionsView.setWantsLayer(true)
	[[windowSendArtboards contentView] addSubview:bottomActionsView]	
		
	var borderLayer = [CALayer layer]
	borderLayer.frame = CGRectMake(0, 1, 348, 1)
	[borderLayer setBackgroundColor:CGColorCreateGenericRGB(220/255, 220/255, 220/255, 1.0)]
	[bottomActionsView setLayer:borderLayer];

	var yPosButtons = 45;
	
	var sendButton = [[NSButton alloc] initWithFrame:NSMakeRect(295, yPosButtons, 134, 46)]
	[sendButton setTitle:"Send or update"]
	[sendButton setBezelStyle:NSRoundedBezelStyle]
	[sendButton setCOSJSTargetFunction:function(sender) {

	    if(all == 1){
					
					NSLog("Send All Artboards");
					
	    		for (i = 0; i < projectsArray.length; ++i) {
	    				
	    				if (projectPopup.titleOfSelectedItem() == projectsArray[i].name){
	    						
	    						var str = [pluralNounPopup objectValueOfSelectedItem];
	    						if (!str){
	    						    str = [pluralNounPopup stringValue];
	    						}
	    						
	    						export_scale_factor = str.replace(/[^0-9.wWhH]/g,"");
	    						
	    						if(export_scale_factor.indexOf("w") !=-1 || export_scale_factor.indexOf("h") !=-1 || export_scale_factor.indexOf("W") !=-1 || export_scale_factor.indexOf("H") !=-1) {
	    						   var app = [NSApplication sharedApplication];
	    						   [app displayDialog:"Try again without" withTitle:"We don't support w or h characters for scaling at this moment"]
	    						} else {
	    							exportAllArtboardsAndSendTo(projectsArray[i].id, export_scale_factor)
	    							saveScaleSetting(str)
	    							[windowSendArtboards orderOut:nil]
	    							[NSApp stopModal] 
	    						}

	    				}
	    				
	    		}

	    } else {
	       
	       NSLog("Send Artboards");
	       
	       for (i = 0; i < projectsArray.length; ++i) {
	       		
	       		if (projectPopup.titleOfSelectedItem() == projectsArray[i].name){
	       		
	       				var str = [pluralNounPopup objectValueOfSelectedItem];
	       				if (!str){
	       				    str = [pluralNounPopup stringValue];
	       				}    
	       				    
	       				export_scale_factor = str.replace(/[^0-9.wWhH]/g,"");
	       				
	       				if(export_scale_factor.indexOf("w") !=-1 || export_scale_factor.indexOf("h") !=-1 || export_scale_factor.indexOf("W") !=-1 || export_scale_factor.indexOf("H") !=-1) {
	       				   var app = [NSApplication sharedApplication];
	       				   [app displayDialog:"Try again without" withTitle:"We don't support w or h characters for scaling at this moment"]
	       				} else {
	       					exportArtboardsAndSendTo(projectsArray[i].id, export_scale_factor)
	       					saveScaleSetting(str)
	       					[windowSendArtboards orderOut:nil]
	       					[NSApp stopModal] 
	       				}

	       				
	       		}
	       		
	       }

	    }
	    
	}];
	[sendButton setAction:"callAction:"]
	[[windowSendArtboards contentView] addSubview:sendButton]
	
	var cancelButton = [[NSButton alloc] initWithFrame:NSMakeRect(225, yPosButtons, 76, 46)]
	[cancelButton setTitle:"Cancel"]
	[cancelButton setBezelStyle:NSRoundedBezelStyle]
	[cancelButton setCOSJSTargetFunction:function(sender) {
	    [windowSendArtboards orderOut:nil]
	    [NSApp stopModal]
	}];
	[cancelButton setAction:"callAction:"]
	[[windowSendArtboards contentView] addSubview:cancelButton]

	[windowSendArtboards setDefaultButtonCell:[sendButton cell]];
	
	[NSApp runModalForWindow:windowSendArtboards]
	
}

function loginWithUsernameAndPassword(email, password){

			NSLog("Get Token From Server Start");
			var token = getTokenFromServer(email,password)
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

// Api Calls

function getTokenFromServer(email,password){
							
		var task = NSTask.alloc().init()
		task.setLaunchPath("/usr/bin/curl");

		var args = NSArray.arrayWithObjects("-v", "POST", "--header", "User-Agent: Sketch", "--header", "Content-Type: application/x-www-form-urlencoded", "--data", "email=" + email + "&password=" + escapedPassword(password), rootURL + "loginApp/", nil);
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

function getProjectNamesArray() {
	
	var token = getActiveTokenFromComputer()
	
	NSLog("token for project names fetch is " + token);

	var task = NSTask.alloc().init()
	task.setLaunchPath("/usr/bin/curl");
		
	var args = NSArray.arrayWithObjects("-v", "GET", "-H", "User-Agent: Sketch", "-H", "Content-Type: application/x-www-form-urlencoded", "-H", "Authorization: Token " + token, "-H", "HTTP_AUTHORIZATION: " + token, rootURL + "project/all/", nil);
	task.setArguments(args);
	var outputPipe = [NSPipe pipe];
	[task setStandardOutput:outputPipe];
	task.launch();
	var outputData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
		
	if(outputData) {
				
		NSLog("Convert output data to string")
		var stringRead = [[NSString alloc] initWithData:outputData encoding:NSUTF8StringEncoding];	
		NSLog("Return data " + stringRead)
		NSLog("Convert output data to string finished")
		
		var error;
		
		var res = [NSJSONSerialization JSONObjectWithData:outputData options:NSJSONReadingMutableLeaves error:error];;

	  if(res.detail && res.detail == "Invalid token"){
	  		deleteActiveTokenFromComputer()
	  		fireError("Your token is not valid anymore, please login again.","After you are logged in again please try again.")
	  		return false
	  } else {
	  
		  if(res.count() > 0){
		   
		   	var projects = [];
		   	for (var i = 0; i < res.count(); i++) {
		   		var project = res[i]
		   		projects.push({name: project.name, id: project.id})
		   	}

		   	return projects;
		   	 
		   } else {
		   	
		   	return false
		   	
		  }
		  
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
			
			var args = NSArray.arrayWithObjects("-v", "POST", "--header", "Content-Type: multipart/form-data; boundary=0xKhTmLbOuNdArY", "--header", "Authorization: Token " + token, "--header", "HTTP_AUTHORIZATION: 373bd37e71c4b0e8ac8bf6c5f1de8fe14196f6c8", "--header", "User-Agent: Sketch", "--header", "width: " + width, "--header", "height: " + height, "-F", "Content-Disposition: form-data; name=file; filename=" + filename + "; Content-Type=image/png;", "-F", "file=@" + path, rootURL + "content/upload/sketch/" + projectId + "/" + uuid + "/", nil);
						
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

function exportArtboardsAndSendTo(projectId, scale) {
	
	NSLog("Export All Artboards and send to project with id " + projectId + " and size " + scale)

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
		
	sendArtboardOnArray(selection, scale, projectId)

}

function exportAllArtboardsAndSendTo(projectId, scale) {
		
		NSLog("Export All Artboards and send to project with id " + projectId + " and size " + scale)
					
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
			
					sendArtboardOnArray(artboards, scale, projectId)
				
}

function sendArtboardOnArray(array, scale, projectId){

		var loopFinal = [array objectEnumerator];
		
		while (item = [loopFinal nextObject]) {
				
				if (item.className() == "MSArtboardGroup") {
				
				var filename = escapedFileName([item name]) + ".png"
				
				NSLog("Artboard found with name " + filename + " and object id " + item.objectID())
				var path = NSTemporaryDirectory() + filename
				var version = copy_layer_with_factor(item, scale);
				[doc saveArtboardOrSlice: version toFile:path];
				
				postFile(path, projectId, filename,item.objectID(), [[item frame] width], [[item frame] height])
				
				}
		}

}

function escapedFileName(string){
	
	var notAllowedChars = [NSCharacterSet characterSetWithCharactersInString:@"\\<>=,!#$&'()*+/:;=?@[]%"];
	var cleanString = [[string componentsSeparatedByCharactersInSet:notAllowedChars] componentsJoinedByString:@""];
	return cleanString
}

function escapedPassword(string){

	var alnum = [NSMutableCharacterSet characterSetWithCharactersInString:@"!#$&'()*+,/:;=?@[]%"];
	var escapedString = [string stringByAddingPercentEncodingWithAllowedCharacters:[alnum invertedSet]];
	
	return escapedString;
	
}

function copy_layer_with_factor(original_slice, factor){
    var copy = [original_slice duplicate];
    var frame = [copy frame];

    var rect = [copy absoluteDirtyRect],
    slice = [MSExportRequest requestWithRect:rect scale:factor];

    [copy removeFromParent];
    return slice;
}

function fireError(title,text){
		var app = [NSApplication sharedApplication];
		[app displayDialog:text withTitle:title]
}