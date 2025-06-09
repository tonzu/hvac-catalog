# HVAC Catalog

Simple web interface of HVAC catalog with nested product navigation, model details, and search functionality.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Data Sources and Structure

[HVAC Direct](hvacdirect.com) was my main source of data, through the process of web scraping with the use of Selenium and Beautiful Soup. The website is organized by category only, so I just scraped all products of a handful of categories, and found the brand, SKU, and voltage/phase for each product on its corresponding product page. I then reorganized the data into a JSON file, which is organized into brands, categories, and then models, where at the lowest level the model contains the SKU, voltage/phase, name of the product in English, an image to display on the app, and the source url for reference. Names in the JSON are all lowercase except for the brands, and the values for each model are not processed as to display them in their original form. 

## Setup Instructions

I have already created the JSON file `organized.json`, so there is no need to run the `scrape_hvacdirect.py` script; it is only there to show my work. The script can be modified to get other categories of data and more specs if desired. After cloning the repo, the commands 
```
npm install
npm run dev
```
should be all you need to run the web app, which should be located at http://localhost:5173/. If you want to run the script, you may have to install `selenium`, `webdriver-manager`, and `beautifulsoup` with `pip`. 

## Usage and Features

The first page that should show up is the list of brands. The navigation structure, as aforementioned, is `brand > category > model`. Just click/tap on a brand to go to the categories that the brand has, and then choose a category to view the models that satisfy the chosen category and brand. There is a breadcrumb feature if you want to go back to a certain part of the hierarchy, and the back button only goes up the hierarchy, not always to the page you were on before. The search bar filters by simple string-matching as you type and is not case-sensitive. 

## Challenges and Solutions

Researching what sources to use probably felt like the least productive time. I was looking for a simple database/spreadsheet to use, but there wasn’t any out there that was sufficiently comprehensive, so I concluded that I had to make my own. I considered HVAC Direct from the start, but wanted to see if there were easier ways to go about it. I decided on HVAC Direct because if I scraped each brand individually, I would have to make a new scraper for each brand’s site, so HVAC Direct provided uniformity. I also saw product catalog pdfs that I could have used, but decided that scanning PDFs would be less effective than taking HTML directly. 
Also, I have web scraped in the past, but since I was working with news articles, I only had to deal with HTML, so I hadn’t used Selenium before. 

When scraping, I ran into cases where models had brands labeled as “Private Company” or “Online Supply”, so if I wanted to fix them then I would have to manually do so. The web app currently just ignores these. 

## What Could be Improved/Implemented

The search function is pretty simple, but if someone wanted to search for a category first, then this would be difficult given the current hierarchy structure. Also if you saw a model SKU but you didn’t know the brand, this would be difficult as well. Also adding the “commonly searched” products or brands would be a nice add, especially if there are a lot of them. 

More data could be taken from other sources for a larger coverage of products. HVAC Direct has subcategories (which i used) within its categories, and also subsubcategories, so that would be nice to have within the hierarchy as well. I also did not have product lines because HVAC Direct does not have them, so this would have to be taken from other sources too. I noticed that a lot of products in the same line have the same prefix or suffix, so this could be done in code as well. 

Lastly, adding the manual PDF viewer for each model would be nice, but HVAC Direct didn’t have manuals on their website so I would have to get those elsewhere, like [ManyManuals](https://manymanuals.com/). 
