//
//  FrameProperties.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 16/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum : NSUInteger {
    IPHONE_4,
    IPHONE_4_LANDSCAPE,
    IPHONE_5S,
    IPHONE_5S_LANDSCAPE,
    IPHONE_5C,
    IPHONE_5C_LANDSCAPE,
    IPHONE_6,
    IPHONE_6_LANDSCAPE,
    IPHONE_6_PLUS,
    IPHONE_6_PLUS_LANDSCAPE,
    NEXUS_5,
    NEXUS_5_LANDSCAPE,
    GALAXY_5,
    GALAXY_5_LANDSCAPE,
    LUMIA_920,
    LUMIA_920_LANDSCAPE,
    HTC_1,
    HTC_1_LANDSCAPE,
    IPAD,
    IPAD_LANDSCAPE,
    ICON,
    WATCH38,
    WATCH42,
    DESKTOP
} FRAME;


@interface MSFFrameProperties : NSObject

+ (FRAME) getFrameProperty:(NSArray*)properties;
+ (NSString*)frameTypeToString:(FRAME)frameType;

@end
