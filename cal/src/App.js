import './App.css';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment-timezone'
// var moment = require('moment-timezone');

import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EmailCheckboxList from './EmailCheckboxList';
import { Checkbox, Button, Form, Typography, Flex, DatePicker, Layout } from 'antd';

// import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
// import "antd/dist/antd.css";
import 'antd/dist/reset.css';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, MsalProvider } from '@azure/msal-react';
import { loginRequest, msalConfig } from './authConfig';

import { useSearchParams } from 'react-router-dom';


const localizer = momentLocalizer(moment);

moment.tz.setDefault("America/New_York");

let  myEventsList = [
  {
    id: 0,
    title: 'Test',
    start: new Date(2024, 0, 9, 7, 0, 0),
    end: new Date(2024, 0, 9, 13, 0, 0),
    resourceId: 1,
    colorEvento:'yellow',
  }];

function App() {

  const [events, setEvents] = useState(myEventsList);
  const { instance, accounts } = useMsal();
  const [searchParams] = useSearchParams();

  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
        .acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
        })
        .then((response) => {
          console.log(response);
            // callMsGraph(response.accessToken).then((response) => setGraphData(response));
        });
   }

  // console.log(searchParams);
  const query = new URLSearchParams(searchParams);
  const shouldAuth = query.get('auth');
  // console.log(shouldAuth);

  const today = new Date();

  const currentDay = today.getDay();
  const daysToLastMonday = currentDay === 1 ? 7 : (currentDay + 6) % 7;
  const start = moment(today).subtract(daysToLastMonday, 'days').toDate();

  const daysUntilNextFriday = (5 - currentDay + 7) % 7 || 7;
  // console.log(daysUntilNextFriday);
  const end = moment(today).add(daysUntilNextFriday, 'days').toDate();

  const [selectedDateRange, setSelectedDateRange] = useState(
    {
     start: start,
     end: end
    });

     const handleLogin = (loginType) => {
      // loginRedirect
      // loginPopup
          instance.loginPopup(loginRequest)
          .catch(e => {
              console.log(e);
          });
        
      }

  return (
    <div className="App">
      <EmailCheckboxList 
       selectedDateRange={ selectedDateRange }
       updatedEvents={setEvents} 
      />

<div> 
{
 (shouldAuth !== true) ? 
 <Flex align="start" wrap="wrap" gap="small">
    <Button as="button" onClick={() => handleLogin("popup")}>Sign in with AzureAD</Button>
 </Flex>
 :<></>
}
</div>
      <Calendar
        showMultiDayTimes
        dayLayoutAlgorithm={'no-overlap'}
        defaultView={Views.WEEK}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        min={new Date(2024, 1, 1, 5, 0, 0)}
        max={new Date(2024, 1, 16, 18, 0, 0)}
        step={30}
        style={{ height: 660 }}
        selectedDate={ new Date() }
        onSelectSlot={(slotInfo) => {
          console.log(slotInfo);
        }}
        onRangeChange={(rangeInfo) => {
          console.log(rangeInfo);
          let range = { 
            start: rangeInfo[0],
            end: rangeInfo[rangeInfo.length - 1]
          }
          console.log(range);
          setSelectedDateRange(range);
        }}
        eventPropGetter={(myEventsList) => {
          const backgroundColor = myEventsList.colorEvento ? myEventsList.colorEvento : 'yellow';
          const color = myEventsList.color ? myEventsList.color : 'black';
          return { style: { backgroundColor ,color} }
        }}
      />
      <header className="App-header">
        <p>
          Times should be in EST where ever you are viewing the calendar.
        </p>
      </header>
    </div>
  );
}

export default App;
