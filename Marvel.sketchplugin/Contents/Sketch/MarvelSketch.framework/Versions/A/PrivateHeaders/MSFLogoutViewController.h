//
//  LogoutViewController.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 10/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface MSFLogoutViewController : NSViewController

@property (nonatomic, copy) void (^hitCancel)(void);
@property (nonatomic, copy) void (^logoutSucces)(void);


@end
