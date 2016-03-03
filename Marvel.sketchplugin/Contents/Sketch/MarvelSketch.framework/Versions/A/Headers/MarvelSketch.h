//
//  HelloWorld.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 09/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MSFArtboardsWindowController.h"
#import "MSFMenuManager.h"
#import "MSFUploadManager.h"
#import "MSFUploadingBoxView.h"

@import AppKit;

@interface MarvelSketch : NSObject

@property (strong,nonatomic) MSFArtboardsWindowController *artboardsWindowController;
@property (strong,nonatomic) MSFMenuManager *menuManager;
@property (strong,nonatomic) MSFUploadManager *uploadManager;

@property (strong,nonatomic) NSWindow *documentWindow;

+ (id)sharedManager;
- (void)remove;
- (void)add;
- (void)setCurrentDocumentWindow;
- (BOOL)userWantsMarvelHidden;
- (void)toggleVisibility;

@end
