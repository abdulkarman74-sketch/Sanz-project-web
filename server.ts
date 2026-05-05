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


  app.post("/api/downloader", async (req, res) => {
    try {
      const { url, mode = "video" } = req.body || {};

      function normalizeDownloaderUrl(u: string) {
        const clean = String(u || "").trim();
        if (!clean) return "";
        if (!/^https?:\/\//i.test(clean)) {
          return "https://" + clean;
        }
        return clean;
      }

      const cleanUrl = normalizeDownloaderUrl(url);

      if (!cleanUrl) {
        return res.status(400).json({
          success: false,
          message: "URL wajib diisi"
        });
      }

      const token = process.env.APIFY_TOKEN;
      const actorId = process.env.APIFY_ACTOR_ID;

      if (!token) {
        return res.status(500).json({
          success: false,
          message: "APIFY_TOKEN belum diatur di Environment Variables."
        });
      }

      if (!actorId) {
        return res.status(500).json({
          success: false,
          message: "APIFY_ACTOR_ID belum diatur di Environment Variables."
        });
      }

      async function runApifyActor(input: any) {
        const endpoint = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId!)}/runs?waitForFinish=120`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(input)
        });
        const raw = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(raw?.error?.message || raw?.message || `Apify run gagal HTTP ${response.status}`);
        }
        const run = raw?.data || raw;
        if (run?.status && !["SUCCEEDED", "READY"].includes(run.status)) {
          throw new Error(`Apify run status: ${run.status}`);
        }
        return run;
      }

      async function getApifyDatasetItems(datasetId: string) {
        const endpoint = `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?clean=true`;
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });
        const raw = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(raw?.error?.message || raw?.message || `Gagal ambil dataset HTTP ${response.status}`);
        }
        return Array.isArray(raw) ? raw : [];
      }

      function normalizeApifyResult(items: any[], m: string) {
        const first = Array.isArray(items) ? items[0] : items;
        if (!first) return null;

        const possibleUrls = [
          first?.downloadUrl,
          first?.url,
          first?.link,
          first?.media,
          first?.video,
          first?.audio,
          first?.videoUrl,
          first?.audioUrl,
          first?.result?.downloadUrl,
          first?.result?.url,
          first?.result?.link,
          first?.data?.downloadUrl,
          first?.data?.url,
          first?.data?.link,
          first?.data?.video,
          first?.data?.audio,
          first?.downloads?.[0]?.url,
          first?.medias?.[0]?.url,
          first?.formats?.[0]?.url
        ];

        let downloadUrl = possibleUrls.find(
          (item) => typeof item === "string" && item.startsWith("http")
        );

        if (!downloadUrl && Array.isArray(first?.medias)) {
          const media = first.medias.find((item: any) => {
            const text = String(item?.type || item?.extension || "").toLowerCase();
            if (m === "audio") return text.includes("audio") || text.includes("mp3");
            return text.includes("video") || text.includes("mp4");
          }) || first.medias[0];
          downloadUrl = media?.url;
        }

        if (!downloadUrl && Array.isArray(first?.formats)) {
          const format = first.formats.find((item: any) => {
            const text = String(item?.type || item?.mimeType || item?.ext || "").toLowerCase();
            if (m === "audio") return text.includes("audio") || text.includes("mp3");
            return text.includes("video") || text.includes("mp4");
          }) || first.formats[0];
          downloadUrl = format?.url;
        }

        const thumbnail =
          first?.thumbnail ||
          first?.thumb ||
          first?.cover ||
          first?.image ||
          first?.result?.thumbnail ||
          first?.data?.thumbnail ||
          "";

        const title =
          first?.title ||
          first?.filename ||
          first?.caption ||
          first?.result?.title ||
          first?.data?.title ||
          "Hasil Downloader";

        return {
          title,
          thumbnail,
          downloadUrl,
          type: m
        };
      }

      const run = await runApifyActor({
        url: cleanUrl,
        urls: [cleanUrl],
        mode,
        format: mode,
        downloadMode: mode
      });

      const datasetId = run?.defaultDatasetId;

      if (!datasetId) {
        return res.status(500).json({
          success: false,
          message: "Apify run selesai, tapi tidak ada defaultDatasetId."
        });
      }

      const items = await getApifyDatasetItems(datasetId);
      const result = normalizeApifyResult(items, mode);

      if (!result?.downloadUrl) {
        return res.status(500).json({
          success: false,
          message: "Apify berhasil berjalan, tapi output tidak berisi downloadUrl.",
          raw: items
        });
      }

      return res.status(200).json({
        success: true,
        result
      });
    } catch (error: any) {
      console.error("DOWNLOADER API ERROR:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Downloader gagal memproses link."
      });
    }
  });

  app.get("/api/download-file", async (req, res) => {
    try {
      const { url, filename } = req.query || {};

      if (!url || typeof url !== "string") {
        return res.status(400).send("URL wajib diisi");
      }

      const decodedUrl = decodeURIComponent(url);
      new URL(decodedUrl); // Verify valid URL format

      function sanitizeFilename(name: string) {
        return String(name || "sanz-store-download.mp4")
          .replace(/[\\/:*?"<>|]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 100);
      }

      const safeFilename = sanitizeFilename(filename as string || "sanz-store-download.mp4");

      const response = await fetch(decodedUrl, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      if (!response.ok) {
        return res.status(response.status).send("Gagal mengambil file");
      }

      const contentType = response.headers.get("content-type") || "application/octet-stream";

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
      res.setHeader("Cache-Control", "no-store");

      return res.status(200).send(buffer);
    } catch (error) {
      console.error("DOWNLOAD FILE ERROR:", error);
      return res.status(500).send("Gagal download file");
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
