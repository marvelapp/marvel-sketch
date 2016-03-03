//
//  MenuManager.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 12/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MSFAuthenticationWindowController.h"
#import "MSFArtboardsWindowController.h"
#import "MSFReplaceWindowController.h"
#import "MSFModalOverlay.h"

@interface MSFMenuManager : NSObject <NSMenuDelegate,JMModalOverlayDelegate>

@property (strong,nonatomic) MSFAuthenticationWindowController *authenticationWindowController;
@property (strong,nonatomic) MSFArtboardsWindowController *artboardsWindowController;
@property (strong,nonatomic) MSFReplaceWindowController *replaceWindowController;
@property (strong,nonatomic) NSMenu *marvelMenu;
@property (strong,nonatomic) MSFModalOverlay *viewPrototypeOverlay;

- (void)remove;
- (void)showReplaceWindow:(id)sender;
- (void)showAuthenticationWindow:(id)sender;
- (void)sendArtboards:(id)sender;
- (void)sendAllArtboards:(id)sender;

@end
