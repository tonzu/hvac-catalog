from selenium import webdriver
from bs4 import BeautifulSoup
import time
import json
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

chrome_options = Options()
# chrome_options.add_argument("--headless")

# Setup
driver = webdriver.Chrome(options=chrome_options)
# driver.get("https://hvacdirect.com/2-ton-13-4-seer2-goodman-air-conditioner-condenser-r32-glxs3bn2410.html")
page = 1
product_urls = []
while True:
    driver.get("https://hvacdirect.com/air-conditioning-systems.html"+"?p="+str(page))
    # time.sleep(3)  # wait for JS to load
    try:
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".products.wrapper"))
        )
    except TimeoutException:
        break

    soup = BeautifulSoup(driver.page_source, "html.parser")

    products = soup.select("a.product-item-link")
    if not products:
        break
    
    
    # Process products
    for item in products:
        product_urls.append(item["href"])

    page += 1

print(f"Found {len(product_urls)} product URLs.")

# driver.quit()
all_models = []
data_by_brand = {}
for url in product_urls[:100]:
    print(f"Processing {url}")
    driver.get(url)
    # time.sleep(3)  # wait for JS to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CLASS_NAME, "product-info-main"))
    )
    soup = BeautifulSoup(driver.page_source, 'html.parser')

    table = soup.find("table", class_="data table additional-attributes")
    # print(table.prettify() if table else "No table found")
    specs = {}
    title = soup.find("span", class_="base")
    if table:
        for row in table.find_all("tr"):
            key = row.find("th")
            if key is not None:
                key = key.text.strip().lower()
            value = row.find("td")
            if value is not None:
                value = value.text.strip()
            specs[key] = value

    # print(specs["brand/manufacturer"], specs["sku"], specs["electrical"])

    # Build the data structure
    model = {
        "sku": specs.get("sku", "unknown"),
        "electrical": specs.get("electrical", "unknown"),
        "title": title.text.strip()
    }

    brand = extract_field(specs, ["brand", "manufacturer"])

    category = "Air Conditioner"

    # build organized structure
    if brand not in data_by_brand:
        data_by_brand[brand] = []

    # check if category already exists
    found = False
    for entry in data_by_brand[brand]:
        if entry["category"] == category:
            entry["models"].append(model)
            found = True
            break

    if not found:
        data_by_brand[brand].append({
            "category": category,
            "models": [model]
        })

# Save to file
with open("../src/data/goodman.json", "w") as f:
    json.dump(data_by_brand, f, indent=2)

print("JSON saved to src/data/organized.json")