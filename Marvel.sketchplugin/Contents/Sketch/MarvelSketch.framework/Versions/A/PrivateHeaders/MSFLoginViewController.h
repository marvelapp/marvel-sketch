//
//  LoginViewController.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 10/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface MSFLoginViewController : NSViewController

@property (nonatomic, copy) void (^hitCancel)(void);
@property (nonatomic, copy) void (^loginSucces)(void);

@property (weak,nonatomic) IBOutlet NSView *bottomView;
@property (weak,nonatomic) IBOutlet NSView *bottomViewLine;
@property (weak,nonatomic) IBOutlet NSView *errorView;
@property (weak,nonatomic) IBOutlet NSTextField *errorLabel;
@property (weak,nonatomic) IBOutlet NSTextField *emailField;
@property (weak,nonatomic) IBOutlet NSSecureTextField *passwordField;
@property (weak,nonatomic) IBOutlet NSLayoutConstraint *errorViewTopConstraint;
@property (weak,nonatomic) NSView *loader;

@end
