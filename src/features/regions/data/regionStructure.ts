export interface SubregionItemData {
  id: string
  label: string
  categoryKey: string
  subItems?: SubregionItemData[]
}

export interface RegionGroupData {
  continent: string
  items: SubregionItemData[]
}

export const REGION_STRUCTURE: RegionGroupData[] = [
  {
    continent: "Africa",
    items: [
      { id: "west-africa", label: "West Africa", categoryKey: "West Africa" },
      { id: "south-africa", label: "Southern Africa", categoryKey: "Southern Africa" },
      { id: "north-africa", label: "North Africa", categoryKey: "North Africa" },
      { id: "east-africa", label: "East Africa", categoryKey: "East Africa" },
      { id: "central-africa", label: "Central Africa", categoryKey: "Central Africa" },
    ],
  },
  {
    continent: "Asia",
    items: [
      {
        id: "south-asia",
        label: "South Asia",
        categoryKey: "South Asia",
        subItems: [
          { id: "north-india-punjab", label: "North India & Punjab", categoryKey: "North India & Punjab" },
          { id: "south-india-dravida", label: "South India (Dravida)", categoryKey: "South India" },
          { id: "west-india-maharashtra", label: "West India (Maharashtra & Gujarat)", categoryKey: "West India" },
          { id: "east-northeast-india", label: "East & Northeast India (Bengal & Assam)", categoryKey: "East & Northeast India" },
          { id: "central-gangetic", label: "Central & Gangetic Plains", categoryKey: "Central & Gangetic Plains" },
          { id: "pakistan-northwest", label: "Pakistan & Northwest", categoryKey: "Pakistan & Northwest" },
        ],
      },
      { id: "east-asia", label: "East Asia", categoryKey: "East Asia" },
      { id: "southeast-asia", label: "Southeast Asia", categoryKey: "Southeast Asia" },
      { id: "central-asia", label: "Central Asia", categoryKey: "Central Asia" },
      { id: "west-asia", label: "West Asia (Middle East)", categoryKey: "West Asia" },
    ],
  },
  {
    continent: "Europe",
    items: [
      { id: "western-europe", label: "Western Europe", categoryKey: "Europe" },
      { id: "nordic-europe", label: "Nordic & Scandinavian Europe", categoryKey: "Europe" },
      { id: "southern-europe", label: "Southern Europe & Mediterranean", categoryKey: "Europe" },
      { id: "eastern-europe", label: "Eastern Europe & Balkans", categoryKey: "Europe" },
      { id: "celtic-isles", label: "Celtic Isles (Ireland/Scotland)", categoryKey: "Celtic" },
    ],
  },
  {
    continent: "North America",
    items: [
      { id: "us-deep-south", label: "US Deep South & Delta", categoryKey: "Blues" },
      { id: "us-appalachia", label: "Appalachia & Country", categoryKey: "Country" },
      { id: "us-urban-east-west", label: "US Urban East/West Coast", categoryKey: "Hip-Hop" },
      { id: "canada-nordic", label: "Canada & Northern Coast", categoryKey: "North America" },
    ],
  },
  {
    continent: "South America",
    items: [
      { id: "brazil-atlantic", label: "Brazil (Atlantic Coast)", categoryKey: "Samba" },
      { id: "andean-region", label: "Andean Region (Peru, Bolivia)", categoryKey: "Cumbia" },
      { id: "rio-de-la-plata", label: "Río de la Plata (Argentina, Uruguay)", categoryKey: "Tango" },
    ],
  },
  {
    continent: "Caribbean",
    items: [
      { id: "greater-antilles", label: "Greater Antilles (Jamaica, Cuba, PR)", categoryKey: "Reggae" },
      { id: "lesser-antilles", label: "Lesser Antilles & Trinidad", categoryKey: "Soca" },
    ],
  },
  {
    continent: "Oceania",
    items: [
      { id: "indigenous-australia", label: "Indigenous Australia & Bush", categoryKey: "Indigenous" },
      { id: "polynesia-maori", label: "Polynesia & Māori (NZ)", categoryKey: "Māori" },
    ],
  },
]
