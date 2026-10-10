/**
 * Google Analytics 4 for ght.medonmt.org.
 * Measurement ID G-YP8L1SM2QY is the medonmt.org property; this subdomain uses the same ID.
 *
 * The standard gtag.js loader lives in each public page <head>. This file sends the
 * automatic page_view (via gtag config) and listens once for meaningful clicks.
 *
 * Events and parameters:
 *   habit_app_click       link_url, link_text, location
 *   strava_click          link_url, link_text, location
 *   contact_email_click   link_url, link_text, location
 *   partner_click         link_url, link_text, location
 *   gpx_download          export_type, file_name, location
 *
 * location is footer, header, or gpx_modal when the click is in those landmarks.
 * Otherwise it is the nearest section id (hyphens as underscores), or the section
 * heading when that section has no id, or page.
 *
 * partner_click fires for outbound or in-page links that are marked as partners or
 * sponsors: rel="sponsored", data-track="partner"|"sponsor", class partner-link,
 * sponsor-link, partner-logo, or sponsor-logo, and any link inside
 * #partner-recognition, [data-partner-links], or [data-sponsor-links].
 */
(function () {
  if (window.TGHT_Analytics_Initialized) return;
  window.TGHT_Analytics_Initialized = true;

  var MEASUREMENT_ID = 'G-YP8L1SM2QY';

  var GPX_BUTTONS = {
    'btn-export-full-gpx': {
      export_type: 'full_route',
      file_name: 'GHT-Nepal-High-Route-Full.gpx'
    },
    'btn-export-sec-gpx': {
      export_type: 'active_section'
    },
    'btn-export-wpt-gpx': {
      export_type: 'waypoints',
      file_name: 'GHT-High-Route-Waypoints.gpx'
    }
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  var debug = false;
  try {
    debug = window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      /(?:^|[?&])ga_debug=1(?:&|$)/.test(window.location.search);
  } catch (e) {
    debug = false;
  }

  var config = { send_page_view: true };
  if (debug) {
    config.debug_mode = true;
    config.traffic_type = 'internal';
  }

  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, config);

  if (debug) {
    console.debug('[ga4]', 'page_view', {
      measurement_id: MEASUREMENT_ID,
      page_location: window.location.href
    });
  }

  function clip(value) {
    var text = String(value).replace(/\s+/g, ' ').trim();
    if (!text) return '';
    return text.length > 100 ? text.slice(0, 100) : text;
  }

  function slugId(id) {
    var slug = String(id).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    return slug || 'page';
  }

  function eventTarget(event) {
    var node = event.target;
    if (!node) return null;
    if (node.nodeType === 3) return node.parentElement;
    return node;
  }

  function clickLocation(el) {
    if (el.closest('#gpx-modal')) return 'gpx_modal';
    if (el.closest('footer')) return 'footer';
    if (el.closest('header')) return 'header';
    var identified = el.closest('section[id]');
    if (identified && identified.id) return slugId(identified.id);
    var section = el.closest('section');
    if (section) {
      var heading = section.querySelector('h1, h2, h3');
      if (heading && heading.textContent) return slugId(heading.textContent);
    }
    return 'page';
  }

  function linkText(el) {
    return clip(el.textContent || el.getAttribute('aria-label') || '');
  }

  function parseUrl(href) {
    try {
      return new URL(href, window.location.href);
    } catch (e) {
      return null;
    }
  }

  function hostName(url) {
    return (url.hostname || '').replace(/^www\./i, '').toLowerCase();
  }

  function mailtoAddress(url, rawHref) {
    if (!url || url.protocol !== 'mailto:') return '';
    var path = '';
    try {
      path = decodeURIComponent(url.pathname || '');
    } catch (e) {
      path = url.pathname || '';
    }
    path = path.replace(/^\/+/, '').split('?')[0].toLowerCase();
    if (path.indexOf('@') !== -1) return path;
    var match = String(rawHref || '').match(/^mailto:([^?]+)/i);
    if (!match) return '';
    try {
      return decodeURIComponent(match[1]).toLowerCase();
    } catch (e) {
      return match[1].toLowerCase();
    }
  }

  function isPartnerOrSponsor(link) {
    if (link.relList && link.relList.contains('sponsored')) return true;
    var track = (link.getAttribute('data-track') || '').toLowerCase();
    if (track === 'partner' || track === 'sponsor') return true;
    if (link.closest('#partner-recognition, [data-partner-links], [data-sponsor-links]')) return true;
    var className = link.getAttribute('class') || '';
    return /(?:^|\s)(?:partner|sponsor)(?:-link|-logo)?(?:\s|$)/i.test(className);
  }

  function send(name, params) {
    var payload = { transport_type: 'beacon' };
    var key;
    for (key in params) {
      if (!Object.prototype.hasOwnProperty.call(params, key)) continue;
      if (params[key] == null || params[key] === '') continue;
      payload[key] = clip(params[key]);
    }
    window.gtag('event', name, payload);
    if (debug) console.debug('[ga4]', name, payload);
  }

  function gpxFromControl(node) {
    var button = node.closest('#btn-export-full-gpx, #btn-export-sec-gpx, #btn-export-wpt-gpx');
    if (button && GPX_BUTTONS[button.id]) {
      return { el: button, detail: GPX_BUTTONS[button.id] };
    }

    var link = node.closest('a[href]');
    if (!link) return null;
    var href = link.getAttribute('href') || '';
    if (!href || href.indexOf('blob:') === 0) return null;
    var downloadName = link.getAttribute('download') || '';
    var url = parseUrl(href);
    var path = url ? url.pathname : href;
    if (downloadName && /\.gpx$/i.test(downloadName)) {
      return { el: link, detail: { export_type: 'file', file_name: downloadName } };
    }
    if (/\.gpx$/i.test(path)) {
      return { el: link, detail: { export_type: 'file', file_name: path.split('/').pop() } };
    }
    return null;
  }

  function handleClick(event) {
    var node = eventTarget(event);
    if (!node || !node.closest) return;

    var gpx = gpxFromControl(node);
    if (gpx) {
      send('gpx_download', {
        export_type: gpx.detail.export_type,
        file_name: gpx.detail.file_name,
        location: clickLocation(gpx.el)
      });
      return;
    }

    var link = node.closest('a[href]');
    if (!link) return;

    var rawHref = link.getAttribute('href') || '';
    if (!rawHref || rawHref.indexOf('blob:') === 0) return;

    var url = parseUrl(rawHref);
    if (!url) return;

    var place = clickLocation(link);
    var text = linkText(link);
    var host = hostName(url);

    if (host === 'habitapp.medonmt.org') {
      send('habit_app_click', { link_url: url.href, link_text: text, location: place });
      return;
    }

    if (host === 'strava.com' || host.slice(-'.strava.com'.length) === '.strava.com') {
      send('strava_click', { link_url: url.href, link_text: text, location: place });
      return;
    }

    if (mailtoAddress(url, rawHref) === 'aadesh@medonmt.org') {
      send('contact_email_click', {
        link_url: 'mailto:aadesh@medonmt.org',
        link_text: text,
        location: place
      });
      return;
    }

    if (isPartnerOrSponsor(link)) {
      send('partner_click', { link_url: url.href, link_text: text, location: place });
    }
  }

  document.addEventListener('click', function (event) {
    try {
      handleClick(event);
    } catch (err) {
      if (debug) console.debug('[ga4] click handler error', err);
    }
  }, true);
})();
