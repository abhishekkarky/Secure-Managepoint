const Subscriber = require("../model/subscriberModel");
const users = require("../model/userModel");
const csvtojson = require("csvtojson");
const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs");
const path = require("path");

const createSubscriber = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const userId = req.user.id;

  const { fullName, email } = req.body;

  if (!fullName || !email) {
    return res.status(403).json({
      success: false,
      message: "Please fill all the fields.",
    });
  }

  try {
    const newSubscriber = new Subscriber({
      fullName: fullName,
      email: email,
      addedBy: userId,
    });

    await newSubscriber.save();

    await users.findByIdAndUpdate(
      req.user.id,
      { $push: { subscribers: newSubscriber._id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Subscriber added successfully",
      data: newSubscriber,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const getAllSubscribers = async (req, res) => {
  console.log(req.body);
  try {
    console.log(req.user);

    const userDetail = await users.findById(req.user.id);

    const subscriberIds = userDetail.subscribers;

    const page = parseInt(req.query._page, 10);
    const limit = parseInt(req.query._limit, 10);

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      const listOfSubscribers = await Subscriber.find({
        _id: { $in: subscriberIds },
      })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);

      return res.json({
        success: true,
        subscribers: listOfSubscribers,
        message: "Subscribers successfully fetched",
      });
    }

    const listOfSubscribers = await Subscriber.find({
      _id: { $in: subscriberIds },
    }).sort({ _id: -1 });

    res.status(200).json({
      success: true,
      message: "Subscribers fetched successfully",
      subscribers: listOfSubscribers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const totalsubscriberCount = async (req, res) => {
  try {
    console.log(req.user);
    const userDetail = await users.findById(req.user.id);
    const subscriberCountId = userDetail.subscribers;
    const countOfSubscribers = await Subscriber.countDocuments({
      _id: { $in: subscriberCountId },
    });
    res.status(200).json({
      success: true,
      message: "Total subscriber count fetched successfully",
      count: countOfSubscribers,
    });
  } catch (error) {
    console.error("Error fetching total subscriber count:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getSingleSubscriber = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(403).json({
      message: "No record with given id:",
      success: false,
    });
  }
  try {
    const singleSubscriber = await Subscriber.findById(id);
    res.status(200).json({
      success: true,
      message: "Subscriber Fetched",
      subscriberData: singleSubscriber,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const deleteSubscriberById = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    await Subscriber.findByIdAndDelete(id);

    await users.findByIdAndUpdate(userId, { $pull: { subscribers: id } });
    res.status(200).json({
      success: true,
      message: "Subscriber deleted Successfully !!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const updateSubscriberById = async (req, res) => {
  console.log(req.body);

  const id = req.params.id;

  const { fullName, email } = req.body;

  if (!fullName || !email) {
    return res.status(403).json({
      success: false,
      message: "Please fill all fields",
    });
  }

  try {
    const updatedSubscriber = {
      fullName: fullName,
      email: email,
    };

    await Subscriber.findByIdAndUpdate(id, updatedSubscriber);

    res.status(200).json({
      success: true,
      message: "Subscriber Updated Successfully",
      subscriberData: updatedSubscriber,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const handleCsvUpload = async (req, res) => {
  const userId = req.user.id;

  try {
    if (!req.file) {
      return res.status(403).json({
        success: false,
        message: "No file uploaded. Please provide a CSV file.",
      });
    }

    const csvFile = req.file;
    const csvFilePath = path.join(
      __dirname,
      "..",
      "uploads",
      csvFile.originalname
    );
    const fileContent = await fs.promises.readFile(csvFilePath, "utf8");
    const parsedData = await csvtojson().fromString(fileContent);
    const addedSubscribers = await Promise.all(
      parsedData.map(async (subscriberData) => {
        const { fullName, email } = subscriberData;
        if (!fullName || !email) {
          return res.status(403).json({
            success: false,
            message:
              "Please fill all the fields for each subscriber in the CSV.",
          });
        }
        const newSubscriber = new Subscriber({
          fullName: fullName,
          email: email,
          addedBy: userId,
        });

        await newSubscriber.save();
        await users.findByIdAndUpdate(
          userId,
          { $push: { subscribers: newSubscriber._id } },
          { new: true }
        );
        return {
          _id: newSubscriber._id,
          fullName: newSubscriber.fullName,
          email: newSubscriber.email,
        };
      })
    );
    const addedSubscribersCount = addedSubscribers.length;
    await fs.promises.unlink(csvFilePath);
    res.status(200).json({
      success: true,
      message: `${addedSubscribersCount} subscribers added.`,
      data: addedSubscribers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const subscriberCountForGraph = async (req, res) => {
  const userId = req.user.id;
  try {
    let { startTimestamp, endTimestamp } = req.query;

    if (!startTimestamp || !endTimestamp) {
      const currentYear = new Date().getFullYear();
      startTimestamp = `${currentYear}-01-01T00:00:00.000Z`;

      endTimestamp = new Date().toISOString();
    }

    const isValidDate = (dateString) => {
      const date = new Date(dateString);
      return !isNaN(date.valueOf());
    };

    if (!isValidDate(startTimestamp) || !isValidDate(endTimestamp)) {
      console.log("Invalid timestamp format");
      return res
        .status(403)
        .json({ success: false, message: "Invalid timestamp format" });
    }

    const counts = [];
    for (let month = 1; month <= 12; month++) {
      const startOfMonth = new Date(startTimestamp);
      startOfMonth.setUTCMonth(month - 1);
      startOfMonth.setUTCDate(1);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setUTCMonth(month);
      endOfMonth.setUTCDate(0);

      const count = await Subscriber.countDocuments({
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
        addedBy: userId,
      });
      counts.push(count);
    }

    const currentMonth = new Date().getMonth();

    const previousMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;

    const previousMonthCount = counts[previousMonthIndex];

    const currentMonthCount = counts[currentMonth];

    const growthRate =
      ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;

    await users.findByIdAndUpdate(
      userId,
      { growth: growthRate },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Subscriber data fetched successfully",
      counts: counts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const exportSubscribersToCSV = async (req, res) => {
  const userId = req.user.id;
  try {
    const subscribers = await Subscriber.find({
      addedBy: userId,
    });

    const csvData = subscribers.map((subscriber) => ({
      Name: subscriber.fullName,
      Email: subscriber.email,
      Date: new Date(subscriber.date).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }));

    const csvFilePath = path.join(
      __dirname,
      "..",
      "uploads",
      `${userId}-subscribers.csv`
    );

    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: "Name", title: "Subscriber's Name" },
        { id: "Email", title: "Subscriber's Email" },
        { id: "Date", title: "Subscribed Date" },
      ],
    });

    csvWriter.writeRecords(csvData).then(() => {
      res.status(200).json({
        success: true,
        message: "Subscribers exported successfully",
        downloadLink: `${
          process.env.BACKEND_URL + process.env.PORT
        }/uploads/${userId}-subscribers.csv`,
      });
    });
  } catch (error) {
    console.error("Error exporting subscribers to CSV:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createSubscriber,
  getAllSubscribers,
  totalsubscriberCount,
  deleteSubscriberById,
  getSingleSubscriber,
  updateSubscriberById,
  handleCsvUpload,
  subscriberCountForGraph,
  exportSubscribersToCSV,
};
