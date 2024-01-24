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
    title: 'Test',
    start: new Date(2024, 0, 9, 9, 0, 0),
    end: new Date(2024, 0, 9, 13, 0, 0),
    resourceId: 1,
    colorEvento:'yellow',
  }];

function App() {

  const [events, setEvents] = useState(myEventsList);
  // const [selectedDate, setSelectedDate] = useState(new Date());


  const today = new Date();

  const currentDay = today.getDay();
  const daysToLastMonday = currentDay === 1 ? 7 : (currentDay + 6) % 7;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysToLastMonday);

  const daysUntilNextFriday = (5 - currentDay + 7) % 7 || 7;
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + daysUntilNextFriday);

  const [selectedDateRange, setSelectedDateRange] = useState(
    {
     start: start,
     end: end
    }
     );

  return (
    <div className="App">
      <EmailCheckboxList 
      selectedDateRange={ selectedDateRange }
       updatedEvents={setEvents} 
       />
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
      </header>
    </div>
  );
}

export default App;
