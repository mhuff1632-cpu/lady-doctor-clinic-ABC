package com.ladydoctorclinic.app

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast

/**
 * Handles external navigation intents (WhatsApp, phone dialer, email, maps, and social media)
 * and verifies domain security.
 */
object UrlHandler {

    const val TRUSTED_HOST = "lady-doctor-clinic-123.vercel.app"

    /**
     * Checks if the given URI belongs to the official clinic domain or its subdomains.
     */
    fun isInternalUrl(uri: Uri): Boolean {
        val host = uri.host?.lowercase() ?: return false
        val scheme = uri.scheme?.lowercase() ?: return false

        // Strict HTTPS enforcement
        if (scheme != "https") return false

        return host == TRUSTED_HOST || host.endsWith(".$TRUSTED_HOST")
    }

    /**
     * Determines whether the given URL should be handled outside the WebView
     * via an Android Intent, and executes the intent if appropriate.
     *
     * @return true if the URL was handled externally, false if it should be loaded inside WebView.
     */
    fun handleExternalIntent(context: Context, url: String): Boolean {
        val uri = Uri.parse(url)
        val scheme = uri.scheme?.lowercase() ?: return false

        return when {
            // Phone calls: tel:+92...
            scheme == "tel" -> {
                launchIntent(context, Intent(Intent.ACTION_DIAL, uri))
                true
            }

            // Emails: mailto:care@ladydoctorclinic.com
            scheme == "mailto" -> {
                launchIntent(context, Intent(Intent.ACTION_SENDTO, uri))
                true
            }

            // WhatsApp Direct Links: whatsapp://send?phone=...
            scheme == "whatsapp" -> {
                launchIntent(context, Intent(Intent.ACTION_VIEW, uri))
                true
            }

            // Web WhatsApp links: https://wa.me/... or https://api.whatsapp.com/...
            uri.host?.lowercase() in listOf("wa.me", "api.whatsapp.com", "chat.whatsapp.com") -> {
                val whatsappIntent = Intent(Intent.ACTION_VIEW, uri)
                whatsappIntent.setPackage("com.whatsapp")
                if (!launchIntent(context, whatsappIntent)) {
                    // Fallback to normal browser if WhatsApp is not installed
                    launchIntent(context, Intent(Intent.ACTION_VIEW, uri))
                }
                true
            }

            // Maps navigation: geo:0,0?q=... or maps.google.com
            scheme == "geo" || (uri.host?.lowercase()?.contains("maps.google.") == true) -> {
                launchIntent(context, Intent(Intent.ACTION_VIEW, uri))
                true
            }

            // External URLs (Social media, external resources)
            !isInternalUrl(uri) -> {
                launchIntent(context, Intent(Intent.ACTION_VIEW, uri))
                true
            }

            else -> false
        }
    }

    private fun launchIntent(context: Context, intent: Intent): Boolean {
        return try {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
            true
        } catch (e: ActivityNotFoundException) {
            Toast.makeText(context, R.string.app_not_found, Toast.LENGTH_SHORT).show()
            false
        } catch (e: Exception) {
            false
        }
    }
}
