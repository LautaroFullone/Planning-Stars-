import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { PartyService } from 'src/app/services/party.service';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
    selector: 'app-party-join-modal',
    templateUrl: './party-join-modal.component.html',
    styleUrls: ['./party-join-modal.component.css']
})
export class PartyJoinModalComponent implements OnInit {

    partyForm = new FormGroup({
        id: new FormControl('', [Validators.required]),
    });

    get partyID() { return this.partyForm.get('id').value; }

    constructor(private partyService: PartyService,
                private socketService: SocketWebService,
                private router: Router,
                private toast: NotificationService) {  }

    ngOnInit(): void {
        this.socketService._hasUserAccess.subscribe({ 
            next: (response) => {
                console.log('_hasUserAccess', response);

                let canUserJoin = response.hasAccess;

                if(canUserJoin) {
                    this.router.navigateByUrl(`/party/${this.partyID}`);
                }
                else {
                    this.toast.warningToast({
                        title: "Joining Party Validation",
                        description: response.reason
                    })
                }
                this.partyForm.reset();
            },
            error: (error) => {
                console.log('error', error);
            }
            
        })
    }

    ngSubmit() {
        this.partyService.getPartyByID(this.partyID).subscribe({
            next: (response) => {  
                let partyOwnerID = response.partyOwnerId;
                let actualUserID = sessionStorage.getItem('user-id');
                
                let isOwner = (partyOwnerID == actualUserID) ? true : false;

                this.socketService.joinParty(this.partyID, isOwner);        
            },
            error: (apiError) => {
                this.toast.errorToast({
                    title: 'Party Not Found',
                    description: `The party #${this.partyID} was not found`
                })
                this.partyForm.reset(); 
            }
        })
    }

}
