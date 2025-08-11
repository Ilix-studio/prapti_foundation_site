export const getCategoryColor = (category: string) => {
  // Array of 10 light color combinations
  const lightColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-orange-100 text-orange-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
    "bg-indigo-100 text-indigo-800",
    "bg-pink-100 text-pink-800",
    "bg-emerald-100 text-emerald-800",
    "bg-cyan-100 text-cyan-800",
  ];

  // Create a simple hash function to ensure consistent colors for the same category
  const hashCategory = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Get a consistent random color index based on category name
  const colorIndex = hashCategory(category.toLowerCase()) % lightColors.length;

  return lightColors[colorIndex];
};
