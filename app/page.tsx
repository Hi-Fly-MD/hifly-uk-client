"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon, Logo, Modal } from "./ui";
import {
  tours,
  flights,
  photos,
  flightPlaces,
  defaultSearch,
  futureDate,
  dateLabel,
  money,
  type Tour,
  type View,
  type SearchCriteria,
  type Draft,
  type Reservation,
  type Profile,
  type IconName,
} from "./travel-data";

type Go = (view: View, tour?: Tour) => void;
type TourActions = {
  onOpen: (tour: Tour) => void;
  saved: number[];
  onSave: (id: number) => void;
};
const city = (place: string) => place.split(",")[0];

function SearchBox({
  initial,
  onSearch,
  compact = false,
}: {
  initial: SearchCriteria;
  onSearch: (search: SearchCriteria) => void;
  compact?: boolean;
}) {
  const [value, setValue] = useState(initial);
  const [popover, setPopover] = useState<"destination" | "guests" | null>(null);
  const [error, setError] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setPopover(null);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);
  const patch = (next: Partial<SearchCriteria>) => {
    setValue((v) => ({ ...v, ...next }));
    setError("");
  };
  const places =
    value.kind === "flights" ? flightPlaces : tours.map((t) => t.location);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.date < futureDate(0) || value.end < value.date) {
      setError(
        "Please choose upcoming dates, with the return after departure.",
      );
      return;
    }
    if (
      value.kind === "flights" &&
      (!value.from.trim() || !value.destination.trim())
    ) {
      setError("Choose a departure city and a destination.");
      return;
    }
    if (
      value.kind === "flights" &&
      city(value.from).toLowerCase() === city(value.destination).toLowerCase()
    ) {
      setError("Your departure and arrival cities must be different.");
      return;
    }
    setPopover(null);
    onSearch(value);
  };
  return (
    <form
      className={`searchbox ${compact ? "search-compact" : ""}`}
      onSubmit={submit}
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape") setPopover(null);
      }}
    >
      {!compact && (
        <div className="search-top">
          <div className="search-tabs" aria-label="Search type">
            {(["tours", "flights"] as const).map((kind) => (
              <button
                type="button"
                key={kind}
                className={value.kind === kind ? "active" : ""}
                aria-pressed={value.kind === kind}
                onClick={() => {
                  patch({ kind, destination: "" });
                  setPopover(null);
                }}
              >
                <Icon name={kind === "tours" ? "globe" : "plane"} size={17} />
                {kind === "tours" ? "Discover tours" : "Find flights"}
              </button>
            ))}
          </div>
          <span className="search-promise">
            <Icon name="shield" size={14} /> A little planning. A world of
            possibility.
          </span>
        </div>
      )}
      <div
        className={`search-fields ${value.kind === "flights" ? "flight-fields" : ""}`}
      >
        {value.kind === "flights" && (
          <label className="search-field">
            <Icon name="plane" />
            <span>
              <span className="field-label">Flying from</span>
              <input
                aria-label="Departure city"
                value={value.from}
                onChange={(e) => patch({ from: e.target.value })}
                placeholder="Departure city"
                required
              />
            </span>
          </label>
        )}
        <div className="search-field destination-field">
          <Icon name="pin" />
          <label>
            <span className="field-label">
              {value.kind === "flights" ? "Flying to" : "Where to?"}
            </span>
            <input
              aria-label="Destination"
              value={value.destination}
              onChange={(e) => {
                patch({ destination: e.target.value });
                setPopover("destination");
              }}
              onFocus={() => setPopover("destination")}
              placeholder={
                value.kind === "flights"
                  ? "Choose destination"
                  : "Explore all destinations"
              }
              autoComplete="off"
            />
          </label>
          {popover === "destination" && (
            <div className="popover destination-popover">
              <div className="popover-head">
                <span>YOUR NEXT ADVENTURE</span>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Close destinations"
                  onClick={() => setPopover(null)}
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
              {places
                .filter((p) =>
                  p.toLowerCase().includes(value.destination.toLowerCase()),
                )
                .map((p) => (
                  <button
                    type="button"
                    className="place-option"
                    key={p}
                    onClick={() => {
                      patch({ destination: p });
                      setPopover(null);
                    }}
                  >
                    <span className="place-icon">
                      <Icon name="pin" size={18} />
                    </span>
                    <span>
                      <b>{city(p)}</b>
                      <small>
                        {p.split(",")[1]} ·{" "}
                        {value.kind === "flights"
                          ? "Sample flight route"
                          : "Handpicked escape"}
                      </small>
                    </span>
                    <Icon name="chevron" size={14} />
                  </button>
                ))}
              {!places.some((p) =>
                p.toLowerCase().includes(value.destination.toLowerCase()),
              ) && (
                <p className="popover-empty">
                  {value.kind === "flights"
                    ? "Enter any city to preview a sample route."
                    : "No matching destination. Try Greece, Paris or Italy."}
                </p>
              )}
              {value.kind === "tours" && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    patch({ destination: "" });
                    setPopover(null);
                  }}
                >
                  Explore all destinations <Icon name="arrow" size={15} />
                </button>
              )}
            </div>
          )}
        </div>
        <label className="search-field">
          <Icon name="calendar" />
          <span>
            <span className="field-label">
              {value.kind === "flights" ? "Departure" : "Travel date"}
            </span>
            <input
              type="date"
              aria-label="Departure date"
              value={value.date}
              min={futureDate(0)}
              required
              onChange={(e) =>
                patch({
                  date: e.target.value,
                  ...(e.target.value > value.end
                    ? { end: e.target.value }
                    : {}),
                })
              }
            />
          </span>
        </label>
        {value.kind === "flights" && (
          <label className="search-field">
            <Icon name="calendar" />
            <span>
              <span className="field-label">Return</span>
              <input
                type="date"
                aria-label="Return date"
                value={value.end}
                min={value.date}
                required
                onChange={(e) => patch({ end: e.target.value })}
              />
            </span>
          </label>
        )}
        <div className="search-field guest-field">
          <Icon name="users" />
          <div>
            <span className="field-label">Travellers</span>
            <button
              type="button"
              className="guest-trigger"
              aria-expanded={popover === "guests"}
              onClick={() => setPopover(popover === "guests" ? null : "guests")}
            >
              {value.adults + value.children} guest
              {value.adults + value.children !== 1 ? "s" : ""}
              <span className="guest-sub">
                {value.adults} adult{value.adults > 1 ? "s" : ""}
                {value.children ? `, ${value.children} children` : ""}
              </span>
            </button>
          </div>
          {popover === "guests" && (
            <div className="popover guest-popover">
              <div className="popover-head">
                <span>WHO’S COMING ALONG?</span>
              </div>
              {(
                [
                  {
                    key: "adults",
                    label: "Adults",
                    note: "Ages 18+",
                    min: 1,
                    max: 8,
                  },
                  {
                    key: "children",
                    label: "Children",
                    note: "Ages 0–17 · demo adult fare",
                    min: 0,
                    max: 6,
                  },
                ] as const
              ).map((row) => (
                <div className="guest-row" key={row.key}>
                  <span>
                    <b>{row.label}</b>
                    <small>{row.note}</small>
                  </span>
                  <div>
                    <button
                      type="button"
                      aria-label={`Fewer ${row.label.toLowerCase()}`}
                      disabled={value[row.key] <= row.min}
                      onClick={() => patch({ [row.key]: value[row.key] - 1 })}
                    >
                      −
                    </button>
                    <b>{value[row.key]}</b>
                    <button
                      type="button"
                      aria-label={`More ${row.label.toLowerCase()}`}
                      disabled={value[row.key] >= row.max}
                      onClick={() => patch({ [row.key]: value[row.key] + 1 })}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-blue wide"
                onClick={() => setPopover(null)}
              >
                Done <Icon name="check" size={16} />
              </button>
            </div>
          )}
        </div>
        <button className="btn btn-yellow search-submit" type="submit">
          <Icon name="search" size={19} />
          <span>Search</span>
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function Header({
  view,
  go,
  profile,
  onLogin,
  saved,
}: {
  view: View;
  go: Go;
  profile: Profile | null;
  onLogin: () => void;
  saved: number;
}) {
  const [open, setOpen] = useState(false);
  const links: [View, string][] = [
    ["home", "Home"],
    ["tours", "Discover tours"],
    ["flights", "Flights"],
    ["account", "My trips"],
  ];
  const move: Go = (v) => {
    setOpen(false);
    go(v);
  };
  return (
    <>
      <div className="announcement">
        <span>
          <Icon name="plane" size={13} /> A world of possibility. A journey
          that’s yours.
        </span>
        <span className="demo-tag">
          <i /> INTERACTIVE DEMO
        </span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="logo-button"
            onClick={() => move("home")}
            aria-label="HiFLY home"
          >
            <Logo />
          </button>
          <nav
            className={open ? "main-nav is-open" : "main-nav"}
            aria-label="Main navigation"
          >
            {links.map(([v, text]) => (
              <button
                key={v}
                className={
                  view === v || (view === "tour" && v === "tours")
                    ? "active"
                    : ""
                }
                onClick={() => move(v)}
              >
                {text}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <span className="locale">
              EN <span>·</span> GBP
            </span>
            <button
              className="icon-button wishlist-button"
              aria-label={`Saved trips, ${saved}`}
              onClick={() => move("wishlist")}
            >
              <Icon name="heart" />
              {saved > 0 && <small>{saved}</small>}
            </button>
            <button
              className="btn btn-blue sign-in"
              onClick={() => {
                setOpen(false);
                if (profile) go("account");
                else onLogin();
              }}
            >
              <Icon name="users" size={17} />
              {profile ? profile.name.split(" ")[0] : "Sign in"}
            </button>
            <button
              className="icon-button menu-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function TourCard({
  tour,
  onOpen,
  saved,
  onSave,
}: { tour: Tour } & TourActions) {
  const liked = saved.includes(tour.id);
  return (
    <article className="tour-card">
      <div className="tour-image">
        <button
          className="image-link"
          onClick={() => onOpen(tour)}
          aria-label={`Explore ${tour.title}`}
        >
          <img src={tour.image} alt={tour.location} loading="lazy" />
        </button>
        <span className="tour-badge">{tour.badge}</span>
        <button
          className={`heart-button ${liked ? "is-saved" : ""}`}
          aria-label={`${liked ? "Unsave" : "Save"} ${tour.title}`}
          aria-pressed={liked}
          onClick={() => onSave(tour.id)}
        >
          <Icon name="heart" size={18} />
        </button>
        <span className="image-location">
          <Icon name="pin" size={13} />
          {tour.location}
        </span>
      </div>
      <div className="tour-body">
        <div className="tour-meta">
          <span>
            {tour.category} <i /> {tour.days} days
          </span>
          <span className="rating">
            <Icon name="star" size={13} />
            <b>{tour.rating}</b>
          </span>
        </div>
        <h3>
          <button onClick={() => onOpen(tour)}>{tour.title}</button>
        </h3>
        <p className="cancellation">
          <Icon name="check" size={13} /> Free cancellation up to 48 hours
          before
        </p>
        <div className="tour-bottom">
          <span>
            <small>From</small>
            <strong>{money(tour.price)}</strong>
            <small>/ person</small>
          </span>
          <button
            className="circle-arrow"
            onClick={() => onOpen(tour)}
            aria-label={`View ${tour.title}`}
          >
            <Icon name="arrow" size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Home({
  go,
  onSearch,
  search,
  ...actions
}: {
  go: Go;
  search: SearchCriteria;
  onSearch: (s: SearchCriteria) => void;
} & TourActions) {
  return (
    <main id="main" tabIndex={-1}>
      <section className="hero">
        <img
          className="hero-photo"
          src={photos.hero}
          alt="Whitewashed Santorini village overlooking the blue Aegean Sea"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow light">
              <span /> A LITTLE FURTHER. A LITTLE FREER.
            </div>
            <h1>
              Good things come
              <br />
              to those who <em>go.</em>
            </h1>
            <p>
              Extraordinary places. Effortless escapes.
              <br />
              Find a little more of the world, with HiFLY.
            </p>
            <button className="hero-link" onClick={() => go("tours")}>
              Find your next adventure <Icon name="arrow" size={18} />
            </button>
            <div className="hero-proof">
              <span className="mini-avatars">
                <i>J</i>
                <i>A</i>
                <i>M</i>
              </span>
              <span>
                <span className="stars">★★★★★</span>
                <small>Made for curious travellers like you</small>
              </span>
            </div>
          </div>
          <div className="destination-note">
            <Icon name="pin" size={18} />
            <span>
              <small>YOUR NEXT “WISH YOU WERE HERE”</small>
              <b>Santorini, Greece</b>
            </span>
            <span className="note-number">01 / 06</span>
          </div>
        </div>
      </section>
      <div className="floating-search wrap">
        <SearchBox initial={search} onSearch={onSearch} />
      </div>
      <div className="trust-strip wrap">
        <span>
          <Icon name="shield" size={17} /> Flexible cancellation
        </span>
        <span>
          <Icon name="globe" size={17} /> Handpicked experiences
        </span>
        <span>
          <Icon name="headphones" size={17} /> A human when you need one
        </span>
        <span className="trust-end">
          Your next chapter starts here <Icon name="arrow" size={16} />
        </span>
      </div>
      <section className="section wrap featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE PLACES YOU’LL TALK ABOUT</span>
            <h2>
              Go somewhere <em>good.</em>
            </h2>
            <p>
              A few favourites, with a little something for every kind of
              traveller.
            </p>
          </div>
          <button className="text-button" onClick={() => go("tours")}>
            Explore all tours <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="tour-grid three">
          {tours.slice(0, 3).map((tour) => (
            <TourCard key={tour.id} tour={tour} {...actions} />
          ))}
        </div>
      </section>
      <section className="section wrap inspiration">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FOLLOW YOUR CURIOSITY</span>
            <h2>
              What’s your kind of <em>away?</em>
            </h2>
          </div>
          <span className="section-aside">
            Less scrolling. More daydreaming.
          </span>
        </div>
        <div className="destination-grid">
          {[
            {
              label: "A little vitamin sea",
              sub: "Beach escapes",
              image: photos.amalfi,
              query: "Beach",
              count: "2 coastal escapes",
            },
            {
              label: "A different point of view",
              sub: "Mountain adventures",
              image: photos.alps,
              query: "Adventure",
              count: "2 outdoor adventures",
            },
            {
              label: "Get lost in a good city",
              sub: "Culture & city breaks",
              image: photos.paris,
              query: "City break",
              count: "Paris is calling",
            },
          ].map((d, i) => (
            <button
              className={`destination-card destination-${i}`}
              key={d.sub}
              onClick={() =>
                onSearch({ ...search, kind: "tours", destination: d.query })
              }
            >
              <img src={d.image} alt="" loading="lazy" />
              <span className="destination-overlay" />
              <span className="destination-top">
                0{i + 1} <Icon name="arrow" size={22} />
              </span>
              <span className="destination-copy">
                <small>{d.sub}</small>
                <strong>{d.label}</strong>
                <span>{d.count}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
      <section className="flight-promo wrap">
        <div className="promo-orbit" />
        <div className="flight-promo-copy">
          <span className="eyebrow light">LET’S GET YOU THERE</span>
          <h2>
            The world is closer
            <br />
            than you <em>think.</em>
          </h2>
          <p>
            Find your flight. Choose your escape. Keep everything together, from
            take-off to the way home.
          </p>
          <button className="btn btn-yellow" onClick={() => go("flights")}>
            Find a flight <Icon name="arrow" size={19} />
          </button>
        </div>
        <div className="boarding-pass">
          <div className="pass-top">
            <Logo />
            <span>YOUR NEXT ADVENTURE</span>
          </div>
          <div className="pass-route">
            <div>
              <b>LON</b>
              <small>London</small>
            </div>
            <span>
              <i />
              <Icon name="plane" size={27} />
              <i />
            </span>
            <div>
              <b>IST</b>
              <small>Istanbul</small>
            </div>
          </div>
          <div className="pass-bottom">
            <span>
              <small>DEPARTURE</small>
              <b>Whenever you’re ready</b>
            </span>
            <span>
              <small>FEELING</small>
              <b>A little freer.</b>
            </span>
          </div>
          <div className="pass-stub">
            <span>ONE WAY TO A GREAT STORY</span>
            <span className="barcode" />
          </div>
        </div>
      </section>
      <section className="section wrap why">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOU DO THE DAYDREAMING</span>
            <h2>
              We’ll take care of <em>the details.</em>
            </h2>
          </div>
        </div>
        <div className="benefits">
          {(
            [
              {
                icon: "globe",
                title: "A little more local",
                text: "Thoughtful itineraries and places that deserve a spot in your story.",
              },
              {
                icon: "shield",
                title: "Room to change plans",
                text: "Clear cancellation windows, with the details before you book.",
              },
              {
                icon: "suitcase",
                title: "Every trip, together",
                text: "Your tours, flights and favourites, all in one easy place.",
              },
              {
                icon: "headphones",
                title: "People, not just pixels",
                text: "A friendly travel team, here to help you find your way.",
              },
            ] as { icon: IconName; title: string; text: string }[]
          ).map((item) => (
            <div key={item.title}>
              <span className="benefit-icon">
                <Icon name={item.icon} size={23} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Filters({
  children,
  onClear,
  open,
  onToggle,
}: {
  children: React.ReactNode;
  onClear: () => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <button className="btn btn-outline mobile-filter" onClick={onToggle}>
        <Icon name="sliders" size={17} />
        {open ? "Hide filters" : "Filters"}
      </button>
      <aside className={`filters ${open ? "filters-open" : ""}`}>
        <div className="filter-heading">
          <b>
            <Icon name="sliders" size={17} /> Refine your search
          </b>
          <button className="text-button" onClick={onClear}>
            Reset
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
function Empty({
  title,
  text,
  onReset,
  label = "Reset filters",
}: {
  title: string;
  text: string;
  onReset: () => void;
  label?: string;
}) {
  return (
    <div className="empty-state">
      <span>
        <Icon name="globe" size={32} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      <button className="btn btn-blue" onClick={onReset}>
        {label} <Icon name="arrow" size={16} />
      </button>
    </div>
  );
}

function Tours({
  search,
  onSearch,
  ...actions
}: {
  search: SearchCriteria;
  onSearch: (s: SearchCriteria) => void;
} & TourActions) {
  const [max, setMax] = useState(350);
  const [categories, setCategories] = useState<string[]>([]);
  const [durations, setDurations] = useState<string[]>([]);
  const [sort, setSort] = useState("recommended");
  const [filterOpen, setFilterOpen] = useState(false);
  const toggle = (list: string[], item: string) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
  const reset = () => {
    setMax(350);
    setCategories([]);
    setDurations([]);
    onSearch({ ...search, destination: "" });
  };
  const query = search.destination.toLowerCase().trim();
  const filtered = tours
    .filter(
      (t) =>
        `${t.title} ${t.location} ${t.category}`
          .toLowerCase()
          .includes(query) &&
        t.price <= max &&
        (!categories.length || categories.includes(t.category)) &&
        (!durations.length ||
          durations.includes(
            t.days <= 3 ? "1–3 days" : t.days <= 6 ? "4–6 days" : "7+ days",
          )),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "duration"
          ? a.days - b.days
          : Number(b.rating) - Number(a.rating),
    );
  return (
    <main id="main" tabIndex={-1}>
      <section className="browse-hero">
        <div className="wrap">
          <span className="eyebrow">LESS ORDINARY. MORE YOU.</span>
          <h1>
            Find your next <em>great escape.</em>
          </h1>
          <p>
            Beautiful places. Thoughtful details. A story waiting to happen.
          </p>
          <SearchBox
            key={JSON.stringify(search)}
            compact
            initial={{ ...search, kind: "tours" }}
            onSearch={onSearch}
          />
        </div>
      </section>
      <section className="wrap browse-layout">
        <Filters
          open={filterOpen}
          onToggle={() => setFilterOpen(!filterOpen)}
          onClear={reset}
        >
          <div className="filter-group">
            <label htmlFor="price">
              Budget per person <b>{money(max)}</b>
            </label>
            <input
              id="price"
              type="range"
              min="120"
              max="350"
              step="1"
              value={max}
              onChange={(e) => setMax(+e.target.value)}
            />
            <div className="range-labels">
              <span>£120</span>
              <span>£350</span>
            </div>
          </div>
          <div className="filter-group">
            <b>How do you like to travel?</b>
            {["Adventure", "Beach", "City break", "Culture"].map((x) => (
              <label className="check-label" key={x}>
                <input
                  type="checkbox"
                  checked={categories.includes(x)}
                  onChange={() => setCategories(toggle(categories, x))}
                />
                {x}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <b>Time for a getaway</b>
            {["1–3 days", "4–6 days", "7+ days"].map((x) => (
              <label className="check-label" key={x}>
                <input
                  type="checkbox"
                  checked={durations.includes(x)}
                  onChange={() => setDurations(toggle(durations, x))}
                />
                {x}
              </label>
            ))}
          </div>
          <div className="filter-note">
            <Icon name="headphones" />
            <b>A little help choosing?</b>
            <p>
              Explore our handpicked experiences and find your kind of away.
            </p>
          </div>
        </Filters>
        <div className="results">
          <div className="results-heading">
            <div>
              <h2>
                {filtered.length} {filtered.length === 1 ? "escape" : "escapes"}{" "}
                for you
              </h2>
              <p>
                {search.destination || "All destinations"} ·{" "}
                {dateLabel(search.date)} · {search.adults + search.children}{" "}
                guests
              </p>
            </div>
            <label className="sort-label">
              <span>Sort by</span>
              <select
                aria-label="Sort tours"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price">Lowest price</option>
                <option value="duration">Shortest trip</option>
              </select>
            </label>
          </div>
          {query && (
            <div className="active-filters">
              <button onClick={() => onSearch({ ...search, destination: "" })}>
                {search.destination}
                <Icon name="close" size={14} />
              </button>
            </div>
          )}
          <div className="tour-grid two">
            {filtered.map((t) => (
              <TourCard key={t.id} tour={t} {...actions} />
            ))}
          </div>
          {!filtered.length && (
            <Empty
              title="Your next escape is still out there"
              text="Try another destination or give your filters a little more room."
              onReset={reset}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function TourDetail({
  tour,
  search,
  onBook,
  onBack,
  onGallery,
  saved,
  onSave,
}: {
  tour: Tour;
  search: SearchCriteria;
  onBook: (draft: Draft) => void;
  onBack: () => void;
  onGallery: (index: number) => void;
  saved: number[];
  onSave: (id: number) => void;
}) {
  const [date, setDate] = useState(search.date);
  const [guests, setGuests] = useState(search.adults + search.children);
  return (
    <main id="main" tabIndex={-1} className="detail-page">
      <div className="wrap">
        <div className="breadcrumbs">
          <button onClick={onBack}>
            <Icon name="arrowLeft" size={15} /> All experiences
          </button>
          <span>
            {tour.country} / {tour.category}
          </span>
        </div>
        <div className="detail-title">
          <div>
            <div className="eyebrow">YOUR NEXT GREAT STORY</div>
            <h1>{tour.title}</h1>
            <div className="detail-location">
              <span>
                <Icon name="pin" size={16} />
                {tour.location}
              </span>
              <span className="rating">
                <Icon name="star" size={14} />
                {tour.rating} <span>· Sample traveller rating</span>
              </span>
            </div>
          </div>
          <button
            className={`btn btn-outline ${saved.includes(tour.id) ? "saved" : ""}`}
            aria-pressed={saved.includes(tour.id)}
            onClick={() => onSave(tour.id)}
          >
            <Icon name="heart" size={17} />
            {saved.includes(tour.id) ? "Saved" : "Save trip"}
          </button>
        </div>
        <div className="detail-gallery">
          {[tour.image, photos.hotel, photos.coast].map((src, i) => (
            <button
              key={i}
              onClick={() => onGallery(i)}
              aria-label={`View trip photo ${i + 1}`}
            >
              <img
                src={src}
                alt={
                  i === 0
                    ? tour.location
                    : i === 1
                      ? "Accommodation inspiration"
                      : "Scenic travel inspiration"
                }
              />
            </button>
          ))}
          <button className="gallery-all btn" onClick={() => onGallery(0)}>
            <Icon name="search" size={16} /> View gallery
          </button>
        </div>
        <div className="detail-layout">
          <div className="detail-main">
            <div className="detail-facts">
              {(
                [
                  {
                    icon: "clock",
                    title: `${tour.days} days`,
                    sub: "Perfectly paced",
                  },
                  {
                    icon: "users",
                    title: "Small groups",
                    sub: "Up to 12 travellers",
                  },
                  {
                    icon: "globe",
                    title: "Local guide",
                    sub: "English speaking",
                  },
                  {
                    icon: "shield",
                    title: "Flexible plans",
                    sub: "48-hour cancellation",
                  },
                ] as { icon: IconName; title: string; sub: string }[]
              ).map((f) => (
                <div key={f.title}>
                  <Icon name={f.icon} size={22} />
                  <span>
                    <b>{f.title}</b>
                    <small>{f.sub}</small>
                  </span>
                </div>
              ))}
            </div>
            <section className="detail-section">
              <span className="eyebrow">THE EXPERIENCE</span>
              <h2>
                Make room for <em>the memorable.</em>
              </h2>
              <p>{tour.description}</p>
              <p>
                Handpicked stays, local knowledge and time to explore. We’ve
                thought about the details, so you can enjoy being somewhere new.
              </p>
            </section>
            <section className="detail-section">
              <h2>
                A little plan. <em>A lot to discover.</em>
              </h2>
              <div className="itinerary">
                {tour.itinerary.map((day, i) => (
                  <details key={day} open={i === 0}>
                    <summary>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <b>{day}</b>
                      <Icon name="chevron" size={16} />
                    </summary>
                    <p>
                      {i === 0
                        ? "Meet your local host, settle into your handpicked accommodation and enjoy a relaxed introduction to the destination."
                        : i === tour.days - 1
                          ? "Enjoy breakfast and a final moment to take it all in. Your host will help with your departure arrangements."
                          : "Start with breakfast, then head out with your guide for the day’s experience. There’s time for local discoveries, photo stops and exploring at your own pace."}
                    </p>
                  </details>
                ))}
              </div>
            </section>
            <section className="detail-section">
              <h2>
                All the little <em>extras.</em>
              </h2>
              <div className="inclusions">
                <div>
                  <h3>Included in your escape</h3>
                  {[
                    "Handpicked accommodation",
                    "Daily breakfast",
                    "Guided itinerary experiences",
                    "Local transfers on itinerary",
                    "English-speaking local host",
                  ].map((x) => (
                    <span key={x}>
                      <Icon name="check" size={15} />
                      {x}
                    </span>
                  ))}
                </div>
                <div>
                  <h3>Plan separately</h3>
                  {[
                    "International flights",
                    "Travel insurance",
                    "Personal expenses & other meals",
                  ].map((x) => (
                    <span key={x}>
                      <span className="minus">−</span>
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            </section>
            <section className="detail-section cancellation-note">
              <Icon name="shield" size={26} />
              <div>
                <h3>A little flexibility goes a long way.</h3>
                <p>
                  Cancel up to 48 hours before departure for a full demo refund.
                  All reservations on this site are demonstrations; no payment
                  is collected.
                </p>
              </div>
            </section>
          </div>
          <aside className="booking-panel">
            <span className="panel-kicker">YOUR ADVENTURE STARTS HERE</span>
            <div className="detail-price">
              <strong>{money(tour.price)}</strong>
              <span>/ person</span>
            </div>
            <span className="cancellation">
              <Icon name="check" size={14} /> Free cancellation included
            </span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onBook({
                  type: "Tour",
                  title: tour.title,
                  subtitle: tour.location,
                  date,
                  travellers: guests,
                  total: tour.price * guests,
                  image: tour.image,
                });
              }}
            >
              <label>
                Departure date
                <input
                  type="date"
                  value={date}
                  min={futureDate(0)}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </label>
              <label>
                Travellers
                <select
                  value={guests}
                  onChange={(e) => setGuests(+e.target.value)}
                >
                  {Array.from({ length: 14 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} traveller{i ? "s" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <div className="price-breakdown">
                <span>
                  {money(tour.price)} × {guests} travellers
                </span>
                <b>{money(tour.price * guests)}</b>
                <span>Booking fee</span>
                <b>Included</b>
              </div>
              <div className="total-row">
                <span>Total</span>
                <b>{money(tour.price * guests)}</b>
              </div>
              <button className="btn btn-yellow wide" type="submit">
                Reserve this escape <Icon name="arrow" size={18} />
              </button>
            </form>
            <p className="panel-reassurance">
              <Icon name="shield" size={14} /> Demo reservation · No payment
              needed
            </p>
          </aside>
        </div>
      </div>
      <div className="mobile-reserve">
        <span>
          From <b>{money(tour.price)}</b> / person
        </span>
        <button
          className="btn btn-yellow"
          onClick={() =>
            document
              .querySelector(".booking-panel")
              ?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        >
          Reserve <Icon name="arrow" size={16} />
        </button>
      </div>
    </main>
  );
}

function Flights({
  search,
  onSearch,
  onBook,
}: {
  search: SearchCriteria;
  onSearch: (s: SearchCriteria) => void;
  onBook: (draft: Draft) => void;
}) {
  const [direct, setDirect] = useState(false);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [sort, setSort] = useState("best");
  const [open, setOpen] = useState(false);
  const destination = search.destination || "Istanbul, Türkiye";
  const shown = flights
    .filter(
      (f) =>
        (!direct || f.direct) &&
        (!airlines.length || airlines.includes(f.airline)) &&
        (!periods.length ||
          periods.includes(
            +f.depart.slice(0, 2) < 12 ? "Morning" : "Afternoon",
          )),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "time"
          ? a.depart.localeCompare(b.depart)
          : a.minutes - b.minutes || a.price - b.price,
    );
  const toggle = (list: string[], val: string) =>
    list.includes(val) ? list.filter((x) => x !== val) : [...list, val];
  const reset = () => {
    setDirect(false);
    setAirlines([]);
    setPeriods([]);
  };
  return (
    <main id="main" tabIndex={-1}>
      <section className="browse-hero flight-hero">
        <div className="wrap">
          <span className="eyebrow">THE START OF SOMETHING GOOD</span>
          <h1>
            Big plans. <em>Easy take-offs.</em>
          </h1>
          <p>Find a route that fits your next chapter.</p>
          <SearchBox
            key={JSON.stringify(search)}
            compact
            initial={{ ...search, destination, kind: "flights" }}
            onSearch={onSearch}
          />
        </div>
      </section>
      <section className="wrap browse-layout">
        <Filters open={open} onToggle={() => setOpen(!open)} onClear={reset}>
          <div className="filter-group">
            <b>Make it a direct flight</b>
            <label className="check-label">
              <input
                type="checkbox"
                checked={direct}
                onChange={(e) => setDirect(e.target.checked)}
              />
              Direct flights only
            </label>
          </div>
          <div className="filter-group">
            <b>Your preferred airlines</b>
            {flights.map((f) => (
              <label className="check-label" key={f.id}>
                <input
                  type="checkbox"
                  checked={airlines.includes(f.airline)}
                  onChange={() => setAirlines(toggle(airlines, f.airline))}
                />
                {f.airline}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <b>Time to take off</b>
            {["Morning", "Afternoon"].map((p) => (
              <label className="check-label" key={p}>
                <input
                  type="checkbox"
                  checked={periods.includes(p)}
                  onChange={() => setPeriods(toggle(periods, p))}
                />
                {p}
              </label>
            ))}
          </div>
          <p className="filter-help">
            Sample schedules and fares for presentation. Times are illustrative.
          </p>
        </Filters>
        <div className="results">
          <div className="results-heading">
            <div>
              <h2>
                {city(search.from)} <span className="route-arrow">→</span>{" "}
                {city(destination)}
              </h2>
              <p>
                {dateLabel(search.date)} – {dateLabel(search.end)} ·{" "}
                {search.adults + search.children} travellers · {shown.length}{" "}
                options
              </p>
            </div>
            <label className="sort-label">
              <span>Sort by</span>
              <select
                aria-label="Sort flights"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="best">Best journey</option>
                <option value="price">Lowest price</option>
                <option value="time">Earliest departure</option>
              </select>
            </label>
          </div>
          <div className="flight-notice">
            <Icon name="plane" size={18} />
            <span>
              <b>A preview of your next take-off.</b> Sample round-trip fares
              and schedules. Your selected route and travellers carry through to
              the demo reservation.
            </span>
          </div>
          <div className="flight-list">
            {shown.map((f, index) => (
              <article className="flight-card" key={f.id}>
                {index === 0 && (
                  <div className="flight-recommend">
                    {sort === "price"
                      ? "Lowest sample fare"
                      : sort === "time"
                        ? "First departure"
                        : "Our pick for your journey"}
                  </div>
                )}
                <div className="flight-airline">
                  <span
                    className="airline-mark"
                    style={{ background: f.color }}
                  >
                    {f.airline === "British Airways"
                      ? "BA"
                      : f.airline === "Turkish Airlines"
                        ? "TK"
                        : f.airline.slice(0, 2).toUpperCase()}
                  </span>
                  <span>
                    <b>{f.airline}</b>
                    <small>{f.code} · Economy</small>
                  </span>
                  <span className="flight-baggage">
                    <Icon name="suitcase" size={14} /> Cabin bag included
                  </span>
                </div>
                <div className="flight-card-main">
                  <div className="flight-time">
                    <b>{f.depart}</b>
                    <small>{city(search.from)}</small>
                  </div>
                  <div className="flight-route">
                    <small>
                      {Math.floor(f.minutes / 60)}h {f.minutes % 60}m
                    </small>
                    <span>
                      <i />
                      <Icon name="plane" size={16} />
                    </span>
                    <small className={f.direct ? "direct" : ""}>
                      {f.direct ? "Direct" : "1 stop"}
                    </small>
                  </div>
                  <div className="flight-time">
                    <b>{f.arrive}</b>
                    <small>{city(destination)}</small>
                  </div>
                  <div className="flight-price">
                    <small>Round trip / person</small>
                    <strong>{money(f.price)}</strong>
                    <button
                      className="btn btn-blue"
                      onClick={() =>
                        onBook({
                          type: "Flight",
                          title: `${city(search.from)} → ${city(destination)}`,
                          subtitle: `${f.airline} · ${f.depart}–${f.arrive} · Return ${dateLabel(search.end)}`,
                          date: search.date,
                          travellers: search.adults + search.children,
                          total: f.price * (search.adults + search.children),
                          image: photos.hero,
                        })
                      }
                    >
                      Select flight <Icon name="arrow" size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!shown.length && (
            <Empty
              title="Let’s try a different combination"
              text="Adjust your airline or departure filters to see more flights."
              onReset={reset}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function Account({
  profile,
  bookings,
  saved,
  onLogin,
  onLogout,
  onManage,
  go,
  onProfile,
}: {
  profile: Profile | null;
  bookings: Reservation[];
  saved: number;
  onLogin: () => void;
  onLogout: () => void;
  onManage: (b: Reservation) => void;
  go: Go;
  onProfile: () => void;
}) {
  const [tab, setTab] = useState("upcoming");
  const visible = bookings.filter((b) =>
    tab === "cancelled" ? b.status === "Cancelled" : b.status === "Confirmed",
  );
  if (!profile)
    return (
      <main id="main" tabIndex={-1} className="account-background">
        <div className="wrap account-gate">
          <div className="gate-icon">
            <Icon name="suitcase" size={40} />
          </div>
          <span className="eyebrow">YOUR OWN LITTLE TRAVEL CORNER</span>
          <h1>
            Good trips deserve
            <br />a place to <em>call home.</em>
          </h1>
          <p>
            Sign in to see your reservations, saved escapes and what comes next.
          </p>
          <button className="btn btn-yellow" onClick={onLogin}>
            Explore the demo account <Icon name="arrow" size={18} />
          </button>
          <small>No registration or payment needed.</small>
        </div>
      </main>
    );
  return (
    <main id="main" tabIndex={-1} className="account-background">
      <section className="section wrap account">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MY HIFLY</span>
            <h1>
              Hey {profile.name.split(" ")[0]}, <em>where next?</em>
            </h1>
            <p>Your plans, your favourites, your next great story.</p>
          </div>
          <button className="btn btn-outline" onClick={onLogout}>
            <Icon name="logout" size={16} />
            Sign out
          </button>
        </div>
        <div className="account-stats">
          <div>
            <Icon name="suitcase" />
            <span>
              <small>Upcoming escapes</small>
              <b>{bookings.filter((b) => b.status === "Confirmed").length}</b>
            </span>
          </div>
          <button onClick={() => go("wishlist")}>
            <Icon name="heart" />
            <span>
              <small>Saved for a sunny day</small>
              <b>{saved}</b>
            </span>
            <Icon name="arrow" size={18} />
          </button>
          <div>
            <Icon name="shield" />
            <span>
              <small>Your account</small>
              <b className="demo-stat">Demo explorer</b>
            </span>
          </div>
        </div>
        <div className="account-layout">
          <section className="bookings-panel">
            <div className="panel-heading">
              <h2>Your trips</h2>
              <div className="account-tabs">
                {["upcoming", "cancelled"].map((t) => (
                  <button
                    className={tab === t ? "active" : ""}
                    onClick={() => setTab(t)}
                    key={t}
                  >
                    {t === "upcoming" ? "Upcoming" : "Cancelled"}
                  </button>
                ))}
              </div>
            </div>
            {visible.length ? (
              visible.map((b) => (
                <article className="booking-row" key={b.id}>
                  <img src={b.image} alt="" />
                  <div>
                    <span
                      className={`status ${b.status === "Cancelled" ? "status-cancelled" : ""}`}
                    >
                      <i />
                      {b.status}
                    </span>
                    <h3>{b.title}</h3>
                    <p>
                      {dateLabel(b.date)} · {b.travellers} travellers · {b.type}
                    </p>
                    <small>Reference: {b.id}</small>
                  </div>
                  <div className="booking-row-action">
                    <b>{money(b.total)}</b>
                    <button className="text-button" onClick={() => onManage(b)}>
                      View booking <Icon name="arrow" size={15} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <Empty
                title={
                  tab === "cancelled"
                    ? "No cancelled plans"
                    : "Your next chapter is waiting"
                }
                text={
                  tab === "cancelled"
                    ? "Any cancelled demo reservations will appear here."
                    : "Find an escape you love. Your reservations will appear right here."
                }
                onReset={() => go("tours")}
                label="Discover tours"
              />
            )}
          </section>
          <aside className="profile-panel">
            <div className="profile-avatar">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
            <span className="eyebrow">EXPLORER IN THE MAKING</span>
            <h3>{profile.name}</h3>
            <p>{profile.email}</p>
            <button onClick={onProfile}>
              Personal details <Icon name="chevron" size={16} />
            </button>
            <button onClick={() => go("wishlist")}>
              Saved escapes <span>{saved}</span>
            </button>
            <button onClick={() => go("flights")}>
              Find your next flight <Icon name="plane" size={16} />
            </button>
            <div className="profile-note">
              <Icon name="shield" size={18} />
              <p>
                Your demo trips are saved in this browser, ready for your next
                visit.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Footer({
  go,
  onInfo,
  onSubscribe,
}: {
  go: Go;
  onInfo: (topic: string) => void;
  onSubscribe: () => void;
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div>
          <span className="eyebrow light">
            A LITTLE INSPIRATION GOES A LONG WAY
          </span>
          <h2>
            Good things in your <em>inbox.</em>
          </h2>
          <p>Daydream-worthy destinations and a little nudge to go.</p>
        </div>
        <form
          className="newsletter"
          onSubmit={(e) => {
            e.preventDefault();
            setSubscribed(true);
            onSubscribe();
          }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Your email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Your email address"
            aria-label="Newsletter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={subscribed}
          />
          <button
            type="submit"
            disabled={subscribed}
            aria-label={subscribed ? "Subscribed for demo" : "Subscribe"}
          >
            <Icon name={subscribed ? "check" : "arrow"} size={21} />
          </button>
          {subscribed && (
            <span className="newsletter-confirmation">
              You’re on the demo list. No email will be sent.
            </span>
          )}
        </form>
      </div>
      <div className="wrap footer-main">
        <div className="footer-brand">
          <button className="logo-button" onClick={() => go("home")}>
            <Logo light />
          </button>
          <p>
            Go a little further.
            <br />
            Come back with a story.
          </p>
          <span className="footer-demo">
            <i /> Made for exploring · Interactive demo
          </span>
        </div>
        <div>
          <h3>Find your away</h3>
          <button onClick={() => go("tours")}>Discover tours</button>
          <button onClick={() => go("flights")}>Find a flight</button>
          <button onClick={() => go("wishlist")}>Saved escapes</button>
        </div>
        <div>
          <h3>Here for you</h3>
          <button onClick={() => onInfo("Help & frequently asked questions")}>
            Help & FAQs
          </button>
          <button onClick={() => onInfo("Contact HiFLY")}>Get in touch</button>
          <button onClick={() => go("account")}>My trips</button>
        </div>
        <div className="footer-last">
          <h3>A world of possibility.</h3>
          <p>
            Thoughtful journeys.
            <br />A little more you.
          </p>
          <span>
            ENGLISH <i /> GBP £
          </span>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} HiFLY. Let yourself go.</span>
        <button onClick={() => onInfo("Privacy & demo terms")}>
          Privacy & terms
        </button>
        <span>
          Designed for your next chapter <Icon name="plane" size={13} />
        </span>
      </div>
    </footer>
  );
}

function Checkout({
  draft,
  onClose,
  onConfirm,
}: {
  draft: Draft;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title="One step closer to away." onClose={onClose}>
      <div className="checkout-progress">
        <span>
          <Icon name="check" size={13} /> Choose your trip
        </span>
        <i />
        <b>Review & reserve</b>
      </div>
      <img
        className="checkout-image"
        src={draft.image}
        alt="Your selected destination"
      />
      <span className="eyebrow">
        {draft.type === "Tour"
          ? "YOUR HANDPICKED ESCAPE"
          : "YOUR NEXT TAKE-OFF"}
      </span>
      <h3 className="checkout-title">{draft.title}</h3>
      <p className="checkout-subtitle">{draft.subtitle}</p>
      <div className="checkout-facts">
        <span>
          <Icon name="calendar" size={18} />
          <span>
            <small>Departure</small>
            <b>{dateLabel(draft.date)}</b>
          </span>
        </span>
        <span>
          <Icon name="users" size={18} />
          <span>
            <small>Travellers</small>
            <b>{draft.travellers} guests</b>
          </span>
        </span>
      </div>
      <div className="checkout-included">
        <Icon name="shield" size={18} />
        <span>
          <b>
            {draft.type === "Tour"
              ? "Free cancellation until 48 hours before departure"
              : "Sample fare · cabin bag included"}
          </b>
          <small>
            {draft.type === "Tour"
              ? "All booking fees included. A little room for plans to change."
              : "Illustrative schedule and round-trip fare for this demo."}
          </small>
        </span>
      </div>
      <div className="total-row">
        <span>Total for {draft.travellers} travellers</span>
        <b>{money(draft.total)}</b>
      </div>
      <button className="btn btn-yellow wide" onClick={onConfirm}>
        Confirm demo reservation <Icon name="arrow" size={17} />
      </button>
      <p className="modal-note">
        No payment is taken. No tickets or real reservations are issued.
      </p>
    </Modal>
  );
}

function PersonalDetails({
  profile,
  onSave,
  onClose,
}: {
  profile: Profile;
  onSave: (p: Profile) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  return (
    <Modal title="Your personal details" onClose={onClose}>
      <p>Keep your demo traveller profile up to date.</p>
      <form
        className="stack-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ name: name.trim(), email });
        }}
      >
        <label>
          Full name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={60}
            pattern=".*\S.*"
            autoComplete="name"
          />
        </label>
        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <button type="submit" className="btn btn-yellow wide">
          Save details <Icon name="check" size={17} />
        </button>
      </form>
      <p className="modal-note">Demo details stay in this browser.</p>
    </Modal>
  );
}

const infoContent: Record<string, React.ReactNode> = {
  "Help & frequently asked questions": (
    <div className="faq-list">
      {[
        [
          "How does this demo work?",
          "Explore a tour or sample flight, choose your travellers, and confirm a demo reservation. You can find it in My trips and view or cancel it there.",
        ],
        [
          "Will I be charged?",
          "No. No payment is collected, and no real booking or flight ticket is issued.",
        ],
        [
          "Where are my trips saved?",
          "Your reservations, saved escapes and demo profile are stored in this browser. They remain after a refresh. Clearing browser data removes them.",
        ],
        [
          "Can I cancel a booking?",
          "Yes. Open My trips, select View booking and cancel the demo reservation. Tours display a sample 48-hour cancellation policy.",
        ],
        [
          "Are flights and availability live?",
          "No. Tours, prices, schedules and availability are sample content for presenting the experience.",
        ],
      ].map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <Icon name="chevron" size={16} />
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  ),
  "Contact HiFLY": (
    <div className="contact-content">
      <span className="gate-icon">
        <Icon name="headphones" size={32} />
      </span>
      <h3>A human touch. Every step of the way.</h3>
      <p>
        In the live experience, this is where travellers will reach the HiFLY
        team for help planning a trip or managing a booking.
      </p>
      <div className="demo-notice">
        Contact requests are simulated in this demo. Use Help & FAQs to explore
        how reservations work.
      </div>
    </div>
  ),
  "Privacy & demo terms": (
    <div className="terms-content">
      <h3>About this demonstration</h3>
      <p>
        This is an interactive HiFLY prototype. Prices, ratings, itineraries,
        flights and availability are illustrative. No real travel products are
        purchased.
      </p>
      <h3>Your browser, your demo</h3>
      <p>
        Demo profile details, favourites and reservations are stored locally in
        this browser. No payment details are requested. Newsletter subscriptions
        are simulated and no messages are sent.
      </p>
      <h3>Images & local data</h3>
      <p>
        Destination photographs load from Unsplash. Clearing this site’s browser
        data removes your saved demo profile and trips.
      </p>
    </div>
  ),
};

export default function HiFlyApp() {
  const [view, setView] = useState<View>("home");
  const [selectedTour, setSelectedTour] = useState(tours[0]);
  const [search, setSearch] = useState<SearchCriteria>(defaultSearch());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [ready, setReady] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [success, setSuccess] = useState<Reservation | null>(null);
  const [managed, setManaged] = useState<Reservation | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [info, setInfo] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [gallery, setGallery] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("hifly-demo-v2") || "null");
      if (data) {
        if (data.profile?.name && data.profile?.email) setProfile(data.profile);
        if (Array.isArray(data.saved))
          setSaved(
            data.saved.filter(
              (id: unknown) =>
                typeof id === "number" && tours.some((t) => t.id === id),
            ),
          );
        if (Array.isArray(data.bookings))
          setBookings(
            data.bookings.filter(
              (b: Reservation) =>
                typeof b.id === "string" &&
                typeof b.title === "string" &&
                /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
                typeof b.total === "number" &&
                Number.isFinite(b.total) &&
                typeof b.travellers === "number" &&
                ["Confirmed", "Cancelled"].includes(b.status),
            ),
          );
      }
    } catch {
      /* A fresh demo remains available if stored data is invalid. */
    }
    setReady(true);
    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith("tour-")) {
        const t = tours.find((t) => t.id === Number(hash.slice(5)));
        if (t) {
          setSelectedTour(t);
          setView("tour");
          return;
        }
      }
      setView(
        (
          ["home", "tours", "flights", "account", "wishlist"] as View[]
        ).includes(hash as View)
          ? (hash as View)
          : "home",
      );
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(
          "hifly-demo-v2",
          JSON.stringify({ profile, saved, bookings }),
        );
      } catch {
        setToast(
          "Browser storage is unavailable. Your demo still works for this visit.",
        );
      }
    }
  }, [profile, saved, bookings, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  const go: Go = (next, tour) => {
    if (tour) setSelectedTour(tour);
    setView(next);
    window.location.hash =
      next === "tour" ? `tour-${tour?.id || selectedTour.id}` : next;
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const onSearch = (criteria: SearchCriteria) => {
    setSearch(criteria);
    if (view !== criteria.kind) go(criteria.kind);
  };
  const save = (id: number) => {
    const exists = saved.includes(id);
    setSaved(exists ? saved.filter((x) => x !== id) : [...saved, id]);
    setToast(
      exists
        ? "Removed from your saved escapes."
        : "Saved for a sunny day. Find it in your saved escapes.",
    );
  };
  const tourActions: TourActions = {
    onOpen: (t) => go("tour", t),
    saved,
    onSave: save,
  };
  const confirm = () => {
    if (!draft) return;
    if (!profile) {
      setLoginOpen(true);
      return;
    }
    const reservation: Reservation = {
      ...draft,
      id: `HF-${Array.from(crypto.getRandomValues(new Uint8Array(4)), (byte) =>
        byte.toString(16).padStart(2, "0"),
      )
        .join("")
        .toUpperCase()}`,
      status: "Confirmed",
      created: new Date().toISOString(),
    };
    setBookings((current) => [reservation, ...current]);
    setDraft(null);
    setSuccess(reservation);
    go("account");
  };
  const download = (b: Reservation) => {
    const text = `HiFLY — DEMO RESERVATION\n\nReference: ${b.id}\nStatus: ${b.status}\n${b.type}: ${b.title}\n${b.subtitle}\nDeparture: ${dateLabel(b.date)}\nTravellers: ${b.travellers}\nTotal: ${money(b.total)}\n\nThis is a demonstration. No real booking or payment has been made.\n`;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${b.id}-demo-reservation.txt`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast("Your demo confirmation is ready.");
  };
  const cancel = () => {
    if (!managed) return;
    const next: Reservation = { ...managed, status: "Cancelled" };
    setBookings((current) => current.map((b) => (b.id === next.id ? next : b)));
    setManaged(next);
    setCancelConfirm(false);
    setToast("Demo reservation cancelled. No payment was taken.");
  };
  const photoList = [selectedTour.image, photos.hotel, photos.coast];
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <Header
        view={view}
        go={go}
        profile={profile}
        onLogin={() => setLoginOpen(true)}
        saved={saved.length}
      />
      {view === "home" && (
        <Home go={go} search={search} onSearch={onSearch} {...tourActions} />
      )}
      {view === "tours" && (
        <Tours
          search={{
            ...search,
            kind: "tours",
            destination: search.kind === "tours" ? search.destination : "",
          }}
          onSearch={onSearch}
          {...tourActions}
        />
      )}
      {view === "tour" && (
        <TourDetail
          key={selectedTour.id}
          tour={selectedTour}
          search={search}
          onBook={setDraft}
          onBack={() => go("tours")}
          onGallery={setGallery}
          saved={saved}
          onSave={save}
        />
      )}
      {view === "flights" && (
        <Flights
          search={{
            ...search,
            kind: "flights",
            destination:
              search.kind === "flights"
                ? search.destination
                : "Istanbul, Türkiye",
          }}
          onSearch={onSearch}
          onBook={setDraft}
        />
      )}
      {view === "account" && (
        <Account
          profile={profile}
          bookings={bookings}
          saved={saved.length}
          onLogin={() => setLoginOpen(true)}
          onLogout={() => {
            setProfile(null);
            setToast("Signed out. Your demo trips are saved on this device.");
          }}
          onManage={(b) => {
            setManaged(b);
            setCancelConfirm(false);
          }}
          go={go}
          onProfile={() => setEditProfile(true)}
        />
      )}
      {view === "wishlist" && (
        <main id="main" tabIndex={-1}>
          <section className="section wrap wishlist">
            <div className="section-heading">
              <div>
                <span className="eyebrow">KEEP A LITTLE DAYDREAM</span>
                <h1>
                  Saved for <em>a sunny day.</em>
                </h1>
                <p>
                  {saved.length} {saved.length === 1 ? "escape" : "escapes"}{" "}
                  you’ve got your eye on. Ready when you are.
                </p>
              </div>
              <button className="text-button" onClick={() => go("tours")}>
                Keep exploring <Icon name="arrow" size={18} />
              </button>
            </div>
            {saved.length ? (
              <div className="tour-grid three">
                {tours
                  .filter((t) => saved.includes(t.id))
                  .map((t) => (
                    <TourCard key={t.id} tour={t} {...tourActions} />
                  ))}
              </div>
            ) : (
              <Empty
                title="Collect a little inspiration"
                text="Tap the heart on any escape to keep it here for later."
                onReset={() => go("tours")}
                label="Find an escape"
              />
            )}
          </section>
        </main>
      )}
      <Footer
        go={go}
        onInfo={setInfo}
        onSubscribe={() =>
          setToast("You’re on the demo list. No email will be sent.")
        }
      />
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {(
          [
            ["home", "home", "Home"],
            ["tours", "globe", "Explore"],
            ["flights", "plane", "Flights"],
            ["wishlist", "heart", "Saved"],
            ["account", "suitcase", "My trips"],
          ] as [View, IconName, string][]
        ).map(([v, icon, label]) => (
          <button
            key={v}
            className={
              view === v || (view === "tour" && v === "tours") ? "active" : ""
            }
            onClick={() => go(v)}
          >
            <Icon name={icon} size={21} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {draft && !loginOpen && (
        <Checkout
          draft={draft}
          onClose={() => setDraft(null)}
          onConfirm={confirm}
        />
      )}
      {loginOpen && (
        <Modal
          branded
          title={
            draft
              ? "Your escape is nearly yours."
              : "Welcome to your next chapter."
          }
          onClose={() => setLoginOpen(false)}
        >
          <div className="login-brand">
            <Logo />
          </div>
          <p>
            {draft
              ? "Sign in to keep your reservation in one place. Your selected trip is waiting for you."
              : "A little corner of the world, just for you. Use the demo account to explore."}
          </p>
          <form
            className="stack-form"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              setProfile({
                name: "Alex Traveller",
                email: String(data.get("email")),
              });
              setLoginOpen(false);
              setToast(
                draft
                  ? "Signed in. Review and confirm your selected trip."
                  : "Welcome, Alex. Your next chapter starts here.",
              );
            }}
          >
            <label>
              Email address
              <input
                type="email"
                name="email"
                defaultValue="demo@hifly.co.uk"
                autoComplete="email"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                defaultValue="travel2026"
                autoComplete="current-password"
                required
                minLength={4}
              />
            </label>
            <button className="btn btn-yellow wide" type="submit">
              {draft ? "Sign in & continue" : "Sign in to demo"}
              <Icon name="arrow" size={17} />
            </button>
          </form>
          <div className="demo-notice">
            <Icon name="shield" size={18} />
            <span>
              <b>A demo made for exploring</b>
              <small>
                Any valid email and 4+ character password work. No real account
                is created; the password is never saved.
              </small>
            </span>
          </div>
        </Modal>
      )}
      {success && (
        <Modal
          title="You’re going somewhere good."
          onClose={() => setSuccess(null)}
        >
          <div className="success-check">
            <Icon name="check" size={34} />
          </div>
          <p className="success-intro">
            Your demo reservation is confirmed. Let the daydreaming begin.
          </p>
          <div className="confirmation-card">
            <span className="status">
              <i />
              Confirmed · Demo reservation
            </span>
            <h3>{success.title}</h3>
            <p>
              {dateLabel(success.date)} · {success.travellers} travellers
            </p>
            <div>
              <span>Booking reference</span>
              <b>{success.id}</b>
            </div>
            <div>
              <span>Total</span>
              <b>{money(success.total)}</b>
            </div>
          </div>
          <button
            className="btn btn-yellow wide"
            onClick={() => {
              setSuccess(null);
              go("account");
            }}
          >
            View my trips <Icon name="arrow" size={17} />
          </button>
          <button
            className="btn btn-outline wide confirmation-download"
            onClick={() => download(success)}
          >
            <Icon name="download" size={17} />
            Download confirmation
          </button>
          <p className="modal-note">
            No payment was collected. No real reservation was made.
          </p>
        </Modal>
      )}
      {managed && (
        <Modal
          title="Your reservation"
          onClose={() => {
            setManaged(null);
            setCancelConfirm(false);
          }}
        >
          <div className="confirmation-card">
            <span
              className={`status ${managed.status === "Cancelled" ? "status-cancelled" : ""}`}
            >
              <i />
              {managed.status}
            </span>
            <h3>{managed.title}</h3>
            <p>{managed.subtitle}</p>
            <div>
              <span>Travel date</span>
              <b>{dateLabel(managed.date)}</b>
            </div>
            <div>
              <span>Travellers</span>
              <b>{managed.travellers}</b>
            </div>
            <div>
              <span>Reference</span>
              <b>{managed.id}</b>
            </div>
            <div>
              <span>Total demo price</span>
              <b>{money(managed.total)}</b>
            </div>
          </div>
          <button
            className="btn btn-blue wide"
            onClick={() => download(managed)}
          >
            <Icon name="download" size={17} /> Download confirmation
          </button>
          {managed.status === "Confirmed" &&
            (cancelConfirm ? (
              <div className="cancel-question">
                <b>Cancel this demo reservation?</b>
                <p>
                  It will move to Cancelled in My trips. No money changes hands.
                </p>
                <div>
                  <button
                    className="btn btn-outline"
                    onClick={() => setCancelConfirm(false)}
                  >
                    Keep my trip
                  </button>
                  <button className="btn btn-danger" onClick={cancel}>
                    Yes, cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="text-button danger cancel-booking"
                onClick={() => setCancelConfirm(true)}
              >
                Cancel demo reservation
              </button>
            ))}
          <p className="modal-note">
            This is a demonstration. No real travel booking exists.
          </p>
        </Modal>
      )}
      {info && (
        <Modal title={info} onClose={() => setInfo("")}>
          {infoContent[info]}
        </Modal>
      )}
      {editProfile && profile && (
        <PersonalDetails
          profile={profile}
          onClose={() => setEditProfile(false)}
          onSave={(p) => {
            setProfile(p);
            setEditProfile(false);
            setToast("Your demo profile has been updated.");
          }}
        />
      )}
      {gallery !== null && (
        <Modal
          title={`${selectedTour.location} · ${gallery + 1} / ${photoList.length}`}
          wide
          onClose={() => setGallery(null)}
        >
          <div className="gallery-viewer">
            <img
              src={photoList[gallery]}
              alt={gallery === 0 ? selectedTour.location : "Travel inspiration"}
            />
            <button
              className="gallery-prev icon-button"
              aria-label="Previous photo"
              onClick={() =>
                setGallery((gallery + photoList.length - 1) % photoList.length)
              }
            >
              <Icon name="arrowLeft" />
            </button>
            <button
              className="gallery-next icon-button"
              aria-label="Next photo"
              onClick={() => setGallery((gallery + 1) % photoList.length)}
            >
              <Icon name="arrow" />
            </button>
          </div>
          <div className="gallery-thumbs">
            {photoList.map((src, i) => (
              <button
                key={i}
                aria-label={`Show photo ${i + 1}`}
                aria-pressed={gallery === i}
                className={gallery === i ? "active" : ""}
                onClick={() => setGallery(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
          <p className="modal-note">
            Destination and accommodation inspiration. Images are illustrative.
          </p>
        </Modal>
      )}
      <div className="toast-container" role="status" aria-live="polite">
        {toast && (
          <div className="toast">
            <span>
              <Icon name="check" size={17} />
            </span>
            {toast}
            <button
              aria-label="Dismiss notification"
              onClick={() => setToast("")}
            >
              <Icon name="close" size={15} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
