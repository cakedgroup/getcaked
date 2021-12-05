export interface CakeEvent {
    cakeId: string,
    timeStamp: Date,
    cakeVictimId: string | undefined,
    username: string | undefined,
    cakeDelivered: boolean,
    groupId: string,
    gameId: string
}
