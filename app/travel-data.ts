export type View =
  "home" | "tours" | "flights" | "account" | "wishlist" | "tour";
export type IconName =
  | "plane"
  | "search"
  | "pin"
  | "calendar"
  | "users"
  | "arrow"
  | "arrowLeft"
  | "chevron"
  | "heart"
  | "check"
  | "close"
  | "menu"
  | "sliders"
  | "clock"
  | "shield"
  | "headphones"
  | "globe"
  | "star"
  | "home"
  | "suitcase"
  | "mail"
  | "logout"
  | "download"
  | "swap";
export const photos = {
  hero: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=2000&q=85",
  santorini:
    "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1000&q=85",
  budapest:
    "https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?auto=format&fit=crop&w=900&q=80",
  amalfi:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  alps: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  desert:
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
  hotel:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
  coast:
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=80",
};
export type Tour = {
  id: number;
  title: string;
  location: string;
  country: string;
  category: string;
  price: number;
  days: number;
  rating: string;
  image: string;
  badge: string;
  description: string;
  itinerary: string[];
};
export const tours: Tour[] = [
  {
    id: 1,
    title: "Santorini, beyond the postcard",
    location: "Santorini, Greece",
    country: "Greece",
    category: "Beach",
    price: 189,
    days: 4,
    rating: "4.9",
    image: photos.santorini,
    badge: "Traveller favourite",
    description:
      "Whitewashed villages, volcanic beaches and sunsets that stay with you. Discover the quieter side of Santorini with a local host, a caldera cruise and plenty of time to find your own favourite view.",
    itinerary: [
      "A warm island welcome & an evening in Fira",
      "Oia’s hidden lanes & a taste of the island",
      "Sail the caldera & swim in volcanic coves",
      "A slow breakfast & one last sea view",
    ],
  },
  {
    id: 2,
    title: "Budapest: a little more local",
    location: "Budapest, Hungary",
    country: "Hungary",
    category: "Culture",
    price: 129,
    days: 3,
    rating: "4.8",
    image: photos.budapest,
    badge: "Great value",
    description:
      "From grand riverside architecture to tiny neighbourhood cafés, get to know both sides of the Danube. A relaxed city escape with a food walk, thermal baths and a golden-hour river cruise.",
    itinerary: [
      "Arrive & discover the Danube after dark",
      "Market flavours, Castle Hill & a local food walk",
      "Thermal baths & a leisurely farewell",
    ],
  },
  {
    id: 3,
    title: "Swiss Alps, a breath of fresh air",
    location: "Interlaken, Switzerland",
    country: "Switzerland",
    category: "Adventure",
    price: 329,
    days: 7,
    rating: "4.9",
    image: photos.alps,
    badge: "Small group",
    description:
      "Trade your everyday rhythm for mountain air, lakeside walks and extraordinary Alpine views. Explore the Bernese Oberland with scenic rail journeys and guided trails at an easy pace.",
    itinerary: [
      "Welcome to Interlaken",
      "Lakeside villages & turquoise waters",
      "A scenic railway into the mountains",
      "Alpine trails with your local guide",
      "A day to follow your own curiosity",
      "Mountain picnic & a farewell dinner",
      "Breakfast & your onward journey",
    ],
  },
  {
    id: 4,
    title: "Amalfi days & hidden bays",
    location: "Amalfi Coast, Italy",
    country: "Italy",
    category: "Beach",
    price: 219,
    days: 6,
    rating: "4.8",
    image: photos.amalfi,
    badge: "Sunshine escape",
    description:
      "Colourful coastal towns, lemon-scented lanes and long lunches by the sea. Settle into the rhythm of southern Italy with a local guide, a coastal boat trip and time on hidden beaches.",
    itinerary: [
      "Benvenuto to the Amalfi Coast",
      "Explore Amalfi & its lemon groves",
      "A day on the water",
      "Positano at your own pace",
      "Coastal paths & a sunset dinner",
      "Espresso, breakfast & farewell",
    ],
  },
  {
    id: 5,
    title: "Paris, one perfect weekend",
    location: "Paris, France",
    country: "France",
    category: "City break",
    price: 159,
    days: 3,
    rating: "4.8",
    image: photos.paris,
    badge: "Weekend favourite",
    description:
      "Make time for Paris. Wander through neighbourhood markets, linger over a café crème and see the city from the Seine. Iconic sights meet small local discoveries in one effortless weekend.",
    itinerary: [
      "Bonjour Paris & an evening on the Seine",
      "Montmartre, market finds & the city’s icons",
      "A bakery breakfast & a final wander",
    ],
  },
  {
    id: 6,
    title: "Wide open: the desert escape",
    location: "Arizona, USA",
    country: "USA",
    category: "Adventure",
    price: 249,
    days: 5,
    rating: "4.9",
    image: photos.desert,
    badge: "Something different",
    description:
      "Big skies, open landscapes and a new perspective. Explore Arizona’s desert scenery with guided walks, scenic stops and evenings made for stargazing.",
    itinerary: [
      "Arrive & meet your fellow explorers",
      "Desert trails & extraordinary landscapes",
      "The Grand Canyon experience",
      "A scenic drive & a night under the stars",
      "A final sunrise & farewell",
    ],
  },
];
export type Flight = {
  id: number;
  airline: string;
  code: string;
  depart: string;
  arrive: string;
  minutes: number;
  price: number;
  direct: boolean;
  color: string;
};
export const flights: Flight[] = [
  {
    id: 21,
    airline: "Turkish Airlines",
    code: "TK 1981",
    depart: "08:40",
    arrive: "14:35",
    minutes: 235,
    price: 189,
    direct: true,
    color: "#c92032",
  },
  {
    id: 22,
    airline: "British Airways",
    code: "BA 676",
    depart: "10:25",
    arrive: "16:20",
    minutes: 235,
    price: 216,
    direct: true,
    color: "#153a74",
  },
  {
    id: 23,
    airline: "Lufthansa",
    code: "LH 921",
    depart: "06:30",
    arrive: "14:10",
    minutes: 340,
    price: 174,
    direct: false,
    color: "#22385f",
  },
  {
    id: 24,
    airline: "KLM",
    code: "KL 1002",
    depart: "12:15",
    arrive: "20:05",
    minutes: 350,
    price: 198,
    direct: false,
    color: "#0078b5",
  },
  {
    id: 25,
    airline: "Pegasus",
    code: "PC 1174",
    depart: "15:40",
    arrive: "21:25",
    minutes: 225,
    price: 148,
    direct: true,
    color: "#966000",
  },
];
export const flightPlaces = [
  "Istanbul, Türkiye",
  "Paris, France",
  "Rome, Italy",
  "Barcelona, Spain",
  "Dubai, UAE",
];
export type SearchCriteria = {
  kind: "tours" | "flights";
  destination: string;
  from: string;
  date: string;
  end: string;
  adults: number;
  children: number;
  rooms: number;
};
export function futureDate(days = 30) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function defaultSearch(
  kind: "tours" | "flights" = "tours",
): SearchCriteria {
  return {
    kind,
    destination: "",
    from: "London, UK",
    date: futureDate(),
    end: futureDate(37),
    adults: 2,
    children: 0,
    rooms: 1,
  };
}
export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
export function money(n: number) {
  return `£${n.toLocaleString("en-GB")}`;
}
export type Reservation = {
  id: string;
  type: "Tour" | "Flight";
  title: string;
  subtitle: string;
  date: string;
  travellers: number;
  total: number;
  image: string;
  status: "Confirmed" | "Cancelled";
  created: string;
};
export type Draft = Omit<Reservation, "id" | "status" | "created">;
export type Profile = { name: string; email: string };
