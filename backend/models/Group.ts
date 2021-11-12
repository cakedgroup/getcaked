export class Group {
    groupId: Uuid
    groupName: string
    type: GroupType
    admin: User

    constructor(groupId: Uuid, groupName: string, type:GroupType, admin: User) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.type = type;
        this.admin = admin;
    }
}

enum GroupType {
    PUBLIC_GROUP = 'public',
    PRIVATE_GROUP = 'private',
    PRIVATE_INVISIBLE_GROUP = 'privateInvisible'
}