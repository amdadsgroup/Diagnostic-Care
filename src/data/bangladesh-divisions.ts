/**
 * Diagnostic Care — Authoritative Bangladesh Administrative Hierarchy & Geodetic Data
 * Covers all 8 Administrative Divisions and 64 Districts of Bangladesh.
 * Includes precise centroid geographic coordinates (WGS-84) for offline nearest-district
 * reverse-geocoding, distance calculations (Haversine formula), and bilingual lookup.
 */

export interface AdministrativeDivision {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  capital: string;
  capitalBn: string;
  districtsCount: number;
  highlight?: boolean; // Dhaka as primary national discovery hub
}

export interface AdministrativeDistrict {
  id: string;
  divisionId: string;
  divisionSlug: string;
  nameEn: string;
  nameBn: string;
  latitude: number;
  longitude: number;
  upazilas?: string[];
}

export const BANGLADESH_DIVISIONS: AdministrativeDivision[] = [
  {
    id: 'div-dhaka',
    slug: 'dhaka',
    nameEn: 'Dhaka Division',
    nameBn: 'ঢাকা বিভাগ',
    capital: 'Dhaka',
    capitalBn: 'ঢাকা',
    districtsCount: 13,
    highlight: true,
  },
  {
    id: 'div-chattogram',
    slug: 'chattogram',
    nameEn: 'Chattogram Division',
    nameBn: 'চট্টগ্রাম বিভাগ',
    capital: 'Chattogram',
    capitalBn: 'চট্টগ্রাম',
    districtsCount: 11,
  },
  {
    id: 'div-rajshahi',
    slug: 'rajshahi',
    nameEn: 'Rajshahi Division',
    nameBn: 'রাজশাহী বিভাগ',
    capital: 'Rajshahi',
    capitalBn: 'রাজশাহী',
    districtsCount: 8,
  },
  {
    id: 'div-khulna',
    slug: 'khulna',
    nameEn: 'Khulna Division',
    nameBn: 'খুলনা বিভাগ',
    capital: 'Khulna',
    capitalBn: 'খুলনা',
    districtsCount: 10,
  },
  {
    id: 'div-barishal',
    slug: 'barishal',
    nameEn: 'Barishal Division',
    nameBn: 'বরিশাল বিভাগ',
    capital: 'Barishal',
    capitalBn: 'বরিশাল',
    districtsCount: 6,
  },
  {
    id: 'div-sylhet',
    slug: 'sylhet',
    nameEn: 'Sylhet Division',
    nameBn: 'সিলেট বিভাগ',
    capital: 'Sylhet',
    capitalBn: 'সিলেট',
    districtsCount: 4,
  },
  {
    id: 'div-rangpur',
    slug: 'rangpur',
    nameEn: 'Rangpur Division',
    nameBn: 'রংপুর বিভাগ',
    capital: 'Rangpur',
    capitalBn: 'রংপুর',
    districtsCount: 8,
  },
  {
    id: 'div-mymensingh',
    slug: 'mymensingh',
    nameEn: 'Mymensingh Division',
    nameBn: 'ময়মনসিংহ বিভাগ',
    capital: 'Mymensingh',
    capitalBn: 'ময়মনসিংহ',
    districtsCount: 4,
  },
];

export const BANGLADESH_DISTRICTS: AdministrativeDistrict[] = [
  // Dhaka Division (13)
  {
    id: 'dist-dhaka',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Dhaka',
    nameBn: 'ঢাকা',
    latitude: 23.8103,
    longitude: 90.4125,
    upazilas: ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur', 'Motijheel', 'Savar', 'Dhamrai', 'Keraniganj'],
  },
  {
    id: 'dist-gazipur',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Gazipur',
    nameBn: 'গাজীপুর',
    latitude: 23.9999,
    longitude: 90.4203,
    upazilas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj'],
  },
  {
    id: 'dist-narayanganj',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Narayanganj',
    nameBn: 'নারায়ণগঞ্জ',
    latitude: 23.6238,
    longitude: 90.5000,
    upazilas: ['Narayanganj Sadar', 'Bandar', 'Rupganj', 'Araihazar', 'Sonargaon'],
  },
  {
    id: 'dist-tangail',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Tangail',
    nameBn: 'টাঙ্গাইল',
    latitude: 24.2513,
    longitude: 89.9167,
    upazilas: ['Tangail Sadar', 'Mirzapur', 'Madhupur', 'Ghatail', 'Kalihati', 'Sakhipur', 'Bhuapur'],
  },
  {
    id: 'dist-kishoreganj',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Kishoreganj',
    nameBn: 'কিশোরগঞ্জ',
    latitude: 24.4449,
    longitude: 90.7766,
    upazilas: ['Kishoreganj Sadar', 'Bhairab', 'Bajitpur', 'Katiadi', 'Pakundia', 'Karimganj'],
  },
  {
    id: 'dist-narsingdi',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Narsingdi',
    nameBn: 'নরসিংদী',
    latitude: 23.9322,
    longitude: 90.7154,
    upazilas: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Raipura', 'Monohardi', 'Belabo'],
  },
  {
    id: 'dist-manikganj',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Manikganj',
    nameBn: 'মানিকগঞ্জ',
    latitude: 23.8617,
    longitude: 90.0003,
    upazilas: ['Manikganj Sadar', 'Singair', 'Saturia', 'Shivalaya', 'Ghior', 'Harirampur'],
  },
  {
    id: 'dist-munshiganj',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Munshiganj',
    nameBn: 'মুন্সীগঞ্জ',
    latitude: 23.5422,
    longitude: 90.5305,
    upazilas: ['Munshiganj Sadar', 'Sreenagar', 'Sirajdikhan', 'Lohajang', 'Tongibari', 'Gazaria'],
  },
  {
    id: 'dist-faridpur',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Faridpur',
    nameBn: 'ফরিদপুর',
    latitude: 23.6071,
    longitude: 89.8429,
    upazilas: ['Faridpur Sadar', 'Madhukhali', 'Boalmari', 'Bhanga', 'Nagarkanda', 'Sadarpur'],
  },
  {
    id: 'dist-gopalganj',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Gopalganj',
    nameBn: 'গোপালগঞ্জ',
    latitude: 23.0051,
    longitude: 89.8266,
    upazilas: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'],
  },
  {
    id: 'dist-madaripur',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Madaripur',
    nameBn: 'মাদারীপুর',
    latitude: 23.1641,
    longitude: 90.1897,
    upazilas: ['Madaripur Sadar', 'Shibchar', 'Kalkini', 'Rajoir'],
  },
  {
    id: 'dist-rajbari',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Rajbari',
    nameBn: 'রাজবাড়ী',
    latitude: 23.7574,
    longitude: 89.6445,
    upazilas: ['Rajbari Sadar', 'Goalanda', 'Pangsha', 'Baliakandi', 'Kalukhali'],
  },
  {
    id: 'dist-shariatpur',
    divisionId: 'div-dhaka',
    divisionSlug: 'dhaka',
    nameEn: 'Shariatpur',
    nameBn: 'শরীয়তপুর',
    latitude: 23.2423,
    longitude: 90.4348,
    upazilas: ['Shariatpur Sadar', 'Zajira', 'Naria', 'Bhedarganj', 'Damudya', 'Gosairhat'],
  },

  // Chattogram Division (11)
  {
    id: 'dist-chattogram',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    latitude: 22.3569,
    longitude: 91.7832,
    upazilas: ['Panchlaish', 'Kotwali', 'Agrabad', 'Khulshi', 'Halishahar', 'Hathazari', 'Sitakunda', 'Patiya', 'Raozan'],
  },
  {
    id: 'dist-coxsbazar',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: "Cox's Bazar",
    nameBn: 'কক্সবাজার',
    latitude: 21.4272,
    longitude: 92.0058,
    upazilas: ["Cox's Bazar Sadar", 'Ramu', 'Chakaria', 'Teknaf', 'Ukhia', 'Maheshkhali', 'Kutubdia', 'Pekua'],
  },
  {
    id: 'dist-cumilla',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: 'Cumilla',
    nameBn: 'কুমিল্লা',
    latitude: 23.4607,
    longitude: 91.1809,
    upazilas: ['Cumilla Adarsha Sadar', 'Cumilla Sadar Dakshin', 'Laksam', 'Daudkandi', 'Chandina', 'Burichang', 'Debidwar'],
  },
  {
    id: 'dist-feni',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: 'Feni',
    nameBn: 'ফেনী',
    latitude: 23.0186,
    longitude: 91.3966,
    upazilas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Sonagazi', 'Fulgazi'],
  },
  {
    id: 'dist-brahmanbaria',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: 'Brahmanbaria',
    nameBn: 'ব্রাহ্মণবাড়িয়া',
    latitude: 23.9571,
    longitude: 91.1119,
    upazilas: ['Brahmanbaria Sadar', 'Kasba', 'Nabinagar', 'Ashuganj', 'Sarail', 'Nasirnagar', 'Bancharampur'],
  },
  {
    id: 'dist-noakhali',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: 'Noakhali',
    nameBn: 'নোয়াখালী',
    latitude: 22.8696,
    longitude: 91.0998,
    upazilas: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companyganj', 'Senbagh', 'Hatiya', 'Subarnachar'],
  },
  {
    id: 'dist-chandpur',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: 'Chandpur',
    nameBn: 'চাঁদপুর',
    latitude: 23.2333,
    longitude: 90.6667,
    upazilas: ['Chandpur Sadar', 'Hajiganj', 'Matlab Dakshin', 'Matlab Uttar', 'Faridganj', 'Shahrasti', 'Kachua', 'Haimchar'],
  },
  {
    id: 'dist-lakshmipur',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: 'Lakshmipur',
    nameBn: 'লক্ষ্মীপুর',
    latitude: 22.9425,
    longitude: 90.8412,
    upazilas: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'],
  },
  {
    id: 'dist-rangamati',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: 'Rangamati',
    nameBn: 'রাঙ্গামাটি',
    latitude: 22.6533,
    longitude: 92.1753,
    upazilas: ['Rangamati Sadar', 'Kaptai', 'Kawkhali', 'Baghaichhari', 'Barkal', 'Langadu'],
  },
  {
    id: 'dist-khagrachhari',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: 'Khagrachhari',
    nameBn: 'খাগড়াছড়ি',
    latitude: 23.1193,
    longitude: 91.9847,
    upazilas: ['Khagrachhari Sadar', 'Dighinala', 'Panchhari', 'Mahalchhari', 'Matiranga', 'Manikchhari', 'Ramgarh'],
  },
  {
    id: 'dist-bandarban',
    divisionId: 'div-chattogram',
    divisionSlug: 'chattogram',
    nameEn: 'Bandarban',
    nameBn: 'বান্দরবান',
    latitude: 22.1953,
    longitude: 92.2184,
    upazilas: ['Bandarban Sadar', 'Ruma', 'Thanchi', 'Lama', 'Alikadam', 'Rowangchhari', 'Naikhongchhari'],
  },

  // Rajshahi Division (8)
  {
    id: 'dist-rajshahi',
    divisionId: 'div-rajshahi',
    divisionSlug: 'rajshahi',
    nameEn: 'Rajshahi',
    nameBn: 'রাজশাহী',
    latitude: 24.3745,
    longitude: 88.6042,
    upazilas: ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Paba', 'Godagari', 'Tanore', 'Bagmara', 'Charghat', 'Durgapur'],
  },
  {
    id: 'dist-bogura',
    divisionId: 'div-rajshahi',
    divisionSlug: 'rajshahi',
    nameEn: 'Bogura',
    nameBn: 'বগুড়া',
    latitude: 24.8465,
    longitude: 89.3777,
    upazilas: ['Bogura Sadar', 'Sherpur', 'Shibganj', 'Gabtali', 'Kahaloo', 'Dhunat', 'Sariakandi', 'Sonatala', 'Nandigram', 'Adamdighi'],
  },
  {
    id: 'dist-pabna',
    divisionId: 'div-rajshahi',
    divisionSlug: 'rajshahi',
    nameEn: 'Pabna',
    nameBn: 'পাবনা',
    latitude: 24.0064,
    longitude: 89.2372,
    upazilas: ['Pabna Sadar', 'Ishwardi', 'Sujanagar', 'Santhia', 'Chatmohar', 'Bera', 'Faridpur', 'Atgharia', 'Bhangura'],
  },
  {
    id: 'dist-sirajganj',
    divisionId: 'div-rajshahi',
    divisionSlug: 'rajshahi',
    nameEn: 'Sirajganj',
    nameBn: 'সিরাজগঞ্জ',
    latitude: 24.4534,
    longitude: 89.7008,
    upazilas: ['Sirajganj Sadar', 'Shahjadpur', 'Ullapara', 'Belkuchi', 'Kazipur', 'Kamarkhanda', 'Raiganj', 'Tarash', 'Chauhali'],
  },
  {
    id: 'dist-naogaon',
    divisionId: 'div-rajshahi',
    divisionSlug: 'rajshahi',
    nameEn: 'Naogaon',
    nameBn: 'নওগাঁ',
    latitude: 24.7937,
    longitude: 88.9318,
    upazilas: ['Naogaon Sadar', 'Patnitala', 'Mohadevpur', 'Manda', 'Badalgachhi', 'Dhamoirhat', 'Niamatpur', 'Raninagar', 'Atrai', 'Sapahar', 'Porsha'],
  },
  {
    id: 'dist-natore',
    divisionId: 'div-rajshahi',
    divisionSlug: 'rajshahi',
    nameEn: 'Natore',
    nameBn: 'নাটোর',
    latitude: 24.4206,
    longitude: 88.9324,
    upazilas: ['Natore Sadar', 'Baraigram', 'Bagatipara', 'Gurudaspur', 'Lalpur', 'Singra', 'Naldanga'],
  },
  {
    id: 'dist-chapainawabganj',
    divisionId: 'div-rajshahi',
    divisionSlug: 'rajshahi',
    nameEn: 'Chapainawabganj',
    nameBn: 'চাঁপাইনবাবগঞ্জ',
    latitude: 24.5965,
    longitude: 88.2775,
    upazilas: ['Chapainawabganj Sadar', 'Shibganj', 'Gomastapur', 'Nachole', 'Bholahat'],
  },
  {
    id: 'dist-joypurhat',
    divisionId: 'div-rajshahi',
    divisionSlug: 'rajshahi',
    nameEn: 'Joypurhat',
    nameBn: 'জয়পুরহাট',
    latitude: 25.1015,
    longitude: 89.0295,
    upazilas: ['Joypurhat Sadar', 'Panchbibi', 'Kalai', 'Khetlal', 'Akkelpur'],
  },

  // Khulna Division (10)
  {
    id: 'dist-khulna',
    divisionId: 'div-khulna',
    divisionSlug: 'khulna',
    nameEn: 'Khulna',
    nameBn: 'খুলনা',
    latitude: 22.8456,
    longitude: 89.5403,
    upazilas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Dighalia', 'Rupsha', 'Dumuria', 'Batiaghata', 'Paikgachha', 'Koyra'],
  },
  {
    id: 'dist-jashore',
    divisionId: 'div-khulna',
    divisionSlug: 'khulna',
    nameEn: 'Jashore',
    nameBn: 'যশোর',
    latitude: 23.1664,
    longitude: 89.2182,
    upazilas: ['Jashore Sadar', 'Jhikargachha', 'Sharsha', 'Manirampur', 'Keshabpur', 'Bagherpara', 'Abhaynagar', 'Chaugachha'],
  },
  {
    id: 'dist-kushtia',
    divisionId: 'div-khulna',
    divisionSlug: 'khulna',
    nameEn: 'Kushtia',
    nameBn: 'কুষ্টিয়া',
    latitude: 23.9013,
    longitude: 89.1205,
    upazilas: ['Kushtia Sadar', 'Kumarkhali', 'Bheramara', 'Mirpur', 'Daulatpur', 'Khoksa'],
  },
  {
    id: 'dist-jhenaidah',
    divisionId: 'div-khulna',
    divisionSlug: 'khulna',
    nameEn: 'Jhenaidah',
    nameBn: 'ঝিনাইদহ',
    latitude: 23.5448,
    longitude: 89.1539,
    upazilas: ['Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa', 'Harinakunda'],
  },
  {
    id: 'dist-satkhira',
    divisionId: 'div-khulna',
    divisionSlug: 'khulna',
    nameEn: 'Satkhira',
    nameBn: 'সাতক্ষীরা',
    latitude: 22.7185,
    longitude: 89.0705,
    upazilas: ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Shyamnagar', 'Tala'],
  },
  {
    id: 'dist-bagerhat',
    divisionId: 'div-khulna',
    divisionSlug: 'khulna',
    nameEn: 'Bagerhat',
    nameBn: 'বাগেরহাট',
    latitude: 22.6516,
    longitude: 89.7859,
    upazilas: ['Bagerhat Sadar', 'Mongla', 'Morrelganj', 'Fakirhat', 'Kachua', 'Mollahat', 'Rampal', 'Sarankhola', 'Chitalmari'],
  },
  {
    id: 'dist-chuadanga',
    divisionId: 'div-khulna',
    divisionSlug: 'khulna',
    nameEn: 'Chuadanga',
    nameBn: 'চুয়াডাঙ্গা',
    latitude: 23.6402,
    longitude: 88.8418,
    upazilas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'],
  },
  {
    id: 'dist-meherpur',
    divisionId: 'div-khulna',
    divisionSlug: 'khulna',
    nameEn: 'Meherpur',
    nameBn: 'মেহেরপুর',
    latitude: 23.7622,
    longitude: 88.6318,
    upazilas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar'],
  },
  {
    id: 'dist-narail',
    divisionId: 'div-khulna',
    divisionSlug: 'khulna',
    nameEn: 'Narail',
    nameBn: 'নড়াইল',
    latitude: 23.1725,
    longitude: 89.5127,
    upazilas: ['Narail Sadar', 'Lohagara', 'Kalia'],
  },
  {
    id: 'dist-magura',
    divisionId: 'div-khulna',
    divisionSlug: 'khulna',
    nameEn: 'Magura',
    nameBn: 'মাগুরা',
    latitude: 23.4873,
    longitude: 89.4198,
    upazilas: ['Magura Sadar', 'Sreepur', 'Mohammadpur', 'Shalikha'],
  },

  // Barishal Division (6)
  {
    id: 'dist-barishal',
    divisionId: 'div-barishal',
    divisionSlug: 'barishal',
    nameEn: 'Barishal',
    nameBn: 'বরিশাল',
    latitude: 22.7010,
    longitude: 90.3535,
    upazilas: ['Barishal Sadar', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gournadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
  },
  {
    id: 'dist-patuakhali',
    divisionId: 'div-barishal',
    divisionSlug: 'barishal',
    nameEn: 'Patuakhali',
    nameBn: 'পটুয়াখালী',
    latitude: 22.3596,
    longitude: 90.3299,
    upazilas: ['Patuakhali Sadar', 'Galachipa', 'Kalapara', 'Bauphal', 'Mirzaganj', 'Dumki', 'Rangabali'],
  },
  {
    id: 'dist-bhola',
    divisionId: 'div-barishal',
    divisionSlug: 'barishal',
    nameEn: 'Bhola',
    nameBn: 'ভোলা',
    latitude: 22.6859,
    longitude: 90.6482,
    upazilas: ['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'],
  },
  {
    id: 'dist-pirojpur',
    divisionId: 'div-barishal',
    divisionSlug: 'barishal',
    nameEn: 'Pirojpur',
    nameBn: 'পিরোজপুর',
    latitude: 22.5841,
    longitude: 89.9720,
    upazilas: ['Pirojpur Sadar', 'Bhandaria', 'Mathbaria', 'Kawkhali', 'Nazirpur', 'Nesarabad (Swarupkathi)', 'Indurkani'],
  },
  {
    id: 'dist-barguna',
    divisionId: 'div-barishal',
    divisionSlug: 'barishal',
    nameEn: 'Barguna',
    nameBn: 'বরগুনা',
    latitude: 22.0953,
    longitude: 90.1121,
    upazilas: ['Barguna Sadar', 'Amtali', 'Betagi', 'Patharghata', 'Bamna', 'Taltali'],
  },
  {
    id: 'dist-jhalokathi',
    divisionId: 'div-barishal',
    divisionSlug: 'barishal',
    nameEn: 'Jhalokathi',
    nameBn: 'ঝালকাঠি',
    latitude: 22.6406,
    longitude: 90.1987,
    upazilas: ['Jhalokathi Sadar', 'Kathalia', 'Nalchity', 'Rajapur'],
  },

  // Sylhet Division (4)
  {
    id: 'dist-sylhet',
    divisionId: 'div-sylhet',
    divisionSlug: 'sylhet',
    nameEn: 'Sylhet',
    nameBn: 'সিলেট',
    latitude: 24.8949,
    longitude: 91.8687,
    upazilas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Zakiganj', 'Kanaighat', 'Jaintiapur', 'Gowainghat', 'Companiganj', 'Balaganj', 'Fenchuganj', 'Osmani Nagar', 'Dakshin Surma'],
  },
  {
    id: 'dist-moulvibazar',
    divisionId: 'div-sylhet',
    divisionSlug: 'sylhet',
    nameEn: 'Moulvibazar',
    nameBn: 'মৌলভীবাজার',
    latitude: 24.4829,
    longitude: 91.7774,
    upazilas: ['Moulvibazar Sadar', 'Sreemangal', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Barlekha', 'Juri'],
  },
  {
    id: 'dist-habiganj',
    divisionId: 'div-sylhet',
    divisionSlug: 'sylhet',
    nameEn: 'Habiganj',
    nameBn: 'হবিগঞ্জ',
    latitude: 24.3749,
    longitude: 91.4155,
    upazilas: ['Habiganj Sadar', 'Nabiganj', 'Bahubal', 'Madhabpur', 'Chunarughat', 'Baniyachong', 'Lakhai', 'Ajmiriganj', 'Sayestaganj'],
  },
  {
    id: 'dist-sunamganj',
    divisionId: 'div-sylhet',
    divisionSlug: 'sylhet',
    nameEn: 'Sunamganj',
    nameBn: 'সুনামগঞ্জ',
    latitude: 25.0658,
    longitude: 91.3950,
    upazilas: ['Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Derai', 'Dharampasha', 'Tahirpur', 'Bishwamvarpur', 'Jamalganj', 'Shantiganj', 'Doarabazar'],
  },

  // Rangpur Division (8)
  {
    id: 'dist-rangpur',
    divisionId: 'div-rangpur',
    divisionSlug: 'rangpur',
    nameEn: 'Rangpur',
    nameBn: 'রংপুর',
    latitude: 25.7439,
    longitude: 89.2752,
    upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachhara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
  },
  {
    id: 'dist-dinajpur',
    divisionId: 'div-rangpur',
    divisionSlug: 'rangpur',
    nameEn: 'Dinajpur',
    nameBn: 'দিনাজপুর',
    latitude: 25.6217,
    longitude: 88.6355,
    upazilas: ['Dinajpur Sadar', 'Birganj', 'Biral', 'Birol', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur'],
  },
  {
    id: 'dist-gaibandha',
    divisionId: 'div-rangpur',
    divisionSlug: 'rangpur',
    nameEn: 'Gaibandha',
    nameBn: 'গাইবান্ধা',
    latitude: 25.3288,
    longitude: 89.5430,
    upazilas: ['Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj', 'Fulchhari'],
  },
  {
    id: 'dist-kurigram',
    divisionId: 'div-rangpur',
    divisionSlug: 'rangpur',
    nameEn: 'Kurigram',
    nameBn: 'কুড়িগ্রাম',
    latitude: 25.8054,
    longitude: 89.6362,
    upazilas: ['Kurigram Sadar', 'Nageshwari', 'Bhurungamari', 'Ulipur', 'Chilmari', 'Rajarhat', 'Rajibpur', 'Rowmari', 'Phulbari'],
  },
  {
    id: 'dist-lalmonirhat',
    divisionId: 'div-rangpur',
    divisionSlug: 'rangpur',
    nameEn: 'Lalmonirhat',
    nameBn: 'লালমনিরহাট',
    latitude: 25.9923,
    longitude: 89.2847,
    upazilas: ['Lalmonirhat Sadar', 'Aditmari', 'Kaliganj', 'Hatibandha', 'Patgram'],
  },
  {
    id: 'dist-nilphamari',
    divisionId: 'div-rangpur',
    divisionSlug: 'rangpur',
    nameEn: 'Nilphamari',
    nameBn: 'নীলফামারী',
    latitude: 25.9318,
    longitude: 88.8560,
    upazilas: ['Nilphamari Sadar', 'Saidpur', 'Domar', 'Dimla', 'Jaldhaka', 'Kishoreganj'],
  },
  {
    id: 'dist-panchagarh',
    divisionId: 'div-rangpur',
    divisionSlug: 'rangpur',
    nameEn: 'Panchagarh',
    nameBn: 'পঞ্চগড়',
    latitude: 26.3411,
    longitude: 88.5542,
    upazilas: ['Panchagarh Sadar', 'Boda', 'Debiganj', 'Tetulia', 'Atwari'],
  },
  {
    id: 'dist-thakurgaon',
    divisionId: 'div-rangpur',
    divisionSlug: 'rangpur',
    nameEn: 'Thakurgaon',
    nameBn: 'ঠাকুরগাঁও',
    latitude: 26.0337,
    longitude: 88.4617,
    upazilas: ['Thakurgaon Sadar', 'Pirganj', 'Ranisankail', 'Baliadangi', 'Haripur'],
  },

  // Mymensingh Division (4)
  {
    id: 'dist-mymensingh',
    divisionId: 'div-mymensingh',
    divisionSlug: 'mymensingh',
    nameEn: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    latitude: 24.7471,
    longitude: 90.4203,
    upazilas: ['Mymensingh Sadar', 'Muktagachha', 'Fulbaria', 'Trishal', 'Bhaluka', 'Gafargaon', 'Haluaghat', 'Dhobaura', 'Ishwarganj', 'Nandail', 'Gouripur', 'Tara Khanda'],
  },
  {
    id: 'dist-jamalpur',
    divisionId: 'div-mymensingh',
    divisionSlug: 'jamalpur',
    nameEn: 'Jamalpur',
    nameBn: 'জামালপুর',
    latitude: 24.9375,
    longitude: 89.9378,
    upazilas: ['Jamalpur Sadar', 'Sarishabari', 'Melandaha', 'Islampur', 'Dewanganj', 'Madarganj', 'Bakshiganj'],
  },
  {
    id: 'dist-netrokona',
    divisionId: 'div-mymensingh',
    divisionSlug: 'netrokona',
    nameEn: 'Netrokona',
    nameBn: 'নেত্রকোণা',
    latitude: 24.8709,
    longitude: 90.7279,
    upazilas: ['Netrokona Sadar', 'Kendua', 'Atpara', 'Barhatta', 'Kalmakanda', 'Durgapur', 'Mohanganj', 'Madan', 'Khaliajuri', 'Purbadhala'],
  },
  {
    id: 'dist-sherpur',
    divisionId: 'div-mymensingh',
    divisionSlug: 'sherpur',
    nameEn: 'Sherpur',
    nameBn: 'শেরপুর',
    latitude: 25.0205,
    longitude: 90.0153,
    upazilas: ['Sherpur Sadar', 'Nalitabari', 'Nakla', 'Jhenaigati', 'Sreebardi'],
  },
];

/**
 * High-performance Haversine distance calculator between two WGS-84 coordinate points.
 * Returns distance in kilometers rounded to 1 decimal place.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!isCoordinateValid(lat1, lon1) || !isCoordinateValid(lat2, lon2)) {
    return 0;
  }
  const R = 6371; // Earth's mean radius in kilometers
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
 * Validates that latitude and longitude are finite numbers within valid geographic limits.
 */
export function isCoordinateValid(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Checks if coordinates fall within Bangladesh regional bounding box.
 * (Approx: Lat 20.5° N - 26.7° N, Lon 88.0° E - 92.7° E)
 */
export function isCoordinateInBangladesh(lat: number, lng: number): boolean {
  if (!isCoordinateValid(lat, lng)) return false;
  return lat >= 20.5 && lat <= 26.7 && lng >= 88.0 && lng <= 92.7;
}

/**
 * Finds the nearest administrative district from given GPS coordinates.
 */
export function findNearestDistrict(
  lat: number,
  lng: number
): { district: AdministrativeDistrict; distanceKm: number } {
  let nearestDistrict = BANGLADESH_DISTRICTS[0];
  let minDistance = calculateHaversineDistanceKm(
    lat,
    lng,
    nearestDistrict.latitude,
    nearestDistrict.longitude
  );

  for (let i = 1; i < BANGLADESH_DISTRICTS.length; i++) {
    const d = BANGLADESH_DISTRICTS[i];
    const dist = calculateHaversineDistanceKm(lat, lng, d.latitude, d.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearestDistrict = d;
    }
  }

  return { district: nearestDistrict, distanceKm: minDistance };
}

/**
 * Lookup district by name (English or Bangla, case-insensitive).
 */
export function getDistrictByName(name: string): AdministrativeDistrict | undefined {
  if (!name) return undefined;
  const q = name.toLowerCase().trim();
  return BANGLADESH_DISTRICTS.find(
    (d) =>
      d.nameEn.toLowerCase() === q ||
      d.nameBn === q ||
      d.id === q ||
      q.includes(d.nameEn.toLowerCase())
  );
}

/**
 * Get centroid coordinates for a district name.
 */
export function getDistrictCentroid(
  districtName: string
): { latitude: number; longitude: number } | null {
  const d = getDistrictByName(districtName);
  return d ? { latitude: d.latitude, longitude: d.longitude } : null;
}

export function getDivisionBySlug(slug: string): AdministrativeDivision | undefined {
  const normalized = slug.toLowerCase().trim();
  return BANGLADESH_DIVISIONS.find(
    (d) => d.slug === normalized || d.nameEn.toLowerCase() === normalized
  );
}

export function getDistrictsForDivision(divisionSlugOrId: string): AdministrativeDistrict[] {
  const normalized = divisionSlugOrId.toLowerCase().trim();
  return BANGLADESH_DISTRICTS.filter(
    (d) => d.divisionSlug === normalized || d.divisionId === normalized
  );
}

/**
 * Formats distance with localized units.
 */
export function formatDistance(distanceKm: number, language: 'en' | 'bn'): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      const str = meters.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
      return `${str} মিটার`;
    }
    return `${meters} m`;
  }
  if (language === 'bn') {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const str = distanceKm.toFixed(1).replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
    return `${str} কিমি`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
