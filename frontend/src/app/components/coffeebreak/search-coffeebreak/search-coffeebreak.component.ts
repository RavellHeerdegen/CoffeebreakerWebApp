import { CoffeebreakService } from "@app/services/coffeebreak.service";
import { AuthService } from "@app/services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import * as moment from "moment";

// Font Awesome Icons
import {
  faChevronUp,
  faChevronDown,
  faMapMarkerAlt,
  faClock
} from "@fortawesome/pro-light-svg-icons";
import { faUser as fasFaUser } from "@fortawesome/free-solid-svg-icons";
import { faFilter as fasFaFilter } from "@fortawesome/free-solid-svg-icons";

// Models
import { Coffeebreak } from "@app/models/coffeebreak.model";
import { User } from "@app/models/user.model";
import { Tag } from "@app/models/tag.model";

@Component({
  selector: "app-search-coffeebreak",
  templateUrl: "./search-coffeebreak.component.html",
  styleUrls: ["./search-coffeebreak.component.scss"]
})
export class SearchCoffeebreakComponent implements OnInit, OnChanges {
  @Input() changedCoffeebreakJoined: Coffeebreak;
  @Output() coffeebreakClicked = new EventEmitter<Coffeebreak>();

  options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  };

  // Boolean operators
  filtersClosed: boolean;
  myBreaks: boolean;
  loading: boolean;

  // Current date
  dateOfToday: Date;

  // Arrays
  coffeebreaks: Coffeebreak[];
  coffeebreaksFiltered: Coffeebreak[];
  coffeebreakTags: Tag[];
  users: User[];

  // Icons
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faSolidUser = fasFaUser;
  faSolidFilter = fasFaFilter;

  // Strings
  selectedCoffeebreakType = "option1";
  selectedAdditionalFilter = "option1";
  currentUser: User;

  // FormGroups
  filtersFormGroup: FormGroup;

  // Mappings
  typesMapping = {
    option1: "All",
    option2: "Joined",
    option3: "Not joined"
  };

  // Objects
  selectedListItemID: number = 0;

  constructor(
    private coffeebreakService: CoffeebreakService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  /**
   * Called when an coffeebreak list item got clicked and triggers the details-view component
   */
  onClick(coffeebreak: Coffeebreak): void {
    this.coffeebreakClicked.emit(coffeebreak);
  }

  /**
   * Used for initializations when component is loaded
   */
  ngOnInit() {
    this.loading = true;
    this.authService.loadCurrentUser().subscribe(() => {
      this.currentUser = this.authService.currentUser;
    });
    // Get username of currently logged in user to compare with loaded coffeebreaks members

    this.filtersClosed = true; // Default is closed
    this.dateOfToday = new Date(); // For datepicker startAt
    // console.log(this.dateOfToday.toLocaleDateString());

    this.coffeebreakService.getAllTags().subscribe(res => {
      this.coffeebreakTags = res;
    });

    // Set all filters to default values
    this.resetFilterFormValues();

    // Create new coffeebreak array to save the database items
    this.coffeebreaks = new Array<Coffeebreak>();
    this.coffeebreaksFiltered = new Array<Coffeebreak>();

    this.route.params.subscribe(params => {
      if (params["own"]) {
        this.myBreaks = true; // Leads to disabling search-header visibility and only showing breaks the user is joined
      }
    });

    moment.locale();

    // Load coffeebreaks
    this.coffeebreakService.getAllCoffeeBreaks().subscribe(response => {
      this.loading = false;
      this.buildCoffeebreaksListAfterDbCall(response);
    });

    // this.sortListByDateAll();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.changedCoffeebreakJoined &&
      changes.changedCoffeebreakJoined.currentValue
    ) {
      const index = this.coffeebreaksFiltered.findIndex(
        coffeebreak => coffeebreak.id === this.changedCoffeebreakJoined.id
      );

      if (this.myBreaks && !this.changedCoffeebreakJoined.isJoined) {
        this.coffeebreaksFiltered.splice(index, 1);
        if (this.coffeebreaksFiltered.length == 0) {
          console.log(this.coffeebreaksFiltered);
          this.coffeebreakClicked.emit(null);
        } else if (index == this.coffeebreaksFiltered.length) {
          this.coffeebreakClicked.emit(this.coffeebreaksFiltered[index - 1]);
          this.changeBackgroundColorIfSelected(
            this.coffeebreaksFiltered[index - 1]
          );
        } else {
          this.coffeebreakClicked.emit(this.coffeebreaksFiltered[index]);
          this.changeBackgroundColorIfSelected(
            this.coffeebreaksFiltered[index]
          );
        }
      } else {
        this.coffeebreaksFiltered[index] = JSON.parse(
          JSON.stringify(this.changedCoffeebreakJoined)
        );
      }
    }
  }

  /**
   * Builds the coffeebreak list items with database items
   * @param response the found coffeebreaks in the database
   */
  buildCoffeebreaksListAfterDbCall(response: any) {
    for (let i = 0; i < response.length; i++) {
      const coffeebreak = response[i];

      if (this.myBreaks) {
        if (coffeebreak.users.find(user => user.id === this.currentUser.id)) {
          this.coffeebreaks.push(coffeebreak);
        }
      } else {
        this.coffeebreaks.push(coffeebreak);
      }
    }

    this.coffeebreaksFiltered.push(...this.coffeebreaks);

    if (this.myBreaks) {
      this.sortListByDate(2);
      this.selectedAdditionalFilter = "option3";
    } else {
      this.sortListByDate(1);
    }

    // Selects the first coffeebreak in the list
    if (this.coffeebreaksFiltered[0] != undefined) {
      this.coffeebreakClicked.emit(this.coffeebreaksFiltered[0]);
      this.changeBackgroundColorIfSelected(this.coffeebreaksFiltered[0]);
    }
  }

  /**
   * Resets all filter values to their defaults
   */
  resetFilterFormValues() {
    // Creates the form of the filters group for sql query calls
    this.filtersFormGroup = new FormGroup({
      date: new FormControl(""),
      from: new FormControl(""),
      to: new FormControl(""),
      maxp: new FormControl(""),
      location: new FormControl(""),
      type: new FormControl(this.selectedCoffeebreakType),
      topics: new FormControl("")
    });
    this.selectedCoffeebreakType = "option1";
  }

  /**
   * Changes the filters view between open and closed
   */
  changeFiltersClosedState() {
    this.filtersClosed = !this.filtersClosed;
  }

  onFilterChange(event) {
    console.log(event);
    if (event.value === "option1") {
      this.sortListByDate(1);
    } else if (event.value === "option2") {
      this.sortListByDate(0);
    } else {
      this.sortListByDate(2);
    }
  }

  /**
   * Sets a new id if a list item got selected
   * @param coffeebreak the selected coffeebreak
   */
  changeBackgroundColorIfSelected(coffeebreak: Coffeebreak) {
    this.selectedListItemID = coffeebreak.id;
  }

  /**
   * Applies given filters to the list items
   * @param filtersFormGroupValues all given filter values
   */
  applyFilters(filtersFormGroupValues) {
    // this.clearCoffeebreaksList(this.coffeebreaksFiltered);
    // this.coffeebreaksFiltered.push(...this.coffeebreaks);
    var event = {
      value: this.selectedAdditionalFilter
    }

    this.onFilterChange(event);


    let date, from, to, maxp, location, type, topics;
    topics = new Array<string>();

    if (
      filtersFormGroupValues.date &&
      moment(filtersFormGroupValues.date, "DD.MM.YYYY", true).isValid()
    ) {
      date = moment(filtersFormGroupValues.date).format("DD.MM.YYYY");
    } else {
      date = "";
    }
    from = filtersFormGroupValues.from;
    to = filtersFormGroupValues.to;
    if (filtersFormGroupValues.maxp === null) {
      maxp = 5;
    } else {
      maxp = filtersFormGroupValues.maxp;
    }
    location = filtersFormGroupValues.location;
    switch (filtersFormGroupValues.type) {
      case "option1":
        type = "All";
        break;
      case "option2":
        type = "Joined";
        break;
      case "option3":
        type = "Not joined";
        break;
    }
    topics = filtersFormGroupValues.topics;

    // date, from, to, maxp, location, type, topics

    this.coffeebreaksFiltered = this.coffeebreaksFiltered.filter(item => {
      const startdate = new Date(item.startAt).toLocaleDateString(
        "de-DE",
        this.options
      );

      if (startdate === date || date === "") {
        // Start time Input
        let splitstartTime;
        if (from != "") splitstartTime = from.split(":");
        else splitstartTime = "00:00".split(":");
        let newtime = splitstartTime[0] + splitstartTime[1];
        let newstarttimeinint = +newtime;
        newstarttimeinint = parseInt(newtime, 10);

        // End time Input
        let splitendTime;
        if (to != "") splitendTime = to.split(":");
        else splitendTime = "24:00".split(":");
        let newendtime = splitendTime[0] + splitendTime[1];
        let newendtimeinint = +newendtime;
        newendtimeinint = parseInt(newendtime, 10);

        // Start time Item
        if (item.startTime.startsWith("0"))
          item.startTime.substring(1, item.startTime.length);
        let splititemstarttime = item.startTime.split(":");
        let newsplititemstarttime =
          splititemstarttime[0] + splititemstarttime[1];
        let newsplititemstartinint = +newsplititemstarttime;
        newsplititemstartinint = parseInt(newsplititemstarttime, 10);

        // End time Item
        let newsplititemendinint;
        if (item.endTime != null) {
          if (item.endTime.startsWith("0")) {
            item.endTime.substring(1, item.endTime.length);
          }
          let splititemendtime = item.endTime.split(":");
          let newsplititemendtime = splititemendtime[0] + splititemendtime[1];
          newsplititemendinint = +newsplititemendtime;
          newsplititemendinint = parseInt(newsplititemendtime, 10);
        }

        if (
          newsplititemstartinint >= newstarttimeinint &&
          newsplititemendinint <= newendtimeinint &&
          newsplititemstartinint <= newendtimeinint
        ) {
          if (item.maxParticipants <= maxp || maxp === "") {
            // Teilnehmer kleiner oder gleich
            if (
              item.venue
                .trim()
                .toLowerCase()
                .includes(location.trim().toLowerCase()) ||
              location === ""
            ) {
              // Location passt

              if (type === "All") {
                if (topics && topics.length > 0) {
                  for (let i = 0; i < topics.length; i++) {
                    for (let j = 0; j < item.tags.length; j++) {
                      if (item.tags[j].name === topics[i].name) {
                        // Ich habe einen Tag der der Suche entspricht
                        return true;
                      } else if (i == topics.length - 1) {
                        return false;
                      }
                    }
                  }
                } else {
                  return true;
                }
              } else if (type === "Joined") {
                if (item.users.find(user => user.id === this.currentUser.id)) {
                  // In dieser Coffeebreak bin ich gejoined
                  if (topics && topics.length > 0) {
                    for (let i = 0; i < topics.length; i++) {
                      for (let j = 0; j < item.tags.length; j++) {
                        if (item.tags[j].name === topics[i].name) {
                          // Ich habe einen Tag der der Suche entspricht
                          return true;
                        } else if (i == topics.length - 1) {
                          return false;
                        }
                      }
                    }
                  } else {
                    return true;
                  }
                } else {
                  return false;
                }
              } else {
                // Case Not joined
                if (!item.users.find(user => user.id === this.currentUser.id)) {
                  // In dieser Coffeebreak bin ich nicht gejoined
                  if (topics != "" && topics.length > 0) {
                    for (let i = 0; i < topics.length; i++) {
                      for (let j = 0; j < item.tags.length; j++) {
                        if (item.tags[j].name === topics[i].name) {
                          // Ich habe einen Tag der der Suche entspricht
                          return true;
                        } else if (i == topics.length - 1) {
                          return false;
                        }
                      }
                    }
                  } else {
                    return true;
                  }
                }
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    
  }

  /**
   * Resets all filters
   */
  clearFilters() {
    this.clearCoffeebreaksList(this.coffeebreaksFiltered);
    this.coffeebreaksFiltered.push(...this.coffeebreaks);
    this.resetFilterFormValues();
    this.selectedAdditionalFilter = "option1";
    this.sortListByDate(1);
  }

  /**
   * Clears the coffeebreaks list and deletes all elements in it
   * @param list the coffeebreak list
   */
  clearCoffeebreaksList(list: Coffeebreak[]) {
    list.length = 0;
  }

  // sortListByDateAll()
  // {
  //   console.log("Bin in sortListByDateAll");
  //   this.clearCoffeebreaksList(this.coffeebreaksFiltered);
  //   this.coffeebreaksFiltered.push(...this.coffeebreaks);
  //   let sortedCoffeebreaks = new Array<Coffeebreak>(
  //     ...this.coffeebreaksFiltered
  //   );
  //     for (let i = 0; i < sortedCoffeebreaks.length - 1; i++) {
  //       sortedCoffeebreaks.sort((a, b) => {
  //         let result = moment(a.startAt).isAfter(moment(b.startAt));
  //         if (result) return -1;
  //         else return 1;
  //       });
  //     }

  //     this.coffeebreaksFiltered = sortedCoffeebreaks;
  //     console.log(this.coffeebreaksFiltered);
  // }

  /**
   * Sorts the coffeebreak list
   */
  sortListByDate(upcoming: number) {
    this.clearCoffeebreaksList(this.coffeebreaksFiltered);
    this.coffeebreaksFiltered.push(...this.coffeebreaks);
    let sortedCoffeebreaks = new Array<Coffeebreak>(
      ...this.coffeebreaksFiltered
    );
      for (let i = 0; i < sortedCoffeebreaks.length - 1; i++) {
        sortedCoffeebreaks.sort((a, b) => {
          let result = moment(a.startAt).isAfter(moment(b.startAt));
          if (upcoming == 1)
          {
            if (result) return 1;
            else return -1;
          }
          else if (upcoming == 0)
          {
            if (result) return -1;
            else return 1;
          }
          else
          {
            if (result) return -1;
            else return 1;
          }
        });
      }

    this.coffeebreaksFiltered = sortedCoffeebreaks;
    console.log("Coffeebreaks nach Sortierung");
    console.log(this.coffeebreaksFiltered);
    if (upcoming == 1) {
      console.log("Upcoming true");
      this.coffeebreaksFiltered = this.coffeebreaksFiltered.filter(item => {
        // console.log("Upcoming is: " + moment(item.startAt).isAfter(moment(this.dateOfToday)));
        // console.log(moment(item.startAt), moment(this.dateOfToday));
        return moment(item.startAt).isAfter(moment(this.dateOfToday));
      });
    } else if (upcoming == 0) {
      console.log("Upcoming false");
      this.coffeebreaksFiltered = this.coffeebreaksFiltered.filter(item => {
        // console.log("Gone is: " + moment(this.dateOfToday).isAfter(moment(item.startAt)));
        // console.log(moment(this.dateOfToday), moment(item.startAt));
        return moment(this.dateOfToday).isAfter(moment(item.startAt));
      });
    } else {
      console.log("Upcoming was 2");
    }
    console.log("Breaks Nach Filterung");
    console.log(this.coffeebreaksFiltered);
  }

  checkIfDeprecated(endtime: Date) {
    if (moment(endtime).isBefore(moment(this.dateOfToday))) return true;
    else return false;
  }

  /**
   * Decides which user icon to take for coffeebreak user
   * @param coffeebreak the current coffeebreak in list
   * @param index the index of the coffeebreak users array
   */
  setListItemUserIconClass(coffeebreak: Coffeebreak, index: number) {
    if (index < coffeebreak.users.length) {
      if (coffeebreak.users[index].id === this.authService.currentUser.id) {
        return "solidUserIcon";
      } else {
        return "regularUserIcon";
      }
    } else {
      return "blankUserIcon";
    }
  }
}
