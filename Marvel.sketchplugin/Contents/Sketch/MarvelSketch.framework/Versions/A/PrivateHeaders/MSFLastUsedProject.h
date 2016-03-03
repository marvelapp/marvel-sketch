//
//  LastUsedProject.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 14/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MSFLastUsedProject : NSObject

+ (NSDictionary*)get;
+ (void)save:(NSDictionary*)lastUsedProjectData;
+ (NSString*)findLastUsedProjectAndReturnName:(NSArray*)finalArray;

@end
