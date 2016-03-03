//
//  ArtboardsWindowController.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 12/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "MSDocument.h"

@interface MSFArtboardsWindowController : NSWindowController

typedef NS_ENUM(NSUInteger, ActionType) {
    All,
    Selected
};

@property (nonatomic, assign) ActionType type;
@property (nonatomic, strong) MSDocument *currentDocument;

@end
