"use strict";

const discount = require("../models/discountModel");
const { getUnselectData, getSelectData } = require("../utils");

class DiscountRepository {
  static async findAllDiscountCodesUnselect({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter,
    unSelect,
    model,
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    return model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getUnselectData(unSelect))
      .lean();
  }

  static async findAllDiscountCodesSelect({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter,
    select,
    model,
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    return model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();
  }
}

module.exports = DiscountRepository;
