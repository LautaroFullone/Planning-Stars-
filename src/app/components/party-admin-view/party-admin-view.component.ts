import { Component, Input, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Player } from 'src/app/models/player';
import { User } from 'src/app/models/user';
import { UserStory } from 'src/app/models/user-story';
import { PartyService } from 'src/app/services/party.service';

@Component({
  selector: 'app-party-admin-view',
  templateUrl: './party-admin-view.component.html',
  styleUrls: ['./party-admin-view.component.css']
})
export class PartyAdminViewComponent implements OnInit {

  @Input() partyID: string;
  
  selectedUS: UserStory;


  constructor() { }

  ngOnInit(): void { }

  handleSelectedUS(event){
    console.log("ADMIN-> "+event);
    this.selectedUS = event;

  }

}
