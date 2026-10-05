/**
 * GPX Exporter Module for TGHT (The Great Himalayan Trail)
 * Generates valid GPX 1.1 compliant XML strings for GPS receivers (Garmin, Coros, Suunto, smartphones).
 */

const GPXExporter = {
  /**
   * Escape XML entities
   */
  escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString().replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  },

  /**
   * Builds GPX 1.1 XML string from track points and optional waypoints
   */
  buildGpx({ trackName, description, trackPoints = [], waypoints = [] }) {
    const timeNow = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<gpx version="1.1" creator="TGHT - The Great Himalayan Trail Tracker"\n`;
    xml += `     xmlns="http://www.topografix.com/GPX/1/1"\n`;
    xml += `     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
    xml += `     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n`;

    // Metadata
    xml += `  <metadata>\n`;
    xml += `    <name>${this.escapeXml(trackName)}</name>\n`;
    xml += `    <desc>${this.escapeXml(description || 'Great Himalayan Trail Nepal High Route GPX Track')}</desc>\n`;
    xml += `    <author>\n`;
    xml += `      <name>TGHT Tracker</name>\n`;
    xml += `    </author>\n`;
    xml += `    <time>${timeNow}</time>\n`;
    xml += `  </metadata>\n\n`;

    // Waypoints
    if (waypoints && waypoints.length > 0) {
      xml += `  <!-- Waypoints & Notable POIs -->\n`;
      waypoints.forEach((wpt) => {
        xml += `  <wpt lat="${wpt.lat.toFixed(5)}" lon="${wpt.lng.toFixed(5)}">\n`;
        if (wpt.elevationM || wpt.ele) {
          xml += `    <ele>${wpt.elevationM || wpt.ele}</ele>\n`;
        }
        xml += `    <name>${this.escapeXml(wpt.name)}</name>\n`;
        if (wpt.desc) {
          xml += `    <desc>${this.escapeXml(wpt.desc)}</desc>\n`;
        }
        const sym = wpt.type === 'crux_pass' ? 'Triangle, Red' : wpt.type === 'pass' ? 'Triangle, Blue' : 'Campground';
        xml += `    <sym>${sym}</sym>\n`;
        xml += `  </wpt>\n`;
      });
      xml += `\n`;
    }

    // Track
    if (trackPoints && trackPoints.length > 0) {
      xml += `  <trk>\n`;
      xml += `    <name>${this.escapeXml(trackName)}</name>\n`;
      xml += `    <trkseg>\n`;
      trackPoints.forEach((pt) => {
        xml += `      <trkpt lat="${pt.lat.toFixed(5)}" lon="${pt.lng.toFixed(5)}">\n`;
        if (pt.ele !== undefined) {
          xml += `        <ele>${pt.ele}</ele>\n`;
        }
        if (pt.name) {
          xml += `        <name>${this.escapeXml(pt.name)}</name>\n`;
        }
        xml += `      </trkpt>\n`;
      });
      xml += `    </trkseg>\n`;
      xml += `  </trk>\n`;
    }

    xml += `</gpx>\n`;
    return xml;
  },

  /**
   * Trigger browser file download
   */
  download(filename, content, mimeType = 'application/gpx+xml') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Export the entire Great Himalayan Trail High Route
   */
  exportFullRoute(allRoutePoints, allWaypoints) {
    const xml = this.buildGpx({
      trackName: 'Great Himalayan Trail - Nepal High Route (Full Traverse)',
      description: 'Full continuous ~1,700km traverse from Kanchenjunga to Humla/Hilsa via high alpine passes.',
      trackPoints: allRoutePoints,
      waypoints: allWaypoints
    });
    this.download('GHT-Nepal-High-Route-Full.gpx', xml);
  },

  /**
   * Export a single section
   */
  exportSection(section, allRoutePoints, allWaypoints) {
    const filteredPoints = allRoutePoints.filter(p => p.secId === section.id);
    const filteredWaypoints = allWaypoints.filter(w => w.sectionId === section.id);

    const xml = this.buildGpx({
      trackName: `GHT Section ${section.id}: ${section.name}`,
      description: `Great Himalayan Trail High Route - Section ${section.id} (${section.name}). Distance: ${section.distanceKm} km, Highest Point: ${section.highestPointName}`,
      trackPoints: filteredPoints,
      waypoints: filteredWaypoints
    });

    const slug = section.slug || `section-${section.id}`;
    this.download(`GHT-Sec${section.id}-${slug}.gpx`, xml);
  },

  /**
   * Export waypoints only
   */
  exportWaypointsOnly(allWaypoints) {
    const xml = this.buildGpx({
      trackName: 'GHT High Route - Major Passes, Base Camps & Waypoints',
      description: 'Key mountaineering passes, crux cols, 8000m base camps, and resupply settlements across Nepal GHT.',
      trackPoints: [],
      waypoints: allWaypoints
    });
    this.download('GHT-High-Route-Waypoints.gpx', xml);
  }
};

window.GPXExporter = GPXExporter;
