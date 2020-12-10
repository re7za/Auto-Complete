export interface IFakeData {
  volumeInfo?: {
    title?: string;
  };
}

export interface AutoCompleteProps {
  chosens: string[];
  setChosens: any;
  multiple: boolean;
}
