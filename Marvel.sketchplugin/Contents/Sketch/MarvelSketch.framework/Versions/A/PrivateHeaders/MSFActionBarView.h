//
//  ActionBarView.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 19/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface MSFActionBarView : NSView

@property (nonatomic, strong) NSView *nibView;
@property (nonatomic, strong) NSView *bottomLineView;
@property (nonatomic, strong) IBOutlet NSButton *allButton;

@end
