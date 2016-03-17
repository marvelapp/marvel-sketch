//
//  ServerCalls.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 10/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Foundation/Foundation.h>
#define API_URL @"https://marvelapp.com/api/"

@interface MSFCalls : NSObject

+ (void)getProjects:(void (^)(NSHTTPURLResponse* response, NSDictionary* json))completionBlock;
+ (void)getTokenForEmail:(NSString*)email password:(NSString*)password completion:(void (^)(NSHTTPURLResponse* response, NSDictionary* json))completionBlock;
+ (void)uploadImageAtPath:(NSString*)path projectId:(int)projectId filename:(NSString*)filename uuid:(NSString*)uuid width:(CGFloat)width height:(CGFloat)height newUUID:(NSString*)newUUID completion:(void (^)(NSHTTPURLResponse *, NSDictionary *, NSError *))completionBlock;
+ (void)getProjectDetailsById:(int)idProject completion:(void (^)(NSHTTPURLResponse *, NSDictionary *, NSError *))completionBlock;

@end
