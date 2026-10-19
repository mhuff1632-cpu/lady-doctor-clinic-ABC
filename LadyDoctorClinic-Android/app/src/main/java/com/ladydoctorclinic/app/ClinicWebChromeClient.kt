package com.ladydoctorclinic.app

import android.net.Uri
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView

/**
 * Handles WebChrome callbacks:
 * - Deterministic loading progress updates
 * - HTML5 file chooser for document/image attachments
 */
class ClinicWebChromeClient(
    private val callbacks: ChromeCallbacks
) : WebChromeClient() {

    interface ChromeCallbacks {
        fun onProgressUpdate(newProgress: Int)
        fun onOpenFileChooser(
            filePathCallback: ValueCallback<Array<Uri>>?,
            fileChooserParams: FileChooserParams?
        ): Boolean
    }

    override fun onProgressChanged(view: WebView?, newProgress: Int) {
        super.onProgressChanged(view, newProgress)
        callbacks.onProgressUpdate(newProgress)
    }

    override fun onShowFileChooser(
        webView: WebView?,
        filePathCallback: ValueCallback<Array<Uri>>?,
        fileChooserParams: FileChooserParams?
    ): Boolean {
        return callbacks.onOpenFileChooser(filePathCallback, fileChooserParams)
    }
}
