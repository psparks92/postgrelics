import * as cheerio from 'cheerio';
import { serve } from 'bun';
import index from './index.html';
import { parseRelics, parseMissions } from './lib/parser.js';
import * as db from './lib/database.js';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/mission/:searchTerm': { async GET(req) {
      let missions = await db.searchMissionsByReward(req.params.searchTerm);
      if (!missions) {
        return Response.json({ error: 'No missions found' }, { status: 404 });
      }
      return Response.json(missions);
    }
    },
    '/api/mission': { async PUT(req) {
      let wfHtml = await fetch('https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html').then(res => res.text());
      let $ = cheerio.load(wfHtml);
      let missionTable = $('#missionRewards').next();
      let missions = [];
      try {
        missions = parseMissions(missionTable);
        //return Response.json(missions);
      }
      catch (error) {
        console.error('Error parsing missions:', error);
        return Response.json({ error: 'Failed to parse missions' }, { status: 500 });
      }
      try {
        await db.updateMissionRewards(missions);
        return Response.json({ success: true, message: 'Missions updated successfully' });
      }
      catch (error) {
        console.error('Error updating missions in database:', error);
        return Response.json({ error: 'Failed to update missions in database' }, { status: 500 });
      }
    }
    },
    '/api/relic/:searchTerm': { async GET(req) {
      let relics = await db.searchRelicsByReward(req.params.searchTerm);
      if (!relics) {
        return Response.json({ error: 'No relics found' }, { status: 404 });
      }
      return Response.json(relics);
    }
    },
    '/api/relic': { async PUT(req) {
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
