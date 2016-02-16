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


@import 'api.js'

var updatesChecker = {

	"getNewestVersionNumber": function(context){
       
       	sketchLog(context,"updatesChecker.getNewestVersionNumber()")
       	       	
       	var url = [NSURL URLWithString:"https://raw.githubusercontent.com/marvelapp/marvel-sketch/master/Marvel.sketchplugin/Contents/Sketch/manifest.json"];

       	var request=[NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:30]
       	[request setHTTPMethod:"GET"]
       	
       	var response = nil;
       	var error = nil;
       	sketchLog(context,"NSURLConnection updatesChecker.getNewestVersionNumber()")
       	var data = [NSURLConnection sendSynchronousRequest:request returningResponse:response error:error];
       	
       	if (error == nil && data != nil)
       	{	    
       	  var errorJson;
       	    		
       		var res = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:errorJson]
       		
       		if(errorJson == nil){
            if(res.version){
       			  return res.version
            }
       		} else {
       			sketchLog(context,"NSURLConnection updatesChecker.getNewestVersionNumber() Convert to JSON failed")
       			return false
       		}

       	} 

       	sketchLog(context,"updatesChecker.getNewestVersionNumber() failed")
        [app displayDialog:"Try again later..." withTitle:"Could not contact GitHub properly."]
       	return false

    }

       
}

var onRun = function(context) {
	
	var newestVersion = updatesChecker.getNewestVersionNumber(context)
	var pluginVersion = manifest.getPluginVersion(context)

  if (newestVersion != pluginVersion) {
    [app displayDialog:"Sketch " + newestVersion + " is currently the newest version available." withTitle:"You’re up-to-date!"]
  } else {
    var alert = [[NSAlert alloc] init]
    [alert setMessageText:"A new version of Marvel Sketch is available."]
    [alert setInformativeText:"Download the new plugin on GitHub"]
    [alert addButtonWithTitle:'Close']
    [alert addButtonWithTitle:'Download our update']
  }  

  var responseCode = [alert runModal]
  if(responseCode == "1001"){
      var url = [NSURL URLWithString:@"https://github.com/marvelapp/marvel-sketch"];
      if( ![[NSWorkspace sharedWorkspace] openURL:url] ){
          sketchLog(context,"Failed to open url:" + [url description])
      } 
  }


}