// src/data/designData.js

// --- FINAL, CORRECTED LOCAL IMAGE IMPORTS ---
// This code now imports every image from its exact location and with its correct name and extension.
// There are NO sub-folders in the paths.





import darkWoodPattern1 from "../assets/images/floors/dark wood1.jpg";
import darkWoodPattern2 from "../assets/images/floors/dark wood2.jpg";
import darkWoodPattern3 from "../assets/images/floors/dark wood3.jpg";
import darkWoodPattern4 from "../assets/images/floors/dark wood4.png";
import darkWoodPattern5 from "../assets/images/floors/dark wood5.jpg";
import darkWoodPattern6 from "../assets/images/floors/dark wood6.jpg";
import darkWoodPattern8 from "../assets/images/floors/dark wood8.jpg";
import darkWoodPattern9 from "../assets/images/floors/dark wood9.jpg";
import darkWoodPattern10 from "../assets/images/floors/dark wood10.jpg";
import darkWoodPattern11 from "../assets/images/floors/dark wood11.jpg";
import darkWoodPattern12 from "../assets/images/floors/dark wood12.jpg";
import darkWoodPattern13 from "../assets/images/floors/dark wood13.jpg";
import lightWoodPattern1 from "../assets/images/floors/light wood1.jpg";
import lightWoodPattern2 from "../assets/images/floors/light wood2.jpg";
import lightWoodPattern3 from "../assets/images/floors/light wood3.jpg";
import lightWoodPattern4 from "../assets/images/floors/light wood4.jpg";
import lightWoodPattern5 from "../assets/images/floors/light wood5.jpg";
import lightWoodPattern6 from "../assets/images/floors/light wood6.jpg";
import lightWoodPattern7 from "../assets/images/floors/light wood7.jpg";
import lightWoodPattern9 from "../assets/images/floors/light wood9.jpg";
import lightWoodPattern10 from "../assets/images/floors/light wood10.jpg";
import lightWoodPattern11 from "../assets/images/floors/light wood11.jpg";
import lightWoodPattern12 from "../assets/images/floors/light wood12.jpg";
import lightWoodPattern13 from "../assets/images/floors/light wood13.jpg";
import marbleTilePattern10 from "../assets/images/floors/marble tile10.jpg"; 
import marbleTilePattern1 from "../assets/images/floors/marble tile1.png";
import marbleTilePattern2 from "../assets/images/floors/marble tile2.jpg";
import marbleTilePattern3 from "../assets/images/floors/marble tile3.jpg";
import marbleTilePattern4 from "../assets/images/floors/marble tile4.jpg";
import marbleTilePattern5 from "../assets/images/floors/marble tile5.jpg";
import marbleTilePattern6 from "../assets/images/floors/marble tile6.png";
import marbleTilePattern7 from "../assets/images/floors/marble tile7.png";
import marbleTilePattern8 from "../assets/images/floors/marble tile8.png";
import marbleTilePattern9 from "../assets/images/floors/marble tile9.png";
import ceilingFanImg1 from "../assets/images/objects/ceiling objects/ceiling fan1.png"; 
import ceilingFanImg2 from "../assets/images/objects/ceiling objects/ceiling fan2.png"; 
import ceilingFanImg3 from "../assets/images/objects/ceiling objects/ceiling fan3.png"; 
import ceilingFanImg4 from "../assets/images/objects/ceiling objects/ceiling fan4.png"; 
import ceilingFanImg5 from "../assets/images/objects/ceiling objects/ceiling fan5.png"; 
import ceilingFanImg6 from "../assets/images/objects/ceiling objects/ceiling fan6.png"; 
import pendantLightImg1 from "../assets/images/objects/ceiling objects/pendant light1.png";
import pendantLightImg2 from "../assets/images/objects/ceiling objects/pendant light2.png";
import pendantLightImg3 from "../assets/images/objects/ceiling objects/pendant light3.png";
import pendantLightImg4 from "../assets/images/objects/ceiling objects/pendant light4.png";
import pendantLightImg5 from "../assets/images/objects/ceiling objects/pendant light5.png";
import pendantLightImg6 from "../assets/images/objects/ceiling objects/pendant light6.png";
import pendantLightImg7 from "../assets/images/objects/ceiling objects/pendant light7.png";
import plantImg1 from "../assets/images/objects/floor objects/plant1.png";
import plantImg2 from "../assets/images/objects/floor objects/plant2.png";
import plantImg3 from "../assets/images/objects/floor objects/plant3.png";
import plantImg4 from "../assets/images/objects/floor objects/plant4.png";
import plantImg5 from "../assets/images/objects/floor objects/plant5.png";
import plantImg6 from "../assets/images/objects/floor objects/plant6.png";
import plantImg7 from "../assets/images/objects/floor objects/plant7.png";
import plantImg8 from "../assets/images/objects/floor objects/plant8.png";
import sofaImg1 from "../assets/images/objects/floor objects/sofa1.png";
import sofaImg2 from "../assets/images/objects/floor objects/sofa2.png";
import sofaImg3 from "../assets/images/objects/floor objects/sofa3.png";
import sofaImg4 from "../assets/images/objects/floor objects/sofa4.png";
import sofaImg5 from "../assets/images/objects/floor objects/sofa5.png";
import sofaImg6 from "../assets/images/objects/floor objects/sofa6.png";
import sofaImg7 from "../assets/images/objects/floor objects/sofa7.png";
import wallClockImg1 from "../assets/images/objects/wall objects/clock1.png";
import wallClockImg2 from "../assets/images/objects/wall objects/clock2.png";
import wallClockImg3 from "../assets/images/objects/wall objects/clock3.png";
import wallClockImg4 from "../assets/images/objects/wall objects/clock4.png";
import wallClockImg5 from "../assets/images/objects/wall objects/clock5.png";
import wallClockImg6 from "../assets/images/objects/wall objects/clock6.png";
import frameImg1 from "../assets/images/objects/wall objects/frame1.png"; 
import frameImg2 from "../assets/images/objects/wall objects/frame2.png"; 
import frameImg3 from "../assets/images/objects/wall objects/frame3.png"; 
import frameImg4 from "../assets/images/objects/wall objects/frame4.png"; 
import frameImg5 from "../assets/images/objects/wall objects/frame5.png"; 
import frameImg6 from "../assets/images/objects/wall objects/frame6.png"; 
import frameImg7 from "../assets/images/objects/wall objects/frame7.png"; 
import frameImg8 from "../assets/images/objects/wall objects/frame8.png"; 

// --- WALLS ---
export const wallColorPalettes = {
    modern: ['#FFFFFF', '#2F3B4E', '#8D93A1', '#EAEAEA'],
    minimalist: ['#F5F5F5', '#DDDDDD', '#333333', '#A9A9A9'],
    bohemian: ['#DCC9B6', '#6B7A6A', '#C87D5A', '#F2E4D5'],
    industrial: ['#424242', '#BDBDBD', '#757575', '#CF5C36'],
    default: ['#FFFFFF', '#F0F0F0', '#CCCCCC', '#AAAAAA'],
};

// --- CEILINGS ---
export const ceilingColorPalettes = {
    default: ['#FFFFFF', '#F5F5F5', '#E8E8E8', '#DCDCDC'],
};

// --- FLOORS (Now using the correct imported images) ---
export const floorPatterns = [
  { id: "floor03", name: "Marble Tile", image: marbleTilePattern10 },
  { id: "floor04", name: "Dark Wood1", image: darkWoodPattern1 },
  { id: "floor05", name: "Dark Wood2", image: darkWoodPattern2 },
  { id: "floor06", name: "Dark Wood3", image: darkWoodPattern3 },
  { id: "floor07", name: "Dark Wood4", image: darkWoodPattern4 },
  { id: "floor08", name: "Dark Wood5", image: darkWoodPattern5 },
  { id: "floor08", name: "Dark Wood6", image: darkWoodPattern6 },
  { id: "floor10", name: "Dark Wood8", image: darkWoodPattern8 },
  { id: "floor11", name: "Dark Wood9", image: darkWoodPattern9 },
  { id: "floor12", name: "Dark Wood10", image: darkWoodPattern10 },
  { id: "floor13", name: "Dark Wood11", image: darkWoodPattern11 },
  { id: "floor14", name: "Dark Wood12", image: darkWoodPattern12 },
  { id: "floor15", name: "Dark Wood13", image: darkWoodPattern13 },
  { id: "floor16", name: "Light Wood1", image: lightWoodPattern1 },
  { id: "floor17", name: "Light Wood2", image: lightWoodPattern2 },
  { id: "floor18", name: "Light Wood3", image: lightWoodPattern3 },
  { id: "floor19", name: "Light Wood4", image: lightWoodPattern4 },
  { id: "floor20", name: "Light Wood5", image: lightWoodPattern5 },
  { id: "floor21", name: "Light Wood6", image: lightWoodPattern6 },
  { id: "floor22", name: "Light Wood7", image: lightWoodPattern7 },
  { id: "floor23", name: "Light Wood9", image: lightWoodPattern9 },
  { id: "floor24", name: "Light Wood10", image: lightWoodPattern10 },
  { id: "floor25", name: "Light Wood11", image: lightWoodPattern11 },
  { id: "floor26", name: "Light Wood12", image: lightWoodPattern12 },
  { id: "floor27", name: "Light Wood13", image: lightWoodPattern13 },
  { id: "floor28", name: "Light Wood14", image: lightWoodPattern1 },
  { id: "floor29", name: "Marble Tile1", image: marbleTilePattern1 },
  { id: "floor30", name: "Marble Tile2", image: marbleTilePattern2 },
  { id: "floor31", name: "Marble Tile3", image: marbleTilePattern3 },
  { id: "floor32", name: "Marble Tile4", image: marbleTilePattern4 },
  { id: "floor33", name: "Marble Tile5", image: marbleTilePattern5 },
  { id: "floor34", name: "Marble Tile6", image: marbleTilePattern6 },
  { id: "floor35", name: "Marble Tile7", image: marbleTilePattern7 },
  { id: "floor36", name: "Marble Tile8", image: marbleTilePattern8 },
  { id: "floor37", name: "Marble Tile9", image: marbleTilePattern9 },
];

// --- PLACEABLE OBJECTS (Now using the correct imported images) ---
export const placeableObjects = {
  wall: [
    
    
    {
      id: "obj_wall_03",
      name: "Modern Wall Clock1",
      image: wallClockImg1,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_04",
      name: "Modern Wall Clock2",
      image: wallClockImg2,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_05",
      name: "Modern Wall Clock3",
      image: wallClockImg3,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_06",
      name: "Modern Wall Clock4",
      image: wallClockImg4,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_07",
      name: "Modern Wall Clock5",
      image: wallClockImg5,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_08",
      name: "Modern Wall Clock6",
      image: wallClockImg6,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_09",
      name: "frame Modern Img1",
      image: frameImg1,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_10",
      name: "Modern_frame_Img2",
      image: frameImg2,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_11",
      name: "Modern_frame_Img3",
      image: frameImg3,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_12",
      name: "Modern_frame_Img4",
      image: frameImg4,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_13",
      name: "Modern_frame_Img5",
      image: frameImg5,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_14",
      name: "Modern_frame_Img6",
      image: frameImg6,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_15",
      name: "Modern_frame_Img7",
      image: frameImg7,
      width: 150,
      height: 120,
    },
    {
      id: "obj_wall_16",
      name: "Modern_frame_Img8",
      image: frameImg8,
      width: 150,
      height: 120,
    },
  ],
  floor: [
    
  
    {
      id: "obj_floor_03",
      name: "House Plant1",
      image: plantImg1,
      width: 80,
      height: 120,
    },
    {
      id: "obj_floor_04",
      name: "House Plant2",
      image: plantImg2,
      width: 80,
      height: 120,
    },
    {
      id: "obj_floor_05",
      name: "House Plant3",
      image: plantImg3,
      width: 80,
      height: 120,
    },
    {
      id: "obj_floor_06",
      name: "House Plant4",
      image: plantImg4,
      width: 80,
      height: 120,
    },
    {
      id: "obj_floor_07",
      name: "House Plant5",
      image: plantImg5,
      width: 80,
      height: 120,
    },
    {
      id: "obj_floor_08",
      name: "House Plant6",
      image: plantImg6,
      width: 80,
      height: 120,
    },
    {
      id: "obj_floor_09",
      name: "House Plant7",
      image: plantImg7,
      width: 80,
      height: 120,
    },
    {
      id: "obj_floor_10",
      name: "House Plant8",
      image: plantImg8,
      width: 80,
      height: 120,
    },
    {
      id: "obj_floor_11",
      name: "Sleek Sofa1",
      image: sofaImg1,
      width: 300,
      height: 150,
    },
    {
      id: "obj_floor_12",
      name: "Sleek Sofa2",
      image: sofaImg2,
      width: 300,
      height: 150,
    },
    {
      id: "obj_floor_13",
      name: "Sleek Sofa3",
      image: sofaImg3,
      width: 300,
      height: 150,
    },
    {
      id: "obj_floor_14",
      name: "Sleek Sofa4",
      image: sofaImg4,
      width: 300,
      height: 150,
    },
    {
      id: "obj_floor_15",
      name: "Sleek Sofa5",
      image: sofaImg5,
      width: 300,
      height: 150,
    },
    {
      id: "obj_floor_01",
      name: "Sleek Sofa6",
      image: sofaImg6,
      width: 300,
      height: 150,
    },
    {
      id: "obj_floor_01",
      name: "Sleek Sofa7",
      image: sofaImg7,
      width: 300,
      height: 150,
    },
  ],
  ceiling: [
    
    
    {
      id: "obj_ceil_03",
      name: "Ceiling Fan1",
      image: ceilingFanImg1,
      width: 150,
      height: 70,
    },
    {
      id: "obj_ceil_04",
      name: "Ceiling Fan2",
      image: ceilingFanImg2,
      width: 150,
      height: 70,
    },
    {
      id: "obj_ceil_05",
      name: "Ceiling Fan3",
      image: ceilingFanImg3,
      width: 150,
      height: 70,
    },
    {
      id: "obj_ceil_06",
      name: "Ceiling Fan4",
      image: ceilingFanImg4,
      width: 150,
      height: 70,
    },
    {
      id: "obj_ceil_07",
      name: "Ceiling Fan5",
      image: ceilingFanImg5,
      width: 150,
      height: 70,
    },
    {
      id: "obj_ceil_08",
      name: "Ceiling Fan6",
      image: ceilingFanImg6,
      width: 150,
      height: 70,
    },
    {
      id: "obj_ceil_09",
      name: "Pendant Light1",
      image: pendantLightImg1,
      width: 80,
      height: 100,
    },
    {
      id: "obj_ceil_10",
      name: "Pendant Light2",
      image: pendantLightImg2,
      width: 80,
      height: 100,
    },
    {
      id: "obj_ceil_11",
      name: "Pendant Light3",
      image: pendantLightImg3,
      width: 80,
      height: 100,
    },
    {
      id: "obj_ceil_12",
      name: "Pendant Light4",
      image: pendantLightImg4,
      width: 80,
      height: 100,
    },
    {
      id: "obj_ceil_13",
      name: "Pendant Light5",
      image: pendantLightImg5,
      width: 80,
      height: 100,
    },
    {
      id: "obj_ceil_14",
      name: "Pendant Light6",
      image: pendantLightImg6,
      width: 80,
      height: 100,
    },
    {
      id: "obj_ceil_15",
      name: "Pendant Light7",
      image: pendantLightImg7,
      width: 80,
      height: 100,
    },
  ],
};