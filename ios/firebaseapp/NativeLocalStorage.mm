#import "NativeLocalStorage.h"

@implementation NativeLocalStorage

RCT_EXPORT_MODULE(NativeLocalStorage)

- (void)setItem:(NSString *)key value:(NSString *)value
{
  [[NSUserDefaults standardUserDefaults] setObject:value forKey:key];
  [[NSUserDefaults standardUserDefaults] synchronize];
}

- (NSString *)getItem:(NSString *)key
{
  return [[NSUserDefaults standardUserDefaults] stringForKey:key];
}

- (void)removeItem:(NSString *)key
{
  [[NSUserDefaults standardUserDefaults] removeObjectForKey:key];
  [[NSUserDefaults standardUserDefaults] synchronize];
}

- (void)clear
{
  NSDictionary *dict = [[NSUserDefaults standardUserDefaults] dictionaryRepresentation];
  for (id key in dict) {
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:key];
  }
  [[NSUserDefaults standardUserDefaults] synchronize];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeLocalStorageSpecJSI>(params);
}

@end
