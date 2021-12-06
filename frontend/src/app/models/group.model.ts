export interface Group {
	groupId: string,
	groupName: string,
	type: GroupType,
	adminId: string
}

export enum GroupType {
	PUBLIC_GROUP = 'public',
	PRIVATE_GROUP = 'private',
	PRIVATE_INVISIBLE_GROUP = 'privateInvisible'
}
