package com.firebaseapp

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.firebaseapp.nativemodules.MyTurboReactPackage

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
       getDefaultReactHost(bh
      context = applicationContext,
            packageList =
         PackageList(this).packages.apply {
              // Packages that cannot be auto linked yet can be added manually here, for example:
                add(MyTurboReactPackage())
            }

       ) 
  }

  override fun onCreate() {
    super.onCreate()
 
  }
}
