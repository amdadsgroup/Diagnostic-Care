/**
 * Diagnostic Care — Geolocation & Proximity Search Service
 * Provides reliable, secure, and privacy-respecting GPS positioning,
 * error diagnosis, reverse-geocoding to Bangladesh administrative units,
 * and high-performance client-side proximity distance calculations.
 */

import {
  AdministrativeDistrict,
  findNearestDistrict,
  getDistrictByName,
  getDistrictCentroid,
  getDivisionBySlug,
  calculateHaversineDistanceKm,
  isCoordinateValid,
  isCoordinateInBangladesh,
  formatDistance,
} from '@/data/bangladesh-divisions';
import { BRAND_CONSTANTS } from '@/config/brand';

export interface UserLocationDetails {
  name: string;
  nameBn: string;
  districtName: string;
  divisionSlug: string;
  divisionNameEn: string;
  divisionNameBn: string;
  upazilaName?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number; // Accuracy radius in meters
  timestamp?: number;
  isGps: boolean;
  source: 'GPS' | 'MANUAL' | 'DEFAULT';
}

export type GeoErrorCode =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'INSECURE_CONTEXT'
  | 'UNSUPPORTED'
  | 'INVALID_COORDS';

export interface GeoError {
  code: GeoErrorCode;
  messageEn: string;
  messageBn: string;
  actionEn: string;
  actionBn: string;
}

const STORAGE_KEY_LOCATION = 'dc_user_location';
const STORAGE_KEY_DETAILS = 'dc_user_location_details';
const EVENT_LOCATION_CHANGED = 'dc_location_changed';

export class GeoService {
  /**
   * Check if current browser origin is secure (HTTPS or localhost)
   */
  static isSecureOrigin(): boolean {
    if (typeof window === 'undefined') return true;
    if (window.isSecureContext) return true;
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
  }

  /**
   * Check if Geolocation API is available in current browser
   */
  static isGeolocationSupported(): boolean {
    return typeof window !== 'undefined' && 'geolocation' in navigator;
  }

  /**
   * Retrieve active stored location details from localStorage
   */
  static getStoredUserLocation(): UserLocationDetails | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DETAILS);
      if (raw) {
        const parsed = JSON.parse(raw) as UserLocationDetails;
        if (parsed && parsed.districtName) {
          return parsed;
        }
      }
      // Fallback: check legacy string key
      const legacy = localStorage.getItem(STORAGE_KEY_LOCATION);
      if (legacy && legacy !== 'All Bangladesh') {
        const district = getDistrictByName(legacy);
        if (district) {
          const div = getDivisionBySlug(district.divisionSlug);
          return {
            name: district.nameEn,
            nameBn: district.nameBn,
            districtName: district.nameEn,
            divisionSlug: district.divisionSlug,
            divisionNameEn: div?.nameEn || '',
            divisionNameBn: div?.nameBn || '',
            latitude: district.latitude,
            longitude: district.longitude,
            isGps: false,
            source: 'MANUAL',
          };
        }
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }

  /**
   * Persist location details and broadcast state change event across tabs & components
   */
  static saveUserLocation(details: UserLocationDetails): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_LOCATION, details.name);
      localStorage.setItem(STORAGE_KEY_DETAILS, JSON.stringify(details));
      window.dispatchEvent(
        new CustomEvent(EVENT_LOCATION_CHANGED, { detail: details })
      );
    } catch {
      // Ignore storage quota errors
    }
  }

  /**
   * Listen for location changes
   */
  static subscribe(callback: (details: UserLocationDetails) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<UserLocationDetails>;
      if (customEvent.detail) {
        callback(customEvent.detail);
      }
    };
    window.addEventListener(EVENT_LOCATION_CHANGED, handler);
    return () => window.removeEventListener(EVENT_LOCATION_CHANGED, handler);
  }

  /**
   * Request actual user GPS position from browser Geolocation API
   * Performs validation, reverse-geocodes to Bangladesh administrative district,
   * stores result, and returns rich location details.
   */
  static async requestCurrentPosition(options?: PositionOptions): Promise<{
    details: UserLocationDetails;
    distanceKm: number;
  }> {
    if (!this.isSecureOrigin()) {
      const err: GeoError = {
        code: 'INSECURE_CONTEXT',
        messageEn: 'Geolocation requires a secure connection (HTTPS).',
        messageBn: 'লোকেশন ব্যবহারের জন্য নিরাপদ এইচটিটিপিএস (HTTPS) সংযোগ আবশ্যক।',
        actionEn: 'Please access Diagnostic Care via https:// or select your location manually below.',
        actionBn: 'দয়া করে https:// দিয়ে প্রবেশ করুন অথবা নিচের তালিকা থেকে জেলা নির্বাচন করুন।',
      };
      throw err;
    }

    if (!this.isGeolocationSupported()) {
      const err: GeoError = {
        code: 'UNSUPPORTED',
        messageEn: 'Geolocation is not supported by your current browser.',
        messageBn: 'আপনার বর্তমান ব্রাউজারে লোকেশন সুবিধা সমর্থিত নয়।',
        actionEn: 'Please select your district manually from the list below.',
        actionBn: 'দয়া করে নিচের তালিকা থেকে আপনার জেলা নির্বাচন করুন।',
      };
      throw err;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds sensible timeout
      maximumAge: 60000, // 1 minute fresh cache
      ...options,
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy);
          const timestamp = pos.timestamp || Date.now();

          // Geographic coordinate validation
          if (!isCoordinateValid(lat, lng)) {
            const err: GeoError = {
              code: 'INVALID_COORDS',
              messageEn: 'Browser returned invalid geographic coordinates.',
              messageBn: 'ব্রাউজার থেকে প্রাপ্ত স্থানাঙ্ক সঠিক নয়।',
              actionEn: 'Please select your district manually.',
              actionBn: 'দয়া করে সরাসরি জেলা নির্বাচন করুন।',
            };
            return reject(err);
          }

          // Reverse-geocode to nearest Bangladesh administrative district
          const { district, distanceKm } = findNearestDistrict(lat, lng);
          const division = getDivisionBySlug(district.divisionSlug);

          const details: UserLocationDetails = {
            name: district.nameEn,
            nameBn: district.nameBn,
            districtName: district.nameEn,
            divisionSlug: district.divisionSlug,
            divisionNameEn: division?.nameEn || '',
            divisionNameBn: division?.nameBn || '',
            latitude: lat,
            longitude: lng,
            accuracy,
            timestamp,
            isGps: true,
            source: 'GPS',
          };

          this.saveUserLocation(details);
          resolve({ details, distanceKm });
        },
        (error: GeolocationPositionError) => {
          let geoErr: GeoError;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              geoErr = {
                code: 'PERMISSION_DENIED',
                messageEn: 'Location permission was denied.',
                messageBn: 'লোকেশন ব্যবহারের অনুমতি দেওয়া হয়নি।',
                actionEn:
                  'To use GPS, click the lock/settings icon next to the URL in your browser address bar, set Location to "Allow", and click Retry. Or select your district manually below.',
                actionBn:
                  'জিপিএস সক্রিয় করতে ব্রাউজারের অ্যাড্রেস বারের লক বা সেটিংস আইকনে ক্লিক করে লোকেশন "Allow" করুন এবং আবার চেষ্টা করুন। অথবা নিচে থেকে জেলা নির্বাচন করুন।',
              };
              break;
            case error.POSITION_UNAVAILABLE:
              geoErr = {
                code: 'POSITION_UNAVAILABLE',
                messageEn: 'GPS or cellular positioning is currently unavailable.',
                messageBn: 'ডিভাইসের জিপিএস বা নেটওয়ার্ক লোকেশন পাওয়া যাচ্ছে না।',
                actionEn:
                  'Ensure location/GPS is switched on in your device settings, or select your district manually below.',
                actionBn:
                  'আপনার ডিভাইসের লোকেশন সার্ভিস চালু আছে কিনা নিশ্চিত করুন, অথবা নিচে থেকে জেলা বেছে নিন।',
              };
              break;
            case error.TIMEOUT:
              geoErr = {
                code: 'TIMEOUT',
                messageEn: 'GPS location request timed out.',
                messageBn: 'লোকেশন অনুসন্ধানের নির্ধারিত সময় শেষ হয়েছে।',
                actionEn: 'Check your internet connection and click "Retry GPS", or pick your district below.',
                actionBn: 'ইন্টারনেট সংযোগ চেক করে "পুনরায় চেষ্টা করুন" চাপুন, অথবা নিচের জেলা তালিকা থেকে নির্বাচন করুন।',
              };
              break;
            default:
              geoErr = {
                code: 'POSITION_UNAVAILABLE',
                messageEn: error.message || 'Unable to retrieve location.',
                messageBn: 'অবস্থান শনাক্ত করা সম্ভব হয়নি।',
                actionEn: 'Please select your district manually below.',
                actionBn: 'দয়া করে নিচের তালিকা থেকে আপনার জেলা নির্বাচন করুন।',
              };
              break;
          }
          reject(geoErr);
        },
        defaultOptions
      );
    });
  }

  /**
   * Set a manual administrative location (Division / District / Upazila)
   * Clearly marked as source: 'MANUAL' (not fake GPS).
   */
  static setManualLocation(
    districtName: string,
    upazilaName?: string
  ): UserLocationDetails {
    if (districtName.toLowerCase().includes('all')) {
      const details: UserLocationDetails = {
        name: 'All Bangladesh',
        nameBn: 'সমগ্র বাংলাদেশ',
        districtName: 'ALL',
        divisionSlug: 'all',
        divisionNameEn: 'All Bangladesh',
        divisionNameBn: 'সমগ্র বাংলাদেশ',
        isGps: false,
        source: 'MANUAL',
      };
      this.saveUserLocation(details);
      return details;
    }

    const district = getDistrictByName(districtName);
    const div = district ? getDivisionBySlug(district.divisionSlug) : undefined;

    const details: UserLocationDetails = {
      name: upazilaName ? `${upazilaName}, ${district?.nameEn || districtName}` : (district?.nameEn || districtName),
      nameBn: upazilaName ? `${upazilaName}, ${district?.nameBn || districtName}` : (district?.nameBn || districtName),
      districtName: district?.nameEn || districtName,
      divisionSlug: district?.divisionSlug || 'all',
      divisionNameEn: div?.nameEn || '',
      divisionNameBn: div?.nameBn || '',
      upazilaName,
      latitude: district?.latitude,
      longitude: district?.longitude,
      isGps: false,
      source: 'MANUAL',
    };

    this.saveUserLocation(details);
    return details;
  }

  /**
   * Calculate distance between active user location and a provider branch or district
   */
  static calculateDistance(
    userLoc: UserLocationDetails | null,
    providerLat?: number | null,
    providerLng?: number | null,
    providerDistrictName?: string | null
  ): number | null {
    if (!userLoc || userLoc.latitude === undefined || userLoc.longitude === undefined) {
      return null;
    }

    // Direct coordinates on provider
    if (
      providerLat !== undefined &&
      providerLat !== null &&
      providerLng !== undefined &&
      providerLng !== null &&
      isCoordinateValid(providerLat, providerLng)
    ) {
      return calculateHaversineDistanceKm(
        userLoc.latitude,
        userLoc.longitude,
        providerLat,
        providerLng
      );
    }

    // Centroid of provider district
    if (providerDistrictName) {
      const centroid = getDistrictCentroid(providerDistrictName);
      if (centroid) {
        return calculateHaversineDistanceKm(
          userLoc.latitude,
          userLoc.longitude,
          centroid.latitude,
          centroid.longitude
        );
      }
    }

    return null;
  }

  /**
   * Format distance string localized in English or Bangla
   */
  static formatDistanceString(distanceKm: number, language: 'en' | 'bn'): string {
    return formatDistance(distanceKm, language);
  }
}
