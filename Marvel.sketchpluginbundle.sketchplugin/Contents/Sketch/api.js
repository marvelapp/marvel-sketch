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

var DEBUG = false
var rootURL = "https://marvelapp.com/api/"

// Plugin Calls

function getActiveTokenFromComputer() {
	sketchLog("Get active token from computer")
	var token = [[NSUserDefaults standardUserDefaults] objectForKey:"token"];
	if (token) {
		return token;
	} else {
		return false;
	}
}

function deleteActiveTokenFromComputer() {
	[[NSUserDefaults standardUserDefaults] removeObjectForKey:@"token"];
}

function getScaleSettingFromComputer() {
	var scale = [[NSUserDefaults standardUserDefaults] objectForKey:"scale"];
	if (scale) {
		return scale;
	} else {
		return false;
	}
}

function getLastUsedProject() {
	var scale = [[NSUserDefaults standardUserDefaults] objectForKey:"last used project"];
	if (scale) {
		return scale;
	} else {
		return false;
	}
}

function saveLastUsedProject(projectId){
	[[NSUserDefaults standardUserDefaults] setObject:projectId forKey:"last used project"]
	[[NSUserDefaults standardUserDefaults] synchronize]
}

function saveScaleSetting(scaleValue){
	[[NSUserDefaults standardUserDefaults] setObject:scaleValue forKey:"scale"]
	[[NSUserDefaults standardUserDefaults] synchronize]
}

function fireLoginWindowWithContext(context){
	
	// create window
	var loginWindow = [[NSWindow alloc] init]
	[loginWindow setFrame:NSMakeRect(0, 0, 540, 332) display:false]
	[loginWindow setBackgroundColor:NSColor.whiteColor()]
		
	var plugin = context.plugin

	if(isRetinaDisplay()){
		var imageFilePath=[plugin urlForResourceNamed:"logo.png"];
	} else {
		var imageFilePath=[plugin urlForResourceNamed:"logo.png"];
	}
	var imageData = [NSData dataWithContentsOfURL:imageFilePath];
	var image = NSImage.alloc().initWithData(imageData);

	//var image = NSImage.alloc().initByReferencingFile([imageFilePath absoluteString]);

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
	        sketchLog(@"Failed to open url:" + [url description])
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
	        sketchLog(@"Failed to open url:" + [url description])
	    }    
	}];
	[createHelpButton setAction:"callAction:"]
	[bottomActionsView addSubview:createHelpButton]
	

	[loginWindow setDefaultButtonCell:[loginButton cell]];
	
	[NSApp runModalForWindow:loginWindow]	
}

function fireAlreadyLoggedInWindow(context){
	
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
	    fireLoginWindowWithContext(context)
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

function fireSendArtboards(projectsArray, all, context){
	
	sketchLog("Trigger Send Artboards");
		
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
	
	var projectPopup = [[NSComboBox alloc] initWithFrame:NSMakeRect(74, yDropdowns, 266, 26)]
	[projectPopup removeAllItems]
	[projectPopup setFocusRingType:NSFocusRingTypeNone]
	var lastUsedProjectId = getLastUsedProject();
	var lastUsedProjectIdIndex;
	var projectNames = [];
	for (i = 0; i < projectsArray.length; ++i) {
			projectNames.push(projectsArray[i].name);

			if(lastUsedProjectId == projectsArray[i].id){
				lastUsedProjectIdIndex = i;
			}
	}
	[projectPopup addItemsWithObjectValues:projectNames]
	if(lastUsedProjectIdIndex){
		[projectPopup selectItemAtIndex:lastUsedProjectIdIndex]
	} else {
		[projectPopup selectItemAtIndex:0]
	}
	[[windowSendArtboards contentView] addSubview:projectPopup]
	
	var subtitleField = [[NSTextField alloc] initWithFrame:NSMakeRect(74, yDropdowns - 28, 266, 26)]
	[subtitleField setEditable:false]
	[subtitleField setBordered:false]
	[subtitleField setAlignment:NSCenterTextAlignment] 
	[subtitleField setFont:[NSFont systemFontOfSize:11]];
	[subtitleField setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]];
	[subtitleField setDrawsBackground:false]
	[subtitleField setStringValue:"Project (or enter a new one)"]
	[[windowSendArtboards contentView] addSubview:subtitleField]

	var pluralNounPopup = [[NSComboBox alloc] initWithFrame:NSMakeRect(345, yDropdowns, 78, 26)]
	var pluralNouns  = ["1x", "1.5x", "2x", "0.5x", "3x"]
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

				sketchLog("Send Artboards");
				
				var scaleString = [pluralNounPopup objectValueOfSelectedItem];
				if (!scaleString){
					scaleString = [pluralNounPopup stringValue];
				}

				var export_scale_factor = scaleString.replace(/[^0-9.wWhH]/g,"");

				if(export_scale_factor.indexOf("w") !=-1 || export_scale_factor.indexOf("h") !=-1 || export_scale_factor.indexOf("W") !=-1 || export_scale_factor.indexOf("H") !=-1) {
	    			var app = [NSApplication sharedApplication];
	    			[app displayDialog:"Try again without" withTitle:"We don't support w or h characters for scaling at this moment"]
	    			return false
	    		} 

				var selectedProject = [projectPopup objectValueOfSelectedItem];
				if (!selectedProject){
				    selectedProject = [projectPopup stringValue];
				}

				var projectId;

	    		for (i = 0; i < projectsArray.length; ++i) {

	    				if (selectedProject == projectsArray[i].name){
	    					
	    					projectId = projectsArray[i].id;	

	    				} 
	    				
	    		}

	    		if (projectId == nil) {
	    			projectId = createProject(selectedProject)
	    		}

	    		if (projectId){
		    		if(all == 1){
						exportAllArtboardsAndSendTo(projectId, export_scale_factor, context.document)
					} else {
						exportArtboardsAndSendTo(projectId, export_scale_factor, context.selection, context.document)
					}
					saveScaleSetting(scaleString)
					saveLastUsedProject(projectId)
					[windowSendArtboards orderOut:nil]
					[NSApp stopModal]

				};

	    
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

function createProject(nameValue){

	sketchLog("Create project")
	
	var token = getActiveTokenFromComputer()
	
	var jsonDict = [[NSDictionary alloc] initWithObjectsAndKeys: nameValue, @"name", nil]
	var errorDataConvert;
    var jsonData = [NSJSONSerialization dataWithJSONObject:jsonDict options:0 error:errorDataConvert];

	var url = [NSURL URLWithString:rootURL + "project/"];
	
	var request=[NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60]
	[request setHTTPMethod:"POST"]
	[request setValue:"Sketch" forHTTPHeaderField:"User-Agent"]
	[request setValue:"application/json" forHTTPHeaderField:"Content-Type"]
	[request setValue:"Token " + token forHTTPHeaderField:"Authorization"]
	[request setValue:token forHTTPHeaderField:"HTTP_AUTHORIZATION"]
	[request setHTTPBody: jsonData]
		
	var response = nil;
	var error = nil;
	sketchLog("Start create project connection")
	var data = [NSURLConnection sendSynchronousRequest:request returningResponse:response error:error];
	
	if (error == nil && data != nil)
	{	    
	    var errorJson;
		var res = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:errorJson]
		 
		if(res.detail && res.detail == "Invalid token"){
		  	deleteActiveTokenFromComputer()
		  	fireError("Your token is not valid anymore, please login again.","After you are logged in again please try again.")
		  	return false
		} else if (res.detail && res.detail == "Project name already exists"){
		  	fireError("Project name already exists.","Change your project name to go forward.")
		  	return false
		} else if ([res valueForKey:@"id"]) {
			var itemId = [NSString stringWithFormat:@"%@", [[res valueForKey:@"id"] intValue]];
		   	return itemId
		}

		return false	
	    	
	} else {
			dealWithErrors(data)
	}

	return false;
}

function loginWithUsernameAndPassword(email, password){

			sketchLog("Get Token From Server Start");
			getTokenFromServer(email,password)
			sketchLog("Get Token From Server End");			
}

// Api Calls

function getTokenFromServer(email,password){
		
		sketchLog("Get token from server")
		var url = [NSURL URLWithString:rootURL + "loginApp/"];

		var request=[NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60]
		[request setHTTPMethod:"POST"]
		[request setValue:"Sketch" forHTTPHeaderField:"User-Agent"]
		[request setValue:"application/json" forHTTPHeaderField:"Content-Type"]
		
		var tmp = [[NSDictionary alloc] initWithObjectsAndKeys:
		                     email, @"email",
		                     password, @"password",
		                     nil];
		
		var error = nil;                     
		var postData = [NSJSONSerialization dataWithJSONObject:tmp options:0 error:error];

		[request setHTTPBody:postData];
			
		var response = nil;
		var error = nil;
		sketchLog("Fetch token")
		var data = [NSURLConnection sendSynchronousRequest:request returningResponse:response error:error];
			
		if (error == nil && data != nil){	
		    
					var res = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:nil]
			
				  	var token = res.token
				  	
				  	sketchLog("Return token if exists")  
				  	
				  	if(token){
				  			sketchLog("Token exists and gets returned") 
				  			
				  			[[NSUserDefaults standardUserDefaults] setObject:token forKey:"token"]
							[[NSUserDefaults standardUserDefaults] synchronize]
				  			
				  			var app = [NSApplication sharedApplication];
				  			[app displayDialog:"Select your artboards, go to plugins > Marvel > Send to Project..." withTitle:"You are now logged in."]
				  			
						} else if(res.password) {
		
								var app = [NSApplication sharedApplication];
								[app displayDialog:"If you sign into Marvel using Dropbox, you'll need to set a password for your account to use Sketch, head to My Profile in Marvel to set one up." withTitle:"Incorrect email or password."]
							
						} else {
								dealWithErrors(data)
						}
				  	
						sketchLog("Token does not exist")  		
					  
			    	
			} else {
										
						dealWithErrors(data)
						
			}
		
			return false;	
}

function getProjectNamesArray() {
	
	sketchLog("Get project names")
	
	var token = getActiveTokenFromComputer()
	
	var url = [NSURL URLWithString:rootURL + "project/all/"];
	
	var request=[NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60]
	[request setHTTPMethod:"GET"]
	[request setValue:"Sketch" forHTTPHeaderField:"User-Agent"]
	[request setValue:"application/json" forHTTPHeaderField:"Content-Type"]
	[request setValue:"Token " + token forHTTPHeaderField:"Authorization"]
	[request setValue:token forHTTPHeaderField:"HTTP_AUTHORIZATION"]
	
	var response = nil;
	var error = nil;
	sketchLog("Fetch project names")
	var data = [NSURLConnection sendSynchronousRequest:request returningResponse:response error:error];
	
	if (error == nil && data != nil)
	{	    
	    var errorJson;
	    		
			var res = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:errorJson]
	
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
	    	
	} else {
			dealWithErrors(data)
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
			
			if(DEBUG == true)
			{
			  var outputPipe = [NSPipe pipe];
				[task setStandardOutput:outputPipe];
				task.launch();
				var outputData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
				var outputString = [[[NSString alloc] initWithData:outputData encoding:NSUTF8StringEncoding]]; // Autorelease optional, depending on usage.
				sketchLog(outputString)
			} else {
				task.launch();
			}
}

// Helpers

function dealWithErrors(data){

		sketchLog("Received an error from the server")
		var stringRead = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];	
		
		var alert = [[NSAlert alloc] init]
		[alert setMessageText:"Something went wrong..."]
		[alert setInformativeText:"Please ensure your internet isn\'t down or a firewall (e.g. Little Snitch) is not blocking any connections to marvelapp.com."]

		if(stringRead != nil && stringRead != ""){
				[alert addButtonWithTitle:'Close']
				[alert addButtonWithTitle:'Show more details']
		} else {
				[alert addButtonWithTitle:'Close']
		}
		
		var responseCode = [alert runModal]
		if(responseCode == "1001"){
				webViewWhichShowsResults()
		}

		sketchLog("Return data " + stringRead)		
}

function webViewWhichShowsResults(){
	// create window
		var webViewWindow = [[NSWindow alloc] init]
		[webViewWindow setFrame:NSMakeRect(0, 0, 680, 420) display:false]
		[webViewWindow setBackgroundColor:NSColor.whiteColor()]
		
		var webView = [[WebView alloc] initWithFrame:NSMakeRect(0, 87, 680, 420 - 87) frameName:"Error frame" groupName:nil];
		[[webView mainFrame] loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://marvelapp.com/"]]];
		[[webViewWindow contentView] addSubview:webView];
		
		//Bottom Line
		var bottomLineView = [[NSView alloc] initWithFrame:NSMakeRect(0, 86, 680, 1)];
		bottomLineView.setWantsLayer(true);
		[[webViewWindow contentView] addSubview:bottomLineView];	
			
		var backgroundLayer = [CALayer layer];
		[backgroundLayer setBackgroundColor:CGColorCreateGenericRGB(220/255, 220/255, 220/255, 1.0)]; //RGB plus Alpha Channel
		[bottomLineView setLayer:backgroundLayer]
		
		var subtitleField = [[NSTextField alloc] initWithFrame:NSMakeRect(40, 30, 480, 40)]
		[subtitleField setEditable:false]
		[subtitleField setBordered:false]
		[subtitleField setFont:[NSFont systemFontOfSize:12]];
		[subtitleField setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]];
		[subtitleField setDrawsBackground:false]
		[subtitleField setStringValue:"In most cases this screen should show more information why connections get\nblocked, if it doesn’t please get in touch with help@marvelapp.com"]
		[subtitleField sizeToFit]
		[[webViewWindow contentView] addSubview:subtitleField]
		
		var cancelButton = [[NSButton alloc] initWithFrame:NSMakeRect(550, 20, 92, 46)]
		[cancelButton setTitle:"Close"]
		[cancelButton setBezelStyle:NSRoundedBezelStyle]
		[cancelButton setCOSJSTargetFunction:function(sender) {
		    [webViewWindow orderOut:nil]
		    [NSApp stopModal]
		}];
		[cancelButton setAction:"callAction:"]
		[[webViewWindow contentView] addSubview:cancelButton]
		
		[webViewWindow setDefaultButtonCell:[cancelButton cell]];
			
		[NSApp runModalForWindow:webViewWindow ]
}

function isRetinaDisplay() {
    return NSScreen.isOnRetinaScreen();
}

function exportArtboardsAndSendTo(projectId, scale, selection, document) {
		
	sketchLog("Export Selected Artboards and send to project with id " + projectId + " and size " + scale)

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
		
	sendArtboardOnArray(selection, scale, projectId, document)
}

function exportAllArtboardsAndSendTo(projectId, scale, document) {

		sketchLog("Export All Artboards and send to project with id " + projectId + " and size " + scale)
					
					var artboards = [[document currentPage] artboards];
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
			
					sendArtboardOnArray(artboards, scale, projectId, document)				
}

function sendArtboardOnArray(array, scale, projectId, document){

		var loopFinal = [array objectEnumerator];
		
		while (item = [loopFinal nextObject]) {
				
				if (item.className() == "MSArtboardGroup") {
				
					var filename = escapedFileName([item name]) + ".png"
					
					sketchLog("Artboard found with name " + filename + " and object id " + item.objectID())
					var path = NSTemporaryDirectory() + filename
					var version = copy_layer_with_factor(item, scale)

					[document saveArtboardOrSlice:version toFile:path];
					
					postFile(path, projectId, filename,item.objectID(), [[item frame] width], [[item frame] height])

				}
		}
}

function escapedFileName(string){
	
	var notAllowedChars = [NSCharacterSet characterSetWithCharactersInString:@"\\<>=,!#$&'()*+/:;=?@[]%"];
	var cleanString = [[string componentsSeparatedByCharactersInSet:notAllowedChars] componentsJoinedByString:@""];
	return cleanString
}

function copy_layer_with_factor(original_slice, factor){
    var copy = [original_slice duplicate];
    var frame = [copy frame];

    var rect = [MSSliceTrimming trimmedRectForSlice:copy],
    slice = [MSExportRequest requestWithRect:rect scale:factor];

    [copy removeFromParent];
    return slice;
}

function fireError(title,text){
		var app = [NSApplication sharedApplication];
		[app displayDialog:text withTitle:title]
}

function sketchLog(string){
	if(DEBUG == true)
	{
		NSLog("Sketch: " + string)
	}
}