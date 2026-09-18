#import <Foundation/Foundation.h>
#import <ReactCommon/RCTTurboModule.h>
#import <MyTurboModules/MyTurboModules.h>

NS_ASSUME_NONNULL_BEGIN

@interface NativeToast : NSObject <NativeToastSpec, RCTModuleProvider>

@end

NS_ASSUME_NONNULL_END
