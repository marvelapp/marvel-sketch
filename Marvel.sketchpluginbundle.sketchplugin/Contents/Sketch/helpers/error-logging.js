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

function createFolderAtPath(context, pathString) {
    	var fileManager = [NSFileManager defaultManager]
    	if([fileManager fileExistsAtPath:pathString]){
    		return true
    	} else {
    		return [fileManager createDirectoryAtPath:pathString withIntermediateDirectories:true attributes:nil error:nil]
    	}

}

function readTextFromFile(context,filePath) {
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
}

function removeFileOrFolder(filePath) {
    [[NSFileManager defaultManager] removeItemAtPath:filePath error:nil];
}

function writeTextToFile(context, text, filePath) {

    	var aFileHandle
		var aFile
		var t

		var currentTime = getCurrentTime();
		t = [NSString stringWithFormat:@"%@ : %@\r\n", currentTime, text],
		aFile = [NSString stringWithFormat:@"%@", filePath]

		aFileHandle = [NSFileHandle fileHandleForWritingAtPath:aFile]
		
		if(aFileHandle){
			[aFileHandle truncateFileAtOffset:[aFileHandle seekToEndOfFile]]
			[aFileHandle writeData:[t dataUsingEncoding:NSUTF8StringEncoding]]
		} else {
			[t writeToFile:aFile atomically:true encoding:NSUTF8StringEncoding error:nil]
		}

}

function writeLog(context,text){

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

		var logsDirectory = getLogDirectory(context)

		if(createFolderAtPath(context, logsDirectory)){
			writeTextToFile(context, text, logsDirectory  + "main.txt")
		}

}

function getLogDirectory(context){

		var scriptFullPath = context.scriptPath
		var directoryPlugin = [scriptFullPath stringByDeletingLastPathComponent]
		var logsDirectory = directoryPlugin + "/logs/"

		return logsDirectory

}

function fetchLog(context){

		var logsDirectory = getLogDirectory(context) + "main.txt"

		var log = readTextFromFile(context,logsDirectory)

		if(log){
			return log
		}

		return false
}


function getCurrentTime(){
		var DateFormatter=[[NSDateFormatter alloc] init]
		[DateFormatter setDateFormat:@"yyyy-MM-dd hh:mm:ss"]  
		return [DateFormatter stringFromDate:[NSDate date]]
}



