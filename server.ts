import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

// Initial seed data from constants. Since we can't easily import TS arrays into ES modules without compilation in some setups, we'll redefine a minimal seed or just use an empty array and let the client seed it on first load if empty.

const DATA_FILE = path.join(process.cwd(), 'store_data.json');
const INITIAL_DATA_FILE = path.join(process.cwd(), 'src', 'constants.ts'); // We can't import this easily in CJS without ts-node, but we are using tsx.

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper to read data
  const readData = () => {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        if (!content) return null;
        return JSON.parse(content);
      } catch (e) {
        console.error("Error reading data file:", e);
        return null;
      }
    }
    return null;
  };

  // API ROUTES
  app.get("/api/categories", (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const data = readData();
    if (data) {
      console.log(`[GET] Data fetched at ${new Date().toISOString()}`);
      res.json(data);
    } else {
      // If no data file exists yet, return empty but let client bootstrap if needed
      // Actually, better to seed it on the server if we can.
      res.json([]); 
    }
  });

  app.post("/api/categories", (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    try {
      const data = req.body;
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: Expected array of categories");
      }
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      console.log(`[POST] Data updated successfully at ${new Date().toISOString()}`);
      res.json({ success: true, timestamp: new Date().toISOString() });
    } catch (error: any) {
      console.error("[POST] Error saving data:", error.message);
      res.status(500).json({ error: "Failed to save data", message: error.message });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v4/v5 compatibility for catch-all
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
