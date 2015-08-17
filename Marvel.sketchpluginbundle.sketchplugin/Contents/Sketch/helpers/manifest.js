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

var manifest = {

    "getManifestFilePath": function(context){
        var scriptFullPath = context.scriptPath
        var directoryPlugin = [scriptFullPath stringByDeletingLastPathComponent]
        var manifestFile = directoryPlugin + "/manifest.json"

        return manifestFile
    },

    "readManifestFile": function(context){
        var filePath = manifest.getManifestFilePath(context)
        var fileManager = [NSFileManager defaultManager]
        if([fileManager fileExistsAtPath:filePath]) {
            var fetchData = [NSData dataWithContentsOfFile:filePath]  
            if(fetchData){
                var error;
                var res = [NSJSONSerialization JSONObjectWithData:fetchData options:NSJSONReadingMutableLeaves error:error]
                
                if(error == nil && res != nil){
                    return res
                } else {
                    NSLog("error " + error);
                    return false
                }
                
            } 
            NSLog("Could not get manifest file data");
            return false
        }
        return false
    },

    "getPluginVersion": function(context){
        var json = manifest.readManifestFile(context);

        if(json){
            var version = json.version.toString()
            return version
        }

        NSLog("Could not get version number");
        return false
    }

}