package com.ladydoctorclinic.app

import android.graphics.Bitmap
import android.net.http.SslError
import android.os.Build
import android.webkit.SslErrorHandler
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient

/**
 * Custom WebViewClient that enforces:
 * - Domain origin restriction & external intent launching (WhatsApp, Phone, Email, Maps, etc.)
 * - Strict SSL validation (never bypassing SSL errors)
 * - Main-frame error detection with user-friendly retry screen
 * - Pull-to-refresh and progress coordination
 */
class ClinicWebViewClient(
    private val callbacks: ClientCallbacks
) : WebViewClient() {

    interface ClientCallbacks {
        fun onPageStartedLoading(url: String?)
        fun onPageFinishedLoading(url: String?)
        fun onMainFrameErrorReceived(errorMessage: String?)
    }

    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
        val url = request?.url?.toString() ?: return false
        val context = view?.context ?: return false

        return if (UrlHandler.handleExternalIntent(context, url)) {
            true // Handled externally via Android Intent
        } else {
            false // Continue loading inside WebView
        }
    }

    @Deprecated("Deprecated in Java")
    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
        if (url == null) return false
        val context = view?.context ?: return false

        return if (UrlHandler.handleExternalIntent(context, url)) {
            true
        } else {
            false
        }
    }

    override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
        super.onPageStarted(view, url, favicon)
        callbacks.onPageStartedLoading(url)
    }

    override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        callbacks.onPageFinishedLoading(url)
    }

    override fun onReceivedError(
        view: WebView?,
        request: WebResourceRequest?,
        error: WebResourceError?
    ) {
        super.onReceivedError(view, request, error)
        // Only trigger full error overlay if error happens on main frame
        if (request?.isForMainFrame == true) {
            val description = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                error?.description?.toString()
            } else {
                null
            }
            callbacks.onMainFrameErrorReceived(description)
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onReceivedError(
        view: WebView?,
        errorCode: Int,
        description: String?,
        failingUrl: String?
    ) {
        super.onReceivedError(view, errorCode, description, failingUrl)
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            callbacks.onMainFrameErrorReceived(description)
        }
    }

    override fun onReceivedHttpError(
        view: WebView?,
        request: WebResourceRequest?,
        errorResponse: WebResourceResponse?
    ) {
        super.onReceivedHttpError(view, request, errorResponse)
        if (request?.isForMainFrame == true && (errorResponse?.statusCode ?: 200) >= 400) {
            callbacks.onMainFrameErrorReceived("HTTP Error ${errorResponse?.statusCode}")
        }
    }

    /**
     * Strict SSL security: Never allow SSL certificate errors to proceed.
     * This preserves patient confidentiality and prevents MITM vulnerabilities.
     */
    override fun onReceivedSslError(
        view: WebView?,
        handler: SslErrorHandler?,
        error: SslError?
    ) {
        // Log securely and cancel request immediately
        handler?.cancel()
        callbacks.onMainFrameErrorReceived("Security Notice: SSL Certificate validation failed.")
    }
}
