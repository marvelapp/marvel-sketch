/*The MIT License (MIT)

Copyright (c) 2016 Marvel App

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

var scriptPath = context.scriptPath;
var pluginRoot = [scriptPath stringByDeletingLastPathComponent];

if (NSClassFromString('MarvelSketch') == null) {
<<<<<<< HEAD:Marvel.sketchplugin/Contents/Sketch/load.js
	 var mocha = [Mocha sharedRuntime];
	 [mocha loadFrameworkWithName:'MarvelSketch' inDirectory:pluginRoot];
	 [MarvelSketch sharedManager];
=======
    var mocha = [Mocha sharedRuntime];
    if(![mocha loadFrameworkWithName:'MarvelSketch' inDirectory:pluginRoot]){
        NSLog("MarvelSketch could not be loaded")
        return
    }
    [MarvelSketch sharedManager];
>>>>>>> development:Marvel.sketchplugin/Contents/Sketch/load.js
} 

if([[MarvelSketch sharedManager] userWantsMarvelHidden]){
		[[MarvelSketch sharedManager] remove];
} else {
		[[MarvelSketch sharedManager] add];
}