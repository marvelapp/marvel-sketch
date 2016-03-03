//
//  BVView.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 16/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "MSFCollectionViewCell.h"
#import "MSFKPCScaleToFillNSImageView.h"

@interface MSFPickerCellView : MSFCollectionViewCell
@property (weak) NSView *nibView;
@property (strong) IBOutlet MSFKPCScaleToFillNSImageView *imageView;
@property (strong) IBOutlet NSTextField *nameLabel;

@end

