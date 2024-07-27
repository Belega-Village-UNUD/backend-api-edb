const { response } = require("../../utils/response.utils");
const { getRatingsByProduct } = require("../../utils/orm.utils");

const getRating = async (req, res) => {
  try {
    let product_id = req.query.product_id || false;

    const ratings = await getRatingsByProduct(product_id);
    if (!ratings) {
      return response(res, 404, false, "Product not found", null);
    }

    let totalRating = 0;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const groupedRatings = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    ratings.forEach((rating) => {
      totalRating += rating.rate;
      if (rating.rate >= 1 && rating.rate <= 5) {
        ratingCounts[rating.rate]++;
        groupedRatings[rating.rate].push(rating);
      }
    });

    const averageRating = totalRating / ratings.length;
    const totalReviwer = ratings.length;

    return response(res, 200, true, `Successfull Get Ratings for product`, {
      average_rate_per_product: averageRating,
      total_reviewer: totalReviwer,
      rating_counts: ratingCounts,
      data: ratings,
    });
  } catch (err) {
    console.error(err);
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getRating;
