import React from "react";

const Button = props => {
  console.log(props.style);
  return (
    <button className={props.style} onClick={props.action}>
      {props.title}
    </button>
  );
};

export default Button;
