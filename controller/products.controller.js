const mongodb = require("mongodb");
const { connectDB, closeConnection } = require("../db/connection");
const { confirmationMail } = require("../lib/sendEmail");

/*Create Order*/
let orderProduct = async (req, res) => {
  try {
    if (req.userId === req.params.uId) {
      const db = await connectDB();
      req.body.createdAt = new Date().toString();
      req.body.role = "USER";
      const productBill = await db
        .collection("products")
        .insertOne({ uId: new mongodb.ObjectId(req.params.uId), ...req.body });
      await closeConnection();
      res.json({
        message: `${productBill.insertedId}`,
        status: true,
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error !" });
  }
};

/*Order List*/
let orderList = async (req, res) => {
  try {
    if (req.userId === req.params.uId) {
      const db = await connectDB();
      const productBill = await db
        .collection("products")
        .find({ uId: new mongodb.ObjectId(req.params.uId) })
        .toArray();
      await closeConnection();
      let result = productBill.reverse();
      res.json(result);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error !" });
  }
};

/*Payment Confirmation mail*/
let confirmSendmail = async (req, res) => {
  try {
    if (req.userId === req.params.uId) {
      const db = await connectDB();
      const productBill = await db
        .collection("products")
        // .find({$and: [
        //   { uId: new mongodb.ObjectId(req.params.uId) },
        //   { _id: new mongodb.ObjectId(req.params.pId) },
        // ],}).toArray();
        .aggregate([
          {
            $match: {
              $and: [
                {
                  uId: new mongodb.ObjectId(req.params.uId),
                },
                {
                  _id: new mongodb.ObjectId(req.params.pId),
                },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "uId",
              foreignField: "_id",
              as: "result",
            },
          },
          {
            $unwind: "$result",
          },
          {
            $project: {
              userName: "$result.userName",
              userEmail: "$result.email",
              provider: "$provider",
              service: "$service",
              title: "$title",
              number: "$number",
              amount: "$amount",
            },
          },
        ]).toArray();

      await confirmationMail(productBill);

      res.json({
        message: "Payment Confirmation mail has been sent to your Email !!",
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error !" });
  }
};

module.exports = { orderProduct, orderList, confirmSendmail };
