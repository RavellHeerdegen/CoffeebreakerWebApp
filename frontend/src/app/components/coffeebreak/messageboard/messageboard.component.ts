import { Component, Input, OnInit } from "@angular/core";
import { Message } from "@app/models/message.model";
import { MessageboardService } from "@app/services/messageboard.service";
import { AuthService } from "@app/services/auth.service";
import { CoffeebreakUser } from "@app/models/coffeebreak-user.model";
import { DatePipe } from "@angular/common";
import { Coffeebreak } from "@app/models/coffeebreak.model";
import { Observable, Subscription } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { User } from "@app/models/user.model";

@Component({
  selector: "app-messageboard",
  templateUrl: "./messageboard.component.html",
  styleUrls: ["./messageboard.component.scss"]
})
export class MessageboardComponent implements OnInit {
  // Inputs from parent component
  @Input() coffeebreak: Coffeebreak;
  @Input() events: Observable<void>;
  private eventsSubscription: Subscription;

  // Fields
  messages: Message[];
  messageInput: string;
  coffeebreakId: number;
  private user = new User();

  // Boolean values
  loadedMessages: boolean;

  // Utility Objects
  datePipe: DatePipe;

  constructor(
    private messageboardService: MessageboardService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(() =>
      this.initializeMessages()
    );
    this.user = this.authService.currentUser;
  }

  initializeMessages(): void {
    this.messages = [];
    this.loadedMessages = false;
    this.coffeebreakId = this.coffeebreak.id;
    this.datePipe = new DatePipe("en_US");
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageboardService.getMessages(this.coffeebreakId).subscribe(_res => {
      if (_res.authtoken) {
        localStorage.setItem("authJWT", _res.authtoken);
      }
      this.messages = [];
      const msgs = _res.messages;
      msgs.forEach(msg => {
        this.messages.push(
          new Message(
            msg.message,
            new CoffeebreakUser(
              msg.User.id,
              msg.User.username,
              null,
              null,
              msg.User.profilePicture ? msg.User.profilePicture : null
            ),
            msg.CoffeebreakId,
            this.datePipe.transform(msg.createdAt, "short"),
            this.getTimeIndicatorFromDate(msg.createdAt)
          )
        );
      });
      this.loadedMessages = true;
    });
  }

  postNewMessage(): void {
    const msg = this.messageInput;
    this.messageInput = "";

    let currentUserId = this.authService.currentUser.id;
    if (currentUserId === 0) {
      alert("User is not logged in");
      return;
    }
    this.messageboardService
      .postMessage(
        new Message(
          msg,
          new CoffeebreakUser(
            currentUserId,
            this.authService.currentUser.username
          ),
          this.coffeebreakId
        )
      )
      .subscribe(_res => {
        if (_res.authtoken) {
          localStorage.setItem("authJWT", _res.authtoken);
        }
        this.loadMessages();
      });
  }

  getTimeIndicatorFromDate(postDate: string): string {
    const hours =
      Math.abs(Date.now().valueOf() - new Date(postDate).valueOf()) / 36e5;
    switch (true) {
      case hours < 0.018:
        return "now";
      case hours < 1:
        return Math.ceil(hours * 60) + " minutes ago";
      case hours > 1 && hours < 24:
        return Math.floor(hours) + " hours ago";
      case hours > 24:
        return Math.floor(hours / 24) + " days ago";
    }
  }

  getCurrentUsername() {
    return this.user.username;
  }

  transform(messageId: number) {
    if (
      "profilePicture" in this.messages[messageId]["user"] &&
      this.messages[messageId]["user"]["profilePicture"] != null
    ) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        "data:image/png;base64," +
          this.messages[messageId]["user"]["profilePicture"]
      );
    } else {
      return "assets/img/generic_profile_pic.png";
    }
  }
}
