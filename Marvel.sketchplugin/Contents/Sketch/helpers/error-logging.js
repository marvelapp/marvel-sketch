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

var errorLogging = {

	"createFolderAtPath": function(context, pathString){
        var fileManager = [NSFileManager defaultManager]
    	if([fileManager fileExistsAtPath:pathString]){
    		return true
    	} else {
    		return [fileManager createDirectoryAtPath:pathString withIntermediateDirectories:true attributes:nil error:nil]
    	}
    },

    "readTextFromFile": function(context,filePath){
        var fileManager = [NSFileManager defaultManager]
	    if([fileManager fileExistsAtPath:filePath]) {
	    	var log = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
	    	if(log){
	    		return log
	    	} 
	    	NSLog("Could not get log file data");
	    	return false
	    }
	    return false
    },

    "removeFileOrFolder": function(filePath){
    	[[NSFileManager defaultManager] removeItemAtPath:filePath error:nil];
    },

    "writeTextToFile": function(context, text, filePath){
    	var aFileHandle
		var aFile
		var t

		var currentTime = errorLogging.getCurrentTime();
		t = [NSString stringWithFormat:@"%@ : %@\r\n", currentTime, text],
		aFile = [NSString stringWithFormat:@"%@", filePath]

		aFileHandle = [NSFileHandle fileHandleForWritingAtPath:aFile]
			
		if(aFileHandle){
			[aFileHandle truncateFileAtOffset:[aFileHandle seekToEndOfFile]]
			[aFileHandle writeData:[t dataUsingEncoding:NSUTF8StringEncoding]]
		} else {
			[t writeToFile:aFile atomically:true encoding:NSUTF8StringEncoding error:nil]
		}
    },

    "write": function(context,text){
		if(!context){
			if(text){
				NSLog("No context was provided for log : " + text)
			} else {
				NSLog("No context and text was provided for log")
			}

			return false
		}

		if(!text){
			NSLog("No text was provided for log")
			return false
		}

		var logsDirectory = errorLogging.getLogDirectory(context)

		if(errorLogging.createFolderAtPath(context, logsDirectory)){
			errorLogging.writeTextToFile(context, text, logsDirectory  + "main.txt")
		}
    },

    "getLogDirectory": function(context){
    	var scriptFullPath = context.scriptPath
		var directoryPlugin = [scriptFullPath stringByDeletingLastPathComponent]
		var logsDirectory = directoryPlugin + "/logs/"

		return logsDirectory
	},

	"fetchLog": function(context){

		var logsDirectory = errorLogging.getLogDirectory(context) + "main.txt"

		var log = errorLogging.readTextFromFile(context,logsDirectory)

		if(log){
			return log
		}

		return false

	},

	"getCurrentTime": function(){
		var DateFormatter=[[NSDateFormatter alloc] init]
		[DateFormatter setDateFormat:@"yyyy-MM-dd hh:mm:ss"]  
		return [DateFormatter stringFromDate:[NSDate date]]
	}		

}