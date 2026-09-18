#import "NativeToast.h"
#import <UIKit/UIKit.h>

@implementation NativeToast

RCT_EXPORT_MODULE(NativeToast)

- (void)NativeToast:(NSString *)message
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIWindow *window = nil;
    if (@available(iOS 13.0, *)) {
      NSSet *connectedScenes = [UIApplication sharedApplication].connectedScenes;
      for (UIScene *scene in connectedScenes) {
        if ([scene isKindOfClass:[UIWindowScene class]] && scene.activationState == UISceneActivationStateForegroundActive) {
          UIWindowScene *windowScene = (UIWindowScene *)scene;
          for (UIWindow *w in windowScene.windows) {
            if (w.isKeyWindow) {
              window = w;
              break;
            }
          }
        }
      }
    }
    if (!window) {
      window = [UIApplication sharedApplication].delegate.window;
    }

    UIViewController *rootVC = window.rootViewController;
    while (rootVC.presentedViewController) {
      rootVC = rootVC.presentedViewController;
    }

    if (rootVC) {
      UIAlertController *alert = [UIAlertController alertControllerWithTitle:nil
                                                                     message:message
                                                              preferredStyle:UIAlertControllerStyleAlert];
      [rootVC presentViewController:alert animated:YES completion:nil];

      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [alert dismissViewControllerAnimated:YES completion:nil];
      });
    }
  });
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeToastSpecJSI>(params);
}

@end
