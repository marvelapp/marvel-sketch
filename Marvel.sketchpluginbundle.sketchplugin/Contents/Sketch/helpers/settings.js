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

var settings = {

	"getDebugSettingFromComputer": function(context){
		var debug = [[NSUserDefaults standardUserDefaults] objectForKey:"debug"]
		if (debug) {
			return debug
		} else {
			return 0
		}
	},

	"saveDebugSetting": function(debugValue,context){
		[[NSUserDefaults standardUserDefaults] setObject:debugValue forKey:"debug"]
		[[NSUserDefaults standardUserDefaults] synchronize]
	},

	"getScaleSettingFromComputer": function(context){
		var scale = [[NSUserDefaults standardUserDefaults] objectForKey:"scale"];
		if (scale) {
			return scale;
		} else {
			return false;
		}
	},

	"getLastUsedProject": function(context){
		var last = [[NSUserDefaults standardUserDefaults] objectForKey:"last used project"];
		if (last) {
			return last;
		} else {
			return false;
		}
	},

	"saveLastUsedProject": function(projectId,context){
		[[NSUserDefaults standardUserDefaults] setObject:projectId forKey:"last used project"]
		[[NSUserDefaults standardUserDefaults] synchronize]
	},

	"saveScaleSetting": function(scaleValue,context){
		[[NSUserDefaults standardUserDefaults] setObject:scaleValue forKey:"scale"]
		[[NSUserDefaults standardUserDefaults] synchronize]
	}

}