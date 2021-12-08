import {Component, Input, OnInit} from '@angular/core';
import {CakeEvent} from '../../../models/cake.model';
import {GroupService} from '../../../core/services/group.service';
import {Group} from '../../../models/group.model';

@Component({
  selector: 'app-cakechip-user',
  templateUrl: './cakechip.component.html',
  styleUrls: ['./cakechip.component.css']
})
export class CakechipComponent implements OnInit {

  @Input() cakeEvent: CakeEvent;
  groupName: string = 'unknown group';

  constructor(
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    this.groupService.getGroup(this.cakeEvent.groupId).subscribe( (group: Group) => {
        this.groupName = group.groupName;
      }
    )
  }

}

