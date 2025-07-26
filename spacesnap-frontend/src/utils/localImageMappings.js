const localImageMappings = {
  styleRooms: {
    modern: '/quiz/room-modern.svg',
    bohemian: '/quiz/room-bohemian.svg',
    traditional: '/quiz/room-traditional.svg',
    scandinavian: '/quiz/room-scandinavian.svg',
    minimalist: '/styles/minimalist.svg',
    industrial: '/styles/industrial.svg',
    transitional: '/styles/transitional.svg',
    eclectic: '/styles/eclectic.svg',
    classical: '/styles/classical.svg',
    maximalist: '/styles/maximalist.svg'
  },
  colorPalettes: {
    neutral: '/quiz/palette-neutral.svg',
    warm: '/quiz/palette-warm.svg',
    cool: '/quiz/palette-cool.svg',
    vibrant: '/quiz/palette-vibrant.svg'
  },
  textures: {
    smooth: '/quiz/texture-smooth.svg',
    natural: '/quiz/texture-natural.svg',
    mixed: '/quiz/texture-mixed.svg',
    luxurious: '/quiz/texture-luxurious.svg'
  },
  artStyles: {
    nature: '/quiz/art-nature.svg',
    abstract: '/quiz/art-abstract.svg',
    classical: '/quiz/art-classical.svg',
    eclectic: '/quiz/art-eclectic.svg'
  },
  furnitureStyles: {
    modern: '/quiz/furniture-modern.svg',
    vintage: '/quiz/furniture-vintage.svg',
    classic: '/quiz/furniture-classic.svg',
    scandinavian: '/quiz/furniture-scandinavian.svg'
  }
};

export const getLocalImageForAnswer = (questionType, answerId) => {
  switch(questionType) {
    case 'style_preference':
    case 'room_style':
      return localImageMappings.styleRooms[answerId];
    case 'color_palette':
      return localImageMappings.colorPalettes[answerId];
    case 'texture_preference':
      return localImageMappings.textures[answerId];
    case 'art_preference':
      return localImageMappings.artStyles[answerId];
    case 'furniture_preference':
      return localImageMappings.furnitureStyles[answerId];
    default:
      return null;
  }
};

export default localImageMappings;