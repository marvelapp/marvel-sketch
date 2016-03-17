//
//  BVView.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 16/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "MSFCollectionViewCell.h"
#import "MSFScaleToFillNSImageView.h"

@interface MSFPickerCellView : MSFCollectionViewCell
@property (strong) NSView *mainView;
@property (strong) MSFScaleToFillNSImageView *projectImage;
@property (strong) NSTextField *nameLabel;
@property (strong) NSImageView *tickImage;

@end

