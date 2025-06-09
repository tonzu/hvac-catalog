from selenium import webdriver
from bs4 import BeautifulSoup
import time
import json
import os
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException


def extract_field(specs, possible_keys):
    for key in specs.keys():
        normalized = key.strip().lower()
        for candidate in possible_keys:
            if candidate in normalized:
                return specs[key]
    return "unknown"


def load_existing_data(file_path):
    """Load existing JSON data if file exists"""
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            return json.load(f)
    return {}


def save_data(data, file_path):
    """Save data to JSON file"""
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"JSON saved to {file_path}")


def scrape_category_urls(driver, base_url, category_name):
    """Scrape all product URLs from a category"""
    page = 1
    product_urls = []
    
    while True:
        url = f"{base_url}?p={page}"
        print(f"Scraping {category_name} - Page {page}: {url}")
        driver.get(url)
        
        try:
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".products.wrapper"))
            )
        except TimeoutException:
            print(f"No products found on page {page} for {category_name}")
            break

        soup = BeautifulSoup(driver.page_source, "html.parser")
        products = soup.select("a.product-item-link")
        
        if not products:
            print(f"No more products found for {category_name}")
            break
        
        for item in products:
            product_urls.append(item["href"])

        page += 1

    print(f"Found {len(product_urls)} product URLs for {category_name}")
    return product_urls


def extract_main_product_image(soup):
    """Extract the main product image URL from the product page"""
    main_image = soup.select_one(".main-image-wrapper .main-image")
    
    if main_image:
        src = main_image.get('src')
        if src:
            # Convert relative URLs to absolute URLs
            if src.startswith('//'):
                src = 'https:' + src
            elif src.startswith('/'):
                src = 'https://hvacdirect.com' + src
            
            # Filter out placeholder/loading images
            if ('placeholder' not in src.lower() and 
                'loading' not in src.lower() and
                'data:image' not in src.lower()):
                return src
            
    fallback_selectors = [
        ".fotorama__img",
        ".product.media img",
        ".gallery-image img",
        ".product-image-main img"
    ]
    
    for selector in fallback_selectors:
        img = soup.select_one(selector)
        if img:
            src = img.get('src') or img.get('data-src')
            if src:
                if src.startswith('//'):
                    src = 'https:' + src
                elif src.startswith('/'):
                    src = 'https://hvacdirect.com' + src
                return src
    
    return None


def scrape_product_details(driver, url):
    """Scrape details from a single product page"""
    print(f"Processing {url}")
    driver.get(url)
    
    try:
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, "product-info-main"))
        )
    except TimeoutException:
        print(f"Failed to load product page: {url}")
        return None
    
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    
    # Extract specifications table
    table = soup.find("table", class_="data table additional-attributes")
    specs = {}
    
    if table:
        for row in table.find_all("tr"):
            key = row.find("th")
            if key is not None:
                key = key.text.strip().lower()
            value = row.find("td")
            if value is not None:
                value = value.text.strip()
            specs[key] = value
    
    # Extract title
    title_element = soup.find("span", class_="base")
    title = title_element.text.strip() if title_element else "unknown"
    
    # Extract main product image
    main_image = extract_main_product_image(soup)
    
    return {
        "specs": specs,
        "title": title,
        "image": main_image,  
        "url": url  # save the product URL for reference
    }


def process_product_data(product_data, category_name, data_by_brand):
    """Process scraped product data and add to the main data structure"""
    if not product_data:
        return
    
    specs = product_data["specs"]
    title = product_data["title"]
    main_image = product_data.get("image")  
    product_url = product_data.get("url", "")
    
    # Build the model data
    model = {
        "sku": specs.get("sku", "unknown"),
        "electrical": specs.get("electrical", "unknown"),
        "title": title,
        "image": main_image,  
        "product_url": product_url
    }
    
    # Extract brand
    brand = extract_field(specs, ["brand", "manufacturer"])
    
    # Add to data structure
    if brand not in data_by_brand:
        data_by_brand[brand] = []
    
    # Check if category already exists for this brand
    found = False
    for entry in data_by_brand[brand]:
        if entry["category"] == category_name:
            entry["models"].append(model)
            found = True
            break
    
    if not found:
        data_by_brand[brand].append({
            "category": category_name,
            "models": [model]
        })


def main():
    # Define categories to scrape
    categories = {
        "Air Conditioning Condensers": "https://hvacdirect.com/air-conditioner-condensers.html",
        "Heat Pumps": "https://hvacdirect.com/heat-pump-condensers-ac.html",
        "Furnaces": "https://hvacdirect.com/furnaces.html",
        "Water Heaters and Boilers": "https://hvacdirect.com/water-pools-plumbing/water-heaters-boilers.html",
        "Air Handlers": "https://hvacdirect.com/air-handlers.html",
        # Add more categories as needed
    }
    
    file_path = "../src/data/organized.json"
    
    # Load existing data
    data_by_brand = load_existing_data(file_path)
    
    # Setup Chrome driver
    chrome_options = Options()
    # add options to run headless if desired
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        for category_name, category_url in categories.items():
            print(f"\n{'='*50}")
            print(f"SCRAPING CATEGORY: {category_name}")
            print(f"{'='*50}")
            
            # Get all product URLs for this category
            product_urls = scrape_category_urls(driver, category_url, category_name)
            
            # Process each product (limit to first 100 for testing)
            for url in product_urls[:100]:  # Remove [:100] to process all products
                try:
                    product_data = scrape_product_details(driver, url)
                    process_product_data(product_data, category_name, data_by_brand)
                except Exception as e:
                    print(f"Error processing {url}: {e}")
                    continue
            
            # Save data after processing each category
            save_data(data_by_brand, file_path)
            print(f"Completed scraping {category_name}")
    
    finally:
        driver.quit()
    
    print(f"\nScraping completed! Final data saved to {file_path}")
    
    total_products = 0
    for brand, categories in data_by_brand.items():
        brand_total = sum(len(cat["models"]) for cat in categories)
        total_products += brand_total
        print(f"{brand}: {brand_total} products across {len(categories)} categories")
    
    print(f"Total products scraped: {total_products}")


if __name__ == "__main__":
    main()