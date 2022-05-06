import Base from"./Base";

class Comment extends Base{
  
  static tableName = "comments"
  
  _id?: string
  post_id: string
  user_id: string
  text: string
  created_at: string
  parent_id: string | null
  reply: null
  
  constructor({ _id="", post_id, user_id, text, created_at, parent_id = null }) {
    super(Comment.tableName)
    this.post_id = post_id;
    this.user_id = user_id;
    this._id = ""
    this.text = text
    this.created_at = created_at
    this.parent_id = parent_id
    this.reply = null
  }
}

export default Comment