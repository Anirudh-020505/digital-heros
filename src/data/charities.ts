export type Charity = {
  id: string;
  name: string;
  cause: string;
  category: "Education" | "Environment" | "Health" | "Community" | "Sport";
  description: string;
  mission: string;
  raised: string;
  raisedNum: number;
  heroGradient: string;
  events: { title: string; date: string; location: string }[];
};

export const CHARITIES: Charity[] = [
  {
    id: "ocean-reach",
    name: "Ocean Reach",
    cause: "Marine conservation",
    category: "Environment",
    description: "Protecting coastlines and restoring marine biodiversity across the Atlantic.",
    mission:
      "Ocean Reach mobilises divers, scientists and coastal communities to restore reefs, remove plastic waste, and run education programmes that change the way we treat the sea.",
    raised: "£128,420",
    raisedNum: 128420,
    heroGradient: "from-secondary/40 via-primary/20 to-transparent",
    events: [
      { title: "Coastal Cleanup Open", date: "May 18", location: "Cornwall, UK" },
      { title: "Reef Restoration Pro-Am", date: "Jun 22", location: "Algarve, PT" },
    ],
  },
  {
    id: "mind-forward",
    name: "Mind Forward",
    cause: "Youth mental health",
    category: "Health",
    description: "Free counselling and resilience programmes for under-25s nationwide.",
    mission:
      "Mind Forward funds free, judgement-free counselling for young people and trains coaches to spot the early signs of mental health struggle in sport.",
    raised: "£94,180",
    raisedNum: 94180,
    heroGradient: "from-primary/40 via-secondary/20 to-transparent",
    events: [
      { title: "Resilience Charity Day", date: "Apr 30", location: "Wentworth, UK" },
      { title: "Mind Forward Gala Round", date: "Jul 12", location: "St Andrews, UK" },
    ],
  },
  {
    id: "brightpath",
    name: "BrightPath",
    cause: "Education access",
    category: "Education",
    description: "Scholarships and laptops for students in underserved communities.",
    mission:
      "BrightPath removes the financial barriers that keep talented students out of higher education, providing scholarships, devices, and mentoring.",
    raised: "£71,902",
    raisedNum: 71902,
    heroGradient: "from-secondary/40 via-primary/30 to-transparent",
    events: [
      { title: "Scholar Scramble", date: "Jun 03", location: "Sunningdale, UK" },
    ],
  },
  {
    id: "greenline",
    name: "Greenline",
    cause: "Reforestation",
    category: "Environment",
    description: "Planting native woodlands and rewilding degraded land at scale.",
    mission:
      "Greenline restores native woodland on degraded land, sequestering carbon while building biodiversity corridors across the UK and Ireland.",
    raised: "£58,610",
    raisedNum: 58610,
    heroGradient: "from-primary/50 via-secondary/20 to-transparent",
    events: [
      { title: "Rewild Open", date: "May 04", location: "Loch Lomond, UK" },
    ],
  },
  {
    id: "homefront",
    name: "Homefront",
    cause: "Veteran support",
    category: "Community",
    description: "Housing, training and community for veterans transitioning to civilian life.",
    mission:
      "Homefront provides transitional housing, retraining grants and a supportive community network for service leavers and their families.",
    raised: "£42,330",
    raisedNum: 42330,
    heroGradient: "from-secondary/40 via-primary/20 to-transparent",
    events: [
      { title: "Homefront Heroes Cup", date: "Aug 09", location: "Royal Birkdale, UK" },
    ],
  },
  {
    id: "first-tee",
    name: "First Tee",
    cause: "Junior golf access",
    category: "Sport",
    description: "Bringing golf — and its life skills — to kids who'd never get the chance.",
    mission:
      "First Tee funds clubs, coaching and course access for children from low-income families, using golf as a vehicle for character and confidence.",
    raised: "£36,118",
    raisedNum: 36118,
    heroGradient: "from-primary/40 via-secondary/30 to-transparent",
    events: [
      { title: "Junior Future Stars Day", date: "Jun 15", location: "Gleneagles, UK" },
    ],
  },
];

export const CATEGORIES = ["All", "Education", "Environment", "Health", "Community", "Sport"] as const;
