import express from "express";
import { Group } from "../models/Group";
import { fetchAllGroupsFromDB } from "../services/groupService";

const router = express.Router();

interface GroupExportFormat {
    groupId: string
    groupName: string
    type: string
}

router.get('/', (req, res) => {
    let groups: Group[] = fetchAllGroupsFromDB();
    let strippedGroups: GroupExportFormat[] = []

    for (let group of groups) {
        strippedGroups.push({
            groupId: group.groupId,
            groupName: group.groupName,
            type: group.type.valueOf()
        });
    }

    res.send(JSON.stringify(strippedGroups));
});

module.exports = router;
