const { response } = require("../../utils/response.utils");
const {
  ProductRating,
  Product,
  Store,
  User,
  Profile,
} = require("../../models");

const getRatingStore = async (req, res) => {
  try {
    const { store_id } = req.query;
    if (!store_id)
      return response(res, 400, false, "Store ID is required", null);

    const store = await Store.findOne({ where: { id: store_id } });
    if (!store) {
      return response(res, 404, false, "Store not found", null);
    }

    const whereStore = store_id ? { where: { store_id: store.id } } : {};
    const ratingStores = await ProductRating.findAll({
      attributes: ["id", "rate", "review", "display", "createdAt", "updatedAt"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
          include: [
            { model: Profile, as: "userProfile", attributes: ["id", "name"] },
          ],
        },
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "name_product",
            "desc_product",
            "price",
            "stock",
            "image_product",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: Store,
              as: "store",
              attributes: [
                "id",
                "avatar_link",
                "name",
                "phone",
                "address",
                "province",
                "city",
                "createdAt",
                "updatedAt",
              ],
            },
          ],
        },
      ],
      ...whereStore,
    });
    if (!ratingStores) {
      return response(res, 404, false, "Rating Store not found", null);
    }

    let totalRateStore = 0;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const groupedRatings = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    const totalReviewers = ratingStores.length;

    ratingStores.forEach((rating) => {
      totalRateStore += rating.rate;
      if (rating.rate >= 1 && rating.rate <= 5) {
        ratingCounts[rating.rate]++;
        groupedRatings[rating.rate].push(rating);
      }
    });

    const averageRateStore = totalRateStore / ratingStores.length;

    return response(res, 200, true, "Success get rating store", {
      average_rate_store: averageRateStore,
      total_reviewers: totalReviewers,
      rating_count: ratingCounts,
      grouped_ratings: groupedRatings,
      data: ratingStores,
    });
  } catch (err) {
    console.error("line 79: ", err);
    return response(res, 500, false, "Internal server error", null);
  }
};

module.exports = getRatingStore;
