import * as cheerio from 'cheerio';
import { serve } from 'bun';
import index from './index.html';
import { parseRelics, parseMissions } from './lib/parser.js';
import * as db from './lib/database.js';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/hello': {
      async GET(req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'GET',
        });
      },
      async PUT(req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'PUT',
        });
      },
    },

    '/api/hello/:name': async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
    '/api/warframe': async req => {
        let wfHtml = await fetch('https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html').then(res => res.text());
        let $ = cheerio.load(wfHtml);
        let missionTable = $('#missionRewards').next();
      try {
        let missions = parseMissions(missionTable);
      return Response.json(missions);
      }
      catch (error) {
        console.error('Error parsing missions:', error);
        return Response.json({ error: 'Failed to parse missions' }, { status: 500 });
      }
    },
    '/api/warframe/:searchTerm': { async GET(req) {
      let relics = await db.searchRelicsByReward(req.params.searchTerm);
      if (!relics) {
        return Response.json({ error: 'No relics found' }, { status: 404 });
      }
      return Response.json(relics);
    },
      async PUT(req) {
        let wfHtml = await fetch('https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html').then(res => res.text());
        let $ = cheerio.load(wfHtml);
        let relicTable = $('#relicRewards').next();
        let relics = parseRelics(relicTable);
        // insert into db
        await db.updateRelics(relics);
        return Response.json({success:true});
      },
    }
  },

  development: process.env.NODE_ENV !== 'production' && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
