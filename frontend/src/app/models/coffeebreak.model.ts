import { Tag } from "@app/models/tag.model";
import { CoffeebreakUser } from "@app/models/coffeebreak-user.model";

import * as moment from "moment";

export class Coffeebreak {
  id: number;
  title: string;
  venue: string;
  startAt: Date;
  tags: Array<Tag>;
  users: Array<CoffeebreakUser>;
  dateIdentifier: string;
  isJoined?: boolean;
  endAt?: Date;
  startTime?: string;
  endTime?: string;
  maxParticipants?: number;

  constructor(
    id: number,
    title: string,
    venue: string,
    startAt?: Date,
    endAt?: Date,
    maxP?: number
  ) {
    this.id = id;
    this.title = title || "Kaffeepause";
    this.venue = venue;
    this.startAt = new Date(startAt) || null;
    this.endAt = endAt ? new Date(endAt) : null;
    this.maxParticipants = maxP || null;

    if (
      this.startAt.toLocaleDateString() ===
      moment(new Date()).format("D.M.YYYY")
    ) {
      this.dateIdentifier = "Today";
    } else if (
      this.startAt.toLocaleDateString() ===
      moment(new Date())
        .add(1, "days")
        .format("D.M.YYYY")
    ) {
      this.dateIdentifier = "Tomorrow";
    } else {
      this.dateIdentifier = this.startAt.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }

    this.startTime =
      this.startAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }) || null;

    this.endTime = endAt
      ? this.endAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      : null;
  }

  calculateStartAndEndDateTime(
    date: Date,
    startTime: string,
    endTime?: string
  ) {
    let startDateTime = moment(date);
    let sTime = moment(startTime, "HH:mm");

    startDateTime.set({
      hour: sTime.get("hour"),
      minute: sTime.get("minute")
    });

    if (endTime != "") {
      let endDateTime = moment(date);
      let eTime = moment(endTime, "HH:mm");
      endDateTime.set({
        hour: eTime.get("hour"),
        minute: eTime.get("minute")
      });
      this.endAt = endDateTime.toDate();
    }
    this.startAt = startDateTime.toDate();
  }
}
