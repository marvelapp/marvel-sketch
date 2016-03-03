//
//  ReplacePickerViewController.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 15/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "MSFCollectionView.h"

@interface MSFReplacePickerViewController : NSViewController <NSComboBoxDelegate,JNWCollectionViewDataSource,JNWCollectionViewGridLayoutDelegate>

@property (nonatomic, copy) void (^hitCancel)(void);

@property(strong) IBOutlet MSFCollectionView *imageCollectionView;
@property(strong) MSFCollectionViewGridLayout *gridLayout;

@property(weak) IBOutlet NSButton *replaceButton;
@property(weak) IBOutlet NSComboBox *projectsBox;
@property(weak) IBOutlet NSView *bottomBar;
@property(weak) IBOutlet NSView *bottomBarLine;

@property (strong) NSMutableArray *thumbsArray;
@property (strong) NSMutableArray *projectsArray;

@end
