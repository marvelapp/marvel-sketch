//
//  Token.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 11/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MSFToken : NSObject

+ (NSString*)get;
+ (void)remove;
+ (void)save:(NSString*)token;

@end
