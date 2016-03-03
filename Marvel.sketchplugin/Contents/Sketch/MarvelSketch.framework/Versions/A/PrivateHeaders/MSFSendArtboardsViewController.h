//
//  SendArtboardsViewController.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 10/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "MSFArtboardsWindowController.h"

@interface MSFSendArtboardsViewController : NSViewController

@property (nonatomic, copy) void (^hitCancel)(void);
@property (nonatomic, copy) void (^hitSend)(void);

@property (nonatomic, strong) IBOutlet NSComboBox *projectsBox;
@property (nonatomic, strong) IBOutlet NSComboBox *scaleBox;
@property (nonatomic, strong) IBOutlet NSButton *sendButton;
@property (nonatomic, weak)    IBOutlet NSImageView *imageView;
@property (nonatomic, weak) IBOutlet NSView *bottomLine;

@property (nonatomic, strong) MSDocument *document;
@property (nonatomic, strong) NSMutableArray *projectsArray;
@property (nonatomic, assign) ActionType type;

@end
