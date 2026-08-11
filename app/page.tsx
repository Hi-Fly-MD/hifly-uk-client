"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type View = "home" | "tours" | "flights" | "account";
type Booking = { id: string; type: "Tour" | "Flight"; title: string; date: string; price: number; status: string; image: string };

const images = {
  hero: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=2000&q=85",
  lake: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
  budapest: "https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?auto=format&fit=crop&w=1000&q=80",
  resort: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
  canyon: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80",
  city: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
  boat: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=80",
  mountains: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1000&q=80",
};

const tours = [
  { id: 1, title: "Santorini Sunset & Caldera Cruise", location: "Santorini, Greece", price: 189, days: 4, rating: 4.9, image: images.resort, badge: "Top rated" },
  { id: 2, title: "Budapest Food, Culture & Danube", location: "Budapest, Hungary", price: 129, days: 3, rating: 4.8, image: images.budapest, badge: "Best sale" },
  { id: 3, title: "Grand Canyon & Desert Escape", location: "Arizona, USA", price: 249, days: 5, rating: 4.9, image: images.canyon, badge: "-20%" },
  { id: 4, title: "Amalfi Coast Hidden Beaches", location: "Amalfi, Italy", price: 219, days: 6, rating: 4.7, image: images.beach, badge: "New" },
  { id: 5, title: "Swiss Alps Panorama Journey", location: "Interlaken, Switzerland", price: 329, days: 7, rating: 4.9, image: images.mountains, badge: "Best sale" },
  { id: 6, title: "Paris Weekend & Seine Cruise", location: "Paris, France", price: 159, days: 3, rating: 4.8, image: images.city, badge: "Popular" },
];

const flights = [
  { id: 21, airline: "Turkish Airlines", code: "TK 1981", from: "London (LHR)", to: "Istanbul (IST)", depart: "08:40", arrive: "14:35", duration: "3h 55m", price: 189, stops: "Direct", color: "#e51b2b" },
  { id: 22, airline: "British Airways", code: "BA 676", from: "London (LHR)", to: "Istanbul (IST)", depart: "10:25", arrive: "16:20", duration: "3h 55m", price: 216, stops: "Direct", color: "#163f77" },
  { id: 23, airline: "Lufthansa", code: "LH 921", from: "London (LHR)", to: "Istanbul (IST)", depart: "06:30", arrive: "14:10", duration: "5h 40m", price: 174, stops: "1 stop", color: "#f5c400" },
  { id: 24, airline: "KLM", code: "KL 1002", from: "London (LHR)", to: "Istanbul (IST)", depart: "12:15", arrive: "20:05", duration: "5h 50m", price: 198, stops: "1 stop", color: "#00a1df" },
  { id: 25, airline: "Pegasus", code: "PC 1174", from: "London (STN)", to: "Istanbul (SAW)", depart: "15:40", arrive: "21:25", duration: "3h 45m", price: 148, stops: "Direct", color: "#f7a600" },
];

const categories = [
  ["Mountain", images.mountains], ["Safari", images.canyon], ["Beach", images.beach], ["City break", images.city],
] as const;

function SearchBox({ onSearch, compact = false }: { onSearch: (kind: View) => void; compact?: boolean }) {
  const [tab, setTab] = useState<"tours" | "flights">("tours");
  return <div className={`searchbox ${compact ? "compact" : ""}`}>
    {!compact && <div className="search-tabs"><button className={tab === "tours" ? "active" : ""} onClick={() => setTab("tours")}>Tours</button><button className={tab === "flights" ? "active" : ""} onClick={() => setTab("flights")}>Flights</button></div>}
    <div className="search-fields">
      <label><span>{tab === "flights" ? "From" : "Destination"}</span><b>⌖ {tab === "flights" ? "London, UK" : "Where do you want to go?"}</b></label>
      {tab === "flights" && <label><span>To</span><b>⌖ Istanbul, Türkiye</b></label>}
      <label><span>Check in</span><b>▣ 18 September 2026</b></label>
      <label><span>{tab === "flights" ? "Return" : "Check out"}</span><b>▣ 25 September 2026</b></label>
      <label><span>Guests</span><b>♙ 2 adults, 1 room</b></label>
      <button className="btn dark search-btn" onClick={() => onSearch(tab)}>Search</button>
    </div>
  </div>;
}

function TourCard({ tour, onBook }: { tour: typeof tours[number]; onBook: (t: typeof tours[number]) => void }) {
  return <article className="tour-card">
    <div className="card-img" style={{ backgroundImage: `url(${tour.image})` }}><span className="badge">{tour.badge}</span><button className="heart" aria-label="Add to wishlist">♡</button></div>
    <div className="card-body"><div className="rating">★ {tour.rating} <small>(127 reviews)</small></div><h3>{tour.title}</h3><p>⌖ {tour.location}</p><div className="trip-meta"><span>◷ {tour.days} days</span><span>✓ Free cancellation</span></div><div className="price-row"><strong>£{tour.price}<small>/person</small></strong><button className="btn small" onClick={() => onBook(tour)}>Book now</button></div></div>
  </article>;
}

function Header({ view, setView, user, onLogin }: { view: View; setView: (v: View) => void; user: string; onLogin: () => void }) {
  const [open, setOpen] = useState(false);
  const go = (v: View) => { setView(v); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <><div className="topbar">✦ Unlock the magic of travel with Hi-Fly <span>Get this now →</span></div><header>
    <button className="logo" onClick={() => go("home")}><img src="/logo.png" alt="Hi-Fly" /></button>
    <nav className={open ? "open" : ""}>{[["home","Home"],["tours","Tours"],["flights","Flights"],["account","My bookings"]].map(([v,l]) => <button key={v} className={view===v ? "active" : ""} onClick={() => go(v as View)}>{l}</button>)}</nav>
    <div className="header-actions"><span>EN · GBP</span><button className="btn outline" onClick={user ? () => go("account") : onLogin}>{user ? `Hi, ${user}` : "Sign in"}</button><button className="menu" onClick={() => setOpen(!open)}>☰</button></div>
  </header></>;
}

function Footer({ setView }: { setView: (v: View) => void }) {
  return <footer><div className="photo-strip">{[images.city,images.boat,images.mountains,images.beach,images.canyon,images.resort].map((im,i)=><div key={i} style={{backgroundImage:`url(${im})`}} />)}</div><div className="footer-grid"><div><img src="/logo.png" alt="Hi-Fly" className="footer-logo"/><p>Travel carefully curated for authentic, unforgettable experiences.</p><strong className="accent">+44 7911 123456</strong></div><div><b>Explore</b><button onClick={()=>setView("tours")}>Tours</button><button onClick={()=>setView("flights")}>Flights</button><button>Destinations</button></div><div><b>Support</b><button>Help center</button><button>Terms & privacy</button><button>Contact us</button></div><div><b>Newsletter</b><p>Offers worth packing for.</p><div className="newsletter"><input placeholder="Your email"/><button>Subscribe</button></div></div></div><div className="copyright">© 2026 Hi-Fly. UI demonstration only. <span>Instagram · Facebook · TikTok</span></div></footer>;
}

function Home({ setView, onBook }: { setView:(v:View)=>void; onBook:(t:typeof tours[number])=>void }) {
  return <main><section className="hero" style={{backgroundImage:`linear-gradient(90deg,rgba(4,14,16,.65),rgba(4,14,16,.05)),url(${images.hero})`}}><div className="hero-content"><span className="eyebrow">DISCOVER THE WORLD</span><h1>Unleash your wanderlust.<br/>Book your next <em>journey.</em></h1><p>Exceptional escapes and easier flights, carefully brought together in one place.</p></div></section><div className="floating-search"><SearchBox onSearch={setView}/></div>
    <section className="section"><div className="section-head"><div><span className="kicker">HANDPICKED FOR YOU</span><h2>Our featured tours</h2><p>Favourite destinations, selected from traveller reviews.</p></div><button className="btn outline" onClick={()=>setView("tours")}>View all tours →</button></div><div className="cards three">{tours.slice(0,3).map(t=><TourCard key={t.id} tour={t} onBook={onBook}/>)}</div></section>
    <section className="section"><div className="section-head"><div><h2>Explore your way</h2><p>More than a destination — choose the feeling.</p></div></div><div className="categories">{categories.map(([n,im])=><button key={n} onClick={()=>setView("tours")} style={{backgroundImage:`linear-gradient(0deg,rgba(0,0,0,.62),transparent),url(${im})`}}><b>{n}</b><span>24 experiences →</span></button>)}</div></section>
    <section className="promo section"><div><span className="eyebrow">FLY FURTHER</span><h2>One search. Hundreds of routes.</h2><p>Compare mock fares, choose your ideal flight and see the complete booking journey.</p><button className="btn dark" onClick={()=>setView("flights")}>Search flights →</button></div><div className="promo-collage"><div style={{backgroundImage:`url(${images.city})`}}/><div style={{backgroundImage:`url(${images.beach})`}}/><div style={{backgroundImage:`url(${images.boat})`}}/></div></section>
    <section className="why"><div className="section"><div className="center"><span className="kicker">TRAVEL WITH CONFIDENCE</span><h2>Why travel with us?</h2></div><div className="benefits">{[["✦","Curated escapes","Only places and experiences we would recommend."],["↻","Flexible planning","Clear changes and cancellation information."],["♢","Everything together","Tours and flights inside the same simple account."],["☏","Human support","Friendly guidance throughout your journey."]].map(x=><div key={x[1]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div></div></section>
  </main>;
}

function Tours({ onBook }: { onBook:(t:typeof tours[number])=>void }) {
  const [query,setQuery]=useState(""); const [max,setMax]=useState(350); const [sort,setSort]=useState("featured");
  const filtered=useMemo(()=>tours.filter(t=>t.price<=max && (t.title+t.location).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==="price"?a.price-b.price:b.rating-a.rating),[query,max,sort]);
  return <main><section className="listing-hero"><div><span className="kicker">MEMORIES START HERE</span><h1>Find your next great escape</h1><p>Small details, beautiful places, effortless booking.</p></div><SearchBox compact onSearch={()=>{}}/></section><section className="section listing"><aside><div className="filter-title"><b>Filters</b><button onClick={()=>{setQuery("");setMax(350)}}>Clear</button></div><label className="filter"><span>Search destination</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. Greece"/></label><label className="filter"><span>Maximum price: £{max}</span><input type="range" min="120" max="350" value={max} onChange={e=>setMax(+e.target.value)}/></label><div className="filter"><span>Experience</span>{["Adventure","Beach","City break","Culture"].map(x=><label className="check" key={x}><input type="checkbox"/> {x}</label>)}</div><div className="filter"><span>Duration</span>{["1–3 days","4–6 days","7+ days"].map(x=><label className="check" key={x}><input type="checkbox"/> {x}</label>)}</div></aside><div className="results"><div className="results-head"><b>{filtered.length} tours found</b><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Top rated</option><option value="price">Lowest price</option></select></div><div className="cards two">{filtered.map(t=><TourCard key={t.id} tour={t} onBook={onBook}/>)}</div>{!filtered.length&&<div className="empty"><span>⌕</span><h3>No escapes found</h3><p>Try another destination or price range.</p></div>}</div></section></main>;
}

function Flights({ onBook }: { onBook:(f:typeof flights[number])=>void }) {
  const [direct,setDirect]=useState(false); const [sort,setSort]=useState("best");
  const shown=useMemo(()=>flights.filter(f=>!direct||f.stops==="Direct").sort((a,b)=>sort==="price"?a.price-b.price:a.duration.localeCompare(b.duration)),[direct,sort]);
  return <main><section className="flight-hero"><div><span className="kicker">FLY SMARTER</span><h1>A world of possibility awaits</h1><p>Compare routes and choose the flight that feels right.</p></div><SearchBox compact onSearch={()=>{}}/></section><section className="section flight-layout"><aside><div className="filter-title"><b>Filter flights</b><button onClick={()=>setDirect(false)}>Clear</button></div><div className="filter"><span>Stops</span><label className="check"><input type="checkbox" checked={direct} onChange={e=>setDirect(e.target.checked)}/> Direct flights only</label></div><div className="filter"><span>Airlines</span>{["Turkish Airlines","British Airways","Lufthansa","KLM"].map(x=><label className="check" key={x}><input type="checkbox"/> {x}</label>)}</div><div className="filter"><span>Departure time</span>{["Morning","Afternoon","Evening"].map(x=><label className="check" key={x}><input type="checkbox"/> {x}</label>)}</div></aside><div className="results"><div className="results-head"><div><b>London → Istanbul</b><small>{shown.length} flight options · 18 Sep</small></div><select value={sort} onChange={e=>setSort(e.target.value)}><option value="best">Best journey</option><option value="price">Lowest price</option></select></div><div className="flight-list">{shown.map(f=><article className="flight-card" key={f.id}><div className="airline"><span style={{background:f.color}}>{f.airline.slice(0,1)}</span><div><b>{f.airline}</b><small>{f.code}</small></div></div><div className="flight-time"><div><b>{f.depart}</b><small>{f.from}</small></div><div className="route"><small>{f.duration}</small><i/><small>{f.stops}</small></div><div><b>{f.arrive}</b><small>{f.to}</small></div></div><div className="flight-price"><small>from</small><b>£{f.price}</b><span>per person</span><button className="btn dark small" onClick={()=>onBook(f)}>Select</button></div></article>)}</div><div className="info-banner"><b>◉ Price guarantee</b><p>The prices shown are demo values, but the booking experience mirrors a real travel platform.</p></div></div></section></main>;
}

function Account({ user, bookings, onLogin, onLogout }: { user:string; bookings:Booking[]; onLogin:()=>void; onLogout:()=>void }) {
  if(!user) return <main><section className="auth-gate"><span>♙</span><h1>Your trips, all in one place</h1><p>Sign in with the demo account to view and manage your reservations.</p><button className="btn dark" onClick={onLogin}>Sign in to Hi-Fly</button><small>Demo: demo@hifly.co.uk / travel2026</small></section></main>;
  return <main className="account-bg"><section className="section account"><div className="account-head"><div><span className="kicker">MY HI-FLY</span><h1>Welcome back, {user}</h1><p>Your next adventure is looking good.</p></div><button className="btn outline" onClick={onLogout}>Sign out</button></div><div className="account-stats"><div><span>Upcoming trips</span><b>{bookings.length}</b></div><div><span>Saved places</span><b>4</b></div><div><span>Travel credit</span><b>£25</b></div></div><div className="dashboard"><div><h2>My bookings</h2>{bookings.length?bookings.map(b=><article className="booking" key={b.id}><img src={b.image} alt=""/><div><span className="badge">{b.status}</span><small>{b.type} · {b.date}</small><h3>{b.title}</h3><p>Booking reference: {b.id}</p></div><strong>£{b.price}</strong><button className="btn outline small">Manage</button></article>):<div className="empty"><span>⌁</span><h3>No bookings yet</h3><p>Your confirmed demo trips will appear here.</p></div>}</div><aside className="profile-card"><div className="avatar">{user.slice(0,1)}</div><h3>{user} Traveller</h3><p>demo@hifly.co.uk</p><hr/><button>Personal details <span>›</span></button><button>Payment methods <span>›</span></button><button>Wishlist <span>›</span></button><button>Preferences <span>›</span></button></aside></div></section></main>;
}

export default function HiFlyApp() {
  const [view,setView]=useState<View>("home"); const [user,setUser]=useState(""); const [loginOpen,setLoginOpen]=useState(false); const [bookingItem,setBookingItem]=useState<any>(null); const [bookings,setBookings]=useState<Booking[]>([]); const [toast,setToast]=useState("");
  useEffect(()=>{setUser(localStorage.getItem("hifly-user")||""); try{setBookings(JSON.parse(localStorage.getItem("hifly-bookings")||"[]"))}catch{}},[]);
  const login=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setUser("Alex");localStorage.setItem("hifly-user","Alex");setLoginOpen(false);setToast("Welcome back, Alex!")};
  const confirmBooking=()=>{if(!user){setBookingItem(null);setLoginOpen(true);return} const isFlight=!!bookingItem.airline; const b:Booking={id:`HF${Math.floor(100000+Math.random()*899999)}`,type:isFlight?"Flight":"Tour",title:isFlight?`${bookingItem.from} → ${bookingItem.to}`:bookingItem.title,date:"18 September 2026",price:bookingItem.price,status:"Confirmed",image:isFlight?images.city:bookingItem.image}; const next=[b,...bookings];setBookings(next);localStorage.setItem("hifly-bookings",JSON.stringify(next));setBookingItem(null);setToast("Reservation confirmed — see you soon!");setView("account")};
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(""),3200);return()=>clearTimeout(t)},[toast]);
  return <div><Header view={view} setView={setView} user={user} onLogin={()=>setLoginOpen(true)}/>{view==="home"&&<Home setView={setView} onBook={setBookingItem}/>} {view==="tours"&&<Tours onBook={setBookingItem}/>} {view==="flights"&&<Flights onBook={setBookingItem}/>} {view==="account"&&<Account user={user} bookings={bookings} onLogin={()=>setLoginOpen(true)} onLogout={()=>{setUser("");localStorage.removeItem("hifly-user")}}/>}<Footer setView={setView}/>
    {loginOpen&&<div className="modal-backdrop" onMouseDown={()=>setLoginOpen(false)}><div className="modal login-modal" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={()=>setLoginOpen(false)}>×</button><img src="/logo.png" alt="Hi-Fly"/><h2>Welcome back</h2><p>Use the demo details below — or any values — to explore your account.</p><form onSubmit={login}><label>Email<input type="email" defaultValue="demo@hifly.co.uk" required/></label><label>Password<input type="password" defaultValue="travel2026" required/></label><button className="btn dark" type="submit">Sign in</button></form><div className="demo-note"><b>Demo account</b><span>demo@hifly.co.uk</span><span>travel2026</span></div></div></div>}
    {bookingItem&&<div className="modal-backdrop" onMouseDown={()=>setBookingItem(null)}><div className="modal booking-modal" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={()=>setBookingItem(null)}>×</button><span className="kicker">REVIEW YOUR TRIP</span><h2>{bookingItem.airline?`${bookingItem.from} → ${bookingItem.to}`:bookingItem.title}</h2><p>{bookingItem.airline?`${bookingItem.airline} · ${bookingItem.depart} – ${bookingItem.arrive}`:bookingItem.location}</p><div className="summary"><div><span>Travel date</span><b>18 September 2026</b></div><div><span>Travellers</span><b>2 adults</b></div><div><span>Flexible option</span><b>Included</b></div></div><div className="total"><span>Total demo price</span><b>£{bookingItem.price*2}</b></div><button className="btn dark wide" onClick={confirmBooking}>Confirm reservation</button><small>No payment is taken. This is a UI demonstration.</small></div></div>}
    {toast&&<div className="toast">✓ {toast}</div>}
  </div>;
}
