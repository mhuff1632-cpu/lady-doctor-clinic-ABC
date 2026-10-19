package com.ladydoctorclinic.app

import android.net.Uri
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

/**
 * Unit tests verifying domain boundaries and URL security policies.
 */
class UrlHandlerTest {

    @Test
    fun testOfficialClinicDomainIsInternal() {
        val uri = Uri.parse("https://lady-doctor-clinic-123.vercel.app/doctors")
        assertTrue(UrlHandler.isInternalUrl(uri))
    }

    @Test
    fun testRootDomainIsInternal() {
        val uri = Uri.parse("https://lady-doctor-clinic-123.vercel.app/")
        assertTrue(UrlHandler.isInternalUrl(uri))
    }

    @Test
    fun testAppointmentDeepLinkIsInternal() {
        val uri = Uri.parse("https://lady-doctor-clinic-123.vercel.app/appointment?doctor=doc-sarah-khan")
        assertTrue(UrlHandler.isInternalUrl(uri))
    }

    @Test
    fun testCleartextHttpIsRejected() {
        val uri = Uri.parse("http://lady-doctor-clinic-123.vercel.app/services")
        assertFalse("Cleartext HTTP must never be treated as secure internal navigation", UrlHandler.isInternalUrl(uri))
    }

    @Test
    fun testExternalSocialMediaIsExternal() {
        val fbUri = Uri.parse("https://facebook.com/ladydoctorclinic")
        assertFalse(UrlHandler.isInternalUrl(fbUri))

        val instaUri = Uri.parse("https://instagram.com/ladydoctorclinic")
        assertFalse(UrlHandler.isInternalUrl(instaUri))

        val youtubeUri = Uri.parse("https://youtube.com/@ladydoctorclinic")
        assertFalse(UrlHandler.isInternalUrl(youtubeUri))
    }

    @Test
    fun testPhishingOrImpersonationDomainIsRejected() {
        val spoofUri = Uri.parse("https://lady-doctor-clinic-123.vercel.app.attacker.com/")
        assertFalse(UrlHandler.isInternalUrl(spoofUri))
    }
}
