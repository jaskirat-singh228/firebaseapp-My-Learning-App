package com.firebaseapp.nativemodules

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class MyTurboReactPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return when (name) {
            NativeToastModule.NAME -> NativeToastModule(reactContext)
            NativeLocalStorageModule.NAME -> NativeLocalStorageModule(reactContext)
            NativeAadhaarFaceAuthModule.NAME -> NativeAadhaarFaceAuthModule(reactContext)
            else -> null
        }
    }

    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(
            NativeToastModule.NAME to ReactModuleInfo(
                name = NativeToastModule.NAME,
                className = NativeToastModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            ),
            NativeLocalStorageModule.NAME to ReactModuleInfo(
                name = NativeLocalStorageModule.NAME,
                className = NativeLocalStorageModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            ),
            NativeAadhaarFaceAuthModule.NAME to ReactModuleInfo(
                name = NativeAadhaarFaceAuthModule.NAME,
                className = NativeAadhaarFaceAuthModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )
        )
    }
}