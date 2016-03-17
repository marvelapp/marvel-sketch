//
//  ReplacePickerViewController.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 15/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "MSFCollectionView.h"
#import "MSFScaleToFillNSImageView.h"

@interface MSFReplacePickerViewController : NSViewController <NSComboBoxDelegate,JNWCollectionViewDataSource,JNWCollectionViewGridLayoutDelegate>

@property (nonatomic, copy) void (^closeWindow)(void);

@property(strong) IBOutlet MSFCollectionView *imageCollectionView;
@property(strong) MSFCollectionViewGridLayout *gridLayout;
@property(strong) IBOutlet NSProgressIndicator *progressIndicator;

@property(weak) IBOutlet NSButton *replaceButton;
@property(weak) IBOutlet NSComboBox *projectsBox;
@property(weak) IBOutlet NSView *leftView;
@property(weak) IBOutlet NSView *leftViewLineView;
@property(weak) IBOutlet MSFScaleToFillNSImageView *selectedArtboardImageView;

@property (strong) NSDictionary *detailsDictionary;
@property (strong) NSMutableArray *projectsArray;

@property (nonatomic, strong) MSDocument *document;

@end
