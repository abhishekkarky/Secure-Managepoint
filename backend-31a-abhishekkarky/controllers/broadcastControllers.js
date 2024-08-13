const broadcast = require("../model/broadcastModel");
const group = require("../model/groupModel");
const nodemailer = require("nodemailer");
const users = require("../model/userModel");
const Subscriber = require("../model/subscriberModel");
const moment = require("moment");
const path = require("path");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.MP_USER_EMAIL}`,
    pass: `${process.env.MP_EMAIL_PASS}`,
  },
});

const createBroadcast = async (req, res) => {
  const id = req.params.id;

  console.log(req.body);

  const {
    broadcastTitle,
    broadcastTo,
    broadcastGroup,
    broadcastTime,
    broadcastDescription,
    sendTo,
    broadcastStatus,
    broadcastVisibility,
  } = req.body;

  if (
    !broadcastTitle ||
    !broadcastTo ||
    !broadcastTime ||
    !broadcastDescription
  ) {
    return res.status(403).json({
      success: false,
      message: "Please fill all details",
    });
  }

  try {
    let subscriberIds = [];

    if (broadcastGroup) {
      let subscriber = await group.findById({
        _id: broadcastGroup,
      });
      const newBroadcast = new broadcast({
        broadcastTitle,
        broadcastTo,
        broadcastGroup,
        broadcastTime,
        broadcastDescription,
        addedBy: req.user.id,
        sendTo: subscriber.subscribers,
        broadcastStatus,
        broadcastVisibility,
      });
      await newBroadcast.save();
      subscriberIds = subscriber.subscribers;
    } else {
      const newBroadcast = new broadcast({
        broadcastTitle,
        broadcastTo,
        broadcastTime,
        broadcastDescription,
        addedBy: req.user.id,
        sendTo,
        broadcastStatus,
        broadcastVisibility,
      });
      await newBroadcast.save();
      subscriberIds = sendTo;
    }

    if (broadcastStatus !== "Draft" && broadcastStatus !== "Queued") {
      let emails = await Subscriber.find({
        _id: { $in: subscriberIds },
      });

      const userDetail = await users.findById(req.user.id);

      const templatePath = path.resolve(
        __dirname,
        "../templates/broadcastTemplates.html"
      );
      const template = fs.readFileSync(templatePath, "utf-8");

      for (const email of emails) {
        const unsubscribeLink = `http://localhost:3000/unsubscribe/${userDetail.id}/${email._id}`;
        const html = template
          .replace("{broadcastTitle}", broadcastTitle)
          .replace("{broadcastDescription}", broadcastDescription)
          .replace("{addedBy.fullName}", userDetail.fullName)
          .replace("{addedBy.address}", userDetail.address)
          .replace("{unsubscribeLink}", unsubscribeLink);

        const mailOptions = {
          from: userDetail.email,
          to: email.email,
          subject: "New Broadcast",
          html: html,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent to " + email.email + ": " + info.response);
        } catch (error) {
          console.error("Error sending email to " + email.email + ": " + error);
        }
      }
    } else if (broadcastStatus === "Queued") {
      const broadcastDateTime = moment(broadcastTime);
      const currentDateTime = moment();
      const delay = broadcastDateTime.diff(currentDateTime);

      if (delay > 0) {
        setTimeout(async () => {
          try {
            let emails = await Subscriber.distinct("email", {
              _id: { $in: subscriberIds },
            });

            const userDetail = await users.findById(req.user.id);

            const templatePath = path.resolve(
              __dirname,
              "../templates/broadcastTemplates.html"
            );
            const template = fs.readFileSync(templatePath, "utf-8");

            for (const email of emails) {
              const unsubscribeLink = `http://localhost:3000/unsubscribe/${userDetail.id}/${email._id}`;
              const html = template
                .replace("{broadcastTitle}", broadcastTitle)
                .replace("{broadcastDescription}", broadcastDescription)
                .replace("{addedBy.fullName}", userDetail.fullName)
                .replace("{addedBy.address}", userDetail.address)
                .replace("{unsubscribeLink}", unsubscribeLink);

              const mailOptions = {
                from: userDetail.email,
                to: email,
                subject: "New Broadcast",
                html: html,
              };

              try {
                const info = await transporter.sendMail(mailOptions);
                console.log("Email sent to " + email + ": " + info.response);
              } catch (error) {
                console.error("Error sending email to " + email + ": " + error);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }, delay);
      }
    }

    res.status(200).json({
      success: true,
      message: "Broadcast successful !!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const getAllBroadcast = async (req, res) => {
  const id = req.user.id;

  try {
    const page = parseInt(req.query._page, 10) || 1;
    const limit = parseInt(req.query._limit, 10) || 10;
    const skip = (page - 1) * limit;

    const broadcastDraft = await broadcast
      .find({
        addedBy: id,
        broadcastStatus: "Draft",
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const broadcastQueued = await broadcast
      .find({
        addedBy: id,
        broadcastStatus: "Queued",
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const broadcastSent = await broadcast
      .find({
        addedBy: id,
        broadcastStatus: "Sent",
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const broadcastAll = await broadcast
      .find({
        addedBy: id,
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Fetched successfully",
      draft: broadcastDraft,
      queued: broadcastQueued,
      sent: broadcastSent,
      all: broadcastAll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const totalBroadcastCount = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.id;

    const countOfBroadcast = await broadcast.countDocuments({
      addedBy: userId,
    });

    res.status(200).json({
      success: true,
      message: "Total broadcast count fetched successfully",
      count: countOfBroadcast,
    });
  } catch (error) {
    console.error("Error fetching total broadcast count:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getSingleBroadcast = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      res.json({
        success: false,
        message: "Id not found !!",
      });
    }
    const broadcastData = await broadcast.findById(id);
    res.json({
      success: true,
      message: "Broadcast Fetched By Id",
      broadcastData: broadcastData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateBroadcastById = async (req, res) => {
  const id = req.params.id;

  console.log(req.body);

  const {
    broadcastTitle,
    broadcastTo,
    broadcastGroup,
    broadcastTime,
    broadcastDescription,
    sendTo,
    broadcastStatus,
    broadcastVisibility,
  } = req.body;

  if (
    !broadcastTitle ||
    !broadcastTo ||
    !broadcastTime ||
    !broadcastDescription
  ) {
    return res.status(403).json({
      success: false,
      message: "Please fill all details",
    });
  }

  try {
    let subscriberIds = [];

    if (broadcastGroup) {
      let subscriber = await group.findById({
        _id: broadcastGroup,
      });
      const updatedBroadcast = {
        broadcastTitle,
        broadcastTo,
        broadcastGroup,
        broadcastTime,
        broadcastDescription,
        addedBy: req.user.id,
        sendTo: subscriber.subscribers,
        broadcastStatus,
        broadcastVisibility,
      };
      await broadcast.findByIdAndUpdate(id, updatedBroadcast);
      subscriberIds = subscriber.subscribers;
    } else {
      const updatedBroadcast = {
        broadcastTitle,
        broadcastTo,
        broadcastTime,
        broadcastDescription,
        addedBy: req.user.id,
        sendTo,
        broadcastStatus,
        broadcastVisibility,
      };
      await broadcast.findByIdAndUpdate(id, updatedBroadcast);
      subscriberIds = sendTo;
    }

    if (broadcastStatus !== "Draft" && broadcastStatus !== "Queued") {
      let emails = await Subscriber.find({
        _id: { $in: subscriberIds },
      });

      const userDetail = await users.findById(req.user.id);

      const templatePath = path.resolve(
        __dirname,
        "../templates/broadcastTemplates.html"
      );
      const template = fs.readFileSync(templatePath, "utf-8");

      for (const email of emails) {
        const unsubscribeLink = `http://localhost:3000/unsubscribe/${userDetail.id}/${email._id}`;
        const html = template
          .replace("{broadcastTitle}", broadcastTitle)
          .replace("{broadcastDescription}", broadcastDescription)
          .replace("{addedBy.fullName}", userDetail.fullName)
          .replace("{addedBy.address}", userDetail.address)
          .replace("{unsubscribeLink}", unsubscribeLink);

        const mailOptions = {
          from: userDetail.email,
          to: email.email,
          subject: "New Broadcast",
          html: html,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent to " + email.email + ": " + info.response);
        } catch (error) {
          console.error("Error sending email to " + email.email + ": " + error);
        }
      }
    } else if (broadcastStatus === "Queued") {
      const broadcastDateTime = moment(broadcastTime);
      const currentDateTime = moment();
      const delay = broadcastDateTime.diff(currentDateTime);

      if (delay > 0) {
        setTimeout(async () => {
          try {
            let emails = await Subscriber.distinct("email", {
              _id: { $in: subscriberIds },
            });

            const userDetail = await users.findById(req.user.id);

            const templatePath = path.resolve(
              __dirname,
              "../templates/broadcastTemplates.html"
            );
            const template = fs.readFileSync(templatePath, "utf-8");

            for (const email of emails) {
              const html = template
                .replace("{broadcastTitle}", broadcastTitle)
                .replace("{broadcastDescription}", broadcastDescription)
                .replace("{addedBy.fullName}", userDetail.fullName)
                .replace("{addedBy.address}", userDetail.address)
                .replace("{unsubscribeLink}", unsubscribeLink);

              const mailOptions = {
                from: userDetail.email,
                to: email,
                subject: "New Broadcast",
                html: html,
              };

              try {
                const info = await transporter.sendMail(mailOptions);
                console.log("Email sent to " + email + ": " + info.response);
              } catch (error) {
                console.error("Error sending email to " + email + ": " + error);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }, delay);
      }
    }

    res.status(200).json({
      success: true,
      message: "Broadcast updated successfully !!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const deleteBroadcastById = async (req, res) => {
  const id = req.params.id;
  try {
    await broadcast.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Deleted Successfully !!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const broadcastCountForGraph = async (req, res) => {
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
        .status(400)
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

      const count = await broadcast.countDocuments({
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
        addedBy: userId,
      });
      counts.push(count);
    }

    res.status(200).json({
      success: true,
      message: "Broadcast data fetched successfully",
      counts: counts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  createBroadcast,
  getAllBroadcast,
  totalBroadcastCount,
  getSingleBroadcast,
  deleteBroadcastById,
  updateBroadcastById,
  broadcastCountForGraph,
};
