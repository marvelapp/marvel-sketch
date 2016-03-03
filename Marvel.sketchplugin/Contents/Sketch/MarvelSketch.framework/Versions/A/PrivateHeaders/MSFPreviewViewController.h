//
//  PreviewViewController.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 18/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>
@import WebKit;

@interface MSFPreviewViewController : NSViewController

@property (nonatomic, copy) void (^hitClose)(void);

@property (nonatomic, strong) IBOutlet WebView *webView;

@end
