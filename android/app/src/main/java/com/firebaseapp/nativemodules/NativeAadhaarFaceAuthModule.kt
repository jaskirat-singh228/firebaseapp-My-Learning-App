package com.firebaseapp.nativemodules

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.Settings
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import org.xmlpull.v1.XmlPullParser
import org.xmlpull.v1.XmlPullParserFactory
import java.io.StringReader
import java.util.UUID

class NativeAadhaarFaceAuthModule(reactContext: ReactApplicationContext) :
    NativeAadhaarFaceAuthSpec(reactContext) {

    private var pendingCapturePromise: Promise? = null
    private var pendingMatchPromise: Promise? = null

    private val activityEventListener: ActivityEventListener = object : BaseActivityEventListener() {
        override fun onActivityResult(
            activity: Activity,
            requestCode: Int,
            resultCode: Int,
            data: Intent?
        ) {
            when (requestCode) {
                CAPTURE_REQUEST_CODE -> {
                    handleCaptureResult(resultCode, data)
                }
                LOCAL_MATCH_REQUEST_CODE -> {
                    handleMatchResult(resultCode, data)
                }
            }
        }
    }

    init {
        reactContext.addActivityEventListener(activityEventListener)
    }

    override fun getName(): String = NAME

    /**
     * Checks if UIDAI FaceRD App is installed on device or intent can be handled
     */
    override fun isFaceRDAppInstalled(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            var installed = false
            try {
                pm.getPackageInfo(FACERD_PACKAGE_NAME, PackageManager.GET_ACTIVITIES)
                installed = true
            } catch (e: PackageManager.NameNotFoundException) {
                val intent = Intent(CAPTURE_INTENT_ACTION)
                val resolved = pm.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
                installed = resolved.isNotEmpty()
            }
            promise.resolve(installed)
        } catch (e: Exception) {
            promise.reject("ERR_CHECK_INSTALL", e.message, e)
        }
    }

    /**
     * Checks if USB Debugging / ADB is active.
     * FaceRD app security policy mandates USB debugging to be disabled (Error 892).
     */
    override fun isUsbDebuggingEnabled(promise: Promise) {
        try {
            val adbEnabled = Settings.Global.getInt(
                reactApplicationContext.contentResolver,
                Settings.Global.ADB_ENABLED,
                0
            )
            promise.resolve(adbEnabled == 1)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    /**
     * Opens UIDAI FaceRD App on Google Play Store
     */
    override fun openFaceRDPlayStore(promise: Promise) {
        try {
            val activity = reactApplicationContext.currentActivity
            val marketIntent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$FACERD_PACKAGE_NAME"))
            marketIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            if (activity != null) {
                activity.startActivity(marketIntent)
            } else {
                reactApplicationContext.startActivity(marketIntent)
            }
            promise.resolve(true)
        } catch (e: ActivityNotFoundException) {
            try {
                val webIntent = Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse("https://play.google.com/store/apps/details?id=$FACERD_PACKAGE_NAME")
                )
                webIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(webIntent)
                promise.resolve(true)
            } catch (ex: Exception) {
                promise.reject("ERR_OPEN_STORE", ex.message, ex)
            }
        }
    }

    /**
     * Launches CAPTURE intent for online Aadhaar authentication / eKYC.
     * Generates <PidOptions> XML according to UIDAI FaceRD v1.2 specification.
     */
    override fun captureFace(options: ReadableMap, promise: Promise) {
        val activity = reactApplicationContext.currentActivity
        if (activity == null) {
            promise.reject("ERR_NO_ACTIVITY", "Current activity is null")
            return
        }

        if (pendingCapturePromise != null) {
            promise.reject("ERR_ALREADY_RUNNING", "Another face capture is already in progress")
            return
        }

        try {
            // Build parameters
            val env = if (options?.hasKey("env") == true) options.getString("env") ?: "PP" else "PP"
            val format = if (options?.hasKey("format") == true) options.getString("format") ?: "0" else "0"
            val pidVer = if (options?.hasKey("pidVer") == true) options.getString("pidVer") ?: "2.0" else "2.0"
            val otp = if (options?.hasKey("otp") == true) options.getString("otp") ?: "" else ""
            val wadh = if (options?.hasKey("wadh") == true) options.getString("wadh") ?: "" else ""
            val txnId = if (options?.hasKey("txnId") == true && !options.getString("txnId").isNullOrEmpty()) {
                options.getString("txnId")!!
            } else {
                UUID.randomUUID().toString()
            }
            val language = if (options?.hasKey("language") == true) options.getString("language") ?: "en" else "en"
            val cameraUsage = if (options?.hasKey("cameraUsage") == true) options.getString("cameraUsage") ?: "F" else "F"
            val auaCode = if (options?.hasKey("auaCode") == true) options.getString("auaCode") ?: "" else ""
            val callBackUrl = if (options?.hasKey("callBackUrl") == true) options.getString("callBackUrl") ?: "" else ""
            val auaAuthToken = if (options?.hasKey("auaAuthToken") == true) options.getString("auaAuthToken") ?: "" else ""

            // Build PidOptions XML
            val pidOptionsXml = StringBuilder().apply {
                append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
                append("<PidOptions ver=\"1.0\" env=\"$env\">\n")
                append("  <Opts format=\"$format\" pidVer=\"$pidVer\" otp=\"$otp\" wadh=\"$wadh\"></Opts>\n")
                append("  <CustOpts>\n")
                append("    <Param name=\"txnId\" value=\"$txnId\"/>\n")
                append("    <Param name=\"language\" value=\"$language\"/>\n")
                append("    <Param name=\"cameraUsage\" value=\"$cameraUsage\"/>\n")
                if (auaCode.isNotEmpty()) {
                    append("    <Param name=\"auaCode\" value=\"$auaCode\"/>\n")
                }
                if (callBackUrl.isNotEmpty()) {
                    append("    <Param name=\"callBackUrl\" value=\"$callBackUrl\"/>\n")
                }
                if (auaAuthToken.isNotEmpty()) {
                    append("    <Param name=\"auaAuthToken\" value=\"$auaAuthToken\"/>\n")
                }
                append("  </CustOpts>\n")
                append("  <BioData />\n")
                append("  <Signature/>\n")
                append("</PidOptions>")
            }.toString()

            val intent = Intent(CAPTURE_INTENT_ACTION).apply {
                putExtra("request", pidOptionsXml)
                setPackage(FACERD_PACKAGE_NAME)
            }

            // Verify if an activity can resolve this intent
            val pm = reactApplicationContext.packageManager
            val activities = pm.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
            if (activities.isEmpty()) {
                // Try without explicit package in case it's another compliant RD app or emulator mock
                intent.setPackage(null)
                val fallbackActivities = pm.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
                if (fallbackActivities.isEmpty()) {
                    promise.reject(
                        "ERR_FACERD_NOT_INSTALLED",
                        "Aadhaar FaceRD app is not installed. Please install it from Google Play Store."
                    )
                    return
                }
            }

            pendingCapturePromise = promise
            activity.startActivityForResult(intent, CAPTURE_REQUEST_CODE)
        } catch (e: Exception) {
            pendingCapturePromise = null
            promise.reject("ERR_CAPTURE_FAILED", e.message, e)
        }
    }

    /**
     * Launches LOCAL_FACE_MATCH intent for offline match against signed KYC document or photo.
     * Generates <localFaceMatchRequest> XML according to UIDAI FaceRD v1.2 specification.
     */
    override fun localFaceMatch(options: ReadableMap, promise: Promise) {
        val activity = reactApplicationContext.currentActivity
        if (activity == null) {
            promise.reject("ERR_NO_ACTIVITY", "Current activity is null")
            return
        }

        if (pendingMatchPromise != null) {
            promise.reject("ERR_ALREADY_RUNNING", "Another local face match is in progress")
            return
        }

        try {
            val requestId = if (options?.hasKey("requestId") == true && !options.getString("requestId").isNullOrEmpty()) {
                options.getString("requestId")!!.replace("-", "")
            } else {
                UUID.randomUUID().toString().replace("-", "")
            }
            val language = if (options?.hasKey("language") == true) options.getString("language") ?: "en" else "en"
            val enableAutoCapture = if (options?.hasKey("enableAutoCapture") == true) {
                options.getBoolean("enableAutoCapture").toString()
            } else {
                "true"
            }
            val doc1Base64 = if (options?.hasKey("doc1Base64") == true) options.getString("doc1Base64") ?: "" else ""
            val docType = if (options?.hasKey("docType") == true) options.getString("docType") ?: "PHOTO" else "PHOTO"
            val auaCode = if (options?.hasKey("auaCode") == true) options.getString("auaCode") ?: "" else ""

            val requestXml = StringBuilder().apply {
                append("<localFaceMatchRequest requestId=\"$requestId\" language=\"$language\" enableAutoCapture=\"$enableAutoCapture\" callbackURL=\"\" encryptResponse=\"n\">\n")
                if (docType.equals("AADHAAR", ignoreCase = true)) {
                    append("  <Document1 docType=\"AADHAAR\" auaCode=\"$auaCode\">$doc1Base64</Document1>\n")
                } else {
                    append("  <Document1 docType=\"PHOTO\" auaCode=\"$auaCode\">\n")
                    append("    <Pht>$doc1Base64</Pht>\n")
                    append("    <Signature/>\n")
                    append("  </Document1>\n")
                }
                append("  <Signature/>\n")
                append("</localFaceMatchRequest>")
            }.toString()

            val intent = Intent(LOCAL_MATCH_INTENT_ACTION).apply {
                putExtra("request", requestXml)
                setPackage(FACERD_PACKAGE_NAME)
            }

            val pm = reactApplicationContext.packageManager
            val activities = pm.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
            if (activities.isEmpty()) {
                intent.setPackage(null)
                val fallbackActivities = pm.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
                if (fallbackActivities.isEmpty()) {
                    promise.reject(
                        "ERR_FACERD_NOT_INSTALLED",
                        "Aadhaar FaceRD app is not installed. Please install it from Google Play Store."
                    )
                    return
                }
            }

            pendingMatchPromise = promise
            activity.startActivityForResult(intent, LOCAL_MATCH_REQUEST_CODE)
        } catch (e: Exception) {
            pendingMatchPromise = null
            promise.reject("ERR_LOCAL_MATCH_FAILED", e.message, e)
        }
    }

    private fun handleCaptureResult(resultCode: Int, data: Intent?) {
        val promise = pendingCapturePromise ?: return
        pendingCapturePromise = null

        val rawResponse = data?.getStringExtra("response")

        if (rawResponse.isNullOrBlank()) {
            if (resultCode == Activity.RESULT_CANCELED) {
                val map = Arguments.createMap().apply {
                    putBoolean("isSuccess", false)
                    putString("errCode", "731")
                    putString("errInfo", "User aborted the capture operation.")
                    putString("rawXml", "")
                }
                promise.resolve(map)
            } else {
                val map = Arguments.createMap().apply {
                    putBoolean("isSuccess", false)
                    putString("errCode", "-1")
                    putString("errInfo", "Empty or null response received from FaceRD app.")
                    putString("rawXml", "")
                }
                promise.resolve(map)
            }
            return
        }

        try {
            val parsedResult = parsePidDataXml(rawResponse)
            promise.resolve(parsedResult)
        } catch (e: Exception) {
            val map = Arguments.createMap().apply {
                putBoolean("isSuccess", false)
                putString("errCode", "PARSE_ERR")
                putString("errInfo", "Failed to parse PidData XML: ${e.message}")
                putString("rawXml", rawResponse)
            }
            promise.resolve(map)
        }
    }

    private fun handleMatchResult(resultCode: Int, data: Intent?) {
        val promise = pendingMatchPromise ?: return
        pendingMatchPromise = null

        val rawResponse = data?.getStringExtra("response")

        if (rawResponse.isNullOrBlank()) {
            if (resultCode == Activity.RESULT_CANCELED) {
                val map = Arguments.createMap().apply {
                    putBoolean("isSuccess", false)
                    putString("errCode", "731")
                    putString("errInfo", "User aborted the local face match operation.")
                    putString("rawXml", "")
                }
                promise.resolve(map)
            } else {
                val map = Arguments.createMap().apply {
                    putBoolean("isSuccess", false)
                    putString("errCode", "-1")
                    putString("errInfo", "Empty or null response received from FaceRD app.")
                    putString("rawXml", "")
                }
                promise.resolve(map)
            }
            return
        }

        try {
            val parsedResult = parseLocalMatchXml(rawResponse)
            promise.resolve(parsedResult)
        } catch (e: Exception) {
            val map = Arguments.createMap().apply {
                putBoolean("isSuccess", false)
                putString("errCode", "PARSE_ERR")
                putString("errInfo", "Failed to parse local face match XML: ${e.message}")
                putString("rawXml", rawResponse)
            }
            promise.resolve(map)
        }
    }

    /**
     * Parses <PidData> response XML from FaceRD CAPTURE intent.
     */
    private fun parsePidDataXml(xml: String): WritableMap {
        val map = Arguments.createMap()
        map.putString("rawXml", xml)

        var errCode = "0"
        var errInfo = ""
        var qScore = ""
        var fCount = ""
        var fType = ""
        var rdsId = ""
        var rdsVer = ""
        var dpId = ""
        var dc = ""
        var mi = ""
        var mc = ""
        var skey = ""
        var skeyCi = ""
        var hmac = ""
        var data = ""
        var dataType = ""
        var txnId = ""
        var txnStatus = ""
        var responseCode = ""

        try {
            val factory = XmlPullParserFactory.newInstance()
            factory.isNamespaceAware = false
            val parser = factory.newPullParser()
            parser.setInput(StringReader(xml))

            var eventType = parser.eventType
            var currentTag = ""

            while (eventType != XmlPullParser.END_DOCUMENT) {
                when (eventType) {
                    XmlPullParser.START_TAG -> {
                        currentTag = parser.name
                        when (currentTag.lowercase()) {
                            "resp" -> {
                                errCode = parser.getAttributeValue(null, "errCode") ?: "0"
                                errInfo = parser.getAttributeValue(null, "errInfo") ?: ""
                                qScore = parser.getAttributeValue(null, "qScore") ?: ""
                                fCount = parser.getAttributeValue(null, "fCount") ?: ""
                                fType = parser.getAttributeValue(null, "fType") ?: ""
                            }
                            "deviceinfo" -> {
                                rdsId = parser.getAttributeValue(null, "rdsId") ?: ""
                                rdsVer = parser.getAttributeValue(null, "rdsVer") ?: ""
                                dpId = parser.getAttributeValue(null, "dpId") ?: ""
                                dc = parser.getAttributeValue(null, "dc") ?: ""
                                mi = parser.getAttributeValue(null, "mi") ?: ""
                                mc = parser.getAttributeValue(null, "mc") ?: ""
                            }
                            "skey" -> {
                                skeyCi = parser.getAttributeValue(null, "ci") ?: ""
                            }
                            "data" -> {
                                dataType = parser.getAttributeValue(null, "type") ?: ""
                            }
                            "param" -> {
                                val pName = parser.getAttributeValue(null, "name")
                                val pVal = parser.getAttributeValue(null, "value") ?: ""
                                if (pName != null) {
                                    when (pName) {
                                        "txnId" -> txnId = pVal
                                        "txnStatus" -> txnStatus = pVal
                                        "responseCode" -> responseCode = pVal
                                    }
                                }
                            }
                        }
                    }
                    XmlPullParser.TEXT -> {
                        val text = parser.text?.trim() ?: ""
                        if (text.isNotEmpty()) {
                            when (currentTag.lowercase()) {
                                "skey" -> skey = text
                                "hmac" -> hmac = text
                                "data" -> data = text
                            }
                        }
                    }
                    XmlPullParser.END_TAG -> {
                        currentTag = ""
                    }
                }
                eventType = parser.next()
            }
        } catch (e: Exception) {
            val errCodeMatch = Regex("errCode\\s*=\\s*\"([^\"]*)\"").find(xml)
            if (errCodeMatch != null) errCode = errCodeMatch.groupValues[1]
            val errInfoMatch = Regex("errInfo\\s*=\\s*\"([^\"]*)\"").find(xml)
            if (errInfoMatch != null) errInfo = errInfoMatch.groupValues[1]
        }

        val isSuccess = (errCode == "0")

        map.putBoolean("isSuccess", isSuccess)
        map.putString("errCode", errCode)
        map.putString("errInfo", errInfo)
        map.putString("qScore", qScore)
        map.putString("fCount", fCount)
        map.putString("fType", fType)
        map.putString("rdsId", rdsId)
        map.putString("rdsVer", rdsVer)
        map.putString("dpId", dpId)
        map.putString("dc", dc)
        map.putString("mi", mi)
        map.putString("mc", mc)
        map.putString("skey", skey)
        map.putString("skeyCi", skeyCi)
        map.putString("hmac", hmac)
        map.putString("data", data)
        map.putString("dataType", dataType)
        map.putString("txnId", txnId)
        map.putString("txnStatus", txnStatus)
        map.putString("responseCode", responseCode)

        return map
    }

    /**
     * Parses <localFaceMatchResponse> XML.
     */
    private fun parseLocalMatchXml(xml: String): WritableMap {
        val map = Arguments.createMap()
        map.putString("rawXml", xml)

        var requestId = ""
        var responseCode = ""
        var dateTime = ""
        var errCode = "0"
        var errInfo = ""

        try {
            val factory = XmlPullParserFactory.newInstance()
            factory.isNamespaceAware = false
            val parser = factory.newPullParser()
            parser.setInput(StringReader(xml))

            var eventType = parser.eventType
            while (eventType != XmlPullParser.END_DOCUMENT) {
                if (eventType == XmlPullParser.START_TAG && parser.name.equals("localFaceMatchResponse", ignoreCase = true)) {
                    requestId = parser.getAttributeValue(null, "requestId") ?: ""
                    responseCode = parser.getAttributeValue(null, "responseCode") ?: ""
                    dateTime = parser.getAttributeValue(null, "dateTime") ?: ""
                    errCode = parser.getAttributeValue(null, "errCode") ?: "0"
                    errInfo = parser.getAttributeValue(null, "errInfo") ?: ""
                    break
                }
                eventType = parser.next()
            }
        } catch (e: Exception) {
            val errCodeMatch = Regex("errCode\\s*=\\s*\"([^\"]*)\"").find(xml)
            if (errCodeMatch != null) errCode = errCodeMatch.groupValues[1]
            val errInfoMatch = Regex("errInfo\\s*=\\s*\"([^\"]*)\"").find(xml)
            if (errInfoMatch != null) errInfo = errInfoMatch.groupValues[1]
        }

        val isSuccess = (errCode == "0")

        map.putBoolean("isSuccess", isSuccess)
        map.putString("requestId", requestId)
        map.putString("responseCode", responseCode)
        map.putString("dateTime", dateTime)
        map.putString("errCode", errCode)
        map.putString("errInfo", errInfo)

        return map
    }

    companion object {
        const val NAME = "NativeAadhaarFaceAuth"
        const val FACERD_PACKAGE_NAME = "in.gov.uidai.facerd"
        const val CAPTURE_INTENT_ACTION = "in.gov.uidai.rdservice.face.CAPTURE"
        const val LOCAL_MATCH_INTENT_ACTION = "in.gov.uidai.rdservice.face.LOCAL_FACE_MATCH"

        const val CAPTURE_REQUEST_CODE = 2001
        const val LOCAL_MATCH_REQUEST_CODE = 2002
    }
}
