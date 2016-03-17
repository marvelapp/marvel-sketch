//
//  UploadManager.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 15/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "MSFUploadingBoxView.h"

@interface MSFUploadManager : NSView

@property (nonatomic, strong) MSFUploadingBoxView *uploadBoxView;
@property (nonatomic, strong) NSOperationQueue *operationQueue;
@property (nonatomic, assign) int totalArtboards;
@property (nonatomic, assign) int currentArtboard;

- (void)uploadArtboardsArray:(NSArray*)array scale:(double)scale projectId:(int)projectId onDocument:(MSDocument*)document;
- (void)replaceArtboardWithUUID:(NSString*)replaceArtboardWithUUID withArtboard:(MSArtboardGroup*)artboard scale:(double)scale projectId:(int)projectId onDocument:(MSDocument*)document;
+ (NSString*)imagesTemporaryDirectory;

@end
