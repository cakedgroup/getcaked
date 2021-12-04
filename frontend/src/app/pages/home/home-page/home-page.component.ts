import { Component, OnInit } from '@angular/core';
import { GroupServiceService as GroupService } from 'src/app/core/services/group.service';
import { Group } from 'src/app/models/group.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  groups: Group[] = [];
  displayGroups: Group[] = [];

  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    this.groupService.listGroups().subscribe((groups: Group[]) => {
      this.displayGroups = groups;
      this.groups = this.displayGroups;
    })
  }

  search(searchQuery: string) {
    this.displayGroups = this.groups.filter((group: Group) => {
      return group.groupName.includes(searchQuery);
    })
  }
}
