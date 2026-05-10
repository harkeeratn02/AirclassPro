export interface Airport {
  icao: string;
  name: string;
  city: string;
  country: string;
}

export interface CountryGroup {
  country: string;
  airports: Airport[];
}

export const PRIORITY_AIRPORTS: CountryGroup[] = [
  {
    country: "INDIA",
    airports: [
      { icao: "VABB", name: "Chhatrapati Shivaji Maharaj", city: "Mumbai", country: "India" },
      { icao: "VIDP", name: "Indira Gandhi International", city: "Delhi", country: "India" },
      { icao: "VOBL", name: "Kempegowda International", city: "Bangalore", country: "India" },
      { icao: "VOMM", name: "Chennai International", city: "Chennai", country: "India" },
      { icao: "VECC", name: "Netaji Subhash Chandra Bose", city: "Kolkata", country: "India" },
      { icao: "VOHS", name: "Rajiv Gandhi International", city: "Hyderabad", country: "India" },
    ]
  },
  {
    country: "SRI LANKA",
    airports: [
      { icao: "VCBI", name: "Bandaranaike International", city: "Colombo", country: "Sri Lanka" },
      { icao: "VCCJ", name: "Jaffna Palaly", city: "Jaffna", country: "Sri Lanka" },
      { icao: "VCCB", name: "Batticaloa", city: "Batticaloa", country: "Sri Lanka" },
      { icao: "VCCA", name: "Ampara", city: "Ampara", country: "Sri Lanka" },
      { icao: "VCCG", name: "Sigiriya", city: "Sigiriya", country: "Sri Lanka" },
      { icao: "VCCT", name: "Trincomalee China Bay", city: "Trincomalee", country: "Sri Lanka" },
      { icao: "VCCW", name: "Weerawila", city: "Weerawila", country: "Sri Lanka" },
      { icao: "VCCK", name: "Koggala", city: "Koggala", country: "Sri Lanka" },
    ]
  },
  {
    country: "PHILIPPINES",
    airports: [
      { icao: "RPLL", name: "Ninoy Aquino International", city: "Manila", country: "Philippines" },
      { icao: "RPVM", name: "Mactan International", city: "Cebu", country: "Philippines" },
      { icao: "RPVD", name: "Francisco Bangoy", city: "Davao", country: "Philippines" },
      { icao: "RPMP", name: "Zamboanga International", city: "Zamboanga", country: "Philippines" },
      { icao: "RPMR", name: "General Santos", city: "General Santos", country: "Philippines" },
      { icao: "RPLI", name: "Laoag International", city: "Laoag", country: "Philippines" },
      { icao: "RPVB", name: "Bacolod Silay", city: "Bacolod", country: "Philippines" },
      { icao: "RPVI", name: "Iloilo International", city: "Iloilo", country: "Philippines" },
      { icao: "RPVK", name: "Kalibo International", city: "Kalibo", country: "Philippines" },
      { icao: "RPLC", name: "Clark International", city: "Clark", country: "Philippines" },
      { icao: "RPUB", name: "Butuan", city: "Butuan", country: "Philippines" },
      { icao: "RPMD", name: "Davao", city: "Davao", country: "Philippines" },
      { icao: "RPMZ", name: "Zamboanga", city: "Zamboanga", country: "Philippines" },
    ]
  },
  {
    country: "SOUTH AFRICA",
    airports: [
      { icao: "FAOR", name: "OR Tambo International", city: "Johannesburg", country: "South Africa" },
      { icao: "FACT", name: "Cape Town International", city: "Cape Town", country: "South Africa" },
      { icao: "FALE", name: "King Shaka International", city: "Durban", country: "South Africa" },
      { icao: "FABL", name: "Bloemfontein", city: "Bloemfontein", country: "South Africa" },
      { icao: "FAPE", name: "Port Elizabeth", city: "Port Elizabeth", country: "South Africa" },
      { icao: "FAGM", name: "Rand Airport", city: "Johannesburg", country: "South Africa" },
      { icao: "FAGG", name: "George Airport", city: "George", country: "South Africa" },
      { icao: "FAKN", name: "Kruger Mpumalanga", city: "Nelspruit", country: "South Africa" },
      { icao: "FAVB", name: "Vredenburg", city: "Vredenburg", country: "South Africa" },
      { icao: "FAUP", name: "Upington", city: "Upington", country: "South Africa" },
      { icao: "FANS", name: "Nelspruit Kruger", city: "Nelspruit", country: "South Africa" },
      { icao: "FAWB", name: "Wonderboom", city: "Pretoria", country: "South Africa" },
      { icao: "FABB", name: "Bram Fischer", city: "Bloemfontein", country: "South Africa" },
    ]
  },
  {
    country: "MALDIVES",
    airports: [
      { icao: "VRMM", name: "Velana International", city: "Male", country: "Maldives" },
      { icao: "VREI", name: "Gan Island", city: "Gan", country: "Maldives" },
      { icao: "VRDA", name: "Hanimaadhoo", city: "Hanimaadhoo", country: "Maldives" },
    ]
  },
  {
    country: "BANGLADESH",
    airports: [
      { icao: "VGZR", name: "Hazrat Shahjalal", city: "Dhaka", country: "Bangladesh" },
      { icao: "VGCB", name: "Shah Amanat", city: "Chittagong", country: "Bangladesh" },
      { icao: "VGSY", name: "Sylhet Osmani", city: "Sylhet", country: "Bangladesh" },
    ]
  },
  {
    country: "NEPAL",
    airports: [
      { icao: "VNKT", name: "Tribhuvan International", city: "Kathmandu", country: "Nepal" },
      { icao: "VNBW", name: "Gautam Buddha", city: "Bhairahawa", country: "Nepal" },
      { icao: "VNPK", name: "Pokhara International", city: "Pokhara", country: "Nepal" },
    ]
  },
  {
    country: "PAKISTAN",
    airports: [
      { icao: "OPKC", name: "Jinnah International", city: "Karachi", country: "Pakistan" },
      { icao: "OPLR", name: "Allama Iqbal", city: "Lahore", country: "Pakistan" },
      { icao: "OPPS", name: "Bacha Khan", city: "Peshawar", country: "Pakistan" },
    ]
  },
  {
    country: "MYANMAR",
    airports: [
      { icao: "VYYY", name: "Yangon International", city: "Yangon", country: "Myanmar" },
      { icao: "VYMN", name: "Mandalay International", city: "Mandalay", country: "Myanmar" },
    ]
  },
  {
    country: "INDONESIA",
    airports: [
      { icao: "WIII", name: "Soekarno Hatta", city: "Jakarta", country: "Indonesia" },
      { icao: "WADD", name: "Ngurah Rai", city: "Bali", country: "Indonesia" },
      { icao: "WIDD", name: "Kualanamu", city: "Medan", country: "Indonesia" },
    ]
  },
  {
    country: "THAILAND",
    airports: [
      { icao: "VTBS", name: "Suvarnabhumi", city: "Bangkok", country: "Thailand" },
      { icao: "VTBD", name: "Don Mueang", city: "Bangkok", country: "Thailand" },
      { icao: "VTSP", name: "Phuket International", city: "Phuket", country: "Thailand" },
      { icao: "VTCC", name: "Chiang Mai International", city: "Chiang Mai", country: "Thailand" },
    ]
  }
];
