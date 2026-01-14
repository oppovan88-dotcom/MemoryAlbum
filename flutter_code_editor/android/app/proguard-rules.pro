# Flutter HTTP package rules
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Keep HTTP client classes
-keep class dart.** { *; }
-keep class com.google.** { *; }

# OkHttp (used by http package)
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# Google Gson (for JSON parsing)
-keep class com.google.gson.** { *; }
-keepattributes Signature
-keepattributes *Annotation*

# Keep model classes (prevent obfuscation)
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Prevent stripping of networking classes
-keep class java.net.** { *; }
-keep class javax.net.ssl.** { *; }

# Keep Dart HTTP functionality
-keep class org.chromium.** { *; }
