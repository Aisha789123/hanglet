// Nederlandse woorden, elk met 3 aanwijzingen: het raadsel wordt duidelijker.
//   aanwijzing 1 = slim en moeilijk (woordspel, dubbele betekenis, "ik"-vorm)
//   aanwijzing 2 = duidelijker
//   aanwijzing 3 = bijna het antwoord
// Rules (see tests/words.test.js): lowercase a-z only, at least 4 letters,
// exactly 3 clues, and the word itself never appears in its own clues.
// Every category needs short (4-5), medium (6-7) and long (8+) words.
// "winter" is only played in the winter season and never in the Daily.

export default {
  animals: [
    { word: "beer", clues: [
      "In het bos ben ik gevaarlijk, maar in je bed slaap je met mij in je armen.",
      "Ik ben groot en bruin en dol op honing.",
      "Groot harig dier, zoals een grizzly.",
    ] },
    { word: "zwaan", clues: [
      "Ik was ooit een lelijk eendje.",
      "Ik ben een grote witte vogel met een sierlijke hals.",
      "Witte watervogel met een lange nek.",
    ] },
    { word: "haai", clues: [
      "Als ik mijn vin boven het water laat zien, rent iedereen het strand op.",
      "Ik ben een grote vis met heel veel scherpe tanden.",
      "Gevaarlijke roofvis in de zee.",
    ] },
    { word: "egel", clues: [
      "Ik ben een speldenkussen met pootjes.",
      "Ik rol me op tot een bal als ik bang ben.",
      "Klein dier met stekels.",
    ] },
    { word: "kraai", clues: [
      "Een vogelverschrikker is speciaal voor mij gemaakt.",
      "Ik ben een zwarte vogel die krast.",
      "Grote zwarte vogel.",
    ] },
    { word: "slang", clues: [
      "Ik ben ook het ding waarmee je de tuin water geeft.",
      "Ik heb geen poten en ik sis.",
      "Lang dier zonder poten.",
    ] },
    { word: "panda", clues: [
      "Ik draag altijd een zonnebril die ik nooit af kan zetten.",
      "Ik ben een zwart-witte beer uit China.",
      "Zwart-wit dier dat bamboe eet.",
    ] },
    { word: "geit", clues: [
      "Ik eet bijna alles, zelfs je huiswerk als je niet oplet.",
      "Ik heb een sikje en twee hoorntjes.",
      "Boerderijdier dat mekkert.",
    ] },
    { word: "spin", clues: [
      "Ik weef de hele dag, maar ik heb nog nooit een trui gemaakt.",
      "Ik heb acht poten en vang vliegen.",
      "Klein dier dat een web maakt.",
    ] },
    { word: "pauw", clues: [
      "Ik ben zo trots op mijn staart dat ik er een waaier van maak.",
      "Ik ben een vogel met een blauwgroene staart vol ogen.",
      "Vogel met een grote pronkstaart.",
    ] },
    { word: "konijn", clues: [
      "Met Pasen verstop ik eieren, maar zelf leg ik er nooit een.",
      "Ik heb lange oren en ik huppel.",
      "Knaagdier dat graag wortels eet.",
    ] },
    { word: "olifant", clues: [
      "Ik neem een douche met mijn eigen neus.",
      "Ik ben groot en grijs met enorme oren.",
      "Het grootste landdier, met een slurf.",
    ] },
    { word: "kameel", clues: [
      "Ik draag mijn eigen lunchpakket op mijn rug.",
      "Ik loop door de woestijn met twee bulten.",
      "Woestijndier met bulten.",
    ] },
    { word: "schaap", clues: [
      "Als je niet kunt slapen, ga je mij tellen.",
      "Ik heb een wollige vacht en zeg bè.",
      "Boerderijdier met wol.",
    ] },
    { word: "vlinder", clues: [
      "Ik was eerst een rups, en in mijn slaapzak ben ik veranderd.",
      "Ik heb kleurige vleugels en fladder van bloem naar bloem.",
      "Insect met mooie gekleurde vleugels.",
    ] },
    { word: "dolfijn", clues: [
      "Ik ben slimmer dan de meeste vissen, maar ik ben zelf geen vis.",
      "Ik spring uit het water en maak klikgeluidjes.",
      "Slim zeezoogdier met een snuit.",
    ] },
    { word: "eekhoorn", clues: [
      "Ik verstop mijn spaargeld onder de grond en vergeet dan waar.",
      "Ik heb een pluimstaart en klim in bomen.",
      "Rood diertje dat nootjes verzamelt.",
    ] },
    { word: "papegaai", clues: [
      "Ik praat je na, maar ik snap er geen woord van.",
      "Ik ben een kleurige vogel uit het regenwoud.",
      "Vogel die woorden kan nazeggen.",
    ] },
    { word: "krokodil", clues: [
      "Ik huil weleens, maar niemand gelooft dat ik het meen.",
      "Ik lig in de rivier met alleen mijn ogen boven water.",
      "Groot reptiel met een enorme bek vol tanden.",
    ] },
    { word: "kangoeroe", clues: [
      "Ik ben een moeder met een ingebouwde kinderwagen.",
      "Ik spring door Australië.",
      "Australisch springdier met een buidel.",
    ] },
    { word: "flamingo", clues: [
      "Mijn lievelingseten maakt me roze.",
      "Ik sta op één poot in het water.",
      "Roze vogel met lange poten.",
    ] },
    { word: "schildpad", clues: [
      "Ik ben al honderd jaar onderweg en ik ben nog steeds niet verhuisd.",
      "Ik heb een hard schild en ben heel langzaam.",
      "Traag reptiel met een schild op de rug.",
    ] },
    { word: "nijlpaard", clues: [
      "Mijn naam is een rivier plus een dier om op te rijden, maar ik lijk op geen van beide.",
      "Ik ben dik en grijs en lig graag in het water in Afrika.",
      "Groot Afrikaans dier met een enorme bek.",
    ] },
  ],

  food: [
    { word: "kaas", clues: [
      "Ik ben jong, belegen of oud, maar ik word nooit jarig.",
      "Ik ben gemaakt van melk en lig op je boterham.",
      "Geel broodbeleg, zoals Goudse.",
    ] },
    { word: "appel", clues: [
      "Ik val niet ver van de boom, zeggen ze.",
      "Ik ben rond, rood of groen, en knapperig.",
      "Fruit waar je taart van maakt.",
    ] },
    { word: "soep", clues: [
      "Als iets in mij loopt, is het helemaal mislukt.",
      "Ik ben warm en vloeibaar en je eet me met een lepel.",
      "Warm gerecht in een kom.",
    ] },
    { word: "peer", clues: [
      "Met de gebakken versie van mij blijf je zitten als het misgaat.",
      "Ik ben een vrucht, onderaan breder dan bovenaan.",
      "Vrucht in de vorm van een gloeilamp.",
    ] },
    { word: "taart", clues: [
      "Iedereen is blij als ik verschijn, en dan word ik meteen in stukken gesneden.",
      "Ik sta op het verjaardagsfeest met kaarsjes erop.",
      "Zoet gebak met slagroom.",
    ] },
    { word: "pizza", clues: [
      "Ik ben geboren in Napels en word nu overal aan de deur gebracht.",
      "Plat deeg met tomatensaus en gesmolten kaas.",
      "Italiaans gerecht in punten.",
    ] },
    { word: "friet", clues: [
      "In het Engels heet ik Frans, maar hier noemen ze me Vlaams.",
      "Ik word met mayonaise gegeten uit een zakje.",
      "Gebakken aardappelstaafjes.",
    ] },
    { word: "drop", clues: [
      "Ik ben zwart, zout of zoet, en buitenlanders trekken een vies gezicht van mij.",
      "Ik ben een snoepje van zoethout.",
      "Zwart Nederlands snoep.",
    ] },
    { word: "honing", clues: [
      "Ik ben het werk van duizenden kleine werkers met strepen.",
      "Ik ben zoet, goudgeel en kleverig.",
      "Zoet goedje dat bijen maken.",
    ] },
    { word: "banaan", clues: [
      "Een aap is gek op mij, en clowns glijden uit over mijn schil.",
      "Ik ben een gele, kromme vrucht.",
      "Gele vrucht die je pelt.",
    ] },
    { word: "spruit", clues: [
      "Ik ben een groene knikker die geen kind op zijn bord wil.",
      "Kleine groene groente die naar kool smaakt.",
      "Mini-kooltje dat je vaak met kerst eet.",
    ] },
    { word: "wortel", clues: [
      "Ik groei in de grond, maar je kunt me ook trekken uit een getal.",
      "Ik ben oranje en konijnen houden van me.",
      "Oranje groente uit de grond.",
    ] },
    { word: "aardbei", clues: [
      "Ik draag al mijn zaadjes aan de buitenkant.",
      "Ik ben een rode vrucht die je met slagroom eet.",
      "Rood zomerfruit.",
    ] },
    { word: "popcorn", clues: [
      "Ik ontplof in de keuken en niemand schrikt ervan.",
      "Ik ben het snoep van de bioscoop.",
      "Maïskorrels die knappen als je ze verhit.",
    ] },
    { word: "oliebol", clues: [
      "Ik word maar één nacht per jaar echt gevierd, met vuurwerk erbij.",
      "Ik ben een gefrituurde deegbal met poedersuiker.",
      "Oudejaarslekkernij met rozijnen.",
    ] },
    { word: "hagelslag", clues: [
      "Ik ben een bui die je gewoon op je brood mag strooien.",
      "Kleine stukjes chocola die op je boterham horen.",
      "Bruin strooisel voor op brood, Nederlandser kan het niet.",
    ] },
    { word: "stroopwafel", clues: [
      "Ik ben plat en rond en word het lekkerst als ik op je theekop zit te zweten.",
      "Twee dunne wafels met een plakkerige laag ertussen.",
      "Koek met stroop erin, uit Gouda.",
    ] },
    { word: "pepernoot", clues: [
      "Ik ben klein en rond, en in december word ik door de kamer gegooid.",
      "Ik ben een kruidig koekje van Sinterklaas.",
      "Klein bruin koekje dat je rond 5 december in je schoen vindt.",
    ] },
    { word: "pannenkoek", clues: [
      "Ik word in de lucht gegooid en hoop weer in de pan te landen.",
      "Ik ben rond en dun en je eet me met stroop.",
      "Platte koek uit de koekenpan.",
    ] },
    { word: "boterham", clues: [
      "Ik heb twee kanten, en als ik val, landt altijd de verkeerde op de grond.",
      "Een snee brood met iets erop.",
      "Brood met kaas of jam voor de lunch.",
    ] },
    { word: "spaghetti", clues: [
      "Ik ben lang en dun en ik draai me om je vork.",
      "Italianen eten me met tomatensaus en gehaktballetjes.",
      "Lange dunne pastaslierten.",
    ] },
    { word: "chocolade", clues: [
      "Ik groeide als een bittere boon en werd ieders lievelingstraktatie.",
      "Ik kom als reep, puur of melk, en smelt in je mond.",
      "Bruine lekkernij van cacao.",
    ] },
  ],

  home: [
    { word: "klok", clues: [
      "Ik heb wijzers, maar ik geef nooit raad.",
      "Ik hang aan de muur en tik de hele dag.",
      "Daarop lees je af hoe laat het is.",
    ] },
    { word: "fles", clues: [
      "Zeelieden stoppen een brief in mij en gooien me in zee.",
      "Ik heb een hals en een dop.",
      "Van glas of plastic, je drinkt eruit.",
    ] },
    { word: "lamp", clues: [
      "Als je een goed idee krijgt, gaat er bij jou eentje van mij branden.",
      "Druk op het knopje en ik geef licht.",
      "Iets met een peertje dat licht geeft.",
    ] },
    { word: "bank", clues: [
      "Je kunt op me zitten, maar je kunt er ook je geld op zetten.",
      "Ik sta in de woonkamer, voor de tv.",
      "Zacht meubel waar je met z'n allen op zit.",
    ] },
    { word: "trap", clues: [
      "Ik ben ook wat je een bal geeft als je schiet.",
      "Ik sta in huis en breng je naar boven.",
      "Treden naar de bovenverdieping.",
    ] },
    { word: "zeep", clues: [
      "Hoe vaker ik je schoon maak, hoe kleiner ik word.",
      "Ik ga schuimen als je me nat maakt.",
      "Waar je je handen mee wast.",
    ] },
    { word: "vork", clues: [
      "Ik prik in alles wat je eet, en niemand vindt me onbeleefd.",
      "Ik lig naast het mes bij je bord.",
      "Bestek waarmee je je eten prikt.",
    ] },
    { word: "kast", clues: [
      "Als je eruit komt, vertel je iets heel persoonlijks.",
      "Ik heb deuren en planken, en je kleren hangen in mij.",
      "Meubel om spullen in op te bergen.",
    ] },
    { word: "kaars", clues: [
      "Op je verjaardag blaas je me uit en dan mag je iets wensen.",
      "Ik ben van was en geef een klein vlammetje.",
      "Een staafje was met een lontje.",
    ] },
    { word: "deken", clues: [
      "Ik ben de warmste knuffel zonder armen.",
      "Ik lig op je bed en houd je warm.",
      "Groot warm kleed voor in bed.",
    ] },
    { word: "bezem", clues: [
      "Nieuwe van mij vegen schoon, zegt het spreekwoord.",
      "Ik heb een lange steel en borstelharen.",
      "Borstel aan een stok om te vegen.",
    ] },
    { word: "emmer", clues: [
      "Als ik bijna vol ben, is er nog maar één druppel nodig om me te laten overlopen.",
      "Ik heb een hengsel en je vult me met sop om te poetsen.",
      "Plastic bak met een hengsel.",
    ] },
    { word: "lepel", clues: [
      "Als je goed in mij kijkt, zie je jezelf ondersteboven.",
      "Je roert je thee met mij.",
      "Bestek voor soep en yoghurt.",
    ] },
    { word: "slot", clues: [
      "In een sprookje woont er een prinses in mij, op je fiets houd ik dieven tegen.",
      "Zonder sleutel krijg je mij niet open.",
      "Ding op een deur of fiets dat je met een sleutel opent.",
    ] },
    { word: "sleutel", clues: [
      "Ik heb een baard, maar ik ben nog nooit naar de kapper geweest.",
      "Zonder mij blijft de deur op slot.",
      "Klein metalen ding om een deur open te maken.",
    ] },
    { word: "kussen", clues: [
      "Je doet het met je lippen, maar je slaapt er ook op.",
      "Ik ben zacht en pluizig en lig op je bed.",
      "Waar je hoofd op ligt als je slaapt.",
    ] },
    { word: "spiegel", clues: [
      "Ik ben eerlijk tegen iedereen, ook als ze net wakker zijn.",
      "Elke ochtend kijk je in mij om je haar te checken.",
      "Glad glas waarin je jezelf ziet.",
    ] },
    { word: "wekker", clues: [
      "Ik maak iedereen wakker, maar zelf slaap ik nooit.",
      "Elke ochtend ga ik veel te vroeg af.",
      "Klok die rinkelt als je moet opstaan.",
    ] },
    { word: "paraplu", clues: [
      "Als de lucht gaat huilen, ga ik open.",
      "Ik houd je droog en heb een krom handvat.",
      "Wat je boven je hoofd houdt als het regent.",
    ] },
    { word: "gordijn", clues: [
      "Ik houd 's ochtends de zon tegen, zodat jij kunt uitslapen.",
      "Ik hang voor het raam en je schuift me open en dicht.",
      "Lap stof voor het raam.",
    ] },
    { word: "theepot", clues: [
      "Ik heb een buik, een tuit en een deksel, en ik schenk graag mijn hart uit.",
      "In mij trekken blaadjes een warm drankje.",
      "Pot met een tuit voor thee.",
    ] },
    { word: "potlood", clues: [
      "Elke keer dat je me scherp maakt, word ik korter.",
      "Ik schrijf, maar mijn fouten kun je uitgummen.",
      "Houten stokje met grijs grafiet erin.",
    ] },
    { word: "handdoek", clues: [
      "Als een bokser me in de ring gooit, geeft hij op.",
      "Ik hang in de badkamer en droog je af.",
      "Zachte doek om je af te drogen.",
    ] },
    { word: "magnetron", clues: [
      "Ik maak je eten warm zonder vuur, en ik piep als ik klaar ben.",
      "Ik ben een kastje in de keuken met een draaiend bord.",
      "Apparaat om eten snel op te warmen.",
    ] },
    { word: "stofzuiger", clues: [
      "Ik ben de enige in huis die stof eet en daar blij van wordt.",
      "Ik maak lawaai en zuig kruimels op.",
      "Apparaat dat de vloer schoonmaakt met zuigkracht.",
    ] },
    { word: "kalender", clues: [
      "Mijn dagen zijn geteld, en na december ben ik niks meer waard.",
      "Ik hang aan de muur en je streept mijn vakjes af.",
      "Overzicht van alle dagen en maanden van het jaar.",
    ] },
    { word: "brievenbus", clues: [
      "Ik heb een mond in de voordeur en eet alleen papier.",
      "De postbode voert me elke dag.",
      "Gleuf of kastje waar je post in valt.",
    ] },
    { word: "tandenborstel", clues: [
      "Ik heb haren maar geen hoofd, en twee keer per dag ga ik je mond in.",
      "Met pasta erop maak ik je gebit schoon.",
      "Kleine borstel voor je tanden.",
    ] },
    { word: "vaatwasser", clues: [
      "Ik doe de afwas, maar ik heb nog nooit een theedoek vastgehouden.",
      "Ik sta in de keuken en maak borden schoon met water en zeep.",
      "Apparaat dat de vaat doet.",
    ] },
  ],

  nature: [
    { word: "maan", clues: [
      "Ik ben soms vol en soms half, maar ik eet nooit.",
      "Ik schijn 's nachts aan de hemel.",
      "Het grote ronde licht in de nacht.",
    ] },
    { word: "wolk", clues: [
      "Ik ben een schaap aan de hemel dat nooit gras eet.",
      "Ik ben wit en pluizig en drijf in de lucht.",
      "Grijze of witte pluim in de lucht.",
    ] },
    { word: "blad", clues: [
      "Ik val in de herfst, en in een boek sla je me om.",
      "Ik groei aan een tak en ben meestal groen.",
      "Plat groen dingetje aan een boom.",
    ] },
    { word: "gras", clues: [
      "Hoe vaker ze me kort knippen, hoe mooier ik word.",
      "Koeien eten me de hele dag en ik ben groen.",
      "Groene sprietjes in het weiland of op het voetbalveld.",
    ] },
    { word: "zand", clues: [
      "Ik zit overal na een dagje strand, vooral in je boterham.",
      "Ik ben korrelig en geel en je bouwt kastelen van me.",
      "Korrels op het strand.",
    ] },
    { word: "storm", clues: [
      "Ik kan in een glas water, maar meestal raas ik op zee.",
      "Ik breng harde wind en soms onweer.",
      "Heel hard waaiend weer.",
    ] },
    { word: "roos", clues: [
      "Ik ben een bloem, maar je kunt me ook als witte schilfers in je haar hebben.",
      "Ik ben een bloem met doornen.",
      "Bloem die je op Valentijnsdag geeft.",
    ] },
    { word: "dijk", clues: [
      "Zonder mij stond jij nu misschien te zwemmen.",
      "Ik ben een lange wal die het water tegenhoudt.",
      "Hoge aarden wal langs de zee of een rivier.",
    ] },
    { word: "tulp", clues: [
      "Ooit was ik meer waard dan een huis, nu sta ik in een vaas.",
      "Ik ben een bloem die in de lente uit een bol groeit.",
      "Bekende Hollandse voorjaarsbloem met een kelk.",
    ] },
    { word: "regen", clues: [
      "Ik ben de reden dat Nederlanders altijd over het weer klagen.",
      "Ik val in druppels uit de wolken.",
      "Water dat uit de lucht valt.",
    ] },
    { word: "molen", clues: [
      "Ik zwaai de hele dag met mijn armen, maar ik zeg nooit gedag.",
      "Ik sta in de polder en draai als het waait.",
      "Hoog Hollands gebouw met vier wieken.",
    ] },
    { word: "berg", clues: [
      "Klimmers bezoeken me alleen omdat ik er nu eenmaal sta.",
      "Ik ben heel hoog en heb soms sneeuw op mijn top.",
      "Heel hoge heuvel.",
    ] },
    { word: "brug", clues: [
      "Met mij loop je over het water zonder nat te worden.",
      "Ik verbind twee kanten en boten varen onder me door.",
      "Gebouwd over een rivier of gracht om over te steken.",
    ] },
    { word: "schaduw", clues: [
      "'s Middags ben ik klein, 's avonds een reus, en ik zit altijd achter je aan.",
      "Ik ben donker en je kunt me nooit pakken.",
      "Donkere vorm die je maakt in de zon.",
    ] },
    { word: "vulkaan", clues: [
      "Ik ben een berg met een heel kort lontje.",
      "Uit mijn top komen lava en rook.",
      "Berg die kan uitbarsten.",
    ] },
    { word: "eiland", clues: [
      "Ik ben omringd door water, maar ik ben geen boot.",
      "Ik ben een stuk land in de zee, zoals Texel.",
      "Land met overal water omheen.",
    ] },
    { word: "donder", clues: [
      "Ik ben de drumsolo na een flits in de lucht.",
      "Ik rommel tijdens onweer.",
      "Harde knal na de bliksem.",
    ] },
    { word: "rivier", clues: [
      "Ik ben altijd aan het rennen en kom pas tot rust in zee.",
      "Ik stroom door het land en boten varen op mij.",
      "Lang stromend water, zoals de Rijn.",
    ] },
    { word: "gracht", clues: [
      "Ik heb huizen aan twee kanten, maar ik ben geen straat.",
      "In Amsterdam varen er rondvaartboten door mij.",
      "Kanaal in de stad met bruggetjes erover.",
    ] },
    { word: "bliksem", clues: [
      "Ik sla nooit twee keer op dezelfde plek in, zeggen ze.",
      "Ik ben een felle flits tijdens onweer.",
      "Elektrische flits uit de wolken.",
    ] },
    { word: "schelp", clues: [
      "Houd me tegen je oor en ik laat je de zee horen.",
      "Je vindt me leeg en mooi op het strand.",
      "Het harde huisje van een zeediertje.",
    ] },
    { word: "regenboog", clues: [
      "Ik verschijn als de lucht klaar is met huilen, en niemand vindt ooit mijn einde.",
      "Ik heb zeven kleuren en sta als een boog in de lucht.",
      "Gekleurde boog in de lucht na een bui.",
    ] },
    { word: "woestijn", clues: [
      "Ik ben de grootste zandbak van de wereld, maar er is geen speeltuin.",
      "Ik ben droog en heet en kamelen lopen door mij.",
      "Droog gebied vol zand, zoals de Sahara.",
    ] },
    { word: "zonnebloem", clues: [
      "Ik draai mijn gezicht de hele dag naar mijn favoriete ster.",
      "Ik ben een hoge gele bloem met pitten die je kunt eten.",
      "Grote gele bloem die de zon volgt.",
    ] },
    { word: "waterval", clues: [
      "Ik maak de hele dag een duik en kom nooit boven.",
      "Bij mij stort water van een rots naar beneden.",
      "Rivier die van een klif naar beneden valt.",
    ] },
    { word: "aardbeving", clues: [
      "Als ik slecht gehumeurd ben, gaat de hele grond dansen.",
      "Ik laat huizen trillen en de grond scheuren.",
      "Het schudden van de aarde.",
    ] },
    { word: "paddenstoel", clues: [
      "Ik heb een hoed maar geen hoofd, en kabouters wonen graag onder mij.",
      "Ik groei in de herfst in het bos, soms rood met witte stippen.",
      "Een zwam met een steel en een hoed.",
    ] },
  ],

  jobs: [
    { word: "boer", clues: [
      "Mijn kantoor heeft geen dak en ruikt naar koeien.",
      "Ik verbouw gewassen en melk koeien.",
      "Hij of zij werkt op het land met dieren en een tractor.",
    ] },
    { word: "agent", clues: [
      "Ik regel het verkeer, en in films ben ik soms geheim.",
      "Ik draag een uniform en vang boeven.",
      "Politieman of politievrouw.",
    ] },
    { word: "smid", clues: [
      "Ik sla de hele dag op ijzer, zolang het heet is.",
      "Ik maak hoefijzers voor paarden.",
      "Iemand die met hamer en aambeeld ijzer vormt.",
    ] },
    { word: "imker", clues: [
      "Ik werk met duizenden collega's die allemaal kunnen steken.",
      "Ik houd bijen en oogst honing.",
      "Bijenhouder.",
    ] },
    { word: "clown", clues: [
      "Mijn werk is lachen, maar mijn schoenen zijn veel te groot.",
      "Ik heb een rode neus en werk in het circus.",
      "Grappenmaker in het circus.",
    ] },
    { word: "ober", clues: [
      "Ik loop de hele dag met volle handen, en toch krijg ik een fooi.",
      "Ik werk in een restaurant en breng het eten.",
      "Iemand die bedient in een café.",
    ] },
    { word: "kapper", clues: [
      "Ik neem iets van je af, en jij betaalt me er nog voor ook.",
      "Mijn schaar knipt rond je oren.",
      "Bij hem of haar laat je je haar knippen.",
    ] },
    { word: "piloot", clues: [
      "Mijn kantoor zit boven de wolken.",
      "Ik zeg: 'Hier spreekt uw gezagvoerder.'",
      "Iemand die een vliegtuig bestuurt.",
    ] },
    { word: "bakker", clues: [
      "Ik sta op voordat de zon dat doet, en ik kneed de hele ochtend.",
      "Ik maak brood en taart in een grote oven.",
      "Iemand die brood bakt.",
    ] },
    { word: "dokter", clues: [
      "Ik zeg altijd 'zeg eens aaa', maar ik ben geen zangleraar.",
      "Ik onderzoek je als je ziek bent.",
      "Iemand die zieke mensen beter maakt.",
    ] },
    { word: "rechter", clues: [
      "Ik ben niet links, maar ik beslis wel wie gelijk heeft.",
      "Ik draag een toga en zit in de rechtbank.",
      "Degene die in de rechtszaal het vonnis uitspreekt.",
    ] },
    { word: "acteur", clues: [
      "Ik doe de hele dag alsof, en mensen betalen om te kijken.",
      "Ik speel rollen in films en toneelstukken.",
      "Iemand die toneel speelt.",
    ] },
    { word: "visser", clues: [
      "Als ik niks vang, sta ik letterlijk achter het net.",
      "Ik vaar met een boot en gooi netten uit.",
      "Iemand die vis vangt.",
    ] },
    { word: "monteur", clues: [
      "Als je auto begint te hoesten, ben ik zijn dokter.",
      "Ik repareer auto's in een garage.",
      "Iemand die machines repareert.",
    ] },
    { word: "tuinman", clues: [
      "Mijn plannen beginnen altijd klein: als een zaadje.",
      "Ik maai gras en snoei heggen.",
      "Iemand die tuinen verzorgt.",
    ] },
    { word: "tandarts", clues: [
      "Ik ben de enige die blij is als je je mond wijd opendoet.",
      "Ik controleer je gebit en boor gaatjes.",
      "Dokter voor je tanden.",
    ] },
    { word: "schilder", clues: [
      "Ik geef huizen een nieuwe jas zonder naald en draad.",
      "Ik werk met kwast en roller.",
      "Iemand die muren verft.",
    ] },
    { word: "postbode", clues: [
      "Honden zitten me achterna, terwijl ik niks verkeerd heb gedaan.",
      "Ik breng elke dag brieven rond.",
      "Iemand die de post bezorgt.",
    ] },
    { word: "brandweerman", clues: [
      "Ik ren naar binnen als iedereen naar buiten rent.",
      "Ik rijd in een rode wagen met een ladder en een slang.",
      "Iemand die branden blust.",
    ] },
    { word: "astronaut", clues: [
      "Mijn werkreizen zijn letterlijk niet van deze wereld.",
      "Ik zweef in een ruimtestation.",
      "Iemand die naar de ruimte reist.",
    ] },
    { word: "detective", clues: [
      "Ik volg aanwijzingen voor mijn werk, net als jij nu.",
      "Ik los misdaden op met een vergrootglas.",
      "Speurder die mysteries oplost.",
    ] },
    { word: "goochelaar", clues: [
      "Ik laat dingen verdwijnen en daar krijg ik applaus voor.",
      "Ik haal konijnen uit een hoed.",
      "Iemand die toverkunstjes doet.",
    ] },
  ],

  sports: [
    { word: "fiets", clues: [
      "Ik heb een zadel, maar ik ben geen paard.",
      "Je trapt op mijn pedalen om vooruit te komen.",
      "Tweewieler waarmee je in Nederland overal naartoe gaat.",
    ] },
    { word: "judo", clues: [
      "Mijn naam betekent 'de zachte weg', maar ik gooi mensen op de mat.",
      "Een sport met banden in veel kleuren.",
      "Japanse vechtsport met worpen.",
    ] },
    { word: "doel", clues: [
      "Elke voetballer droomt van mij, en je stelt me ook voor het nieuwe jaar.",
      "De bal moet in mijn net.",
      "Het net tussen twee palen waar je in scoort.",
    ] },
    { word: "darts", clues: [
      "Op mijn bord is 180 het mooiste getal.",
      "Je gooit kleine pijltjes naar een rond bord.",
      "Pijltjes gooien als sport.",
    ] },
    { word: "beker", clues: [
      "De winnaar steekt me in de lucht en geeft me een kus.",
      "Ik ben de glimmende prijs voor de kampioen.",
      "Prijs in de vorm van een grote kop.",
    ] },
    { word: "golf", clues: [
      "Ik ben ook wat er op zee over je heen spoelt.",
      "Je slaat een klein wit balletje met een club naar een putje.",
      "Sport met holes en clubs.",
    ] },
    { word: "vlieger", clues: [
      "Ik vlieg zonder vleugels, maar alleen als jij mijn touwtje vasthoudt.",
      "Op winderige dagen dans ik in de lucht.",
      "Speelgoed van papier of stof aan een lang touw.",
    ] },
    { word: "knikker", clues: [
      "Ik ben van glas en ik rol, en op het schoolplein ben ik een schat.",
      "Kinderen schieten me in een potje.",
      "Glazen balletje om mee te spelen.",
    ] },
    { word: "zwemmen", clues: [
      "Ik ben een sport waarbij je voeten de grond nooit raken.",
      "Je doet me in het bad, met schoolslag of borstcrawl.",
      "In het water bewegen als sport.",
    ] },
    { word: "hockey", clues: [
      "Mijn stick heeft een krul, en Nederland wint vaak met mij.",
      "Ik word gespeeld met een stick en een kleine harde bal op gras.",
      "Teamsport met sticks.",
    ] },
    { word: "korfbal", clues: [
      "Ik ben een Nederlandse sport waarin jongens en meisjes samen in één team spelen.",
      "Je gooit de bal in een mand op een paal.",
      "Sport met een korf zonder bodem.",
    ] },
    { word: "puzzel", clues: [
      "Ik lig in duizend stukjes, en jij bent blij om me in elkaar te zetten.",
      "Je past mijn stukjes in één plaatje.",
      "Spel van stukjes die in elkaar passen.",
    ] },
    { word: "turnen", clues: [
      "Bij mij sta je op een balk die maar tien centimeter breed is.",
      "Ik doe salto's, de radslag en de brug.",
      "Sport met toestellen zoals ringen en balk.",
    ] },
    { word: "zeilen", clues: [
      "Ik ga sneller als het hard waait, maar ik heb geen motor.",
      "Ik vaar over het water met een doek in de wind.",
      "Varen met een zeilboot.",
    ] },
    { word: "schaken", clues: [
      "In mijn spel is de koning zwak en doet de koningin al het werk.",
      "Je speelt me op 64 zwarte en witte vakjes.",
      "Bordspel met een koning, dame en paarden.",
    ] },
    { word: "voetbal", clues: [
      "In mijn sport mag maar één speler de bal met zijn handen pakken.",
      "Twee teams schoppen een bal en proberen te scoren.",
      "Sport met elf spelers en een ronde bal.",
    ] },
    { word: "schaatsen", clues: [
      "Ik ben een sport waarbij je op messen loopt.",
      "De Elfstedentocht is mijn grootste feest.",
      "Over het ijs glijden met ijzers onder je voeten.",
    ] },
    { word: "dobbelsteen", clues: [
      "Ik zit vol stippen en elke worp van mij is een gok.",
      "Ik heb zes kanten en je gooit me bij bordspellen.",
      "Kubusje met één tot zes ogen.",
    ] },
    { word: "medaille", clues: [
      "Elk verhaal heeft twee kanten, en ik ook: een voorkant en een keerzijde.",
      "Ik ben van goud, zilver of brons.",
      "Prijs die je om je nek krijgt.",
    ] },
    { word: "marathon", clues: [
      "Ik ben genoemd naar een Grieks stadje en een heel moe boodschapper.",
      "Hardloopwedstrijd van ruim 42 kilometer.",
      "Heel lange hardloopwedstrijd.",
    ] },
    { word: "basketbal", clues: [
      "In mijn sport scoor je in iets zonder bodem.",
      "Spelers stuiteren een oranje bal en gooien naar een ring.",
      "Sport met een ring en een netje.",
    ] },
    { word: "skateboard", clues: [
      "Ik ben een plankje dat jij laat vliegen bij een ollie.",
      "Met mij doe je trucjes in een skatepark.",
      "Plank met vier wieltjes.",
    ] },
  ],

  music: [
    { word: "trom", clues: [
      "Ik werk alleen als je me slaat, en ik klaag nooit.",
      "Ik ben rond en je slaat op me met stokken.",
      "Instrument waar je op slaat.",
    ] },
    { word: "piano", clues: [
      "Mijn naam betekent 'zacht' in het Italiaans, maar ik kan heel hard.",
      "Je drukt op mijn zwarte en witte toetsen.",
      "Groot toetseninstrument.",
    ] },
    { word: "fluit", clues: [
      "Ook de scheidsrechter heeft me nodig, maar hij speelt er geen liedje op.",
      "Ik ben een buis met gaatjes en je blaast op me.",
      "Dun blaasinstrument.",
    ] },
    { word: "harp", clues: [
      "Engelen worden vaak met mij in hun armen geschilderd.",
      "Ik heb heel veel snaren en je tokkelt op me.",
      "Groot driehoekig snaarinstrument.",
    ] },
    { word: "koor", clues: [
      "Ik ben veel stemmen die klinken als één.",
      "Wij zingen samen in een kerk of op school.",
      "Groep zangers.",
    ] },
    { word: "lied", clues: [
      "Vogels hebben me zonder ooit op muziekles te gaan.",
      "Ik heb een melodie en tekst, en je zingt me.",
      "Muziek met woorden die je zingt.",
    ] },
    { word: "noot", clues: [
      "Ik sta op de notenbalk, maar een eekhoorn wil me opeten.",
      "Ik ben een zwart bolletje met een stokje op papier.",
      "Eén muzikale toon op papier.",
    ] },
    { word: "viool", clues: [
      "Ik zit onder iemands kin en huil prachtig als hij strijkt.",
      "Je speelt me met een strijkstok.",
      "Klein snaarinstrument.",
    ] },
    { word: "ritme", clues: [
      "Ik zit in je voeten als je meetikt.",
      "Ik ben de beat van de muziek.",
      "Patroon van tellen in muziek.",
    ] },
    { word: "orgel", clues: [
      "In de kerk adem ik door honderd pijpen.",
      "Ik ben een groot instrument met pedalen en pijpen.",
      "Kerkinstrument met pijpen.",
    ] },
    { word: "gitaar", clues: [
      "Elke rockster drukt me tegen zijn buik.",
      "Je tokkelt akkoorden op me.",
      "Snaarinstrument met een lange hals.",
    ] },
    { word: "trompet", clues: [
      "Olifanten doen mij na met hun slurf.",
      "Ik ben een glimmend koperen instrument met drie knopjes.",
      "Hard koperen blaasinstrument.",
    ] },
    { word: "concert", clues: [
      "Ik ben een feest waar iedereen dezelfde kant op kijkt.",
      "Een band speelt live op een podium.",
      "Optreden met live muziek.",
    ] },
    { word: "melodie", clues: [
      "Ik ben het stukje van een lied dat je niet meer uit je hoofd krijgt.",
      "Een rij tonen die mooi klinkt.",
      "De wijs van een liedje.",
    ] },
    { word: "zanger", clues: [
      "Mijn instrument is altijd bij me, want het zit in mijn keel.",
      "Ik sta vooraan in de band met een microfoon.",
      "Iemand die zingt.",
    ] },
    { word: "akkoord", clues: [
      "Ik ben drie tonen tegelijk, en ook wat je zegt als je het eens bent.",
      "Op een gitaar speel je mij op meerdere snaren tegelijk.",
      "Samenklank van tonen.",
    ] },
    { word: "orkest", clues: [
      "Wij zijn met honderd en volgen allemaal iemand die met een stokje zwaait.",
      "Een groep met violen, fluiten en pauken.",
      "Grote groep klassieke muzikanten.",
    ] },
    { word: "dirigent", clues: [
      "Ik leid zonder één woord te zeggen, met mijn rug naar het publiek.",
      "Ik sta voor het orkest met een stokje.",
      "Leider van een orkest.",
    ] },
    { word: "saxofoon", clues: [
      "Ik ben van koper, maar ik hoor bij de houtblazers.",
      "Gebogen instrument uit de jazz.",
      "Jazzinstrument, genoemd naar meneer Sax.",
    ] },
    { word: "microfoon", clues: [
      "Ik maak je luider, en stoere mensen laten me vallen als ze klaar zijn.",
      "Zangers houden me voor hun mond.",
      "Ding dat je stem harder maakt.",
    ] },
    { word: "koptelefoon", clues: [
      "Ik laat je muziek horen zonder dat je hem met iemand deelt.",
      "Je draagt me over je oren.",
      "Kleine luidsprekers voor je oren.",
    ] },
    { word: "xylofoon", clues: [
      "In elk alfabetboek ben ik de enige die bij mijn letter past.",
      "Ik heb houten staafjes waar je met hamertjes op slaat.",
      "Instrument met een rij staafjes.",
    ] },
    { word: "accordeon", clues: [
      "Ik moet steeds in- en uitademen, maar ik heb geen longen.",
      "Je trekt me uit elkaar en duwt me weer in, met knopjes.",
      "Instrument dat ook trekzak heet.",
    ] },
  ],

  clothing: [
    { word: "sjaal", clues: [
      "Supporters zwaaien met mij in de clubkleuren.",
      "Ik ben lang en wollig en houd je nek warm.",
      "Lange lap stof voor om je nek.",
    ] },
    { word: "klomp", clues: [
      "Ik ben een schoen, maar ik groeide eerst aan een boom.",
      "Boeren liepen vroeger op mij door de modder.",
      "Houten schoen uit Nederland.",
    ] },
    { word: "jurk", clues: [
      "Prinsessen dragen me naar het bal.",
      "Ik ben een kledingstuk met een rok eraan vast.",
      "Kleding uit één stuk, vaak voor feestjes.",
    ] },
    { word: "riem", clues: [
      "Als het krap wordt, moet je me aanhalen.",
      "Ik zit door de lussen van je broek.",
      "Band om je middel.",
    ] },
    { word: "muts", clues: [
      "Ik ben ook wat je zegt tegen iemand die een beetje suf doet.",
      "Ik ben warm en wollig en zit op je hoofd.",
      "Wollen hoofddeksel voor de winter.",
    ] },
    { word: "laars", clues: [
      "Een kat uit een sprookje werd beroemd omdat hij ons droeg.",
      "Ik ben een hoge schoen voor regen of sneeuw.",
      "Hoge rubberen schoen.",
    ] },
    { word: "broek", clues: [
      "Ik heb twee pijpen, maar er komt nooit water uit.",
      "Je trekt me aan over je benen.",
      "Kleding voor je benen, zoals een jeans.",
    ] },
    { word: "rits", clues: [
      "Ik heb twee rijen tanden die alleen samenkomen als je aan me trekt.",
      "Ik maak je jas of tas dicht.",
      "Metalen tandjes die openen en sluiten.",
    ] },
    { word: "trui", clues: [
      "Wie mij in het geel draagt, leidt de Tour de France.",
      "Ik ben warm en gebreid met lange mouwen.",
      "Wollen kledingstuk voor je bovenlijf.",
    ] },
    { word: "helm", clues: [
      "Ik ben een hoed met een heel serieus beroep.",
      "Je draagt me op de fiets of de brommer.",
      "Harde bescherming voor je hoofd.",
    ] },
    { word: "pyjama", clues: [
      "Ik ben de outfit die alleen je familie en je dromen zien.",
      "Je trekt me aan voor je naar bed gaat.",
      "Kleding om in te slapen.",
    ] },
    { word: "schort", clues: [
      "Ik vang alle vlekken op, zodat jouw kleren dat niet hoeven.",
      "Je knoopt me om als je kookt.",
      "Lap die je voor je kleren draagt in de keuken.",
    ] },
    { word: "uniform", clues: [
      "Ik maak iedereen expres hetzelfde.",
      "Agenten en verpleegkundigen dragen mij.",
      "Kleding die bij een beroep hoort.",
    ] },
    { word: "badpak", clues: [
      "Ik ben de enige outfit die blij is als hij nat wordt.",
      "Je draagt me in het zwembad.",
      "Zwemkleding uit één stuk.",
    ] },
    { word: "sandaal", clues: [
      "Ik ben een schoen met meer gaten dan stof.",
      "Je draagt me in de zomer met blote tenen.",
      "Open zomerschoen met bandjes.",
    ] },
    { word: "kostuum", clues: [
      "Op een verkleedfeest ben ik een piraat of een prinses.",
      "Ik ben een verkleedpak voor carnaval of toneel.",
      "Pak om je in te verkleden.",
    ] },
    { word: "ketting", clues: [
      "Ik ben een rij schakels, zo sterk als de zwakste van ons.",
      "Ik ben een sieraad om je nek.",
      "Halssieraad van schakels of kralen.",
    ] },
    { word: "pantoffel", clues: [
      "Wie eronder zit, heeft thuis niet veel te zeggen.",
      "Ik ben een zachte schoen voor binnen.",
      "Warme slof voor in huis.",
    ] },
    { word: "handschoen", clues: [
      "Een ridder gooide me op de grond om iemand uit te dagen.",
      "In de winter houd ik je hand warm.",
      "Wat je aan je hand draagt als het koud is.",
    ] },
    { word: "regenjas", clues: [
      "Ik ben de enige jas die van slecht weer houdt.",
      "Ik ben waterdicht en vaak geel.",
      "Jas voor als het regent.",
    ] },
    { word: "stropdas", clues: [
      "Op kantoor knoop je me elke ochtend om, en op vrijdag mag ik thuisblijven.",
      "Ik ben een lange smalle lap die je onder je kraag strikt.",
      "Das voor bij een net pak.",
    ] },
    { word: "zonnebril", clues: [
      "Ik maak de wereld donkerder en jou cooler.",
      "Je draagt me op je neus als de zon fel schijnt.",
      "Donkere bril tegen de zon.",
    ] },
    { word: "spijkerbroek", clues: [
      "Er zit geen spijker in mij, wel heel veel klinknagels.",
      "Ik ben een blauwe broek van stevige stof.",
      "Jeans.",
    ] },
  ],

  science: [
    { word: "atoom", clues: [
      "Ik ben piepklein, maar alles is van mij gemaakt, jij ook.",
      "Ik heb protonen, neutronen en elektronen.",
      "Kleinste deeltje van een stof.",
    ] },
    { word: "brein", clues: [
      "Ik ben de baas in je hoofd, en ik denk nu na over dit raadsel.",
      "Ik ben grijs en gerimpeld en stuur je lichaam aan.",
      "Je hersenen.",
    ] },
    { word: "hart", clues: [
      "Ik sta op elke Valentijnskaart, maar in het echt zie ik er heel anders uit.",
      "Ik pomp bloed door je lichaam.",
      "Orgaan dat klopt in je borst.",
    ] },
    { word: "laser", clues: [
      "Katten jagen op mijn rode stipje.",
      "Ik ben een heel rechte, sterke lichtstraal.",
      "Smalle bundel licht.",
    ] },
    { word: "robot", clues: [
      "Ik doe alles wat je zegt en ik word nooit moe of verveeld.",
      "Ik ben een machine die zelf kan bewegen en werken.",
      "Machine die werkt als een mens.",
    ] },
    { word: "ster", clues: [
      "Ik ben eigenlijk een zon, maar ik lijk piepklein omdat ik zo ver weg ben.",
      "Ik twinkel 's nachts aan de hemel.",
      "Lichtpuntje aan de nachthemel.",
    ] },
    { word: "bloed", clues: [
      "Ik ben dikker dan water, zegt het spreekwoord.",
      "Ik ben rood en stroom door je aderen.",
      "Rode vloeistof in je lichaam.",
    ] },
    { word: "raket", clues: [
      "Ik vertrek met vuur onder mijn staart en kijk nooit om.",
      "Ik breng astronauten de ruimte in.",
      "Ruimtevoertuig met motoren.",
    ] },
    { word: "muis", clues: [
      "Ik heb een staart, maar ik eet geen kaas: ik woon naast je toetsenbord.",
      "Mijn naamgenoot piept en houdt wel van kaas.",
      "Klein dier met een lange staart, of het ding waarmee je klikt.",
    ] },
    { word: "komeet", clues: [
      "Ik bezoek de zon met mijn lange haren wapperend achter me aan.",
      "Ik ben een ijsbal met een gloeiende staart in de ruimte.",
      "Ijzige ruimterots met een staart.",
    ] },
    { word: "magneet", clues: [
      "Ik ben heel aantrekkelijk, maar alleen voor metaal.",
      "Ik plak op de koelkast.",
      "Stuk ijzer dat ander metaal aantrekt.",
    ] },
    { word: "fossiel", clues: [
      "Ik ben ouder dan oud en wacht al miljoenen jaren in de steen.",
      "Ik ben wat er van een dinosaurus over is in steen.",
      "Versteende resten van een oud dier.",
    ] },
    { word: "planeet", clues: [
      "Ik draai altijd rondjes, maar niemand zegt dat ik verdwaald ben.",
      "Mars en Jupiter zijn voorbeelden van mij.",
      "Grote bol die om een ster draait.",
    ] },
    { word: "skelet", clues: [
      "Ik zit altijd in je, en zonder mij zak je in elkaar.",
      "Ik besta uit 206 botten.",
      "Alle botten van je lichaam samen.",
    ] },
    { word: "kompas", clues: [
      "Ik weet altijd waar het noorden is, maar ik ben nog nooit ergens geweest.",
      "Mijn naald helpt verdwaalde wandelaars.",
      "Ding met een magnetische naald om de richting te vinden.",
    ] },
    { word: "batterij", clues: [
      "Ik zit altijd vol energie, tot ik ineens leeg ben.",
      "Ik geef stroom aan je afstandsbediening.",
      "Iets dat elektriciteit opslaat.",
    ] },
    { word: "zuurstof", clues: [
      "Je ziet me niet en je ruikt me niet, maar zonder mij leef je niet.",
      "Bomen maken me en jij ademt me in.",
      "Gas dat we nodig hebben om te ademen.",
    ] },
    { word: "computer", clues: [
      "Vroeger was ik zo groot als een kamer, nu pas ik op je schoot.",
      "Ik heb een scherm, een toetsenbord en een muis.",
      "Machine voor programma's en internet.",
    ] },
    { word: "zwaartekracht", clues: [
      "Een vallende appel leerde een beroemde wetenschapper alles over mij.",
      "Ik trek alles naar de aarde toe.",
      "De kracht die dingen laat vallen.",
    ] },
    { word: "telescoop", clues: [
      "Ik haal de sterren dichterbij zonder ze te verplaatsen.",
      "Je kijkt door mij naar de planeten.",
      "Kijker voor dingen die heel ver weg zijn.",
    ] },
    { word: "microscoop", clues: [
      "Ik maak de kleinste dingen zo groot als reuzen.",
      "Wetenschappers bekijken cellen met mij.",
      "Apparaat om heel kleine dingen te zien.",
    ] },
    { word: "dinosaurus", clues: [
      "Ik leefde lang voor de opa van je opa, en mijn naam betekent 'verschrikkelijke hagedis'.",
      "Ik was een reuzenreptiel dat lang geleden uitstierf.",
      "Een T. rex is er een van.",
    ] },
    { word: "thermometer", clues: [
      "Ik ga omhoog als je koorts hebt en omlaag als het vriest.",
      "Ik laat zien hoe warm of koud het is.",
      "Meter voor de temperatuur.",
    ] },
  ],

  countries: [
    { word: "china", clues: [
      "Het mooiste servies van je oma heet in het Engels naar mij.",
      "Ik heb een Grote Muur en panda's.",
      "Groot Aziatisch land, hoofdstad Peking.",
    ] },
    { word: "japan", clues: [
      "Ik besta uit duizenden eilanden, en de zon gaat op in mijn vlag.",
      "Sushi en supersnelle treinen komen uit mij.",
      "Eilandenrijk met hoofdstad Tokio.",
    ] },
    { word: "chili", clues: [
      "Ik klink als een pittige peper, maar ik ben heel lang en dun.",
      "Ik lig tussen de Andes en de Grote Oceaan.",
      "Lang Zuid-Amerikaans land, hoofdstad Santiago.",
    ] },
    { word: "peru", clues: [
      "Een beroemde beer met een rood hoedje en marmeladeboterhammen komt uit mij.",
      "Machu Picchu ligt in mijn bergen.",
      "Zuid-Amerikaans land met hoofdstad Lima.",
    ] },
    { word: "cuba", clues: [
      "Ik ben een eiland in de vorm van een krokodil, vlak bij Florida.",
      "Ik ben bekend om salsa en oude Amerikaanse auto's.",
      "Eiland in de Caraïben met hoofdstad Havana.",
    ] },
    { word: "india", clues: [
      "Columbus zocht mij en vond per ongeluk Amerika.",
      "De Taj Mahal staat in mij.",
      "Groot Aziatisch land met hoofdstad New Delhi.",
    ] },
    { word: "kenia", clues: [
      "Hardlopers uit mij winnen bijna elke grote marathon.",
      "Op mijn savannes lopen leeuwen, olifanten en giraffen.",
      "Oost-Afrikaans land met hoofdstad Nairobi.",
    ] },
    { word: "polen", clues: [
      "Ik klink als de uiteinden van de aarde, maar ik lig gewoon in Europa.",
      "Ik lig ten oosten van Duitsland.",
      "Land met hoofdstad Warschau.",
    ] },
    { word: "egypte", clues: [
      "Mijn oude koningen werden begraven onder enorme driehoeken.",
      "De Nijl stroomt door mij.",
      "Afrikaans land met de piramides.",
    ] },
    { word: "spanje", clues: [
      "Elk jaar vertrekt er een stoomboot uit mij met een man met een lange baard.",
      "Ik ben bekend om flamenco en paella.",
      "Land met hoofdstad Madrid.",
    ] },
    { word: "rusland", clues: [
      "Ik ben zo groot dat ik elf tijdzones heb.",
      "Ik heb het Kremlin en matroesjkapoppetjes.",
      "Het grootste land ter wereld, hoofdstad Moskou.",
    ] },
    { word: "turkije", clues: [
      "In Amerika eten ze met Thanksgiving een vogel met mijn Engelse naam.",
      "Istanbul ligt in mij, op twee werelddelen.",
      "Land tussen Europa en Azië, hoofdstad Ankara.",
    ] },
    { word: "canada", clues: [
      "Ik heb meer meren dan de rest van de wereld bij elkaar.",
      "Ik ben het grote land boven de Verenigde Staten, met een esdoornblad op mijn vlag.",
      "Land met hoofdstad Ottawa.",
    ] },
    { word: "ijsland", clues: [
      "Mijn naam is koud, maar ik zit vol hete bronnen en vulkanen.",
      "Ik ben een eiland vlak bij de poolcirkel, met geisers.",
      "Eilandstaat met hoofdstad Reykjavik.",
    ] },
    { word: "ierland", clues: [
      "Op mijn feestdag in maart kleedt de hele wereld zich in het groen.",
      "Ik ben een groen eiland vol klavertjes.",
      "Eiland met hoofdstad Dublin.",
    ] },
    { word: "mexico", clues: [
      "Mijn bekendste hoed is zo breed als een parasol.",
      "Taco's en burrito's komen uit mij.",
      "Land ten zuiden van de Verenigde Staten.",
    ] },
    { word: "frankrijk", clues: [
      "Mijn hoofdstad heeft een ijzeren dame van ruim 300 meter.",
      "Croissants en stokbrood komen uit mij.",
      "Land met hoofdstad Parijs.",
    ] },
    { word: "noorwegen", clues: [
      "Mijn naam klinkt als de route naar het noorden.",
      "Ik heb fjorden en de middernachtzon.",
      "Scandinavisch land met hoofdstad Oslo.",
    ] },
    { word: "portugal", clues: [
      "Grote ontdekkingsreizigers voeren weg van mijn kust aan de rand van Europa.",
      "Ik lig naast Spanje en ben bekend om pasteitjes met room.",
      "Land met hoofdstad Lissabon.",
    ] },
    { word: "schotland", clues: [
      "Er zou een monster zwemmen in een van mijn meren.",
      "Kilts en doedelzakken komen uit mij.",
      "Deel van Groot-Brittannië, hoofdstad Edinburgh.",
    ] },
    { word: "zwitserland", clues: [
      "Ik ben beroemd om kaas met gaten, en ik kies nooit partij.",
      "Ik heb de Alpen, chocolade en horloges.",
      "Land met hoofdstad Bern.",
    ] },
    { word: "griekenland", clues: [
      "De allereerste Olympische Spelen werden in mij gehouden.",
      "Ik heb duizenden eilanden en de Akropolis.",
      "Land met hoofdstad Athene.",
    ] },
    { word: "denemarken", clues: [
      "De legosteentjes zijn in mij uitgevonden.",
      "Ik ben het kleine land boven Duitsland, met een kleine zeemeermin.",
      "Land met hoofdstad Kopenhagen.",
    ] },
    { word: "nederland", clues: [
      "Een groot deel van mij ligt onder de zeespiegel, en dat zeg ik ook in mijn naam.",
      "Tulpen, molens en overal fietsen.",
      "Land met hoofdstad Amsterdam.",
    ] },
    { word: "engeland", clues: [
      "Ik heb het voetbal uitgevonden, maar ik win er zelden iets mee.",
      "De Big Ben staat in mijn hoofdstad.",
      "Land met hoofdstad Londen.",
    ] },
  ],

  mystery: [
    { word: "echo", clues: [
      "Ik ben de enige in de bergen die het altijd met je eens is.",
      "Roep in een grot en ik roep terug.",
      "Geluid dat terugkaatst.",
    ] },
    { word: "droom", clues: [
      "Ik ben een film die elke nacht draait, en jij speelt altijd de hoofdrol.",
      "Ik gebeur terwijl je slaapt.",
      "Plaatjes in je hoofd tijdens het slapen.",
    ] },
    { word: "idee", clues: [
      "Als ik kom, gaat er een lampje bij je branden.",
      "Ik ben een gedachte die ineens opkomt.",
      "Een nieuw plan of een inval.",
    ] },
    { word: "tijd", clues: [
      "Ik vlieg als je plezier hebt en kruip als je moet wachten.",
      "Klokken meten mij.",
      "Uren, minuten en seconden.",
    ] },
    { word: "geluk", clues: [
      "Een klavertje vier brengt mij, zeggen ze.",
      "Je hebt me nodig als je dobbelt.",
      "Het tegenovergestelde van pech.",
    ] },
    { word: "spook", clues: [
      "Ik loop door muren heen, maar niemand heeft me ooit echt gezien.",
      "Ik zeg boe en draag een wit laken.",
      "Eng wit figuur dat in oude kastelen rondwaart.",
    ] },
    { word: "lach", clues: [
      "Ik ben gratis, en wie mij krijgt, geeft me meestal meteen terug.",
      "Ik verschijn op je gezicht als iets grappig is.",
      "Wat je doet als je blij bent: haha.",
    ] },
    { word: "schat", clues: [
      "Een kruis op de kaart wijst aan waar ik lig, en zo noem je ook iemand van wie je houdt.",
      "Piraten begraven mij in een kist.",
      "Verborgen goud en juwelen.",
    ] },
    { word: "geheim", clues: [
      "Bewaar mij, en je bent een echte vriend.",
      "Je fluistert me en belooft het aan niemand te vertellen.",
      "Iets wat alleen jij weet.",
    ] },
    { word: "stilte", clues: [
      "Ze zeggen dat ik goud waard ben, maar niemand kan me horen.",
      "Dat vraagt de bibliotheek van je.",
      "Als er helemaal geen geluid is.",
    ] },
    { word: "belofte", clues: [
      "Ik ben het belangrijkste werk dat een pink ooit doet.",
      "Erewoord! Je doet me als je het echt meent.",
      "Zeggen dat je iets echt gaat doen.",
    ] },
    { word: "roddel", clues: [
      "Ik reis het snelst als je zegt dat ik aan niemand verteld mag worden.",
      "Ik ben gepraat over anderen achter hun rug.",
      "Kletspraatje over andermans zaken.",
    ] },
    { word: "raadsel", clues: [
      "Je bent er nu eentje van mij aan het oplossen.",
      "Ik ben een lastige vraag met een slim antwoord.",
      "Puzzelvraag.",
    ] },
    { word: "toeval", clues: [
      "Door mij kwam je je beste vriend tegen, maar niemand heeft me gepland.",
      "Iets wat zomaar gebeurt, zonder dat iemand het bedacht.",
      "Niet gepland, puur geluk of pech.",
    ] },
    { word: "wachtwoord", clues: [
      "Zeg me goed en de deur gaat open, zeg me fout en je blijft buiten.",
      "Houd me geheim, en gebruik alsjeblieft nooit 1234.",
      "Geheim woord dat je intypt om in te loggen.",
    ] },
    { word: "verjaardag", clues: [
      "Ik kom één keer per jaar, en hoe ouder je wordt, hoe meer kaarsjes ik nodig heb.",
      "Op mij krijg je cadeautjes en taart.",
      "De dag waarop je geboren bent, elk jaar weer.",
    ] },
    { word: "nachtmerrie", clues: [
      "Ik ben een vrouwtjespaard dat alleen 's nachts langskomt.",
      "Ik laat je midden in de nacht bang wakker worden.",
      "Heel enge droom.",
    ] },
    { word: "verrassing", clues: [
      "Als je weet dat ik kom, ben ik al verpest.",
      "Een feestje waar niemand je over vertelde.",
      "Iets wat je niet verwacht.",
    ] },
    { word: "voetstappen", clues: [
      "In de sneeuw verklappen wij waar je bent geweest.",
      "Wij zijn het geluid van iemand die loopt.",
      "Afdrukken of geluiden van lopende voeten.",
    ] },
    { word: "vakantie", clues: [
      "Ik ben de reden dat koffers blij worden.",
      "Vrije dagen van school, vaak aan het strand.",
      "Tijd vrij om op reis te gaan.",
    ] },
  ],

  winter: [
    { word: "iglo", clues: [
      "Ik ben een huis dat smelt als je de verwarming aanzet.",
      "Ik ben een koepel van blokken sneeuw.",
      "Huis van sneeuw.",
    ] },
    { word: "ijspegel", clues: [
      "Ik groei naar beneden aan de dakgoot, en ik huil als de zon komt.",
      "Ik ben een puntig stuk ijs dat aan het dak hangt.",
      "Hangende ijspunt.",
    ] },
    { word: "slee", clues: [
      "Ik heb sneeuw nodig in plaats van wegen, en sommigen van mij vliegen door de lucht.",
      "Kinderen glijden met mij van een heuvel af.",
      "Voertuigje met glijders voor in de sneeuw.",
    ] },
    { word: "wanten", clues: [
      "Wij houden je vingers bij elkaar als beste vrienden, alleen je duim krijgt een eigen kamer.",
      "Wij zijn warm en wollig en gaan om je handen.",
      "Handschoenen zonder losse vingers.",
    ] },
    { word: "schoorsteen", clues: [
      "Ik ben de enige deur die de Kerstman gebruikt.",
      "De rook gaat door mij het dak uit.",
      "Pijp op het dak voor de rook.",
    ] },
    { word: "sneeuwpop", clues: [
      "Ik sta de hele winter buiten zonder jas, en de zon is mijn grootste vijand.",
      "Kinderen rollen mij van drie grote ballen.",
      "Een figuur van sneeuw met een wortel als neus.",
    ] },
    { word: "sneeuwbal", clues: [
      "Ik ben rond en koud en ik begin elke wintergevecht.",
      "Je maakt me met je handen en gooit me.",
      "Een bal van sneeuw.",
    ] },
    { word: "rendier", clues: [
      "Ik ben een hert, en één van ons heeft een glimmende rode neus.",
      "Ik trek de slee van de Kerstman.",
      "Hert met een groot gewei uit het hoge noorden.",
    ] },
    { word: "openhaard", clues: [
      "Ik eet de hele avond houtblokken en houd iedereen warm.",
      "Je zit voor me en kijkt naar de vlammen.",
      "Plek in de muur voor een vuurtje.",
    ] },
    { word: "sneeuwvlok", clues: [
      "Er zijn geen twee van mij hetzelfde, en ik smelt op je tong.",
      "Ik ben een piepklein ijssterretje met zes punten.",
      "Eén klein stukje vallende sneeuw.",
    ] },
    { word: "rijp", clues: [
      "Ik ben ook wat fruit is als het klaar is om te eten, maar ik maak het gras wit.",
      "'s Ochtends maak ik takjes en gras wit en knisperig.",
      "Witte ijsaanslag op koude ochtenden.",
    ] },
    { word: "kerstboom", clues: [
      "Ik sta één maand per jaar binnen, en dan hangen ze ballen aan me.",
      "Onder mij liggen de cadeautjes.",
      "Versierde den in de kamer in december.",
    ] },
  ],
};
