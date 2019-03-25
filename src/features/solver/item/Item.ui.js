import React from "react";
import { ItemContainer } from "./Item.styles";

const Item = ({ value, original }) => <ItemContainer isCalculated={value && value !== original}>{value}</ItemContainer>;

export default Item;
