import React, { HTMLAttributes } from "react";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import { useColorMode } from "@chakra-ui/react";

interface Props extends ReactDatePickerProps{
  isClearable?: boolean;
  onChange: (date: Date) => any;
  selectedDate: Date | any;
  showPopperArrow?: boolean;
  name?: string;
}

const DatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  className,
  name,
  ...props
}: Props & HTMLAttributes<HTMLElement>) => {
  const isLight = useColorMode().colorMode === "light"; //you can check what theme you are using right now however you want
  return (
    // if you don't want to use chakra's colors or you just wwant to use the original ones,
    // set className to "light-theme-original" ↓↓↓↓
    <div className={isLight ? "light-theme" : "dark-theme"}>
      <ReactDatePicker
        name={name}
        selected={selectedDate}
        onChange={onChange}
        isClearable={isClearable}
        showPopperArrow={showPopperArrow}
        className="react-datapicker__input-text" //input is white by default and there is no already defined class for it so I created a new one
      />
    </div>
  );
};

export default DatePicker;
