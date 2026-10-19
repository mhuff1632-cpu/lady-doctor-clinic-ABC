package com.ladydoctorclinic.app

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.ladydoctorclinic.app.databinding.ActivityMainBinding

/**
 * Main activity for Lady Doctor Clinic Native Android application.
 * Hosts the responsive WebView loading the live clinic website.
 */
class MainActivity : AppCompatActivity(),
    ClinicWebViewClient.ClientCallbacks,
    ClinicWebChromeClient.ChromeCallbacks {

    private lateinit var binding: ActivityMainBinding
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null

    // Register modern file chooser result launcher
    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val intentData = result.data
            val results: Array<Uri>? = when {
                intentData?.data != null -> arrayOf(intentData.data!!)
                intentData?.clipData != null -> {
                    val count = intentData.clipData!!.itemCount
                    Array(count) { i -> intentData.clipData!!.getItemAt(i).uri }
                }
                else -> null
            }
            fileUploadCallback?.onReceiveValue(results)
        } else {
            fileUploadCallback?.onReceiveValue(null)
        }
        fileUploadCallback = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        // Switch from splash theme to main app theme before inflating layout
        setTheme(R.style.Theme_LadyDoctorClinic)
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupWebView()
        setupSwipeRefresh()
        setupBottomNavigation()
        setupErrorHandling()
        setupBackNavigation()

        if (savedInstanceState != null) {
            binding.webView.restoreState(savedInstanceState)
        } else {
            loadClinicWebsite()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val webView = binding.webView
        val settings = webView.settings

        // JavaScript and DOM storage enabled for React SPA interactivity & state
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true

        // Cache mode: LOAD_DEFAULT ensures live updates from Vercel are fetched dynamically
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        // Security hardening
        settings.allowFileAccess = false
        settings.allowContentAccess = false
        settings.mediaPlaybackRequiresUserGesture = true

        // Viewport and responsiveness
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.setSupportZoom(true)
        settings.builtInZoomControls = true
        settings.displayZoomControls = false

        // Custom User Agent suffix to indicate official Native Android App
        val defaultUserAgent = settings.userAgentString
        settings.userAgentString = "$defaultUserAgent LadyDoctorClinicApp/1.0"

        // Enable cookie manager for Supabase auth persistence
        android.webkit.CookieManager.getInstance().setAcceptCookie(true)
        android.webkit.CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)

        webView.webViewClient = ClinicWebViewClient(this)
        webView.webChromeClient = ClinicWebChromeClient(this)

        // Disable long click selections where undesirable
        webView.isHapticFeedbackEnabled = true
    }

    private fun setupSwipeRefresh() {
        binding.swipeRefreshLayout.setColorSchemeResources(
            R.color.clinic_rose_primary,
            R.color.clinic_teal,
            R.color.clinic_rose_accent
        )

        binding.swipeRefreshLayout.setOnRefreshListener {
            if (NetworkUtils.isOnline(this)) {
                binding.errorView.visibility = View.GONE
                // Force clear cache and bypass cache to fetch latest published updates
                binding.webView.clearCache(true)
                binding.webView.settings.cacheMode = WebSettings.LOAD_NO_CACHE
                binding.webView.reload()
            } else {
                binding.swipeRefreshLayout.isRefreshing = false
                showErrorView(getString(R.string.offline_message))
            }
        }

        // Coordinate pull-to-refresh with WebView vertical scroll
        binding.swipeRefreshLayout.setOnChildScrollUpCallback { _, _ ->
            binding.webView.scrollY > 0
        }
    }

    private fun setupBottomNavigation() {
        val targetBaseUrl = getString(R.string.target_website_url).trimEnd('/')

        binding.btnNavWebsite.setOnClickListener {
            updateNavSelection(isAdmin = false)
            if (NetworkUtils.isOnline(this)) {
                binding.errorView.visibility = View.GONE
                binding.webView.loadUrl(targetBaseUrl)
            } else {
                showErrorView(getString(R.string.offline_message))
            }
        }

        binding.btnNavAdmin.setOnClickListener {
            updateNavSelection(isAdmin = true)
            if (NetworkUtils.isOnline(this)) {
                binding.errorView.visibility = View.GONE
                binding.webView.loadUrl("$targetBaseUrl/admin")
            } else {
                showErrorView(getString(R.string.offline_message))
            }
        }

        binding.btnNavRefresh.setOnClickListener {
            if (NetworkUtils.isOnline(this)) {
                binding.errorView.visibility = View.GONE
                binding.webView.clearCache(true)
                binding.webView.settings.cacheMode = WebSettings.LOAD_NO_CACHE
                binding.webView.reload()
                Toast.makeText(this, "Refreshing clinic data...", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, R.string.offline_title, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun updateNavSelection(isAdmin: Boolean) {
        val activeColor = ContextCompat.getColor(this, R.color.clinic_rose_primary)
        val inactiveColor = ContextCompat.getColor(this, R.color.text_secondary)

        if (isAdmin) {
            binding.ivNavAdmin.setColorFilter(activeColor)
            binding.tvNavAdmin.setTextColor(activeColor)
            binding.ivNavWebsite.setColorFilter(inactiveColor)
            binding.tvNavWebsite.setTextColor(inactiveColor)
        } else {
            binding.ivNavWebsite.setColorFilter(activeColor)
            binding.tvNavWebsite.setTextColor(activeColor)
            binding.ivNavAdmin.setColorFilter(inactiveColor)
            binding.tvNavAdmin.setTextColor(inactiveColor)
        }
    }

    private fun setupErrorHandling() {
        binding.btnRetry.setOnClickListener {
            if (NetworkUtils.isOnline(this)) {
                binding.errorView.visibility = View.GONE
                loadClinicWebsite()
            } else {
                Toast.makeText(this, R.string.offline_title, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (binding.errorView.visibility == View.VISIBLE && binding.webView.canGoBack()) {
                    binding.errorView.visibility = View.GONE
                    binding.webView.goBack()
                } else if (binding.webView.canGoBack()) {
                    binding.webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    private fun loadClinicWebsite() {
        val targetUrl = getString(R.string.target_website_url)
        if (NetworkUtils.isOnline(this)) {
            binding.errorView.visibility = View.GONE
            binding.webView.loadUrl(targetUrl)
        } else {
            showErrorView(getString(R.string.offline_message))
        }
    }

    private fun showErrorView(message: String?) {
        binding.swipeRefreshLayout.isRefreshing = false
        binding.progressBar.visibility = View.GONE
        if (!message.isNullOrBlank()) {
            binding.tvErrorMessage.text = message
        }
        binding.errorView.visibility = View.VISIBLE
    }

    // --- ClinicWebViewClient Callbacks ---

    override fun onPageStartedLoading(url: String?) {
        binding.progressBar.visibility = View.VISIBLE
        binding.progressBar.progress = 10
        val isAdmin = url?.contains("/admin") == true
        updateNavSelection(isAdmin)
    }

    override fun onPageFinishedLoading(url: String?) {
        binding.swipeRefreshLayout.isRefreshing = false
        binding.progressBar.visibility = View.GONE
        binding.webView.settings.cacheMode = WebSettings.LOAD_DEFAULT
        val isAdmin = url?.contains("/admin") == true
        updateNavSelection(isAdmin)
    }

    override fun onMainFrameErrorReceived(errorMessage: String?) {
        showErrorView(errorMessage ?: getString(R.string.offline_message))
    }

    // --- ClinicWebChromeClient Callbacks ---

    override fun onProgressUpdate(newProgress: Int) {
        if (newProgress < 100) {
            binding.progressBar.visibility = View.VISIBLE
            binding.progressBar.progress = newProgress
        } else {
            binding.progressBar.visibility = View.GONE
            binding.swipeRefreshLayout.isRefreshing = false
        }
    }

    override fun onOpenFileChooser(
        filePathCallback: ValueCallback<Array<Uri>>?,
        fileChooserParams: WebChromeClient.FileChooserParams?
    ): Boolean {
        fileUploadCallback?.onReceiveValue(null)
        fileUploadCallback = filePathCallback

        val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "*/*"
        }

        return try {
            fileChooserLauncher.launch(intent)
            true
        } catch (e: Exception) {
            fileUploadCallback?.onReceiveValue(null)
            fileUploadCallback = null
            false
        }
    }

    // --- Lifecycle State Preservation ---

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        binding.webView.saveState(outState)
    }

    override fun onResume() {
        super.onResume()
        binding.webView.onResume()
    }

    override fun onPause() {
        binding.webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        binding.webView.destroy()
        super.onDestroy()
    }
}
