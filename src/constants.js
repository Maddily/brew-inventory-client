export const idToCategory = {
  1: "Coffee",
  2: "Tea",
  3: "Ready-to-Drink",
  4: "Accessories",
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
    "Roast Level": ["Light", "Medium", "Dark", "Espresso"],
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
