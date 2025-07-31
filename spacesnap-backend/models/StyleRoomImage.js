const mongoose = require('mongoose');

const styleRoomImageSchema = new mongoose.Schema({
  style: {
    type: String,
    required: true,
    index: true
  },
  roomType: {
    type: String,
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    originalFileName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }
});

// Compound index for efficient style + room queries
styleRoomImageSchema.index({ style: 1, roomType: 1 });

// Static method to get room images for a specific style
styleRoomImageSchema.statics.getRoomImagesForStyle = async function(style) {
  return this.find({ style: style.toLowerCase(), isActive: true });
};

// Static method to get specific room image
styleRoomImageSchema.statics.getRoomImage = async function(style, roomType) {
  return this.findOne({ 
    style: style.toLowerCase(), 
    roomType: roomType.toLowerCase(),
    isActive: true 
  });
};

module.exports = mongoose.model('StyleRoomImage', styleRoomImageSchema);