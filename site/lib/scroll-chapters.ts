export type ScrollChapter = {
  id: string;
  kicker: string;
  title: string;
  plain: string;
  slug?: string;
  href?: string;
  badge?: string;
  placeholder?: string;
};

export const SCROLL_CHAPTERS: ScrollChapter[] = [
  {
    id: "akkodis",
    kicker: "Work",
    title: "The Leesburg floor is a contractor seat.",
    plain: "I rack hardware and pull fiber and ethernet as a Datacenter Technician at Akkodis. The assignment is a Google data center in Leesburg, Virginia, from September 2025 to now. Akkodis is the employer. I am not a Google employee.",
  },
  {
    id: "gym-role",
    kicker: "Work",
    title: "Gym systems, as staff.",
    plain: "At DMV Iron Gym in Falls Church I am a Team Member and Systems Administrator, from July 2024 to now. I set up member accounts, take payments, and keep the membership software and the spreadsheets moving. The owner is Leo Torres Williams. I am not the owner, and I am not the founder.",
  },
  {
    id: "school",
    kicker: "School",
    title: "Still in the degree.",
    plain: "I study computer science at Frostburg State University. The degree is expected in June 2027. I am still a student, so this site will not say I graduated. I was a Technical Data Entry Clerk at Westat in Rockville from June to October 2023. Before college I finished Rockville High School in 2019. I live in Arlington, Virginia, and I speak English and Spanish. The code is under GitHub user Jefe4.",
  },
  {
    id: "graph",
    kicker: "Project",
    title: "A maze that spends fuel on the expensive door.",
    slug: "graph",
    href: "/projects/graph",
    plain: "The maze is a set of rooms with one-way doors. Each door costs fuel, measured in liters. The robot does not look for the cheap way through. It opens the most expensive door it has not tried yet, and walking back does not cost fuel. A second routine finds the cheapest route, so both answers sit side by side.",
  },
  {
    id: "hashmap",
    kicker: "Project",
    title: "A movie list you can watch collide.",
    slug: "hashmap",
    href: "/projects/hashmap",
    plain: "Movies go into a table. The name of a movie is turned into a slot number. If that slot is already taken, the program checks the next slot, then the next. A deleted movie leaves a marker so a later search does not stop too early. When the table is half full, it grows.",
  },
  {
    id: "tcp",
    kicker: "Project",
    title: "A chat that waits for a full line.",
    slug: "tcp",
    href: "/projects/tcp",
    plain: "More than one person can type to each other over the network. The server does not act on a half-typed line. It waits for the end of the line, then shares that line with everyone else. Short commands change your name, list who is connected, or leave.",
  },
  {
    id: "flashcards",
    kicker: "Project",
    title: "Cards that come back sooner when you miss.",
    slug: "flashcards",
    href: "/projects/flashcards",
    plain: "A study deck about the code in this repository. Miss a card and it returns today. Know it, and it waits longer before it shows up again, up to two weeks. Progress is saved in a file on the machine that is running the deck.",
  },
  {
    id: "sql",
    kicker: "Project",
    title: "A game shelf that will not run a random query.",
    slug: "sql",
    href: "/projects/sql",
    plain: "A game collection stored as related tables: people, games, publishers, genres, and stores. A small web page can show one of those tables. The page only allows table names it already knows, so it will not run an arbitrary database command.",
  },
  {
    id: "library",
    kicker: "Project",
    title: "Books that stay in a text file.",
    slug: "library",
    href: "/projects/library",
    plain: "A short shelf of books. You can add a title, find it, change it, or delete it. The list is written to a text file, so it is still there the next time the program runs.",
  },
  {
    id: "linked-list",
    kicker: "Project",
    title: "A chain of numbers, walked from the start.",
    slug: "linked-list",
    href: "/projects/linked-list",
    plain: "Each number points at the next number. Finding one means starting at the front of the chain and stepping forward. There is no shortcut to the middle.",
  },
  {
    id: "knowledge-graph",
    kicker: "Project",
    title: "Every fact keeps its source.",
    slug: "knowledge-graph",
    href: "/projects/knowledge-graph",
    plain: "Facts are stored as dots connected by labeled lines. A line is refused if either end does not exist yet, and every line can say where the fact came from. The resume file can be loaded into that graph.",
  },
  {
    id: "gym-scan",
    kicker: "Project",
    title: "A scan of the gym floor, not a résumé.",
    slug: "gym-scan",
    href: "/gym",
    badge: "Work in progress",
    plain: "A 3D photo-scan of the Falls Church gym where I work as staff. You can orbit the room. The mesh is the room: racks, benches, the floor letters. It is not a résumé, and there is no CV text on it.",
  },
  {
    id: "esp32-firmware",
    kicker: "Project",
    title: "Dispenser firmware, not readable from here.",
    href: "/projects/esp32-firmware",
    badge: "Placeholder · private repo",
    placeholder:
      "Placeholder. The firmware is Jefe4/husky-watchdog-firmware, branch firmware/dispense-fsm. GitHub returned 404 for that repository with the credential available in this checkout, which is also what a private repository looks like without access. No excerpt is shown. None was copied from the internet.",
    plain: "This is dispenser firmware for an ESP32, kept in a separate repository. I could not read that code while building this page, so this chapter does not pretend to quote it. The serial-log tool further down is a different program: it reads a capture from a serial monitor. It is not the firmware.",
  },
  {
    id: "novum",
    kicker: "Project",
    title: "Novum is still being built.",
    href: "/projects/novum",
    badge: "Work in progress",
    placeholder: "No code excerpt. The Novum source is not in this repository, and this page does not invent one.",
    plain: "Novum is my local-first Mac AI harness, and it is work in progress. The idea is a coding agent in the style of Cursor, plus training a model on the machine instead of sending the work out. There is no public product page and no source in this checkout.",
  },
  {
    id: "esp32-serial-log",
    kicker: "Private repo",
    title: "Read an ESP32 log without scrolling the raw capture.",
    slug: "esp32-serial-log",
    href: "/projects/esp32-serial-log",
    badge: "private repo",
    plain: "Paste or point this tool at a serial-monitor capture. It lists restarts and the reason, lines where a state changes (IDLE to ARM, for example), and faults such as a panic. Useful next to the dispenser, and it is not a substitute for the firmware source.",
  },
  {
    id: "rack-label-check",
    kicker: "Private repo",
    title: "Catch a bad rack label before it is printed twice.",
    slug: "rack-label-check",
    href: "/projects/rack-label-check",
    badge: "private repo",
    plain: "Each line is one position on a data-center floor: site, hall, row, rack, U slot, and an asset tag. The checker flags a label that does not match that pattern, a U number above 42, or the same asset tag used twice. It is my own checklist format, not an employer schema.",
  },
  {
    id: "resume-json-check",
    kicker: "Private repo",
    title: "The resume file fails if it starts telling the wrong story.",
    slug: "resume-json-check",
    href: "/projects/resume-json-check",
    badge: "private repo",
    plain: "This checks the JSON the site reads. It fails if the file calls me a Google employee, says I already graduated from Frostburg, or gives me the gym as owner. It also checks Westat, Rockville High School in 2019, Arlington, English and Spanish, and GitHub Jefe4.",
  },
  {
    id: "gym-maint",
    kicker: "Private repo",
    title: "Which machine is due for service today.",
    slug: "gym-maint",
    href: "/projects/gym-maint",
    badge: "private repo",
    plain: "A command-line list of gym equipment. Each machine has a name and how many days should pass between service. Ask it which machines are due on a date. A machine that has never been serviced is due. This is a staff checklist. It does not say I own the gym.",
  },
  {
    id: "port-label-check",
    kicker: "Private repo",
    title: "Copper or fiber, and the port is only used once.",
    slug: "port-label-check",
    href: "/projects/port-label-check",
    badge: "private repo",
    plain: "Each line names a switch port, says whether the cable is copper or fiber, and names the other end. The checker rejects a port number that cannot exist on a 48-port switch, a port labeled twice, and a far end labeled twice.",
  },
];
