declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare interface Window{
  less?: any;
  arco?: any;
  arcoicon?: any;
  lyr?: any;
}

declare interface String{
  replaceAll?: any;
}