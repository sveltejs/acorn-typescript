import type { ReactNode, Ref } from "react";
import type { CommonProps } from "./types";
export type SlideApi = {
  goToNextSlide: () => void;
  goToPreviousSlide: () => void;
};
export type SlideProps = CommonProps & {
  children: ReactNode;    
  defaultSlide?: number;  
  onSlideChange?: (slide: number) => void;
  ref?: Ref<SlideApi>;
};
declare function SlideProps(props: SlideProps): JSX.Element;
export default SlideProps;