//
//  LastUsedScale.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 14/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MSFLastUsedScale : NSObject

+ (NSString*)get;
+ (void)save:(NSString*)lastUsedScale;

@end
