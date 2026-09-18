#import "NativeAadhaarFaceAuth.h"

@implementation NativeAadhaarFaceAuth

RCT_EXPORT_MODULE(NativeAadhaarFaceAuth)

- (void)isFaceRDAppInstalled:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject
{
  // Aadhaar FaceRD is an Android-only service
  resolve(@(NO));
}

- (void)isUsbDebuggingEnabled:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
  resolve(@(NO));
}

- (void)openFaceRDPlayStore:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject
{
  resolve(@(NO));
}

- (void)captureFace:(NSDictionary *)options
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
  NSDictionary *result = @{
    @"isSuccess": @(NO),
    @"errCode": @"UNSUPPORTED_PLATFORM",
    @"errInfo": @"Aadhaar FaceRD Authentication is only supported on Android devices.",
    @"rawXml": @""
  };
  resolve(result);
}

- (void)localFaceMatch:(NSDictionary *)options
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject
{
  NSDictionary *result = @{
    @"isSuccess": @(NO),
    @"errCode": @"UNSUPPORTED_PLATFORM",
    @"errInfo": @"Aadhaar Local Face Match is only supported on Android devices.",
    @"rawXml": @""
  };
  resolve(result);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAadhaarFaceAuthSpecJSI>(params);
}

@end
