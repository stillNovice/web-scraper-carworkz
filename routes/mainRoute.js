import express from 'express';
import fs from 'fs';
import cheerio from 'cheerio';
import rp from 'request-promise';
import request from 'request';
import util from 'util';
import chalk from 'chalk';

import Listing from '../models/listing';

const router = express.Router();

const url = 'https://www.carworkz.com/mumbai/regular-service/';
const baseUrl = url + '?format=json&page=';

var getListings = function(pageIdx) {
  return rp({
      "method": "GET",
      "uri": baseUrl + pageIdx,
      "json": true
    })
    .then(function(response) {
      if(!response.listing && response.listing == "") {
        return '';
      }

      console.log(chalk.cyan(`processing data...`));
      return getListings(pageIdx + 1)
        .then(restOfTheData => {
          return response.listing + restOfTheData;
        });
    })
    .catch(function(err) {
      return err;
    })
}

function processDOM(req, res, $, ul) {
  //console.log(ul.get(0).children.length);
  let listingsArr = [];
  ul.get(0).children.forEach(function(elem, idx) {
    let name = $(elem).children().find('h4.head_title').text();
    let number_rating = $(elem).children().find('span.number_rating').text();
    let thumbs_up = $(elem).children().find('div a.per_votes').text();
    let image_src = $(elem).children().first().find('img').attr('src');
    let yrs_exp = $(elem).children().first().find('span.yrs_exp').text();
    
    let ratings = {
      number_rating: number_rating,
      thumbs_up: thumbs_up
    };

    // features
    let features = [];
    $(elem).children().first().next().find('div.mob_list_fetr li').each((idx, thisElem) => {
      features.push($(thisElem).find('span.txt').text());
    });
    
    // working days
    let working_days = {};
    let dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    $(elem).children().first().next().find('div.location li.working_days li').each((idx, thisElem) => {
      working_days[dayOfWeek[idx]] = $(thisElem).hasClass('off') ? false: true;
    });

    // work timings
    let work_timings = $(elem).children().first().next().find('div.location li.working_days span.wrk_timing').text();
    
    // services;
    let services_types = '';
    $(elem).children().first().next().first().find('div.location li.list_jobs a').each((idx, thisElem) => {
      services_types += $(thisElem).text();
    });

    // service ratings
    let service_quality_ratings = {};
    $(elem).children().first().next().find('li.clearfix').each((idx, thisElem) => {
      service_quality_ratings[$(thisElem).text().replace("\"", '')] = $(thisElem).find('ul.review_rate span.active').length;
    });

    // location - name, distance
    let location_data = {}
    location_data.distance = $(elem).children().first().next().next().find('div.location_distance div.distance span').first().next().text();
    location_data.name = $(elem).children().first().next().next().find('div.location_distance div.location span').text();

    let listing = {
      name: name,
      image_src: image_src,
      ratings: ratings,
      features: features,
      working_days: working_days,
      work_timings: work_timings,
      services_types: services_types,
      service_quality_ratings: service_quality_ratings,
      location_data: location_data
    };

    //console.log(listing);

    listingsArr.push(listing);
  });

  //console.log('arrayLength', listingsArr.length);

  Listing.saveMany(listingsArr, function (err_) {
    if(err_) {
      throw err_;
    }
    //console.log(`inserted ${listingsArr.length} records`);
    console.log(chalk.green(`data stored in db successfully`));
    console.log(chalk.green(`Scraping done, now you can use the API's`));
    res.send('<h1 style="color: green;">Scraping done, you can use the API\'s Now</h1>');
  });
}


function startScraping(req, res, next) {
  console.log(chalk.cyan(`Scraping started`));
  request(url, function(err, response, html) {
    if(err) {
      throw err;
    }

    const $ = cheerio.load(html);
    let ul = $('ul.data-list');
    
    getListings(2)
    .then(function(listings) {
      ul.append(listings);

      fs.writeFile('./src/dataFile.txt', $.html($('html')), function(err) {
        if(err) {
          console.error(chalk.red(err));
          return;
        }
        processDOM(req, res, $, ul);
      });
    })
    .catch(function (err) {  
      console.log(chalk.red(err));
    });
  });
};

router.get('/', function(req, res, next) {
  Listing.getCount(function (_err, count) {
    if(count < 400) {
      startScraping(req, res, next);
    } else {
      res.send('<h1 style="color: green;">Scraping done, you can use the API\'s Now</h1>');
    }
  });
  
});

export default router;