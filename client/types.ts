export type Descriptions = {
  [layer: string]: string,
};

export type Choices = {
  [index: number]: number,
};

export type Option = {
  gemImage: string,
  materialList: string,
};

export type StoryData = {
  text: string,
  charColour: string,
  optionSets: Option[][],
  image?: string,
  end: boolean,
};
