export interface HtmlElement {
  data: any;
  selectorName: string;
  tag: string;
  class: string;
  style: string;
  subDiv?: Array<subElement>;
}

export interface subElement {
  tag: string;
  class: string;
  loop?: string;
  style: string;
  SubDiv?: Array<subElement>;
  value: boolean;
}
