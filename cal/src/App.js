import './App.css';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EmailCheckboxList from './EmailCheckboxList';
// import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
// import "antd/dist/antd.css";
import 'antd/dist/reset.css';
const localizer = momentLocalizer(moment)

let  myEventsList = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2024, 0, 9, 9, 0, 0),
    end: new Date(2024, 0, 9, 13, 0, 0),
    resourceId: 1,
    colorEvento:'yellow',
  },
  {
  id: 1,
  title: 'MS training',
  start: new Date(2024, 0, 9, 12, 0, 0),
  end: new Date(2024, 0, 9, 16, 30, 0),
  colorEvento:'red',
  resourceId: 2,
},
 {
  id: 3,
  title: 'MS training',
  start: new Date(2024, 0, 9, 12, 0, 0),
  end: new Date(2024, 0, 9, 16, 30, 0),
  colorEvento:'green',
  resourceId: 4,
}];

function App() {

  const [events, setEvents] = useState(myEventsList);
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div className="App">
      <header className="App-header">
        <EmailCheckboxList selectedDate={ selectedDate } updatedEvents={setEvents} />
      </header>

      <Calendar
        showMultiDayTimes
        dayLayoutAlgorithm={'no-overlap'}
        defaultView={Views.WEEK}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        min={new Date(2024, 1, 1, 7, 0, 0)}
        max={new Date(2024, 1, 16, 19, 0, 0)}
        step={30}
        style={{ height: 600 }}
        selectedDate={ new Date() }
        onSelectSlot={(slotInfo) => {
          console.log(slotInfo);
        }}
        // onDrillDown={(date) => {
        //   console.log(date);
        //   setSelectedDate(date);
        // }}
        eventPropGetter={(myEventsList) => {
          const backgroundColor = myEventsList.colorEvento ? myEventsList.colorEvento : 'yellow';
          const color = myEventsList.color ? myEventsList.color : 'black';
          return { style: { backgroundColor ,color} }
        }}
      />
      
      <header className="App-header">

      </header>
    </div>
  );
}

export default App;
