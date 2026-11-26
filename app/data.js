// All data from World Bank WDI (wb_summary.json), 2015-2024 series for Indonesia + 2024 ASEAN peers.
// This is the ONLY data source for figures. Copy numbers EXACTLY. Never invent a figure.

export const INDICATORS = {
  // Economy
  'gdp': {
    id: 'gdp',
    code: 'NY.GDP.MKTP.CD',
    name: 'GDP (current US$)',
    shortName: 'GDP',
    category: 'Economy',
    unit: 'US$ billions',
    format: 'currency',
    description: 'Gross domestic product at purchaser\'s prices in current U.S. dollars.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 860.854232686214,
      2016: 931.877364037698,
      2017: 1015.61874415973,
      2018: 1042.27153298863,
      2019: 1119.0998713502,
      2020: 1059.05484269848,
      2021: 1186.50969108673,
      2022: 1319.10118338015,
      2023: 1371.16692574988,
      2024: 1396.30178846169
    }
  },
  'gdp-growth': {
    id: 'gdp-growth',
    code: 'NY.GDP.MKTP.KD.ZG',
    name: 'GDP growth (annual %)',
    shortName: 'GDP Growth',
    category: 'Economy',
    unit: '%',
    format: 'percent',
    description: 'Annual percentage growth rate of GDP at market prices based on constant local currency.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 4.87632230022123,
      2016: 5.03306918280177,
      2017: 5.06978590134916,
      2018: 5.17429153955024,
      2019: 5.01928768046282,
      2020: -2.06551182934165,
      2021: 3.70288562827751,
      2022: 5.30719722664799,
      2023: 5.04883117855516,
      2024: 5.03257477088519
    }
  },
  'gdp-per-capita': {
    id: 'gdp-per-capita',
    code: 'NY.GDP.PCAP.CD',
    name: 'GDP per capita (current US$)',
    shortName: 'GDP per Capita',
    category: 'Economy',
    unit: 'US$',
    format: 'currency',
    description: 'GDP divided by midyear population.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 3288.22269725538,
      2016: 3521.46943457574,
      2017: 3798.88326174526,
      2018: 3860.95353090726,
      2019: 4106.94856160358,
      2020: 3853.70288774146,
      2021: 4287.17313995098,
      2022: 4730.83484836107,
      2023: 4876.2992959843,
      2024: 4925.43644992666
    }
  },
  'inflation': {
    id: 'inflation',
    code: 'FP.CPI.TOTL.ZG',
    name: 'Inflation, consumer prices (annual %)',
    shortName: 'Inflation (CPI)',
    category: 'Economy',
    unit: '%',
    format: 'percent',
    description: 'Annual percentage change in the cost to the average consumer of acquiring a basket of goods and services.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 6.36312061196646,
      2016: 3.52580452815451,
      2017: 3.80879857691948,
      2018: 3.19834755924996,
      2019: 3.0305846094166,
      2020: 1.91983527270792,
      2021: 1.56007882983334,
      2022: 4.20946463714784,
      2023: 3.66938654859761,
      2024: 2.18151273615188
    }
  },
  'exports': {
    id: 'exports',
    code: 'NE.EXP.GNFS.ZS',
    name: 'Exports of goods and services (% of GDP)',
    shortName: 'Exports (% GDP)',
    category: 'Trade',
    unit: '% of GDP',
    format: 'percent',
    description: 'Value of all goods and other market services provided to the rest of the world as a share of GDP.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 21.1601792598059,
      2016: 19.0889938536664,
      2017: 20.1773044351106,
      2018: 21.0027464972455,
      2019: 18.5915277970883,
      2020: 17.3311682848923,
      2021: 21.4165556390653,
      2022: 24.5029116862832,
      2023: 21.8085632197562,
      2024: 22.3096487702606
    }
  },
  'imports': {
    id: 'imports',
    code: 'NE.IMP.GNFS.ZS',
    name: 'Imports of goods and services (% of GDP)',
    shortName: 'Imports (% GDP)',
    category: 'Trade',
    unit: '% of GDP',
    format: 'percent',
    description: 'Value of all goods and other market services received from the rest of the world as a share of GDP.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 20.7774609817235,
      2016: 18.3323479486654,
      2017: 19.17819263535,
      2018: 22.0715624579547,
      2019: 19.0362497386225,
      2020: 15.6410071153504,
      2021: 18.7882026359018,
      2022: 20.9617585096621,
      2023: 19.6519133249671,
      2024: 20.5002891005614
    }
  },

  // People
  'population': {
    id: 'population',
    code: 'SP.POP.TOTL',
    name: 'Population, total',
    shortName: 'Population',
    category: 'People',
    unit: 'people',
    format: 'number',
    description: 'Total population based on the de facto definition of population.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 261799249,
      2016: 264627418,
      2017: 267346658,
      2018: 269951846,
      2019: 272489381,
      2020: 274814866,
      2021: 276758053,
      2022: 278830529,
      2023: 281190067,
      2024: 283487931
    }
  },
  'population-growth': {
    id: 'population-growth',
    code: 'SP.POP.GROW',
    name: 'Population growth (annual %)',
    shortName: 'Population Growth',
    category: 'People',
    unit: '%',
    format: 'percent',
    description: 'Annual population growth rate.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 1.12233981761262,
      2016: 1.0744882002252,
      2017: 1.02232939771064,
      2018: 0.969743409524713,
      2019: 0.935604959235128,
      2020: 0.849801187379341,
      2021: 0.704601321926319,
      2022: 0.746050469653246,
      2023: 0.842666137328498,
      2024: 0.813871513351669
    }
  },
  'life-expectancy': {
    id: 'life-expectancy',
    code: 'SP.DYN.LE00.IN',
    name: 'Life expectancy at birth, total (years)',
    shortName: 'Life Expectancy',
    category: 'Health',
    unit: 'years',
    format: 'number',
    description: 'Number of years a newborn infant would live if prevailing patterns of mortality at the time of birth were to stay the same throughout life.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 69.52,
      2016: 69.733,
      2017: 69.953,
      2018: 70.08,
      2019: 70.349,
      2020: 68.817,
      2021: 67.452,
      2022: 70.925,
      2023: 71.146,
      2024: 71.288
    }
  },

  // Health
  'under5-mortality': {
    id: 'under5-mortality',
    code: 'SH.DYN.MORT',
    name: 'Mortality rate, under-5 (per 1,000 live births)',
    shortName: 'Under-5 Mortality',
    category: 'Health',
    unit: 'per 1,000',
    format: 'number',
    description: 'Probability per 1,000 that a newborn baby will die before reaching age five.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 26.1,
      2016: 25,
      2017: 23.8,
      2018: 22.8,
      2019: 21.8,
      2020: 20.8,
      2021: 19.9,
      2022: 19.1,
      2023: 18.4,
      2024: 17.7
    }
  },
  'health-expenditure': {
    id: 'health-expenditure',
    code: 'SH.XPD.CHEX.GD.ZS',
    name: 'Current health expenditure (% of GDP)',
    shortName: 'Health Expenditure (% GDP)',
    category: 'Health',
    unit: '% of GDP',
    format: 'percent',
    description: 'Level of current health expenditure expressed as a percentage of GDP.',
    source: 'World Bank WDI, 2023',
    series: {
      2015: 2.92428517,
      2016: 3.02147198,
      2017: 2.90417194,
      2018: 2.86757827,
      2019: 2.87862897,
      2020: 3.42067289,
      2021: 3.70634937,
      2022: 2.69389749,
      2023: 2.70239949
    }
  },

  // Education
  'primary-enrolment': {
    id: 'primary-enrolment',
    code: 'SE.PRM.ENRR',
    name: 'School enrollment, primary (% gross)',
    shortName: 'Primary Enrolment',
    category: 'Education',
    unit: '%',
    format: 'percent',
    description: 'Gross enrollment ratio in primary education, regardless of age.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 107.983525766989,
      2016: 105.922391949136,
      2017: 104.382521256166,
      2018: 103.299542869882,
      2019: 101.264685825869,
      2020: 100.951933675872,
      2021: 100.309665446849,
      2022: 98.7008730463611,
      2023: 98.1566275726904,
      2024: 100.036318150714
    }
  },
  'secondary-enrolment': {
    id: 'secondary-enrolment',
    code: 'SE.SEC.ENRR',
    name: 'School enrollment, secondary (% gross)',
    shortName: 'Secondary Enrolment',
    category: 'Education',
    unit: '%',
    format: 'percent',
    description: 'Gross enrollment ratio in secondary education, regardless of age.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 87.8423207929976,
      2016: 87.8191791728036,
      2017: 90.9455391241064,
      2018: 92.8120739600443,
      2019: 94.9467044891028,
      2020: 96.9345779132931,
      2021: 97.8441479813619,
      2022: 97.8167602714893,
      2023: 96.0002120295081,
      2024: 98.836444459078
    }
  },
  'tertiary-enrolment': {
    id: 'tertiary-enrolment',
    code: 'SE.TER.ENRR',
    name: 'School enrollment, tertiary (% gross)',
    shortName: 'Tertiary Enrolment',
    category: 'Education',
    unit: '%',
    format: 'percent',
    description: 'Gross enrollment ratio in tertiary education, regardless of age.',
    source: 'World Bank WDI, 2023',
    series: {
      2015: 32.4590200433758,
      2016: 34.8307173410877,
      2017: 35.967012362631,
      2018: 36.1494878042588,
      2019: 37.3230862728703,
      2020: 38.1650601406923,
      2021: 40.6293239880732,
      2022: 42.3260385456152,
      2023: 44.8813034886441
    }
  },

  // Energy & Environment
  'energy-use': {
    id: 'energy-use',
    code: 'EG.USE.PCAP.KG.OE',
    name: 'Energy use (kg of oil equivalent per capita)',
    shortName: 'Energy Use per Capita',
    category: 'Energy & Environment',
    unit: 'kg oil eq',
    format: 'number',
    description: 'Energy use per capita measured in kilograms of oil equivalent.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 703.657721916758,
      2016: 723.839737699054,
      2017: 760.779744745412,
      2018: 832.817165448382,
      2019: 850.030013085431,
      2020: 856.003460723482,
      2021: 904.443867502266,
      2022: 969.811866016978,
      2023: 991.757000596002,
      2024: 1019.84395166686
    }
  },

  // Labour
  'labour-force': {
    id: 'labour-force',
    code: 'SL.TLF.TOTL.IN',
    name: 'Labor force, total',
    shortName: 'Labour Force',
    category: 'Labour',
    unit: 'people',
    format: 'number',
    description: 'Total labor force comprising people ages 15 and older who are economically active.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 127299364,
      2016: 128501300,
      2017: 130940742,
      2018: 134532894,
      2019: 137425585,
      2020: 137375390,
      2021: 135672770,
      2022: 139637843,
      2023: 143318723,
      2024: 145198137
    }
  },
  'unemployment': {
    id: 'unemployment',
    code: 'SL.UEM.TOTL.ZS',
    name: 'Unemployment, total (% of total labor force) (modeled ILO estimate)',
    shortName: 'Unemployment Rate',
    category: 'Labour',
    unit: '%',
    format: 'percent',
    description: 'Share of the labor force that is without work but available for and seeking employment.',
    source: 'World Bank WDI, 2024',
    series: {
      2015: 4.514,
      2016: 4.301,
      2017: 3.783,
      2018: 4.387,
      2019: 3.59,
      2020: 4.255,
      2021: 3.827,
      2022: 3.462,
      2023: 3.308,
      2024: 3.301
    }
  }
};

export const CATEGORIES = [
  { id: 'economy', name: 'Economy', icons: '📈', indicators: ['gdp', 'gdp-growth', 'gdp-per-capita', 'inflation'] },
  { id: 'people', name: 'People', icons: '👥', indicators: ['population', 'population-growth', 'life-expectancy'] },
  { id: 'health', name: 'Health', icons: '🏥', indicators: ['under5-mortality', 'health-expenditure', 'life-expectancy'] },
  { id: 'education', name: 'Education', icons: '🎓', indicators: ['primary-enrolment', 'secondary-enrolment', 'tertiary-enrolment'] },
  { id: 'energy', name: 'Energy & Environment', icons: '⚡', indicators: ['energy-use'] },
  { id: 'trade', name: 'Trade', icons: '🌐', indicators: ['exports', 'imports'] },
  { id: 'labour', name: 'Labour', icons: '💼', indicators: ['labour-force', 'unemployment'] }
];

export const ASEAN_PEERS_2024 = {
  IDN: { name: 'Indonesia', code: 'IDN', pop: 283487931, gdppc: 4925.43644992666 },
  SGP: { name: 'Singapore', code: 'SGP', pop: 6036860, gdppc: 94896.5621495988 },
  MYS: { name: 'Malaysia', code: 'MYS', pop: 35557673, gdppc: 11874.4273684245 },
  THA: { name: 'Thailand', code: 'THA', pop: null, gdppc: 7386.63615126055 },
  VNM: { name: 'Vietnam', code: 'VNM', pop: 100987686, gdppc: null },
  PHL: { name: 'Philippines', code: 'PHL', pop: 115843670, gdppc: 3985.29464669706 }
};

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const YEAR_RANGES = [
  { id: 'all', label: 'All Years (2015–2024)', start: 2015, end: 2024 },
  { id: '2015-2019', label: '2015–2019 (Pre-COVID)', start: 2015, end: 2019 },
  { id: '2020-2024', label: '2020–2024 (COVID & Recovery)', start: 2020, end: 2024 }
];

export const GLOSSARY = [
  { term: 'GDP (Gross Domestic Product)', definition: 'The total monetary value of all finished goods and services produced within a country\'s borders in a specific time period.' },
  { term: 'GDP per Capita', definition: 'GDP divided by midyear population; a rough proxy for average living standards.' },
  { term: 'Inflation (CPI)', definition: 'The annual percentage change in the Consumer Price Index, measuring the average price change of a basket of consumer goods and services.' },
  { term: 'Unemployment Rate', definition: 'The share of the labor force that is jobless, available for work, and actively seeking employment (ILO modeled estimate).' },
  { term: 'Labor Force', definition: 'People ages 15 and older who are economically active: either employed or unemployed and seeking work.' },
  { term: 'Life Expectancy at Birth', definition: 'The average number of years a newborn would live if current mortality patterns remained constant throughout life.' },
  { term: 'Under-5 Mortality Rate', definition: 'The probability per 1,000 live births that a child will die before reaching age five.' },
  { term: 'Gross Enrollment Ratio', definition: 'Total enrollment in a given level of education regardless of age, expressed as a percentage of the official school-age population for that level.' },
  { term: 'Exports/Imports (% of GDP)', definition: 'The value of goods and services sold to/bought from the rest of the world, expressed as a share of GDP.' },
  { term: 'Energy Use per Capita', definition: 'Primary energy consumption per person, measured in kilograms of oil equivalent.' },
  { term: 'Current Health Expenditure (% of GDP)', definition: 'Spending on health care goods and services consumed during the year, as a share of GDP.' },
  { term: 'Population Growth Rate', definition: 'The annual percentage change in total population, reflecting births, deaths, and net migration.' }
];

export function getIndicator(id) {
  return INDICATORS[id];
}

export function getIndicatorsByCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return [];
  return cat.indicators.map(id => INDICATORS[id]).filter(Boolean);
}

export function getAllIndicators() {
  return Object.values(INDICATORS);
}

export function formatValue(indicator, value) {
  if (value === null || value === undefined) return '—';
  const fmt = indicator.format;
  if (fmt === 'currency') {
    if (indicator.unit === 'US$ billions') {
      return '$' + value.toFixed(1) + 'B';
    }
    return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  if (fmt === 'percent') {
    return value.toFixed(2) + '%';
  }
  if (fmt === 'number') {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  return value.toString();
}

export function getSeriesForYears(indicator, startYear, endYear) {
  const result = {};
  for (let y = startYear; y <= endYear; y++) {
    if (indicator.series[y] !== undefined) {
      result[y] = indicator.series[y];
    }
  }
  return result;
}

export function normalizeSeries(series, baseYear = 2015) {
  const base = series[baseYear];
  if (!base || base === 0) return {};
  const result = {};
  for (const [year, value] of Object.entries(series)) {
    result[year] = (value / base) * 100;
  }
  return result;
}