import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Listing Schema.
var ListingSchema = new Schema({
  "name": {
    type: String,
    index: true,
    trim: true
  },
  "image_src": {
    type: String,
    trim: true
  },
  "ratings": {
    "number_rating": {
      type: String,
      trim: true
    },
    "thumbs_up": {
      type: String,
      trim: true
    }
  },
  "features": {
    type: Array
  },
  "working_days": {
    "Sun": {
      type: Boolean,
      default: false
    },
    "Mon": {
      type: Boolean,
      default: false
    },
    "Tue": {
      type: Boolean,
      default: false
    },
    "Wed": {
      type: Boolean,
      default: false
    },
    "Thu": {
      type: Boolean,
      default: false
    },
    "Fri": {
      type: Boolean,
      default: false
    },
    "Sat": {
      type: Boolean,
      default: false
    }
  },
  "work_timings": {
    type: String,
    trim: true
  },
  "services_types": {
    type: String,
    trim: true
  },
  "service_quality_ratings": {
    "Service Quality": {
      type: Number,
      default: 0
    },
    "Billing Transparency": {
      type: Number,
      default: 0
    },
    "Timely Delivery": {
      type: Number,
      default: 0
    }
  },
  "location_data": {
    "name": {
      type: String,
      trim: true
    },
    "distance": {
      type: String,
      trim: true
    }
  }
});

const Listing = mongoose.model('listing', ListingSchema);

Listing.saveListing = function (listing, callback) {
  let newListing = new Listing(listing);
  newListing.save(callback);
};

Listing.saveMany = function(listingsArr, callback) {
  Listing.insertMany(listingsArr, callback);
}

Listing.getCount = function(callback) {
  Listing.count(callback);
}

Listing.getSearchResult = function(queryObj, callback) {
  let ratings = queryObj.ratings | 0;
  let nameReg = new RegExp(queryObj.name, 'i');
  let locationNameReg = new RegExp(queryObj.location, 'i');
  console.log(ratings, nameReg, locationNameReg);

  Listing
    .find()
    .where("ratings.number_rating").gte(ratings)
    .where("name", nameReg)
    .where("location_data.name", locationNameReg)
    .exec(callback);
}

export default Listing;