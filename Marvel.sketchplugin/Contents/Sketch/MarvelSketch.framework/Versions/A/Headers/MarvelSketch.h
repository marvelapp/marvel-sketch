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

+ (id)sharedManager;
- (void)remove;
- (void)add;
- (BOOL)userWantsMarvelHidden;
- (void)toggleVisibility;

@end
