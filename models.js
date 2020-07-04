import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  isActive: Boolean,
}, {
  versionKey: false,
  timestamps: true,
});


const getModel = function (conn) {
  return conn.db.model('User', userSchema);
}
export {
  getModel
};