export type ModalRow = { rating: number; description: string };

export type ModalConfig = {
  id: string;
  title: string;
  intro?: string;
  rows: ModalRow[];
};

export const reviewModalConfigs: ModalConfig[] = [
  {
    id: "bodyModal",
    title: "Body profile",
    intro:
      "Body or mouthfeel refers to how the coffee feels in your mouth. It has to do with the sediments in the coffee and how “dense” it feels, and it can feel full-bodied or be lacking in body where the coffee feels flat and thin in your mouth.",
    rows: [
      {
        rating: 1,
        description: "Very light body; thin, almost watery mouthfeel, minimal texture.",
      },
      {
        rating: 2,
        description: "Light body; delicate, tea-like texture with slight presence.",
      },
      {
        rating: 3,
        description:
          "Medium body; balanced, round mouthfeel, noticeable presence but not heavy.",
      },
      {
        rating: 4,
        description: "Heavy body; rich, syrupy, and creamy sensation on the palate.",
      },
      {
        rating: 5,
        description:
          "Very heavy (full) body; dense, almost chewy, coats the mouth with intense viscosity",
      },
    ],
  },
  {
    id: "acidityModal",
    title: "Acidity profile",
    intro: "There can be at least a few different types of acids in coffee, for example, citric acid. But in this case, we're not talking about the acidity level or the acid types in coffee. When we say acidity in coffee, what we mean for tasting is the brightness, and the dry sensation that brings out the flavour profile of the coffee, or on the negative side, the sourness or pungency of a coffee.",
    rows: [
      { rating: 1, description: "Very low acidity; flat, dull, little brightness." },
      { rating: 2, description: "Mild acidity; subtle brightness but not pronounced." },
      { rating: 3, description: "Moderate acidity; balanced crispness and liveliness." },
      { rating: 4, description: "High acidity; bright, vibrant, with noticeable fruitiness." },
      {
        rating: 5,
        description: "Very high acidity; sharp, tangy, intensive citrus or wine-like notes.",
      },
    ],
  },
  {
    id: "aromaModal",
    title: "Aroma profile",
    intro: "The smell, scent, fragrance – whatever you want to call it – the aroma of the coffee is how it smells after it's been brewed.",
    rows: [
      { rating: 1, description: "Weak aroma; faint or barely perceptible scent." },
      { rating: 2, description: "Mild aroma; present but not very distinctive." },
      { rating: 3, description: "Moderate aroma; pleasant and noticeable." },
      {
        rating: 4,
        description: "Strong aroma; rich, complex, and inviting scent.",
      },
      {
        rating: 5,
        description: "Very strong aroma; intense, layered, and memorable fragrance.",
      },
    ],
  },
  {
    id: "flavourModal",
    title: "Flavour profile",
    intro: "The most obvious characteristic of coffee is, of course, the flavour. More specifically, we mean the flavour notes that come through when evaluating the taste.",
    rows: [
      { rating: 1, description: "Bland or muted flavor; lacks depth and complexity." },
      { rating: 2, description: "Light flavor; some identifiable notes but limited range." },
      { rating: 3, description: "Balanced flavor; distinct notes, moderately complex." },
      {
        rating: 4,
        description: "Rich flavor; layered, vibrant, with good complexity.",
      },
      {
        rating: 5,
        description: "Very rich and complex flavor; bold with multiple distinctive notes.",
      },
    ],
  },
  {
    id: "aftertasteModal",
    title: "Aftertase profile",
    intro: "Also called the finish, aftertaste is the flavour that lingers after you've drank the coffee. More flavours will linger when there's a heavier or more full-bodied coffee. Some coffee will have a short or sharp finish where once you drink it, those flavours in your mouth disappear almost instantly. This is okay, although we generally enjoy coffee that lingers a little.",
    rows: [
      { rating: 1, description: "Very short or unpleasant aftertaste; flavors disappear quickly or leave an unpleasant sensation." },
      { rating: 2, description: "Short aftertaste; somewhat noticeable but fades quickly with little complexity." },
      { rating: 3, description: "Moderate aftertaste; pleasant and lingers for a short time with some flavor retention." },
      {
        rating: 4,
        description: "Long aftertaste; flavors last well, smooth and enjoyable with good complexity.",
      },
      {
        rating: 5,
        description: "Very long and memorable aftertaste; rich, layered, and leaves a lasting positive impression.",
      },
    ],
  },
];


