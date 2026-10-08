/**
 * Diagnostic Care — Nationwide Bangladesh Geographic Hierarchy Engine
 * All 8 Administrative Divisions, 64 Districts, and Major Upazilas with Coordinates
 */

export interface GeoDivision {
  id: string;
  nameEn: string;
  nameBn: string;
}

export interface GeoDistrict {
  id: string;
  divisionId: string;
  nameEn: string;
  nameBn: string;
  lat: number;
  lng: number;
}

export interface GeoUpazila {
  id: string;
  districtId: string;
  nameEn: string;
  nameBn: string;
}

export const BANGLADESH_DIVISIONS: GeoDivision[] = [
  { id: 'div-sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'div-dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'div-chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: 'div-rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'div-khulna', nameEn: 'Khulna', nameBn: 'খুলনা' },
  { id: 'div-barishal', nameEn: 'Barishal', nameBn: 'বরিশাল' },
  { id: 'div-rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর' },
  { id: 'div-mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
];

export const BANGLADESH_DISTRICTS: GeoDistrict[] = [
  // Sylhet Division (Hub Launch Region)
  { id: 'dist-moulvibazar', divisionId: 'div-sylhet', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার', lat: 24.4829, lng: 91.7774 },
  { id: 'dist-sylhet', divisionId: 'div-sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট', lat: 24.8949, lng: 91.8687 },
  { id: 'dist-habiganj', divisionId: 'div-sylhet', nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ', lat: 24.3749, lng: 91.4155 },
  { id: 'dist-sunamganj', divisionId: 'div-sylhet', nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ', lat: 25.0658, lng: 91.3950 },

  // Dhaka Division
  { id: 'dist-dhaka', divisionId: 'div-dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা', lat: 23.8103, lng: 90.4125 },
  { id: 'dist-gazipur', divisionId: 'div-dhaka', nameEn: 'Gazipur', nameBn: 'গাজীপুর', lat: 24.0023, lng: 90.4264 },
  { id: 'dist-narayanganj', divisionId: 'div-dhaka', nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', lat: 23.6337, lng: 90.4965 },
  { id: 'dist-tangail', divisionId: 'div-dhaka', nameEn: 'Tangail', nameBn: 'টাঙ্গাইল', lat: 24.2513, lng: 89.9167 },
  { id: 'dist-faridpur', divisionId: 'div-dhaka', nameEn: 'Faridpur', nameBn: 'ফরিদপুর', lat: 23.6071, lng: 89.8429 },
  { id: 'dist-manikganj', divisionId: 'div-dhaka', nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ', lat: 23.8644, lng: 90.0047 },
  { id: 'dist-munshiganj', divisionId: 'div-dhaka', nameEn: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', lat: 23.5422, lng: 90.5305 },
  { id: 'dist-narsingdi', divisionId: 'div-dhaka', nameEn: 'Narsingdi', nameBn: 'নরসিংদী', lat: 23.9322, lng: 90.7154 },
  { id: 'dist-gopalganj', divisionId: 'div-dhaka', nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ', lat: 23.0051, lng: 89.8266 },
  { id: 'dist-kishoreganj', divisionId: 'div-dhaka', nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', lat: 24.4449, lng: 90.7766 },
  { id: 'dist-madaripur', divisionId: 'div-dhaka', nameEn: 'Madaripur', nameBn: 'মাদারীপুর', lat: 23.1641, lng: 90.1897 },
  { id: 'dist-rajbari', divisionId: 'div-dhaka', nameEn: 'Rajbari', nameBn: 'রাজবাড়ী', lat: 23.7574, lng: 89.6445 },
  { id: 'dist-shariatpur', divisionId: 'div-dhaka', nameEn: 'Shariatpur', nameBn: 'শরীয়তপুর', lat: 23.2423, lng: 90.4348 },

  // Chattogram Division
  { id: 'dist-chattogram', divisionId: 'div-chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম', lat: 22.3569, lng: 91.7832 },
  { id: 'dist-coxsbazar', divisionId: 'div-chattogram', nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার', lat: 21.4272, lng: 92.0058 },
  { id: 'dist-cumilla', divisionId: 'div-chattogram', nameEn: 'Cumilla', nameBn: 'কুমিল্লা', lat: 23.4682, lng: 91.1788 },
  { id: 'dist-brahmanbaria', divisionId: 'div-chattogram', nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', lat: 23.9571, lng: 91.1119 },
  { id: 'dist-chandpur', divisionId: 'div-chattogram', nameEn: 'Chandpur', nameBn: 'চাঁদপুর', lat: 23.2333, lng: 90.6667 },
  { id: 'dist-feni', divisionId: 'div-chattogram', nameEn: 'Feni', nameBn: 'ফেনী', lat: 23.0159, lng: 91.3976 },
  { id: 'dist-lakshmipur', divisionId: 'div-chattogram', nameEn: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', lat: 22.9425, lng: 90.8412 },
  { id: 'dist-noakhali', divisionId: 'div-chattogram', nameEn: 'Noakhali', nameBn: 'নোয়াখালী', lat: 22.8696, lng: 91.0994 },
  { id: 'dist-bandarban', divisionId: 'div-chattogram', nameEn: 'Bandarban', nameBn: 'বান্দরবান', lat: 22.1953, lng: 92.2184 },
  { id: 'dist-khagrachhari', divisionId: 'div-chattogram', nameEn: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', lat: 23.1193, lng: 91.9847 },
  { id: 'dist-rangamati', divisionId: 'div-chattogram', nameEn: 'Rangamati', nameBn: 'রাঙ্গামাটি', lat: 22.7324, lng: 92.2985 },

  // Rajshahi Division
  { id: 'dist-rajshahi', divisionId: 'div-rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী', lat: 24.3745, lng: 88.6042 },
  { id: 'dist-bogura', divisionId: 'div-rajshahi', nameEn: 'Bogura', nameBn: 'বগুড়া', lat: 24.8465, lng: 89.3770 },
  { id: 'dist-pabna', divisionId: 'div-rajshahi', nameEn: 'Pabna', nameBn: 'পাবনা', lat: 24.0064, lng: 89.2372 },
  { id: 'dist-sirajganj', divisionId: 'div-rajshahi', nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', lat: 24.4534, lng: 89.7008 },
  { id: 'dist-naogaon', divisionId: 'div-rajshahi', nameEn: 'Naogaon', nameBn: 'নওগাঁ', lat: 24.7936, lng: 88.9318 },
  { id: 'dist-natore', divisionId: 'div-rajshahi', nameEn: 'Natore', nameBn: 'নাটোর', lat: 24.4206, lng: 89.0003 },
  { id: 'dist-chapai-nawabganj', divisionId: 'div-rajshahi', nameEn: 'Chapai Nawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', lat: 24.5965, lng: 88.2775 },
  { id: 'dist-joypurhat', divisionId: 'div-rajshahi', nameEn: 'Joypurhat', nameBn: 'জয়পুরহাট', lat: 25.1015, lng: 89.0277 },

  // Khulna Division
  { id: 'dist-khulna', divisionId: 'div-khulna', nameEn: 'Khulna', nameBn: 'খুলনা', lat: 22.8456, lng: 89.5403 },
  { id: 'dist-jashore', divisionId: 'div-khulna', nameEn: 'Jashore', nameBn: 'যশোর', lat: 23.1664, lng: 89.2081 },
  { id: 'dist-kushtia', divisionId: 'div-khulna', nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া', lat: 23.9013, lng: 89.1204 },
  { id: 'dist-satkhira', divisionId: 'div-khulna', nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা', lat: 22.7185, lng: 89.0705 },
  { id: 'dist-bagerhat', divisionId: 'div-khulna', nameEn: 'Bagerhat', nameBn: 'বাগেরহাট', lat: 22.6516, lng: 89.7859 },
  { id: 'dist-chuadanga', divisionId: 'div-khulna', nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', lat: 23.6402, lng: 88.8418 },
  { id: 'dist-jhenaidah', divisionId: 'div-khulna', nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ', lat: 23.5450, lng: 89.1726 },
  { id: 'dist-magura', divisionId: 'div-khulna', nameEn: 'Magura', nameBn: 'মাগুরা', lat: 23.4873, lng: 89.4199 },
  { id: 'dist-meherpur', divisionId: 'div-khulna', nameEn: 'Meherpur', nameBn: 'মেহেরপুর', lat: 23.7622, lng: 88.6318 },
  { id: 'dist-narail', divisionId: 'div-khulna', nameEn: 'Narail', nameBn: 'নড়াইল', lat: 23.1725, lng: 89.5127 },

  // Barishal Division
  { id: 'dist-barishal', divisionId: 'div-barishal', nameEn: 'Barishal', nameBn: 'বরিশাল', lat: 22.7010, lng: 90.3535 },
  { id: 'dist-bhola', divisionId: 'div-barishal', nameEn: 'Bhola', nameBn: 'ভোলা', lat: 22.6859, lng: 90.6481 },
  { id: 'dist-patuakhali', divisionId: 'div-barishal', nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী', lat: 22.3596, lng: 90.3299 },
  { id: 'dist-pirojpur', divisionId: 'div-barishal', nameEn: 'Pirojpur', nameBn: 'পিরোজপুর', lat: 22.5841, lng: 89.9720 },
  { id: 'dist-barguna', divisionId: 'div-barishal', nameEn: 'Barguna', nameBn: 'বরগুনা', lat: 22.1570, lng: 90.1264 },
  { id: 'dist-jhalokathi', divisionId: 'div-barishal', nameEn: 'Jhalokathi', nameBn: 'ঝালকাঠি', lat: 22.6406, lng: 90.1987 },

  // Rangpur Division
  { id: 'dist-rangpur', divisionId: 'div-rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর', lat: 25.7439, lng: 89.2752 },
  { id: 'dist-dinajpur', divisionId: 'div-rangpur', nameEn: 'Dinajpur', nameBn: 'দিনাজপুর', lat: 25.6217, lng: 88.6355 },
  { id: 'dist-gaibandha', divisionId: 'div-rangpur', nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা', lat: 25.3288, lng: 89.5404 },
  { id: 'dist-kurigram', divisionId: 'div-rangpur', nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম', lat: 25.8054, lng: 89.6362 },
  { id: 'dist-lalmonirhat', divisionId: 'div-rangpur', nameEn: 'Lalmonirhat', nameBn: 'লালমনিরহাট', lat: 25.9923, lng: 89.2847 },
  { id: 'dist-nilphamari', divisionId: 'div-rangpur', nameEn: 'Nilphamari', nameBn: 'নীলফামারী', lat: 25.9318, lng: 88.8560 },
  { id: 'dist-panchagarh', divisionId: 'div-rangpur', nameEn: 'Panchagarh', nameBn: 'পঞ্চগড়', lat: 26.3411, lng: 88.5542 },
  { id: 'dist-thakurgaon', divisionId: 'div-rangpur', nameEn: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', lat: 26.0337, lng: 88.4617 },

  // Mymensingh Division
  { id: 'dist-mymensingh', divisionId: 'div-mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ', lat: 24.7471, lng: 90.4203 },
  { id: 'dist-jamalpur', divisionId: 'div-mymensingh', nameEn: 'Jamalpur', nameBn: 'জামালপুর', lat: 24.9375, lng: 89.9378 },
  { id: 'dist-netrokona', divisionId: 'div-mymensingh', nameEn: 'Netrokona', nameBn: 'নেত্রকোণা', lat: 24.8709, lng: 90.7279 },
  { id: 'dist-sherpur', divisionId: 'div-mymensingh', nameEn: 'Sherpur', nameBn: 'শেরপুর', lat: 25.0205, lng: 90.0153 },
];

export const BANGLADESH_UPAZILAS: GeoUpazila[] = [
  // Moulvibazar Upazilas
  { id: 'upz-moulvibazar-sadar', districtId: 'dist-moulvibazar', nameEn: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর' },
  { id: 'upz-sreemangal', districtId: 'dist-moulvibazar', nameEn: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
  { id: 'upz-kamalganj', districtId: 'dist-moulvibazar', nameEn: 'Kamalganj', nameBn: 'কমলগঞ্জ' },
  { id: 'upz-kulaura', districtId: 'dist-moulvibazar', nameEn: 'Kulaura', nameBn: 'কুলাউড়া' },
  { id: 'upz-barlekha', districtId: 'dist-moulvibazar', nameEn: 'Barlekha', nameBn: 'বড়লেখা' },
  { id: 'upz-rajnagar', districtId: 'dist-moulvibazar', nameEn: 'Rajnagar', nameBn: 'রাজনগর' },
  { id: 'upz-juri', districtId: 'dist-moulvibazar', nameEn: 'Juri', nameBn: 'জুড়ী' },

  // Sylhet Upazilas
  { id: 'upz-sylhet-sadar', districtId: 'dist-sylhet', nameEn: 'Sylhet Sadar', nameBn: 'সিলেট সদর' },
  { id: 'upz-beanibazar', districtId: 'dist-sylhet', nameEn: 'Beanibazar', nameBn: 'বিয়ানীবাজার' },
  { id: 'upz-golapganj', districtId: 'dist-sylhet', nameEn: 'Golapganj', nameBn: 'গোলাপগঞ্জ' },
  { id: 'upz-osmani-nagar', districtId: 'dist-sylhet', nameEn: 'Osmani Nagar', nameBn: 'ওসমানী নগর' },
  { id: 'upz-biswanath', districtId: 'dist-sylhet', nameEn: 'Biswanath', nameBn: 'বিশ্বনাথ' },

  // Dhaka Major Zones / Upazilas
  { id: 'upz-dhanmondi', districtId: 'dist-dhaka', nameEn: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
  { id: 'upz-gulshan', districtId: 'dist-dhaka', nameEn: 'Gulshan / Banani', nameBn: 'গুলশান / বনানী' },
  { id: 'upz-uttara', districtId: 'dist-dhaka', nameEn: 'Uttara', nameBn: 'উত্তরা' },
  { id: 'upz-mirpur', districtId: 'dist-dhaka', nameEn: 'Mirpur', nameBn: 'মিরপুর' },
  { id: 'upz-motijheel', districtId: 'dist-dhaka', nameEn: 'Motijheel / Old Dhaka', nameBn: 'মতিঝিল / পুরান ঢাকা' },
  { id: 'upz-savar', districtId: 'dist-dhaka', nameEn: 'Savar', nameBn: 'সাভার' },

  // Chattogram Major Zones
  { id: 'upz-panchlaish', districtId: 'dist-chattogram', nameEn: 'Panchlaish', nameBn: 'পাঁচলাইশ' },
  { id: 'upz-kotwali-ctg', districtId: 'dist-chattogram', nameEn: 'Kotwali', nameBn: 'কোতোয়ালী' },
  { id: 'upz-halishahar', districtId: 'dist-chattogram', nameEn: 'Halishahar', nameBn: 'হালিশহর' },
];

/**
 * Calculates Haversine distance in Kilometers between two coordinates
 */
export function calculateGeoDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Search locations across Divisions, Districts and Upazilas in English and Bangla
 */
export function searchBangladeshLocations(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { districts: BANGLADESH_DISTRICTS, divisions: BANGLADESH_DIVISIONS };

  const matchedDistricts = BANGLADESH_DISTRICTS.filter(
    (d) =>
      d.nameEn.toLowerCase().includes(q) ||
      d.nameBn.includes(q)
  );

  const matchedUpazilas = BANGLADESH_UPAZILAS.filter(
    (u) =>
      u.nameEn.toLowerCase().includes(q) ||
      u.nameBn.includes(q)
  );

  return {
    districts: matchedDistricts,
    upazilas: matchedUpazilas,
  };
}
