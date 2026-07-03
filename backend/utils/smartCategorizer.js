const categories = {
  "Programming": ["react", "javascript", "node", "api", "tutorial", "jwt", "python", "java", "coding", "html", "css", "nextjs", "express"],
  "Finance": ["stock", "crypto", "invest", "money", "trading", "bitcoin", "finance"],
  "Fitness": ["workout", "gym", "diet", "protein", "fitness", "muscle", "exercise"]
};

const categorizeVideo = (title) => {
  const lowerTitle = title.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword)) {
        return category;
      }
    }
  }
  
  return "General";
};

module.exports = { categorizeVideo };
