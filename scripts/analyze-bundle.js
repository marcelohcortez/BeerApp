const fs = require("fs");
const path = require("path");

// Read the webpack stats file
const statsPath = path.join(__dirname, "..", "dist", "stats.json");

if (!fs.existsSync(statsPath)) {
  console.log(
    'Stats file not found. Run "npm run build" first to generate stats.'
  );
  process.exit(1);
}

try {
  const stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));

  console.log("\n=== Bundle Analysis Report ===\n");

  // Assets information
  if (stats.assets) {
    console.log("📦 Assets:");
    stats.assets
      .sort((a, b) => b.size - a.size)
      .forEach((asset) => {
        const sizeKB = (asset.size / 1024).toFixed(2);
        console.log(`  ${asset.name}: ${sizeKB} KB`);
      });
  }

  // Chunk information
  if (stats.chunks) {
    console.log("\n🧩 Chunks:");
    stats.chunks.forEach((chunk) => {
      const sizeKB = (chunk.size / 1024).toFixed(2);
      const modules = chunk.modules ? chunk.modules.length : 0;
      console.log(
        `  ${
          chunk.names ? chunk.names.join(", ") : chunk.id
        }: ${sizeKB} KB (${modules} modules)`
      );
    });
  }

  // Module information (top 10 largest)
  if (stats.modules) {
    console.log("\n📋 Largest Modules (Top 10):");
    stats.modules
      .filter((module) => module.size > 0)
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .forEach((module, index) => {
        const sizeKB = (module.size / 1024).toFixed(2);
        const name = module.name || module.identifier || "Unknown";
        // Clean up the module name for better readability
        const cleanName = name
          .replace(/^.*node_modules[\/\\]/, "")
          .replace(/\?.*$/, "");
        console.log(`  ${index + 1}. ${cleanName}: ${sizeKB} KB`);
      });
  }

  // Performance warnings
  if (stats.warnings && stats.warnings.length > 0) {
    console.log("\n⚠️  Performance Warnings:");
    stats.warnings.forEach((warning) => {
      console.log(`  ${warning}`);
    });
  }

  console.log("\n=== Performance Recommendations ===\n");

  // Calculate total JS size
  const jsAssets = stats.assets.filter((asset) => asset.name.endsWith(".js"));
  const totalJSSize = jsAssets.reduce((sum, asset) => sum + asset.size, 0);
  const totalJSSizeKB = (totalJSSize / 1024).toFixed(2);

  console.log(`Total JavaScript size: ${totalJSSizeKB} KB`);

  if (totalJSSize > 500 * 1024) {
    console.log("🔴 Bundle size is large (>500KB). Consider:");
    console.log("   - Code splitting with React.lazy()");
    console.log("   - Tree shaking unused imports");
    console.log("   - Analyzing third-party dependencies");
  } else if (totalJSSize > 250 * 1024) {
    console.log("🟡 Bundle size is moderate (>250KB). Consider:");
    console.log("   - Code splitting for route components");
    console.log("   - Optimizing Material-UI imports");
  } else {
    console.log("✅ Bundle size is good (<250KB)");
  }

  console.log("\nAnalysis complete! 🎉\n");
} catch (error) {
  console.error("Error reading stats file:", error.message);
  process.exit(1);
}
