import * as React from 'react';
import {
  ScheduleComponent,
  Day,
  Agenda,
  WorkWeek,
  Week,
  Month,
  Inject,
  ViewsDirective,
  ViewDirective
} from '@syncfusion/ej2-react-schedule';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import './App.css';

const App = () => {
  let calendarID: string = "en.indian#holiday@group.v.calendar.google.com";
  let apiAccessKey: string = "AIzaSyDfLF9DvncgSrwOmjz5z4EFZFVFdftataY";


  let remoteData: DataManager = new DataManager({
    url: 'https://www.googleapis.com/calendar/v3/calendars/' + calendarID + '/events?key=' + apiAccessKey,
    adaptor: new WebApiAdaptor(),
    crossDomain: true
  });

  function onDataBinding(e: Record<string, any>): void {
    let items: Record<string, any>[] = (e.result as Record<string, Record<string, any>[]>).items;
    let schedulerData: Record<string, any>[] = [];

    if (items.length > 0) {
      for (let event of items) {
        let isAllDay: boolean = !event.start.dateTime;
        let start: string = event.start.dateTime as string;
        let end: string = event.end.dateTime as string;
        if (isAllDay) {
          start = event.start.date as string;
          end =  event.end.date as string;
        }
        schedulerData.push({
          Id: event.id,
          Subject: event.summary,
          StartTime: new Date(start),
          EndTime: new Date(end),
          IsAllDay: isAllDay
        })

      }
    }
    e.result = schedulerData;
  }

  function RemoveTopBanner() {
    setTimeout(() => {
      const RootContainer = document.getElementById("root");
      const Banner = RootContainer?.nextElementSibling;
      Banner?.remove()
    }, 1000)
   
  }
  RemoveTopBanner();

  return (
    <div>
      <ScheduleComponent width='100%' height='550px' selectedDate={new Date(2023, 11, 23)} currentView="Month"
      eventSettings={{dataSource: remoteData}}
      dataBinding={onDataBinding}>
        <ViewsDirective>
          <ViewDirective option='WorkWeek' startHour='10:00' endHour='18:00' />
          <ViewDirective option='Week' startHour='07:00' endHour='15:00' />
          <ViewDirective option='Month' showWeekend={false} />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </div>
  );

  
}
export default App;
