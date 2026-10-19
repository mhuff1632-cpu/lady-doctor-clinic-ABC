# ProGuard rules for Lady Doctor Clinic Native Android App

# Preserve WebView interfaces & JavaScript annotations
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve WebKit callbacks
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
}
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, int);
}

# Material Components
-keepclassmembers class * extends com.google.android.material.snackbar.Snackbar {
    *;
}
