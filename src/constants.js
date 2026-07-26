export const idToCategory = {
  1: "Coffee",
  2: "Tea",
  3: "Ready-to-Drink",
  4: "Accessories",
};

export const categoryNameToId = {
  Coffee: 1,
  Tea: 2,
  "Ready-to-Drink": 3,
  Accessories: 4,
};

export const categoryIdToAttributes = {
  1: ["Origin", "Roast Level", "Format", "Weight"],
  2: ["Type", "Origin", "Format", "Caffeine Level", "Weight"],
  3: ["Base", "Volume"],
  4: ["Type", "Compatible With"],
};

export const categoryIdToClassName = {
  1: "coffee",
  2: "tea",
  3: "rtd",
  4: "acc",
};

export const categoryAttributes = {
  Coffee: {
    Origin: null,
    "Roast Level": ["Light", "Medium", "Dark"],
    Format: ["Whole Bean", "Ground"],
    Weight: null,
  },
  Tea: {
    Type: ["Green", "Black", "White", "Oolong", "Herbal"],
    Origin: null,
    Format: ["Loose Leaf", "Bagged"],
    "Caffeine Level": ["None", "Low", "Medium", "High"],
    Weight: null,
  },
  "Ready-to-Drink": {
    Base: ["Coffee", "Tea", "Other"],
    Volume: null,
  },
  Accessories: {
    Type: ["Filter", "Frother", "Infuser", "Grinder", "Scale", "Other"],
    "Compatible With": ["Coffee", "Tea", "Both"],
  },
};

export const attributePlaceholders = {
  Origin: "e.g. Ethiopia",
  Weight: "e.g. 250",
  Volume: "e.g. 330",
};

export const attributeStates = {
  Coffee: { Origin: "", "Roast Level": "", Format: "", Weight: "" },
  Tea: { Type: "", Origin: "", Format: "", "Caffeine Level": "", Weight: "" },
  "Ready-to-Drink": { Base: "", Volume: "" },
  Accessories: { Type: "", "Compatible With": "" },
};
