#import <Foundation/Foundation.h>


#if TARGET_OS_IPHONE || TARGET_IPHONE_SIMULATOR
#import <UIKit/UIKit.h>
#define DPImageType UIImage
#elif TARGET_OS_MAC
#import <Cocoa/Cocoa.h>
#define DPImageType NSImage
#endif


typedef void(^DPImageDownloaderCompleteBlock)(DPImageType* image); // nil is failed. UIImage or NSImage


@interface MSFDPImageDownloader : NSObject

+ (instancetype)sharedInstance;

- (DPImageType*)getImageWithURL:(NSString*)url
               useOnMemoryCache:(BOOL)useOnMemoryCache
                       lifeTime:(NSUInteger)lifeTime
                     completion:(DPImageDownloaderCompleteBlock)completion;

-  (DPImageType*)getImageWithURL:(NSString*)url
                useOnMemoryCache:(BOOL)useOnMemoryCache
                        lifeTime:(NSUInteger)lifeTime
                 completionQueue:(dispatch_queue_t)queue
                      completion:(DPImageDownloaderCompleteBlock)completion;

@end
