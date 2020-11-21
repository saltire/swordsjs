export type Colour = number[];
export type Gradient = Colour[];

export type Material = {
  name: string,
  materialNames: { [type: string]: string },
  gradient: Gradient,
  gemImage: string,
};

export type Palette = {
  srcGradient: Gradient,
  materials: Material[],
};

export type Descs = {
  [layer: string]: {
    [name: string]: string,
  },
};

export type Part = {
  layer: string,
  name: string,
  path: string,
  desc: string,
};

export type PartsMap = {
  [layer: string]: Part[],
};
