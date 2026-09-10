// Updated 14 Categories
const ALL_CATEGORIES_LIST = [
  "Every day life", "Tools", "Society & Occupation", "School & Education", 
  "Work & Office", "Sports and Hobbies", "Media & Entertainment", 
  "World & Geography", "Food & Culinary", "Around the House", 
  "Animal", "Object", "Personal Electronic", "Consumer Tech"
];

// Fallback pool in case Gemini API Key is missing
const fallbackPairs = {
  "Every day life": [
    { civilian: "ALARM", undercover: "TIMER" }, { civilian: "KEYS", undercover: "LOCK" },
    { civilian: "WALLET", undercover: "PURSE" }, { civilian: "MIRROR", undercover: "GLASS" },
    { civilian: "BACKPACK", undercover: "DUFFEL" }, { civilian: "SHOWER", undercover: "BATH" },
    { civilian: "SOAP", undercover: "SHAMPOO" }, { civilian: "BED", undercover: "MATTRESS" },
    { civilian: "PILLOW", undercover: "CUSHION" }, { civilian: "BLANKET", undercover: "QUILT" },
    { civilian: "CLOTHES", undercover: "OUTFIT" }, { civilian: "SHOES", undercover: "SNEAKERS" },
    { civilian: "SOCKS", undercover: "STOCKINGS" }, { civilian: "JACKET", undercover: "COAT" },
    { civilian: "UMBRELLA", undercover: "RAINCOAT" }, { civilian: "COMB", undercover: "BRUSH" },
    { civilian: "TOOTHBRUSH", undercover: "FLOSS" }, { civilian: "TOAST", undercover: "BAGEL" },
    { civilian: "COFFEE", undercover: "TEA" }, { civilian: "LUNCH", undercover: "DINNER" },
    { civilian: "SCHEDULE", undercover: "CALENDAR" }, { civilian: "ROUTINE", undercover: "HABIT" },
    { civilian: "COMMUTE", undercover: "TRAVEL" }, { civilian: "RECEIPT", undercover: "BILL" },
    { civilian: "CASH", undercover: "CARD" }, { civilian: "BAG", undercover: "SACK" },
    { civilian: "BOTTLE", undercover: "FLASK" }, { civilian: "MUG", undercover: "CUP" },
    { civilian: "PLATE", undercover: "BOWL" }, { civilian: "SPOON", undercover: "FORK" },
    { civilian: "NAPKIN", undercover: "TOWEL" }, { civilian: "TRASH", undercover: "WASTE" },
    { civilian: "DOOR", undercover: "GATE" }, { civilian: "WINDOW", undercover: "BLINDS" },
    { civilian: "LIGHT", undercover: "LAMP" }, { civilian: "SWITCH", undercover: "BUTTON" },
    { civilian: "FAN", undercover: "BLOWER" }, { civilian: "HEATER", undercover: "RADIATOR" },
    { civilian: "BROOM", undercover: "MOP" }, { civilian: "LAUNDRY", undercover: "WASH" },
    { civilian: "SINK", undercover: "BASIN" }, { civilian: "TAP", undercover: "FAUCET" },
    { civilian: "CURTAIN", undercover: "DRAPE" }, { civilian: "RUG", undercover: "MAT" },
    { civilian: "CLOCK", undercover: "WATCH" }, { civilian: "NOTEBOOK", undercover: "DIARY" },
    { civilian: "PEN", undercover: "PENCIL" }, { civilian: "PASSPORT", undercover: "ID" },
    { civilian: "RING", undercover: "BRACELET" }, { civilian: "HAT", undercover: "CAP" },
    { civilian: "SCARF", undercover: "SHAWL" }, { civilian: "GLOVES", undercover: "MITTENS" },
    { civilian: "BELT", undercover: "STRAP" }, { civilian: "GLASSES", undercover: "CONTACTS" },
    { civilian: "PERFUME", undercover: "COLOGNE" }, { civilian: "LOTION", undercover: "CREAM" },
    { civilian: "LIPBALM", undercover: "LIPSTICK" }, { civilian: "RAZOR", undercover: "TRIMMER" },
    { civilian: "TISSUE", undercover: "WIPE" }, { civilian: "SPONGE", undercover: "SCRUBBER" },
    { civilian: "BUCKET", undercover: "PAIL" }, { civilian: "CLIP", undercover: "PIN" },
    { civilian: "BANDAGE", undercover: "PLASTER" }, { civilian: "MEDICINE", undercover: "PILL" },
    { civilian: "VITAMIN", undercover: "SUPPLEMENT" }, { civilian: "THERMOMETER", undercover: "GAUGE" },
    { civilian: "WATER", undercover: "JUICE" }, { civilian: "SNACK", undercover: "TREAT" },
    { civilian: "BREAKFAST", undercover: "BRUNCH" }, { civilian: "DESK", undercover: "TABLE" },
    { civilian: "CHAIR", undercover: "BENCH" }, { civilian: "STAIRS", undercover: "ELEVATOR" },
    { civilian: "HALLWAY", undercover: "CORRIDOR" }, { civilian: "PORCH", undercover: "BALCONY" },
    { civilian: "GARAGE", undercover: "SHED" }, { civilian: "MAIL", undercover: "PARCEL" },
    { civilian: "STAMP", undercover: "ENVELOPE" }, { civilian: "CHARGER", undercover: "CABLE" },
    { civilian: "HEADPHONES", undercover: "EARBUDS" }, { civilian: "BATTERY", undercover: "POWERBANK" },
    { civilian: "REMOTE", undercover: "CONTROLLER" }, { civilian: "SPEAKER", undercover: "RADIO" },
    { civilian: "SCREEN", undercover: "MONITOR" }, { civilian: "PLUG", undercover: "SOCKET" },
    { civilian: "FLASHLIGHT", undercover: "TORCH" }, { civilian: "MATCHES", undercover: "LIGHTER" },
    { civilian: "CANDLE", undercover: "INCENSE" }, { civilian: "PLANT", undercover: "FLOWER" },
    { civilian: "VASE", undercover: "POT" }, { civilian: "PET", undercover: "ANIMAL" },
    { civilian: "LEASH", undercover: "COLLAR" }, { civilian: "FEED", undercover: "FOOD" },
    { civilian: "GROCERIES", undercover: "SUPPLIES" }, { civilian: "CART", undercover: "BASKET" },
    { civilian: "STORE", undercover: "MARKET" }, { civilian: "WALK", undercover: "STROLL" },
    { civilian: "RUN", undercover: "JOG" }, { civilian: "NAP", undercover: "REST" },
    { civilian: "DREAM", undercover: "NIGHTMARE" }, { civilian: "SMILE", undercover: "LAUGH" }
  ],
  "Tools": [
    { civilian: "HAMMER", undercover: "MALLET" }, { civilian: "SCREWDRIVER", undercover: "WRENCH" },
    { civilian: "PLIERS", undercover: "PINCERS" }, { civilian: "SAW", undercover: "HACKSAW" },
    { civilian: "DRILL", undercover: "AUGER" }, { civilian: "LEVEL", undercover: "PLUMB" },
    { civilian: "CHISEL", undercover: "GOUGE" }, { civilian: "FILE", undercover: "RASP" },
    { civilian: "CLAMP", undercover: "VICE" }, { civilian: "MEASURE", undercover: "RULER" },
    { civilian: "AXE", undercover: "HATCHET" }, { civilian: "SHOVEL", undercover: "SPADE" },
    { civilian: "RAKE", undercover: "HOE" }, { civilian: "PITCHFORK", undercover: "FORK" },
    { civilian: "SHEARS", undercover: "SCISSORS" }, { civilian: "SANDER", undercover: "GRINDER" },
    { civilian: "ANVIL", undercover: "BLOCK" }, { civilian: "LATHE", undercover: "MILL" },
    { civilian: "WELDER", undercover: "TORCH" }, { civilian: "JACK", undercover: "LEVER" },
    { civilian: "CROWBAR", undercover: "PRYBAR" }, { civilian: "BOLT", undercover: "SCREW" },
    { civilian: "NUT", undercover: "WASHER" }, { civilian: "NAIL", undercover: "PIN" },
    { civilian: "RIVET", undercover: "STAPLE" }, { civilian: "TAPE", undercover: "GLUE" },
    { civilian: "SOLDERING", undercover: "BRAZING" }, { civilian: "SPANNER", undercover: "SOCKET" },
    { civilian: "ALLEN", undercover: "TORX" }, { civilian: "CALIPER", undercover: "MICROMETER" },
    { civilian: "TROWEL", undercover: "FLOAT" }, { civilian: "SCRAPER", undercover: "PUTTY" },
    { civilian: "ROLLER", undercover: "BRUSH" }, { civilian: "PUMP", undercover: "COMPRESSOR" },
    { civilian: "HOSE", undercover: "PIPE" }, { civilian: "VALVE", undercover: "GAUGE" },
    { civilian: "FUNNEL", undercover: "SIPHON" }, { civilian: "LADDER", undercover: "SCAFFOLD" },
    { civilian: "PULLEY", undercover: "WINCH" }, { civilian: "HOIST", undercover: "CRANE" },
    { civilian: "CHAIN", undercover: "ROPE" }, { civilian: "WIRE", undercover: "CABLE" },
    { civilian: "STRAP", undercover: "SLING" }, { civilian: "PICKAXE", undercover: "MATTOCK" },
    { civilian: "SICKLE", undercover: "SCYTHE" }, { civilian: "PRUNER", undercover: "LOPPER" },
    { civilian: "LAWNMOWER", undercover: "TRIMMER" }, { civilian: "EDGER", undercover: "BLOWER" },
    { civilian: "SPRAYER", undercover: "NOZZLE" }, { civilian: "TOOLBOX", undercover: "CHEST" },
    { civilian: "POUCH", undercover: "BELT" }, { civilian: "BENCH", undercover: "TABLE" },
    { civilian: "WORKSHOP", undercover: "GARAGE" }, { civilian: "MAGNIFIER", undercover: "LOUPE" },
    { civilian: "MULTIMETER", undercover: "TESTER" }, { civilian: "PROBE", undercover: "SENSOR" },
    { civilian: "CUTTER", undercover: "KNIFE" }, { civilian: "SCALPEL", undercover: "BLADE" },
    { civilian: "NIPPERS", undercover: "SHEARS" }, { civilian: "PUNCH", undercover: "AWL" },
    { civilian: "STAMP", undercover: "DIE" }, { civilian: "MOLD", undercover: "CAST" },
    { civilian: "FORGE", undercover: "FURNACE" }, { civilian: "BELLOWS", undercover: "FAN" },
    { civilian: "TONGS", undercover: "FORCEPS" }, { civilian: "CRUCIBLE", undercover: "POT" },
    { civilian: "WEDGE", undercover: "SHIM" }, { civilian: "SHIM", undercover: "SPACER" },
    { civilian: "DOWEL", undercover: "PEG" }, { civilian: "HINGE", undercover: "LATCH" },
    { civilian: "PADLOCK", undercover: "LOCK" }, { civilian: "KEY", undercover: "PICK" },
    { civilian: "HOOK", undercover: "EYE" }, { civilian: "ANCHOR", undercover: "PLUG" },
    { civilian: "EXPANDER", undercover: "REAMER" }, { civilian: "TAP", undercover: "DIE" },
    { civilian: "PLANE", undercover: "SPOKESHAVE" }, { civilian: "DRAWKNIFE", undercover: "ADZE" },
    { civilian: "MORTISER", undercover: "TENONER" }, { civilian: "ROUTER", undercover: "SHAPER" },
    { civilian: "JOINTER", undercover: "PLANER" }, { civilian: "BANDER", undercover: "STRAPPER" },
    { civilian: "NAILER", undercover: "STAPLER" }, { civilian: "RIVETER", undercover: "GUN" },
    { civilian: "GREASE", undercover: "OIL" }, { civilian: "LUBRICANT", undercover: "SEALANT" },
    { civilian: "SOLVENT", undercover: "THINNER" }, { civilian: "SANDPAPER", undercover: "EMERY" },
    { civilian: "STEELWOOL", undercover: "PAD" }, { civilian: "BRUSH", undercover: "SWAB" },
    { civilian: "BUCKET", undercover: "TUB" }, { civilian: "CAN", undercover: "JUG" },
    { civilian: "BARREL", undercover: "DRUM" }, { civilian: "CART", undercover: "BARROW" },
    { civilian: "DOLLEY", undercover: "TRUCK" }, { civilian: "RAMP", undercover: "SKID" },
    { civilian: "JACKSTAND", undercover: "BLOCK" }, { civilian: "CREEPER", undercover: "MAT" },
    { civilian: "MASK", undercover: "RESPIRATOR" }, { civilian: "GOGGLES", undercover: "SHIELD" }
  ],
  "Society & Occupation": [
    { civilian: "DOCTOR", undercover: "SURGEON" }, { civilian: "NURSE", undercover: "MEDIC" },
    { civilian: "TEACHER", undercover: "PROFESSOR" }, { civilian: "POLICE", undercover: "DETECTIVE" },
    { civilian: "FIREFIGHER", undercover: "RESCUER" }, { civilian: "PILOT", undercover: "CAPTAIN" },
    { civilian: "CHEF", undercover: "COOK" }, { civilian: "LAWYER", undercover: "JUDGE" },
    { civilian: "FARMER", undercover: "RANCHER" }, { civilian: "DRIVER", undercover: "CHAUFFEUR" },
    { civilian: "ENGINEER", undercover: "ARCHITECT" }, { civilian: "SCIENTIST", undercover: "RESEARCHER" },
    { civilian: "ARTIST", undercover: "PAINTER" }, { civilian: "SINGER", undercover: "MUSICIAN" },
    { civilian: "ACTOR", undercover: "PERFORMER" }, { civilian: "WRITER", undercover: "AUTHOR" },
    { civilian: "JOURNALIST", undercover: "REPORTER" }, { civilian: "PHOTOGRAPHER", undercover: "CAMERAMAN" },
    { civilian: "SOLDIER", undercover: "GUARD" }, { civilian: "POLITICIAN", undercover: "DIPLOMAT" },
    { civilian: "BARBER", undercover: "HAIRDRESSER" }, { civilian: "BAKER", undercover: "PASTRYCHEF" },
    { civilian: "BUTCHER", undercover: "FISHMONGER" }, { civilian: "CARPENTER", undercover: "MASON" },
    { civilian: "PLUMBER", undercover: "ELECTRICIAN" }, { civilian: "MECHANIC", undercover: "TECHNICIAN" },
    { civilian: "PILOT", undercover: "NAVIGATOR" }, { civilian: "SAILOR", undercover: "MARINER" },
    { civilian: "ASTRONAUT", undercover: "COSMONAUT" }, { civilian: "MINER", undercover: "GEOLOGIST" },
    { civilian: "TAXI", undercover: "UBER" }, { civilian: "POSTMAN", undercover: "COURIER" },
    { civilian: "LIBRARIAN", undercover: "ARCHIVIST" }, { civilian: "BANKER", undercover: "ACCOUNTANT" },
    { civilian: "TRADER", undercover: "BROKER" }, { civilian: "CASHIER", undercover: "CLERK" },
    { civilian: "WAITER", undercover: "BARTENDER" }, { civilian: "CLEANER", undercover: "JANITOR" },
    { civilian: "TAILOR", undercover: "DESIGNER" }, { civilian: "MODEL", undercover: "INFLUENCER" },
    { civilian: "ATHLETE", undercover: "RUNNER" }, { civilian: "COACH", undercover: "TRAINER" },
    { civilian: "REFEREE", undercover: "UMPIRE" }, { civilian: "DENTIST", undercover: "ORTHODONTIST" },
    { civilian: "PHARMACIST", undercover: "CHEMIST" }, { civilian: "VET", undercover: "ZOOLOGIST" },
    { civilian: "PSYCHOLOGIST", undercover: "THERAPIST" }, { civilian: "PARAMEDIC", undercover: "FIRSTAIDER" },
    { civilian: "FLIGHTATTENDANT", undercover: "STEWARD" }, { civilian: "SECURITY", undercover: "BOUNCER" },
    { civilian: "SPY", undercover: "AGENT" }, { civilian: "MAYOR", undercover: "GOVERNOR" },
    { civilian: "KING", undercover: "PRINCE" }, { civilian: "QUEEN", undercover: "PRINCESS" },
    { civilian: "MONK", undercover: "PRIEST" }, { civilian: "PASTOR", undercover: "PREACHER" },
    { civilian: "VOLUNTEER", undercover: "ACTIVIST" }, { civilian: "CEO", undercover: "MANAGER" },
    { civilian: "EXECUTIVE", undercover: "DIRECTOR" }, { civilian: "SECRETARY", undercover: "ASSISTANT" },
    { civilian: "INTERN", undercover: "TRAINEE" }, { civilian: "CONSULTANT", undercover: "ADVISOR" },
    { civilian: "TRANSLATOR", undercover: "INTERPRETER" }, { civilian: "GUIDE", undercover: "DOCENT" },
    { civilian: "FLORIST", undercover: "BOTANIST" }, { civilian: "GARDENER", undercover: "LANDSCAPER" },
    { civilian: "WELDER", undercover: "MACHINIST" }, { civilian: "LOCKSMITH", undercover: "REPAIRMAN" },
    { civilian: "INSPECTOR", undercover: "AUDITOR" }, { civilian: "CUSTOMS", undercover: "BORDERGUARD" },
    { civilian: "DETECTIVE", undercover: "INVESTIGATOR" }, { civilian: "PARAMEDIC", undercover: "MEDIC" },
    { civilian: "SURGEON", undercover: "PHYSICIAN" }, { civilian: "OPTICIAN", undercover: "OPTOMETRIST" },
    { civilian: "CHIROPRACTOR", undercover: "PHYSIO" }, { civilian: "DERMATOLOGIST", undercover: "BEAUTICIAN" },
    { civilian: "ASTRONOMER", undercover: "PHYSICIST" }, { civilian: "BIOLOGIST", undercover: "ECOLOGIST" },
    { civilian: "HISTORIAN", undercover: "ARCHAEOLOGIST" }, { civilian: "PHILOSOPHER", undercover: "SCHOLAR" },
    { civilian: "ECONOMIST", undercover: "STATISTICIAN" }, { civilian: "PROGRAMMER", undercover: "DEVELOPER" },
    { civilian: "ANIMATOR", undercover: "ILLUSTRATOR" }, { civilian: "COMPOSER", undercover: "CONDUCTOR" },
    { civilian: "DANCER", undercover: "CHOREOGRAPHER" }, { civilian: "MAGICIAN", undercover: "ILLUSIONIST" },
    { civilian: "COMEDIAN", undercover: "ENTERTAINER" }, { civilian: "CURATOR", undercover: "COLLECTOR" },
    { civilian: "PRODUCER", undercover: "DIRECTOR" }, { civilian: "PUBLISHER", undercover: "EDITOR" },
    { civilian: "CREW", undercover: "STAFF" }, { civilian: "WORKER", undercover: "LABORER" },
    { civilian: "BOSS", undercover: "SUPERVISOR" }, { civilian: "FOUNDER", undercover: "CREATOR" },
    { civilian: "OWNER", undercover: "PARTNER" }, { civilian: "CITIZEN", undercover: "RESIDENT" },
    { civilian: "VOTER", undercover: "DELEGATE" }, { civilian: "LEADER", undercover: "CHIEF" }
  ],
  "School & Education": [
    { civilian: "PENCIL", undercover: "PEN" }, { civilian: "NOTEBOOK", undercover: "NOTEPAD" },
    { civilian: "TEXTBOOK", undercover: "WORKBOOK" }, { civilian: "ERASER", undercover: "CORRECTOR" },
    { civilian: "RULER", undercover: "PROTRACTOR" }, { civilian: "DESK", undercover: "BENCH" },
    { civilian: "BLACKBOARD", undercover: "WHITEBOARD" }, { civilian: "CHALK", undercover: "MARKER" },
    { civilian: "TEACHER", undercover: "TUTOR" }, { civilian: "STUDENT", undercover: "PUPIL" },
    { civilian: "CLASSROOM", undercover: "LECTUREHALL" }, { civilian: "SCHOOL", undercover: "ACADEMY" },
    { civilian: "COLLEGE", undercover: "UNIVERSITY" }, { civilian: "EXAM", undercover: "TEST" },
    { civilian: "QUIZ", undercover: "ASSESSMENT" }, { civilian: "GRADE", undercover: "SCORE" },
    { civilian: "DIPLOMA", undercover: "DEGREE" }, { civilian: "CERTIFICATE", undercover: "AWARD" },
    { civilian: "LIBRARY", undercover: "ARCHIVE" }, { civilian: "LIBRARIAN", undercover: "MONITOR" },
    { civilian: "BACKPACK", undercover: "BOOKBAG" }, { civilian: "HOMETASK", undercover: "ASSIGNMENT" },
    { civilian: "LESSON", undercover: "LECTURE" }, { civilian: "SUBJECT", undercover: "COURSE" },
    { civilian: "MATH", undercover: "ALGEBRA" }, { civilian: "SCIENCE", undercover: "BIOLOGY" },
    { civilian: "PHYSICS", undercover: "CHEMISTRY" }, { civilian: "HISTORY", undercover: "GEOGRAPHY" },
    { civilian: "ENGLISH", undercover: "LITERATURE" }, { civilian: "ART", undercover: "DRAFTING" },
    { civilian: "MUSIC", undercover: "BAND" }, { civilian: "GYM", undercover: "SPORTS" },
    { civilian: "RECESS", undercover: "BREAK" }, { civilian: "HALLWAY", undercover: "CORRIDOR" },
    { civilian: "LOCKER", undercover: "CABINET" }, { civilian: "PRINCIPAL", undercover: "DEAN" },
    { civilian: "COUNSELOR", undercover: "ADVISOR" }, { civilian: "SEMESTER", undercover: "TERM" },
    { civilian: "SCHEDULE", undercover: "TIMETABLE" }, { civilian: "BELL", undercover: "BUZZER" },
    { civilian: "CAFETERIA", undercover: "CANTEEN" }, { civilian: "BUS", undercover: "VAN" },
    { civilian: "PROJECTOR", undercover: "SCREEN" }, { civilian: "LAPTOP", undercover: "TABLET" },
    { civilian: "CALCULATOR", undercover: "COMPASS" }, { civilian: "GLOBE", undercover: "MAP" },
    { civilian: "MICROSCOPE", undercover: "TELESCOPE" }, { civilian: "BEAKER", undercover: "FLASK" },
    { civilian: "UNIFORM", undercover: "DRESSCODE" }, { civilian: "DORM", undercover: "HOSTEL" },
    { civilian: "CAMPUS", undercover: "GROUNDS" }, { civilian: "SCHOLARSHIP", undercover: "GRANT" },
    { civilian: "TUITION", undercover: "FEE" }, { civilian: "GRADUATION", undercover: "COMMENCEMENT" },
    { civilian: "CAP", undercover: "GOWN" }, { civilian: "ALUMNI", undercover: "GRADUATE" },
    { civilian: "SYLLABUS", undercover: "OUTLINE" }, { civilian: "ESSAY", undercover: "PAPER" },
    { civilian: "THESIS", undercover: "DISSERTATION" }, { civilian: "PRESENTATION", undercover: "SPEECH" },
    { civilian: "DEBATE", undercover: "DISCUSSION" }, { civilian: "CLUB", undercover: "SOCIETY" },
    { civilian: "TEAM", undercover: "SQUAD" }, { civilian: "PROCTOR", undercover: "INVIGILATOR" },
    { civilian: "REPORT", undercover: "TRANSCRIPT" }, { civilian: "HONORS", undercover: "MERIT" },
    { civilian: "FAIL", undercover: "PASS" }, { civilian: "DETENTION", undercover: "SUSPENSION" },
    { civilian: "ABSENT", undercover: "PRESENT" }, { civilian: "ATTENDANCE", undercover: "ROLL" },
    { civilian: "FOLDER", undercover: "BINDER" }, { civilian: "PAPER", undercover: "SHEET" },
    { civilian: "STAPLER", undercover: "CLIP" }, { civilian: "HIGHLIGHTER", undercover: "PEN" },
    { civilian: "CRAYON", undercover: "PASTEL" }, { civilian: "PAINT", undercover: "BRUSH" },
    { civilian: "COMPASS", undercover: "DIVIDER" }, { civilian: "FLASHCARD", undercover: "NOTE" },
    { civilian: "DICTIONARY", undercover: "THESAURUS" }, { civilian: "ENCYCLOPEDIA", undercover: "ALMANAC" },
    { civilian: "ATLAS", undercover: "MAP" }, { civilian: "CHAPTER", undercover: "SECTION" },
    { civilian: "PAGE", undercover: "LEAF" }, { civilian: "COVER", undercover: "BINDING" },
    { civilian: "DESK", undercover: "CARREL" }, { civilian: "PODIUM", undercover: "STAND" },
    { civilian: "STAGE", undercover: "AUDITORIUM" }, { civilian: "LAB", undercover: "WORKSHOP" },
    { civilian: "FIELDTRIP", undercover: "EXCURSION" }, { civilian: "YEARBOOK", undercover: "ALBUM" },
    { civilian: "PROM", undercover: "DANCE" }, { civilian: "MASCOT", undercover: "EMBLEM" },
    { civilian: "VALEDICTORIAN", undercover: "SCHOLAR" }, { civilian: "MAJOR", undercover: "MINOR" },
    { civilian: "CREDIT", undercover: "UNIT" }, { civilian: "LECTURER", undercover: "INSTRUCTOR" },
    { civilian: "PROFESSOR", undercover: "CHAIR" }, { civilian: "RESEARCH", undercover: "STUDY" },
    { civilian: "EXPERIMENT", undercover: "TRIAL" }, { civilian: "DATA", undercover: "RESULT" }
  ],
  "Work & Office": [
    { civilian: "LAPTOP", undercover: "DESKTOP" }, { civilian: "MONITOR", undercover: "SCREEN" },
    { civilian: "KEYBOARD", undercover: "MOUSE" }, { civilian: "DESK", undercover: "CUBICLE" },
    { civilian: "CHAIR", undercover: "STOOL" }, { civilian: "MEETING", undercover: "CONFERENCE" },
    { civilian: "PRESENTATION", undercover: "SLIDES" }, { civilian: "PROJECT", undercover: "TASK" },
    { civilian: "DEADLINE", undercover: "DUE_DATE" }, { civilian: "EMAIL", undercover: "MESSAGE" },
    { civilian: "REPORT", undercover: "SUMMARY" }, { civilian: "PRINTER", undercover: "SCANNER" },
    { civilian: "COPIER", undercover: "FAX" }, { civilian: "FILE", undercover: "FOLDER" },
    { civilian: "CABINET", undercover: "SHELF" }, { civilian: "BOSS", undercover: "MANAGER" },
    { civilian: "COLLEAGUE", undercover: "TEAMMATE" }, { civilian: "CLIENT", undercover: "CUSTOMER" },
    { civilian: "SALARY", undercover: "WAGE" }, { civilian: "BONUS", undercover: "INCENTIVE" },
    { civilian: "CONTRACT", undercover: "AGREEMENT" }, { civilian: "PROPOSAL", undercover: "PITCH" },
    { civilian: "BUDGET", undercover: "EXPENSE" }, { civilian: "INVOICE", undercover: "BILL" },
    { civilian: "SHREDDER", undercover: "BIN" }, { civilian: "STAPLER", undercover: "PUNCHER" },
    { civilian: "MEMO", undercover: "NOTE" }, { civilian: "WHITEBOARD", undercover: "FLIPCHART" },
    { civilian: "INTERVIEW", undercover: "MEETING" }, { civilian: "RESUME", undercover: "CV" },
    { civilian: "PROMOTION", undercover: "RAISE" }, { civilian: "VACATION", undercover: "LEAVE" },
    { civilian: "BREAK", undercover: "LUNCH" }, { civilian: "WATERCOOLER", undercover: "PANTRY" },
    { civilian: "COFFEE", undercover: "ESPRESSO" }, { civilian: "BADGE", undercover: "PASS" },
    { civilian: "ELEVATOR", undercover: "STAIRS" }, { civilian: "LOBBY", undercover: "RECEPTION" },
    { civilian: "DEPARTMENT", undercover: "DIVISION" }, { civilian: "TEAM", undercover: "UNIT" },
    { civilian: "ORGANIZATION", undercover: "COMPANY" }, { civilian: "FIRM", undercover: "AGENCY" },
    { civilian: "STARTUP", undercover: "ENTERPRISE" }, { civilian: "OFFICE", undercover: "WORKPLACE" },
    { civilian: "REMOTE", undercover: "HYBRID" }, { civilian: "ZOOM", undercover: "TEAMS" },
    { civilian: "CHAT", undercover: "SLACK" }, { civilian: "CALENDAR", undercover: "PLANNER" },
    { civilian: "AGENDA", undercover: "SCHEDULE" }, { civilian: "MINUTES", undercover: "NOTES" },
    { civilian: "STRATEGY", undercover: "PLAN" }, { civilian: "GOAL", undercover: "TARGET" },
    { civilian: "METRIC", undercover: "KPI" }, { civilian: "REVENUE", undercover: "PROFIT" },
    { civilian: "LOSS", undercover: "COST" }, { civilian: "TAX", undercover: "DUTY" },
    { civilian: "AUDIT", undercover: "REVIEW" }, { civilian: "COMPLIANCE", undercover: "POLICY" },
    { civilian: "TRAINING", undercover: "WORKSHOP" }, { civilian: "SEMINAR", undercover: "WEBINAR" },
    { civilian: "BENEFITS", undercover: "PERKS" }, { civilian: "PENSION", undercover: "401K" },
    { civilian: "INSURANCE", undercover: "COVERAGE" }, { civilian: "OVERTIME", undercover: "SHIFT" },
    { civilian: "TIMESHEET", undercover: "LOG" }, { civilian: "STAMP", undercover: "SEAL" },
    { civilian: "CLIPBOARD", undercover: "PAD" }, { civilian: "PEN", undercover: "MARKER" },
    { civilian: "ENVELOPE", undercover: "MAIL" }, { civilian: "PARCEL", undercover: "SHIPMENT" },
    { civilian: "SUPPLIES", undercover: "STATIONERY" }, { civilian: "LAMINATOR", undercover: "BINDER" },
    { civilian: "PROJECTOR", undercover: "DISPLAY" }, { civilian: "HEADSET", undercover: "MICROPHONE" },
    { civilian: "WEBCAM", undercover: "CAMERA" }, { civilian: "DOCK", undercover: "HUB" },
    { civilian: "SERVER", undercover: "DATABASE" }, { civilian: "NETWORK", undercover: "WIFI" },
    { civilian: "PASSWORD", undercover: "LOGIN" }, { civilian: "SECURITY", undercover: "FIREWALL" },
    { civilian: "SOFTWARE", undercover: "APP" }, { civilian: "SYSTEM", undercover: "PLATFORM" },
    { civilian: "CLOUD", undercover: "DRIVE" }, { civilian: "BACKUP", undercover: "ARCHIVE" },
    { civilian: "DESK", undercover: "TABLE" }, { civilian: "SOFA", undercover: "LOUNGE" },
    { civilian: "SUIT", undercover: "FORMAL" }, { civilian: "TIE", undercover: "BLAZER" },
    { civilian: "BRIEFCASE", undercover: "BAG" }, { civilian: "ORGANIZER", undercover: "FOLDER" },
    { civilian: "DESKMAT", undercover: "MOUSEPAD" }, { civilian: "NOTEPAD", undercover: "POSTIT" },
    { civilian: "THUMBTACK", undercover: "PIN" }, { civilian: "RUBBERBAND", undercover: "CLIP" },
    { civilian: "DISPENSER", undercover: "TAPE" }, { civilian: "GLUE", undercover: "PASTE" },
    { civilian: "SCISSORS", undercover: "CUTTER" }, { civilian: "BIN", undercover: "CAN" },
    { civilian: "SHREDDER", undercover: "CRUSHER" }, { civilian: "JANITOR", undercover: "CLEANER" }
  ],
  "Sports and Hobbies": [
    { civilian: "FOOTBALL", undercover: "RUGBY" }, { civilian: "SOCCER", undercover: "FUTSAL" },
    { civilian: "BASKETBALL", undercover: "VOLLEYBALL" }, { civilian: "TENNIS", undercover: "BADMINTON" },
    { civilian: "BASEBALL", undercover: "SOFTBALL" }, { civilian: "GOLF", undercover: "MINIGOLF" },
    { civilian: "CRICKET", undercover: "BASEBALL" }, { civilian: "HOCKEY", undercover: "LACROSSE" },
    { civilian: "SWIMMING", undercover: "DIVING" }, { civilian: "RUNNING", undercover: "JOGGING" },
    { civilian: "CYCLING", undercover: "BIKING" }, { civilian: "SKATING", undercover: "ROLLERBLADING" },
    { civilian: "SKIING", undercover: "SNOWBOARDING" }, { civilian: "SURFING", undercover: "BODYBOARDING" },
    { civilian: "BOXING", undercover: "KICKBOXING" }, { civilian: "KARATE", undercover: "JUDO" },
    { civilian: "WRESTLING", undercover: "MMA" }, { civilian: "GYMNASTICS", undercover: "ACROBATICS" },
    { civilian: "ARCHERY", undercover: "SHOOTING" }, { civilian: "FENCING", undercover: "SWORDPLAY" },
    { civilian: "BOWLING", undercover: "BILLIARDS" }, { civilian: "CHESS", undercover: "CHECKERS" },
    { civilian: "POKER", undercover: "BLACKJACK" }, { civilian: "PAINTING", undercover: "DRAWING" },
    { civilian: "PHOTOGRAPHY", undercover: "FILMMARKING" }, { civilian: "FISHING", undercover: "HUNTING" },
    { civilian: "CAMPING", undercover: "HIKING" }, { civilian: "CLIMBING", undercover: "BOULDERING" },
    { civilian: "GARDENING", undercover: "PLANTING" }, { civilian: "COOKING", undercover: "BAKING" },
    { civilian: "KNITTING", undercover: "CROCHET" }, { civilian: "SEWING", undercover: "EMBROIDERY" },
    { civilian: "READING", undercover: "WRITING" }, { civilian: "GAMING", undercover: "ESPORTS" },
    { civilian: "DANCING", undercover: "BALLET" }, { civilian: "SINGING", undercover: "KARAOKE" },
    { civilian: "POTTERY", undercover: "SCULPTING" }, { civilian: "ORIGAMI", undercover: "CRAFTING" },
    { civilian: "STAMP", undercover: "COIN" }, { civilian: "MODELING", undercover: "CRAFTING" },
    { civilian: "YOGA", undercover: "PILATES" }, { civilian: "CROSSFIT", undercover: "CALISTHENICS" },
    { civilian: "MARATHON", undercover: "TRIATHLON" }, { civilian: "SPRINT", undercover: "HURDLES" },
    { civilian: "JAVELIN", undercover: "DISCUS" }, { civilian: "POLEVAULT", undercover: "HIGHJUMP" },
    { civilian: "ROWING", undercover: "CANOEING" }, { civilian: "KAYAKING", undercover: "RAFTING" },
    { civilian: "SAILING", undercover: "YACHTING" }, { civilian: "WINDSURFING", undercover: "KITESURFING" },
    { civilian: "PARAGLIDING", undercover: "SKYDIVING" }, { civilian: "BUNGEE", undercover: "ZIPLINE" },
    { civilian: "SKATEBOARD", undercover: "LONGBOARD" }, { civilian: "SCOOTER", undercover: "BMX" },
    { civilian: "DARTS", undercover: "TARGET" }, { civilian: "PADDLE", undercover: "RACQUET" },
    { civilian: "SHUTTLECOCK", undercover: "BALL" }, { civilian: "NET", undercover: "GOAL" },
    { civilian: "STADIUM", undercover: "ARENA" }, { civilian: "COURT", undercover: "PITCH" },
    { civilian: "FIELD", undercover: "TRACK" }, { civilian: "RING", undercover: "MAT" },
    { civilian: "POOL", undercover: "LAKE" }, { civilian: "HELMET", undercover: "PADS" },
    { civilian: "GLOVES", undercover: "MITT" }, { civilian: "SNEAKERS", undercover: "CLEATS" },
    { civilian: "JERSEY", undercover: "UNIFORM" }, { civilian: "TROPHY", undercover: "MEDAL" },
    { civilian: "WHISTLE", undercover: "STOPWATCH" }, { civilian: "COACH", undercover: "REFEREE" },
    { civilian: "SQUAD", undercover: "TEAM" }, { civilian: "MATCH", undercover: "GAME" },
    { civilian: "TOURNAMENT", undercover: "LEAGUE" }, { civilian: "CHAMPION", undercover: "WINNER" },
    { civilian: "RUNNERUP", undercover: "FINALIST" }, { civilian: "SCORE", undercover: "POINTS" },
    { civilian: "FOUL", undercover: "PENALTY" }, { civilian: "OFFSIDE", undercover: "OUT" },
    { civilian: "SERVE", undercover: "RETURN" }, { civilian: "SMASH", undercover: "SPIKE" },
    { civilian: "DRIBBLE", undercover: "PASS" }, { civilian: "HEADER", undercover: "KICK" },
    { civilian: "HOME RUN", undercover: "STRIKE" }, { civilian: "TOUCHDOWN", undercover: "TRY" },
    { civilian: "PAR", undercover: "BIRDIE" }, { civilian: "CHECKMATE", undercover: "STALEMATE" },
    { civilian: "PUZZLE", undercover: "RIDDLE" }, { civilian: "SUDOKU", undercover: "CROSSWORD" },
    { civilian: "MAGIC", undercover: "TRICK" }, { civilian: "JUGGLING", undercover: "ACROBATICS" },
    { civilian: "ASTRONOMY", undercover: "STARGAZING" }, { civilian: "BIRDING", undercover: "WILDLIFE" },
    { civilian: "GEOCACHING", undercover: "TREASURE" }, { civilian: "BINGO", undercover: "LOTTERY" },
    { civilian: "DOMINOES", undercover: "MAHJONG" }, { civilian: "DARTS", undercover: "BULLSEYE" },
    { civilian: "POOL", undercover: "SNOOKER" }, { civilian: "FOOSBALL", undercover: "AIRHOCKEY" }
  ],
  "Media & Entertainment": [
    { civilian: "MOVIE", undercover: "FILM" }, { civilian: "CINEMA", undercover: "THEATER" },
    { civilian: "ACTOR", undercover: "ACTRESS" }, { civilian: "DIRECTOR", undercover: "PRODUCER" },
    { civilian: "SCRIPT", undercover: "SCREENPLAY" }, { civilian: "SCENE", undercover: "TAKE" },
    { civilian: "CAMERA", undercover: "LENS" }, { civilian: "STUDIO", undercover: "SET" },
    { civilian: "SERIES", undercover: "SHOW" }, { civilian: "EPISODE", undercover: "SEASON" },
    { civilian: "TRAILER", undercover: "TEASER" }, { civilian: "POSTER", undercover: "BANNER" },
    { civilian: "POPCOORN", undercover: "SNACK" }, { civilian: "TICKET", undercover: "PASS" },
    { civilian: "MUSIC", undercover: "SONG" }, { civilian: "ALBUM", undercover: "SINGLE" },
    { civilian: "BAND", undercover: "ORCHESTRA" }, { civilian: "CONCERT", undercover: "FESTIVAL" },
    { civilian: "STAGE", undercover: "PODIUM" }, { civilian: "SPEAKER", undercover: "AMPLIFIER" },
    { civilian: "RADIO", undercover: "PODCAST" }, { civilian: "STATION", undercover: "CHANNEL" },
    { civilian: "HOST", undercover: "PRESENTER" }, { civilian: "NEWS", undercover: "MEDIA" },
    { civilian: "MAGAZINE", undercover: "JOURNAL" }, { civilian: "NEWSPAPER", undercover: "GAZETTE" },
    { civilian: "BOOK", undercover: "NOVEL" }, { civilian: "COMIC", undercover: "MANGA" },
    { civilian: "AUTHOR", undercover: "WRITER" }, { civilian: "PUBLISHER", undercover: "PRESS" },
    { civilian: "STREAMING", undercover: "BROADCAST" }, { civilian: "NETFLIX", undercover: "HULU" },
    { civilian: "YOUTUBE", undercover: "TIKTOK" }, { civilian: "VIDEO", undercover: "CLIP" },
    { civilian: "GAME", undercover: "CONSOLE" }, { civilian: "PLAYSTATION", undercover: "XBOX" },
    { civilian: "NINTENDO", undercover: "SEGA" }, { civilian: "ARCADE", undercover: "CABINET" },
    { civilian: "DRAMA", undercover: "COMEDY" }, { civilian: "THRILLER", undercover: "HORROR" },
    { civilian: "ACTION", undercover: "ADVENTURE" }, { civilian: "SCI-FI", undercover: "FANTASY" },
    { civilian: "ANIMATION", undercover: "CARTOON" }, { civilian: "DOCUMENTARY", undercover: "BIOPIC" },
    { civilian: "MUSICAL", undercover: "OPERA" }, { civilian: "BALLET", undercover: "DANCE" },
    { civilian: "CIRCUS", undercover: "CARNIVAL" }, { civilian: "SHOW", undercover: "PERFORMANCE" },
    { civilian: "CELEBRITY", undercover: "STAR" }, { civilian: "FAN", undercover: "FOLLOWER" },
    { civilian: "FAME", undercover: "POPULARITY" }, { civilian: "AWARD", undercover: "TROPHY" },
    { civilian: "OSCAR", undercover: "GRAMMY" }, { civilian: "EMMY", undercover: "TONY" },
    { civilian: "RED CARPET", undercover: "GALA" }, { civilian: "INTERVIEW", undercover: "TALKSHOW" },
    { civilian: "REVIEWS", undercover: "RATINGS" }, { civilian: "CRITIC", undercover: "JUDGE" },
    { civilian: "SPOILER", undercover: "LEAK" }, { civilian: "CASTING", undercover: "AUDITION" },
    { civilian: "STUNT", undercover: "EFFECTS" }, { civilian: "CGI", undercover: "GRAPHICS" },
    { civilian: "SOUNDTRACK", undercover: "SCORE" }, { civilian: "LYRICS", undercover: "VERSE" },
    { civilian: "MELODY", undercover: "RHYTHM" }, { civilian: "GUITAR", undercover: "BASS" },
    { civilian: "DRUMS", undercover: "PERCUSSION" }, { civilian: "PIANO", undercover: "KEYBOARD" },
    { civilian: "VIOLIN", undercover: "CELLO" }, { civilian: "FLUTE", undercover: "CLARINET" },
    { civilian: "TRUMPET", undercover: "TROMBONE" }, { civilian: "MICROPHONE", undercover: "HEADSET" },
    { civilian: "VINYL", undercover: "CASSETTE" }, { civilian: "CD", undercover: "DVD" },
    { civilian: "MP3", undercover: "STREAM" }, { civilian: "PLAYLIST", undercover: "QUEUE" },
    { civilian: "STREAMER", undercover: "VLOGGER" }, { civilian: "INFLUENCER", undercover: "CREATOR" },
    { civilian: "MEME", undercover: "TREND" }, { civilian: "VIRAL", undercover: "TRENDING" },
    { civilian: "SUBTITLES", undercover: "DUBBING" }, { civilian: "SCREEN", undercover: "DISPLAY" },
    { civilian: "PROJECTOR", undercover: "IMAX" }, { civilian: "SEAT", undercover: "RECLINER" },
    { civilian: "PREMIERE", undercover: "LAUNCH" }, { civilian: "BLOCKBUSTER", undercover: "HIT" },
    { civilian: "FLOP", undercover: "BOMB" }, { civilian: "REMAKE", undercover: "REBOOT" },
    { civilian: "SEQUEL", undercover: "PREQUEL" }, { civilian: "FRANCHISE", undercover: "SERIES" },
    { civilian: "HERO", undercover: "PROTAGONIST" }, { civilian: "VILLAIN", undercover: "ANTAGONIST" },
    { civilian: "EXTRA", undercover: "CAMEO" }, { civilian: "CHOREOGRAPHY", undercover: "ROUTINE" },
    { civilian: "MAGIC", undercover: "ILLUSION" }, { civilian: "COMEDIAN", undercover: "JESTER" },
    { civilian: "SATIRE", undercover: "PARODY" }, { civilian: "NOVEL", undercover: "STORY" }
  ],
  "World & Geography": [
    { civilian: "OCEAN", undercover: "SEA" }, { civilian: "RIVER", undercover: "STREAM" },
    { civilian: "LAKE", undercover: "POND" }, { civilian: "MOUNTAIN", undercover: "HILL" },
    { civilian: "VALLEY", undercover: "CANYON" }, { civilian: "DESERT", undercover: "SAVANNA" },
    { civilian: "FOREST", undercover: "JUNGLE" }, { civilian: "ISLAND", undercover: "PENINSULA" },
    { civilian: "CONTINENT", undercover: "REGION" }, { civilian: "COUNTRY", undercover: "NATION" },
    { civilian: "CITY", undercover: "TOWN" }, { civilian: "VILLAGE", undercover: "HAMLET" },
    { civilian: "CAPITAL", undercover: "METROPOLIS" }, { civilian: "BORDER", undercover: "FRONTIER" },
    { civilian: "MAP", undercover: "ATLAS" }, { civilian: "GLOBE", undercover: "SPHERE" },
    { civilian: "EQUATOR", undercover: "TROPIC" }, { civilian: "POLE", undercover: "GLACIER" },
    { civilian: "ICEBERG", undercover: "FLOE" }, { civilian: "VOLCANO", undercover: "CRATER" },
    { civilian: "EARTHQUAKE", undercover: "TREMOR" }, { civilian: "TSUNAMI", undercover: "WAVE" },
    { civilian: "HURRICANE", undercover: "TYPHOON" }, { civilian: "TORNADO", undercover: "CYCLONE" },
    { civilian: "CLIMATE", undercover: "WEATHER" }, { civilian: "RAIN", undercover: "Drizzle" },
    { civilian: "SNOW", undercover: "HAIL" }, { civilian: "WIND", undercover: "BREEZE" },
    { civilian: "CLOUDS", undercover: "FOG" }, { civilian: "SUN", undercover: "STAR" },
    { civilian: "MOON", undercover: "SATELLITE" }, { civilian: "ATMOSPHERE", undercover: "AIR" },
    { civilian: "BAY", undercover: "GULF" }, { civilian: "STRAIT", undercover: "CHANNEL" },
    { civilian: "COAST", undercover: "SHORE" }, { civilian: "BEACH", undercover: "COVE" },
    { civilian: "CLIFF", undercover: "BLUFF" }, { civilian: "CAVE", undercover: "CAVERN" },
    { civilian: "SWAMP", undercover: "MARSH" }, { civilian: "PLAIN", undercover: "PRAIRIE" },
    { civilian: "PLATEAU", undercover: "MESA" }, { civilian: "OASIS", undercover: "SPRING" },
    { civilian: "WATERFALL", undercover: "RAPIDS" }, { civilian: "DELTA", undercover: "ESTUARY" },
    { civilian: "NORTH", undercover: "SOUTH" }, { civilian: "EAST", undercover: "WEST" },
    { civilian: "COMPASS", undercover: "GPS" }, { civilian: "LATITUDE", undercover: "LONGITUDE" },
    { civilian: "ALTITUDE", undercover: "ELEVATION" }, { civilian: "FLAG", undercover: "EMBLEM" },
    { civilian: "PASSPORT", undercover: "VISA" }, { civilian: "TOURIST", undercover: "TRAVELER" },
    { civilian: "TRAVEL", undercover: "JOURNEY" }, { civilian: "FLIGHT", undercover: "CRUISE" },
    { civilian: "AIRPORT", undercover: "STATION" }, { civilian: "HARBOR", undercover: "PORT" },
    { civilian: "BRIDGE", undercover: "TUNNEL" }, { civilian: "HIGHWAY", undercover: "ROAD" },
    { civilian: "STREET", undercover: "AVENUE" }, { civilian: "SQUARE", undercover: "PLAZA" },
    { civilian: "LANDMARK", undercover: "MONUMENT" }, { civilian: "PARK", undercover: "RESERVE" },
    { civilian: "ZOO", undercover: "SAFARI" }, { civilian: "MUSEUM", undercover: "GALLERY" },
    { civilian: "CASTLE", undercover: "PALACE" }, { civilian: "TOWER", undercover: "SKYSCRAPER" },
    { civilian: "PYRAMID", undercover: "RUINS" }, { civilian: "STATUE", undercover: "MEMORIAL" },
    { civilian: "EUROPE", undercover: "ASIA" }, { civilian: "AFRICA", undercover: "AMERICA" },
    { civilian: "AUSTRALIA", undercover: "ANTARCTICA" }, { civilian: "PACIFIC", undercover: "ATLANTIC" },
    { civilian: "INDIAN", undercover: "ARCTIC" }, { civilian: "ALPS", undercover: "HIMALAYAS" },
    { civilian: "AMAZON", undercover: "NILE" }, { civilian: "SAHARA", undercover: "GOBI" },
    { civilian: "EVEREST", undercover: "K2" }, { civilian: "TIMEZONE", undercover: "GMT" },
    { civilian: "CULTURE", undercover: "HERITAGE" }, { civilian: "LANGUAGE", undercover: "DIALECT" },
    { civilian: "POPULATION", undercover: "CROWD" }, { civilian: "SOCIETY", undercover: "COMMUNITY" },
    { civilian: "TERRITORY", undercover: "ZONE" }, { civilian: "PROVINCE", undercover: "STATE" },
    { civilian: "COUNTY", undercover: "DISTRICT" }, { civilian: "NEIGHBORHOOD", undercover: "SUBURB" },
    { civilian: "SLUM", undercover: "GHETTO" }, { civilian: "PORT", undercover: "DOCK" },
    { civilian: "LIGHTHOUSE", undercover: "BEACON" }, { civilian: "DAM", undercover: "RESERVOIR" },
    { civilian: "CANAL", undercover: "WATERWAY" }, { civilian: "GEOLOGY", undercover: "GEOGRAPHY" },
    { civilian: "SOIL", undercover: "SAND" }, { civilian: "ROCK", undercover: "STONE" },
    { civilian: "MINERAL", undercover: "ORE" }, { civilian: "GOLD", undercover: "SILVER" }
  ],
  "Food & Culinary": [
    { civilian: "PIZZA", undercover: "FLATBREAD" }, { civilian: "BURGER", undercover: "SANDWICH" },
    { civilian: "PASTA", undercover: "NOODLES" }, { civilian: "RICE", undercover: "RISOTTO" },
    { civilian: "BREAD", undercover: "BUN" }, { civilian: "CHEESE", undercover: "BUTTER" },
    { civilian: "MILK", undercover: "CREAM" }, { civilian: "EGG", undercover: "OMELETTE" },
    { civilian: "SOUP", undercover: "STEW" }, { civilian: "SALAD", undercover: "SLAW" },
    { civilian: "STEAK", undercover: "CHOP" }, { civilian: "CHICKEN", undercover: "TURKEY" },
    { civilian: "FISH", undercover: "SEAFOOD" }, { civilian: "SHRIMP", undercover: "PRAWN" },
    { civilian: "SUSHI", undercover: "SASHIMI" }, { civilian: "TACO", undercover: "BURRITO" },
    { civilian: "FRIES", undercover: "WEDGES" }, { civilian: "CHIPS", undercover: "CRISPS" },
    { civilian: "SAUSAGE", undercover: "HOTDOG" }, { civilian: "BACON", undercover: "HAM" },
    { civilian: "APPLE", undercover: "PEAR" }, { civilian: "BANANA", undercover: "PLTAIN" },
    { civilian: "ORANGE", undercover: "TANGERINE" }, { civilian: "LEMON", undercover: "LIME" },
    { civilian: "STRAWBERRY", undercover: "RASPBERRY" }, { civilian: "GRAPES", undercover: "RAISINS" },
    { civilian: "WATERMELON", undercover: "MELON" }, { civilian: "PEACH", undercover: "PLUM" },
    { civilian: "MANGO", undercover: "PAPAYA" }, { civilian: "PINEAPPLE", undercover: "GUAVA" },
    { civilian: "TOMATO", undercover: "PEPPER" }, { civilian: "POTATO", undercover: "YAM" },
    { civilian: "ONION", undercover: "GARLIC" }, { civilian: "CARROT", undercover: "RADISH" },
    { civilian: "BROCCOLI", undercover: "CAULIFLOWER" }, { civilian: "SPINACH", undercover: "LETTUCE" },
    { civilian: "CORN", undercover: "GRAIN" }, { civilian: "BEANS", undercover: "PEAS" },
    { civilian: "MUSHROOM", undercover: "TRUFFLE" }, { civilian: "OLIVE", undercover: "CAPER" },
    { civilian: "CAKE", undercover: "PASTRY" }, { civilian: "PIE", undercover: "TART" },
    { civilian: "COOKIE", undercover: "BISCUIT" }, { civilian: "DONUT", undercover: "BAGEL" },
    { civilian: "ICE CREAM", undercover: "GELATO" }, { civilian: "CHOCOLATE", undercover: "COCOA" },
    { civilian: "CANDY", undercover: "SWEETS" }, { civilian: "HONEY", undercover: "SYRUP" },
    { civilian: "SUGAR", undercover: "STEVIA" }, { civilian: "SALT", undercover: "PEPPER" },
    { civilian: "SAUCE", undercover: "GRAVY" }, { civilian: "KETCHUP", undercover: "MUSTARD" },
    { civilian: "MAYONNAISE", undercover: "DRESSING" }, { civilian: "OIL", undercover: "VINEGAR" },
    { civilian: "SPICE", undercover: "HERB" }, { civilian: "CINNAMON", undercover: "NUTMEG" },
    { civilian: "VANILLA", undercover: "ALMOND" }, { civilian: "COFFEE", undercover: "TEA" },
    { civilian: "JUICE", undercover: "SMOOTHIE" }, { civilian: "WATER", undercover: "SODA" },
    { civilian: "BEER", undercover: "ALE" }, { civilian: "WINE", undercover: "CHAMPAGNE" },
    { civilian: "COCKTAIL", undercover: "MOCKTAIL" }, { civilian: "WHISKEY", undercover: "BOURBON" },
    { civilian: "VODKA", undercover: "GIN" }, { civilian: "RUM", undercover: "TEQUILA" },
    { civilian: "CHEF", undercover: "COOK" }, { civilian: "KITCHEN", undercover: "BAKERY" },
    { civilian: "OVEN", undercover: "STOVE" }, { civilian: "GRILL", undercover: "BARBECUE" },
    { civilian: "PAN", undercover: "SKILLET" }, { civilian: "POT", undercover: "BOILER" },
    { civilian: "KNIFE", undercover: "CLEAVER" }, { civilian: "SPOON", undercover: "LADLE" },
    { civilian: "FORK", undercover: "TONGS" }, { civilian: "PLATE", undercover: "DISH" },
    { civilian: "BOWL", undercover: "BASIN" }, { civilian: "CUP", undercover: "MUG" },
    { civilian: "GLASS", undercover: "GOBLET" }, { civilian: "MENU", undercover: "RECIPE" },
    { civilian: "RESTAURANT", undercover: "DINER" }, { civilian: "CAFETERIA", undercover: "BUFFET" },
    { civilian: "WAITER", undercover: "HOST" }, { civilian: "TIP", undercover: "BILL" },
    { civilian: "SNACK", undercover: "APPETIZER" }, { civilian: "ENTREE", undercover: "MAIN" },
    { civilian: "DESSERT", undercover: "SWEET" }, { civilian: "FLAVOR", undercover: "TASTE" },
    { civilian: "SPICY", undercover: "HOT" }, { civilian: "SWEET", undercover: "SAVORY" },
    { civilian: "SOUR", undercover: "BITTER" }, { civilian: "CRISPY", undercover: "CRUNCHY" },
    { civilian: "FRESH", undercover: "ORGANIC" }, { civilian: "FROZEN", undercover: "CANNED" },
    { civilian: "RAW", undercover: "COOKED" }, { civilian: "ROAST", undercover: "BAKE" },
    { civilian: "FRY", undercover: "BOIL" }, { civilian: "STEAM", undercover: "POACH" }
  ],
  "Around the House": [
    { civilian: "SOFA", undercover: "COUCH" }, { civilian: "CHAIR", undercover: "ARMCHAIR" },
    { civilian: "TABLE", undercover: "DESK" }, { civilian: "BED", undercover: "MATTRESS" },
    { civilian: "WARDROBE", undercover: "CLOSET" }, { civilian: "DRAWER", undercover: "CABINET" },
    { civilian: "SHELF", undercover: "BOOKCASE" }, { civilian: "MIRROR", undercover: "GLASS" },
    { civilian: "CARPET", undercover: "RUG" }, { civilian: "CURTAIN", undercover: "BLINDS" },
    { civilian: "LAMP", undercover: "LIGHT" }, { civilian: "CLOCK", undercover: "TIMER" },
    { civilian: "TELEVISION", undercover: "MONITOR" }, { civilian: "REMOTE", undercover: "CONTROLLER" },
    { civilian: "SPEAKER", undercover: "RADIO" }, { civilian: "FAN", undercover: "BLOWER" },
    { civilian: "HEATER", undercover: "RADIATOR" }, { civilian: "AIRCON", undercover: "COOLER" },
    { civilian: "FRIDGE", undercover: "FREEZER" }, { civilian: "STOVE", undercover: "COOKTOP" },
    { civilian: "OVEN", undercover: "MICROWAVE" }, { civilian: "TOASTER", undercover: "GRILL" },
    { civilian: "BLENDER", undercover: "MIXER" }, { civilian: "KETTLE", undercover: "POT" },
    { civilian: "DISHWASHER", undercover: "SINK" }, { civilian: "TAP", undercover: "FAUCET" },
    { civilian: "TRASHCAN", undercover: "BIN" }, { civilian: "BROOM", undercover: "MOP" },
    { civilian: "VACUUM", undercover: "SWEEPER" }, { civilian: "BUCKET", undercover: "PAIL" },
    { civilian: "SPONGE", undercover: "BRUSH" }, { civilian: "DETERGENT", undercover: "SOAP" },
    { civilian: "WASHER", undercover: "DRYER" }, { civilian: "IRON", undercover: "STEAMER" },
    { civilian: "IRONINGBOARD", undercover: "TABLE" }, { civilian: "HANGER", undercover: "HOOK" },
    { civilian: "TOWEL", undercover: "BATHROBE" }, { civilian: "SHOWER", undercover: "TUB" },
    { civilian: "TOILET", undercover: "BIDET" }, { civilian: "PILLOW", undercover: "CUSHION" },
    { civilian: "BLANKET", undercover: "DUVET" }, { civilian: "SHEET", undercover: "COVER" },
    { civilian: "MATTRESS", undercover: "PAD" }, { civilian: "DOOR", undercover: "GATE" },
    { civilian: "LOCK", undercover: "LATCH" }, { civilian: "KEY", undercover: "CHAIN" },
    { civilian: "WINDOW", undercover: "PANE" }, { civilian: "HANDLE", undercover: "KNOB" },
    { civilian: "WALL", undercover: "PARTITION" }, { civilian: "CEILING", undercover: "ROOF" },
    { civilian: "FLOOR", undercover: "TILE" }, { civilian: "STAIRS", undercover: "STEPS" },
    { civilian: "BALCONY", undercover: "TERRACE" }, { civilian: "PORCH", undercover: "PATIO" },
    { civilian: "GARAGE", undercover: "SHED" }, { civilian: "GARDEN", undercover: "YARD" },
    { civilian: "FENCE", undercover: "WALL" }, { civilian: "MAILBOX", undercover: "SLOT" },
    { civilian: "DOORBELL", undercover: "CHIME" }, { civilian: "MAT", undercover: "DOORMAT" },
    { civilian: "VASE", undercover: "POT" }, { civilian: "PLANT", undercover: "FLOWER" },
    { civilian: "PICTURE", undercover: "FRAME" }, { civilian: "PAINTING", undercover: "POSTER" },
    { civilian: "CANDLE", undercover: "HOLDER" }, { civilian: "FIREPLACE", undercover: "HEARTH" },
    { civilian: "CHIMNEY", undercover: "VENT" }, { civilian: "ATTIC", undercover: "LOFT" },
    { civilian: "BASEMENT", undercover: "CELLAR" }, { civilian: "HALLWAY", undercover: "FOYER" },
    { civilian: "KITCHEN", undercover: "PANTRY" }, { civilian: "BATHROOM", undercover: "RESTROOM" },
    { civilian: "BEDROOM", undercover: "NURSERY" }, { civilian: "LIVINGROOM", undercover: "LOUNGE" },
    { civilian: "DININGROOM", undercover: "ALCOVE" }, { civilian: "PLUG", undercover: "SOCKET" },
    { civilian: "SWITCH", undercover: "BUTTON" }, { civilian: "CABLE", undercover: "WIRE" },
    { civilian: "CHARGER", undercover: "ADAPTER" }, { civilian: "BATTERY", undercover: "CELL" },
    { civilian: "FLASHLIGHT", undercover: "LANTERN" }, { civilian: "TOOLBOX", undercover: "CHEST" },
    { civilian: "HAMMER", undercover: "NAIL" }, { civilian: "SCREWDRIVER", undercover: "SCREW" },
    { civilian: "GLUE", undercover: "TAPE" }, { civilian: "SCISSORS", undercover: "KNIFE" },
    { civilian: "SAFETYPIN", undercover: "NEEDLE" }, { civilian: "THREAD", undercover: "YARN" },
    { civilian: "SCALE", undercover: "GAUGE" }, { civilian: "THERMOMETER", undercover: "SENSOR" },
    { civilian: "ALARM", undercover: "DETECTOR" }, { civilian: "EXTINGUISHER", undercover: "HOSE" },
    { civilian: "PEEPHOLE", undercover: "CAMERA" }, { civilian: "INTERCOM", undercover: "BELL" },
    { civilian: "SHADE", undercover: "SCREEN" }, { civilian: "STOOL", undercover: "POUF" },
    { civilian: "SIDEBOARD", undercover: "BUFFET" }, { civilian: "COATRACK", undercover: "STAND" }
  ],
  "Animal": [
    { civilian: "LION", undercover: "TIGER" }, { civilian: "LEOPARD", undercover: "CHEETAH" },
    { civilian: "CAT", undercover: "KITTEN" }, { civilian: "DOG", undercover: "PUPPY" },
    { civilian: "WOLF", undercover: "COYOTE" }, { civilian: "FOX", undercover: "JACKAL" },
    { civilian: "BEAR", undercover: "PANDA" }, { civilian: "ELEPHANT", undercover: "RHINO" },
    { civilian: "HIPPO", undercover: "RHINO" }, { civilian: "GIRAFFE", undercover: "ZEBRA" },
    { civilian: "HORSE", undercover: "PONY" }, { civilian: "DONKEY", undercover: "MULE" },
    { civilian: "COW", undercover: "BULL" }, { civilian: "SHEEP", undercover: "GOAT" },
    { civilian: "PIG", undercover: "BOAR" }, { civilian: "DEER", undercover: "ELK" },
    { civilian: "MOOSE", undercover: "REINDEER" }, { civilian: "CAMEL", undercover: "LLAMA" },
    { civilian: "MONKEY", undercover: "APE" }, { civilian: "GORILLA", undercover: "CHIMPANZEE" },
    { civilian: "KANGAROO", undercover: "WALLABY" }, { civilian: "KOALA", undercover: "SLOTH" },
    { civilian: "RABBIT", undercover: "HARE" }, { civilian: "MOUSE", undercover: "RAT" },
    { civilian: "SQUIRREL", undercover: "CHIPMUNK" }, { civilian: "BEAVER", undercover: "OTTER" },
    { civilian: "SEAL", undercover: "WALRUS" }, { civilian: "WHALE", undercover: "DOLPHIN" },
    { civilian: "SHARK", undercover: "RAY" }, { civilian: "FISH", undercover: "SEAHORSE" },
    { civilian: "OCTOPUS", undercover: "SQUID" }, { civilian: "CRAB", undercover: "LOBSTER" },
    { civilian: "TURTLE", undercover: "TORTOISE" }, { civilian: "FROG", undercover: "TOAD" },
    { civilian: "SNAKE", undercover: "VIPER" }, { civilian: "LIZARD", undercover: "IGUANA" },
    { civilian: "CROCODILE", undercover: "ALLIGATOR" }, { civilian: "EAGLE", undercover: "HAWK" },
    { civilian: "HAWK", undercover: "FALCON" }, { civilian: "OWL", undercover: "BAT" },
    { civilian: "PARROT", undercover: "MACAW" }, { civilian: "PIGEON", undercover: "DOVE" },
    { civilian: "DUCK", undercover: "GOOSE" }, { civilian: "SWAN", undercover: "FLAMINGO" },
    { civilian: "PENGUIN", undercover: "PUFFIN" }, { civilian: "CHICKEN", undercover: "ROOSTER" },
    { civilian: "TURKEY", undercover: "PEACOCK" }, { civilian: "CROW", undercover: "RAVEN" },
    { civilian: "BEE", undercover: "WASPER" }, { civilian: "ANT", undercover: "TERMITE" },
    { civilian: "BUTTERFLY", undercover: "MOTH" }, { civilian: "SPIDER", undercover: "SCORPION" },
    { civilian: "MOSQUITO", undercover: "FLY" }, { civilian: "BEETLE", undercover: "LADYBUG" },
    { civilian: "SNAIL", undercover: "SLUG" }, { civilian: "WORM", undercover: "LEECH" },
    { civilian: "JELLYFISH", undercover: "CORAL" }, { civilian: "STARFISH", undercover: "URCHIN" },
    { civilian: "HYENA", undercover: "WILDDOG" }, { civilian: "MEERKAT", undercover: "MONGOOSE" },
    { civilian: "LEMUR", undercover: "POSSUM" }, { civilian: "RACCOON", undercover: "BADGER" },
    { civilian: "SKUNK", undercover: "WEASEL" }, { civilian: "PORCUPINE", undercover: "HEDGEHOG" },
    { civilian: "ARMADILLO", undercover: "PANGOUN" }, { civilian: "PLATYPUS", undercover: "ECHIDNA" },
    { civilian: "BUFFALO", undercover: "BISON" }, { civilian: "ANTELOPE", undercover: "GAZELLE" },
    { civilian: "JAGUAR", undercover: "PANTHER" }, { civilian: "PUMA", undercover: "COUGAR" },
    { civilian: "LYNX", undercover: "BOBCAT" }, { civilian: "STALLION", undercover: "MARE" },
    { civilian: "CALF", undercover: "FOAL" }, { civilian: "LAMB", undercover: "KID" },
    { civilian: "HAMSTER", undercover: "GUINEAPIG" }, { civilian: "FERRET", undercover: "MINK" },
    { civilian: "PELICAN", undercover: "STORK" }, { civilian: "HERON", undercover: "CRANE" },
    { civilian: "OSTRICH", undercover: "EMU" }, { civilian: "VULTURE", undercover: "CONDOR" },
    { civilian: "HUMMINGBIRD", undercover: "SPARROW" }, { civilian: "WOODPECKER", undercover: "KINGFISHER" },
    { civilian: "CANARY", undercover: "FINCH" }, { civilian: "SEAGULL", undercover: "ALBATROSS" },
    { civilian: "CHAMELEON", undercover: "GECKO" }, { civilian: "PYTHON", undercover: "COBRA" },
    { civilian: "SALAMANDER", undercover: "NEWT" }, { civilian: "MANATEE", undercover: "DUGONG" },
    { civilian: "ORCA", undercover: "NARWHAL" }, { civilian: "PIRANHA", undercover: "BARRACUDA" },
    { civilian: "CLOWNFISH", undercover: "TANG" }, { civilian: "DRAGONFLY", undercover: "DAMSELFLY" },
    { civilian: "GRASSHOPPER", undercover: "CRICKET" }, { civilian: "MANTIS", undercover: "STICKINSECT" },
    { civilian: "CENTIPEDE", undercover: "MILLIPEDE" }, { civilian: "FLEA", undercover: "TICK" },
    { civilian: "FIREFLY", undercover: "GLOWWORM" }, { civilian: "LOBSTER", undercover: "CRAWFISH" },
    { civilian: "CLAM", undercover: "OYSTER" }, { civilian: "MUSSEL", undercover: "SCALLOP" }
  ],
  "Object": [
    { civilian: "CHAIR", undercover: "STOOL" }, { civilian: "TABLE", undercover: "DESK" },
    { civilian: "BOTTLE", undercover: "FLASK" }, { civilian: "BOX", undercover: "CRATE" },
    { civilian: "BAG", undercover: "SACK" }, { civilian: "PEN", undercover: "PENCIL" },
    { civilian: "BOOK", undercover: "NOTEBOOK" }, { civilian: "CLOCK", undercover: "WATCH" },
    { civilian: "LAMP", undercover: "TORCH" }, { civilian: "MIRROR", undercover: "GLASS" },
    { civilian: "COIN", undercover: "TOKEN" }, { civilian: "KEY", undercover: "CARD" },
    { civilian: "RING", undercover: "BAND" }, { civilian: "CUPS", undercover: "MUG" },
    { civilian: "PLATE", undercover: "DISH" }, { civilian: "SPOON", undercover: "FORK" },
    { civilian: "KNIFE", undercover: "BLADE" }, { civilian: "SCISSORS", undercover: "SHEARS" },
    { civilian: "UMBRELLA", undercover: "PARASOL" }, { civilian: "COMB", undercover: "BRUSH" },
    { civilian: "HAMMER", undercover: "MALLET" }, { civilian: "ROPE", undercover: "CABLE" },
    { civilian: "CHAIN", undercover: "WIRE" }, { civilian: "LOCK", undercover: "PADLOCK" },
    { civilian: "BELL", undercover: "CHIME" }, { civilian: "WHISTLE", undercover: "HORN" },
    { civilian: "FLAG", undercover: "BANNER" }, { civilian: "BASKET", undercover: "BIN" },
    { civilian: "BUCKET", undercover: "PAIL" }, { civilian: "POT", undercover: "PAN" },
    { civilian: "VASE", undercover: "JAR" }, { civilian: "CANDLE", undercover: "TORCH" },
    { civilian: "MATCH", undercover: "LIGHTER" }, { civilian: "STAMP", undercover: "SEAL" },
    { civilian: "ENVELOPE", undercover: "FOLDER" }, { civilian: "CLIP", undercover: "PIN" },
    { civilian: "BUTTON", undercover: "BEAD" }, { civilian: "NEEDLE", undercover: "PIN" },
    { civilian: "THREAD", undercover: "STRING" }, { civilian: "SPONGE", undercover: "PAD" },
    { civilian: "TOWEL", undercover: "RAG" }, { civilian: "SOAP", undercover: "BAR" },
    { civilian: "BRICK", undercover: "BLOCK" }, { civilian: "STONE", undercover: "ROCK" },
    { civilian: "PIPE", undercover: "TUBE" }, { civilian: "ROD", undercover: "POLE" },
    { civilian: "STICK", undercover: "STAFF" }, { civilian: "BOARD", undercover: "PLANK" },
    { civilian: "SHEET", undercover: "FILM" }, { civilian: "CARD", undercover: "TICKET" },
    { civilian: "BALL", undercover: "SPHERE" }, { civilian: "CUBE", undercover: "BLOCK" },
    { civilian: "CONE", undercover: "FUNNEL" }, { civilian: "DISK", undercover: "RING" },
    { civilian: "WHEEL", undercover: "GEAR" }, { civilian: "PULLEY", undercover: "LEVER" },
    { civilian: "SPRING", undercover: "COIL" }, { civilian: "VALVE", undercover: "TAP" },
    { civilian: "PLUG", undercover: "CAP" }, { civilian: "COVER", undercover: "LID" },
    { civilian: "HANDLE", undercover: "KNOB" }, { civilian: "FRAME", undercover: "BORDER" },
    { civilian: "SHELF", undercover: "RACK" }, { civilian: "DRAWER", undercover: "TRAY" },
    { civilian: "HOOK", undercover: "PEG" }, { civilian: "BELT", undercover: "STRAP" },
    { civilian: "MASK", undercover: "SHIELD" }, { civilian: "HELMET", undercover: "CAP" },
    { civilian: "GLOVE", undercover: "MITT" }, { civilian: "SHOE", undercover: "BOOT" },
    { civilian: "SOCK", undercover: "STOCKING" }, { civilian: "HAT", undercover: "BERET" },
    { civilian: "SCARF", undercover: "WRAP" }, { civilian: "PILLOW", undercover: "CUSHION" },
    { civilian: "MATTRESS", undercover: "PAD" }, { civilian: "RUG", undercover: "MAT" },
    { civilian: "CURTAIN", undercover: "SHADE" }, { civilian: "BLIND", undercover: "SCREEN" },
    { civilian: "LADDER", undercover: "STEPS" }, { civilian: "BARREL", undercover: "DRUM" },
    { civilian: "CAN", undercover: "TIN" }, { civilian: "CARTON", undercover: "BOX" },
    { civilian: "PACKET", undercover: "POUCH" }, { civilian: "TUBE", undercover: "ROLL" },
    { civilian: "BOTTLE", undercover: "JUG" }, { civilian: "PITCHER", undercover: "CARAFE" },
    { civilian: "GOBLET", undercover: "FLUTE" }, { civilian: "TRAY", undercover: "PLATTER" },
    { civilian: "LADLE", undercover: "SCOOP" }, { civilian: "FUNNEL", undercover: "STRAINER" },
    { civilian: "GRATER", undercover: "SLICER" }, { civilian: "PEELER", undercover: "CUTTER" },
    { civilian: "OPENER", undercover: "CORKSCREW" }, { civilian: "THERMOMETER", undercover: "GAUGE" },
    { civilian: "MAGNET", undercover: "COMPASS" }, { civilian: "LENS", undercover: "PRISM" },
    { civilian: "STATUE", undercover: "FIGURE" }, { civilian: "TOY", undercover: "DOLL" },
    { civilian: "PUZZLE", undercover: "GAME" }, { civilian: "MARBLE", undercover: "DICE" }
  ],
  "Personal Electronic": [
    { civilian: "PHONE", undercover: "SMARTPHONE" }, { civilian: "TABLET", undercover: "E-READER" },
    { civilian: "LAPTOP", undercover: "NOTEBOOK" }, { civilian: "SMARTWATCH", undercover: "FITNESSBAND" },
    { civilian: "EARBUDS", undercover: "HEADPHONES" }, { civilian: "SPEAKER", undercover: "SOUNDBAR" },
    { civilian: "CAMERA", undercover: "CAMCODER" }, { civilian: "POWERBANK", undercover: "BATTERY" },
    { civilian: "CHARGER", undercover: "ADAPTER" }, { civilian: "CABLE", undercover: "WIRE" },
    { civilian: "MOUSE", undercover: "TRACKPAD" }, { civilian: "KEYBOARD", undercover: "KEYPAD" },
    { civilian: "MONITOR", undercover: "DISPLAY" }, { civilian: "WEBCAM", undercover: "MICROPHONE" },
    { civilian: "HEADSET", undercover: "EARPHONES" }, { civilian: "DRONE", undercover: "QUADCOPTER" },
    { civilian: "CONSOLE", undercover: "HANDHELD" }, { civilian: "STYLUS", undercover: "PEN" },
    { civilian: "FLASHDRIVE", undercover: "HARDDRIVE" }, { civilian: "MEMORYCARD", undercover: "SDCARD" },
    { civilian: "ROUTER", undercover: "MODEM" }, { civilian: "TRACKER", undercover: "AIRTAG" },
    { civilian: "REMOTE", undercover: "CONTROLLER" }, { civilian: "PROJECTOR", undercover: "BEAMER" },
    { civilian: "TRIMMER", undercover: "RAZOR" }, { civilian: "HAIRDRYER", undercover: "STRAIGHTENER" },
    { civilian: "TOOTHBRUSH", undercover: "FLOSSER" }, { civilian: "MASSAGER", undercover: "GUN" },
    { civilian: "SCALE", undercover: "ANALYZER" }, { civilian: "THERMOMETER", undercover: "SENSOR" },
    { civilian: "CALCULATOR", undercover: "ORGANIZER" }, { civilian: "DICTAPHONE", undercover: "RECORDER" },
    { civilian: "WALKMAN", undercover: "IPOD" }, { civilian: "RADIO", undercover: "TUNER" },
    { civilian: "ALARM", undercover: "CLOCK" }, { civilian: "FLASHLIGHT", undercover: "TORCH" },
    { civilian: "GAMEPAD", undercover: "JOYSTICK" }, { civilian: "VRHEADSET", undercover: "GOGGLES" },
    { civilian: "RINGLIGHT", undercover: "LAMP" }, { civilian: "TRIPOD", undercover: "GIMBAL" },
    { civilian: "MICROPHONE", undercover: "RECORDER" }, { civilian: "AMPLIFIER", undercover: "DAC" },
    { civilian: "DOCK", undercover: "HUB" }, { civilian: "ADAPTER", undercover: "DONGLE" },
    { civilian: "PLUG", undercover: "SWITCH" }, { civilian: "SOCKET", undercover: "STRIP" },
    { civilian: "TIMER", undercover: "STOPWATCH" }, { civilian: "PULSEOXIMETER", undercover: "MONITOR" },
    { civilian: "BP_MONITOR", undercover: "GAUGE" }, { civilian: "HEARINGAID", undercover: "AMPLIFIER" },
    { civilian: "PAGER", undercover: "BEEPER" }, { civilian: "WALKIETALKIE", undercover: "TRANSCEIVER" },
    { civilian: "GPS", undercover: "NAVIGATOR" }, { civilian: "RADAR", undercover: "DETECTOR" },
    { civilian: "E-BOOK", undercover: "KINDLE" }, { civilian: "SMARTPENDANT", undercover: "BADGE" },
    { civilian: "SMARTRING", undercover: "BAND" }, { civilian: "KEYFOB", undercover: "REMOTE" },
    { civilian: "TAG", undercover: "BEACON" }, { civilian: "POWERSTRIP", undercover: "SURGEPROTECTOR" },
    { civilian: "SOLARPANEL", undercover: "CHARGER" }, { civilian: "FAN", undercover: "COOLER" },
    { civilian: "HEATER", undercover: "WARMER" }, { civilian: "HUMIDIFIER", undercover: "DIFFUSER" },
    { civilian: "PURIFIER", undercover: "FILTER" }, { civilian: "BEAMER", undercover: "DISPLAY" },
    { civilian: "PRINTER", undercover: "SCANNER" }, { civilian: "LABELMAKER", undercover: "PRINTER" },
    { civilian: "SHREDDER", undercover: "CRUSHER" }, { civilian: "LAMINATOR", undercover: "PRESS" },
    { civilian: "VACUUM", undercover: "ROBOT" }, { civilian: "MOP", undercover: "CLEANER" },
    { civilian: "FEEDER", undercover: "DISPENSER" }, { civilian: "CAMERA", undercover: "MONITOR" },
    { civilian: "DOORBELL", undercover: "INTERCOM" }, { civilian: "LOCK", undercover: "PADLOCK" },
    { civilian: "SENSOR", undercover: "DETECTOR" }, { civilian: "HUB", undercover: "BRIDGE" },
    { civilian: "SWITCH", undercover: "DIMMER" }, { civilian: "BULB", undercover: "STRIP" },
    { civilian: "THERMOSTAT", undercover: "CONTROLLER" }, { civilian: "VALVE", undercover: "ACTUATOR" },
    { civilian: "BLINDS", undercover: "SHADE" }, { civilian: "OPENER", undercover: "MOTOR" },
    { civilian: "SCALE", undercover: "BALANCE" }, { civilian: "ANALYZER", undercover: "TESTER" },
    { civilian: "SCOPE", undercover: "CAMERA" }, { civilian: "FINDER", undercover: "METER" },
    { civilian: "DETECTOR", undercover: "SCANNER" }, { civilian: "COUNTER", undercover: "METER" },
    { civilian: "CHRONOMETER", undercover: "WATCH" }, { civilian: "COMPASS", undercover: "SENSOR" },
    { civilian: "ALTIMETER", undercover: "BAROMETER" }, { civilian: "PEDOMETER", undercover: "TRACKER" },
    { civilian: "MONITOR", undercover: "BAND" }, { civilian: "RECEIVER", undercover: "TUNER" },
    { civilian: "TRANSMITTER", undercover: "BEACON" }, { civilian: "ANTENNA", undercover: "DISH" }
  ],
  "Consumer Tech": [
    { civilian: "DRONE", undercover: "QUADCOPTER" }, { civilian: "SMARTWATCH", undercover: "FITNESSBAND" },
    { civilian: "VRHEADSET", undercover: "ARGLASSES" }, { civilian: "SMARTSPEAKER", undercover: "SOUNDBAR" },
    { civilian: "ROBOTVACUUM", undercover: "SWEEPER" }, { civilian: "SMARTTV", undercover: "STREAMINGSTICK" },
    { civilian: "E-READER", undercover: "TABLET" }, { civilian: "ACTIONCAM", undercover: "GIMBAL" },
    { civilian: "CONSOLE", undercover: "GAMINGPC" }, { civilian: "SMARTPLUG", undercover: "SMARTSWITCH" },
    { civilian: "SMARTBULB", undercover: "LIGHTSTRIP" }, { civilian: "SMARTLOCK", undercover: "KEYPAD" },
    { civilian: "RINGDOORBELL", undercover: "SECURITYCAM" }, { civilian: "SMARTTHERMOSTAT", undercover: "SENSOR" },
    { civilian: "WIRELESSCHARGER", undercover: "MAGSAFE" }, { civilian: "POWERSTATION", undercover: "GENERATOR" },
    { civilian: "PORTABLEMONITOR", undercover: "TABLET" }, { civilian: "BLUETOOTHTRACKER", undercover: "AIRTAG" },
    { civilian: "NOISECANCELLING", undercover: "EARBUDS" }, { civilian: "BONECONDUCTION", undercover: "HEADPHONES" },
    { civilian: "SMARTDISPLAY", undercover: "TABLET" }, { civilian: "DASHCAM", undercover: "SECURITYCAM" },
    { civilian: "ELECTRONICPAD", undercover: "DIGITIZER" }, { civilian: "3DPRINTER", undercover: "SCANNER" },
    { civilian: "LASERCUTTER", undercover: "ENGRAVER" }, { civilian: "SMARTPLANTMUG", undercover: "SENSOR" },
    { civilian: "SMARTMUG", undercover: "WARMER" }, { civilian: "SMARTBED", undercover: "MATTRESS" },
    { civilian: "SMARTMIRROR", undercover: "DISPLAY" }, { civilian: "SMARTPURIFIER", undercover: "HUMIDIFIER" },
    { civilian: "ELECTRICBAG", undercover: "HEATEDJACKET" }, { civilian: "ELECTRICSCOOTER", undercover: "EBIKE" },
    { civilian: "HOVERBOARD", undercover: "SEGWAY" }, { civilian: "ONEEWHEEL", undercover: "SKATEBOARD" },
    { civilian: "SOLARPOWERBANK", undercover: "PANEL" }, { civilian: "SATELLITEPHONE", undercover: "COMMUNICATOR" },
    { civilian: "MESHROUTER", undercover: "EXTENDER" }, { civilian: "NASDRIVE", undercover: "CLOUDSTORAGE" },
    { civilian: "STREAMDECK", undercover: "CONTROLLER" }, { civilian: "CAPTURECARD", undercover: "ADAPTER" },
    { civilian: "USBHUB", undercover: "DOCKINGSTATION" }, { civilian: "SMARTWEIGHINGSCALE", undercover: "ANALYZER" },
    { civilian: "SMARTRING", undercover: "FITNESSTRACKER" }, { civilian: "SMARTGLASSES", undercover: "HEADSET" },
    { civilian: "PORTABLEPROJECTOR", undercover: "BEAMER" }, { civilian: "POCKETPRINTER", undercover: "LABELMAKER" },
    { civilian: "SMARTFRIDGE", undercover: "HUB" }, { civilian: "SMARTOVEN", undercover: "AIRFRYER" },
    { civilian: "AUTOMATICFEEDER", undercover: "WATERFOUNTAIN" }, { civilian: "ROBOTMOWER", undercover: "TRIMMER" },
    { civilian: "SMARTGARDEN", undercover: "HYDROPONICS" }, { civilian: "POWERSTRIP", undercover: "SURGEPROTECTOR" },
    { civilian: "THUNDERBOLTDOCK", undercover: "HUB" }, { civilian: "KVM_SWITCH", undercover: "ADAPTER" },
    { civilian: "THERMALCAMERA", undercover: "SENSOR" }, { civilian: "ENDOSCOPE", undercover: "INSPECTIONCAM" },
    { civilian: "SMARTTAG", undercover: "BEACON" }, { civilian: "PORTABLESCANNER", undercover: "PEN" },
    { civilian: "DIGITALFRAME", undercover: "DISPLAY" }, { civilian: "E-INKMONITOR", undercover: "SCREEN" },
    { civilian: "HANDHELDPC", undercover: "STEAMDECK" }, { civilian: "ARCADESTICK", undercover: "CONTROLLER" },
    { civilian: "SIMRACINGWHEEL", undercover: "PEDALS" }, { civilian: "FLIGHTSTICK", undercover: "THROTTLE" },
    { civilian: "VRTRACKER", undercover: "SENSOR" }, { civilian: "HAPTICVEST", undercover: "GLOVES" },
    { civilian: "SMARTSKIPROPE", undercover: "TRACKER" }, { civilian: "SMARTDUMBBELL", undercover: "KETTLEBELL" },
    { civilian: "PERCUSSIONGUN", undercover: "MASSAGER" }, { civilian: "SMARTIV", undercover: "PUMP" },
    { civilian: "SMARTRULER", undercover: "MEASURE" }, { civilian: "COLORSENSOR", undercover: "SCANNER" },
    { civilian: "DIGITALMICROSCOPE", undercover: "MAGNIFIER" }, { civilian: "POCKETTRANSLATOR", undercover: "INTERPRETER" },
    { civilian: "NOISEMACHINE", undercover: "SPEAKER" }, { civilian: "SUNLAMPAKENER", undercover: "ALARM" },
    { civilian: "SMARTDIFFUSER", undercover: "PURIFIER" }, { civilian: "ROBOTPOOLCLEANER", undercover: "VACUUM" },
    { civilian: "SMARTWINDOWCLEANER", undercover: "ROBOT" }, { civilian: "ELECTRICWINEOPENER", undercover: "PRESERVER" },
    { civilian: "VACUUMSEALER", undercover: "BAGSEALER" }, { civilian: "MILKFORTHER", undercover: "MIXER" },
    { civilian: "ICECELLAR", undercover: "MAKER" }, { civilian: "SOUSVIDE", undercover: "CIRCULATOR" },
    { civilian: "COOKER", undercover: "INSTANTPOT" }, { civilian: "AIRFRYER", undercover: "OVEN" },
    { civilian: "DEHYDRATOR", undercover: "DRYER" }, { civilian: "SMARTCAN", undercover: "COMPACTOR" },
    { civilian: "WATERFILTER", undercover: "PURIFIER" }, { civilian: "DISPENSER", undercover: "HEATER" },
    { civilian: "SODAMAKER", undercover: "CARBONATOR" }, { civilian: "COFFEEMAKER", undercover: "ESPRESSO" },
    { civilian: "GRINDER", undercover: "MILL" }, { civilian: "SCALE", undercover: "TIMER" },
    { civilian: "KETTLE", undercover: "BOILER" }, { civilian: "TOASTER", undercover: "PRESS" }
  ]
};

let selectedCategories = [...ALL_CATEGORIES_LIST];
let isAIModeEnabled = true;
let geminiApiKey = "";
let usedWordsHistory = [];
let lastMrWhitePlayerNames = [];

let groups = [
  { id: 'g1', name: 'Office', color: '#f96854', players: ['SN', 'AS', 'LA', 'AA', 'ME', 'AB'] },
  { id: 'g2', name: 'Team 5', color: '#6c5ce7', players: ['SN', 'AS', 'LA'] },
  { id: 'g3', name: 'Bangalore Friends', color: '#00b894', players: ['SN', 'AS', 'LA', 'AA', 'ME'] }
];

let currentSuspects = ['Player 1', 'Player 2', 'Player 3'];
let undercoverCount = 1;
let mrWhiteCount = 1;

let currentWordPair = null;
let gameCards = [];
let currentPickerIndex = 0;
let activePlayers = [];
let descriptionOrder = []; 
let isVotingMode = false;
let playerToEliminate = null;
let winningTeam = "";

function initApp() {
  loadFromStorage();
  renderReadyTeams();
  renderSuspectsInputs();
  renderCategoriesUI();
  updateSetupUI();
}

function saveToStorage() {
  localStorage.setItem('uw_groups', JSON.stringify(groups));
  localStorage.setItem('uw_last_white', JSON.stringify(lastMrWhitePlayerNames));
  localStorage.setItem('uw_used_words', JSON.stringify(usedWordsHistory));
  localStorage.setItem('uw_gemini_key', geminiApiKey);
}

function loadFromStorage() {
  const storedGroups = localStorage.getItem('uw_groups');
  if (storedGroups) { try { groups = JSON.parse(storedGroups); } catch(e){} }

  const storedWhite = localStorage.getItem('uw_last_white');
  if (storedWhite) { try { lastMrWhitePlayerNames = JSON.parse(storedWhite); } catch(e){} }

  const storedWords = localStorage.getItem('uw_used_words');
  if (storedWords) { try { usedWordsHistory = JSON.parse(storedWords); } catch(e){} }

  geminiApiKey = localStorage.getItem('uw_gemini_key') || "";
  if (document.getElementById('gemini-api-key')) {
    document.getElementById('gemini-api-key').value = geminiApiKey;
  }
}

function saveApiKey(val) {
  geminiApiKey = val.trim();
  saveToStorage();
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function openGameSetup() {
  renderSuspectsInputs();
  updateSetupUI();
  navigateTo('page-2');
}

function renderReadyTeams() {
  const container = document.getElementById('ready-teams-list');
  container.innerHTML = '';
  
  if (groups.length === 0) {
    container.innerHTML = `<p style="font-size:12px; color:#888; text-align:center; padding:10px;">No saved teams yet. Start a new game to create one!</p>`;
    return;
  }

  groups.forEach(g => {
    container.innerHTML += `
      <div class="ready-team-item">
        <div class="team-main-info" onclick="loadCrewToSetup('${g.id}')">
          <div class="team-avatar-square" style="background:${g.color}">${g.name.charAt(0)}</div>
          <div>
            <h4>${g.name}</h4>
            <p>${g.players.length} players (${g.players.join(', ')})</p>
          </div>
        </div>
        <button class="delete-crew-btn" onclick="deleteCrew(event, '${g.id}')" title="Delete Team">🗑️</button>
      </div>
    `;
  });
}

function deleteCrew(event, groupId) {
  event.stopPropagation();
  const team = groups.find(g => g.id === groupId);
  if (!team) return;

  if (confirm(`Are you sure you want to delete "${team.name}"?`)) {
    groups = groups.filter(g => g.id !== groupId);
    saveToStorage();
    renderReadyTeams();
  }
}

function loadCrewToSetup(groupId) {
  const g = groups.find(item => item.id === groupId);
  if (g) {
    document.getElementById('setup-team-name').value = g.name;
    currentSuspects = [...g.players];
    renderSuspectsInputs();
    updateSetupUI();
    navigateTo('page-2');
  }
}

function renderSuspectsInputs() {
  const list = document.getElementById('suspects-inputs-list');
  list.innerHTML = '';
  currentSuspects.forEach((name, idx) => {
    const num = (idx + 1).toString().padStart(2, '0');
    list.innerHTML += `
      <div class="suspect-row">
        <span class="suspect-num">${num}</span>
        <input type="text" class="suspect-input" value="${name}" onchange="updateSuspectName(${idx}, this.value)">
        <button class="remove-btn" onclick="removeSuspect(${idx})">✕</button>
      </div>
    `;
  });
  document.getElementById('suspects-counter-badge').innerText = currentSuspects.length;
  updateSetupUI();
}

function addSuspectField() {
  if (currentSuspects.length >= 20) return alert("Maximum 20 players allowed.");
  currentSuspects.push(`Player ${currentSuspects.length + 1}`);
  renderSuspectsInputs();
}

function updateSuspectName(idx, val) {
  currentSuspects[idx] = val.trim() || `Player ${idx + 1}`;
}

function removeSuspect(idx) {
  if (currentSuspects.length <= 3) return alert("Minimum 3 players required.");
  currentSuspects.splice(idx, 1);
  renderSuspectsInputs();
}

function adjustRole(role, delta) {
  const total = currentSuspects.length;
  if (role === 'undercover') undercoverCount = Math.max(0, undercoverCount + delta);
  if (role === 'mrWhite') mrWhiteCount = Math.max(0, mrWhiteCount + delta);

  if ((undercoverCount + mrWhiteCount) >= total) {
    if (role === 'undercover') undercoverCount = Math.max(0, total - mrWhiteCount - 1);
    if (role === 'mrWhite') mrWhiteCount = Math.max(0, total - undercoverCount - 1);
  }
  updateSetupUI();
}

function updateSetupUI() {
  document.getElementById('label-undercover-count').innerText = undercoverCount;
  document.getElementById('label-mrwhite-count').innerText = mrWhiteCount;
  document.getElementById('deal-summary-text').innerText = `${currentSuspects.length} players · ${undercoverCount} Spy · ${mrWhiteCount} Mr White`;
}

function toggleAllCategories() {
  if (selectedCategories.length === ALL_CATEGORIES_LIST.length) {
    selectedCategories = [];
  } else {
    selectedCategories = [...ALL_CATEGORIES_LIST];
  }
  renderCategoriesUI();
}

function toggleCategory(catName) {
  if (selectedCategories.includes(catName)) {
    selectedCategories = selectedCategories.filter(c => c !== catName);
  } else {
    selectedCategories.push(catName);
  }
  renderCategoriesUI();
}

function renderCategoriesUI() {
  const allChip = document.getElementById('cat-chip-all');
  const allLabel = document.getElementById('all-cat-label');
  const allCheck = document.getElementById('all-cat-check');

  if (selectedCategories.length === ALL_CATEGORIES_LIST.length) {
    allChip.classList.remove('unselected');
    allChip.classList.add('active');
    allLabel.innerText = "✨ All categories selected";
    allCheck.style.display = "inline";
  } else if (selectedCategories.length === 0) {
    allChip.classList.remove('active');
    allChip.classList.add('unselected');
    allLabel.innerText = "✨ Select all categories";
    allCheck.style.display = "none";
  } else {
    allChip.classList.remove('active', 'unselected');
    allLabel.innerText = `✨ ${selectedCategories.length} categories selected`;
    allCheck.style.display = "none";
  }

  const container = document.getElementById('categories-grid');
  container.innerHTML = '';
  ALL_CATEGORIES_LIST.forEach(cat => {
    const isSelected = selectedCategories.includes(cat);
    container.innerHTML += `
      <button class="cat-card ${isSelected ? 'active' : ''}" onclick="toggleCategory('${cat}')">
        <span>${cat}</span>
      </button>
    `;
  });
}

function toggleAIMode(enabled) { isAIModeEnabled = enabled; }

// Fetch fresh, non-repeating words via Gemini API
async function getNextWordPair() {
  if (selectedCategories.length === 0) {
    selectedCategories = [...ALL_CATEGORIES_LIST];
    renderCategoriesUI();
  }

  const chosenCat = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];

  if (geminiApiKey) {
    try {
      const prompt = `Generate 1 unique pair of closely related words for an "Undercover" word game in JSON format.
      Category: "${chosenCat}".
      Do NOT use any of these previously used words: ${JSON.stringify(usedWordsHistory.slice(-100))}.
      Output MUST be valid raw JSON only without markdown or extra text: {"civilian": "WORD1", "undercover": "WORD2"}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(rawText);

      usedWordsHistory.push(parsed.civilian.toUpperCase(), parsed.undercover.toUpperCase());
      saveToStorage();

      return { civilian: parsed.civilian.toUpperCase(), undercover: parsed.undercover.toUpperCase() };
    } catch (e) {
      console.warn("Gemini API call failed or missing, using local fallback:", e);
    }
  }

  // Fallback when API key is not present or API call fails
  const pool = fallbackPairs[chosenCat] || [{ civilian: "OBJECT", undercover: "ITEM" }];
  const pair = pool[Math.floor(Math.random() * pool.length)];
  usedWordsHistory.push(pair.civilian, pair.undercover);
  saveToStorage();
  return { civilian: pair.civilian, undercover: pair.undercover };
}

async function startGame() {
  if (currentSuspects.length < 3) return alert("Minimum 3 players required.");
  if (selectedCategories.length === 0) return alert("Please select at least one category.");

  const teamName = document.getElementById('setup-team-name').value.trim() || 'Custom Crew';
  
  const existingIndex = groups.findIndex(g => g.name.toLowerCase() === teamName.toLowerCase());
  if (existingIndex >= 0) {
    groups[existingIndex].players = [...currentSuspects];
  } else {
    const colors = ['#f96854', '#6c5ce7', '#00b894', '#fdcb6e', '#e84393'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    groups.push({
      id: 'g_' + Date.now(),
      name: teamName,
      color: randomColor,
      players: [...currentSuspects]
    });
  }
  saveToStorage();
  renderReadyTeams();

  let playersPool = [...currentSuspects].sort(() => Math.random() - 0.5);
  currentWordPair = await getNextWordPair();

  let eligibleMrWhites = playersPool.filter(p => !lastMrWhitePlayerNames.includes(p));
  if (eligibleMrWhites.length < mrWhiteCount) eligibleMrWhites = playersPool;
  eligibleMrWhites.sort(() => Math.random() - 0.5);

  let chosenMrWhites = eligibleMrWhites.slice(0, mrWhiteCount);
  lastMrWhitePlayerNames = [...chosenMrWhites];
  saveToStorage();

  let remaining = playersPool.filter(p => !chosenMrWhites.includes(p));
  remaining.sort(() => Math.random() - 0.5);
  let chosenSpies = remaining.slice(0, undercoverCount);

  activePlayers = playersPool.map((pName, idx) => {
    let role = 'CIVILIAN';
    if (chosenMrWhites.includes(pName)) role = 'MR_WHITE';
    else if (chosenSpies.includes(pName)) role = 'UNDERCOVER';

    return {
      name: pName,
      role: role,
      word: role === 'CIVILIAN' ? currentWordPair.civilian : (role === 'UNDERCOVER' ? currentWordPair.undercover : 'You are Mr. White!'),
      eliminated: false,
      order: idx + 1
    };
  });

  gameCards = [...activePlayers];
  if (gameCards.length > 1 && gameCards[0].role === 'MR_WHITE') {
    let nonWhiteIdx = gameCards.findIndex(p => p.role !== 'MR_WHITE');
    if (nonWhiteIdx !== -1) {
      let temp = gameCards[0];
      gameCards[0] = gameCards[nonWhiteIdx];
      gameCards[nonWhiteIdx] = temp;
    }
  }

  gameCards = gameCards.map(p => ({ ...p, used: false }));
  currentPickerIndex = 0;
  renderCardsGrid();
  navigateTo('page-5');
}

function renderCardsGrid() {
  document.getElementById('current-picker-name').innerText = gameCards[currentPickerIndex].name;
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';
  gameCards.forEach((card, idx) => {
    grid.innerHTML += `<div class="mystery-card ${card.used ? 'used' : ''}" onclick="pickCard(${idx})">❓</div>`;
  });
}

function pickCard(idx) {
  if (gameCards[idx].used) return;
  const current = gameCards[currentPickerIndex];
  document.getElementById('modal-avatar').innerText = current.name.charAt(0);
  document.getElementById('modal-player-name').innerText = current.name;
  document.getElementById('modal-secret-word').innerText = current.word;
  gameCards[idx].used = true;
  document.getElementById('card-modal').classList.add('active');
}

function closeCardModal() {
  document.getElementById('card-modal').classList.remove('active');
  currentPickerIndex++;
  if (currentPickerIndex >= gameCards.length) {
    initDescriptionSequence();
    navigateTo('page-6');
  } else {
    renderCardsGrid();
  }
}

function initDescriptionSequence() {
  let remaining = activePlayers.filter(p => !p.eliminated);
  remaining.sort(() => Math.random() - 0.5);

  if (remaining.length > 1 && remaining[0].role === 'MR_WHITE') {
    let nonWhiteIdx = remaining.findIndex(p => p.role !== 'MR_WHITE');
    if (nonWhiteIdx !== -1) {
      let nonWhitePlayer = remaining.splice(nonWhiteIdx, 1)[0];
      remaining.unshift(nonWhitePlayer);
    }
  }
  descriptionOrder = remaining;
  isVotingMode = false;
  renderBoardUI();
}

function renderBoardUI() {
  document.getElementById('board-title').innerText = isVotingMode ? "Elimination Time" : "Description Time";
  document.getElementById('board-subtitle').innerText = isVotingMode ? "Discuss and vote somebody out!" : "Describe your secret word in order.";

  const remaining = activePlayers.filter(p => !p.eliminated);
  const mwLeft = remaining.filter(p => p.role === 'MR_WHITE').length;
  const spyLeft = remaining.filter(p => p.role === 'UNDERCOVER').length;

  document.getElementById('count-mrwhite').innerText = `${mwLeft} Mr White`;
  document.getElementById('count-undercover').innerText = `${spyLeft} Spy`;

  const grid = document.getElementById('players-board-grid');
  grid.innerHTML = '';

  const displayList = descriptionOrder.filter(p => !p.eliminated);

  displayList.forEach((p, index) => {
    grid.innerHTML += `
      <div class="player-card-node">
        <div class="avatar-large">${p.name.substring(0, 2)}</div>
        <span style="font-size:11px; font-weight:700;">${p.name}</span>
        <span style="font-size:9px; color:#888; margin-top:2px;">Turn #${index + 1}</span>
        ${isVotingMode ? `<button style="background:#f96854; color:white; border:none; padding:2px 8px; border-radius:10px; font-size:9px; margin-top:4px; cursor:pointer;" onclick="openEliminateModal('${p.name}')">Eliminate</button>` : ''}
      </div>
    `;
  });
}

function toggleVoteMode() {
  isVotingMode = !isVotingMode;
  renderBoardUI();
}

function openEliminateModal(name) {
  playerToEliminate = activePlayers.find(p => p.name === name);
  document.getElementById('elim-player-title').innerText = `Eliminate ${playerToEliminate.name}?`;

  const remaining = activePlayers.filter(p => !p.eliminated);
  const mwLeft = remaining.filter(p => p.role === 'MR_WHITE').length;
  const spyLeft = remaining.filter(p => p.role === 'UNDERCOVER').length;

  document.getElementById('btn-elim-mrwhite').style.display = mwLeft > 0 ? 'block' : 'none';
  document.getElementById('btn-elim-undercover').style.display = spyLeft > 0 ? 'block' : 'none';

  document.getElementById('eliminate-confirm-modal').classList.add('active');
}

function eliminateAsRole(votedOption) {
  document.getElementById('eliminate-confirm-modal').classList.remove('active');

  if (playerToEliminate.role === 'MR_WHITE') {
    document.getElementById('mrwhite-word-input').value = '';
    document.getElementById('mrwhite-guess-modal').classList.add('active');
  } else {
    processEliminationResult();
  }
}

function submitMrWhiteGuess() {
  const guess = document.getElementById('mrwhite-word-input').value.trim().toUpperCase();
  document.getElementById('mrwhite-guess-modal').classList.remove('active');

  if (guess === currentWordPair.civilian.toUpperCase()) {
    winningTeam = 'MR_WHITE';
    triggerGameOver("Mr. White guessed the secret word correctly and won the game!");
  } else {
    playerToEliminate.eliminated = true;
    document.getElementById('result-role-title').innerText = `MR. WHITE GUESS FAILED!`;
    document.getElementById('result-avatar').innerText = playerToEliminate.name.charAt(0);
    document.getElementById('result-player-name').innerText = `${playerToEliminate.name} guessed "${guess}" incorrectly!`;
    document.getElementById('result-modal').classList.add('active');
  }
}

function processEliminationResult() {
  playerToEliminate.eliminated = true;

  document.getElementById('result-role-title').innerText = `${playerToEliminate.role} ELIMINATED!`;
  document.getElementById('result-avatar').innerText = playerToEliminate.name.charAt(0);
  document.getElementById('result-player-name').innerText = playerToEliminate.name;
  document.getElementById('result-modal').classList.add('active');
}

function handleResultModalOk() {
  document.getElementById('result-modal').classList.remove('active');
  checkWinConditions();
}

function checkWinConditions() {
  const remaining = activePlayers.filter(p => !p.eliminated);
  const remainingMrWhite = remaining.filter(p => p.role === 'MR_WHITE');
  const remainingUndercover = remaining.filter(p => p.role === 'UNDERCOVER');

  if (remainingMrWhite.length === 0 && remainingUndercover.length === 0) {
    winningTeam = 'CIVILIANS';
    triggerGameOver("Civilians Win! All Mr. Whites and Undercovers have been eliminated.");
    return;
  }

  if (remaining.length === 2) {
    const p1 = remaining[0];
    const p2 = remaining[1];

    if ((p1.role === 'MR_WHITE' && p2.role === 'CIVILIAN') || (p2.role === 'MR_WHITE' && p1.role === 'CIVILIAN')) {
      winningTeam = 'MR_WHITE';
      triggerGameOver("Mr. White Wins! 1 Mr. White and 1 Civilian remaining.");
      return;
    }

    if ((p1.role === 'MR_WHITE' && p2.role === 'UNDERCOVER') || (p2.role === 'MR_WHITE' && p1.role === 'UNDERCOVER')) {
      winningTeam = 'MR_WHITE_AND_UNDERCOVER';
      triggerGameOver("Mr. White & Undercover Win! 1 Mr. White and 1 Undercover remaining.");
      return;
    }

    if ((p1.role === 'UNDERCOVER' && p2.role === 'CIVILIAN') || (p2.role === 'UNDERCOVER' && p1.role === 'CIVILIAN')) {
      winningTeam = 'UNDERCOVER';
      triggerGameOver("Undercover Wins! 1 Undercover and 1 Civilian remaining.");
      return;
    }

    if (p1.role === 'CIVILIAN' && p2.role === 'CIVILIAN') {
      winningTeam = 'CIVILIANS';
      triggerGameOver("Civilians Win! Only Civilians are left.");
      return;
    }
  }

  isVotingMode = false;
  renderBoardUI();
}

function triggerGameOver(msg) {
  let title = "Game Over";
  if (winningTeam === 'CIVILIANS') title = "Civilians Win! 🎉";
  else if (winningTeam === 'MR_WHITE') title = "Mr. White Wins! 🕵️‍♂️";
  else if (winningTeam === 'UNDERCOVER') title = "Undercover Wins! 🕵️";
  else if (winningTeam === 'MR_WHITE_AND_UNDERCOVER') title = "Mr. White & Undercover Win! 🏆";

  document.getElementById('game-over-title').innerText = title;
  document.getElementById('game-over-msg').innerText = msg;
  document.getElementById('game-over-modal').classList.add('active');
}

function goToSummaryPage() {
  document.getElementById('game-over-modal').classList.remove('active');
  
  let title = "Game Results";
  if (winningTeam === 'CIVILIANS') title = "Civilians Win! 🎉";
  else if (winningTeam === 'MR_WHITE') title = "Mr. White Wins! 🕵️‍♂️";
  else if (winningTeam === 'UNDERCOVER') title = "Undercover Wins! 🕵️";
  else if (winningTeam === 'MR_WHITE_AND_UNDERCOVER') title = "Mr. White & Undercover Win! 🏆";

  document.getElementById('summary-title').innerText = title;
  document.getElementById('sum-civilian-word').innerText = currentWordPair.civilian;
  document.getElementById('sum-undercover-word').innerText = currentWordPair.undercover;

  const list = document.getElementById('summary-players-list');
  list.innerHTML = '';
  activePlayers.forEach(p => {
    list.innerHTML += `
      <div class="summary-player-card">
        <div>
          <span class="p-info">${p.name}</span>
          <span class="p-role">(${p.role})</span>
        </div>
        <span class="p-word">${p.word}</span>
      </div>
    `;
  });

  navigateTo('page-7');
}

function playAgain() {
  startGame();
}

function confirmQuitGame() {
  if (confirm("Quit current game?")) navigateTo('page-1');
}

document.addEventListener('DOMContentLoaded', initApp);

