# Publishing TGHT to ght.medonmt.org on Reclaim Hosting

**Domain:** `ght.medonmt.org`  
**Host:** Reclaim Hosting (`halflife.shared.host.reclaimhosting.com`)  
**Production Package:** `/home/aadeshnpn/Documents/tght-production.zip` (429 KB)

---

## Step 1: Log in to cPanel

Access your Reclaim Hosting cPanel:
* **cPanel Direct URL:** [https://halflife.shared.host.reclaimhosting.com:2083](https://halflife.shared.host.reclaimhosting.com:2083) or [https://medonmt.org:2083](https://medonmt.org:2083)
* Or log in via the [Reclaim Hosting Client Portal](https://portal.reclaimhosting.com) -> **Services** -> **Log in to cPanel**.

---

## Step 2: Create the Subdomain `ght.medonmt.org`

1. Under the **Domains** section in cPanel, click **Domains** (or **Subdomains**).
2. Click the blue **Create A New Domain** button.
3. Fill in the details:
   * **Domain:** `ght.medonmt.org`
   * **Share document root:** **Uncheck** this box (ensures TGHT has its own isolated directory).
   * **Document Root:** Enter `public_html/ght` (or `public_html/ght.medonmt.org`).
4. Click **Submit**.

---

## Step 3: Upload the Website Files

### Option A: Using cPanel File Manager (Recommended — 2 Minutes)
1. In cPanel, click **File Manager** (under Files).
2. Double-click to open your new document root: `public_html/ght` (or `public_html/ght.medonmt.org`).
3. Click **Upload** from the top toolbar.
4. Select the pre-built zip file:
   `/home/aadeshnpn/Documents/tght-production.zip`
5. Once upload shows 100%, return to the File Manager tab.
6. Click on `tght-production.zip`, click **Extract** in the top toolbar, and confirm.
7. Click **Reload** — you will see all HTML pages, `css/`, `js/`, `data/`, and `.htaccess` in place.
8. (Optional) Right-click `tght-production.zip` and select **Delete**.

### Option B: Using SFTP / rsync (Terminal)
If you have SSH/SFTP access enabled on your Reclaim Hosting account:
```bash
rsync -avz --exclude '.git' --exclude 'scripts' \
  /home/aadeshnpn/Documents/tght/ \
  YOUR_CPANEL_USER@halflife.shared.host.reclaimhosting.com:~/public_html/ght/
```

---

## Step 4: Verify SSL Certificate (HTTPS)

Reclaim Hosting automatically issues a free Let's Encrypt / Sectigo SSL certificate via **AutoSSL**:
1. In cPanel, navigate to **Security** -> **SSL/TLS Status**.
2. Look for `ght.medonmt.org`.
3. If it does not show a green lock yet, click **Run AutoSSL**. Within 1–3 minutes, SSL will be active.

---

## Step 5: Test the Live Website

Visit:
* **[https://ght.medonmt.org](https://ght.medonmt.org)**
* Verify the homepage, 3D interactive map (`/map.html`), 10 sections (`/sections.html`), crux passes (`/passes.html`), 2028 expedition roadmap (`/expedition.html`), and Aadesh profile (`/aadesh.html`).
* Test the Day/Night toggle and Metric/Imperial switcher to confirm client-side features are running smoothly.

---

## Included `.htaccess` Optimizations
The uploaded `.htaccess` file automatically configures:
1. **HTTPS Enforcement:** Automatically rewrites all HTTP requests to secure HTTPS.
2. **GZIP Compression:** Minimizes HTML, CSS, JS, and JSON data transfer over the wire.
3. **MIME Types:** Ensures `.geojson` and `.json` are served as `application/json`.
4. **Browser Caching:** 1-month caching on static assets with 1-hour revalidation for dispatches.
5. **Security Headers:** Protects against MIME-sniffing and clickjacking.
