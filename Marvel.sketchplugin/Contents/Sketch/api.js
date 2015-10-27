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

@import 'helpers/error-logging.js'
@import 'helpers/settings.js'
@import 'helpers/mini.js'
@import 'helpers/manifest.js'

var rootURL = "https://marvelapp.com/api/"
var app = [NSApplication sharedApplication];

// Plugin Calls

function getActiveTokenFromComputer(context) {
	sketchLog(context,"getActiveTokenFromComputer()")
	var token = [[NSUserDefaults standardUserDefaults] objectForKey:"token"];
	if (token) {
		sketchLog(context,"Token return : " + token)
		return token;
	} else {
		return false;
	}
}

function deleteActiveTokenFromComputer(context) {
	[[NSUserDefaults standardUserDefaults] removeObjectForKey:@"token"];
}


function fireLoginWindowWithContext(context){
	
	// create window
	var loginWindow = [[NSWindow alloc] init]
	[loginWindow setFrame:NSMakeRect(0, 0, 540, 332) display:false]
	[loginWindow setBackgroundColor:NSColor.whiteColor()]
		
	var plugin = context.plugin

	if(mini.isRetinaDisplay()){
		var imageFilePath=[plugin urlForResourceNamed:"logo@2x.png"];
	} else {
		var imageFilePath=[plugin urlForResourceNamed:"logo.png"];
	}
	var imageData = [NSData dataWithContentsOfURL:imageFilePath];
	var image = NSImage.alloc().initWithData(imageData);

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
	var cancelButton = [[NSButton alloc] initWithFrame:NSMakeRect(321, yPosButtons, 92, 46)]
	var createMarvelButton = [[NSButton alloc] initWithFrame:NSMakeRect(44, 23, 162, 32)]
	var createHelpButton = [[NSButton alloc] initWithFrame:NSMakeRect(470, 23, 32, 32)]

	[loginButton setTitle:"Login"]
	[loginButton setBezelStyle:NSRoundedBezelStyle]
	[loginButton setKeyEquivalent:"\r"]
	[loginButton setCOSJSTargetFunction:function(sender) {
	    [loginWindow orderOut:nil]
	    [app stopModal]
	    var email = emailInputField.stringValue()
	    var password = passwordField.stringValue()
	    loginWithUsernameAndPassword(email, password, context)
	    [cancelButton setCOSJSTargetFunction:undefined]
	    [loginButton setCOSJSTargetFunction:undefined]
	    [createMarvelButton setCOSJSTargetFunction:undefined]
	    [createHelpButton setCOSJSTargetFunction:undefined]
	}];
	[loginButton setAction:"callAction:"]
	[[loginWindow contentView] addSubview:loginButton]
	
	
	
	[cancelButton setTitle:"Cancel"]
	[cancelButton setBezelStyle:NSRoundedBezelStyle]
	[cancelButton setCOSJSTargetFunction:function(sender) {
	    [loginWindow orderOut:nil]
	    [app stopModal]
	    [cancelButton setCOSJSTargetFunction:undefined]
	    [loginButton setCOSJSTargetFunction:undefined]
	    [createMarvelButton setCOSJSTargetFunction:undefined]
	    [createHelpButton setCOSJSTargetFunction:undefined]
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
	
	[createMarvelButton setTitle:"Create Marvel account"]
	[createMarvelButton setBezelStyle:NSRoundedBezelStyle]
	[createMarvelButton setCOSJSTargetFunction:function(sender) {
	    var url = [NSURL URLWithString:@"https://marvelapp.com/manage/account/"];
	    if( ![[NSWorkspace sharedWorkspace] openURL:url] ){
	        sketchLog(context,"Failed to open url:" + [url description])
	    }    
	}];
	[createMarvelButton setAction:"callAction:"]
	[bottomActionsView addSubview:createMarvelButton]	
	
	[createHelpButton setBezelStyle:NSHelpButtonBezelStyle]
	[createHelpButton setTitle:nil]
	[createHelpButton setCOSJSTargetFunction:function(sender) {
	    var url = [NSURL URLWithString:@"http://marvel.helpscoutdocs.com/article/62-getting-started-with-the-marvel-sketch-plugin"];
	    if( ![[NSWorkspace sharedWorkspace] openURL:url] ){
	        sketchLog(context,"Failed to open url:" + [url description])
	    }
	}];
	[createHelpButton setAction:"callAction:"]
	[bottomActionsView addSubview:createHelpButton]
	

	[loginWindow setDefaultButtonCell:[loginButton cell]];
	
	[app runModalForWindow:loginWindow]	
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
	[titleField setAlignment:2] 
	[titleField setDrawsBackground:false]
	[titleField setFont:[NSFont boldSystemFontOfSize:13]];
	[titleField setStringValue:"You are already logged in!"]
	[[alreadyLoggedInWindow contentView] addSubview:titleField]
	
	// create prompt text
	var subtitleField = [[NSTextField alloc] initWithFrame:NSMakeRect(0, 140, 540, 30)]
	[subtitleField setEditable:false]
	[subtitleField setBordered:false]
	[subtitleField setAlignment:2] 
	[subtitleField setFont:[NSFont systemFontOfSize:13]];
	[subtitleField setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]];
	[subtitleField setDrawsBackground:false]
	[subtitleField setStringValue:"Logout first if you would like to use a different account."]
	[[alreadyLoggedInWindow contentView] addSubview:subtitleField]
	
	var yPosButtons = 100;
	
	// Buttons

	var logoutButton = [[NSButton alloc] initWithFrame:NSMakeRect(267, yPosButtons, 92, 46)]
	var cancelButton = [[NSButton alloc] initWithFrame:NSMakeRect(181, yPosButtons, 92, 46)]

	[logoutButton setTitle:"Log out"]
	[logoutButton setBezelStyle:NSRoundedBezelStyle]
	[logoutButton setCOSJSTargetFunction:function(sender) {
		deleteActiveTokenFromComputer(context)
	    [alreadyLoggedInWindow orderOut:nil]
	    [app stopModal]
	    [logoutButton setCOSJSTargetFunction:undefined]
	    [cancelButton setCOSJSTargetFunction:undefined]
	    fireLoginWindowWithContext(context)
	}];
	[logoutButton setAction:"callAction:"]
	[[alreadyLoggedInWindow contentView] addSubview:logoutButton]
	
	
	
	[cancelButton setTitle:"Cancel"]
	[cancelButton setBezelStyle:NSRoundedBezelStyle]
	[cancelButton setCOSJSTargetFunction:function(sender) {
	    [alreadyLoggedInWindow  orderOut:nil]
	    [app stopModal]
	    [logoutButton setCOSJSTargetFunction:undefined]
	    [cancelButton setCOSJSTargetFunction:undefined]
	}];
	[cancelButton setAction:"callAction:"]
	[[alreadyLoggedInWindow contentView] addSubview:cancelButton]

	[alreadyLoggedInWindow setDefaultButtonCell:[logoutButton cell]];
	
	[app runModalForWindow:alreadyLoggedInWindow]
}

function fireSendArtboards(projectsArray, all, context){
	
	sketchLog(context,"fireSendArtboards()");
		
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
	var lastUsedProjectId = settings.getLastUsedProject(context)
	var lastUsedProjectIdIndex
	var projectNames = []

	var noProjects = false
	if(projectsArray.length == 0){
		noProjects = true
	}

	sketchLog(context, "Find pre used projects");
	for (i = 0; i < projectsArray.length; ++i) {
			projectNames.push(projectsArray[i].name);

			if(lastUsedProjectId == projectsArray[i].id){
				lastUsedProjectIdIndex = i;
				sketchLog(context, "Last used project index " + lastUsedProjectIdIndex + "and ID is " + projectsArray[i].id)
			}
	}
	[projectPopup addItemsWithObjectValues:projectNames]

	sketchLog(context, "Set last used project")

	if(lastUsedProjectIdIndex){
		[projectPopup selectItemAtIndex:lastUsedProjectIdIndex]
	} else {
		if (noProjects == false){
			sketchLog(context, "There are projects")
			[projectPopup selectItemAtIndex:0]
		}
	}
	[[windowSendArtboards contentView] addSubview:projectPopup]
	var subtitleField = [[NSTextField alloc] initWithFrame:NSMakeRect(74, yDropdowns - 28, 266, 26)]
	[subtitleField setEditable:false]
	[subtitleField setBordered:false]
	[subtitleField setAlignment:2] 
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
		
	var scale = settings.getScaleSettingFromComputer(context);
	
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
	[subtitleField2 setAlignment:2] 
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
	
	// Buttons

	var sendButton = [[NSButton alloc] initWithFrame:NSMakeRect(295, yPosButtons, 134, 46)]
	var cancelButton = [[NSButton alloc] initWithFrame:NSMakeRect(225, yPosButtons, 76, 46)]

	[sendButton setTitle:"Send or update"]
	[sendButton setBezelStyle:NSRoundedBezelStyle]
	[sendButton setCOSJSTargetFunction:function(sender) {

				sketchLog(context,"Send Artboards");
				
				var scaleString = [pluralNounPopup objectValueOfSelectedItem];
				if (!scaleString){
					scaleString = [pluralNounPopup stringValue];
				}

				var export_scale_factor = scaleString.replace(/[^0-9.wWhH]/g,"");

				if(export_scale_factor.indexOf("w") !=-1 || export_scale_factor.indexOf("h") !=-1 || export_scale_factor.indexOf("W") !=-1 || export_scale_factor.indexOf("H") !=-1) {
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
	    			projectId = createProject(selectedProject,context)
	    		}

	    		if (projectId){
		    		if(all == 1){
						exportAllArtboardsAndSendTo(context,projectId, export_scale_factor, context.document)
					} else {
						exportArtboardsAndSendTo(context,projectId, export_scale_factor, context.selection, context.document)
					}
					settings.saveScaleSetting(scaleString,context)
					settings.saveLastUsedProject(projectId,context)
					
					[windowSendArtboards orderOut:nil]
					[app stopModal]
					[cancelButton setCOSJSTargetFunction:undefined]
	    			[sendButton setCOSJSTargetFunction:undefined]

				};

	    
	}];
	[sendButton setAction:"callAction:"]
	[[windowSendArtboards contentView] addSubview:sendButton]

	[cancelButton setTitle:"Cancel"]
	[cancelButton setBezelStyle:NSRoundedBezelStyle]
	[cancelButton setCOSJSTargetFunction:function(sender) {
	    [windowSendArtboards orderOut:nil]
	    [app stopModal]
	    [cancelButton setCOSJSTargetFunction:undefined]
	    [sendButton setCOSJSTargetFunction:undefined]
	}];
	[cancelButton setAction:"callAction:"]
	[[windowSendArtboards contentView] addSubview:cancelButton]

	[windowSendArtboards setDefaultButtonCell:[sendButton cell]];
	
	[app runModalForWindow:windowSendArtboards]}

function fireSupport(context){
	
	sketchLog(context,"fireSupport()");

	var systemVersionDictionary = [NSDictionary dictionaryWithContentsOfFile:@"/System/Library/CoreServices/SystemVersion.plist"]
	var systemVersion = [systemVersionDictionary objectForKey:@"ProductVersion"]
	var pluginVersion = manifest.getPluginVersion(context)
	var sketchVersion = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]
		
	var windowSendArtboards = [[NSWindow alloc] init]
	[windowSendArtboards setFrame:NSMakeRect(0, 0, 485, 333) display:false]
	[windowSendArtboards setBackgroundColor:NSColor.whiteColor()]
	
	var titleField = [[NSTextField alloc] initWithFrame:NSMakeRect(74, 235, 540, 17)]
	[titleField setEditable:false]
	[titleField setBordered:false]
	[titleField setDrawsBackground:false]
	[titleField setFont:[NSFont boldSystemFontOfSize:13]];
	[titleField setStringValue:"Report a bug"]
	[[windowSendArtboards contentView] addSubview:titleField]

	var step1Label = [[NSTextField alloc] initWithFrame:NSMakeRect(74, 200, 540, 17)]
	[step1Label setEditable:false]
	[step1Label setBordered:false]
	[step1Label setDrawsBackground:false]
	[step1Label setFont:[NSFont systemFontOfSize:12]]
	[step1Label setStringValue:"1. First tick this checkbox to turn debug mode on:"]
	[step1Label setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]]
	[[windowSendArtboards contentView] addSubview:step1Label]

	var step2Label = [[NSTextField alloc] initWithFrame:NSMakeRect(74, 172, 540, 17)]
	[step2Label setEditable:false]
	[step2Label setBordered:false]
	[step2Label setDrawsBackground:false]
	[step2Label setFont:[NSFont systemFontOfSize:12]]
	[step2Label setStringValue:"2. Close this window and replicate the bug."]
	[step2Label setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]]
	[[windowSendArtboards contentView] addSubview:step2Label]

	var step3Label = [[NSTextField alloc] initWithFrame:NSMakeRect(74, 144, 540, 17)]
	[step3Label setEditable:false]
	[step3Label setBordered:false]
	[step3Label setDrawsBackground:false]
	[step3Label setFont:[NSFont systemFontOfSize:12]]
	[step3Label setStringValue:"3. Come back to this window and hit send."]
	[step3Label setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]]
	[[windowSendArtboards contentView] addSubview:step3Label]
	
	var bottomActionsView = [[NSView alloc] initWithFrame:NSMakeRect(74, 112, 348, 1)]
	bottomActionsView.setWantsLayer(true)
	[[windowSendArtboards contentView] addSubview:bottomActionsView]	
		
	var borderLayer = [CALayer layer]
	borderLayer.frame = CGRectMake(0, 1, 348, 1)
	[borderLayer setBackgroundColor:CGColorCreateGenericRGB(220/255, 220/255, 220/255, 1.0)]
	[bottomActionsView setLayer:borderLayer];

	var yPosBottomElements = 45;

	var versionLabel = [[NSTextField alloc] initWithFrame:NSMakeRect(74, yPosBottomElements + 5, 266, 26)]
	[versionLabel setEditable:false]
	[versionLabel setBordered:false]
	[versionLabel setAlignment:0] 
	[versionLabel setFont:[NSFont systemFontOfSize:11]]
	[versionLabel setTextColor:[NSColor colorWithCalibratedRed:(93/255) green:(93/255) blue:(93/255) alpha:1]]
	[versionLabel setDrawsBackground:false]
	[versionLabel setStringValue:"OSX " + systemVersion + " Sketch " + sketchVersion + " Plugin " + pluginVersion]
	[[windowSendArtboards contentView] addSubview:versionLabel]
	

	// Buttons

	var sendButton = [[NSButton alloc] initWithFrame:NSMakeRect(353, yPosBottomElements, 76, 46)]
	var cancelButton = [[NSButton alloc] initWithFrame:NSMakeRect(283, yPosBottomElements, 76, 46)]
	var debugCheckbox = [[NSButton alloc] initWithFrame:NSMakeRect (360,195,50,25)]

    [debugCheckbox setButtonType:NSSwitchButton];
    [debugCheckbox setTitle:@""];
    if(settings.getDebugSettingFromComputer(context) == 1){
    	[debugCheckbox setState:NSOnState];
    } else {
    	[debugCheckbox setState:NSOffState];
    }
    [debugCheckbox setCOSJSTargetFunction:function(sender) {

    	var directory = errorLogging.getLogDirectory(context);
        errorLogging.removeFileOrFolder(directory + "main.txt")

		if ([sender state] == NSOnState) {
        	settings.saveDebugSetting(1,context)
    	} else {
        	settings.saveDebugSetting(0,context)
    	}
	    
	}];
    [[windowSendArtboards contentView] addSubview:debugCheckbox]

	[sendButton setTitle:"Send"]
	[sendButton setBezelStyle:NSRoundedBezelStyle]
	[sendButton setCOSJSTargetFunction:function(sender) {

			var logs = errorLogging.fetchLog(context);

			var subject = @"Sketch Plugin Support";
			var body =[NSString stringWithFormat:@"Describe your bug here: \n\n\n\n\n My Logs:\n\n Plugin Version: %@ \n System Version: %@ \n Sketch Version: %@ \n %@", pluginVersion, systemVersion, sketchVersion, logs];
			var to = @"help@marvelapp.com";
			var encodedSubject = [NSString stringWithFormat:@"SUBJECT=%@", [subject stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
			var encodedBody = [NSString stringWithFormat:@"BODY=%@", [body stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
			var encodedTo = [to stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
			var encodedURLString = [NSString stringWithFormat:@"mailto:%@?%@&%@", encodedTo, encodedSubject, encodedBody];
			var mailtoURL = [NSURL URLWithString:encodedURLString];

			[[NSWorkspace sharedWorkspace] openURL:mailtoURL];

			[windowSendArtboards orderOut:nil]
			[app stopModal]
			[sendButton setCOSJSTargetFunction:undefined]
			[cancelButton setCOSJSTargetFunction:undefined]
			[debugCheckbox setCOSJSTargetFunction:undefined]
	}];
	[sendButton setAction:"callAction:"]
	[[windowSendArtboards contentView] addSubview:sendButton]
	
	
	[cancelButton setTitle:"Close"]
	[cancelButton setBezelStyle:NSRoundedBezelStyle]
	[cancelButton setCOSJSTargetFunction:function(sender) {
	    [windowSendArtboards orderOut:nil]
	    [app stopModal]
	    [cancelButton setCOSJSTargetFunction:undefined]
		[debugCheckbox setCOSJSTargetFunction:undefined]
		[sendButton setCOSJSTargetFunction:undefined]
	}];
	[cancelButton setAction:"callAction:"]
	[[windowSendArtboards contentView] addSubview:cancelButton]
	
	[windowSendArtboards setDefaultButtonCell:[sendButton cell]];
	
	[app runModalForWindow:windowSendArtboards]}

function createProject(nameValue, context){

	sketchLog(context,"createProject()")
	
	var token = getActiveTokenFromComputer(context)
	
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
	sketchLog(context,"NSURLConnection createProject()")
	var data = [NSURLConnection sendSynchronousRequest:request returningResponse:response error:error];
	
	if (error == nil && data != nil)
	{	    
	    var errorJson;
		var res = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:errorJson]
		 
		if(res.detail && res.detail == "Invalid token"){
		  	deleteActiveTokenFromComputer(context)
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
			dealWithErrors(context,data)
	}

	return false;}

function loginWithUsernameAndPassword(email, password, context){

			sketchLog(context,"loginWithUsernameAndPassword()");
			getTokenFromServer(email,password, context)
			sketchLog(context,"loginWithUsernameAndPassword() finished");			}

// Api Calls

function getTokenFromServer(email,password, context){
		
		sketchLog(context,"getTokenFromServer()")
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
		sketchLog(context,"Fetch token")
		var data = [NSURLConnection sendSynchronousRequest:request returningResponse:response error:error];
			
		if (error == nil && data != nil){	
		    
					var res = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:nil]
			
				  	var token = res.token
				  	
				  	sketchLog(context,"Return token if exists")  
				  	
				  	if(token){
				  			sketchLog(context,"Token exists and gets returned") 
				  			
				  			[[NSUserDefaults standardUserDefaults] setObject:token forKey:"token"]
							[[NSUserDefaults standardUserDefaults] synchronize]
				  			
				  			[app displayDialog:"Select your artboards, go to plugins > Marvel > Send to Project..." withTitle:"You are now logged in."]
				  			
						} else if(res.password) {
		
								[app displayDialog:"If you sign into Marvel using Dropbox, you'll need to set a password for your account to use Sketch, head to My Profile in Marvel to set one up." withTitle:"Incorrect email or password."]
							
						} else {
								dealWithErrors(context,data)
						}
				  	
						sketchLog(context,"Token does not exist")  		
					  
			    	
			} else {
										
						dealWithErrors(context,data)
						
			}
		
			return false;	}

function getProjectNamesArray(context) {
	
	sketchLog(context,"getProjectNamesArray()")
	
	var token = getActiveTokenFromComputer(context)
	
	var url = [NSURL URLWithString:rootURL + "project/all/"];
	
	var request=[NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60]
	[request setHTTPMethod:"GET"]
	[request setValue:"Sketch" forHTTPHeaderField:"User-Agent"]
	[request setValue:"application/json" forHTTPHeaderField:"Content-Type"]
	[request setValue:"Token " + token forHTTPHeaderField:"Authorization"]
	[request setValue:token forHTTPHeaderField:"HTTP_AUTHORIZATION"]
	
	var response = nil;
	var error = nil;
	sketchLog(context,"NSURLConnection getProjectNamesArray()")
	var data = [NSURLConnection sendSynchronousRequest:request returningResponse:response error:error];
	
	if (error == nil && data != nil)
	{	    
	    var errorJson;
	    		
		var res = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:errorJson]
		
		if(res.detail && res.detail == "Invalid token"){
		  		deleteActiveTokenFromComputer(context)
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
			   	
			   	var projects = [];
			   	return projects;
			   	
			  }
			  
		}
	    	
	} else {
			dealWithErrors(context,data)
	}

	return false;		}

function postFile(context, path, projectId, filename, uuid, width, height) {
			
		sketchLog(context,"postFile()")
			
		var dataImg = [[NSFileManager defaultManager] contentsAtPath:path];
		var token = getActiveTokenFromComputer(context)
		var postLength = [dataImg length].toString()

		var task = NSTask.alloc().init()
		task.setLaunchPath("/usr/bin/curl");
						
		var args = NSArray.arrayWithObjects("-v", "POST", "--header", "Content-Type: multipart/form-data; boundary=0xKhTmLbOuNdArY", "--header", "Authorization: Token " + token, "--header", "HTTP_AUTHORIZATION: " + token, "--header", "User-Agent: Sketch", "--header", "width: " + width, "--header", "height: " + height, "-F", "Content-Disposition: form-data; name=file; filename=" + filename + "; Content-Type=image/png;", "-F", "file=@" + path, rootURL + "content/upload/sketch/" + projectId + "/" + uuid + "/", nil);
				
		task.setArguments(args);

		if(settings.getDebugSettingFromComputer(context) == 1)
		{
			
			sketchLog(context,"Output pipe")
			var outputPipe = [NSPipe pipe];
			[task setStandardOutput:outputPipe];
			task.launch();
			var outputData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
			
			var classNameOfOuput = NSStringFromClass([outputData class]);
			sketchLog(context,"Ouput is " + classNameOfOuput)			

			if(classNameOfOuput != "_NSZeroData"){
				var errorJson;
				sketchLog(context,"Convert to JSON")
				var res = [NSJSONSerialization JSONObjectWithData:outputData options:NSJSONReadingMutableLeaves error:errorJson]

			 	if(errorJson == nil && res != null){
				  	sketchLog(context,"Result: " + res)
				} else {
					sketchLog(context, "JSON convert failed")
				} 
			} else {
				sketchLog(context, "Empty output")
			}

		//postFileNSUrlConnection(context, path, projectId, filename, uuid, width, height)	

		} else {
			task.launch();
		}}

function postFileNSUrlConnection(context, path, projectId, filename, uuid, width, height) {
			
	sketchLog(context,"postFileNSUrlConnection()")
	
	var token = getActiveTokenFromComputer(context)

	var url = [NSURL URLWithString:rootURL + "content/upload/sketch/" + projectId + "/" + uuid + "/"];
	
	sketchLog(context,"url " + url)

	sketchLog(context,"NSMutableURLRequest requestWithURL")

	var request=[NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60]
	[request setHTTPMethod:"POST"]
	[request setValue:"Sketch" forHTTPHeaderField:"User-Agent"]
	[request setValue:"multipart/form-data; boundary=0xKhTmLbOuNdArY" forHTTPHeaderField:"Content-Type"]
	[request setValue:"Token " + token forHTTPHeaderField:"Authorization"]
	[request setValue:width.toString() forHTTPHeaderField:"width"]
	[request setValue:height.toString() forHTTPHeaderField:"height"]
	[request setValue:token forHTTPHeaderField:"HTTP_AUTHORIZATION"]
	
	sketchLog(context,"tempPostData alloc")

	var tempPostData = [NSMutableData data]; 
	var filedata = [[NSFileManager defaultManager] contentsAtPath:path];
    [tempPostData appendData:[[NSString stringWithFormat:@"Content-Disposition: form-data; name=file; filename=%@; Content-Type=image/png; file=%@", filename, filedata] dataUsingEncoding:NSUTF8StringEncoding]];
	[request setHTTPBody:tempPostData]

	var response = nil;
	var error = nil;
	sketchLog(context,"NSURLConnection postFileNSUrlConnection()")
	var data = [NSURLConnection sendSynchronousRequest:request returningResponse:response error:error];
	
	if (error == nil && data != nil)
	{	    

		sketchLog(context,"no error or data not nil")

	    var errorJson;

	    if(data.length > 0){

	    	sketchLog(context,"rdata bigger than nil")

		var res = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:errorJson]
		
		if(res){ 
			sketchLog(context,"result")
			if(res.detail && res.detail == "Invalid token"){
			  	//deleteActiveTokenFromComputer(context)
			  	fireError("Your token is not valid anymore, please login again.","After you are logged in again please try again.")
			  	return false
			} else if (res.detail && res.detail){
			  	fireError(res.detail)
			  	return false
			} else if ([res valueForKey:@"id"]) {
				//var itemId = [NSString stringWithFormat:@"%@", [[res valueForKey:@"id"] intValue]];
			   	return itemId
			}
		} else {
			sketchLog(context,"no result")
		}
	} else {
		sketchLog(context,"no result2")
	}
	    	
	} else {
		sketchLog(context,"error")
			dealWithErrors(context,data)
	}

	return false;}

// Helpers

function dealWithErrors(context,data){

		sketchLog(context,"Received an error from the server")
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
				webViewWhichShowsResults(context)
		}

		sketchLog(context,"Return data " + stringRead)		}

function webViewWhichShowsResults(context){
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
		    [app stopModal]
		    [cancelButton setCOSJSTargetFunction:undefined]
		}];
		[cancelButton setAction:"callAction:"]
		[[webViewWindow contentView] addSubview:cancelButton]
		
		[webViewWindow setDefaultButtonCell:[cancelButton cell]];
			
		[app runModalForWindow:webViewWindow ]}

function exportArtboardsAndSendTo(context, projectId, scale, selection, document) {
		
	sketchLog(context,"exportArtboardsAndSendTo() : project with id " + projectId + " and size " + scale)

				var loop = [selection objectEnumerator];
				var existing_artboards_names = [];
										
				while (artboard = [loop nextObject]) {
				  	
				  	if (artboard.className() == "MSArtboardGroup") {
				  	
				  	var arrayCount = existing_artboards_names.length;
				  	for (var i = 0; i < arrayCount; i++) {
				  	
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
		
	sendArtboardOnArray(context, selection, scale, projectId, document)}

function exportAllArtboardsAndSendTo(context, projectId, scale, document) {

		sketchLog(context,"exportAllArtboardsAndSendTo() : project with id " + projectId + " and size " + scale)
					
					var artboards = [[document currentPage] artboards];
					var loop = [artboards objectEnumerator];
					var existing_artboards_names = [];
											
					while (artboard = [loop nextObject]) {
					  	
					  	var arrayCount = existing_artboards_names.length;
					  	for (var i = 0; i < arrayCount; i++) {
					  	
					  			if(existing_artboards_names[i] == [artboard name]){
					  				
					  				fireError("You have more than one artboard with the name '" + [artboard name]  + "', please change one of these artboard names.","Please rename one of these artboards in order to solve this issue.")
					  				return false
					  				  
					  			} 
					  	}
					  	
					  	existing_artboards_names.push([artboard name]); 					  	 					  	 
				
					}
			
					sendArtboardOnArray(context, artboards, scale, projectId, document)				}

function sendArtboardOnArray(context, array, scale, projectId, document){

		var loopFinal = [array objectEnumerator];
		
		while (item = [loopFinal nextObject]) {
				
				if (item.className() == "MSArtboardGroup") {
				
					var filename = mini.escapedFileName([item name]) + ".png"
					
					sketchLog(context,"Artboard found with name " + filename + " and object id " + item.objectID())
					var path = NSTemporaryDirectory() + filename
					var version = copy_layer_with_factor(item, scale)

					[document saveArtboardOrSlice:version toFile:path];
					
					postFile(context, path, projectId, filename,item.objectID(), [[item frame] width], [[item frame] height])

				}
		}}

function copy_layer_with_factor(original_slice, factor){
    var copy = [original_slice duplicate];
    var frame = [copy frame];

    var rect = [MSSliceTrimming trimmedRectForSlice:copy],
    slice = [MSExportRequest requestWithRect:rect scale:factor];

    [copy removeFromParent];
    return slice;}

function fireError(title,text){
		[app displayDialog:text withTitle:title]
}

function sketchLog(context,string){
	if(settings.getDebugSettingFromComputer(context) == 1)
	{
		NSLog(string)
		errorLogging.write(context,string)
	}}