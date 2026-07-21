const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000/api/v1';
const OUT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\b640da76-c1a2-4328-92b6-86b93f66e523';

// Helper to delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('Fetching foods to get a slug...');
  let foodSlug = 'margherita-pizza';
  try {
    const res = await axios.get(`${API_URL}/foods`);
    if (res.data.data.foods && res.data.data.foods.length > 0) {
      foodSlug = res.data.data.foods[0].slug;
    }
  } catch (e) {
    console.log('Failed to fetch foods, using fallback slug', e.message);
  }

  // Get a valid admin token
  let token = null;
  let user = null;
  try {
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@sos.com',
      password: 'password123'
    });
    token = loginRes.data.data.token;
    user = loginRes.data.data.user;
    console.log('Admin login successful');
  } catch (e) {
    console.log('Admin login failed, screenshots may be limited.', e.message);
  }

  const browser = await puppeteer.launch({ headless: "new" });
  
  async function takeScreenshot(name, url, isMobile = false) {
    console.log(`Navigating to ${url} for ${name}...`);
    const page = await browser.newPage();
    
    if (isMobile) {
      await page.setViewport({ width: 375, height: 812, isMobile: true });
    } else {
      await page.setViewport({ width: 1920, height: 1080 });
    }

    // Set auth state if available
    if (token && user) {
      const authState = {
        state: { isLoggedIn: true, token, user },
        version: 0
      };
      await page.evaluateOnNewDocument((state) => {
        localStorage.setItem('swadesh-auth', JSON.stringify(state));
        // Add a mock cart item so Cart/Checkout pages aren't empty
        localStorage.setItem('swadesh-cart', JSON.stringify({
          state: {
            items: [{
              _id: 'mock-item-1',
              variant: 'mock-variant-1',
              food: 'mock-food-1',
              foodName: 'Mock Pizza',
              variantName: 'Large',
              unitPrice: 500,
              quantity: 2,
              totalPrice: 1000
            }],
            subtotal: 1000,
            discount: 0,
            tax: 50,
            grandTotal: 1050,
            itemCount: 2
          },
          version: 0
        }));
      }, authState);
      
      // Also set cookie if the app relies on it
      await page.setCookie({
        name: 'swadesh-token',
        value: token,
        domain: 'localhost',
        path: '/'
      });
    }

    await page.goto(url, { waitUntil: 'networkidle2' });
    await delay(1000); // Wait a bit for animations

    const filePath = path.join(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Saved ${name}.png`);
    await page.close();
  }

  // Desktop
  await takeScreenshot('desktop_landing', `${BASE_URL}/`);
  await takeScreenshot('desktop_menu', `${BASE_URL}/menu`);
  await takeScreenshot('desktop_food_details', `${BASE_URL}/menu/${foodSlug}`);
  await takeScreenshot('desktop_cart', `${BASE_URL}/cart`);
  await takeScreenshot('desktop_checkout', `${BASE_URL}/checkout`);
  await takeScreenshot('desktop_admin_dashboard', `${BASE_URL}/admin/dashboard`);
  await takeScreenshot('desktop_kitchen', `${BASE_URL}/kitchen`);

  // Mobile
  await takeScreenshot('mobile_landing', `${BASE_URL}/`, true);
  await takeScreenshot('mobile_menu', `${BASE_URL}/menu`, true);
  await takeScreenshot('mobile_cart', `${BASE_URL}/cart`, true);

  await browser.close();
  console.log('All screenshots captured successfully.');
}

main().catch(console.error);
