import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Tracking from "expo-tracking-transparency";

const TRACKING_PERMISSION_KEY = "@ad_tracking_permission";
const DEFAULT_KEYWORDS = [
  "luxury sneakers",
  "designer shoes",
  "premium footwear",
  "exclusive drops",
  "limited edition",
  "sneaker investment",
  "resale market",
  "hype sneakers",
  "premium streetwear",
  "luxury fashion",
  "exclusive releases",
  "premium sneaker deals",
  "designer footwear",
  "luxury sneaker brands",
  "Nike Air Jordan",
  "Adidas Yeezy",
  "Supreme collaboration",
  "Off-White sneakers",
  "Travis Scott Jordan",
  "Dior sneakers",
  "Balenciaga Triple S",
  "Gucci sneakers",
  "Louis Vuitton shoes",
  "Prada footwear",
  "buy now",
  "shop sneakers",
  "purchase footwear",
  "order shoes",
  "get deals",
  "shop online",
  "buy luxury",
  "purchase premium",
  "shop exclusive",
  "buy limited",
  "fashion forward",
  "trendy consumers",
  "style conscious",
  "fashion enthusiasts",
  "luxury shoppers",
  "premium buyers",
  "fashion influencers",
  "style leaders",
  "trend setters",
  "fashion conscious",
  "new arrivals",
  "latest trends",
  "seasonal styles",
  "trending footwear",
  "hot releases",
  "popular styles",
  "current trends",
  "fashion trends",
  "style trends",
  "premium pricing",
  "luxury value",
  "exclusive pricing",
  "premium deals",
  "luxury offers",
  "high-end pricing",
  "premium value",
  "luxury deals",
  "exclusive offers",
  "premium pricing"
];

// Get the user's tracking permission status
export const getTrackingPermissionStatus = async () => {
  try {
    // First check if we've stored the permission status
    const storedStatus = await AsyncStorage.getItem(TRACKING_PERMISSION_KEY);
    if (storedStatus !== null) {
      return storedStatus === "granted";
    }

    // If not stored, check current status
    if (Platform.OS === "ios") {
      const { status } = await Tracking.getTrackingPermissionsAsync();
      const isGranted = status === "granted";
      // Store the result for future use
      await AsyncStorage.setItem(
        TRACKING_PERMISSION_KEY,
        isGranted ? "granted" : "denied"
      );
      return isGranted;
    }

    // For Android, we'll assume tracking is allowed by default
    // as it doesn't have the same strict tracking permission system
    return true;
  } catch (error) {
    console.error("Error getting tracking permission status:", error);
    // Default to non-personalized ads on error
    return false;
  }
};

// Request tracking permission (iOS only)
export const requestTrackingPermission = async () => {
  try {
    if (Platform.OS === "ios") {
      const { status } = await Tracking.requestTrackingPermissionsAsync();
      const isGranted = status === "granted";
      await AsyncStorage.setItem(
        TRACKING_PERMISSION_KEY,
        isGranted ? "granted" : "denied"
      );
      return isGranted;
    }
    return true; // Android doesn't need explicit permission
  } catch (error) {
    console.error("Error requesting tracking permission:", error);
    return false;
  }
};

// Get optimized ad request options based on tracking permission
export const getAdRequestOptions = async () => {
  const hasTrackingPermission = await getTrackingPermissionStatus();

  // Rotate keywords to prevent ad repetition
  const shuffledKeywords = [...DEFAULT_KEYWORDS]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20); // Use 20 random keywords per request

  const baseOptions = {
    keywords: shuffledKeywords,
    requestNonPersonalizedAdsOnly: !hasTrackingPermission,
    maxAdContentRating: "G",
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
  };

  // Add sophisticated targeting when tracking is allowed
  if (hasTrackingPermission) {
    return {
      ...baseOptions,
      // Enhanced demographic targeting
      gender: "all",
      location: "all",
      
      // Content targeting for better relevance
      contentFiltering: "moderate",
      
      // Request specific ad formats for higher CPM
      requestCustomRenderedAd: false,
      
      // Add contextual targeting
      contextualKeywords: shuffledKeywords.slice(0, 10),
      
      // Request high-value ad categories
      requestAgent: "mobile-app",
      
      // Add user interest targeting
      userInterestCategories: [
        "fashion",
        "luxury",
        "shopping",
        "sports",
        "lifestyle"
      ]
    };
  }

  return baseOptions;
};

// Reset tracking permission (useful for testing or user preferences)
export const resetTrackingPermission = async () => {
  try {
    await AsyncStorage.removeItem(TRACKING_PERMISSION_KEY);
    return true;
  } catch (error) {
    console.error("Error resetting tracking permission:", error);
    return false;
  }
};
