const express = require("express");
const { google } = require("googleapis");
const moment = require("moment");
const mongoose = require("mongoose");
const {
  getOAuth2Client,
  getGoogleAuthURL,
  getGoogleUser,
} = require("./config/google-auth");
const { getFreeIntervals } = require("./utils/intervals");
const User = require("./models/user.model");
const Meeting = require("./models/meeting.model");
const Login = require("./models/login.model");
require("dotenv").config();
require("./config/mongoose");
var cors = require('cors')
const url = require('url');
const path = require('path');


const calendar = google.calendar("v3");
const app = express();
app.use(cors())

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(express.json());

const PORT = process.env.PORT || 8080;


app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
      next();
  } else {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      res.sendFile(path.join(__dirname, '/public', 'index.html'));
  }
});

https://api-mobile-stage.nhle.com/v1/scores/2023-11-24
// app.get("/", (req, res) => {
//   if (req.query.code) {
//     return res.redirect(`/auth/google/callback?${req.originalUrl.split("?")[1]}`);
//   }

//   res.render("index");
// });

app.get("/auth/google", (req, res) => {
  res.redirect(getGoogleAuthURL());
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    const googleUser = await getGoogleUser(req.query);

    const { id, email, name } = googleUser.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        _id: new mongoose.Types.ObjectId(),
        googleId: id,
        name,
        email,
        refresh_token: googleUser.refresh_token,
      });

      await user.save();
    }

    res.render("auth", { url: `/calendar/${user._id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // https://github.com/Azure-Samples/ms-identity-javascript-react-spa/tree/main?tab=readme-ov-file
// app.get("/msauth", async (req, res) => {
//   // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//   const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

//   console.log("testing", fullUrl);

//   const parsedUrl = url.parse(req.url, true);
//   console.log("testing", req.url);
//   // const code = parsedUrl.fragment.split('=')[1];

//   console.log('Full URL:', fullUrl);
//   // console.log('Code:', code);

//   let user = new Login({
//           _id: new mongoose.Types.ObjectId(),
//           body: "query: " + fullUrl,
//         });
//         await user.save();
//   res.status(200).json({ user: user });

//   // let user = await User.findOne({ email });
//   // if (!user) {
//   //   try {
//   //     user = new User({
//   //       _id: new mongoose.Types.ObjectId(),
//   //       googleId: id,
//   //       name,
//   //       email,
//   //       refresh_token: googleUser.refresh_token,
//   //     });

//   //     await user.save();
//   //   }
//   //   res.render("auth", { url: `/calendar/${user._id}` });
//   // } catch (err) {
//   //   res.status(500).json({ error: err.message });
//   // }

// });

app.post("/api/calendar/:userId", async (req, res) => {
  console.log("testing", req.body.selectedEmails);
  try {
    const user = await User.findById(req.params.userId);
    const calendarId = user.email;

    // add validation for selectedEmails
    if (!Array.isArray(req.body.selectedEmails) || req.body.selectedEmails.length === 0) {
      return res.status(400).json({ error: "Invalid selectedEmails" });
    }

    let items = req.body.selectedEmails.map((email) => ({
      id: email,
    }));
   

    // add validation for selectedDateRange
    let selectedDateRange = req.body.selectedDateRange;
    if (!selectedDateRange || !selectedDateRange.start || !selectedDateRange.end) {
      return res.status(400).json({ error: "Invalid selectedDateRange" });
    }

    items.push({ 
      id: calendarId,
    });
    console.log(items);

    let selectedDate = req.query.selectedDate;
    if (!selectedDate || selectedDate === "null") {
      selectedDate = new Date();
    } else {
      selectedDate = new Date(selectedDate);
    }

    const data = await calendar.freebusy.query({
      auth: getOAuth2Client(user.refresh_token),
      requestBody: {
        timeMin: moment(selectedDateRange.start).startOf("day").format(),
        timeMax: moment(selectedDateRange.end).endOf("day").format(),
        items: items,
        timeZone: "EST",
      },
    });

    console.log("Testing", data.data.calendars);
    const combinedBusyProperties = Object.values(data.data.calendars)
      .map(person => {
        console.log(person);
        return person.busy
      }) // Extract the 'busy' arrays
      .flat(); // Flatten the nested arrays into a single array

    console.log(combinedBusyProperties);

    const busyIntervals = combinedBusyProperties;
    const freeIntervals = getFreeIntervals(selectedDate, busyIntervals);
 
    res.status(200).json({ freeIntervals, busyIntervals, selectedDate, "cals": data.data.calendars });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get("/calendar/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const calendarId = user.email;

    let selectedDate = req.query.selectedDate;
    if (!selectedDate || selectedDate === "null") {
      selectedDate = new Date();
    } else {
      selectedDate = new Date(selectedDate);
    }

    const data = await calendar.freebusy.query({
      auth: getOAuth2Client(user.refresh_token),
      requestBody: {
        timeMin: moment(selectedDate).startOf("day").format(),
        timeMax: moment(selectedDate).endOf("day").format(),
        items: [
          {
            id: calendarId,
          },
          {
            id: "cesar.aguilar@monstar-lab.com",
          },
          {
            id: "matthew.knuti@monstar-lab.com",
          },
        ],
        timeZone: "EST",
      },
    });

    const combinedBusyProperties = Object.values(data.data.calendars)
    .map(person => {
      // console.log(person);
      return person.busy
    }) // Extract the 'busy' arrays
    .flat() // Flatten the nested arrays into a single array
    .sort((a, b) => {
      return new Date(a.start) - new Date(b.start);
    });
    

  console.log("combinedBusy: ", combinedBusyProperties);

  const busyIntervals = combinedBusyProperties;
  const freeIntervals = getFreeIntervals(selectedDate, busyIntervals);

  console.log("freeIntervals: ", freeIntervals);

    res.render("calendar", {
      freeIntervals: freeIntervals,
      busyIntervals: busyIntervals,
      selectedDate: selectedDate,
      "cals": data.data.calendars
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.get("/meeting/:userId", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);

//     console.log(req.query.selectedInterval);

//     const startTime = new Date(
//       req.query.selectedInterval
//       //.slice(0, -5).concat("+0530")
//     );
//     const endTime = moment(startTime).clone().add(30, "m");

//     const data = await calendar.events.insert({
//       auth: getOAuth2Client(user.refresh_token),
//       calendarId: user.email,
//       requestBody: {
//         start: {
//           dateTime: startTime,
//         },
//         end: {
//           dateTime: endTime,
//         },
//         attendees: [
//           {
//             email: "mytestemail@gmail.com",
//             displayName: "Test Customer",
//           },
//         ],
//         description: "Test sales event",
//         summary: "Sales Meeting",
//       },
//     });

//     const meetingData = {
//       _id: mongoose.Types.ObjectId(),
//       ...data.data,
//     };

//     const meeting = new Meeting(meetingData);
//     await meeting.save();

//     await User.findByIdAndUpdate(req.params.userId, {
//       $push: { meetings: meetingData._id },
//     });
//     res.render("meeting", {
//       organizer: user.name,
//       meetingTime: startTime.toString(),
//       url: `/calendar/${user._id}`
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/admin/meetings", async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     let meetingsData = [];
//     let userData;
//     if (userId) {
//       const populatedUser = await User.findById(userId)
//         .populate("meetings")
//         .exec();

//       userData = {
//         email: populatedUser.email,
//         name: populatedUser.name,
//       };

//       meetingsData = populatedUser.meetings.map((meeting) => ({
//         start: new Date(meeting.start.dateTime).toLocaleString(),
//         end: new Date(meeting.end.dateTime).toLocaleString(),
//         attendee: meeting.attendees[0].email,
//       }));
//     }

//     const users = (await User.find()).map((user) => ({
//       name: user.name,
//       email: user.email,
//       id: user._id,
//     }));

//     return res.render("all-meetings", { users, meetingsData, userData });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.listen(PORT, () => console.log(`SERVER RUNNING AT PORT ${PORT}`));
