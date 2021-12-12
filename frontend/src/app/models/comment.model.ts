export interface Comment {
  id: string,
  content: string,
  author: string,
  replies: Array<Comment>
}
