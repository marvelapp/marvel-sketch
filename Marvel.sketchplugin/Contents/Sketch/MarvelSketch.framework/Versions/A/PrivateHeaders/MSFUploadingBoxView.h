//
//  UploadingBoxViewController.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 15/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface MSFUploadingBoxView : NSView

@property (nonatomic, copy) void (^hitCancel)(void);

@property (nonatomic, strong) IBOutlet NSProgressIndicator *progressIndicator;
@property (nonatomic, strong) IBOutlet NSTextField *progressLabel;
@property (nonatomic, strong) IBOutlet NSView *backgroundView;
@property (nonatomic, strong) IBOutlet NSButton *cancelButton;
@property (nonatomic, strong) NSView *nibView;

- (void)setProgressToFile:(int)current of:(int)of;
- (void)hideAnimated:(BOOL)animated;

@end
