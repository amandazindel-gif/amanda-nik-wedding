/* =========================================================================
   AMANDA & NIK · SCHLIERSEE 2027 — SITE DATA
   Everything guests read lives in this one file. Edit here, every page updates.
   Items marked PLACEHOLDER still need confirming.

   Internal links are written as site routes ("/wear/"). The build prefixes
   them with BASE_URL, so they keep working under a project Pages path.
   ========================================================================= */

export const wedding = {
  weddingISO: "2027-06-17T15:00:00+02:00",     /* PLACEHOLDER · ceremony start */
  rsvpDeadline: "December 31, 2026",
  contactEmail: "hello@amandaandnik.com",      /* PLACEHOLDER · contact address */

  /* Google Sheet connector: paste the Apps Script Web app URL (ends in /exec). Empty = use the invitees list below. */
  sheetScriptUrl: "https://script.google.com/macros/s/AKfycbxTkjIbzqGDjIIbpVETZ7dJrapkjjKNys2h1hhmMXHRMDWX0nSaDf860MTc23gtXKHsqQ/exec",

  /* Ask Daisy proxy. Empty = the chat answers from the built-in keyword fallback only.
     See server/daisy-worker.js. Never put an API key in this file. */
  daisyEndpoint: "",

  /* ============================================================
     GUEST LIST — PLACEHOLDER DATA. Replace from your spreadsheet.
     One entry per invited party (household). The RSVP page looks up
     whichever name a guest types and pulls up their whole party.
       id            any unique string (row id from the sheet is fine)
       members       every invited person by full name
       plusOneName   name of a known partner, or "" if unnamed
       plusOneOpen   true = they may add a guest we don't have a name for
     Aliases/nicknames go in "also" so lookups still match.
     Only used when sheetScriptUrl is empty or unreachable.
     ============================================================ */
  invitees: [
    { id: "P001", members: ["Sample Guest", "Sample Partner"], plusOneOpen: false, also: ["Sam"] },
    { id: "P002", members: ["Example Person"], plusOneOpen: true, also: [] },
    { id: "P003", members: ["Test Family Adult One", "Test Family Adult Two"], plusOneOpen: false, also: [] }
  ],

  /* Meal choices shown per person on the RSVP */
  mealOptions: [
    { id: "beef", label: "Bavarian BBQ" },
    { id: "veg", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" }
  ],

  /* Venue photography, courtesy of stoegeralm.de.
     TODO before launch: with permission, download these into public/assets and
     swap the URLs for local paths (npm run fetch-venue-photos does the download). */
  venuePhotos: [
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/400.jpg", alt: "The Stögeralm hut and meadow above the Schliersee" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/hs1.jpg", alt: "Wedding tables set up at the Stögeralm" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/gal_30.jpg", alt: "View over the valley from the alm" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/img_0100.jpg", alt: "Inside the Stögeralm hut" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/405.jpg", alt: "The alm terrace" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/hs21.jpg", alt: "A celebration at the Stögeralm" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/img_0164.jpg", alt: "Alpine meadow around the alm" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/300.jpg", alt: "The Stögeralm in summer" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/410.jpg", alt: "Mountains around the Schliersee" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/hs6.jpg", alt: "Dinner service at the alm" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/402.jpg", alt: "The alm and surrounding peaks" },
    { src: "https://www.stoegeralm.de/index_files/vlb_images1/305.jpg", alt: "Evening at the Stögeralm" }
  ],

  /* Photos of the Markus Wasmeier museum, used by the Welcome tab carousel.
     TODO before launch: add more museum photos here. */
  museumPhotos: [
    { src: "assets/explore-museum.jpg", alt: "Historic farmhouses at the Markus Wasmeier Open-Air Museum" },
    { src: "assets/welcome-wirtshaus.jpg", alt: "The traditional inn at the Markus Wasmeier Open-Air Museum" }
  ],

  days: [
    {
      id: "wed", weekday: "Wed", dateLabel: "16", short: "Welcome", title: "Welcome party",
      longDate: "Wednesday, June 16, 2027",
      intro: "Arrive Tuesday or Wednesday and take some time to explore. The lakes and mountains here are breathtaking. Then on Wednesday evening, we'll welcome everyone to Bavaria with a proper Bavarian party.",
      venue: {
        label: "The welcome party",
        name: "Markus Wasmeier Open-Air Museum",
        blurb: "A living museum of old Bavarian farmhouses, a brewery and an inn, one train stop from Schliersee.",
        credit: "",
        photos: "museum"
      },
      events: [
        { icon: "train", time: "5:00–5:30 PM", start: "17:00", end: "17:30", title: "Train to the museum", place: "Schliersee Bahnhof → Fischhausen-Neuhaus", blurb: "One stop on the BRB around the lake. We'll ride together.", dress: "Your welcome party outfit.", transport: "Meet on the platform at Schliersee Bahnhof. Buy a single ticket to Fischhausen-Neuhaus at the blue machine on the platform (cards and cash) or in the MVGO app before you board.", note: "It's a short, flat walk from Fischhausen-Neuhaus station to the museum.", mapsUrl: "https://www.google.com/maps/place/Schliersee,+Bahnhof/@47.7352694,11.8598473,19z/data=!4m6!3m5!1s0x479d8a518a823e0d:0xd717a7e3a91b5c24!8m2!3d47.7355007!4d11.8607954", link: { label: "Get the MVGO app", href: "https://www.mvg.de/services/mobile-services/mvgo.html" } },
        { icon: "museum", time: "5:30–6:30 PM", start: "17:30", end: "18:30", title: "Museum tour", place: "Markus Wasmeier Open-Air Museum", blurb: "A guided walk through historic Upper Bavarian farmhouses, rebuilt beam by beam in a meadow by the lake.", dress: "Comfortable shoes. The paths are gravel and grass.", transport: "A short walk from Fischhausen-Neuhaus station.", note: "Founded by Olympic ski champion Markus Wasmeier, the museum brings old farm life back to life, with a working brewery, bakery and Wirtshaus.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Markus%20Wasmeier%20Freilichtmuseum%2C%20Brunnbichl%205%2C%2083727%20Schliersee-Neuhaus%2C%20Germany" },
        { icon: "beer", time: "6:30–10:00 PM", start: "18:30", end: "22:00", title: "Welcome party", place: "Markus Wasmeier Open-Air Museum", blurb: "Finger foods, drinks, and some minglin'.", dress: "Tracht highly encouraged.", transport: "You're already there.", note: "Adults only.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Markus%20Wasmeier%20Freilichtmuseum%2C%20Brunnbichl%205%2C%2083727%20Schliersee-Neuhaus%2C%20Germany", link: { label: "What to wear", href: "/wear/" } },
        { icon: "train", time: "10:45–10:50 PM", start: "22:45", end: "22:50", title: "Last train back", place: "Fischhausen-Neuhaus → Schliersee Bahnhof", blurb: "The last train back into Schliersee. Don't miss it!", dress: "—", transport: "One stop back to Schliersee from Fischhausen-Neuhaus. Buy your return at the machine on the platform or in the MVGO app before you board.", note: "We'll walk over to the station together.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bahnhof%20Fischhausen-Neuhaus%2C%20Schliersee" }
      ]
    },
    {
      id: "thu", weekday: "Thu", dateLabel: "17", short: "Wedding", title: "The wedding day",
      longDate: "Thursday, June 17, 2027",
      intro: "Up the mountain to Stögeralm. Ceremony in the meadow, then food, mountains and dancing until the wee hours.",
      venue: {
        label: "The venue",
        name: "Stögeralm",
        blurb: "A family alm above the Schliersee: meadow, long wooden tables, a hut that has seen a lot of dancing.",
        credit: "Photos: stoegeralm.de",
        photos: "venue"
      },
      events: [
        { icon: "bus", time: "2:00 PM", start: "14:00", title: "Shuttles to the alm", place: "Meeting point: Terofal", blurb: "Meet outside the Terofal in the village and we'll take you up to the venue.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Terofal%20Boutique%20Hotel%2C%20Xaver-Terofal-Platz%202%2C%2083727%20Schliersee%2C%20Germany" },
        { icon: "coffee", time: "2:30–3:00 PM", start: "14:30", end: "15:00", title: "Welcome coffee and cake", place: "Stögeralm", blurb: "A traditional Bavarian afternoon: Kaffee und Kuchen, with a view." },
        { icon: "rings", time: "3:30 PM", start: "15:30", title: "Ceremony", place: "Stögeralm", blurb: "In the meadow, at the same site as the venue." },
        { icon: "beer", time: "4:45 PM", start: "16:45", title: "Cocktails", place: "Stögeralm", blurb: "Can Nik successfully tap the barrel?" },
        { icon: "fork", time: "6:00 PM", start: "18:00", title: "Dinner", place: "Stögeralm", blurb: "Long tables, local food, and toasts." },
        { icon: "music", time: "Until 2:00 AM", start: "20:00", title: "Party and shuttles down", place: "Stögeralm → Schliersee", blurb: "Shuttles back to the village at 11:00 PM, midnight and 2:00 AM." }
      ]
    },
    {
      id: "fri", weekday: "Fri", dateLabel: "18", short: "Recover", title: "Recovery day",
      longDate: "Friday, June 18, 2027",
      intro: "A day to recover and relax. Nothing formal planned.",
      venue: {
        label: "The venue",
        name: "Stögeralm",
        blurb: "A family alm above the Schliersee: meadow, long wooden tables, a hut that has seen a lot of dancing.",
        credit: "Photos: stoegeralm.de",
        photos: "venue"
      },
      events: []
    }
  ],

  /* lat/lng are approximate — nudge them if a pin sits slightly off */
  pins: [
    { kind: "Wedding", name: "Stögeralm", address: "Stögeralm 1, 83727 Schliersee, Germany", lat: 47.7012, lng: 11.8622, desc: "The alm above the lake. Meadow ceremony, long tables, dancing. Shuttles from the village.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=St%C3%B6geralm%201%2C%2083727%20Schliersee%2C%20Germany" },
    { kind: "Airport", name: "Munich Airport (MUC)", address: "Munich Airport, Nordallee 25, 85356 München-Flughafen, Germany", lat: 48.3537, lng: 11.7750, desc: "Where you'll land. About an hour to Schliersee by train or car.", mapsUrl: "https://www.google.com/maps/dir/?api=1&origin=Munich+Airport+(MUC)&destination=Schliersee,+Germany" },
    { kind: "Shuttle point", name: "Schliersee station", address: "47.7355007,11.8607954", lat: 47.7355007, lng: 11.8607954, desc: "Trains from Munich arrive here, and it's where the wedding shuttles pick up.", mapsUrl: "https://www.google.com/maps/place/Schliersee,+Bahnhof/@47.7352694,11.8598473,19z/data=!4m6!3m5!1s0x479d8a518a823e0d:0xd717a7e3a91b5c24!8m2!3d47.7355007!4d11.8607954" },
    { kind: "Hotel", name: "Seehotel Schlierseer Hof", address: "Seehotel Schlierseer Hof, Seestraße 21, 83727 Schliersee, Germany", lat: 47.7346, lng: 11.8583, desc: "Right on the water, with a terrace made for a pre-dinner drink.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Seehotel%20Schlierseer%20Hof%2C%20Seestra%C3%9Fe%2021%2C%2083727%20Schliersee%2C%20Germany" },
    { kind: "Hotel", name: "Terofal Boutique Hotel", address: "Terofal Boutique Hotel, Xaver-Terofal-Platz 2, 83727 Schliersee, Germany", lat: 47.7371, lng: 11.8592, desc: "In the village, small and characterful, a short walk from everything.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Terofal%20Boutique%20Hotel%2C%20Xaver-Terofal-Platz%202%2C%2083727%20Schliersee%2C%20Germany" },
    { kind: "To do", name: "Markus Wasmeier open-air museum", address: "Markus Wasmeier Freilichtmuseum, Brunnbichl 5, 83727 Schliersee-Neuhaus, Germany", lat: 47.7100, lng: 11.8760, desc: "Old Bavarian farmhouses rebuilt in a meadow, with a proper Wirtshaus and beer garden.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Markus%20Wasmeier%20Freilichtmuseum%2C%20Brunnbichl%205%2C%2083727%20Schliersee-Neuhaus%2C%20Germany" }
  ],

  hotels: [
    { tier: "On the lake", price: "€€", name: "Seehotel Schlierseer Hof", address: "Seehotel Schlierseer Hof, Seestraße 21, 83727 Schliersee, Germany", lat: 47.7346, lng: 11.8583, photo: "assets/hotel-seehotel.jpg", photoAlt: "The Seehotel Schlierseer Hof on the lakeshore, with parasols and a jetty on the water", gallery: [{ src: "assets/hotel-seehotel-room.jpg", alt: "Sun pouring through an open balcony door onto wicker chairs, the lake and pool below" }, { src: "assets/hotel-seehotel-pool.jpg", alt: "The lakeside pool with red parasols, mountains across the water" }, { src: "assets/hotel-seehotel-dock.jpg", alt: "A lounge deck with beanbags and net hammocks over the lake" }], desc: "The classic lakeside stay. Rooms with a water view, a spa, and a terrace you won't want to leave. It's the largest property, and where the bulk of attendees will be staying.", distance: "5 min walk to the village · 3 to 5 min drive to the alm", bookingUrl: "https://www.google.com/search?q=Seehotel+Schlierseer+Hof", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Seehotel%20Schlierseer%20Hof%2C%20Seestra%C3%9Fe%2021%2C%2083727%20Schliersee%2C%20Germany" },
    { tier: "Village", price: "€€€", name: "Terofal Boutique Hotel", address: "Terofal Boutique Hotel, Xaver-Terofal-Platz 2, 83727 Schliersee, Germany", lat: 47.7371, lng: 11.8592, photo: "assets/hotel-terofal.jpg", photoAlt: "The painted Terofal building in Schliersee village beside the maypole and its beer garden", gallery: [{ src: "assets/hotel-terofal-room.jpg", alt: "A Terofal room through open windows, pine panelling and an orange velvet throw" }, { src: "assets/hotel-terofal-view.jpg", alt: "The view from a Terofal balcony: the maypole, the yellow church and the lake" }, { src: "assets/hotel-terofal-breakfast.jpg", alt: "Terofal breakfast: fruit, ham, brown bread, a heart-topped cappuccino and a glass of sekt" }, { src: "assets/hotel-terofal-pretzel.jpg", alt: "Nik peering through a pretzel at breakfast in the Terofal dining room" }], desc: "Small, warm and very Bavarian, above a beer garden next to the Maibaum in the middle of the village. This is where we're suggesting the wedding party stay.", distance: "In the village · 3 to 5 min drive to the alm", bookingUrl: "https://www.google.com/search?q=Terofal+Schliersee", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Terofal%20Boutique%20Hotel%2C%20Xaver-Terofal-Platz%202%2C%2083727%20Schliersee%2C%20Germany" },
    { tier: "Apartments", price: "€€", name: "Vrbo & Airbnb around the lake", photo: "assets/hotel-apartments.jpg", photoAlt: "A restored Bavarian farmhouse holiday let with green shutters and a carved wooden balcony", desc: "Good for families and groups: kitchens, balconies, and space to sprawl. Filter for step-free access if you need it. Keep in mind both hotels include an elaborate breakfast.", distance: "Walkable if you stay in Schliersee", bookingUrl: "https://www.vrbo.com/search?q=Schliersee" }
  ],

  /* Eat & drink — its own section on the Explore page */
  food: [
    { kind: "Village · Bavarian", name: "Ratskeller", photo: "assets/food-ratskeller-garden.jpg", photoAlt: "The Augustiner Ratskeller beer garden under blue parasols, a waiter in Lederhosen carrying glasses", gallery: [{ src: "assets/food-ratskeller-gate.jpg", alt: "The Augustiner Ratskeller Biergarten gate with a gingerbread heart, steps up from the square" }, { src: "assets/explore-biergarten.jpg", alt: "Beer-garden benches with blue parasols and geraniums in Schliersee village" }], desc: "Traditional Bavarian cooking in the middle of the village. Our pick for a nice lunch outside, or a nice sit-down dinner inside.", url: "https://www.ratskeller-schliersee.de/", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ratskeller%20Schliersee" },
    { kind: "Lakeside · Beer garden", name: "Hofhaus am See", photo: "assets/food-hofhaus.jpg", photoAlt: "The Hofhaus am See terrace with parasols and flowering chestnut trees, the lake and mountains behind", desc: "A lovely restaurant right on the water serving traditional Bavarian food, with a patio and indoor seating.", url: "http://www.hofhaus-am-see.de/", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hofhaus%20am%20See%20Schliersee" },
    { kind: "Up the mountain · Bavarian", name: "Schliersbergalm", photo: "assets/explore-schliersberg-beer.jpg", photoAlt: "Amanda taking a swig of beer at the Schliersbergalm, the lake far below", gallery: [{ src: "assets/explore-schliersberg-pool.jpg", alt: "The Schliersbergalm pool on the meadow above the lake" }], desc: "A hotel sitting above the village with lunch and a biergarten to enjoy the views.", url: "http://www.schliersbergalm.com/", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Schliersbergalm%2C%20Schliersee" },
    { kind: "Village · Italian", name: "Aqua Ristorante", photo: "assets/food-aqua-pizza.jpg", photoAlt: "A margherita with fresh basil and an Aperol spritz on an outdoor table at Aqua Ristorante", desc: "A Neapolitan-run Italian near the station. Fish, pasta and very good pizza. Closed Tuesdays and Wednesdays.", url: "https://www.aquaristorante.de/", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Aqua%20Ristorante%2C%20Bahnhofstra%C3%9Fe%202%2C%2083727%20Schliersee" },
    { kind: "Lakeside · Café", name: "Café Milchhäusl", photo: "assets/explore-cafe-cake.jpg", photoAlt: "Cappuccino, marble cake and a berry tart on a sunny café table", desc: "On the water by the Kurpark, three minutes from the station. Kaiserschmarrn, strudel, Weißwurst breakfast, and rowboats and SUPs to rent.", url: "https://www.milchhaeusl-schliersee.de/", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Milchh%C3%A4usl%2C%20Kurweg%204%2C%2083727%20Schliersee" },
    { kind: "Day trip · Café", name: "Café Winklstüberl", photo: "assets/food-winkl-cake.jpg", photoAlt: "Coffee in floral Winklstüberl china next to a thick slice of nut braid", gallery: [{ src: "assets/food-winkl-terrace.jpg", alt: "The busy geranium-lined terrace of Café Winklstüberl under its old timber farmhouse" }], desc: "A short drive into the Leitzach valley for enormous slices of cake on a terrace full of geraniums. Worth the detour.", url: "https://www.winklstueberl.de/", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Winklst%C3%BCberl%2C%20Fischbachau" }
  ],

  explore: [
    { kind: "Lake", name: "Schliersee lakefront", photo: "assets/explore-lakefront.jpg", photoAlt: "Sunbathers and a moored sailboat on the grassy Schliersee lido, mountains across the water", gallery: [{ src: "assets/explore-lake-shore.jpg", alt: "The pebble shore of the Schliersee under big clouds, mountains reflected in the water" }, { src: "assets/explore-lake-bench.jpg", alt: "A bench under a linden tree looking over a flower-hung fence to the lake" }], desc: "Swim, rent a paddle board, row the boat, ride the e-bike, or just take a walk around the lake.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Schliersee+See" },
    { kind: "View", name: "Schliersbergalm cable car", address: "Schliersbergalm Bahn, Dekan-Maier-Weg 10, 83727 Schliersee, Germany", lat: 47.7333, lng: 11.8686, photo: "assets/explore-cable-car.jpg", photoAlt: "A Schliersbergbahn gondola above green slopes with the lake and peaks beyond", gallery: [{ src: "assets/explore-schliersberg-pool.jpg", alt: "The Schliersbergalm pool on the meadow with the whole lake and Wörth island below" }, { src: "assets/explore-schliersberg-amanda.jpg", alt: "Amanda grinning with an Ayinger beer, the lake far below" }, { src: "assets/explore-schliersberg-beer.jpg", alt: "Amanda taking a swig of beer on the wall at the Schliersbergalm" }, { src: "assets/explore-schliersberg-gondola.jpg", alt: "A retired gondola cabin by the summer toboggan track, a gondola gliding over the lake" }], desc: "Take the cable car up, enjoy lunch and a beer, and then take the alpine slide down.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Schliersbergalm%20Bahn%2C%20Dekan-Maier-Weg%2010%2C%2083727%20Schliersee%2C%20Germany" },
    { kind: "Spa", name: "Vitalwelt / monte mare", photo: "assets/explore-spa.jpg", photoAlt: "The Vitalwelt spa in Schliersee from above, outdoor pool and sun terraces beside the village", desc: "Pools and saunas. The right answer to a wedding hangover.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=monte+mare+Schliersee" },
    { kind: "Stroll", name: "The bench above the church", photo: "assets/explore-village-bench.jpg", photoAlt: "A wooden bench under a chestnut tree looking down on Schliersee's yellow church and the lake", gallery: [{ src: "assets/explore-church.jpg", alt: "The yellow St. Sixtus church tower with a winding path and mountains behind" }], desc: "A five minute walk uphill from the village to get this view.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pfarrkirche+St.+Sixtus+Schliersee" },
    { kind: "Day trip", name: "Tegernsee & Bräustüberl", photo: "assets/explore-tegernsee.jpg", photoAlt: "Boats moored along the flower-lined promenade at Rottach-Egern on the Tegernsee", desc: "Twenty minutes away, featuring a monastery beer hall and a lake to walk around. Known as the boujee spot of the area.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Br%C3%A4ust%C3%BCberl+Tegernsee" },
    { kind: "Hike", name: "Wallbergbahn & Brecherspitz", photo: "assets/explore-wallberg.jpg", photoAlt: "The Wallberg cable-car top station and chapel on a green alpine ridge with peaks beyond", desc: "Cable car for the easy version, Brecherspitz ridge hike for the adventurous. Incredible views of the area, and much higher than the Schliersbergalm cable car.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Wallbergbahn" },
    { kind: "Ride", name: "Alpenroller alpine coaster", photo: "assets/explore-alpenroller.jpg", photoAlt: "Alpine coaster carts lined up at the Schliersbergalm above the lake, giant chess board beside them", gallery: [{ src: "assets/explore-schliersberg-gondola.jpg", alt: "The green toboggan track snaking down the meadow toward the lake" }], desc: "Alpine slides that take you back down to the neighborhood, then a short walk back into town. Fun with great views!", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Schliersbergalm+Alpenroller" },
    { kind: "Day trip", name: "Eibsee & Garmisch", photo: "assets/explore-garmisch-kiss.jpg", photoAlt: "Amanda and Nik kissing on a mountain lookout high above Garmisch-Partenkirchen", gallery: [{ src: "assets/explore-eibsee.jpg", alt: "Amanda and Nik on the turquoise shore of the Eibsee under the Zugspitze" }, { src: "assets/explore-garmisch-terrace.jpg", alt: "A sunny mountain-restaurant terrace with red tables facing the Wetterstein range" }, { src: "assets/explore-garmisch-hut.jpg", alt: "A Bavarian flag flying over a hut terrace, forest and Karwendel peaks beyond" }], desc: "About 90 minutes west. The impossibly turquoise Eibsee under the Zugspitze, then a cable car above Garmisch for lunch with a view.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Eibsee" }
  ],

  /* GUEST DIRECTORY — PLACEHOLDER. Add one entry per guest who opted in on their RSVP.
     Leave empty and the page shows the "coming soon" note instead.
     { name: "Jane Doe", side: "Amanda's side", phone: "+1 303 555 0134", email: "jane@example.com" } */
  guests: [],

  faqs: [
    { cat: "Logistics", q: "Is my passport OK?", a: "It needs to be valid for at least three months after you leave the EU, and issued within the last ten years. Check early!" },
    { cat: "Logistics", q: "Cash or card?", a: "Many places will accept credit cards, but there are still some restaurants, cafés, etc. that prefer cash. Bring a couple of hundred euros, or take some out at the ATM in town." },
    { cat: "Logistics", q: "Do I need to tip?", a: "Service is included. Rounding up, or about 5–10% for a nice meal, is normal and appreciated." },
    { cat: "Attire", q: "What is the attire for the wedding?", a: "", link: { pre: "See ", text: "what to wear", href: "/wear/", post: " for details and inspo." } },
    { cat: "Attire", q: "Do I really need Tracht for Wednesday?", a: "No, but it's highly encouraged. It's genuinely fun and a great way to experience the local culture. We'll share links to shops, plus an option to rent." },
    { cat: "Attire", q: "What's the weather like in June?", a: "Beautiful and moody. Days around 22°C / 72°F, evenings on the mountain closer to 10°C / 50°F, and the odd afternoon thunderstorm. Bring layers!" },
    { cat: "Wedding events", q: "What if it rains?", a: "Only the ceremony spot changes. We'll move it under the awnings and umbrellas at the venue." },
    { cat: "Wedding events", q: "Can I bring my kids?", a: "Sorry, we're keeping this one adults only for both nights! We know that's a big ask when you're traveling so far, so tell us if you need help finding a local sitter. Some guests are bringing their kids along with a family member or sitter to watch them during the wedding events." },
    { cat: "Logistics", q: "How accessible is the alm?", a: "There's vehicle access to the top and a step-free route to the ceremony seating, dinner and dancing, plus an accessible toilet. Tell us if you require any specific support." },
    { cat: "Odds & ends", q: "Does Daisy get to come?", a: "She lobbied hard, but no. She'll be holding down the couch at home until we're back." },
    { cat: "Odds & ends", q: "Any gifts?", a: "There's no registry for a reason. We're already asking a lot for you to be here, so we don't want anything but your presence." },
    { cat: "Odds & ends", q: "More questions?", a: "Just text Nik or Amanda if you have any questions! We're trying to fill our website with as much detail as possible to make logistics as seamless as possible." }
  ],

  /* ---------- Home page chapters ---------- */
  chapters: [
    { when: "Anytime before Wednesday, June 16", title: "You land in Munich", body: "Arrive whenever your flights allow. Nothing is scheduled until Wednesday night, but we would recommend guests arrive in Schliersee on Tuesday or Wednesday morning to explore the town. It's about an hour from Munich to Schliersee by train or car.", where: "MUC → Schliersee", href: "/travel/", cta: "Plan the journey", photo: "assets/munich-marienplatz.jpg", photoAlt: "Munich's Marienplatz at dusk, the New Town Hall spire and the Frauenkirche towers above the rooftops" },
    { when: "Tuesday, June 15 – Wednesday, June 16", title: "Explore Schliersee", body: "Take some time to enjoy the beautiful village of Schliersee. There is so much to do and explore on the lake, in the mountains, or just walking around town.", where: "Schliersee", href: "/explore/", cta: "Explore Schliersee", photo: "assets/schliersee-village-lake.jpg", photoAlt: "Schliersee village and its lake at golden hour, church spire below a meadow and the surrounding peaks" },
    { when: "Wednesday, June 16", title: "The welcome party", body: "To kick off the wedding, we wanted to get everyone together for a casual, but very Bavarian, welcome party. What better setting than a traditional Bavarian village? We want to immerse everyone into the culture, so traditional tracht, dirndl and lederhosen, are strongly encouraged.", where: "Markus Wasmeier Freilichtmuseum Schliersee", href: "/schedule/", cta: "Welcome party details", photo: "assets/welcome-wirtshaus.jpg", photoAlt: "Rows of weathered wooden beer tables on the grass outside the Wirtshaus zum Woferlhof, a timbered Bavarian farmhouse inn" },
    { when: "Thursday, June 17", title: "Up to the alm", body: "Shuttles will take guests from town up to the wedding ceremony and reception venue. The ceremony will be held in the meadow, so bring comfortable shoes, but make sure you also wear your party pants because we have the venue until 2am.", where: "Stögeralm", href: "/schedule/", cta: "The wedding day", photo: "assets/stoegeralm-ceremony-terrace.jpg", photoAlt: "Ceremony set-up at the Stögeralm: wooden benches, a floral arch and the Schliersee below" },
    { when: "Friday, June 18", title: "The slow day", body: "No need to check out and get out of town after a long night. Sleep in and take the day in town at your own pace. Ride the cable car, take a swim, or hit the spa, whatever you haven't gotten to yet. There are plenty of spots around the lake where we can congregate and pick up where we left off. :)", where: "Schliersee & the lake", href: "/explore/", cta: "Things to do", photo: "assets/hotel-seehotel-dock.jpg", photoAlt: "A lakeside deck at the Seehotel with bean bags, a hammock net over the water and a swim ladder, mountains beyond", filter: "brightness(1.18) contrast(1.04) saturate(1.08)" },
    { when: "Saturday, June 19", title: "Home, or onwards", body: "There are trains back to Munich all morning. Or don't? In Germany, Tegernsee, Spitzingsee and Neuschwanstein Castle are all within reach. Across the border in Austria, Salzburg and Innsbruck are an easy trip away. You came a long way, so enjoy your time as much as you can!", where: "Wherever your heart desires", href: "/explore/", cta: "Extend the trip", photo: "assets/bavaria-valley-train.jpg", photoAlt: "A train winding through a green Bavarian valley below the Alps" }
  ],

  /* ---------- Our Story ---------- */
  storyPhotos: [
    { src: "assets/us-oktoberfest.jpg", alt: "Amanda in a dirndl and Nik in lederhosen at the Oktoberfest gates in Munich", place: "Munich", country: "Germany" },
    { src: "assets/us-capetown.jpg", alt: "Arms out on a rock high above Cape Town at sunset", place: "Lion's Head", country: "South Africa" },
    { src: "assets/us-botswana.jpg", alt: "Amanda and Nik in the delta with an elephant grazing behind them", place: "Okavango Delta", country: "Botswana" },
    { src: "assets/us-greece-beach.jpg", alt: "Clinking spritzes on sun loungers at a Greek beach", place: "Milos", country: "Greece" },
    { src: "assets/us-sunrise.jpg", alt: "A summit selfie at sunrise above the clouds", place: "Boquete", country: "Panama" },
    { src: "assets/us-helicopter.jpg", alt: "Grinning in a helicopter over the falls", place: "Victoria Falls", country: "Zimbabwe" },
    { src: "assets/us-acropolis.jpg", alt: "Amanda and Nik in front of the Parthenon in Athens", place: "Athens", country: "Greece" },
    { src: "assets/us-lobster.jpg", alt: "Holding up lobsters on a boat at sunset", place: "Halifax", country: "Nova Scotia" },
    { src: "assets/us-south-africa.jpg", alt: "Amanda and Nik in matching blue shweshwe outfits in a garden", place: "Pretoria", country: "South Africa", objectPosition: "50% 68%", scale: 1.4, transformOrigin: "52% 58%" }
  ],

  /* Countries highlighted on the Our Story map. Names must match
     world-atlas@2 countries-110m `properties.name`. */
  countriesVisited: ["United States of America", "Canada", "Mexico", "Costa Rica", "Guatemala", "Panama", "Brazil", "Bahamas", "Morocco", "South Africa", "Botswana", "Zimbabwe", "Mauritius", "Austria", "Italy", "Spain", "France", "United Kingdom", "Ireland", "Portugal", "Belgium", "Greece", "Croatia", "New Zealand", "China", "Vietnam", "Thailand", "Japan", "India", "Zambia", "Czechia", "Czech Rep.", "Czech Republic", "Hungary", "Iceland", "Netherlands", "Slovakia", "Switzerland", "Puerto Rico", "Ghana", "Nicaragua", "Belize", "United Arab Emirates", "South Korea", "Korea", "Myanmar", "Turkey", "Türkiye", "Sweden"],

  /* Island states too small for the 1:110m geometry, drawn as dots. */
  mapIslands: [
    { name: "Mauritius", lonLat: [57.55, -20.35] },
    { name: "Bahamas", lonLat: [-77.4, 24.5] },
    { name: "Azores", lonLat: [-28.0, 38.5] },
    { name: "Gibraltar", lonLat: [-5.35, 36.14] },
    { name: "Turks and Caicos", lonLat: [-71.8, 21.7] },
    { name: "Puerto Rico", lonLat: [-66.4, 18.2] },
    { name: "Vatican City", lonLat: [12.45, 41.9] },
    { name: "Singapore", lonLat: [103.82, 1.35] }
  ],

  /* ---------- What to wear ---------- */
  dressCodes: [
    {
      id: "tracht",
      eyebrow: "Wednesday · Welcome party",
      title: "Tracht strongly encouraged",
      intro: "Tracht is traditional Bavarian dress: the dirndl and the lederhosen. People here wear it for festivals, weddings and big nights out. It is normal, not a costume. We'd love the whole room in it for the welcome party. It's the most Bavarian way to kick off the week!",
      theme: "sage",
      photos: [
        { src: "assets/wear-tracht-barrels.jpg", alt: "Amanda in a sage dirndl and Nik in a green vest and lederhosen in front of the Hofbräu beer wagon at Oktoberfest", objectPosition: "50% 92%" },
        { src: "assets/wear-tracht-spin.jpg", alt: "Amanda twirling with Nik under the Paulaner tower at Oktoberfest", objectPosition: "50% 85%" },
        { src: "assets/wear-tracht-beer.jpg", alt: "Amanda and Nik drinking from beer steins in an Oktoberfest tent", objectPosition: "50% 40%" }
      ],
      dos: ["Dirndls with a blouse", "Lederhosen (vest not required)"],
      donts: ["A cheap costume off Amazon. If you'd rather not buy one when you arrive, you can rent for 50–60 euros. These will be delivered to the hotel."],
      links: [
        { label: "Buy", href: "https://www.angermaier.de/" },
        { label: "Rent", href: "#RENT-LINK-PLACEHOLDER" }  /* PLACEHOLDER · rental partner link */
      ]
    },
    {
      id: "alpine",
      eyebrow: "Thursday · Wedding day",
      title: "Alpine cocktail",
      theme: "blush",
      photos: [
        { src: "assets/wear-garden-formal.jpg", alt: "A couple dressed for a garden wedding at night: an off-shoulder floral midi dress with strappy sandals, and a light linen suit with an open collar and no tie", objectPosition: "50% 30%" },
        { src: "assets/wear-garden-party.jpg", alt: "Guests at a backyard garden party in floral midi dresses and light suits", objectPosition: "50% 70%" },
        { src: "assets/wear-garden-couple.jpg", alt: "A couple in a pale blue satin midi dress and a linen jacket with white trousers in a formal garden", objectPosition: "50% 50%" },
        { src: "assets/wear-garden-tent.jpg", alt: "Wedding guests on a lawn by a white tent in long pink and coral dresses and blue suits", objectPosition: "50% 60%" },
        { src: "assets/wear-garden-pastels.jpg", alt: "Five guests in long pastel dresses in sage, light blue, mint floral, pistachio and pink lace in a garden", objectPosition: "50% 75%" }
      ],
      dos: ["Midi and long dresses, any colors or patterns", "Summer or linen suits (jackets and ties not required)", "A light jacket or wrap for the evening", "Bring flats and/or strongly consider block heels"],
      donts: ["Black tie", "Stilettos. There's grass and gravel."],
      links: [{ label: "Pinterest board", href: "https://www.pinterest.com/amandaz1216/wedding-attire/" }]
    },
    {
      id: "lake",
      eyebrow: "Friday · Chill day",
      title: "Lake casual",
      theme: "paper",
      photos: [{ src: "assets/explore-lakefront.jpg", alt: "The Schliersee lakefront on a summer day", objectPosition: "50% 50%" }],
      dos: ["Shorts and a swimsuit", "Athleisure or comfy layers", "Gym shoes for walking/hiking", "A fleece and a rain layer"],
      donts: [],
      links: []
    }
  ],

  /* Left column reads down to "A fun fact or a bad joke", right to "Party pants". */
  packList: [
    "Shoes: flats, block heels, hiking/walking shoes",
    "A jacket or shawl for evenings (10°C / 50°F is normal)",
    "Light rain layer, just in case",
    "Sunscreen and sunglasses",
    "Swimsuit for the lake or the spa",
    "Some euros in cash",
    "Your passport (valid 3+ months past your return)",
    "A plug adapter (Europlug, type C/F)",
    "A fun fact or a bad joke",
    "Party pants"
  ],

  /* ---------- Ask Daisy ---------- */
  daisyChips: [
    "When and where is the wedding?",
    "How do I get to Schliersee?",
    "What should I wear?",
    "Where should I stay?"
  ]
};

export default wedding;
