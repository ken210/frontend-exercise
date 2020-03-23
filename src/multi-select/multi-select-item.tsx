import React from "react";
import reactStringReplace from "react-string-replace";
import styles from "./styles.module.scss";

export type MultiSelectItemProps = {
  selected: boolean;
  children: string;
  onChange: (item: string) => void;
  search: string;
};

const MultiSelectItem = ({
  selected,
  children,
  onChange,
  search
}: MultiSelectItemProps) => {
  const toggle = () => {
    onChange(children);
  };

  return (
    <label className={styles.item}>
      <input type="checkbox" onChange={toggle} checked={selected} />
      <span className={styles.checkmark} role="button"></span>
      <span>
        {selected
          ? children
          : reactStringReplace(children, search, (match, index) => {
              return <em key={index}>{match}</em>;
            })}
      </span>
    </label>
  );
};

export default MultiSelectItem;
