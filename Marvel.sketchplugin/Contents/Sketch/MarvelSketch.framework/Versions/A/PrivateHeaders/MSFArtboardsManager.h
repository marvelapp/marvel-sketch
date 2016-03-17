//
//  ArtboardsManager.h
//  MarvelFramework
//
//  Created by Maxime De Greve on 13/02/2016.
//  Copyright © 2016 Marvel Prototyping. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MSFArtboardsManager : NSObject

+(NSMutableArray*)filterToOnlyArtboards:(NSArray*)array;
+(MSExportRequest*)copyLayerWithFactor:(MSArtboardGroup*)artboard factor:(double)factor;
+(NSArray*)getAllArtboardsOnPageForDocument:(MSDocument*)document;
+(NSArray*)getSelectedArtboardsForDocument:(MSDocument*)document;

@end
