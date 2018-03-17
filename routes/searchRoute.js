import mongoose from 'mongoose';
import express from 'express';
import Listing from '../models/listing';

const router = express.Router();

router.get('/', function(req, res, next) {
  Listing.getSearchResult(req.query, function (err, result) {
    if(err) {
      res.send(err);
    }
    res.json(result);
  });
});

export default router;