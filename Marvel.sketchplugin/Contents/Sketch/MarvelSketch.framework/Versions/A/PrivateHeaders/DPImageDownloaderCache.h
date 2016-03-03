#import "MSFDPImageDownloader.h"


@interface DPImageDownloaderCache : NSObject

+ (instancetype)cacheWithData:(NSData*)data key:(NSString*)key; // returns nil if data is nil
+ (instancetype)cacheFromStorageWithKey:(NSString*)key;         // returns nil if no data on storage

@property (nonatomic, readonly) DPImageType* image;

- (void)saveFile;
- (void)deleteFile;
- (BOOL)isExpiredWith:(NSTimeInterval)time lifeTime:(NSTimeInterval)lifeTime;

@end
