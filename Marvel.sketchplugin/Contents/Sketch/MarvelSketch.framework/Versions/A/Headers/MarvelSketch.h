//
//  HelloWorld.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 09/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ArtboardsWindowController.h"
#import "MenuManager.h"
#import "UploadManager.h"
#import "UploadingBoxView.h"

@import AppKit;

@interface MarvelSketch : NSObject

@property (strong,nonatomic) ArtboardsWindowController *artboardsWindowController;
@property (strong,nonatomic) MenuManager *menuManager;
@property (strong,nonatomic) UploadManager *uploadManager;

@property (strong,nonatomic) UploadingBoxView *uploadBoxView;


@property (strong,nonatomic) NSWindow *documentWindow;

+ (id)sharedManager;

@end
