import 'dotenv/config';

export default {
  "expo": {
    "name": "Gatepass App",
    "slug": "gatepass-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#112116"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.dev10000.gatepass"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#112116",
        "foregroundImage": "./assets/android-icon-foreground.png"
      },
      "package": "com.dev10000.gatepass",
      "permissions": ["CAMERA"],
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow Gatepass to access your camera to scan QR codes."
        }
      ]
    ],
    "scheme": "gatepass-app",
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "e7194a15-7bfb-4ad2-a4fa-cfb1fe36cd27"
      },
      "apiUrl": process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.10:5000/api"
    }
  }
}
